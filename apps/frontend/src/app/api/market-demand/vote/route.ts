import { NextRequest, NextResponse } from 'next/server';
import { recordMarketVote, getMarketVotes, PackageType } from '@/lib/services/market-demand-service';

export async function GET() {
  try {
    const data = await getMarketVotes();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Get market votes error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { packageType, metadata } = body;

    const validPackages: PackageType[] = ['ENTREPRENEUR', 'MICE_ENTERPRISE', 'ASSOCIATION'];
    if (!packageType || !validPackages.includes(packageType)) {
      return NextResponse.json({ error: 'Invalid packageType' }, { status: 400 });
    }

    await recordMarketVote(packageType as PackageType, metadata);
    const updatedVotes = await getMarketVotes();

    return NextResponse.json({
      success: true,
      packageType,
      ...updatedVotes,
    });
  } catch (error: any) {
    console.error('Vote market demand error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
