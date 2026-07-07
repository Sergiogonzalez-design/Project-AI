import {
  EVOLUTION_OPTIONS,
  MECHANISM_OPTIONS,
  ONSET_FORM_OPTIONS,
  YES_NO,
} from "@/lib/consulta-shoulder-adaptive";

export type GenericConsultaAnswers = {
  evolucion: string;
  inicio: string;
  mecanismo: string;
  mecanismo_otro: string;
  intensidad_dolor: number;
  descripcion: string;
  rf_deformidad: string;
  rf_fiebre: string;
  rf_perdida_sensibilidad: string;
};

export function defaultGenericConsultaAnswers(): GenericConsultaAnswers {
  return {
    evolucion: "",
    inicio: "",
    mecanismo: "",
    mecanismo_otro: "",
    intensidad_dolor: 5,
    descripcion: "",
    rf_deformidad: "",
    rf_fiebre: "",
    rf_perdida_sensibilidad: "",
  };
}

export function validateGenericConsulta(a: GenericConsultaAnswers): string | null {
  if (!a.evolucion) return "Indica cuánto tiempo llevas con el problema.";
  if (!a.inicio) return "Indica cómo fue el inicio.";
  if (!a.mecanismo) return "Indica qué pudo provocarlo.";
  if (a.mecanismo === "Otro" && !a.mecanismo_otro.trim()) return "Describe el mecanismo.";
  if (!a.rf_deformidad || !a.rf_fiebre || !a.rf_perdida_sensibilidad) {
    return "Responde las preguntas de urgencia.";
  }
  return null;
}

export function formatGenericConsulta(a: GenericConsultaAnswers, bodyMapText: string): string {
  const redFlags = [
    a.rf_deformidad === "Sí" ? "Deformidad evidente" : null,
    a.rf_fiebre === "Sí" ? "Fiebre" : null,
    a.rf_perdida_sensibilidad === "Sí" ? "Pérdida de sensibilidad" : null,
  ].filter(Boolean);

  return [
    "=== CUESTIONARIO GENERAL ===",
    "",
    bodyMapText,
    "",
    redFlags.length ? `⚠️ BANDERAS ROJAS: ${redFlags.join(", ")}` : "Sin banderas rojas marcadas",
    `Evolución: ${a.evolucion}`,
    `Inicio: ${a.inicio}`,
    `Mecanismo: ${a.mecanismo}${a.mecanismo === "Otro" ? ` (${a.mecanismo_otro})` : ""}`,
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
