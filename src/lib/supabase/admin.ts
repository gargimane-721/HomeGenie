import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || 'https://placeholder-project.supabase.co';
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-secret-key';

export function getSupabaseAdminClient() {
  if (supabaseSecretKey === 'placeholder-secret-key') {
    console.warn('SUPABASE_SECRET_KEY is not configured. Admin operations may be restricted.');
  }
  return createClient(supabaseUrl, supabaseSecretKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
