import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Default to the connected Supabase project ref iqimfwfsaxvzmlovnwgl
const SUPABASE_PROJECT_URL =
  import.meta.env.VITE_SUPABASE_URL || 'https://iqimfwfsaxvzmlovnwgl.supabase.co';
const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlxaW1md2ZzYXh2em1sb3Zud2dsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkwMzIxMjksImV4cCI6MjEwNDYwODEyOX0.CLouumox9xSNRXiEc-emHV4l4M-w2xZhgCojFaNIDns';

export const isSupabaseConfigured = Boolean(SUPABASE_PROJECT_URL && SUPABASE_ANON_KEY);

export const supabase: SupabaseClient = createClient(
  SUPABASE_PROJECT_URL,
  SUPABASE_ANON_KEY
);

/**
 * Helper to get a ready-to-use Supabase client
 */
export function getSupabase(): SupabaseClient {
  return supabase;
}
