// Types for QuickEats Application

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  vegetarian: boolean;
  spicyLevel: number; // 1-5
}

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  image: string;
  rating: number;
  deliveryFee: number;
  deliveryTime: number;
  zone: string;
  menu: MenuItem[];
  status: 'open' | 'closed' | 'busy';
}

export interface DeliveryPartner {
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

export interface Zone {
  id: string;
  name: string;
  surgeMultiplier: number;
  deliveryPartnersAvailable: number;
  ordersInZone: number;
  estimatedWait: number;
}

export interface Order {
  id: string;
  restaurantId: string;
  customerId: string;
  items: MenuItem[];
  totalAmount: number;
  deliveryFee: number;
  surgeApplied: number;
  finalAmount: number;
  status: 'pending' | 'confirmed' | 'cooking' | 'ready' | 'picked' | 'delivered';
  createdAt: Date;
  deliveredAt?: Date;
}

export interface SurgeMetrics {
  zone: string;
  timestamp: Date;
  multiplier: number;
  orderCount: number;
  partnerCount: number;
  demandLevel: 'low' | 'medium' | 'high' | 'critical';
}
