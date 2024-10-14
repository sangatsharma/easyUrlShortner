"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const easyUrlController_1 = require("../controllers/easyUrlController");
const router = express_1.default.Router();
router.post("/", easyUrlController_1.createUrl);
router.get("/", (req, res) => {
    console.log("Received request for home route");
    res.send("Welcome to EasyUrl");
});
router.get("/test", (req, res) => {
    res.send("Test route works!");
});
router.get("/urls/All", (req, res) => {
    console.log("Received request for all URLs");
    (0, easyUrlController_1.getAllUrls)(req, res);
});
router.get("/:id", easyUrlController_1.getUrl);
router.delete("/:id", easyUrlController_1.deleteUrl);
exports.default = router;
