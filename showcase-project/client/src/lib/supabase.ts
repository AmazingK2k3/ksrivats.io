import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// These globals are injected by vite.config.ts define block
// They resolve VITE_SUPABASE_URL (local) or SUPABASE_URL (Vercel integration)
declare const __SUPABASE_URL__: string;
declare const __SUPABASE_ANON_KEY__: string;

const supabaseUrl = __SUPABASE_URL__ || undefined;
const supabaseAnonKey = __SUPABASE_ANON_KEY__ || undefined;

export const supabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

export const supabase: SupabaseClient | null = supabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null;

export interface Comment {
  id: string;
  post_slug: string;
  post_type: "post" | "project";
  author_name: string;
  author_email?: string;
  content: string;
  status: string;
  created_at: string;
}
