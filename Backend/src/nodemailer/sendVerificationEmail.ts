import nodemailer from "nodemailer";
import { expiryTemplate, otpTemplate } from "./emailTemplates"; // Import the template
import cron from "node-cron"; // Import node-cron
import easyUrlModel from "../model/db.model"; // your Mongoose model
import userModel from "../model/user.model";

// Function to send OTP email
export const sendOtpEmail = async (
  email: string,
  otp: string,
  username: string,
  emailType: string
) => {
  // Nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL as string,
      pass: process.env.EMAIL_PASSWORD as string,
    },
  });
  const mailOptions = {
    from: process.env.EMAIL as string,
    to: email,
    subject: "Your OTP Verification Code",
    html: otpTemplate(otp, username, emailType),
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("OTP email sent successfully!", info);
  } catch (error) {
    console.error("Error sending OTP email:", error);
  }
};

// Function to send OTP email
export const sendExpiryEmail = async (
  email: string,
  username: string,
  url: string,
  daysLeft: number
) => {
  // Nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL as string,
      pass: process.env.EMAIL_PASSWORD as string,
    },
  });
  const mailOptions = {
    from: process.env.EMAIL as string,
    to: email,
    subject: "Link Expiry Notification",
    html: expiryTemplate(username, url, daysLeft),
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("OTP email sent successfully!", info);
  } catch (error) {
    console.error("Error sending OTP email:", error);
  }
};

