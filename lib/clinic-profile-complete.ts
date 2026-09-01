export const CLINIC_PROFILE_COLUMNS =
  "onboarding_completed, display_name, clinic_id, clinic_name" as const;

export type ClinicProfileFields = {
  onboarding_completed?: boolean | null;
  display_name?: string | null;
  clinic_id?: string | null;
};

export function isClinicProfileComplete(
  profile: ClinicProfileFields | null | undefined
): boolean {
  if (!profile) return false;
  if (!profile.display_name?.trim()) return false;
  if (!profile.clinic_id) return false;
  return profile.onboarding_completed === true;
}
