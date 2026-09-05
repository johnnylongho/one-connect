-- ====================================================================
-- ONE CONNECT NETWORK - ARTICLES / CMS POSTS TABLE
-- Version: 1.0.0 (SEO & Content Publishing System)
-- ====================================================================

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

-- Index for fast lookup by slug and status
CREATE INDEX IF NOT EXISTS idx_articles_slug ON public.articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_status ON public.articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_category ON public.articles(category);

-- Enable RLS
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read published articles
CREATE POLICY "Allow public read published articles"
  ON public.articles
  FOR SELECT
  USING (status = 'PUBLISHED');

-- Allow all actions for service role and operators
CREATE POLICY "Allow full access for authenticated staff"
  ON public.articles
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
