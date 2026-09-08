import { NextRequest, NextResponse } from 'next/server';
import { getRestaurants } from '@/lib/queries';

export async function GET(request: NextRequest) {
  try {
    const zone = request.nextUrl.searchParams.get('zone') ?? undefined;
    const restaurants = await getRestaurants(zone);
    return NextResponse.json(restaurants);
  } catch (error) {
    console.error('GET /api/restaurants failed:', error);
    return NextResponse.json({ error: 'Failed to fetch restaurants' }, { status: 500 });
  }
}
