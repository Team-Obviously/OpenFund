import mongoose, { Document, Schema } from "mongoose";
import { IUser } from "./user.model";
import { IDonations } from "./donations.model";
import { IIssue } from "./issue.model";
import { IRepository } from "./repository.model";

export interface IOrganisation extends Document {
  name: string;
  description: string;
  url: string;
  repositories: IRepository[];
  owner: IUser;
}

const organisationSchema = new Schema<IOrganisation>(
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
    repositories: {
      type: [Schema.Types.ObjectId],
      ref: "Repository",
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Organisation = mongoose.model<IOrganisation>(
  "Organisation",
  organisationSchema
);

export default Organisation;
