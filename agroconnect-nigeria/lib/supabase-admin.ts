import { createClient } from '@supabase/supabase-js';

// Server-side only Supabase admin client
// This file should only be imported in server components or API routes

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!serviceRoleKey) {
  throw new Error('SUPABASE_SERVICE_ROLE_KEY is required for admin operations');
}

export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Helper function to check if running on server
export function isServer(): boolean {
  return typeof window === 'undefined';
}

// Safe admin client creation (only on server)
export function getSupabaseAdmin() {
  if (!isServer()) {
    throw new Error('Supabase admin client can only be used on the server side');
  }
  return supabaseAdmin;
}
