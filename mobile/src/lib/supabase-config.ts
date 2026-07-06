/** Same Supabase project as the Next.js web app (projectai / klxlzzgrymkexvuelzex). */
export const SUPABASE_PROJECT_URL =
  process.env.EXPO_PUBLIC_SUPABASE_URL ??
  "https://klxlzzgrymkexvuelzex.supabase.co";

export const SUPABASE_PUBLISHABLE_KEY =
  process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "";

export function isSupabaseConfigured(): boolean {
  return Boolean(SUPABASE_PROJECT_URL && SUPABASE_PUBLISHABLE_KEY);
}
