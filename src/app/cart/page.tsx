"use client";

import React, { useState } from 'react';
import { CartDrawer, CartItem } from '@/components/CartDrawer';

const CartPage = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Cart System</h1>
      <CartDrawer
        isOpen={true}
        onClose={() => {}}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        deliveryFee={5}
        surgeMultiplier={1.2}
      />
    </div>
  );
};

export default CartPage;