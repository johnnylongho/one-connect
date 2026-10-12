-- ====================================================================
-- ONE CONNECT NETWORK - APPLY MISSING PRODUCTION MIGRATIONS
-- Tables: articles, market_leads, market_demand_events
-- Idempotent & Safe Execution (IF NOT EXISTS)
-- ====================================================================

-- 1. Table: ARTICLES (CMS & SEO Articles)
CREATE TABLE IF NOT EXISTS public.articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  cover_image TEXT,
  category TEXT NOT NULL DEFAULT 'TRANSFORMATION',
  tags TEXT[] DEFAULT '{}',
  author_name TEXT NOT NULL DEFAULT 'Ban Biên Tập One Connect',
  author_avatar TEXT DEFAULT '/brand_logo_transparent.png',
  status TEXT NOT NULL DEFAULT 'PUBLISHED',
  read_time INT NOT NULL DEFAULT 5,
  views_count INT NOT NULL DEFAULT 0,
  seo_title TEXT,
  seo_description TEXT,
  published_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_articles_slug ON public.articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_status ON public.articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_category ON public.articles(category);

ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'articles' AND policyname = 'Allow public read published articles'
  ) THEN
    CREATE POLICY "Allow public read published articles"
      ON public.articles
      FOR SELECT
      USING (status = 'PUBLISHED');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'articles' AND policyname = 'Allow full access for authenticated staff'
  ) THEN
    CREATE POLICY "Allow full access for authenticated staff"
      ON public.articles
      FOR ALL
      TO authenticated
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

-- 2. Table: MARKET_LEADS (Inbound Service Package Leads)
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

-- 3. Table: MARKET_DEMAND_EVENTS (Click and view tracking)
CREATE TABLE IF NOT EXISTS public.market_demand_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  package_type TEXT NOT NULL,
  event_type TEXT NOT NULL DEFAULT 'CLICK_CTA', -- 'VIEW_PACKAGE', 'CLICK_CTA', 'OPEN_MODAL', 'SUBMIT_LEAD'
  referrer TEXT,
  user_agent TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. RLS for Market Leads & Events
ALTER TABLE public.market_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_demand_events ENABLE ROW LEVEL SECURITY;

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
