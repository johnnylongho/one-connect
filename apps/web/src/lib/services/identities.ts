import { supabase, isSupabaseConfigured } from './supabase-client';
import { PersonIdentity, AccessCard } from '@/lib/types';
import { INITIAL_IDENTITIES, INITIAL_CARDS } from '@/lib/mock-data';

export async function getIdentityById(id: string): Promise<PersonIdentity | null> {
  if (!isSupabaseConfigured() || !supabase) {
    return INITIAL_IDENTITIES.find(i => i.id === id) || null;
  }

  try {
    const { data, error } = await supabase
      .from('person_identities')
      .select('*, businesses(*), access_cards(*)')
      .eq('id', id)
      .single();

    if (error || !data) {
      return INITIAL_IDENTITIES.find(i => i.id === id) || null;
    }

    const matchedFallback = INITIAL_IDENTITIES.find(i => i.id === id);

    return {
      id: data.id,
      userId: data.user_id || 'u-001',
      username: data.username || data.display_name?.toLowerCase().replace(/\s+/g, '') || 'user',
      fullName: data.full_name,
      displayName: data.display_name || undefined,
      avatarUrl: data.avatar_url || undefined,
      title: data.title || undefined,
      bio: data.bio || undefined,
      phone: data.phone || undefined,
      email: data.email || undefined,
      website: data.website || undefined,
      socialLinks: matchedFallback?.socialLinks || [],
      businesses: matchedFallback?.businesses || [],
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  } catch (err) {
    console.warn('Supabase fetch error, using fallback:', err);
    return INITIAL_IDENTITIES.find(i => i.id === id) || null;
  }
}

export async function getIdentityByCardUid(
  cardUid: string
): Promise<{ identity: PersonIdentity; card: AccessCard } | null> {
  if (!isSupabaseConfigured() || !supabase) {
    const card = INITIAL_CARDS.find(c => c.cardUid.toLowerCase() === cardUid.toLowerCase());
    if (!card) return null;
    const identity = INITIAL_IDENTITIES.find(i => i.id === card.personIdentityId);
    if (!identity) return null;
    return { identity, card };
  }

  try {
    const { data: cardData, error: cardError } = await supabase
      .from('access_cards')
      .select('*, person_identities(*)')
      .eq('card_uid', cardUid)
      .single();

    if (cardError || !cardData || !cardData.person_identities) {
      const card = INITIAL_CARDS.find(c => c.cardUid.toLowerCase() === cardUid.toLowerCase());
      if (!card) return null;
      const identity = INITIAL_IDENTITIES.find(i => i.id === card.personIdentityId);
      if (!identity) return null;
      return { identity, card };
    }

    const rawIdentity = cardData.person_identities;
    const matchedFallback = INITIAL_IDENTITIES.find(i => i.id === rawIdentity.id);

    return {
      card: {
        id: cardData.id,
        cardUid: cardData.card_uid,
        personIdentityId: cardData.person_identity_id,
        cardType: cardData.card_type || 'NFC_BUSINESS_PRO',
        dynamicUrl: `/c/${cardData.card_uid}`,
        qrValue: `https://oneconnect.vn/c/${cardData.card_uid}`,
        status: cardData.status || 'ACTIVE',
        issuedAt: cardData.issued_at,
        lastUsedAt: cardData.last_used_at || undefined,
      },
      identity: {
        id: rawIdentity.id,
        userId: rawIdentity.user_id || 'u-001',
        username: rawIdentity.username || rawIdentity.display_name?.toLowerCase().replace(/\s+/g, '') || 'user',
        fullName: rawIdentity.full_name,
        displayName: rawIdentity.display_name || undefined,
        avatarUrl: rawIdentity.avatar_url || undefined,
        title: rawIdentity.title || undefined,
        bio: rawIdentity.bio || undefined,
        phone: rawIdentity.phone || undefined,
        email: rawIdentity.email || undefined,
        website: rawIdentity.website || undefined,
        socialLinks: matchedFallback?.socialLinks || [],
        businesses: matchedFallback?.businesses || [],
        createdAt: rawIdentity.created_at,
        updatedAt: rawIdentity.updated_at,
      },
    };
  } catch (err) {
    console.warn('Supabase fetch card error, using fallback:', err);
    return null;
  }
}
