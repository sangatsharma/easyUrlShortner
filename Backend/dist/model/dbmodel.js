"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const urlSchema = new mongoose_1.default.Schema({
    shortId: {
        type: String,
        required: true,
        unique: true,
    },
    originalUrl: { type: String, required: true },
    clicks: { type: Number, required: true, default: 0 },
    createdAt: { type: Date, required: true, default: Date.now },
});
const easyUrlModel = mongoose_1.default.model("easyUrl", urlSchema);
exports.default = easyUrlModel;
