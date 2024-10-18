import express, { Request, Response } from "express";
import userModel from "../model/user.model";
import bcryptjs from "bcryptjs";
import { generateVerificationToken } from "../utils/generateVerificationToken";
import { generateAndSetCookie } from "../utils/generateAndSetCookie";
import { sendOtpEmail } from "../nodemailer/sendVerificationEmail";

export const signupHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    res.status(400).json({
      success: false,
      message: "Email, password and name are required",
    });
    return;
  }
  try {
    const user = await userModel.findOne({ email });
    if (user) {
      res.status(400).json({ success: false, message: "User already exists" });
      return;
    }
    // Hash the password
    const hashedPassword = await bcryptjs.hash(password, 10);
    const emailVerificationToken = generateVerificationToken();
    const newUser = await userModel.create({
      email,
      password: hashedPassword,
      name,
      emailVerificationToken,
      emailVerificationTokenExpiry: new Date(
        new Date().getTime() + 10 * 60 * 1000
      ),
    });
    //todo send email verification email
    //jwt token
    generateAndSetCookie(res, newUser._id as string);
    sendOtpEmail(email, emailVerificationToken, name);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        isEmailVerified: newUser.isEmailVerified,
      },
    });
  } catch (error) {
    console.log("Error in creating user: ", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const loginHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email, password } = req.body;
  if (!email || !password) {
    res
      .status(400)
      .json({ success: false, message: "Email and password are required" });
    return;
  }
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }
    if (user.password !== password) {
      res.status(401).json({ success: false, message: "Invalid password!" });
      return;
    }
    res
      .status(200)
      .json({ success: true, message: "User logged in successfully." });
  } catch (error) {
    console.log("Error in logging in user: ", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const logoutHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  //todo implement logout using cookies
  res
    .status(200)
    .json({ success: true, message: "User logged out successfully." });
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
  // todo implement validate user
  res
    .status(200)
    .json({ success: true, message: "User validated successfully." });
};
export const forgotPasswordHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email } = req.body;
  if (!email) {
    res.status(400).json({ success: false, message: "Email is required" });
    return;
  }
  try {
    const user = await userModel.findOne({
      email,
    });
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }
    // todo implement forgot password
    res.status(200).json({
      success: true,
      message: "Password reset link sent to your email.",
    });
  } catch (error) {
    console.log("Error in forgot password: ", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const verificationHandler = async (req: Request, res: Response):Promise<void> => {
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
       res.status(400).json({ message: "Invalid OTP." });
       return;
    }

    if ((user.emailVerificationTokenExpiry as Date) < new Date()) {
       res.status(400).json({ message: "OTP has expired." });
       return;
    }

    // Update user's email verification status
    user.isEmailVerified = true;
    user.emailVerificationToken = null; // Clear the OTP
    user.emailVerificationTokenExpiry = null; // Clear the expiry
    await user.save();

     res.status(200).json({ message: "Email verified successfully." });
     return;
  } catch (error) {
    console.error("Error verifying OTP:", error);
     res
      .status(500)
      .json({ message: "Internal Server Error", error: error });
      return;
  }
};
