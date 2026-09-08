import 'server-only';
import { connectToDatabase } from './mongodb';
import { DeliveryPartner } from '@/models/DeliveryPartner';
import { Order } from '@/models/Order';
import { SurgePolicy, SurgePolicyDocument } from '@/models/SurgePolicy';
import { SurgeEvent } from '@/models/Events';
import { getDemandLevel, DemandLevel } from './demand';

export type { DemandLevel };

export interface SurgeResult {
  zoneId: string;
  multiplier: number;
  label: DemandLevel;
  reason: string;
}

// Small in-process cache so a burst of requests for the same zone within a
// few seconds doesn't each trigger a fresh aggregate query. This is a
// single-instance cache (no cross-instance pub/sub like the old Redis
// version) — acceptable for this app's scale, and avoids depending on a
// separate Redis deployment.
const CACHE_TTL_MS = 8000;
const cache = new Map<string, { result: SurgeResult; expiresAt: number }>();

export async function calculateSurgeMultiplier(zoneId: string): Promise<SurgeResult> {
  const cached = cache.get(zoneId);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.result;
  }

  await connectToDatabase();

  const [availablePartners, activeOrders, policy] = await Promise.all([
    DeliveryPartner.countDocuments({ zone: zoneId, status: 'available' }),
    Order.countDocuments({ zone: zoneId, status: { $ne: 'delivered' } }),
    SurgePolicy.findOne({ zoneId }).lean<SurgePolicyDocument | null>(),
  ]);

  let result: SurgeResult;

  if (availablePartners === 0) {
    result = {
      zoneId,
      multiplier: 1.0,
      label: 'low',
      reason: 'No available partners in zone',
    };
  } else {
    const demandRatio = activeOrders / availablePartners;
    let multiplier = 1.0;

    if (policy) {
      if (demandRatio > policy.threshold) multiplier = policy.multiplier;
    } else {
      if (demandRatio > 2) multiplier = 1.5;
      if (demandRatio > 3) multiplier = 1.8;
    }

    result = {
      zoneId,
      multiplier,
      label: getDemandLevel(multiplier),
      reason: `Demand ratio ${demandRatio.toFixed(2)} (${activeOrders} active orders / ${availablePartners} available partners)`,
    };
  }

  cache.set(zoneId, { result, expiresAt: Date.now() + CACHE_TTL_MS });

  // Fire-and-forget history entry for the analytics dashboard. Failure here
  // should never block returning the multiplier to the caller.
  SurgeEvent.create({ zone: zoneId, multiplier: result.multiplier }).catch(() => {});

  return result;
}
