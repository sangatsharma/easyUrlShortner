import { customAlphabet } from "nanoid";
import easyUrlModel from "../model/dbmodel";

// Define constants for batch size and ID generation
const BATCH_SIZE = 100; // Adjust based on traffic
const DEFAULT_ID_LENGTH = 4;
const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
let idBatch: Set<string> = new Set(); // Stores pre-generated unique IDs

/**
 * Generates a nanoid with the given length.
 * @param length - The length of the nanoid to generate.
 * @returns {string} - A new nanoid.
 */
const generateNanoId = (length: number): string => {
  const alphanumericNanoid = customAlphabet(alphabet, length);
  return alphanumericNanoid();
};

/**
 * Refills the in-memory batch of unique IDs asynchronously.
 * @param length - Length of the IDs to generate.
 */
async function refillIdBatch(length: number) {
  console.log("Refilling ID batch...");
  while (idBatch.size < BATCH_SIZE) {
    const newId = generateNanoId(length);
    const exists = await easyUrlModel.findOne({ shortId: newId }).exec(); // Check DB for collision
    if (!exists) idBatch.add(newId);
  }
  console.log(`ID batch refilled with ${idBatch.size} IDs.`);
}

/**
 * Generates a unique short ID, using pre-generated IDs from memory.
 * If the batch runs low, it triggers an async refill.
 * @returns {Promise<string>} - A unique short ID.
 */
export async function generateUniqueId(): Promise<string> {
  try {
    // If the batch is empty, refill synchronously to avoid failures
    if (idBatch.size === 0) {
      console.warn("ID batch empty. Refilling synchronously...");
      const initialLength = await getInitialLength();
      await refillIdBatch(initialLength);
    }

    // Extract an ID from the batch
    const [uniqueId] = idBatch;
    idBatch.delete(uniqueId); // Remove used ID

    // If the batch is running low, refill in the background
    if (idBatch.size < BATCH_SIZE / 2) {
      const initialLength = await getInitialLength(); // Use current length logic
      refillIdBatch(initialLength); // Refill asynchronously
    }

    return uniqueId;
  } catch (error) {
    console.error("Error generating unique ID:", error);
    throw new Error("Failed to generate a unique short ID.");
  }
}

/**
 * Gets the initial length for the short ID based on the last entry.
 * @returns {Promise<number>} - The length of the short ID.
 */
async function getInitialLength(): Promise<number> {
  try {
    const lastUrl = await easyUrlModel.findOne().sort({ _id: -1 }).exec();
    return lastUrl ? lastUrl.shortId.toString().length : DEFAULT_ID_LENGTH;
  } catch (error) {
    console.error("Error fetching the last URL:", error);
    return DEFAULT_ID_LENGTH;
  }
}
