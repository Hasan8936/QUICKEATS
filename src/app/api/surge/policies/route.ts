import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { SurgePolicy } from '@/models/SurgePolicy';
import { Zone } from '@/models/Zone';
import { checkRateLimit } from '@/lib/rateLimit';

export async function GET() {
  try {
    await connectToDatabase();
    const policies = await SurgePolicy.find().lean();
    const zones = await Zone.find().lean();
    const zoneNameById = new Map(zones.map((z) => [z.id, z.name]));

    const withZoneName = policies.map((p) => ({
      ...p,
      zoneName: zoneNameById.get(p.zoneId) ?? p.zoneId,
    }));

    return NextResponse.json(withZoneName);
  } catch (error) {
    console.error('GET /api/surge/policies failed:', error);
    return NextResponse.json({ error: 'Failed to fetch surge policies' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') ?? 'unknown';
  if (!checkRateLimit(`surge-policy:${ip}`)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  try {
    const { zoneId, multiplier, threshold } = await request.json();

    if (!zoneId || typeof multiplier !== 'number' || typeof threshold !== 'number') {
      return NextResponse.json(
        { error: 'zoneId, multiplier, and threshold are required' },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const policy = await SurgePolicy.findOneAndUpdate(
      { zoneId },
      { zoneId, multiplier, threshold },
      { upsert: true, new: true }
    );

    return NextResponse.json({ message: `Surge policy updated for ${zoneId}`, policy });
  } catch (error) {
    console.error('POST /api/surge/policies failed:', error);
    return NextResponse.json({ error: 'Failed to update surge policy' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const zoneId = request.nextUrl.searchParams.get('zoneId');
  if (!zoneId) {
    return NextResponse.json({ error: 'zoneId query param is required' }, { status: 400 });
  }

  try {
    await connectToDatabase();
    await SurgePolicy.deleteOne({ zoneId });
    return NextResponse.json({ message: `Surge policy removed for ${zoneId}` });
  } catch (error) {
    console.error('DELETE /api/surge/policies failed:', error);
    return NextResponse.json({ error: 'Failed to delete surge policy' }, { status: 500 });
  }
}
