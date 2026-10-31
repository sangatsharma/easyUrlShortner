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
exports.cronJobExpiryNotifier = exports.deleteUrl = exports.getUrl = exports.getAllUrls = exports.createUrl = void 0;
const generateUniqueId_1 = require("../utils/generateUniqueId");
const db_model_1 = __importDefault(require("../model/db.model"));
const redisConfig_1 = require("../config/redisConfig");
const redisCache_1 = require("../utils/redisCache");
const sendVerificationEmail_1 = require("../nodemailer/sendVerificationEmail");
const user_model_1 = __importDefault(require("../model/user.model"));
const handleUniqueVisitor_1 = require("../utils/handleUniqueVisitor");
//handler to create short url from long url
const createUrl = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { originalUrl } = req.body;
        if (!originalUrl) {
            res.status(400).json({ success: false, error: "Invalid URL." });
            return;
        }
        let expiryDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000); //3 days from now
        console.log("User:", res.locals.user);
        const userId = res.locals.user ? res.locals.user._id : null;
        if (userId) {
            expiryDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now
        }
        // Reuse this owner's existing link for the same URL. Checked in MongoDB, not
        // Redis, so it works with the cache down and never returns another user's link
        const existing = yield db_model_1.default.findOne({ originalUrl, userId }).exec();
        if (existing) {
            console.log("URL already shortened by this owner:", existing.shortId);
            res.status(200).json({ success: true, url: existing, userId: userId });
            return;
        }
        const shortId = yield (0, generateUniqueId_1.generateUniqueId)();
        try {
            const url = yield db_model_1.default.create({
                originalUrl,
                shortId,
                userId,
                expiryDate: expiryDate,
            });
            // Cache the new entry in Redis
            (0, redisCache_1.setURLInCache)(shortId, JSON.stringify(url));
            res.status(201).json({ success: true, url: url, userId: userId });
            return;
        }
        catch (error) {
            // Two identical requests raced past the lookup: hand back the winner's link
            if (error.code === 11000) {
                const url = yield db_model_1.default.findOne({ originalUrl, userId }).exec();
                if (url) {
                    res.status(200).json({ success: true, url: url, userId: userId });
                    return;
                }
            }
            throw error;
        }
    }
    catch (error) {
        console.error("Error creating URL:", error);
        res.status(500).json({ success: false, error: "Failed to create URL." });
    }
});
exports.createUrl = createUrl;
//handler to get all urls
const getAllUrls = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = res.locals.user ? res.locals.user._id : null;
    if (!userId) {
        res.status(400).json({ success: false, error: "User not found." });
        return;
    }
    try {
        const urls = yield db_model_1.default.find({ userId: userId }).exec();
        res.status(200).json({ success: true, urls: urls });
        return;
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
        const { id, deviceType, visitorId } = req.params;
        const externalReferer = decodeURIComponent(req.params.externalReferer) || "none";
        const location = req.params.location || "unknown";
        console.log("externalReferer:", externalReferer);
        if (location) {
            console.log("city:", location.split("::")[0]);
            console.log("country:", location.split("::")[1]);
        }
        console.log("deviceType", deviceType);
        console.log("visitorId", visitorId);
        // Check Redis cache first for userId
        const cachedUrl = yield (0, redisCache_1.getURLFromCache)(id);
        const newVisitor = yield (0, handleUniqueVisitor_1.handleUniqueVisitor)(id, externalReferer, location, deviceType, visitorId);
        console.log("cachedUrl:", cachedUrl);
        if (cachedUrl !== "") {
            if (!cachedUrl.userId || !newVisitor) {
                console.log("Redirecting URL found in cache:", cachedUrl.originalUrl);
                res.status(200).redirect(cachedUrl.originalUrl);
                return;
            }
        }
        if (newVisitor) {
            console.log("Redirecting new visitor to URL:", newVisitor.originalUrl);
            res.status(200).redirect(newVisitor.originalUrl);
            return;
        }
        //if cache miss, fetch from db and update cache
        const url = yield db_model_1.default.findOne({ shortId: id });
        console.log("checking URL from DB:");
        if (url) {
            res.status(200).redirect(url.originalUrl);
            (0, redisCache_1.setURLInCache)(url.shortId, JSON.stringify(url));
            return;
        }
        else {
            const referer = req.get("Referer") || "/";
            console.log("URL not found in DB, redirecting to referer:", referer);
            res.status(404).redirect(`${referer}404`);
            return;
        }
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
        return;
    }
    catch (error) {
        console.error("Error deleting URL:", error);
        res.status(500).json({ success: false, error: "Failed to delete URL." });
    }
});
exports.deleteUrl = deleteUrl;
const cronJobExpiryNotifier = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { task } = req.headers;
    console.log("Task:", task);
    if (task !== "notify-expiry") {
        res.status(403).json({ error: "Unauthorized access" });
        return;
    }
    console.log("Cron job started: notify expiry");
    const today = new Date();
    const expiryDateThreshold = new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000); // 3 days from today
    try {
        const expiringUrls = yield db_model_1.default.find({
            expiryDate: { $lte: expiryDateThreshold },
            expiryNotificationSent: { $ne: true }, // only fetch URLs that haven't been notified
        });
        for (const url of expiringUrls) {
            const daysLeft = Math.round((url.expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
            if (daysLeft <= 3) {
                const user = yield user_model_1.default.findById(url.userId);
                if (user) {
                    yield (0, sendVerificationEmail_1.sendExpiryEmail)(user.email, user.name, url.originalUrl, daysLeft);
                    // Update the URL document to mark it as notified
                    yield db_model_1.default.findByIdAndUpdate(url._id, {
                        expiryNotificationSent: true,
                    });
                }
            }
        }
        console.log("Checked for expiring links and sent notifications where necessary.");
        res.status(200).json({
            message: "notify expiry cron job completed",
            count: expiringUrls.length,
        });
        return;
    }
    catch (error) {
        console.error("Error fetching expiring URLs:", error);
    }
});
exports.cronJobExpiryNotifier = cronJobExpiryNotifier;
