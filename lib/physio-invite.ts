/** Cookie that lets a physio account browse patient surfaces (/consulta, etc.). */
export const PATIENT_MODE_COOKIE = "aikinora_patient_mode";

export function buildPhysioInviteUrl(code: string, origin?: string): string {
  const base =
    (origin?.replace(/\/$/, "") ||
      (typeof window !== "undefined" ? window.location.origin : "")) ||
    "https://project-ai-swart.vercel.app";
  const normalized = code.trim().toUpperCase().replace(/\s+/g, "");
  // Patient join flow → guest session → /fisioterapia (consulta previa).
  // Do not use /login?code=…: a logged-in fisio would be sent to /fisio.
  return `${base}/unirse?code=${encodeURIComponent(normalized)}`;
}

export function normalizeInviteCode(raw: string | null | undefined): string {
  return (raw ?? "").trim().toUpperCase().replace(/\s+/g, "");
}

/** True for a real invite token — not a URL, host, or email leftover. */
export function looksLikeInviteCode(code: string | null | undefined): boolean {
  const c = normalizeInviteCode(code);
  if (c.length < 6 || c.length > 24) return false;
  // Reject URL/domain fragments (e.g. HTTPS://AIKINORA.COM, GUESTS.AIKINORA.APP)
  if (/[.:/@]/.test(c)) return false;
  if (!/^[A-Z0-9]+$/.test(c)) return false;
  return true;
}

/** Accept a raw code or a pasted invite URL (`/unirse?code=…` or `/login?code=…`). */
export function parsePastedInviteCode(raw: string | null | undefined): string {
  const text = (raw ?? "").trim();
  if (!text) return "";
  const fromQuery = /[?&#]code=([^&\s#]+)/i.exec(text);
  if (fromQuery) {
    let extracted = "";
    try {
      extracted = normalizeInviteCode(
        decodeURIComponent(fromQuery[1].replace(/\+/g, "%20"))
      );
    } catch {
      extracted = normalizeInviteCode(fromQuery[1]);
    }
    // Full URL paste: only keep a complete invite token.
    return looksLikeInviteCode(extracted) ? extracted : "";
  }
  // Never treat a bare URL/domain/email as an invite code.
  if (/^https?:\/\//i.test(text) || /[.@/]/.test(text)) {
    return "";
  }
  // Live typing: keep alphanumeric partials so the input is not wiped before 6 chars.
  const code = normalizeInviteCode(text).replace(/[^A-Z0-9]/g, "");
  if (!code) return "";
  return code.slice(0, 24);
}

/** Pull an invite code from `?code=` or from a `next` path like `/fisioterapia?code=…`. */
export function extractInviteCodeFromSearch(opts: {
  code?: string | null;
  next?: string | null;
}): string {
  const direct = parsePastedInviteCode(opts.code);
  if (looksLikeInviteCode(direct)) return direct;
  const next = opts.next ?? "";
  const match = /[?&]code=([^&]+)/i.exec(next);
  if (!match) return "";
  try {
    const fromNext = parsePastedInviteCode(
      decodeURIComponent(match[1].replace(/\+/g, "%20"))
    );
    return looksLikeInviteCode(fromNext) ? fromNext : "";
  } catch {
    const fromNext = parsePastedInviteCode(match[1]);
    return looksLikeInviteCode(fromNext) ? fromNext : "";
  }
}

export function isPatientModeCookieValue(value: string | undefined | null): boolean {
  return value === "1" || value === "true";
}
