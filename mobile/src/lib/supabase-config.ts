/** Same Supabase project as the Next.js web app (projectai / klxlzzgrymkexvuelzex). */
export const SUPABASE_PROJECT_URL =
  process.env.EXPO_PUBLIC_SUPABASE_URL ??
  "https://klxlzzgrymkexvuelzex.supabase.co";

export const SUPABASE_PUBLISHABLE_KEY =
  process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "";

/** Only this email sees the Admin tab after regular login. */
export const ADMIN_EMAIL = (
  process.env.EXPO_PUBLIC_ADMIN_EMAIL ?? "sergiogonzalez.usa@icloud.com"
)
  .trim()
  .toLowerCase();

export function isSupabaseConfigured(): boolean {
  return Boolean(SUPABASE_PROJECT_URL && SUPABASE_PUBLISHABLE_KEY);
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email || !ADMIN_EMAIL) return false;
  return email.trim().toLowerCase() === ADMIN_EMAIL;
}
