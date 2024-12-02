import mongoose, { Schema, Document } from "mongoose";

export interface IIssue extends Document {
  issueNumber: number;
  title: string;
  amount: number;
  status: "open" | "closed";
  creator: string;
  assignee: string | null;
  repository: string;
  organizationName: string;
  issueUrl: string;
  htmlUrl: string;
  createdAt: Date;
  updatedAt: Date;
  closedBy: string;
}

const IssueSchema: Schema = new Schema({
  issueNumber: { type: Number, required: true },
  title: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ["open", "closed"], default: "open" },
  creator: { type: String, required: true },
  assignee: { type: String, default: null },
  repository: { type: String, required: true },
  organizationName: { type: String, required: true },
  issueUrl: { type: String, required: true },
  htmlUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  closedBy: { type: String, default: null },
});

export const Issue = mongoose.model<IIssue>("Issue", IssueSchema);
