/** Cookie that lets a physio account browse patient surfaces (/consulta, etc.). */
export const PATIENT_MODE_COOKIE = "aikinora_patient_mode";

export function buildPhysioInviteUrl(code: string, origin?: string): string {
  const base =
    (origin?.replace(/\/$/, "") ||
      (typeof window !== "undefined" ? window.location.origin : "")) ||
    "https://project-ai-swart.vercel.app";
  const normalized = code.trim().toUpperCase().replace(/\s+/g, "");
  return `${base}/fisioterapia?code=${encodeURIComponent(normalized)}`;
}

export function isPatientModeCookieValue(value: string | undefined | null): boolean {
  return value === "1" || value === "true";
}
