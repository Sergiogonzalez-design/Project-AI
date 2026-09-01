import { WEB_APP_URL } from "./admin-api";
import { supabase } from "./supabase";

/** Delete the signed-in account on the server. Does not sign out. */
export async function deleteOwnAccount(): Promise<string | null> {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const token = session?.access_token;
  if (!token) return "No hay sesión activa.";
  return deleteAccountWithToken(token);
}

async function deleteAccountWithToken(token: string): Promise<string | null> {
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

/**
 * Guest close (X): clear the session immediately so login shows at once.
 * Temporary-account cleanup runs in the background and must never block the UI.
 */
export async function deleteOwnAccountAndSignOut(): Promise<void> {
  // Capture token before local sign-out (needed for background delete).
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const token = session?.access_token ?? null;

  // This is what flips App.tsx to the login screen — do it before any network delete.
  await supabase.auth.signOut({ scope: "local" });

  if (token) {
    void deleteAccountWithToken(token);
  }
}
