"use client";

import { createBrowserClient } from "@supabase/ssr";
import { env, isSupabaseConfigured } from "@/lib/config";

/** Browser Supabase client, or null in demo mode. */
export function getSupabaseBrowserClient() {
  if (!isSupabaseConfigured) return null;
  return createBrowserClient(env.supabaseUrl, env.supabaseAnonKey);
}
