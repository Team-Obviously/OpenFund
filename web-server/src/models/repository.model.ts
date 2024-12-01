import mongoose, { Document, Schema } from "mongoose";
import { IUser } from "./user.model";
import { IDonations } from "./donations.model";
import { IIssue } from "./issue.model";
import { IOrganisation } from "./organisation.model";

export interface IRepository extends Document {
  name: string;
  description?: string;
  url: string;
  createdAt: Date;
  updatedAt: Date;
  maintainer: IUser;
  organisation: IOrganisation;
  donators: IUser[];
  donations: IDonations[];
  contributors: IUser[];
  issues: IIssue[];
}

const repositorySchema = new Schema<IRepository>(
  {
    name: {
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
    maintainer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    donators: {
      type: [Schema.Types.ObjectId],
      ref: "User",
    },
    issues: {
      type: [Schema.Types.ObjectId],
      ref: "Issue",
    },
  },
  {
    timestamps: true,
  }
);

const Repository = mongoose.model<IRepository>("Repository", repositorySchema);

export default Repository;