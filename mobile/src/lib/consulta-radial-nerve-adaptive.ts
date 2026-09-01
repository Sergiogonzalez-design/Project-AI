/**
 * Adaptive questionnaire for radial nerve (nervio radial) —
 * nerve-muscle category with two-option recommendation:
 * 1. Conservative (evidence-based exercises: neck/pectoral stretching on affected side,
 *    radial nerve neurodynamics)
 * 2. Specialized physiotherapy center (ultrasound-guided interventionism)
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

export const TINGLING_LOCATION_OPTIONS = [
  "Dorso del antebrazo",
  "Dorso de la mano",
  "Dorso del antebrazo + mano",
  "Pulgar e índice (cara dorsal)",
  "Todo el brazo por detrás",
  "No tengo hormigueo",
] as const;

export const SYMPTOM_TYPE_OPTIONS = [
  "Hormigueo",
  "Adormecimiento",
  "Quemazón",
  "Dolor en el antebrazo (cara posterior/lateral)",
  "Debilidad para extender la muñeca",
  "Debilidad para extender los dedos",
  "Muñeca caída (no puedo levantar la mano)",
  "Dolor en la cara externa del codo",
] as const;

export const SYMPTOM_TIMING_OPTIONS = [
  "Al apoyar el brazo / comprimir el antebrazo",
  "Tras dormir en mala postura (Saturday night palsy)",
  "Al extender la muñeca contra resistencia",
  "Al agarrar con la muñeca en extensión",
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

export const MECHANISM_OPTIONS = [
  "Compresión del brazo (dormir encima, muletas, brazo contra borde)",
  "Fractura de húmero",
  "Golpe directo en la cara externa del codo o antebrazo",
  "Movimiento repetitivo de muñeca (extensión/supinación)",
  "Inicio progresivo sin causa clara",
  "Otro",
] as const;

export const AGGRAVATING_OPTIONS = [
  "Extender la muñeca contra resistencia",
  "Agarrar objetos",
  "Girar el antebrazo (supinación)",
  "Apoyar el brazo sobre superficie dura",
  "Movimientos repetitivos de muñeca",
  "Escribir / usar ratón",
  "Ninguno en particular",
] as const;

export const RELIEVING_OPTIONS = [
  "Dejar de usar el brazo",
  "Estirar",
  "Cambiar de postura",
  "Medicación",
  "Muñequera / férula",
  "Nada lo alivia",
] as const;

export const FUNCTIONAL_LIMIT_OPTIONS = [
  "Ninguna",
  "Leve (puedo hacer casi todo)",
  "Moderada (limita algunas actividades)",
  "Severa (limita bastante mi día a día)",
  "No puedo usar bien el brazo/mano",
] as const;

export const WEAKNESS_OPTIONS = [
  "No noto debilidad",
  "Dificultad para extender la muñeca (muñeca caída)",
  "Dificultad para extender los dedos",
  "Debilidad al agarrar (por falta de extensión de muñeca)",
  "Dificultad para girar el antebrazo (supinar)",
  "Debilidad general en el brazo",
] as const;

export const TRAINING_IMPACT_OPTIONS = [
  "No afecta",
  "Parcialmente",
  "No puedo entrenar o competir",
] as const;

export type RadialNerveAdaptiveAnswers = {
  rf_muneca_caida: string;
  rf_debilidad_progresiva: string;
  rf_perdida_sensibilidad_completa: string;
  evolucion: string;
  inicio: string;
  mecanismo: string;
  mecanismo_otro: string;
  intensidad_sintomas: number;
  localizacion_hormigueo: string[];
  tipo_sintomas: string[];
  momento_sintomas: string[];
  brazo_afectado: string;
  diagnostico_cervical: string;
  diagnostico_cervical_otro: string;
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

export function defaultRadialNerveAdaptiveAnswers(): RadialNerveAdaptiveAnswers {
  return {
    rf_muneca_caida: "",
    rf_debilidad_progresiva: "",
    rf_perdida_sensibilidad_completa: "",
    evolucion: "",
    inicio: "",
    mecanismo: "",
    mecanismo_otro: "",
    intensidad_sintomas: 5,
    localizacion_hormigueo: [],
    tipo_sintomas: [],
    momento_sintomas: [],
    brazo_afectado: "",
    diagnostico_cervical: "",
    diagnostico_cervical_otro: "",
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

export type RadialNerveQuestionSection =
  | "red_flags"
  | "core"
  | "nerve_pattern"
  | "cervical_origin"
  | "aggravating"
  | "neurological"
  | "history";

export type RadialNerveQuestionDef = {
  id: keyof RadialNerveAdaptiveAnswers;
  section: RadialNerveQuestionSection;
  label: string;
  type: "single" | "multi" | "text" | "slider";
  options?: readonly string[];
  required?: boolean;
  showIf?: (a: RadialNerveAdaptiveAnswers) => boolean;
};

export const RADIAL_NERVE_QUESTIONS: RadialNerveQuestionDef[] = [
  // --- RED FLAGS ---
  {
    id: "rf_muneca_caida",
    section: "red_flags",
    label: "¿Tienes la muñeca caída (no puedes levantar la mano al extender el brazo)?",
    type: "single",
    options: YES_NO,
    required: true,
  },
  {
    id: "rf_debilidad_progresiva",
    section: "red_flags",
    label: "¿Debilidad progresiva que empeora cada día?",
    type: "single",
    options: YES_NO,
    required: true,
  },
  {
    id: "rf_perdida_sensibilidad_completa",
    section: "red_flags",
    label: "¿Pérdida total de sensibilidad en el dorso de la mano o antebrazo?",
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
    id: "mecanismo",
    section: "core",
    label: "¿Qué pudo provocarlo?",
    type: "single",
    options: MECHANISM_OPTIONS,
    required: true,
  },
  {
    id: "mecanismo_otro",
    section: "core",
    label: "Describe el mecanismo",
    type: "text",
    required: true,
    showIf: (a) => a.mecanismo === "Otro",
  },
  {
    id: "intensidad_sintomas",
    section: "core",
    label: "Intensidad de los síntomas (1–10)",
    type: "slider",
    required: true,
  },
  {
    id: "brazo_afectado",
    section: "core",
    label: "¿Qué brazo está afectado?",
    type: "single",
    options: ["Derecho", "Izquierdo", "Ambos"],
    required: true,
  },

  // --- NERVE PATTERN ---
  {
    id: "localizacion_hormigueo",
    section: "nerve_pattern",
    label: "¿Dónde notas hormigueo o adormecimiento? (puedes marcar varias)",
    type: "multi",
    options: TINGLING_LOCATION_OPTIONS,
    required: true,
  },
  {
    id: "tipo_sintomas",
    section: "nerve_pattern",
    label: "¿Qué sientes exactamente? (puedes marcar varias)",
    type: "multi",
    options: SYMPTOM_TYPE_OPTIONS,
    required: true,
  },
  {
    id: "momento_sintomas",
    section: "nerve_pattern",
    label: "¿Cuándo aparecen o empeoran los síntomas? (puedes marcar varias)",
    type: "multi",
    options: SYMPTOM_TIMING_OPTIONS,
    required: true,
  },

  // --- CERVICAL ORIGIN ---
  {
    id: "diagnostico_cervical",
    section: "cervical_origin",
    label: "¿Te han diagnosticado alguna lesión cervical a nivel C5, C6, C7 o una hernia cervical?",
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
    label: "¿Notas debilidad? ¿Dónde? (puedes marcar varias)",
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

export const RADIAL_NERVE_SECTION_LABELS: Record<RadialNerveQuestionSection, string> = {
  red_flags: "Comprobación de urgencia",
  core: "Caracterización del problema",
  nerve_pattern: "Patrón del nervio radial",
  cervical_origin: "Origen cervical",
  aggravating: "Factores agravantes y limitación",
  neurological: "Valoración neurológica",
  history: "Antecedentes y tratamiento",
};

export const RADIAL_NERVE_SECTION_ORDER: RadialNerveQuestionSection[] = [
  "red_flags",
  "core",
  "nerve_pattern",
  "cervical_origin",
  "aggravating",
  "neurological",
  "history",
];

export function getVisibleRadialNerveQuestions(
  answers: RadialNerveAdaptiveAnswers
): RadialNerveQuestionDef[] {
  return RADIAL_NERVE_QUESTIONS.filter((q) => !q.showIf || q.showIf(answers));
}

export function getVisibleRadialNerveSections(
  answers: RadialNerveAdaptiveAnswers
): RadialNerveQuestionSection[] {
  const visible = getVisibleRadialNerveQuestions(answers);
  return RADIAL_NERVE_SECTION_ORDER.filter((s) => visible.some((q) => q.section === s));
}

const RED_FLAG_IDS: (keyof RadialNerveAdaptiveAnswers)[] = [
  "rf_muneca_caida",
  "rf_debilidad_progresiva",
  "rf_perdida_sensibilidad_completa",
];

export function detectRadialNerveRedFlags(answers: RadialNerveAdaptiveAnswers): {
  urgent: boolean;
  triggered: string[];
} {
  const labels: Record<string, string> = {
    rf_muneca_caida: "Muñeca caída (wrist drop)",
    rf_debilidad_progresiva: "Debilidad progresiva",
    rf_perdida_sensibilidad_completa: "Pérdida total de sensibilidad dorso mano/antebrazo",
  };
  const triggered: string[] = [];
  for (const id of RED_FLAG_IDS) {
    if (answers[id] === "Sí") triggered.push(labels[id] ?? id);
  }
  return { urgent: triggered.length > 0, triggered };
}

export function detectRadialNerveSeverity(answers: RadialNerveAdaptiveAnswers): "high" | "moderate" | "mild" {
  if (
    answers.rf_muneca_caida === "Sí" ||
    answers.rf_perdida_sensibilidad_completa === "Sí" ||
    answers.debilidad.some((d) => d === "Dificultad para extender la muñeca (muñeca caída)")
  ) return "high";
  if (
    answers.momento_sintomas.includes("Constante") ||
    answers.debilidad.some((d) => d !== "No noto debilidad") ||
    hasRadialPattern(answers)
  ) return "moderate";
  return "mild";
}

function hasRadialPattern(a: RadialNerveAdaptiveAnswers): boolean {
  return (
    a.localizacion_hormigueo.includes("Dorso del antebrazo + mano") ||
    a.localizacion_hormigueo.includes("Dorso de la mano") ||
    (a.localizacion_hormigueo.includes("Dorso del antebrazo") &&
      a.tipo_sintomas.some((s) => s.includes("extender")))
  );
}

function hasCervicalDiagnosis(a: RadialNerveAdaptiveAnswers): boolean {
  return (
    a.diagnostico_cervical !== "" &&
    a.diagnostico_cervical !== "No tengo diagnóstico cervical" &&
    a.diagnostico_cervical !== "No lo sé / no me lo han dicho"
  );
}

function isAnswered(q: RadialNerveQuestionDef, answers: RadialNerveAdaptiveAnswers): boolean {
  const val = answers[q.id];
  if (q.type === "multi") return Array.isArray(val) && val.length > 0;
  if (q.type === "slider") return typeof val === "number" && val >= 1;
  if (q.type === "text") return typeof val === "string" && val.trim().length > 0;
  return typeof val === "string" && val.length > 0;
}

export function validateRadialNerveAdaptive(answers: RadialNerveAdaptiveAnswers): string | null {
  const visible = getVisibleRadialNerveQuestions(answers);
  for (const q of visible) {
    if (q.required !== false && !isAnswered(q, answers)) {
      return `Responde: ${q.label.replace(/\?$/, "")}.`;
    }
  }
  return null;
}

export function validateRadialNerveSection(
  section: RadialNerveQuestionSection,
  answers: RadialNerveAdaptiveAnswers
): string | null {
  const questions = getVisibleRadialNerveQuestions(answers).filter((q) => q.section === section);
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

export function formatRadialNerveAdaptive(answers: RadialNerveAdaptiveAnswers): string {
  const { urgent, triggered } = detectRadialNerveRedFlags(answers);
  const severity = detectRadialNerveSeverity(answers);
  const radialPattern = hasRadialPattern(answers);
  const cervical = hasCervicalDiagnosis(answers);

  const lines: string[] = [
    "=== CUESTIONARIO ADAPTATIVO — NERVIO RADIAL ===",
    "",
    "— BANDERAS ROJAS —",
    urgent
      ? `⚠️ SIGNOS DE ALARMA: ${triggered.join("; ")} → DERIVAR A ESPECIALISTA (valorar manejo urgente si hay wrist drop agudo)`
      : "Ninguna bandera roja marcada como Sí",
    `Muñeca caída: ${answers.rf_muneca_caida || "—"}`,
    `Debilidad progresiva: ${answers.rf_debilidad_progresiva || "—"}`,
    `Pérdida sensitiva completa: ${answers.rf_perdida_sensibilidad_completa || "—"}`,
    "",
    "— VARIABLES CLÍNICAS —",
    `Tiempo de evolución: ${answers.evolucion}`,
    `Forma de inicio: ${answers.inicio}`,
    `Mecanismo: ${answers.mecanismo}${answers.mecanismo === "Otro" && answers.mecanismo_otro ? ` (${answers.mecanismo_otro})` : ""}`,
    `Intensidad síntomas: ${answers.intensidad_sintomas}/10`,
    `Brazo afectado: ${answers.brazo_afectado}`,
    "",
    "— PATRÓN DEL NERVIO RADIAL —",
    `Localización hormigueo: ${formatMulti(answers.localizacion_hormigueo)}`,
    `Tipo de síntomas: ${formatMulti(answers.tipo_sintomas)}`,
    `Cuándo aparecen: ${formatMulti(answers.momento_sintomas)}`,
    radialPattern
      ? "✓ PATRÓN CLÁSICO DEL NERVIO RADIAL: hormigueo/adormecimiento en dorso del antebrazo y/o mano"
      : "",
    "",
    "— ORIGEN CERVICAL —",
    `Diagnóstico cervical: ${answers.diagnostico_cervical}${answers.diagnostico_cervical_otro ? ` (${answers.diagnostico_cervical_otro})` : ""}`,
    `Pruebas previas: ${answers.pruebas_previas}${answers.pruebas_previas_detalle ? ` — ${answers.pruebas_previas_detalle}` : ""}`,
  ];

  if (cervical) {
    lines.push(
      "",
      "— CORRELACIÓN CERVICAL-RADIAL —",
      "Si tienes una lesión cervical a nivel C5-C6, C6-C7 o C7-T1, es probable que el nervio radial se esté viendo comprometido.",
      "Puede tratarse de una radiculopatía cervical, un atrapamiento periférico (arcada de Frohse / canal radial) o ambos (double crush syndrome)."
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
    `Debilidad: ${formatMulti(answers.debilidad)}`,
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
    "Busca y recomienda ejercicios específicos para el nervio radial respaldados por evidencia.",
    "Incluye obligatoriamente:",
    "- Estiramientos de cuello (escalenos, esternocleidomastoideo, trapecio superior) del lado afectado",
    "- Estiramientos de pectoral menor y mayor del lado correspondiente para descomprimir el plexo braquial",
    "- Neurodinámica del nervio radial (radial nerve sliders/tensioners — ULNT2b)",
    "- Movilización de la articulación del codo en pronación/supinación",
    "- Si hay componente cervical, incluir movilización neural desde cervical",
    "Adapta la progresión según la severidad y el tiempo de evolución.",
    "",
    "OPCIÓN 2 — CENTRO ESPECIALIZADO:",
    "Recomienda acudir a un centro de fisioterapia especializado en intervencionismo ecoguiado",
    "(electrólisis percutánea ecoguiada, neuromodulación percutánea, punción seca) para valorar el caso.",
    "Indica que un profesional puede realizar técnicas dirigidas al nervio radial,",
    "la arcada de Frohse, el supinador corto y la musculatura extensora del antebrazo bajo control ecográfico.",
    "",
    "NOTA: El sistema recopila variables clínicas para estimar el compromiso del nervio radial, no para diagnosticar.",
    "Si la severidad es HIGH o hay muñeca caída, enfatiza la derivación urgente a especialista."
  );

  return lines.filter(Boolean).join("\n");
}

export function isLastRadialNerveSection(
  answers: RadialNerveAdaptiveAnswers,
  sectionIndex: number
): boolean {
  const sections = getVisibleRadialNerveSections(answers);
  return sectionIndex >= sections.length - 1;
}

// --- English translations ---

export const RADIAL_NERVE_LABEL_EN: Partial<Record<string, string>> = {
  rf_muneca_caida: "Do you have wrist drop (cannot lift the hand when the arm is extended)?",
  rf_debilidad_progresiva: "Progressive weakness that gets worse every day?",
  rf_perdida_sensibilidad_completa: "Complete loss of sensation on the back of the hand or forearm?",
  evolucion: "How long have you had these symptoms?",
  inicio: "How did it start?",
  mecanismo: "What may have caused it?",
  mecanismo_otro: "Describe the mechanism",
  intensidad_sintomas: "Symptom intensity (1–10)",
  brazo_afectado: "Which arm is affected?",
  localizacion_hormigueo: "Where do you notice tingling or numbness? (you can select several)",
  tipo_sintomas: "What exactly do you feel? (you can select several)",
  momento_sintomas: "When do symptoms appear or worsen? (you can select several)",
  diagnostico_cervical: "Have you been diagnosed with a cervical condition at C5, C6, C7 or a cervical herniation?",
  diagnostico_cervical_otro: "Specify the cervical diagnosis",
  pruebas_previas: "Have you had tests (EMG, MRI, ultrasound)?",
  pruebas_previas_detalle: "What did the tests show? (if you remember)",
  agravantes: "What worsens your symptoms? (you can select several)",
  aliviantes: "What relieves them? (you can select several)",
  limitacion_funcional: "How much does it limit you day to day?",
  debilidad: "Do you notice weakness? Where? (you can select several)",
  tratamiento_previo: "Have you received previous treatment for this?",
  tratamiento_previo_detalle: "What treatment did you receive and how did it go?",
  deporte_impacto: "How does it affect your training or sport?",
};

export const RADIAL_NERVE_OPTION_EN = {
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
  Derecho: "Right",
  Izquierdo: "Left",
  Ambos: "Both",
  "Dorso del antebrazo": "Back of the forearm",
  "Dorso de la mano": "Back of the hand",
  "Dorso del antebrazo + mano": "Back of the forearm + hand",
  "Pulgar e índice (cara dorsal)": "Thumb and index finger (dorsal side)",
  "Todo el brazo por detrás": "Entire back of the arm",
  "No tengo hormigueo": "I don't have tingling",
  Hormigueo: "Tingling",
  Adormecimiento: "Numbness",
  "Quemazón": "Burning",
  "Dolor en el antebrazo (cara posterior/lateral)": "Pain in the forearm (back/lateral side)",
  "Debilidad para extender la muñeca": "Weakness extending the wrist",
  "Debilidad para extender los dedos": "Weakness extending the fingers",
  "Muñeca caída (no puedo levantar la mano)": "Wrist drop (cannot lift the hand)",
  "Dolor en la cara externa del codo": "Pain on the outer side of the elbow",
  "Al apoyar el brazo / comprimir el antebrazo": "When leaning on the arm / compressing the forearm",
  "Tras dormir en mala postura (Saturday night palsy)": "After sleeping in a bad position (Saturday night palsy)",
  "Al extender la muñeca contra resistencia": "When extending the wrist against resistance",
  "Al agarrar con la muñeca en extensión": "When gripping with the wrist extended",
  Constante: "Constant",
  "Intermitente sin patrón claro": "Intermittent with no clear pattern",
  "Hernia o protrusión cervical C5-C6": "Cervical herniation/bulge C5-C6",
  "Hernia o protrusión cervical C6-C7": "Cervical herniation/bulge C6-C7",
  "Hernia o protrusión cervical C7-T1": "Cervical herniation/bulge C7-T1",
  "Estenosis cervical": "Cervical stenosis",
  "Otra lesión cervical (especificar)": "Other cervical condition (specify)",
  "No tengo diagnóstico cervical": "No cervical diagnosis",
  "No lo sé / no me lo han dicho": "I don't know / was not told",
  "Compresión del brazo (dormir encima, muletas, brazo contra borde)": "Arm compression (sleeping on it, crutches, arm against an edge)",
  "Fractura de húmero": "Humerus fracture",
  "Golpe directo en la cara externa del codo o antebrazo": "Direct blow to the outer elbow or forearm",
  "Movimiento repetitivo de muñeca (extensión/supinación)": "Repetitive wrist movement (extension/supination)",
  "Inicio progresivo sin causa clara": "Gradual onset with no clear cause",
  Otro: "Other",
  "Extender la muñeca contra resistencia": "Extending the wrist against resistance",
  "Agarrar objetos": "Gripping objects",
  "Girar el antebrazo (supinación)": "Turning the forearm (supination)",
  "Apoyar el brazo sobre superficie dura": "Leaning the arm on a hard surface",
  "Movimientos repetitivos de muñeca": "Repetitive wrist movements",
  "Escribir / usar ratón": "Typing / using the mouse",
  "Ninguno en particular": "None in particular",
  "Dejar de usar el brazo": "Stopping arm use",
  Estirar: "Stretching",
  "Cambiar de postura": "Changing position",
  "Medicación": "Medication",
  "Muñequera / férula": "Wrist brace / splint",
  "Nada lo alivia": "Nothing relieves it",
  Ninguna: "None",
  "Leve (puedo hacer casi todo)": "Mild (I can do almost everything)",
  "Moderada (limita algunas actividades)": "Moderate (limits some activities)",
  "Severa (limita bastante mi día a día)": "Severe (significantly limits my daily life)",
  "No puedo usar bien el brazo/mano": "I cannot use my arm/hand properly",
  "No noto debilidad": "I don't notice weakness",
  "Dificultad para extender la muñeca (muñeca caída)": "Difficulty extending the wrist (wrist drop)",
  "Dificultad para extender los dedos": "Difficulty extending the fingers",
  "Debilidad al agarrar (por falta de extensión de muñeca)": "Weakness gripping (due to lack of wrist extension)",
  "Dificultad para girar el antebrazo (supinar)": "Difficulty turning the forearm (supinating)",
  "Debilidad general en el brazo": "General weakness in the arm",
  "No afecta": "Does not affect",
  Parcialmente: "Partially",
  "No puedo entrenar o competir": "I can't train or compete",
  "Sí, electromiografía": "Yes, EMG",
  "Sí, resonancia": "Yes, MRI",
  "Sí, ecografía": "Yes, ultrasound",
  "Sí, varias": "Yes, multiple",
  "Muñeca caída (wrist drop)": "Do you have wrist drop (cannot lift the hand when the arm is extended)",
  "Debilidad progresiva": "Progressive weakness that gets worse every day",
  "Pérdida total de sensibilidad dorso mano/antebrazo": "Complete loss of sensation on the back of the hand or forearm",
};

export const RADIAL_NERVE_SECTION_LABELS_EN: Record<string, string> = {
  red_flags: "Urgency check",
  core: "Problem characterization",
  nerve_pattern: "Radial nerve pattern",
  cervical_origin: "Cervical origin",
  aggravating: "Aggravating factors & limitation",
  neurological: "Neurological assessment",
  history: "History & treatment",
};

export type ConsultLocale = "es" | "en";

export function localizeRadialNerveLabel(id: string, fallback: string, locale: ConsultLocale): string {
  if (locale !== "en") return fallback;
  return RADIAL_NERVE_LABEL_EN[id] ?? fallback;
}

export function localizeRadialNerveOption(option: string, locale: ConsultLocale): string {
  if (locale !== "en") return option;
  return RADIAL_NERVE_OPTION_EN[option] ?? option;
}

export function localizeRadialNerveSection(section: string, locale: ConsultLocale): string {
  if (locale !== "en") return (RADIAL_NERVE_SECTION_LABELS as any)[section] ?? section;
  return RADIAL_NERVE_SECTION_LABELS_EN[section] ?? (RADIAL_NERVE_SECTION_LABELS as any)[section] ?? section;
}
