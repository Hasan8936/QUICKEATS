'use client';

import React, { useState } from 'react';
import { X, Plus, Minus, ShoppingCart } from 'lucide-react';
import { PriceDisplay } from './PriceDisplay';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  restaurantId: string;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  deliveryFee: number;
  surgeMultiplier: number;
  restaurantName?: string;
}

export function CartDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  deliveryFee,
  surgeMultiplier,
  restaurantName,
}: CartDrawerProps) {
  const [promoCode, setPromoCode] = useState('');

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const baseDeliveryFee = deliveryFee;
  const surgeDeliveryFee = baseDeliveryFee * surgeMultiplier;
  const surgeCost = surgeDeliveryFee - baseDeliveryFee;
  const total = subtotal + surgeDeliveryFee;

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 bottom-0 w-full sm:w-96 bg-white shadow-[-4px_0_6px_rgba(0,0,0,0.1)] z-50 overflow-y-auto animate-slide-in">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-[var(--color-border)] p-4">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-lg font-bold text-[var(--color-text-primary)]">Your Order</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-[var(--color-background)] rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-[var(--color-text-primary)]" />
            </button>
          </div>
          {restaurantName && (
            <p className="text-sm text-[var(--color-text-muted)]">from {restaurantName}</p>
          )}
        </div>

        {/* Items List */}
        <div className="p-4 border-b border-[var(--color-border)]">
          {items.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart className="w-12 h-12 text-[var(--color-text-muted)] mx-auto mb-3 opacity-50" />
              <p className="text-[var(--color-text-muted)]">Your cart is empty</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 items-start">
                  <div className="flex-1">
                    <h4 className="font-semibold text-[var(--color-text-primary)] text-sm">
                      {item.name}
                    </h4>
                    <p className="text-sm text-[var(--color-text-muted)] mt-1">
                      <PriceDisplay amount={item.price} size="sm" />
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2 bg-[var(--color-background)] rounded-lg p-1">
                    <button
                      onClick={() =>
                        onUpdateQuantity(item.id, Math.max(0, item.quantity - 1))
                      }
                      className="p-1 hover:bg-white rounded transition-colors"
                    >
                      <Minus className="w-4 h-4 text-[var(--color-primary-orange)]" />
                    </button>
                    <span className="w-6 text-center font-semibold text-sm">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        onUpdateQuantity(item.id, item.quantity + 1)
                      }
                      className="p-1 hover:bg-white rounded transition-colors"
                    >
                      <Plus className="w-4 h-4 text-[var(--color-primary-orange)]" />
                    </button>
                  </div>

                  {/* Item Total */}
                  <div className="font-semibold text-[var(--color-text-primary)] min-w-[60px] text-right">
                    <PriceDisplay amount={item.price * item.quantity} size="sm" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Promo Code */}
        {items.length > 0 && (
          <div className="p-4 border-b border-[var(--color-border)]">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Promo code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="flex-1 px-3 py-2 border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-orange)] focus:ring-offset-2"
              />
              <button className="px-4 py-2 bg-[var(--color-background)] hover:bg-[var(--color-border)] rounded-lg font-semibold text-sm transition-colors">
                Apply
              </button>
            </div>
          </div>
        )}

        {/* Bill Details */}
        {items.length > 0 && (
          <div className="p-4 space-y-3 border-b border-[var(--color-border)]">
            <div className="flex justify-between items-center text-sm">
              <span className="text-[var(--color-text-secondary)]">Subtotal</span>
              <PriceDisplay amount={subtotal} size="sm" />
            </div>

            {surgeMultiplier > 1 && (
              <>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[var(--color-text-secondary)]">
                    Base Delivery Fee
                  </span>
                  <span className="text-[var(--color-text-muted)] line-through text-xs">
                    <PriceDisplay amount={baseDeliveryFee} size="sm" />
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm bg-[var(--color-warning)] bg-opacity-10 p-2 rounded-lg">
                  <span className="text-[var(--color-warning)] font-semibold">
                    Surge Pricing (+{((surgeMultiplier - 1) * 100).toFixed(0)}%)
                  </span>
                  <span className="text-[var(--color-warning)] font-semibold">
                    +<PriceDisplay amount={surgeCost} showCurrency={false} size="sm" />
                  </span>
                </div>
              </>
            )}

            <div className="flex justify-between items-center text-sm">
              <span className="text-[var(--color-text-secondary)]">Delivery Fee</span>
              <PriceDisplay amount={surgeDeliveryFee} size="sm" />
            </div>

            <div className="border-t border-[var(--color-border)] pt-3 flex justify-between items-center font-bold">
              <span className="text-[var(--color-text-primary)]">Total</span>
              <PriceDisplay amount={total} size="md" />
            </div>
          </div>
        )}

        {/* CTA Button */}
        <div className="p-4 sticky bottom-0 bg-white">
          <button
            disabled={items.length === 0}
            className="w-full py-3 bg-[var(--color-primary-orange)] text-white rounded-lg font-bold transition-all duration-200 hover:bg-[var(--color-primary-orange-dark)] disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
          >
            {items.length === 0 ? 'Add items to checkout' : 'Place Order'}
          </button>
          <p className="text-xs text-center text-[var(--color-text-muted)] mt-2">
            You'll save more with a bigger order
          </p>
        </div>
      </div>
    </>
  );
}
