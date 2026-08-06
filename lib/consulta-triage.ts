import type { BodyPartId } from "@/lib/body-parts";
import {
  detectBodyPartsFromText,
  isBelowKneeOrLowerLeg,
  isFootOrPlantarComplaint,
  patientFacingPartLabel,
} from "@/lib/detect-body-part";

/** All body regions that start a structured questionnaire before AI reply. */
export const ADAPTIVE_QUESTIONNAIRE_PARTS = [
  "shoulder",
  "elbow",
  "wrist_hand",
  "finger",
  "head",
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
  /qu[eé]\s+hago|qu[eé]\s+debo|qu[eé]\s+tengo\s+que\s+hacer|c[oó]mo\s+funciona|how\s+does\s+(?:this|it)\s+work|what\s+(?:do|should)\s+i\s+do|how\s+do\s+i\s+(?:use|start)|por\s+d[oó]nde\s+empiezo|no\s+s[eé]\s+(?:qu[eé]|c[oó]mo)|explic(?:a|ame)\s+c[oó]mo|c[oó]mo\s+(?:se\s+)?usa|what\s+is\s+this|por\s+qu[eé]\s+(?:estoy|me\s+(?:han|has)\s+env)|(?:mi\s+)?fisio(?:terapeuta)?|c[oó]digo|informe|antes\s+de\s+(?:la\s+)?cita|why\s+(?:am\s+i|did)|physio\s+sent/i;

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
  { part: "head", re: /cefalea|migra[nñ]a|headache|dolor\s+(?:de\s+)?(?:la\s+)?cabeza|me\s+duele\s+(?:la\s+)?cabeza|\bla\s+cabeza\b/i },
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

  const multiDetected = detectBodyPartsFromText(text);
  if (
    multiDetected.length > 1 &&
    isAdaptiveQuestionnairePart(multiDetected[0])
  ) {
    return { action: "questionnaire", bodyPart: multiDetected[0] };
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
 * Ordered adaptive questionnaires still needed for a free-text complaint.
 * Used when the patient mentions several zones (e.g. hombro + muñeca).
 */
export function pendingPartsFromText(
  text: string,
  evaluatedParts: AdaptiveQuestionnairePart[] = []
): AdaptiveQuestionnairePart[] {
  const detected = detectBodyPartsFromText(text);
  const queue: AdaptiveQuestionnairePart[] = [];
  for (const id of detected) {
    if (!isAdaptiveQuestionnairePart(id)) continue;
    if (evaluatedParts.includes(id)) continue;
    if (queue.includes(id)) continue;
    queue.push(id);
  }
  return queue;
}

export function nextPartReadyMessage(
  completed: AdaptiveQuestionnairePart | "generic",
  next: AdaptiveQuestionnairePart,
  language: "es" | "en" = "es",
  userText: string = "",
  opts?: { functionalTestsDone?: boolean }
): string {
  const nextLabel = patientFacingPartLabel(next, userText, language);
  const doneLabel =
    completed === "generic"
      ? language === "en"
        ? "this area"
        : "esta zona"
      : patientFacingPartLabel(completed, userText, language);

  if (opts?.functionalTestsDone) {
    if (language === "en") {
      return `You've already done the **functional tests** for **${doneLabel}**.

Next step: the **${nextLabel}** questionnaire. Reply **yes** to start the ${nextLabel} questions.`;
    }
    return `Ya has hecho las **pruebas funcionales** de **${doneLabel}**.

Siguiente paso: el cuestionario de **${nextLabel}**. Responde **sí** para empezar las preguntas de ${nextLabel}.`;
  }

  if (language === "en") {
    return `We've finished the **${doneLabel}** evaluation above.

You can choose either path:
1) Do the **functional tests** for ${doneLabel} now (from the orientation above), then we'll continue with the **${nextLabel}** questionnaire.
2) Start the **${nextLabel}** questionnaire now, and do the functional tests for both areas after the remaining questionnaires.

Reply **yes** to start the ${nextLabel} questions, tell me you want the functional tests first, or ask anything.`;
  }
  return `Ya hemos terminado la evaluación de **${doneLabel}** (arriba).

Puedes elegir cualquiera de estos dos caminos:
1) Hacer ahora las **pruebas funcionales** de ${doneLabel} (de la orientación de arriba) y luego seguimos con el cuestionario de **${nextLabel}**.
2) Empezar ya el **cuestionario de ${nextLabel}** y, al terminar las zonas, hacer las pruebas funcionales de ambas.

Responde **sí** para empezar las preguntas de ${nextLabel}, dime que quieres primero las pruebas funcionales, o pregunta lo que necesites.`;
}

/** Patient is reporting functional test outcomes or says they finished the tests. */
export function reportsFunctionalTestResults(text: string): boolean {
  const t = stripSoftConfirmPunctuation(text).toLowerCase();
  if (!t) return false;
  if (
    /\b(y[aá]|he|hemos|ya)\s+(hecho|hice|hicimos|realic[eé]|complet[eé]|termin[eé])\s+(las\s+)?(pruebas?\s+funcionales|tests)/i.test(
      t
    )
  ) {
    return true;
  }
  if (
    /\b(pruebas?\s+funcionales|tests)\s+(hechas|hechos|listas|listos|completadas|done|finished)/i.test(
      t
    )
  ) {
    return true;
  }
  const yesNoCount = (t.match(/\b(s[ií]|no)\b/gi) ?? []).length;
  if (yesNoCount >= 2) return true;
  if (/\b\d+[.)]\s*(s[ií]|no)\b/i.test(t) && yesNoCount >= 1) return true;
  if (
    /\b(prueba|test|movimiento|girar|elevar|inclinar|flexionar|sentadilla|pata coja)\b/i.test(
      t
    ) &&
    /\b(duele|dolor|pude|puedo|sin dolor|hormigueo|positiv|negativ|empeora|mejor|bloqueo|mareo)\b/i.test(
      t
    )
  ) {
    return true;
  }
  return false;
}

/** After tests are done, patient wants to move on to the next questionnaire. */
export function wantsToContinueToNextQuestionnaire(text: string): boolean {
  const t = stripSoftConfirmPunctuation(text);
  if (!t || isChoosingOrAskingNextStep(text)) return false;
  if (isAffirmativeNextPart(text)) return true;
  return (
    /^(continuemos|siguiente|seguimos|continuar)[\s!.]*$/i.test(t) ||
    /\b(vamos\s+con|continuemos\s+con|siguiente\s+(zona|parte|cuestionario)|empez(ar|amos)\s+(con\s+)?(el\s+)?(cuestionario|preguntas))\b/i.test(
      t
    )
  );
}

/** Soft trailing confirmation like "vale?" / "ok?" — not a real clarifying question. */
function stripSoftConfirmPunctuation(text: string): string {
  return text
    .trim()
    .replace(/[\s]*(vale|ok|okay|no)\s*\?+\s*$/i, "")
    .replace(/[¿?¡!]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Patient agrees to start the next queued questionnaire. */
export function isAffirmativeNextPart(text: string): boolean {
  const t = stripSoftConfirmPunctuation(text);
  if (!t) return false;
  if (isChoosingOrAskingNextStep(text)) return false;
  if (
    /^(s[ií]+|yes|ok|okay|vale|vamos|adelante|dale|claro|perfecto|listo|de acuerdo|continuar?|empezamos?|empiezo|empezar)[\s!.]*$/i.test(
      t
    )
  ) {
    return true;
  }
  // Short affirmative that is not a question about options
  if (
    /^(s[ií]+|yes|ok|vale|vamos|adelante|dale)([\s,]+(con\s+)?(el\s+)?(cuestionario|preguntas|siguiente|pr[oó]ximo).*)?[\s!.]*$/i.test(
      t
    )
  ) {
    return true;
  }
  return false;
}

/**
 * True when the patient already chose: questionnaire now, functional tests later.
 * Must win over "mentions both paths" heuristics.
 */
export function wantsQuestionnaireThenTests(text: string): boolean {
  const t = stripSoftConfirmPunctuation(text).toLowerCase();
  if (!t) return false;
  if (!/cuestionario|preguntas|questionnaire/i.test(t)) return false;
  // Still asking A or B — not a decision
  if (/qu[eé]\s+(hacemos|hago|debo|elijo|prefiero)|cu[aá]l\s+(opci[oó]n|elige)/i.test(t)) {
    return false;
  }
  if (
    /pruebas?\s+funcionales|functional\s+tests/i.test(t) &&
    /cuestionario|preguntas|questionnaire/i.test(t) &&
    /\bo\b|\bor\b/i.test(t)
  ) {
    return false;
  }
  // Explicit order: questionnaire … then/later … functional tests
  if (
    /\b(luego|despu[eé]s|after|then|y\s+luego|y\s+despu[eé]s)\b/i.test(t) &&
    /pruebas?\s+funcionales|functional\s+tests/i.test(t)
  ) {
    return true;
  }
  // "hacemos / empezamos el cuestionario de X" (+ optional later tests)
  if (
    /\b(hacemos|hagamos|hacer|empezamos|empezar|vamos\s+(a|con)|seguir\s+con|continuar\s+con)\b.{0,40}\b(el\s+|la\s+)?(cuestionario|preguntas|questionnaire)\b/i.test(
      t
    )
  ) {
    return true;
  }
  return false;
}

/** User is asking which path to take, or asking a clarifying question — do NOT auto-advance. */
export function isChoosingOrAskingNextStep(text: string): boolean {
  const raw = text.trim();
  if (!raw) return false;
  // Already decided: questionnaire now, tests later
  if (wantsQuestionnaireThenTests(raw)) return false;

  const t = stripSoftConfirmPunctuation(raw);
  if (
    /qu[eé]\s+(hacemos|hago|debo|elijo|prefiero)|cu[aá]l\s+(opci[oó]n|elige|elegir)|no\s+s[eé]\s+(qu[eé]|si)|what\s+(do|should)\s+i|which\s+(one|option)/i.test(
      t
    )
  ) {
    return true;
  }
  // Real alternative question: A or B
  if (
    /pruebas?\s+funcionales|functional\s+tests/i.test(t) &&
    /cuestionario|preguntas|questionnaire/i.test(t) &&
    /\bo\b|\bor\b/i.test(t)
  ) {
    return true;
  }
  // Bare question mark without a clear choice still means "I'm unsure"
  if (/[?]/.test(raw) && !wantsQuestionnaireThenTests(raw) && !isAffirmativeOnly(raw)) {
    // Avoid treating "cuestionario de cuello?" as unsure if it's an explicit start
    if (
      /\b(cuestionario|preguntas|questionnaire)\b/i.test(t) &&
      !/pruebas?\s+funcionales|functional\s+tests/i.test(t) &&
      !/qu[eé]\s+|cu[aá]l\s+|\bo\b|\bor\b/i.test(t)
    ) {
      return false;
    }
    return true;
  }
  return false;
}

function isAffirmativeOnly(text: string): boolean {
  const t = stripSoftConfirmPunctuation(text);
  return /^(s[ií]+|yes|ok|okay|vale|vamos|adelante|dale|claro|perfecto|listo|de acuerdo)[\s!.]*$/i.test(
    t
  );
}

/** Clear intent to do functional tests now (keep next-part offer open). */
export function wantsFunctionalTestsNow(text: string): boolean {
  const t = stripSoftConfirmPunctuation(text);
  if (!t || wantsQuestionnaireThenTests(t)) return false;
  if (isChoosingOrAskingNextStep(text)) return false;
  return (
    /^(las\s+)?pruebas?\s+funcionales([\s!.]*|$)/i.test(t) ||
    /\b(hacer|hago|vamos\s+a|prefiero|primero)\s+(las\s+)?pruebas?\s+funcionales\b/i.test(t) ||
    /\b(functional\s+tests|do\s+the\s+tests)\b/i.test(t)
  );
}

/**
 * Clear intent to start the next queued questionnaire (full adaptive UI).
 * Mentions of the part name alone (e.g. in a question) are NOT enough.
 */
export function isClearStartNextPart(
  text: string,
  next: AdaptiveQuestionnairePart,
  userText: string = ""
): boolean {
  const t = stripSoftConfirmPunctuation(text);
  if (!t) return false;
  if (isDeclineNextPart(text)) return false;
  // Questionnaire now + tests later = start the real questionnaire UI
  if (wantsQuestionnaireThenTests(text)) return true;
  if (isChoosingOrAskingNextStep(text)) return false;
  if (isAffirmativeNextPart(text)) return true;

  const label = patientFacingPartLabel(next, userText, "es")
    .toLowerCase()
    .split("/")[0]
    .trim();
  const labelEn = patientFacingPartLabel(next, userText, "en")
    .toLowerCase()
    .split("/")[0]
    .trim();
  const mentionsNext =
    (label.length > 2 && t.toLowerCase().includes(label)) ||
    (labelEn.length > 2 && t.toLowerCase().includes(labelEn)) ||
    (next === "shoulder" && /pectoral|pecho|chest|hombro|shoulder/i.test(t)) ||
    (next === "head" && /cabeza|cefalea|headache|\bhead\b/i.test(t)) ||
    (next === "neck" && /cuello|cervical|\bneck\b/i.test(t));

  // Explicit "start the X questionnaire / questions"
  if (
    mentionsNext &&
    /\b(cuestionario|preguntas|questionnaire|empez(ar|amos|emos)|empezamos|continuar|seguir|vamos|hacemos|hagamos)\b/i.test(
      t
    ) &&
    !/\b(pruebas?\s+funcionales|functional\s+tests).{0,30}\b(ahora|primero|first)\b/i.test(t)
  ) {
    return true;
  }

  if (
    /^(vamos|seguir|continuar|empez(ar|amos|emos)|hacemos|hagamos)\s+(con\s+)?(el\s+)?(cuestionario|preguntas|siguiente)/i.test(
      t
    )
  ) {
    return true;
  }

  return false;
}

/** Patient declines / postpones the next questionnaire. */
export function isDeclineNextPart(text: string): boolean {
  const t = text.trim();
  if (!t) return false;
  if (isChoosingOrAskingNextStep(t)) return false;
  return /^(no|nop|ahora no|luego|m[aá]s tarde|despu[eé]s|pasar|skip)([\s,.!]|$)/i.test(t);
}

/** Context for Physio when the patient is between zones and asks what to do. */
export function betweenPartsChoiceContext(
  completedLabel: string,
  nextLabel: string,
  language: "es" | "en" = "es",
  opts?: { functionalTestsDone?: boolean }
): string {
  if (opts?.functionalTestsDone) {
    if (language === "en") {
      return `FUNCTIONAL TESTS ALREADY DONE (CRITICAL): The patient ALREADY completed the **functional tests** for **${completedLabel}**. Do NOT offer those tests again. Do NOT ask whether they want to do them. The ONLY pending step is the **${nextLabel}** questionnaire.
If they just reported test results, interpret them briefly. Then ask them to reply **yes** to start the ${nextLabel} questionnaire.`;
    }
    return `PRUEBAS FUNCIONALES YA HECHAS (CRÍTICO): El paciente YA completó las pruebas funcionales de **${completedLabel}**. NO vuelvas a ofrecerlas ni preguntes si quiere hacerlas. El ÚNICO paso pendiente es el cuestionario de **${nextLabel}**.
Si acaba de contarte los resultados, interprétalos brevemente. Luego pídele que responda **sí** para empezar el cuestionario de ${nextLabel}.`;
  }

  if (language === "en") {
    return `BETWEEN-ZONES CHOICE (CRITICAL): The patient just finished the **${completedLabel}** evaluation and still has **${nextLabel}** queued.
They were offered two valid paths:
1) Do the **functional tests** for ${completedLabel} now (from the orientation above), then continue later with the ${nextLabel} questionnaire.
2) Start the **${nextLabel} questionnaire** now (reply yes), and do functional tests for both areas after the remaining questionnaires.

Answer THEIR message directly and helpfully. Explain both options clearly if they are unsure. Do NOT pretend a questionnaire already started. Do NOT invent that they chose an option. NEVER invent or list your own questionnaire (not even 5 quick yes/no questions): the real questionnaire is opened by the app UI step-by-step when the patient replies **yes** or clearly chooses the questionnaire. End by asking them to reply **yes** for the ${nextLabel} questionnaire, or to tell you the results of the functional tests / that they want to do the tests first.`;
  }
  return `ELECCIÓN ENTRE ZONAS (CRÍTICO): El paciente acaba de terminar la evaluación de **${completedLabel}** y aún tiene pendiente **${nextLabel}**.
Se le ofrecieron dos caminos válidos:
1) Hacer ahora las **pruebas funcionales** de ${completedLabel} (de la orientación de arriba) y luego seguir con el cuestionario de ${nextLabel}.
2) Empezar ya el **cuestionario de ${nextLabel}** (respondiendo sí) y, al terminar las zonas, hacer las pruebas funcionales de ambas.

Responde DIRECTAMENTE a lo que pregunta el paciente. Si duda, explica ambas opciones con claridad. NO digas que ya empezaste un cuestionario. NO inventes que eligió una opción. NUNCA inventes ni listes un cuestionario propio (ni 5 preguntas rápidas): el cuestionario real lo abre la app con su interfaz paso a paso cuando el paciente responde **sí** o elige claramente el cuestionario. Cierra pidiendo que responda **sí** para el cuestionario de ${nextLabel}, o que te diga los resultados de las pruebas / que quiere hacer primero las pruebas funcionales.`;
}

/**
 * Fix LLM/local misclassification: foot/plantar or "pierna debajo de rodilla" must not become knee.
 * When several zones are named, do not force ankle_foot over the first-mentioned zone.
 */
export function refineTriageBodyPart(
  triage: ConsultaTriageResult,
  text: string
): ConsultaTriageResult {
  const multi = detectBodyPartsFromText(text).length > 1;
  if (multi) {
    const first = detectBodyPartsFromText(text)[0];
    if (
      triage.action === "questionnaire" &&
      isAdaptiveQuestionnairePart(first)
    ) {
      return { ...triage, bodyPart: first };
    }
    return triage;
  }
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
    return detected.map((p: BodyPartId) => patientFacingPartLabel(p, text, "es")).join(", ");
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
    part === "head" ||
    part === "neck" ||
    part === "ankle_foot" ||
    part === "knee" ||
    part === "back" ||
    part === "hip"
  );
}
