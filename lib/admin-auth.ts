import type { SupabaseClient, User } from "@supabase/supabase-js";

export async function requireAdmin(
  supabase: SupabaseClient
): Promise<User | null> {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.email !== adminEmail) return null;
  return user;
}
