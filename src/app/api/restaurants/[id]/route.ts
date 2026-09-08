import { NextResponse } from 'next/server';
import { getRestaurantById } from '@/lib/queries';

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  try {
    const restaurant = await getRestaurantById(params.id);
    if (!restaurant) {
      return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 });
    }
    return NextResponse.json(restaurant);
  } catch (error) {
    console.error('GET /api/restaurants/[id] failed:', error);
    return NextResponse.json({ error: 'Failed to fetch restaurant' }, { status: 500 });
  }
}
