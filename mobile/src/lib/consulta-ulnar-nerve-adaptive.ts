/**
 * Adaptive questionnaire for ulnar nerve (nervio cubital) —
 * nerve-muscle category with two-option recommendation:
 * 1. Conservative (evidence-based exercises: trapezius/pectoral stretching,
 *    epitrochlear musculature, ulnar nerve neurodynamics)
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
  "Meñique (5.º dedo)",
  "Anular (4.º dedo)",
  "Ambos (4.º y 5.º dedo)",
  "Mitad del anular (lado del meñique)",
  "Toda la mano",
  "No tengo adormecimiento",
] as const;

export const NUMBNESS_SIDE_OPTIONS = [
  "Cara palmar (palma de la mano)",
  "Cara dorsal (parte de atrás de la mano)",
  "Ambas caras",
  "No estoy seguro",
] as const;

export const SYMPTOM_TYPE_OPTIONS = [
  "Adormecimiento / se me duermen los dedos",
  "Hormigueo",
  "Calambres",
  "Quemazón",
  "Dolor en el codo (cara interna)",
  "Debilidad al agarrar",
  "Torpeza / dificultad con movimientos finos",
  "Garra en los últimos dedos",
] as const;

export const SYMPTOM_TIMING_OPTIONS = [
  "Al apoyar el codo",
  "Al flexionar el codo mucho rato",
  "Por la noche / al despertar",
  "Al usar las manos (escribir, ratón, herramientas)",
  "Al agarrar objetos",
  "Constante",
  "Intermitente sin patrón claro",
] as const;

export const CERVICAL_DIAGNOSIS_OPTIONS = [
  "Hernia o protrusión cervical C5-C6",
  "Hernia o protrusión cervical C6-C7",
  "Hernia o protrusión cervical C7-T1",
  "Estenosis cervical",
  "Otra lesión cervical (especificar)",
  "No tengo diagnóstico cervical",
  "No lo sé / no me lo han dicho",
] as const;

export const ELBOW_HISTORY_OPTIONS = [
  "Fractura o cirugía previa en el codo",
  "Apoyo prolongado del codo en mesa/superficie",
  "Trabajo repetitivo con codo flexionado",
  "Deporte de lanzamiento o raqueta",
  "Ninguna de las anteriores",
] as const;

export const AGGRAVATING_OPTIONS = [
  "Flexionar el codo mucho rato",
  "Apoyar el codo",
  "Agarrar con fuerza",
  "Movimientos finos (botones, escribir)",
  "Dormir con el codo doblado",
  "Golpe en la parte interna del codo",
  "Ninguno en particular",
] as const;

export const RELIEVING_OPTIONS = [
  "Extender el codo",
  "Dejar de apoyar el codo",
  "Sacudir la mano",
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
  "Dificultad para separar los dedos",
  "Debilidad al agarrar con fuerza",
  "Dificultad con movimientos finos (llaves, botones)",
  "Se me caen cosas",
  "Garra del 4.º y 5.º dedo",
  "Atrofia visible entre los nudillos (interóseos)",
] as const;

export const TRAINING_IMPACT_OPTIONS = [
  "No afecta",
  "Parcialmente",
  "No puedo entrenar o competir",
] as const;

export type UlnarNerveAdaptiveAnswers = {
  rf_debilidad_progresiva: string;
  rf_atrofia_interoseos: string;
  rf_garra_dedos: string;
  evolucion: string;
  inicio: string;
  intensidad_sintomas: number;
  dedos_adormecidos: string[];
  cara_adormecimiento: string;
  tipo_sintomas: string[];
  momento_sintomas: string[];
  mano_afectada: string;
  diagnostico_cervical: string;
  diagnostico_cervical_otro: string;
  antecedentes_codo: string[];
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

export function defaultUlnarNerveAdaptiveAnswers(): UlnarNerveAdaptiveAnswers {
  return {
    rf_debilidad_progresiva: "",
    rf_atrofia_interoseos: "",
    rf_garra_dedos: "",
    evolucion: "",
    inicio: "",
    intensidad_sintomas: 5,
    dedos_adormecidos: [],
    cara_adormecimiento: "",
    tipo_sintomas: [],
    momento_sintomas: [],
    mano_afectada: "",
    diagnostico_cervical: "",
    diagnostico_cervical_otro: "",
    antecedentes_codo: [],
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

export type UlnarNerveQuestionSection =
  | "red_flags"
  | "core"
  | "nerve_pattern"
  | "cervical_origin"
  | "elbow_history"
  | "aggravating"
  | "neurological"
  | "history";

export type UlnarNerveQuestionDef = {
  id: keyof UlnarNerveAdaptiveAnswers;
  section: UlnarNerveQuestionSection;
  label: string;
  type: "single" | "multi" | "text" | "slider";
  options?: readonly string[];
  required?: boolean;
  showIf?: (a: UlnarNerveAdaptiveAnswers) => boolean;
};

export const ULNAR_NERVE_QUESTIONS: UlnarNerveQuestionDef[] = [
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
    id: "rf_atrofia_interoseos",
    section: "red_flags",
    label: "¿Has notado que los músculos entre los nudillos se han hundido o aplanado?",
    type: "single",
    options: YES_NO,
    required: true,
  },
  {
    id: "rf_garra_dedos",
    section: "red_flags",
    label: "¿El 4.º y 5.º dedo se quedan en posición de garra (flexionados sin poder extenderlos bien)?",
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
    label: "¿Se te duerme el 4.º y/o 5.º dedo frecuentemente? (puedes marcar varios)",
    type: "multi",
    options: FINGER_NUMBNESS_OPTIONS,
    required: true,
  },
  {
    id: "cara_adormecimiento",
    section: "nerve_pattern",
    label: "¿En qué cara de la mano sientes el adormecimiento?",
    type: "single",
    options: NUMBNESS_SIDE_OPTIONS,
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

  // --- ELBOW HISTORY ---
  {
    id: "antecedentes_codo",
    section: "elbow_history",
    label: "¿Tienes algún antecedente en el codo? (puedes marcar varias)",
    type: "multi",
    options: ELBOW_HISTORY_OPTIONS,
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

export const ULNAR_NERVE_SECTION_LABELS: Record<UlnarNerveQuestionSection, string> = {
  red_flags: "Comprobación de urgencia",
  core: "Caracterización del problema",
  nerve_pattern: "Patrón del nervio cubital",
  cervical_origin: "Origen cervical",
  elbow_history: "Antecedentes del codo",
  aggravating: "Factores agravantes y limitación",
  neurological: "Valoración neurológica",
  history: "Antecedentes y tratamiento",
};

export const ULNAR_NERVE_SECTION_ORDER: UlnarNerveQuestionSection[] = [
  "red_flags",
  "core",
  "nerve_pattern",
  "cervical_origin",
  "elbow_history",
  "aggravating",
  "neurological",
  "history",
];

export function getVisibleUlnarNerveQuestions(
  answers: UlnarNerveAdaptiveAnswers
): UlnarNerveQuestionDef[] {
  return ULNAR_NERVE_QUESTIONS.filter((q) => !q.showIf || q.showIf(answers));
}

export function getVisibleUlnarNerveSections(
  answers: UlnarNerveAdaptiveAnswers
): UlnarNerveQuestionSection[] {
  const visible = getVisibleUlnarNerveQuestions(answers);
  return ULNAR_NERVE_SECTION_ORDER.filter((s) => visible.some((q) => q.section === s));
}

const RED_FLAG_IDS: (keyof UlnarNerveAdaptiveAnswers)[] = [
  "rf_debilidad_progresiva",
  "rf_atrofia_interoseos",
  "rf_garra_dedos",
];

export function detectUlnarNerveRedFlags(answers: UlnarNerveAdaptiveAnswers): {
  urgent: boolean;
  triggered: string[];
} {
  const labels: Record<string, string> = {
    rf_debilidad_progresiva: "Debilidad progresiva en la mano",
    rf_atrofia_interoseos: "Atrofia de los interóseos",
    rf_garra_dedos: "Deformidad en garra del 4.º y 5.º dedo",
  };
  const triggered: string[] = [];
  for (const id of RED_FLAG_IDS) {
    if (answers[id] === "Sí") triggered.push(labels[id] ?? id);
  }
  return { urgent: triggered.length > 0, triggered };
}

export function detectUlnarNerveSeverity(answers: UlnarNerveAdaptiveAnswers): "high" | "moderate" | "mild" {
  if (
    answers.rf_atrofia_interoseos === "Sí" ||
    answers.rf_garra_dedos === "Sí" ||
    answers.debilidad.some((d) => d === "Garra del 4.º y 5.º dedo" || d === "Atrofia visible entre los nudillos (interóseos)")
  ) return "high";
  if (
    answers.momento_sintomas.includes("Constante") ||
    answers.debilidad.some((d) => d !== "No noto debilidad") ||
    hasUlnarPattern(answers)
  ) return "moderate";
  return "mild";
}

function hasUlnarPattern(a: UlnarNerveAdaptiveAnswers): boolean {
  return (
    a.dedos_adormecidos.includes("Ambos (4.º y 5.º dedo)") ||
    (a.dedos_adormecidos.includes("Meñique (5.º dedo)") && a.dedos_adormecidos.includes("Anular (4.º dedo)"))
  );
}

function hasCervicalDiagnosis(a: UlnarNerveAdaptiveAnswers): boolean {
  return (
    a.diagnostico_cervical !== "" &&
    a.diagnostico_cervical !== "No tengo diagnóstico cervical" &&
    a.diagnostico_cervical !== "No lo sé / no me lo han dicho"
  );
}

function isAnswered(q: UlnarNerveQuestionDef, answers: UlnarNerveAdaptiveAnswers): boolean {
  const val = answers[q.id];
  if (q.type === "multi") return Array.isArray(val) && val.length > 0;
  if (q.type === "slider") return typeof val === "number" && val >= 1;
  if (q.type === "text") return typeof val === "string" && val.trim().length > 0;
  return typeof val === "string" && val.length > 0;
}

export function validateUlnarNerveAdaptive(answers: UlnarNerveAdaptiveAnswers): string | null {
  const visible = getVisibleUlnarNerveQuestions(answers);
  for (const q of visible) {
    if (q.required !== false && !isAnswered(q, answers)) {
      return `Responde: ${q.label.replace(/\?$/, "")}.`;
    }
  }
  return null;
}

export function validateUlnarNerveSection(
  section: UlnarNerveQuestionSection,
  answers: UlnarNerveAdaptiveAnswers
): string | null {
  const questions = getVisibleUlnarNerveQuestions(answers).filter((q) => q.section === section);
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

export function formatUlnarNerveAdaptive(answers: UlnarNerveAdaptiveAnswers): string {
  const { urgent, triggered } = detectUlnarNerveRedFlags(answers);
  const severity = detectUlnarNerveSeverity(answers);
  const ulnarPattern = hasUlnarPattern(answers);
  const cervical = hasCervicalDiagnosis(answers);

  const lines: string[] = [
    "=== CUESTIONARIO ADAPTATIVO — NERVIO CUBITAL ===",
    "",
    "— BANDERAS ROJAS —",
    urgent
      ? `⚠️ SIGNOS DE ALARMA: ${triggered.join("; ")} → DERIVAR A ESPECIALISTA (valorar cirugía si hay atrofia o deformidad en garra)`
      : "Ninguna bandera roja marcada como Sí",
    `Debilidad progresiva: ${answers.rf_debilidad_progresiva || "—"}`,
    `Atrofia interóseos: ${answers.rf_atrofia_interoseos || "—"}`,
    `Garra 4.º y 5.º dedo: ${answers.rf_garra_dedos || "—"}`,
    "",
    "— VARIABLES CLÍNICAS —",
    `Tiempo de evolución: ${answers.evolucion}`,
    `Forma de inicio: ${answers.inicio}`,
    `Intensidad síntomas: ${answers.intensidad_sintomas}/10`,
    `Mano afectada: ${answers.mano_afectada}`,
    "",
    "— PATRÓN DEL NERVIO CUBITAL —",
    `Dedos con adormecimiento: ${formatMulti(answers.dedos_adormecidos)}`,
    `Cara afectada: ${answers.cara_adormecimiento}`,
    `Tipo de síntomas: ${formatMulti(answers.tipo_sintomas)}`,
    `Cuándo aparecen: ${formatMulti(answers.momento_sintomas)}`,
    ulnarPattern
      ? "✓ PATRÓN CLÁSICO DEL NERVIO CUBITAL: afectación del 4.º y 5.º dedo por la cara palmar"
      : "",
    "",
    "— ORIGEN CERVICAL —",
    `Diagnóstico cervical: ${answers.diagnostico_cervical}${answers.diagnostico_cervical_otro ? ` (${answers.diagnostico_cervical_otro})` : ""}`,
    `Pruebas previas: ${answers.pruebas_previas}${answers.pruebas_previas_detalle ? ` — ${answers.pruebas_previas_detalle}` : ""}`,
  ];

  if (cervical) {
    lines.push(
      "",
      "— CORRELACIÓN CERVICAL-CUBITAL —",
      "Si tienes una lesión cervical a nivel C5-C6, C6-C7 o C7-T1, es probable que el nervio cubital se esté viendo comprometido.",
      "Puede tratarse de una radiculopatía cervical, un atrapamiento periférico (canal de Guyon o túnel cubital) o ambos (double crush syndrome)."
    );
  }

  lines.push(
    "",
    "— ANTECEDENTES DEL CODO —",
    `Antecedentes: ${formatMulti(answers.antecedentes_codo)}`,
    "",
    "— FACTORES AGRAVANTES / ALIVIANTES —",
    `Agravantes: ${formatMulti(answers.agravantes)}`,
    `Aliviantes: ${formatMulti(answers.aliviantes)}`,
    `Limitación funcional: ${answers.limitacion_funcional.join(", ") || "—"}`,
    "",
    "— VALORACIÓN NEUROLÓGICA —",
    `Debilidad/torpeza: ${formatMulti(answers.debilidad)}`,
    "",
    "— ANTECEDENTES Y TRATAMIENTO —",
    `Tratamiento previo: ${answers.tratamiento_previo}${answers.tratamiento_previo === "Sí" && answers.tratamiento_previo_detalle ? ` — ${answers.tratamiento_previo_detalle}` : ""}`,
    `Impacto deportivo: ${answers.deporte_impacto}`,
    "",
    `— SEVERIDAD ESTIMADA: ${severity.toUpperCase()} —`,
    "",
    "— INSTRUCCIONES PARA LA IA —",
    "Basándote en la información recopilada, ofrece DOS opciones de tratamiento:",
    "",
    "OPCIÓN 1 — CONSERVADORA (ejercicios basados en evidencia):",
    "Busca y recomienda ejercicios específicos para el nervio cubital respaldados por evidencia.",
    "Incluye obligatoriamente:",
    "- Estiramientos de trapecio (del lado afectado) para descomprimir la salida cervical",
    "- Estiramientos de pectoral menor y mayor (del lado correspondiente) para liberar el desfiladero torácico",
    "- Ejercicios para musculatura epitroclear (flexor carpi ulnaris, flexor digitorum) — fortalecimiento excéntrico y estiramientos",
    "- Neurodinámica del nervio cubital (ulnar nerve sliders/tensioners)",
    "- Si hay componente cervical, incluir movilización neural desde cervical",
    "Adapta la progresión según la severidad y el tiempo de evolución.",
    "",
    "OPCIÓN 2 — CENTRO ESPECIALIZADO:",
    "Recomienda acudir a un centro de fisioterapia especializado en terapias invasivas",
    "(punción seca, electrólisis percutánea, neuromodulación ecoguiada) para valorar el caso.",
    "Indica que un profesional puede realizar técnicas dirigidas al nervio cubital,",
    "el túnel cubital (codo), el canal de Guyon (muñeca) y la musculatura asociada.",
    "",
    "NOTA: El sistema recopila variables clínicas para estimar el compromiso del nervio cubital, no para diagnosticar.",
    "Si la severidad es HIGH o hay atrofia/garra, enfatiza la derivación a especialista para valorar opciones quirúrgicas."
  );

  return lines.filter(Boolean).join("\n");
}

export function isLastUlnarNerveSection(
  answers: UlnarNerveAdaptiveAnswers,
  sectionIndex: number
): boolean {
  const sections = getVisibleUlnarNerveSections(answers);
  return sectionIndex >= sections.length - 1;
}

// --- English translations ---

export const ULNAR_NERVE_LABEL_EN: Partial<Record<string, string>> = {
  rf_debilidad_progresiva: "Progressive weakness in the hand that gets worse every week?",
  rf_atrofia_interoseos: "Have you noticed the muscles between your knuckles have sunken or flattened?",
  rf_garra_dedos: "Do the 4th and 5th fingers stay in a claw position (flexed, unable to fully extend)?",
  evolucion: "How long have you had these symptoms?",
  inicio: "How did it start?",
  intensidad_sintomas: "Symptom intensity (1–10)",
  mano_afectada: "Which hand is affected?",
  dedos_adormecidos: "Does the 4th and/or 5th finger frequently go numb? (you can select several)",
  cara_adormecimiento: "On which side of the hand do you feel the numbness?",
  tipo_sintomas: "What exactly do you feel? (you can select several)",
  momento_sintomas: "When do symptoms appear or worsen? (you can select several)",
  diagnostico_cervical: "Have you been diagnosed with a cervical condition at C5, C6, or C7?",
  diagnostico_cervical_otro: "Specify the cervical diagnosis",
  pruebas_previas: "Have you had tests (EMG, MRI, ultrasound)?",
  pruebas_previas_detalle: "What did the tests show? (if you remember)",
  antecedentes_codo: "Do you have any history involving the elbow? (you can select several)",
  agravantes: "What worsens your symptoms? (you can select several)",
  aliviantes: "What relieves them? (you can select several)",
  limitacion_funcional: "How much does it limit you day to day?",
  debilidad: "Do you notice weakness or clumsiness in the hand? (you can select several)",
  tratamiento_previo: "Have you received previous treatment for this?",
  tratamiento_previo_detalle: "What treatment did you receive and how did it go?",
  deporte_impacto: "How does it affect your training or sport?",
};

export const ULNAR_NERVE_OPTION_EN = {
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
  "Meñique (5.º dedo)": "Little finger (5th finger)",
  "Anular (4.º dedo)": "Ring finger (4th finger)",
  "Ambos (4.º y 5.º dedo)": "Both (4th and 5th finger)",
  "Mitad del anular (lado del meñique)": "Half of ring finger (little finger side)",
  "Toda la mano": "Entire hand",
  "No tengo adormecimiento": "I don't have numbness",
  "Cara palmar (palma de la mano)": "Palmar side (palm of the hand)",
  "Cara dorsal (parte de atrás de la mano)": "Dorsal side (back of the hand)",
  "Ambas caras": "Both sides",
  "No estoy seguro": "I'm not sure",
  "Adormecimiento / se me duermen los dedos": "Numbness / fingers going numb",
  Hormigueo: "Tingling",
  Calambres: "Cramps",
  "Quemazón": "Burning",
  "Dolor en el codo (cara interna)": "Pain in the elbow (inner side)",
  "Debilidad al agarrar": "Weakness when gripping",
  "Torpeza / dificultad con movimientos finos": "Clumsiness / difficulty with fine movements",
  "Garra en los últimos dedos": "Claw deformity in last fingers",
  "Al apoyar el codo": "When leaning on the elbow",
  "Al flexionar el codo mucho rato": "When keeping the elbow bent for a long time",
  "Por la noche / al despertar": "At night / when waking up",
  "Al usar las manos (escribir, ratón, herramientas)": "When using hands (typing, mouse, tools)",
  "Al agarrar objetos": "When gripping objects",
  Constante: "Constant",
  "Intermitente sin patrón claro": "Intermittent with no clear pattern",
  "Hernia o protrusión cervical C5-C6": "Cervical herniation/bulge C5-C6",
  "Hernia o protrusión cervical C6-C7": "Cervical herniation/bulge C6-C7",
  "Hernia o protrusión cervical C7-T1": "Cervical herniation/bulge C7-T1",
  "Estenosis cervical": "Cervical stenosis",
  "Otra lesión cervical (especificar)": "Other cervical condition (specify)",
  "No tengo diagnóstico cervical": "No cervical diagnosis",
  "No lo sé / no me lo han dicho": "I don't know / was not told",
  "Fractura o cirugía previa en el codo": "Previous fracture or surgery in the elbow",
  "Apoyo prolongado del codo en mesa/superficie": "Prolonged leaning of elbow on table/surface",
  "Trabajo repetitivo con codo flexionado": "Repetitive work with elbow bent",
  "Deporte de lanzamiento o raqueta": "Throwing or racquet sport",
  "Ninguna de las anteriores": "None of the above",
  "Flexionar el codo mucho rato": "Keeping the elbow bent for a long time",
  "Apoyar el codo": "Leaning on the elbow",
  "Agarrar con fuerza": "Gripping tightly",
  "Movimientos finos (botones, escribir)": "Fine movements (buttons, writing)",
  "Dormir con el codo doblado": "Sleeping with elbow bent",
  "Golpe en la parte interna del codo": "Hit on the inner side of the elbow",
  "Ninguno en particular": "None in particular",
  "Extender el codo": "Extending the elbow",
  "Dejar de apoyar el codo": "Stopping leaning on the elbow",
  "Sacudir la mano": "Shaking the hand",
  Estirar: "Stretching",
  "Medicación": "Medication",
  "Nada lo alivia": "Nothing relieves it",
  Ninguna: "None",
  "Leve (puedo hacer casi todo)": "Mild (I can do almost everything)",
  "Moderada (limita algunas actividades)": "Moderate (limits some activities)",
  "Severa (limita bastante mi día a día)": "Severe (significantly limits my daily life)",
  "No puedo usar bien la mano": "I cannot use my hand properly",
  "No noto debilidad": "I don't notice weakness",
  "Dificultad para separar los dedos": "Difficulty spreading fingers apart",
  "Debilidad al agarrar con fuerza": "Weakness when gripping hard",
  "Dificultad con movimientos finos (llaves, botones)": "Difficulty with fine movements (keys, buttons)",
  "Se me caen cosas": "I drop things",
  "Garra del 4.º y 5.º dedo": "Claw of 4th and 5th finger",
  "Atrofia visible entre los nudillos (interóseos)": "Visible atrophy between knuckles (interossei)",
  "No afecta": "Does not affect",
  Parcialmente: "Partially",
  "No puedo entrenar o competir": "I can't train or compete",
  "Sí, electromiografía": "Yes, EMG",
  "Sí, resonancia": "Yes, MRI",
  "Sí, ecografía": "Yes, ultrasound",
  "Sí, varias": "Yes, multiple",
  "Debilidad progresiva en la mano": "Progressive weakness in the hand that gets worse every week",
  "Atrofia de los interóseos": "Have you noticed the muscles between your knuckles have sunken or flattened",
  "Deformidad en garra del 4.º y 5.º dedo": "Do the 4th and 5th fingers stay in a claw position (flexed, unable to fully extend)",
};

export const ULNAR_NERVE_SECTION_LABELS_EN: Record<string, string> = {
  red_flags: "Urgency check",
  core: "Problem characterization",
  nerve_pattern: "Ulnar nerve pattern",
  cervical_origin: "Cervical origin",
  elbow_history: "Elbow history",
  aggravating: "Aggravating factors & limitation",
  neurological: "Neurological assessment",
  history: "History & treatment",
};

export type ConsultLocale = "es" | "en";

export function localizeUlnarNerveLabel(id: string, fallback: string, locale: ConsultLocale): string {
  if (locale !== "en") return fallback;
  return ULNAR_NERVE_LABEL_EN[id] ?? fallback;
}

export function localizeUlnarNerveOption(option: string, locale: ConsultLocale): string {
  if (locale !== "en") return option;
  return ULNAR_NERVE_OPTION_EN[option] ?? option;
}

export function localizeUlnarNerveSection(section: string, locale: ConsultLocale): string {
  if (locale !== "en") return (ULNAR_NERVE_SECTION_LABELS as any)[section] ?? section;
  return ULNAR_NERVE_SECTION_LABELS_EN[section] ?? (ULNAR_NERVE_SECTION_LABELS as any)[section] ?? section;
}
