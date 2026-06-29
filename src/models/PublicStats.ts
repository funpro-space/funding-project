import mongoose, { Schema } from "mongoose";

export interface IPublicStats {
  _id: string; // "global"
  totalChats: number;
  totalInputTokens: number;
  totalOutputTokens: number;
  totalTotalTokens: number;
  totalCostUsd: number;
}

const PublicStatsSchema: Schema = new Schema<IPublicStats>(
  {
    _id: { type: String, required: true, default: "global" },
    totalChats: { type: Number, default: 0 },
    totalInputTokens: { type: Number, default: 0 },
    totalOutputTokens: { type: Number, default: 0 },
    totalTotalTokens: { type: Number, default: 0 },
    totalCostUsd: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const model = mongoose.models.PublicStats || mongoose.model<IPublicStats>("PublicStats", PublicStatsSchema);
export default model;
