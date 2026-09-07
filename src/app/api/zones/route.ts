import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Zone } from '@/db/mongoose/models';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const zones = await Zone.find().sort({ name: 1 });

    return NextResponse.json(
      { success: true, data: zones },
      { status: 200 }
    );
  } catch (error) {
    console.error('GET /api/zones error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch zones' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { name, coordinates, polygon } = body;

    if (!name || !coordinates) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const zone = new Zone({
      name,
      coordinates,
      polygon,
      deliveryPartnersAvailable: 0,
      ordersInZone: 0,
      estimatedWait: 30,
      surgeMultiplier: 1.0,
    });

    await zone.save();

    return NextResponse.json(
      { success: true, data: zone },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST /api/zones error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create zone' },
      { status: 500 }
    );
  }
}
