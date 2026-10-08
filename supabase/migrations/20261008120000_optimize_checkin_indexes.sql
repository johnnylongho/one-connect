-- ====================================================================
-- ONE CONNECT NETWORK - CHECK-IN PERFORMANCE OPTIMIZATION INDEXES
-- Purpose: Sub-800ms MICE Check-in SLA & Idempotent Concurrency
-- ====================================================================

-- 1. Fast lookup for event check-in history & duplicate detection
CREATE INDEX IF NOT EXISTS idx_checkins_event_person_status 
ON public.check_ins (event_id, person_identity_id, status);

CREATE INDEX IF NOT EXISTS idx_checkins_event_time_desc 
ON public.check_ins (event_id, check_in_time DESC);

-- 2. Fast lookup for QR Code ticket registration
CREATE INDEX IF NOT EXISTS idx_event_registrations_event_hash 
ON public.event_registrations (event_id, qr_code_hash);

CREATE INDEX IF NOT EXISTS idx_event_registrations_event_person 
ON public.event_registrations (event_id, person_identity_id);

-- 3. Fast lookup for physical NFC card UID
CREATE INDEX IF NOT EXISTS idx_access_cards_uid_status 
ON public.access_cards (card_uid, status);
