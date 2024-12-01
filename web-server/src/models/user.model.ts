import mongoose, { Document, Schema } from "mongoose";

// Define the interface for User document
export interface IUser extends Document {
  oktoAuthToken: string;
  oktoRefreshToken: string;
  oktoDeviceToken: string;
  name: string;
  githubUsername: string;
  githubAccessToken?: string;
  lastLogin: Date;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    oktoAuthToken: {
      type: String,
      required: true,
      unique: true,
    },
    oktoRefreshToken: {
      type: String,
      required: true,
    },
    oktoDeviceToken: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    githubUsername: {
      type: String,
      required: true,
    },
    githubAccessToken: {
      type: String,
      required: false,
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model<IUser>("User", userSchema);

export default User;
