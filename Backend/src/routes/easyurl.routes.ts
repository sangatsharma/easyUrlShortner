import express, { Request, Response } from "express";
import {
  createUrl,
  getAllUrls,
  getUrl,
  deleteUrl,
  cronJobExpiryNotifier,
} from "../controllers/easyurl.controller";
import { validateReferer } from "../middleware/validateReferer";
import { getUserIdFromToken } from "../utils/getUserIdFromToken";
import { authenticateJWT } from "../middleware/authenticateJWT";

const router = express.Router();

// Route to create a short URL
router.post("/api/shortUrl", validateReferer, getUserIdFromToken, createUrl);

// Home route
router.get("/", (req: Request, res: Response) => {
  console.log("Received request for home route");
  res.send("Welcome to EasyUrl");
});

// Route to get all URLs (secured with validateReferer middleware)
router.get("/api/urls/all", validateReferer,getUserIdFromToken, getAllUrls);

// Route to get long URL by ID
router.get("/api/getLongUrl/:id", validateReferer, getUrl);

// Route to delete a short URL by ID
router.delete("/api/shorturl/:id", validateReferer,authenticateJWT, deleteUrl);

router.get("/notify-expiry", cronJobExpiryNotifier);

export default router;
