import { redis } from './redis';
import { prisma } from './prisma';

export function getDemandLevel(multiplier: number): 'low' | 'medium' | 'high' | 'critical' {
  if (multiplier >= 1.8) return 'critical';
  if (multiplier >= 1.5) return 'high';
  if (multiplier > 1.0) return 'medium';
  return 'low';
}

const SURGE_TTL_SECONDS = 12;      // how fresh the number needs to be
const LOCK_TTL_MS = 3000;           // max time one request holds the recompute lock

export async function calculateSurgeMultiplier(zoneId: string) {
  const cacheKey = `surge:${zoneId}`;
  const cached = await redis.get(cacheKey);
  if (cached) return JSON.parse(cached);

  const lockKey = `lock:surge:${zoneId}`;
  // SET NX PX = atomic "acquire lock only if nobody else holds it"
  const gotLock = await redis.set(lockKey, '1', 'PX', LOCK_TTL_MS, 'NX');

  if (!gotLock) {
    // someone else is already recomputing — wait briefly and read their result
    await new Promise((r) => setTimeout(r, 50));
    const retry = await redis.get(cacheKey);
    if (retry) return JSON.parse(retry);
    // fall through to a safe default rather than stack more recomputes
    return { multiplier: 1.0, label: 'Low', reason: 'Recompute in progress' };
  }

  try {
    const [activeOrders, availablePartners] = await Promise.all([
      redis.get(`active_orders:${zoneId}`).then((v) => Number(v) || 0),
      redis.get(`available_partners:${zoneId}`).then((v) => Number(v) || 0),
    ]);

    if (availablePartners === 0) {
      const result = { multiplier: 1.0, label: 'Low', reason: 'No available partners' };
      await redis.set(cacheKey, JSON.stringify(result), 'EX', SURGE_TTL_SECONDS);
      return result;
    }

    const demandRatio = activeOrders / availablePartners;
    const policy = await prisma.surgePolicy.findUnique({ where: { zoneId } });

    let multiplier = 1.0;
    if (policy) {
      if (demandRatio > policy.threshold) multiplier = policy.multiplier;
    } else {
      if (demandRatio > 2) multiplier = 1.5;
      if (demandRatio > 3) multiplier = 1.8;
    }

    const result = {
      multiplier,
      label: getDemandLevel(multiplier),
      reason: `Demand ratio: ${demandRatio.toFixed(2)}`,
    };

    await redis.set(cacheKey, JSON.stringify(result), 'EX', SURGE_TTL_SECONDS);

    // push the update to every connected client instead of letting them poll
    await redis.publish('surge-updates', JSON.stringify({ zoneId, ...result }));

    return result;
  } finally {
    await redis.del(lockKey);
  }
}