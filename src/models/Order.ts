import mongoose, { Schema, models, model } from 'mongoose';
import { CartLineItem } from './Cart';

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'cooking'
  | 'ready'
  | 'picked'
  | 'delivered';

export interface OrderDocument extends mongoose.Document {
  restaurantId: string;
  zone: string;
  cartId: string;
  items: CartLineItem[];
  totalAmount: number;
  deliveryFee: number;
  surgeApplied: number;
  finalAmount: number;
  status: OrderStatus;
  deliveredAt?: Date;
  createdAt: Date;
}

const OrderItemSchema = new Schema<CartLineItem>(
  {
    itemId: { type: String, required: true },
    restaurantId: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const OrderSchema = new Schema<OrderDocument>(
  {
    restaurantId: { type: String, required: true, index: true },
    zone: { type: String, required: true, index: true },
    cartId: { type: String, required: true },
    items: { type: [OrderItemSchema], required: true },
    totalAmount: { type: Number, required: true, min: 0 },
    deliveryFee: { type: Number, required: true, min: 0 },
    surgeApplied: { type: Number, required: true, default: 1.0 },
    finalAmount: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cooking', 'ready', 'picked', 'delivered'],
      default: 'pending',
      index: true,
    },
    deliveredAt: { type: Date },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const Order = models.Order || model<OrderDocument>('Order', OrderSchema);
