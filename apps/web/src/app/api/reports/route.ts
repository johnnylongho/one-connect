import { NextResponse } from 'next/server';
import { getEventKpiReport, generateGuardedCsvReport } from '@/lib/services/reports';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const eventId = searchParams.get('eventId') || 'evt-001';
  const format = searchParams.get('format');

  if (format === 'csv') {
    const csvContent = generateGuardedCsvReport(eventId);
    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="one_connect_kpi_report_${eventId}.csv"`,
      },
    });
  }

  const report = await getEventKpiReport(eventId);
  return NextResponse.json({ success: true, report });
}
