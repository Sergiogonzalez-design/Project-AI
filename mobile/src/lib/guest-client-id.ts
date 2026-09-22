import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "aikinora_guest_client_id";

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  );
}

function randomUuid(): string {
  // Expo / RN typically have crypto.getRandomValues via global crypto.
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/** Stable anonymous id for this install — reused across invite links. */
export async function getOrCreateGuestClientId(): Promise<string> {
  try {
    const existing = (await AsyncStorage.getItem(STORAGE_KEY))?.trim();
    if (existing && isUuid(existing)) return existing.toLowerCase();
    const next = randomUuid();
    await AsyncStorage.setItem(STORAGE_KEY, next);
    return next;
  } catch {
    return randomUuid();
  }
}

export async function persistGuestClientId(
  id: string | null | undefined
): Promise<void> {
  if (!id || !isUuid(id)) return;
  try {
    await AsyncStorage.setItem(STORAGE_KEY, id.toLowerCase());
  } catch {
    // ignore
  }
}
