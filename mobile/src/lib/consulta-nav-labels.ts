import type { ConsultLanguage } from "./consult-language";

/** Shared questionnaire chrome for adaptive forms. */
export function consultaNavLabels(locale: ConsultLanguage = "es") {
  if (locale === "en") {
    return { previous: "Previous", next: "Next" };
  }
  return { previous: "Anterior", next: "Siguiente" };
}
