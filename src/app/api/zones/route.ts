import { NextResponse } from 'next/server';
import { getZones } from '@/lib/queries';

export async function GET() {
  try {
    const zones = await getZones();
    return NextResponse.json(zones);
  } catch (error) {
    console.error('GET /api/zones failed:', error);
    return NextResponse.json({ error: 'Failed to fetch zones' }, { status: 500 });
  }
}
