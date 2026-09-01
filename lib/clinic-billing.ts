/**
 * Clinic subscriptions (Stripe) are not live yet.
 * Flip CLINIC_BILLING_REQUIRED to true when checkout exists — signup/dashboard
 * already persist billing_status / stripe_* on public.clinics.
 */
export const CLINIC_BILLING_REQUIRED = false;

export type ClinicBillingStatus =
  | "pending"
  | "trial"
  | "active"
  | "past_due"
  | "canceled";

export function clinicHasPaidAccess(
  status: ClinicBillingStatus | string | null | undefined
): boolean {
  if (!CLINIC_BILLING_REQUIRED) return true;
  return status === "active" || status === "trial";
}
