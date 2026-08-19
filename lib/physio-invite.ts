/** Cookie that lets a physio account browse patient surfaces (/consulta, etc.). */
export const PATIENT_MODE_COOKIE = "aikinora_patient_mode";

export function buildPhysioInviteUrl(code: string, origin?: string): string {
  const base =
    (origin?.replace(/\/$/, "") ||
      (typeof window !== "undefined" ? window.location.origin : "")) ||
    "https://project-ai-swart.vercel.app";
  const normalized = code.trim().toUpperCase().replace(/\s+/g, "");
  return `${base}/login?code=${encodeURIComponent(normalized)}`;
}

export function normalizeInviteCode(raw: string | null | undefined): string {
  return (raw ?? "").trim().toUpperCase().replace(/\s+/g, "");
}

/** Accept a raw code or a pasted invite URL (`/login?code=…`). */
export function parsePastedInviteCode(raw: string | null | undefined): string {
  const text = (raw ?? "").trim();
  if (!text) return "";
  const fromQuery = /[?&#]code=([^&\s#]+)/i.exec(text);
  if (fromQuery) {
    try {
      return normalizeInviteCode(decodeURIComponent(fromQuery[1].replace(/\+/g, "%20")));
    } catch {
      return normalizeInviteCode(fromQuery[1]);
    }
  }
  return normalizeInviteCode(text);
}

/** Pull an invite code from `?code=` or from a `next` path like `/fisioterapia?code=…`. */
export function extractInviteCodeFromSearch(opts: {
  code?: string | null;
  next?: string | null;
}): string {
  const direct = normalizeInviteCode(opts.code);
  if (direct.length >= 6) return direct;
  const next = opts.next ?? "";
  const match = /[?&]code=([^&]+)/i.exec(next);
  if (!match) return "";
  try {
    return normalizeInviteCode(decodeURIComponent(match[1].replace(/\+/g, "%20")));
  } catch {
    return normalizeInviteCode(match[1]);
  }
}

export function isPatientModeCookieValue(value: string | undefined | null): boolean {
  return value === "1" || value === "true";
}
