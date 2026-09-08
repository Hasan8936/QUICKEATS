import 'server-only';
import { connectToDatabase } from './mongodb';
import { Zone, ZoneDocument } from '@/models/Zone';
import { Restaurant, RestaurantDocument } from '@/models/Restaurant';
import { DeliveryPartner, DeliveryPartnerDocument } from '@/models/DeliveryPartner';

// .lean() results are plain objects but keep Mongoose's Document generic for
// field typing; we strip the extra Document-only members callers don't need.
export type LeanZone = Pick<
  ZoneDocument,
  'id' | 'name' | 'surgeMultiplier' | 'deliveryPartnersAvailable' | 'ordersInZone' | 'estimatedWait'
>;
export type LeanRestaurant = Pick<
  RestaurantDocument,
  'id' | 'name' | 'cuisine' | 'image' | 'rating' | 'deliveryFee' | 'deliveryTime' | 'zone' | 'status' | 'menu'
>;
export type LeanPartner = Pick<
  DeliveryPartnerDocument,
  'id' | 'name' | 'vehicle' | 'rating' | 'totalDeliveries' | 'zone' | 'status' | 'earnings' | 'image'
>;

export async function getZones(): Promise<LeanZone[]> {
  await connectToDatabase();
  return Zone.find().sort({ name: 1 }).select('-_id id name surgeMultiplier deliveryPartnersAvailable ordersInZone estimatedWait').lean<LeanZone[]>();
}

export async function getRestaurants(zone?: string): Promise<LeanRestaurant[]> {
  await connectToDatabase();
  const filter = zone ? { zone } : {};
  return Restaurant.find(filter)
    .sort({ rating: -1 })
    .select('-_id id name cuisine image rating deliveryFee deliveryTime zone status menu')
    .lean<LeanRestaurant[]>();
}

export async function getRestaurantById(id: string): Promise<LeanRestaurant | null> {
  await connectToDatabase();
  return Restaurant.findOne({ id }).select('-_id id name cuisine image rating deliveryFee deliveryTime zone status menu').lean<LeanRestaurant | null>();
}

export async function getPartners(filter: { zone?: string; status?: string } = {}): Promise<LeanPartner[]> {
  await connectToDatabase();
  return DeliveryPartner.find(filter)
    .sort({ rating: -1 })
    .select('-_id id name vehicle rating totalDeliveries zone status earnings image')
    .lean<LeanPartner[]>();
}
