import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Restaurant } from '@/db/mongoose/models';
import { handleMongoDBError } from '@/lib/mongodbError';

export async function GET(request: NextRequest) {
  try {
    // Check if MongoDB URI is configured
    if (!process.env.MONGODB_URI) {
      return NextResponse.json(
        {
          success: false,
          error: 'Database not configured',
          message: 'Please set MONGODB_URI in Vercel environment variables',
          setup: 'See MONGODB_SETUP_GUIDE.md for setup instructions',
        },
        { status: 503 }
      );
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const zoneId = searchParams.get('zoneId');
    const cuisine = searchParams.get('cuisine');
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '20';

    const pageNum = parseInt(page);
    const pageSize = parseInt(limit);
    const skip = (pageNum - 1) * pageSize;

    const filter: any = { status: 'open' };
    if (zoneId) filter.zoneId = zoneId;
    if (cuisine) filter.cuisine = { $in: [cuisine] };

    const restaurants = await Restaurant.find(filter)
      .skip(skip)
      .limit(pageSize)
      .sort({ rating: -1 });

    const total = await Restaurant.countDocuments(filter);

    return NextResponse.json(
      {
        success: true,
        data: restaurants,
        pagination: {
          page: pageNum,
          limit: pageSize,
          total,
          pages: Math.ceil(total / pageSize),
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('GET /api/restaurants error:', error);
    return handleMongoDBError(error);
  }
}
