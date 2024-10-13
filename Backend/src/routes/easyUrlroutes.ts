import express from "express";
import {
  createUrl,
  getAllUrls,
  getUrl,
  deleteUrl,
} from "../controllers/easyUrlController";

const router = express.Router();

router.post("/", createUrl);
router.get("/", (req: express.Request, res: express.Response) => {
  res.send("Welcome to EasyUrl");
});
router.get("/urls/All", getAllUrls);
router.get("/:id", getUrl);
router.delete("/:id", deleteUrl);

export default router;
