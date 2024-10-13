import { customAlphabet } from "nanoid";
import easyUrlModel from "../model/dbmodel";

// Function to generate the initial length for the short ID based on the last entry
async function getInitialLength(): Promise<number> {
  try {
    const lastUrl = await easyUrlModel.findOne().sort({ _id: -1 }).exec(); // Latest entry
    return lastUrl ? lastUrl.shortId.toString().length : 3; // Default to 3 if no entries
  } catch (error) {
    console.error("Error fetching the last URL:", error);
    return 3; // Default to 3 if there's an error
  }
}

/**
 * Generates a unique short ID, increasing length only when collisions occur.
 * @returns {Promise<string>} - A unique short ID.
 */
export async function generateUniqueId(): Promise<string> {
  try {
    let length = await getInitialLength();
    console.log(`Starting with length: ${length}`);
    let shortId: string;

    while (true) {
      // Define an alphabet that includes only alphanumeric characters
      const alphabet =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      const alphanumericNanoid = customAlphabet(alphabet, length); // Length of the ID

      shortId = alphanumericNanoid();
      console.log(`Checking for ID: ${shortId}`);

      const exists = await easyUrlModel.findOne({ shortId }).exec();
      if (!exists) {
        return shortId; // Found a unique ID
      }

      console.log(`Collision detected for ID: ${shortId}. Increasing length.`);
      length++; // Increase length on collision
    }
  } catch (error) {
    console.error("Error generating unique ID:", error);
    throw new Error("Failed to generate a unique short ID."); // Re-throw or handle the error as needed
  }
}
