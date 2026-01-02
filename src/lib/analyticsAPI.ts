import { Redis } from 'ioredis';
import { OrderEvent, SurgeEvent, TrafficMetric } from '@/db/mongoose/schemas';

const redis = new Redis();

export async function getOrdersPerMinute() {
  const cacheKey = 'analytics:orders_per_minute';
  const cachedData = await redis.get(cacheKey);

  if (cachedData) {
    return JSON.parse(cachedData);
  }

  const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
  const orders = await OrderEvent.countDocuments({
    event: 'order_created',
    timestamp: { $gte: oneMinuteAgo },
  });

  await redis.set(cacheKey, JSON.stringify(orders), 'EX', 60);
  return orders;
}

export async function getSurgeMetrics() {
  const cacheKey = 'analytics:surge_metrics';
  const cachedData = await redis.get(cacheKey);

  if (cachedData) {
    return JSON.parse(cachedData);
  }

  const metrics = await SurgeEvent.aggregate([
    { $group: { _id: '$zone', avgMultiplier: { $avg: '$multiplier' } } },
  ]);

  await redis.set(cacheKey, JSON.stringify(metrics), 'EX', 60);
  return metrics;
}

export async function getZoneDemandVsSupply() {
  const cacheKey = 'analytics:zone_demand_supply';
  const cachedData = await redis.get(cacheKey);

  if (cachedData) {
    return JSON.parse(cachedData);
  }

  const metrics = await TrafficMetric.aggregate([
    { $group: { _id: '$zone', avgLoad: { $avg: '$load' } } },
  ]);

  await redis.set(cacheKey, JSON.stringify(metrics), 'EX', 60);
  return metrics;
}