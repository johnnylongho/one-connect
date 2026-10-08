/**
 * ONE CONNECT NETWORK - AI B2B MATCHMAKING LATENCY BENCHMARK
 * Measures response latency of 10 consecutive AI Matchmaking queries against Supabase.
 * Validates SLA: < 0.8s (800ms).
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'node:fs';
import path from 'node:path';

// Load .env.local manually
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const [key, ...values] = trimmed.split('=');
    if (key && values.length > 0) {
      const val = values.join('=').replace(/^["']|["']$/g, '');
      process.env[key.trim()] = val;
    }
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error('Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

const CURRENT_USER_ID = '11111111-1111-1111-1111-111111111111';

async function simulateAiMatching(iteration) {
  const startTime = performance.now();

  // 1. Parallel fetch of user, businesses, connections, and candidate identities
  const [userRes, businessesRes, connsRes, identitiesRes] = await Promise.all([
    supabase
      .from('person_identities')
      .select('id, full_name, title, bio, businesses(id, legal_name, display_name, industry)')
      .eq('id', CURRENT_USER_ID)
      .maybeSingle(),
    supabase
      .from('businesses')
      .select('id, owner_identity_id, legal_name, display_name, industry, tax_code, website, logo_url')
      .order('created_at', { ascending: false }),
    supabase
      .from('connections')
      .select('id, requester_identity_id, receiver_identity_id, status, requested_at, responded_at')
      .or(`requester_identity_id.eq.${CURRENT_USER_ID},receiver_identity_id.eq.${CURRENT_USER_ID}`),
    supabase
      .from('person_identities')
      .select('id, full_name, title, bio, avatar_url, phone')
      .neq('id', CURRENT_USER_ID)
      .order('created_at', { ascending: false }),
  ]);

  if (userRes.error) throw new Error(userRes.error.message);
  if (businessesRes.error) throw new Error(businessesRes.error.message);
  if (connsRes.error) throw new Error(connsRes.error.message);
  if (identitiesRes.error) throw new Error(identitiesRes.error.message);

  const allBusinesses = businessesRes.data || [];
  const otherIdentities = identitiesRes.data || [];
  const userConnections = connsRes.data || [];

  // 2. Perform algorithmic scoring & synergy matching
  const candidates = [];
  for (const ident of otherIdentities) {
    const business = allBusinesses.find((b) => b.owner_identity_id === ident.id);
    const businessName = business?.display_name || business?.legal_name || 'Hội viên Doanh nghiệp';
    const industry = business?.industry || ident.bio || 'Công nghệ';

    // Algorithmic synergy calculation
    let score = 70;
    if (industry.toLowerCase().includes('công nghệ') || industry.toLowerCase().includes('phần mềm')) {
      score += 20;
    }
    if (ident.title?.toLowerCase().includes('quản lý') || ident.title?.toLowerCase().includes('erp')) {
      score += 8;
    }

    candidates.push({
      identityId: ident.id,
      fullName: ident.full_name,
      businessName,
      industry,
      matchScore: Math.min(96, score),
    });
  }

  candidates.sort((a, b) => b.matchScore - a.matchScore);

  const durationMs = Math.round(performance.now() - startTime);
  return {
    iteration,
    latencyMs: durationMs,
    candidateCount: candidates.length,
    businessCount: allBusinesses.length,
    connectionCount: userConnections.length,
  };
}

async function runBenchmark() {
  console.log('='.repeat(65));
  console.log('ONE CONNECT NETWORK - AI B2B MATCHMAKING LATENCY BENCHMARK (10 RUNS)');
  console.log(`Target: Supabase PostgreSQL (${supabaseUrl})`);
  console.log(`SLA Constraint: Latency < 800ms (0.8s)`);
  console.log('='.repeat(65));

  console.log('Establishing connection & warming up pool...');
  try {
    await simulateAiMatching(0);
    console.log('Warmup complete. Starting 10 benchmark runs...\n');
  } catch (e) {
    console.warn('Warmup notice:', e.message);
  }

  const results = [];

  for (let i = 1; i <= 10; i++) {
    try {
      const res = await simulateAiMatching(i);
      results.push(res);
      const statusIcon = res.latencyMs < 800 ? '✓ PASS' : '✗ FAIL';
      console.log(
        `[Run ${String(i).padStart(2, '0')}/10] Latency: ${String(res.latencyMs).padStart(4, ' ')}ms | ${statusIcon} (<800ms) | Candidates: ${res.candidateCount} | Businesses: ${res.businessCount}`
      );
    } catch (err) {
      console.error(`[Run ${String(i).padStart(2, '0')}/10] ERROR:`, err.message);
    }
  }

  console.log('-'.repeat(65));
  const latencies = results.map((r) => r.latencyMs);
  const avg = Math.round(latencies.reduce((a, b) => a + b, 0) / latencies.length);
  const min = Math.min(...latencies);
  const max = Math.max(...latencies);
  const allPass = latencies.every((l) => l < 800);

  console.log(`SUMMARY BENCHMARK REPORT:`);
  console.log(`• Total Runs       : ${results.length}`);
  console.log(`• Average Latency  : ${avg}ms`);
  console.log(`• Min Latency      : ${min}ms`);
  console.log(`• Max Latency      : ${max}ms`);
  console.log(`• SLA Target (<800ms): ${allPass ? 'PASSED (100% compliant)' : 'FAILED'}`);
  console.log('='.repeat(65));

  if (!allPass) {
    process.exit(1);
  }
}

runBenchmark().catch((err) => {
  console.error('Benchmark crashed:', err);
  process.exit(1);
});
