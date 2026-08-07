export type ConsultLocale = "es" | "en";

export function redFlagsDetectedLabel(locale: ConsultLocale = "es"): string {
  return locale === "en" ? "Red flags detected:" : "Banderas rojas detectadas:";
}

/** Shown when urgent red flags are triggered during a questionnaire. */
export function redFlagsUrgencyNote(locale: ConsultLocale = "es"): string {
  // Leading space: banners render as "{flags}.{note}" and must not look like "cuello.Physio"
  return locale === "en"
    ? " Physio will prioritize recommending urgent medical care."
    : " Physio priorizará recomendarte atención médica urgente.";
}
