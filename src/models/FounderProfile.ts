import mongoose, { Schema } from "mongoose";

export interface IFounderProfile {
  _id: string; // The lowercased Wallet Address acting as Primary Key
  email?: string;
  phone?: string;
  narrative?: string; // Raw narrative context message
  geminiEvaluation?: Record<string, unknown>; // Natively nested structured AI response payload, using unknown instead of any
  isQualified: boolean;
  totalGrade?: number; // Weighted Trust Score (Max 100)
  notificationsConfirmed?: boolean;
  chatCount?: number; // Total chat/evaluation attempts
  lvl1InputTokens?: number;
  lvl1OutputTokens?: number;
  lvl1TotalTokens?: number;
  lvl1CostUsd?: number;
  createdAt: Date;
  updatedAt: Date;
}

const FounderProfileSchema: Schema = new Schema<IFounderProfile>(
  {
    _id: { type: String, required: true },
    email: { type: String, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    narrative: { type: String },
    geminiEvaluation: { type: Schema.Types.Mixed },
    isQualified: { type: Boolean, default: false },
    totalGrade: { type: Number },
    notificationsConfirmed: { type: Boolean, default: false },
    chatCount: { type: Number, default: 0 },
    lvl1InputTokens: { type: Number, default: 0 },
    lvl1OutputTokens: { type: Number, default: 0 },
    lvl1TotalTokens: { type: Number, default: 0 },
    lvl1CostUsd: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const model = mongoose.models.FounderProfile || mongoose.model<IFounderProfile>("FounderProfile", FounderProfileSchema);
export default model;
