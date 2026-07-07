import type { BodyPartId } from "./body-parts";

const KEYWORDS: Record<BodyPartId, RegExp[]> = {
  shoulder: [
    /hombro/i,
    /shoulder/i,
    /manguito/i,
    /rotador/i,
    /deltoides/i,
    /clav[ií]cula/i,
    /om[oó]plato/i,
    /articulaci[oó]n\s*ac/i,
    /elev(ar|o)\s+(el\s+)?brazo/i,
    /por encima de la cabeza/i,
  ],
  elbow: [/codo/i, /elbow/i, /epicond/i],
  wrist_hand: [/mu[ñn]eca/i, /mano/i, /dedos?/i, /wrist/i, /hand/i],
  neck: [/cuello/i, /neck/i, /cervical/i],
  back: [/espalda/i, /lumbar/i, /dorsal/i, /back/i],
  hip: [/cadera/i, /hip/i, /ingle/i],
  knee: [/rodilla/i, /knee/i, /menisco/i, /ligamento cruzado/i],
  ankle_foot: [/tobillo/i, /pie/i, /ankle/i, /foot/i, /fascia plantar/i],
};

/** Body parts mentioned in free text (may be empty). */
export function detectBodyPartsFromText(text: string): BodyPartId[] {
  const found: BodyPartId[] = [];
  for (const [id, patterns] of Object.entries(KEYWORDS) as [BodyPartId, RegExp[]][]) {
    if (patterns.some((p) => p.test(text))) found.push(id);
  }
  return found;
}

/**
 * Which questionnaire to show. Shoulder is fully implemented; others use generic until expanded.
 */
export function questionnaireForText(text: string): {
  part: BodyPartId | "generic";
  detected: BodyPartId[];
} {
  const detected = detectBodyPartsFromText(text);
  if (detected.includes("shoulder")) {
    return { part: "shoulder", detected };
  }
  if (detected.length === 1) {
    return { part: "generic", detected };
  }
  if (detected.length > 1) {
    return { part: detected.includes("shoulder") ? "shoulder" : "generic", detected };
  }
  // Sin zona clara: por ahora cuestionario de hombro si parece miembro superior
  if (/brazo|hombro|elev|lanzar|press|remo/i.test(text)) {
    return { part: "shoulder", detected: ["shoulder"] };
  }
  return { part: "generic", detected: [] };
}

export function questionnaireIntroMessage(part: BodyPartId | "generic"): string {
  if (part === "shoulder") {
    return "Gracias por contarnos. Para orientarte mejor, necesito hacerte algunas preguntas detalladas sobre tu hombro. Solo te preguntaré lo relevante según tus respuestas.";
  }
  return "Gracias por contarnos. Te haré algunas preguntas para entender mejor tu caso. (El cuestionario detallado por zona se irá ampliando; por ahora usamos preguntas generales.)";
}
