"use client";

import { PATIENT_MODE_COOKIE } from "@/lib/physio-invite";
import { createClient } from "@/lib/supabase/client";

/** Leave immediately. Never wait on Auth — that is what stuck the UI on "Saliendo…". */
export function signOutToLogin() {
  try {
    document.cookie = `${PATIENT_MODE_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
    void createClient().auth.signOut({ scope: "local" });
  } catch {
    // Still hard-navigate so cookies are cleared on the server.
  }
  window.location.assign("/auth/signout");
}
