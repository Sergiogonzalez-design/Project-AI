import type { SupabaseClient, User } from "@supabase/supabase-js";

/** Server: resolves the current user only if their profile is account_type = 'physio'. */
export async function requirePhysio(
  supabase: SupabaseClient
): Promise<User | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("account_type")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.account_type !== "physio") return null;

  return user;
}
