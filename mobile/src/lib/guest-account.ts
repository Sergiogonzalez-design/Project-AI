/** Guest pre-appointment accounts created via physio invite code (no full signup). */

export const GUEST_EMAIL_DOMAIN = "guests.aikinora.app";

export function isGuestEmail(email?: string | null): boolean {
  return (email ?? "").toLowerCase().endsWith(`@${GUEST_EMAIL_DOMAIN}`);
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
