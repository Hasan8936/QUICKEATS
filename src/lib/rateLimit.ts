import { redis } from './redis';

const WINDOW_SECONDS = 10;
const MAX_REQUESTS = 50; // per window, per key

export async function checkRateLimit(identifier: string) {
  const key = `ratelimit:${identifier}`;
  const count = await redis.incr(key);
  if (count === 1) await redis.expire(key, WINDOW_SECONDS);
  return count <= MAX_REQUESTS;
}