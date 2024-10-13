import mongoose from "mongoose";
import { Document } from "mongoose";
interface IUrl extends Document {
  shortId: string; 
  originalUrl: string;
  clicks: number;
  createdAt: Date;
}

const urlSchema = new mongoose.Schema<IUrl>({
  shortId: {
    type: String,
    required: true,
    unique: true,
  },
  originalUrl: { type: String, required: true },
  clicks: { type: Number, required: true, default: 0 },
  createdAt: { type: Date, required: true, default: Date.now },
});

const easyUrlModel = mongoose.model<IUrl>("easyUrl", urlSchema);
export default easyUrlModel;
