/** Shared check: athlete profile fields required for consult access. */

export const ATHLETE_PROFILE_COLUMNS =
  "onboarding_completed, display_name, age, sex, height_cm, weight_kg, dominant_hand, dominant_foot, primary_sport, sport_position, competitive_level, sessions_per_week, hours_per_week, current_season, performance_goals" as const;

export type AthleteProfileFields = {
  onboarding_completed?: boolean | null;
  display_name?: string | null;
  age?: number | null;
  sex?: string | null;
  height_cm?: number | null;
  weight_kg?: number | null;
  dominant_hand?: string | null;
  dominant_foot?: string | null;
  primary_sport?: string | null;
  competitive_level?: string | null;
  sessions_per_week?: number | null;
  hours_per_week?: number | null;
  current_season?: string | null;
  performance_goals?: string[] | null;
};

/** True when all required athlete fields are filled (sport_position remains optional). */
export function isAthleteProfileComplete(
  profile: AthleteProfileFields | null | undefined
): boolean {
  if (!profile) return false;
  if (!profile.display_name?.trim()) return false;
  if (profile.age == null || Number(profile.age) < 1) return false;
  if (!profile.sex?.trim()) return false;
  if (profile.height_cm == null || Number(profile.height_cm) < 50) return false;
  if (profile.weight_kg == null || Number(profile.weight_kg) < 20) return false;
  if (!profile.dominant_hand?.trim()) return false;
  if (!profile.dominant_foot?.trim()) return false;
  if (!profile.primary_sport?.trim()) return false;
  if (!profile.competitive_level?.trim()) return false;
  if (profile.sessions_per_week == null || Number(profile.sessions_per_week) < 0)
    return false;
  if (profile.hours_per_week == null || Number(profile.hours_per_week) < 0)
    return false;
  if (!profile.current_season?.trim()) return false;
  if (!Array.isArray(profile.performance_goals) || profile.performance_goals.length < 1)
    return false;
  return true;
}
