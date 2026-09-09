'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart, MapPin, ChevronDown } from 'lucide-react';
import type { LeanZone } from '@/lib/queries';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [zones, setZones] = useState<LeanZone[]>([]);
  const [selectedZone, setSelectedZone] = useState<LeanZone | null>(null);
  const [isZoneOpen, setIsZoneOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    fetch('/api/zones')
      .then((r) => r.json())
      .then((data: LeanZone[]) => {
        setZones(data);
        setSelectedZone((current) => current ?? data[0] ?? null);
      })
      .catch(() => {});
  }, []);

  // Refresh the cart badge whenever the route changes (e.g. after adding an
  // item on a restaurant page and navigating back), instead of leaving it
  // permanently stuck at 0 like the previous version.
  useEffect(() => {
    fetch('/api/cart')
      .then((r) => r.json())
      .then((cart) => {
        const count = (cart.items ?? []).reduce(
          (sum: number, item: { quantity: number }) => sum + item.quantity,
          0
        );
        setCartCount(count);
      })
      .catch(() => {});
  }, [pathname]);

  const navLinks = [
    { href: '/', label: 'Dashboard' },
    { href: '/analytics', label: 'Analytics Dashboard' },
    { href: '/partners', label: 'Partner Page' },
    { href: '/surge', label: 'Surge Page' },
    { href: '/admin/surge-policies', label: 'Surge Policies Admin' },
    { href: '/cart', label: 'Cart System' },
  ];

  return (
    <html lang="en">
      <body className="bg-[var(--color-background)] text-[var(--color-text-primary)]">
        {/* Sticky Navbar */}
        <nav className="sticky top-0 z-50 bg-white border-b border-[var(--color-border)] shadow-[var(--shadow-sm)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-2.5 cursor-pointer group">
                <div className="w-9 h-9 bg-[var(--color-text-primary)] rounded-lg flex items-center justify-center transition-colors group-hover:bg-[var(--color-primary)]">
                  <span className="text-[var(--color-background)] font-bold text-lg" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                    Q
                  </span>
                </div>
                <span
                  className="font-bold text-xl text-[var(--color-text-primary)] hidden sm:inline"
                  style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
                >
                  QuickEats
                </span>
              </Link>

              {/* Location Selector */}
              {selectedZone && (
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
              )}

              {/* Search */}
              <div className="hidden md:flex items-center flex-1 px-4">
                <div className="w-full max-w-md">
                  <label htmlFor="nav-search" className="sr-only">Search restaurants</label>
                  <input
                    id="nav-search"
                    type="search"
                    placeholder="Search restaurants, cuisines or dishes"
                    className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] focus:ring-2 focus:ring-[var(--color-primary-orange)] focus:outline-none"
                  />
                </div>
              </div>

              {/* Navigation Links */}
              <div className="hidden sm:flex items-center gap-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm font-medium text-[var(--color-text-primary)] hover:text-[var(--color-primary-orange)] transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              {/* Cart Icon */}
              <Link
                href="/cart"
                className="relative flex items-center justify-center w-10 h-10 rounded-lg hover:bg-[var(--color-background)] transition-colors group"
              >
                <ShoppingCart className="w-6 h-6 text-[var(--color-text-primary)] group-hover:text-[var(--color-primary-orange)]" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 bg-[var(--color-danger)] text-white text-xs font-bold rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="min-h-screen">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-[var(--color-text-primary)] text-[var(--color-background)] mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-8">
              <div>
                <h4
                  className="font-bold mb-4"
                  style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
                >
                  QuickEats
                </h4>
                <p className="text-sm opacity-70">
                  Fast, reliable food delivery with transparent surge pricing.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Company</h4>
                <ul className="space-y-2 text-sm opacity-70">
                  <li><a href="#" className="hover:opacity-100 transition-opacity">About</a></li>
                  <li><a href="#" className="hover:opacity-100 transition-opacity">Blog</a></li>
                  <li><a href="#" className="hover:opacity-100 transition-opacity">Careers</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Support</h4>
                <ul className="space-y-2 text-sm opacity-70">
                  <li><a href="#" className="hover:opacity-100 transition-opacity">Help Center</a></li>
                  <li><a href="#" className="hover:opacity-100 transition-opacity">Contact</a></li>
                  <li><a href="#" className="hover:opacity-100 transition-opacity">FAQs</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Legal</h4>
                <ul className="space-y-2 text-sm opacity-70">
                  <li><a href="#" className="hover:opacity-100 transition-opacity">Privacy</a></li>
                  <li><a href="#" className="hover:opacity-100 transition-opacity">Terms</a></li>
                  <li><a href="#" className="hover:opacity-100 transition-opacity">Compliance</a></li>
                </ul>
              </div>
            </div>
            <div className="ticket-perforation mt-8 pt-8 opacity-40">
              <p className="text-center text-sm">
                © 2026 QuickEats. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
