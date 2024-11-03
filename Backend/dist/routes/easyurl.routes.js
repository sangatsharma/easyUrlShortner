"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const easyurl_controller_1 = require("../controllers/easyurl.controller");
const validateReferer_1 = require("../middleware/validateReferer");
const getUserIdFromToken_1 = require("../utils/getUserIdFromToken");
const authenticateJWT_1 = require("../middleware/authenticateJWT");
const router = express_1.default.Router();
// Route to create a short URL
router.post("/api/shortUrl", validateReferer_1.validateReferer, getUserIdFromToken_1.getUserIdFromToken, easyurl_controller_1.createUrl);
// Home route
router.get("/", (req, res) => {
    console.log("Received request for home route");
    res.send("Welcome to EasyUrl");
});
// Route to get all URLs (secured with validateReferer middleware)
router.get("/api/urls/all", validateReferer_1.validateReferer, getUserIdFromToken_1.getUserIdFromToken, easyurl_controller_1.getAllUrls);
// Route to get long URL by ID
router.get("/api/getLongUrl/:id", validateReferer_1.validateReferer, easyurl_controller_1.getUrl);
// Route to delete a short URL by ID
router.delete("/api/shorturl/:id", validateReferer_1.validateReferer, authenticateJWT_1.authenticateJWT, easyurl_controller_1.deleteUrl);
router.get("/notify-expiry", easyurl_controller_1.cronJobExpiryNotifier);
exports.default = router;
