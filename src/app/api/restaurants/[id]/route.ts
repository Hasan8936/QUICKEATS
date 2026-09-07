import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Restaurant, MenuItem, Review } from '@/db/mongoose/models';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const restaurant = await Restaurant.findById(params.id);
    if (!restaurant) {
      return NextResponse.json(
        { success: false, error: 'Restaurant not found' },
        { status: 404 }
      );
    }

    const menuItems = await MenuItem.find({ restaurantId: params.id, availability: true });
    const reviews = await Review.find({ restaurantId: params.id })
      .sort({ createdAt: -1 })
      .limit(10);

    return NextResponse.json(
      {
        success: true,
        data: {
          ...restaurant.toObject(),
          menu: menuItems,
          reviews,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(`GET /api/restaurants/[id] error:`, error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch restaurant' },
      { status: 500 }
    );
  }
}
