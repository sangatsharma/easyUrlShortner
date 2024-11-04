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
const clickEvent_model_1 = __importDefault(require("../model/clickEvent.model"));
//handler to create short url from long url
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
        let expiryDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000); //3 days from now
        console.log("User:", res.locals.user);
        const userId = res.locals.user ? res.locals.user._id : null;
        if (userId) {
            expiryDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now
        }
        console.log("URL dont  exists in cache, creating new URL:");
        const shortId = yield (0, generateUniqueId_1.generateUniqueId)();
        const url = yield db_model_1.default.create({
            originalUrl,
            shortId,
            userId,
            expiryDate: expiryDate,
        });
        // Cache the new entry in Redis
        (0, redisCache_1.setURLInCache)(shortId, originalUrl);
        res.status(201).json({ success: true, url: url, userId: userId });
        return;
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
        const externalReferer = decodeURIComponent(req.params.externalReferer) || null;
        const location = req.params.location || null;
        console.log("externalReferer:", externalReferer);
        if (location) {
            console.log("city:", location.split("::")[0]);
            console.log("country:", location.split("::")[1]);
        }
        console.log("deviceType", deviceType);
        console.log("visitorId", visitorId);
        let newVisitor = false;
        //check in redis cache
        const clickEventCache = yield (0, redisCache_1.getURLFromCache)(`clickEvent-${id}`);
        if (clickEventCache !== "") {
            const clickEvent = JSON.parse(clickEventCache);
            if (!clickEvent
                .map((event) => event.visitorId)
                .includes(visitorId)) {
                clickEvent.push({
                    urlId: id,
                    externalReferer,
                    location,
                    deviceType,
                    visitorId,
                });
                (0, redisCache_1.setClickEventInCache)(`clickEvent-${id}`, JSON.stringify(clickEvent));
                newVisitor = true;
            }
        }
        else {
            (0, redisCache_1.setClickEventInCache)(`clickEvent-${id}`, JSON.stringify([
                {
                    urlId: id,
                    externalReferer,
                    location,
                    deviceType,
                    visitorId,
                },
            ]));
            // Create a new click event
            const clickEvent = new clickEvent_model_1.default({
                urlId: id,
                externalReferer,
                location,
                deviceType,
                visitorId,
            });
            yield clickEvent.save();
            newVisitor = true;
        }
        if (newVisitor) {
            const url = yield db_model_1.default.findOne({ shortId: id });
            if (url) {
                url.uniqueClicks += 1;
                yield url.save();
                res.status(200).redirect(url.originalUrl);
                const cachedUrl = yield (0, redisCache_1.getURLFromCache)(id);
                (0, redisCache_1.setURLInCache)(url.shortId, url.originalUrl);
                return;
            }
        }
        // Check Redis cache first
        const cachedUrl = yield (0, redisCache_1.getURLFromCache)(id);
        if (cachedUrl !== "") {
            console.log("getting url from :", cachedUrl);
            res.status(200).redirect(cachedUrl);
            return;
        }
        console.log("URL dont  exists in cache, fetching from DB:");
        const url = yield db_model_1.default.findOne({ shortId: id });
        if (!url) {
            const referer = req.get("Referer") || "/";
            console.log("URL not found in DB, redirecting to referer:", referer);
            res.status(404).redirect(`${referer}404`);
            return;
        }
        // Cache the URL in Redis
        (0, redisCache_1.setURLInCache)(url.shortId, url.originalUrl);
        res.status(200).redirect(url.originalUrl);
        return;
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
