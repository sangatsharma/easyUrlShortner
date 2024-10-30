import express, { Request, Response } from "express";
import userModel from "../model/user.model";
import bcryptjs from "bcryptjs";
import { generateVerificationToken } from "../utils/generateVerificationToken";
import { generateAndSetCookie } from "../utils/generateAndSetCookie";
import { sendOtpEmail } from "../nodemailer/sendVerificationEmail";
import exp from "constants";

export const signupHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email } = req.body;
  if (!email) {
    res.status(400).json({
      success: false,
      message: "Email is required",
    });
    return;
  }
  try {
    const user = await userModel.findOne({ email });
    if (user && user.isEmailVerified) {
      res.status(200).json({ success: false, message: "User already exists" });
      return;
    }
    const emailVerificationToken = generateVerificationToken();
    const emailVerificationTokenExpiry = new Date(
      new Date().getTime() + 10 * 60 * 1000
    );

    if (user && !user.isEmailVerified) {
      if ((user.emailVerificationTokenExpiry as Date) > new Date()) {
        res.status(200).json({ success: true, message: "OTP already sent" });
        return;
      }
      user.emailVerificationToken = emailVerificationToken;
      user.emailVerificationTokenExpiry = emailVerificationTokenExpiry;
      await user.save();
      await sendOtpEmail(email, emailVerificationToken, "User");
      res.status(200).json({
        success: true,
        message: "Please verify your email.",
      });
      return;
    }

    const newUser = await userModel.create({
      email,
      emailVerificationToken,
      emailVerificationTokenExpiry: new Date(
        new Date().getTime() + 10 * 60 * 1000
      ),
    });
    await sendOtpEmail(email, emailVerificationToken, "User");
    res.status(200).json({
      success: true,
      message: "Please verify your email.",
    });
    return;
  } catch (error) {
    console.log("Error in creating user: ", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const otpVerificationHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email, otp } = req.body;

  // Validate input
  if (!email || !otp) {
    res.status(400).json({ message: "Email and OTP are required." });
    return;
  }

  try {
    // Find the user by email
    const user = await userModel.findOne({ email });

    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    // Check if OTP matches and is still valid
    if (user.emailVerificationToken !== otp) {
      res.status(200).json({ success: false, message: "Invalid OTP." });
      return;
    }

    if ((user.emailVerificationTokenExpiry as Date) < new Date()) {
      res.status(200).json({ success: false, message: "OTP has expired." });
      return;
    }
    res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });
    return;
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ message: "Internal Server Error", error: error });
    return;
  }
};

export const verificationHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email, password, otp, name } = req.body;

  // Validate input
  if (!email || !otp || !password || !name) {
    res.status(400).json({ message: "All fields are required." });
    return;
  }

  try {
    // Find the user by email
    const user = await userModel.findOne({ email });

    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    // Check if OTP matches and is still valid
    if (user.emailVerificationToken !== otp) {
      res.status(200).json({ message: "Invalid OTP." });
      return;
    }

    if ((user.emailVerificationTokenExpiry as Date) < new Date()) {
      res.status(200).json({ message: "OTP has expired." });
      return;
    }

    // Update user's email verification status
    user.isEmailVerified = true;
    user.name = name;
    // Hash the password
    user.password = await bcryptjs.hash(password, 10);
    user.emailVerificationToken = null; // Clear the OTP
    user.emailVerificationTokenExpiry = null; // Clear the expiry
    await user.save();
    await generateAndSetCookie(
      res,
      user as {
        _id: string;
        email: string;
        role: string;
        name: string;
      }
    );
    res.status(200).json({
      success: true,
      message: "OTP verified successfully",
      user: {
        email: user.email,
        name: user.name,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
      },
    });
    return;
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ message: "Internal Server Error", error: error });
    return;
  }
};

export const loginHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email, password } = req.body;
  if (!email || !password) {
    res
      .status(200)
      .json({ success: false, message: "Email and password are required" });
    return;
  }
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      res.status(200).json({ success: false, message: "Invalid credentials!" });
      return;
    }
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(200).json({ success: false, message: "Invalid credentials!" });
      return;
    }
    if (!user.isEmailVerified) {
      res.status(200).json({
        success: false,
        message: "Email was not verified. Please signup again.",
      });
      return;
    }
    //jwt token
    await generateAndSetCookie(
      res,
      user as {
        _id: string;
        email: string;
        role: string;
        name: string;
      }
    );
    res
      .status(200)
      .json({ success: true, message: "User logged in successfully." });
    return;
  } catch (error) {
    console.log("Error in logging in user: ", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const logoutHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Clear the cookie storing authentication/session info
    res.clearCookie("token", {
      httpOnly: true, // Ensures cookie is not accessible via client-side scripts
      secure: true, // Send cookie over HTTPS only in production
      sameSite: "lax", // Helps prevent CSRF attacks
      path: "/", // Ensure it covers the entire site
    });

    res.status(200).json({
      success: true,
      message: "User logged out successfully.",
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to logout. Please try again.",
    });
  }
};

export const deactivateHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  // todo implement deactivate user
  res
    .status(200)
    .json({ success: true, message: "User deactivated successfully." });
};

export const validateUserHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const user = res.locals.user;
  if (!user) {
    res.status(400).json({ success: false, message: "User is required" });
    return;
  }
  res.status(200).json({
    success: true,
    message: "User validated successfully.",
    user: {
      email: user.email,
      name: user.name,
      role: user.role,
    },
  });
  return;
};

export const resetPasswordHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email, password } = req.body;
  if (!email || !password) {
    res
      .status(400)
      .json({ success: false, message: "Email and Password is required" });
    return;
  }
  try {
    const user = await userModel.findOne({
      email,
    });
    if (!user) {
      res.status(200).json({ success: false, message: "User not found" });
      return;
    }
    const hashedPassword = await bcryptjs.hash(password, 10);
    user.password = hashedPassword;
    await user.save();
    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.log("Error in forgot password: ", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const resendOtpHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email } = req.body;
  if (!email) {
    res.status(200).json({ success: false, message: "Email is required" });
    return;
  }
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      res.status(200).json({ success: false, message: "User not found" });
      return;
    }
    const otp = generateVerificationToken();
    user.emailVerificationToken = otp;
    user.emailVerificationTokenExpiry = new Date(
      new Date().getTime() + 10 * 60 * 1000
    );
    await user.save();
    await sendOtpEmail(email, otp, user.name);
    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
    console.log("OTP sent successfully:", email, otp);
    return;
  } catch (error) {
    console.log("Error in resending OTP: ", error);
  }
};

export const findUserHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email } = req.body;
  if (!email) {
    res.status(200).json({ success: false, message: "Email is required" });
    return;
  }
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      res.status(200).json({ success: false, message: "User not found" });
      return;
    }
    const otp = generateVerificationToken();
    user.emailVerificationToken = otp;
    user.emailVerificationTokenExpiry = new Date(
      new Date().getTime() + 10 * 60 * 1000
    );
    await user.save();
    await sendOtpEmail(email, otp, user.name);
    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.log("Error in finding user: ", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
