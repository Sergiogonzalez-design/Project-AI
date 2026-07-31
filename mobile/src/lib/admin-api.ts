import { SUPABASE_PROJECT_URL } from "./supabase-config";

/** Web app URL for admin APIs that need the service role (create user). */
export const WEB_APP_URL = (
  process.env.EXPO_PUBLIC_WEB_URL ??
  "https://project-ai-swart.vercel.app"
).replace(/\/$/, "");

export function adminCreateUserUrl() {
  // Same Supabase project; prefer configured web URL for Next admin API.
  void SUPABASE_PROJECT_URL;
  return `${WEB_APP_URL}/api/admin/users`;
}
