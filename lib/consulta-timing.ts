/**
 * Timing helpers so questionnaires don't ask sleep/night/morning questions
 * when the injury started so recently the patient hasn't slept with it yet.
 */

export const VERY_RECENT_EVOLUTION = [
  "Ha sido ahora",
  "Reciente (1-4 horas)",
  "Hoy",
] as const;

/** Same-day / hours — no overnight experience yet. */
export function isVeryRecentInjury(...timingFields: Array<string | undefined | null>): boolean {
  for (const raw of timingFields) {
    const t = (raw ?? "").trim();
    if (!t) continue;
    if ((VERY_RECENT_EVOLUTION as readonly string[]).includes(t)) return true;
    if (/^(hoy|just now|today|hace (unas )?horas|hace menos de (unas )?horas)/i.test(t)) {
      return true;
    }
  }
  return false;
}

/** Option labels that require having slept / woken with the injury. */
const SLEEP_DEPENDENT_OPTION_EXACT = new Set([
  "Por la noche",
  "Por la noche / al dormir",
  "Por la noche / al acostarse",
  "Por la noche / al despertar",
  "Al despertar / rigidez matutina",
  "Dormir sobre ese lado",
  "Dormir de lado",
  "Dolor al dormir de lado",
  "Rigidez matutina",
  "Rigidez matutina en el tobillo",
  "Dormir con el codo doblado",
  "Dormir con la muñeca doblada",
]);

export function isSleepDependentOption(option: string): boolean {
  if (SLEEP_DEPENDENT_OPTION_EXACT.has(option)) return true;
  // Broad match for variants (keep "Ninguno" etc. intact)
  return (
    /\b(dormir|noche|matutin|despertar|acostarse)\b/i.test(option) &&
    !/^ningun/i.test(option)
  );
}

export function filterSleepDependentOptions(
  options: readonly string[],
  ...timingFields: Array<string | undefined | null>
): string[] {
  if (!isVeryRecentInjury(...timingFields)) return [...options];
  return options.filter((o) => !isSleepDependentOption(o));
}

/** Dedicated questions that only make sense after ≥1 night with the injury. */
export const SLEEP_DEPENDENT_QUESTION_IDS = new Set([
  "rf_dolor_nocturno_sistemico",
  "rf_dolor_nocturno_peso",
  "dolor_noche",
  "num_noche",
  "pulgar_rigidez_matutina",
  "lateral_dormir_lado",
  "rigidez_matutina_duracion",
]);

export function shouldShowSleepDependentQuestion(
  questionId: string,
  ...timingFields: Array<string | undefined | null>
): boolean {
  if (!SLEEP_DEPENDENT_QUESTION_IDS.has(questionId)) return true;
  const values = timingFields.map((t) => (t ?? "").trim()).filter(Boolean);
  // Don't ask sleep/night questions until we know how recent the injury is
  if (!values.length) return false;
  return !isVeryRecentInjury(...values);
}
