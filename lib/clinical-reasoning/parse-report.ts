import { BODY_PARTS, type BodyPartId } from "@/lib/body-parts";
import { findClinicalTestImage } from "@/lib/clinical-test-images";
import { detectBodyPartsFromText } from "@/lib/detect-body-part";
import type { ParsedManiobraLine } from "@/lib/clinical-reasoning/types";

const MANIOBRAS_HEADING = "Pruebas/maniobras a realizar en la cita";

function normalizeHeading(raw: string): string {
  let h = raw.replace(/\*\*/g, "").trim();
  h = h.replace(/\s*\(por probabilidad\)\s*/i, "").trim();
  if (/pruebas\/?\s*maniobras/i.test(h)) return MANIOBRAS_HEADING;
  return h;
}

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Extract numbered / bulleted maneuver lines from physio report markdown. */
export function extractManiobrasFromReport(content: string): ParsedManiobraLine[] {
  const parts = content.split(/\n(?=\*\*[^*]+\*\*)/);
  let maniobrasBody = "";

  for (const part of parts) {
    const match = /^\*\*([^*]+)\*\*\s*([\s\S]*)$/.exec(part.trim());
    if (!match) continue;
    if (normalizeHeading(match[1]) === MANIOBRAS_HEADING) {
      maniobrasBody = match[2].trim();
      break;
    }
  }

  if (!maniobrasBody) return [];

  const lines = maniobrasBody
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const parsed: ParsedManiobraLine[] = [];

  for (const line of lines) {
    const cleaned = line
      .replace(/^[-*•]\s*/, "")
      .replace(/^\d+[.)]\s*/, "")
      .replace(/\*\*/g, "")
      .trim();
    if (!cleaned) continue;

    const image = findClinicalTestImage(cleaned);
    parsed.push({
      line: cleaned,
      testId: image?.id ?? null,
      title: image?.title ?? null,
    });
  }

  return parsed;
}

export function hasManiobrasSection(content: string): boolean {
  return extractManiobrasFromReport(content).length > 0;
}

/** Map stored `body_area` label (Spanish) to canonical BodyPartId. */
export function resolveBodyPartFromArea(area: string | null): BodyPartId | null {
  if (!area) return null;
  const n = normalizeText(area);

  for (const part of BODY_PARTS) {
    const labelN = normalizeText(part.label);
    if (n.includes(labelN) || labelN.includes(n)) return part.id;
  }

  const detected = detectBodyPartsFromText(area);
  if (detected.length === 1) return detected[0];
  if (detected.length > 1) return detected[0];

  if (/rodilla|knee|menisco/.test(n)) return "knee";
  if (/tobillo|pie|pierna|talon|aquiles|gemelo|espinilla/.test(n)) return "ankle_foot";
  if (/hombro|manguito/.test(n)) return "shoulder";
  if (/codo|epicondilo/.test(n)) return "elbow";
  if (/muneca|mano|carpo/.test(n)) return "wrist_hand";
  if (/dedo|pulgar/.test(n)) return "finger";
  if (/cuello|cervical/.test(n)) return "neck";
  if (/espalda|lumbar|dorsal|ciatica/.test(n)) return "back";
  if (/cadera|ingle|gluteo/.test(n)) return "hip";
  if (/cabeza|cefalea|migrana/.test(n)) return "head";

  return null;
}
