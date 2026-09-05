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
    password: '$hoanglong1788',
    role: 'SUPER_ADMIN',
    website: 'https://aplusvn.net',
    taxCode: '0316888999',
    address: 'Tầng 8, Tòa nhà ASIA, 25 Lê Lợi, TP. Nha Trang, Khánh Hòa',
    association: 'Hội Doanh Nhân Trẻ Khánh Hòa (YBA) • Ban Công Nghệ',
    slogan: 'Bứt Phá Giao Thương - Chuyển Hóa Mối Quan Hệ Kinh Doanh Số',
    industry: 'Công Nghệ Thông Tin & AI',
    expertiseSkills: ['Hạ Tầng IoT & NFC', 'AI B2B Matchmaking', 'Next.js & Turbopack', 'Truyền Thông Số', 'Sự Kiện MICE'],
    seekingNeeds: ['Đối tác Chuỗi Khách sạn/Resort MICE', 'Các Hiệp hội Doanh nghiệp Tỉnh/Thành', 'Nhà phân phối phôi thẻ thông minh'],
    offeringServices: ['Hạ tầng Định danh số NFC Doanh nghiệp', 'Hệ thống Check-in Sự kiện <1s', 'Giải pháp CRM Sổ tay quan hệ B2B'],
    brochureUrl: 'https://aplusvn.net/company-profile-2026.pdf',
    membershipTier: 'EXECUTIVE_BOARD',
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
        industry: 'Công Nghệ Thông Tin & AI',
        expertiseSkills: ['Hạ Tầng IoT & NFC', 'AI B2B Matchmaking', 'Next.js & Turbopack', 'Truyền Thông Số', 'Sự Kiện MICE'],
        relationType: 'OWNER',
        isPrimary: true,
        status: 'ACTIVE',
      }
    ],
    createdAt: '2026-08-01T08:00:00Z',
    updatedAt: '2026-08-12T10:00:00Z',
  }
];

export const INITIAL_CARDS: AccessCard[] = [
  {
    id: 'card-1',
    personIdentityId: 'id-001',
    cardUid: '04:8F:2A:1B:9C:5D:80',
    cardType: 'NFC_EXECUTIVE',
    nfcIdentifier: 'NFC-2026-APLUS-001',
    dynamicUrl: 'https://www.oneconnect.id.vn/p/johnnylongho',
    qrValue: 'https://www.oneconnect.id.vn/p/johnnylongho',
    status: 'ACTIVE',
    issuedAt: '2026-08-05T08:00:00Z',
    lastUsedAt: '2026-08-12T16:00:00Z',
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
];

export const INITIAL_CHECKINS: CheckIn[] = [
  { id: 'chk-001', eventId: 'evt-001', registrationId: 'reg-001', personIdentityId: 'id-001', method: 'NFC', checkedInAt: '2026-08-20T08:05:12Z', operatorName: 'Trạm Cửa Chín (Gate 01)' },
];

export const INITIAL_CONNECTIONS: Connection[] = [];
export const INITIAL_NOTES: ConnectionNote[] = [];
export const INITIAL_LEADS: Lead[] = [];

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
