import type { ConsultLanguage } from "@/lib/consult-language";

/** Shared questionnaire chrome for adaptive forms (web + mobile). */
export function consultaNavLabels(locale: ConsultLanguage = "es") {
  if (locale === "en") {
    return { previous: "Previous", next: "Next" };
  }
  return { previous: "Anterior", next: "Siguiente" };
}
