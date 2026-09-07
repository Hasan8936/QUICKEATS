import mongoose, { Document, Schema } from 'mongoose';

// User Schema
export interface IUser extends Document {
  email: string;
  password: string;
  phone: string;
  name: string;
  addresses: Array<{
    label: string;
    street: string;
    city: string;
    zipCode: string;
    coordinates: { lat: number; lng: number };
    isDefault: boolean;
  }>;
  preferences: {
    cuisine: string[];
    notifications: boolean;
    offers: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    addresses: [
      {
        label: String,
        street: String,
        city: String,
        zipCode: String,
        coordinates: {
          lat: Number,
          lng: Number,
        },
        isDefault: { type: Boolean, default: false },
      },
    ],
    preferences: {
      cuisine: [String],
      notifications: { type: Boolean, default: true },
      offers: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

// Restaurant Schema
export interface IRestaurant extends Document {
  name: string;
  description: string;
  cuisine: string[];
  image: string;
  rating: number;
  reviewCount: number;
  deliveryFee: number;
  deliveryTime: number;
  minOrder: number;
  zoneId: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  hours: {
    open: string;
    close: string;
    day: string;
  }[];
  status: 'open' | 'closed' | 'coming_soon';
  createdAt: Date;
  updatedAt: Date;
}

const restaurantSchema = new Schema<IRestaurant>(
  {
    name: { type: String, required: true, index: true },
    description: String,
    cuisine: [String],
    image: String,
    rating: { type: Number, min: 0, max: 5, default: 4.0 },
    reviewCount: { type: Number, default: 0 },
    deliveryFee: { type: Number, required: true },
    deliveryTime: { type: Number, required: true },
    minOrder: { type: Number, default: 0 },
    zoneId: { type: String, required: true, index: true },
    location: {
      lat: Number,
      lng: Number,
      address: String,
    },
    hours: [
      {
        open: String,
        close: String,
        day: String,
      },
    ],
    status: { type: String, enum: ['open', 'closed', 'coming_soon'], default: 'open' },
  },
  { timestamps: true }
);

// Menu Item Schema
export interface IMenuItem extends Document {
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  isVeg: boolean;
  spicyLevel: 0 | 1 | 2 | 3;
  availability: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const menuItemSchema = new Schema<IMenuItem>(
  {
    restaurantId: { type: String, required: true, index: true },
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    category: { type: String, required: true },
    image: String,
    isVeg: { type: Boolean, default: false },
    spicyLevel: { type: Number, enum: [0, 1, 2, 3], default: 0 },
    availability: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Order Schema
export interface IOrder extends Document {
  userId: string;
  restaurantId: string;
  items: Array<{
    menuItemId: string;
    name: string;
    price: number;
    quantity: number;
    specialInstructions?: string;
  }>;
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';
  deliveryAddress: {
    street: string;
    city: string;
    zipCode: string;
    lat: number;
    lng: number;
  };
  deliveryPartnerId?: string;
  estimatedDeliveryTime: Date;
  actualDeliveryTime?: Date;
  paymentMethod: 'card' | 'upi' | 'wallet' | 'cash';
  paymentStatus: 'pending' | 'completed' | 'failed';
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    userId: { type: String, required: true, index: true },
    restaurantId: { type: String, required: true, index: true },
    items: [
      {
        menuItemId: String,
        name: String,
        price: Number,
        quantity: Number,
        specialInstructions: String,
      },
    ],
    subtotal: { type: Number, required: true },
    deliveryFee: { type: Number, required: true },
    tax: { type: Number, default: 0 },
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'],
      default: 'pending',
      index: true,
    },
    deliveryAddress: {
      street: String,
      city: String,
      zipCode: String,
      lat: Number,
      lng: Number,
    },
    deliveryPartnerId: String,
    estimatedDeliveryTime: Date,
    actualDeliveryTime: Date,
    paymentMethod: { type: String, enum: ['card', 'upi', 'wallet', 'cash'], default: 'card' },
    paymentStatus: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  },
  { timestamps: true }
);

// Review Schema
export interface IReview extends Document {
  userId: string;
  restaurantId: string;
  rating: number;
  comment: string;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    userId: { type: String, required: true },
    restaurantId: { type: String, required: true, index: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: String,
    images: [String],
  },
  { timestamps: true }
);

// Zone Schema
export interface IZone extends Document {
  name: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  polygon: Array<{ lat: number; lng: number }>;
  deliveryPartnersAvailable: number;
  ordersInZone: number;
  estimatedWait: number;
  surgeMultiplier: number;
  createdAt: Date;
  updatedAt: Date;
}

const zoneSchema = new Schema<IZone>(
  {
    name: { type: String, required: true, index: true },
    coordinates: {
      lat: Number,
      lng: Number,
    },
    polygon: [
      {
        lat: Number,
        lng: Number,
      },
    ],
    deliveryPartnersAvailable: { type: Number, default: 0 },
    ordersInZone: { type: Number, default: 0 },
    estimatedWait: { type: Number, default: 30 },
    surgeMultiplier: { type: Number, default: 1.0 },
  },
  { timestamps: true }
);

// Event Schemas for analytics
export interface ISurgeEvent extends Document {
  zoneId: string;
  multiplier: number;
  timestamp: Date;
}

const surgeEventSchema = new Schema<ISurgeEvent>({
  zoneId: { type: String, required: true, index: true },
  multiplier: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now, index: true },
});

export interface ITrafficMetric extends Document {
  zoneId: string;
  load: number;
  timestamp: Date;
}

const trafficMetricSchema = new Schema<ITrafficMetric>({
  zoneId: { type: String, required: true, index: true },
  load: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now, index: true },
});

// Models
export const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);
export const Restaurant = mongoose.models.Restaurant || mongoose.model<IRestaurant>('Restaurant', restaurantSchema);
export const MenuItem = mongoose.models.MenuItem || mongoose.model<IMenuItem>('MenuItem', menuItemSchema);
export const Order = mongoose.models.Order || mongoose.model<IOrder>('Order', orderSchema);
export const Review = mongoose.models.Review || mongoose.model<IReview>('Review', reviewSchema);
export const Zone = mongoose.models.Zone || mongoose.model<IZone>('Zone', zoneSchema);
export const SurgeEvent = mongoose.models.SurgeEvent || mongoose.model<ISurgeEvent>('SurgeEvent', surgeEventSchema);
export const TrafficMetric = mongoose.models.TrafficMetric || mongoose.model<ITrafficMetric>('TrafficMetric', trafficMetricSchema);
