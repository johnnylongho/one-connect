'use client';

import { useState, useEffect } from 'react';
import {
  PersonIdentity,
  AccessCard,
  Organization,
  Event,
  EventRegistration,
  CheckIn,
  Connection,
  ConnectionNote,
  Lead,
  PrivacySetting,
  AuditLog,
  RoleType
} from './types';
import { DbService, ensureUuid } from './db-service';
import {
  INITIAL_IDENTITIES,
  INITIAL_CARDS,
  INITIAL_ORGANIZATIONS,
  INITIAL_EVENTS,
  INITIAL_REGISTRATIONS,
  INITIAL_CHECKINS,
  INITIAL_CONNECTIONS,
  INITIAL_NOTES,
  INITIAL_LEADS,
  INITIAL_PRIVACY,
  INITIAL_AUDIT_LOGS
} from './mock-data';

const STORAGE_KEY = 'one_connect_app_state_v3';

export interface AppState {
  currentRole: RoleType;
  currentIdentityId: string;
  identities: PersonIdentity[];
  cards: AccessCard[];
  organizations: Organization[];
  events: Event[];
  registrations: EventRegistration[];
  checkIns: CheckIn[];
  connections: Connection[];
  notes: ConnectionNote[];
  leads: Lead[];
  privacy: PrivacySetting;
  auditLogs: AuditLog[];
  incomingRequest?: {
    id: string;
    requesterName: string;
    requesterPhone?: string;
    requesterCompany?: string;
    requesterNote?: string;
    requesterTitle?: string;
    requesterAvatar?: string;
  } | null;
}

const defaultState: AppState = {
  currentRole: 'MEMBER',
  currentIdentityId: '', // Empty by default = Guest / Requires Login
  identities: INITIAL_IDENTITIES,
  cards: INITIAL_CARDS,
  organizations: INITIAL_ORGANIZATIONS,
  events: INITIAL_EVENTS,
  registrations: INITIAL_REGISTRATIONS,
  checkIns: INITIAL_CHECKINS,
  connections: INITIAL_CONNECTIONS,
  notes: INITIAL_NOTES,
  leads: INITIAL_LEADS,
  privacy: INITIAL_PRIVACY,
  auditLogs: INITIAL_AUDIT_LOGS,
  incomingRequest: null,
};

export function useOneConnectStore() {
  const [state, setState] = useState<AppState>(defaultState);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load saved state from localStorage only after initial client mount to prevent SSR hydration mismatch
  useEffect(() => {
    try {
      localStorage.removeItem('one_connect_app_state_v1');
      localStorage.removeItem('one_connect_app_state_v2');
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: AppState = JSON.parse(saved);
        // Ensure id-001 and card-1 are strictly synced with official values
        parsed.identities = parsed.identities.map((idnt) => {
          if (idnt.id === 'id-001' || idnt.username === 'johnnylongho') {
            return {
              ...idnt,
              username: idnt.username || 'johnnylongho',
              fullName: idnt.fullName || 'Hồ Hoàng Long',
              displayName: idnt.displayName || idnt.fullName || 'Johnny Long Hồ',
              phone: idnt.phone || '0794677369',
              email: idnt.email || 'contact.johnnylongho@gmail.com',
              website: idnt.website || 'https://aplusvn.net',
              avatarUrl: (idnt.avatarUrl && !idnt.avatarUrl.startsWith('blob:') && idnt.avatarUrl.trim() !== '') ? idnt.avatarUrl : '/avatar-johnny-long.jpg',
            };
          }
          return idnt;
        });
        parsed.cards = parsed.cards.map((c) => {
          if (c.personIdentityId === 'id-001') {
            return {
              ...c,
              cardUid: '04:8F:2A:1B:9C:5D:80',
              nfcIdentifier: 'NFC-2026-APLUS-001',
              dynamicUrl: 'https://www.oneconnect.id.vn/p/johnnylongho',
              qrValue: 'https://www.oneconnect.id.vn/p/johnnylongho',
            };
          }
          return c;
        });
        setState(parsed);
      }
    } catch (e) {
      console.error('Failed to load state from localStorage', e);
    }
    setIsHydrated(true);
  }, []);

  // Save changes to localStorage only after state has been hydrated
  useEffect(() => {
    if (isHydrated && typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state, isHydrated]);

  // Realtime Cloud Synchronization with Supabase
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Fetch Cloud Identities
    DbService.fetchCloudIdentities().then((cloudIdentities) => {
      if (cloudIdentities && cloudIdentities.length > 0) {
        setState(prev => {
          const merged = [...cloudIdentities];
          // Always ensure Johnny Long Ho is cleanly accessible as id-001
          const localJohnny = prev.identities.find(p => p.id === 'id-001' || p.username === 'johnnylongho');
          if (localJohnny && !merged.some(m => m.id === 'id-001')) {
            merged.unshift(localJohnny);
          }
          prev.identities.forEach(p => {
            if (!merged.some(m => m.id === p.id || m.username === p.username)) {
              merged.push(p);
            }
          });
          return { ...prev, identities: merged };
        });
      }
    }).catch(console.warn);

    // 2. Fetch Cloud Connections
    DbService.fetchCloudConnections().then((cloudConns) => {
      if (cloudConns && cloudConns.length > 0) {
        setState(prev => {
          const merged = [...cloudConns];
          prev.connections.forEach(c => {
            if (!merged.some(m => m.id === c.id)) {
              merged.push(c);
            }
          });
          return { ...prev, connections: merged };
        });
      }
    }).catch(console.warn);

    // 3. Subscribe to Realtime multi-table events
    const unsubscribe = DbService.subscribeToRealtime(({ table, newRecord }) => {
      if (table === 'check_ins' && newRecord) {
        setState(prev => {
          if (prev.checkIns.some(c => c.id === newRecord.id)) return prev;
          return {
            ...prev,
            checkIns: [
              {
                id: newRecord.id || `chk-${Date.now()}`,
                eventId: newRecord.event_id || 'evt-001',
                registrationId: newRecord.registration_id || `reg-${Date.now()}`,
                personIdentityId: newRecord.person_identity_id,
                method: newRecord.method || 'NFC',
                checkedInAt: newRecord.check_in_time || new Date().toISOString(),
                operatorName: newRecord.gate_location || 'Trạm Check-in',
              },
              ...prev.checkIns,
            ],
          };
        });
      } else if (table === 'connections' && newRecord) {
        setState(prev => {
          const myUuid = ensureUuid(prev.currentIdentityId);
          const isMeReceiver = newRecord.receiver_identity_id === myUuid || newRecord.receiver_identity_id === prev.currentIdentityId;
          const isMeRequester = newRecord.requester_identity_id === myUuid || newRecord.requester_identity_id === prev.currentIdentityId;

          let updatedIncoming = prev.incomingRequest;
          if (isMeReceiver && newRecord.status === 'PENDING') {
            const reqUser = prev.identities.find(i => i.id === newRecord.requester_identity_id || ensureUuid(i.id) === newRecord.requester_identity_id);
            updatedIncoming = {
              id: newRecord.id,
              requesterName: reqUser?.fullName || 'Doanh nhân đối tác',
              requesterTitle: reqUser?.title || 'Đại diện Doanh nghiệp',
              requesterAvatar: reqUser?.avatarUrl || (reqUser?.username === 'johnnylongho' ? '/avatar-johnny-long.jpg' : `https://ui-avatars.com/api/?name=${encodeURIComponent(reqUser?.fullName || 'User')}&background=0284c7&color=fff&bold=true`),
            };
          } else if (newRecord.status === 'ACCEPTED' || newRecord.status === 'REJECTED') {
            if (updatedIncoming?.id === newRecord.id) {
              updatedIncoming = null;
            }
          }

          const existingIdx = prev.connections.findIndex(c => c.id === newRecord.id || 
            (c.requesterIdentityId === newRecord.requester_identity_id && c.receiverIdentityId === newRecord.receiver_identity_id));

          const uiStatus = newRecord.status === 'ACCEPTED' ? 'CONNECTED' : (newRecord.status === 'REJECTED' ? 'BLOCKED' : 'PENDING');

          const updatedConnections = [...prev.connections];
          const existingConnItem = existingIdx >= 0 ? updatedConnections[existingIdx] : undefined;
          if (existingConnItem) {
            updatedConnections[existingIdx] = {
              ...existingConnItem,
              id: newRecord.id,
              status: uiStatus,
              connectedAt: newRecord.responded_at || undefined,
            };
          } else if (isMeReceiver || isMeRequester) {
            const partnerId = isMeRequester ? newRecord.receiver_identity_id : newRecord.requester_identity_id;
            const partner = prev.identities.find(i => i.id === partnerId || ensureUuid(i.id) === partnerId);
            updatedConnections.unshift({
              id: newRecord.id,
              requesterIdentityId: newRecord.requester_identity_id,
              receiverIdentityId: newRecord.receiver_identity_id,
              status: uiStatus,
              connectedAt: newRecord.responded_at || undefined,
              createdAt: newRecord.requested_at || new Date().toISOString(),
              partner,
              contextEventName: 'Diễn Đàn Kết Nối Doanh Nghiệp 2026',
              notesCount: 0,
            });
          }

          return {
            ...prev,
            incomingRequest: updatedIncoming,
            connections: updatedConnections,
          };
        });
      } else if (table === 'broadcast_guest_lead' && newRecord) {
        setState(prev => {
          const myUuid = ensureUuid(prev.currentIdentityId);
          const isMeReceiver = newRecord.receiver_identity_id === myUuid || 
            newRecord.receiver_identity_id === prev.currentIdentityId ||
            prev.currentIdentityId === 'id-001';

          if (isMeReceiver) {
            const guestInitials = `https://ui-avatars.com/api/?name=${encodeURIComponent(newRecord.requester_name || 'Khach')}&background=0284c7&color=fff&bold=true`;
            const guestAvatar = newRecord.avatar_url && !newRecord.avatar_url.includes('avatar-johnny-long.jpg')
              ? newRecord.avatar_url
              : guestInitials;

            const guestConn: Connection = {
              id: newRecord.id,
              requesterIdentityId: newRecord.requester_identity_id,
              receiverIdentityId: newRecord.receiver_identity_id,
              status: 'PENDING',
              createdAt: newRecord.requested_at || new Date().toISOString(),
              notesCount: 0,
              partner: {
                id: newRecord.requester_identity_id,
                userId: newRecord.requester_identity_id,
                username: 'guest',
                fullName: `${newRecord.requester_name}`,
                displayName: `${newRecord.requester_name}`,
                avatarUrl: guestAvatar,
                title: newRecord.requester_company || 'Khách vãng lai (Chưa xác thực)',
                bio: newRecord.requester_note || 'Khách chạm thẻ NFC để lại thông tin.',
                phone: newRecord.requester_phone || '',
                email: '',
                website: '',
                socialLinks: [],
                businesses: [],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
            };

            const newLead: Lead = {
              id: `lead-${Date.now()}`,
              connectionId: newRecord.id,
              ownerIdentityId: prev.currentIdentityId,
              status: 'NEW',
              priority: 'HIGH',
              source: 'Chạm Thẻ NFC Trực Tiếp',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };

            return {
              ...prev,
              connections: [guestConn, ...prev.connections.filter(c => c.id !== newRecord.id)],
              leads: [newLead, ...prev.leads.filter(l => l.connectionId !== newRecord.id)],
            };
          }
          return prev;
        });
      } else if (table === 'broadcast_connection' && newRecord) {
        setState(prev => {
          const myUuid = ensureUuid(prev.currentIdentityId);
          const isMeReceiver = newRecord.receiver_identity_id === myUuid || 
            newRecord.receiver_identity_id === prev.currentIdentityId ||
            prev.currentIdentityId === 'id-001';

          if (isMeReceiver && newRecord.status === 'PENDING') {
            const guestInitials = `https://ui-avatars.com/api/?name=${encodeURIComponent(newRecord.requester_name || 'Khach')}&background=0284c7&color=fff&bold=true`;
            const guestAvatar = newRecord.avatar_url && !newRecord.avatar_url.includes('avatar-johnny-long.jpg')
              ? newRecord.avatar_url
              : guestInitials;

            const guestConn: Connection = {
              id: newRecord.id,
              requesterIdentityId: newRecord.requester_identity_id,
              receiverIdentityId: newRecord.receiver_identity_id,
              status: 'PENDING',
              createdAt: newRecord.requested_at || new Date().toISOString(),
              notesCount: 0,
              partner: {
                id: newRecord.requester_identity_id,
                userId: newRecord.requester_identity_id,
                username: 'guest',
                fullName: `${newRecord.requester_name}`,
                displayName: `${newRecord.requester_name}`,
                avatarUrl: guestAvatar,
                title: newRecord.requester_company || newRecord.requester_title || 'Khách vừa chạm thẻ NFC',
                bio: newRecord.requester_note || '',
                phone: newRecord.requester_phone || '',
                email: '',
                website: '',
                socialLinks: [],
                businesses: [],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
            };

            return {
              ...prev,
              incomingRequest: {
                id: newRecord.id,
                requesterName: newRecord.requester_name || 'Khách chạm thẻ NFC',
                requesterPhone: newRecord.requester_phone || '',
                requesterCompany: newRecord.requester_company || newRecord.requester_title || 'Đại diện Doanh nghiệp',
                requesterNote: newRecord.requester_note || '',
                requesterTitle: newRecord.requester_company || newRecord.requester_title || 'Đại diện Doanh nghiệp',
                requesterAvatar: guestAvatar,
              },
              connections: [guestConn, ...prev.connections.filter(c => c.id !== newRecord.id)],
            };
          }
          return prev;
        });
      } else if (table === 'broadcast_accepted' && newRecord) {
        setState(prev => {
          const updated = prev.connections.map(c => 
            c.id === newRecord.connectionId ? { ...c, status: 'CONNECTED' as const } : c
          );
          return {
            ...prev,
            connections: updated,
            incomingRequest: prev.incomingRequest?.id === newRecord.connectionId ? null : prev.incomingRequest,
          };
        });
      } else if (table === 'person_identities' && newRecord) {
        setState(prev => {
          const rawUsername = (newRecord.full_name || '')
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]/g, '') || 'user';

          const newIdent: PersonIdentity = {
            id: newRecord.id,
            userId: newRecord.user_id || newRecord.id,
            username: rawUsername,
            fullName: newRecord.full_name,
            displayName: newRecord.display_name || newRecord.full_name,
            avatarUrl: newRecord.avatar_url || (rawUsername === 'johnnylongho' ? '/avatar-johnny-long.jpg' : `https://ui-avatars.com/api/?name=${encodeURIComponent(newRecord.full_name || 'User')}&background=0284c7&color=fff&bold=true`),
            title: newRecord.title || 'Doanh Nhân',
            bio: newRecord.bio || '',
            phone: newRecord.phone || '',
            email: newRecord.email || '',
            website: newRecord.website || 'https://oneconnect.id.vn',
            socialLinks: [],
            businesses: [],
            createdAt: newRecord.created_at,
            updatedAt: newRecord.updated_at,
          };

          const exists = prev.identities.some(i => i.id === newRecord.id);
          return {
            ...prev,
            identities: exists ? prev.identities.map(i => i.id === newRecord.id ? newIdent : i) : [newIdent, ...prev.identities],
          };
        });
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const currentIdentity = state.currentIdentityId
    ? state.identities.find(
        (i) =>
          i.id === state.currentIdentityId ||
          (state.currentIdentityId === 'id-001' && (i.id === '11111111-1111-1111-1111-111111111111' || i.username === 'johnnylongho')) ||
          (state.currentIdentityId === '11111111-1111-1111-1111-111111111111' && (i.id === 'id-001' || i.username === 'johnnylongho'))
      ) || null
    : null;

  const currentCard = currentIdentity
    ? state.cards.find(
        (c) =>
          c.personIdentityId === currentIdentity.id ||
          (currentIdentity.id === 'id-001' && c.personIdentityId === '11111111-1111-1111-1111-111111111111') ||
          (currentIdentity.id === '11111111-1111-1111-1111-111111111111' && c.personIdentityId === 'id-001')
      ) || undefined
    : undefined;

  // Actions
  const setCurrentRole = (role: RoleType) => {
    // Chỉ tài khoản của Johnny Long Hồ mới có quyền giữ hoặc chuyển đổi SUPER_ADMIN
    const isJohnny = currentIdentity?.username === 'johnnylongho' || 
                     currentIdentity?.email === 'contact.johnnylongho@gmail.com' ||
                     currentIdentity?.id === 'id-001' || 
                     currentIdentity?.id === '11111111-1111-1111-1111-111111111111';

    if (role === 'SUPER_ADMIN' && !isJohnny) {
      setState(prev => {
        const updated = { ...prev, currentRole: 'MEMBER' as RoleType };
        if (typeof window !== 'undefined') {
          try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); } catch {}
        }
        return updated;
      });
      return;
    }
    setState(prev => {
      const updated = { ...prev, currentRole: role };
      if (typeof window !== 'undefined') {
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); } catch {}
      }
      return updated;
    });
  };

  const setCurrentIdentityId = (id: string) => {
    setState(prev => {
      const updated = { ...prev, currentIdentityId: id };
      if (typeof window !== 'undefined') {
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); } catch {}
      }
      return updated;
    });
  };

  const resetState = () => {
    setState(defaultState);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  // Check-in action (Idempotent, < 1s response, supports (code, method) or (eventId, code, method))
  const performCheckIn = (arg1: string, arg2?: string, arg3?: 'NFC' | 'QR') => {
    let eventId = state.events[0]?.id || 'evt-001';
    let cardUidOrUsername = arg1;
    let method: 'NFC' | 'QR' = 'NFC';

    if (arg3 !== undefined) {
      eventId = arg1;
      cardUidOrUsername = arg2 || '';
      method = arg3;
    } else if (arg2 === 'NFC' || arg2 === 'QR') {
      cardUidOrUsername = arg1;
      method = arg2;
    } else if (arg2) {
      eventId = arg1;
      cardUidOrUsername = arg2;
    }

    // Clean URL prefixes if passed
    let cleanCode = cardUidOrUsername.trim();
    if (cleanCode.includes('/p/')) {
      cleanCode = cleanCode.split('/p/').pop()?.split('?')[0] || cleanCode;
    } else if (cleanCode.includes('/c/')) {
      cleanCode = cleanCode.split('/c/').pop()?.split('?')[0] || cleanCode;
    } else if (cleanCode.includes('data=')) {
      cleanCode = cleanCode.split('data=').pop()?.split('&')[0] || cleanCode;
    }
    cleanCode = decodeURIComponent(cleanCode).trim().toLowerCase();

    // Locate card or user
    const card = state.cards.find(c => c.cardUid.toLowerCase() === cleanCode || c.cardUid.toLowerCase() === cardUidOrUsername.toLowerCase());
    let targetIdentityId = card?.personIdentityId;
    if (!targetIdentityId) {
      const reg = state.registrations.find(r => r.invitationCode?.toLowerCase() === cleanCode || r.id.toLowerCase() === cleanCode);
      if (reg) targetIdentityId = reg.personIdentityId;
    }
    if (!targetIdentityId) {
      const identity = state.identities.find(
        i =>
          i.username.toLowerCase() === cleanCode ||
          i.id.toLowerCase() === cleanCode ||
          i.fullName.toLowerCase().includes(cleanCode)
      );
      targetIdentityId = identity?.id;
    }
    if (!targetIdentityId) {
      if (cleanCode.includes('johnny') || cleanCode.includes('long') || cleanCode.includes('777')) {
        targetIdentityId = 'usr-001';
      } else if (cleanCode.includes('duc') || cleanCode.includes('minh') || cleanCode.includes('888')) {
        targetIdentityId = 'usr-002';
      } else if (cleanCode.includes('nam') || cleanCode.includes('999')) {
        targetIdentityId = 'usr-003';
      }
    }

    if (!targetIdentityId) {
      return { success: false, message: `Không tìm thấy thẻ hoặc thành viên "${cardUidOrUsername}" trong hệ thống.` };
    }

    const targetIdentity = state.identities.find(i => i.id === targetIdentityId);

    // Check existing registration
    let reg = state.registrations.find(r => r.eventId === eventId && r.personIdentityId === targetIdentityId);
    let isNewRegistration = false;
    if (!reg) {
      // Auto-register guest if not registered yet
      reg = {
        id: `reg-${Date.now()}`,
        eventId,
        personIdentityId: targetIdentityId,
        registrationStatus: 'ATTENDED',
        registeredAt: new Date().toISOString(),
        ticketType: 'Walk-in NFC Guest'
      };
      isNewRegistration = true;
    }

    // Check duplicate check-in (Idempotency)
    const existingCheckIn = state.checkIns.find(c => c.eventId === eventId && c.personIdentityId === targetIdentityId);
    if (existingCheckIn) {
      return {
        success: true,
        alreadyCheckedIn: true,
        identity: targetIdentity,
        checkIn: existingCheckIn,
        message: `Thành viên ${targetIdentity?.fullName} ĐÃ ĐIỂM DANH trước đó lúc ${new Date(existingCheckIn.checkedInAt).toLocaleTimeString('vi-VN')}.`
      };
    }

    // Record check-in
    const newCheckIn: CheckIn = {
      id: `chk-${Date.now()}`,
      eventId,
      registrationId: reg.id,
      personIdentityId: targetIdentityId,
      method,
      checkedInAt: new Date().toISOString(),
      operatorName: state.currentRole === 'SUPER_ADMIN' ? 'Hồ Hoàng Long (Admin)' : 'Trạm Check-in Cửa Chính',
    };

    const newAuditLog: AuditLog = {
      id: `log-${Date.now()}`,
      actorUserId: state.currentIdentityId,
      actorName: currentIdentity?.fullName || 'User',
      action: `${method}_CHECKIN_SUCCESS`,
      objectType: 'CHECK_IN',
      objectId: newCheckIn.id,
      ipAddress: '113.161.44.12',
      createdAt: new Date().toISOString(),
    };

    setState(prev => {
      const updatedRegs = isNewRegistration ? [...prev.registrations, reg!] : prev.registrations.map(r => r.id === reg!.id ? { ...r, registrationStatus: 'ATTENDED' as const } : r);
      const updatedEvents = prev.events.map(e => e.id === eventId ? { ...e, checkInCount: e.checkInCount + 1 } : e);
      return {
        ...prev,
        registrations: updatedRegs,
        events: updatedEvents,
        checkIns: [newCheckIn, ...prev.checkIns],
        auditLogs: [newAuditLog, ...prev.auditLogs],
      };
    });

    // Sync with Cloud Database
    if (targetIdentity) {
      DbService.recordCheckIn({
        eventId,
        personIdentityId: targetIdentity.id,
        checkInMethod: method,
        verifiedBy: newCheckIn.operatorName,
      }).catch(console.error);
    }

    return {
      success: true,
      alreadyCheckedIn: false,
      identity: targetIdentity,
      checkIn: newCheckIn,
      message: `ĐIỂM DANH THÀNH CÔNG (<1s)! Chào mừng ${targetIdentity?.fullName}.`
    };
  };

  // Consent & Connection Action (Realtime Cloud Sync)
  const requestConnection = (targetIdentityId: string, eventName?: string) => {
    const myId = state.currentIdentityId;
    if (targetIdentityId === myId || ensureUuid(targetIdentityId) === ensureUuid(myId)) {
      return { success: false, message: 'Bạn không thể tự kết nối với chính mình.' };
    }

    const myUuid = ensureUuid(myId);
    const targetUuid = ensureUuid(targetIdentityId);

    const existing = state.connections.find(
      c => (c.requesterIdentityId === myId && c.receiverIdentityId === targetIdentityId) ||
           (c.requesterIdentityId === targetIdentityId && c.receiverIdentityId === myId) ||
           (c.requesterIdentityId === myUuid && c.receiverIdentityId === targetUuid) ||
           (c.requesterIdentityId === targetUuid && c.receiverIdentityId === myUuid)
    );

    if (existing) {
      if (existing.status === 'CONNECTED') {
        return { success: true, connection: existing, message: 'Hai bên ĐÃ KẾT NỐI từ trước.' };
      }
      return { success: true, connection: existing, message: 'Yêu cầu kết nối đang chờ đối phương đồng ý (Consent Pending).' };
    }

    const tempConnId = `conn-${Date.now()}`;
    const newConn: Connection = {
      id: tempConnId,
      requesterIdentityId: myUuid,
      receiverIdentityId: targetUuid,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      contextEventName: eventName || 'StartUp Deal Day One Khánh Hòa 2026',
      notesCount: 0,
    };

    const newAuditLog: AuditLog = {
      id: `log-${Date.now()}`,
      actorUserId: myId,
      actorName: currentIdentity?.fullName || 'User',
      action: 'CONNECTION_REQUEST_CREATED',
      objectType: 'CONNECTION',
      objectId: newConn.id,
      createdAt: new Date().toISOString(),
    };

    setState(prev => ({
      ...prev,
      connections: [newConn, ...prev.connections],
      auditLogs: [newAuditLog, ...prev.auditLogs],
    }));

    // Dispatch to Cloud Supabase Database
    DbService.sendConnectionRequest(myId, targetIdentityId).then((cloudConn) => {
      setState(prev => ({
        ...prev,
        connections: prev.connections.map(c => c.id === tempConnId ? { ...c, id: cloudConn.id } : c),
      }));
    }).catch(console.warn);

    return { success: true, connection: newConn, message: 'Đã gửi yêu cầu kết nối! Đang chờ đối phương xác nhận Consent theo Luật PDPL.' };
  };

  const acceptConnection = (connectionId: string) => {
    setState(prev => {
      const existingIdx = prev.connections.findIndex(c => c.id === connectionId);
      const updatedConns = [...prev.connections];

      if (existingIdx >= 0 && updatedConns[existingIdx]) {
        updatedConns[existingIdx] = {
          ...updatedConns[existingIdx]!,
          status: 'CONNECTED',
          connectedAt: new Date().toISOString(),
        };
      } else {
        const incoming = prev.incomingRequest;
        updatedConns.unshift({
          id: connectionId,
          requesterIdentityId: 'guest',
          receiverIdentityId: ensureUuid(prev.currentIdentityId),
          status: 'CONNECTED',
          connectedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          notesCount: 0,
          partner: {
            id: 'guest',
            userId: 'guest',
            username: 'guest',
            fullName: incoming?.requesterName || 'Khách chạm thẻ NFC',
            displayName: incoming?.requesterName || 'Khách chạm thẻ NFC',
            avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(incoming?.requesterName || 'Khach')}&background=0284c7&color=fff&bold=true`,
            title: incoming?.requesterTitle || 'Đối tác kết nối NFC',
            bio: '',
            phone: '',
            email: '',
            website: '',
            socialLinks: [],
            businesses: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        });
      }

      const newAuditLog: AuditLog = {
        id: `log-${Date.now()}`,
        actorUserId: prev.currentIdentityId,
        actorName: 'Johnny Long Hồ',
        action: 'PDPL_MUTUAL_CONSENT_ACCEPTED',
        objectType: 'CONNECTION',
        objectId: connectionId,
        createdAt: new Date().toISOString(),
      };

      return {
        ...prev,
        incomingRequest: null,
        connections: updatedConns,
        auditLogs: [newAuditLog, ...prev.auditLogs],
      };
    });

    // Dispatch to Cloud Supabase Database & Broadcast to Partner
    DbService.respondToConnection(connectionId, 'ACCEPTED').catch(console.warn);
    DbService.broadcastEvent('connection_accepted', { connectionId, status: 'ACCEPTED' }).catch(console.warn);
  };

  const rejectConnection = (connectionId: string) => {
    setState(prev => ({
      ...prev,
      incomingRequest: prev.incomingRequest?.id === connectionId ? null : prev.incomingRequest,
      connections: prev.connections.map(c => c.id === connectionId ? { ...c, status: 'BLOCKED' } : c),
    }));

    DbService.respondToConnection(connectionId, 'REJECTED').catch(console.warn);
  };

  const clearIncomingRequest = () => {
    setState(prev => ({ ...prev, incomingRequest: null }));
  };

  // Card Replacement Continuity Action
  const reissueCard = (cardType: AccessCard['cardType'] = 'NFC_EXECUTIVE') => {
    // Revoke old cards
    const updatedCards = state.cards.map(c => c.personIdentityId === state.currentIdentityId ? { ...c, status: 'REPLACED' as const } : c);
    
    // Generate new card
    const newCardUid = `NFC-${(currentIdentity?.username || 'user').toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
    const newCard: AccessCard = {
      id: `card-${Date.now()}`,
      personIdentityId: state.currentIdentityId,
      cardUid: newCardUid,
      cardType,
      nfcIdentifier: `NFC-UID-${Date.now()}`,
      dynamicUrl: `https://oneconnect.network/${newCardUid}`,
      qrValue: `https://oneconnect.network/${newCardUid}`,
      status: 'ACTIVE',
      issuedAt: new Date().toISOString(),
    };

    const newAuditLog: AuditLog = {
      id: `log-${Date.now()}`,
      actorUserId: state.currentIdentityId,
      actorName: currentIdentity?.fullName || 'User',
      action: 'NFC_CARD_REISSUED_CONTINUITY_PRESERVED',
      objectType: 'ACCESS_CARD',
      objectId: newCard.id,
      createdAt: new Date().toISOString(),
    };

    setState(prev => ({
      ...prev,
      cards: [newCard, ...updatedCards],
      auditLogs: [newAuditLog, ...prev.auditLogs],
    }));

    return newCard;
  };

  // Add Relationship Note
  const addNote = (connectionId: string, content: string) => {
    const newNote: ConnectionNote = {
      id: `note-${Date.now()}`,
      connectionId,
      ownerIdentityId: state.currentIdentityId,
      content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setState(prev => ({
      ...prev,
      notes: [newNote, ...prev.notes],
      connections: prev.connections.map(c => c.id === connectionId ? { ...c, notesCount: (c.notesCount || 0) + 1 } : c),
    }));
  };

  // Register for Event
  const registerForEvent = (eventId: string, personIdentityId: string, ticketType: 'VIP' | 'STANDARD' | 'SPEAKER' = 'VIP') => {
    const newReg: EventRegistration = {
      id: `reg-${Date.now()}`,
      eventId,
      personIdentityId,
      ticketType,
      registrationStatus: 'CONFIRMED',
      registeredAt: new Date().toISOString(),
      invitationCode: `INV-${Date.now()}`,
    };

    setState(prev => ({
      ...prev,
      registrations: [newReg, ...prev.registrations],
      events: prev.events.map(e => e.id === eventId ? { ...e, registrationCount: e.registrationCount + 1 } : e)
    }));

    return newReg;
  };

  // Register New User / Identity (Self-Service or Admin)
  const registerIdentity = (data: {
    fullName: string;
    businessName: string;
    email: string;
    phone?: string;
    title?: string;
    username?: string;
    taxCode?: string;
    association?: string;
    address?: string;
    password?: string;
    cardType?: 'NFC_EXECUTIVE' | 'NFC_BUSINESS_PRO' | 'NFC_STANDARD';
    bio?: string;
    role?: RoleType;
  }) => {
    const slugify = (str: string) => {
      return str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'd')
        .replace(/[^a-z0-9]/g, '');
    };

    const cleanUsername = data.username || slugify(data.fullName) || `user${Date.now().toString().slice(-4)}`;
    const newId = typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `${Math.random().toString(16).slice(2, 10)}-0000-4000-8000-${Date.now().toString(16).padStart(12, '0')}`;
    const newCardUid = `NFC-${cleanUsername.toUpperCase().slice(0, 8)}-${Math.floor(100 + Math.random() * 900)}`;
    const avatar = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(data.fullName)}&backgroundColor=0066ff,00c2ff,10b981,f59e0b`;
    
    // Mọi tài khoản mới tạo lập mặc định phân quyền MEMBER
    // Chỉ duy nhất tài khoản của Johnny Long Hồ được set SUPER_ADMIN
    const isJohnny = cleanUsername === 'johnnylongho' || 
                     (data.email && data.email.toLowerCase() === 'contact.johnnylongho@gmail.com');
    const userRole: RoleType = isJohnny ? 'SUPER_ADMIN' : 'MEMBER';

    const newIdentity: PersonIdentity = {
      id: newId,
      userId: newId,
      username: cleanUsername,
      fullName: data.fullName,
      displayName: data.fullName,
      title: data.title || 'Giám Đốc Doanh Nghiệp',
      phone: data.phone || '0794677369',
      email: data.email,
      password: data.password || '123456',
      role: userRole,
      taxCode: data.taxCode || '4201888999',
      association: data.association || 'Hội Viên One Connect Network',
      address: data.address || 'Việt Nam',
      avatarUrl: avatar,
      bio: data.bio || `Đại diện ${data.businessName} - Thành viên Hệ sinh thái One Connect Network.`,
      socialLinks: [
        {
          id: `soc-${Date.now()}-1`,
          identityId: newId,
          platform: 'phone',
          url: `tel:${data.phone || ''}`,
          isPublic: true,
        },
        {
          id: `soc-${Date.now()}-2`,
          identityId: newId,
          platform: 'website',
          url: `https://oneconnect.id.vn/p/${cleanUsername}`,
          isPublic: true,
        }
      ],
      businesses: [
        {
          id: `pbiz-${Date.now()}`,
          personIdentityId: newId,
          businessId: `biz-${Date.now()}`,
          businessName: data.businessName,
          position: data.title || 'Giám Đốc',
          taxCode: data.taxCode || '4201888999',
          address: data.address || 'Việt Nam',
          association: data.association || 'Hội Viên One Connect Network',
          relationType: 'FOUNDER_OWNER',
          isPrimary: true,
          status: 'ACTIVE'
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const newCard: AccessCard = {
      id: `card-${Date.now()}`,
      personIdentityId: newId,
      cardUid: newCardUid,
      cardType: data.cardType || 'NFC_EXECUTIVE',
      nfcIdentifier: `NFC-UID-${Date.now()}`,
      dynamicUrl: `https://oneconnect.id.vn/p/${cleanUsername}`,
      qrValue: `https://oneconnect.id.vn/p/${cleanUsername}`,
      status: 'ACTIVE',
      issuedAt: new Date().toISOString(),
    };


    const newAuditLog: AuditLog = {
      id: `log-${Date.now()}`,
      actorUserId: newId,
      actorName: data.fullName,
      action: 'IDENTITY_REGISTERED_NFC_ISSUED',
      objectType: 'PERSON_IDENTITY',
      objectId: newId,
      createdAt: new Date().toISOString(),
    };

    setState(prev => ({
      ...prev,
      currentRole: userRole,
      currentIdentityId: newId,
      identities: [newIdentity, ...prev.identities],
      cards: [newCard, ...prev.cards],
      auditLogs: [newAuditLog, ...prev.auditLogs],
    }));

    if (typeof window !== 'undefined') {
      document.cookie = `one_connect_auth_session=${newId}; path=/; max-age=2592000; SameSite=Lax`;
    }

    // Sync with Cloud Database
    DbService.createIdentity(newIdentity, newCard, data.password).catch(console.error);

    return { identity: newIdentity, card: newCard };
  };

  // Update Existing Identity / Profile
  const updateIdentity = (identityId: string, updates: {
    fullName?: string;
    displayName?: string;
    title?: string;
    bio?: string;
    phone?: string;
    email?: string;
    website?: string;
    avatarUrl?: string;
    businessName?: string;
    taxCode?: string;
    address?: string;
    association?: string;
    slogan?: string;
    industry?: string;
    expertiseSkills?: string[];
  }) => {
    setState(prev => ({
      ...prev,
      identities: prev.identities.map(item => {
        if (item.id !== identityId && item.username !== identityId && item.userId !== identityId) {
          return item;
        }

        const updatedBusinesses = item.businesses && item.businesses.length > 0
          ? item.businesses.map((b, idx) => idx === 0 ? {
              ...b,
              businessName: updates.businessName || b.businessName,
              position: updates.title || b.position,
              taxCode: updates.taxCode !== undefined ? updates.taxCode : b.taxCode,
              address: updates.address !== undefined ? updates.address : b.address,
              association: updates.association !== undefined ? updates.association : b.association,
              slogan: updates.slogan !== undefined ? updates.slogan : b.slogan,
              industry: updates.industry !== undefined ? updates.industry : b.industry,
              expertiseSkills: updates.expertiseSkills !== undefined ? updates.expertiseSkills : b.expertiseSkills,
            } : b)
          : updates.businessName ? [{
              id: `pbiz-${Date.now()}`,
              personIdentityId: item.id,
              businessId: `biz-${Date.now()}`,
              businessName: updates.businessName,
              position: updates.title || 'Giám Đốc',
              taxCode: updates.taxCode,
              address: updates.address,
              association: updates.association,
              slogan: updates.slogan,
              industry: updates.industry,
              expertiseSkills: updates.expertiseSkills,
              relationType: 'FOUNDER_OWNER',
              isPrimary: true,
              status: 'ACTIVE' as const
            }] : [];

        const updatedSocialLinks = item.socialLinks ? item.socialLinks.map(s => {
          if (s.platform === 'phone' && updates.phone) {
            return { ...s, url: `tel:${updates.phone}` };
          }
          if (s.platform === 'website' && updates.website) {
            return { ...s, url: updates.website };
          }
          return s;
        }) : [];

        return {
          ...item,
          fullName: updates.fullName !== undefined ? updates.fullName : item.fullName,
          displayName: updates.displayName !== undefined ? updates.displayName : (updates.fullName !== undefined ? updates.fullName : item.displayName),
          title: updates.title !== undefined ? updates.title : item.title,
          bio: updates.bio !== undefined ? updates.bio : item.bio,
          phone: updates.phone !== undefined ? updates.phone : item.phone,
          email: updates.email !== undefined ? updates.email : item.email,
          website: updates.website !== undefined ? updates.website : item.website,
          avatarUrl: updates.avatarUrl !== undefined ? updates.avatarUrl : item.avatarUrl,
          taxCode: updates.taxCode !== undefined ? updates.taxCode : item.taxCode,
          address: updates.address !== undefined ? updates.address : item.address,
          association: updates.association !== undefined ? updates.association : item.association,
          slogan: updates.slogan !== undefined ? updates.slogan : item.slogan,
          industry: updates.industry !== undefined ? updates.industry : item.industry,
          expertiseSkills: updates.expertiseSkills !== undefined ? updates.expertiseSkills : item.expertiseSkills,
          businesses: updatedBusinesses,
          socialLinks: updatedSocialLinks.length > 0 ? updatedSocialLinks : item.socialLinks,
          updatedAt: new Date().toISOString()
        };
      })
    }));
  };



  // Register New Paid Organization Workspace (B2B Multi-Tenant)
  const registerOrganization = (data: {
    orgName: string;
    slug?: string;
    industry?: string;
    memberCountEstimate?: number;
    adminFullName: string;
    adminEmail: string;
    adminPhone?: string;
    adminTitle?: string;
    adminPassword?: string;
  }) => {
    const orgId = `org-${Date.now()}`;
    const cleanSlug = (data.slug || data.orgName.toLowerCase().replace(/[^a-z0-9]/g, '-')).replace(/-+/g, '-');
    const adminId = `id-admin-${Date.now()}`;
    const cleanUsername = data.adminFullName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '');

    const newOrg: Organization = {
      id: orgId,
      name: data.orgName,
      slug: cleanSlug,
      industry: data.industry || 'Hiệp hội Doanh nghiệp & Công nghệ',
      memberCount: data.memberCountEstimate || 50,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
    };

    const newAdminIdentity: PersonIdentity = {
      id: adminId,
      userId: `user-${Date.now()}`,
      username: cleanUsername || `admin_${cleanSlug}`,
      fullName: data.adminFullName,
      displayName: data.adminFullName,
      title: data.adminTitle || 'Chủ tịch / Đại diện Tổ chức',
      phone: data.adminPhone || '0794677369',
      email: data.adminEmail,
      password: data.adminPassword || '123456',
      association: `${data.orgName} • Ban Lãnh Đạo`,
      socialLinks: [
        { id: `s-email-${Date.now()}`, identityId: adminId, platform: 'website', url: `https://one-connect-network.vercel.app/org/${cleanSlug}`, isPublic: true },
      ],
      businesses: [
        {
          id: `biz-${Date.now()}`,
          personIdentityId: adminId,
          businessId: orgId,
          businessName: data.orgName,
          position: data.adminTitle || 'Đại diện Tổ chức',
          relationType: 'OWNER_PRESIDENT',
          isPrimary: true,
          status: 'ACTIVE',
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const newCard: AccessCard = {
      id: `card-${Date.now()}`,
      personIdentityId: adminId,
      cardUid: `NFC-${cleanSlug.substring(0, 4).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
      cardType: 'NFC_EXECUTIVE',
      dynamicUrl: `https://one-connect-network.vercel.app/p/${newAdminIdentity.username}`,
      qrValue: `https://one-connect-network.vercel.app/p/${newAdminIdentity.username}`,
      status: 'ACTIVE',
      issuedAt: new Date().toISOString(),
    };

    setState(prev => ({
      ...prev,
      currentRole: 'ORG_ADMIN',
      currentIdentityId: adminId,
      organizations: [newOrg, ...prev.organizations],
      identities: [newAdminIdentity, ...prev.identities],
      cards: [newCard, ...prev.cards],
      auditLogs: [
        {
          id: `aud-${Date.now()}`,
          actorUserId: adminId,
          actorName: data.adminFullName,
          action: 'ORGANIZATION_REGISTERED_TENANT_PROVISIONED',
          objectType: 'ORGANIZATION',
          objectId: orgId,
          createdAt: new Date().toISOString(),
        },
        ...prev.auditLogs,
      ],
    }));

    if (typeof window !== 'undefined') {
      document.cookie = `one_connect_auth_session=${adminId}; path=/; max-age=2592000; SameSite=Lax`;
    }

    return { organization: newOrg, admin: newAdminIdentity, card: newCard };
  };

  // Direct Unified Login by Email, Phone or Username
  const loginUser = (identifier: string, password?: string) => {
    const clean = identifier.trim().toLowerCase();
    const found = state.identities.find(
      (i) =>
        i.username.toLowerCase() === clean ||
        i.id.toLowerCase() === clean ||
        (i.email && i.email.toLowerCase() === clean) ||
        (i.phone && i.phone.replace(/[^0-9]/g, '') === clean.replace(/[^0-9]/g, ''))
    );

    if (found) {
      if (password && found.password && found.password !== password) {
        return null;
      }
      const isSuperAdmin = found.username === 'johnnylongho' || 
                           found.id === 'id-001' || 
                           found.id === '11111111-1111-1111-1111-111111111111' ||
                           (found.email && found.email.toLowerCase() === 'contact.johnnylongho@gmail.com');
      const determinedRole: RoleType = isSuperAdmin ? 'SUPER_ADMIN' : 'MEMBER';

      setState(prev => ({
        ...prev,
        currentRole: determinedRole,
        currentIdentityId: found.id,
      }));
      if (typeof window !== 'undefined') {
        document.cookie = `one_connect_auth_session=${found.id}; path=/; max-age=2592000; SameSite=Lax`;
      }
      return found;
    }

    // Không tự động fallback sai lệch khi đăng nhập không khớp
    return null;
  };

  // Change specific user role (Super Admin action)
  const changeUserRole = (identityId: string, newRole: RoleType) => {
    setState(prev => ({
      ...prev,
      identities: prev.identities.map(i => i.id === identityId ? { ...i, role: newRole } : i),
      currentRole: prev.currentIdentityId === identityId ? newRole : prev.currentRole,
      auditLogs: [
        {
          id: `log-${Date.now()}`,
          actorUserId: prev.currentIdentityId,
          actorName: currentIdentity?.fullName || 'Super Admin',
          action: 'RBAC_ROLE_UPDATED',
          objectType: 'PERSON_IDENTITY',
          objectId: identityId,
          createdAt: new Date().toISOString(),
        },
        ...prev.auditLogs,
      ],
    }));
  };

  // Quick Workspace & Role Switcher
  const switchWorkspace = (role: RoleType, identityId?: string) => {
    setState(prev => ({
      ...prev,
      currentRole: role,
      currentIdentityId: identityId || prev.currentIdentityId,
    }));
  };

  // Toggle Privacy
  const updatePrivacy = (newPrivacy: Partial<PrivacySetting>) => {
    setState(prev => ({
      ...prev,
      privacy: { ...prev.privacy, ...newPrivacy }
    }));
  };

  // Logout User & clear persistent sessions
  const logoutUser = () => {
    setState(prev => ({
      ...prev,
      currentIdentityId: '',
      currentRole: 'MEMBER',
    }));
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(STORAGE_KEY);
        document.cookie = 'one_connect_auth_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        document.cookie = 'sb-access-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        document.cookie = 'sb-refresh-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      } catch (e) {
        console.warn('Logout clear error:', e);
      }
    }
  };

  return {
    state,
    currentIdentity,
    currentCard,
    setCurrentRole,
    setCurrentIdentityId,
    registerIdentity,
    registerOrganization,
    loginUser,
    logoutUser,
    changeUserRole,
    switchWorkspace,
    updateIdentity,
    resetState,
    performCheckIn,
    requestConnection,
    acceptConnection,
    rejectConnection,
    clearIncomingRequest,
    reissueCard,
    addNote,
    registerForEvent,
    updatePrivacy,
  };
}
