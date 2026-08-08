import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabasePublishableKey, getSupabaseUrl } from "./env";

/**
 * One browser client for the whole tab. Creating many GoTrue clients races
 * auth storage locks and surfaces as AuthRetryableFetchError / Failed to fetch.
 */
let browserClient: SupabaseClient | undefined;

export function createClient() {
  if (browserClient) return browserClient;
  browserClient = createBrowserClient(
    getSupabaseUrl(),
    getSupabasePublishableKey(),
    {
      isSingleton: true,
    }
  );
  return browserClient;
}
