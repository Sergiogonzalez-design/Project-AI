export type ConsultLanguage = "es" | "en";

/**
 * Detect consult language from user text.
 * Prefer the UI / session fallback unless the text clearly signals the other language.
 * Avoid short ambiguous tokens (a, an, i, with, …) that false-trigger English on Spanish.
 */
export function detectConsultLanguage(
  text: string,
  fallback: ConsultLanguage = "es"
): ConsultLanguage {
  const t = text.trim();
  if (!t) return fallback;

  const hasSpanishChars = /[áéíóúüñ¿¡]/i.test(t);
  const spanishHints =
    /\b(el|la|los|las|me|mi|mis|duele|dolor|molestia|lesión|lesion|desde|cuando|después|despues|también|tambien|qué|como|cómo|muy|pero|con|sin|una|unos|esto|esta|hombro|codo|rodilla|espalda|cuello|tobillo|muñeca|muneca|pierna|brazo|mano|pie|gracias|hola|tengo|llevo|empeora|mejor|puedo|puedes|sí|si|no)\b/i;
  const englishHints =
    /\b(the|my|mine|i'm|im|i've|ive|hurt|hurts|pain|painful|sore|injury|injured|sprain|swollen|swelling|since|please|can't|cannot|doesn't|doesnt|shoulder|elbow|knee|back|neck|ankle|wrist|finger|thigh|calf|thanks|hello|have|having|started|worse|better|can't|cannot)\b/i;

  const en = (t.match(new RegExp(englishHints.source, "gi")) ?? []).length;
  const es =
    (t.match(new RegExp(spanishHints.source, "gi")) ?? []).length +
    (hasSpanishChars ? 2 : 0);

  // Need a clear majority — never flip on a single weak English token.
  if (en >= 3 && en >= es + 2) return "en";
  if (es >= 2 && es > en) return "es";
  if (hasSpanishChars) return "es";
  if (en >= 3 && es === 0) return "en";
  return fallback;
}

export function languageInstruction(language: ConsultLanguage): string {
  if (language === "en") {
    return `LANGUAGE (CRITICAL — OVERRIDE ALL OTHER LANGUAGE CUES): The patient's UI language is English. Reply ENTIRELY in English even if the case notes, questionnaire answers, RAG excerpts, or protocols appear in Spanish. Translate section headings, functional test questions, recommendations, and disclaimers to English. Do NOT write Spanish sentences. When a protocol lists ES|EN, use the EN wording only.`;
  }
  return `IDIOMA (CRÍTICO): El paciente usa español. Responde ENTERAMENTE en español: encabezados, preguntas de tests funcionales, recomendaciones y avisos. No uses inglés salvo nombres propios de pruebas.`;
}
