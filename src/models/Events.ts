import mongoose, { Schema, models, model } from 'mongoose';

export interface OrderEventDocument extends mongoose.Document {
  orderId: string;
  event: string;
  timestamp: Date;
}
const OrderEventSchema = new Schema<OrderEventDocument>({
  orderId: { type: String, required: true, index: true },
  event: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});
export const OrderEvent =
  models.OrderEvent || model<OrderEventDocument>('OrderEvent', OrderEventSchema);

export interface SurgeEventDocument extends mongoose.Document {
  zone: string;
  multiplier: number;
  timestamp: Date;
}
const SurgeEventSchema = new Schema<SurgeEventDocument>({
  zone: { type: String, required: true, index: true },
  multiplier: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
});
export const SurgeEvent =
  models.SurgeEvent || model<SurgeEventDocument>('SurgeEvent', SurgeEventSchema);

export interface CartEventDocument extends mongoose.Document {
  cartId: string;
  action: string;
  item: Record<string, unknown>;
  timestamp: Date;
}
const CartEventSchema = new Schema<CartEventDocument>({
  cartId: { type: String, required: true, index: true },
  action: { type: String, required: true },
  item: { type: Object, required: true },
  timestamp: { type: Date, default: Date.now },
});
export const CartEvent =
  models.CartEvent || model<CartEventDocument>('CartEvent', CartEventSchema);

export interface TrafficMetricDocument extends mongoose.Document {
  zone: string;
  load: number;
  timestamp: Date;
}
const TrafficMetricSchema = new Schema<TrafficMetricDocument>({
  zone: { type: String, required: true, index: true },
  load: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
});
export const TrafficMetric =
  models.TrafficMetric || model<TrafficMetricDocument>('TrafficMetric', TrafficMetricSchema);
