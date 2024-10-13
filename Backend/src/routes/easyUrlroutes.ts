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
  console.log("Received request for home route");
  res.send("Welcome to EasyUrl");
});

router.get("/test", (req, res) => {
  res.send("Test route works!");
});
router.get("/urls/All", (req, res) => {
  console.log("Received request for all URLs");
  getAllUrls(req, res);
});
router.get("/:id", getUrl);
router.delete("/:id", deleteUrl);

export default router;
