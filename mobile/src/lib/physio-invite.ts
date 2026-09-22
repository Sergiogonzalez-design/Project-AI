import { WEB_APP_URL } from "./admin-api";

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

export function buildPhysioInviteUrl(code: string): string {
  const base = WEB_APP_URL.replace(/\/$/, "");
  const normalized = code.trim().toUpperCase().replace(/\s+/g, "");
  // Patient opens link → auto-redeem → consulta previa name gate (no code typing).
  return `${base}/unirse?code=${encodeURIComponent(normalized)}`;
}

/** Share text for the web invite link (no bare code for the patient to type). */
export function buildPhysioInviteShareText(): string {
  return "Abre este enlace para la consulta previa en AIKinora. Te pedirán tu nombre; no hace falta introducir ningún código:";
}

export function buildPhysioWhatsAppInviteUrl(code: string): string {
  const base = WEB_APP_URL.replace(/\/$/, "");
  const normalized = code.trim().toUpperCase().replace(/\s+/g, "");
  return `${base}/unirse/whatsapp?code=${encodeURIComponent(normalized)}`;
}

export function whatsappBusinessE164Digits(
  raw?: string | null
): string | null {
  const digits = (
    raw ??
    process.env.EXPO_PUBLIC_WHATSAPP_BUSINESS_E164 ??
    ""
  ).replace(/\D/g, "");
  return digits.length >= 8 ? digits : null;
}

export function buildWhatsAppPrefillMessage(code: string): string {
  const normalized = code.trim().toUpperCase().replace(/\s+/g, "");
  return `Hola, quiero hacer la consulta previa. Código: ${normalized}`;
}

export function buildWhatsAppDeepLink(
  code: string,
  phoneE164?: string | null
): string | null {
  const phone = whatsappBusinessE164Digits(phoneE164);
  if (!phone) return null;
  const text = buildWhatsAppPrefillMessage(code);
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}
