-- ====================================================================
-- ONE CONNECT NETWORK - B2B MATCHMAKING & CONNECTIONS PERFORMANCE INDEXES
-- Purpose: Optimize query performance for AI Matchmaking & Pre-CRM Connections
-- SLA Target: Query response < 0.8s (800ms)
-- ====================================================================

-- 1. Index on connections for fast query by requester identity & status
CREATE INDEX IF NOT EXISTS idx_connections_requester_status
ON public.connections (requester_identity_id, status);

-- 2. Index on connections for fast query by receiver identity & status
CREATE INDEX IF NOT EXISTS idx_connections_receiver_status
ON public.connections (receiver_identity_id, status);

-- 3. Index on connections for event-scoped matchmaking & timeline sorting
CREATE INDEX IF NOT EXISTS idx_connections_event_requested
ON public.connections (event_id, requested_at DESC);

-- 4. Index on businesses for owner lookups & joins
CREATE INDEX IF NOT EXISTS idx_businesses_owner_identity
ON public.businesses (owner_identity_id);

-- 5. Index on businesses industry for category filtering & AI matchmaking
CREATE INDEX IF NOT EXISTS idx_businesses_industry
ON public.businesses (industry);

-- 6. Ensure RLS policies allow authenticated read & insert for connections
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'connections' AND policyname = 'Allow public/authenticated read connections'
  ) THEN
    CREATE POLICY "Allow public/authenticated read connections"
      ON public.connections FOR SELECT
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'connections' AND policyname = 'Allow authenticated insert connections'
  ) THEN
    CREATE POLICY "Allow authenticated insert connections"
      ON public.connections FOR INSERT
      WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'connections' AND policyname = 'Allow update connections'
  ) THEN
    CREATE POLICY "Allow update connections"
      ON public.connections FOR UPDATE
      USING (true);
  END IF;
END $$;
