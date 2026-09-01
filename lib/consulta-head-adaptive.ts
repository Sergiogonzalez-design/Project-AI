import {
  filterSleepDependentOptions,
  shouldShowSleepDependentQuestion,
} from "@/lib/consulta-timing";
import { missingQuestionIssue, type AdaptiveValidationIssue } from "@/lib/consulta-validation";

/**
 * Adaptive questionnaire for head / headache — separate from neck so multi-part
 * flows (e.g. cabeza + cuello) can evaluate each zone alone, then connect later.
 */

export const YES_NO = ["No", "Sí"] as const;

export const EVOLUTION_OPTIONS = [
  "Ha sido ahora",
  "Reciente (1-4 horas)",
  "Menos de 48 horas",
  "Entre 2 y 7 días",
  "Entre 1 y 4 semanas",
  "Más de 1 mes",
] as const;

export const ONSET_FORM_OPTIONS = ["Repentino", "Poco a poco"] as const;

export const MECHANISM_OPTIONS = [
  "Golpe fuerte en la cabeza",
  "Estrés o tensión",
  "Tras pantallas / esfuerzo visual",
  "Relacionado con el cuello o postura",
  "Sin causa clara",
  "Otro",
] as const;

export const HEAD_LOCATION_OPTIONS = [
  "Frente / sienes",
  "Un solo lado de la cabeza",
  "Ambos lados",
  "Parte posterior / nuca",
  "Detrás de un ojo",
  "Toda la cabeza",
  "No estoy seguro",
] as const;

export const PAIN_TYPE_OPTIONS = [
  "Punzante",
  "Pulsátil / latido",
  "Presión / peso",
  "Quemazón",
  "Malestar difuso",
] as const;

export const FUNCTIONAL_LIMIT_OPTIONS = [
  "Ninguna",
  "Leve",
  "Moderada",
  "Severa",
  "No puedo hacer casi nada",
] as const;

export const ASSOCIATED_SYMPTOM_OPTIONS = [
  "Náuseas o vómitos",
  "Sensibilidad a la luz",
  "Sensibilidad al ruido",
  "Visión borrosa o destellos",
  "Dolor o rigidez de cuello",
  "Mareo",
  "Ninguno",
] as const;

export type HeadQuestionSection = "red_flags" | "core" | "neck_link" | "history";

export type HeadAdaptiveAnswers = {
  evolucion: string;
  rf_peor_dolor: string;
  rf_neuro: string;
  rf_trauma: string;
  rf_fiebre_rigidez: string;
  rf_vomitos_progresivos: string;
  rf_dolor_nocturno_sistemico: string;
  inicio: string;
  mecanismo: string[];
  mecanismo_otro: string;
  intensidad_dolor: number;
  localizacion_cabeza: string[];
  dolor_familiar: string;
  tipo_dolor: string[];
  limitacion_funcional: string[];
  sintomas_asociados: string[];
  cuello_relacion: string;
  cuello_empeora: string;
  lesion_previa: string;
  lesion_previa_detalle: string;
};

export function defaultHeadAdaptiveAnswers(): HeadAdaptiveAnswers {
  return {
    evolucion: "",
    rf_peor_dolor: "",
    rf_neuro: "",
    rf_trauma: "",
    rf_fiebre_rigidez: "",
    rf_vomitos_progresivos: "",
    rf_dolor_nocturno_sistemico: "",
    inicio: "",
    mecanismo: [],
    mecanismo_otro: "",
    intensidad_dolor: 5,
    localizacion_cabeza: [],
    dolor_familiar: "",
    tipo_dolor: [],
    limitacion_funcional: [],
    sintomas_asociados: [],
    cuello_relacion: "",
    cuello_empeora: "",
    lesion_previa: "",
    lesion_previa_detalle: "",
  };
}

export type HeadQuestionDef = {
  id: keyof HeadAdaptiveAnswers;
  section: HeadQuestionSection;
  label: string;
  type: "single" | "multi" | "slider" | "text";
  options?: readonly string[];
  required?: boolean;
  showIf?: (a: HeadAdaptiveAnswers) => boolean;
};

function hasNeckLink(a: HeadAdaptiveAnswers): boolean {
  return (
    a.sintomas_asociados.includes("Dolor o rigidez de cuello") ||
    a.mecanismo.includes("Relacionado con el cuello o postura")
  );
}

export const HEAD_QUESTIONS: HeadQuestionDef[] = [
  {
    id: "evolucion",
    section: "red_flags",
    label: "¿Cuánto tiempo llevas con este dolor de cabeza?",
    type: "single",
    options: EVOLUTION_OPTIONS,
    required: true,
  },
  {
    id: "rf_peor_dolor",
    section: "red_flags",
    label:
      "¿Es el peor dolor de cabeza de tu vida, o empezó de golpe y es muy distinto a lo habitual?",
    type: "single",
    options: YES_NO,
    required: true,
  },
  {
    id: "rf_neuro",
    section: "red_flags",
    label:
      "¿Visión doble, debilidad en un lado del cuerpo, dificultad para hablar, o confusión marcada?",
    type: "single",
    options: YES_NO,
    required: true,
  },
  {
    id: "rf_trauma",
    section: "red_flags",
    label: "¿Hubo un golpe fuerte en la cabeza recientemente?",
    type: "single",
    options: YES_NO,
    required: true,
  },
  {
    id: "rf_fiebre_rigidez",
    section: "red_flags",
    label: "¿Fiebre con rigidez intensa del cuello o malestar general muy fuerte?",
    type: "single",
    options: YES_NO,
    required: true,
  },
  {
    id: "rf_vomitos_progresivos",
    section: "red_flags",
    label: "¿Vómitos repetidos que empeoran, o dolor que aumenta al tumbarte o al toser?",
    type: "single",
    options: YES_NO,
    required: true,
  },  {
    id: "rf_dolor_nocturno_sistemico",
    section: "red_flags",
    label: "¿Dolor nocturno constante que no mejora con reposo, con pérdida de peso no explicada?",
    type: "single",
    options: YES_NO,
    required: true,
    showIf: (a) => shouldShowSleepDependentQuestion("rf_dolor_nocturno_sistemico", a.evolucion),
  },

  {
    id: "inicio",
    section: "core",
    label: "¿Cómo fue el inicio?",
    type: "single",
    options: ONSET_FORM_OPTIONS,
    required: true,
  },
  {
    id: "mecanismo",
    section: "core",
    label: "¿Qué pudo provocarlo? (puedes marcar varias)",
    type: "multi",
    options: MECHANISM_OPTIONS,
    required: true,
  },
  {
    id: "mecanismo_otro",
    section: "core",
    label: "Cuéntanos qué pasó o cómo empezó",
    type: "text",
    required: true,
    showIf: (a) => a.mecanismo.includes("Otro"),
  },
  {
    id: "intensidad_dolor",
    section: "core",
    label: "Intensidad del dolor (1–10)",
    type: "slider",
    required: true,
  },
  {
    id: "localizacion_cabeza",
    section: "core",
    label: "¿Dónde sientes el dolor en la cabeza? (puedes marcar varias)",
    type: "multi",
    options: HEAD_LOCATION_OPTIONS,
    required: true,
  },
  {
    id: "dolor_familiar",
    section: "core",
    label:
      "¿Es el mismo dolor de cabeza que notas ahora, al mover el cuello, con la luz o en tu patrón habitual?",
    type: "single",
    options: ["Sí, es el mismo", "No, es otra molestia", "No estoy seguro"],
    required: true,
  },
  {
    id: "tipo_dolor",
    section: "core",
    label: "¿Cómo describirías el dolor?",
    type: "multi",
    options: PAIN_TYPE_OPTIONS,
    required: true,
  },  {
    id: "limitacion_funcional",
    section: "core",
    label: "¿Cuánto te limita en tu día a día? (puedes marcar varias)",
    type: "multi",
    options: FUNCTIONAL_LIMIT_OPTIONS,
    required: true,
  },
  {
    id: "sintomas_asociados",
    section: "core",
    label: "¿Qué otros síntomas notas?",
    type: "multi",
    options: ASSOCIATED_SYMPTOM_OPTIONS,
    required: true,
  },

  {
    id: "cuello_relacion",
    section: "neck_link",
    label: "¿Notas también dolor, rigidez o tensión en el cuello?",
    type: "single",
    options: YES_NO,
    required: true,
    showIf: hasNeckLink,
  },
  {
    id: "cuello_empeora",
    section: "neck_link",
    label: "¿Al girar o inclinar el cuello empeora el dolor de cabeza?",
    type: "single",
    options: YES_NO,
    required: true,
    showIf: (a) => hasNeckLink(a) || a.cuello_relacion === "Sí",
  },

  {
    id: "lesion_previa",
    section: "history",
    label: "¿Has tenido dolores de cabeza o migrañas similares antes?",
    type: "single",
    options: YES_NO,
    required: true,
  },
  {
    id: "lesion_previa_detalle",
    section: "history",
    label: "Describe episodios previos o diagnósticos que te hayan dicho",
    type: "text",
    required: true,
    showIf: (a) => a.lesion_previa === "Sí",
  },];

export const HEAD_SECTION_LABELS: Record<HeadQuestionSection, string> = {
  red_flags: "Comprobación de urgencia",
  core: "Caracterización del problema",
  neck_link: "Relación con el cuello",
  history: "Antecedentes",
};

export const HEAD_SECTION_ORDER: HeadQuestionSection[] = [
  "red_flags",
  "core",
  "neck_link",
  "history",
];

export function getVisibleHeadQuestions(answers: HeadAdaptiveAnswers): HeadQuestionDef[] {
  return HEAD_QUESTIONS.filter((q) => !q.showIf || q.showIf(answers)).map((q) => {
    if (!q.options?.length) return q;
    const filtered = filterSleepDependentOptions(q.options, answers.evolucion);
    if (filtered.length === q.options.length) return q;
    return { ...q, options: filtered };
  });
}

export function getVisibleHeadSections(answers: HeadAdaptiveAnswers): HeadQuestionSection[] {
  const visible = getVisibleHeadQuestions(answers);
  return HEAD_SECTION_ORDER.filter((s) => visible.some((q) => q.section === s));
}

const RED_FLAG_IDS: (keyof HeadAdaptiveAnswers)[] = [
  "rf_peor_dolor",
  "rf_neuro",
  "rf_trauma",
  "rf_fiebre_rigidez",
  "rf_vomitos_progresivos",
  "rf_dolor_nocturno_sistemico",
];

export function detectHeadRedFlags(answers: HeadAdaptiveAnswers): {
  urgent: boolean;
  triggered: string[];
} {
  const labels: Record<string, string> = {
    rf_peor_dolor: "Peor dolor de cabeza / inicio súbito distinto",
    rf_neuro: "Síntomas neurológicos (visión, habla, debilidad, confusión)",
    rf_trauma: "Golpe fuerte en la cabeza reciente",
    rf_fiebre_rigidez: "Fiebre con rigidez de cuello",
    rf_vomitos_progresivos: "Vómitos progresivos / empeora al tumbarse o toser",
    rf_dolor_nocturno_sistemico: "Dolor nocturno sistémico con pérdida de peso",
  };
  const triggered: string[] = [];
  for (const id of RED_FLAG_IDS) {
    if (answers[id] === "Sí") triggered.push(labels[id] ?? id);
  }
  return { urgent: triggered.length > 0, triggered };
}

function isAnswered(q: HeadQuestionDef, answers: HeadAdaptiveAnswers): boolean {
  const val = answers[q.id];
  if (q.type === "multi") return Array.isArray(val) && val.length > 0;
  if (q.type === "slider") return typeof val === "number" && val >= 1;
  if (q.type === "text") return typeof val === "string" && val.trim().length > 0;
  return typeof val === "string" && val.length > 0;
}

export function validateHeadAdaptive(answers: HeadAdaptiveAnswers): AdaptiveValidationIssue | null {
  const visible = getVisibleHeadQuestions(answers);
  for (const q of visible) {
    if (q.required !== false && !isAnswered(q, answers)) {
      return missingQuestionIssue(q);
    }
  }
  return null;
}

export function validateHeadSection(
  section: HeadQuestionSection,
  answers: HeadAdaptiveAnswers
): AdaptiveValidationIssue | null {
  const questions = getVisibleHeadQuestions(answers).filter((q) => q.section === section);
  for (const q of questions) {
    if (q.required !== false && !isAnswered(q, answers)) {
      return missingQuestionIssue(q);
    }
  }
  return null;
}

function formatMulti(arr: string[]): string {
  return arr.length ? arr.join(", ") : "No especificado";
}

export function formatHeadAdaptive(answers: HeadAdaptiveAnswers, bodyMapText: string): string {
  const { urgent, triggered } = detectHeadRedFlags(answers);
  const lines: string[] = [
    "=== CUESTIONARIO ADAPTATIVO — CABEZA / CEFALEA ===",
    "",
    "IMPORTANTE: Evalúa SOLO el dolor de cabeza ahora. Si también hay cuello, ese cuestionario es aparte; no mezcles hallazgos.",
    bodyMapText,
    "",
    "— MECANISMO (prioridad máxima — citar exactamente en el resumen) —",
    `Mecanismo según cuestionario: ${answers.mecanismo.join(", ")}${
      answers.mecanismo.includes("Otro") && answers.mecanismo_otro
        ? ` (${answers.mecanismo_otro})`
        : ""
    }`,
    "",
    "— BANDERAS ROJAS —",
    urgent
      ? `⚠️ URGENCIA DETECTADA: ${triggered.join("; ")}`
      : "Ninguna bandera roja marcada como Sí",
    `Peor dolor / súbito distinto: ${answers.rf_peor_dolor || "—"}`,
    `Síntomas neurológicos: ${answers.rf_neuro || "—"}`,
    `Trauma craneal: ${answers.rf_trauma || "—"}`,
    `Fiebre/rigidez cuello: ${answers.rf_fiebre_rigidez || "—"}`,
    `Vómitos progresivos: ${answers.rf_vomitos_progresivos || "—"}`,
    `Dolor nocturno sistémico: ${answers.rf_dolor_nocturno_sistemico || "—"}`,
    "",
    "— VARIABLES CLÍNICAS —",
    `Tiempo de evolución: ${answers.evolucion}`,
    `Forma de inicio: ${answers.inicio}`,
    `Intensidad dolor: ${answers.intensidad_dolor}/10`,
    `Localización: ${formatMulti(answers.localizacion_cabeza)}`,
    `Dolor familiar (cuello/luz/patrón): ${answers.dolor_familiar || "—"}`,
    `Tipo de dolor: ${formatMulti(answers.tipo_dolor)}`,
    `Limitación funcional: ${answers.limitacion_funcional.join(", ") || "—"}`,
    `Síntomas asociados: ${formatMulti(answers.sintomas_asociados)}`,
  ];

  if (answers.cuello_relacion || answers.cuello_empeora) {
    lines.push(
      "",
      "— RELACIÓN CON CUELLO —",
      `Dolor/rigidez de cuello: ${answers.cuello_relacion || "—"}`,
      `Cuello empeora la cefalea: ${answers.cuello_empeora || "—"}`
    );
  }

  lines.push(
    "",
    "— ANTECEDENTES —",
    `Episodios previos: ${answers.lesion_previa}${
      answers.lesion_previa === "Sí" && answers.lesion_previa_detalle
        ? ` — ${answers.lesion_previa_detalle}`
        : ""
    }`,
    "",
    "ORIENTACIÓN DIFERENCIAL (usar el cuestionario; no inventar datos):",
    "- Cefalea súbita «la peor de la vida» + neuro → urgencias (descartar hemorragia / evento vascular).",
    "- Trauma craneal reciente + vómitos/confusión → valoración médica urgente.",
    "- Fiebre + rigidez de cuello → sospecha infecciosa meníngea → urgencias.",
    "- Pulsátil + náuseas + fotofobia + unilateral → patrón migrañoso orientativo.",
    "- Presión bilateral + pantallas/estrés + tensión cervical → tensión / cervicogénica posible.",
    "- Empieza en nuca y sube con movimiento cervical → valorar vínculo con cuello (sin forzar si no hay datos).",
    "- Si evolución es 'Ha sido ahora' o 'Reciente (1-4 horas)': no uses patrones de dolor nocturno habitual."
  );

  return lines.filter(Boolean).join("\n");
}

export type ConsultLocale = "es" | "en";

export const HEAD_LABEL_EN: Partial<Record<string, string>> = {
  evolucion: "How long have you had this headache?",
  rf_peor_dolor:
    "Is this the worst headache of your life, or did it start suddenly and feel very different from usual?",
  rf_neuro:
    "Double vision, weakness on one side of the body, difficulty speaking, or marked confusion?",
  rf_trauma: "Was there a strong blow to the head recently?",
  rf_fiebre_rigidez: "Fever with intense neck stiffness or very strong general illness?",
  rf_vomitos_progresivos:
    "Repeated vomiting that worsens, or pain that increases when lying down or coughing?",
  rf_dolor_nocturno_sistemico:
    "Constant night pain that doesn't improve with rest, with unexplained weight loss?",
  inicio: "How did it start?",
  mecanismo: "What may have caused it? (you can select several)",
  mecanismo_otro: "Tell us what happened or how it started",
  intensidad_dolor: "Pain intensity (1–10)",
  localizacion_cabeza: "Where do you feel the pain in the head? (you can select several)",
  dolor_familiar:
    "Is it the same headache you feel now, when moving your neck, with light, or in your usual pattern?",
  tipo_dolor: "How would you describe the pain?",
  limitacion_funcional: "How much does it limit you day to day?",
  sintomas_asociados: "What other symptoms do you notice?",
  cuello_relacion: "Do you also notice pain, stiffness, or tension in the neck?",
  cuello_empeora: "Does turning or tilting the neck worsen the headache?",
  lesion_previa: "Have you had similar headaches or migraines before?",
  lesion_previa_detalle: "Describe previous episodes or diagnoses you were told",
};

export const HEAD_OPTION_EN = {
  No: "No",
  Sí: "Yes",
  "No, es distinto o solo duele en ciertos gestos": "No, it's different or only hurts with certain movements",
  "No, es otra molestia": "No, it's a different problem",
  "Sí, es el mismo": "Yes, it's the same",
  "Ha sido ahora": "Just now",
  "Reciente (1-4 horas)": "Recent (1–4 hours)",
  "Menos de 48 horas": "Less than 48 hours",
  "Entre 2 y 7 días": "Between 2 and 7 days",
  "Entre 1 y 4 semanas": "Between 1 and 4 weeks",
  "Más de 1 mes": "More than 1 month",
  Repentino: "Sudden",
  "Poco a poco": "Gradual",
  "Golpe fuerte en la cabeza": "Hard blow to the head",
  "Estrés o tensión": "Stress or tension",
  "Tras pantallas / esfuerzo visual": "After screens / visual strain",
  "Relacionado con el cuello o postura": "Related to neck or posture",
  "Sin causa clara": "No clear cause",
  Otro: "Other",
  "Frente / sienes": "Forehead / temples",
  "Un solo lado de la cabeza": "One side of the head",
  "Ambos lados": "Both sides",
  "Parte posterior / nuca": "Back of the head / nape",
  "Detrás de un ojo": "Behind one eye",
  "Toda la cabeza": "Whole head",
  "No estoy seguro": "I'm not sure",
  Punzante: "Sharp",
  "Pulsátil / latido": "Throbbing / pulsing",
  "Presión / peso": "Pressure / heaviness",
  Quemazón: "Burning",
  "Malestar difuso": "Diffuse discomfort",
  "En reposo": "At rest",
  "Con luz o ruido": "With light or noise",
  "Al mover el cuello": "When moving the neck",
  "Por la mañana al despertar": "In the morning on waking",
  "Por la noche": "At night",
  "Tras pantallas o concentración": "After screens or concentration",
  Constante: "Constant",
  Ninguna: "None",
  Leve: "Mild",
  Moderada: "Moderate",
  Severa: "Severe",
  "No puedo hacer casi nada": "I can barely do anything",
  "Náuseas o vómitos": "Nausea or vomiting",
  "Sensibilidad a la luz": "Light sensitivity",
  "Sensibilidad al ruido": "Noise sensitivity",
  "Visión borrosa o destellos": "Blurred vision or flashes",
  "Dolor o rigidez de cuello": "Neck pain or stiffness",
  Mareo: "Dizziness",
  Ninguno: "None",
  "No afecta": "Does not affect",
  Parcialmente: "Partially",
  "No puedo entrenar o competir": "I cannot train or compete",
  "Peor dolor de cabeza / inicio súbito distinto": "Is this the worst headache of your life, or did it start suddenly and feel very different from usual",
  "Síntomas neurológicos (visión, habla, debilidad, confusión)": "Double vision, weakness on one side of the body, difficulty speaking, or marked confusion",
  "Golpe fuerte en la cabeza reciente": "Was there a strong blow to the head recently",
  "Fiebre con rigidez de cuello": "Fever with intense neck stiffness or very strong general illness",
  "Vómitos progresivos / empeora al tumbarse o toser": "Repeated vomiting that worsens, or pain that increases when lying down or coughing",
  "Dolor nocturno sistémico con pérdida de peso": "Constant night pain that doesn't improve with rest, with unexplained weight loss",
};

export const HEAD_SECTION_LABELS_EN: Record<HeadQuestionSection, string> = {
  red_flags: "Urgency check",
  core: "Problem characterization",
  neck_link: "Link with the neck",
  history: "History",
};

export function localizeHeadLabel(id: string, fallback: string, locale: ConsultLocale): string {
  if (locale !== "en") return fallback;
  return HEAD_LABEL_EN[id] ?? fallback;
}

export function localizeHeadOption(option: string, locale: ConsultLocale): string {
  if (locale !== "en") return option;
  return HEAD_OPTION_EN[option] ?? option;
}

export function localizeHeadSection(section: string, locale: ConsultLocale): string {
  if (locale !== "en") return (HEAD_SECTION_LABELS as Record<string, string>)[section] ?? section;
  return (
    HEAD_SECTION_LABELS_EN[section as HeadQuestionSection] ??
    (HEAD_SECTION_LABELS as Record<string, string>)[section] ??
    section
  );
}
