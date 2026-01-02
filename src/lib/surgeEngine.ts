import { Zone } from '@/types';

export function calculateSurgeMultiplier(zone: Zone): number {
  const demandRatio = zone.ordersInZone / (zone.deliveryPartnersAvailable || 1);

  if (demandRatio > 15) return 1.9;
  if (demandRatio > 12) return 1.8;
  if (demandRatio > 8) return 1.5;
  if (demandRatio > 4) return 1.2;
  return 1.0;
}

export function getDemandLevel(multiplier: number): 'low' | 'medium' | 'high' | 'critical' {
  if (multiplier >= 1.8) return 'critical';
  if (multiplier >= 1.5) return 'high';
  if (multiplier >= 1.2) return 'medium';
  return 'low';
}

export function estimateDeliveryTime(baseTime: number, surgeMultiplier: number): number {
  return Math.ceil(baseTime * (1 + (surgeMultiplier - 1) * 0.5));
}

export function calculateFinalAmount(subtotal: number, deliveryFee: number, surgeMultiplier: number): number {
  const surgeDeliveryFee = deliveryFee * surgeMultiplier;
  return subtotal + surgeDeliveryFee;
}
