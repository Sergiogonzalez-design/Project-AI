import {
  EVOLUTION_OPTIONS,
  MECHANISM_OPTIONS,
  ONSET_FORM_OPTIONS,
  YES_NO,
} from "./consulta-shoulder-adaptive";
import {
  ALERTAS_NONE,
  withAlertasSynced,
} from "./consulta-compact";
import {
  missingQuestionIssue,
  type AdaptiveValidationIssue,
} from "./consulta-validation";
import { formatRedFlagScreenBlock } from "./consulta-red-flags-copy";

export const GENERIC_ALERTAS_OPTIONS = [
  "Se ve torcido, deformado o muy distinto",
  "Fiebre junto con el dolor",
  "Pérdida de sensibilidad marcada",
  ALERTAS_NONE,
] as const;

const GENERIC_ALERTAS_MAP: Record<string, string> = {
  "Se ve torcido, deformado o muy distinto": "rf_deformidad",
  "Fiebre junto con el dolor": "rf_fiebre",
  "Pérdida de sensibilidad marcada": "rf_perdida_sensibilidad",
};

export type GenericConsultaAnswers = {
  zona: string;
  evolucion: string;
  inicio: string;
  mecanismo: string[];
  mecanismo_otro: string;
  intensidad_dolor: number;
  descripcion: string;
  alertas: string[];
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
    alertas: [],
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
  if (!a.alertas.length) {
    return missingQuestionIssue({
      id: "alertas",
      section: "core",
      label: "¿Te ocurre alguna de estas cosas?",
    });
  }
  return null;
}

export function detectGenericRedFlags(a: GenericConsultaAnswers): {
  urgent: boolean;
  triggered: string[];
} {
  a = withAlertasSynced(a, GENERIC_ALERTAS_MAP);
  const triggered: string[] = [];
  if (a.rf_deformidad === "Sí") {
    triggered.push("Se ve torcido, deformado o muy distinto");
  }
  if (a.rf_perdida_sensibilidad === "Sí") {
    triggered.push("Pérdida de sensibilidad");
  }
  if (a.rf_fiebre === "Sí") {
    triggered.push("Fiebre");
  }
  // Deformity / sensory loss are hard; fever alone is soft cribado (align with back/sciatic).
  const HARD_FLAG_IDS = ["rf_deformidad", "rf_perdida_sensibilidad"] as const;
  return {
    triggered,
    urgent: HARD_FLAG_IDS.some((id) => a[id] === "Sí"),
  };
}

export function formatGenericConsulta(a: GenericConsultaAnswers, bodyMapText: string): string {
  a = withAlertasSynced(a, GENERIC_ALERTAS_MAP);
  const { urgent, triggered } = detectGenericRedFlags(a);

  return [
    "=== CUESTIONARIO GENERAL ===",
    "",
    bodyMapText,
    "",
    a.zona.trim() ? `Zona: ${a.zona.trim()}` : "",
    ...formatRedFlagScreenBlock(urgent, triggered),
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
  alertas: GENERIC_ALERTAS_OPTIONS,
};
