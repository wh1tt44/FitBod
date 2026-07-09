/**
 * Supabase Client Configuration
 * Initializes Supabase connection for real-time database operations
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY || '';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase credentials in environment variables');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
  },
});

/**
 * Test connection to Supabase
 */
export async function testConnection(): Promise<boolean> {
  try {
    const { data, error } = await supabase.from('user_profiles').select('id').limit(1);
    return !error;
  } catch {
    return false;
  }
}
