import mongoose, { Document } from "mongoose";

// Interface defining the structure of the URL documents
interface IUrl extends Document {
  shortId: string;
  originalUrl: string;
  uniqueClicks: number;
  createdAt: Date;
  expiryDate: Date;
  userId: mongoose.Schema.Types.ObjectId;
  expiryNotificationSent: boolean;
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
    index: true, // Index on originalUrl for faster searches
  },
  uniqueClicks: {
    type: Number,
    required: true,
    default: 0,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  expiryDate: {
    type: Date,
    required: true,
    index: { expireAfterSeconds: 0 }, // TTL index for automatic deletion
  },
  expiryNotificationSent: {
    type: Boolean,
    required: true,
    default: false,
  },
});

// One short link per URL per owner (anonymous links share userId null), so
// different users can shorten the same URL and each gets their own link
urlSchema.index({ originalUrl: 1, userId: 1 }, { unique: true });

// Create the model from the schema
const easyUrlModel = mongoose.model<IUrl>("easyUrl", urlSchema);

export default easyUrlModel;
