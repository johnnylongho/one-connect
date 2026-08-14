-- ====================================================================
-- ONE CONNECT NETWORK - ALL-IN-ONE RESET, SCHEMA & SEED DATA (SUPABASE)
-- Version: 3.1.0 (Strict Hexadecimal UUID Compliant)
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. CLEAN DROP ALL OLD / CONFLICTING TABLES & POLICIES
DROP TABLE IF EXISTS public.leads CASCADE;
DROP TABLE IF EXISTS public.connection_notes CASCADE;
DROP TABLE IF EXISTS public.connections CASCADE;
DROP TABLE IF EXISTS public.check_ins CASCADE;
DROP TABLE IF EXISTS public.event_registrations CASCADE;
DROP TABLE IF EXISTS public.events CASCADE;
DROP TABLE IF EXISTS public.memberships CASCADE;
DROP TABLE IF EXISTS public.organizations CASCADE;
DROP TABLE IF EXISTS public.access_cards CASCADE;
DROP TABLE IF EXISTS public.businesses CASCADE;
DROP TABLE IF EXISTS public.person_identities CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- Also drop legacy table names if any
DROP TABLE IF EXISTS public.checkins CASCADE;
DROP TABLE IF EXISTS public.business_matching CASCADE;
DROP TABLE IF EXISTS public.tickets CASCADE;
DROP TABLE IF EXISTS public.associations CASCADE;

-- 3. CREATE 11 CORE PRODUCTION TABLES

-- Table 1: USERS
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE,
  phone TEXT UNIQUE,
  auth_provider TEXT NOT NULL DEFAULT 'otp',
  status TEXT NOT NULL DEFAULT 'ACTIVE',
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table 2: PERSON_IDENTITIES
CREATE TABLE public.person_identities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  title TEXT,
  bio TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table 3: BUSINESSES
CREATE TABLE public.businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_identity_id UUID REFERENCES public.person_identities(id) ON DELETE SET NULL,
  legal_name TEXT NOT NULL,
  display_name TEXT,
  logo_url TEXT,
  tax_code TEXT,
  industry TEXT,
  website TEXT,
  address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table 4: ACCESS_CARDS
CREATE TABLE public.access_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  card_uid TEXT UNIQUE NOT NULL,
  person_identity_id UUID REFERENCES public.person_identities(id) ON DELETE CASCADE,
  card_type TEXT NOT NULL DEFAULT 'PHYSICAL_NFC',
  status TEXT NOT NULL DEFAULT 'ACTIVE',
  issued_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table 5: ORGANIZATIONS
CREATE TABLE public.organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table 6: MEMBERSHIPS
CREATE TABLE public.memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  person_identity_id UUID NOT NULL REFERENCES public.person_identities(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'MEMBER',
  member_code TEXT,
  position TEXT,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'ACTIVE',
  UNIQUE (person_identity_id, organization_id)
);

-- Table 7: EVENTS
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  banner_url TEXT,
  location TEXT NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'PUBLISHED',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table 8: EVENT_REGISTRATIONS
CREATE TABLE public.event_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  person_identity_id UUID NOT NULL REFERENCES public.person_identities(id) ON DELETE CASCADE,
  qr_code_hash TEXT UNIQUE NOT NULL,
  ticket_tier TEXT NOT NULL DEFAULT 'STANDARD',
  status TEXT NOT NULL DEFAULT 'CONFIRMED',
  registered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (event_id, person_identity_id)
);

-- Table 9: CHECK_INS
CREATE TABLE public.check_ins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  person_identity_id UUID NOT NULL REFERENCES public.person_identities(id) ON DELETE CASCADE,
  check_in_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  method TEXT NOT NULL DEFAULT 'NFC',
  scanned_by_user_id UUID REFERENCES public.users(id),
  gate_location TEXT DEFAULT 'Gate 1 - Main Entrance',
  status TEXT NOT NULL DEFAULT 'CHECKED_IN',
  latency_ms INT DEFAULT 180,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table 10: CONNECTIONS
CREATE TABLE public.connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_identity_id UUID NOT NULL REFERENCES public.person_identities(id) ON DELETE CASCADE,
  receiver_identity_id UUID NOT NULL REFERENCES public.person_identities(id) ON DELETE CASCADE,
  event_id UUID REFERENCES public.events(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'PENDING',
  requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  responded_at TIMESTAMPTZ,
  UNIQUE (requester_identity_id, receiver_identity_id, event_id)
);

-- Table 11: CONNECTION_NOTES & LEADS
CREATE TABLE public.connection_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  connection_id UUID NOT NULL REFERENCES public.connections(id) ON DELETE CASCADE,
  author_identity_id UUID NOT NULL REFERENCES public.person_identities(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  connection_id UUID NOT NULL REFERENCES public.connections(id) ON DELETE CASCADE,
  owner_identity_id UUID NOT NULL REFERENCES public.person_identities(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'WARM',
  potential_value NUMERIC(15, 2),
  next_action TEXT,
  follow_up_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (connection_id, owner_identity_id)
);

-- 4. PERFORMANCE INDEXES
CREATE INDEX idx_access_cards_uid ON public.access_cards (card_uid);
CREATE INDEX idx_registrations_qr ON public.event_registrations (qr_code_hash);
CREATE INDEX idx_checkins_event_person ON public.check_ins (event_id, person_identity_id);
CREATE INDEX idx_connections_participants ON public.connections (requester_identity_id, receiver_identity_id);
CREATE INDEX idx_leads_owner ON public.leads (owner_identity_id, status);

-- 5. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.person_identities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.access_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.check_ins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connection_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read events" ON public.events FOR SELECT USING (true);
CREATE POLICY "Public read active cards" ON public.access_cards FOR SELECT USING (true);
CREATE POLICY "Public read person identities" ON public.person_identities FOR SELECT USING (true);
CREATE POLICY "Public read businesses" ON public.businesses FOR SELECT USING (true);
CREATE POLICY "Allow all access checkins" ON public.check_ins FOR ALL USING (true);
CREATE POLICY "Allow all access registrations" ON public.event_registrations FOR ALL USING (true);
CREATE POLICY "Allow all access connections" ON public.connections FOR ALL USING (true);
CREATE POLICY "Allow all access notes" ON public.connection_notes FOR ALL USING (true);
CREATE POLICY "Allow all access leads" ON public.leads FOR ALL USING (true);

-- 6. INSERT SEED DATA (STRICT VALID HEXADECIMAL UUIDS ONLY)
INSERT INTO public.users (id, email, phone, auth_provider, status) VALUES
('11111111-1111-1111-1111-111111111111', 'johnny@aplusvn.com', '0901234567', 'otp', 'ACTIVE'),
('22222222-2222-2222-2222-222222222222', 'thuha@aplusvn.com', '0912345678', 'otp', 'ACTIVE'),
('33333333-3333-3333-3333-333333333333', 'minhduc@techcorp.vn', '0923456789', 'otp', 'ACTIVE'),
('44444444-4444-4444-4444-444444444444', 'hoangnam@innovatex.io', '0934567890', 'otp', 'ACTIVE'),
('55555555-5555-5555-5555-555555555555', 'phuonganh@globalbiz.com', '0945678901', 'otp', 'ACTIVE');

INSERT INTO public.person_identities (id, user_id, full_name, display_name, title, avatar_url, phone, email, website, bio) VALUES
('11111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Johnny Long Hồ', 'Long Hồ', 'Project Manager kiêm Media', '/avatar-johnny-long.jpg', '0901234567', 'johnny@aplusvn.com', 'https://aplusvn.com', 'Chuyên gia triển khai giải pháp hạ tầng danh thiếp số NFC và định danh doanh nghiệp.'),
('22222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'Nguyễn Thu Hà', 'Thu Hà', 'Giám đốc Chiến lược', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80', '0912345678', 'thuha@aplusvn.com', 'https://aplusvn.com', 'Phụ trách chiến lược kết nối giao thương và hợp tác đối tác chiến lược.'),
('33333333-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', 'Trần Minh Đức', 'Minh Đức', 'Chủ tịch HĐQT TechCorp', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80', '0923456789', 'minhduc@techcorp.vn', 'https://techcorp.vn', 'Lãnh đạo đổi mới sáng tạo trong ngành chuyển đổi số và công nghệ phần mềm.'),
('44444444-4444-4444-4444-444444444444', '44444444-4444-4444-4444-444444444444', 'Lê Hoàng Nam', 'Hoàng Nam', 'CEO & Founder InnovateX', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80', '0934567890', 'hoangnam@innovatex.io', 'https://innovatex.io', 'Sáng lập và điều hành nền tảng giải pháp tự động hóa thông minh.'),
('55555555-5555-5555-5555-555555555555', '55555555-5555-5555-5555-555555555555', 'Phạm Phương Anh', 'Phương Anh', 'Giám đốc Marketing GlobalBiz', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80', '0945678901', 'phuonganh@globalbiz.com', 'https://globalbiz.com', 'Chuyên gia Marketing quốc tế và xúc tiến thương mại đa kênh.');

INSERT INTO public.businesses (id, owner_identity_id, legal_name, display_name, tax_code, industry, website) VALUES
('aa111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Công ty Cổ phần Công nghệ Aplusvn', 'Aplusvn Media & Tech', '0312345678', 'Công nghệ thông tin', 'https://aplusvn.com'),
('aa222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333', 'Tập đoàn Công nghệ TechCorp Việt Nam', 'TechCorp Vietnam', '0323456789', 'Phần mềm & AI', 'https://techcorp.vn');

INSERT INTO public.access_cards (id, card_uid, person_identity_id, card_type, status) VALUES
('ba111111-1111-1111-1111-111111111111', 'NFC-HA-777', '11111111-1111-1111-1111-111111111111', 'NFC_BUSINESS_PRO', 'ACTIVE'),
('ba222222-2222-2222-2222-222222222222', 'NFC-TH-888', '22222222-2222-2222-2222-222222222222', 'NFC_BUSINESS_PRO', 'ACTIVE'),
('ba333333-3333-3333-3333-333333333333', 'NFC-MD-999', '33333333-3333-3333-3333-333333333333', 'NFC_EXECUTIVE', 'ACTIVE'),
('ba444444-4444-4444-4444-444444444444', 'NFC-HN-111', '44444444-4444-4444-4444-444444444444', 'NFC_STANDARD', 'ACTIVE'),
('ba555555-5555-5555-5555-555555555555', 'NFC-PA-222', '55555555-5555-5555-5555-555555555555', 'NFC_STANDARD', 'ACTIVE');

INSERT INTO public.organizations (id, name, code, logo_url, description, status) VALUES
('ca111111-1111-1111-1111-111111111111', 'Hiệp hội Doanh nhân Công nghệ Aplusvn', 'APLUS_NET', 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=300&auto=format&fit=crop&q=80', 'Mạng lưới kết nối trên 5,000 Doanh nhân, Hiệp hội & Đối tác thương mại Việt Nam.', 'ACTIVE');

INSERT INTO public.memberships (id, person_identity_id, organization_id, member_code, position, role, status) VALUES
('da111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'ca111111-1111-1111-1111-111111111111', 'APLUS-M001', 'Project Manager kiêm Media', 'ORGANIZATION_ADMIN', 'ACTIVE'),
('da222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'ca111111-1111-1111-1111-111111111111', 'APLUS-M002', 'Giám đốc Chiến lược', 'ORGANIZATION_BOARD', 'ACTIVE'),
('da333333-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', 'ca111111-1111-1111-1111-111111111111', 'APLUS-M003', 'Chủ tịch HĐQT TechCorp', 'MEMBER', 'ACTIVE'),
('da444444-4444-4444-4444-444444444444', '44444444-4444-4444-4444-444444444444', 'ca111111-1111-1111-1111-111111111111', 'APLUS-M004', 'CEO & Founder InnovateX', 'MEMBER', 'ACTIVE'),
('da555555-5555-5555-5555-555555555555', '55555555-5555-5555-5555-555555555555', 'ca111111-1111-1111-1111-111111111111', 'APLUS-M005', 'Giám đốc Marketing GlobalBiz', 'MEMBER', 'ACTIVE');

INSERT INTO public.events (id, organization_id, title, description, banner_url, location, start_time, end_time, status) VALUES
('ea111111-1111-1111-1111-111111111111', 'ca111111-1111-1111-1111-111111111111', 'Diễn Đàn Kết Nối Doanh Nghiệp Việt Nam 2026', 'Sự kiện giao thương B2B kết nối 500+ doanh nhân hàng đầu Việt Nam.', 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&auto=format&fit=crop&q=80', 'Trung tâm Hội nghị Quốc gia, Hà Nội', NOW() - INTERVAL '2 hours', NOW() + INTERVAL '6 hours', 'PUBLISHED'),
('ea222222-2222-2222-2222-222222222222', 'ca111111-1111-1111-1111-111111111111', 'Hội Thảo Chuyển Đổi Số & Định Danh NFC Doanh Nhân', 'Ứng dụng thẻ thông minh NFC và mã định danh số trong xúc tiến thương mại.', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80', 'Khách sạn Landmark 81, TP. Hồ Chí Minh', NOW() + INTERVAL '15 days', NOW() + INTERVAL '15 days 4 hours', 'PUBLISHED');

INSERT INTO public.event_registrations (id, event_id, person_identity_id, qr_code_hash, ticket_tier, status, registered_at) VALUES
('fa111111-1111-1111-1111-111111111111', 'ea111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'QR_ONECONNECT_JOHNNY_2026', 'VIP', 'CONFIRMED', NOW() - INTERVAL '2 days'),
('fa222222-2222-2222-2222-222222222222', 'ea111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', 'QR_ONECONNECT_MINHDUC_2026', 'VIP', 'CONFIRMED', NOW() - INTERVAL '2 days'),
('fa333333-3333-3333-3333-333333333333', 'ea111111-1111-1111-1111-111111111111', '44444444-4444-4444-4444-444444444444', 'QR_ONECONNECT_HOANGNAM_2026', 'STANDARD', 'CONFIRMED', NOW() - INTERVAL '1 day'),
('fa444444-4444-4444-4444-444444444444', 'ea111111-1111-1111-1111-111111111111', '55555555-5555-5555-5555-555555555555', 'QR_ONECONNECT_PHUONGANH_2026', 'STANDARD', 'CONFIRMED', NOW() - INTERVAL '1 day'),
('fa555555-5555-5555-5555-555555555555', 'ea222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'QR_ONECONNECT_JOHNNY_EVENT2', 'VIP', 'CONFIRMED', NOW() - INTERVAL '3 days');

INSERT INTO public.check_ins (id, event_id, person_identity_id, method, check_in_time, gate_location, status, latency_ms) VALUES
('fb111111-1111-1111-1111-111111111111', 'ea111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'NFC', NOW() - INTERVAL '1 hour', 'Gate 1 - VIP NFC Terminal', 'CHECKED_IN', 140),
('fb222222-2222-2222-2222-222222222222', 'ea111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', 'QR', NOW() - INTERVAL '30 minutes', 'Gate 2 - QR Fast Lane', 'CHECKED_IN', 180),
('fb333333-3333-3333-3333-333333333333', 'ea111111-1111-1111-1111-111111111111', '55555555-5555-5555-5555-555555555555', 'NFC', NOW() - INTERVAL '10 minutes', 'Gate 1 - VIP NFC Terminal', 'CHECKED_IN', 125);

INSERT INTO public.connections (id, requester_identity_id, receiver_identity_id, event_id, status, requested_at, responded_at) VALUES
('fc111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', 'ea111111-1111-1111-1111-111111111111', 'ACCEPTED', NOW() - INTERVAL '45 minutes', NOW() - INTERVAL '40 minutes'),
('fc222222-2222-2222-2222-222222222222', '44444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', 'ea111111-1111-1111-1111-111111111111', 'PENDING', NOW() - INTERVAL '20 minutes', NULL),
('fc333333-3333-3333-3333-333333333333', '55555555-5555-5555-5555-555555555555', '33333333-3333-3333-3333-333333333333', 'ea111111-1111-1111-1111-111111111111', 'ACCEPTED', NOW() - INTERVAL '15 minutes', NOW() - INTERVAL '12 minutes');

INSERT INTO public.connection_notes (id, connection_id, author_identity_id, content, tags) VALUES
('fd111111-1111-1111-1111-111111111111', 'fc111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Anh Đức quan tâm triển khai 1,000 thẻ thông minh One Connect cho toàn bộ cán bộ cấp cao và đối tác TechCorp.', ARRAY['Khách hàng VIP', 'NFC Business', 'Hợp đồng Q3']);

INSERT INTO public.leads (id, connection_id, owner_identity_id, status, potential_value, next_action, follow_up_date) VALUES
('fe111111-1111-1111-1111-111111111111', 'fc111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'HOT', 250000000, 'Gửi bảng báo giá chi tiết và demo mẫu thẻ vật lý', CURRENT_DATE + INTERVAL '2 days');
