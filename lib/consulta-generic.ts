import {
  EVOLUTION_OPTIONS,
  MECHANISM_OPTIONS,
  ONSET_FORM_OPTIONS,
  YES_NO,
} from "@/lib/consulta-shoulder-adaptive";
import {
  missingQuestionIssue,
  type AdaptiveValidationIssue,
} from "@/lib/consulta-validation";

export type GenericConsultaAnswers = {
  zona: string;
  evolucion: string;
  inicio: string;
  mecanismo: string[];
  mecanismo_otro: string;
  intensidad_dolor: number;
  descripcion: string;
  rf_deformidad: string;
  rf_fiebre: string;
  rf_perdida_sensibilidad: string;
};

export function defaultGenericConsultaAnswers(): GenericConsultaAnswers {
  return {
    zona: "",
    evolucion: "",
    inicio: "",
    mecanismo: [],
    mecanismo_otro: "",
    intensidad_dolor: 5,
    descripcion: "",
    rf_deformidad: "",
    rf_fiebre: "",
    rf_perdida_sensibilidad: "",
  };
}

export function validateGenericConsulta(
  a: GenericConsultaAnswers
): AdaptiveValidationIssue | null {
  if (!a.zona.trim()) {
    return missingQuestionIssue({
      id: "zona",
      section: "core",
      label: "¿Dónde te duele o te molesta?",
    });
  }
  if (!a.evolucion) {
    return missingQuestionIssue({
      id: "evolucion",
      section: "core",
      label: "¿Cuánto tiempo llevas con el problema?",
    });
  }
  if (!a.inicio) {
    return missingQuestionIssue({
      id: "inicio",
      section: "core",
      label: "¿Cómo fue el inicio?",
    });
  }
  if (!a.mecanismo.length) {
    return missingQuestionIssue({
      id: "mecanismo",
      section: "core",
      label: "¿Qué pudo provocarlo?",
    });
  }
  if (a.mecanismo.includes("Otro") && !a.mecanismo_otro.trim()) {
    return missingQuestionIssue({
      id: "mecanismo_otro",
      section: "core",
      label: "Cuéntanos qué pasó o cómo empezó",
    });
  }
  if (!a.rf_deformidad) {
    return missingQuestionIssue({
      id: "rf_deformidad",
      section: "red_flags",
      label: "¿Deformidad evidente?",
    });
  }
  if (!a.rf_fiebre) {
    return missingQuestionIssue({
      id: "rf_fiebre",
      section: "red_flags",
      label: "¿Tienes fiebre junto con el dolor?",
    });
  }
  if (!a.rf_perdida_sensibilidad) {
    return missingQuestionIssue({
      id: "rf_perdida_sensibilidad",
      section: "red_flags",
      label: "¿Pérdida de sensibilidad?",
    });
  }
  return null;
}

export function formatGenericConsulta(a: GenericConsultaAnswers, bodyMapText: string): string {
  const redFlags = [
    a.rf_deformidad === "Sí" ? "Se ve torcido, deformado o muy distinto" : null,
    a.rf_fiebre === "Sí" ? "Fiebre" : null,
    a.rf_perdida_sensibilidad === "Sí" ? "Pérdida de sensibilidad" : null,
  ].filter(Boolean);

  return [
    "=== CUESTIONARIO GENERAL ===",
    "",
    bodyMapText,
    "",
    a.zona.trim() ? `Zona: ${a.zona.trim()}` : "",
    redFlags.length ? `⚠️ BANDERAS ROJAS: ${redFlags.join(", ")}` : "Sin banderas rojas marcadas",
    `Evolución: ${a.evolucion}`,
    `Inicio: ${a.inicio}`,
    `Mecanismo: ${a.mecanismo.join(", ")}${a.mecanismo.includes("Otro") ? ` (${a.mecanismo_otro})` : ""}`,
    `Intensidad dolor: ${a.intensidad_dolor}/10`,
    a.descripcion.trim() ? `Detalles adicionales: ${a.descripcion.trim()}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

export const GENERIC_FIELD_OPTIONS = {
  evolution: EVOLUTION_OPTIONS,
  onset: ONSET_FORM_OPTIONS,
  mechanism: MECHANISM_OPTIONS,
  yesNo: YES_NO,
};
