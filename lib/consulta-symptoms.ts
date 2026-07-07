export const PAIN_PATTERN_OPTIONS = [
  "Constante",
  "Solo al movimiento",
  "Ambos",
] as const;

export const WEIGHT_BEARING_OPTIONS = ["Sí", "Con dificultad", "No"] as const;

export const SWELLING_SIGN_OPTIONS = [
  "Hinchazón",
  "Moretón",
  "Calor",
  "Ninguno",
] as const;

export const PROGRESSION_OPTIONS = ["Mejorando", "Igual", "Empeorando"] as const;

export const TRAINING_IMPACT_OPTIONS = [
  "No",
  "Parcialmente",
  "Totalmente",
] as const;

export const LATERALITY_OPTIONS = [
  "Izquierdo",
  "Derecho",
  "Ambos",
  "Centro",
] as const;

export const TRIED_TREATMENT_OPTIONS = [
  "Reposo",
  "Hielo",
  "Calor",
  "Vendaje",
  "Medicación",
  "Ninguno",
] as const;

export const YES_NO = ["No", "Sí"] as const;

export type ConsultaSymptomDetails = {
  painPattern: string;
  weightBearing: string;
  swellingSigns: string[];
  nerveSymptoms: string;
  nerveSymptomsDetail: string;
  nightPain: string;
  previousSamePain: string;
  previousSamePainDetail: string;
  aggravatingMovement: string;
  triedTreatments: string[];
  progression: string;
  trainingImpact: string;
  laterality: string;
  heardPop: string;
  jointLocking: string;
  radiatingPain: string;
  radiatingPainDetail: string;
  systemicSymptoms: string;
  deformity: string;
  severeTrauma: string;
};

export function defaultConsultaSymptoms(): ConsultaSymptomDetails {
  return {
    painPattern: "",
    weightBearing: "",
    swellingSigns: [],
    nerveSymptoms: "",
    nerveSymptomsDetail: "",
    nightPain: "",
    previousSamePain: "",
    previousSamePainDetail: "",
    aggravatingMovement: "",
    triedTreatments: [],
    progression: "",
    trainingImpact: "",
    laterality: "",
    heardPop: "",
    jointLocking: "",
    radiatingPain: "",
    radiatingPainDetail: "",
    systemicSymptoms: "",
    deformity: "",
    severeTrauma: "",
  };
}

export function validateConsultaSymptoms(d: ConsultaSymptomDetails): string | null {
  if (!d.painPattern) return "Indica si el dolor es constante o al movimiento.";
  if (!d.weightBearing) return "Indica si puedes apoyar peso o usar la zona.";
  if (d.swellingSigns.length === 0)
    return "Indica si hay hinchazón, moretón o calor en la zona.";
  if (!d.nerveSymptoms) return "Indica si hay hormigueo, entumecimiento o debilidad.";
  if (d.nerveSymptoms === "Sí" && !d.nerveSymptomsDetail.trim())
    return "Describe el hormigueo, entumecimiento o debilidad.";
  if (!d.nightPain) return "Indica si el dolor empeora por la noche.";
  if (!d.previousSamePain) return "Indica si has tenido este dolor antes.";
  if (!d.aggravatingMovement.trim())
    return "Indica qué movimiento o actividad empeora el dolor.";
  if (d.triedTreatments.length === 0)
    return "Indica qué has probado ya (reposo, hielo, etc.).";
  if (!d.progression) return "Indica si el dolor mejora, se mantiene o empeora.";
  if (!d.trainingImpact) return "Indica si te impide entrenar o competir.";
  if (!d.laterality) return "Indica el lado afectado.";
  if (!d.heardPop) return "Indica si escuchaste un chasquido o crack.";
  if (!d.jointLocking) return "Indica si la zona se bloquea o se traba.";
  if (!d.radiatingPain) return "Indica si el dolor se irradia a otra zona.";
  if (d.radiatingPain === "Sí" && !d.radiatingPainDetail.trim())
    return "Indica hacia dónde se irradia el dolor.";
  if (!d.systemicSymptoms) return "Indica si hay fiebre u otros síntomas generales.";
  if (!d.deformity) return "Indica si hay deformidad visible.";
  if (!d.severeTrauma) return "Indica si hubo un golpe fuerte o caída desde altura.";
  return null;
}

export function formatConsultaSymptoms(d: ConsultaSymptomDetails): string {
  const lines = [
    `Tipo de dolor: ${d.painPattern}`,
    `Apoyo / uso de la zona: ${d.weightBearing}`,
    `Signos en la zona: ${d.swellingSigns.join(", ")}`,
    `Hormigueo, entumecimiento o debilidad: ${
      d.nerveSymptoms === "Sí"
        ? `Sí — ${d.nerveSymptomsDetail.trim()}`
        : "No"
    }`,
    `Dolor nocturno o en reposo: ${d.nightPain}`,
    `Dolor previo en la misma zona: ${
      d.previousSamePain === "Sí"
        ? `Sí${d.previousSamePainDetail.trim() ? ` — ${d.previousSamePainDetail.trim()}` : ""}`
        : "No"
    }`,
    `Empeora con: ${d.aggravatingMovement.trim()}`,
    `Ya probado: ${d.triedTreatments.join(", ")}`,
    `Evolución: ${d.progression}`,
    `Impacto en entrenamiento: ${d.trainingImpact}`,
    `Lado afectado: ${d.laterality}`,
    `Chasquido o crack al inicio: ${d.heardPop}`,
    `Bloqueo o trabamiento articular: ${d.jointLocking}`,
    `Dolor irradiado: ${
      d.radiatingPain === "Sí"
        ? `Sí — hacia ${d.radiatingPainDetail.trim()}`
        : "No"
    }`,
    `Fiebre o síntomas generales: ${d.systemicSymptoms}`,
    `Deformidad visible: ${d.deformity}`,
    `Golpe fuerte o caída desde altura: ${d.severeTrauma}`,
  ];
  return lines.join("\n");
}
