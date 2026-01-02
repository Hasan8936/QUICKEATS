'use client';

import React, { useState } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Users, ShoppingCart, Clock } from 'lucide-react';
import { zones } from '@/entities/mockData';
import { calculateSurgeMultiplier } from '@/lib/surgeEngine';
import { Zone } from '@/types';

type ZoneWithPerformance = Zone & {
  revenue: number;
  surge: number;
};

export default function AnalyticsPage() {
  const [timePeriod, setTimePeriod] = useState('month');

  // Mock analytics data
  const analyticsData = {
    totalOrders: 4256,
    totalRevenue: 1850000,
    avgOrderValue: 435,
    activeCustomers: 8234,
    avgDeliveryTime: 32,
    customerRating: 4.7,
  };

  const revenueBreakdown = [
    { label: 'Delivery Fees', value: 620000, percentage: 33.5, color: 'orange' },
    { label: 'Subscription', value: 410000, percentage: 22.2, color: 'blue' },
    { label: 'Surcharge', value: 580000, percentage: 31.4, color: 'danger' },
    { label: 'Commissions', value: 240000, percentage: 12.9, color: 'success' },
  ];

  const zonePerformance: ZoneWithPerformance[] = zones.map((zone: Zone) => ({
    ...zone,
    surge: calculateSurgeMultiplier(zone),
    revenue: Math.random() * 500000,
  }));

  const formatCurrency = (value: number) => {
    return `₹${(value / 100000).toFixed(1)}L`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">
          Analytics Dashboard
        </h1>
        <p className="text-[var(--color-text-muted)]">
          Comprehensive business metrics and real-time insights
        </p>
      </div>

      {/* Time Period Selector */}
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
          value={analyticsData.totalOrders.toLocaleString('en-IN')}
          trend={12}
          icon={<ShoppingCart className="w-6 h-6 text-[var(--color-primary-orange)]" />}
        />
        <KPICard
          title="Total Revenue"
          value={formatCurrency(analyticsData.totalRevenue)}
          trend={18}
          icon={<DollarSign className="w-6 h-6 text-[var(--color-success)]" />}
        />
        <KPICard
          title="Avg Order Value"
          value={`₹${analyticsData.avgOrderValue}`}
          trend={5}
          icon={<TrendingUp className="w-6 h-6 text-blue-500" />}
        />
        <KPICard
          title="Active Customers"
          value={analyticsData.activeCustomers.toLocaleString('en-IN')}
          trend={8}
          icon={<Users className="w-6 h-6 text-purple-500" />}
        />
        <KPICard
          title="Avg Delivery Time"
          value={`${analyticsData.avgDeliveryTime} min`}
          trend={-3}
          icon={<Clock className="w-6 h-6 text-indigo-500" />}
        />
        <KPICard
          title="Customer Rating"
          value={`${analyticsData.customerRating} ⭐`}
          trend={2}
          icon={<TrendingUp className="w-6 h-6 text-yellow-500" />}
        />
      </div>

      {/* Charts & Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Orders Trend */}
        <div className="card p-6">
          <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-4">
            Orders Trend
          </h3>
          <div className="h-64 bg-[var(--color-background)] rounded-lg flex items-end gap-1 p-4">
            {[45, 52, 48, 61, 55, 72, 68, 75, 82, 78, 88, 92].map((value, idx) => (
              <div
                key={idx}
                className="flex-1 bg-[var(--color-primary-orange)] rounded-t-lg hover:bg-[var(--color-primary-orange-dark)] transition-colors cursor-pointer"
                style={{ height: `${(value / 100) * 100}%` }}
                title={`${value} orders`}
              />
            ))}
          </div>
          <p className="text-xs text-[var(--color-text-muted)] mt-4">
            📊 Last 12 days showing upward delivery trajectory
          </p>
        </div>

        {/* Revenue Breakdown */}
        <div className="card p-6">
          <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-4">
            Revenue Breakdown
          </h3>
          <div className="space-y-4">
            {revenueBreakdown.map((item, idx) => (
              <RevenueItem key={idx} {...item} />
            ))}
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
                <th className="px-4 py-3 text-left font-bold text-[var(--color-text-primary)] text-sm">
                  Zone
                </th>
                <th className="px-4 py-3 text-left font-bold text-[var(--color-text-primary)] text-sm">
                  Orders
                </th>
                <th className="px-4 py-3 text-left font-bold text-[var(--color-text-primary)] text-sm">
                  Revenue
                </th>
                <th className="px-4 py-3 text-left font-bold text-[var(--color-text-primary)] text-sm">
                  Surge
                </th>
                <th className="px-4 py-3 text-left font-bold text-[var(--color-text-primary)] text-sm">
                  Partners
                </th>
              </tr>
            </thead>
            <tbody>
              {zonePerformance.map((zone, idx) => (
                <tr
                  key={zone.id}
                  className={`border-b border-[var(--color-border)] ${
                    idx % 2 === 0 ? 'bg-white' : 'bg-[var(--color-background)]'
                  }`}
                >
                  <td className="px-4 py-4 font-medium text-[var(--color-text-primary)] text-sm">
                    {zone.name.split(' - ')[1]}
                  </td>
                  <td className="px-4 py-4 font-medium text-[var(--color-text-primary)] text-sm">
                    {zone.ordersInZone}
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

      {/* Recent Orders */}
      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--color-border)]">
          <h2 className="text-lg font-bold text-[var(--color-text-primary)]">
            Recent Orders
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[var(--color-background)] border-b border-[var(--color-border)]">
              <tr>
                <th className="px-6 py-3 text-left font-bold text-[var(--color-text-primary)] text-sm">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left font-bold text-[var(--color-text-primary)] text-sm">
                  Customer
                </th>
                <th className="px-6 py-3 text-left font-bold text-[var(--color-text-primary)] text-sm">
                  Restaurant
                </th>
                <th className="px-6 py-3 text-left font-bold text-[var(--color-text-primary)] text-sm">
                  Amount
                </th>
                <th className="px-6 py-3 text-left font-bold text-[var(--color-text-primary)] text-sm">
                  Status
                </th>
                <th className="px-6 py-3 text-left font-bold text-[var(--color-text-primary)] text-sm">
                  Time
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  id: '#ORD-4256',
                  customer: 'Rajesh K.',
                  restaurant: 'Bukhara',
                  amount: '₹480',
                  status: 'Delivered',
                  time: '2 min ago',
                },
                {
                  id: '#ORD-4255',
                  customer: 'Priya S.',
                  restaurant: 'Natraj',
                  amount: '₹320',
                  status: 'Delivered',
                  time: '15 min ago',
                },
                {
                  id: '#ORD-4254',
                  customer: 'Amit P.',
                  restaurant: 'Biryani House',
                  amount: '₹650',
                  status: 'Delivered',
                  time: '28 min ago',
                },
                {
                  id: '#ORD-4253',
                  customer: 'Neha V.',
                  restaurant: 'Pizza Hut',
                  amount: '₹520',
                  status: 'In Transit',
                  time: '12 min ago',
                },
                {
                  id: '#ORD-4252',
                  customer: 'Vikram S.',
                  restaurant: 'Momos Corner',
                  amount: '₹280',
                  status: 'Preparing',
                  time: '5 min ago',
                },
              ].map((order, idx) => (
                <tr
                  key={idx}
                  className={`border-b border-[var(--color-border)] ${
                    idx % 2 === 0 ? 'bg-white' : 'bg-[var(--color-background)]'
                  }`}
                >
                  <td className="px-6 py-4 font-medium text-[var(--color-text-primary)] text-sm">
                    {order.id}
                  </td>
                  <td className="px-6 py-4 text-[var(--color-text-secondary)] text-sm">
                    {order.customer}
                  </td>
                  <td className="px-6 py-4 text-[var(--color-text-secondary)] text-sm">
                    {order.restaurant}
                  </td>
                  <td className="px-6 py-4 font-bold text-[var(--color-primary-orange)] text-sm">
                    {order.amount}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                        order.status === 'Delivered'
                          ? 'bg-[var(--color-success)] bg-opacity-10 text-[var(--color-success)]'
                          : order.status === 'In Transit'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-[var(--color-warning)] bg-opacity-10 text-[var(--color-warning)]'
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[var(--color-text-muted)] text-sm">
                    {order.time}
                  </td>
                </tr>
              ))}
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
  trend,
  icon,
}: {
  title: string;
  value: string | number;
  trend: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="card p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-[var(--color-text-muted)] font-medium">{title}</p>
          <p className="text-2xl font-bold text-[var(--color-text-primary)] mt-2">{value}</p>
          <div
            className={`flex items-center gap-1 mt-2 ${
              trend > 0 ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]'
            }`}
          >
            {trend > 0 ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span className="text-xs font-medium">{Math.abs(trend)}%</span>
          </div>
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
  value: number;
  percentage: number;
  color: string;
}) {
  const colorMap = {
    orange: 'bg-[var(--color-primary-orange)]',
    blue: 'bg-blue-500',
    danger: 'bg-[var(--color-danger)]',
    success: 'bg-[var(--color-success)]',
  };

  const key = color as keyof typeof colorMap;

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-[var(--color-text-secondary)]">{label}</span>
        <span className="text-sm font-bold text-[var(--color-text-primary)]">
          {percentage.toFixed(1)}%
        </span>
      </div>
      <div className="w-full bg-[var(--color-background)] rounded-full h-2">
        <div className={`${colorMap[key]} h-2 rounded-full transition-all`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}
