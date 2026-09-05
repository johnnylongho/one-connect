import { NextRequest, NextResponse } from 'next/server';
import { submitMarketLead, updateMarketLeadStatus, PackageType } from '@/lib/services/market-demand-service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { packageType, fullName, phone, email, companyName, organizationType, notes, source } = body;

    if (!packageType || !fullName || !phone) {
      return NextResponse.json(
        { error: 'Vui lòng điền đầy đủ Họ tên, Số điện thoại và Gói dịch vụ quan tâm.' },
        { status: 400 }
      );
    }

    const result = await submitMarketLead({
      packageType: packageType as PackageType,
      fullName,
      phone,
      email,
      companyName,
      organizationType,
      notes,
      source,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Submit lead API error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { leadId, status } = body;

    if (!leadId || !status) {
      return NextResponse.json({ error: 'Missing leadId or status' }, { status: 400 });
    }

    const success = await updateMarketLeadStatus(leadId, status);
    return NextResponse.json({ success });
  } catch (error: any) {
    console.error('Update lead API error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
