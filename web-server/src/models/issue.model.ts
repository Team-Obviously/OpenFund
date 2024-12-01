import mongoose, { Document, Schema } from "mongoose";
import { IUser } from "./user.model";
import { IDonations } from "./donations.model";
import { IRepository } from "./repository.model";

export interface IIssue extends Document {
  url: string;
  title: string;
  description?: string;
  repositoryId: IRepository;
  contributor: IUser;
  bounty: IDonations;
  isClosed: boolean;
}

const issueSchema = new Schema<IIssue>(
  {
    url: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    repositoryId: {
      type: Schema.Types.ObjectId,
      ref: "Repository",
      required: true,
    },
    contributor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    bounty: {
      type: Number,
      required: true,
    },
    isClosed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Issue = mongoose.model<IIssue>("Issue", issueSchema);

export default Issue;
