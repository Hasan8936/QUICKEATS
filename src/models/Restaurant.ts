import mongoose, { Schema, models, model } from 'mongoose';

export interface MenuItemDocument {
  id: string;
  name: string;
  description: string;
  price: number;
  vegetarian: boolean;
  spicyLevel: number;
}

export interface RestaurantDocument extends mongoose.Document {
  id: string;
  name: string;
  cuisine: string;
  image: string;
  rating: number;
  deliveryFee: number;
  deliveryTime: number;
  zone: string;
  status: 'open' | 'closed' | 'busy';
  menu: MenuItemDocument[];
}

const MenuItemSchema = new Schema<MenuItemDocument>(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true, min: 0 },
    vegetarian: { type: Boolean, default: false },
    spicyLevel: { type: Number, default: 0, min: 0, max: 5 },
  },
  { _id: false }
);

const RestaurantSchema = new Schema<RestaurantDocument>(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    cuisine: { type: String, required: true },
    image: { type: String, required: true },
    rating: { type: Number, required: true, min: 0, max: 5 },
    deliveryFee: { type: Number, required: true, min: 0 },
    deliveryTime: { type: Number, required: true, min: 0 },
    zone: { type: String, required: true, index: true },
    status: { type: String, enum: ['open', 'closed', 'busy'], default: 'open' },
    menu: { type: [MenuItemSchema], default: [] },
  },
  { timestamps: true }
);

export const Restaurant =
  models.Restaurant || model<RestaurantDocument>('Restaurant', RestaurantSchema);
