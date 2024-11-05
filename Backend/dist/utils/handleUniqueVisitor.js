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
exports.handleUniqueVisitor = void 0;
const clickEvent_model_1 = __importDefault(require("../model/clickEvent.model"));
const db_model_1 = __importDefault(require("../model/db.model"));
const redisCache_1 = require("./redisCache");
const handleUniqueVisitor = (id, externalReferer, location, deviceType, visitorId) => __awaiter(void 0, void 0, void 0, function* () {
    let newVisitor = true;
    const clickEventCache = yield (0, redisCache_1.getURLFromCache)(`clickEvent-${id}`);
    try {
        if (clickEventCache !== "") {
            const clickEvent = JSON.parse(clickEventCache);
            if (clickEvent
                .map((event) => event.visitorId)
                .includes(visitorId)) {
                newVisitor = false;
            }
            else {
                clickEvent.push({
                    urlId: id,
                    externalReferer,
                    location,
                    deviceType,
                    visitorId,
                });
                (0, redisCache_1.setClickEventInCache)(`clickEvent-${id}`, JSON.stringify(clickEvent));
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
        }
        // if new visitor save to db
        if (newVisitor) {
            const url = yield db_model_1.default.findOne({ shortId: id });
            if (url) {
                const clickEvent = new clickEvent_model_1.default({
                    urlId: url._id,
                    externalReferer,
                    location,
                    deviceType,
                    visitorId,
                });
                try {
                    yield clickEvent.save();
                    url.uniqueClicks += 1;
                }
                catch (error) {
                    console.error("Error saving ClickEvent:", error);
                }
                yield url.save();
                return url;
            }
        }
        return null;
    }
    catch (err) {
        throw new Error("Failed to save ClickEvent or update URL.");
    }
});
exports.handleUniqueVisitor = handleUniqueVisitor;
