import express, { Request, Response } from "express";
import {
  loginHandler,
  logoutHandler,
  signupHandler,
  deactivateHandler,
  verificationHandler,
  validateUserHandler,
  resendOtpHandler,
  findUserHandler,
  resetPasswordHandler,
} from "../controllers/user.controller";
import { validateReferer } from "../middleware/validateReferer";
import { authenticateJWT } from "../middleware/authenticateJWT";

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
  res.send("Welcome to auth service");
});
router.get("/auth", authenticateJWT, validateUserHandler);
router.post("/auth/login", validateReferer, loginHandler);
router.post("/auth/logout", validateReferer, logoutHandler);
router.post("/signup", validateReferer, signupHandler);
router.delete("/auth/deactivate", validateReferer, deactivateHandler);
router.post("/verify/", validateReferer, verificationHandler);
router.post("/resendOtp", validateReferer, resendOtpHandler);
router.post("/auth/reset-password", validateReferer, resetPasswordHandler);
router.post("/find", validateReferer, findUserHandler);
export default router;
