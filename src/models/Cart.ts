import mongoose, { Schema, models, model } from 'mongoose';

export interface CartLineItem {
  itemId: string;
  restaurantId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface CartDocument extends mongoose.Document {
  cartId: string;
  restaurantId: string | null;
  items: CartLineItem[];
  updatedAt: Date;
}

const CartLineItemSchema = new Schema<CartLineItem>(
  {
    itemId: { type: String, required: true },
    restaurantId: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const CartSchema = new Schema<CartDocument>(
  {
    cartId: { type: String, required: true, unique: true, index: true },
    restaurantId: { type: String, default: null },
    items: { type: [CartLineItemSchema], default: [] },
  },
  { timestamps: true }
);

export const Cart = models.Cart || model<CartDocument>('Cart', CartSchema);
