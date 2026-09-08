'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { RestaurantCard } from '@/components/RestaurantCard';
import { MapPin, Utensils } from 'lucide-react';
import type { LeanZone, LeanRestaurant } from '@/lib/queries';

interface HomePageClientProps {
  zones: LeanZone[];
  restaurants: LeanRestaurant[];
}

export function HomePageClient({ zones, restaurants }: HomePageClientProps) {
  const router = useRouter();
  const [selectedZone, setSelectedZone] = useState(zones[0]);
  const [isZoneOpen, setIsZoneOpen] = useState(false);
  const [surgeMultiplier, setSurgeMultiplier] = useState(1.0);

  const zoneRestaurants = restaurants.filter((r) => r.zone === selectedZone?.id);

  // Fetch the surge multiplier from the API route instead of importing the
  // server-only surge engine directly (that used to pull Prisma/Redis into
  // the client bundle and crash at runtime).
  useEffect(() => {
    if (!selectedZone) return;
    let cancelled = false;

    fetch(`/api/surge?zoneId=${selectedZone.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setSurgeMultiplier(data.multiplier ?? 1.0);
      })
      .catch(() => {
        if (!cancelled) setSurgeMultiplier(1.0);
      });

    return () => {
      cancelled = true;
    };
  }, [selectedZone]);

  if (!selectedZone) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center text-[var(--color-text-muted)]">
        No delivery zones configured yet.
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Zone Selector Mobile View */}
      <div className="sm:hidden mb-6 relative">
        <button
          onClick={() => setIsZoneOpen(!isZoneOpen)}
          className="w-full flex items-center gap-2 px-4 py-3 bg-white rounded-lg border border-[var(--color-border)] shadow-[var(--shadow-sm)]"
        >
          <MapPin className="w-5 h-5 text-[var(--color-primary-orange)]" />
          <div className="flex-1 text-left">
            <p className="text-xs text-[var(--color-text-muted)]">Delivery Location</p>
            <p className="font-semibold text-[var(--color-text-primary)]">{selectedZone.name}</p>
          </div>
        </button>

        {isZoneOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-[var(--shadow-lg)] border border-[var(--color-border)] z-10">
            <div className="p-2">
              {zones.map((zone) => (
                <button
                  key={zone.id}
                  onClick={() => {
                    setSelectedZone(zone);
                    setIsZoneOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    selectedZone.id === zone.id
                      ? 'bg-[var(--color-primary-orange-light)] text-[var(--color-primary-orange)] font-semibold'
                      : 'hover:bg-[var(--color-background)] text-[var(--color-text-primary)]'
                  }`}
                >
                  <p className="font-medium">{zone.name}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">
                    {zone.deliveryPartnersAvailable} partners • {zone.ordersInZone} orders
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Zone Selector Desktop View */}
      <div className="hidden sm:block mb-8">
        <div className="flex flex-wrap gap-3">
          {zones.map((zone) => (
            <button
              key={zone.id}
              onClick={() => setSelectedZone(zone)}
              className={`px-4 py-2 rounded-full font-medium transition-all ${
                selectedZone.id === zone.id
                  ? 'bg-[var(--color-primary-orange)] text-white shadow-[var(--shadow-md)]'
                  : 'bg-white text-[var(--color-text-primary)] border border-[var(--color-border)] hover:border-[var(--color-primary-orange)]'
              }`}
            >
              {zone.name}
            </button>
          ))}
        </div>
      </div>

      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">
          Order Food Online
        </h1>
        <p className="text-[var(--color-text-muted)] mb-4">
          Browse restaurants in {selectedZone.name}
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="card p-4">
            <p className="text-sm text-[var(--color-text-muted)] mb-1">Available Partners</p>
            <p className="text-2xl font-bold text-[var(--color-text-primary)]">
              {selectedZone.deliveryPartnersAvailable}
            </p>
          </div>
          <div className="card p-4">
            <p className="text-sm text-[var(--color-text-muted)] mb-1">Active Orders</p>
            <p className="text-2xl font-bold text-[var(--color-text-primary)]">
              {selectedZone.ordersInZone}
            </p>
          </div>
          <div className="card p-4 col-span-2 sm:col-span-1">
            <p className="text-sm text-[var(--color-text-muted)] mb-1">Est. Delivery</p>
            <p className="text-2xl font-bold text-[var(--color-text-primary)]">
              {selectedZone.estimatedWait} min
            </p>
          </div>
        </div>
      </div>

      {/* Restaurants Grid */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <Utensils className="w-5 h-5 text-[var(--color-primary-orange)]" />
          <h2 className="text-xl font-bold text-[var(--color-text-primary)]">
            Restaurants ({zoneRestaurants.length})
          </h2>
        </div>

        {zoneRestaurants.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {zoneRestaurants.map((restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                {...restaurant}
                surgeMultiplier={surgeMultiplier}
                onClick={() => router.push(`/restaurant/${restaurant.id}`)}
              />
            ))}
          </div>
        ) : (
          <div className="card p-12 text-center">
            <p className="text-[var(--color-text-muted)]">
              No restaurants available in this zone right now.
            </p>
          </div>
        )}
      </div>

      {/* Surge Info Section */}
      {surgeMultiplier > 1 && (
        <div className="mt-12 bg-[var(--color-warning)] bg-opacity-10 border border-[var(--color-warning)] border-opacity-20 rounded-lg p-6">
          <div className="flex gap-4 items-start">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-[var(--color-warning)] text-white">
                ⚡
              </div>
            </div>
            <div>
              <h3 className="font-bold text-[var(--color-text-primary)] mb-1">
                Surge Pricing Active
              </h3>
              <p className="text-[var(--color-text-secondary)] text-sm mb-2">
                High demand in this zone has increased delivery fees by{' '}
                {((surgeMultiplier - 1) * 100).toFixed(0)}%.
              </p>
              <p className="text-xs text-[var(--color-text-muted)]">
                Orders may take longer due to high demand. Delivery fee varies by restaurant.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
