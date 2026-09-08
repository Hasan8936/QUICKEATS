import mongoose, { Schema, models, model } from 'mongoose';

export interface ZoneDocument extends mongoose.Document {
  id: string;
  name: string;
  surgeMultiplier: number;
  deliveryPartnersAvailable: number;
  ordersInZone: number;
  estimatedWait: number;
}

const ZoneSchema = new Schema<ZoneDocument>(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    surgeMultiplier: { type: Number, required: true, default: 1.0 },
    deliveryPartnersAvailable: { type: Number, required: true, default: 0 },
    ordersInZone: { type: Number, required: true, default: 0 },
    estimatedWait: { type: Number, required: true, default: 30 },
  },
  { timestamps: true }
);

export const Zone = models.Zone || model<ZoneDocument>('Zone', ZoneSchema);
