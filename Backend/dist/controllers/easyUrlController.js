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
const db_model_1 = __importDefault(require("../model/db.model"));
const redisConfig_1 = require("../config/redisConfig");
const redisCache_1 = require("../utils/redisCache");
const createUrl = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { originalUrl } = req.body;
        if (!originalUrl) {
            res.status(400).json({ success: false, error: "Invalid URL." });
        }
        console.log("checking URL if exists in cache:");
        const cachedUrl = yield (0, redisCache_1.getURLFromCache)(originalUrl);
        if (cachedUrl !== "") {
            console.log("URL already exists in cache:", cachedUrl);
            res.status(200).json({ success: true, url: { shortId: cachedUrl } });
            return;
        }
        console.log("URL dont  exists in cache, creating new URL:");
        const shortId = yield (0, generateUniqueId_1.generateUniqueId)();
        const url = yield db_model_1.default.create({ originalUrl, shortId });
        // Cache the new entry in Redis
        (0, redisCache_1.setURLInCache)(shortId, originalUrl);
        res.status(201).json({ success: true, url: url });
    }
    catch (error) {
        console.error("Error creating URL:", error);
        res.status(500).json({ success: false, error: "Failed to create URL." });
    }
});
exports.createUrl = createUrl;
const getAllUrls = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const urls = yield db_model_1.default.find().exec();
        res.status(200).json({ success: true, urls: urls });
    }
    catch (error) {
        res.send("URL not found");
        console.error("Error fetching URLs:", error);
        res.status(500).json({ sucess: false, error: "Failed to fetch URLs." });
    }
});
exports.getAllUrls = getAllUrls;
const getUrl = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // Check Redis cache first
        const cachedUrl = yield (0, redisCache_1.getURLFromCache)(id);
        if (cachedUrl !== "") {
            console.log("getting url from :", cachedUrl);
            res.status(200).redirect(cachedUrl);
            return;
        }
        console.log("URL dont  exists in cache, fetching from DB:");
        const url = yield db_model_1.default.findOne({ shortId: req.params.id });
        if (!url) {
            const referer = req.get("Referer") || "/";
            res.status(404).redirect(`${referer}404`);
            return;
        }
        // Cache the URL in Redis
        (0, redisCache_1.setURLInCache)(url.shortId, url.originalUrl);
        res.status(200).redirect(url.originalUrl);
    }
    catch (error) {
        console.error("Error fetching URL:", error);
        res.status(500).json({ error: "Failed to fetch URL." });
    }
});
exports.getUrl = getUrl;
const deleteUrl = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield db_model_1.default
            .deleteOne({ shortId: req.params.id })
            .exec();
        if (result.deletedCount === 0) {
            res.status(404).json({ success: false, error: "URL not found." });
            return;
        }
        // Remove the URL from Redis cache if it exists
        yield redisConfig_1.redisClient.del(req.params.id).catch((err) => {
            console.error("Failed to delete URL from cache:", err);
        });
        res.status(200).json({ success: true, message: "Successfully deleted." });
    }
    catch (error) {
        console.error("Error deleting URL:", error);
        res.status(500).json({ success: false, error: "Failed to delete URL." });
    }
});
exports.deleteUrl = deleteUrl;
