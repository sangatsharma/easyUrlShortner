"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const validateReferer_1 = require("../middleware/validateReferer");
const authenticateJWT_1 = require("../middleware/authenticateJWT");
const router = express_1.default.Router();
router.get("/", (req, res) => {
    res.send("Welcome to auth service");
});
router.get("/auth", authenticateJWT_1.authenticateJWT, user_controller_1.validateUserHandler);
router.post("/auth/login", validateReferer_1.validateReferer, user_controller_1.loginHandler);
router.get("/auth/logout", validateReferer_1.validateReferer, user_controller_1.logoutHandler);
router.post("/signup", validateReferer_1.validateReferer, user_controller_1.signupHandler);
router.delete("/auth/deactivate", validateReferer_1.validateReferer, user_controller_1.deactivateHandler);
router.post("/verify", validateReferer_1.validateReferer, user_controller_1.verificationHandler);
router.post("/verifyOtp", validateReferer_1.validateReferer, user_controller_1.otpVerificationHandler);
router.post("/resendOtp", validateReferer_1.validateReferer, user_controller_1.resendOtpHandler);
router.post("/auth/reset-password", validateReferer_1.validateReferer, user_controller_1.resetPasswordHandler);
router.post("/find", validateReferer_1.validateReferer, user_controller_1.findUserHandler);
router.get("/clear-unverified-user", user_controller_1.cronJobUserDeletion);
exports.default = router;
