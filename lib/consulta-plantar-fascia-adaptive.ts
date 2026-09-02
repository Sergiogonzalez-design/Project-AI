/**
 * Adaptive questionnaire for plantar fascia / Baxter nerve —
 * nerve-muscle category with progressive recommendation:
 * 1. Conservative (evidence-based exercises: fascia stretching, tennis/golf ball rolling,
 *    toe stretches, calf strengthening)
 * 2. If persists after 1 week → ultrasound; if still persists → specialist
 *    who also assesses hip/ankle mobility (often contributing factors)
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
  "Más de 6 meses",
] as const;

export const ONSET_FORM_OPTIONS = ["Repentino", "Progresivo"] as const;

export const PAIN_LOCATION_OPTIONS = [
  "Debajo del talón (inserción de la fascia)",
  "Arco plantar (zona media de la planta)",
  "Toda la planta del pie",
  "Hacia los dedos",
  "Cara interna del talón",
  "No estoy seguro",
] as const;

export const PAIN_TRIGGER_OPTIONS = [
  "Al estirar los dedos del pie hacia atrás (dorsiflexión)",
  "Al caminar los primeros pasos al despertar",
  "Después de estar sentado mucho rato y levantarse",
  "Al caminar mucho rato",
  "Al correr",
  "Al estar de pie mucho tiempo",
  "Al final del día",
  "Al subir escaleras o ponerse de puntillas",
] as const;

export const FOOTWEAR_OPTIONS = [
  "Ando mucho descalzo",
  "Uso zapatillas planas (sin soporte de arco)",
  "Uso tacones frecuentemente",
  "Uso calzado deportivo con buen soporte",
  "Uso chanclas / sandalias planas habitualmente",
  "Uso plantillas ortopédicas",
] as const;

export const AGGRAVATING_OPTIONS = [
  "Caminar descalzo",
  "Correr",
  "Estar de pie muchas horas",
  "Calzado plano / sin soporte",
  "Subir escaleras",
  "Saltar",
  "Caminar en superficies duras",
  "Ninguno en particular",
] as const;

export const RELIEVING_OPTIONS = [
  "Descansar / sentarse",
  "Calzado con soporte de arco",
  "Estirar la planta del pie",
  "Hielo local",
  "Rodar pelota bajo el pie",
  "Medicación",
  "Plantillas",
  "Nada lo alivia",
] as const;

export const FUNCTIONAL_LIMIT_OPTIONS = [
  "Ninguna",
  "Leve (puedo caminar pero molesta)",
  "Moderada (limita caminar o estar de pie)",
  "Severa (cojeo o evito apoyar)",
  "No puedo caminar con normalidad",
] as const;

export const ASSOCIATED_SYMPTOM_OPTIONS = [
  "Hormigueo o quemazón en la planta",
  "Entumecimiento en el talón",
  "Dolor que sube hacia el tobillo",
  "Hinchazón en el talón",
  "Rigidez matutina en el tobillo",
  "Dolor en el gemelo / tendón de Aquiles",
  "Ninguno",
] as const;

export const ACTIVITY_LEVEL_OPTIONS = [
  "Sedentario",
  "Camino moderadamente (trabajo de oficina)",
  "Camino mucho (trabajo de pie, hostelería, retail)",
  "Deportista recreativo (correr, gym)",
  "Deportista intensivo (competición, alto volumen)",
] as const;

export const TRAINING_IMPACT_OPTIONS = [
  "No afecta",
  "Parcialmente",
  "No puedo entrenar o competir",
] as const;

export type PlantarFasciaAdaptiveAnswers = {
  rf_fractura_sospecha: string;
  rf_infeccion: string;
  rf_perdida_sensibilidad: string;
  evolucion: string;
  inicio: string;
  intensidad_dolor: number;
  localizacion_dolor: string[];
  desencadenantes: string[];
  dolor_primeros_pasos: string;
  dolor_extension_dedos: string;
  calzado: string[];
  nivel_actividad: string;
  agravantes: string[];
  aliviantes: string[];
  limitacion_funcional: string[];
  sintomas_asociados: string[];
  pie_afectado: string;
  tratamiento_previo: string;
  tratamiento_previo_detalle: string;
  pruebas_imagen: string;
  pruebas_imagen_detalle: string;
  deporte_impacto: string;
};

export function defaultPlantarFasciaAdaptiveAnswers(): PlantarFasciaAdaptiveAnswers {
  return {
    rf_fractura_sospecha: "",
    rf_infeccion: "",
    rf_perdida_sensibilidad: "",
    evolucion: "",
    inicio: "",
    intensidad_dolor: 5,
    localizacion_dolor: [],
    desencadenantes: [],
    dolor_primeros_pasos: "",
    dolor_extension_dedos: "",
    calzado: [],
    nivel_actividad: "",
    agravantes: [],
    aliviantes: [],
    limitacion_funcional: [],
    sintomas_asociados: [],
    pie_afectado: "",
    tratamiento_previo: "",
    tratamiento_previo_detalle: "",
    pruebas_imagen: "",
    pruebas_imagen_detalle: "",
    deporte_impacto: "",
  };
}

export type PlantarFasciaQuestionSection =
  | "red_flags"
  | "core"
  | "fascia_pattern"
  | "footwear_activity"
  | "aggravating"
  | "associated"
  | "history";

export type PlantarFasciaQuestionDef = {
  id: keyof PlantarFasciaAdaptiveAnswers;
  section: PlantarFasciaQuestionSection;
  label: string;
  type: "single" | "multi" | "text" | "slider";
  options?: readonly string[];
  required?: boolean;
  showIf?: (a: PlantarFasciaAdaptiveAnswers) => boolean;
};

export const PLANTAR_FASCIA_QUESTIONS: PlantarFasciaQuestionDef[] = [
  // --- RED FLAGS ---
  {
    id: "rf_fractura_sospecha",
    section: "red_flags",
    label: "¿Hubo un traumatismo fuerte, caída o golpe directo en el pie, y sospechas fractura?",
    type: "single",
    options: YES_NO,
    required: true,
  },
  {
    id: "rf_infeccion",
    section: "red_flags",
    label: "¿El pie está enrojecido, caliente, hinchado y/o tienes fiebre?",
    type: "single",
    options: YES_NO,
    required: true,
  },
  {
    id: "rf_perdida_sensibilidad",
    section: "red_flags",
    label: "¿Pérdida de sensibilidad marcada o cambio de color en el pie?",
    type: "single",
    options: YES_NO,
    required: true,
  },

  // --- CORE ---
  {
    id: "evolucion",
    section: "core",
    label: "¿Cuánto tiempo llevas con este dolor?",
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
    id: "pie_afectado",
    section: "core",
    label: "¿Qué pie está afectado?",
    type: "single",
    options: ["Derecho", "Izquierdo", "Ambos"],
    required: true,
  },

  // --- FASCIA PATTERN ---
  {
    id: "localizacion_dolor",
    section: "fascia_pattern",
    label: "¿Dónde exactamente sientes el dolor en la planta? (puedes marcar varias)",
    type: "multi",
    options: PAIN_LOCATION_OPTIONS,
    required: true,
  },
  {
    id: "dolor_primeros_pasos",
    section: "fascia_pattern",
    label: "¿Te duele al caminar los primeros pasos después de despertarte?",
    type: "single",
    options: YES_NO,
    required: true,
  },
  {
    id: "dolor_extension_dedos",
    section: "fascia_pattern",
    label: "¿Tienes dolor al estirar los dedos del pie hacia atrás (hacia la espinilla)?",
    type: "single",
    options: YES_NO,
    required: true,
  },
  {
    id: "desencadenantes",
    section: "fascia_pattern",
    label: "¿Qué provoca el dolor? (puedes marcar varias)",
    type: "multi",
    options: PAIN_TRIGGER_OPTIONS,
    required: true,
  },
  {
    id: "sintomas_asociados",
    section: "fascia_pattern",
    label: "¿Notas algún otro síntoma? (puedes marcar varios)",
    type: "multi",
    options: ASSOCIATED_SYMPTOM_OPTIONS,
    required: true,
  },

  // --- FOOTWEAR & ACTIVITY ---
  {
    id: "calzado",
    section: "footwear_activity",
    label: "¿Qué calzado usas habitualmente? (puedes marcar varias)",
    type: "multi",
    options: FOOTWEAR_OPTIONS,
    required: true,
  },
  {
    id: "nivel_actividad",
    section: "footwear_activity",
    label: "¿Cuál es tu nivel de actividad?",
    type: "single",
    options: ACTIVITY_LEVEL_OPTIONS,
    required: true,
  },

  // --- AGGRAVATING ---
  {
    id: "agravantes",
    section: "aggravating",
    label: "¿Qué empeora el dolor? (puedes marcar varias)",
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
    id: "pruebas_imagen",
    section: "history",
    label: "¿Te han hecho pruebas de imagen (ecografía, radiografía, resonancia)?",
    type: "single",
    options: ["No", "Sí, ecografía", "Sí, radiografía", "Sí, resonancia", "Sí, varias"],
    required: true,
  },
  {
    id: "pruebas_imagen_detalle",
    section: "history",
    label: "¿Qué mostraron las pruebas? (si lo recuerdas)",
    type: "text",
    required: false,
    showIf: (a) => a.pruebas_imagen !== "No" && a.pruebas_imagen !== "",
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

export const PLANTAR_FASCIA_SECTION_LABELS: Record<PlantarFasciaQuestionSection, string> = {
  red_flags: "Comprobación de urgencia",
  core: "Caracterización del problema",
  fascia_pattern: "Patrón de fascitis plantar",
  footwear_activity: "Calzado y actividad",
  aggravating: "Factores agravantes y limitación",
  associated: "Síntomas asociados",
  history: "Antecedentes y tratamiento",
};

export const PLANTAR_FASCIA_SECTION_ORDER: PlantarFasciaQuestionSection[] = [
  "red_flags",
  "core",
  "fascia_pattern",
  "footwear_activity",
  "aggravating",
  "history",
];

export function getVisiblePlantarFasciaQuestions(
  answers: PlantarFasciaAdaptiveAnswers
): PlantarFasciaQuestionDef[] {
  return PLANTAR_FASCIA_QUESTIONS.filter((q) => !q.showIf || q.showIf(answers));
}

export function getVisiblePlantarFasciaSections(
  answers: PlantarFasciaAdaptiveAnswers
): PlantarFasciaQuestionSection[] {
  const visible = getVisiblePlantarFasciaQuestions(answers);
  return PLANTAR_FASCIA_SECTION_ORDER.filter((s) => visible.some((q) => q.section === s));
}

const RED_FLAG_IDS: (keyof PlantarFasciaAdaptiveAnswers)[] = [
  "rf_fractura_sospecha",
  "rf_infeccion",
  "rf_perdida_sensibilidad",
];

export function detectPlantarFasciaRedFlags(answers: PlantarFasciaAdaptiveAnswers): {
  urgent: boolean;
  triggered: string[];
} {
  const labels: Record<string, string> = {
    rf_fractura_sospecha: "Sospecha de fractura por trauma",
    rf_infeccion: "Signos de infección (enrojecimiento, calor, fiebre)",
    rf_perdida_sensibilidad: "Pérdida de sensibilidad / cambio de color",
  };
  const triggered: string[] = [];
  for (const id of RED_FLAG_IDS) {
    if (answers[id] === "Sí") triggered.push(labels[id] ?? id);
  }
  return { urgent: triggered.length > 0, triggered };
}

export function detectPlantarFasciaPattern(answers: PlantarFasciaAdaptiveAnswers): {
  fasciaClassic: boolean;
  baxterSuspect: boolean;
  footwearRisk: boolean;
} {
  const fasciaClassic =
    answers.dolor_primeros_pasos === "Sí" ||
    answers.dolor_extension_dedos === "Sí" ||
    answers.desencadenantes.includes("Al caminar los primeros pasos al despertar");

  const baxterSuspect =
    answers.sintomas_asociados.includes("Hormigueo o quemazón en la planta") ||
    answers.sintomas_asociados.includes("Entumecimiento en el talón");

  const footwearRisk =
    answers.calzado.includes("Ando mucho descalzo") ||
    answers.calzado.includes("Uso zapatillas planas (sin soporte de arco)") ||
    answers.calzado.includes("Uso chanclas / sandalias planas habitualmente");

  return { fasciaClassic, baxterSuspect, footwearRisk };
}

function isAnswered(q: PlantarFasciaQuestionDef, answers: PlantarFasciaAdaptiveAnswers): boolean {
  const val = answers[q.id];
  if (q.type === "multi") return Array.isArray(val) && val.length > 0;
  if (q.type === "slider") return typeof val === "number" && val >= 1;
  if (q.type === "text") return typeof val === "string" && val.trim().length > 0;
  return typeof val === "string" && val.length > 0;
}

export function validatePlantarFasciaAdaptive(answers: PlantarFasciaAdaptiveAnswers): string | null {
  const visible = getVisiblePlantarFasciaQuestions(answers);
  for (const q of visible) {
    if (q.required !== false && !isAnswered(q, answers)) {
      return `Responde: ${q.label.replace(/\?$/, "")}.`;
    }
  }
  return null;
}

export function validatePlantarFasciaSection(
  section: PlantarFasciaQuestionSection,
  answers: PlantarFasciaAdaptiveAnswers
): string | null {
  const questions = getVisiblePlantarFasciaQuestions(answers).filter((q) => q.section === section);
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

export function formatPlantarFasciaAdaptive(answers: PlantarFasciaAdaptiveAnswers): string {
  const { urgent, triggered } = detectPlantarFasciaRedFlags(answers);
  const { fasciaClassic, baxterSuspect, footwearRisk } = detectPlantarFasciaPattern(answers);

  const lines: string[] = [
    "=== CUESTIONARIO ADAPTATIVO — FASCITIS PLANTAR / NERVIO DE BAXTER ===",
    "",
    "— BANDERAS ROJAS —",
    urgent
      ? `⚠️ URGENCIA DETECTADA: ${triggered.join("; ")} → DERIVAR A URGENCIAS / ESPECIALISTA`
      : "Ninguna bandera roja marcada como Sí",
    `Sospecha fractura: ${answers.rf_fractura_sospecha || "—"}`,
    `Signos infección: ${answers.rf_infeccion || "—"}`,
    `Pérdida sensibilidad / cambio color: ${answers.rf_perdida_sensibilidad || "—"}`,
    "",
    "— VARIABLES CLÍNICAS —",
    `Tiempo de evolución: ${answers.evolucion}`,
    `Forma de inicio: ${answers.inicio}`,
    `Intensidad dolor: ${answers.intensidad_dolor}/10`,
    `Pie afectado: ${answers.pie_afectado}`,
    "",
    "— PATRÓN DE FASCITIS PLANTAR —",
    `Localización dolor: ${formatMulti(answers.localizacion_dolor)}`,
    `Dolor primeros pasos al despertar: ${answers.dolor_primeros_pasos}`,
    `Dolor al estirar dedos hacia atrás: ${answers.dolor_extension_dedos}`,
    `Desencadenantes: ${formatMulti(answers.desencadenantes)}`,
    `Síntomas asociados: ${formatMulti(answers.sintomas_asociados)}`,
    fasciaClassic
      ? "✓ PATRÓN CLÁSICO DE FASCITIS PLANTAR: dolor en primeros pasos y/o al extender los dedos"
      : "",
    baxterSuspect
      ? "⚠️ SOSPECHA DE ATRAPAMIENTO DEL NERVIO DE BAXTER: hormigueo/quemazón/entumecimiento en talón — valorar componente neural"
      : "",
    "",
    "— CALZADO Y ACTIVIDAD —",
    `Calzado habitual: ${formatMulti(answers.calzado)}`,
    `Nivel de actividad: ${answers.nivel_actividad}`,
    footwearRisk
      ? "⚠️ FACTOR DE RIESGO: caminar descalzo o calzado plano sin soporte — contribuye a la sobrecarga de la fascia"
      : "",
    "",
    "— FACTORES AGRAVANTES / ALIVIANTES —",
    `Agravantes: ${formatMulti(answers.agravantes)}`,
    `Aliviantes: ${formatMulti(answers.aliviantes)}`,
    `Limitación funcional: ${answers.limitacion_funcional.join(", ") || "—"}`,
    "",
    "— ANTECEDENTES Y TRATAMIENTO —",
    `Tratamiento previo: ${answers.tratamiento_previo}${answers.tratamiento_previo === "Sí" && answers.tratamiento_previo_detalle ? ` — ${answers.tratamiento_previo_detalle}` : ""}`,
    `Pruebas de imagen: ${answers.pruebas_imagen}${answers.pruebas_imagen_detalle ? ` — ${answers.pruebas_imagen_detalle}` : ""}`,
    `Impacto deportivo: ${answers.deporte_impacto}`,
    "",
    "— INSTRUCCIONES PARA LA IA —",
    "Basándote en la información recopilada, ofrece un PLAN PROGRESIVO de tratamiento:",
    "",
    "FASE 1 — CONSERVADORA INMEDIATA (ejercicios basados en evidencia):",
    "Busca y recomienda ejercicios específicos para fascitis plantar respaldados por evidencia.",
    "Incluye obligatoriamente:",
    "- Rodar una pelota de tenis o golf por la planta del pie con suavidad (auto-masaje miofascial)",
    "- Estiramientos de la fascia plantar (dorsiflexión de dedos con rodilla extendida)",
    "- Estiramientos de gemelos y sóleo (Windlass mechanism)",
    "- Fortalecimiento excéntrico: heel raises con toalla enrollada bajo los dedos (protocolo Rathleff)",
    "- Estiramientos en carga progresiva del tendón de Aquiles",
    "- Educación: evitar caminar descalzo, usar calzado con soporte de arco",
    "Adapta la progresión según la severidad y el tiempo de evolución.",
    "",
    "FASE 2 — SI PERSISTE TRAS 1 SEMANA:",
    "Recomendar una ecografía para valorar el grosor de la fascia plantar,",
    "posible espolón calcáneo, y descartar atrapamiento del nervio de Baxter.",
    "",
    "FASE 3 — SI PERSISTE TRAS ECOGRAFÍA / NO MEJORA:",
    "Recomendar acudir a un centro de fisioterapia especializado que:",
    "- Valore la planta del pie con ecografía y trate con terapias invasivas",
    "  (electrólisis percutánea ecoguiada, punción seca, neuromodulación si hay componente de Baxter)",
    "- IMPORTANTE: Que también valore la movilidad de cadera y tobillo,",
    "  ya que restricciones en dorsiflexión de tobillo o extensión de cadera",
    "  pueden ser la causa raíz de la sobrecarga de la fascia plantar.",
    "",
    "NOTA: El sistema recopila variables clínicas para estimar si hay fascitis plantar o atrapamiento del nervio de Baxter, no para diagnosticar.",
    "Si hay sospecha de Baxter (hormigueo/quemazón/entumecimiento), mencionarlo explícitamente en la respuesta."
  ];

  return lines.filter(Boolean).join("\n");
}

export function isLastPlantarFasciaSection(
  answers: PlantarFasciaAdaptiveAnswers,
  sectionIndex: number
): boolean {
  const sections = getVisiblePlantarFasciaSections(answers);
  return sectionIndex >= sections.length - 1;
}

// --- English translations ---

export const PLANTAR_FASCIA_LABEL_EN: Partial<Record<string, string>> = {
  rf_fractura_sospecha: "Was there significant trauma, a fall, or direct blow to the foot, and do you suspect a fracture?",
  rf_infeccion: "Is the foot red, hot, swollen, and/or do you have a fever?",
  rf_perdida_sensibilidad: "Marked loss of sensation or color change in the foot?",
  evolucion: "How long have you had this pain?",
  inicio: "How did it start?",
  intensidad_dolor: "Pain intensity (1–10)",
  pie_afectado: "Which foot is affected?",
  localizacion_dolor: "Where exactly do you feel the pain on the sole? (you can select several)",
  dolor_primeros_pasos: "Does it hurt when you take the first steps after waking up?",
  dolor_extension_dedos: "Do you have pain when stretching your toes back (toward the shin)?",
  desencadenantes: "What triggers the pain? (you can select several)",
  sintomas_asociados: "Do you notice any other symptoms? (you can select several)",
  calzado: "What footwear do you usually wear? (you can select several)",
  nivel_actividad: "What is your activity level?",
  agravantes: "What worsens the pain? (you can select several)",
  aliviantes: "What relieves it? (you can select several)",
  limitacion_funcional: "How much does it limit you day to day?",
  tratamiento_previo: "Have you received previous treatment for this?",
  tratamiento_previo_detalle: "What treatment did you receive and how did it go?",
  pruebas_imagen: "Have you had imaging tests (ultrasound, X-ray, MRI)?",
  pruebas_imagen_detalle: "What did the tests show? (if you remember)",
  deporte_impacto: "How does it affect your training or sport?",
};

export const PLANTAR_FASCIA_OPTION_EN = {
  No: "No",
  Sí: "Yes",
  "Ha sido ahora": "Just now",
  "Reciente (1-4 horas)": "Recent (1–4 hours)",
  "Menos de 48 horas": "Less than 48 hours",
  "Entre 2 y 7 días": "Between 2 and 7 days",
  "Entre 1 y 4 semanas": "Between 1 and 4 weeks",
  "Más de 1 mes": "More than 1 month",
  "Más de 3 meses": "More than 3 months",
  "Más de 6 meses": "More than 6 months",
  Repentino: "Sudden",
  Progresivo: "Gradual",
  Derecho: "Right",
  Izquierdo: "Left",
  Ambos: "Both",
  "Debajo del talón (inserción de la fascia)": "Under the heel (fascia insertion)",
  "Arco plantar (zona media de la planta)": "Plantar arch (mid-sole area)",
  "Toda la planta del pie": "Entire sole of the foot",
  "Hacia los dedos": "Toward the toes",
  "Cara interna del talón": "Inner side of the heel",
  "No estoy seguro": "I'm not sure",
  "Al estirar los dedos del pie hacia atrás (dorsiflexión)": "When stretching toes back (dorsiflexion)",
  "Al caminar los primeros pasos al despertar": "When taking first steps after waking up",
  "Después de estar sentado mucho rato y levantarse": "After sitting for a long time and standing up",
  "Al caminar mucho rato": "When walking for a long time",
  "Al correr": "When running",
  "Al estar de pie mucho tiempo": "When standing for a long time",
  "Al final del día": "At the end of the day",
  "Al subir escaleras o ponerse de puntillas": "When climbing stairs or standing on tiptoes",
  "Ando mucho descalzo": "I walk barefoot a lot",
  "Uso zapatillas planas (sin soporte de arco)": "I wear flat shoes (no arch support)",
  "Uso tacones frecuentemente": "I wear heels frequently",
  "Uso calzado deportivo con buen soporte": "I wear athletic shoes with good support",
  "Uso chanclas / sandalias planas habitualmente": "I usually wear flip-flops / flat sandals",
  "Uso plantillas ortopédicas": "I use orthopedic insoles",
  "Caminar descalzo": "Walking barefoot",
  Correr: "Running",
  "Estar de pie muchas horas": "Standing for many hours",
  "Calzado plano / sin soporte": "Flat shoes / no support",
  "Subir escaleras": "Climbing stairs",
  Saltar: "Jumping",
  "Caminar en superficies duras": "Walking on hard surfaces",
  "Ninguno en particular": "None in particular",
  "Descansar / sentarse": "Resting / sitting down",
  "Calzado con soporte de arco": "Shoes with arch support",
  "Estirar la planta del pie": "Stretching the sole of the foot",
  "Hielo local": "Local ice",
  "Rodar pelota bajo el pie": "Rolling a ball under the foot",
  "Medicación": "Medication",
  Plantillas: "Insoles",
  "Nada lo alivia": "Nothing relieves it",
  Ninguna: "None",
  "Leve (puedo caminar pero molesta)": "Mild (I can walk but it bothers me)",
  "Moderada (limita caminar o estar de pie)": "Moderate (limits walking or standing)",
  "Severa (cojeo o evito apoyar)": "Severe (I limp or avoid putting weight on it)",
  "No puedo caminar con normalidad": "I cannot walk normally",
  "Hormigueo o quemazón en la planta": "Tingling or burning on the sole",
  "Entumecimiento en el talón": "Numbness in the heel",
  "Dolor que sube hacia el tobillo": "Pain going up toward the ankle",
  "Hinchazón en el talón": "Swelling in the heel",
  "Rigidez matutina en el tobillo": "Morning stiffness in the ankle",
  "Dolor en el gemelo / tendón de Aquiles": "Pain in the calf / Achilles tendon",
  Ninguno: "None",
  Sedentario: "Sedentary",
  "Camino moderadamente (trabajo de oficina)": "I walk moderately (office job)",
  "Camino mucho (trabajo de pie, hostelería, retail)": "I walk a lot (standing job, hospitality, retail)",
  "Deportista recreativo (correr, gym)": "Recreational athlete (running, gym)",
  "Deportista intensivo (competición, alto volumen)": "Intensive athlete (competition, high volume)",
  "No afecta": "Does not affect",
  Parcialmente: "Partially",
  "No puedo entrenar o competir": "I can't train or compete",
  "Sí, ecografía": "Yes, ultrasound",
  "Sí, radiografía": "Yes, X-ray",
  "Sí, resonancia": "Yes, MRI",
  "Sí, varias": "Yes, multiple",
  "Sospecha de fractura por trauma": "Was there significant trauma, a fall, or direct blow to the foot, and do you suspect a fracture",
  "Signos de infección (enrojecimiento, calor, fiebre)": "Is the foot red, hot, swollen, and/or do you have a fever",
  "Pérdida de sensibilidad / cambio de color": "Marked loss of sensation or color change in the foot",
};

export const PLANTAR_FASCIA_SECTION_LABELS_EN: Record<string, string> = {
  red_flags: "Urgency check",
  core: "Problem characterization",
  fascia_pattern: "Plantar fasciitis pattern",
  footwear_activity: "Footwear & activity",
  aggravating: "Aggravating factors & limitation",
  associated: "Associated symptoms",
  history: "History & treatment",
};

export type ConsultLocale = "es" | "en";

export function localizePlantarFasciaLabel(id: string, fallback: string, locale: ConsultLocale): string {
  if (locale !== "en") return fallback;
  return PLANTAR_FASCIA_LABEL_EN[id] ?? fallback;
}

export function localizePlantarFasciaOption(option: string, locale: ConsultLocale): string {
  if (locale !== "en") return option;
  return PLANTAR_FASCIA_OPTION_EN[option as keyof typeof PLANTAR_FASCIA_OPTION_EN] ?? option;
}

export function localizePlantarFasciaSection(section: string, locale: ConsultLocale): string {
  if (locale !== "en") return (PLANTAR_FASCIA_SECTION_LABELS as any)[section] ?? section;
  return PLANTAR_FASCIA_SECTION_LABELS_EN[section] ?? (PLANTAR_FASCIA_SECTION_LABELS as any)[section] ?? section;
}
