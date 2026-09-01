import { missingQuestionIssue, type AdaptiveValidationIssue } from "@/lib/consulta-validation";
import {
  filterSleepDependentOptions,
  shouldShowSleepDependentQuestion,
} from "@/lib/consulta-timing";

export const YES_NO = ["No", "Sí"] as const;

export const FINGER_OPTIONS = [
  "Pulgar",
  "Índice",
  "Medio",
  "Anular",
  "Meñique",
  "Varios dedos",
] as const;

export const HAND_OPTIONS = ["Derecha", "Izquierda", "Ambas"] as const;

export const FINGER_LOCATION_OPTIONS = [
  "Punta del dedo",
  "Articulación cerca de la punta del dedo",
  "Articulación del medio del dedo",
  "Nudillo (unión del dedo con la mano)",
  "Parte de la palma",
  "Parte de atrás del dedo",
  "Lado del dedo",
  "Todo el dedo",
] as const;

export const FINGER_WHEN_STARTED = [
  "Ha sido ahora",
  "Reciente (1-4 horas)",
  "Hoy",
  "Últimos días",
  "Hace 1–2 semanas",
  "Hace más de un mes",
  "No lo recuerdo",
] as const;

export const FINGER_HOW_STARTED = [
  "Deporte",
  "Caída",
  "Dedo doblado hacia atrás",
  "Dedo golpeado por balón",
  "Lesión por torsión",
  "Corte o herida",
  "Trabajo repetitivo",
  "Pesas",
  "Sin causa clara",
  "Otro",
] as const;

export const FINGER_PAIN_NATURE = [
  "Agudo",
  "Sordo",
  "Latido",
  "Quemazón",
  "Pulsátil",
  "Punzante",
  "Hormigueo",
  "Entumecimiento",
] as const;

export const FINGER_SWELLING = ["No", "Leve", "Moderada", "Muy hinchado"] as const;

export const MOVEMENT_ABILITY = ["Sí", "Casi", "No"] as const;

export const FINGER_LOCKING = ["Nunca", "Ocasionalmente", "Frecuentemente"] as const;

export const FINGER_REST_PAIN = ["Nunca", "A veces", "Constantemente"] as const;

export const FINGER_STIFFNESS = [
  "Solo por la mañana",
  "Todo el día",
  "Tras actividad",
  "No",
] as const;

export const FINGER_PREVIOUS_INJURY = ["Nunca", "Sí, una vez", "Sí, varias veces"] as const;

export const FINGER_SPORTS = [
  "Baloncesto",
  "Voleibol",
  "Escalada",
  "Tenis",
  "Pesas",
  "Artes marciales",
  "Gimnasia",
  "Otro",
] as const;

export const FINGER_FUNCTIONAL_LIMITS = [
  "Abrochar botones",
  "Escribir",
  "Teclear",
  "Cubiertos",
  "Cargar bolsas",
  "Abrir tarros",
  "Deporte",
  "Tocar instrumento",
  "Ninguna",
] as const;

export const FINGER_NUMBNESS = [
  "No",
  "Pulgar",
  "Índice",
  "Medio",
  "Anular",
  "Meñique",
] as const;

export const FINGER_AGGRAVATING = [
  "Doblar",
  "Estirar",
  "Agarrar",
  "Pellizcar",
  "Teclear",
  "Escribir",
  "Deporte",
  "Escalada",
  "Pesas",
  "Nada específico",
] as const;

export const FINGER_SELF_TEST = ["Sí", "Casi", "No", "No lo he probado"] as const;

export type FingerAdaptiveAnswers = {
  rf_dedo_frio_palido: string;
  rf_herida_abierta: string;
  rf_no_movimiento_total: string;
  rf_lesion_grave: string;
  rf_fiebre_infeccion: string;
  rf_sangrado_severo: string;
  rf_luxacion_sospecha: string;

  dedo_afectado: string;
  mano: string;
  localizacion_dedo: string[];
  dolor_familiar: string;
  cuando_empezo: string;
  como_empezo: string;
  detalle_otro: string;
  intensidad_dolor: number;
  naturaleza_dolor: string[];
  hinchazon: string;
  deformidad_visible: string;

  flexion_completa: string;
  extension_completa: string;
  bloqueo: string;
  chasquido: string;

  dolor_agarrar: string;
  dolor_pinza: string;
  movimientos_empeoran: string[];
  dolor_reposo: string;
  dolor_noche: string;
  rigidez: string;

  lesion_previa: string;
  deportes: string[];
  limitaciones_funcionales: string[];
  entumecimiento: string;

  test_puno_completo: string;
  test_pinza_papel: string;
  test_estabilidad_lateral: string;
};

export function defaultFingerAdaptiveAnswers(): FingerAdaptiveAnswers {
  return {
    rf_dedo_frio_palido: "",
    rf_herida_abierta: "",
    rf_no_movimiento_total: "",
    rf_lesion_grave: "",
    rf_fiebre_infeccion: "",
    rf_sangrado_severo: "",
    rf_luxacion_sospecha: "",
    dedo_afectado: "",
    mano: "",
    localizacion_dedo: [],
    dolor_familiar: "",
    cuando_empezo: "",
    como_empezo: "",
    detalle_otro: "",
    intensidad_dolor: 5,
    naturaleza_dolor: [],
    hinchazon: "",
    deformidad_visible: "",
    flexion_completa: "",
    extension_completa: "",
    bloqueo: "",
    chasquido: "",
    dolor_agarrar: "",
    dolor_pinza: "",
    movimientos_empeoran: [],
    dolor_reposo: "",
    dolor_noche: "",
    rigidez: "",
    lesion_previa: "",
    deportes: [],
    limitaciones_funcionales: [],
    entumecimiento: "",
    test_puno_completo: "",
    test_pinza_papel: "",
    test_estabilidad_lateral: "",
  };
}

export type FingerQuestionSection =
  | "red_flags"
  | "core"
  | "movement"
  | "function"
  | "history"
  | "self_tests";

export const FINGER_SECTION_LABELS: Record<FingerQuestionSection, string> = {
  red_flags: "Banderas rojas",
  core: "Tu dedo",
  movement: "Movimiento",
  function: "Actividades y dolor",
  history: "Historial y deporte",
  self_tests: "Autoevaluación (opcional)",
};

export type FingerQuestionDef = {
  id: keyof FingerAdaptiveAnswers;
  section: FingerQuestionSection;
  label: string;
  type: "single" | "multi" | "text" | "slider" | "finger_map";
  options?: readonly string[];
  required?: boolean;
  showIf?: (a: FingerAdaptiveAnswers) => boolean;
  min?: number;
  max?: number;
};

export const FINGER_INTRO =
  "¡Hola! Voy a hacerte unas preguntas para entender mejor qué le pasa a tu dedo. Cuanto más detalle des, más precisa podrá ser la orientación.";

export const FINGER_QUESTIONS: FingerQuestionDef[] = [
  {
    id: "rf_dedo_frio_palido",
    section: "red_flags",
    label: "¿El dedo está frío o pálido?",
    type: "single",
    options: YES_NO,
    required: true,
  },
  {
    id: "rf_herida_abierta",
    section: "red_flags",
    label: "¿Hay una herida abierta?",
    type: "single",
    options: YES_NO,
    required: true,
  },
  {
    id: "rf_no_movimiento_total",
    section: "red_flags",
    label: "¿No puedes moverlo en absoluto?",
    type: "single",
    options: YES_NO,
    required: true,
  },
  {
    id: "rf_lesion_grave",
    section: "red_flags",
    label: "¿Hubo una lesión importante (caída fuerte, aplastamiento, amputación parcial o hueso expuesto, etc.)?",
    type: "single",
    options: YES_NO,
    required: true,
  },
  {
    id: "rf_fiebre_infeccion",
    section: "red_flags",
    label: "¿Tienes fiebre o signos de infección?",
    type: "single",
    options: YES_NO,
    required: true,
  },
  {
    id: "rf_sangrado_severo",
    section: "red_flags",
    label: "¿Hay sangrado severo?",
    type: "single",
    options: YES_NO,
    required: true,
  },
  {
    id: "rf_luxacion_sospecha",
    section: "red_flags",
    label: "¿Crees que puede estar dislocado o fuera de sitio?",
    type: "single",
    options: YES_NO,
    required: true,
  },

  {
    id: "dedo_afectado",
    section: "core",
    label: "¿Qué dedo te molesta?",
    type: "single",
    options: FINGER_OPTIONS,
    required: true,
  },
  {
    id: "mano",
    section: "core",
    label: "¿Qué mano está afectada?",
    type: "single",
    options: HAND_OPTIONS,
    required: true,
  },
  {
    id: "localizacion_dedo",
    section: "core",
    label: "¿Dónde sientes el dolor con más intensidad? (puedes marcar varias zonas)",
    type: "finger_map",
    options: FINGER_LOCATION_OPTIONS,
    required: true,
  },
  {
    id: "dolor_familiar",
    section: "core",
    label:
      "¿Es el mismo dolor u hormigueo que notas al agarrar, pellizcar, usar el móvil o al despertar de noche?",
    type: "single",
    options: ["Sí, es el mismo", "No, es otra molestia", "No estoy seguro"],
    required: true,
  },
  {
    id: "cuando_empezo",
    section: "core",
    label: "¿Cuándo empezaron los síntomas?",
    type: "single",
    options: FINGER_WHEN_STARTED,
    required: true,
  },
  {
    id: "como_empezo",
    section: "core",
    label: "¿Qué estabas haciendo cuando empezó?",
    type: "single",
    options: FINGER_HOW_STARTED,
    required: true,
  },
  {
    id: "detalle_otro",
    section: "core",
    label: "Cuéntanos qué ocurrió",
    type: "text",
    required: true,
    showIf: (a) => a.como_empezo === "Otro",
  },
  {
    id: "intensidad_dolor",
    section: "core",
    label: "Intensidad del dolor ahora (0–10)",
    type: "slider",
    required: true,
    min: 0,
    max: 10,
  },
  {
    id: "naturaleza_dolor",
    section: "core",
    label: "¿Cómo describirías el dolor? (puedes elegir varios)",
    type: "multi",
    options: FINGER_PAIN_NATURE,
    required: true,
  },
  {
    id: "hinchazon",
    section: "core",
    label: "¿Hay hinchazón?",
    type: "single",
    options: FINGER_SWELLING,
    required: true,
  },  {
    id: "deformidad_visible",
    section: "core",
    label: "¿El dedo se ve doblado o diferente a lo normal?",
    type: "single",
    options: YES_NO,
    required: true,
  },

  {
    id: "flexion_completa",
    section: "movement",
    label: "¿Puedes doblar el dedo por completo?",
    type: "single",
    options: MOVEMENT_ABILITY,
    required: true,
  },
  {
    id: "extension_completa",
    section: "movement",
    label: "¿Puedes estirarlo por completo?",
    type: "single",
    options: MOVEMENT_ABILITY,
    required: true,
  },
  {
    id: "bloqueo",
    section: "movement",
    label: "¿Se queda trabado o bloqueado al moverlo?",
    type: "single",
    options: FINGER_LOCKING,
    required: true,
  },
  {
    id: "chasquido",
    section: "movement",
    label: "¿Notas chasquidos al mover el dedo?",
    type: "single",
    options: YES_NO,
    required: true,
  },

  {
    id: "dolor_agarrar",
    section: "function",
    label: "¿Duele al agarrar objetos (botella, taza, bolsas)?",
    type: "single",
    options: YES_NO,
    required: true,
  },
  {
    id: "dolor_pinza",
    section: "function",
    label: "¿Duele al pellizcar entre pulgar y dedo?",
    type: "single",
    options: YES_NO,
    required: true,
  },
  {
    id: "movimientos_empeoran",
    section: "function",
    label: "¿Qué movimientos lo empeoran? (puedes marcar varias)",
    type: "multi",
    options: FINGER_AGGRAVATING,
    required: true,
  },
  {
    id: "dolor_reposo",
    section: "function",
    label: "¿Duele aunque no lo muevas?",
    type: "single",
    options: FINGER_REST_PAIN,
    required: true,
  },
  {
    id: "dolor_noche",
    section: "function",
    label: "¿Te despierta por la noche?",
    type: "single",
    options: YES_NO,
    required: true,
    showIf: (a) => shouldShowSleepDependentQuestion("dolor_noche", a.cuando_empezo),
  },
  {
    id: "rigidez",
    section: "function",
    label: "¿Sientes rigidez en el dedo?",
    type: "single",
    options: FINGER_STIFFNESS,
    required: true,
  },

  {
    id: "lesion_previa",
    section: "history",
    label: "¿Te habías lesionado este dedo antes?",
    type: "single",
    options: FINGER_PREVIOUS_INJURY,
    required: true,
  },
  {
    id: "deportes",
    section: "history",
    label: "¿Practicas habitualmente alguno de estos deportes?",
    type: "multi",
    options: FINGER_SPORTS,
    required: true,
  },
  {
    id: "limitaciones_funcionales",
    section: "history",
    label: "¿Qué actividades se te hacen difíciles?",
    type: "multi",
    options: FINGER_FUNCTIONAL_LIMITS,
    required: true,
  },
  {
    id: "entumecimiento",
    section: "history",
    label: "¿Notas entumecimiento u hormigueo en algún dedo?",
    type: "single",
    options: FINGER_NUMBNESS,
    required: true,
  },

  {
    id: "test_puno_completo",
    section: "self_tests",
    label: "Autoevaluación — ¿Puedes hacer un puño cerrando todos los dedos?",
    type: "single",
    options: FINGER_SELF_TEST,
    required: true,
  },  {
    id: "test_pinza_papel",
    section: "self_tests",
    label: "¿Pellizcar un papel entre pulgar y dedo es doloroso o difícil?",
    type: "single",
    options: FINGER_SELF_TEST,
    required: true,
  },  {
    id: "test_estabilidad_lateral",
    section: "self_tests",
    label: "Al mover el dedo de lado a lado, ¿se siente inestable o demasiado suelto?",
    type: "single",
    options: FINGER_SELF_TEST,
    required: true,
  },
];

function isThumbAffected(answers: FingerAdaptiveAnswers): boolean {
  return answers.dedo_afectado === "Pulgar";
}

function thumbAwareLabel(id: keyof FingerAdaptiveAnswers, defaultLabel: string, thumb: boolean): string {
  if (!thumb) return defaultLabel;
  if (id === "dolor_pinza") {
    return "¿Duele al pellizcar con el pulgar y el índice?";
  }
  if (id === "test_pinza_papel") {
    return "¿Pellizcar un papel entre el pulgar y el índice es doloroso o difícil?";
  }
  if (id === "test_estabilidad_lateral") {
    return "Al abrir el pulgar hacia fuera (como al agarrar una jarra), ¿duele o se siente inestable en la base?";
  }
  return defaultLabel;
}

export function detectFingerRedFlags(answers: FingerAdaptiveAnswers): {
  urgent: boolean;
  triggered: string[];
} {
  const triggered: string[] = [];
  const pairs: Array<[keyof FingerAdaptiveAnswers, string]> = [
    ["rf_dedo_frio_palido", "dedo frío o pálido"],
    ["rf_herida_abierta", "herida abierta"],
    ["rf_no_movimiento_total", "incapacidad total de movimiento"],
    ["rf_lesion_grave", "lesión grave"],
    ["rf_fiebre_infeccion", "fiebre o signos de infección"],
    ["rf_sangrado_severo", "sangrado severo"],
    ["rf_luxacion_sospecha", "posible luxación"],
  ];
  for (const [k, label] of pairs) {
    if (answers[k] === "Sí") triggered.push(label);
  }
  if (answers.deformidad_visible === "Sí") {
    triggered.push("deformidad visible del dedo");
  }
  return { urgent: triggered.length > 0, triggered };
}

export function getVisibleFingerQuestions(answers: FingerAdaptiveAnswers): FingerQuestionDef[] {
  const thumb = isThumbAffected(answers);
  return FINGER_QUESTIONS.filter((q) => !q.showIf || q.showIf(answers)).map((q) => {
    let next: FingerQuestionDef = {
      ...q,
      label: thumbAwareLabel(q.id, q.label, thumb),
    };
    if (next.options?.length) {
      const filtered = filterSleepDependentOptions(next.options, answers.cuando_empezo);
      if (filtered.length !== next.options.length) {
        next = { ...next, options: filtered };
      }
    }
    return next;
  });
}

export function getVisibleFingerSections(answers: FingerAdaptiveAnswers): FingerQuestionSection[] {
  const sections: FingerQuestionSection[] = [
    "red_flags",
    "core",
    "movement",
    "function",
    "history",
  ];
  if (!detectFingerRedFlags(answers).urgent) {
    sections.push("self_tests");
  }
  return sections;
}

function isAnswered(q: FingerQuestionDef, answers: FingerAdaptiveAnswers): boolean {
  const v = answers[q.id];
  if (q.type === "slider") return typeof v === "number";
  if (q.type === "multi" || q.type === "finger_map") return Array.isArray(v) && v.length > 0;
  return typeof v === "string" ? v.trim().length > 0 : false;
}

export function validateFingerSection(
  section: FingerQuestionSection,
  answers: FingerAdaptiveAnswers
): AdaptiveValidationIssue | null {
  const questions = getVisibleFingerQuestions(answers).filter((q) => q.section === section);
  for (const q of questions) {
    if (q.required && !isAnswered(q, answers)) {
      return missingQuestionIssue(q);
    }
  }
  return null;
}

export function validateFingerAdaptive(answers: FingerAdaptiveAnswers): AdaptiveValidationIssue | null {
  for (const section of getVisibleFingerSections(answers)) {
    const err = validateFingerSection(section, answers);
    if (err) return err;
  }
  return null;
}

function fmtList(items: string[]): string {
  return items.length ? items.join(", ") : "—";
}

export function formatFingerAdaptive(answers: FingerAdaptiveAnswers, introText?: string): string {
  const { urgent, triggered } = detectFingerRedFlags(answers);
  const header = "Cuestionario adaptativo — Dedos";
  const redFlagLine = urgent
    ? `Banderas rojas: **SÍ** (${triggered.join(", ")})`
    : "Banderas rojas: No detectadas";

  const mechanismBlock = [
    "— MECANISMO DE LA LESIÓN (prioridad máxima — citar exactamente en el resumen) —",
    `Origen según cuestionario: ${answers.como_empezo || "—"}${answers.detalle_otro ? ` — ${answers.detalle_otro}` : ""}`,
    "NO sustituir por el deporte habitual del perfil del paciente.",
  ].join("\n");

  const core = [
    `Dedo(s): ${answers.dedo_afectado || "—"}`,
    `Mano: ${answers.mano || "—"}`,
    `Localización del dolor: ${fmtList(answers.localizacion_dedo)}`,
    `Dolor familiar (agarre/pellizcar/noche): ${answers.dolor_familiar || "—"}`,
    `Inicio temporal: ${answers.cuando_empezo || "—"}`,
    `Mecanismo: ${answers.como_empezo || "—"}`,
    `Dolor actual: ${answers.intensidad_dolor}/10`,
    `Naturaleza del dolor: ${fmtList(answers.naturaleza_dolor)}`,
    `Hinchazón: ${answers.hinchazon || "—"}`,
    `Deformidad visible: ${answers.deformidad_visible || "—"}`,
  ].join("\n");

  const movement = [
    `Flexión completa: ${answers.flexion_completa || "—"}`,
    `Extensión completa: ${answers.extension_completa || "—"}`,
    `Bloqueo: ${answers.bloqueo || "—"}`,
    `Chasquidos: ${answers.chasquido || "—"}`,
  ].join("\n");

  const func = [
    `Dolor al agarrar: ${answers.dolor_agarrar || "—"}`,
    `Dolor al pellizcar: ${answers.dolor_pinza || "—"}`,
    `Movimientos que empeoran: ${fmtList(answers.movimientos_empeoran)}`,
    `Dolor en reposo: ${answers.dolor_reposo || "—"}`,
    `Dolor nocturno: ${answers.dolor_noche || "—"}`,
    `Rigidez: ${answers.rigidez || "—"}`,
  ].join("\n");

  const history = [
    `Lesiones previas: ${answers.lesion_previa || "—"}`,
    `Deportes: ${fmtList(answers.deportes)}`,
    `Limitaciones funcionales: ${fmtList(answers.limitaciones_funcionales)}`,
    `Entumecimiento: ${answers.entumecimiento || "—"}`,
  ].join("\n");

  const selfTests = getVisibleFingerSections(answers).includes("self_tests")
    ? [
        "",
        "Autoevaluación:",
        `- Puño completo: ${answers.test_puno_completo || "—"}`,
        `- Pinza papel: ${answers.test_pinza_papel || "—"}`,
        `- Estabilidad lateral: ${answers.test_estabilidad_lateral || "—"}`,
      ]
        .filter(Boolean)
        .join("\n")
    : "";

  const isThumb = isThumbAffected(answers);
  const differentialHint = [
    "",
    "Orientación clínica (considerar en el informe, sin diagnosticar):",
    "- Dolor/inestabilidad en el lado del dedo tras torsión → esguince del ligamento colateral.",
    "- Hiperextensión forzada de la articulación media (IFP) → lesión de la placa volar.",
    "- Incapacidad para extender la articulación media (IFP), dedo caído en flexión → deformidad en ojal (boutonnière), lesión del tendón extensor central.",
    "- Incapacidad para flexionar la punta del dedo tras agarrar la ropa de un rival (deportes de contacto) → jersey finger (avulsión del tendón flexor profundo).",
    "- Incapacidad para extender la punta del dedo (articulación distal/IFD) tras impacto → dedo en martillo (mallet finger).",
    "- Bloqueo o chasquido al flexionar/extender, dedo que se queda \"enganchado\" → dedo en resorte (trigger finger).",
    "- Dolor localizado, deformidad o hinchazón tras traumatismo directo → fractura de falange.",
    isThumb
      ? "- Dolor en la base del pulgar tras traumatismo axial (puñetazo, caída) → fractura de Bennett o Rolando (base del primer metacarpiano)."
      : "",
    "- Se ve torcido, deformado o muy distinto con incapacidad de movimiento tras traumatismo → luxación interfalángica.",
    isThumb
      ? "- Inestabilidad al pinzar o forzar en valgo el pulgar tras caída con esquís/bastón o similar → lesión del ligamento colateral cubital del pulgar (UCL, \"pulgar del esquiador\")."
      : "",
    "- Inicio progresivo, rigidez y dolor en articulaciones, especialmente en mayores → artrosis (OA).",
    "- Dolor difuso a lo largo del tendón flexor, hinchazón en toda la cara palmar del dedo, dolor con la extensión pasiva → tenosinovitis flexora (valorar origen infeccioso si hay fiebre/eritema).",
  ]
    .filter(Boolean)
    .join("\n");

  return [
    header,
    redFlagLine,
    introText ? `\nDescripción inicial:\n${introText}` : "",
    "",
    mechanismBlock,
    "",
    "Datos del cuestionario:",
    core,
    "",
    "Movimiento:",
    movement,
    "",
    "Función y dolor:",
    func,
    "",
    "Historial:",
    history,
    selfTests,
    differentialHint,
  ]
    .filter(Boolean)
    .join("\n");
}

export const FINGER_LABEL_EN: Partial<Record<string, string>> = {
  rf_dedo_frio_palido: "Is the finger cold or pale?",
  rf_herida_abierta: "Is there an open wound?",
  rf_no_movimiento_total: "Can't you move it at all?",
  rf_lesion_grave: "Was there a significant injury (hard fall, crush, partial amputation, or exposed bone, etc.)?",
  rf_fiebre_infeccion: "Do you have fever or signs of infection?",
  rf_sangrado_severo: "Is there severe bleeding?",
  rf_luxacion_sospecha: "Do you think it may be dislocated or out of place?",
  dedo_afectado: "Which finger is bothering you?",
  mano: "Which hand is affected?",
  localizacion_dedo: "Where do you feel the pain most intensely? (you can select several areas)",
  dolor_familiar:
    "Is it the same pain or tingling you notice when gripping, pinching, using your phone, or waking at night?",
  cuando_empezo: "When did the symptoms start?",
  como_empezo: "What were you doing when it started?",
  detalle_otro: "Tell us what happened",
  intensidad_dolor: "Pain intensity now (0–10)",
  naturaleza_dolor: "How would you describe the pain? (you can select several)",
  hinchazon: "Is there swelling?",
  deformidad_visible: "Does the finger look bent or different from normal?",
  flexion_completa: "Can you bend the finger fully?",
  extension_completa: "Can you straighten it fully?",
  bloqueo: "Does it get stuck or lock when you move it?",
  chasquido: "Do you notice clicking when moving the finger?",
  dolor_agarrar: "Does it hurt when gripping objects (bottle, cup, bags)?",
  dolor_pinza: "Does it hurt when pinching between thumb and finger?",
  movimientos_empeoran: "Which movements make it worse? (you can select several)",
  dolor_reposo: "Does it hurt even when you are not moving it?",
  dolor_noche: "Does it wake you at night?",
  rigidez: "Do you feel stiffness in the finger?",
  lesion_previa: "Had you injured this finger before?",
  deportes: "Do you regularly play any of these sports?",
  limitaciones_funcionales: "Which activities are difficult for you?",
  entumecimiento: "Do you notice numbness or tingling in any finger?",
  test_puno_completo: "Self-check — Can you make a fist closing all fingers?",
  test_pinza_papel: "Is pinching a sheet of paper between thumb and finger painful or difficult?",
  test_estabilidad_lateral: "When moving the finger side to side, does it feel unstable or too loose?",
};

export const FINGER_OPTION_EN: Record<string, string> = {
  No: "No",
  Sí: "Yes",
  "No estoy seguro": "I'm not sure",
  "No, es distinto o solo duele en ciertos gestos": "No, it's different or only hurts with certain movements",
  "No, es otra molestia": "No, it's a different problem",
  "Sí, es el mismo": "Yes, it's the same",
  Pulgar: "Thumb",
  Índice: "Index",
  Medio: "Middle",
  Anular: "Ring",
  Meñique: "Little finger",
  "Varios dedos": "Several fingers",
  Derecha: "Right",
  Izquierda: "Left",
  Ambas: "Both",
  "Punta del dedo": "Fingertip",
  "Articulación cerca de la punta del dedo": "Joint near the fingertip",
  "Articulación del medio del dedo": "Middle finger joint",
  "Nudillo (unión del dedo con la mano)": "Knuckle (where finger meets hand)",
  "Parte de la palma": "Palm side (inside)",
  "Parte de atrás del dedo": "Back of the finger (dorsal)",
  "Lado del dedo": "Side of the finger",
  "Todo el dedo": "Whole finger",
  "Ha sido ahora": "Just now",
  "Reciente (1-4 horas)": "Recent (1–4 hours)",
  Hoy: "Today",
  "Últimos días": "Last few days",
  "Hace 1–2 semanas": "1–2 weeks ago",
  "Hace más de un mes": "More than a month ago",
  "No lo recuerdo": "I don't remember",
  Deporte: "Sport",
  Caída: "Fall",
  "Dedo doblado hacia atrás": "Finger bent backwards",
  "Dedo golpeado por balón": "Finger hit by a ball",
  "Lesión por torsión": "Twisting injury",
  "Corte o herida": "Cut or wound",
  "Trabajo repetitivo": "Repetitive work",
  Pesas: "Weights",
  "Sin causa clara": "No clear cause",
  Otro: "Other",
  Agudo: "Sharp/acute",
  Sordo: "Dull",
  Latido: "Throbbing",
  Quemazón: "Burning",
  Pulsátil: "Pulsating",
  Punzante: "Stabbing",
  Hormigueo: "Tingling",
  Entumecimiento: "Numbness",
  Leve: "Mild",
  Moderada: "Moderate",
  "Muy hinchado": "Very swollen",
  Casi: "Almost",
  Nunca: "Never",
  Ocasionalmente: "Occasionally",
  Frecuentemente: "Frequently",
  "A veces": "Sometimes",
  Constantemente: "Constantly",
  "Solo por la mañana": "Only in the morning",
  "Todo el día": "All day",
  "Tras actividad": "After activity",
  "Sí, una vez": "Yes, once",
  "Sí, varias veces": "Yes, several times",
  Baloncesto: "Basketball",
  Voleibol: "Volleyball",
  Escalada: "Climbing",
  Tenis: "Tennis",
  "Artes marciales": "Martial arts",
  Gimnasia: "Gymnastics",
  "Abrochar botones": "Buttoning buttons",
  Escribir: "Writing",
  Teclear: "Typing",
  Cubiertos: "Using cutlery",
  "Cargar bolsas": "Carrying bags",
  "Abrir tarros": "Opening jars",
  "Tocar instrumento": "Playing an instrument",
  Ninguna: "None",
  Doblar: "Bending",
  Estirar: "Straightening",
  Agarrar: "Gripping",
  Pellizcar: "Pinching",
  "Nada específico": "Nothing specific",
  "No lo he probado": "I haven't tried",
};

export const FINGER_SECTION_LABELS_EN: Record<string, string> = {
  red_flags: "Red flags",
  core: "Your finger",
  movement: "Movement",
  function: "Activities and pain",
  history: "History and sport",
  self_tests: "Self-assessment (optional)",
};

export type ConsultLocale = "es" | "en";
export function localizeFingerLabel(id: string, fallback: string, locale: ConsultLocale): string {
  if (locale !== "en") return fallback;
  const thumbRemapEn: Record<string, string> = {
    "¿Duele al pellizcar con el pulgar y el índice?":
      "Does it hurt when pinching with the thumb and index finger?",
    "¿Pellizcar un papel entre el pulgar y el índice es doloroso o difícil?":
      "Is pinching a sheet of paper between the thumb and index finger painful or difficult?",
    "Al abrir el pulgar hacia fuera (como al agarrar una jarra), ¿duele o se siente inestable en la base?":
      "When opening the thumb outward (as if gripping a jar), does it hurt or feel unstable at the base?",
  };
  if (thumbRemapEn[fallback]) return thumbRemapEn[fallback];
  return FINGER_LABEL_EN[id] ?? fallback;
}
export function localizeFingerOption(option: string, locale: ConsultLocale): string {
  if (locale !== "en") return option;
  return FINGER_OPTION_EN[option] ?? option;
}
export function localizeFingerSection(section: string, locale: ConsultLocale): string {
  if (locale !== "en") return (FINGER_SECTION_LABELS as any)[section] ?? section;
  return FINGER_SECTION_LABELS_EN[section] ?? (FINGER_SECTION_LABELS as any)[section] ?? section;
}

