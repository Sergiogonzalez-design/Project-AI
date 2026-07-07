export const YES_NO = ["No", "Sí"] as const;

export const EVOLUTION_OPTIONS = [
  "Menos de 48 horas",
  "Entre 2 y 7 días",
  "Entre 1 y 4 semanas",
  "Más de 1 mes",
] as const;

export const ONSET_FORM_OPTIONS = ["Repentino", "Progresivo"] as const;

export const MECHANISM_OPTIONS = [
  "Caída",
  "Golpe directo",
  "Entrenamiento o ejercicio",
  "Movimiento repetitivo",
  "Inicio progresivo sin causa clara",
  "Otro",
] as const;

export const SHOULDER_ANATOMIC_LOCATION = [
  "Parte frontal (deltoides/anterior)",
  "Parte lateral",
  "Parte posterior",
  "Cerca de la clavícula / articulación AC",
  "Profundo dentro del hombro",
  "Zona escapular (omóplato)",
  "No estoy seguro",
] as const;

export const PAIN_TYPE_OPTIONS = [
  "Punzante",
  "Quemazón",
  "Rigidez",
  "Presión / peso",
  "Hormigueo",
  "Malestar difuso",
] as const;

export const PAIN_SITUATION_OPTIONS = [
  "En reposo",
  "Al mover",
  "Con esfuerzo o carga",
  "Por la noche",
  "Constante",
] as const;

export const FUNCTIONAL_LIMIT_OPTIONS = [
  "Ninguna",
  "Leve",
  "Moderada",
  "Severa",
  "No puedo usar el brazo",
] as const;

export const ASSOCIATED_SYMPTOM_OPTIONS = [
  "Debilidad",
  "Chasquidos",
  "Inflamación / hinchazón",
  "Hormigueo o entumecimiento",
  "Bloqueo del movimiento",
  "Sensación de inestabilidad",
  "Rigidez matutina",
  "Ninguno",
] as const;

export const AGGRAVATING_MOVEMENT_OPTIONS = [
  "Elevar el brazo por encima de la cabeza",
  "Rotación interna o externa",
  "Llevar el brazo hacia atrás",
  "Levantar peso",
  "Lanzar o servir",
  "Dormir sobre ese lado",
  "Ninguno en particular",
] as const;

export const FALL_HOW_OPTIONS = [
  "Sobre el hombro",
  "Sobre la mano (con el brazo extendido)",
  "Sobre el codo",
  "De otra forma",
] as const;

export const FALL_ARM_USE_OPTIONS = [
  "Sí, pude seguir usándolo",
  "Parcialmente",
  "No, no pude usarlo",
] as const;

export const TRAINING_TIMING_OPTIONS = [
  "Durante el ejercicio",
  "Justo después",
  "Al día siguiente",
] as const;

export const TRAINING_LOAD_OPTIONS = [
  "Carga elevada",
  "Carga moderada",
  "Peso corporal",
  "Resistencia / endurance",
] as const;

export const TINGLING_FINGER_OPTIONS = [
  "Pulgar",
  "Índice",
  "Medio",
  "Anular",
  "Meñique",
  "Mano completa",
  "Antebrazo",
] as const;

export const INSTABILITY_HISTORY_OPTIONS = [
  "No",
  "Sí, una vez",
  "Sí, varias veces",
] as const;

export const INSTABILITY_FEELING_OPTIONS = [
  "No",
  "A veces",
  "Sí, con frecuencia",
] as const;

export const TRAINING_IMPACT_OPTIONS = [
  "No afecta",
  "Parcialmente",
  "No puedo entrenar o competir",
] as const;

export type ShoulderAdaptiveAnswers = {
  // Red flags
  rf_deformidad: string;
  rf_no_movimiento: string;
  rf_perdida_fuerza: string;
  rf_perdida_sensibilidad: string;
  rf_fiebre: string;
  rf_respiracion_torax: string;
  // Core
  evolucion: string;
  inicio: string;
  mecanismo: string;
  mecanismo_otro: string;
  intensidad_dolor: number;
  localizacion_hombro: string[];
  tipo_dolor: string[];
  patron_dolor: string[];
  limitacion_funcional: string;
  irradiacion: string;
  irradiacion_detalle: string;
  sintomas_asociados: string[];
  movimientos_agravantes: string[];
  // Fall branch
  caida_como: string;
  caida_chasquido: string;
  caida_uso_brazo: string;
  // Training branch
  entreno_ejercicio: string;
  entreno_momento: string;
  entreno_carga: string;
  // Repetitive branch
  repetitivo_actividad: string;
  repetitivo_frecuencia: string;
  // Tingling branch
  hormigueo_dedos: string[];
  hormigueo_constante: string;
  hormigueo_movimientos: string;
  // Instability branch
  inestabilidad_salido: string;
  inestabilidad_desplaza: string;
  inestabilidad_cuando: string;
  // Click branch
  chasquido_cuando: string;
  // History
  lesion_previa: string;
  lesion_previa_detalle: string;
  deporte_impacto: string;
};

export function defaultShoulderAdaptiveAnswers(): ShoulderAdaptiveAnswers {
  return {
    rf_deformidad: "",
    rf_no_movimiento: "",
    rf_perdida_fuerza: "",
    rf_perdida_sensibilidad: "",
    rf_fiebre: "",
    rf_respiracion_torax: "",
    evolucion: "",
    inicio: "",
    mecanismo: "",
    mecanismo_otro: "",
    intensidad_dolor: 5,
    localizacion_hombro: [],
    tipo_dolor: [],
    patron_dolor: [],
    limitacion_funcional: "",
    irradiacion: "",
    irradiacion_detalle: "",
    sintomas_asociados: [],
    movimientos_agravantes: [],
    caida_como: "",
    caida_chasquido: "",
    caida_uso_brazo: "",
    entreno_ejercicio: "",
    entreno_momento: "",
    entreno_carga: "",
    repetitivo_actividad: "",
    repetitivo_frecuencia: "",
    hormigueo_dedos: [],
    hormigueo_constante: "",
    hormigueo_movimientos: "",
    inestabilidad_salido: "",
    inestabilidad_desplaza: "",
    inestabilidad_cuando: "",
    chasquido_cuando: "",
    lesion_previa: "",
    lesion_previa_detalle: "",
    deporte_impacto: "",
  };
}

export type ShoulderQuestionSection =
  | "red_flags"
  | "core"
  | "fall"
  | "training"
  | "repetitive"
  | "tingling"
  | "instability"
  | "clicking"
  | "history";

export type ShoulderQuestionDef = {
  id: keyof ShoulderAdaptiveAnswers;
  section: ShoulderQuestionSection;
  label: string;
  type: "single" | "multi" | "text" | "slider";
  options?: readonly string[];
  required?: boolean;
  showIf?: (a: ShoulderAdaptiveAnswers) => boolean;
};

function hasSymptom(a: ShoulderAdaptiveAnswers, name: string): boolean {
  return a.sintomas_asociados.includes(name);
}

function hasTingling(a: ShoulderAdaptiveAnswers): boolean {
  return (
    hasSymptom(a, "Hormigueo o entumecimiento") ||
    a.tipo_dolor.includes("Hormigueo")
  );
}

export const SHOULDER_QUESTIONS: ShoulderQuestionDef[] = [
  // Red flags — always first
  { id: "rf_deformidad", section: "red_flags", label: "¿Hay deformidad evidente tras un traumatismo?", type: "single", options: YES_NO, required: true },
  { id: "rf_no_movimiento", section: "red_flags", label: "¿Incapacidad absoluta para mover el brazo?", type: "single", options: YES_NO, required: true },
  { id: "rf_perdida_fuerza", section: "red_flags", label: "¿Pérdida súbita de fuerza en el brazo?", type: "single", options: YES_NO, required: true },
  { id: "rf_perdida_sensibilidad", section: "red_flags", label: "¿Pérdida de sensibilidad (entumecimiento marcado)?", type: "single", options: YES_NO, required: true },
  { id: "rf_fiebre", section: "red_flags", label: "¿Fiebre asociada al dolor?", type: "single", options: YES_NO, required: true },
  { id: "rf_respiracion_torax", section: "red_flags", label: "¿Dolor acompañado de dificultad respiratoria o dolor torácico?", type: "single", options: YES_NO, required: true },

  // Core clinical characterization
  { id: "evolucion", section: "core", label: "¿Cuánto tiempo llevas con este problema?", type: "single", options: EVOLUTION_OPTIONS, required: true },
  { id: "inicio", section: "core", label: "¿Cómo fue el inicio?", type: "single", options: ONSET_FORM_OPTIONS, required: true },
  { id: "mecanismo", section: "core", label: "¿Qué pudo provocarlo?", type: "single", options: MECHANISM_OPTIONS, required: true },
  { id: "mecanismo_otro", section: "core", label: "Describe el mecanismo", type: "text", required: true, showIf: (a) => a.mecanismo === "Otro" },
  { id: "intensidad_dolor", section: "core", label: "Intensidad del dolor (1–10)", type: "slider", required: true },
  { id: "localizacion_hombro", section: "core", label: "¿Dónde sientes el dolor en el hombro? (puedes marcar varias)", type: "multi", options: SHOULDER_ANATOMIC_LOCATION, required: true },
  { id: "tipo_dolor", section: "core", label: "¿Cómo describirías el dolor?", type: "multi", options: PAIN_TYPE_OPTIONS, required: true },
  { id: "patron_dolor", section: "core", label: "¿En qué situaciones aparece o empeora?", type: "multi", options: PAIN_SITUATION_OPTIONS, required: true },
  { id: "limitacion_funcional", section: "core", label: "¿Cuánto te limita en tu día a día?", type: "single", options: FUNCTIONAL_LIMIT_OPTIONS, required: true },
  { id: "irradiacion", section: "core", label: "¿El dolor se irradia hacia el brazo?", type: "single", options: YES_NO, required: true },
  { id: "irradiacion_detalle", section: "core", label: "¿Hasta dónde llega la irradiación?", type: "text", required: true, showIf: (a) => a.irradiacion === "Sí" },
  { id: "sintomas_asociados", section: "core", label: "¿Qué otros síntomas notas?", type: "multi", options: ASSOCIATED_SYMPTOM_OPTIONS, required: true },
  { id: "movimientos_agravantes", section: "core", label: "¿Qué movimientos lo provocan o empeoran?", type: "multi", options: AGGRAVATING_MOVEMENT_OPTIONS, required: true },

  // Fall branch
  { id: "caida_como", section: "fall", label: "¿Cómo caíste?", type: "single", options: FALL_HOW_OPTIONS, required: true, showIf: (a) => a.mecanismo === "Caída" },
  { id: "caida_chasquido", section: "fall", label: "¿Escuchaste un chasquido o crujido?", type: "single", options: YES_NO, required: true, showIf: (a) => a.mecanismo === "Caída" },
  { id: "caida_uso_brazo", section: "fall", label: "¿Pudiste seguir utilizando el brazo después?", type: "single", options: FALL_ARM_USE_OPTIONS, required: true, showIf: (a) => a.mecanismo === "Caída" },

  // Training branch
  { id: "entreno_ejercicio", section: "training", label: "¿Qué ejercicio o gesto estabas realizando?", type: "text", required: true, showIf: (a) => a.mecanismo === "Entrenamiento o ejercicio" },
  { id: "entreno_momento", section: "training", label: "¿Cuándo apareció el dolor?", type: "single", options: TRAINING_TIMING_OPTIONS, required: true, showIf: (a) => a.mecanismo === "Entrenamiento o ejercicio" },
  { id: "entreno_carga", section: "training", label: "¿Qué tipo de carga utilizabas?", type: "single", options: TRAINING_LOAD_OPTIONS, required: true, showIf: (a) => a.mecanismo === "Entrenamiento o ejercicio" },

  // Repetitive branch
  { id: "repetitivo_actividad", section: "repetitive", label: "¿Qué actividad repetitiva lo desencadena?", type: "text", required: true, showIf: (a) => a.mecanismo === "Movimiento repetitivo" },
  { id: "repetitivo_frecuencia", section: "repetitive", label: "¿Con qué frecuencia realizas esa actividad?", type: "single", options: ["Diariamente", "Varias veces por semana", "Ocasionalmente"], required: true, showIf: (a) => a.mecanismo === "Movimiento repetitivo" },

  // Tingling branch
  { id: "hormigueo_dedos", section: "tingling", label: "¿Qué dedos o zonas están afectados?", type: "multi", options: TINGLING_FINGER_OPTIONS, required: true, showIf: hasTingling },
  { id: "hormigueo_constante", section: "tingling", label: "¿El hormigueo es constante?", type: "single", options: ["No, intermitente", "Sí, constante"], required: true, showIf: hasTingling },
  { id: "hormigueo_movimientos", section: "tingling", label: "¿Qué movimientos lo desencadenan?", type: "text", required: false, showIf: hasTingling },

  // Instability branch
  { id: "inestabilidad_salido", section: "instability", label: "¿El hombro se ha salido (luxación) anteriormente?", type: "single", options: INSTABILITY_HISTORY_OPTIONS, required: true, showIf: (a) => hasSymptom(a, "Sensación de inestabilidad") },
  { id: "inestabilidad_desplaza", section: "instability", label: "¿Sientes que el hombro se desplaza o da inseguridad?", type: "single", options: INSTABILITY_FEELING_OPTIONS, required: true, showIf: (a) => hasSymptom(a, "Sensación de inestabilidad") },
  { id: "inestabilidad_cuando", section: "instability", label: "¿En qué situaciones notas la inestabilidad?", type: "text", required: false, showIf: (a) => hasSymptom(a, "Sensación de inestabilidad") },

  // Clicking branch
  { id: "chasquido_cuando", section: "clicking", label: "¿Cuándo aparecen los chasquidos?", type: "text", required: false, showIf: (a) => hasSymptom(a, "Chasquidos") },

  // History
  { id: "lesion_previa", section: "history", label: "¿Has tenido lesiones previas en este hombro?", type: "single", options: YES_NO, required: true },
  { id: "lesion_previa_detalle", section: "history", label: "Describe lesiones o tratamientos previos", type: "text", required: true, showIf: (a) => a.lesion_previa === "Sí" },
  { id: "deporte_impacto", section: "history", label: "¿Cómo afecta a tu entrenamiento o deporte?", type: "single", options: TRAINING_IMPACT_OPTIONS, required: true },
];

export const SHOULDER_SECTION_LABELS: Record<ShoulderQuestionSection, string> = {
  red_flags: "Comprobación de urgencia",
  core: "Caracterización del problema",
  fall: "Detalles de la caída",
  training: "Detalles del entrenamiento",
  repetitive: "Movimiento repetitivo",
  tingling: "Hormigueo / entumecimiento",
  instability: "Inestabilidad",
  clicking: "Chasquidos",
  history: "Antecedentes",
};

export const SHOULDER_SECTION_ORDER: ShoulderQuestionSection[] = [
  "red_flags",
  "core",
  "fall",
  "training",
  "repetitive",
  "tingling",
  "instability",
  "clicking",
  "history",
];

export function getVisibleShoulderQuestions(
  answers: ShoulderAdaptiveAnswers
): ShoulderQuestionDef[] {
  return SHOULDER_QUESTIONS.filter((q) => !q.showIf || q.showIf(answers));
}

export function getVisibleShoulderSections(
  answers: ShoulderAdaptiveAnswers
): ShoulderQuestionSection[] {
  const visible = getVisibleShoulderQuestions(answers);
  return SHOULDER_SECTION_ORDER.filter((s) => visible.some((q) => q.section === s));
}

const RED_FLAG_IDS: (keyof ShoulderAdaptiveAnswers)[] = [
  "rf_deformidad",
  "rf_no_movimiento",
  "rf_perdida_fuerza",
  "rf_perdida_sensibilidad",
  "rf_fiebre",
  "rf_respiracion_torax",
];

export function detectRedFlags(answers: ShoulderAdaptiveAnswers): {
  urgent: boolean;
  triggered: string[];
} {
  const labels: Record<string, string> = {
    rf_deformidad: "Deformidad evidente tras traumatismo",
    rf_no_movimiento: "Incapacidad absoluta para mover el brazo",
    rf_perdida_fuerza: "Pérdida súbita de fuerza",
    rf_perdida_sensibilidad: "Pérdida de sensibilidad",
    rf_fiebre: "Fiebre asociada",
    rf_respiracion_torax: "Dificultad respiratoria o dolor torácico",
  };
  const triggered: string[] = [];
  for (const id of RED_FLAG_IDS) {
    if (answers[id] === "Sí") triggered.push(labels[id] ?? id);
  }
  return { urgent: triggered.length > 0, triggered };
}

function isAnswered(q: ShoulderQuestionDef, answers: ShoulderAdaptiveAnswers): boolean {
  const val = answers[q.id];
  if (q.type === "multi") return Array.isArray(val) && val.length > 0;
  if (q.type === "slider") return typeof val === "number" && val >= 1;
  if (q.type === "text") return typeof val === "string" && val.trim().length > 0;
  return typeof val === "string" && val.length > 0;
}

export function validateShoulderAdaptive(answers: ShoulderAdaptiveAnswers): string | null {
  const visible = getVisibleShoulderQuestions(answers);
  for (const q of visible) {
    if (q.required !== false && !isAnswered(q, answers)) {
      return `Responde: ${q.label.replace(/\?$/, "")}.`;
    }
  }
  return null;
}

function formatMulti(arr: string[]): string {
  return arr.length ? arr.join(", ") : "No especificado";
}

export function formatShoulderAdaptive(
  answers: ShoulderAdaptiveAnswers,
  bodyMapText: string
): string {
  const { urgent, triggered } = detectRedFlags(answers);
  const lines: string[] = [
    "=== CUESTIONARIO ADAPTATIVO — HOMBRO ===",
    "",
    bodyMapText,
    "",
    "— BANDERAS ROJAS —",
    urgent
      ? `⚠️ URGENCIA DETECTADA: ${triggered.join("; ")}`
      : "Ninguna bandera roja marcada como Sí",
    `Deformidad: ${answers.rf_deformidad || "—"}`,
    `Incapacidad movimiento: ${answers.rf_no_movimiento || "—"}`,
    `Pérdida fuerza súbita: ${answers.rf_perdida_fuerza || "—"}`,
    `Pérdida sensibilidad: ${answers.rf_perdida_sensibilidad || "—"}`,
    `Fiebre: ${answers.rf_fiebre || "—"}`,
    `Dificultad respiratoria/dolor torácico: ${answers.rf_respiracion_torax || "—"}`,
    "",
    "— VARIABLES CLÍNICAS —",
    `Tiempo de evolución: ${answers.evolucion}`,
    `Forma de inicio: ${answers.inicio}`,
    `Mecanismo: ${answers.mecanismo}${answers.mecanismo === "Otro" && answers.mecanismo_otro ? ` (${answers.mecanismo_otro})` : ""}`,
    `Intensidad dolor: ${answers.intensidad_dolor}/10`,
    `Localización anatómica hombro: ${formatMulti(answers.localizacion_hombro)}`,
    `Tipo de dolor: ${formatMulti(answers.tipo_dolor)}`,
    `Situaciones de dolor: ${formatMulti(answers.patron_dolor)}`,
    `Limitación funcional: ${answers.limitacion_funcional}`,
    `Irradiación: ${answers.irradiacion}${answers.irradiacion === "Sí" && answers.irradiacion_detalle ? ` — ${answers.irradiacion_detalle}` : ""}`,
    `Síntomas asociados: ${formatMulti(answers.sintomas_asociados)}`,
    `Movimientos agravantes: ${formatMulti(answers.movimientos_agravantes)}`,
  ];

  if (answers.mecanismo === "Caída") {
    lines.push(
      "",
      "— DETALLE CAÍDA —",
      `Cómo cayó: ${answers.caida_como}`,
      `Chasquido: ${answers.caida_chasquido}`,
      `Uso del brazo tras caída: ${answers.caida_uso_brazo}`
    );
  }
  if (answers.mecanismo === "Entrenamiento o ejercicio") {
    lines.push(
      "",
      "— DETALLE ENTRENAMIENTO —",
      `Ejercicio: ${answers.entreno_ejercicio}`,
      `Momento: ${answers.entreno_momento}`,
      `Carga: ${answers.entreno_carga}`
    );
  }
  if (answers.mecanismo === "Movimiento repetitivo") {
    lines.push(
      "",
      "— MOVIMIENTO REPETITIVO —",
      `Actividad: ${answers.repetitivo_actividad}`,
      `Frecuencia: ${answers.repetitivo_frecuencia}`
    );
  }
  if (hasTingling(answers)) {
    lines.push(
      "",
      "— HORMIGUEO —",
      `Dedos/zona: ${formatMulti(answers.hormigueo_dedos)}`,
      `Constante: ${answers.hormigueo_constante}`,
      answers.hormigueo_movimientos ? `Movimientos desencadenantes: ${answers.hormigueo_movimientos}` : ""
    );
  }
  if (hasSymptom(answers, "Sensación de inestabilidad")) {
    lines.push(
      "",
      "— INESTABILIDAD —",
      `Luxaciones previas: ${answers.inestabilidad_salido}`,
      `Sensación desplazamiento: ${answers.inestabilidad_desplaza}`,
      answers.inestabilidad_cuando ? `Cuándo: ${answers.inestabilidad_cuando}` : ""
    );
  }
  if (hasSymptom(answers, "Chasquidos") && answers.chasquido_cuando) {
    lines.push("", "— CHASQUIDOS —", `Cuándo: ${answers.chasquido_cuando}`);
  }

  lines.push(
    "",
    "— ANTECEDENTES —",
    `Lesión previa hombro: ${answers.lesion_previa}${answers.lesion_previa === "Sí" && answers.lesion_previa_detalle ? ` — ${answers.lesion_previa_detalle}` : ""}`,
    `Impacto deportivo: ${answers.deporte_impacto}`,
    "",
    "NOTA: El sistema recopila variables clínicas para estimar estructuras afectadas, no para diagnosticar."
  );

  return lines.filter(Boolean).join("\n");
}

export function validateShoulderSection(
  section: ShoulderQuestionSection,
  answers: ShoulderAdaptiveAnswers
): string | null {
  const questions = getVisibleShoulderQuestions(answers).filter((q) => q.section === section);
  for (const q of questions) {
    if (q.required !== false && !isAnswered(q, answers)) {
      return `Responde: ${q.label.replace(/\?$/, "")}.`;
    }
  }
  return null;
}
