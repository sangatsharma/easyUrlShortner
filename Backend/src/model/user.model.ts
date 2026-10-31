import mongoose, { Document } from "mongoose";

// Interface defining the structure of the URL documents
interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  createdAt: Date;
  role: string;
  isEmailVerified: boolean;
  emailVerificationToken: string | null ;
  emailVerificationTokenExpiry: Date | null;
  passwordResetToken: string | null;
  passwordResetTokenExpiry: Date | null;
  lastLogin: Date;
}

// Define the schema for URLs with indexes on key fields
const userSchema = new mongoose.Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  password: {
    type: String,
  },
  name: {
    type: String,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  role: {
    type: String,
    required: true,
    default: "user",
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  lastLogin: {
    type: Date,
    default: Date.now,
  },
  emailVerificationToken: String,
  emailVerificationTokenExpiry: Date,
  passwordResetToken: String,
  passwordResetTokenExpiry: Date,
},{timestamps: true});

// Create the model from the schema
const userModel = mongoose.model<IUser>("User", userSchema);

export default userModel;
