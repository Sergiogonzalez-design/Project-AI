export type AccountType = "patient" | "physio" | "clinic";

export function accountTypeFromMetadata(
  appMetadata: unknown
): AccountType | null {
  if (!appMetadata || typeof appMetadata !== "object") return null;
  const type = (appMetadata as { account_type?: unknown }).account_type;
  if (type === "physio" || type === "patient" || type === "clinic") return type;
  return null;
}

export function isPhysioUser(
  user: { app_metadata?: unknown } | null | undefined
): boolean {
  return accountTypeFromMetadata(user?.app_metadata) === "physio";
}

export function isClinicUser(
  user: { app_metadata?: unknown } | null | undefined
): boolean {
  return accountTypeFromMetadata(user?.app_metadata) === "clinic";
}
