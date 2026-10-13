export type UserRole = 'SUPER_ADMIN' | 'ORG_ADMIN' | 'OPERATOR' | 'MEMBER' | 'GUEST';

export type CardStatus = 'INACTIVE' | 'ASSIGNED' | 'ACTIVE' | 'BLOCKED';
export type CardMaterial = 'OBSIDIAN_BLACK_METAL' | 'ROYAL_GOLD_BRASS' | 'MATTE_PLATINUM' | 'ECO_POLYMER';

export type TicketTier = 'VIP' | 'GUEST' | 'SPEAKER' | 'ORGANIZER' | 'DELEGATE';
export type CheckInMethod = 'NFC_TAP' | 'QR_SCAN' | 'MANUAL_OPERATOR';

export type ConsentStatus = 'PENDING' | 'ACCEPTED_2WAY' | 'REJECTED' | 'REVOKED';
export type LeadStatus = 'HOT' | 'WARM' | 'COLD' | 'CONVERTED';

export interface GlobalPerformanceStats {
  nfc_cards: {
    total_assigned: number;
    inventory_cap: number;
    pwa_tap_speed: string;
    active_rate: number;
  };
  event_checkin: {
    total_checkins: number;
    vip_count: number;
    reception_rate: number;
    sla_compliance: string;
  };
  b2b_connections: {
    total_connections: number;
    two_way_consents: number;
    pdpl_compliance_rate: number;
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
    accuracy_rate: number;
    total_deal_pipeline_vnd: string;
    b2b_tables_active: number;
  };
  pilot_milestones: {
    completed_events: number;
    active_events: number;
    next_event_name: string;
    next_event_time: string;
    hotel_partners: string;
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
  connection_score: number;
  card_uid: string;
  method: CheckInMethod;
  vneid_verified: boolean;
  avatar_url?: string;
  phone?: string;
  email?: string;
}

export interface ToastItem {
  id: string;
  groupKey?: string;
  title?: string;
  message: string;
  count: number;
  type: 'success' | 'info' | 'warning' | 'error';
  entityId?: string;
  entityName?: string;
  actionLabel?: string;
  onAction?: () => void;
  createdAt: number;
}
