import React from 'react';
import { zones } from '@/entities/mockData'; // Import zones instead
import { calculateSurgeMultiplier, getDemandLevel } from '@/lib/surgeEngine';
import { TrendingUp, AlertCircle, Zap, Sliders } from 'lucide-react';
import { SurgeBadge } from '@/components/SurgeBadge';

export default async function SurgePage() {
  // Remove the getZones call, use zones directly
  const zoneData = await Promise.all(
    zones.map(async (zone) => {
      const surgeData = await calculateSurgeMultiplier(zone.name);
      return {
        ...zone,
        surge: surgeData,
        multiplier: surgeData.multiplier || 1.0,
        demand: getDemandLevel(surgeData.multiplier || 1.0),
      };
    })
  );

 

  const currentZone = zoneData[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">
          Surge Pricing Control Panel
        </h1>
        <p className="text-[var(--color-text-muted)]">
          Manage dynamic surge pricing across zones in real-time
        </p>
      </div>

      {/* Zone Selector */}
      <div className="mb-8">
        <label className="block text-sm font-semibold text-[var(--color-text-primary)] mb-3">
          Select Zone
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {zoneData.map((zone) => (
            <button
              key={zone.id}
              onClick={() => {
                const newZone = zones.find((z) => z.id === zone.id);
                if (newZone) setSelectedZone(newZone);
              }}
              className={`p-3 rounded-lg border-2 transition-all ${
                selectedZone.id === zone.id
                  ? 'border-[var(--color-primary-orange)] bg-[var(--color-primary-orange-light)]'
                  : 'border-[var(--color-border)] hover:border-[var(--color-primary-orange)]'
              }`}
            >
              <p className="font-semibold text-sm text-[var(--color-text-primary)]">
                {zone.name.split(' - ')[1]}
              </p>
              <SurgeBadge multiplier={zone.multiplier} showLabel={false} size="sm" />
            </button>
          ))}
        </div>
      </div>

      {/* Main Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="card p-6">
          <div className="flex items-start justify-between mb-2">
            <p className="text-sm text-[var(--color-text-muted)] font-medium">Surge Multiplier</p>
            <Zap className="w-5 h-5 text-[var(--color-primary-orange)]" />
          </div>
          <p className="text-3xl font-bold text-[var(--color-text-primary)]">
            {currentZone.multiplier.toFixed(1)}x
          </p>
        </div>
        <div className="card p-6">
          <div className="flex items-start justify-between mb-2">
            <p className="text-sm text-[var(--color-text-muted)] font-medium">Demand Level</p>
            <AlertCircle className="w-5 h-5 text-[var(--color-warning)]" />
          </div>
          <p className="text-3xl font-bold text-[var(--color-text-primary)] capitalize">
            {currentZone.demand}
          </p>
        </div>
        <div className="card p-6">
          <div className="flex items-start justify-between mb-2">
            <p className="text-sm text-[var(--color-text-muted)] font-medium">Orders in Zone</p>
            <TrendingUp className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-[var(--color-text-primary)]">
            {currentZone.ordersInZone}
          </p>
        </div>
        <div className="card p-6">
          <div className="flex items-start justify-between mb-2">
            <p className="text-sm text-[var(--color-text-muted)] font-medium">Available Partners</p>
            <TrendingUp className="w-5 h-5 text-[var(--color-success)]" />
          </div>
          <p className="text-3xl font-bold text-[var(--color-text-primary)]">
            {currentZone.deliveryPartnersAvailable}
          </p>
        </div>
      </div>

      {/* Configuration Section */}
      <div className="card p-6 mb-8">
        <div className="flex items-center gap-2 mb-6">
          <Sliders className="w-5 h-5 text-[var(--color-primary-orange)]" />
          <h2 className="text-xl font-bold text-[var(--color-text-primary)]">
            Surge Configuration
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Demand Threshold Slider */}
          <div>
            <label className="block text-sm font-semibold text-[var(--color-text-primary)] mb-3">
              Demand Ratio Threshold
            </label>
            <div className="space-y-2">
              <input
                type="range"
                min="1"
                max="10"
                step="0.5"
                value={config.demandThreshold}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    demandThreshold: parseFloat(e.target.value),
                  }))
                }
                className="w-full accent-[var(--color-primary-orange)]"
              />
              <div className="flex justify-between items-center">
                <span className="text-sm text-[var(--color-text-muted)]">
                  1 : {config.demandThreshold.toFixed(1)}
                </span>
                <span className="text-sm font-semibold text-[var(--color-primary-orange)]">
                  {config.demandThreshold > 8
                    ? 'High'
                    : config.demandThreshold > 4
                      ? 'Medium'
                      : 'Low'}
                </span>
              </div>
              <p className="text-xs text-[var(--color-text-muted)]">
                Orders per partner ratio
              </p>
            </div>
          </div>

          {/* Supply Threshold Slider */}
          <div>
            <label className="block text-sm font-semibold text-[var(--color-text-primary)] mb-3">
              Supply Threshold
            </label>
            <div className="space-y-2">
              <input
                type="range"
                min="5"
                max="50"
                step="1"
                value={config.supplyThreshold}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    supplyThreshold: parseInt(e.target.value),
                  }))
                }
                className="w-full accent-[var(--color-primary-orange)]"
              />
              <div className="flex justify-between items-center">
                <span className="text-sm text-[var(--color-text-muted)]">
                  {config.supplyThreshold} partners min
                </span>
                <span className="text-sm font-semibold text-[var(--color-primary-orange)]">
                  {config.supplyThreshold > 30
                    ? 'High'
                    : config.supplyThreshold > 15
                      ? 'Medium'
                      : 'Low'}
                </span>
              </div>
              <p className="text-xs text-[var(--color-text-muted)]">
                Minimum partners needed
              </p>
            </div>
          </div>

          {/* Max Surge Slider */}
          <div>
            <label className="block text-sm font-semibold text-[var(--color-text-primary)] mb-3">
              Maximum Surge Multiplier
            </label>
            <div className="space-y-2">
              <input
                type="range"
                min="1.0"
                max="3.0"
                step="0.1"
                value={config.maxSurge}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    maxSurge: parseFloat(e.target.value),
                  }))
                }
                className="w-full accent-[var(--color-primary-orange)]"
              />
              <div className="flex justify-between items-center">
                <span className="text-sm text-[var(--color-text-muted)]">
                  Up to {config.maxSurge.toFixed(1)}x
                </span>
                <SurgeBadge multiplier={config.maxSurge} showLabel={false} size="sm" />
              </div>
              <p className="text-xs text-[var(--color-text-muted)]">
                Cap on delivery fee increase
              </p>
            </div>
          </div>
        </div>

        <button className="mt-6 w-full py-2 bg-[var(--color-primary-orange)] text-white rounded-lg font-semibold hover:bg-[var(--color-primary-orange-dark)] transition-colors">
          Save Configuration
        </button>
      </div>

      {/* Zone Comparison Table */}
      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--color-border)]">
          <h2 className="text-lg font-bold text-[var(--color-text-primary)]">
            All Zones Comparison
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[var(--color-background)] border-b border-[var(--color-border)]">
              <tr>
                <th className="px-6 py-3 text-left font-bold text-[var(--color-text-primary)]">Zone</th>
                <th className="px-6 py-3 text-left font-bold text-[var(--color-text-primary)]">Surge</th>
                <th className="px-6 py-3 text-left font-bold text-[var(--color-text-primary)]">Demand</th>
                <th className="px-6 py-3 text-left font-bold text-[var(--color-text-primary)]">Orders</th>
                <th className="px-6 py-3 text-left font-bold text-[var(--color-text-primary)]">Partners</th>
                <th className="px-6 py-3 text-left font-bold text-[var(--color-text-primary)]">Est. Wait</th>
              </tr>
            </thead>
            <tbody>
              {zoneData.map((zone, idx) => (
                <tr
                  key={zone.id}
                  className={`border-b border-[var(--color-border)] ${
                    idx % 2 === 0 ? 'bg-white' : 'bg-[var(--color-background)]'
                  } hover:bg-[var(--color-primary-orange-light)] transition-colors`}
                >
                  <td className="px-6 py-4 font-medium text-[var(--color-text-primary)]">
                    {zone.name}
                  </td>
                  <td className="px-6 py-4">
                    <SurgeBadge multiplier={zone.multiplier} size="sm" />
                  </td>
                  <td className="px-6 py-4">
                    <span className="capitalize font-medium text-[var(--color-text-secondary)]">
                      {zone.demand}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-[var(--color-text-primary)]">
                    {zone.ordersInZone}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`font-bold ${
                        zone.deliveryPartnersAvailable > 30
                          ? 'text-[var(--color-success)]'
                          : zone.deliveryPartnersAvailable > 15
                            ? 'text-[var(--color-warning)]'
                            : 'text-[var(--color-danger)]'
                      }`}
                    >
                      {zone.deliveryPartnersAvailable}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[var(--color-text-secondary)]">
                    {zone.estimatedWait} min
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info Section */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-bold text-blue-900 mb-3">📊 How Surge Pricing Works</h3>
        <ul className="text-sm text-blue-800 space-y-2">
          <li className="flex gap-2">
            <span>•</span>
            <span>
              <strong>1.0x - 1.2x:</strong> Normal demand, few orders, many partners available
            </span>
          </li>
          <li className="flex gap-2">
            <span>•</span>
            <span>
              <strong>1.2x - 1.5x:</strong> Medium demand, balanced orders and partners
            </span>
          </li>
          <li className="flex gap-2">
            <span>•</span>
            <span>
              <strong>1.5x - 1.8x:</strong> High demand, more orders than available partners
            </span>
          </li>
          <li className="flex gap-2">
            <span>•</span>
            <span>
              <strong>1.8x+:</strong> Critical demand, severely limited delivery capacity
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
