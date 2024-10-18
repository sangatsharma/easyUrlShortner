"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const validateReferer_1 = require("../middleware/validateReferer");
const router = express_1.default.Router();
router.get("/", (req, res) => {
    res.send("Welcome to auth service");
});
router.post("/auth/login", validateReferer_1.validateReferer, userController_1.loginHandler);
router.post("/auth/logout", validateReferer_1.validateReferer, userController_1.logoutHandler);
router.post("/signup", validateReferer_1.validateReferer, userController_1.signupHandler);
router.delete("/auth/deactivate", validateReferer_1.validateReferer, userController_1.deactivateHandler);
router.post("/verify/", validateReferer_1.validateReferer, userController_1.verificationHandler);
router.get("/validate", validateReferer_1.validateReferer, userController_1.validateUserHandler);
router.post("/auth/forgot-password", validateReferer_1.validateReferer, userController_1.forgotPasswordHandler);
exports.default = router;
