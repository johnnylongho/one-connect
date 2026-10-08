/**
 * ONE CONNECT NETWORK - MICE CHECK-IN LATENCY BENCHMARK
 * Measures response latency of 10 consecutive Check-in requests against Supabase.
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

const EVENT_ID = 'ea111111-1111-1111-1111-111111111111'; // Canonical Event UUID
const TEST_CARD_UID = '04:8F:2A:1B:9C:5D:80'; // Seed NFC Card

async function simulateCheckin(iteration) {
  const startTime = performance.now();

  // 1. Indexed lookup: Access card joined with identity & business
  const { data: card, error: cardError } = await supabase
    .from('access_cards')
    .select('id, card_uid, person_identity_id, status, person_identities(id, full_name, title, avatar_url, phone, email, businesses(legal_name, display_name))')
    .eq('card_uid', TEST_CARD_UID)
    .maybeSingle();

  if (cardError) throw new Error(cardError.message);

  const personId = card?.person_identity_id || '11111111-1111-1111-1111-111111111111';

  // 2. Idempotency Check with indexed compound query (event_id, person_identity_id, status)
  const { data: existingCheckIn } = await supabase
    .from('check_ins')
    .select('id, status, check_in_time')
    .eq('event_id', EVENT_ID)
    .eq('person_identity_id', personId)
    .eq('status', 'CHECKED_IN')
    .maybeSingle();

  let inserted = false;
  if (!existingCheckIn) {
    // 3. Insert Check-in Record only if not already checked in
    const { error: insertError } = await supabase
      .from('check_ins')
      .insert({
        event_id: EVENT_ID,
        person_identity_id: personId,
        method: 'NFC',
        status: 'CHECKED_IN',
        gate_location: 'Gate 1 - VIP NFC Terminal',
        latency_ms: Math.round(performance.now() - startTime),
      });

    if (insertError) {
      console.warn(`Warning on insert: ${insertError.message}`);
    } else {
      inserted = true;
    }
  }

  // 4. Non-blocking Notification simulation (fire-and-forget promise)
  Promise.resolve().then(() => {
    // Non-blocking Zalo ZNS trigger
  });

  const durationMs = Math.round(performance.now() - startTime);
  return {
    iteration,
    latencyMs: durationMs,
    hasCard: !!card,
    isDuplicate: !!existingCheckIn,
    inserted,
    success: !cardError,
  };
}

async function runBenchmark() {
  console.log('='.repeat(65));
  console.log('ONE CONNECT NETWORK - CHECK-IN MICE LATENCY BENCHMARK (10 REQUESTS)');
  console.log(`Target: Supabase PostgreSQL (${supabaseUrl})`);
  console.log(`SLA Constraint: Latency < 800ms (0.8s)`);
  console.log('='.repeat(65));

  console.log('Establishing connection & warming up pool...');
  try {
    await simulateCheckin(0);
    console.log('Warmup complete. Starting 10 benchmark runs...\n');
  } catch (e) {
    console.warn('Warmup notice:', e.message);
  }

  const results = [];

  for (let i = 1; i <= 10; i++) {
    try {
      const res = await simulateCheckin(i);
      results.push(res);
      const statusIcon = res.latencyMs < 800 ? '✓ PASS' : '✗ FAIL';
      console.log(
        `[Request ${String(i).padStart(2, '0')}/10] Latency: ${String(res.latencyMs).padStart(4, ' ')}ms | ${statusIcon} (<800ms) | Duplicate: ${res.isDuplicate}`
      );
    } catch (err) {
      console.error(`[Request ${String(i).padStart(2, '0')}/10] ERROR:`, err.message);
    }
  }

  console.log('-'.repeat(65));
  const latencies = results.map((r) => r.latencyMs);
  const avg = Math.round(latencies.reduce((a, b) => a + b, 0) / latencies.length);
  const min = Math.min(...latencies);
  const max = Math.max(...latencies);
  const allPass = latencies.every((l) => l < 800);

  console.log(`SUMMARY BENCHMARK REPORT:`);
  console.log(`• Total Requests   : ${results.length}`);
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
