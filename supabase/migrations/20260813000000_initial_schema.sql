-- ====================================================================
-- ONE CONNECT NETWORK - INITIAL DATABASE SCHEMA MIGRATION (SUPABASE)
-- Version: 1.0.1 (Idempotent Safe Run)
-- Author: Senior Full-stack Developer
-- Description: Core 7 tables with Enums, Constraints, RLS & Performance Indexes
-- ====================================================================

-- 1. EXTENSIONS & ENUMS SETUP
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Safe ENUM Creation (Idempotent)
DO $$ 
BEGIN
  -- Enum: Vai trò người dùng trong hệ thống
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE public.user_role AS ENUM (
      'super_admin',
      'association_admin',
      'organizer',
      'attendee'
    );
  END IF;

  -- Enum: Trạng thái Hiệp hội
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'association_status') THEN
    CREATE TYPE public.association_status AS ENUM (
      'active',
      'inactive',
      'pending'
    );
  END IF;

  -- Enum: Trạng thái Hội viên
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'membership_status') THEN
    CREATE TYPE public.membership_status AS ENUM (
      'active',
      'pending',
      'expired'
    );
  END IF;

  -- Enum: Trạng thái Sự kiện
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'event_status') THEN
    CREATE TYPE public.event_status AS ENUM (
      'draft',
      'published',
      'ongoing',
      'completed',
      'cancelled'
    );
  END IF;

  -- Enum: Trạng thái Vé tham dự
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ticket_status') THEN
    CREATE TYPE public.ticket_status AS ENUM (
      'issued',
      'checked_in',
      'cancelled'
    );
  END IF;

  -- Enum: Trạng thái Kết nối Business Matching
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'matching_status') THEN
    CREATE TYPE public.matching_status AS ENUM (
      'pending',
      'accepted',
      'rejected'
    );
  END IF;
END $$;

-- ====================================================================
-- 2. TABLES DEFINITIONS
-- ====================================================================

-- Table 1: USERS (Hồ sơ người dùng / Doanh nhân)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  role public.user_role NOT NULL DEFAULT 'attendee',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table 2: ASSOCIATIONS (Hiệp hội / Câu lạc bộ Doanh nghiệp)
CREATE TABLE IF NOT EXISTS public.associations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  description TEXT,
  status public.association_status NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table 3: MEMBERSHIPS (Quan hệ Hội viên giữa User và Hiệp hội)
CREATE TABLE IF NOT EXISTS public.memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  association_id UUID NOT NULL REFERENCES public.associations(id) ON DELETE CASCADE,
  member_code TEXT,
  position TEXT DEFAULT 'Hội viên',
  status public.membership_status NOT NULL DEFAULT 'active',
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_user_association UNIQUE (user_id, association_id)
);

-- Table 4: EVENTS (Sự kiện do Hiệp hội tổ chức)
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  association_id UUID NOT NULL REFERENCES public.associations(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  banner_url TEXT,
  location TEXT NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  status public.event_status NOT NULL DEFAULT 'published',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table 5: TICKETS (Vé tham dự & Mã QR Badge đại biểu)
CREATE TABLE IF NOT EXISTS public.tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  qr_code_hash TEXT UNIQUE NOT NULL,
  status public.ticket_status NOT NULL DEFAULT 'issued',
  checked_in_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_event_user_ticket UNIQUE (event_id, user_id)
);

-- Table 6: CHECKINS (Nhật ký Check-in NFC / QR realtime)
CREATE TABLE IF NOT EXISTS public.checkins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  ticket_id UUID NOT NULL REFERENCES public.tickets(id) ON DELETE CASCADE,
  scanned_by_user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  scan_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  location_gate TEXT NOT NULL DEFAULT 'Cửa Chính'
);

-- Table 7: BUSINESS_MATCHING (Yêu cầu kết nối giao thương B2B)
CREATE TABLE IF NOT EXISTS public.business_matching (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  sender_user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  receiver_user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  status public.matching_status NOT NULL DEFAULT 'pending',
  meeting_time TIMESTAMPTZ,
  table_number TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_sender_receiver_different CHECK (sender_user_id <> receiver_user_id)
);

-- ====================================================================
-- 3. INDEXES FOR HIGH PERFORMANCE QUERYING (<0.5s NFC LOOKUP)
-- ====================================================================
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);

CREATE INDEX IF NOT EXISTS idx_associations_code ON public.associations(code);

CREATE INDEX IF NOT EXISTS idx_memberships_user ON public.memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_memberships_assoc ON public.memberships(association_id);

CREATE INDEX IF NOT EXISTS idx_events_assoc ON public.events(association_id);
CREATE INDEX IF NOT EXISTS idx_events_start_time ON public.events(start_time);

CREATE INDEX IF NOT EXISTS idx_tickets_qr_hash ON public.tickets(qr_code_hash);
CREATE INDEX IF NOT EXISTS idx_tickets_event_user ON public.tickets(event_id, user_id);

CREATE INDEX IF NOT EXISTS idx_checkins_event ON public.checkins(event_id);
CREATE INDEX IF NOT EXISTS idx_checkins_ticket ON public.checkins(ticket_id);
CREATE INDEX IF NOT EXISTS idx_checkins_scan_time ON public.checkins(scan_time DESC);

CREATE INDEX IF NOT EXISTS idx_matching_event ON public.business_matching(event_id);
CREATE INDEX IF NOT EXISTS idx_matching_sender ON public.business_matching(sender_user_id);
CREATE INDEX IF NOT EXISTS idx_matching_receiver ON public.business_matching(receiver_user_id);

-- ====================================================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

-- 4.1. USERS RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access to basic user profiles" ON public.users;
CREATE POLICY "Allow public read access to basic user profiles"
  ON public.users FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow users to update their own profile" ON public.users;
CREATE POLICY "Allow users to update their own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

-- 4.2. ASSOCIATIONS RLS
ALTER TABLE public.associations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access to active associations" ON public.associations;
CREATE POLICY "Allow public read access to active associations"
  ON public.associations FOR SELECT
  USING (status = 'active');

DROP POLICY IF EXISTS "Allow admins to create or update associations" ON public.associations;
CREATE POLICY "Allow admins to create or update associations"
  ON public.associations FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role IN ('super_admin', 'association_admin')
    )
  );

-- 4.3. MEMBERSHIPS RLS
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow members to read their memberships" ON public.memberships;
CREATE POLICY "Allow members to read their memberships"
  ON public.memberships FOR SELECT
  USING (user_id = auth.uid() OR EXISTS (
    SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.role IN ('super_admin', 'association_admin')
  ));

DROP POLICY IF EXISTS "Allow admins to manage memberships" ON public.memberships;
CREATE POLICY "Allow admins to manage memberships"
  ON public.memberships FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role IN ('super_admin', 'association_admin')
    )
  );

-- 4.4. EVENTS RLS
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access to published events" ON public.events;
CREATE POLICY "Allow public read access to published events"
  ON public.events FOR SELECT
  USING (status IN ('published', 'ongoing', 'completed'));

DROP POLICY IF EXISTS "Allow organizers and admins to manage events" ON public.events;
CREATE POLICY "Allow organizers and admins to manage events"
  ON public.events FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role IN ('super_admin', 'association_admin', 'organizer')
    )
  );

-- 4.5. TICKETS RLS
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow attendees to view their own tickets" ON public.tickets;
CREATE POLICY "Allow attendees to view their own tickets"
  ON public.tickets FOR SELECT
  USING (user_id = auth.uid() OR EXISTS (
    SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.role IN ('super_admin', 'association_admin', 'organizer')
  ));

DROP POLICY IF EXISTS "Allow organizers to issue or update tickets" ON public.tickets;
CREATE POLICY "Allow organizers to issue or update tickets"
  ON public.tickets FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role IN ('super_admin', 'association_admin', 'organizer')
    )
  );

-- 4.6. CHECKINS RLS
ALTER TABLE public.checkins ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow attendees to view their checkin logs" ON public.checkins;
CREATE POLICY "Allow attendees to view their checkin logs"
  ON public.checkins FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.tickets
      WHERE tickets.id = checkins.ticket_id
      AND tickets.user_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role IN ('super_admin', 'association_admin', 'organizer')
    )
  );

DROP POLICY IF EXISTS "Allow organizers/operators to record checkins" ON public.checkins;
CREATE POLICY "Allow organizers/operators to record checkins"
  ON public.checkins FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role IN ('super_admin', 'association_admin', 'organizer')
    )
  );

-- 4.7. BUSINESS MATCHING RLS
ALTER TABLE public.business_matching ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow participants to view their matching requests" ON public.business_matching;
CREATE POLICY "Allow participants to view their matching requests"
  ON public.business_matching FOR SELECT
  USING (sender_user_id = auth.uid() OR receiver_user_id = auth.uid() OR EXISTS (
    SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.role IN ('super_admin', 'association_admin', 'organizer')
  ));

DROP POLICY IF EXISTS "Allow attendees to send matching requests" ON public.business_matching;
CREATE POLICY "Allow attendees to send matching requests"
  ON public.business_matching FOR INSERT
  WITH CHECK (sender_user_id = auth.uid());

DROP POLICY IF EXISTS "Allow receiver or admins to update matching status" ON public.business_matching;
CREATE POLICY "Allow receiver or admins to update matching status"
  ON public.business_matching FOR UPDATE
  USING (receiver_user_id = auth.uid() OR EXISTS (
    SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.role IN ('super_admin', 'association_admin', 'organizer')
  ));
