import nodemailer from "nodemailer";
import { otpTemplate } from "./emailTemplates"; // Import the template

// Function to send OTP email
export const sendOtpEmail = async (
  email: string,
  otp: string,
  username: string
) => {
  // Nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL as string,
      pass: process.env.EMAIL_PASSWORD as string,
    },
  });
console.log("email",process.env.EMAIL, process.env.EMAIL_PASSWORD);
  const mailOptions = {
    from: process.env.EMAIL as string,
    to: email,
    subject: "Your OTP Verification Code",
    html: otpTemplate(otp, username),
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("OTP email sent successfully!", info);
  } catch (error) {
    console.error("Error sending OTP email:", error);
  }
};
