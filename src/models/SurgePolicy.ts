import mongoose, { Schema, models, model } from 'mongoose';

export interface SurgePolicyDocument extends mongoose.Document {
  zoneId: string;
  threshold: number; // orders-per-available-partner ratio that triggers surge
  multiplier: number; // multiplier applied once threshold is exceeded
}

const SurgePolicySchema = new Schema<SurgePolicyDocument>(
  {
    zoneId: { type: String, required: true, unique: true, index: true },
    threshold: { type: Number, required: true, min: 0 },
    multiplier: { type: Number, required: true, min: 1 },
  },
  { timestamps: true }
);

export const SurgePolicy =
  models.SurgePolicy || model<SurgePolicyDocument>('SurgePolicy', SurgePolicySchema);
