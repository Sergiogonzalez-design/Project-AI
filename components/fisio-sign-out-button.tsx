"use client";

import { useState } from "react";
import { signOutToLogin } from "@/lib/sign-out-client";

export function FisioSignOutButton() {
  const [signingOut, setSigningOut] = useState(false);

  function handleSignOut() {
    setSigningOut(true);
    signOutToLogin();
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
