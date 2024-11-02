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
//todo set 40 to 3 days
// Scheduled task to check for expiring links
cron.schedule("45 10 * * *", async () => {
  const today = new Date();
  const expiryDateThreshold = new Date(
    today.getTime() + 40 * 24 * 60 * 60 * 1000
  ); // 40 days from today

  try {
    const expiringUrls = await easyUrlModel.find({
      expiryDate: { $lte: expiryDateThreshold },
      // notified: { $ne: true } // only fetch URLs that haven't been notified
    });

    console.log("Expiring URLs:", expiringUrls);

    for (const url of expiringUrls) {
      const daysLeft = Math.round(
        (url.expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );
//todo set 40 to 3 days
      if (daysLeft <= 40) {
        const user = await userModel.findById(url.userId);
        
        if (user) {
          await sendExpiryEmail(
            user.email,
            user.name,
            url.originalUrl,
            daysLeft
          );

          // Update the URL document to mark it as notified
          await easyUrlModel.findByIdAndUpdate(url._id, { notified: true });
        }
      }
    }

    console.log(
      "Checked for expiring links and sent notifications where necessary."
    );
  } catch (error) {
    console.error("Error fetching expiring URLs:", error);
  }
});

