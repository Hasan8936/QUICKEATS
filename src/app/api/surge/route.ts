import { NextRequest, NextResponse } from 'next/server';
import { calculateSurgeMultiplier } from '@/lib/surgeEngine';

// GET /api/surge?zoneId=zone-1
export async function GET(request: NextRequest) {
  const zoneId = request.nextUrl.searchParams.get('zoneId');
  if (!zoneId) {
    return NextResponse.json({ error: 'zoneId query param is required' }, { status: 400 });
  }

  try {
    const result = await calculateSurgeMultiplier(zoneId);
    return NextResponse.json(result);
  } catch (error) {
    console.error('GET /api/surge failed:', error);
    return NextResponse.json({ error: 'Failed to calculate surge multiplier' }, { status: 500 });
  }
}
