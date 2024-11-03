"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// Define the schema for URLs with indexes on key fields
const urlSchema = new mongoose_1.default.Schema({
    shortId: {
        type: String,
        required: true,
        unique: true,
        index: true, // Index on shortId for fast lookups
    },
    originalUrl: {
        type: String,
        unique: true,
        index: true, // Index on originalUrl for faster searches
    },
    clicks: {
        type: Number,
        required: true,
        default: 0,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
    },
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: false },
    expiryDate: {
        type: Date,
        required: true,
        index: { expireAfterSeconds: 0 }, // TTL index for automatic deletion
    },
    expiryNotificationSent: {
        type: Boolean,
        required: true,
        default: false,
    }
});
// Create the model from the schema
const easyUrlModel = mongoose_1.default.model("easyUrl", urlSchema);
exports.default = easyUrlModel;
