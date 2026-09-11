import { supabase, isSupabaseConfigured } from './supabase-client';
import { Event, EventRegistration } from '@/lib/types';
import { INITIAL_EVENTS, INITIAL_REGISTRATIONS } from '@/lib/mock-data';

export async function getEvents(): Promise<Event[]> {
  const client = supabase;
  if (!isSupabaseConfigured() || !client) {
    return INITIAL_EVENTS;
  }

  try {
    const { data, error } = await client
      .from('events')
      .select('*, organizations(name)')
      .order('start_time', { ascending: true });

    if (error || !data || data.length === 0) {
      return INITIAL_EVENTS;
    }

    const eventsWithCounts = await Promise.all(
      data.map(async (e: any) => {
        const [{ count: regCount }, { count: chkCount }] = await Promise.all([
          client
            .from('event_registrations')
            .select('*', { count: 'exact', head: true })
            .eq('event_id', e.id),
          client
            .from('check_ins')
            .select('*', { count: 'exact', head: true })
            .eq('event_id', e.id),
        ]);

        return {
          id: e.id,
          organizationId: e.organization_id || 'org-001',
          organizationName: e.organizations?.name || 'Hiệp hội Doanh nhân Aplusvn',
          name: e.title || e.name || 'Sự kiện Doanh nhân',
          slug: e.slug || `event-${e.id}`,
          description: e.description || undefined,
          bannerUrl: e.banner_url || undefined,
          startAt: e.start_time || e.start_at || new Date().toISOString(),
          endAt: e.end_time || e.end_at || new Date().toISOString(),
          locationName: e.location || e.location_name || 'Trung tâm Hội nghị',
          address: e.address || undefined,
          registrationCount: regCount ?? e.registration_count ?? 0,
          checkInCount: chkCount ?? e.check_in_count ?? 0,
          capacity: e.capacity || 200,
          status: e.status || 'PUBLISHED',
        };
      })
    );

    return eventsWithCounts;
  } catch (err) {
    console.warn('Failed to fetch events from Supabase:', err);
    return INITIAL_EVENTS;
  }
}

export async function getEventRegistrations(eventId: string): Promise<EventRegistration[]> {
  if (!isSupabaseConfigured() || !supabase) {
    return INITIAL_REGISTRATIONS.filter(r => r.eventId === eventId);
  }

  try {
    const { data, error } = await supabase
      .from('event_registrations')
      .select('*')
      .eq('event_id', eventId);

    if (error || !data || data.length === 0) {
      return INITIAL_REGISTRATIONS.filter(r => r.eventId === eventId);
    }

    return data.map(r => ({
      id: r.id,
      eventId: r.event_id,
      personIdentityId: r.person_identity_id,
      registrationStatus: r.status || r.registration_status || 'CONFIRMED',
      registeredAt: r.registered_at || r.created_at || new Date().toISOString(),
      ticketType: r.ticket_tier || r.ticket_type || 'STANDARD',
      invitationCode: r.invitation_code || r.qr_code_hash || undefined,
    }));
  } catch (err) {
    console.warn('Failed to fetch registrations from Supabase:', err);
    return INITIAL_REGISTRATIONS.filter(r => r.eventId === eventId);
  }
}
