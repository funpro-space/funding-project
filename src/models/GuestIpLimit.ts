import mongoose, { Schema } from "mongoose";

export interface IGuestIpLimit {
  _id: string; // IP Address
  count: number;
  resetAt: Date;
}

const GuestIpLimitSchema: Schema = new Schema<IGuestIpLimit>(
  {
    _id: { type: String, required: true },
    count: { type: Number, default: 0 },
    resetAt: { type: Date, required: true },
  },
  { timestamps: true }
);

const model = mongoose.models.GuestIpLimit || mongoose.model<IGuestIpLimit>("GuestIpLimit", GuestIpLimitSchema);
export default model;
