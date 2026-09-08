import 'server-only';
import { cookies } from 'next/headers';
import { randomUUID } from 'crypto';

const CART_COOKIE = 'quickeats_cart_id';
const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

/**
 * There's no authentication system in this app, so the cart (and orders
 * placed from it) is tracked with an anonymous id stored in an httpOnly
 * cookie — same pattern most guest-checkout flows use before a user signs
 * in. Call this from a Route Handler (it needs to set a cookie on the
 * response, which only Route Handlers / Server Actions can do).
 */
export function getOrCreateCartId(): string {
  const store = cookies();
  const existing = store.get(CART_COOKIE)?.value;
  if (existing) return existing;

  const id = randomUUID();
  store.set(CART_COOKIE, id, {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: ONE_YEAR_SECONDS,
    path: '/',
  });
  return id;
}
