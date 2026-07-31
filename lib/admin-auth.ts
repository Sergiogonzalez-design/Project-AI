import type { SupabaseClient, User } from "@supabase/supabase-js";

/** Server + shared: ADMIN_EMAIL preferred, NEXT_PUBLIC_ADMIN_EMAIL as fallback. */
export function getAdminEmail(): string | null {
  const email = (
    process.env.ADMIN_EMAIL ??
    process.env.NEXT_PUBLIC_ADMIN_EMAIL ??
    "sergiogonzalez.usa@icloud.com"
  )
    .trim()
    .toLowerCase();
  return email || null;
}

export function isAdminEmail(email: string | null | undefined): boolean {
  const adminEmail = getAdminEmail();
  if (!adminEmail || !email) return false;
  return email.trim().toLowerCase() === adminEmail;
}

export async function requireAdmin(
  supabase: SupabaseClient
): Promise<User | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isAdminEmail(user.email)) return null;

  // Ensure admin can use the site without onboarding friction
  await supabase
    .from("profiles")
    .upsert(
      {
        id: user.id,
        onboarding_completed: true,
      },
      { onConflict: "id" }
    );

  return user;
}
