"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function FisioSignOutButton() {
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  async function handleSignOut() {
    setSigningOut(true);
    document.cookie =
      "aikinora_patient_mode=; path=/; max-age=0; SameSite=Lax";
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      disabled={signingOut}
      className="rounded-lg border border-neutral-200 px-3.5 py-1.5 text-[13px] font-semibold text-neutral-600 transition-colors duration-150 hover:border-neutral-300 hover:bg-neutral-50 hover:text-neutral-900 disabled:opacity-50"
    >
      {signingOut ? "Saliendo…" : "Cerrar sesión"}
    </button>
  );
}
