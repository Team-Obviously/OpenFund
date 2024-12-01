import mongoose, { Document, Schema } from "mongoose";

export interface IRepository extends Document {
  name: string;
  fullName: string;
  description?: string;
  url: string;
  owner: string;  // GitHub username of the owner
  userId: Schema.Types.ObjectId;  // Reference to our User model
  isPrivate: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const repositorySchema = new Schema<IRepository>(
  {
    name: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    url: {
      type: String,
      required: true,
    },
    owner: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isPrivate: {
      type: Boolean,
      default: false,
    }
  },
  {
    timestamps: true,
  }
);

const Repository = mongoose.model<IRepository>("Repository", repositorySchema);

export default Repository; 