'use client';

import React, { useState } from 'react';
import { deliveryPartners, zones } from '@/entities/mockData';
import { Star, MapPin, Bike, Truck } from 'lucide-react';

export default function PartnersPage() {
  const [selectedZone, setSelectedZone] = useState(zones[0]);
  const [filterStatus, setFilterStatus] = useState<'all' | 'available' | 'busy' | 'offline'>('all');

  const zonePartners = deliveryPartners.filter((p) => p.zone === selectedZone.id);

  const filteredPartners =
    filterStatus === 'all'
      ? zonePartners
      : zonePartners.filter((p) => p.status === filterStatus);

  const getVehicleIcon = (vehicle: string) => {
    switch (vehicle.toLowerCase()) {
      case 'bike':
        return <Bike className="w-5 h-5" />;
      case 'scooter':
        return <Bike className="w-5 h-5" />;
      case 'car':
        return <Truck className="w-5 h-5" />;
      default:
        return <Bike className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-[var(--color-success)] bg-opacity-10 text-[var(--color-success)]';
      case 'busy':
        return 'bg-[var(--color-warning)] bg-opacity-10 text-[var(--color-warning)]';
      case 'offline':
        return 'bg-[var(--color-text-muted)] bg-opacity-10 text-[var(--color-text-muted)]';
      default:
        return '';
    }
  };

  const stats = {
    available: zonePartners.filter((p) => p.status === 'available').length,
    busy: zonePartners.filter((p) => p.status === 'busy').length,
    offline: zonePartners.filter((p) => p.status === 'offline').length,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">
          Delivery Partners
        </h1>
        <p className="text-[var(--color-text-muted)]">
          Manage and monitor delivery partners in {selectedZone.name}
        </p>
      </div>

      {/* Zone & Filter Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div>
          <label className="block text-sm font-semibold text-[var(--color-text-primary)] mb-2">
            Select Zone
          </label>
          <select
            value={selectedZone.id}
            onChange={(e) => {
              const zone = zones.find((z) => z.id === e.target.value);
              if (zone) setSelectedZone(zone);
            }}
            className="w-full px-4 py-2 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-orange)]"
          >
            {zones.map((zone) => (
              <option key={zone.id} value={zone.id}>
                {zone.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-[var(--color-text-primary)] mb-2">
            Filter by Status
          </label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="w-full px-4 py-2 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-orange)]"
          >
            <option value="all">All Partners</option>
            <option value="available">Available</option>
            <option value="busy">Busy</option>
            <option value="offline">Offline</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        <div className="card p-4">
          <p className="text-sm text-[var(--color-text-muted)] mb-1">Total Partners</p>
          <p className="text-2xl font-bold text-[var(--color-text-primary)]">
            {zonePartners.length}
          </p>
        </div>
        <div className="card p-4 border-l-4 border-[var(--color-success)]">
          <p className="text-sm text-[var(--color-success)] font-semibold mb-1">Available</p>
          <p className="text-2xl font-bold text-[var(--color-text-primary)]">
            {stats.available}
          </p>
        </div>
        <div className="card p-4 border-l-4 border-[var(--color-warning)]">
          <p className="text-sm text-[var(--color-warning)] font-semibold mb-1">Busy</p>
          <p className="text-2xl font-bold text-[var(--color-text-primary)]">
            {stats.busy}
          </p>
        </div>
        <div className="card p-4 border-l-4 border-[var(--color-text-muted)]">
          <p className="text-sm text-[var(--color-text-muted)] font-semibold mb-1">Offline</p>
          <p className="text-2xl font-bold text-[var(--color-text-primary)]">
            {stats.offline}
          </p>
        </div>
      </div>

      {/* Partners Grid */}
      {filteredPartners.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPartners.map((partner) => (
            <div key={partner.id} className="card overflow-hidden hover:shadow-[var(--shadow-md)] transition-shadow">
              {/* Partner Info */}
              <div className="p-4 border-b border-[var(--color-border)]">
                <div className="flex items-start gap-4 mb-4">
                  <img
                    src={partner.image}
                    alt={partner.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-[var(--color-text-primary)]">
                      {partner.name}
                    </h3>
                    <div className="flex items-center gap-1 mt-1 text-sm text-[var(--color-text-muted)]">
                      <MapPin className="w-4 h-4" />
                      <span>{partner.zone}</span>
                    </div>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                      partner.status
                    )}`}
                  >
                    <span className="capitalize">{partner.status}</span>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold text-sm">{partner.rating}</span>
                  <span className="text-xs text-[var(--color-text-muted)]">
                    ({partner.totalDeliveries} deliveries)
                  </span>
                </div>
              </div>

              {/* Details */}
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--color-text-muted)] flex items-center gap-2">
                    {getVehicleIcon(partner.vehicle)}
                    {partner.vehicle}
                  </span>
                  <span className="text-sm font-semibold text-[var(--color-text-primary)]">
                    Active
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--color-text-muted)]">Total Earnings</span>
                  <span className="font-bold text-[var(--color-primary-orange)]">
                    ₹{partner.earnings.toLocaleString('en-IN')}
                  </span>
                </div>

                <button className="w-full mt-2 py-2 px-3 bg-[var(--color-background)] hover:bg-[var(--color-border)] rounded-lg font-semibold text-sm transition-colors">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card p-12 text-center">
          <p className="text-[var(--color-text-muted)]">
            No partners found with the selected filters.
          </p>
        </div>
      )}
    </div>
  );
}
