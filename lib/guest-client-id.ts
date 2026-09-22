const STORAGE_KEY = "aikinora_guest_client_id";

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  );
}

/** Stable anonymous id for this browser — reused across invite links. */
export function getOrCreateGuestClientId(): string {
  if (typeof window === "undefined") {
    return crypto.randomUUID();
  }
  try {
    const existing = window.localStorage.getItem(STORAGE_KEY)?.trim();
    if (existing && isUuid(existing)) return existing.toLowerCase();
    const next = crypto.randomUUID();
    window.localStorage.setItem(STORAGE_KEY, next);
    return next;
  } catch {
    return crypto.randomUUID();
  }
}

export function persistGuestClientId(id: string | null | undefined): void {
  if (!id || typeof window === "undefined" || !isUuid(id)) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, id.toLowerCase());
  } catch {
    // Private mode
  }
}
