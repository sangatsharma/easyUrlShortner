"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const easyUrl_controller_1 = require("../controllers/easyUrl.controller");
const validateReferer_1 = require("../middleware/validateReferer");
const router = express_1.default.Router();
// Route to create a short URL
router.post("/api/shortUrl", validateReferer_1.validateReferer, easyUrl_controller_1.createUrl);
// Home route
router.get("/", (req, res) => {
    console.log("Received request for home route");
    res.send("Welcome to EasyUrl");
});
// Route to get all URLs (secured with validateReferer middleware)
router.get("/api/urls/All", validateReferer_1.validateReferer, easyUrl_controller_1.getAllUrls);
// Route to get long URL by ID
router.get("/api/getLongUrl/:id", validateReferer_1.validateReferer, easyUrl_controller_1.getUrl);
// Route to delete a short URL by ID
router.delete("/api/shorturl/:id", validateReferer_1.validateReferer, easyUrl_controller_1.deleteUrl);
exports.default = router;
