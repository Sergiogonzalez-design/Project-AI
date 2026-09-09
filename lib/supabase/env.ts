/** Resolves URL + client key for @supabase/ssr (publishable key preferred; legacy anon still supported). */

/**
 * Vercel Git Preview builds often lack Production-only env vars.
 * During `next build` prerender we must not throw — placeholders keep the
 * compile green; runtime still requires real env (see isSupabaseConfigured).
 */
function isNextProductionBuild(): boolean {
  return (
    process.env.NEXT_PHASE === "phase-production-build" ||
    process.env.npm_lifecycle_event === "build"
  );
}

export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return Boolean(url && key);
}

export function getSupabaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) {
    if (isNextProductionBuild()) {
      return "https://placeholder.supabase.co";
    }
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");
  }
  return url;
}

export function getSupabasePublishableKey(): string {
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!key) {
    if (isNextProductionBuild()) {
      // Valid-looking JWT shape so @supabase/ssr accepts it at build time only.
      return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1idWlsZCIsInJvbGUiOiJhbm9uIn0.build";
    }
    throw new Error(
      "Set NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (Settings → API Keys → Publishable), or legacy NEXT_PUBLIC_SUPABASE_ANON_KEY"
    );
  }
  return key;
}
