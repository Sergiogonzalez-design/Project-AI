export const SEX_OPTIONS = [
  "Masculino",
  "Femenino",
  "Otro",
  "Prefiero no decir",
] as const;

export const DOMINANT_HAND_OPTIONS = ["Izquierda", "Derecha"] as const;
export const DOMINANT_FOOT_OPTIONS = ["Izquierdo", "Derecho"] as const;

export const COMPETITIVE_LEVELS = [
  "Recreativo",
  "Avanzado",
  "Semi profesional",
  "Profesional",
] as const;

export const CURRENT_SEASONS = ["Pretemporada", "Temporada", "Fuera de temporada"] as const;

export const PERFORMANCE_GOALS = [
  "Volver al entrenamiento",
  "Volver a la competición",
  "Reducir dolor",
  "Mejorar rendimiento",
  "Prevenir lesiones",
] as const;

export type ProfileOnboardingData = {
  display_name: string;
  age: number;
  sex: string;
  height_cm: number;
  weight_kg: number;
  dominant_hand: string;
  dominant_foot: string;
  primary_sport: string;
  sport_position: string;
  competitive_level: string;
  sessions_per_week: number;
  hours_per_week: number;
  current_season: string;
  performance_goals: string[];
  onboarding_completed: boolean;
};

/** Normalize multi-sport text: commas/semicolons/"y" → ", " */
export function normalizeSportsInput(raw: string): string {
  return raw
    .split(/[,;/|]+|\s+y\s+/i)
    .map((s) => s.trim())
    .filter(Boolean)
    .join(", ");
}
