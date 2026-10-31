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
exports.cronJobUserDeletion = exports.findUserHandler = exports.resendOtpHandler = exports.resetPasswordHandler = exports.validateUserHandler = exports.deactivateHandler = exports.logoutHandler = exports.loginHandler = exports.verificationHandler = exports.otpVerificationHandler = exports.signupHandler = void 0;
const user_model_1 = __importDefault(require("../model/user.model"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const generateVerificationToken_1 = require("../utils/generateVerificationToken");
const generateAndSetCookie_1 = require("../utils/generateAndSetCookie");
const sendVerificationEmail_1 = require("../nodemailer/sendVerificationEmail");
const signupHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    if (!email) {
        res.status(400).json({
            success: false,
            message: "Email is required",
        });
        return;
    }
    try {
        const user = yield user_model_1.default.findOne({ email });
        if (user && user.isEmailVerified) {
            res.status(200).json({ success: false, message: "User already exists" });
            return;
        }
        const emailVerificationToken = (0, generateVerificationToken_1.generateVerificationToken)();
        const emailVerificationTokenExpiry = new Date(new Date().getTime() + 10 * 60 * 1000);
        if (user && !user.isEmailVerified) {
            if (user.emailVerificationTokenExpiry > new Date()) {
                res.status(200).json({ success: true, message: "OTP already sent" });
                return;
            }
            user.emailVerificationToken = emailVerificationToken;
            user.emailVerificationTokenExpiry = emailVerificationTokenExpiry;
            yield user.save();
            yield (0, sendVerificationEmail_1.sendOtpEmail)(email, emailVerificationToken, "User", "verify");
            res.status(200).json({
                success: true,
                message: "Please verify your email.",
            });
            return;
        }
        const newUser = yield user_model_1.default.create({
            email,
            emailVerificationToken,
            emailVerificationTokenExpiry: new Date(new Date().getTime() + 10 * 60 * 1000),
        });
        yield (0, sendVerificationEmail_1.sendOtpEmail)(email, emailVerificationToken, "User", "verify");
        res.status(200).json({
            success: true,
            message: "Please verify your email.",
        });
        return;
    }
    catch (error) {
        console.log("Error in creating user: ", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});
exports.signupHandler = signupHandler;
const otpVerificationHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, otp } = req.body;
    // Validate input
    if (!email || !otp) {
        res.status(400).json({ message: "Email and OTP are required." });
        return;
    }
    try {
        // Find the user by email
        const user = yield user_model_1.default.findOne({ email });
        if (!user) {
            res.status(404).json({ message: "User not found." });
            return;
        }
        // Check if OTP matches and is still valid
        if (user.emailVerificationToken !== otp) {
            res.status(200).json({ success: false, message: "Invalid OTP." });
            return;
        }
        if (user.emailVerificationTokenExpiry < new Date()) {
            res.status(200).json({ success: false, message: "OTP has expired." });
            return;
        }
        res.status(200).json({
            success: true,
            message: "OTP verified successfully",
        });
        return;
    }
    catch (error) {
        console.error("Error verifying OTP:", error);
        res.status(500).json({ message: "Internal Server Error", error: error });
        return;
    }
});
exports.otpVerificationHandler = otpVerificationHandler;
const verificationHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, otp, name } = req.body;
    // Validate input
    if (!email || !otp || !password || !name) {
        res.status(400).json({ message: "All fields are required." });
        return;
    }
    try {
        // Find the user by email
        const user = yield user_model_1.default.findOne({ email });
        if (!user) {
            res.status(404).json({ message: "User not found." });
            return;
        }
        // Check if OTP matches and is still valid
        if (user.emailVerificationToken !== otp) {
            res.status(200).json({ message: "Invalid OTP." });
            return;
        }
        if (user.emailVerificationTokenExpiry < new Date()) {
            res.status(200).json({ message: "OTP has expired." });
            return;
        }
        // Update user's email verification status
        user.isEmailVerified = true;
        user.name = name;
        // Hash the password
        user.password = yield bcryptjs_1.default.hash(password, 10);
        user.emailVerificationToken = null; // Clear the OTP
        user.emailVerificationTokenExpiry = null; // Clear the expiry
        yield user.save();
        yield (0, generateAndSetCookie_1.generateAndSetCookie)(res, user);
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
    }
    catch (error) {
        console.error("Error verifying OTP:", error);
        res.status(500).json({ message: "Internal Server Error", error: error });
        return;
    }
});
exports.verificationHandler = verificationHandler;
const loginHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        res
            .status(200)
            .json({ success: false, message: "Email and password are required" });
        return;
    }
    try {
        const user = yield user_model_1.default.findOne({ email });
        if (!user) {
            res.status(200).json({ success: false, message: "Invalid credentials!" });
            return;
        }
        const isPasswordValid = yield bcryptjs_1.default.compare(password, user.password);
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
        yield (0, generateAndSetCookie_1.generateAndSetCookie)(res, user);
        res
            .status(200)
            .json({ success: true, message: "User logged in successfully." });
        return;
    }
    catch (error) {
        console.log("Error in logging in user: ", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});
exports.loginHandler = loginHandler;
const logoutHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Clear the cookie storing authentication/session info
        res.clearCookie("token", {
            httpOnly: true, // Ensures cookie is not accessible via client-side scripts
            secure: true, // Send cookie over HTTPS only in production
            sameSite: "none", // Must match how the cookie was set, or logout won't clear it
            path: "/", // Ensure it covers the entire site
        });
        res.status(200).json({
            success: true,
            message: "User logged out successfully.",
        });
    }
    catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to logout. Please try again.",
        });
    }
});
exports.logoutHandler = logoutHandler;
const deactivateHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // todo implement deactivate user
    res
        .status(200)
        .json({ success: true, message: "User deactivated successfully." });
});
exports.deactivateHandler = deactivateHandler;
const validateUserHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
});
exports.validateUserHandler = validateUserHandler;
const resetPasswordHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        res
            .status(400)
            .json({ success: false, message: "Email and Password is required" });
        return;
    }
    try {
        const user = yield user_model_1.default.findOne({
            email,
        });
        if (!user) {
            res.status(200).json({ success: false, message: "User not found" });
            return;
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        user.password = hashedPassword;
        yield user.save();
        res.status(200).json({
            success: true,
            message: "Password reset successfully",
        });
    }
    catch (error) {
        console.log("Error in forgot password: ", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});
exports.resetPasswordHandler = resetPasswordHandler;
const resendOtpHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, otpType } = req.body;
    if (!email) {
        res.status(200).json({ success: false, message: "Email is required" });
        return;
    }
    try {
        const user = yield user_model_1.default.findOne({ email });
        if (!user) {
            res.status(200).json({ success: false, message: "User not found" });
            return;
        }
        const otp = (0, generateVerificationToken_1.generateVerificationToken)();
        user.emailVerificationToken = otp;
        user.emailVerificationTokenExpiry = new Date(new Date().getTime() + 10 * 60 * 1000);
        yield user.save();
        yield (0, sendVerificationEmail_1.sendOtpEmail)(email, otp, user.name, otpType);
        res.status(200).json({
            success: true,
            message: "OTP sent successfully",
        });
        console.log("OTP sent successfully:", email, otp);
        return;
    }
    catch (error) {
        console.log("Error in resending OTP: ", error);
    }
});
exports.resendOtpHandler = resendOtpHandler;
const findUserHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    if (!email) {
        res.status(200).json({ success: false, message: "Email is required" });
        return;
    }
    try {
        const user = yield user_model_1.default.findOne({ email });
        if (!user) {
            res.status(200).json({ success: false, message: "User not found" });
            return;
        }
        const otp = (0, generateVerificationToken_1.generateVerificationToken)();
        user.emailVerificationToken = otp;
        user.emailVerificationTokenExpiry = new Date(new Date().getTime() + 10 * 60 * 1000);
        yield user.save();
        yield (0, sendVerificationEmail_1.sendOtpEmail)(email, otp, user.name, "reset");
        res.status(200).json({
            success: true,
            message: "OTP sent successfully",
        });
    }
    catch (error) {
        console.log("Error in finding user: ", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});
exports.findUserHandler = findUserHandler;
const cronJobUserDeletion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { task } = req.headers;
    if (task !== "clear-unverified-user") {
        res.status(403).json({ error: "Unauthorized access" });
        return;
    }
    try {
        console.log("Cron job started: Deleting unverified users");
        const expirationTime = new Date();
        expirationTime.setDate(expirationTime.getDate() - 7); // 7 days ago
        const users = yield user_model_1.default.find({
            isEmailVerified: false,
            createdAt: { $lt: expirationTime },
        });
        console.log("Unverified users found: ", users);
        const deletionResults = yield Promise.all(users.map((user) => user_model_1.default.findByIdAndDelete(user._id)));
        console.log(`Deleted ${deletionResults.length} unverified users.`);
        res.status(200).json({
            success: true,
            message: "Unverified users deleted",
            count: deletionResults.length,
        });
        return;
    }
    catch (error) {
        console.log("Error in finding or deleting users: ", error);
        res.status(500).json({ success: false, message: "Internal server error" });
        return;
    }
});
exports.cronJobUserDeletion = cronJobUserDeletion;
