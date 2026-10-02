import { NextRequest, NextResponse } from 'next/server';
import { trackMarketDemand, PackageType } from '@/lib/services/market-demand-service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { packageType, eventType, metadata } = body;

    if (!packageType || !['ENTREPRENEUR', 'MICE_ENTERPRISE', 'ASSOCIATION'].includes(packageType)) {
      return NextResponse.json({ error: 'Invalid packageType' }, { status: 400 });
    }

    const result = await trackMarketDemand(
      packageType as PackageType,
      eventType || 'CLICK_CTA',
      metadata
    );

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Track demand API error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
