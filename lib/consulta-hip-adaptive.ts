import {
  filterSleepDependentOptions,
  shouldShowSleepDependentQuestion,
} from "@/lib/consulta-timing";
/**
 * Adaptive questionnaire for hip / groin pain — same structure as knee / shoulder / lower leg
 * (urgency → core → mechanism branches → neuro / impingement / trochanter → history).
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
  "Entrenamiento o ejercicio",
  "Movimiento repetitivo / carrera",
  "Cambio de dirección / pivote",
  "Sprint / chute / estirón explosivo",
  "Inicio progresivo sin causa clara",
  "Otro",
] as const;

export const HIP_LOCATION_OPTIONS = [
  "Ingle / anterior",
  "Lateral (trocánter)",
  "Posterior / glúteo",
  "Isquion / al sentarse",
  "Profundo en la cadera",
  "Irradia a muslo",
  "Irradia a rodilla",
  "Bilateral",
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
  "Rigidez",
  "Chasquido / sensación de enganche",
  "Sensación de bloqueo",
  "Debilidad",
  "Hormigueo / entumecimiento",
  "Cojera",
  "Dolor al dormir de lado",
  "Ninguno",
] as const;

export const AGGRAVATING_MOVEMENT_OPTIONS = [
  "Caminar",
  "Correr",
  "Subir/bajar escaleras",
  "Agacharse",
  "Cruzar piernas",
  "Sentarse bajo / coche",
  "Abrir las piernas hacia fuera",
  "Rotación de cadera",
  "Dormir de lado",
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
  "Pantorrilla",
  "Muslo anterior",
  "Muslo posterior",
  "Ingle",
  "Glúteo",
  "Lateral cadera",
] as const;

export const TRAINING_IMPACT_OPTIONS = [
  "No afecta",
  "Parcialmente",
  "No puedo entrenar o competir",
] as const;

export type HipAdaptiveAnswers = {
  // Red flags
  rf_no_apoyo: string;
  rf_deformidad: string;
  rf_fiebre: string;
  rf_dolor_nocturno_peso: string;
  rf_vascular: string;
  rf_perdida_sensibilidad: string;
  rf_cola_caballo: string;
  // Core
  evolucion: string;
  inicio: string;
  mecanismo: string[];
  mecanismo_otro: string;
  intensidad_dolor: number;
  localizacion_cadera: string[];
  tipo_dolor: string[];
  patron_dolor: string[];
  limitacion_funcional: string[];
  irradiacion: string;
  irradiacion_detalle: string;
  sintomas_asociados: string[];
  movimientos_agravantes: string[];
  // Trauma branch
  trauma_detalle: string;
  trauma_apoyo: string;
  // Training branch
  entreno_ejercicio: string;
  entreno_momento: string;
  entreno_carga: string;
  // Repetitive branch
  repetitivo_actividad: string;
  repetitivo_frecuencia: string;
  // Pivot branch
  pivote_detalle: string;
  // Neuro branch
  neuro_zona: string[];
  neuro_constante: string;
  neuro_movimientos: string;
  // C-sign / impingement branch
  impingement_c_sign: string;
  impingement_flexion: string;
  impingement_clicking: string;
  // Posterior / hamstring / sciatic branch
  posterior_sentarse: string;
  posterior_estirar: string;
  posterior_ciatico: string;
  // Adductor / pubalgia branch
  aductor_apretar: string;
  aductor_abrir: string;
  // Lateral trochanter branch
  lateral_dormir_lado: string;
  lateral_escaleras: string;
  // History
  lesion_previa: string;
  lesion_previa_detalle: string;
  deporte_impacto: string;
};

export function defaultHipAdaptiveAnswers(): HipAdaptiveAnswers {
  return {
    rf_no_apoyo: "",
    rf_deformidad: "",
    rf_fiebre: "",
    rf_dolor_nocturno_peso: "",
    rf_vascular: "",
    rf_perdida_sensibilidad: "",
    rf_cola_caballo: "",
    evolucion: "",
    inicio: "",
    mecanismo: [],
    mecanismo_otro: "",
    intensidad_dolor: 5,
    localizacion_cadera: [],
    tipo_dolor: [],
    patron_dolor: [],
    limitacion_funcional: [],
    irradiacion: "",
    irradiacion_detalle: "",
    sintomas_asociados: [],
    movimientos_agravantes: [],
    trauma_detalle: "",
    trauma_apoyo: "",
    entreno_ejercicio: "",
    entreno_momento: "",
    entreno_carga: "",
    repetitivo_actividad: "",
    repetitivo_frecuencia: "",
    pivote_detalle: "",
    neuro_zona: [],
    neuro_constante: "",
    neuro_movimientos: "",
    impingement_c_sign: "",
    impingement_flexion: "",
    impingement_clicking: "",
    posterior_sentarse: "",
    posterior_estirar: "",
    posterior_ciatico: "",
    aductor_apretar: "",
    aductor_abrir: "",
    lateral_dormir_lado: "",
    lateral_escaleras: "",
    lesion_previa: "",
    lesion_previa_detalle: "",
    deporte_impacto: "",
  };
}

export type HipQuestionSection =
  | "red_flags"
  | "core"
  | "trauma"
  | "training"
  | "repetitive"
  | "pivot"
  | "neuro"
  | "c_sign_impingement"
  | "posterior"
  | "adductor"
  | "lateral_trochanter"
  | "history";

export type HipQuestionDef = {
  id: keyof HipAdaptiveAnswers;
  section: HipQuestionSection;
  label: string;
  type: "single" | "multi" | "text" | "slider";
  options?: readonly string[];
  required?: boolean;
  showIf?: (a: HipAdaptiveAnswers) => boolean;
};

function hasSymptom(a: HipAdaptiveAnswers, name: string): boolean {
  return a.sintomas_asociados.includes(name);
}

function isTrauma(a: HipAdaptiveAnswers): boolean {
  return a.mecanismo.includes("Caída") || a.mecanismo.includes("Golpe directo");
}

function isRepetitive(a: HipAdaptiveAnswers): boolean {
  return a.mecanismo.includes("Movimiento repetitivo / carrera");
}

function isPivot(a: HipAdaptiveAnswers): boolean {
  return a.mecanismo.includes("Cambio de dirección / pivote");
}

function hasNeuro(a: HipAdaptiveAnswers): boolean {
  return (
    hasSymptom(a, "Hormigueo / entumecimiento") ||
    a.tipo_dolor.includes("Hormigueo")
  );
}

/** Deep hip joint / FAI pattern only — NOT plain groin/adductor pain. */
function hasImpingementSection(a: HipAdaptiveAnswers): boolean {
  return a.localizacion_cadera.includes("Profundo en la cadera");
}

function hasLateralTrochanterSection(a: HipAdaptiveAnswers): boolean {
  return a.localizacion_cadera.includes("Lateral (trocánter)");
}

function hasPosteriorSection(a: HipAdaptiveAnswers): boolean {
  return (
    a.localizacion_cadera.includes("Posterior / glúteo") ||
    a.localizacion_cadera.includes("Isquion / al sentarse")
  );
}

function hasAdductorSection(a: HipAdaptiveAnswers): boolean {
  return (
    a.localizacion_cadera.includes("Ingle / anterior") ||
    a.mecanismo.includes("Sprint / chute / estirón explosivo")
  );
}

export const HIP_QUESTIONS: HipQuestionDef[] = [

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
    id: "rf_no_apoyo",
    section: "red_flags",
    label:
      "¿Incapacidad para apoyar peso tras caída o traumatismo? (especialmente si hay riesgo de osteoporosis)",
    type: "single",
    options: YES_NO,
    required: true,
  },
  {
    id: "rf_deformidad",
    section: "red_flags",
    label: "¿Deformidad evidente o pierna acortada/rotada?",
    type: "single",
    options: YES_NO,
    required: true,
  },
  {
    id: "rf_fiebre",
    section: "red_flags",
    label: "¿Fiebre asociada al dolor de cadera?",
    type: "single",
    options: YES_NO,
    required: true,
  },
  {
    id: "rf_dolor_nocturno_peso",
    section: "red_flags",
    label: "¿Dolor nocturno progresivo con pérdida de peso inexplicada?",
    type: "single",
    options: YES_NO,
    required: true,
    showIf: (a) => shouldShowSleepDependentQuestion("rf_dolor_nocturno_peso", a.evolucion),
  },
  {
    id: "rf_vascular",
    section: "red_flags",
    label:
      "¿Dolor inguinal súbito e intenso con preocupación vascular o pie frío?",
    type: "single",
    options: YES_NO,
    required: true,
  },
  {
    id: "rf_perdida_sensibilidad",
    section: "red_flags",
    label: "¿Pérdida de sensibilidad en pie o pierna?",
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
    id: "localizacion_cadera",
    section: "core",
    label: "¿Dónde sientes el dolor en la cadera? (puedes marcar varias)",
    type: "multi",
    options: HIP_LOCATION_OPTIONS,
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
    label: "¿El dolor se irradia hacia muslo, rodilla o ingle?",
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
    id: "rf_cola_caballo",
    section: "core",
    label:
      "¿Alteración reciente de orina/heces o entumecimiento en la zona del asiento (silla de montar)?",
    type: "single",
    options: YES_NO,
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
    id: "trauma_apoyo",
    section: "trauma",
    label: "¿Pudiste seguir apoyando o caminando después?",
    type: "single",
    options: TRAUMA_WEIGHT_BEARING_OPTIONS,
    required: true,
    showIf: isTrauma,
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

  // Repetitive / running branch
  {
    id: "repetitivo_actividad",
    section: "repetitive",
    label: "¿Qué actividad repetitiva o de carrera lo desencadena?",
    type: "text",
    required: true,
    showIf: isRepetitive,
  },
  {
    id: "repetitivo_frecuencia",
    section: "repetitive",
    label: "¿Con qué frecuencia realizas esa actividad?",
    type: "single",
    options: ["Diariamente", "Varias veces por semana", "Ocasionalmente"],
    required: true,
    showIf: isRepetitive,
  },

  // Pivot branch
  {
    id: "pivote_detalle",
    section: "pivot",
    label: "Describe el cambio de dirección o el pivote",
    type: "text",
    required: true,
    showIf: isPivot,
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

  // Deep hip / sitting pain branch (plain language — no clinical jargon for patients)
  {
    id: "impingement_c_sign",
    section: "c_sign_impingement",
    label:
      "¿Duele más si rodeas con la mano la parte delantera/lateral de la ingle (como si señalaras la zona profunda de la cadera)?",
    type: "single",
    options: YES_NO,
    required: true,
    showIf: hasImpingementSection,
  },
  {
    id: "impingement_flexion",
    section: "c_sign_impingement",
    label: "¿Empeora al sentarte, subir al coche o llevar la rodilla hacia el pecho?",
    type: "single",
    options: YES_NO,
    required: true,
    showIf: hasImpingementSection,
  },
  {
    id: "impingement_clicking",
    section: "c_sign_impingement",
    label: "¿Notas un chasquido o la sensación de que algo se engancha dentro?",
    type: "single",
    options: YES_NO,
    required: true,
    showIf: hasImpingementSection,
  },

  // Posterior / hamstring / sciatic-piriformis branch
  {
    id: "posterior_sentarse",
    section: "posterior",
    label: "¿Duele al sentarte mucho tiempo o en superficie dura?",
    type: "single",
    options: YES_NO,
    required: true,
    showIf: hasPosteriorSection,
  },
  {
    id: "posterior_estirar",
    section: "posterior",
    label: "¿Duele o irradia por la parte posterior del muslo al estirar la pierna?",
    type: "single",
    options: YES_NO,
    required: true,
    showIf: hasPosteriorSection,
  },
  {
    id: "posterior_ciatico",
    section: "posterior",
    label:
      "¿Notas dolor u hormigueo en el glúteo al sentarte, sobre todo en silla dura?",
    type: "single",
    options: YES_NO,
    required: true,
    showIf: hasPosteriorSection,
  },

  // Adductor / pubalgia branch
  {
    id: "aductor_apretar",
    section: "adductor",
    label: "¿Duele al apretar las rodillas juntas o al patear?",
    type: "single",
    options: YES_NO,
    required: true,
    showIf: hasAdductorSection,
  },
  {
    id: "aductor_abrir",
    section: "adductor",
    label: "¿Duele al abrir la pierna hacia fuera (separarla del cuerpo)?",
    type: "single",
    options: YES_NO,
    required: true,
    showIf: hasAdductorSection,
  },

  // Lateral trochanter branch
  {
    id: "lateral_dormir_lado",
    section: "lateral_trochanter",
    label: "¿Duele al dormir de lado sobre esa cadera?",
    type: "single",
    options: YES_NO,
    required: true,
    showIf: (a) =>
      hasLateralTrochanterSection(a) &&
      shouldShowSleepDependentQuestion("lateral_dormir_lado", a.evolucion),
  },
  {
    id: "lateral_escaleras",
    section: "lateral_trochanter",
    label: "¿Empeora al subir o bajar escaleras?",
    type: "single",
    options: YES_NO,
    required: true,
    showIf: hasLateralTrochanterSection,
  },

  // History
  {
    id: "lesion_previa",
    section: "history",
    label: "¿Has tenido lesiones previas o cirugía en esta cadera?",
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

export const HIP_SECTION_LABELS: Record<HipQuestionSection, string> = {
  red_flags: "Comprobación de urgencia",
  core: "Caracterización del problema",
  trauma: "Detalles del traumatismo",
  training: "Detalles del entrenamiento",
  repetitive: "Movimiento repetitivo / carrera",
  pivot: "Cambio de dirección / pivote",
  neuro: "Hormigueo / entumecimiento",
  c_sign_impingement: "Dolor profundo al sentarte o flexionar",
  posterior: "Dolor en glúteo / parte de atrás del muslo",
  adductor: "Dolor de ingle / muslo interno",
  lateral_trochanter: "Dolor en el costado de la cadera",
  history: "Antecedentes",
};

export const HIP_SECTION_ORDER: HipQuestionSection[] = [
  "red_flags",
  "core",
  "trauma",
  "training",
  "repetitive",
  "pivot",
  "neuro",
  "c_sign_impingement",
  "posterior",
  "adductor",
  "lateral_trochanter",
  "history",
];

export function getVisibleHipQuestions(
  answers: HipAdaptiveAnswers
): HipQuestionDef[] {
  return HIP_QUESTIONS.filter((q) => !q.showIf || q.showIf(answers)).map((q) => {
    if (!q.options?.length) return q;
    const filtered = filterSleepDependentOptions(q.options, answers.evolucion);
    if (filtered.length === q.options.length) return q;
    return { ...q, options: filtered };
  });
}

export function getVisibleHipSections(
  answers: HipAdaptiveAnswers
): HipQuestionSection[] {
  const visible = getVisibleHipQuestions(answers);
  return HIP_SECTION_ORDER.filter((s) => visible.some((q) => q.section === s));
}

const RED_FLAG_IDS: (keyof HipAdaptiveAnswers)[] = [
  "rf_no_apoyo",
  "rf_deformidad",
  "rf_fiebre",
  "rf_dolor_nocturno_peso",
  "rf_vascular",
  "rf_perdida_sensibilidad",
  "rf_cola_caballo",
];

export function detectHipRedFlags(answers: HipAdaptiveAnswers): {
  urgent: boolean;
  triggered: string[];
} {
  const labels: Record<string, string> = {
    rf_no_apoyo: "Incapacidad para apoyar peso tras traumatismo",
    rf_deformidad: "Deformidad o pierna acortada/rotada",
    rf_fiebre: "Fiebre asociada al dolor de cadera",
    rf_dolor_nocturno_peso: "Dolor nocturno progresivo con pérdida de peso",
    rf_vascular: "Dolor inguinal súbito con preocupación vascular o pie frío",
    rf_perdida_sensibilidad: "Pérdida de sensibilidad en pie o pierna",
    rf_cola_caballo:
      "Alteración de esfínteres o entumecimiento en silla de montar (sospecha síndrome de cola de caballo)",
  };
  const triggered: string[] = [];
  for (const id of RED_FLAG_IDS) {
    if (answers[id] === "Sí") triggered.push(labels[id] ?? id);
  }
  return { urgent: triggered.length > 0, triggered };
}

function isAnswered(q: HipQuestionDef, answers: HipAdaptiveAnswers): boolean {
  const val = answers[q.id];
  if (q.type === "multi") return Array.isArray(val) && val.length > 0;
  if (q.type === "slider") return typeof val === "number" && val >= 1;
  if (q.type === "text") return typeof val === "string" && val.trim().length > 0;
  return typeof val === "string" && val.length > 0;
}

export function validateHipAdaptive(answers: HipAdaptiveAnswers): string | null {
  const visible = getVisibleHipQuestions(answers);
  for (const q of visible) {
    if (q.required !== false && !isAnswered(q, answers)) {
      return `Responde: ${q.label.replace(/\?$/, "")}.`;
    }
  }
  return null;
}

export function validateHipSection(
  section: HipQuestionSection,
  answers: HipAdaptiveAnswers
): string | null {
  const questions = getVisibleHipQuestions(answers).filter(
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

export function formatHipAdaptive(
  answers: HipAdaptiveAnswers,
  bodyMapText: string
): string {
  const { urgent, triggered } = detectHipRedFlags(answers);
  const lines: string[] = [
    "=== CUESTIONARIO — ZONA GLÚTEO / ISQUIOTIBIAL / INGLE / CADERA ===",
    "",
    bodyMapText,
    "",
    "FIDELIDAD (CRÍTICO PARA LA IA):",
    "- La categoría del sistema puede ser «cadera», pero el resumen DEBE usar las localizaciones EXACTAS del paciente (abajo).",
    "- NO digas «cadera y rodilla» ni «articulación de la cadera» si el paciente no marcó «Profundo en la cadera» ni irradiación/molestia en rodilla.",
    "- NO pidas tests de rodilla salvo que el paciente haya marcado irradiación a rodilla o molestia en rodilla.",
    "- Prioriza glúteo / isquiotibiales / aductores cuando esas localizaciones estén marcadas.",
    "",
    "— MECANISMO DE LA LESIÓN (prioridad máxima — citar exactamente en el resumen) —",
    `Mecanismo según cuestionario: ${answers.mecanismo.join(", ")}${answers.mecanismo.includes("Otro") && answers.mecanismo_otro ? ` (${answers.mecanismo_otro})` : ""}`,
    "NO sustituir por el deporte habitual del perfil del paciente.",
    "",
    "— BANDERAS ROJAS —",
    urgent
      ? `⚠️ URGENCIA DETECTADA: ${triggered.join("; ")}`
      : "Ninguna bandera roja marcada como Sí",
    `Incapacidad apoyo tras traumatismo: ${answers.rf_no_apoyo || "—"}`,
    `Deformidad / pierna acortada-rotada: ${answers.rf_deformidad || "—"}`,
    `Fiebre: ${answers.rf_fiebre || "—"}`,
    `Dolor nocturno + pérdida peso: ${answers.rf_dolor_nocturno_peso || "—"}`,
    `Sospecha vascular / pie frío: ${answers.rf_vascular || "—"}`,
    `Pérdida sensibilidad pie/pierna: ${answers.rf_perdida_sensibilidad || "—"}`,
    `Alteración esfínteres / entumecimiento silla de montar: ${answers.rf_cola_caballo || "—"}`,
    "",
    "— VARIABLES CLÍNICAS —",
    `Tiempo de evolución: ${answers.evolucion}`,
    `Forma de inicio: ${answers.inicio}`,
    `Mecanismo: ${answers.mecanismo.join(", ")}${answers.mecanismo.includes("Otro") && answers.mecanismo_otro ? ` (${answers.mecanismo_otro})` : ""}`,
    `Intensidad dolor: ${answers.intensidad_dolor}/10`,
    `Localización EXACTA marcada por el paciente: ${formatMulti(answers.localizacion_cadera)}`,
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
      `Apoyo/caminar tras trauma: ${answers.trauma_apoyo}`
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
      "— MOVIMIENTO REPETITIVO / CARRERA —",
      `Actividad: ${answers.repetitivo_actividad}`,
      `Frecuencia: ${answers.repetitivo_frecuencia}`
    );
  }
  if (isPivot(answers)) {
    lines.push(
      "",
      "— CAMBIO DE DIRECCIÓN / PIVOTE —",
      `Detalle: ${answers.pivote_detalle}`
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
  if (hasImpingementSection(answers)) {
    lines.push(
      "",
      "— DOLOR PROFUNDO AL SENTARSE / FLEXIONAR —",
      `Duele al señalar ingle/parte delantera profunda: ${answers.impingement_c_sign}`,
      `Empeora al sentarse / coche / rodilla al pecho: ${answers.impingement_flexion}`,
      `Chasquido o sensación de enganche: ${answers.impingement_clicking}`
    );
  }
  if (hasPosteriorSection(answers)) {
    lines.push(
      "",
      "— DOLOR GLÚTEO / PARTE DE ATRÁS DEL MUSLO —",
      `Duele al sentarse mucho tiempo / superficie dura: ${answers.posterior_sentarse}`,
      `Duele/irradia parte posterior del muslo al estirar la pierna: ${answers.posterior_estirar}`,
      `Dolor/hormigueo glúteo al sentarse: ${answers.posterior_ciatico}`
    );
  }
  if (hasAdductorSection(answers)) {
    lines.push(
      "",
      "— DOLOR DE INGLE / MUSLO INTERNO —",
      `Duele al apretar rodillas / patear: ${answers.aductor_apretar}`,
      `Duele al abrir la pierna hacia fuera: ${answers.aductor_abrir}`
    );
  }
  if (hasLateralTrochanterSection(answers)) {
    lines.push(
      "",
      "— DOLOR LATERAL (TROCÁNTER) —",
      `Duele dormir de lado: ${answers.lateral_dormir_lado}`,
      `Empeora con escaleras: ${answers.lateral_escaleras}`
    );
  }

  lines.push(
    "",
    "— ANTECEDENTES —",
    `Lesión/cirugía previa cadera: ${answers.lesion_previa}${answers.lesion_previa === "Sí" && answers.lesion_previa_detalle ? ` — ${answers.lesion_previa_detalle}` : ""}`,
    `Impacto deportivo: ${answers.deporte_impacto}`,
    "",
    "NOTA: El sistema recopila variables clínicas para estimar estructuras afectadas (labrum, cartílago, tendón, bursa, músculos aductores, nervio), no para diagnosticar.",
    "",
    "ORIENTACIÓN DIFERENCIAL (usar el cuestionario; no inventar datos ni articulaciones no mencionadas):",
    "- Posterior/glúteo o isquion + duele al sentarse + irradia por parte posterior del muslo al estirar → tendinopatía/sobrecarga de isquiotibiales proximales vs irritación glútea.",
    "- Posterior/glúteo + dolor/hormigueo glúteo al sentarse sin dolor claro al estirar el isquiotibial → irritación glútea / posible atrapamiento nervioso vs origen isquiotibial.",
    "- Ingle/anterior o muslo interno + duele al apretar rodillas o patear → sobrecarga/distensión de aductores (NO asumir pinzamiento de cadera).",
    "- Ingle/anterior + duele al abrir la pierna + inicio progresivo/entrenamiento → sobrecarga aductor / pubalgia atlética vs distensión aguda.",
    "- SOLO si marcó «Profundo en la cadera» + duele al sentarse/coche + chasquido/enganche → entonces sí valorar pinzamiento / labrum; si No a esas preguntas, NO priorizar labrum/FAI.",
    "- Lateral + dormir de lado + escaleras → dolor trocantérico / glúteo medio vs tendinopatía.",
    "- Irradiación a muslo/rodilla SOLO si el paciente la marcó → referida lumbar vs irradiación muscular; si no la marcó, NO menciones rodilla.",
    "- Alteración reciente de esfínteres o entumecimiento en silla de montar → sospecha cola de caballo (URGENCIA).",
    "- Caída + no apoyo + deformidad → fractura/luxación (urgencia).",
    "- Dolor nocturno progresivo + pérdida peso → valorar patología ósea (priorizar valoración).",
    "- Fiebre + hinchazón → infección (urgencia).",
    "- Dolor inguinal súbito + pie frío → sospecha vascular (urgencia)."
  );

  return lines.filter(Boolean).join("\n");
}

export function isLastHipSection(
  answers: HipAdaptiveAnswers,
  sectionIndex: number
): boolean {
  const sections = getVisibleHipSections(answers);
  return sectionIndex >= sections.length - 1;
}

/** Precise zone label for AI — never invent "hip and knee" from category alone. */
export function hipBodyAreaLabelForAi(
  answers: HipAdaptiveAnswers,
  initialMessage: string
): string {
  const parts: string[] = [];
  const locs = answers.localizacion_cadera ?? [];
  const text = `${initialMessage}\n${locs.join(" ")}`;

  if (/Posterior\s*\/\s*gl[uú]teo|gl[uú]teo|buttock/i.test(text)) parts.push("glúteo");
  if (/Isquion|isquio|hamstring/i.test(text)) parts.push("isquiotibiales");
  if (/Ingle|aductor|adductor|groin|muslo interno/i.test(text)) {
    parts.push("ingle / aductores");
  }
  if (/Profundo en la cadera/i.test(text)) parts.push("cadera profunda");
  if (/Lateral|troc[aá]nter/i.test(text)) parts.push("cadera lateral");
  if (/Irradia a rodilla|rodilla/i.test(locs.join(" ")) || /Irradia a rodilla/.test(text)) {
    if (locs.some((l) => /rodilla/i.test(l))) parts.push("irradiación hacia rodilla");
  }

  const unique = [...new Set(parts)];
  if (unique.length > 0) return unique.join(" + ");
  return "zona glúteo / ingle / muslo (según relato del paciente)";
}

export const HIP_LABEL_EN: Partial<Record<string, string>> = {
  rf_no_apoyo:
    "Unable to bear weight after a fall or trauma? (especially if osteoporosis risk)",
  rf_deformidad: "Obvious deformity or shortened/rotated leg?",
  rf_fiebre: "Fever associated with hip pain?",
  rf_dolor_nocturno_peso: "Progressive night pain with unexplained weight loss?",
  rf_vascular:
    "Sudden severe groin pain with vascular concern or cold foot?",
  rf_perdida_sensibilidad: "Loss of sensation in the foot or leg?",
  rf_cola_caballo:
    "Recent change in bladder/bowel control or numbness in the saddle area (groin/perineum)?",
  evolucion: "How long have you had this problem?",
  inicio: "How did it start?",
  mecanismo: "What may have caused it? (you can select several)",
  mecanismo_otro: "Describe the mechanism",
  intensidad_dolor: "Pain intensity (1–10)",
  localizacion_cadera: "Where do you feel the pain in the hip? (you can select several)",
  tipo_dolor: "How would you describe the pain? (you can select several)",
  patron_dolor: "In which situations does it appear or worsen? (you can select several)",
  limitacion_funcional: "How much does it limit walking or weight-bearing?",
  irradiacion: "Does the pain radiate to the thigh, knee, or groin?",
  irradiacion_detalle: "How far does the radiation go?",
  sintomas_asociados: "What other symptoms do you notice? (you can select several)",
  movimientos_agravantes: "Which movements provoke or worsen it? (you can select several)",
  trauma_detalle: "Describe the blow or fall",
  trauma_apoyo: "Could you keep bearing weight or walking afterwards?",
  entreno_ejercicio: "Which exercise or movement were you doing?",
  entreno_momento: "When did the pain appear?",
  entreno_carga: "What type of load were you using?",
  repetitivo_actividad: "Which repetitive or running activity triggers it?",
  repetitivo_frecuencia: "How often do you do that activity?",
  pivote_detalle: "Describe the change of direction or pivot",
  neuro_zona: "Which areas have tingling or numbness? (you can select several)",
  neuro_constante: "Is the tingling or numbness constant?",
  neuro_movimientos: "Which movements trigger it?",
  impingement_c_sign:
    "Does it hurt more if you cup your hand over the front/side of the groin (as if pointing to the deep hip area)?",
  impingement_flexion:
    "Does it worsen when sitting, getting into a car, or bringing the knee toward the chest?",
  impingement_clicking: "Do you notice a click or a feeling that something catches inside?",
  posterior_sentarse: "Does it hurt when sitting for a long time or on a hard surface?",
  posterior_estirar:
    "Does it hurt or radiate down the back of the thigh when you stretch the leg out?",
  posterior_ciatico:
    "Do you notice pain or tingling in the buttock when sitting, especially on a hard chair?",
  aductor_apretar: "Does it hurt to squeeze your knees together or when kicking?",
  aductor_abrir: "Does it hurt to open the leg outward (away from the body)?",
  lateral_dormir_lado: "Does it hurt when sleeping on that side?",
  lateral_escaleras: "Does it worsen going up or down stairs?",
  lesion_previa: "Have you had previous injuries or surgery on this hip?",
  lesion_previa_detalle: "Describe previous injuries, surgeries, or treatments",
  deporte_impacto: "How does it affect your training or sport?",
};

export const HIP_OPTION_EN: Record<string, string> = {
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
  "Movimiento repetitivo / carrera": "Repetitive movement / running",
  "Cambio de dirección / pivote": "Change of direction / pivot",
  "Sprint / chute / estirón explosivo": "Sprint / kicking / explosive stretch",
  "Inicio progresivo sin causa clara": "Gradual onset with no clear cause",
  Otro: "Other",
  "Ingle / anterior": "Groin / anterior",
  "Lateral (trocánter)": "Lateral (trochanter)",
  "Posterior / glúteo": "Posterior / buttock",
  "Isquion / al sentarse": "Sit bone (ischium) / when sitting",
  "Profundo en la cadera": "Deep in the hip",
  "Irradia a muslo": "Radiates to thigh",
  "Irradia a rodilla": "Radiates to knee",
  Bilateral: "Bilateral",
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
  "Chasquido / catching": "Clicking / catching",
  "Chasquido / sensación de enganche": "Clicking / catching sensation",
  "Sensación de bloqueo": "Locking sensation",
  Debilidad: "Weakness",
  "Hormigueo / entumecimiento": "Tingling / numbness",
  Cojera: "Limping",
  "Dolor al dormir de lado": "Pain when side sleeping",
  Ninguno: "None",
  Caminar: "Walking",
  Correr: "Running",
  "Subir/bajar escaleras": "Going up / down stairs",
  Agacharse: "Squatting",
  "Cruzar piernas": "Crossing legs",
  "Sentarse bajo / coche": "Low sitting / car",
  "Abrir piernas / abducción": "Leg abduction",
  "Abrir las piernas hacia fuera": "Opening the legs outward",
  "Rotación de cadera": "Hip rotation",
  "Dormir de lado": "Side sleeping",
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
  Pantorrilla: "Calf",
  "Muslo anterior": "Front of thigh",
  "Muslo posterior": "Back of thigh",
  Ingle: "Groin",
  Glúteo: "Buttock",
  "Lateral cadera": "Lateral hip",
  "No afecta": "Does not affect",
  Parcialmente: "Partially",
  "No puedo entrenar o competir": "I can't train or compete",
  Diariamente: "Daily",
  "Varias veces por semana": "Several times a week",
  Ocasionalmente: "Occasionally",
  "No, intermitente": "No, intermittent",
  "Sí, constante": "Yes, constant",
};

export const HIP_SECTION_LABELS_EN: Record<string, string> = {
  red_flags: "Urgency check",
  core: "Problem characterization",
  trauma: "Trauma details",
  training: "Training details",
  repetitive: "Repetitive movement / running",
  pivot: "Change of direction / pivot",
  neuro: "Tingling / numbness",
  c_sign_impingement: "Deep pain when sitting or flexing",
  posterior: "Buttock / back-of-thigh pain",
  adductor: "Groin / inner-thigh pain",
  lateral_trochanter: "Side-of-hip pain",
  history: "History",
};

export type ConsultLocale = "es" | "en";

export function localizeHipLabel(
  id: string,
  fallback: string,
  locale: ConsultLocale
): string {
  if (locale !== "en") return fallback;
  return HIP_LABEL_EN[id] ?? fallback;
}

export function localizeHipOption(option: string, locale: ConsultLocale): string {
  if (locale !== "en") return option;
  return HIP_OPTION_EN[option] ?? option;
}

export function localizeHipSection(
  section: string,
  locale: ConsultLocale
): string {
  if (locale !== "en") return (HIP_SECTION_LABELS as Record<string, string>)[section] ?? section;
  return (
    HIP_SECTION_LABELS_EN[section] ??
    (HIP_SECTION_LABELS as Record<string, string>)[section] ??
    section
  );
}
