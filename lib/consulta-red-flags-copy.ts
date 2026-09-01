export type ConsultLocale = "es" | "en";

export function redFlagsDetectedLabel(locale: ConsultLocale = "es"): string {
  return locale === "en" ? "Red flags detected:" : "Banderas rojas detectadas:";
}

/** Intro banner on the red-flags questionnaire section. */
export function redFlagsSectionIntro(locale: ConsultLocale = "es"): string {
  return locale === "en"
    ? "These questions screen for situations that may need urgent medical care."
    : "Estas preguntas detectan situaciones que pueden requerir atención médica urgente.";
}

/** Shown when urgent red flags are triggered during a questionnaire. */
export function redFlagsUrgencyNote(locale: ConsultLocale = "es"): string {
  // Leading space: banners render as "{flags}.{note}" and must not look like "cuello.Physio"
  return locale === "en"
    ? " Physio will prioritize recommending urgent medical care."
    : " Physio priorizará recomendarte atención médica urgente.";
}

export function skipQuestionnaireForUrgencyLabel(
  locale: ConsultLocale = "es"
): string {
  return locale === "en"
    ? "Send now — urgent care"
    : "Enviar ahora (urgencia)";
}
