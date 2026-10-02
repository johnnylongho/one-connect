import { NextResponse } from 'next/server';
import { getMarketDemandSummary } from '@/lib/services/market-demand-service';

export async function GET() {
  try {
    const stats = await getMarketDemandSummary();
    return NextResponse.json(stats);
  } catch (error: any) {
    console.error('Stats API error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
