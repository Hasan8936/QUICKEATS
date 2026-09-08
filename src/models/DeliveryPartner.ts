import mongoose, { Schema, models, model } from 'mongoose';

export interface DeliveryPartnerDocument extends mongoose.Document {
  id: string;
  name: string;
  vehicle: string;
  rating: number;
  totalDeliveries: number;
  zone: string;
  status: 'available' | 'busy' | 'offline';
  earnings: number;
  image: string;
}

const DeliveryPartnerSchema = new Schema<DeliveryPartnerDocument>(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    vehicle: { type: String, required: true },
    rating: { type: Number, required: true, min: 0, max: 5 },
    totalDeliveries: { type: Number, required: true, default: 0 },
    zone: { type: String, required: true, index: true },
    status: { type: String, enum: ['available', 'busy', 'offline'], default: 'offline' },
    earnings: { type: Number, required: true, default: 0 },
    image: { type: String, required: true },
  },
  { timestamps: true }
);

export const DeliveryPartner =
  models.DeliveryPartner ||
  model<DeliveryPartnerDocument>('DeliveryPartner', DeliveryPartnerSchema);
