"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.otpTemplate = void 0;
const otpTemplate = (otp, username) => `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>OTP Verification</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        font-family: 'Arial', sans-serif;
        background-color: #f4f4f4;
      }

      .email-container {
        max-width: 600px;
        margin: 30px auto;
        background-color: #ffffff;
        border-radius: 10px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        overflow: hidden;
      }

      .header {
        background-color: #4c8bf5;
        padding: 20px;
        text-align: center;
        color: #ffffff;
      }

      .header h1 {
        margin: 0;
        font-size: 28px;
      }

      .content {
        padding: 30px;
        text-align: center;
      }

      .content h2 {
        font-size: 24px;
        color: #333333;
      }

      .otp {
        font-size: 32px;
        letter-spacing: 4px;
        font-weight: bold;
        color: #4c8bf5;
        margin: 20px 0;
        background-color: #f0f7ff;
        padding: 10px;
        border-radius: 8px;
        display: inline-block;
      }

      .message {
        font-size: 16px;
        color: #555555;
        margin: 10px 0;
      }

      .info-banner {
        margin-top: 20px;
        background-color: #fff5c4;
        color: #856404;
        padding: 12px 20px;
        border-radius: 5px;
        font-size: 16px;
        display: inline-block;
      }

      .footer {
        background-color: #f4f4f4;
        padding: 15px;
        text-align: center;
        color: #999999;
        font-size: 14px;
      }

      @media (max-width: 600px) {
        .content {
          padding: 20px;
        }

        .header h1 {
          font-size: 24px;
        }

        .otp {
          font-size: 28px;
        }

        .info-banner {
          font-size: 14px;
        }
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <div class="header">
        <h1>Email Verification-EasyUrl</h1>
      </div>
      <div class="content">
        <h2>Hello, ${username}!</h2>
        <p class="message">
          Please use the OTP below to verify your email address and access all features of your account.
        </p>
        <div class="otp">${otp}</div>
        <p class="message">
          This OTP is valid for <strong>10 minutes</strong>. Please do not share it with anyone.
        </p>
        <div class="info-banner">
          <p>Don't wait! Verify now to secure your account.</p>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
      </div>
    </div>
  </body>
</html>
`;
exports.otpTemplate = otpTemplate;
