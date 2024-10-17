import mongoose, { Document } from "mongoose";

// Interface defining the structure of the URL documents
interface IUrl extends Document {
  shortId: string;
  originalUrl: string;
  clicks: number;
  createdAt: Date;
  expiryDate: Date;
}

// Define the schema for URLs with indexes on key fields
const urlSchema = new mongoose.Schema<IUrl>({
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
  expiryDate: {
    type: Date,
    required: true,
    default: function () {
      return new Date(Date.now() + 3 * 24 * 60 * 60 * 1000); // 7 days from now
    },
    index: { expireAfterSeconds: 0 }, // TTL index for automatic deletion
  },
});

// Create the model from the schema
const easyUrlModel = mongoose.model<IUrl>("easyUrl", urlSchema);

export default easyUrlModel;
