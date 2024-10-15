"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUrl = exports.getUrl = exports.getAllUrls = exports.createUrl = void 0;
const generateUniqueId_1 = require("../utils/generateUniqueId");
const dbmodel_1 = __importDefault(require("../model/dbmodel"));
const createUrl = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { originalUrl } = req.body;
        if (!originalUrl) {
            res.status(400).json({ error: "Invalid URL." });
        }
        const shortId = yield (0, generateUniqueId_1.generateUniqueId)();
        const url = yield dbmodel_1.default.create({ originalUrl, shortId });
        res.status(201).json({ success: true, url: url });
    }
    catch (error) {
        console.error("Error creating URL:", error);
        res.status(500).json({ error: "Failed to create URL." });
    }
});
exports.createUrl = createUrl;
const getAllUrls = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const urls = yield dbmodel_1.default.find();
        res.status(200).json({ success: true, urls: urls });
    }
    catch (error) {
        res.send("URL not found");
        console.error("Error fetching URLs:", error);
        res.status(500).json({ error: "Failed to fetch URLs." });
    }
});
exports.getAllUrls = getAllUrls;
const getUrl = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const url = yield dbmodel_1.default.findOne({ shortId: req.params.id });
        if (!url) {
            const referer = req.get("Referer") || "";
            res.status(404).redirect(`${referer}404`);
            return;
        }
        res.status(200).redirect(url.originalUrl);
    }
    catch (error) {
        console.error("Error fetching URL:", error);
    }
});
exports.getUrl = getUrl;
const deleteUrl = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield dbmodel_1.default.deleteOne({ shortId: req.params.id });
        if (result.deletedCount === 0) {
            res.status(404).json({ error: "URL not found." });
            return;
        }
        res.status(200).json({ success: true, message: "Successfully deleted." }); // No content in the response body
    }
    catch (error) {
        console.error("Error deleting URL:", error);
        res.status(500).json({ error: "Failed to delete URL." });
    }
});
exports.deleteUrl = deleteUrl;
