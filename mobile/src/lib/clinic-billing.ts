export const CLINIC_BILLING_REQUIRED = false;

export function clinicHasPaidAccess(
  status: string | null | undefined
): boolean {
  if (!CLINIC_BILLING_REQUIRED) return true;
  return status === "active" || status === "trial";
}
