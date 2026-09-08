import 'server-only';

// In-memory fixed-window rate limiter. Good enough for a single-instance
// deployment; the previous version depended on Redis for this, which added
// an extra piece of infrastructure just to rate-limit a couple of write
// endpoints. If this app ever runs across multiple instances, swap this for
// a shared store (Redis, Upstash, etc.) — the call site won't need to change.
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 30;

const hits = new Map<string, { count: number; windowStart: number }>();

export function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const entry = hits.get(key);

  if (!entry || now - entry.windowStart > WINDOW_MS) {
    hits.set(key, { count: 1, windowStart: now });
    return true;
  }

  if (entry.count >= MAX_REQUESTS) {
    return false;
  }

  entry.count += 1;
  return true;
}
