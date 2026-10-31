import mongoose, { Document } from 'mongoose';

interface IClickEvent extends Document {
  urlId: mongoose.Schema.Types.ObjectId;
  visitorId: string;
  timestamp: Date;
  location: string;
  deviceType: string;
  externalReferer: string;
}

// Define the Click Event schema
const clickEventSchema = new mongoose.Schema<IClickEvent>({
  urlId: { type: mongoose.Schema.Types.ObjectId, ref: 'easyUrl', required: true },
  visitorId: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }, // Default to current time
  location: { type: String, required: true },
  deviceType: { type: String, required: true },
  externalReferer: { type: String, required: true },
});

// Create a compound unique index on urlId and visitorId to avoid duplicate clicks
clickEventSchema.index({ urlId: 1, visitorId: 1 }, { unique: true });

// Create the model from the schema
const ClickEventModel = mongoose.model<IClickEvent>('ClickEvent', clickEventSchema);

export default ClickEventModel;
