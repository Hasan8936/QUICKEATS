'use client';

import React, { useState } from 'react';
import { Star, Clock, Plus } from 'lucide-react';
import { PriceDisplay } from './PriceDisplay';
import type { LeanRestaurant } from '@/lib/queries';

export function RestaurantMenuClient({ restaurant }: { restaurant: LeanRestaurant }) {
  const [addingId, setAddingId] = useState<string | null>(null);
  const [justAddedId, setJustAddedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAdd = async (itemId: string) => {
    setAddingId(itemId);
    setError(null);
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ restaurantId: restaurant.id, itemId }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to add item');
      }
      setJustAddedId(itemId);
      setTimeout(() => setJustAddedId((current) => (current === itemId ? null : current)), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add item');
    } finally {
      setAddingId(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="relative h-48 sm:h-64 rounded-xl overflow-hidden mb-6 bg-gray-200">
        <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover" />
      </div>

      <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">{restaurant.name}</h1>
          <p className="text-[var(--color-text-muted)]">{restaurant.cuisine}</p>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold">{restaurant.rating}</span>
          </div>
          <div className="flex items-center gap-1 text-[var(--color-text-muted)]">
            <Clock className="w-4 h-4" />
            <span>{restaurant.deliveryTime} min</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 text-[var(--color-danger)] text-sm">
          {error}
        </div>
      )}

      <h2 className="text-xl font-bold mb-4 text-[var(--color-text-primary)]">Menu</h2>
      <div className="space-y-3">
        {restaurant.menu.map((item) => (
          <div
            key={item.id}
            className="card p-4 flex items-center justify-between gap-4"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span
                  className={`w-3 h-3 rounded-sm border ${
                    item.vegetarian ? 'border-green-600' : 'border-red-600'
                  }`}
                >
                  <span
                    className={`block w-1.5 h-1.5 rounded-full m-auto mt-[3px] ${
                      item.vegetarian ? 'bg-green-600' : 'bg-red-600'
                    }`}
                  />
                </span>
                <h3 className="font-semibold text-[var(--color-text-primary)]">{item.name}</h3>
              </div>
              <p className="text-sm text-[var(--color-text-muted)] mt-1">{item.description}</p>
              <div className="mt-2">
                <PriceDisplay amount={item.price} size="sm" />
              </div>
            </div>
            <button
              onClick={() => handleAdd(item.id)}
              disabled={addingId === item.id}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg font-semibold text-sm transition-colors disabled:opacity-60 ${
                justAddedId === item.id
                  ? 'bg-green-600 text-white'
                  : 'bg-[var(--color-primary-orange)] text-white hover:bg-[var(--color-primary-orange-dark)]'
              }`}
            >
              <Plus className="w-4 h-4" />
              {justAddedId === item.id ? 'Added' : addingId === item.id ? 'Adding…' : 'Add'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
