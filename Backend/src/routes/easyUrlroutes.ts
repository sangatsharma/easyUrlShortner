import express from "express";
import {
  createUrl,
  getAllUrls,
  getUrl,
  deleteUrl,
} from "../controllers/easyUrlController";
import { validateReferer } from "../middleware/validateReferer";

const router = express.Router();

router.post("/api/shortUrl", createUrl);
router.get("/", (req: express.Request, res: express.Response) => {
  console.log("Received request for home route");
  res.send("Welcome to EasyUrl");
});

router.get("/api/urls/All", getAllUrls);
router.get("/api/getLongUrl/:id",validateReferer, getUrl);
router.delete("/api/shorturl/:id", deleteUrl);

export default router;
