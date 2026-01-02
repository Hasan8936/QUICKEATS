'use client';

import React, { useState } from 'react';
import { ShoppingCart, MapPin, ChevronDown } from 'lucide-react';
import { zones } from '@/entities/mockData';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selectedZone, setSelectedZone] = useState(zones[0]);
  const [isZoneOpen, setIsZoneOpen] = useState(false);
  const [cartCount, _setCartCount] = useState(0);

  return (
    <html lang="en">
      <body className="bg-[var(--color-background)] text-[var(--color-text-primary)]">
        {/* Sticky Navbar */}
        <nav className="sticky top-0 z-50 bg-white border-b border-[var(--color-border)] shadow-[var(--shadow-sm)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
                <div className="w-8 h-8 bg-[var(--color-primary-orange)] rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">Q</span>
                </div>
                <span className="font-bold text-xl text-[var(--color-text-primary)] hidden sm:inline">
                  QuickEats
                </span>
              </div>

              {/* Location Selector */}
              <div className="hidden sm:flex items-center gap-2 relative">
                <button
                  onClick={() => setIsZoneOpen(!isZoneOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[var(--color-background)] transition-colors group"
                >
                  <MapPin className="w-5 h-5 text-[var(--color-primary-orange)]" />
                  <span className="text-sm font-medium">{selectedZone.name}</span>
                  <ChevronDown className="w-4 h-4 text-[var(--color-text-muted)] group-hover:text-[var(--color-primary-orange)]" />
                </button>

                {/* Zone Dropdown */}
                {isZoneOpen && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-[var(--shadow-lg)] border border-[var(--color-border)] z-10">
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
                          <div className="flex justify-between items-center">
                            <span>{zone.name}</span>
                            {zone.surgeMultiplier > 1 && (
                              <span className="text-xs font-semibold px-2 py-1 rounded-full bg-[var(--color-warning)] text-white">
                                {zone.surgeMultiplier}x
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-[var(--color-text-muted)]">
                            {zone.deliveryPartnersAvailable} partners • {zone.ordersInZone} orders
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Cart Icon */}
              <button className="relative flex items-center justify-center w-10 h-10 rounded-lg hover:bg-[var(--color-background)] transition-colors group">
                <ShoppingCart className="w-6 h-6 text-[var(--color-text-primary)] group-hover:text-[var(--color-primary-orange)]" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 bg-[var(--color-danger)] text-white text-xs font-bold rounded-full">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="min-h-screen">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-[var(--color-border)] mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-8">
              <div>
                <h4 className="font-bold text-[var(--color-text-primary)] mb-4">QuickEats</h4>
                <p className="text-sm text-[var(--color-text-muted)]">
                  Fast, reliable food delivery with transparent surge pricing.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-[var(--color-text-primary)] mb-4">Company</h4>
                <ul className="space-y-2 text-sm text-[var(--color-text-muted)]">
                  <li><a href="#" className="hover:text-[var(--color-primary-orange)] transition-colors">About</a></li>
                  <li><a href="#" className="hover:text-[var(--color-primary-orange)] transition-colors">Blog</a></li>
                  <li><a href="#" className="hover:text-[var(--color-primary-orange)] transition-colors">Careers</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-[var(--color-text-primary)] mb-4">Support</h4>
                <ul className="space-y-2 text-sm text-[var(--color-text-muted)]">
                  <li><a href="#" className="hover:text-[var(--color-primary-orange)] transition-colors">Help Center</a></li>
                  <li><a href="#" className="hover:text-[var(--color-primary-orange)] transition-colors">Contact</a></li>
                  <li><a href="#" className="hover:text-[var(--color-primary-orange)] transition-colors">FAQs</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-[var(--color-text-primary)] mb-4">Legal</h4>
                <ul className="space-y-2 text-sm text-[var(--color-text-muted)]">
                  <li><a href="#" className="hover:text-[var(--color-primary-orange)] transition-colors">Privacy</a></li>
                  <li><a href="#" className="hover:text-[var(--color-primary-orange)] transition-colors">Terms</a></li>
                  <li><a href="#" className="hover:text-[var(--color-primary-orange)] transition-colors">Compliance</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-[var(--color-border)] mt-8 pt-8">
              <p className="text-center text-sm text-[var(--color-text-muted)]">
                © 2026 QuickEats. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
