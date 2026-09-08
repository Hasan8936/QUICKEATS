import { NextRequest, NextResponse } from 'next/server';
import { getPartners } from '@/lib/queries';

export async function GET(request: NextRequest) {
  try {
    const zone = request.nextUrl.searchParams.get('zone') ?? undefined;
    const status = request.nextUrl.searchParams.get('status') ?? undefined;
    const partners = await getPartners({ zone, status });
    return NextResponse.json(partners);
  } catch (error) {
    console.error('GET /api/partners failed:', error);
    return NextResponse.json({ error: 'Failed to fetch partners' }, { status: 500 });
  }
}
