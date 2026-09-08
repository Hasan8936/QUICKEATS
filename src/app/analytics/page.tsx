'use client';

import React, { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, ShoppingCart, Clock, Star } from 'lucide-react';

interface ZonePerformance {
  id: string;
  name: string;
  ordersInZone: number;
  deliveryPartnersAvailable: number;
  estimatedWait: number;
  surge: number;
  revenue: number;
  orders: number;
}

interface AnalyticsData {
  totalOrders: number;
  totalRevenue: number;
  avgOrderValue: number;
  deliveredOrders: number;
  avgEstimatedWait: number;
  avgRestaurantRating: number;
  revenueBreakdown: { foodSubtotal: number; deliveryFees: number };
  dailyOrderCounts: { date: string; count: number }[];
  zonePerformance: ZonePerformance[];
}

interface RecentOrder {
  _id: string;
  restaurantId: string;
  finalAmount: number;
  status: string;
  createdAt: string;
}

export default function AnalyticsPage() {
  const [timePeriod, setTimePeriod] = useState('month');
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [restaurantNames, setRestaurantNames] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [analyticsRes, ordersRes, restaurantsRes] = await Promise.all([
        fetch('/api/analytics').then((r) => r.json()),
        fetch('/api/orders?limit=5').then((r) => r.json()),
        fetch('/api/restaurants').then((r) => r.json()),
      ]);
      setAnalytics(analyticsRes);
      setRecentOrders(ordersRes);
      setRestaurantNames(
        Object.fromEntries(restaurantsRes.map((r: { id: string; name: string }) => [r.id, r.name]))
      );
      setLoading(false);
    };
    load();
  }, []);

  const formatCurrency = (value: number) => `₹${(value / 100000).toFixed(1)}L`;
  const relativeTime = (iso: string) => {
    const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins} min ago`;
    return `${Math.round(mins / 60)} hr ago`;
  };

  if (loading || !analytics) {
    return <div className="p-8 text-center text-[var(--color-text-muted)]">Loading analytics…</div>;
  }

  const maxDailyCount = Math.max(1, ...analytics.dailyOrderCounts.map((d) => d.count));
  const totalRevenueForSplit =
    analytics.revenueBreakdown.foodSubtotal + analytics.revenueBreakdown.deliveryFees || 1;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">
          Analytics Dashboard
        </h1>
        <p className="text-[var(--color-text-muted)]">
          Live metrics computed from the orders database
        </p>
      </div>

      {/* Time Period Selector — note: metrics below are all-time; per-period
          breakdowns would need date filters added to the /api/analytics
          aggregation. Kept as a UI affordance for a future iteration. */}
      <div className="mb-8 flex gap-2 flex-wrap">
        {['Today', 'Week', 'Month', 'Year'].map((period) => (
          <button
            key={period}
            onClick={() => setTimePeriod(period.toLowerCase())}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              timePeriod === period.toLowerCase()
                ? 'bg-[var(--color-primary-orange)] text-white'
                : 'bg-white text-[var(--color-text-primary)] border border-[var(--color-border)] hover:border-[var(--color-primary-orange)]'
            }`}
          >
            {period}
          </button>
        ))}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <KPICard
          title="Total Orders"
          value={analytics.totalOrders.toLocaleString('en-IN')}
          icon={<ShoppingCart className="w-6 h-6 text-[var(--color-primary-orange)]" />}
        />
        <KPICard
          title="Total Revenue"
          value={formatCurrency(analytics.totalRevenue)}
          icon={<DollarSign className="w-6 h-6 text-[var(--color-success)]" />}
        />
        <KPICard
          title="Avg Order Value"
          value={`₹${analytics.avgOrderValue}`}
          icon={<TrendingUp className="w-6 h-6 text-blue-500" />}
        />
        <KPICard
          title="Delivered Orders"
          value={analytics.deliveredOrders.toLocaleString('en-IN')}
          icon={<ShoppingCart className="w-6 h-6 text-purple-500" />}
        />
        <KPICard
          title="Avg. Est. Delivery Time"
          value={`${analytics.avgEstimatedWait} min`}
          icon={<Clock className="w-6 h-6 text-indigo-500" />}
        />
        <KPICard
          title="Avg. Restaurant Rating"
          value={`${analytics.avgRestaurantRating} ⭐`}
          icon={<Star className="w-6 h-6 text-yellow-500" />}
        />
      </div>

      {/* Charts & Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Orders Trend — real daily counts from the last 12 days */}
        <div className="card p-6">
          <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-4">
            Orders Trend (last 12 days)
          </h3>
          {analytics.dailyOrderCounts.length > 0 ? (
            <div className="h-64 bg-[var(--color-background)] rounded-lg flex items-end gap-1 p-4">
              {analytics.dailyOrderCounts.map((day) => (
                <div
                  key={day.date}
                  className="flex-1 bg-[var(--color-primary-orange)] rounded-t-lg hover:bg-[var(--color-primary-orange-dark)] transition-colors cursor-pointer"
                  style={{ height: `${(day.count / maxDailyCount) * 100}%` }}
                  title={`${day.date}: ${day.count} orders`}
                />
              ))}
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-[var(--color-text-muted)] text-sm">
              No orders placed in the last 12 days yet.
            </div>
          )}
        </div>

        {/* Revenue Breakdown — real split between food subtotal and delivery fees */}
        <div className="card p-6">
          <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-4">
            Revenue Breakdown
          </h3>
          <div className="space-y-4">
            <RevenueItem
              label="Food Subtotal"
              percentage={(analytics.revenueBreakdown.foodSubtotal / totalRevenueForSplit) * 100}
              color="orange"
            />
            <RevenueItem
              label="Delivery Fees (incl. surge)"
              percentage={(analytics.revenueBreakdown.deliveryFees / totalRevenueForSplit) * 100}
              color="blue"
            />
          </div>
        </div>
      </div>

      {/* Zone Performance */}
      <div className="card p-6 mb-8">
        <h2 className="text-lg font-bold text-[var(--color-text-primary)] mb-4">
          Zone Performance
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[var(--color-background)] border-b border-[var(--color-border)]">
              <tr>
                <th className="px-4 py-3 text-left font-bold text-[var(--color-text-primary)] text-sm">Zone</th>
                <th className="px-4 py-3 text-left font-bold text-[var(--color-text-primary)] text-sm">Orders</th>
                <th className="px-4 py-3 text-left font-bold text-[var(--color-text-primary)] text-sm">Revenue</th>
                <th className="px-4 py-3 text-left font-bold text-[var(--color-text-primary)] text-sm">Surge</th>
                <th className="px-4 py-3 text-left font-bold text-[var(--color-text-primary)] text-sm">Partners</th>
              </tr>
            </thead>
            <tbody>
              {analytics.zonePerformance.map((zone, idx) => (
                <tr
                  key={zone.id}
                  className={`border-b border-[var(--color-border)] ${
                    idx % 2 === 0 ? 'bg-white' : 'bg-[var(--color-background)]'
                  }`}
                >
                  <td className="px-4 py-4 font-medium text-[var(--color-text-primary)] text-sm">
                    {zone.name.split(' - ')[1] ?? zone.name}
                  </td>
                  <td className="px-4 py-4 font-medium text-[var(--color-text-primary)] text-sm">
                    {zone.orders}
                  </td>
                  <td className="px-4 py-4 font-bold text-[var(--color-primary-orange)] text-sm">
                    {formatCurrency(zone.revenue)}
                  </td>
                  <td className="px-4 py-4 text-sm">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-[var(--color-warning)] bg-opacity-10 text-[var(--color-warning)]">
                      {zone.surge}x
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm">
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Orders — real data, most recent 5 */}
      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--color-border)]">
          <h2 className="text-lg font-bold text-[var(--color-text-primary)]">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[var(--color-background)] border-b border-[var(--color-border)]">
              <tr>
                <th className="px-6 py-3 text-left font-bold text-[var(--color-text-primary)] text-sm">Order ID</th>
                <th className="px-6 py-3 text-left font-bold text-[var(--color-text-primary)] text-sm">Restaurant</th>
                <th className="px-6 py-3 text-left font-bold text-[var(--color-text-primary)] text-sm">Amount</th>
                <th className="px-6 py-3 text-left font-bold text-[var(--color-text-primary)] text-sm">Status</th>
                <th className="px-6 py-3 text-left font-bold text-[var(--color-text-primary)] text-sm">Time</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-[var(--color-text-muted)] text-sm">
                    No orders placed yet.
                  </td>
                </tr>
              ) : (
                recentOrders.map((order, idx) => (
                  <tr
                    key={order._id}
                    className={`border-b border-[var(--color-border)] ${
                      idx % 2 === 0 ? 'bg-white' : 'bg-[var(--color-background)]'
                    }`}
                  >
                    <td className="px-6 py-4 font-medium text-[var(--color-text-primary)] text-sm">
                      #{order._id.slice(-6).toUpperCase()}
                    </td>
                    <td className="px-6 py-4 text-[var(--color-text-secondary)] text-sm">
                      {restaurantNames[order.restaurantId] ?? order.restaurantId}
                    </td>
                    <td className="px-6 py-4 font-bold text-[var(--color-primary-orange)] text-sm">
                      ₹{Math.round(order.finalAmount)}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold capitalize ${
                          order.status === 'delivered'
                            ? 'bg-[var(--color-success)] bg-opacity-10 text-[var(--color-success)]'
                            : order.status === 'pending' || order.status === 'confirmed'
                              ? 'bg-[var(--color-warning)] bg-opacity-10 text-[var(--color-warning)]'
                              : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[var(--color-text-muted)] text-sm">
                      {relativeTime(order.createdAt)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function KPICard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}) {
  return (
    <div className="card p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-[var(--color-text-muted)] font-medium">{title}</p>
          <p className="text-2xl font-bold text-[var(--color-text-primary)] mt-2">{value}</p>
        </div>
        <div>{icon}</div>
      </div>
    </div>
  );
}

function RevenueItem({
  label,
  percentage,
  color,
}: {
  label: string;
  percentage: number;
  color: 'orange' | 'blue';
}) {
  const colorMap = {
    orange: 'bg-[var(--color-primary-orange)]',
    blue: 'bg-blue-500',
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-[var(--color-text-secondary)]">{label}</span>
        <span className="text-sm font-bold text-[var(--color-text-primary)]">
          {percentage.toFixed(1)}%
        </span>
      </div>
      <div className="w-full bg-[var(--color-background)] rounded-full h-2">
        <div
          className={`${colorMap[color]} h-2 rounded-full transition-all`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
