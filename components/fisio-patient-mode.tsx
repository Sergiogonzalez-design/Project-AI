"use client";

import { useRouter } from "next/navigation";
import { PATIENT_MODE_COOKIE } from "@/lib/physio-invite";

function setPatientModeCookie(enabled: boolean) {
  if (enabled) {
    document.cookie = `${PATIENT_MODE_COOKIE}=1; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`;
  } else {
    document.cookie = `${PATIENT_MODE_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
  }
}

/** Top-right control on the fisio panel: open the regular patient Consulta AI. */
export function FisioPatientModeButton() {
  const router = useRouter();

  function enterPatientMode() {
    setPatientModeCookie(true);
    router.push("/consulta");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={enterPatientMode}
      className="rounded-xl bg-neutral-200 px-3 py-1.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-300"
    >
      Modo paciente
    </button>
  );
}

/** Shown in the patient site navbar while a physio is previewing patient mode. */
export function ExitPatientModeButton() {
  const router = useRouter();

  function exitPatientMode() {
    setPatientModeCookie(false);
    router.push("/fisio");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={exitPatientMode}
      className="rounded-xl bg-neutral-200 px-3 py-1.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-300"
    >
      Panel fisio
    </button>
  );
}

export function readPatientModeFromDocument(): boolean {
  if (typeof document === "undefined") return false;
  return document.cookie
    .split(";")
    .some((part) => part.trim().startsWith(`${PATIENT_MODE_COOKIE}=1`));
}
