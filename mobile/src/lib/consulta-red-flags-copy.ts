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

/**
 * Questionnaire dump block for the AI. Hard-urgent dumps may use
 * «URGENCIA DETECTADA». Non-urgent dumps must not use the tokens
 * «BANDERAS ROJAS», «BANDERAS ROJAS DETECTADAS», or «URGENCIA DETECTADA»
 * (those trigger hospital routing).
 */
export function formatRedFlagScreenBlock(
  urgent: boolean,
  triggered: string[],
  opts?: { urgentHeaderSuffix?: string; urgentDetail?: string }
): string[] {
  if (urgent) {
    const header = opts?.urgentHeaderSuffix
      ? `— ALARMAS / URGENCIA (${opts.urgentHeaderSuffix}) —`
      : "— ALARMAS / URGENCIA —";
    const detail = opts?.urgentDetail ? ` ${opts.urgentDetail}` : "";
    return [
      "",
      header,
      `⚠️ URGENCIA DETECTADA: ${triggered.join("; ")}${detail}`,
    ];
  }
  if (triggered.length > 0) {
    return [
      "",
      "— CRIBADO DE ALARMAS (contexto clínico, no urgencia hospitalaria) —",
      triggered.join("; "),
    ];
  }
  return ["", "— CRIBADO DE ALARMAS (ninguna marcada como Sí) —"];
}

/** True when any hard-emergency flag is marked Sí (soft history flags ignored). */
export function isHardUrgentFromAnswers(
  answers: Record<string, unknown>,
  hardIds: readonly string[],
  extraUrgent = false
): boolean {
  if (extraUrgent) return true;
  return hardIds.some((id) => answers[id] === "Sí");
}
