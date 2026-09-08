import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Order } from '@/models/Order';
import { Zone } from '@/models/Zone';
import { Restaurant } from '@/models/Restaurant';
import { calculateSurgeMultiplier } from '@/lib/surgeEngine';

export async function GET() {
  try {
    await connectToDatabase();

    const [totals, ordersByZone, zones, restaurantStats, dailyTrend] = await Promise.all([
      Order.aggregate([
        {
          $group: {
            _id: null,
            totalOrders: { $sum: 1 },
            totalRevenue: { $sum: '$finalAmount' },
            avgOrderValue: { $avg: '$finalAmount' },
            foodSubtotal: { $sum: '$totalAmount' },
            deliveryFeeRevenue: { $sum: '$deliveryFee' },
            deliveredCount: {
              $sum: { $cond: [{ $eq: ['$status', 'delivered'] }, 1, 0] },
            },
          },
        },
      ]),
      Order.aggregate([
        { $group: { _id: '$zone', revenue: { $sum: '$finalAmount' }, orders: { $sum: 1 } } },
      ]),
      Zone.find().lean(),
      Restaurant.aggregate([
        { $group: { _id: null, avgRating: { $avg: '$rating' } } },
      ]),
      Order.aggregate([
        {
          $match: {
            createdAt: { $gte: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000) },
          },
        },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
    ]);

    const summary = totals[0] ?? {
      totalOrders: 0,
      totalRevenue: 0,
      avgOrderValue: 0,
      foodSubtotal: 0,
      deliveryFeeRevenue: 0,
      deliveredCount: 0,
    };

    const revenueByZoneId = new Map(ordersByZone.map((z) => [z._id, z]));

    const zonePerformance = await Promise.all(
      zones.map(async (zone) => {
        const surge = await calculateSurgeMultiplier(zone.id);
        const zoneOrders = revenueByZoneId.get(zone.id);
        return {
          ...zone,
          surge: surge.multiplier,
          revenue: zoneOrders?.revenue ?? 0,
          orders: zoneOrders?.orders ?? 0,
        };
      })
    );

    const avgEstimatedWait = zones.length
      ? zones.reduce((sum, z) => sum + z.estimatedWait, 0) / zones.length
      : 0;

    return NextResponse.json({
      totalOrders: summary.totalOrders,
      totalRevenue: summary.totalRevenue,
      avgOrderValue: Math.round(summary.avgOrderValue || 0),
      deliveredOrders: summary.deliveredCount,
      avgEstimatedWait: Math.round(avgEstimatedWait),
      avgRestaurantRating: Number((restaurantStats[0]?.avgRating ?? 0).toFixed(1)),
      revenueBreakdown: {
        foodSubtotal: summary.foodSubtotal,
        deliveryFees: summary.deliveryFeeRevenue,
      },
      dailyOrderCounts: dailyTrend.map((d) => ({ date: d._id, count: d.count })),
      zonePerformance,
    });
  } catch (error) {
    console.error('GET /api/analytics failed:', error);
    return NextResponse.json({ error: 'Failed to compute analytics' }, { status: 500 });
  }
}
