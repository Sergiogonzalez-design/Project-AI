/** Shared check: minimal physio profile fields required for /fisio access. */

export const PHYSIO_PROFILE_COLUMNS = "onboarding_completed, display_name, clinic_name" as const;

export type PhysioProfileFields = {
  onboarding_completed?: boolean | null;
  display_name?: string | null;
};

/** True when the physio has set their name and finished onboarding (clinic name is optional). */
export function isPhysioProfileComplete(
  profile: PhysioProfileFields | null | undefined
): boolean {
  if (!profile) return false;
  if (!profile.display_name?.trim()) return false;
  return profile.onboarding_completed === true;
}
