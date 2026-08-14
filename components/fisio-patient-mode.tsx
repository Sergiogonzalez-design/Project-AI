"use client";

import { PATIENT_MODE_COOKIE } from "@/lib/physio-invite";

/** Clears leftover "modo paciente" cookies (feature removed). */
export function clearPatientModeCookie() {
  if (typeof document === "undefined") return;
  document.cookie = `${PATIENT_MODE_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
}
