import express from "express";
import { createUrl, getAllUrls, getUrl, deleteUrl } from "../controllers/easyUrlController";

const router = express.Router();

router.post("/", createUrl);
router.get("/test",(req:express.Request,res:express.Response)=>{
    console.log("test");
} );
router.get("/", getAllUrls);
router.get("/:id", getUrl);
router.delete("/:id", deleteUrl);

export default router;
