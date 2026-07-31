export type ConsultLanguage = "es" | "en";

/** Detect consult language from user text; prefer clear English signals. */
export function detectConsultLanguage(
  text: string,
  fallback: ConsultLanguage = "es"
): ConsultLanguage {
  const t = text.trim();
  if (!t) return fallback;

  const hasSpanishChars = /[áéíóúüñ¿¡]/i.test(t);
  const spanishHints =
    /\b(el|la|los|las|me|duele|dolor|molestia|lesión|lesion|desde|cuando|después|despues|también|tambien|qué|que|cómo|como|muy|pero|con|sin|una|unos|esto|esta|hombro|codo|rodilla|espalda|cuello|tobillo|muñeca|muneca)\b/i;
  const englishHints =
    /\b(the|my|i|i'm|im|i've|ive|hurt|hurts|pain|painful|sore|injury|injured|sprain|swollen|swelling|since|when|after|also|what|how|very|but|with|without|a|an|this|shoulder|elbow|knee|back|neck|ankle|wrist|finger|please|can't|cannot|doesn't|doesnt)\b/i;

  const en = (t.match(englishHints) ?? []).length;
  const es = (t.match(spanishHints) ?? []).length + (hasSpanishChars ? 2 : 0);

  if (en >= 2 && en > es) return "en";
  if (es >= 2 && es > en) return "es";
  if (en > 0 && es === 0) return "en";
  if (es > 0 && en === 0) return "es";
  return fallback;
}

export function languageInstruction(language: ConsultLanguage): string {
  if (language === "en") {
    return `LANGUAGE (CRITICAL): The patient is using English. Reply ENTIRELY in English: section headings, functional test questions, recommendations, and disclaimers. Do NOT use Spanish. Prefer English wording for "Sources consulted" if you list sources.`;
  }
  return `IDIOMA (CRÍTICO): El paciente usa español. Responde ENTERAMENTE en español: encabezados, preguntas de tests funcionales, recomendaciones y avisos. No uses inglés salvo nombres propios de pruebas.`;
}
