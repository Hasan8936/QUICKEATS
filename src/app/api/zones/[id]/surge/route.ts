import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Zone, Order } from '@/db/mongoose/models';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const zone = await Zone.findById(params.id);
    if (!zone) {
      return NextResponse.json(
        { success: false, error: 'Zone not found' },
        { status: 404 }
      );
    }

    // Calculate surge multiplier based on active orders and available partners
    const activeOrders = await Order.countDocuments({
      status: { $in: ['pending', 'confirmed', 'preparing', 'out_for_delivery'] },
    });

    const availablePartners = zone.deliveryPartnersAvailable || 1;
    const loadRatio = activeOrders / (availablePartners + 1);

    let surgeMultiplier = 1.0;
    if (loadRatio > 5) surgeMultiplier = 1.5;
    else if (loadRatio > 3) surgeMultiplier = 1.25;
    else if (loadRatio > 1) surgeMultiplier = 1.1;

    // Update zone with new surge multiplier
    zone.surgeMultiplier = surgeMultiplier;
    zone.ordersInZone = activeOrders;
    await zone.save();

    return NextResponse.json(
      {
        success: true,
        data: {
          zoneId: zone._id,
          multiplier: surgeMultiplier,
          activeOrders,
          availablePartners,
          loadRatio,
          estimatedWait: Math.ceil(30 + loadRatio * 5),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('GET /api/zones/[id]/surge error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch surge data' },
      { status: 500 }
    );
  }
}
