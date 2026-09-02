/**
 * Adaptive questionnaire for sciatic nerve (ciático) —
 * nerve-muscle category with two-option recommendation:
 * 1. Conservative (evidence-based exercises, e.g. sciatic neurodynamics)
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

export const PAIN_CHARACTER_OPTIONS = [
  "Dolor constante",
  "Hormigueo",
  "Quemazón",
  "Descarga eléctrica",
  "Entumecimiento",
  "Presión profunda",
  "Pulsátil",
] as const;

export const PAIN_DISTRIBUTION_OPTIONS = [
  "Parte posterior del muslo",
  "Parte posterior del muslo + pantorrilla",
  "Hasta el pie",
  "Glúteo solamente",
  "Glúteo + parte posterior del muslo",
  "Parte lateral de la pierna",
  "No estoy seguro",
] as const;

export const LUMBAR_DIAGNOSIS_OPTIONS = [
  "Hernia discal L4-L5",
  "Hernia discal L5-S1",
  "Protrusión discal L4-L5",
  "Protrusión discal L5-S1",
  "Estenosis lumbar",
  "Otra lesión lumbar (especificar)",
  "No tengo diagnóstico lumbar",
  "No lo sé / no me lo han dicho",
] as const;

export const AGGRAVATING_OPTIONS = [
  "Sentarse mucho rato",
  "Estar de pie",
  "Caminar",
  "Agacharse / flexionar la espalda",
  "Toser o estornudar",
  "Conducir",
  "Levantar peso",
  "Por la noche / al acostarse",
  "Ninguno en particular",
] as const;

export const RELIEVING_OPTIONS = [
  "Caminar un poco",
  "Tumbarse",
  "Cambiar de postura",
  "Estirar",
  "Medicación",
  "Calor local",
  "Nada lo alivia",
] as const;

export const FUNCTIONAL_LIMIT_OPTIONS = [
  "Ninguna",
  "Leve (puedo hacer casi todo)",
  "Moderada (limita algunas actividades)",
  "Severa (limita bastante mi día a día)",
  "No puedo llevar vida normal",
] as const;

export const WEAKNESS_AREA_OPTIONS = [
  "No noto debilidad",
  "Pie caído (dificultad para levantar el pie)",
  "Debilidad al caminar de puntillas",
  "Debilidad al subir escaleras",
  "Debilidad general en la pierna",
] as const;

export const TRAINING_IMPACT_OPTIONS = [
  "No afecta",
  "Parcialmente",
  "No puedo entrenar o competir",
] as const;

export type SciaticAdaptiveAnswers = {
  rf_perdida_esfinteres: string;
  rf_anestesia_silla_montar: string;
  rf_debilidad_progresiva: string;
  rf_fiebre_perdida_peso: string;
  rf_pie_caido_subito: string;
  evolucion: string;
  inicio: string;
  intensidad_dolor: number;
  caracter_dolor: string[];
  distribucion_dolor: string;
  llega_pie: string;
  diagnostico_lumbar: string;
  diagnostico_lumbar_otro: string;
  agravantes: string[];
  aliviantes: string[];
  limitacion_funcional: string[];
  debilidad: string[];
  entumecimiento_constante: string;
  pierna_afectada: string;
  tratamiento_previo: string;
  tratamiento_previo_detalle: string;
  pruebas_imagen: string;
  pruebas_imagen_detalle: string;
  deporte_impacto: string;
};

export function defaultSciaticAdaptiveAnswers(): SciaticAdaptiveAnswers {
  return {
    rf_perdida_esfinteres: "",
    rf_anestesia_silla_montar: "",
    rf_debilidad_progresiva: "",
    rf_fiebre_perdida_peso: "",
    rf_pie_caido_subito: "",
    evolucion: "",
    inicio: "",
    intensidad_dolor: 5,
    caracter_dolor: [],
    distribucion_dolor: "",
    llega_pie: "",
    diagnostico_lumbar: "",
    diagnostico_lumbar_otro: "",
    agravantes: [],
    aliviantes: [],
    limitacion_funcional: [],
    debilidad: [],
    entumecimiento_constante: "",
    pierna_afectada: "",
    tratamiento_previo: "",
    tratamiento_previo_detalle: "",
    pruebas_imagen: "",
    pruebas_imagen_detalle: "",
    deporte_impacto: "",
  };
}

export type SciaticQuestionSection =
  | "red_flags"
  | "core"
  | "nerve_distribution"
  | "lumbar_origin"
  | "aggravating"
  | "neurological"
  | "history";

export type SciaticQuestionDef = {
  id: keyof SciaticAdaptiveAnswers;
  section: SciaticQuestionSection;
  label: string;
  type: "single" | "multi" | "text" | "slider";
  options?: readonly string[];
  required?: boolean;
  showIf?: (a: SciaticAdaptiveAnswers) => boolean;
};

export const SCIATIC_QUESTIONS: SciaticQuestionDef[] = [
  // --- RED FLAGS (cauda equina / serious) ---
  {
    id: "rf_perdida_esfinteres",
    section: "red_flags",
    label: "¿Problemas nuevos para controlar orina o heces?",
    type: "single",
    options: YES_NO,
    required: true,
  },
  {
    id: "rf_anestesia_silla_montar",
    section: "red_flags",
    label: "¿Pérdida de sensibilidad en la zona perineal / entrepierna (anestesia en silla de montar)?",
    type: "single",
    options: YES_NO,
    required: true,
  },
  {
    id: "rf_debilidad_progresiva",
    section: "red_flags",
    label: "¿Debilidad progresiva (que empeora cada día) en ambas piernas?",
    type: "single",
    options: YES_NO,
    required: true,
  },
  {
    id: "rf_fiebre_perdida_peso",
    section: "red_flags",
    label: "¿Fiebre, pérdida de peso inexplicable o antecedente de cáncer?",
    type: "single",
    options: YES_NO,
    required: true,
  },
  {
    id: "rf_pie_caido_subito",
    section: "red_flags",
    label: "¿Pie caído de forma repentina (no puedes levantar el pie al caminar)?",
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
    id: "intensidad_dolor",
    section: "core",
    label: "Intensidad del dolor (1–10)",
    type: "slider",
    required: true,
  },
  {
    id: "caracter_dolor",
    section: "core",
    label: "¿Cómo describirías lo que sientes? (puedes marcar varias)",
    type: "multi",
    options: PAIN_CHARACTER_OPTIONS,
    required: true,
  },
  {
    id: "pierna_afectada",
    section: "core",
    label: "¿Qué pierna está afectada?",
    type: "single",
    options: ["Derecha", "Izquierda", "Ambas"],
    required: true,
  },

  // --- NERVE DISTRIBUTION ---
  {
    id: "distribucion_dolor",
    section: "nerve_distribution",
    label: "¿Hasta dónde baja el dolor o el hormigueo?",
    type: "single",
    options: PAIN_DISTRIBUTION_OPTIONS,
    required: true,
  },
  {
    id: "llega_pie",
    section: "nerve_distribution",
    label: "¿El dolor, hormigueo o entumecimiento llega hasta el pie o los dedos?",
    type: "single",
    options: YES_NO,
    required: true,
  },
  {
    id: "entumecimiento_constante",
    section: "nerve_distribution",
    label: "¿El hormigueo o entumecimiento es constante (todo el día)?",
    type: "single",
    options: ["No, va y viene", "Sí, es constante"],
    required: true,
  },

  // --- LUMBAR ORIGIN ---
  {
    id: "diagnostico_lumbar",
    section: "lumbar_origin",
    label: "¿Te han diagnosticado alguna lesión lumbar (hernia, protrusión, estenosis)?",
    type: "single",
    options: LUMBAR_DIAGNOSIS_OPTIONS,
    required: true,
  },
  {
    id: "diagnostico_lumbar_otro",
    section: "lumbar_origin",
    label: "Especifica el diagnóstico lumbar",
    type: "text",
    required: true,
    showIf: (a) => a.diagnostico_lumbar === "Otra lesión lumbar (especificar)",
  },
  {
    id: "pruebas_imagen",
    section: "lumbar_origin",
    label: "¿Te han hecho pruebas de imagen (resonancia, TAC)?",
    type: "single",
    options: ["No", "Sí, resonancia magnética", "Sí, TAC", "Sí, ambas"],
    required: true,
  },
  {
    id: "pruebas_imagen_detalle",
    section: "lumbar_origin",
    label: "¿Qué mostraron las pruebas? (si lo recuerdas)",
    type: "text",
    required: false,
    showIf: (a) => a.pruebas_imagen !== "No" && a.pruebas_imagen !== "",
  },

  // --- AGGRAVATING / RELIEVING ---
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
    options: WEAKNESS_AREA_OPTIONS,
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

export const SCIATIC_SECTION_LABELS: Record<SciaticQuestionSection, string> = {
  red_flags: "Comprobación de urgencia",
  core: "Caracterización del problema",
  nerve_distribution: "Distribución del nervio",
  lumbar_origin: "Origen lumbar",
  aggravating: "Factores agravantes y limitación",
  neurological: "Valoración neurológica",
  history: "Antecedentes y tratamiento",
};

export const SCIATIC_SECTION_ORDER: SciaticQuestionSection[] = [
  "red_flags",
  "core",
  "nerve_distribution",
  "lumbar_origin",
  "aggravating",
  "neurological",
  "history",
];

export function getVisibleSciaticQuestions(
  answers: SciaticAdaptiveAnswers
): SciaticQuestionDef[] {
  return SCIATIC_QUESTIONS.filter((q) => !q.showIf || q.showIf(answers));
}

export function getVisibleSciaticSections(
  answers: SciaticAdaptiveAnswers
): SciaticQuestionSection[] {
  const visible = getVisibleSciaticQuestions(answers);
  return SCIATIC_SECTION_ORDER.filter((s) => visible.some((q) => q.section === s));
}

const RED_FLAG_IDS: (keyof SciaticAdaptiveAnswers)[] = [
  "rf_perdida_esfinteres",
  "rf_anestesia_silla_montar",
  "rf_debilidad_progresiva",
  "rf_fiebre_perdida_peso",
  "rf_pie_caido_subito",
];

export function detectSciaticRedFlags(answers: SciaticAdaptiveAnswers): {
  urgent: boolean;
  triggered: string[];
} {
  const labels: Record<string, string> = {
    rf_perdida_esfinteres: "Pérdida de control de esfínteres",
    rf_anestesia_silla_montar: "Anestesia en silla de montar",
    rf_debilidad_progresiva: "Debilidad progresiva bilateral",
    rf_fiebre_perdida_peso: "Fiebre / pérdida de peso / antecedente oncológico",
    rf_pie_caido_subito: "Pie caído súbito",
  };
  const triggered: string[] = [];
  for (const id of RED_FLAG_IDS) {
    if (answers[id] === "Sí") triggered.push(labels[id] ?? id);
  }
  return { urgent: triggered.length > 0, triggered };
}

export function detectSciaticSeverity(answers: SciaticAdaptiveAnswers): "high" | "moderate" | "mild" {
  if (answers.llega_pie === "Sí") return "high";
  if (
    answers.entumecimiento_constante === "Sí, es constante" ||
    answers.debilidad.some((d) => d !== "No noto debilidad")
  ) return "high";
  if (
    answers.distribucion_dolor === "Parte posterior del muslo + pantorrilla" ||
    answers.distribucion_dolor === "Hasta el pie"
  ) return "moderate";
  return "mild";
}

function hasLumbarDiagnosis(a: SciaticAdaptiveAnswers): boolean {
  return (
    a.diagnostico_lumbar !== "" &&
    a.diagnostico_lumbar !== "No tengo diagnóstico lumbar" &&
    a.diagnostico_lumbar !== "No lo sé / no me lo han dicho"
  );
}

function isAnswered(q: SciaticQuestionDef, answers: SciaticAdaptiveAnswers): boolean {
  const val = answers[q.id];
  if (q.type === "multi") return Array.isArray(val) && val.length > 0;
  if (q.type === "slider") return typeof val === "number" && val >= 1;
  if (q.type === "text") return typeof val === "string" && val.trim().length > 0;
  return typeof val === "string" && val.length > 0;
}

export function validateSciaticAdaptive(answers: SciaticAdaptiveAnswers): string | null {
  const visible = getVisibleSciaticQuestions(answers);
  for (const q of visible) {
    if (q.required !== false && !isAnswered(q, answers)) {
      return `Responde: ${q.label.replace(/\?$/, "")}.`;
    }
  }
  return null;
}

export function validateSciaticSection(
  section: SciaticQuestionSection,
  answers: SciaticAdaptiveAnswers
): string | null {
  const questions = getVisibleSciaticQuestions(answers).filter((q) => q.section === section);
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

export function formatSciaticAdaptive(answers: SciaticAdaptiveAnswers): string {
  const { urgent, triggered } = detectSciaticRedFlags(answers);
  const severity = detectSciaticSeverity(answers);
  const lines: string[] = [
    "=== CUESTIONARIO ADAPTATIVO — NERVIO CIÁTICO ===",
    "",
    "— BANDERAS ROJAS (síndrome de cauda equina / urgencia) —",
    urgent
      ? `⚠️ URGENCIA DETECTADA: ${triggered.join("; ")} → DERIVAR A URGENCIAS INMEDIATAMENTE`
      : "Ninguna bandera roja marcada como Sí",
    `Control esfínteres: ${answers.rf_perdida_esfinteres || "—"}`,
    `Anestesia silla de montar: ${answers.rf_anestesia_silla_montar || "—"}`,
    `Debilidad progresiva bilateral: ${answers.rf_debilidad_progresiva || "—"}`,
    `Fiebre / pérdida de peso / cáncer: ${answers.rf_fiebre_perdida_peso || "—"}`,
    `Pie caído súbito: ${answers.rf_pie_caido_subito || "—"}`,
    "",
    "— VARIABLES CLÍNICAS —",
    `Tiempo de evolución: ${answers.evolucion}`,
    `Forma de inicio: ${answers.inicio}`,
    `Intensidad dolor: ${answers.intensidad_dolor}/10`,
    `Carácter del dolor: ${formatMulti(answers.caracter_dolor)}`,
    `Pierna afectada: ${answers.pierna_afectada}`,
    "",
    "— DISTRIBUCIÓN NERVIOSA —",
    `Hasta dónde baja: ${answers.distribucion_dolor}`,
    `Llega hasta el pie: ${answers.llega_pie}`,
    `Entumecimiento constante: ${answers.entumecimiento_constante}`,
    "",
    "— ORIGEN LUMBAR —",
    `Diagnóstico lumbar: ${answers.diagnostico_lumbar}${answers.diagnostico_lumbar_otro ? ` (${answers.diagnostico_lumbar_otro})` : ""}`,
    `Pruebas de imagen: ${answers.pruebas_imagen}${answers.pruebas_imagen_detalle ? ` — ${answers.pruebas_imagen_detalle}` : ""}`,
  ];

  if (hasLumbarDiagnosis(answers)) {
    lines.push(
      "",
      "— CORRELACIÓN LUMBAR-CIÁTICO —",
      "Si tienes una lesión lumbar a nivel L4-L5 o L5-S1, es probable que tu nervio ciático se esté viendo comprometido."
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
    "Busca y recomienda ejercicios específicos para ciática respaldados por evidencia científica.",
    "Incluye obligatoriamente: neurodinámica del nervio ciático (sciatic nerve neurodynamics/sliders/tensioners).",
    "Adapta la progresión según la severidad y el tiempo de evolución.",
    "",
    "OPCIÓN 2 — CENTRO ESPECIALIZADO:",
    "Recomienda acudir a un centro de fisioterapia especializado en terapias invasivas",
    "(punción seca, electrólisis percutánea, neuromodulación) para valorar el caso.",
    "Indica que un profesional puede realizar técnicas dirigidas al nervio ciático y la musculatura asociada.",
    "",
    "NOTA: El sistema recopila variables clínicas para estimar el compromiso del nervio ciático, no para diagnosticar.",
    "Si la severidad es HIGH o hay lesión lumbar confirmada, enfatiza la importancia de valoración presencial."
  );

  return lines.join("\n");
}

export function isLastSciaticSection(
  answers: SciaticAdaptiveAnswers,
  sectionIndex: number
): boolean {
  const sections = getVisibleSciaticSections(answers);
  return sectionIndex >= sections.length - 1;
}

// --- English translations ---

export const SCIATIC_LABEL_EN: Partial<Record<string, string>> = {
  rf_perdida_esfinteres: "New problems controlling bladder or bowel?",
  rf_anestesia_silla_montar: "Loss of sensation in the perineal / saddle area?",
  rf_debilidad_progresiva: "Progressive weakness (getting worse every day) in both legs?",
  rf_fiebre_perdida_peso: "Fever, unexplained weight loss, or history of cancer?",
  rf_pie_caido_subito: "Sudden foot drop (cannot lift foot when walking)?",
  evolucion: "How long have you had these symptoms?",
  inicio: "How did it start?",
  intensidad_dolor: "Pain intensity (1–10)",
  caracter_dolor: "How would you describe what you feel? (you can select several)",
  pierna_afectada: "Which leg is affected?",
  distribucion_dolor: "How far down does the pain or tingling go?",
  llega_pie: "Does the pain, tingling, or numbness reach the foot or toes?",
  entumecimiento_constante: "Is the tingling or numbness constant (all day)?",
  diagnostico_lumbar: "Have you been diagnosed with a lumbar condition (herniation, bulge, stenosis)?",
  diagnostico_lumbar_otro: "Specify the lumbar diagnosis",
  pruebas_imagen: "Have you had imaging tests (MRI, CT)?",
  pruebas_imagen_detalle: "What did the tests show? (if you remember)",
  agravantes: "What worsens your symptoms? (you can select several)",
  aliviantes: "What relieves them? (you can select several)",
  limitacion_funcional: "How much does it limit you day to day?",
  debilidad: "Do you notice weakness? Where? (you can select several)",
  tratamiento_previo: "Have you received previous treatment for this?",
  tratamiento_previo_detalle: "What treatment did you receive and how did it go?",
  deporte_impacto: "How does it affect your training or sport?",
};

export const SCIATIC_OPTION_EN = {
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
  "Dolor constante": "Constant pain",
  Hormigueo: "Tingling",
  Quemazón: "Burning",
  "Descarga eléctrica": "Electric shock",
  Entumecimiento: "Numbness",
  "Presión profunda": "Deep pressure",
  Pulsátil: "Throbbing",
  "Parte posterior del muslo": "Back of the thigh",
  "Parte posterior del muslo + pantorrilla": "Back of the thigh + calf",
  "Hasta el pie": "Down to the foot",
  "Glúteo solamente": "Buttock only",
  "Glúteo + parte posterior del muslo": "Buttock + back of the thigh",
  "Parte lateral de la pierna": "Side of the leg",
  "No estoy seguro": "I'm not sure",
  "Hernia discal L4-L5": "Disc herniation L4-L5",
  "Hernia discal L5-S1": "Disc herniation L5-S1",
  "Protrusión discal L4-L5": "Disc bulge L4-L5",
  "Protrusión discal L5-S1": "Disc bulge L5-S1",
  "Estenosis lumbar": "Lumbar stenosis",
  "Otra lesión lumbar (especificar)": "Other lumbar condition (specify)",
  "No tengo diagnóstico lumbar": "No lumbar diagnosis",
  "No lo sé / no me lo han dicho": "I don't know / was not told",
  "Sentarse mucho rato": "Sitting for a long time",
  "Estar de pie": "Standing",
  Caminar: "Walking",
  "Agacharse / flexionar la espalda": "Bending / flexing the back",
  "Toser o estornudar": "Coughing or sneezing",
  Conducir: "Driving",
  "Levantar peso": "Lifting weight",
  "Por la noche / al acostarse": "At night / lying down",
  "Ninguno en particular": "None in particular",
  "Caminar un poco": "Walking a little",
  Tumbarse: "Lying down",
  "Cambiar de postura": "Changing position",
  Estirar: "Stretching",
  Medicación: "Medication",
  "Calor local": "Local heat",
  "Nada lo alivia": "Nothing relieves it",
  Ninguna: "None",
  "Leve (puedo hacer casi todo)": "Mild (I can do almost everything)",
  "Moderada (limita algunas actividades)": "Moderate (limits some activities)",
  "Severa (limita bastante mi día a día)": "Severe (significantly limits my daily life)",
  "No puedo llevar vida normal": "I cannot lead a normal life",
  "No noto debilidad": "I don't notice weakness",
  "Pie caído (dificultad para levantar el pie)": "Foot drop (difficulty lifting the foot)",
  "Debilidad al caminar de puntillas": "Weakness when walking on tiptoes",
  "Debilidad al subir escaleras": "Weakness climbing stairs",
  "Debilidad general en la pierna": "General weakness in the leg",
  Derecha: "Right",
  Izquierda: "Left",
  Ambas: "Both",
  "No afecta": "Does not affect",
  Parcialmente: "Partially",
  "No puedo entrenar o competir": "I can't train or compete",
  "No, va y viene": "No, it comes and goes",
  "Sí, es constante": "Yes, it's constant",
  "Sí, resonancia magnética": "Yes, MRI",
  "Sí, TAC": "Yes, CT scan",
  "Sí, ambas": "Yes, both",
  "Pérdida de control de esfínteres": "New problems controlling bladder or bowel",
  "Anestesia en silla de montar": "Loss of sensation in the perineal / saddle area",
  "Debilidad progresiva bilateral": "Progressive weakness (getting worse every day) in both legs",
  "Fiebre / pérdida de peso / antecedente oncológico": "Fever, unexplained weight loss, or history of cancer",
  "Pie caído súbito": "Sudden foot drop (cannot lift foot when walking)",
};

export const SCIATIC_SECTION_LABELS_EN: Record<string, string> = {
  red_flags: "Urgency check",
  core: "Problem characterization",
  nerve_distribution: "Nerve distribution",
  lumbar_origin: "Lumbar origin",
  aggravating: "Aggravating factors & limitation",
  neurological: "Neurological assessment",
  history: "History & treatment",
};

export type ConsultLocale = "es" | "en";

export function localizeSciaticLabel(id: string, fallback: string, locale: ConsultLocale): string {
  if (locale !== "en") return fallback;
  return SCIATIC_LABEL_EN[id] ?? fallback;
}

export function localizeSciaticOption(option: string, locale: ConsultLocale): string {
  if (locale !== "en") return option;
  return SCIATIC_OPTION_EN[option as keyof typeof SCIATIC_OPTION_EN] ?? option;
}

export function localizeSciaticSection(section: string, locale: ConsultLocale): string {
  if (locale !== "en") return (SCIATIC_SECTION_LABELS as any)[section] ?? section;
  return SCIATIC_SECTION_LABELS_EN[section] ?? (SCIATIC_SECTION_LABELS as any)[section] ?? section;
}
