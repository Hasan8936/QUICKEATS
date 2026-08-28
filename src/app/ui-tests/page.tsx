"use client";

import React, { useState } from 'react';
import { RestaurantCard } from '@/components/RestaurantCard';
import { CartDrawer, CartItem } from '@/components/CartDrawer';
import { zones, restaurants } from '@/entities/mockData';

export default function UITestsPage() {
  const [isOpen, setIsOpen] = useState(false);

  const sampleItems: CartItem[] = [
    { id: 'i1', name: 'Paneer Butter Masala', price: 249, quantity: 2, restaurantId: 'r1' },
    { id: 'i2', name: 'Garlic Naan', price: 49, quantity: 3, restaurantId: 'r1' },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">UI Tests</h1>
        <div className="flex items-center gap-2">
          <button onClick={() => setIsOpen(true)} className="btn-primary">Open Cart</button>
        </div>
      </header>

      <section>
        <h2 className="font-semibold mb-4">Restaurant Card</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {restaurants.slice(0, 3).map((r) => (
            <RestaurantCard
              key={r.id}
              id={r.id}
              name={r.name}
              cuisine={r.cuisines.join(', ')}
              image={r.image}
              rating={r.rating}
              deliveryFee={r.deliveryFee}
              deliveryTime={r.deliveryTime}
              surgeMultiplier={r.surgeMultiplier || 1}
            />
          ))}
        </div>
      </section>

      <CartDrawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        items={sampleItems}
        onUpdateQuantity={() => {}}
        deliveryFee={30}
        surgeMultiplier={1.2}
        restaurantName={restaurants[0]?.name}
      />
    </div>
  );
}
