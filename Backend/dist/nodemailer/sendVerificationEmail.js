"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendExpiryEmail = exports.sendOtpEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const emailTemplates_1 = require("./emailTemplates"); // Import the template
// Function to send OTP email
const sendOtpEmail = (email, otp, username, emailType) => __awaiter(void 0, void 0, void 0, function* () {
    // Nodemailer transporter
    const transporter = nodemailer_1.default.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD,
        },
    });
    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: "Your OTP Verification Code",
        html: (0, emailTemplates_1.otpTemplate)(otp, username, emailType),
    };
    try {
        const info = yield transporter.sendMail(mailOptions);
        console.log("OTP email sent successfully!", info);
    }
    catch (error) {
        console.error("Error sending OTP email:", error);
    }
});
exports.sendOtpEmail = sendOtpEmail;
// Function to send OTP email
const sendExpiryEmail = (email, username, url, daysLeft) => __awaiter(void 0, void 0, void 0, function* () {
    // Nodemailer transporter
    const transporter = nodemailer_1.default.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD,
        },
    });
    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: "Link Expiry Notification",
        html: (0, emailTemplates_1.expiryTemplate)(username, url, daysLeft),
    };
    try {
        const info = yield transporter.sendMail(mailOptions);
        console.log("OTP email sent successfully!", info);
    }
    catch (error) {
        console.error("Error sending OTP email:", error);
    }
});
exports.sendExpiryEmail = sendExpiryEmail;
