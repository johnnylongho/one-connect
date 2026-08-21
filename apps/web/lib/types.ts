export type UserStatus = 'ACTIVE' | 'BLOCKED' | 'DELETION_REQUESTED' | 'DELETED';
export type VerificationStatus = 'UNVERIFIED' | 'PENDING' | 'VERIFIED' | 'REJECTED';
export type PersonBusinessStatus = 'ACTIVE' | 'INACTIVE';
export type OrganizationStatus = 'ACTIVE' | 'INACTIVE';
export type MembershipStatus = 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'EXPIRED' | 'CANCELLED';
export type CardStatus = 'ACTIVE' | 'REVOKED' | 'REPLACED';
export type EventStatus = 'DRAFT' | 'PUBLISHED' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
export type RegistrationStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'ATTENDED';
export type CheckInMethod = 'NFC' | 'QR' | 'MANUAL';
export type ConnectionStatus = 'PENDING' | 'CONNECTED' | 'BLOCKED';
export type LeadStatus = 'NEW' | 'WARM' | 'HOT';
export type FollowUpType = 'CALL' | 'MEETING' | 'EMAIL' | 'SEND_DOCUMENT' | 'INVITATION' | 'OTHER';
export type FollowUpStatus = 'TODO' | 'DONE' | 'CANCELLED';
export type VisibilityLevel = 'PUBLIC' | 'MEMBERS_ONLY' | 'ORGANIZATION_ONLY' | 'PRIVATE';
export type RoleType = 'SUPER_ADMIN' | 'ORGANIZER' | 'ORG_ADMIN' | 'EVENT_OPERATOR' | 'MEMBER' | 'GUEST';

export interface IdentitySocialLink {
  id: string;
  identityId: string;
  platform: 'linkedin' | 'zalo' | 'facebook' | 'website' | 'github' | 'phone';
  url: string;
  isPublic: boolean;
  sortOrder?: number;
}

export interface PersonBusiness {
  id: string;
  personIdentityId: string;
  businessId: string;
  businessName: string;
  businessLogo?: string;
  position?: string;
  department?: string;
  taxCode?: string;
  address?: string;
  association?: string;
  slogan?: string;
  industry?: string;
  expertiseSkills?: string[];
  relationType: string;
  isPrimary: boolean;
  status: PersonBusinessStatus;
}

export interface PersonIdentity {
  id: string;
  userId: string;
  username: string;
  fullName: string;
  displayName?: string;
  avatarUrl?: string;
  coverUrl?: string;
  title?: string;
  bio?: string;
  phone?: string;
  email?: string;
  password?: string;
  role?: RoleType;
  website?: string;
  taxCode?: string;
  address?: string;
  association?: string;
  slogan?: string;
  industry?: string; // Lĩnh vực chuyên môn / Ngành nghề hoạt động
  expertiseSkills?: string[]; // Kỹ năng / Lĩnh vực chuyên sâu (Tags)
  seekingNeeds?: string[]; // Nhu cầu tìm kiếm / Cần hợp tác (Seeking)
  offeringServices?: string[]; // Năng lực cung cấp / Giải pháp (Offering)
  brochureUrl?: string; // Tài liệu Catalogue / Profile công ty (PDF/Link)
  membershipTier?: 'MEMBER' | 'VIP_DIAMOND' | 'EXECUTIVE_BOARD'; // Cấp bậc hội viên
  socialLinks: IdentitySocialLink[];
  businesses: PersonBusiness[];
  createdAt: string;
  updatedAt: string;
}


export interface AccessCard {
  id: string;
  personIdentityId: string;
  cardUid: string;
  cardType: 'NFC_BUSINESS_PRO' | 'NFC_EXECUTIVE' | 'NFC_STANDARD';
  nfcIdentifier?: string;
  dynamicUrl: string;
  qrValue: string;
  status: CardStatus;
  issuedAt: string;
  lastUsedAt?: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  coverUrl?: string;
  description?: string;
  website?: string;
  industry?: string;
  memberCount: number;
  status: OrganizationStatus;
  createdAt: string;
}

export interface Event {
  id: string;
  organizationId: string;
  organizationName: string;
  name: string;
  slug: string;
  description?: string;
  bannerUrl?: string;
  startAt: string;
  endAt: string;
  locationName: string;
  address?: string;
  registrationCount: number;
  checkInCount: number;
  capacity?: number;
  status: EventStatus;
}

export interface EventRegistration {
  id: string;
  eventId: string;
  personIdentityId: string;
  registrationStatus: RegistrationStatus;
  registeredAt: string;
  ticketType?: string;
  invitationCode?: string;
}

export interface CheckIn {
  id: string;
  eventId: string;
  registrationId: string;
  personIdentityId: string;
  method: CheckInMethod;
  checkedInAt: string;
  operatorUserId?: string;
  operatorName?: string;
}

export interface Connection {
  id: string;
  requesterIdentityId: string;
  receiverIdentityId: string;
  status: ConnectionStatus;
  connectedAt?: string;
  createdAt: string;
  // Computed fields for UI rendering
  partner?: PersonIdentity;
  contextEventName?: string;
  notesCount?: number;
}

export interface ConnectionNote {
  id: string;
  connectionId: string;
  ownerIdentityId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface Tag {
  id: string;
  ownerIdentityId: string;
  name: string;
  color?: string;
}

export interface Lead {
  id: string;
  connectionId: string;
  ownerIdentityId: string;
  status: LeadStatus;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH';
  estimatedValue?: number;
  source?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PrivacySetting {
  userId: string;
  profileVisibility: VisibilityLevel;
  contactVisibility: VisibilityLevel;
  eventDirectoryVisibility: VisibilityLevel;
  membershipVisibility: VisibilityLevel;
  connectionVisibility: VisibilityLevel;
}

export interface AuditLog {
  id: string;
  actorUserId: string;
  actorName: string;
  action: string;
  objectType: string;
  objectId: string;
  ipAddress?: string;
  createdAt: string;
}
