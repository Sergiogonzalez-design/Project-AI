export function formatAthleteProfileContext(profile: {
  display_name?: string | null;
  age?: number | null;
  sex?: string | null;
  height_cm?: number | null;
  weight_kg?: number | null;
  dominant_hand?: string | null;
  dominant_foot?: string | null;
  primary_sport?: string | null;
  sport_position?: string | null;
  competitive_level?: string | null;
  sessions_per_week?: number | null;
  hours_per_week?: number | null;
  current_season?: string | null;
  performance_goals?: string[] | null;
} | null): string {
  if (!profile) return "";

  const lines = [
    profile.display_name ? `Nombre: ${profile.display_name}` : "",
    profile.age ? `Edad: ${profile.age} años` : "",
    profile.sex ? `Sexo: ${profile.sex}` : "",
    profile.height_cm ? `Altura: ${profile.height_cm} cm` : "",
    profile.weight_kg ? `Peso: ${profile.weight_kg} kg` : "",
    profile.dominant_hand ? `Mano dominante: ${profile.dominant_hand}` : "",
    profile.dominant_foot ? `Pie dominante: ${profile.dominant_foot}` : "",
    profile.primary_sport ? `Deporte principal: ${profile.primary_sport}` : "",
    profile.sport_position ? `Posición: ${profile.sport_position}` : "",
    profile.competitive_level ? `Nivel competitivo: ${profile.competitive_level}` : "",
    profile.sessions_per_week != null
      ? `Sesiones de entrenamiento por semana: ${profile.sessions_per_week}`
      : "",
    profile.hours_per_week != null
      ? `Horas de entrenamiento por semana: ${profile.hours_per_week}`
      : "",
    profile.current_season ? `Temporada actual: ${profile.current_season}` : "",
    profile.performance_goals?.length
      ? `Objetivos: ${profile.performance_goals.join(", ")}`
      : "",
  ].filter(Boolean);

  return lines.length > 0 ? lines.join("\n") : "";
}
