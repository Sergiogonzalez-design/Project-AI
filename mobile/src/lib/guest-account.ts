/** Guest pre-appointment accounts created via physio invite code (no full signup). */

export const GUEST_EMAIL_DOMAIN = "guests.aikinora.app";

export function isGuestEmail(email?: string | null): boolean {
  return (email ?? "").toLowerCase().endsWith(`@${GUEST_EMAIL_DOMAIN}`);
}

/**
 * Email shown to physio/clinic staff. Guest auth uses a synthetic address
 * (`guest.<uuid>@guests.aikinora.app`) that must stay blank in the UI.
 */
export function staffVisibleEmail(email?: string | null): string | null {
  const e = (email ?? "").trim();
  if (!e || isGuestEmail(e)) return null;
  return e;
}

/** Display name for a patient in staff lists (never the synthetic guest email). */
export function staffPatientLabel(opts: {
  displayName?: string | null;
  email?: string | null;
  fallback?: string;
}): string {
  const name = (opts.displayName ?? "").trim();
  if (name) return name;
  const email = staffVisibleEmail(opts.email);
  if (email) return email;
  return opts.fallback ?? "Paciente invitado";
}

function metadataIsGuest(appMetadata: unknown): boolean {
  if (!appMetadata || typeof appMetadata !== "object") return false;
  return (appMetadata as { is_guest?: unknown }).is_guest === true;
}

export function isGuestUser(
  user: { email?: string | null; app_metadata?: unknown } | null | undefined
): boolean {
  if (!user) return false;
  if (metadataIsGuest(user.app_metadata)) return true;
  return isGuestEmail(user.email);
}

export function guestNameStorageKey(userId: string): string {
  return `aikinora-guest-named:${userId}`;
}

/**
 * True when the guest has entered a real name (not the auto-filled
 * `guest.<uuid>` local-part from handle_new_user / email).
 */
export function isGuestDisplayNameSet(name?: string | null): boolean {
  const n = (name ?? "").trim().replace(/\s+/g, " ");
  if (n.length < 2) return false;
  if (/^guest(?:\.|$)/i.test(n)) return false;
  if (n.includes("@")) return false;
  // UUID-like auto names
  if (
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      n
    )
  ) {
    return false;
  }
  return true;
}

/** Digits-only phone for cross-channel patient identity (web/app/WhatsApp). */
export function normalizeGuestPhoneInput(raw: string): string | null {
  const digits = raw.replace(/\D/g, "");
  return digits.length >= 8 ? digits : null;
}
