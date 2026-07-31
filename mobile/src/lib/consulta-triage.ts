import { bodyPartLabel } from "./body-parts";
import type { BodyPartId } from "./body-parts";
import {
  detectBodyPartsFromText,
  isBelowKneeOrLowerLeg,
  isFootOrPlantarComplaint,
} from "./detect-body-part";
import { callEdgeJson } from "./consulta-api";

/** All body regions that start a structured questionnaire before AI reply. */
export const ADAPTIVE_QUESTIONNAIRE_PARTS = [
  "shoulder",
  "elbow",
  "wrist_hand",
  "finger",
  "neck",
  "back",
  "hip",
  "knee",
  "ankle_foot",
] as const;

export type AdaptiveQuestionnairePart = (typeof ADAPTIVE_QUESTIONNAIRE_PARTS)[number];

export type ConsultaTriageResult = {
  action: "questionnaire" | "respond";
  bodyPart?: AdaptiveQuestionnairePart;
  intent?: "general" | "symptom_other";
  answer?: string;
};

const ADAPTIVE_SET = new Set<string>(ADAPTIVE_QUESTIONNAIRE_PARTS);

export function isAdaptiveQuestionnairePart(
  part: string | undefined
): part is AdaptiveQuestionnairePart {
  return !!part && ADAPTIVE_SET.has(part);
}

export function parseTriageResult(raw: unknown): ConsultaTriageResult {
  if (!raw || typeof raw !== "object") {
    return { action: "respond", intent: "general" };
  }
  const data = raw as Record<string, unknown>;
  const action = data.action === "questionnaire" ? "questionnaire" : "respond";
  let bodyPart = isAdaptiveQuestionnairePart(String(data.bodyPart ?? ""))
    ? (data.bodyPart as AdaptiveQuestionnairePart)
    : undefined;
  const intent =
    data.intent === "symptom_other" ? "symptom_other" : "general";
  const answer = typeof data.answer === "string" ? data.answer : undefined;

  if (action === "questionnaire" && bodyPart) {
    return { action, bodyPart };
  }

  return {
    action: "respond",
    intent,
    answer,
    bodyPart: undefined,
  };
}

const EDUCATIONAL_QUERY =
  /ejercicio|estiramiento|movilidad|rutina|c[óo]mo\s+(funciona|hacer|estirar|mejorar)|qu[eé]\s+es|prevenci[oó]n|consejo|informaci[oó]n|gu[ií]a|tutorial|explic/i;

const META_CLARIFICATION_QUERY =
  /qu[eé]\s+hago|qu[eé]\s+debo|qu[eé]\s+tengo\s+que\s+hacer|c[oó]mo\s+funciona|how\s+does\s+(?:this|it)\s+work|what\s+(?:do|should)\s+i\s+do|how\s+do\s+i\s+(?:use|start)|por\s+d[oó]nde\s+empiezo|no\s+s[eé]\s+(?:qu[eé]|c[oó]mo)|explic(?:a|ame)\s+c[oó]mo|c[oó]mo\s+(?:se\s+)?usa|what\s+is\s+this/i;

const HYPOTHETICAL_SYMPTOM_QUESTION =
  /(?:te\s+)?(?:digo|cuento|explico|escribo)\s+(?:lo\s+que\s+)?(?:me\s+)?duele\s+o|(?:debo|tengo\s+que)\s+(?:decirte|contarte|escribir).*(?:duele|dolor)/i;

/** User asks how the chat works or what to do — not reporting a current symptom. */
export function isMetaOrClarificationQuery(text: string): boolean {
  const t = text.trim();
  if (!t) return false;

  if (HYPOTHETICAL_SYMPTOM_QUESTION.test(t)) return true;

  const asksAboutProcess = META_CLARIFICATION_QUERY.test(t);
  if (!asksAboutProcess) return false;

  if (describesCurrentPersonalSymptom(t)) return false;

  return true;
}

function describesCurrentPersonalSymptom(text: string): boolean {
  const hasSymptom =
    /\b(?:me\s+duele|tengo\s+dolor|me\s+molesta|me\s+ha\s+dolido|me\s+doli[oó]|siento\s+dolor|tengo\s+una?\s+(?:lesi[oó]n|molestia|hinchaz[oó]n)|it\s+hurts|my\s+.+\s+hurts|i\s+have\s+pain)\b/i.test(
      text
    );
  const hypothetical =
    /(?:te\s+)?(?:digo|cuento|si\s+me\s+duele|should\s+i\s+tell|do\s+i\s+tell)/i.test(text);
  return hasSymptom && !hypothetical;
}

const PART_PATTERNS: { part: AdaptiveQuestionnairePart; re: RegExp }[] = [
  { part: "shoulder", re: /hombro|shoulder|manguito|rotador|pectoral|p[eé]ctoral|pecho|chest|press\s*banca/i },
  { part: "elbow", re: /codo|elbow|epicond|b[ií]ceps(?!\s*femoral)|tr[ií]ceps(?!\s*sural)|popeye/i },
  { part: "finger", re: /dedo|dedos|finger|pulgar|índice|indice|anular|meñique|falange|mallet|resorte/i },
  { part: "wrist_hand", re: /mu[ñn]eca|mano|wrist|hand/i },
  { part: "neck", re: /cuello|neck|cervical/i },
  { part: "back", re: /espalda|lumbar|dorsal|lumbago|ci[aá]tica|thoracic|back(?!\s*pack)/i },
  { part: "hip", re: /cadera|hip|ingle|aductor|adductor|pubalgia|muslo\s*interno/i },
  // Lower leg BEFORE knee — "debajo de la rodilla" must not open knee questionnaire
  {
    part: "ankle_foot",
    re: /tobillo|pie\b|ankle|foot|fascitis|plantar|planta|tal[oó]n|heel|gemelo|pantorrilla|calf|aquiles|achilles|espinilla|shin|pierna|lower\s*leg|tuberosidad\s*tibial|debajo\s+(de\s+)?(la\s+)?rodilla|below\s+(the\s+)?knee|under\s+(the\s+)?knee/i,
  },
  { part: "knee", re: /rodilla|knee|menisco|cruzado|cuadr[ií]ceps|cu[aá]driceps|quad|muslo|isquio|hamstring/i },
];

/** Fallback when triage API fails: questionnaire on clear complaint + known part. */
export function fallbackTriageFromText(text: string): ConsultaTriageResult {
  if (isMetaOrClarificationQuery(text) || EDUCATIONAL_QUERY.test(text)) {
    return { action: "respond", intent: "general" };
  }

  const complaint =
    /duele|dolor|molestia|lesi[oó]n|hinch|inflam|trauma|golpe|esguince|no puedo mover|limitaci|pinch|rotura|artrosc|rigidez|contractura|hurt|hurts|pain|painful|sore|injury|injured|sprain|swollen|swelling|can't move|cannot move/i.test(
      text
    );
  if (!complaint) {
    return { action: "respond", intent: "general" };
  }

  // Explicit: foot/plantar OR leg below the knee → ankle_foot (UI adapts to foot vs shin)
  if (isFootOrPlantarComplaint(text) || isBelowKneeOrLowerLeg(text)) {
    return { action: "questionnaire", bodyPart: "ankle_foot" };
  }

  for (const { part, re } of PART_PATTERNS) {
    if (re.test(text)) {
      // Don't assign knee when "rodilla" is only a landmark for below-knee pain
      if (part === "knee" && isBelowKneeOrLowerLeg(text)) {
        return { action: "questionnaire", bodyPart: "ankle_foot" };
      }
      return { action: "questionnaire", bodyPart: part };
    }
  }

  const detected = detectBodyPartsFromText(text);
  if (detected.length === 1 && isAdaptiveQuestionnairePart(detected[0])) {
    return { action: "questionnaire", bodyPart: detected[0] };
  }

  return { action: "respond", intent: "symptom_other" };
}

export function shouldStartQuestionnaire(
  triage: ConsultaTriageResult,
  evaluatedParts: AdaptiveQuestionnairePart[]
): triage is ConsultaTriageResult & {
  action: "questionnaire";
  bodyPart: AdaptiveQuestionnairePart;
} {
  return (
    triage.action === "questionnaire" &&
    !!triage.bodyPart &&
    !evaluatedParts.includes(triage.bodyPart)
  );
}

/**
 * Fix LLM/local misclassification: foot/plantar or "pierna debajo de rodilla" must not become knee.
 */
export function refineTriageBodyPart(
  triage: ConsultaTriageResult,
  text: string
): ConsultaTriageResult {
  if (isFootOrPlantarComplaint(text) || isBelowKneeOrLowerLeg(text)) {
    if (triage.action === "questionnaire") {
      return { ...triage, bodyPart: "ankle_foot" };
    }
    if (triage.action === "respond" && triage.intent === "symptom_other") {
      return { action: "questionnaire", bodyPart: "ankle_foot" };
    }
  }
  return triage;
}

export function bodyAreaLabelFromText(text: string): string {
  const detected = detectBodyPartsFromText(text);
  if (detected.length > 0) {
    return detected.map((p: BodyPartId) => bodyPartLabel(p)).join(", ");
  }
  return "Consulta general";
}

/** Parts that have a full adaptive UI (step-by-step like shoulder). */
export function hasFullAdaptiveUi(part: AdaptiveQuestionnairePart | BodyPartId | "generic"): boolean {
  return (
    part === "shoulder" ||
    part === "elbow" ||
    part === "wrist_hand" ||
    part === "finger" ||
    part === "neck" ||
    part === "ankle_foot" ||
    part === "knee" ||
    part === "back" ||
    part === "hip"
  );
}

/** Mobile: call edge triage and refine body-part routing. */
export async function triageMessage(
  text: string,
  imageUrl?: string | null,
  _language?: string
): Promise<ConsultaTriageResult> {
  try {
    const raw = await callEdgeJson({
      mode: "triage",
      message: text,
      ...(imageUrl ? { imageUrl } : {}),
    });
    return refineTriageBodyPart(parseTriageResult(raw), text);
  } catch {
    return refineTriageBodyPart(fallbackTriageFromText(text), text);
  }
}

/** Mobile: first AI reply when no questionnaire is started. */
export async function respondToUserMessage(
  text: string,
  triage: ConsultaTriageResult,
  imageUrl?: string | null,
  language: "es" | "en" = "es"
): Promise<string> {
  let answer = triage.answer?.trim() ?? "";
  if (answer) return answer;

  const mode = triage.intent === "symptom_other" ? "clinical_screen" : "general_chat";
  const raw = await callEdgeJson({
    mode,
    message: text,
    language,
    bodyArea: bodyAreaLabelFromText(text),
    ...(imageUrl ? { imageUrl } : {}),
  });
  if (raw && typeof raw === "object" && typeof (raw as { answer?: string }).answer === "string") {
    return (raw as { answer: string }).answer;
  }
  return "No he podido generar una respuesta. Inténtalo de nuevo.";
}

