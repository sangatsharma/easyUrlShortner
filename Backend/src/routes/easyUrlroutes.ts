import express, { Request, Response } from "express";
import {
  createUrl,
  getAllUrls,
  getUrl,
  deleteUrl,
} from "../controllers/easyUrlController";
import { validateReferer } from "../middleware/validateReferer";

const router = express.Router();

// Route to create a short URL
router.post("/api/shortUrl", validateReferer, createUrl);

// Home route
router.get("/", (req: Request, res: Response) => {
  console.log("Received request for home route");
  res.send("Welcome to EasyUrl");
});

// Route to get all URLs (secured with validateReferer middleware)
router.get("/api/urls/All", validateReferer, getAllUrls);

// Route to get long URL by ID
router.get("/api/getLongUrl/:id", validateReferer, getUrl);

// Route to delete a short URL by ID
router.delete("/api/shorturl/:id", validateReferer, deleteUrl);

export default router;
