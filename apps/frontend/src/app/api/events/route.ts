import { NextResponse } from 'next/server';
import { getEvents, getEventRegistrations } from '@/lib/services/events';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const eventId = searchParams.get('eventId');

  if (eventId) {
    const registrations = await getEventRegistrations(eventId);
    return NextResponse.json({ success: true, eventId, registrations });
  }

  const events = await getEvents();
  return NextResponse.json({ success: true, events });
}
