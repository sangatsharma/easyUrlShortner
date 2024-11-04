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
Object.defineProperty(exports, "__esModule", { value: true });
exports.setClickEventInCache = exports.setURLInCache = exports.getURLFromCache = void 0;
const redisConfig_1 = require("../config/redisConfig");
const getURLFromCache = (text) => __awaiter(void 0, void 0, void 0, function* () {
    let isRedisReady = (0, redisConfig_1.getRedisStatus)();
    console.log("Redis connected:", isRedisReady);
    if (isRedisReady) {
        const value = yield redisConfig_1.redisClient.get(text);
        if (value) {
            console.log(`Got value: ${value}`);
            return value;
        }
    }
    return "";
});
exports.getURLFromCache = getURLFromCache;
const setURLInCache = (shortId, originalURL) => __awaiter(void 0, void 0, void 0, function* () {
    let isRedisReady = (0, redisConfig_1.getRedisStatus)();
    if (isRedisReady) {
        yield redisConfig_1.redisClient.set(shortId, originalURL, {
            EX: 3600, // Set the expiration time to 3600 seconds
        });
        yield redisConfig_1.redisClient.set(originalURL, shortId, {
            EX: 3600, // Set the expiration time to 3600 seconds
        });
    }
});
exports.setURLInCache = setURLInCache;
const setClickEventInCache = (urlId, clickEvent) => __awaiter(void 0, void 0, void 0, function* () {
    let isRedisReady = (0, redisConfig_1.getRedisStatus)();
    if (isRedisReady) {
        yield redisConfig_1.redisClient.set(urlId, clickEvent, {
            EX: 3600, // Set the expiration time to 3600 seconds
        });
    }
});
exports.setClickEventInCache = setClickEventInCache;
