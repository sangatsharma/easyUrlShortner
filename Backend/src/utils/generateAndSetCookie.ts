import jwt from "jsonwebtoken";
import { Response } from "express";
import dotenv from "dotenv";
dotenv.config();

export const generateAndSetCookie = (
  res: Response,
  user: {
    _id: string;
    email: string;
    role: string;
    name: string;
  }
) => {
  const token = jwt.sign(
    { _id: user._id, email: user.email, role: user.role, name: user.name },
    process.env.JWT_SECRET as string,
    {
      expiresIn: "7d",
    }
  ); // Encode the token to ensure it’s URL-safe
  const encodedToken = encodeURIComponent(token);
  res.cookie("token", encodedToken, {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    // secure: (process.env.NODE_ENV as string) === "PROD",
    secure: true,
    httpOnly: true,
    // sameSite: (process.env.NODE_ENV as string) === "PROD" ? "none" : "lax",
    sameSite: "lax",
    path: "/", // cookie will be sent to all routes
    // domain:
    //   (process.env.NODE_ENV as string) === "PROD" ? ".vercel.app" : "localhost",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};
