import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { redis } from '@/lib/redis';
import { checkRateLimit } from '@/lib/rateLimit';

export async function GET() {
  const ip = request.headers.get('x-forwarded-for') ?? 'unknown';
  if (!(await checkRateLimit(ip))) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  try {
    const policies = await prisma.surgePolicy.findMany();
    return NextResponse.json(policies);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch surge policies' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for') ?? 'unknown';
  if (!(await checkRateLimit(ip))) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  try {
    const { zoneId, multiplier, threshold } = await request.json();

    if (!zoneId || typeof multiplier !== 'number' || typeof threshold !== 'number') {
      return NextResponse.json({ error: 'Invalid input: zoneId, multiplier, and threshold are required' }, { status: 400 });
    }

    const policy = await prisma.surgePolicy.upsert({
      where: { zoneId },
      update: { multiplier, threshold },
      create: { zoneId, multiplier, threshold },
    });

    // Invalidate cache so next read recomputes
    await redis.del(`surge:${zoneId}`);
    // Publish update for real-time propagation
    await redis.publish('surge-updates', JSON.stringify({ zoneId, multiplier }));

    return NextResponse.json({ message: `Surge updated for zone ${zoneId}`, policy });
  } catch (error) {
    console.error('Error updating surge policy:', error);
    return NextResponse.json({ error: 'Failed to update surge pricing' }, { status: 500 });
  }
}