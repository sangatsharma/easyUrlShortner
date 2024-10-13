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
    res.send("Welcome to EasyUrl");
});
router.get("/urls/All", easyUrlController_1.getAllUrls);
router.get("/:id", easyUrlController_1.getUrl);
router.delete("/:id", easyUrlController_1.deleteUrl);
exports.default = router;
