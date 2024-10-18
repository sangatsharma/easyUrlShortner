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
// Define constants for batch size and ID generation
const BATCH_SIZE = 100; // Adjust based on traffic
const DEFAULT_ID_LENGTH = 4;
const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
let idBatch = new Set(); // Stores pre-generated unique IDs
/**
 * Generates a nanoid with the given length.
 * @param length - The length of the nanoid to generate.
 * @returns {string} - A new nanoid.
 */
const generateNanoId = (length) => {
    const alphanumericNanoid = (0, nanoid_1.customAlphabet)(alphabet, length);
    return alphanumericNanoid();
};
/**
 * Refills the in-memory batch of unique IDs asynchronously.
 * @param length - Length of the IDs to generate.
 */
function refillIdBatch(length) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Refilling ID batch...");
        const idsToGenerate = BATCH_SIZE - idBatch.size;
        try {
            const generatedIds = yield Promise.all(Array.from({ length: idsToGenerate }).map(() => __awaiter(this, void 0, void 0, function* () {
                let newId;
                do {
                    newId = generateNanoId(length);
                } while (yield dbmodel_1.default.findOne({ shortId: newId }).exec());
                return newId;
            })));
            // Add new IDs to the batch
            generatedIds.forEach((id) => idBatch.add(id));
            console.log(`ID batch refilled with ${idBatch.size} IDs.`);
        }
        catch (error) {
            console.error("Error refilling ID batch:", error);
        }
    });
}
/**
 * Generates a unique short ID, using pre-generated IDs from memory.
 * If the batch runs low, it triggers an async refill.
 * @returns {Promise<string>} - A unique short ID.
 */
function generateUniqueId() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // If the batch is empty, refill synchronously to avoid failures
            if (idBatch.size === 0) {
                console.warn("ID batch empty. Refilling synchronously...");
                const initialLength = yield getInitialLength();
                yield refillIdBatch(initialLength);
            }
            // Extract an ID from the batch
            const [uniqueId] = idBatch;
            idBatch.delete(uniqueId); // Remove used ID
            // If the batch is running low, refill in the background
            if (idBatch.size < BATCH_SIZE / 2) {
                const initialLength = yield getInitialLength(); // Use current length logic
                refillIdBatch(initialLength); // Refill asynchronously
            }
            return uniqueId;
        }
        catch (error) {
            console.error("Error generating unique ID:", error);
            throw new Error("Failed to generate a unique short ID.");
        }
    });
}
// /**
//  * Gets the initial length for the short ID based on the last entry.
//  * @returns {Promise<number>} - The length of the short ID.
//  */
function getInitialLength() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const lastUrl = yield dbmodel_1.default.findOne().sort({ _id: -1 }).exec();
            return lastUrl ? lastUrl.shortId.toString().length : DEFAULT_ID_LENGTH;
        }
        catch (error) {
            console.error("Error fetching the last URL:", error);
            return DEFAULT_ID_LENGTH;
        }
    });
}
// Function to generate the initial length for the short ID based on the last entry
// async function getInitialLength(): Promise<number> {
//   try {
//     const lastUrl = await easyUrlModel.findOne().sort({ _id: -1 }).exec(); // Latest entry
//     return lastUrl ? lastUrl.shortId.toString().length : 4; // Default to 3 if no entries
//   } catch (error) {
//     console.error("Error fetching the last URL:", error);
//     return 4; // Default to 3 if there's an error
//   }
// }
// import { customAlphabet } from "nanoid";
/**
 * Generates a unique short ID, increasing length only when collisions occur.
 * @returns {Promise<string>} - A unique short ID.
 */
// export async function generateUniqueId(): Promise<string> {
//   try {
//     let length = 4; // Initial length
//     console.log(`Starting with length: ${length}`);
//     let shortId: string;
//     while (true) {
//       // Define an alphabet that includes only alphanumeric characters
//       const alphabet =
//         "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
//       const alphanumericNanoid = customAlphabet(alphabet, length); // Length of the ID
//       shortId = alphanumericNanoid();
//       console.log(`Checking for ID: ${shortId}`);
//       return shortId; // Found a unique ID
//     }
//   } catch (error) {
//     console.error("Error generating unique ID:", error);
//     throw new Error("Failed to generate a unique short ID."); // Re-throw or handle the error as needed
//   }
// }
