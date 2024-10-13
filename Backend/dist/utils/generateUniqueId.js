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
exports.generateUniqueId = generateUniqueId;
const nanoid_1 = require("nanoid");
const dbmodel_1 = __importDefault(require("../model/dbmodel"));
// Function to generate the initial length for the short ID based on the last entry
function getInitialLength() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const lastUrl = yield dbmodel_1.default.findOne().sort({ _id: -1 }).exec(); // Latest entry
            return lastUrl ? lastUrl.shortId.toString().length : 3; // Default to 3 if no entries
        }
        catch (error) {
            console.error("Error fetching the last URL:", error);
            return 3; // Default to 3 if there's an error
        }
    });
}
/**
 * Generates a unique short ID, increasing length only when collisions occur.
 * @returns {Promise<string>} - A unique short ID.
 */
function generateUniqueId() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let length = yield getInitialLength();
            console.log(`Starting with length: ${length}`);
            let shortId;
            while (true) {
                // Define an alphabet that includes only alphanumeric characters
                const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
                const alphanumericNanoid = (0, nanoid_1.customAlphabet)(alphabet, length); // Length of the ID
                shortId = alphanumericNanoid();
                console.log(`Checking for ID: ${shortId}`);
                const exists = yield dbmodel_1.default.findOne({ shortId }).exec();
                if (!exists) {
                    return shortId; // Found a unique ID
                }
                console.log(`Collision detected for ID: ${shortId}. Increasing length.`);
                length++; // Increase length on collision
            }
        }
        catch (error) {
            console.error("Error generating unique ID:", error);
            throw new Error("Failed to generate a unique short ID."); // Re-throw or handle the error as needed
        }
    });
}
