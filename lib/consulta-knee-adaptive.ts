import {
  filterSleepDependentOptions,
  shouldShowSleepDependentQuestion,
} from "@/lib/consulta-timing";
/**
 * Adaptive questionnaire for knee pain — same structure as shoulder / neck / lower leg
 * (urgency → core → mechanism branches → neuro / swelling / instability → history).
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

export const ONSET_FORM_OPTIONS = ["Repentino", "Progresivo"] as const;

export const MECHANISM_OPTIONS = [
  "Caída",
  "Golpe directo",
  "Torsión / cambio de dirección",
  "Entrenamiento o ejercicio",
  "Movimiento repetitivo",
  "Inicio progresivo sin causa clara",
  "Otro",
] as const;

export const KNEE_LOCATION_OPTIONS = [
  "Cara anterior / rótula",
  "Cara interna (medial)",
  "Cara externa (lateral)",
  "Hueco poplíteo (detrás)",
  "Línea articular",
  "Debajo de la rótula / tendón rotuliano",
  "Por encima de la rótula",
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
  "Al caminar",
  "Con esfuerzo o carga",
  "Por la noche",
  "Al despertar / primeros pasos",
  "Constante",
] as const;

export const FUNCTIONAL_LIMIT_OPTIONS = [
  "Ninguna",
  "Leve (puedo caminar pero molesta)",
  "Moderada (limita caminar o escaleras)",
  "Severa (cojeo o evito apoyar)",
  "No puedo apoyar / caminar",
] as const;

export const ASSOCIATED_SYMPTOM_OPTIONS = [
  "Hinchazón",
  "Hematoma",
  "Hormigueo o entumecimiento",
  "Debilidad",
  "Chasquido/pop",
  "Bloqueo (no puede estirar/doblar)",
  "Sensación de fallo / inestabilidad",
  "Calor",
  "Ninguno",
] as const;

export const AGGRAVATING_MOVEMENT_OPTIONS = [
  "Caminar",
  "Correr",
  "Subir / bajar escaleras",
  "Agacharse",
  "Ponerse de rodillas",
  "Pivotar / girar",
  "Saltar",
  "Estar sentado mucho rato",
  "Extender del todo",
  "Ninguno",
] as const;

export const TRAUMA_WEIGHT_BEARING_OPTIONS = [
  "Sí, pude seguir caminando",
  "Parcialmente / cojeando",
  "No, no pude apoyar",
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

export const NEURO_ZONE_OPTIONS = [
  "Pie completo",
  "Dedos del pie",
  "Planta del pie",
  "Tobillo",
  "Pantorrilla",
  "Cara anterior rodilla",
  "Cara interna rodilla",
  "Cara externa rodilla",
] as const;

export const SWELLING_ONSET_OPTIONS = [
  "Inmediata tras la lesión",
  "En las primeras horas",
  "Al día siguiente",
  "Progresiva en días",
] as const;

export const LOCKING_TYPE_OPTIONS = [
  "No puede extender del todo",
  "No puede doblar del todo",
  "Ambos",
] as const;

export const INSTABILITY_GIVING_WAY_OPTIONS = [
  "No",
  "A veces",
  "Sí, con frecuencia",
] as const;

export const TRAINING_IMPACT_OPTIONS = [
  "No afecta",
  "Parcialmente",
  "No puedo entrenar o competir",
] as const;

export type KneeAdaptiveAnswers = {
  // Red flags
  rf_deformidad: string;
  rf_no_apoyo: string;
  rf_bloqueo: string;
  rf_hinchazon_subita: string;
  rf_fiebre: string;
  rf_vascular: string;
  rf_perdida_sensibilidad: string;
  rf_extension_activa: string;
  // Core
  evolucion: string;
  inicio: string;
  mecanismo: string[];
  mecanismo_otro: string;
  intensidad_dolor: number;
  localizacion_rodilla: string[];
  tipo_dolor: string[];
  patron_dolor: string[];
  limitacion_funcional: string[];
  irradiacion: string;
  irradiacion_detalle: string;
  sintomas_asociados: string[];
  movimientos_agravantes: string[];
  // Trauma branch
  trauma_detalle: string;
  trauma_chasquido: string;
  trauma_apoyo: string;
  trauma_pcl: string;
  // Twist branch
  torsion_detalle: string;
  torsion_chasquido: string;
  torsion_apoyo: string;
  // Training branch
  entreno_ejercicio: string;
  entreno_momento: string;
  entreno_carga: string;
  // Repetitive / progressive branch
  repetitivo_actividad: string;
  repetitivo_frecuencia: string;
  itb_patron: string;
  // Neuro branch
  neuro_zona: string[];
  neuro_constante: string;
  neuro_movimientos: string;
  // Swelling branch
  hinchazon_inicio: string;
  hinchazon_progresion: string;
  hinchazon_calor: string;
  // Instability / locking branch
  inestabilidad_cede: string;
  inestabilidad_cuando: string;
  bloqueo_tipo: string;
  bloqueo_desbloqueo: string;
  chasquido_cuando: string;
  // Patellar instability branch
  rotula_desplaza: string;
  rotula_antes: string;
  rotula_recolocacion: string;
  // History
  lesion_previa: string;
  lesion_previa_detalle: string;
  deporte_impacto: string;
};

export function defaultKneeAdaptiveAnswers(): KneeAdaptiveAnswers {
  return {
    rf_deformidad: "",
    rf_no_apoyo: "",
    rf_bloqueo: "",
    rf_hinchazon_subita: "",
    rf_fiebre: "",
    rf_vascular: "",
    rf_perdida_sensibilidad: "",
    rf_extension_activa: "",
    evolucion: "",
    inicio: "",
    mecanismo: [],
    mecanismo_otro: "",
    intensidad_dolor: 5,
    localizacion_rodilla: [],
    tipo_dolor: [],
    patron_dolor: [],
    limitacion_funcional: [],
    irradiacion: "",
    irradiacion_detalle: "",
    sintomas_asociados: [],
    movimientos_agravantes: [],
    trauma_detalle: "",
    trauma_chasquido: "",
    trauma_apoyo: "",
    trauma_pcl: "",
    torsion_detalle: "",
    torsion_chasquido: "",
    torsion_apoyo: "",
    entreno_ejercicio: "",
    entreno_momento: "",
    entreno_carga: "",
    repetitivo_actividad: "",
    repetitivo_frecuencia: "",
    itb_patron: "",
    neuro_zona: [],
    neuro_constante: "",
    neuro_movimientos: "",
    hinchazon_inicio: "",
    hinchazon_progresion: "",
    hinchazon_calor: "",
    inestabilidad_cede: "",
    inestabilidad_cuando: "",
    bloqueo_tipo: "",
    bloqueo_desbloqueo: "",
    chasquido_cuando: "",
    rotula_desplaza: "",
    rotula_antes: "",
    rotula_recolocacion: "",
    lesion_previa: "",
    lesion_previa_detalle: "",
    deporte_impacto: "",
  };
}

export type KneeQuestionSection =
  | "red_flags"
  | "core"
  | "trauma"
  | "twist"
  | "training"
  | "repetitive"
  | "neuro"
  | "swelling"
  | "instability_locking"
  | "patellar_instability"
  | "history";

export type KneeQuestionDef = {
  id: keyof KneeAdaptiveAnswers;
  section: KneeQuestionSection;
  label: string;
  type: "single" | "multi" | "text" | "slider";
  options?: readonly string[];
  required?: boolean;
  showIf?: (a: KneeAdaptiveAnswers) => boolean;
};

function hasSymptom(a: KneeAdaptiveAnswers, name: string): boolean {
  return a.sintomas_asociados.includes(name);
}

function isTrauma(a: KneeAdaptiveAnswers): boolean {
  return a.mecanismo.includes("Caída") || a.mecanismo.includes("Golpe directo");
}

function isTwist(a: KneeAdaptiveAnswers): boolean {
  return a.mecanismo.includes("Torsión / cambio de dirección");
}

function isRepetitiveOrProgressive(a: KneeAdaptiveAnswers): boolean {
  return (
    a.mecanismo.includes("Movimiento repetitivo") ||
    a.mecanismo.includes("Inicio progresivo sin causa clara")
  );
}

function hasNeuro(a: KneeAdaptiveAnswers): boolean {
  return (
    hasSymptom(a, "Hormigueo o entumecimiento") ||
    a.tipo_dolor.includes("Hormigueo")
  );
}

function hasSwelling(a: KneeAdaptiveAnswers): boolean {
  return hasSymptom(a, "Hinchazón") || hasSymptom(a, "Calor");
}

function hasInstability(a: KneeAdaptiveAnswers): boolean {
  return hasSymptom(a, "Sensación de fallo / inestabilidad");
}

function hasLocking(a: KneeAdaptiveAnswers): boolean {
  return hasSymptom(a, "Bloqueo (no puede estirar/doblar)");
}

function hasClickPop(a: KneeAdaptiveAnswers): boolean {
  return hasSymptom(a, "Chasquido/pop");
}

function hasInstabilityLockingSection(a: KneeAdaptiveAnswers): boolean {
  return hasInstability(a) || hasLocking(a) || hasClickPop(a);
}

function hasPatellarSection(a: KneeAdaptiveAnswers): boolean {
  return (
    a.localizacion_rodilla.includes("Cara anterior / rótula") ||
    hasInstability(a)
  );
}

function isPatellarDislocation(a: KneeAdaptiveAnswers): boolean {
  return a.rotula_desplaza === "Sí";
}

function isLateralRunningMechanism(a: KneeAdaptiveAnswers): boolean {
  return (
    a.localizacion_rodilla.includes("Cara externa (lateral)") &&
    (a.mecanismo.includes("Movimiento repetitivo") ||
      a.mecanismo.includes("Inicio progresivo sin causa clara"))
  );
}

export const KNEE_QUESTIONS: KneeQuestionDef[] = [

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
    id: "rf_deformidad",
    section: "red_flags",
    label: "¿Hay deformidad evidente en la rodilla?",
    type: "single",
    options: YES_NO,
    required: true,
  },
  {
    id: "rf_no_apoyo",
    section: "red_flags",
    label: "¿Incapacidad para apoyar peso o caminar?",
    type: "single",
    options: YES_NO,
    required: true,
  },
  {
    id: "rf_bloqueo",
    section: "red_flags",
    label: "¿Rodilla bloqueada o incapacidad para estirar del todo?",
    type: "single",
    options: YES_NO,
    required: true,
  },
  {
    id: "rf_hinchazon_subita",
    section: "red_flags",
    label: "¿Hinchazón súbita e intensa de la rodilla?",
    type: "single",
    options: YES_NO,
    required: true,
  },
  {
    id: "rf_fiebre",
    section: "red_flags",
    label: "¿Fiebre asociada al dolor?",
    type: "single",
    options: YES_NO,
    required: true,
  },
  {
    id: "rf_vascular",
    section: "red_flags",
    label:
      "¿Dolor en pantorrilla con hinchazón (sospecha vascular) que te preocupa?",
    type: "single",
    options: YES_NO,
    required: true,
  },
  {
    id: "rf_perdida_sensibilidad",
    section: "red_flags",
    label: "¿Pérdida de sensibilidad en el pie?",
    type: "single",
    options: YES_NO,
    required: true,
  },
  {
    id: "rf_extension_activa",
    section: "red_flags",
    label:
      "Tras el inicio, ¿puedes levantar la pierna estirada (sin doblar la rodilla) sin ayuda?",
    type: "single",
    options: YES_NO,
    required: true,
  },

  // Core clinical characterization
  
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
    label: "Describe el mecanismo",
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
    id: "localizacion_rodilla",
    section: "core",
    label: "¿Dónde sientes el dolor en la rodilla? (puedes marcar varias)",
    type: "multi",
    options: KNEE_LOCATION_OPTIONS,
    required: true,
  },
  {
    id: "tipo_dolor",
    section: "core",
    label: "¿Cómo describirías el dolor? (puedes marcar varias)",
    type: "multi",
    options: PAIN_TYPE_OPTIONS,
    required: true,
  },
  {
    id: "patron_dolor",
    section: "core",
    label: "¿En qué situaciones aparece o empeora? (puedes marcar varias)",
    type: "multi",
    options: PAIN_SITUATION_OPTIONS,
    required: true,
  },
  {
    id: "limitacion_funcional",
    section: "core",
    label: "¿Cuánto te limita al caminar o apoyar? (puedes marcar varias)",
    type: "multi",
    options: FUNCTIONAL_LIMIT_OPTIONS,
    required: true,
  },
  {
    id: "irradiacion",
    section: "core",
    label: "¿El dolor se irradia hacia la pierna, pantorrilla o pie?",
    type: "single",
    options: YES_NO,
    required: true,
  },
  {
    id: "irradiacion_detalle",
    section: "core",
    label: "¿Hasta dónde llega la irradiación?",
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
    label: "¿Escuchaste o sentiste un chasquido o pop?",
    type: "single",
    options: YES_NO,
    required: true,
    showIf: isTrauma,
  },
  {
    id: "trauma_apoyo",
    section: "trauma",
    label: "¿Pudiste seguir apoyando o caminando después?",
    type: "single",
    options: TRAUMA_WEIGHT_BEARING_OPTIONS,
    required: true,
    showIf: isTrauma,
  },
  {
    id: "trauma_pcl",
    section: "trauma",
    label:
      "¿El golpe fue en la espinilla con la rodilla doblada (ej. salpicadero, caída de rodillas)?",
    type: "single",
    options: YES_NO,
    required: true,
    showIf: isTrauma,
  },

  // Twist branch
  {
    id: "torsion_detalle",
    section: "twist",
    label: "Describe la torsión o el cambio de dirección",
    type: "text",
    required: true,
    showIf: isTwist,
  },
  {
    id: "torsion_chasquido",
    section: "twist",
    label: "¿Escuchaste o sentiste un chasquido o pop?",
    type: "single",
    options: YES_NO,
    required: true,
    showIf: isTwist,
  },
  {
    id: "torsion_apoyo",
    section: "twist",
    label: "¿Pudiste seguir apoyando o caminando después?",
    type: "single",
    options: TRAUMA_WEIGHT_BEARING_OPTIONS,
    required: true,
    showIf: isTwist,
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

  // Repetitive / progressive branch
  {
    id: "repetitivo_actividad",
    section: "repetitive",
    label: "¿Qué actividad repetitiva o progresiva lo desencadena?",
    type: "text",
    required: true,
    showIf: isRepetitiveOrProgressive,
  },
  {
    id: "repetitivo_frecuencia",
    section: "repetitive",
    label: "¿Con qué frecuencia realizas esa actividad?",
    type: "single",
    options: ["Diariamente", "Varias veces por semana", "Ocasionalmente"],
    required: true,
    showIf: isRepetitiveOrProgressive,
  },
  {
    id: "itb_patron",
    section: "repetitive",
    label:
      "¿Aparece siempre a la misma distancia de carrera o tras bajar escaleras/cuestas?",
    type: "single",
    options: YES_NO,
    required: true,
    showIf: isLateralRunningMechanism,
  },

  // Neuro branch
  {
    id: "neuro_zona",
    section: "neuro",
    label: "¿Qué zonas tienen hormigueo o entumecimiento? (puedes marcar varias)",
    type: "multi",
    options: NEURO_ZONE_OPTIONS,
    required: true,
    showIf: hasNeuro,
  },
  {
    id: "neuro_constante",
    section: "neuro",
    label: "¿El hormigueo o entumecimiento es constante?",
    type: "single",
    options: ["No, intermitente", "Sí, constante"],
    required: true,
    showIf: hasNeuro,
  },
  {
    id: "neuro_movimientos",
    section: "neuro",
    label: "¿Qué movimientos lo desencadenan?",
    type: "text",
    required: false,
    showIf: hasNeuro,
  },

  // Swelling branch
  {
    id: "hinchazon_inicio",
    section: "swelling",
    label: "¿Cuándo apareció la hinchazón?",
    type: "single",
    options: SWELLING_ONSET_OPTIONS,
    required: true,
    showIf: hasSwelling,
  },
  {
    id: "hinchazon_progresion",
    section: "swelling",
    label: "¿La hinchazón ha aumentado, se mantiene o ha bajado?",
    type: "single",
    options: ["Ha aumentado", "Se mantiene", "Ha bajado"],
    required: true,
    showIf: hasSwelling,
  },
  {
    id: "hinchazon_calor",
    section: "swelling",
    label: "¿La zona está caliente al tacto?",
    type: "single",
    options: YES_NO,
    required: true,
    showIf: hasSwelling,
  },

  // Instability / locking branch
  {
    id: "inestabilidad_cede",
    section: "instability_locking",
    label: "¿La rodilla cede o falla al apoyar o girar?",
    type: "single",
    options: INSTABILITY_GIVING_WAY_OPTIONS,
    required: true,
    showIf: hasInstability,
  },
  {
    id: "inestabilidad_cuando",
    section: "instability_locking",
    label: "¿En qué situaciones notas la inestabilidad o el fallo?",
    type: "text",
    required: false,
    showIf: hasInstability,
  },
  {
    id: "bloqueo_tipo",
    section: "instability_locking",
    label: "¿Qué tipo de bloqueo notas?",
    type: "single",
    options: LOCKING_TYPE_OPTIONS,
    required: true,
    showIf: hasLocking,
  },
  {
    id: "bloqueo_desbloqueo",
    section: "instability_locking",
    label: "¿Puede desbloquearse solo o necesitas ayuda?",
    type: "single",
    options: ["Sí, solo", "A veces solo", "No, necesito ayuda"],
    required: true,
    showIf: hasLocking,
  },
  {
    id: "chasquido_cuando",
    section: "instability_locking",
    label: "¿Cuándo aparece el chasquido o pop?",
    type: "text",
    required: false,
    showIf: hasClickPop,
  },

  // Patellar instability branch
  {
    id: "rotula_desplaza",
    section: "patellar_instability",
    label: "¿Sientes que la rótula se desplaza o se ha salido de sitio?",
    type: "single",
    options: YES_NO,
    required: true,
    showIf: hasPatellarSection,
  },
  {
    id: "rotula_antes",
    section: "patellar_instability",
    label: "¿Ha ocurrido antes?",
    type: "single",
    options: YES_NO,
    required: true,
    showIf: isPatellarDislocation,
  },
  {
    id: "rotula_recolocacion",
    section: "patellar_instability",
    label: "¿Se recolocó sola?",
    type: "single",
    options: YES_NO,
    required: true,
    showIf: isPatellarDislocation,
  },

  // History
  {
    id: "lesion_previa",
    section: "history",
    label: "¿Has tenido lesiones previas en esta rodilla?",
    type: "single",
    options: YES_NO,
    required: true,
  },
  {
    id: "lesion_previa_detalle",
    section: "history",
    label: "Describe lesiones o tratamientos previos",
    type: "text",
    required: true,
    showIf: (a) => a.lesion_previa === "Sí",
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

export const KNEE_SECTION_LABELS: Record<KneeQuestionSection, string> = {
  red_flags: "Comprobación de urgencia",
  core: "Caracterización del problema",
  trauma: "Detalles del traumatismo",
  twist: "Torsión / cambio de dirección",
  training: "Detalles del entrenamiento",
  repetitive: "Actividad repetitiva / progresiva",
  neuro: "Hormigueo / entumecimiento",
  swelling: "Hinchazón",
  instability_locking: "Inestabilidad / bloqueo / chasquido",
  patellar_instability: "Inestabilidad rotuliana",
  history: "Antecedentes",
};

export const KNEE_SECTION_ORDER: KneeQuestionSection[] = [
  "red_flags",
  "core",
  "trauma",
  "twist",
  "training",
  "repetitive",
  "neuro",
  "swelling",
  "instability_locking",
  "patellar_instability",
  "history",
];

export function getVisibleKneeQuestions(
  answers: KneeAdaptiveAnswers
): KneeQuestionDef[] {
  return KNEE_QUESTIONS.filter((q) => !q.showIf || q.showIf(answers)).map((q) => {
    if (!q.options?.length) return q;
    const filtered = filterSleepDependentOptions(q.options, answers.evolucion);
    if (filtered.length === q.options.length) return q;
    return { ...q, options: filtered };
  });
}

export function getVisibleKneeSections(
  answers: KneeAdaptiveAnswers
): KneeQuestionSection[] {
  const visible = getVisibleKneeQuestions(answers);
  return KNEE_SECTION_ORDER.filter((s) => visible.some((q) => q.section === s));
}

const RED_FLAG_IDS: (keyof KneeAdaptiveAnswers)[] = [
  "rf_deformidad",
  "rf_no_apoyo",
  "rf_bloqueo",
  "rf_hinchazon_subita",
  "rf_fiebre",
  "rf_vascular",
  "rf_perdida_sensibilidad",
];

export function detectKneeRedFlags(answers: KneeAdaptiveAnswers): {
  urgent: boolean;
  triggered: string[];
} {
  const labels: Record<string, string> = {
    rf_deformidad: "Deformidad evidente en rodilla",
    rf_no_apoyo: "Incapacidad para apoyar peso o caminar",
    rf_bloqueo: "Rodilla bloqueada / no puede estirar del todo",
    rf_hinchazon_subita: "Hinchazón súbita e intensa",
    rf_fiebre: "Fiebre asociada",
    rf_vascular: "Dolor de pantorrilla con hinchazón (sospecha vascular)",
    rf_perdida_sensibilidad: "Pérdida de sensibilidad en el pie",
    rf_extension_activa:
      "Incapacidad para levantar la pierna estirada tras el inicio (sospecha rotura del mecanismo extensor: tendón rotuliano o cuadricipital)",
  };
  const triggered: string[] = [];
  for (const id of RED_FLAG_IDS) {
    if (answers[id] === "Sí") triggered.push(labels[id] ?? id);
  }
  // Inverted logic: inability to actively extend/lift the leg (answer "No") is the red flag here.
  if (answers.rf_extension_activa === "No") {
    triggered.push(labels.rf_extension_activa);
  }
  return { urgent: triggered.length > 0, triggered };
}

function isAnswered(q: KneeQuestionDef, answers: KneeAdaptiveAnswers): boolean {
  const val = answers[q.id];
  if (q.type === "multi") return Array.isArray(val) && val.length > 0;
  if (q.type === "slider") return typeof val === "number" && val >= 1;
  if (q.type === "text") return typeof val === "string" && val.trim().length > 0;
  return typeof val === "string" && val.length > 0;
}

export function validateKneeAdaptive(answers: KneeAdaptiveAnswers): string | null {
  const visible = getVisibleKneeQuestions(answers);
  for (const q of visible) {
    if (q.required !== false && !isAnswered(q, answers)) {
      return `Responde: ${q.label.replace(/\?$/, "")}.`;
    }
  }
  return null;
}

export function validateKneeSection(
  section: KneeQuestionSection,
  answers: KneeAdaptiveAnswers
): string | null {
  const questions = getVisibleKneeQuestions(answers).filter(
    (q) => q.section === section
  );
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

export function formatKneeAdaptive(
  answers: KneeAdaptiveAnswers,
  bodyMapText: string
): string {
  const { urgent, triggered } = detectKneeRedFlags(answers);
  const lines: string[] = [
    "=== CUESTIONARIO ADAPTATIVO — RODILLA ===",
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
    `Deformidad: ${answers.rf_deformidad || "—"}`,
    `Incapacidad apoyo/caminar: ${answers.rf_no_apoyo || "—"}`,
    `Rodilla bloqueada: ${answers.rf_bloqueo || "—"}`,
    `Hinchazón súbita: ${answers.rf_hinchazon_subita || "—"}`,
    `Fiebre: ${answers.rf_fiebre || "—"}`,
    `Sospecha vascular (pantorrilla + hinchazón): ${answers.rf_vascular || "—"}`,
    `Pérdida sensibilidad pie: ${answers.rf_perdida_sensibilidad || "—"}`,
    `Puede levantar la pierna estirada sin ayuda: ${answers.rf_extension_activa || "—"}`,
    "",
    "— VARIABLES CLÍNICAS —",
    `Tiempo de evolución: ${answers.evolucion}`,
    `Forma de inicio: ${answers.inicio}`,
    `Mecanismo: ${answers.mecanismo.join(", ")}${answers.mecanismo.includes("Otro") && answers.mecanismo_otro ? ` (${answers.mecanismo_otro})` : ""}`,
    `Intensidad dolor: ${answers.intensidad_dolor}/10`,
    `Localización rodilla: ${formatMulti(answers.localizacion_rodilla)}`,
    `Tipo de dolor: ${formatMulti(answers.tipo_dolor)}`,
    `Situaciones de dolor: ${formatMulti(answers.patron_dolor)}`,
    `Limitación funcional: ${answers.limitacion_funcional.join(", ") || "—"}`,
    `Irradiación: ${answers.irradiacion}${answers.irradiacion === "Sí" && answers.irradiacion_detalle ? ` — ${answers.irradiacion_detalle}` : ""}`,
    `Síntomas asociados: ${formatMulti(answers.sintomas_asociados)}`,
    `Movimientos agravantes: ${formatMulti(answers.movimientos_agravantes)}`,
  ];

  if (isTrauma(answers)) {
    lines.push(
      "",
      "— DETALLE TRAUMA —",
      `Detalle: ${answers.trauma_detalle}`,
      `Chasquido/pop: ${answers.trauma_chasquido}`,
      `Apoyo/caminar tras trauma: ${answers.trauma_apoyo}`,
      `Golpe en espinilla con rodilla doblada (mecanismo LCP): ${answers.trauma_pcl}`
    );
  }
  if (isTwist(answers)) {
    lines.push(
      "",
      "— Torsión / CAMBIO DE DIRECCIÓN —",
      `Detalle: ${answers.torsion_detalle}`,
      `Chasquido/pop: ${answers.torsion_chasquido}`,
      `Apoyo/caminar tras torsión: ${answers.torsion_apoyo}`
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
  if (isRepetitiveOrProgressive(answers)) {
    lines.push(
      "",
      "— ACTIVIDAD REPETITIVA / PROGRESIVA —",
      `Actividad: ${answers.repetitivo_actividad}`,
      `Frecuencia: ${answers.repetitivo_frecuencia}`,
      isLateralRunningMechanism(answers)
        ? `Patrón siempre a la misma distancia/bajada: ${answers.itb_patron}`
        : ""
    );
  }
  if (hasNeuro(answers)) {
    lines.push(
      "",
      "— HORMIGUEO / ENTUMECIMIENTO —",
      `Zona: ${formatMulti(answers.neuro_zona)}`,
      `Constante: ${answers.neuro_constante}`,
      answers.neuro_movimientos
        ? `Movimientos desencadenantes: ${answers.neuro_movimientos}`
        : ""
    );
  }
  if (hasSwelling(answers)) {
    lines.push(
      "",
      "— HINCHAZÓN —",
      `Inicio: ${answers.hinchazon_inicio}`,
      `Progresión: ${answers.hinchazon_progresion}`,
      `Calor al tacto: ${answers.hinchazon_calor}`
    );
  }
  if (hasInstabilityLockingSection(answers)) {
    lines.push("", "— INESTABILIDAD / BLOQUEO / CHASQUIDO —");
    if (hasInstability(answers)) {
      lines.push(
        `Rodilla cede/falla: ${answers.inestabilidad_cede}`,
        answers.inestabilidad_cuando
          ? `Situaciones: ${answers.inestabilidad_cuando}`
          : ""
      );
    }
    if (hasLocking(answers)) {
      lines.push(
        `Tipo bloqueo: ${answers.bloqueo_tipo}`,
        `Desbloqueo: ${answers.bloqueo_desbloqueo}`
      );
    }
    if (hasClickPop(answers) && answers.chasquido_cuando) {
      lines.push(`Chasquido/pop cuándo: ${answers.chasquido_cuando}`);
    }
  }
  if (hasPatellarSection(answers)) {
    lines.push(
      "",
      "— INESTABILIDAD ROTULIANA —",
      `Rótula se desplaza / se sale de sitio: ${answers.rotula_desplaza}`,
      isPatellarDislocation(answers)
        ? `Ha ocurrido antes: ${answers.rotula_antes}`
        : "",
      isPatellarDislocation(answers)
        ? `Se recolocó sola: ${answers.rotula_recolocacion}`
        : ""
    );
  }

  lines.push(
    "",
    "— ANTECEDENTES —",
    `Lesión previa rodilla: ${answers.lesion_previa}${answers.lesion_previa === "Sí" && answers.lesion_previa_detalle ? ` — ${answers.lesion_previa_detalle}` : ""}`,
    `Impacto deportivo: ${answers.deporte_impacto}`,
    "",
    "NOTA: El sistema recopila variables clínicas para estimar estructuras afectadas (ligamentos, meniscos, cartílago, tendón, bursa, nervio), no para diagnosticar.",
    "",
    "ORIENTACIÓN DIFERENCIAL (usar el cuestionario; no inventar datos):",
    "- Torsión + pop + hinchazón inmediata + inestabilidad → sospecha LCA vs lesión meniscal.",
    "- Bloqueo mecánico + línea articular + torsión → lesión meniscal (bloqueo) vs cuerpo libre.",
    "- Cara anterior / rótula + escaleras / agacharse / sentado → PFPS (síndrome femoropatelar) vs condromalacia.",
    "- Rótula se desplaza/sale de sitio (con o sin recolocación espontánea), especialmente si ya ocurrió antes → sospecha luxación/inestabilidad rotuliana recidivante.",
    "- Debajo rótula / tendón rotuliano + salto / carga → tendinopatía rotuliana (jumper's knee).",
    "- Cara interna + trauma/contacto → LCM vs lesión meniscal medial.",
    "- Cara externa + trauma/contacto → LCL vs lesión meniscal lateral.",
    "- Cara externa (lateral) + carrera/repetitivo + siempre a la misma distancia o al bajar escaleras/cuestas → síndrome de la banda iliotibial (IT band) vs lesión meniscal lateral.",
    "- Golpe directo en la espinilla con la rodilla flexionada (salpicadero, caída de rodillas) → mecanismo típico de lesión del LCP (ligamento cruzado posterior).",
    "- Incapacidad para levantar la pierna estirada tras el inicio (extensión activa contra gravedad) → sospecha rotura del mecanismo extensor (tendón rotuliano o cuadricipital) — URGENCIA, valorar cuanto antes.",
    "- Inicio progresivo + edad + rigidez matutina / escaleras → artrosis (OA) vs inflamación.",
    "- Hinchazón + calor + fiebre → artritis séptica / inflamatoria (priorizar urgencia).",
    "- Hueco poplíteo + bloqueo flexión → quiste de Baker vs lesión meniscal posterior.",
    "- Hormigueo pie + irradiación → radiculopatía lumbar vs compresión nerviosa periférica."
  );

  return lines.filter(Boolean).join("\n");
}

export function isLastKneeSection(
  answers: KneeAdaptiveAnswers,
  sectionIndex: number
): boolean {
  const sections = getVisibleKneeSections(answers);
  return sectionIndex >= sections.length - 1;
}

export const KNEE_LABEL_EN: Partial<Record<string, string>> = {
  rf_deformidad: "Is there an obvious deformity in the knee?",
  rf_no_apoyo: "Are you unable to bear weight or walk?",
  rf_bloqueo: "Is the knee locked or unable to fully straighten?",
  rf_hinchazon_subita: "Sudden, intense swelling of the knee?",
  rf_fiebre: "Fever associated with the pain?",
  rf_vascular: "Calf pain with swelling that concerns you (vascular concern)?",
  rf_perdida_sensibilidad: "Loss of sensation in the foot?",
  rf_extension_activa:
    "After it started, can you lift your leg straight (without bending the knee) unassisted?",
  evolucion: "How long have you had this problem?",
  inicio: "How did it start?",
  mecanismo: "What may have caused it? (you can select several)",
  mecanismo_otro: "Describe the mechanism",
  intensidad_dolor: "Pain intensity (1–10)",
  localizacion_rodilla: "Where do you feel the pain in the knee? (you can select several)",
  tipo_dolor: "How would you describe the pain? (you can select several)",
  patron_dolor: "In which situations does it appear or worsen? (you can select several)",
  limitacion_funcional: "How much does it limit walking or weight-bearing?",
  irradiacion: "Does the pain radiate to the leg, calf, or foot?",
  irradiacion_detalle: "How far does the radiation go?",
  sintomas_asociados: "What other symptoms do you notice? (you can select several)",
  movimientos_agravantes: "Which movements provoke or worsen it? (you can select several)",
  trauma_detalle: "Describe the blow or fall",
  trauma_chasquido: "Did you hear or feel a click or pop?",
  trauma_apoyo: "Could you keep bearing weight or walking afterwards?",
  trauma_pcl:
    "Was the blow to the shin with the knee bent (e.g. dashboard injury, falling on your knees)?",
  torsion_detalle: "Describe the twist or change of direction",
  torsion_chasquido: "Did you hear or feel a click or pop?",
  torsion_apoyo: "Could you keep bearing weight or walking afterwards?",
  entreno_ejercicio: "Which exercise or movement were you doing?",
  entreno_momento: "When did the pain appear?",
  entreno_carga: "What type of load were you using?",
  repetitivo_actividad: "Which repetitive or progressive activity triggers it?",
  repetitivo_frecuencia: "How often do you do that activity?",
  itb_patron:
    "Does it always appear at the same running distance or after going down stairs/hills?",
  neuro_zona: "Which areas have tingling or numbness? (you can select several)",
  neuro_constante: "Is the tingling or numbness constant?",
  neuro_movimientos: "Which movements trigger it?",
  hinchazon_inicio: "When did the swelling appear?",
  hinchazon_progresion: "Has the swelling increased, stayed the same, or gone down?",
  hinchazon_calor: "Is the area warm to the touch?",
  inestabilidad_cede: "Does the knee give way or fail when bearing weight or turning?",
  inestabilidad_cuando: "In which situations do you notice instability or giving way?",
  bloqueo_tipo: "What type of locking do you notice?",
  bloqueo_desbloqueo: "Can it unlock on its own or do you need help?",
  chasquido_cuando: "When does the click or pop appear?",
  rotula_desplaza: "Do you feel like the kneecap shifts or has come out of place?",
  rotula_antes: "Has this happened before?",
  rotula_recolocacion: "Did it go back into place on its own?",
  lesion_previa: "Have you had previous injuries in this knee?",
  lesion_previa_detalle: "Describe previous injuries or treatments",
  deporte_impacto: "How does it affect your training or sport?",
};

export const KNEE_OPTION_EN: Record<string, string> = {
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
  "Torsión / cambio de dirección": "Twist / change of direction",
  "Entrenamiento o ejercicio": "Training or exercise",
  "Movimiento repetitivo": "Repetitive movement",
  "Inicio progresivo sin causa clara": "Gradual onset with no clear cause",
  Otro: "Other",
  "Cara anterior / rótula": "Front / kneecap",
  "Cara interna (medial)": "Inner side (medial)",
  "Cara externa (lateral)": "Outer side (lateral)",
  "Hueco poplíteo (detrás)": "Popliteal fossa (behind)",
  "Línea articular": "Joint line",
  "Debajo de la rótula / tendón rotuliano": "Below kneecap / patellar tendon",
  "Por encima de la rótula": "Above the kneecap",
  "No estoy seguro": "I'm not sure",
  Punzante: "Sharp",
  Quemazón: "Burning",
  Rigidez: "Stiffness",
  "Presión / peso": "Pressure / heaviness",
  Hormigueo: "Tingling",
  "Malestar difuso": "Diffuse discomfort",
  "En reposo": "At rest",
  "Al caminar": "When walking",
  "Con esfuerzo o carga": "With effort or load",
  "Por la noche": "At night",
  "Al despertar / primeros pasos": "On waking / first steps",
  Constante: "Constant",
  Ninguna: "None",
  "Leve (puedo caminar pero molesta)": "Mild (I can walk but it bothers me)",
  "Moderada (limita caminar o escaleras)": "Moderate (limits walking or stairs)",
  "Severa (cojeo o evito apoyar)": "Severe (limp or avoid weight-bearing)",
  "No puedo apoyar / caminar": "I can't bear weight / walk",
  Hinchazón: "Swelling",
  Hematoma: "Bruising / hematoma",
  "Hormigueo o entumecimiento": "Tingling or numbness",
  Debilidad: "Weakness",
  "Chasquido/pop": "Clicking / pop",
  "Bloqueo (no puede estirar/doblar)": "Locking (can't fully straighten/bend)",
  "Sensación de fallo / inestabilidad": "Giving way / instability",
  Calor: "Warmth / heat",
  Ninguno: "None",
  Caminar: "Walking",
  Correr: "Running",
  "Subir / bajar escaleras": "Going up / down stairs",
  Agacharse: "Squatting",
  "Ponerse de rodillas": "Kneeling",
  "Pivotar / girar": "Pivoting / turning",
  Saltar: "Jumping",
  "Estar sentado mucho rato": "Sitting for long periods",
  "Extender del todo": "Fully straightening",
  "Sí, pude seguir caminando": "Yes, I could keep walking",
  "Parcialmente / cojeando": "Partially / limping",
  "No, no pude apoyar": "No, I couldn't bear weight",
  "Durante el ejercicio": "During exercise",
  "Justo después": "Right afterwards",
  "Al día siguiente": "The next day",
  "Carga elevada": "Heavy load",
  "Carga moderada": "Moderate load",
  "Peso corporal": "Bodyweight",
  "Resistencia / endurance": "Endurance / resistance",
  "Pie completo": "Whole foot",
  "Dedos del pie": "Toes",
  "Planta del pie": "Sole of the foot",
  Tobillo: "Ankle",
  Pantorrilla: "Calf",
  "Cara anterior rodilla": "Front of knee",
  "Cara interna rodilla": "Inner knee",
  "Cara externa rodilla": "Outer knee",
  "Inmediata tras la lesión": "Immediate after the injury",
  "En las primeras horas": "Within the first hours",
  "Progresiva en días": "Gradual over days",
  "Ha aumentado": "Has increased",
  "Se mantiene": "Stayed the same",
  "Ha bajado": "Has gone down",
  "No puede extender del todo": "Can't fully straighten",
  "No puede doblar del todo": "Can't fully bend",
  Ambos: "Both",
  "A veces": "Sometimes",
  "Sí, con frecuencia": "Yes, frequently",
  "Sí, solo": "Yes, on its own",
  "A veces solo": "Sometimes on its own",
  "No, necesito ayuda": "No, I need help",
  "No afecta": "Does not affect",
  Parcialmente: "Partially",
  "No puedo entrenar o competir": "I can't train or compete",
  Diariamente: "Daily",
  "Varias veces por semana": "Several times a week",
  Ocasionalmente: "Occasionally",
  "No, intermitente": "No, intermittent",
  "Sí, constante": "Yes, constant",
};

export const KNEE_SECTION_LABELS_EN: Record<string, string> = {
  red_flags: "Urgency check",
  core: "Problem characterization",
  trauma: "Trauma details",
  twist: "Twist / change of direction",
  training: "Training details",
  repetitive: "Repetitive / progressive activity",
  neuro: "Tingling / numbness",
  swelling: "Swelling",
  instability_locking: "Instability / locking / clicking",
  patellar_instability: "Patellar instability",
  history: "History",
};

export type ConsultLocale = "es" | "en";

export function localizeKneeLabel(
  id: string,
  fallback: string,
  locale: ConsultLocale
): string {
  if (locale !== "en") return fallback;
  return KNEE_LABEL_EN[id] ?? fallback;
}

export function localizeKneeOption(option: string, locale: ConsultLocale): string {
  if (locale !== "en") return option;
  return KNEE_OPTION_EN[option] ?? option;
}

export function localizeKneeSection(
  section: string,
  locale: ConsultLocale
): string {
  if (locale !== "en") return (KNEE_SECTION_LABELS as Record<string, string>)[section] ?? section;
  return (
    KNEE_SECTION_LABELS_EN[section] ??
    (KNEE_SECTION_LABELS as Record<string, string>)[section] ??
    section
  );
}
