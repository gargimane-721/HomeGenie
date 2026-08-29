import { createClient } from '@supabase/supabase-js';

// Safe extraction of environment variables with client-safe defaults
const supabaseUrl = (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPABASE_URL) || 
                    (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_SUPABASE_URL) || 
                    'https://placeholder-project.supabase.co';

const supabaseAnonKey = (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) || 
                        (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_SUPABASE_ANON_KEY) || 
                        'placeholder-anon-key';

export const isSupabaseConfigured = () => {
  return supabaseUrl !== 'https://placeholder-project.supabase.co' && supabaseAnonKey !== 'placeholder-anon-key';
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
