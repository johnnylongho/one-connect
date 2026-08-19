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
  AuditLog
} from './types';

export const INITIAL_IDENTITIES: PersonIdentity[] = [
  {
    id: 'id-001',
    userId: 'user-001',
    username: 'johnnylongho',
    fullName: 'Hồ Hoàng Long',
    displayName: 'Johnny Long Hồ',
    avatarUrl: '/avatar-johnny-long.jpg',
    coverUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
    title: 'Quản lý & Triển khai Dự án kiêm Media',
    bio: 'Chuyên gia triển khai giải pháp hạ tầng danh thiếp số NFC, định danh doanh nghiệp và tự động hóa giao thương B2B sự kiện.',
    phone: '0794677369',
    email: 'contact.johnnylongho@gmail.com',
    website: 'https://aplusvn.net',
    taxCode: '0316888999',
    address: 'Tầng 8, Tòa nhà ASIA, 25 Lê Lợi, TP. Nha Trang, Khánh Hòa',
    association: 'Hội Doanh Nhân Trẻ Khánh Hòa (YBA) • Ban Công Nghệ',
    slogan: 'Bứt Phá Giao Thương - Chuyển Hóa Mối Quan Hệ Kinh Doanh Số',
    socialLinks: [
      { id: 's-1', identityId: 'id-001', platform: 'linkedin', url: 'https://linkedin.com/in/johnnylongho', isPublic: true, sortOrder: 1 },
      { id: 's-2', identityId: 'id-001', platform: 'zalo', url: 'https://zalo.me/0794677369', isPublic: true, sortOrder: 2 },
      { id: 's-3', identityId: 'id-001', platform: 'facebook', url: 'https://facebook.com/johnnylong.official', isPublic: true, sortOrder: 3 },
      { id: 's-4', identityId: 'id-001', platform: 'website', url: 'https://aplusvn.net', isPublic: true, sortOrder: 4 },
    ],
    businesses: [
      {
        id: 'b-1',
        personIdentityId: 'id-001',
        businessId: 'biz-101',
        businessName: 'Tập đoàn Công nghệ số A+ (Aplusvn)',
        position: 'Giám đốc Triển khai Dự án kiêm Media',
        taxCode: '0316888999',
        address: 'Tầng 8, Tòa nhà ASIA, 25 Lê Lợi, TP. Nha Trang, Khánh Hòa',
        association: 'Hội Doanh Nhân Trẻ Khánh Hòa (YBA) • Ban Công Nghệ',
        slogan: 'Bứt Phá Giao Thương - Chuyển Hóa Mối Quan Hệ Kinh Doanh Số',
        relationType: 'OWNER',
        isPrimary: true,
        status: 'ACTIVE',
      }


    ],
    createdAt: '2026-08-01T08:00:00Z',
    updatedAt: '2026-08-12T10:00:00Z',
  },
  {
    id: 'id-002',
    userId: 'user-002',
    username: 'nguyenthuha',
    fullName: 'Nguyễn Thu Hà',
    displayName: 'Thu Hà Vinacoffee',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1200&auto=format&fit=crop&q=80',
    title: 'Tổng Giám đốc / Founder',
    bio: 'Chuyên sản xuất và xuất khẩu cà phê nông sản chất lượng cao. Đang tìm kiếm đối tác mở rộng thị trường Đông Nam Á và Châu Âu.',
    phone: '0912 345 678',
    email: 'ha.nguyen@vinacoffee.vn',
    website: 'https://vinacoffee.vn',
    socialLinks: [
      { id: 's-5', identityId: 'id-002', platform: 'linkedin', url: 'https://linkedin.com/in/thuha-vinacoffee', isPublic: true, sortOrder: 1 },
      { id: 's-6', identityId: 'id-002', platform: 'zalo', url: 'https://zalo.me/0912345678', isPublic: true, sortOrder: 2 },
    ],
    businesses: [
      {
        id: 'b-2',
        personIdentityId: 'id-002',
        businessId: 'biz-102',
        businessName: 'Công ty Cổ phần Vinacoffee Việt Nam',
        position: 'CEO & Founder',
        relationType: 'FOUNDER',
        isPrimary: true,
        status: 'ACTIVE',
      }
    ],
    createdAt: '2026-08-02T09:00:00Z',
    updatedAt: '2026-08-12T11:00:00Z',
  },
  {
    id: 'id-003',
    userId: 'user-003',
    username: 'tranquocbao',
    fullName: 'Trần Quốc Bảo',
    displayName: 'Bảo TechCorp',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=80',
    title: 'Giám đốc Công nghệ (CTO)',
    bio: 'Cung cấp giải pháp phần mềm doanh nghiệp, Cloud Infrastructure & AI Security. Hơn 12 năm kinh nghiệm tư vấn kiến trúc phần mềm.',
    phone: '0988 777 666',
    email: 'bao.tran@techcorp.asia',
    website: 'https://techcorp.asia',
    socialLinks: [
      { id: 's-7', identityId: 'id-003', platform: 'linkedin', url: 'https://linkedin.com/in/baotran-cto', isPublic: true, sortOrder: 1 },
      { id: 's-8', identityId: 'id-003', platform: 'github', url: 'https://github.com/baotechcorp', isPublic: true, sortOrder: 2 },
    ],
    businesses: [
      {
        id: 'b-3',
        personIdentityId: 'id-003',
        businessId: 'biz-103',
        businessName: 'TechCorp Asia Software Solutions',
        position: 'CTO',
        relationType: 'PARTNER',
        isPrimary: true,
        status: 'ACTIVE',
      }
    ],
    createdAt: '2026-08-03T10:00:00Z',
    updatedAt: '2026-08-12T12:00:00Z',
  },
  {
    id: 'id-004',
    userId: 'user-004',
    username: 'levannam',
    fullName: 'Lê Văn Nam',
    displayName: 'Lê Nam YBA',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80',
    title: 'Chủ tịch Hội Doanh nhân Trẻ Khánh Hòa',
    bio: 'Kết nối cộng đồng 300+ doanh nghiệp SME khu vực Nam Trung Bộ. Thúc đẩy giao thương và chuyển đổi số xanh.',
    phone: '0933 222 111',
    email: 'nam.le@ybakhanhhoa.vn',
    website: 'https://ybakhanhhoa.vn',
    socialLinks: [
      { id: 's-9', identityId: 'id-004', platform: 'phone', url: 'tel:0933222111', isPublic: true, sortOrder: 1 },
      { id: 's-10', identityId: 'id-004', platform: 'zalo', url: 'https://zalo.me/0933222111', isPublic: true, sortOrder: 2 },
    ],
    businesses: [
      {
        id: 'b-4',
        personIdentityId: 'id-004',
        businessId: 'biz-104',
        businessName: 'Hội Doanh nhân Trẻ Khánh Hòa',
        position: 'Chủ tịch',
        relationType: 'EXECUTIVE',
        isPrimary: true,
        status: 'ACTIVE',
      }
    ],
    createdAt: '2026-08-04T11:00:00Z',
    updatedAt: '2026-08-12T13:00:00Z',
  }
];

export const INITIAL_CARDS: AccessCard[] = [
  {
    id: 'card-1',
    personIdentityId: 'id-001',
    cardUid: '04:8F:2A:1B:9C:5D:80',
    cardType: 'NFC_EXECUTIVE',
    nfcIdentifier: 'NFC-2026-APLUS-001',
    dynamicUrl: 'https://one-connect-network.vercel.app/p/johnnylongho',
    qrValue: 'https://one-connect-network.vercel.app/p/johnnylongho',
    status: 'ACTIVE',
    issuedAt: '2026-08-05T08:00:00Z',
    lastUsedAt: '2026-08-12T16:00:00Z',
  },
  {
    id: 'card-2',
    personIdentityId: 'id-002',
    cardUid: 'NFC-HA-777',
    cardType: 'NFC_BUSINESS_PRO',
    nfcIdentifier: 'NFC-UID-002-B88',
    dynamicUrl: 'https://oneconnect.network/NFC-HA-777',
    qrValue: 'https://oneconnect.network/NFC-HA-777',
    status: 'ACTIVE',
    issuedAt: '2026-08-06T09:00:00Z',
    lastUsedAt: '2026-08-12T15:30:00Z',
  },
  {
    id: 'card-3',
    personIdentityId: 'id-003',
    cardUid: 'NFC-BAO-666',
    cardType: 'NFC_STANDARD',
    nfcIdentifier: 'NFC-UID-003-C77',
    dynamicUrl: 'https://oneconnect.network/NFC-BAO-666',
    qrValue: 'https://oneconnect.network/NFC-BAO-666',
    status: 'ACTIVE',
    issuedAt: '2026-08-07T10:00:00Z',
    lastUsedAt: '2026-08-11T14:00:00Z',
  },
  {
    id: 'card-4',
    personIdentityId: 'id-004',
    cardUid: 'NFC-NAM-555',
    cardType: 'NFC_EXECUTIVE',
    nfcIdentifier: 'NFC-UID-004-D66',
    dynamicUrl: 'https://oneconnect.network/NFC-NAM-555',
    qrValue: 'https://oneconnect.network/NFC-NAM-555',
    status: 'ACTIVE',
    issuedAt: '2026-08-08T11:00:00Z',
    lastUsedAt: '2026-08-12T14:20:00Z',
  }
];

export const INITIAL_ORGANIZATIONS: Organization[] = [
  {
    id: 'org-001',
    name: 'StartUp Deal Day One Khánh Hòa',
    slug: 'one-khanh-hoa',
    logoUrl: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&auto=format&fit=crop&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80',
    description: 'Cộng đồng Kết nối Đầu tư & Giao thương Doanh nghiệp tỉnh Khánh Hòa & khu vực Miền Trung.',
    website: 'https://onekhanhhoa.vn',
    industry: 'Cộng đồng & Xúc tiến Thương mại',
    memberCount: 240,
    status: 'ACTIVE',
    createdAt: '2026-07-01T00:00:00Z',
  },
  {
    id: 'org-002',
    name: 'Hội Doanh nhân Trẻ Khánh Hòa (YBA)',
    slug: 'yba-khanh-hoa',
    logoUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=200&auto=format&fit=crop&q=80',
    description: 'Tổ chức xã hội - nghề nghiệp quy tụ các nhà doanh nghiệp trẻ trên địa bàn tỉnh Khánh Hòa.',
    website: 'https://ybakhanhhoa.vn',
    industry: 'Hiệp hội Doanh nghiệp',
    memberCount: 310,
    status: 'ACTIVE',
    createdAt: '2026-06-15T00:00:00Z',
  }
];

export const INITIAL_EVENTS: Event[] = [
  {
    id: 'evt-001',
    organizationId: 'org-001',
    organizationName: 'StartUp Deal Day One Khánh Hòa',
    name: 'StartUp Deal Day One Khánh Hòa 2026',
    slug: 'startup-deal-day-2026',
    description: 'Sự kiện giao thương kết nối 300+ chủ doanh nghiệp, Quỹ đầu tư và Đại diện Sở Ngành. Trải nghiệm check-in 1 chạm NFC siêu tốc và Networking có bối cảnh.',
    bannerUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&auto=format&fit=crop&q=80',
    startAt: '2026-08-20T08:00:00Z',
    endAt: '2026-08-20T17:30:00Z',
    locationName: 'Trung tâm Hội nghị Diamond Bay, Nha Trang',
    address: '20 Trần Phú, Lộc Thọ, Thành phố Nha Trang, Khánh Hòa',
    registrationCount: 185,
    checkInCount: 142,
    capacity: 350,
    status: 'PUBLISHED',
  },
  {
    id: 'evt-002',
    organizationId: 'org-002',
    organizationName: 'Hội Doanh nhân Trẻ Khánh Hòa (YBA)',
    name: 'Diễn đàn CEO Summit: Chuyển đổi số & Tăng trưởng Xanh 2026',
    slug: 'ceo-summit-2026',
    description: 'Hội thảo chuyên sâu về ứng dụng AI, dữ liệu khách hàng và năng lượng tái tạo cho doanh nghiệp SME.',
    bannerUrl: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=1200&auto=format&fit=crop&q=80',
    startAt: '2026-09-05T13:30:00Z',
    endAt: '2026-09-05T18:00:00Z',
    locationName: 'Khách sạn Muống Thanh Luxury Nha Trang',
    address: '60 Trần Phú, Thành phố Nha Trang, Khánh Hòa',
    registrationCount: 95,
    checkInCount: 0,
    capacity: 200,
    status: 'PUBLISHED',
  }
];

export const INITIAL_REGISTRATIONS: EventRegistration[] = [
  { id: 'reg-001', eventId: 'evt-001', personIdentityId: 'id-001', registrationStatus: 'ATTENDED', registeredAt: '2026-08-10T09:00:00Z', ticketType: 'VIP Guest' },
  { id: 'reg-002', eventId: 'evt-001', personIdentityId: 'id-002', registrationStatus: 'ATTENDED', registeredAt: '2026-08-10T09:15:00Z', ticketType: 'Standard Attendee' },
  { id: 'reg-003', eventId: 'evt-001', personIdentityId: 'id-003', registrationStatus: 'CONFIRMED', registeredAt: '2026-08-10T10:00:00Z', ticketType: 'Standard Attendee' },
  { id: 'reg-004', eventId: 'evt-001', personIdentityId: 'id-004', registrationStatus: 'ATTENDED', registeredAt: '2026-08-10T10:30:00Z', ticketType: 'Organizer' },
];

export const INITIAL_CHECKINS: CheckIn[] = [
  { id: 'chk-001', eventId: 'evt-001', registrationId: 'reg-001', personIdentityId: 'id-001', method: 'NFC', checkedInAt: '2026-08-20T08:05:12Z', operatorName: 'Trạm Cửa Chín (Gate 01)' },
  { id: 'chk-002', eventId: 'evt-001', registrationId: 'reg-002', personIdentityId: 'id-002', method: 'NFC', checkedInAt: '2026-08-20T08:12:45Z', operatorName: 'Trạm Cửa Chín (Gate 01)' },
  { id: 'chk-003', eventId: 'evt-001', registrationId: 'reg-004', personIdentityId: 'id-004', method: 'QR', checkedInAt: '2026-08-20T07:45:00Z', operatorName: 'Trạm VIP (Gate VIP)' },
];

export const INITIAL_CONNECTIONS: Connection[] = [
  {
    id: 'conn-001',
    requesterIdentityId: 'id-001',
    receiverIdentityId: 'id-002',
    status: 'CONNECTED',
    connectedAt: '2026-08-20T09:30:00Z',
    createdAt: '2026-08-20T09:28:00Z',
    contextEventName: 'StartUp Deal Day One Khánh Hòa 2026',
    notesCount: 2,
  },
  {
    id: 'conn-002',
    requesterIdentityId: 'id-001',
    receiverIdentityId: 'id-003',
    status: 'PENDING',
    createdAt: '2026-08-20T10:15:00Z',
    contextEventName: 'StartUp Deal Day One Khánh Hòa 2026',
    notesCount: 0,
  },
  {
    id: 'conn-003',
    requesterIdentityId: 'id-004',
    receiverIdentityId: 'id-001',
    status: 'CONNECTED',
    connectedAt: '2026-08-20T08:00:00Z',
    createdAt: '2026-08-20T07:55:00Z',
    contextEventName: 'StartUp Deal Day One Khánh Hòa 2026',
    notesCount: 1,
  }
];

export const INITIAL_NOTES: ConnectionNote[] = [
  {
    id: 'note-001',
    connectionId: 'conn-001',
    ownerIdentityId: 'id-001',
    content: 'Gặp chị Thu Hà tại gian hàng nông sản StartUp Deal Day. Cần gửi hồ sơ giới thiệu giải pháp NFC One Connect cho chuỗi 15 đại lý Vinacoffee.',
    createdAt: '2026-08-20T10:00:00Z',
    updatedAt: '2026-08-20T10:00:00Z',
  },
  {
    id: 'note-002',
    connectionId: 'conn-001',
    ownerIdentityId: 'id-001',
    content: 'Hẹn gặp cà phê sáng thứ 5 tuần tới bàn hợp đồng mẫu pilot.',
    createdAt: '2026-08-21T14:20:00Z',
    updatedAt: '2026-08-21T14:20:00Z',
  }
];

export const INITIAL_LEADS: Lead[] = [
  {
    id: 'lead-001',
    connectionId: 'conn-001',
    ownerIdentityId: 'id-001',
    status: 'WARM',
    priority: 'HIGH',
    estimatedValue: 45000000,
    source: 'StartUp Deal Day One Khánh Hòa 2026',
    createdAt: '2026-08-20T10:05:00Z',
    updatedAt: '2026-08-21T14:20:00Z',
  }
];

export const INITIAL_PRIVACY: PrivacySetting = {
  userId: 'user-001',
  profileVisibility: 'PUBLIC',
  contactVisibility: 'MEMBERS_ONLY',
  eventDirectoryVisibility: 'PUBLIC',
  membershipVisibility: 'PUBLIC',
  connectionVisibility: 'PRIVATE',
};

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-001',
    actorUserId: 'user-001',
    actorName: 'Hồ Hoàng Long',
    action: 'NFC_CARD_TAP_CHECKIN',
    objectType: 'EVENT_CHECKIN',
    objectId: 'chk-001',
    ipAddress: '113.161.44.12',
    createdAt: '2026-08-20T08:05:12Z',
  },
  {
    id: 'log-002',
    actorUserId: 'user-001',
    actorName: 'Hồ Hoàng Long',
    action: 'PDPL_MUTUAL_CONSENT_GRANTED',
    objectType: 'CONNECTION',
    objectId: 'conn-001',
    ipAddress: '113.161.44.12',
    createdAt: '2026-08-20T09:30:00Z',
  }
];
