import {
  filterSleepDependentOptions,
  shouldShowSleepDependentQuestion,
} from "@/lib/consulta-timing";
/**
 * Adaptive questionnaire for back / lumbar-thoracic pain — same structure as knee / shoulder
 * (urgency → core → mechanism branches → neuro / sciatica pattern → history).
 */
import { missingQuestionIssue, type AdaptiveValidationIssue } from "@/lib/consulta-validation";

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
  "Caída",
  "Golpe directo",
  "Levantamiento / esfuerzo",
  "Entrenamiento o ejercicio",
  "Movimiento repetitivo / postura",
  "Empezó poco a poco, sin causa clara",
  "Otro",
] as const;

export const BACK_LOCATION_OPTIONS = [
  "Parte baja del cuello / inicio de la espalda",
  "Espalda media / entre omóplatos",
  "Espalda baja (parte alta)",
  "Espalda baja (parte baja)",
  "Parte final de la espalda / junto al coxis (sacro)",
  "Coxis (final de la columna)",
  "Solo lado izquierdo",
  "Solo lado derecho",
  "Ambos lados / en el centro",
  "No estoy seguro",
] as const;

export const PAIN_TYPE_OPTIONS = [
  "Punzante",
  "Quemazón",
  "Rigidez",
  "Presión / peso",
  "Hormigueo",
  "Eléctrico / descarga",
  "Malestar difuso",
] as const;

export const FUNCTIONAL_LIMIT_OPTIONS = [
  "Ninguna",
  "Leve (puedo hacer actividades diarias pero molesta)",
  "Moderada (limita trabajo, conducción o deporte)",
  "Severa (dificultad para vestirme, sentarme o caminar)",
  "No puedo realizar actividades básicas",
] as const;

export const ASSOCIATED_SYMPTOM_OPTIONS = [
  "Rigidez matutina",
  "Hormigueo / entumecimiento en pierna",
  "Debilidad en pierna",
  "Dolor hacia glúteo",
  "Dolor que baja por la pierna (ciática)",
  "Espasmo muscular",
  "Bloqueo / no puedo enderezarme",
  "Ninguno",
] as const;

export const AGGRAVATING_MOVEMENT_OPTIONS = [
  "Agacharse (doblar la espalda)",
  "Echarse hacia atrás",
  "Estar sentado mucho rato",
  "Estar de pie",
  "Caminar",
  "Tos / estornudo",
  "Levantarse de la cama",
  "Giro del tronco",
  "Ninguno",
] as const;

export const LIFT_WEIGHT_OPTIONS = [
  "Ligero (menos de 5 kg)",
  "Moderado (5-15 kg)",
  "Pesado (más de 15 kg)",
  "No recuerdo",
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
  "Ejercicio de resistencia (mucho tiempo o muchas repeticiones)",
] as const;

export const NEURO_LEG_OPTIONS = [
  "Izquierda",
  "Derecha",
  "Ambas",
  "No estoy seguro",
] as const;

export const NEURO_ZONE_OPTIONS = [
  "Glúteo",
  "Parte posterior del muslo",
  "Parte posterior de la pantorrilla",
  "Pie / dedos",
  "Planta del pie",
  "Zona lumbar",
  "Zona sacra",
] as const;

export const MORNING_STIFFNESS_DURATION_OPTIONS = [
  "Menos de 30 minutos",
  "Entre 30 y 60 minutos",
  "Más de 60 minutos",
  "No tengo rigidez matutina",
] as const;

export const ACTIVITY_REST_PATTERN_OPTIONS = [
  "Mejora con actividad, empeora en reposo",
  "Mejora en reposo, empeora con actividad",
  "Sin patrón claro",
] as const;

export const NEUROGENIC_CLAUDICATION_OPTIONS = [
  "Empeora igual de pie que caminando",
  "Puedo caminar un rato y luego empeora, mejora si me inclino/siento",
  "No noto relación con caminar",
] as const;

export const LIFT_POSTURE_OPTIONS = [
  "Espalda recta, doblando rodillas",
  "Espalda doblada/curvada",
  "Con giro o rotación del tronco",
  "No lo recuerdo",
] as const;

export type BackAdaptiveAnswers = {
  // Red flags
  rf_debilidad_bilateral_pie_caido: string;
  rf_anestesia_silla: string;
  rf_esfinteres: string;
  rf_fiebre_perdida_peso: string;
  rf_trauma_grave: string;
  rf_dolor_toracico_respiracion: string;
  rf_antecedente_cancer: string;
  rf_riesgo_fractura_fragil: string;
  // Core
  evolucion: string;
  inicio: string;
  mecanismo: string[];
  mecanismo_otro: string;
  intensidad_dolor: number;
  localizacion_espalda: string[];
  dolor_familiar: string;
  tipo_dolor: string[];
  limitacion_funcional: string[];
  irradiacion: string;
  irradiacion_detalle: string;
  sintomas_asociados: string[];
  movimientos_agravantes: string[];
  patron_sacroiliaco: string;
  rigidez_matutina_duracion: string;
  patron_actividad_reposo: string;
  // Trauma branch
  trauma_detalle: string;
  trauma_chasquido: string;
  trauma_movilidad: string;
  // Lift branch
  levantamiento_peso: string;
  levantamiento_como: string;
  levantamiento_chasquido: string;
  levantamiento_postura: string;
  // Training branch
  entreno_ejercicio: string;
  entreno_momento: string;
  entreno_carga: string;
  // Repetitive branch
  repetitivo_actividad: string;
  repetitivo_frecuencia: string;
  // Neuro branch
  neuro_pierna: string;
  neuro_zona: string[];
  neuro_tos_estornudo: string;
  // Sciatica pattern branch
  ciatica_debajo_rodilla: string;
  ciatica_peor_sentado: string;
  ciatica_mejor_caminar: string;
  // History
  lesion_previa: string;
  lesion_previa_detalle: string;
};

export function defaultBackAdaptiveAnswers(): BackAdaptiveAnswers {
  return {
    rf_debilidad_bilateral_pie_caido: "",
    rf_anestesia_silla: "",
    rf_esfinteres: "",
    rf_fiebre_perdida_peso: "",
    rf_trauma_grave: "",
    rf_dolor_toracico_respiracion: "",
    rf_antecedente_cancer: "",
    rf_riesgo_fractura_fragil: "",
    evolucion: "",
    inicio: "",
    mecanismo: [],
    mecanismo_otro: "",
    intensidad_dolor: 5,
    localizacion_espalda: [],
    dolor_familiar: "",
    tipo_dolor: [],
    limitacion_funcional: [],
    irradiacion: "",
    irradiacion_detalle: "",
    sintomas_asociados: [],
    movimientos_agravantes: [],
    patron_sacroiliaco: "",
    rigidez_matutina_duracion: "",
    patron_actividad_reposo: "",
    trauma_detalle: "",
    trauma_chasquido: "",
    trauma_movilidad: "",
    levantamiento_peso: "",
    levantamiento_como: "",
    levantamiento_chasquido: "",
    levantamiento_postura: "",
    entreno_ejercicio: "",
    entreno_momento: "",
    entreno_carga: "",
    repetitivo_actividad: "",
    repetitivo_frecuencia: "",
    neuro_pierna: "",
    neuro_zona: [],
    neuro_tos_estornudo: "",
    ciatica_debajo_rodilla: "",
    ciatica_peor_sentado: "",
    ciatica_mejor_caminar: "",
    lesion_previa: "",
    lesion_previa_detalle: "",
  };
}

export type BackQuestionSection =
  | "red_flags"
  | "core"
  | "trauma"
  | "lift"
  | "training"
  | "repetitive"
  | "neuro"
  | "sciatica_pattern"
  | "history";

export type BackQuestionDef = {
  id: keyof BackAdaptiveAnswers;
  section: BackQuestionSection;
  label: string;
  type: "single" | "multi" | "text" | "slider";
  options?: readonly string[];
  required?: boolean;
  showIf?: (a: BackAdaptiveAnswers) => boolean;
};

function hasSymptom(a: BackAdaptiveAnswers, name: string): boolean {
  return a.sintomas_asociados.includes(name);
}

function isTrauma(a: BackAdaptiveAnswers): boolean {
  return a.mecanismo.includes("Caída") || a.mecanismo.includes("Golpe directo");
}

function isLift(a: BackAdaptiveAnswers): boolean {
  return a.mecanismo.includes("Levantamiento / esfuerzo");
}

function isRepetitive(a: BackAdaptiveAnswers): boolean {
  return a.mecanismo.includes("Movimiento repetitivo / postura");
}

function hasNeuro(a: BackAdaptiveAnswers): boolean {
  return (
    hasSymptom(a, "Hormigueo / entumecimiento en pierna") ||
    hasSymptom(a, "Dolor que baja por la pierna (ciática)") ||
    a.tipo_dolor.includes("Hormigueo")
  );
}

function hasSciaticaPattern(a: BackAdaptiveAnswers): boolean {
  return (
    a.irradiacion === "Sí" ||
    hasSymptom(a, "Dolor que baja por la pierna (ciática)") ||
    hasSymptom(a, "Dolor hacia glúteo")
  );
}

export const BACK_QUESTIONS: BackQuestionDef[] = [

  // Timing first (hide sleep/night questions if injury is hours-old)
  {
    id: "evolucion",
    section: "red_flags",
    label: "¿Cuánto tiempo llevas con este problema?",
    type: "single",
    options: EVOLUTION_OPTIONS,
    required: true,
  },
  // Red flags — always first
  {
    id: "rf_debilidad_bilateral_pie_caido",
    section: "red_flags",
    label:
      "¿Debilidad progresiva en ambas piernas o pie caído (dificultad para levantar el pie)?",
    type: "single",
    options: YES_NO,
    required: true,
  },
  {
    id: "rf_anestesia_silla",
    section: "red_flags",
    label: "¿Entumecimiento entre las piernas o en la zona del asiento (como si montaras a caballo)?",
    type: "single",
    options: YES_NO,
    required: true,
  },
  {
    id: "rf_esfinteres",
    section: "red_flags",
    label:
      "¿Problemas nuevos para controlar la orina o las heces (se escapan o no puedes ir)?",
    type: "single",
    options: YES_NO,
    required: true,
  },
  {
    id: "rf_fiebre_perdida_peso",
    section: "red_flags",
    label:
      "¿Dolor nocturno intenso con fiebre o pérdida de peso inexplicada (sospecha infección/tumor)?",
    type: "single",
    options: YES_NO,
    required: true,
  },
  {
    id: "rf_trauma_grave",
    section: "red_flags",
    label:
      "¿Golpe o caída reciente y no pudiste moverte, o dolor nocturno muy fuerte tras la caída?",
    type: "single",
    options: YES_NO,
    required: true,
  },
  {
    id: "rf_dolor_toracico_respiracion",
    section: "red_flags",
    label:
      "¿Dolor en el pecho con dificultad para respirar o falta de aire junto al dolor de espalda?",
    type: "single",
    options: YES_NO,
    required: true,
  },
  {
    id: "rf_antecedente_cancer",
    section: "red_flags",
    label: "¿Tienes o has tenido cáncer, incluso tratado o en remisión?",
    type: "single",
    options: YES_NO,
    required: true,
  },
  {
    id: "rf_riesgo_fractura_fragil",
    section: "red_flags",
    label:
      "¿Te han dicho que tienes huesos frágiles (osteoporosis), tomas corticoides mucho tiempo, o eres mujer tras la menopausia, y el dolor empezó con un esfuerzo mínimo (agacharte, estornudar)?",
    type: "single",
    options: YES_NO,
    required: true,
  },

  // Core — location + familiar pain before mechanism
  {
    id: "localizacion_espalda",
    section: "core",
    label: "¿Dónde sientes el dolor en la espalda? (puedes marcar varias)",
    type: "multi",
    options: BACK_LOCATION_OPTIONS,
    required: true,
  },
  {
    id: "dolor_familiar",
    section: "core",
    label:
      "¿Es el mismo dolor que notas al agacharte, arquearte, estar sentado, o cuando baja por la pierna?",
    type: "single",
    options: ["Sí, es el mismo", "No, es otra molestia", "No estoy seguro"],
    required: true,
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
    id: "tipo_dolor",
    section: "core",
    label: "¿Cómo describirías el dolor? (puedes marcar varias)",
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
    id: "irradiacion",
    section: "core",
    label: "¿El dolor se extiende hacia el glúteo o la pierna?",
    type: "single",
    options: YES_NO,
    required: true,
  },
  {
    id: "irradiacion_detalle",
    section: "core",
    label: "¿Hasta dónde llega ese dolor?",
    type: "text",
    required: true,
    showIf: (a) => a.irradiacion === "Sí",
  },
  {
    id: "sintomas_asociados",
    section: "core",
    label: "¿Qué otros síntomas notas? (puedes marcar varias)",
    type: "multi",
    options: ASSOCIATED_SYMPTOM_OPTIONS,
    required: true,
  },
  {
    id: "movimientos_agravantes",
    section: "core",
    label: "¿Qué movimientos lo provocan o empeoran? (puedes marcar varias)",
    type: "multi",
    options: AGGRAVATING_MOVEMENT_OPTIONS,
    required: true,
  },
  {
    id: "patron_sacroiliaco",
    section: "core",
    label:
      "¿El dolor empeora al levantarte de una silla baja, subir escaleras, girarte en la cama o apoyarte en una sola pierna?",
    type: "single",
    options: YES_NO,
    required: true,
  },
  {
    id: "rigidez_matutina_duracion",
    section: "core",
    label: "¿Cuánto dura la rigidez al levantarte por la mañana?",
    type: "single",
    options: MORNING_STIFFNESS_DURATION_OPTIONS,
    required: true,
    showIf: (a) => shouldShowSleepDependentQuestion("rigidez_matutina_duracion", a.evolucion),
  },
  {
    id: "patron_actividad_reposo",
    section: "core",
    label: "¿Cómo se relaciona el dolor con la actividad y el reposo?",
    type: "single",
    options: ACTIVITY_REST_PATTERN_OPTIONS,
    required: true,
  },

  // Trauma branch
  {
    id: "trauma_detalle",
    section: "trauma",
    label: "Describe el golpe o la caída",
    type: "text",
    required: true,
    showIf: isTrauma,
  },
  {
    id: "trauma_chasquido",
    section: "trauma",
    label: "¿Escuchaste o sentiste un chasquido o crujido?",
    type: "single",
    options: YES_NO,
    required: true,
    showIf: isTrauma,
  },
  {
    id: "trauma_movilidad",
    section: "trauma",
    label: "¿Pudiste moverte o enderezarte después del golpe o la caída?",
    type: "single",
    options: ["Sí, con normalidad", "Parcialmente / con mucho dolor", "No, no pude"],
    required: true,
    showIf: isTrauma,
  },

  // Lift branch
  {
    id: "levantamiento_peso",
    section: "lift",
    label: "¿Aproximadamente qué peso levantabas?",
    type: "single",
    options: LIFT_WEIGHT_OPTIONS,
    required: true,
    showIf: isLift,
  },
  {
    id: "levantamiento_como",
    section: "lift",
    label: "¿Cómo realizaste el levantamiento? (postura, desde el suelo, etc.)",
    type: "text",
    required: true,
    showIf: isLift,
  },
  {
    id: "levantamiento_chasquido",
    section: "lift",
    label: "¿Escuchaste o sentiste un chasquido o pop al levantar?",
    type: "single",
    options: YES_NO,
    required: true,
    showIf: isLift,
  },
  {
    id: "levantamiento_postura",
    section: "lift",
    label: "¿Qué postura tenías al levantar el peso?",
    type: "single",
    options: LIFT_POSTURE_OPTIONS,
    required: true,
    showIf: isLift,
  },

  // Training branch
  {
    id: "entreno_ejercicio",
    section: "training",
    label: "¿Qué ejercicio o gesto estabas realizando?",
    type: "text",
    required: true,
    showIf: (a) => a.mecanismo.includes("Entrenamiento o ejercicio"),
  },
  {
    id: "entreno_momento",
    section: "training",
    label: "¿Cuándo apareció el dolor?",
    type: "single",
    options: TRAINING_TIMING_OPTIONS,
    required: true,
    showIf: (a) => a.mecanismo.includes("Entrenamiento o ejercicio"),
  },
  {
    id: "entreno_carga",
    section: "training",
    label: "¿Qué tipo de carga utilizabas?",
    type: "single",
    options: TRAINING_LOAD_OPTIONS,
    required: true,
    showIf: (a) => a.mecanismo.includes("Entrenamiento o ejercicio"),
  },

  // Repetitive / posture branch
  {
    id: "repetitivo_actividad",
    section: "repetitive",
    label: "¿Qué actividad repetitiva o postura prolongada lo desencadena?",
    type: "text",
    required: true,
    showIf: isRepetitive,
  },
  {
    id: "repetitivo_frecuencia",
    section: "repetitive",
    label: "¿Con qué frecuencia realizas esa actividad o postura?",
    type: "single",
    options: ["Diariamente", "Varias veces por semana", "Ocasionalmente"],
    required: true,
    showIf: isRepetitive,
  },

  // Neuro branch
  {
    id: "neuro_pierna",
    section: "neuro",
    label: "¿En qué pierna notas el hormigueo, entumecimiento o el dolor que baja (ciática)?",
    type: "single",
    options: NEURO_LEG_OPTIONS,
    required: true,
    showIf: hasNeuro,
  },
  {
    id: "neuro_zona",
    section: "neuro",
    label: "¿Qué zonas están afectadas? (puedes marcar varias)",
    type: "multi",
    options: NEURO_ZONE_OPTIONS,
    required: true,
    showIf: hasNeuro,
  },  {
    id: "neuro_tos_estornudo",
    section: "neuro",
    label: "¿Empeora con toser o estornudar?",
    type: "single",
    options: YES_NO,
    required: true,
    showIf: hasNeuro,
  },

  // Sciatica pattern branch
  {
    id: "ciatica_debajo_rodilla",
    section: "sciatica_pattern",
    label: "¿El dolor llega por debajo de la rodilla?",
    type: "single",
    options: YES_NO,
    required: true,
    showIf: hasSciaticaPattern,
  },
  {
    id: "ciatica_peor_sentado",
    section: "sciatica_pattern",
    label: "¿Empeora al estar sentado mucho rato?",
    type: "single",
    options: YES_NO,
    required: true,
    showIf: hasSciaticaPattern,
  },
  {
    id: "ciatica_mejor_caminar",
    section: "sciatica_pattern",
    label: "¿Mejora al caminar un poco?",
    type: "single",
    options: YES_NO,
    required: true,
    showIf: hasSciaticaPattern,
  },
  // History
  {
    id: "lesion_previa",
    section: "history",
    label: "¿Has tenido lesiones o cirugías previas en la espalda?",
    type: "single",
    options: YES_NO,
    required: true,
  },
  {
    id: "lesion_previa_detalle",
    section: "history",
    label: "Describe lesiones, cirugías o tratamientos previos",
    type: "text",
    required: true,
    showIf: (a) => a.lesion_previa === "Sí",
  },];

export const BACK_SECTION_LABELS: Record<BackQuestionSection, string> = {
  red_flags: "Comprobación de urgencia",
  core: "Caracterización del problema",
  trauma: "Detalles del golpe o la caída",
  lift: "Detalles del levantamiento / esfuerzo",
  training: "Detalles del entrenamiento",
  repetitive: "Movimiento repetitivo / postura prolongada",
  neuro: "Hormigueo / entumecimiento / ciática",
  sciatica_pattern: "Patrón de ciática / irradiación",
  history: "Antecedentes",
};

export const BACK_SECTION_ORDER: BackQuestionSection[] = [
  "red_flags",
  "core",
  "trauma",
  "lift",
  "training",
  "repetitive",
  "neuro",
  "sciatica_pattern",
  "history",
];

export function getVisibleBackQuestions(
  answers: BackAdaptiveAnswers
): BackQuestionDef[] {
  return BACK_QUESTIONS.filter((q) => !q.showIf || q.showIf(answers)).map((q) => {
    if (!q.options?.length) return q;
    const filtered = filterSleepDependentOptions(q.options, answers.evolucion);
    if (filtered.length === q.options.length) return q;
    return { ...q, options: filtered };
  });
}

export function getVisibleBackSections(
  answers: BackAdaptiveAnswers
): BackQuestionSection[] {
  const visible = getVisibleBackQuestions(answers);
  return BACK_SECTION_ORDER.filter((s) => visible.some((q) => q.section === s));
}

const RED_FLAG_IDS: (keyof BackAdaptiveAnswers)[] = [
  "rf_debilidad_bilateral_pie_caido",
  "rf_anestesia_silla",
  "rf_esfinteres",
  "rf_fiebre_perdida_peso",
  "rf_trauma_grave",
  "rf_dolor_toracico_respiracion",
  "rf_antecedente_cancer",
  "rf_riesgo_fractura_fragil",
];

export function detectBackRedFlags(answers: BackAdaptiveAnswers): {
  urgent: boolean;
  triggered: string[];
} {
  const labels: Record<string, string> = {
    rf_debilidad_bilateral_pie_caido:
      "Debilidad bilateral progresiva / pie caído",
    rf_anestesia_silla: "Entumecimiento entre las piernas / zona del asiento",
    rf_esfinteres: "Problemas para controlar orina o heces",
    rf_fiebre_perdida_peso:
      "Dolor nocturno con fiebre o pérdida de peso inexplicada",
    rf_trauma_grave:
      "Golpe o caída con imposibilidad de moverse o dolor nocturno muy fuerte",
    rf_dolor_toracico_respiracion:
      "Dolor en el pecho con dificultad para respirar",
    rf_antecedente_cancer: "Antecedente de cáncer (activo o en remisión)",
    rf_riesgo_fractura_fragil:
      "Huesos frágiles / osteoporosis / corticoides / postmenopausia y dolor con esfuerzo mínimo",
  };
  const triggered: string[] = [];
  for (const id of RED_FLAG_IDS) {
    if (answers[id] === "Sí") triggered.push(labels[id] ?? id);
  }
  return { urgent: triggered.length > 0, triggered };
}

function isAnswered(q: BackQuestionDef, answers: BackAdaptiveAnswers): boolean {
  const val = answers[q.id];
  if (q.type === "multi") return Array.isArray(val) && val.length > 0;
  if (q.type === "slider") return typeof val === "number" && val >= 1;
  if (q.type === "text") return typeof val === "string" && val.trim().length > 0;
  return typeof val === "string" && val.length > 0;
}

export function validateBackAdaptive(answers: BackAdaptiveAnswers): AdaptiveValidationIssue | null {
  const visible = getVisibleBackQuestions(answers);
  for (const q of visible) {
    if (q.required !== false && !isAnswered(q, answers)) {
      return missingQuestionIssue(q);
    }
  }
  return null;
}

export function validateBackSection(
  section: BackQuestionSection,
  answers: BackAdaptiveAnswers
): AdaptiveValidationIssue | null {
  const questions = getVisibleBackQuestions(answers).filter(
    (q) => q.section === section
  );
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

export function formatBackAdaptive(
  answers: BackAdaptiveAnswers,
  bodyMapText: string
): string {
  const { urgent, triggered } = detectBackRedFlags(answers);
  const lines: string[] = [
    "=== CUESTIONARIO ADAPTATIVO — ESPALDA / LUMBAR-TORÁCICA ===",
    "",
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
    `Debilidad bilateral / pie caído: ${answers.rf_debilidad_bilateral_pie_caido || "—"}`,
    `Anestesia silla de montar: ${answers.rf_anestesia_silla || "—"}`,
    `Alteración vejiga/intestino: ${answers.rf_esfinteres || "—"}`,
    `Fiebre / pérdida peso / dolor nocturno: ${answers.rf_fiebre_perdida_peso || "—"}`,
    `Trauma grave / imposibilidad moverse: ${answers.rf_trauma_grave || "—"}`,
    `Dolor torácico + disnea: ${answers.rf_dolor_toracico_respiracion || "—"}`,
    `Antecedente de cáncer: ${answers.rf_antecedente_cancer || "—"}`,
    `Riesgo de fractura por fragilidad: ${answers.rf_riesgo_fractura_fragil || "—"}`,
    "",
    "— VARIABLES CLÍNICAS —",
    `Tiempo de evolución: ${answers.evolucion}`,
    `Forma de inicio: ${answers.inicio}`,
    `Mecanismo: ${answers.mecanismo.join(", ")}${answers.mecanismo.includes("Otro") && answers.mecanismo_otro ? ` (${answers.mecanismo_otro})` : ""}`,
    `Intensidad dolor: ${answers.intensidad_dolor}/10`,
    `Localización espalda: ${formatMulti(answers.localizacion_espalda)}`,
    `Dolor familiar (agacharse/arquear/pierna): ${answers.dolor_familiar || "—"}`,
    `Tipo de dolor: ${formatMulti(answers.tipo_dolor)}`,
    `Limitación funcional: ${answers.limitacion_funcional.join(", ") || "—"}`,
    `Irradiación glúteo/pierna: ${answers.irradiacion}${answers.irradiacion === "Sí" && answers.irradiacion_detalle ? ` — ${answers.irradiacion_detalle}` : ""}`,
    `Síntomas asociados: ${formatMulti(answers.sintomas_asociados)}`,
    `Movimientos agravantes: ${formatMulti(answers.movimientos_agravantes)}`,
    `Patrón sacroilíaco (levantarse/escaleras/girar en cama/apoyo unipodal): ${answers.patron_sacroiliaco}`,
    `Duración rigidez matutina: ${answers.rigidez_matutina_duracion}`,
    `Patrón actividad/reposo: ${answers.patron_actividad_reposo}`,
  ];

  if (isTrauma(answers)) {
    lines.push(
      "",
      "— DETALLE TRAUMA —",
      `Detalle: ${answers.trauma_detalle}`,
      `Chasquido/crujido: ${answers.trauma_chasquido}`,
      `Movilidad tras trauma: ${answers.trauma_movilidad}`
    );
  }
  if (isLift(answers)) {
    lines.push(
      "",
      "— DETALLE LEVANTAMIENTO / ESFUERZO —",
      `Peso aproximado: ${answers.levantamiento_peso}`,
      `Cómo levantó: ${answers.levantamiento_como}`,
      `Chasquido/pop: ${answers.levantamiento_chasquido}`,
      `Postura al levantar: ${answers.levantamiento_postura}`
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
  if (isRepetitive(answers)) {
    lines.push(
      "",
      "— MOVIMIENTO REPETITIVO / POSTURA —",
      `Actividad/postura: ${answers.repetitivo_actividad}`,
      `Frecuencia: ${answers.repetitivo_frecuencia}`
    );
  }
  if (hasNeuro(answers)) {
    lines.push(
      "",
      "— HORMIGUEO / ENTUMECIMIENTO / CIÁTICA —",
      `Pierna afectada: ${answers.neuro_pierna}`,
      `Zonas: ${formatMulti(answers.neuro_zona)}`,
      `Empeora con tos/estornudo: ${answers.neuro_tos_estornudo}`
    );
  }
  if (hasSciaticaPattern(answers)) {
    lines.push(
      "",
      "— PATRÓN CIÁTICA / IRRADIACIÓN —",
      `Llega debajo de rodilla: ${answers.ciatica_debajo_rodilla}`,
      `Peor sentado: ${answers.ciatica_peor_sentado}`,
      `Mejor al caminar: ${answers.ciatica_mejor_caminar}`,
    );
  }

  lines.push(
    "",
    "— ANTECEDENTES —",
    `Lesión/cirugía previa espalda: ${answers.lesion_previa}${answers.lesion_previa === "Sí" && answers.lesion_previa_detalle ? ` — ${answers.lesion_previa_detalle}` : ""}`,
    "",
    "NOTA: El sistema recopila variables clínicas para estimar estructuras afectadas (discos, facetas, músculos, nervios, ligamentos), no para diagnosticar.",
    "",
    "ORIENTACIÓN DIFERENCIAL (usar el cuestionario; no inventar datos):",
    "- Flexión + levantamiento + chasquido + irradiación pierna → sospecha discogénica (hernia/protrusión) vs lesión muscular muscular; la postura al levantar (espalda flexionada/con giro) apoya el mecanismo discogénico.",
    "- Lumbar baja + extensión + estar de pie + (si el perfil indica edad avanzada) → artrosis facetaria vs estenosis lumbar.",
    "- Irradiación pierna + peor sentado + mejor caminar + debajo rodilla → ciática / radiculopatía L5-S1 vs piramidal.",
    "- Claudicación neurogénica (empeora de pie/caminando, mejora al inclinarse o sentarse) → sospecha de estenosis de canal lumbar; diferenciar de claudicación vascular (esa no mejora al inclinarse).",
    "- Dolor que empeora al levantarse de silla baja, subir escaleras, girarse en la cama o apoyo unipodal, sin claro patrón radicular → sospecha de disfunción de la articulación sacroilíaca (SI).",
    "- Rigidez matutina prolongada (>60 min) + mejora con actividad y empeora en reposo + bilateral/centro → espondiloartropatía inflamatoria vs artrosis (rigidez matutina breve <30 min que mejora en reposo).",
    "- Torácico entre omóplatos + postura + oficina → disfunción torácica / miofascial vs hernia discal torácica.",
    "- Sacro/articulación sacroilíaca + caída sentado → contusión sacra / disfunción SI vs fractura sacra (trauma).",
    "- Coxis (final de la columna) + caída sentado → coccigodinia / contusión coccígea vs fractura de coxis (trauma).",
    "- Bloqueo / no enderezarse + espasmo + sin irradiación → lumbago agudo / espasmo paravertebral.",
    "- Dolor eléctrico/descarga + neuro + tos/estornudo empeora → compresión radicular discal vs estenosis.",
    "- BANDERAS ROJAS esfínteres + anestesia silla + debilidad bilateral → SOSPECHA CAUDA EQUINA (urgencia absoluta).",
    "- Dolor nocturno + fiebre + pérdida peso, o antecedente de cáncer → infección (espondilodiscitis) / tumor o metástasis (priorizar valoración médica, no solo mecánica).",
    "- Trauma + imposibilidad moverse + dolor nocturno severo → fractura vertebral / compresión (urgencia).",
    "- Riesgo de fragilidad ósea (osteoporosis/corticoides/posmenopausia) + dolor con esfuerzo mínimo (agacharse, estornudar) → sospecha de fractura vertebral por compresión osteoporótica."
  );

  return lines.filter(Boolean).join("\n");
}

export function isLastBackSection(
  answers: BackAdaptiveAnswers,
  sectionIndex: number
): boolean {
  const sections = getVisibleBackSections(answers);
  return sectionIndex >= sections.length - 1;
}

export const BACK_LABEL_EN: Partial<Record<string, string>> = {
  rf_debilidad_bilateral_pie_caido:
    "Progressive weakness in both legs or foot drop (difficulty lifting the foot)?",
  rf_anestesia_silla: "Numbness between the legs or in the seat area (saddle area)?",
  rf_esfinteres:
    "Recent bladder or bowel control changes (incontinence or retention)?",
  rf_fiebre_perdida_peso:
    "Intense night pain with fever or unexplained weight loss (infection/tumor concern)?",
  rf_trauma_grave:
    "Recent trauma with inability to move or severe night pain after a fall?",
  rf_dolor_toracico_respiracion:
    "Chest pain with shortness of breath along with back pain?",
  rf_antecedente_cancer: "Do you have or have you had cancer, even treated or in remission?",
  rf_riesgo_fractura_fragil:
    "Osteoporosis, prolonged corticosteroid use, or postmenopausal woman, and the pain started with minimal effort (bending down, sneezing)?",
  evolucion: "How long have you had this problem?",
  inicio: "How did it start?",
  mecanismo: "What may have caused it? (you can select several)",
  mecanismo_otro: "Tell us what happened or how it started",
  intensidad_dolor: "Pain intensity (1–10)",
  localizacion_espalda: "Where do you feel the pain in your back? (you can select several)",
  dolor_familiar:
    "Is it the same pain you notice when bending, arching, sitting, or when it goes down the leg?",
  tipo_dolor: "How would you describe the pain? (you can select several)",
  limitacion_funcional: "How much does it limit your daily activities?",
  irradiacion: "Does the pain spread to the buttock or leg?",
  irradiacion_detalle: "How far does that pain go?",
  sintomas_asociados: "What other symptoms do you notice? (you can select several)",
  movimientos_agravantes: "Which movements provoke or worsen it? (you can select several)",
  patron_sacroiliaco:
    "Does the pain worsen when getting up from a low chair, climbing stairs, turning in bed, or standing on one leg?",
  rigidez_matutina_duracion: "How long does the morning stiffness last when you get up?",
  patron_actividad_reposo: "How does the pain relate to activity and rest?",
  trauma_detalle: "Describe the blow or fall",
  trauma_chasquido: "Did you hear or feel a click or crack?",
  trauma_movilidad: "Could you move or straighten up after the trauma?",
  levantamiento_peso: "Approximately how much weight were you lifting?",
  levantamiento_como: "How did you perform the lift? (posture, from the floor, etc.)",
  levantamiento_chasquido: "Did you hear or feel a click or pop when lifting?",
  levantamiento_postura: "What posture were you in when lifting the weight?",
  entreno_ejercicio: "Which exercise or movement were you doing?",
  entreno_momento: "When did the pain appear?",
  entreno_carga: "What type of load were you using?",
  repetitivo_actividad: "Which repetitive activity or prolonged posture triggers it?",
  repetitivo_frecuencia: "How often do you do that activity or posture?",
  neuro_pierna: "In which leg do you notice tingling, numbness, or sciatica?",
  neuro_zona: "Which areas are affected? (you can select several)",
  neuro_tos_estornudo: "Does it worsen when coughing or sneezing?",
  ciatica_debajo_rodilla: "Does the pain go below the knee?",
  ciatica_peor_sentado: "Does it worsen when sitting for long periods?",
  ciatica_mejor_caminar: "Does it improve when walking a little?",
  lesion_previa: "Have you had previous back injuries or surgery?",
  lesion_previa_detalle: "Describe previous injuries, surgeries, or treatments",
};

export const BACK_OPTION_EN = {
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
  Caída: "Fall",
  "Golpe directo": "Direct blow",
  "Levantamiento / esfuerzo": "Lifting / exertion",
  "Entrenamiento o ejercicio": "Training or exercise",
  "Movimiento repetitivo / postura": "Repetitive movement / prolonged posture",
  "Empezó poco a poco, sin causa clara": "Gradual onset with no clear cause",
  Otro: "Other",
  "Parte baja del cuello / inicio de la espalda": "Lower neck / start of the back",
  "Espalda media / entre omóplatos": "Mid-back / between shoulder blades",
  "Espalda baja (parte alta)": "Upper part of the low back",
  "Espalda baja (parte baja)": "Lower part of the low back",
  "Parte final de la espalda / junto al coxis (sacro)": "Bottom of the spine / near the tailbone (sacrum)",
  "Coxis (final de la columna)": "Coccyx (end of the spine)",
  "Solo lado izquierdo": "Left side",
  "Solo lado derecho": "Right side",
  "Ambos lados / en el centro": "Bilateral / center",
  "No estoy seguro": "I'm not sure",
  Punzante: "Sharp",
  Quemazón: "Burning",
  Rigidez: "Stiffness",
  "Presión / peso": "Pressure / heaviness",
  Hormigueo: "Tingling",
  "Eléctrico / descarga": "Electric / shock-like",
  "Malestar difuso": "Diffuse discomfort",
  "En reposo": "At rest",
  "Al caminar": "When walking",
  "Con esfuerzo o carga": "With effort or load",
  "Por la noche": "At night",
  "Al despertar / rigidez matutina": "On waking / morning stiffness",
  "Al estar sentado": "When sitting",
  Constante: "Constant",
  Ninguna: "None",
  "Leve (puedo hacer actividades diarias pero molesta)":
    "Mild (I can do daily activities but it bothers me)",
  "Moderada (limita trabajo, conducción o deporte)":
    "Moderate (limits work, driving, or sport)",
  "Severa (dificultad para vestirme, sentarme o caminar)":
    "Severe (difficulty dressing, sitting, or walking)",
  "No puedo realizar actividades básicas": "I can't perform basic activities",
  "Rigidez matutina": "Morning stiffness",
  "Hormigueo / entumecimiento en pierna": "Tingling / numbness in the leg",
  "Debilidad en pierna": "Weakness in the leg",
  "Dolor hacia glúteo": "Pain toward the buttock",
  "Dolor que baja por la pierna (ciática)": "Pain toward the leg (sciatica)",
  "Espasmo muscular": "Muscle spasm",
  "Bloqueo / no puedo enderezarme": "Locking / can't straighten up",
  Ninguno: "None",
  "Agacharse (doblar la espalda)": "Flexion (bending / squatting)",
  "Echarse hacia atrás": "Extension (leaning back)",
  "Estar sentado mucho rato": "Prolonged sitting",
  "Estar de pie": "Standing",
  Caminar: "Walking",
  "Tos / estornudo": "Coughing / sneezing",
  "Levantarse de la cama": "Getting out of bed",
  "Giro del tronco": "Trunk rotation",
  "Ligero (menos de 5 kg)": "Light (less than 5 kg)",
  "Moderado (5-15 kg)": "Moderate (5–15 kg)",
  "Pesado (más de 15 kg)": "Heavy (more than 15 kg)",
  "No recuerdo": "I don't remember",
  "Sí, con normalidad": "Yes, normally",
  "Parcialmente / con mucho dolor": "Partially / with a lot of pain",
  "No, no pude": "No, I couldn't",
  "Durante el ejercicio": "During exercise",
  "Justo después": "Right afterwards",
  "Al día siguiente": "The next day",
  "Carga elevada": "Heavy load",
  "Carga moderada": "Moderate load",
  "Peso corporal": "Bodyweight",
  "Ejercicio de resistencia (mucho tiempo o muchas repeticiones)": "Endurance / resistance",
  Izquierda: "Left",
  Derecha: "Right",
  Ambas: "Both",
  Glúteo: "Buttock",
  "Parte posterior del muslo": "Back of the thigh",
  "Parte posterior de la pantorrilla": "Back of the calf",
  "Pie / dedos": "Foot / toes",
  "Planta del pie": "Sole of the foot",
  "Zona lumbar": "Lower back",
  "Zona sacra": "Bottom of the spine / sacrum",
  "No afecta": "Does not affect",
  Parcialmente: "Partially",
  "No puedo entrenar o competir": "I can't train or compete",
  Diariamente: "Daily",
  "Varias veces por semana": "Several times a week",
  Ocasionalmente: "Occasionally",
  "No, intermitente": "No, intermittent",
  "Sí, constante": "Yes, constant",
  "Menos de 30 minutos": "Less than 30 minutes",
  "Entre 30 y 60 minutos": "Between 30 and 60 minutes",
  "Más de 60 minutos": "More than 60 minutes",
  "No tengo rigidez matutina": "I don't have morning stiffness",
  "Mejora con actividad, empeora en reposo": "Improves with activity, worsens with rest",
  "Mejora en reposo, empeora con actividad": "Improves with rest, worsens with activity",
  "Sin patrón claro": "No clear pattern",
  "Empeora igual de pie que caminando": "Worsens the same whether standing or walking",
  "Puedo caminar un rato y luego empeora, mejora si me inclino/siento":
    "I can walk for a while and then it worsens, it improves if I lean forward/sit down",
  "No noto relación con caminar": "I don't notice a relation with walking",
  "Espalda recta, doblando rodillas": "Straight back, bending the knees",
  "Espalda doblada/curvada": "Bent/rounded back",
  "Con giro o rotación del tronco": "With trunk twisting or rotation",
  "No lo recuerdo": "I don't remember",
  "Debilidad bilateral progresiva / pie caído": "Progressive weakness in both legs or foot drop (difficulty lifting the foot)",
  "Entumecimiento entre las piernas / zona del asiento": "Numbness between the legs or in the seat area (saddle area)",
  "Problemas para controlar orina o heces": "Recent bladder or bowel control changes (incontinence or retention)",
  "Dolor nocturno con fiebre o pérdida de peso inexplicada": "Intense night pain with fever or unexplained weight loss (infection/tumor concern)",
  "Golpe o caída con imposibilidad de moverse o dolor nocturno muy fuerte": "Recent trauma with inability to move or severe night pain after a fall",
  "Dolor en el pecho con dificultad para respirar": "Chest pain with shortness of breath along with back pain",
  "Antecedente de cáncer (activo o en remisión)": "Do you have or have you had cancer, even treated or in remission",
  "Huesos frágiles / osteoporosis / corticoides / postmenopausia y dolor con esfuerzo mínimo": "Osteoporosis, prolonged corticosteroid use, or postmenopausal woman, and the pain started with minimal effort (bending down, sneezing)",
};

export const BACK_SECTION_LABELS_EN: Record<string, string> = {
  red_flags: "Urgency check",
  core: "Problem characterization",
  trauma: "Trauma details",
  lift: "Lifting / exertion details",
  training: "Training details",
  repetitive: "Repetitive movement / prolonged posture",
  neuro: "Tingling / numbness / sciatica",
  sciatica_pattern: "Sciatica / radiation pattern",
  history: "History",
};

export type ConsultLocale = "es" | "en";

export function localizeBackLabel(
  id: string,
  fallback: string,
  locale: ConsultLocale
): string {
  if (locale !== "en") return fallback;
  return BACK_LABEL_EN[id] ?? fallback;
}

export function localizeBackOption(option: string, locale: ConsultLocale): string {
  if (locale !== "en") return option;
  return BACK_OPTION_EN[option as keyof typeof BACK_OPTION_EN] ?? option;
}

export function localizeBackSection(
  section: string,
  locale: ConsultLocale
): string {
  if (locale !== "en") return (BACK_SECTION_LABELS as Record<string, string>)[section] ?? section;
  return (
    BACK_SECTION_LABELS_EN[section] ??
    (BACK_SECTION_LABELS as Record<string, string>)[section] ??
    section
  );
}
