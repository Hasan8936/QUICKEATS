'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { CartDrawer, CartItem } from '@/components/CartDrawer';

interface CartState {
  cartId: string;
  restaurantId: string | null;
  items: CartItem[];
}

const CartPage = () => {
  const router = useRouter();
  const [cart, setCart] = useState<CartState | null>(null);
  const [surgeMultiplier, setSurgeMultiplier] = useState(1.0);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const loadCart = useCallback(async () => {
    const res = await fetch('/api/cart');
    const data = await res.json();
    setCart(data);

    if (data.restaurantId) {
      const restaurantRes = await fetch(`/api/restaurants/${data.restaurantId}`);
      if (restaurantRes.ok) {
        const restaurant = await restaurantRes.json();
        setDeliveryFee(restaurant.deliveryFee);
        const surgeData = await fetch(`/api/surge?zoneId=${restaurant.zone}`).then((r) => r.json());
        setSurgeMultiplier(surgeData.multiplier ?? 1.0);
      }
    }
  }, []);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const handleUpdateQuantity = async (itemId: string, quantity: number) => {
    await fetch('/api/cart', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ itemId, quantity }),
    });
    loadCart();
  };

  const handlePlaceOrder = async () => {
    setPlacing(true);
    setError(null);
    try {
      const res = await fetch('/api/orders', { method: 'POST' });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to place order');
      }
      setOrderPlaced(true);
      setTimeout(() => router.push('/'), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to place order');
    } finally {
      setPlacing(false);
    }
  };

  if (!cart) {
    return <div className="p-8 text-center text-[var(--color-text-muted)]">Loading cart…</div>;
  }

  if (orderPlaced) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">
          Order placed! 🎉
        </h1>
        <p className="text-[var(--color-text-muted)]">Taking you back to the homepage…</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 text-[var(--color-danger)] text-sm">
          {error}
        </div>
      )}
      <CartDrawer
        isOpen={true}
        onClose={() => router.push('/')}
        items={cart.items}
        onUpdateQuantity={handleUpdateQuantity}
        onCheckout={handlePlaceOrder}
        checkoutDisabled={placing}
        deliveryFee={deliveryFee}
        surgeMultiplier={surgeMultiplier}
      />
    </div>
  );
};

export default CartPage;
