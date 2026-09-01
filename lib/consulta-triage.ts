import type { BodyPartId } from "@/lib/body-parts";
import {
  detectBodyPartsFromText,
  detectComplaintLinkedBodyParts,
  hasExplicitAnkleOrFootSite,
  isBelowKneeOrLowerLeg,
  isFootOrPlantarComplaint,
  isTrueKneeComplaint,
  isVagueArmComplaint,
  isVagueLegComplaint,
  patientFacingPartLabel,
  vagueArmClarifyMessage,
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
  /ejercicio|estiramiento|movilidad|rutina|c[óo]mo\s+(funciona|hacer|estirar|mejorar)|qu[eé]\s+es|prevenci[oó]n|consejo|informaci[oó]n|gu[ií]a|tutorial|explic|pruebas?\s+funcionales|special\s+tests?|tests?\s+funcionales|valoraci[oó]n\s+funcional|maniobras?\s+cl[ií]nicas|protocolo|dime\b|cu[eé]ntame\b|expl[ií]came\b|ind[ií]came\b|recomi[eé]ndame\b|cu[aá]les\s+son|what\s+(?:are|functional)|how\s+(?:do|can)\s+i\s+(?:test|assess)/i;

const META_CLARIFICATION_QUERY =
  /qu[eé]\s+hago|qu[eé]\s+debo|qu[eé]\s+tengo\s+que\s+hacer|c[oó]mo\s+funciona|how\s+does\s+(?:this|it)\s+work|what\s+(?:do|should)\s+i\s+do|how\s+do\s+i\s+(?:use|start)|por\s+d[oó]nde\s+empiezo|no\s+s[eé]\s+(?:qu[eé]|c[oó]mo)|explic(?:a|ame)\s+c[oó]mo|c[oó]mo\s+(?:se\s+)?usa|what\s+is\s+this|por\s+qu[eé]\s+(?:estoy|me\s+(?:han|has)\s+env)|(?:mi\s+)?fisio(?:terapeuta)?|c[oó]digo|informe|antes\s+de\s+(?:la\s+)?cita|why\s+(?:am\s+i|did)|physio\s+sent/i;

const HYPOTHETICAL_SYMPTOM_QUESTION =
  /(?:te\s+)?(?:digo|cuento|explico|escribo)\s+(?:lo\s+que\s+)?(?:me\s+)?duele\s+o|(?:debo|tengo\s+que)\s+(?:decirte|contarte|escribir).*(?:duele|dolor)/i;

const PROFESSIONAL_OR_THIRD_PERSON =
  /\b(?:un|el|al|para\s+(?:un|el)|hacerle\s+a\s+(?:un|el)|a\s+(?:un|el))\s+pacientes?\b|\b(?:a\s+)?(?:mi\s+)?paciente\b|for\s+(?:a|the|my)\s+patient|en\s+(?:un|el)\s+paciente/i;

/** True personal current symptom (first person), not teaching / hypothetical. */
export function describesCurrentPersonalSymptom(text: string): boolean {
  const hasSymptom =
    /\b(?:me\s+duele|tengo\s+(?:un\s+|una\s+)?dolor|tengo\s+dolor|me\s+molesta|me\s+ha\s+dolido|me\s+doli[oó]|me\s+he\s+hecho\s+da[ñn]o|me\s+hice\s+da[ñn]o|me\s+he\s+lesionado|me\s+lesion[eé]|me\s+he\s+lastimado|me\s+lastim[eé]|me\s+he\s+torcido|me\s+torc[ií]|tengo\s+(?:un\s+)?esguince|siento\s+(?:dolor|molest|algo|un\s+pinch)|(?:tengo|siento|noto)\s+(?:una?\s+)?(?:molestia|dolor|hinchaz[oó]n|pinchazo|rigidez)|notado\s+una?\s+(?:molestia|dolor)|(?:dolor|molestia|hinchaz[oó]n|rigidez|pinchazo)\s+en\s+(?:la|el|mi|mis|una|un)|hay\s+dolor|me\s+duele|duele\s+(?:la|el|mi)|it\s+hurts|my\s+.+\s+hurts|my\s+\w[\w\s-]{0,40}?\s+(?:is\s+)?(?:sore|aching|painful|tender|swollen)|i\s+(?:hurt|injured|sprained|twisted)|i\s+have\s+(?:a\s+)?pain|i\s+have\s+(?:a\s+)?(?:sore|aching|painful)|(?:a\s+)?pain\s+in\s+(?:my|the|la|el)|(?:sore|aching|painful|tender)\s+(?:in\s+)?(?:my|the)|i(?:'m| am)\s+(?:in\s+)?pain|it(?:'s|\s+is)\s+(?:sore|painful|aching|tender)|i\s+feel\s+(?:pain|sore|a\s+pain|something)|feeling\s+(?:pain|sore|something)|something\s+(?:hurts|is\s+sore))\b/i.test(
      text
    );
  const hypothetical =
    /(?:te\s+)?(?:digo|cuento|si\s+me\s+duele|should\s+i\s+tell|do\s+i\s+tell)/i.test(text);
  return hasSymptom && !hypothetical;
}

const LOOSE_SYMPTOM_CUE =
  /dolor|duele|molest|lesi[oó]n|hinchaz|rigidez|pinchazo|tir[oó]n|contractura|esguince|torc|lastim|da[ñn]o|cruj|chasquid|no\s+puedo|me\s+(?:pesa|falla)|hurt|pain|sore|injur|sprain|swell|stiff|ach(?:e|es|ing)|tender|pinch|can't\s+(?:move|walk|lift)|something\s+(?:hurts|feels)|feel(?:s|ing)?\s+(?:pain|sore|something|off)|algo\s+(?:me\s+)?(?:duele|molesta)|me\s+pasa\s+algo|tengo\s+algo|estoy\s+(?:fatal|mal|regular)|no\s+s[eé]\s+qu[eé]\s+me\s+pasa|desde\s+hace|me\s+noto|notado|incomodidad|discomfort|problem(?:a|s)?\s+(?:en|con|with)/i;

/**
 * Broader than describesCurrentPersonalSymptom — used in Fisioterapia so
 * "algo me duele", "tengo un pinchazo" or a named body part still start the case.
 */
export function looksLikePersonalMusculoskeletalComplaint(text: string): boolean {
  const t = text.trim();
  if (!t) return false;
  if (describesCurrentPersonalSymptom(t)) return true;
  if (isInformationalOrEducationalQuery(t) && !describesCurrentPersonalSymptom(t)) {
    return false;
  }
  if (isMetaOrClarificationQuery(t) && !LOOSE_SYMPTOM_CUE.test(t)) return false;
  if (detectBodyPartsFromText(t).length > 0) return true;
  return LOOSE_SYMPTOM_CUE.test(t);
}

/**
 * Asking for information / tests / exercises — NOT reporting “I am injured”.
 * Must NOT open a symptom questionnaire just because a body part word appears.
 */
export function isInformationalOrEducationalQuery(text: string): boolean {
  const t = text.trim();
  if (!t) return false;

  // Explicitly about another patient / professional use
  if (PROFESSIONAL_OR_THIRD_PERSON.test(t)) return true;

  // Asking for functional tests / assessment content without a personal injury report
  if (
    /pruebas?\s+funcionales|special\s+tests?|tests?\s+funcionales|valoraci[oó]n\s+funcional|maniobras?\s+cl[ií]nicas|qu[eé]\s+pruebas|what\s+tests|how\s+to\s+(?:test|assess)/i.test(
      t
    )
  ) {
    if (!describesCurrentPersonalSymptom(t)) return true;
  }

  // “dime / explícame / cuáles son …” without personal symptom
  if (
    /\b(?:dime|expl[ií]came|ind[ií]came|recomi[eé]ndame|cu[eé]ntame|lista|enumera|cu[aá]les\s+son)\b/i.test(
      t
    ) &&
    !describesCurrentPersonalSymptom(t)
  ) {
    return true;
  }

  if (EDUCATIONAL_QUERY.test(t) && !describesCurrentPersonalSymptom(t)) {
    return true;
  }

  return false;
}

/**
 * Open adaptive questionnaires for any personal symptom report.
 * Wording must not matter: "my knee hurts", "I have a pain in my knee",
 * "knee is sore", "siento algo en la rodilla", etc.
 */
export function shouldOpenSymptomQuestionnaire(text: string): boolean {
  const t = text.trim();
  if (!t) return false;
  if (isInformationalOrEducationalQuery(t)) return false;
  if (isMetaOrClarificationQuery(t)) return false;
  if (describesCurrentPersonalSymptom(t)) return true;
  // Body region + any pain / sore / discomfort cue
  if (LOOSE_SYMPTOM_CUE.test(t) && detectBodyPartsFromText(t).length > 0) {
    return true;
  }
  // First-person discomfort without a clear region still starts intake
  if (
    LOOSE_SYMPTOM_CUE.test(t) &&
    /\b(?:my|mi|tengo|siento|noto|me|i(?:'m|\s+am|\s+have|\s+feel)|it(?:'s|\s+is))\b/i.test(t)
  ) {
    return true;
  }
  return false;
}

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

const PART_PATTERNS: { part: AdaptiveQuestionnairePart; re: RegExp }[] = [
  {
    part: "shoulder",
    re: /hombro|shoulder|manguito|rotador|pectoral|p[eé]ctoral|pecho|chest|press\s*banca|parte\s+alta\s+del\s+brazo|cerca\s+del\s+hombro|upper\s+arm|elev(ar|o|ando)\s+(el\s+)?brazo|por\s+encima\s+de\s+la\s+cabeza|overhead/i,
  },
  {
    part: "elbow",
    re: /codo|elbow|epicond|b[ií]ceps(?!\s*femoral)|tr[ií]ceps(?!\s*sural)|popeye|antebrazo|parte\s+baja\s+del\s+brazo|cerca\s+del\s+codo/i,
  },
  { part: "finger", re: /dedo|dedos|finger|pulgar|índice|indice|anular|meñique|falange|mallet|resorte/i },
  { part: "head", re: /cefalea|migra[nñ]a|headache|dolor\s+(?:de\s+)?(?:la\s+)?cabeza|me\s+duele\s+(?:la\s+)?cabeza|\bla\s+cabeza\b/i },
  { part: "wrist_hand", re: /\bmu[ñn]ecas?\b|\bmanos?\b|\bwrists?\b|\bhands?\b/i },
  { part: "neck", re: /cuello|neck|cervical/i },
  { part: "back", re: /espalda|lumbar|dorsal|lumbago|ci[aá]tica|thoracic|\bbacks?\b/i },
  { part: "hip", re: /cadera|hip|ingle|aductor|adductor|pubalgia|muslo\s*interno/i },
  // Lower leg / muslo BEFORE knee — "isquio" and "muslo" must not open knee questionnaire
  {
    part: "ankle_foot",
    re: /tobillo|pie\b|ankle|foot|fascitis|plantar|planta|tal[oó]n|heel|gemelo|pantorrilla|calf|aquiles|achilles|espinilla|shin|pierna|lower\s*leg|tuberosidad\s*tibial|debajo\s+(de\s+)?(la\s+)?rodilla|below\s+(the\s+)?knee|under\s+(the\s+)?knee|\bmuslos?\b|\bthighs?\b|isquiotibial|\bisquios?\b|hamstring|cuadr[ií]ceps|cu[aá]driceps|\bquads?\b/i,
  },
  { part: "knee", re: /\brodillas?\b|\bknees?\b|menisco|cruzado|r[oó]tula|patella/i },
];

/** Fallback when triage API fails: questionnaire on clear complaint + known part. */
export function fallbackTriageFromText(text: string): ConsultaTriageResult {
  if (
    isMetaOrClarificationQuery(text) ||
    isInformationalOrEducationalQuery(text) ||
    !shouldOpenSymptomQuestionnaire(text)
  ) {
    return { action: "respond", intent: "general" };
  }

  const multiDetected = detectBodyPartsFromText(text);
  if (
    multiDetected.length > 1 &&
    isAdaptiveQuestionnairePart(multiDetected[0])
  ) {
    return { action: "questionnaire", bodyPart: multiDetected[0] };
  }

  // Explicit: vague "pierna", foot/plantar, OR leg below the knee → ankle_foot (UI adapts)
  if (
    isVagueLegComplaint(text) ||
    isFootOrPlantarComplaint(text) ||
    isBelowKneeOrLowerLeg(text)
  ) {
    return { action: "questionnaire", bodyPart: "ankle_foot" };
  }

  // Vague "brazo" / "arm" — do NOT open shoulder/elbow; ask where first
  if (isVagueArmComplaint(text)) {
    return {
      action: "respond",
      intent: "general",
      answer: vagueArmClarifyMessage("es"),
    };
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
 * Uses the painful site the patient named ("me duele el tobillo"), not leftover keywords.
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

/**
 * Pick the questionnaire zone from the sentence. A named pain site always wins
 * over an LLM/triage guess (e.g. tobillo must not become knee).
 */
export function resolveQuestionnaireLaunch(
  text: string,
  evaluatedParts: AdaptiveQuestionnairePart[] = [],
  preferredFirst?: AdaptiveQuestionnairePart | "generic"
): {
  first: AdaptiveQuestionnairePart | "generic";
  rest: AdaptiveQuestionnairePart[];
} | null {
  const queue = pendingPartsFromText(text, evaluatedParts);
  if (queue.length >= 1) {
    return { first: queue[0], rest: queue.slice(1) };
  }
  if (
    preferredFirst &&
    preferredFirst !== "generic" &&
    preferredFirst === "knee" &&
    hasExplicitAnkleOrFootSite(text) &&
    !isTrueKneeComplaint(text)
  ) {
    return { first: "ankle_foot", rest: [] };
  }
  if (preferredFirst && preferredFirst !== "generic") {
    return { first: preferredFirst, rest: [] };
  }
  if (preferredFirst === "generic") {
    return { first: "generic", rest: [] };
  }
  return null;
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
  // Numbered answers like "1. sí" "2. duele un poco"
  if (/\b\d+[.)]\s+\S+/i.test(t) && (yesNoCount >= 1 || /\bduele|dolor|puedo|pude|sin dolor/i.test(t))) {
    return true;
  }
  // "no puedo correr / chutar / sentadilla…" = answering movement tests
  const noPuedoCount = (t.match(/\bno\s+puedo\b/gi) ?? []).length;
  if (
    noPuedoCount >= 2 ||
    (noPuedoCount >= 1 &&
      /\b(correr|chutar|bal[oó]n|sentadilla|extensi[oó]n|squat|hematoma|correr)\b/i.test(t))
  ) {
    return true;
  }
  if (/\bhematoma\b/i.test(t) && /\b(visible|puedo|correr|sentadilla|chutar)\b/i.test(t)) {
    return true;
  }
  if (
    /\b(prueba|test|movimiento|girar|elevar|inclinar|flexionar|sentadilla|pata coja|extensi[oó]n|chutar|correr|squat)\b/i.test(
      t
    ) &&
    /\b(duele|dolor|pude|puedo|sin dolor|hormigueo|positiv|negativ|empeora|mejor|bloqueo|mareo|hematoma)\b/i.test(
      t
    )
  ) {
    return true;
  }
  return false;
}

/** Closing copy when the patient confirms they have no more related questions. */
export function consultaFinishedCloseMessage(
  language: "es" | "en" = "es"
): string {
  if (language === "en") {
    return `Perfect. We'll close this consultation here. Follow Physio's recommendations above.

If something else comes up later, open a **new consultation**.`;
  }
  return `Perfecto. Damos por terminada esta consulta. Sigue las recomendaciones de Physio de arriba.

Si más adelante te duele otra cosa o tienes una duda distinta, abre una **nueva consulta**.`;
}

export function isConsultaFinishedCloseMessage(content: string): boolean {
  return (
    /damos por terminada esta consulta|we'll close this consultation here|queda cerrada la orientación de esta consulta|full orientation for this consultation/i.test(
      content
    )
  );
}

/** Ask after the post-tests (or post-orientation) recommendations. */
export function askMoreRelatedQuestionsPrompt(
  language: "es" | "en" = "es"
): string {
  if (language === "en") {
    return "Do you have any other question related to this injury?";
  }
  return "¿Tienes alguna otra pregunta relacionada con esta lesión?";
}

/** When more body zones are still queued in the same consulta. */
export function promptContinueNextZoneEvaluation(
  nextLabel: string,
  language: "es" | "en" = "es"
): string {
  if (language === "en") {
    return `We still need to evaluate **${nextLabel}** in this consultation. Reply **yes** when you're ready to start the ${nextLabel} questionnaire.`;
  }
  return `Aún tenemos pendiente evaluar **${nextLabel}** en esta consulta. Responde **sí** cuando quieras empezar el cuestionario de ${nextLabel}.`;
}

export function resolveNextPendingZone(
  initialMessage: string,
  evaluatedParts: AdaptiveQuestionnairePart[],
  pendingParts: AdaptiveQuestionnairePart[],
  awaitingNextPart: AdaptiveQuestionnairePart | null,
  completedPart?: AdaptiveQuestionnairePart | "generic"
): AdaptiveQuestionnairePart | null {
  if (awaitingNextPart) return awaitingNextPart;
  if (pendingParts[0]) return pendingParts[0];
  const evaluated = [
    ...evaluatedParts,
    ...(completedPart && completedPart !== "generic"
      ? [completedPart as AdaptiveQuestionnairePart]
      : []),
  ];
  return pendingPartsFromText(initialMessage, evaluated)[0] ?? null;
}

export function ensureAsksMoreRelatedQuestions(
  answer: string,
  language: "es" | "en" = "es"
): string {
  const t = answer.trim();
  if (
    /otra pregunta relacionada|any other question related|alguna otra duda relacionada/i.test(
      t
    )
  ) {
    return t;
  }
  return `${t}\n\n${askMoreRelatedQuestionsPrompt(language)}`;
}

/** Patient says they have no more questions about this injury. */
export function declinesMoreRelatedQuestions(text: string): boolean {
  const t = stripSoftConfirmPunctuation(text).toLowerCase();
  if (!t) return false;
  if (reportsFunctionalTestResults(text)) return false;
  if (
    /^(no|nope|nada|ninguna|no\s+gracias|gracias)[\s!.]*$/i.test(t) ||
    /\b(no\s+tengo(\s+m[aá]s|\s+otra)?|nada\s+m[aá]s|ninguna\s+(otra\s+)?(pregunta|duda)|eso\s+es\s+todo|ya\s+est[aá]|ya\s+no|no\s+gracias|sin\s+m[aá]s\s+preguntas|that'?s\s+all|no\s+more\s+questions|nothing\s+else)\b/i.test(
      t
    )
  ) {
    return true;
  }
  return false;
}

/** Patient says yes to "any other related question?" without asking yet. */
export function affirmsMoreRelatedQuestions(text: string): boolean {
  const t = stripSoftConfirmPunctuation(text).toLowerCase();
  if (!t) return false;
  if (declinesMoreRelatedQuestions(text)) return false;
  if (reportsFunctionalTestResults(text)) return false;
  return /^(s[ií]|sip|yes|yeah|ok|vale|claro|afirmativo)[\s!.]*$/i.test(t);
}

export function inviteRelatedQuestionMessage(
  language: "es" | "en" = "es"
): string {
  if (language === "en") {
    return "Sure — go ahead and ask whatever you need about this injury.";
  }
  return "Claro — pregunta lo que necesites sobre esta lesión.";
}

export function unrelatedConsultaRedirectMessage(
  injuryLabel: string,
  language: "es" | "en" = "es"
): string {
  const label = injuryLabel.trim() || (language === "en" ? "this injury" : "esta lesión");
  if (language === "en") {
    return `This chat is only about **${label}**. If you want to ask about a different issue, open a **new consultation** with the button below.`;
  }
  return `Este chat es solo sobre **${label}**. Si quieres preguntar por otra molestia o un tema distinto, abre una **nueva consulta** con el botón de abajo.`;
}

/**
 * Rough gate: a message that looks like a different body region / new injury
 * than the current consulta case.
 */
export function isUnrelatedConsultaQuestion(
  text: string,
  caseText: string,
  caseParts: AdaptiveQuestionnairePart[]
): boolean {
  if (!text.trim()) return false;
  if (reportsFunctionalTestResults(text)) return false;
  if (declinesMoreRelatedQuestions(text)) return false;
  if (affirmsMoreRelatedQuestions(text)) return false;
  if (isMetaOrClarificationQuery(text)) return false;

  const mentioned = detectBodyPartsFromText(text);
  if (mentioned.length === 0) return false;

  const allowed = new Set<AdaptiveQuestionnairePart>([
    ...caseParts,
    ...detectBodyPartsFromText(caseText),
  ]);
  // Vague "leg" / pierna often overlaps shin/quad/knee — don't treat as foreign.
  const foreign = mentioned.filter((p) => {
    if (allowed.has(p)) return false;
    if (p === "ankle_foot" && (allowed.has("knee") || allowed.has("hip"))) {
      // still foreign if only talking ankle while case is knee? keep foreign
    }
    return true;
  });
  return foreign.length > 0 && mentioned.every((p) => !allowed.has(p));
}

export function relatedInjuryFollowupContext(
  injuryLabel: string,
  language: "es" | "en" = "es",
  options?: { askMore?: boolean }
): string {
  const label = injuryLabel.trim() || (language === "en" ? "this injury" : "esta lesión");
  const askMore = options?.askMore !== false;
  if (language === "en") {
    return `RELATED FOLLOW-UP (CRITICAL): The patient is still in the SAME consultation about **${label}**.
Answer only if the question is about this injury / zone / recovery.
If it is clearly a DIFFERENT injury or topic, do NOT answer clinically — tell them to open a new consultation.
${askMore ? "End your reply by asking if they have any other question related to this injury." : "Do NOT close the consultation. Functional tests may still be pending."}`;
  }
  return `SEGUIMIENTO DE LA MISMA LESIÓN (CRÍTICO): El paciente sigue en la MISMA consulta sobre **${label}**.
Responde solo si la pregunta es sobre esta lesión / zona / recuperación.
Si es claramente OTRA lesión u otro tema, NO respondas clínicamente — indícale que abra una nueva consulta.
${askMore ? "Termina preguntando si tiene alguna otra pregunta relacionada con esta lesión." : "NO cierres la consulta. Las pruebas funcionales pueden seguir pendientes."}`;
}

export function functionalTestResultsFollowupContext(
  language: "es" | "en" = "es",
  options?: { pendingNextZoneLabel?: string | null }
): string {
  const closing = options?.pendingNextZoneLabel?.trim()
    ? promptContinueNextZoneEvaluation(options.pendingNextZoneLabel.trim(), language)
    : askMoreRelatedQuestionsPrompt(language);
  if (language === "en") {
    return `FUNCTIONAL TEST RESULTS (CRITICAL): The patient is answering the **functional tests** you already asked for in this same consultation.
READ their answers carefully. INTERPRET them against the prior orientation and questionnaire.
Give a clearer conclusion about the likely injury / structures involved and concrete recommendations (what to do now / in the meantime).
Do NOT start a new questionnaire. Do NOT pretend this is a new body region. Do NOT ask them to fill another form.
Do NOT ignore what they wrote.
${options?.pendingNextZoneLabel ? "Do NOT ask if they have other questions about the injury — more body zones are still pending in this consult." : ""}
End with: "${closing}"`;
  }
  return `RESULTADOS DE PRUEBAS FUNCIONALES (CRÍTICO): El paciente está respondiendo a las **pruebas funcionales** que ya le pediste en ESTA misma consulta.
LEE con atención lo que responde. INTERPRETA los resultados junto con la orientación y el cuestionario previos.
Da una conclusión más clara sobre la lesión / estructuras afectadas y recomendaciones concretas (qué hacer ahora / mientras tanto).
NO empieces un cuestionario nuevo. NO trates esto como otra zona corporal nueva. NO pidas otro formulario.
NO ignores lo que ha escrito el paciente.
${options?.pendingNextZoneLabel ? "NO preguntes si tiene otras dudas sobre la lesión — aún quedan más zonas por evaluar en esta consulta." : ""}
Termina con: "${closing}"`;
}

/** After tests are done, patient wants to move on to the next questionnaire. */
export function wantsToContinueToNextQuestionnaire(text: string): boolean {
  // Answering tests is NOT "start the next questionnaire"
  if (reportsFunctionalTestResults(text)) return false;
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
  if (reportsFunctionalTestResults(text)) return false;
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

/** Patient declines / postpones the next questionnaire (explicit — not a bare "no"). */
export function isDeclineNextPart(text: string): boolean {
  const t = text.trim();
  if (!t) return false;
  if (isChoosingOrAskingNextStep(t)) return false;
  if (/^(no|nop)([\s,.!]|$)/i.test(t)) return false;
  return /^(ahora no|luego|m[aá]s tarde|despu[eé]s|pasar|skip|no quiero)([\s,.!]|$)/i.test(t);
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
 * Vague "brazo"/"arm" must not become elbow or shoulder.
 * When several zones are named, do not force ankle_foot over the first-mentioned zone.
 */
export function refineTriageBodyPart(
  triage: ConsultaTriageResult,
  text: string
): ConsultaTriageResult {
  // Educational / “dime pruebas…” / third-person — never force a questionnaire
  if (
    isInformationalOrEducationalQuery(text) ||
    isMetaOrClarificationQuery(text) ||
    (triage.action === "questionnaire" && !shouldOpenSymptomQuestionnaire(text))
  ) {
    return {
      action: "respond",
      intent: "general",
      answer: triage.answer,
    };
  }

  const linked = detectComplaintLinkedBodyParts(text);
  if (linked.length === 1 && isAdaptiveQuestionnairePart(linked[0])) {
    if (triage.action === "questionnaire" || shouldOpenSymptomQuestionnaire(text)) {
      return { action: "questionnaire", bodyPart: linked[0] };
    }
  }

  if (hasExplicitAnkleOrFootSite(text) && !isTrueKneeComplaint(text)) {
    if (triage.action === "questionnaire" || triage.intent === "symptom_other") {
      return { action: "questionnaire", bodyPart: "ankle_foot" };
    }
  }

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
  if (isVagueArmComplaint(text)) {
    return {
      action: "respond",
      intent: "general",
      answer: vagueArmClarifyMessage("es"),
    };
  }
  if (
    isVagueLegComplaint(text) ||
    isFootOrPlantarComplaint(text) ||
    isBelowKneeOrLowerLeg(text)
  ) {
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
