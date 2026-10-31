"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateReferer = void 0;
// List of allowed domains
const allowedDomains = [
    "https://www.easyurl.me",
    "https://easyurl.me",
    "http://localhost:5173",
    "http://localhost:5174",
    "https://easy-url-frontend.vercel.app",
    // Local development
];
/**
 * Middleware to validate the Referer header.
 */
const validateReferer = (req, res, next) => {
    // Get the Referer header
    const referer = req.get("Referer") || "";
    console.log("Referer:", referer);
    // Check if the Referer starts with any of the allowed domains
    const isValidReferrer = allowedDomains.some((domain) => referer.startsWith(domain));
    // If the referer is not valid
    if (!isValidReferrer) {
        console.warn(`Unauthorized access attempt from: ${referer}`);
        res.status(403).json({ error: "Unauthorized access" }); // Send a 403 response
        return; // Stop further processing
    }
    // If valid, proceed to the next middleware or route handler
    next();
};
exports.validateReferer = validateReferer;
