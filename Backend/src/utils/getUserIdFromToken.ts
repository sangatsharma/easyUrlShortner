import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const getUserIdFromToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.cookies.token;
    console.log("Token:", token);
    if (!token) {
      res.locals.user = null;
    } else {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string);
      console.log("Decoded token:", decodedToken);
      res.locals.user = decodedToken;
    }
    next();
  } catch (error) {
    console.log("Error in decoding token.", error);
    res.locals.user = null;
    next();
  }
};
