import express, { Request, Response } from "express";
import {
  loginHandler,
  logoutHandler,
  signupHandler,
  deactivateHandler,
  verificationHandler,
  validateUserHandler,
  forgotPasswordHandler,
} from "../controllers/user.controller";
import { validateReferer } from "../middleware/validateReferer";

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
    res.send("Welcome to auth service");
  });
router.post("/auth/login", validateReferer, loginHandler);
router.post("/auth/logout", validateReferer, logoutHandler);
router.post("/signup", validateReferer, signupHandler);
router.delete("/auth/deactivate", validateReferer, deactivateHandler);
router.post("/verify/", validateReferer, verificationHandler);
router.get("/validate", validateReferer, validateUserHandler);
router.post("/auth/forgot-password", validateReferer, forgotPasswordHandler);
export default router;
