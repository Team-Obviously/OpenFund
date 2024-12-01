import mongoose, { Document, Schema } from "mongoose";

export interface IDonations extends Document {
  _id: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  userId: Schema.Types.ObjectId;
  amount: number;
}

const donationsSchema = new Schema<IDonations>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
});

export default mongoose.model<IDonations>("Donations", donationsSchema);
