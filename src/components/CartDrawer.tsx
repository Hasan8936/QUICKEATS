"use client";

import React, { useEffect, useRef, useState } from 'react';
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
  onCheckout?: () => void;
  checkoutDisabled?: boolean;
  deliveryFee: number;
  surgeMultiplier: number;
  restaurantName?: string;
}

export function CartDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onCheckout,
  checkoutDisabled,
  deliveryFee,
  surgeMultiplier,
  restaurantName,
}: CartDrawerProps) {
  const [promoCode, setPromoCode] = useState('');
  const drawerRef = useRef<HTMLDivElement | null>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const baseDeliveryFee = deliveryFee;
  const surgeDeliveryFee = baseDeliveryFee * surgeMultiplier;
  const surgeCost = surgeDeliveryFee - baseDeliveryFee;
  const total = subtotal + surgeDeliveryFee;

  // Focus trap & accessibility. This must run unconditionally (Rules of
  // Hooks) — the previous version put an early `return null` for
  // `!isOpen` above this useEffect, which meant the hook count changed
  // between renders whenever isOpen toggled, and React would throw
  // "Rendered fewer hooks than expected".
  useEffect(() => {
    if (!isOpen) return;

    // Save previously focused element
    previouslyFocused.current = document.activeElement as HTMLElement;

    // Lock scroll
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Focus first tabbable element inside drawer
    const focusable = drawerRef.current?.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable && focusable.length > 0) {
      focusable[0].focus();
    }

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }

      if (e.key === 'Tab') {
        // Simple tab trap
        const nodes = focusable ? Array.from(focusable) : [];
        if (nodes.length === 0) return;
        const first = nodes[0];
        const last = nodes[nodes.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKey);

    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = prevOverflow;
      // restore focus
      try {
        previouslyFocused.current?.focus();
      } catch (err) {
        // ignore
      }
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className="fixed right-0 top-0 bottom-0 w-full sm:w-96 bg-white shadow-[-4px_0_6px_rgba(0,0,0,0.1)] z-50 overflow-y-auto animate-slide-in"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-[var(--color-border)] p-4">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-lg font-bold text-[var(--color-text-primary)]">Your Order</h2>
            <button
              onClick={onClose}
              aria-label="Close cart"
              className="p-2 hover:bg-[var(--color-background)] rounded-lg transition-colors focus-ring"
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

        {/* Bill Details — styled as an order ticket: perforated divider,
            punched side-notches, right-aligned ledger figures. */}
        {items.length > 0 && (
          <div className="p-4">
            <div className="ticket p-4 space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-[var(--color-text-secondary)]">Subtotal</span>
                <span className="ledger-figure">
                  <PriceDisplay amount={subtotal} size="sm" />
                </span>
              </div>

              {surgeMultiplier > 1 && (
                <>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-[var(--color-text-secondary)]">
                      Base delivery fee
                    </span>
                    <span className="ledger-figure text-[var(--color-text-muted)] line-through text-xs">
                      <PriceDisplay amount={baseDeliveryFee} size="sm" />
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm bg-[var(--color-warning)] bg-opacity-10 p-2 rounded-lg">
                    <span className="text-[var(--color-warning)] font-semibold">
                      Surge pricing (+{((surgeMultiplier - 1) * 100).toFixed(0)}%)
                    </span>
                    <span className="ledger-figure text-[var(--color-warning)] font-semibold">
                      +<PriceDisplay amount={surgeCost} showCurrency={false} size="sm" />
                    </span>
                  </div>
                </>
              )}

              <div className="flex justify-between items-center text-sm">
                <span className="text-[var(--color-text-secondary)]">Delivery fee</span>
                <span className="ledger-figure">
                  <PriceDisplay amount={surgeDeliveryFee} size="sm" />
                </span>
              </div>

              <div className="ticket-perforation pt-3 flex justify-between items-center font-bold">
                <span className="text-[var(--color-text-primary)]">Total</span>
                <span className="ledger-figure">
                  <PriceDisplay amount={total} size="md" />
                </span>
              </div>
            </div>
          </div>
        )}

        {/* CTA Button */}
        <div className="p-4 sticky bottom-0 bg-white">
          <button
            onClick={onCheckout}
            disabled={items.length === 0 || checkoutDisabled}
            className="w-full py-3 bg-[var(--color-primary-orange)] text-white rounded-lg font-bold transition-all duration-200 hover:bg-[var(--color-primary-orange-dark)] disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
          >
            {items.length === 0 ? 'Add items to checkout' : checkoutDisabled ? 'Placing order…' : 'Place order'}
          </button>
          {surgeMultiplier > 1 && (
            <p className="text-xs text-center text-[var(--color-text-muted)] mt-2">
              Delivery fee is higher right now due to demand in your area.
            </p>
          )}
        </div>
      </div>
    </>
  );
}
