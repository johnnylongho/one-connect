import { supabase, isSupabaseConfigured } from './supabase-client';
import { Connection, ConnectionNote, Lead } from '@/lib/types';
import { INITIAL_CONNECTIONS, INITIAL_NOTES, INITIAL_LEADS, INITIAL_IDENTITIES } from '@/lib/mock-data';

export async function getConnectionsForIdentity(identityId: string): Promise<{
  connections: Connection[];
  notes: ConnectionNote[];
  leads: Lead[];
}> {
  if (!isSupabaseConfigured() || !supabase) {
    const connections = INITIAL_CONNECTIONS.filter(
      c => c.requesterIdentityId === identityId || c.receiverIdentityId === identityId
    );
    const connectionIds = connections.map(c => c.id);
    const notes = INITIAL_NOTES.filter(n => connectionIds.includes(n.connectionId));
    const leads = INITIAL_LEADS.filter(l => connectionIds.includes(l.connectionId));
    return { connections, notes, leads };
  }

  try {
    const { data: connData } = await supabase
      .from('connections')
      .select('*')
      .or(`requester_identity_id.eq.${identityId},receiver_identity_id.eq.${identityId}`);

    const connections: Connection[] = (connData || []).map(c => {
      const partnerId = c.requester_identity_id === identityId ? c.receiver_identity_id : c.requester_identity_id;
      const partner = INITIAL_IDENTITIES.find(i => i.id === partnerId);
      return {
        id: c.id,
        requesterIdentityId: c.requester_identity_id,
        receiverIdentityId: c.receiver_identity_id,
        status: c.status === 'ACCEPTED' ? 'CONNECTED' : (c.status as any),
        connectedAt: c.responded_at || undefined,
        createdAt: c.requested_at || c.created_at || new Date().toISOString(),
        partner,
        contextEventName: 'Diễn Đàn Kết Nối Doanh Nghiệp Việt Nam 2026',
        notesCount: 1,
      };
    });

    const connIds = connections.map(c => c.id);

    let notes: ConnectionNote[] = [];
    let leads: Lead[] = [];

    if (connIds.length > 0) {
      const { data: notesData } = await supabase
        .from('connection_notes')
        .select('*')
        .in('connection_id', connIds);

      notes = (notesData || []).map(n => ({
        id: n.id,
        connectionId: n.connection_id,
        ownerIdentityId: n.author_identity_id || identityId,
        content: n.content,
        createdAt: n.created_at,
        updatedAt: n.updated_at,
      }));

      const { data: leadsData } = await supabase
        .from('leads')
        .select('*')
        .in('connection_id', connIds);

      leads = (leadsData || []).map(l => ({
        id: l.id,
        connectionId: l.connection_id,
        ownerIdentityId: l.owner_identity_id || identityId,
        status: l.status === 'HOT' ? 'HOT' : l.status === 'WARM' ? 'WARM' : 'NEW',
        estimatedValue: Number(l.potential_value || 0),
        source: 'Sự kiện Offline',
        createdAt: l.created_at || new Date().toISOString(),
        updatedAt: l.updated_at || new Date().toISOString(),
      }));
    }

    return { connections, notes, leads };
  } catch (err) {
    console.warn('Failed to fetch connections from Supabase, using mock fallback:', err);
    const connections = INITIAL_CONNECTIONS.filter(
      c => c.requesterIdentityId === identityId || c.receiverIdentityId === identityId
    );
    const connectionIds = connections.map(c => c.id);
    const notes = INITIAL_NOTES.filter(n => connectionIds.includes(n.connectionId));
    const leads = INITIAL_LEADS.filter(l => connectionIds.includes(l.connectionId));
    return { connections, notes, leads };
  }
}

export async function respondToConnection(
  connectionId: string,
  status: 'ACCEPTED' | 'DECLINED'
): Promise<boolean> {
  if (!isSupabaseConfigured() || !supabase) {
    return true;
  }

  try {
    const { error } = await supabase
      .from('connections')
      .update({
        status,
        responded_at: new Date().toISOString(),
      })
      .eq('id', connectionId);

    return !error;
  } catch (err) {
    console.error('Error responding to connection:', err);
    return false;
  }
}
