import { WEB_APP_URL } from "./admin-api";
import { supabase } from "./supabase";

/** Delete the signed-in account on the server. Does not sign out. */
export async function deleteOwnAccount(): Promise<string | null> {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const token = session?.access_token;
  if (!token) return "No hay sesión activa.";
  try {
    const res = await fetch(`${WEB_APP_URL}/api/auth/delete-account`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      const payload = (await res.json().catch(() => ({}))) as { error?: string };
      return payload.error ?? "No se pudo eliminar la cuenta.";
    }
    return null;
  } catch {
    return "No se pudo eliminar la cuenta. Inténtalo de nuevo.";
  }
}

/** Guest close: try to delete the temporary account, then always clear the session. */
export async function deleteOwnAccountAndSignOut(): Promise<void> {
  await deleteOwnAccount();
  await supabase.auth.signOut({ scope: "local" });
}
