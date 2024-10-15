import { Request, Response, NextFunction } from "express";

// List of allowed domains
const allowedDomains = [""];

/**
 * Middleware to validate the Referer header.
 */
export const validateReferer = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const referer = req.get("Referer") || ""; // Get the Referer header
  console.log("referer", referer);
  const isValidReferrer = allowedDomains.some((domain) =>
    referer.startsWith(domain)
  );

  if (!isValidReferrer) {
    console.warn(`Unauthorized access attempt from: ${referer}`);
    res.status(403).json({ error: "Unauthorized access" }); // Send a response without returning it
    return; // Stop further processing
  }

  next(); // Proceed to the next middleware or route handler
};
