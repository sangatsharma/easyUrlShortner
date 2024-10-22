import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authenticateJWT = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const encodedToken = req.cookies.token;

    if (!encodedToken) {
      res
        .status(401)
        .json({ success: false, message: "Unauthorized: No token provided" });
      return;
    }

    // Decode the token to get the original JWT
    const token = decodeURIComponent(encodedToken);
    // Verify token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string);
    console.log("Decoded token: ", decodedToken);
    // Attach decoded token to the request (optional, if you need it later)
    res.locals.user = decodedToken;
    // If token is valid, proceed to the next middleware/route handler
    next();
  } catch (error) {
    console.log("Error in authenticating user: ", error);
    res
      .status(401)
      .json({ success: false, message: "Unauthorized: Invalid token" });
    return;
  }
};
