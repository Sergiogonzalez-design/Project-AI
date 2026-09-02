/**
 * Adaptive questionnaire for median nerve (nervio mediano) —
 * nerve-muscle category with two-option recommendation:
 * 1. Conservative (evidence-based exercises, e.g. median nerve neurodynamics, tendon gliding)
 * 2. Specialized physiotherapy center (invasive therapies)
 */

export const YES_NO = ["No", "Sí"] as const;

export const EVOLUTION_OPTIONS = [
  "Ha sido ahora",
  "Reciente (1-4 horas)",
  "Menos de 48 horas",
  "Entre 2 y 7 días",
  "Entre 1 y 4 semanas",
  "Más de 1 mes",
  "Más de 3 meses",
] as const;

export const ONSET_FORM_OPTIONS = ["Repentino", "Progresivo"] as const;

export const FINGER_NUMBNESS_OPTIONS = [
  "Pulgar",
  "Índice",
  "Medio (corazón)",
  "Los 3 primeros (pulgar, índice, medio)",
  "Mitad del anular (lado del índice)",
  "Toda la mano",
  "No tengo adormecimiento",
] as const;

export const SYMPTOM_TYPE_OPTIONS = [
  "Adormecimiento / se me duermen los dedos",
  "Hormigueo",
  "Calambres",
  "Quemazón",
  "Dolor",
  "Debilidad al agarrar",
  "Torpeza / se me caen objetos",
] as const;

export const SYMPTOM_TIMING_OPTIONS = [
  "Por la noche / al despertar",
  "Al usar las manos (escribir, ratón, herramientas)",
  "Conducir / sujetar el volante",
  "Constante",
  "Intermitente sin patrón claro",
] as const;

export const CERVICAL_DIAGNOSIS_OPTIONS = [
  "Hernia o protrusión cervical C5-C6",
  "Hernia o protrusión cervical C6-C7",
  "Estenosis cervical",
  "Otra lesión cervical (especificar)",
  "No tengo diagnóstico cervical",
  "No lo sé / no me lo han dicho",
] as const;

export const HAND_USE_OPTIONS = [
  "Sí, trabajo con ordenador muchas horas",
  "Sí, trabajo manual repetitivo (herramientas, fábrica, cocina)",
  "Sí, músico o artista",
  "Sí, deporte que carga muñeca (ciclismo, crossfit, gimnasia)",
  "No, uso normal",
] as const;

export const AGGRAVATING_OPTIONS = [
  "Flexionar la muñeca",
  "Extender la muñeca",
  "Agarrar objetos",
  "Escribir o usar el ratón",
  "Conducir",
  "Dormir con la muñeca doblada",
  "Movimientos repetitivos",
  "Ninguno en particular",
] as const;

export const RELIEVING_OPTIONS = [
  "Sacudir las manos",
  "Dejar de usar la mano",
  "Muñequera / férula nocturna",
  "Estirar",
  "Medicación",
  "Nada lo alivia",
] as const;

export const FUNCTIONAL_LIMIT_OPTIONS = [
  "Ninguna",
  "Leve (puedo hacer casi todo)",
  "Moderada (limita algunas actividades)",
  "Severa (limita bastante mi día a día)",
  "No puedo usar bien la mano",
] as const;

export const WEAKNESS_OPTIONS = [
  "No noto debilidad",
  "Dificultad para agarrar objetos pequeños",
  "Se me caen cosas",
  "No puedo abrir botes o girar llaves",
  "Debilidad al hacer pinza (pulgar-índice)",
  "Atrofia visible en la eminencia tenar (base del pulgar)",
] as const;

export const TRAINING_IMPACT_OPTIONS = [
  "No afecta",
  "Parcialmente",
  "No puedo entrenar o competir",
] as const;

export type MedianNerveAdaptiveAnswers = {
  rf_debilidad_progresiva: string;
  rf_atrofia_tenar: string;
  rf_perdida_sensibilidad_completa: string;
  evolucion: string;
  inicio: string;
  intensidad_sintomas: number;
  dedos_adormecidos: string[];
  tipo_sintomas: string[];
  momento_sintomas: string[];
  mano_afectada: string;
  diagnostico_cervical: string;
  diagnostico_cervical_otro: string;
  uso_manos: string[];
  agravantes: string[];
  aliviantes: string[];
  limitacion_funcional: string[];
  debilidad: string[];
  pruebas_previas: string;
  pruebas_previas_detalle: string;
  tratamiento_previo: string;
  tratamiento_previo_detalle: string;
  deporte_impacto: string;
};

export function defaultMedianNerveAdaptiveAnswers(): MedianNerveAdaptiveAnswers {
  return {
    rf_debilidad_progresiva: "",
    rf_atrofia_tenar: "",
    rf_perdida_sensibilidad_completa: "",
    evolucion: "",
    inicio: "",
    intensidad_sintomas: 5,
    dedos_adormecidos: [],
    tipo_sintomas: [],
    momento_sintomas: [],
    mano_afectada: "",
    diagnostico_cervical: "",
    diagnostico_cervical_otro: "",
    uso_manos: [],
    agravantes: [],
    aliviantes: [],
    limitacion_funcional: [],
    debilidad: [],
    pruebas_previas: "",
    pruebas_previas_detalle: "",
    tratamiento_previo: "",
    tratamiento_previo_detalle: "",
    deporte_impacto: "",
  };
}

export type MedianNerveQuestionSection =
  | "red_flags"
  | "core"
  | "nerve_pattern"
  | "cervical_origin"
  | "occupational"
  | "aggravating"
  | "neurological"
  | "history";

export type MedianNerveQuestionDef = {
  id: keyof MedianNerveAdaptiveAnswers;
  section: MedianNerveQuestionSection;
  label: string;
  type: "single" | "multi" | "text" | "slider";
  options?: readonly string[];
  required?: boolean;
  showIf?: (a: MedianNerveAdaptiveAnswers) => boolean;
};

export const MEDIAN_NERVE_QUESTIONS: MedianNerveQuestionDef[] = [
  // --- RED FLAGS ---
  {
    id: "rf_debilidad_progresiva",
    section: "red_flags",
    label: "¿Debilidad progresiva en la mano que empeora cada semana?",
    type: "single",
    options: YES_NO,
    required: true,
  },
  {
    id: "rf_atrofia_tenar",
    section: "red_flags",
    label: "¿Has notado que los músculos de la base del pulgar se han aplanado o reducido de tamaño?",
    type: "single",
    options: YES_NO,
    required: true,
  },
  {
    id: "rf_perdida_sensibilidad_completa",
    section: "red_flags",
    label: "¿Pérdida total de sensibilidad en los dedos (no sientes nada al tocar)?",
    type: "single",
    options: YES_NO,
    required: true,
  },

  // --- CORE ---
  {
    id: "evolucion",
    section: "core",
    label: "¿Cuánto tiempo llevas con estos síntomas?",
    type: "single",
    options: EVOLUTION_OPTIONS,
    required: true,
  },
  {
    id: "inicio",
    section: "core",
    label: "¿Cómo empezó?",
    type: "single",
    options: ONSET_FORM_OPTIONS,
    required: true,
  },
  {
    id: "intensidad_sintomas",
    section: "core",
    label: "Intensidad de los síntomas (1–10)",
    type: "slider",
    required: true,
  },
  {
    id: "mano_afectada",
    section: "core",
    label: "¿Qué mano está afectada?",
    type: "single",
    options: ["Derecha", "Izquierda", "Ambas"],
    required: true,
  },

  // --- NERVE PATTERN ---
  {
    id: "dedos_adormecidos",
    section: "nerve_pattern",
    label: "¿Se te duermen o sientes hormigueo en alguno de estos dedos? (puedes marcar varios)",
    type: "multi",
    options: FINGER_NUMBNESS_OPTIONS,
    required: true,
  },
  {
    id: "tipo_sintomas",
    section: "nerve_pattern",
    label: "¿Qué sientes exactamente? (puedes marcar varios)",
    type: "multi",
    options: SYMPTOM_TYPE_OPTIONS,
    required: true,
  },
  {
    id: "momento_sintomas",
    section: "nerve_pattern",
    label: "¿Cuándo aparecen o empeoran los síntomas? (puedes marcar varios)",
    type: "multi",
    options: SYMPTOM_TIMING_OPTIONS,
    required: true,
  },

  // --- CERVICAL ORIGIN ---
  {
    id: "diagnostico_cervical",
    section: "cervical_origin",
    label: "¿Te han diagnosticado alguna lesión cervical a nivel C5, C6 o C7?",
    type: "single",
    options: CERVICAL_DIAGNOSIS_OPTIONS,
    required: true,
  },
  {
    id: "diagnostico_cervical_otro",
    section: "cervical_origin",
    label: "Especifica el diagnóstico cervical",
    type: "text",
    required: true,
    showIf: (a) => a.diagnostico_cervical === "Otra lesión cervical (especificar)",
  },
  {
    id: "pruebas_previas",
    section: "cervical_origin",
    label: "¿Te han hecho pruebas (electromiografía, resonancia, ecografía)?",
    type: "single",
    options: ["No", "Sí, electromiografía", "Sí, resonancia", "Sí, ecografía", "Sí, varias"],
    required: true,
  },
  {
    id: "pruebas_previas_detalle",
    section: "cervical_origin",
    label: "¿Qué mostraron las pruebas? (si lo recuerdas)",
    type: "text",
    required: false,
    showIf: (a) => a.pruebas_previas !== "No" && a.pruebas_previas !== "",
  },

  // --- OCCUPATIONAL ---
  {
    id: "uso_manos",
    section: "occupational",
    label: "¿Usas mucho las manos en tu trabajo o actividad? (puedes marcar varias)",
    type: "multi",
    options: HAND_USE_OPTIONS,
    required: true,
  },

  // --- AGGRAVATING ---
  {
    id: "agravantes",
    section: "aggravating",
    label: "¿Qué empeora tus síntomas? (puedes marcar varias)",
    type: "multi",
    options: AGGRAVATING_OPTIONS,
    required: true,
  },
  {
    id: "aliviantes",
    section: "aggravating",
    label: "¿Qué te alivia? (puedes marcar varias)",
    type: "multi",
    options: RELIEVING_OPTIONS,
    required: true,
  },
  {
    id: "limitacion_funcional",
    section: "aggravating",
    label: "¿Cuánto te limita en tu día a día?",
    type: "single",
    options: FUNCTIONAL_LIMIT_OPTIONS,
    required: true,
  },

  // --- NEUROLOGICAL ---
  {
    id: "debilidad",
    section: "neurological",
    label: "¿Notas debilidad o torpeza en la mano? (puedes marcar varias)",
    type: "multi",
    options: WEAKNESS_OPTIONS,
    required: true,
  },

  // --- HISTORY ---
  {
    id: "tratamiento_previo",
    section: "history",
    label: "¿Has recibido tratamiento previo para esto?",
    type: "single",
    options: YES_NO,
    required: true,
  },
  {
    id: "tratamiento_previo_detalle",
    section: "history",
    label: "¿Qué tratamiento recibiste y cómo te fue?",
    type: "text",
    required: true,
    showIf: (a) => a.tratamiento_previo === "Sí",
  },
  {
    id: "deporte_impacto",
    section: "history",
    label: "¿Cómo afecta a tu entrenamiento o deporte?",
    type: "single",
    options: TRAINING_IMPACT_OPTIONS,
    required: true,
  },
];

export const MEDIAN_NERVE_SECTION_LABELS: Record<MedianNerveQuestionSection, string> = {
  red_flags: "Comprobación de urgencia",
  core: "Caracterización del problema",
  nerve_pattern: "Patrón del nervio mediano",
  cervical_origin: "Origen cervical",
  occupational: "Uso de las manos",
  aggravating: "Factores agravantes y limitación",
  neurological: "Valoración neurológica",
  history: "Antecedentes y tratamiento",
};

export const MEDIAN_NERVE_SECTION_ORDER: MedianNerveQuestionSection[] = [
  "red_flags",
  "core",
  "nerve_pattern",
  "cervical_origin",
  "occupational",
  "aggravating",
  "neurological",
  "history",
];

export function getVisibleMedianNerveQuestions(
  answers: MedianNerveAdaptiveAnswers
): MedianNerveQuestionDef[] {
  return MEDIAN_NERVE_QUESTIONS.filter((q) => !q.showIf || q.showIf(answers));
}

export function getVisibleMedianNerveSections(
  answers: MedianNerveAdaptiveAnswers
): MedianNerveQuestionSection[] {
  const visible = getVisibleMedianNerveQuestions(answers);
  return MEDIAN_NERVE_SECTION_ORDER.filter((s) => visible.some((q) => q.section === s));
}

const RED_FLAG_IDS: (keyof MedianNerveAdaptiveAnswers)[] = [
  "rf_debilidad_progresiva",
  "rf_atrofia_tenar",
  "rf_perdida_sensibilidad_completa",
];

export function detectMedianNerveRedFlags(answers: MedianNerveAdaptiveAnswers): {
  urgent: boolean;
  triggered: string[];
} {
  const labels: Record<string, string> = {
    rf_debilidad_progresiva: "Debilidad progresiva en la mano",
    rf_atrofia_tenar: "Atrofia de la eminencia tenar",
    rf_perdida_sensibilidad_completa: "Pérdida total de sensibilidad en dedos",
  };
  const triggered: string[] = [];
  for (const id of RED_FLAG_IDS) {
    if (answers[id] === "Sí") triggered.push(labels[id] ?? id);
  }
  return { urgent: triggered.length > 0, triggered };
}

export function detectMedianNerveSeverity(answers: MedianNerveAdaptiveAnswers): "high" | "moderate" | "mild" {
  if (
    answers.rf_atrofia_tenar === "Sí" ||
    answers.rf_perdida_sensibilidad_completa === "Sí" ||
    answers.debilidad.some((d) => d === "Atrofia visible en la eminencia tenar (base del pulgar)")
  ) return "high";
  if (
    answers.momento_sintomas.includes("Constante") ||
    answers.debilidad.some((d) => d !== "No noto debilidad") ||
    hasMedianPattern(answers)
  ) return "moderate";
  return "mild";
}

function hasMedianPattern(a: MedianNerveAdaptiveAnswers): boolean {
  return (
    a.dedos_adormecidos.includes("Los 3 primeros (pulgar, índice, medio)") ||
    (a.dedos_adormecidos.includes("Pulgar") && a.dedos_adormecidos.includes("Índice"))
  );
}

function hasCervicalDiagnosis(a: MedianNerveAdaptiveAnswers): boolean {
  return (
    a.diagnostico_cervical !== "" &&
    a.diagnostico_cervical !== "No tengo diagnóstico cervical" &&
    a.diagnostico_cervical !== "No lo sé / no me lo han dicho"
  );
}

function hasHighHandUse(a: MedianNerveAdaptiveAnswers): boolean {
  return a.uso_manos.some((u) => u !== "No, uso normal");
}

function isAnswered(q: MedianNerveQuestionDef, answers: MedianNerveAdaptiveAnswers): boolean {
  const val = answers[q.id];
  if (q.type === "multi") return Array.isArray(val) && val.length > 0;
  if (q.type === "slider") return typeof val === "number" && val >= 1;
  if (q.type === "text") return typeof val === "string" && val.trim().length > 0;
  return typeof val === "string" && val.length > 0;
}

export function validateMedianNerveAdaptive(answers: MedianNerveAdaptiveAnswers): string | null {
  const visible = getVisibleMedianNerveQuestions(answers);
  for (const q of visible) {
    if (q.required !== false && !isAnswered(q, answers)) {
      return `Responde: ${q.label.replace(/\?$/, "")}.`;
    }
  }
  return null;
}

export function validateMedianNerveSection(
  section: MedianNerveQuestionSection,
  answers: MedianNerveAdaptiveAnswers
): string | null {
  const questions = getVisibleMedianNerveQuestions(answers).filter((q) => q.section === section);
  for (const q of questions) {
    if (q.required !== false && !isAnswered(q, answers)) {
      return `Responde: ${q.label.replace(/\?$/, "")}.`;
    }
  }
  return null;
}

function formatMulti(arr: string[]): string {
  return arr.length ? arr.join(", ") : "No especificado";
}

export function formatMedianNerveAdaptive(answers: MedianNerveAdaptiveAnswers): string {
  const { urgent, triggered } = detectMedianNerveRedFlags(answers);
  const severity = detectMedianNerveSeverity(answers);
  const medianPattern = hasMedianPattern(answers);
  const cervical = hasCervicalDiagnosis(answers);
  const handUse = hasHighHandUse(answers);

  const lines: string[] = [
    "=== CUESTIONARIO ADAPTATIVO — NERVIO MEDIANO ===",
    "",
    "— BANDERAS ROJAS —",
    urgent
      ? `⚠️ SIGNOS DE ALARMA: ${triggered.join("; ")} → DERIVAR A ESPECIALISTA (valorar cirugía si hay atrofia tenar o pérdida sensitiva completa)`
      : "Ninguna bandera roja marcada como Sí",
    `Debilidad progresiva: ${answers.rf_debilidad_progresiva || "—"}`,
    `Atrofia tenar: ${answers.rf_atrofia_tenar || "—"}`,
    `Pérdida sensitiva completa: ${answers.rf_perdida_sensibilidad_completa || "—"}`,
    "",
    "— VARIABLES CLÍNICAS —",
    `Tiempo de evolución: ${answers.evolucion}`,
    `Forma de inicio: ${answers.inicio}`,
    `Intensidad síntomas: ${answers.intensidad_sintomas}/10`,
    `Mano afectada: ${answers.mano_afectada}`,
    "",
    "— PATRÓN DEL NERVIO MEDIANO —",
    `Dedos con adormecimiento/hormigueo: ${formatMulti(answers.dedos_adormecidos)}`,
    `Tipo de síntomas: ${formatMulti(answers.tipo_sintomas)}`,
    `Cuándo aparecen: ${formatMulti(answers.momento_sintomas)}`,
    medianPattern
      ? "✓ PATRÓN CLÁSICO DEL NERVIO MEDIANO: afectación de los 3 primeros dedos"
      : "",
    "",
    "— ORIGEN CERVICAL —",
    `Diagnóstico cervical: ${answers.diagnostico_cervical}${answers.diagnostico_cervical_otro ? ` (${answers.diagnostico_cervical_otro})` : ""}`,
    `Pruebas previas: ${answers.pruebas_previas}${answers.pruebas_previas_detalle ? ` — ${answers.pruebas_previas_detalle}` : ""}`,
  ];

  if (cervical) {
    lines.push(
      "",
      "— CORRELACIÓN CERVICAL-MEDIANO —",
      "Si tienes una lesión cervical a nivel C5-C6 o C6-C7, es posible que el nervio mediano se esté viendo comprometido en su origen (radiculopatía cervical vs atrapamiento periférico — double crush syndrome)."
    );
  }

  lines.push(
    "",
    "— USO DE LAS MANOS —",
    `Uso laboral/actividad: ${formatMulti(answers.uso_manos)}`,
  );

  if (handUse) {
    lines.push(
      "✓ USO INTENSIVO DE LAS MANOS: factor de riesgo para síndrome del túnel carpiano."
    );
  }

  lines.push(
    "",
    "— FACTORES AGRAVANTES / ALIVIANTES —",
    `Agravantes: ${formatMulti(answers.agravantes)}`,
    `Aliviantes: ${formatMulti(answers.aliviantes)}`,
    `Limitación funcional: ${answers.limitacion_funcional.join(", ") || "—"}`,
    "",
    "— VALORACIÓN NEUROLÓGICA —",
    `Debilidad/torpeza: ${formatMulti(answers.debilidad)}`,
    "",
    "— ANTECEDENTES —",
    `Tratamiento previo: ${answers.tratamiento_previo}${answers.tratamiento_previo === "Sí" && answers.tratamiento_previo_detalle ? ` — ${answers.tratamiento_previo_detalle}` : ""}`,
    `Impacto deportivo: ${answers.deporte_impacto}`,
    "",
    `— SEVERIDAD ESTIMADA: ${severity.toUpperCase()} —`,
    "",
    "— INSTRUCCIONES PARA LA IA —",
    "Basándote en la información recopilada, ofrece DOS opciones de tratamiento:",
    "",
    "OPCIÓN 1 — CONSERVADORA (ejercicios basados en evidencia):",
    "Busca y recomienda ejercicios específicos para el nervio mediano respaldados por evidencia.",
    "Incluye obligatoriamente: neurodinámica del nervio mediano (median nerve sliders/tensioners),",
    "ejercicios de deslizamiento tendinoso (tendon gliding exercises),",
    "y estiramientos de flexores de muñeca.",
    "Si hay componente cervical, incluir también movilización neural desde cervical.",
    "Adapta la progresión según la severidad y el tiempo de evolución.",
    "",
    "OPCIÓN 2 — CENTRO ESPECIALIZADO:",
    "Recomienda acudir a un centro de fisioterapia especializado en terapias invasivas",
    "(punción seca, electrólisis percutánea, neuromodulación ecoguiada) para valorar el caso.",
    "Indica que un profesional puede realizar técnicas dirigidas al nervio mediano,",
    "el túnel carpiano, y la musculatura asociada (pronador redondo, flexores).",
    "",
    "NOTA: El sistema recopila variables clínicas para estimar el compromiso del nervio mediano, no para diagnosticar.",
    "Si la severidad es HIGH o hay atrofia tenar, enfatiza la derivación a especialista para valorar opciones quirúrgicas."
  );

  return lines.filter(Boolean).join("\n");
}

export function isLastMedianNerveSection(
  answers: MedianNerveAdaptiveAnswers,
  sectionIndex: number
): boolean {
  const sections = getVisibleMedianNerveSections(answers);
  return sectionIndex >= sections.length - 1;
}

// --- English translations ---

export const MEDIAN_NERVE_LABEL_EN: Partial<Record<string, string>> = {
  rf_debilidad_progresiva: "Progressive weakness in the hand that gets worse every week?",
  rf_atrofia_tenar: "Have you noticed the muscles at the base of your thumb have flattened or shrunk?",
  rf_perdida_sensibilidad_completa: "Complete loss of sensation in fingers (you feel nothing when touching)?",
  evolucion: "How long have you had these symptoms?",
  inicio: "How did it start?",
  intensidad_sintomas: "Symptom intensity (1–10)",
  mano_afectada: "Which hand is affected?",
  dedos_adormecidos: "Do any of these fingers go numb or tingle? (you can select several)",
  tipo_sintomas: "What exactly do you feel? (you can select several)",
  momento_sintomas: "When do symptoms appear or worsen? (you can select several)",
  diagnostico_cervical: "Have you been diagnosed with a cervical condition at C5, C6, or C7?",
  diagnostico_cervical_otro: "Specify the cervical diagnosis",
  pruebas_previas: "Have you had tests (EMG, MRI, ultrasound)?",
  pruebas_previas_detalle: "What did the tests show? (if you remember)",
  uso_manos: "Do you use your hands intensively at work or in activities? (you can select several)",
  agravantes: "What worsens your symptoms? (you can select several)",
  aliviantes: "What relieves them? (you can select several)",
  limitacion_funcional: "How much does it limit you day to day?",
  debilidad: "Do you notice weakness or clumsiness in the hand? (you can select several)",
  tratamiento_previo: "Have you received previous treatment for this?",
  tratamiento_previo_detalle: "What treatment did you receive and how did it go?",
  deporte_impacto: "How does it affect your training or sport?",
};

export const MEDIAN_NERVE_OPTION_EN = {
  No: "No",
  Sí: "Yes",
  "Ha sido ahora": "Just now",
  "Reciente (1-4 horas)": "Recent (1–4 hours)",
  "Menos de 48 horas": "Less than 48 hours",
  "Entre 2 y 7 días": "Between 2 and 7 days",
  "Entre 1 y 4 semanas": "Between 1 and 4 weeks",
  "Más de 1 mes": "More than 1 month",
  "Más de 3 meses": "More than 3 months",
  Repentino: "Sudden",
  Progresivo: "Gradual",
  Derecha: "Right",
  Izquierda: "Left",
  Ambas: "Both",
  Pulgar: "Thumb",
  "Índice": "Index finger",
  "Medio (corazón)": "Middle finger",
  "Los 3 primeros (pulgar, índice, medio)": "First 3 (thumb, index, middle)",
  "Mitad del anular (lado del índice)": "Half of ring finger (index side)",
  "Toda la mano": "Entire hand",
  "No tengo adormecimiento": "I don't have numbness",
  "Adormecimiento / se me duermen los dedos": "Numbness / fingers going numb",
  Hormigueo: "Tingling",
  Calambres: "Cramps",
  "Quemazón": "Burning",
  Dolor: "Pain",
  "Debilidad al agarrar": "Weakness when gripping",
  "Torpeza / se me caen objetos": "Clumsiness / dropping objects",
  "Por la noche / al despertar": "At night / when waking up",
  "Al usar las manos (escribir, ratón, herramientas)": "When using hands (typing, mouse, tools)",
  "Conducir / sujetar el volante": "Driving / holding the steering wheel",
  Constante: "Constant",
  "Intermitente sin patrón claro": "Intermittent with no clear pattern",
  "Hernia o protrusión cervical C5-C6": "Cervical herniation/bulge C5-C6",
  "Hernia o protrusión cervical C6-C7": "Cervical herniation/bulge C6-C7",
  "Estenosis cervical": "Cervical stenosis",
  "Otra lesión cervical (especificar)": "Other cervical condition (specify)",
  "No tengo diagnóstico cervical": "No cervical diagnosis",
  "No lo sé / no me lo han dicho": "I don't know / was not told",
  "Sí, trabajo con ordenador muchas horas": "Yes, I work on a computer many hours",
  "Sí, trabajo manual repetitivo (herramientas, fábrica, cocina)": "Yes, repetitive manual work (tools, factory, kitchen)",
  "Sí, músico o artista": "Yes, musician or artist",
  "Sí, deporte que carga muñeca (ciclismo, crossfit, gimnasia)": "Yes, sport that loads the wrist (cycling, crossfit, gymnastics)",
  "No, uso normal": "No, normal use",
  "Flexionar la muñeca": "Flexing the wrist",
  "Extender la muñeca": "Extending the wrist",
  "Agarrar objetos": "Gripping objects",
  "Escribir o usar el ratón": "Typing or using the mouse",
  Conducir: "Driving",
  "Dormir con la muñeca doblada": "Sleeping with wrist bent",
  "Movimientos repetitivos": "Repetitive movements",
  "Ninguno en particular": "None in particular",
  "Sacudir las manos": "Shaking the hands",
  "Dejar de usar la mano": "Stopping hand use",
  "Muñequera / férula nocturna": "Wrist brace / night splint",
  Estirar: "Stretching",
  "Medicación": "Medication",
  "Nada lo alivia": "Nothing relieves it",
  Ninguna: "None",
  "Leve (puedo hacer casi todo)": "Mild (I can do almost everything)",
  "Moderada (limita algunas actividades)": "Moderate (limits some activities)",
  "Severa (limita bastante mi día a día)": "Severe (significantly limits my daily life)",
  "No puedo usar bien la mano": "I cannot use my hand properly",
  "No noto debilidad": "I don't notice weakness",
  "Dificultad para agarrar objetos pequeños": "Difficulty gripping small objects",
  "Se me caen cosas": "I drop things",
  "No puedo abrir botes o girar llaves": "I can't open jars or turn keys",
  "Debilidad al hacer pinza (pulgar-índice)": "Weakness in pinch grip (thumb-index)",
  "Atrofia visible en la eminencia tenar (base del pulgar)": "Visible thenar atrophy (base of thumb)",
  "No afecta": "Does not affect",
  Parcialmente: "Partially",
  "No puedo entrenar o competir": "I can't train or compete",
  "Sí, electromiografía": "Yes, EMG",
  "Sí, resonancia": "Yes, MRI",
  "Sí, ecografía": "Yes, ultrasound",
  "Sí, varias": "Yes, multiple",
  "Debilidad progresiva en la mano": "Progressive weakness in the hand that gets worse every week",
  "Atrofia de la eminencia tenar": "Have you noticed the muscles at the base of your thumb have flattened or shrunk",
  "Pérdida total de sensibilidad en dedos": "Complete loss of sensation in fingers (you feel nothing when touching)",
};

export const MEDIAN_NERVE_SECTION_LABELS_EN: Record<string, string> = {
  red_flags: "Urgency check",
  core: "Problem characterization",
  nerve_pattern: "Median nerve pattern",
  cervical_origin: "Cervical origin",
  occupational: "Hand use",
  aggravating: "Aggravating factors & limitation",
  neurological: "Neurological assessment",
  history: "History & treatment",
};

export type ConsultLocale = "es" | "en";

export function localizeMedianNerveLabel(id: string, fallback: string, locale: ConsultLocale): string {
  if (locale !== "en") return fallback;
  return MEDIAN_NERVE_LABEL_EN[id] ?? fallback;
}

export function localizeMedianNerveOption(option: string, locale: ConsultLocale): string {
  if (locale !== "en") return option;
  return MEDIAN_NERVE_OPTION_EN[option as keyof typeof MEDIAN_NERVE_OPTION_EN] ?? option;
}

export function localizeMedianNerveSection(section: string, locale: ConsultLocale): string {
  if (locale !== "en") return (MEDIAN_NERVE_SECTION_LABELS as any)[section] ?? section;
  return MEDIAN_NERVE_SECTION_LABELS_EN[section] ?? (MEDIAN_NERVE_SECTION_LABELS as any)[section] ?? section;
}
