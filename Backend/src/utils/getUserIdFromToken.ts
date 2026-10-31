import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const getUserIdFromToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const encodedToken = req.cookies.token;
    if (!encodedToken) {
      res.locals.user = null;
    } else {
      // Decode the token to get the original JWT
      const token = decodeURIComponent(encodedToken);
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string);
      res.locals.user = decodedToken;
    }
    next();
  } catch (error) {
    console.log("Error in decoding token.", error);
    res.locals.user = null;
    next();
  }
};
