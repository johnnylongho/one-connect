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
import { DbService } from './db-service';
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

const STORAGE_KEY = 'one_connect_app_state_v2';

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
}

const defaultState: AppState = {
  currentRole: 'SUPER_ADMIN',
  currentIdentityId: 'id-001', // Hồ Hoàng Long by default
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
};

export function useOneConnectStore() {
  const [state, setState] = useState<AppState>(() => {
    if (typeof window === 'undefined') return defaultState;
    try {
      // Clear legacy storage v1 if present
      localStorage.removeItem('one_connect_app_state_v1');
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: AppState = JSON.parse(saved);
        // Ensure id-001 and card-1 are strictly synced with official values
        parsed.identities = parsed.identities.map((idnt) => {
          if (idnt.id === 'id-001') {
            return {
              ...idnt,
              username: 'johnnylongho',
              fullName: 'Hồ Hoàng Long',
              displayName: 'Johnny Long Hồ',
              phone: '0794677369',
              email: 'contact.johnnylongho@gmail.com',
              website: 'https://aplusvn.net',
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
              dynamicUrl: 'https://one-connect-network.vercel.app/p/johnnylongho',
              qrValue: 'https://one-connect-network.vercel.app/p/johnnylongho',
            };
          }
          return c;
        });
        return parsed;
      }
    } catch (e) {
      console.error('Failed to load state from localStorage', e);
    }
    return defaultState;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state]);

  // Realtime Cloud Synchronization with Supabase
  useEffect(() => {
    if (typeof window === 'undefined') return;

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
                method: newRecord.check_in_method || 'NFC',
                checkedInAt: newRecord.check_in_time || new Date().toISOString(),
                operatorName: newRecord.verified_by || 'Trạm Check-in',
              },
              ...prev.checkIns,
            ],
          };
        });
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const currentIdentity = state.identities.find(i => i.id === state.currentIdentityId) || state.identities[0];
  const currentCard = state.cards.find(c => c.personIdentityId === state.currentIdentityId && c.status === 'ACTIVE') || state.cards[0];

  // Actions
  const setCurrentRole = (role: RoleType) => {
    setState(prev => ({ ...prev, currentRole: role }));
  };

  const setCurrentIdentityId = (id: string) => {
    setState(prev => ({ ...prev, currentIdentityId: id }));
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

  // Consent & Connection Action
  const requestConnection = (targetIdentityId: string, eventName?: string) => {
    if (targetIdentityId === state.currentIdentityId) {
      return { success: false, message: 'Bạn không thể tự kết nối với chính mình.' };
    }

    const existing = state.connections.find(
      c => (c.requesterIdentityId === state.currentIdentityId && c.receiverIdentityId === targetIdentityId) ||
           (c.requesterIdentityId === targetIdentityId && c.receiverIdentityId === state.currentIdentityId)
    );

    if (existing) {
      if (existing.status === 'CONNECTED') {
        return { success: true, connection: existing, message: 'Hai bên ĐÃ KẾT NỐI từ trước.' };
      }
      return { success: true, connection: existing, message: 'Yêu cầu kết nối đang chờ đối phương đồng ý (Consent Pending).' };
    }

    const newConn: Connection = {
      id: `conn-${Date.now()}`,
      requesterIdentityId: state.currentIdentityId,
      receiverIdentityId: targetIdentityId,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      contextEventName: eventName || 'StartUp Deal Day One Khánh Hòa 2026',
      notesCount: 0,
    };

    const newAuditLog: AuditLog = {
      id: `log-${Date.now()}`,
      actorUserId: state.currentIdentityId,
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

    return { success: true, connection: newConn, message: 'Đã gửi yêu cầu kết nối! Đang chờ đối phương xác nhận Consent theo Luật PDPL.' };
  };

  const acceptConnection = (connectionId: string) => {
    const conn = state.connections.find(c => c.id === connectionId);
    if (!conn) return;

    const updatedConn: Connection = {
      ...conn,
      status: 'CONNECTED',
      connectedAt: new Date().toISOString(),
    };

    const newAuditLog: AuditLog = {
      id: `log-${Date.now()}`,
      actorUserId: state.currentIdentityId,
      actorName: currentIdentity?.fullName || 'User',
      action: 'PDPL_MUTUAL_CONSENT_ACCEPTED',
      objectType: 'CONNECTION',
      objectId: connectionId,
      createdAt: new Date().toISOString(),
    };

    setState(prev => ({
      ...prev,
      connections: prev.connections.map(c => c.id === connectionId ? updatedConn : c),
      auditLogs: [newAuditLog, ...prev.auditLogs],
    }));
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
    const newId = `id-${Date.now()}`;
    const newCardUid = `NFC-${cleanUsername.toUpperCase().slice(0, 8)}-${Math.floor(100 + Math.random() * 900)}`;
    const avatar = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(data.fullName)}&backgroundColor=0066ff,00c2ff,10b981,f59e0b`;

    const newIdentity: PersonIdentity = {
      id: newId,
      userId: `usr-${Date.now()}`,
      username: cleanUsername,
      fullName: data.fullName,
      displayName: data.fullName,
      title: data.title || 'Giám Đốc Doanh Nghiệp',
      phone: data.phone || '0794677369',
      email: data.email,
      password: data.password || '123456',
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
          url: `https://one-connect-network.vercel.app/p/${cleanUsername}`,
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
      dynamicUrl: `https://one-connect-network.vercel.app/p/${cleanUsername}`,
      qrValue: `https://one-connect-network.vercel.app/p/${cleanUsername}`,
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
      currentRole: 'MEMBER',
      currentIdentityId: newId,
      identities: [newIdentity, ...prev.identities],
      cards: [newCard, ...prev.cards],
      auditLogs: [newAuditLog, ...prev.auditLogs],
    }));

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
      const isSuperAdmin = found.username === 'johnnylongho' || found.id === 'id-001' || clean.includes('johnny');
      const isOrgAdmin = Boolean(found.businesses?.some(b => b.relationType === 'OWNER_PRESIDENT'));
      const determinedRole: RoleType = isSuperAdmin ? 'SUPER_ADMIN' : isOrgAdmin ? 'ORG_ADMIN' : 'MEMBER';

      setState(prev => ({
        ...prev,
        currentRole: determinedRole,
        currentIdentityId: found.id,
      }));
      return found;
    }

    // Default fallback to Johnny Long if keywords matched
    if (clean.includes('admin') || clean.includes('johnny') || clean.includes('long')) {
      setState(prev => ({
        ...prev,
        currentRole: 'SUPER_ADMIN',
        currentIdentityId: 'id-001',
      }));
      return state.identities[0];
    }

    return null;
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

  return {
    state,
    currentIdentity,
    currentCard,
    setCurrentRole,
    setCurrentIdentityId,
    registerIdentity,
    registerOrganization,
    loginUser,
    switchWorkspace,
    updateIdentity,
    resetState,
    performCheckIn,
    requestConnection,
    acceptConnection,
    reissueCard,
    addNote,
    registerForEvent,
    updatePrivacy,
  };
}
