import { createClient } from '@supabase/supabase-js';
import fs from 'node:fs';

const env = fs.readFileSync('.env.local', 'utf8');
const urlMatch = env.match(/NEXT_PUBLIC_SUPABASE_URL="([^"]+)"/);
const keyMatch = env.match(/SUPABASE_SERVICE_ROLE_KEY="([^"]+)"/);

const supabase = createClient(urlMatch[1], keyMatch[1]);

async function check() {
  const { data: businesses, error: bErr } = await supabase.from('businesses').select('*');
  const { data: conns, error: cErr } = await supabase.from('connections').select('*');
  const { data: idents, error: iErr } = await supabase.from('person_identities').select('id, full_name, title, bio');

  console.log('Businesses:', businesses?.length, bErr?.message || 'OK');
  if (businesses?.length) console.log(businesses);
  console.log('Connections:', conns?.length, cErr?.message || 'OK');
  if (conns?.length) console.log(conns);
  console.log('Identities:', idents?.length, iErr?.message || 'OK');
  if (idents?.length) console.log(idents);
}

check().catch(console.error);
