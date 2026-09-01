import type { SupabaseClient, User } from "@supabase/supabase-js";

export async function requireClinicOwner(
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

  if (profile?.account_type !== "clinic") return null;
  return user;
}
