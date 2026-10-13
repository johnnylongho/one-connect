/**
 * Supabase PostgreSQL Database Contract Types
 * Định nghĩa 14 bảng dữ liệu nghiệp vụ ONE CONNECT NETWORK
 * Căn cứ theo Hồ sơ Đề án ĐMST Khánh Hòa 2026 (Johnny Long Hồ)
 */

export type UserRole = 'SUPER_ADMIN' | 'ORG_ADMIN' | 'OPERATOR' | 'MEMBER' | 'GUEST';

export type CardStatus = 'INACTIVE' | 'ASSIGNED' | 'ACTIVE' | 'BLOCKED';
export type CardMaterial = 'OBSIDIAN_BLACK_METAL' | 'ROYAL_GOLD_BRASS' | 'MATTE_PLATINUM' | 'ECO_POLYMER';

export type TicketTier = 'VIP' | 'GUEST' | 'SPEAKER' | 'ORGANIZER' | 'DELEGATE';
export type CheckInMethod = 'NFC_TAP' | 'QR_SCAN' | 'MANUAL_OPERATOR';

export type ConsentStatus = 'PENDING' | 'ACCEPTED_2WAY' | 'REJECTED' | 'REVOKED';
export type LeadStatus = 'HOT' | 'WARM' | 'COLD' | 'CONVERTED';

export interface User {
  id: string;
  email: string;
  phone: string;
  auth_provider: 'google' | 'zalo' | 'otp';
  role: UserRole;
  created_at: string;
  status: 'ACTIVE' | 'SUSPENDED';
}

export interface PersonIdentity {
  id: string;
  user_id: string;
  full_name: string;
  title: string;
  avatar_url: string;
  bio: string;
  vcard_version: string;
  vneid_verified: boolean;
  dunbar_count: number;
}

export interface Business {
  id: string;
  owner_id: string;
  company_name: string;
  tax_id: string;
  industry: string;
  address: string;
  city: string;
  website: string;
  partnership_demand: string;
  supply_capacity: string;
}

export interface AccessCard {
  id: string;
  card_uid: string; // NFC hardware UID (NTAG213/215/216)
  chip_type: 'NTAG213' | 'NTAG215' | 'NTAG216';
  material: CardMaterial;
  user_id: string | null;
  status: CardStatus;
  activated_at: string | null;
  tap_count: number;
  last_tap_at: string | null;
}

export interface Organization {
  id: string;
  name: string;
  short_code: string;
  type: 'ASSOCIATION' | 'BUSINESS_CLUB' | 'EVENT_ORGANIZER' | 'ENTERPRISE';
  location: string;
  member_count: number;
}

export interface Membership {
  id: string;
  org_id: string;
  user_id: string;
  role_in_org: 'PRESIDENT' | 'VICE_PRESIDENT' | 'MEMBER' | 'TREASURER';
  joined_date: string;
  dues_paid: boolean;
}

export interface Event {
  id: string;
  title: string;
  location: string;
  venue_type: '5_STAR_HOTEL' | 'CONVENTION_CENTER' | 'RESORT';
  start_time: string;
  end_time: string;
  registered_count: number;
  checked_in_count: number;
  is_active: boolean;
}

export interface EventRegistration {
  id: string;
  event_id: string;
  user_id: string;
  ticket_tier: TicketTier;
  qr_code_hash: string;
  assigned_table_number: number | null;
}

export interface CheckIn {
  id: string;
  event_id: string;
  registration_id: string;
  card_uid: string | null;
  method: CheckInMethod;
  checked_in_at: string;
  response_time_ms: number; // SLA < 800ms
  gate_name: string;
  operator_id: string;
}

export interface Connection {
  id: string;
  sender_user_id: string;
  receiver_user_id: string;
  event_id: string;
  consent_status: ConsentStatus;
  consented_at: string | null;
  pdpl_compliant: boolean;
}

export interface ConnectionNote {
  id: string;
  connection_id: string;
  author_id: string;
  meeting_context: string;
  deal_value_estimate_vnd: number;
  tags: string[];
}

export interface Lead {
  id: string;
  owner_id: string;
  lead_user_id: string;
  stage: LeadStatus;
  followup_date: string;
  estimated_deal_size: string;
}

// Bảng dữ liệu tổng hợp cho Trung tâm Điều hành
export interface GlobalPerformanceStats {
  nfc_cards: {
    total_assigned: number;
    inventory_cap: number;
    pwa_tap_speed: string; // e.g. "0.42s"
    active_rate: number; // e.g. 94.7%
  };
  event_checkin: {
    total_checkins: number;
    vip_count: number;
    reception_rate: number; // e.g. 99.2%
    sla_compliance: string; // e.g. "< 0.8s"
  };
  b2b_connections: {
    total_connections: number;
    two_way_consents: number;
    pdpl_compliance_rate: number; // 100%
    active_dialogues: number;
  };
  card_inventory: {
    total_blanks: number;
    allocated: number;
    remaining_critical: number;
    obsidian_gold_alerts: number;
  };
  ai_matchmaking: {
    matched_pairs: number;
    accuracy_rate: number; // e.g. 91.4%
    total_deal_pipeline_vnd: string; // e.g. "48.5 Tỷ"
    b2b_tables_active: number;
  };
  pilot_milestones: {
    completed_events: number;
    active_events: number;
    next_event_name: string;
    next_event_time: string;
    hotel_partners: string; // e.g. "10/10 Khách sạn 5 sao"
  };
}

export interface ActivityFeedItem {
  id: string;
  time: string;
  title: string;
  subtitle: string;
  category: 'CHECK_IN' | 'CONSENT_MATCH' | 'AI_PAIR' | 'CARD_ISSUE' | 'EVENT_LAUNCH';
  badgeType: 'emerald' | 'blue' | 'amber' | 'purple';
  user_name: string;
  organization: string;
}

export interface EntityRecord {
  id: string;
  full_name: string;
  company_name: string;
  title: string;
  tax_id: string;
  event_name: string;
  tier: TicketTier;
  status: 'STABLE_CHECKED' | 'IN_SESSION' | 'PENDING_TAP' | 'VIP_ACCEPTED';
  status_label: string;
  check_in_time: string;
  deal_pipeline: string;
  connection_score: number; // 0 - 100%
  card_uid: string;
  method: CheckInMethod;
  vneid_verified: boolean;
}
