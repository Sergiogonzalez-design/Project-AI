/** Same Supabase project as the Next.js web app (projectai / klxlzzgrymkexvuelzex). */
export const SUPABASE_PROJECT_URL =
  process.env.EXPO_PUBLIC_SUPABASE_URL ??
  "https://klxlzzgrymkexvuelzex.supabase.co";

/** Legacy anon JWT — Auth on device is unreliable with sb_publishable_ keys. */
const LEGACY_ANON_JWT =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtseGx6emdyeW1rZXh2dWVsemV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4MTIyODEsImV4cCI6MjA5MDM4ODI4MX0.5hzENXbdJYndGlGIi4QnnV-g3EW7K5vh_TYEsQsnVPU";

function resolvePublishableKey(raw: string | undefined): string {
  const key = (raw ?? "").trim();
  if (!key || key.startsWith("sb_publishable_")) return LEGACY_ANON_JWT;
  return key;
}

export const SUPABASE_PUBLISHABLE_KEY = resolvePublishableKey(
  process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY
);

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
