-- ====================================================================
-- ONE CONNECT NETWORK - MARKET DEMAND & LEADS TRACKING SCHEMA
-- ====================================================================

-- 1. Table: MARKET_LEADS
CREATE TABLE IF NOT EXISTS public.market_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  package_type TEXT NOT NULL, -- 'ENTREPRENEUR', 'MICE_ENTERPRISE', 'ASSOCIATION'
  package_name TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  company_name TEXT,
  organization_type TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'NEW', -- 'NEW', 'CONTACTED', 'CONSULTING', 'WON', 'LOST'
  source TEXT DEFAULT 'WEBSITE_SERVICES',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Table: MARKET_DEMAND_EVENTS (Click and view tracking)
CREATE TABLE IF NOT EXISTS public.market_demand_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  package_type TEXT NOT NULL,
  event_type TEXT NOT NULL DEFAULT 'CLICK_CTA', -- 'VIEW_PACKAGE', 'CLICK_CTA', 'OPEN_MODAL', 'SUBMIT_LEAD'
  referrer TEXT,
  user_agent TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Row Level Security & Open Access for Inbound Leads
ALTER TABLE public.market_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_demand_events ENABLE ROW LEVEL SECURITY;

-- Allow public anonymous insert for inbound leads and events
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'market_leads' AND policyname = 'Allow public insert for market leads'
  ) THEN
    CREATE POLICY "Allow public insert for market leads"
      ON public.market_leads FOR INSERT
      WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'market_leads' AND policyname = 'Allow authenticated read/update for market leads'
  ) THEN
    CREATE POLICY "Allow authenticated read/update for market leads"
      ON public.market_leads FOR ALL
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'market_demand_events' AND policyname = 'Allow public insert for demand events'
  ) THEN
    CREATE POLICY "Allow public insert for demand events"
      ON public.market_demand_events FOR INSERT
      WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'market_demand_events' AND policyname = 'Allow authenticated read for demand events'
  ) THEN
    CREATE POLICY "Allow authenticated read for demand events"
      ON public.market_demand_events FOR ALL
      USING (true);
  END IF;
END $$;
