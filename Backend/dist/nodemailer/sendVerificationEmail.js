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
const node_cron_1 = __importDefault(require("node-cron")); // Import node-cron
const db_model_1 = __importDefault(require("../model/db.model")); // your Mongoose model
const user_model_1 = __importDefault(require("../model/user.model"));
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
//todo set 40 to 3 days
// Scheduled task to check for expiring links
node_cron_1.default.schedule("45 10 * * *", () => __awaiter(void 0, void 0, void 0, function* () {
    const today = new Date();
    const expiryDateThreshold = new Date(today.getTime() + 40 * 24 * 60 * 60 * 1000); // 40 days from today
    try {
        const expiringUrls = yield db_model_1.default.find({
            expiryDate: { $lte: expiryDateThreshold },
            // notified: { $ne: true } // only fetch URLs that haven't been notified
        });
        console.log("Expiring URLs:", expiringUrls);
        for (const url of expiringUrls) {
            const daysLeft = Math.round((url.expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
            //todo set 40 to 3 days
            if (daysLeft <= 40) {
                const user = yield user_model_1.default.findById(url.userId);
                if (user) {
                    yield (0, exports.sendExpiryEmail)(user.email, user.name, url.originalUrl, daysLeft);
                    // Update the URL document to mark it as notified
                    yield db_model_1.default.findByIdAndUpdate(url._id, { notified: true });
                }
            }
        }
        console.log("Checked for expiring links and sent notifications where necessary.");
    }
    catch (error) {
        console.error("Error fetching expiring URLs:", error);
    }
}));
