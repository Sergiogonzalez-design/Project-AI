import type { ConsultaSymptomDetails } from "./consulta-symptoms";

export const SHOULDER_PAIN_LOCATION = [
  "Parte frontal (deltoides/anterior)",
  "Parte lateral",
  "Parte posterior",
  "Cerca de la clavícula/AC",
  "Profundo dentro del hombro",
  "No sé",
] as const;

export const SHOULDER_ROM_LIMIT = [
  "No",
  "Sí, un poco",
  "Sí, bastante",
  "No puedo levantar el brazo",
] as const;

export const SHOULDER_INSTABILITY = [
  "No",
  "Siento que se sale/da inseguridad",
  "Se ha salido alguna vez",
] as const;

export type ShoulderDetails = {
  painLocation: string;
  overheadPain: string;
  romLimit: string;
  instability: string;
  neckPain: string;
  nightPainShoulderSide: string;
};

export function defaultShoulderDetails(): ShoulderDetails {
  return {
    painLocation: "",
    overheadPain: "",
    romLimit: "",
    instability: "",
    neckPain: "",
    nightPainShoulderSide: "",
  };
}

export function validateShoulderDetails(d: ShoulderDetails): string | null {
  if (!d.painLocation) return "En hombro: indica dónde notas más el dolor.";
  if (!d.overheadPain) return "En hombro: indica si duele al elevar el brazo por encima de la cabeza.";
  if (!d.romLimit) return "En hombro: indica si tienes limitación para mover el brazo.";
  if (!d.instability) return "En hombro: indica si notas inestabilidad (sensación de que se sale).";
  if (!d.neckPain) return "En hombro: indica si también hay dolor de cuello.";
  if (!d.nightPainShoulderSide) return "En hombro: indica si empeora al dormir sobre ese lado.";
  return null;
}

export function formatShoulderDetails(d: ShoulderDetails, generic: ConsultaSymptomDetails): string {
  const lines = [
    "Hombro — preguntas específicas:",
    `Localización del dolor: ${d.painLocation}`,
    `Duele al elevar el brazo: ${d.overheadPain}`,
    `Limitación de movimiento: ${d.romLimit}`,
    `Inestabilidad: ${d.instability}`,
    `Dolor de cuello asociado: ${d.neckPain}`,
    `Empeora al dormir sobre ese lado: ${d.nightPainShoulderSide}`,
    "",
    "Hombro — recordatorio de detalles generales:",
    `Lado afectado: ${generic.laterality}`,
    `Hormigueo/entumecimiento/debilidad: ${generic.nerveSymptoms}${generic.nerveSymptoms === "Sí" && generic.nerveSymptomsDetail.trim() ? ` — ${generic.nerveSymptomsDetail.trim()}` : ""}`,
    `Deformidad visible: ${generic.deformity}`,
  ];
  return lines.join("\n");
}

