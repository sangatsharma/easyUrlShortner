"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// Define the Click Event schema
const clickEventSchema = new mongoose_1.default.Schema({
    urlId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'easyUrl', required: true },
    visitorId: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }, // Default to current time
    location: { type: String, required: true },
    deviceType: { type: String, required: true },
    externalReferer: { type: String, required: true },
});
// Create a compound unique index on urlId and visitorId to avoid duplicate clicks
clickEventSchema.index({ urlId: 1, visitorId: 1 }, { unique: true });
// Create the model from the schema
const ClickEventModel = mongoose_1.default.model('ClickEvent', clickEventSchema);
exports.default = ClickEventModel;
