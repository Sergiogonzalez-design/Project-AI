import {
  filterSleepDependentOptions,
  shouldShowSleepDependentQuestion,
} from "./consulta-timing";

export const YES_NO = ["No", "Sí"] as const;

export const EVOLUTION_OPTIONS = [
  "Ha sido ahora",
  "Reciente (1-4 horas)",
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

/** Pectoral/chest location chips — not glenohumeral “hombro” landmarks. */
export const PECTORAL_ANATOMIC_LOCATION = [
  "Parte interna del pecho (cerca del esternón)",
  "Vientre muscular del pectoral (centro del pecho)",
  "Inserción cercana a la axila",
  "Borde inferior del pectoral",
  "Axila",
  "No estoy seguro",
] as const;

export type ShoulderQuestionnaireFocus = "shoulder" | "pectoral";

export function resolveShoulderQuestionnaireFocus(
  userText: string
): ShoulderQuestionnaireFocus {
  return /pectoral|p[eé]ctoral|\bpecho\b|\bchest\b|press\s*banca|bench\s*press/i.test(
    userText.trim()
  ) && !/\bhombro\b|\bshoulder\b|manguito|rotador|deltoides|om[oó]plato/i.test(userText.trim())
    ? "pectoral"
    : "shoulder";
}

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
  "Arco medio al subir el brazo (60°–120°)",
  "Cruzar el brazo por delante del pecho",
  "Otro",
  "Ninguno en particular",
] as const;

export const PECTORAL_AGGRAVATING_MOVEMENT_OPTIONS = [
  "Press de banca / press de pecho",
  "Aperturas o cruces (flyes)",
  "Flexiones",
  "Llevar el brazo atrás con el codo estirado",
  "Poner los brazos en cruz",
  "Levantar peso",
  "Dormir sobre ese lado",
  "Otro",
  "Ninguno en particular",
] as const;

export const PECTORAL_ASSOCIATED_SYMPTOM_OPTIONS = [
  "Debilidad al juntar los brazos (aducción)",
  "Hematoma en pecho o axila",
  "Chasquidos o latigazo",
  "Inflamación / hinchazón",
  "Hormigueo o entumecimiento",
  "Rigidez matutina",
  "Ninguno",
] as const;

export const PECTORAL_FALL_HOW_OPTIONS = [
  "Sobre el pecho",
  "Sobre la mano (con el brazo extendido)",
  "Sobre el codo",
  "De otra forma",
] as const;

export const PASSIVE_ROM_ASSIST_OPTIONS = [
  "Sí, duele o se bloquea igual aunque lo mueva otra persona",
  "No, con ayuda puedo mover más o duele menos",
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

export const INSTABILITY_DIRECTION_OPTIONS = [
  "Hacia delante (al levantar/rotar hacia fuera)",
  "Hacia atrás",
  "En varias direcciones",
  "No lo sé",
] as const;

export type ShoulderAdaptiveAnswers = {
  // Red flags
  rf_deformidad: string;
  rf_no_movimiento: string;
  rf_perdida_fuerza: string;
  rf_perdida_sensibilidad: string;
  rf_fiebre: string;
  rf_respiracion_torax: string;
  rf_luxacion_actual: string;
  rf_dolor_nocturno_sistemico: string;
  // Core
  evolucion: string;
  inicio: string;
  mecanismo: string[];
  mecanismo_otro: string;
  intensidad_dolor: number;
  localizacion_hombro: string[];
  tipo_dolor: string[];
  patron_dolor: string[];
  limitacion_funcional: string[];
  irradiacion: string;
  irradiacion_detalle: string;
  cuello_sintomas: string;
  cuello_empeora_brazo: string;
  sintomas_asociados: string[];
  movimientos_agravantes: string[];
  movimientos_agravantes_otro: string;
  perdida_movilidad_pasiva: string;
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
  inestabilidad_direccion: string;
  // Click branch
  chasquido_cuando: string;
  // Weakness branch
  debilidad_movimiento: string;
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
    rf_luxacion_actual: "",
    rf_dolor_nocturno_sistemico: "",
    evolucion: "",
    inicio: "",
    mecanismo: [],
    mecanismo_otro: "",
    intensidad_dolor: 5,
    localizacion_hombro: [],
    tipo_dolor: [],
    patron_dolor: [],
    limitacion_funcional: [],
    irradiacion: "",
    irradiacion_detalle: "",
    cuello_sintomas: "",
    cuello_empeora_brazo: "",
    sintomas_asociados: [],
    movimientos_agravantes: [],
    movimientos_agravantes_otro: "",
    perdida_movilidad_pasiva: "",
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
    inestabilidad_direccion: "",
    chasquido_cuando: "",
    debilidad_movimiento: "",
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
  | "weakness"
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
  return a.sintomas_asociados.some(
    (s) => s === name || s.toLowerCase().includes(name.toLowerCase())
  );
}

function hasTingling(a: ShoulderAdaptiveAnswers): boolean {
  return (
    hasSymptom(a, "Hormigueo o entumecimiento") ||
    a.tipo_dolor.includes("Hormigueo")
  );
}

function hasWeakness(a: ShoulderAdaptiveAnswers): boolean {
  return a.sintomas_asociados.some((s) => /debilidad/i.test(s));
}

export const SHOULDER_QUESTIONS: ShoulderQuestionDef[] = [
  // Timing first so sleep/night questions can be hidden when injury is hours-old
  { id: "evolucion", section: "red_flags", label: "¿Cuánto tiempo llevas con este problema?", type: "single", options: EVOLUTION_OPTIONS, required: true },
  { id: "rf_deformidad", section: "red_flags", label: "¿Hay deformidad evidente tras un traumatismo?", type: "single", options: YES_NO, required: true },
  { id: "rf_no_movimiento", section: "red_flags", label: "¿Incapacidad absoluta para mover el brazo?", type: "single", options: YES_NO, required: true },
  { id: "rf_perdida_fuerza", section: "red_flags", label: "¿Pérdida súbita de fuerza en el brazo?", type: "single", options: YES_NO, required: true },
  { id: "rf_perdida_sensibilidad", section: "red_flags", label: "¿Pérdida de sensibilidad (entumecimiento marcado)?", type: "single", options: YES_NO, required: true },
  { id: "rf_fiebre", section: "red_flags", label: "¿Fiebre asociada al dolor?", type: "single", options: YES_NO, required: true },
  { id: "rf_respiracion_torax", section: "red_flags", label: "¿Dolor acompañado de dificultad respiratoria o dolor torácico?", type: "single", options: YES_NO, required: true },
  { id: "rf_luxacion_actual", section: "red_flags", label: "¿Sientes que el hombro está fuera de su sitio ahora mismo?", type: "single", options: YES_NO, required: true },
  { id: "rf_dolor_nocturno_sistemico", section: "red_flags", label: "¿Dolor nocturno constante que no mejora con reposo, con pérdida de peso no explicada?", type: "single", options: YES_NO, required: true, showIf: (a) => shouldShowSleepDependentQuestion("rf_dolor_nocturno_sistemico", a.evolucion) },

  // Core clinical characterization
  { id: "inicio", section: "core", label: "¿Cómo fue el inicio?", type: "single", options: ONSET_FORM_OPTIONS, required: true },
  { id: "mecanismo", section: "core", label: "¿Qué pudo provocarlo? (puedes marcar varias)", type: "multi", options: MECHANISM_OPTIONS, required: true },
  { id: "mecanismo_otro", section: "core", label: "Describe el mecanismo", type: "text", required: true, showIf: (a) => a.mecanismo.includes("Otro") },
  { id: "intensidad_dolor", section: "core", label: "Intensidad del dolor (1–10)", type: "slider", required: true },
  { id: "localizacion_hombro", section: "core", label: "¿Dónde sientes el dolor en el hombro? (puedes marcar varias)", type: "multi", options: SHOULDER_ANATOMIC_LOCATION, required: true },
  { id: "tipo_dolor", section: "core", label: "¿Cómo describirías el dolor?", type: "multi", options: PAIN_TYPE_OPTIONS, required: true },
  { id: "patron_dolor", section: "core", label: "¿En qué situaciones aparece o empeora?", type: "multi", options: PAIN_SITUATION_OPTIONS, required: true },
  { id: "limitacion_funcional", section: "core", label: "¿Cuánto te limita en tu día a día? (puedes marcar varias)", type: "multi", options: FUNCTIONAL_LIMIT_OPTIONS, required: true },
  { id: "irradiacion", section: "core", label: "¿El dolor se irradia hacia el brazo?", type: "single", options: YES_NO, required: true },
  { id: "irradiacion_detalle", section: "core", label: "¿Hasta dónde llega la irradiación?", type: "text", required: true, showIf: (a) => a.irradiacion === "Sí" },
  { id: "cuello_sintomas", section: "core", label: "¿También notas dolor, rigidez u hormigueo en el cuello?", type: "single", options: YES_NO, required: true },
  {
    id: "cuello_empeora_brazo",
    section: "core",
    label: "¿Al girar o inclinar la cabeza te empeora el dolor del hombro o el hormigueo del brazo?",
    type: "single",
    options: YES_NO,
    required: true,
    showIf: (a) => a.cuello_sintomas === "Sí" || hasTingling(a) || a.irradiacion === "Sí",
  },
  { id: "sintomas_asociados", section: "core", label: "¿Qué otros síntomas notas?", type: "multi", options: ASSOCIATED_SYMPTOM_OPTIONS, required: true },
  { id: "movimientos_agravantes", section: "core", label: "¿Qué movimientos lo provocan o empeoran? (puedes marcar varias)", type: "multi", options: AGGRAVATING_MOVEMENT_OPTIONS, required: true },
  { id: "movimientos_agravantes_otro", section: "core", label: "Describe qué otro movimiento lo provoca o empeora", type: "text", required: true, showIf: (a) => a.movimientos_agravantes.includes("Otro") },
  {
    id: "perdida_movilidad_pasiva",
    section: "core",
    label: "Si otra persona mueve tu brazo con suavidad (tú relajado, sin hacer fuerza), ¿qué pasa?",
    type: "single",
    options: PASSIVE_ROM_ASSIST_OPTIONS,
    required: true,
  },

  // Fall branch
  { id: "caida_como", section: "fall", label: "¿Cómo caíste?", type: "single", options: FALL_HOW_OPTIONS, required: true, showIf: (a) => a.mecanismo.includes("Caída") },
  { id: "caida_chasquido", section: "fall", label: "¿Escuchaste un chasquido o crujido?", type: "single", options: YES_NO, required: true, showIf: (a) => a.mecanismo.includes("Caída") },
  { id: "caida_uso_brazo", section: "fall", label: "¿Pudiste seguir utilizando el brazo después?", type: "single", options: FALL_ARM_USE_OPTIONS, required: true, showIf: (a) => a.mecanismo.includes("Caída") },

  // Training branch
  { id: "entreno_ejercicio", section: "training", label: "¿Qué ejercicio o gesto estabas realizando?", type: "text", required: true, showIf: (a) => a.mecanismo.includes("Entrenamiento o ejercicio") },
  { id: "entreno_momento", section: "training", label: "¿Cuándo apareció el dolor?", type: "single", options: TRAINING_TIMING_OPTIONS, required: true, showIf: (a) => a.mecanismo.includes("Entrenamiento o ejercicio") },
  { id: "entreno_carga", section: "training", label: "¿Qué tipo de carga utilizabas?", type: "single", options: TRAINING_LOAD_OPTIONS, required: true, showIf: (a) => a.mecanismo.includes("Entrenamiento o ejercicio") },

  // Repetitive branch
  { id: "repetitivo_actividad", section: "repetitive", label: "¿Qué actividad repetitiva lo desencadena?", type: "text", required: true, showIf: (a) => a.mecanismo.includes("Movimiento repetitivo") },
  { id: "repetitivo_frecuencia", section: "repetitive", label: "¿Con qué frecuencia realizas esa actividad?", type: "single", options: ["Diariamente", "Varias veces por semana", "Ocasionalmente"], required: true, showIf: (a) => a.mecanismo.includes("Movimiento repetitivo") },

  // Tingling branch
  { id: "hormigueo_dedos", section: "tingling", label: "¿Qué dedos o zonas están afectados?", type: "multi", options: TINGLING_FINGER_OPTIONS, required: true, showIf: hasTingling },
  { id: "hormigueo_constante", section: "tingling", label: "¿El hormigueo es constante?", type: "single", options: ["No, intermitente", "Sí, constante"], required: true, showIf: hasTingling },
  { id: "hormigueo_movimientos", section: "tingling", label: "¿Qué movimientos lo desencadenan?", type: "text", required: false, showIf: hasTingling },

  // Instability branch
  { id: "inestabilidad_salido", section: "instability", label: "¿El hombro se ha salido (luxación) anteriormente?", type: "single", options: INSTABILITY_HISTORY_OPTIONS, required: true, showIf: (a) => hasSymptom(a, "Sensación de inestabilidad") },
  { id: "inestabilidad_desplaza", section: "instability", label: "¿Sientes que el hombro se desplaza o da inseguridad?", type: "single", options: INSTABILITY_FEELING_OPTIONS, required: true, showIf: (a) => hasSymptom(a, "Sensación de inestabilidad") },
  { id: "inestabilidad_cuando", section: "instability", label: "¿En qué situaciones notas la inestabilidad?", type: "text", required: false, showIf: (a) => hasSymptom(a, "Sensación de inestabilidad") },
  { id: "inestabilidad_direccion", section: "instability", label: "¿Hacia qué dirección notas que se desplaza el hombro?", type: "single", options: INSTABILITY_DIRECTION_OPTIONS, required: true, showIf: (a) => hasSymptom(a, "Sensación de inestabilidad") },

  // Clicking branch
  { id: "chasquido_cuando", section: "clicking", label: "¿Cuándo aparecen los chasquidos?", type: "text", required: false, showIf: (a) => hasSymptom(a, "Chasquidos") },

  // Weakness branch
  { id: "debilidad_movimiento", section: "weakness", label: "¿Con qué movimiento notas más debilidad?", type: "text", required: false, showIf: hasWeakness },

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
  weakness: "Debilidad",
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
  "weakness",
  "history",
];

export function adaptShoulderQuestionForFocus(
  q: ShoulderQuestionDef,
  focus: ShoulderQuestionnaireFocus
): ShoulderQuestionDef {
  if (focus !== "pectoral") return q;

  switch (q.id) {
    case "rf_luxacion_actual":
      return {
        ...q,
        label:
          "¿Notas un hueco, deformación o asimetría clara en el pecho o la axila ahora mismo?",
      };
    case "localizacion_hombro":
      return {
        ...q,
        label:
          "¿Dónde sientes el dolor en el pectoral / pecho? (puedes marcar varias)",
        options: PECTORAL_ANATOMIC_LOCATION,
      };
    case "cuello_empeora_brazo":
      return {
        ...q,
        label:
          "¿Al girar o inclinar la cabeza te empeora el dolor del pecho/pectoral o el hormigueo del brazo?",
      };
    case "sintomas_asociados":
      return {
        ...q,
        options: PECTORAL_ASSOCIATED_SYMPTOM_OPTIONS,
      };
    case "movimientos_agravantes":
      return {
        ...q,
        options: PECTORAL_AGGRAVATING_MOVEMENT_OPTIONS,
      };
    case "caida_como":
      return {
        ...q,
        options: PECTORAL_FALL_HOW_OPTIONS,
      };
    case "entreno_ejercicio":
      return {
        ...q,
        label:
          "¿Qué ejercicio de pecho o gesto estabas realizando? (p. ej. press banca, aperturas, flexiones)",
      };
    case "lesion_previa":
      return {
        ...q,
        label: "¿Has tenido lesiones previas en este pectoral / pecho?",
      };
    case "inestabilidad_salido":
    case "inestabilidad_desplaza":
    case "inestabilidad_cuando":
    case "inestabilidad_direccion":
      // Hidden in pectoral focus via filter below; keep type-safe default.
      return q;
    default:
      return q;
  }
}

export function getVisibleShoulderQuestions(
  answers: ShoulderAdaptiveAnswers,
  focus: ShoulderQuestionnaireFocus = "shoulder"
): ShoulderQuestionDef[] {
  return SHOULDER_QUESTIONS.filter((q) => {
    if (focus === "pectoral" && q.section === "instability") return false;
    if (!q.showIf || q.showIf(answers)) return true;
    return false;
  }).map((q) => {
    let next = adaptShoulderQuestionForFocus(q, focus);
    if (!next.options?.length) return next;
    const filtered = filterSleepDependentOptions(next.options, answers.evolucion);
    if (filtered.length === next.options.length) return next;
    return { ...next, options: filtered };
  });
}

export function getVisibleShoulderSections(
  answers: ShoulderAdaptiveAnswers,
  focus: ShoulderQuestionnaireFocus = "shoulder"
): ShoulderQuestionSection[] {
  const visible = getVisibleShoulderQuestions(answers, focus);
  return SHOULDER_SECTION_ORDER.filter((s) => visible.some((q) => q.section === s));
}

const RED_FLAG_IDS: (keyof ShoulderAdaptiveAnswers)[] = [
  "rf_deformidad",
  "rf_no_movimiento",
  "rf_perdida_fuerza",
  "rf_perdida_sensibilidad",
  "rf_fiebre",
  "rf_respiracion_torax",
  "rf_luxacion_actual",
  "rf_dolor_nocturno_sistemico",
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
    rf_luxacion_actual: "Luxación actual (hombro fuera de sitio ahora mismo)",
    rf_dolor_nocturno_sistemico: "Dolor nocturno constante con pérdida de peso no explicada",
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

export function validateShoulderAdaptive(
  answers: ShoulderAdaptiveAnswers,
  focus: ShoulderQuestionnaireFocus = "shoulder"
): string | null {
  const visible = getVisibleShoulderQuestions(answers, focus);
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
  bodyMapText: string,
  focus: ShoulderQuestionnaireFocus = "shoulder"
): string {
  const { urgent, triggered } = detectRedFlags(answers);
  const lines: string[] = [
    focus === "pectoral"
      ? "=== CUESTIONARIO ADAPTATIVO — PECTORAL / PECHO ==="
      : "=== CUESTIONARIO ADAPTATIVO — HOMBRO ===",
    "",
    focus === "pectoral"
      ? "IMPORTANTE: El paciente describe dolor de PECTORAL/PECHO, no de la articulación del hombro. Centra la orientación en pectoral mayor/menor; no asumas manguito rotador ni glenohumeral salvo datos claros."
      : "",
    bodyMapText,
    "",
    "— MECANISMO DE LA LESIÓN (prioridad máxima — citar exactamente en el resumen) —",
    `Mecanismo según cuestionario: ${answers.mecanismo.join(", ")}${answers.mecanismo.includes("Otro") && answers.mecanismo_otro ? ` (${answers.mecanismo_otro})` : ""}`,
    "NO sustituir por el deporte habitual del perfil del paciente.",
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
    focus === "pectoral"
      ? `Hueco/deformación pecho-axila: ${answers.rf_luxacion_actual || "—"}`
      : `Luxación actual: ${answers.rf_luxacion_actual || "—"}`,
    `Dolor nocturno sistémico con pérdida de peso: ${answers.rf_dolor_nocturno_sistemico || "—"}`,
    "",
    "— VARIABLES CLÍNICAS —",
    `Tiempo de evolución: ${answers.evolucion}`,
    `Forma de inicio: ${answers.inicio}`,
    `Mecanismo: ${answers.mecanismo.join(", ")}${answers.mecanismo.includes("Otro") && answers.mecanismo_otro ? ` (${answers.mecanismo_otro})` : ""}`,
    `Intensidad dolor: ${answers.intensidad_dolor}/10`,
    focus === "pectoral"
      ? `Localización anatómica pectoral/pecho: ${formatMulti(answers.localizacion_hombro)}`
      : `Localización anatómica hombro: ${formatMulti(answers.localizacion_hombro)}`,
    `Tipo de dolor: ${formatMulti(answers.tipo_dolor)}`,
    `Situaciones de dolor: ${formatMulti(answers.patron_dolor)}`,
    `Limitación funcional: ${answers.limitacion_funcional.join(", ") || "—"}`,
    `Irradiación: ${answers.irradiacion}${answers.irradiacion === "Sí" && answers.irradiacion_detalle ? ` — ${answers.irradiacion_detalle}` : ""}`,
    `Síntomas de cuello: ${answers.cuello_sintomas || "—"}`,
    answers.cuello_empeora_brazo
      ? focus === "pectoral"
        ? `Cabeza empeora pecho/brazo: ${answers.cuello_empeora_brazo}`
        : `Cabeza empeora hombro/brazo: ${answers.cuello_empeora_brazo}`
      : "",
    `Síntomas asociados: ${formatMulti(answers.sintomas_asociados)}`,
    `Movimientos agravantes: ${formatMulti(answers.movimientos_agravantes)}${answers.movimientos_agravantes.includes("Otro") && answers.movimientos_agravantes_otro ? ` (otro: ${answers.movimientos_agravantes_otro})` : ""}`,
    `Movimiento con ayuda (pasivo): ${answers.perdida_movilidad_pasiva || "—"}`,
  ];

  if (answers.mecanismo.includes("Caída")) {
    lines.push(
      "",
      "— DETALLE CAÍDA —",
      `Cómo cayó: ${answers.caida_como}`,
      `Chasquido: ${answers.caida_chasquido}`,
      `Uso del brazo tras caída: ${answers.caida_uso_brazo}`
    );
  }
  if (answers.mecanismo.includes("Entrenamiento o ejercicio")) {
    lines.push(
      "",
      "— DETALLE ENTRENAMIENTO —",
      `Ejercicio: ${answers.entreno_ejercicio}`,
      `Momento: ${answers.entreno_momento}`,
      `Carga: ${answers.entreno_carga}`
    );
  }
  if (answers.mecanismo.includes("Movimiento repetitivo")) {
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
      `Dirección de la inestabilidad: ${answers.inestabilidad_direccion || "—"}`,
      answers.inestabilidad_cuando ? `Cuándo: ${answers.inestabilidad_cuando}` : ""
    );
  }
  if (hasSymptom(answers, "Chasquidos") && answers.chasquido_cuando) {
    lines.push("", "— CHASQUIDOS —", `Cuándo: ${answers.chasquido_cuando}`);
  }
  if (hasWeakness(answers)) {
    lines.push(
      "",
      "— DEBILIDAD —",
      answers.debilidad_movimiento ? `Movimiento con más debilidad: ${answers.debilidad_movimiento}` : "Movimiento con más debilidad: —"
    );
  }

  lines.push(
    "",
    "— ANTECEDENTES —",
    focus === "pectoral"
      ? `Lesión previa pectoral/pecho: ${answers.lesion_previa}${answers.lesion_previa === "Sí" && answers.lesion_previa_detalle ? ` — ${answers.lesion_previa_detalle}` : ""}`
      : `Lesión previa hombro: ${answers.lesion_previa}${answers.lesion_previa === "Sí" && answers.lesion_previa_detalle ? ` — ${answers.lesion_previa_detalle}` : ""}`,
    `Impacto deportivo: ${answers.deporte_impacto}`,
    "",
    "NOTA: El sistema recopila variables clínicas para estimar estructuras afectadas, no para diagnosticar.",
    "",
    "ORIENTACIÓN DIFERENCIAL (usar el cuestionario; no inventar datos):",
    ...(focus === "pectoral"
      ? [
          "- Latigazo en press banca/aperturas + hematoma axilar + debilidad de aducción → sospecha rotura de pectoral mayor.",
          "- Dolor en vientre/inserción del pectoral al juntar los brazos o en flexiones → distensión / tendinopatía de pectoral.",
          "- Dolor torácico + dificultad respiratoria / sudor frío / náuseas → descartar urgencia cardiológica (no orientar solo como músculo).",
          "- Dolor pecho + síntomas cervicales que empeoran al girar la cabeza → posible dolor referido; no forzar solo pectoral.",
          "- Si el tiempo de evolución es 'Ha sido ahora' o 'Reciente (1-4 horas)': NO uses patrones de dolor nocturno / dormir / rigidez matutina.",
        ]
      : [
          "- Arco doloroso medio (60°–120°) + dolor al elevar por encima de la cabeza → pinzamiento subacromial.",
          "- Debilidad en rotación externa/elevación + arco doloroso + edad >40 → tendinopatía / rotura del manguito rotador.",
          "- Dolor en cara anterior + chasquido/dolor con flexión de codo contra resistencia o supinación → tendinopatía bicipital / lesión SLAP.",
          "- Sensación de inestabilidad + episodios de luxación/subluxación + dirección definida → inestabilidad glenohumeral.",
          "- Dolor localizado en la articulación AC + empeora al cruzar el brazo por delante del pecho → lesión acromioclavicular.",
          "- Pérdida global y progresiva de movilidad activa Y pasiva (igual limitación con ayuda) + rigidez → capsulitis adhesiva (hombro congelado).",
          "- Inicio progresivo + edad avanzada + rigidez y dolor profundo articular → artrosis glenohumeral (OA).",
          "- Hormigueo/entumecimiento en mano + empeora con el brazo elevado o cargando peso → síndrome del desfiladero torácico (TOS).",
          "- Dolor irradiado desde el cuello + hormigueo en dedos concretos + movimientos cervicales lo reproducen → radiculopatía cervical referida.",
          "- Dolor/rigidez de cuello + empeora al girar/inclinar la cabeza + tests locales del hombro poco provocativos → dolor referido cervical (no forzar manguito/tendón local).",
          "- Si el tiempo de evolución es 'Ha sido ahora' o 'Reciente (1-4 horas)': NO uses patrones de dolor nocturno / dormir / rigidez matutina (aún no ha dormido con la lesión).",
        ])
  );

  return lines.filter(Boolean).join("\n");
}

export function validateShoulderSection(
  section: ShoulderQuestionSection,
  answers: ShoulderAdaptiveAnswers,
  focus: ShoulderQuestionnaireFocus = "shoulder"
): string | null {
  const questions = getVisibleShoulderQuestions(answers, focus).filter(
    (q) => q.section === section
  );
  for (const q of questions) {
    if (q.required !== false && !isAnswered(q, answers)) {
      return `Responde: ${q.label.replace(/\?$/, "")}.`;
    }
  }
  return null;
}

export const SHOULDER_LABEL_EN: Partial<Record<string, string>> = {
  rf_deformidad: "Is there an obvious deformity after trauma?",
  rf_no_movimiento: "Are you completely unable to move the arm?",
  rf_perdida_fuerza: "Sudden loss of strength in the arm?",
  rf_perdida_sensibilidad: "Loss of sensation (marked numbness)?",
  rf_fiebre: "Fever associated with the pain?",
  rf_respiracion_torax: "Pain with breathing difficulty or chest pain?",
  rf_luxacion_actual: "Does it feel like the shoulder is out of place right now?",
  rf_dolor_nocturno_sistemico: "Constant night pain that doesn't improve with rest, with unexplained weight loss?",
  evolucion: "How long have you had this problem?",
  inicio: "How did it start?",
  mecanismo: "What may have caused it? (you can select several)",
  mecanismo_otro: "Describe the mechanism",
  intensidad_dolor: "Pain intensity (1–10)",
  localizacion_hombro: "Where do you feel the pain in the shoulder? (you can select several)",
  tipo_dolor: "How would you describe the pain?",
  patron_dolor: "In which situations does it appear or worsen?",
  limitacion_funcional: "How much does it limit you day to day?",
  irradiacion: "Does the pain radiate down the arm?",
  irradiacion_detalle: "How far does the radiation go?",
  cuello_sintomas: "Do you also notice pain, stiffness, or tingling in the neck?",
  cuello_empeora_brazo:
    "When you turn or tilt your head, does the shoulder pain or arm tingling get worse?",
  sintomas_asociados: "What other symptoms do you notice?",
  movimientos_agravantes: "Which movements provoke or worsen it? (you can select several)",
  movimientos_agravantes_otro: "Describe which other movement provokes or worsens it",
  perdida_movilidad_pasiva:
    "If someone else moves your arm gently (you relaxed, not pushing), what happens?",
  caida_como: "How did you fall?",
  caida_chasquido: "Did you hear a click or crack?",
  caida_uso_brazo: "Could you keep using the arm afterwards?",
  entreno_ejercicio: "Which exercise or movement were you doing?",
  entreno_momento: "When did the pain appear?",
  entreno_carga: "What type of load were you using?",
  repetitivo_actividad: "Which repetitive activity triggers it?",
  repetitivo_frecuencia: "How often do you do that activity?",
  hormigueo_dedos: "Which fingers or areas are affected?",
  hormigueo_constante: "Is the tingling constant?",
  hormigueo_movimientos: "Which movements trigger it?",
  inestabilidad_salido: "Has the shoulder come out (dislocated) before?",
  inestabilidad_desplaza: "Does the shoulder feel like it shifts or is insecure?",
  inestabilidad_cuando: "In which situations do you notice the instability?",
  inestabilidad_direccion: "In which direction does the shoulder feel like it shifts?",
  chasquido_cuando: "When do the clicks appear?",
  debilidad_movimiento: "With which movement do you notice the most weakness?",
  lesion_previa: "Have you had previous injuries in this shoulder?",
  lesion_previa_detalle: "Describe previous injuries or treatments",
  deporte_impacto: "How does it affect your training or sport?",
};

export const SHOULDER_OPTION_EN: Record<string, string> = {
  No: "No",
  Sí: "Yes",
  "Ha sido ahora": "Just now",
  "Reciente (1-4 horas)": "Recent (1–4 hours)",
  "Menos de 48 horas": "Less than 48 hours",
  "Entre 2 y 7 días": "Between 2 and 7 days",
  "Entre 1 y 4 semanas": "Between 1 and 4 weeks",
  "Más de 1 mes": "More than 1 month",
  Repentino: "Sudden",
  Progresivo: "Gradual",
  Caída: "Fall",
  "Golpe directo": "Direct blow",
  "Entrenamiento o ejercicio": "Training or exercise",
  "Movimiento repetitivo": "Repetitive movement",
  "Inicio progresivo sin causa clara": "Gradual onset with no clear cause",
  Otro: "Other",
  "Parte frontal (deltoides/anterior)": "Front (deltoid/anterior)",
  "Parte lateral": "Side (lateral)",
  "Parte posterior": "Back (posterior)",
  "Cerca de la clavícula / articulación AC": "Near the collarbone / AC joint",
  "Profundo dentro del hombro": "Deep inside the shoulder",
  "Zona escapular (omóplato)": "Scapular area (shoulder blade)",
  "Parte interna del pecho (cerca del esternón)": "Inner chest (near the sternum)",
  "Vientre muscular del pectoral (centro del pecho)": "Pectoral muscle belly (mid-chest)",
  "Inserción cercana a la axila": "Insertion near the armpit",
  "Borde inferior del pectoral": "Lower border of the pectoral",
  Axila: "Armpit",
  "Press de banca / press de pecho": "Bench press / chest press",
  "Aperturas o cruces (flyes)": "Flyes / cable crosses",
  Flexiones: "Push-ups",
  "Llevar el brazo atrás con el codo estirado": "Arm back with elbow straight",
  "Poner los brazos en cruz": "Arms out in a cross (T-pose)",
  "Debilidad al juntar los brazos (aducción)": "Weakness bringing the arms together (adduction)",
  "Hematoma en pecho o axila": "Bruising in the chest or armpit",
  "Chasquidos o latigazo": "Clicking or whip-like snap",
  "Sobre el pecho": "Onto the chest",
  "No estoy seguro": "I'm not sure",
  Punzante: "Sharp",
  Quemazón: "Burning",
  Rigidez: "Stiffness",
  "Presión / peso": "Pressure / heaviness",
  Hormigueo: "Tingling",
  "Malestar difuso": "Diffuse discomfort",
  "En reposo": "At rest",
  "Al mover": "When moving",
  "Con esfuerzo o carga": "With effort or load",
  "Por la noche": "At night",
  Constante: "Constant",
  Ninguna: "None",
  Leve: "Mild",
  Moderada: "Moderate",
  Severa: "Severe",
  "No puedo usar el brazo": "I can't use the arm",
  Debilidad: "Weakness",
  Chasquidos: "Clicking",
  "Inflamación / hinchazón": "Inflammation / swelling",
  "Hormigueo o entumecimiento": "Tingling or numbness",
  "Bloqueo del movimiento": "Movement locking",
  "Sensación de inestabilidad": "Feeling of instability",
  "Rigidez matutina": "Morning stiffness",
  Ninguno: "None",
  "Elevar el brazo por encima de la cabeza": "Raising the arm overhead",
  "Rotación interna o externa": "Internal or external rotation",
  "Llevar el brazo hacia atrás": "Reaching the arm behind",
  "Levantar peso": "Lifting weight",
  "Lanzar o servir": "Throwing or serving",
  "Dormir sobre ese lado": "Sleeping on that side",
  "Arco medio al subir el brazo (60°–120°)": "Mid-range arc when raising the arm (60°–120°)",
  "Cruzar el brazo por delante del pecho": "Crossing the arm in front of the chest",
  "Ninguno en particular": "None in particular",
  "Sí, duele o se bloquea igual aunque lo mueva otra persona":
    "Yes, it hurts or locks the same even if someone else moves it",
  "No, con ayuda puedo mover más o duele menos":
    "No, with help I can move more or it hurts less",
  "Sobre el hombro": "Onto the shoulder",
  "Sobre la mano (con el brazo extendido)": "Onto the hand (arm outstretched)",
  "Sobre el codo": "Onto the elbow",
  "De otra forma": "Another way",
  "Sí, pude seguir usándolo": "Yes, I could keep using it",
  Parcialmente: "Partially",
  "No, no pude usarlo": "No, I couldn't use it",
  "Durante el ejercicio": "During exercise",
  "Justo después": "Right afterwards",
  "Al día siguiente": "The next day",
  "Carga elevada": "Heavy load",
  "Carga moderada": "Moderate load",
  "Peso corporal": "Bodyweight",
  "Resistencia / endurance": "Endurance / resistance",
  Pulgar: "Thumb",
  Índice: "Index",
  Medio: "Middle",
  Anular: "Ring",
  Meñique: "Little finger",
  "Mano completa": "Whole hand",
  Antebrazo: "Forearm",
  "Sí, una vez": "Yes, once",
  "Sí, varias veces": "Yes, several times",
  "A veces": "Sometimes",
  "Sí, con frecuencia": "Yes, frequently",
  "No afecta": "Does not affect",
  "No puedo entrenar o competir": "I can't train or compete",
  Diariamente: "Daily",
  "Varias veces por semana": "Several times a week",
  Ocasionalmente: "Occasionally",
  "No, intermitente": "No, intermittent",
  "Sí, constante": "Yes, constant",
  "Hacia delante (al levantar/rotar hacia fuera)": "Forward (when raising/rotating outward)",
  "Hacia atrás": "Backward",
  "En varias direcciones": "In several directions",
  "No lo sé": "I don't know",
};

export const SHOULDER_SECTION_LABELS_EN: Record<string, string> = {
  red_flags: "Urgency check",
  core: "Problem characterization",
  fall: "Fall details",
  training: "Training details",
  repetitive: "Repetitive movement",
  tingling: "Tingling / numbness",
  instability: "Instability",
  clicking: "Clicking",
  weakness: "Weakness",
  history: "History",
};

export type ConsultLocale = "es" | "en";

const PECTORAL_LABEL_EN: Partial<Record<string, string>> = {
  rf_luxacion_actual:
    "Do you notice a clear hollow, deformity, or asymmetry in the chest or armpit right now?",
  localizacion_hombro:
    "Where do you feel the pain in the pectoral / chest? (you can select several)",
  cuello_empeora_brazo:
    "When you turn or tilt your head, does the chest/pectoral pain or arm tingling get worse?",
  entreno_ejercicio:
    "Which chest exercise or movement were you doing? (e.g. bench press, flyes, push-ups)",
  lesion_previa: "Have you had previous injuries in this pectoral / chest?",
};

export function localizeShoulderLabel(
  id: string,
  fallback: string,
  locale: ConsultLocale,
  focus: ShoulderQuestionnaireFocus = "shoulder"
): string {
  if (locale !== "en") return fallback;
  if (focus === "pectoral" && PECTORAL_LABEL_EN[id]) return PECTORAL_LABEL_EN[id]!;
  return SHOULDER_LABEL_EN[id] ?? fallback;
}
export function localizeShoulderOption(option: string, locale: ConsultLocale): string {
  if (locale !== "en") return option;
  return SHOULDER_OPTION_EN[option] ?? option;
}
export function localizeShoulderSection(section: string, locale: ConsultLocale): string {
  if (locale !== "en") return (SHOULDER_SECTION_LABELS as any)[section] ?? section;
  return SHOULDER_SECTION_LABELS_EN[section] ?? (SHOULDER_SECTION_LABELS as any)[section] ?? section;
}

