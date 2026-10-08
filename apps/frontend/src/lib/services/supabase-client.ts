import { createClient as createSupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = (): boolean => {
  return (
    Boolean(supabaseUrl) &&
    Boolean(supabaseAnonKey) &&
    !supabaseUrl.includes('placeholder-project') &&
    !supabaseAnonKey.includes('placeholder-anon-key') &&
    supabaseUrl.startsWith('http')
  );
};

// Singleton Client instance for browser / client-side actions
export const supabase = isSupabaseConfigured()
  ? createSupabaseClient(supabaseUrl, supabaseAnonKey)
  : null;

// Server-side privileged client with Service Role Key for low latency
export const getServiceSupabase = () => {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey;
  return isSupabaseConfigured()
    ? createSupabaseClient(supabaseUrl, serviceKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      })
    : null;
};
