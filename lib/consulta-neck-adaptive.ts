import {
  filterSleepDependentOptions,
  shouldShowSleepDependentQuestion,
} from "@/lib/consulta-timing";
/**
 * Adaptive questionnaire for neck / cervical spine — same structure as shoulder
 * (urgency → core → mechanism branches → neuro → history).
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
  "Golpe directo / lesión fuerte",
  "Movimiento brusco (latigazo / giro)",
  "Entrenamiento o ejercicio",
  "Postura mantenida (pantalla, dormir mal)",
  "Movimiento repetitivo",
  "Empezó poco a poco, sin causa clara",
  "Otro",
] as const;

export const NECK_LOCATION_OPTIONS = [
  "Base del cráneo / nuca alta",
  "Lateral del cuello (un lado)",
  "Ambos lados del cuello",
  "Parte media / posterior",
  "Hacia el trapecio / hombro",
  "Profundo en el cuello",
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

export const FUNCTIONAL_LIMIT_OPTIONS = [
  "Ninguna",
  "Leve",
  "Moderada",
  "Severa",
  "Casi no puedo mover el cuello",
] as const;

export const ASSOCIATED_SYMPTOM_OPTIONS = [
  "Debilidad en brazo o mano",
  "Hormigueo o entumecimiento en brazo/mano",
  "Dolor que baja al brazo",
  "Dolor de cabeza",
  "Mareo",
  "Rigidez matutina",
  "Chasquidos al mover el cuello",
  "Espasmo muscular",
  "Zumbido en el oído o sensación de oído tapado",
  "Ninguno",
] as const;

export const AGGRAVATING_MOVEMENT_OPTIONS = [
  "Doblar el cuello (mirar al pecho)",
  "Estirar el cuello (mirar al techo)",
  "Rotar a la derecha",
  "Rotar a la izquierda",
  "Inclinar la oreja al hombro",
  "Cargar peso / mochila",
  "Trabajar con el ordenador",
  "Estirar e inclinar la cabeza hacia el lado donde duele/hormiguea",
  "Ninguno en particular",
] as const;

export const RADIATION_OPTIONS = [
  "No",
  "Hacia un hombro",
  "Hacia el brazo",
  "Hacia la mano / dedos",
  "Hacia la cabeza",
  "Hacia la espalda alta",
] as const;

export const NEURO_ARM_SIDE_OPTIONS = [
  "Derecho",
  "Izquierdo",
  "Ambos",
  "No aplica",
] as const;

export const WHIPLASH_DIRECTION_OPTIONS = [
  "Por detrás (alcance trasero)",
  "Por delante (frenazo/choque frontal)",
  "Lateral",
  "Giro/torsión sin impacto vehicular",
] as const;

export const WHIPLASH_ONSET_OPTIONS = [
  "Inmediato",
  "A las pocas horas",
  "Al día siguiente o después",
] as const;

export const REPETITIVE_FREQUENCY_OPTIONS = [
  "Diariamente",
  "Varias veces por semana",
  "Ocasionalmente",
] as const;

export type NeckAdaptiveAnswers = {
  rf_trauma_grave: string;
  rf_debilidad_brazos_piernas: string;
  rf_perdida_sensibilidad: string;
  rf_fiebre: string;
  rf_mareo_vision: string;
  rf_esfinteres: string;
  rf_cefalea_subita: string;
  rf_manipulacion_reciente: string;
  rf_torpeza_manos: string;
  rf_lhermitte: string;
  rf_perdida_peso_cancer: string;
  evolucion: string;
  inicio: string;
  mecanismo: string[];
  mecanismo_otro: string;
  intensidad_dolor: number;
  localizacion_cuello: string[];
  tipo_dolor: string[];
  limitacion_funcional: string[];
  irradiacion: string;
  irradiacion_detalle: string;
  sintomas_asociados: string[];
  movimientos_agravantes: string[];
  cefalea_patron: string;
  trauma_detalle: string;
  trauma_chasquido: string;
  latigazo_contexto: string;
  latigazo_direccion: string;
  latigazo_dolor_inmediato: string;
  postura_actividad: string;
  postura_horas: string;
  entreno_ejercicio: string;
  entreno_momento: string;
  repetitivo_actividad: string;
  repetitivo_frecuencia: string;
  neuro_lado: string;
  neuro_dedos: string;
  neuro_constante: string;
  lesion_previa: string;
  lesion_previa_detalle: string;
};

export function defaultNeckAdaptiveAnswers(): NeckAdaptiveAnswers {
  return {
    rf_trauma_grave: "",
    rf_debilidad_brazos_piernas: "",
    rf_perdida_sensibilidad: "",
    rf_fiebre: "",
    rf_mareo_vision: "",
    rf_esfinteres: "",
    rf_cefalea_subita: "",
    rf_manipulacion_reciente: "",
    rf_torpeza_manos: "",
    rf_lhermitte: "",
    rf_perdida_peso_cancer: "",
    evolucion: "",
    inicio: "",
    mecanismo: [],
    mecanismo_otro: "",
    intensidad_dolor: 5,
    localizacion_cuello: [],
    tipo_dolor: [],
    limitacion_funcional: [],
    irradiacion: "",
    irradiacion_detalle: "",
    sintomas_asociados: [],
    movimientos_agravantes: [],
    cefalea_patron: "",
    trauma_detalle: "",
    trauma_chasquido: "",
    latigazo_contexto: "",
    latigazo_direccion: "",
    latigazo_dolor_inmediato: "",
    postura_actividad: "",
    postura_horas: "",
    entreno_ejercicio: "",
    entreno_momento: "",
    repetitivo_actividad: "",
    repetitivo_frecuencia: "",
    neuro_lado: "",
    neuro_dedos: "",
    neuro_constante: "",
    lesion_previa: "",
    lesion_previa_detalle: "",
  };
}

export type NeckQuestionSection =
  | "red_flags"
  | "core"
  | "trauma"
  | "whiplash"
  | "posture"
  | "training"
  | "repetitive"
  | "neuro"
  | "history";

export type NeckQuestionDef = {
  id: keyof NeckAdaptiveAnswers;
  section: NeckQuestionSection;
  label: string;
  type: "single" | "multi" | "text" | "slider";
  options?: readonly string[];
  required?: boolean;
  showIf?: (a: NeckAdaptiveAnswers) => boolean;
};

function hasSymptom(a: NeckAdaptiveAnswers, name: string): boolean {
  return a.sintomas_asociados.includes(name);
}

function hasNeuro(a: NeckAdaptiveAnswers): boolean {
  return (
    hasSymptom(a, "Hormigueo o entumecimiento en brazo/mano") ||
    hasSymptom(a, "Debilidad en brazo o mano") ||
    hasSymptom(a, "Dolor que baja al brazo") ||
    a.tipo_dolor.includes("Hormigueo") ||
    a.irradiacion === "Hacia el brazo" ||
    a.irradiacion === "Hacia la mano / dedos"
  );
}

function hasHeadache(a: NeckAdaptiveAnswers): boolean {
  return hasSymptom(a, "Dolor de cabeza");
}

function isWhiplash(a: NeckAdaptiveAnswers): boolean {
  return a.mecanismo.includes("Movimiento brusco (latigazo / giro)");
}

function isRepetitive(a: NeckAdaptiveAnswers): boolean {
  return a.mecanismo.includes("Movimiento repetitivo");
}

export const NECK_QUESTIONS: NeckQuestionDef[] = [

  // Timing first (hide sleep/night questions if injury is hours-old)
  {
    id: "evolucion",
    section: "red_flags",
    label: "¿Cuánto tiempo llevas con este problema?",
    type: "single",
    options: EVOLUTION_OPTIONS,
    required: true,
  },
  {
    id: "rf_trauma_grave",
    section: "red_flags",
    label: "¿Hubo un golpe o accidente fuerte en el cuello (accidente, caída de altura, golpe intenso)?",
    type: "single",
    options: YES_NO,
    required: true,
  },
  {
    id: "rf_debilidad_brazos_piernas",
    section: "red_flags",
    label: "¿Debilidad nueva en brazos o piernas, o torpeza al caminar?",
    type: "single",
    options: YES_NO,
    required: true,
  },
  {
    id: "rf_perdida_sensibilidad",
    section: "red_flags",
    label: "¿Pérdida de sensibilidad marcada o entumecimiento progresivo?",
    type: "single",
    options: YES_NO,
    required: true,
  },
  {
    id: "rf_fiebre",
    section: "red_flags",
    label: "¿Tienes fiebre, el cuello muy rígido o un malestar general intenso?",
    type: "single",
    options: YES_NO,
    required: true,
  },
  {
    id: "rf_mareo_vision",
    section: "red_flags",
    label: "¿Mareo intenso, visión doble, dificultad para hablar o tragar?",
    type: "single",
    options: YES_NO,
    required: true,
  },
  {
    id: "rf_esfinteres",
    section: "red_flags",
    label: "¿Problemas nuevos para controlar orina o heces?",
    type: "single",
    options: YES_NO,
    required: true,
  },
  {
    id: "rf_cefalea_subita",
    section: "red_flags",
    label:
      "¿Dolor de cabeza repentino, muy intenso o distinto a cualquier otro que hayas tenido, junto con el dolor de cuello?",
    type: "single",
    options: YES_NO,
    required: true,
  },
  {
    id: "rf_manipulacion_reciente",
    section: "red_flags",
    label:
      "¿Te has hecho recientemente una manipulación o ajuste del cuello (fisioterapia, quiropráctico, osteopatía)?",
    type: "single",
    options: YES_NO,
    required: true,
  },
  {
    id: "rf_torpeza_manos",
    section: "red_flags",
    label:
      "¿Se te caen objetos de las manos o notas torpeza fina (abrochar botones, escribir)?",
    type: "single",
    options: YES_NO,
    required: true,
  },
  {
    id: "rf_lhermitte",
    section: "red_flags",
    label:
      "¿Notas una descarga eléctrica que baja por la espalda o brazos al doblar el cuello hacia delante?",
    type: "single",
    options: YES_NO,
    required: true,
  },
  {
    id: "rf_perdida_peso_cancer",
    section: "red_flags",
    label: "¿Pérdida de peso sin explicación o antecedente de cáncer?",
    type: "single",
    options: YES_NO,
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
    id: "localizacion_cuello",
    section: "core",
    label: "¿Dónde sientes el dolor en el cuello? (puedes marcar varias)",
    type: "multi",
    options: NECK_LOCATION_OPTIONS,
    required: true,
  },
  {
    id: "tipo_dolor",
    section: "core",
    label: "¿Cómo describirías el dolor?",
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
    label: "¿El dolor se extiende a otra zona?",
    type: "single",
    options: RADIATION_OPTIONS,
    required: true,
  },
  {
    id: "irradiacion_detalle",
    section: "core",
    label: "Cuéntanos hasta dónde llega ese dolor y cómo es",
    type: "text",
    required: true,
    showIf: (a) => a.irradiacion !== "No" && a.irradiacion !== "",
  },
  {
    id: "sintomas_asociados",
    section: "core",
    label: "¿Qué otros síntomas notas? (músculos, hormigueo…)",
    type: "multi",
    options: ASSOCIATED_SYMPTOM_OPTIONS,
    required: true,
  },
  {
    id: "movimientos_agravantes",
    section: "core",
    label: "¿Qué movimientos del cuello lo provocan o empeoran? (puedes marcar varias)",
    type: "multi",
    options: AGGRAVATING_MOVEMENT_OPTIONS,
    required: true,
  },
  {
    id: "cefalea_patron",
    section: "core",
    label: "Si tienes dolor de cabeza, ¿empieza en la nuca y sube hacia la sien/ojo del mismo lado?",
    type: "single",
    options: YES_NO,
    required: true,
    showIf: hasHeadache,
  },

  {
    id: "trauma_detalle",
    section: "trauma",
    label: "Describe el golpe o la caída",
    type: "text",
    required: true,
    showIf: (a) =>
      a.mecanismo.includes("Caída") || a.mecanismo.includes("Golpe directo / lesión fuerte"),
  },
  {
    id: "trauma_chasquido",
    section: "trauma",
    label: "¿Escuchaste o sentiste un chasquido en el cuello?",
    type: "single",
    options: YES_NO,
    required: true,
    showIf: (a) =>
      a.mecanismo.includes("Caída") || a.mecanismo.includes("Golpe directo / lesión fuerte"),
  },

  {
    id: "latigazo_contexto",
    section: "whiplash",
    label: "¿En qué contexto fue el movimiento brusco? (coche, deporte, giro…)",
    type: "text",
    required: true,
    showIf: isWhiplash,
  },
  {
    id: "latigazo_direccion",
    section: "whiplash",
    label: "¿En qué dirección fue el impacto o movimiento?",
    type: "single",
    options: WHIPLASH_DIRECTION_OPTIONS,
    required: true,
    showIf: isWhiplash,
  },
  {
    id: "latigazo_dolor_inmediato",
    section: "whiplash",
    label: "¿Cuándo empezó el dolor tras el movimiento?",
    type: "single",
    options: WHIPLASH_ONSET_OPTIONS,
    required: true,
    showIf: isWhiplash,
  },

  {
    id: "postura_actividad",
    section: "posture",
    label: "¿Qué postura o actividad lo relaciona? (pantalla, dormir, conducir…)",
    type: "text",
    required: true,
    showIf: (a) => a.mecanismo.includes("Postura mantenida (pantalla, dormir mal)"),
  },
  {
    id: "postura_horas",
    section: "posture",
    label: "¿Cuántas horas al día sueles estar en esa postura?",
    type: "single",
    options: ["Menos de 2 h", "2–4 h", "4–8 h", "Más de 8 h"],
    required: true,
    showIf: (a) => a.mecanismo.includes("Postura mantenida (pantalla, dormir mal)"),
  },

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
    options: ["Durante el ejercicio", "Justo después", "Al día siguiente"],
    required: true,
    showIf: (a) => a.mecanismo.includes("Entrenamiento o ejercicio"),
  },

  {
    id: "repetitivo_actividad",
    section: "repetitive",
    label: "¿Qué actividad repetitiva la desencadena?",
    type: "text",
    required: true,
    showIf: isRepetitive,
  },
  {
    id: "repetitivo_frecuencia",
    section: "repetitive",
    label: "¿Con qué frecuencia realizas esa actividad?",
    type: "single",
    options: REPETITIVE_FREQUENCY_OPTIONS,
    required: true,
    showIf: isRepetitive,
  },

  {
    id: "neuro_lado",
    section: "neuro",
    label: "¿En qué lado notas hormigueo, debilidad o dolor hacia el brazo?",
    type: "single",
    options: NEURO_ARM_SIDE_OPTIONS,
    required: true,
    showIf: hasNeuro,
  },
  {
    id: "neuro_dedos",
    section: "neuro",
    label: "Si afecta a la mano, ¿qué dedos o zona?",
    type: "text",
    required: false,
    showIf: hasNeuro,
  },
  {
    id: "neuro_constante",
    section: "neuro",
    label: "¿Ese hormigueo, entumecimiento o debilidad es constante?",
    type: "single",
    options: ["No, intermitente", "Sí, constante"],
    required: true,
    showIf: hasNeuro,
  },

  {
    id: "lesion_previa",
    section: "history",
    label: "¿Has tenido lesiones o problemas previos en el cuello?",
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
  },];

export const NECK_SECTION_LABELS: Record<NeckQuestionSection, string> = {
  red_flags: "Comprobación de urgencia",
  core: "Caracterización del problema",
  trauma: "Detalles del golpe o la caída",
  whiplash: "Movimiento brusco",
  posture: "Postura / pantalla",
  training: "Detalles del entrenamiento",
  repetitive: "Movimiento repetitivo",
  neuro: "Síntomas nerviosos (brazo / mano)",
  history: "Antecedentes",
};

export const NECK_SECTION_ORDER: NeckQuestionSection[] = [
  "red_flags",
  "core",
  "trauma",
  "whiplash",
  "posture",
  "training",
  "repetitive",
  "neuro",
  "history",
];

export function getVisibleNeckQuestions(
  answers: NeckAdaptiveAnswers
): NeckQuestionDef[] {
  return NECK_QUESTIONS.filter((q) => !q.showIf || q.showIf(answers)).map((q) => {
    if (!q.options?.length) return q;
    const filtered = filterSleepDependentOptions(q.options, answers.evolucion);
    if (filtered.length === q.options.length) return q;
    return { ...q, options: filtered };
  });
}

export function getVisibleNeckSections(
  answers: NeckAdaptiveAnswers
): NeckQuestionSection[] {
  const visible = getVisibleNeckQuestions(answers);
  return NECK_SECTION_ORDER.filter((s) => visible.some((q) => q.section === s));
}

const RED_FLAG_IDS: (keyof NeckAdaptiveAnswers)[] = [
  "rf_trauma_grave",
  "rf_debilidad_brazos_piernas",
  "rf_perdida_sensibilidad",
  "rf_fiebre",
  "rf_mareo_vision",
  "rf_esfinteres",
  "rf_cefalea_subita",
  "rf_manipulacion_reciente",
  "rf_torpeza_manos",
  "rf_lhermitte",
  "rf_perdida_peso_cancer",
];

export function detectNeckRedFlags(answers: NeckAdaptiveAnswers): {
  urgent: boolean;
  triggered: string[];
} {
  const labels: Record<string, string> = {
    rf_trauma_grave: "Golpe o accidente fuerte en el cuello",
    rf_debilidad_brazos_piernas: "Debilidad en brazos/piernas o torpeza al caminar",
    rf_perdida_sensibilidad: "Pérdida de sensibilidad marcada",
    rf_fiebre: "Fiebre / rigidez extrema / malestar general",
    rf_mareo_vision: "Mareo intenso, visión doble, habla o deglución",
    rf_esfinteres: "Problemas nuevos para controlar orina o heces",
    rf_cefalea_subita: "Cefalea repentina, muy intensa o distinta a la habitual (sospecha VAD/hemorragia)",
    rf_manipulacion_reciente: "Manipulación/ajuste del cuello reciente (riesgo de disección arterial)",
    rf_torpeza_manos: "Torpeza fina en manos (sospecha mielopatía)",
    rf_lhermitte: "Signo de Lhermitte (descarga eléctrica con flexión cervical)",
    rf_perdida_peso_cancer: "Pérdida de peso inexplicada o antecedente de cáncer",
  };
  const triggered: string[] = [];
  for (const id of RED_FLAG_IDS) {
    if (answers[id] === "Sí") triggered.push(labels[id] ?? id);
  }
  return { urgent: triggered.length > 0, triggered };
}

function isAnswered(q: NeckQuestionDef, answers: NeckAdaptiveAnswers): boolean {
  const val = answers[q.id];
  if (q.type === "multi") return Array.isArray(val) && val.length > 0;
  if (q.type === "slider") return typeof val === "number" && val >= 1;
  if (q.type === "text") return typeof val === "string" && val.trim().length > 0;
  return typeof val === "string" && val.length > 0;
}

export function validateNeckAdaptive(answers: NeckAdaptiveAnswers): AdaptiveValidationIssue | null {
  const visible = getVisibleNeckQuestions(answers);
  for (const q of visible) {
    if (q.required !== false && !isAnswered(q, answers)) {
      return missingQuestionIssue(q);
    }
  }
  return null;
}

export function validateNeckSection(
  section: NeckQuestionSection,
  answers: NeckAdaptiveAnswers
): AdaptiveValidationIssue | null {
  const questions = getVisibleNeckQuestions(answers).filter((q) => q.section === section);
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

export function formatNeckAdaptive(
  answers: NeckAdaptiveAnswers,
  bodyMapText: string
): string {
  const { urgent, triggered } = detectNeckRedFlags(answers);
  const lines: string[] = [
    "=== CUESTIONARIO ADAPTATIVO — CUELLO / CERVICAL ===",
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
    `Traumatismo fuerte: ${answers.rf_trauma_grave || "—"}`,
    `Debilidad brazos/piernas: ${answers.rf_debilidad_brazos_piernas || "—"}`,
    `Pérdida sensibilidad: ${answers.rf_perdida_sensibilidad || "—"}`,
    `Fiebre / malestar: ${answers.rf_fiebre || "—"}`,
    `Mareo / visión / habla / deglución: ${answers.rf_mareo_vision || "—"}`,
    `Esfínteres: ${answers.rf_esfinteres || "—"}`,
    `Cefalea súbita/distinta: ${answers.rf_cefalea_subita || "—"}`,
    `Manipulación cervical reciente: ${answers.rf_manipulacion_reciente || "—"}`,
    `Torpeza fina en manos: ${answers.rf_torpeza_manos || "—"}`,
    `Signo de Lhermitte: ${answers.rf_lhermitte || "—"}`,
    `Pérdida de peso / antecedente de cáncer: ${answers.rf_perdida_peso_cancer || "—"}`,
    "",
    "— VARIABLES CLÍNICAS —",
    `Tiempo de evolución: ${answers.evolucion}`,
    `Forma de inicio: ${answers.inicio}`,
    `Mecanismo: ${answers.mecanismo.join(", ")}${answers.mecanismo.includes("Otro") && answers.mecanismo_otro ? ` (${answers.mecanismo_otro})` : ""}`,
    `Intensidad dolor: ${answers.intensidad_dolor}/10`,
    `Localización cuello: ${formatMulti(answers.localizacion_cuello)}`,
    `Tipo de dolor: ${formatMulti(answers.tipo_dolor)}`,
    `Limitación funcional: ${answers.limitacion_funcional.join(", ") || "—"}`,
    `Irradiación: ${answers.irradiacion}${answers.irradiacion_detalle ? ` — ${answers.irradiacion_detalle}` : ""}`,
    `Síntomas asociados: ${formatMulti(answers.sintomas_asociados)}`,
    `Movimientos agravantes: ${formatMulti(answers.movimientos_agravantes)}`,
  ];

  if (hasHeadache(answers)) {
    lines.push("", "— PATRÓN DE CEFALEA —", `Nuca → sien/ojo mismo lado: ${answers.cefalea_patron}`);
  }

  if (answers.mecanismo.includes("Caída") || answers.mecanismo.includes("Golpe directo / lesión fuerte")) {
    lines.push(
      "",
      "— DETALLE TRAUMA —",
      `Detalle: ${answers.trauma_detalle}`,
      `Chasquido: ${answers.trauma_chasquido}`
    );
  }
  if (isWhiplash(answers)) {
    lines.push(
      "",
      "— MOVIMIENTO BRUSCO / LATIGAZO —",
      `Contexto: ${answers.latigazo_contexto}`,
      `Dirección: ${answers.latigazo_direccion}`,
      `Inicio del dolor: ${answers.latigazo_dolor_inmediato}`
    );
  }
  if (answers.mecanismo.includes("Postura mantenida (pantalla, dormir mal)")) {
    lines.push(
      "",
      "— POSTURA —",
      `Actividad: ${answers.postura_actividad}`,
      `Horas/día: ${answers.postura_horas}`
    );
  }
  if (answers.mecanismo.includes("Entrenamiento o ejercicio")) {
    lines.push(
      "",
      "— ENTRENAMIENTO —",
      `Ejercicio: ${answers.entreno_ejercicio}`,
      `Momento: ${answers.entreno_momento}`
    );
  }
  if (isRepetitive(answers)) {
    lines.push(
      "",
      "— MOVIMIENTO REPETITIVO —",
      `Actividad: ${answers.repetitivo_actividad}`,
      `Frecuencia: ${answers.repetitivo_frecuencia}`
    );
  }
  if (hasNeuro(answers)) {
    lines.push(
      "",
      "— SÍNTOMAS NERVIOSOS —",
      `Lado: ${answers.neuro_lado}`,
      answers.neuro_dedos ? `Dedos/zona: ${answers.neuro_dedos}` : "",
      `Constante: ${answers.neuro_constante}`
    );
  }

  lines.push(
    "",
    "— ANTECEDENTES —",
    `Lesión previa cuello: ${answers.lesion_previa}${answers.lesion_previa === "Sí" && answers.lesion_previa_detalle ? ` — ${answers.lesion_previa_detalle}` : ""}`,
    "",
    "NOTA: El sistema recopila variables clínicas para estimar estructuras afectadas (músculos, discos, nervios), no para diagnosticar.",
    "",
    "ORIENTACIÓN DIFERENCIAL (usar el cuestionario; no inventar datos):",
    "- Mecanismo latigazo/giro + accidente de tráfico + dolor con horas de retraso → esguince cervical / whiplash (WAD); clasificar gravedad por limitación funcional y síntomas neurológicos asociados.",
    "- Mareo/vértigo + cambios de postura cervical + sin nistagmo posicional típico → mareo cervicogénico vs causa vestibular (VPPB, neuritis vestibular) — diferenciar por relación temporal con el movimiento del cuello vs cambios de posición de la cabeza en el espacio.",
    "- Dolor/hormigueo en brazo + empeora con extensión/rotación/inclinación lateral hacia el lado afectado (patrón tipo Spurling) → radiculopatía cervical por compresión foraminal.",
    "- Cefalea que empieza en la nuca y sube hacia sien/ojo del mismo lado + relacionada con postura o movimientos cervicales → cefalea cervicogénica vs migraña/cefalea 1ª.",
    "- Dolor local, sin irradiación neurológica, relacionado con postura mantenida o sobreuso → dolor mecánico/miofascial (contractura, síndrome del trapecio).",
    "- Torpeza fina en manos + alteración de la marcha + signo de Lhermitte + hiperreflexia → sospecha de MIELOPATÍA CERVICAL (valorar con prioridad, no solo de urgencia inmediata pero sí preferente).",
    "- Manipulación/ajuste del cuello reciente + cefalea súbita distinta + mareo/vértigo + síntomas neurológicos (visión doble, disartria, disfagia, ataxia) → SOSPECHA DE DISECCIÓN ARTERIAL VERTEBRAL/CAROTÍDEA (VAD) — URGENCIA ABSOLUTA, derivar a urgencias de inmediato.",
    "- Fiebre + rigidez cervical extrema + malestar general intenso → sospecha de MENINGISMO/meningitis — urgencia médica inmediata.",
    "- Traumatismo fuerte + dolor intenso + limitación severa o inestabilidad → sospecha de FRACTURA CERVICAL — inmovilizar y derivar a urgencias, no manipular.",
    "- Pérdida de peso inexplicada o antecedente de cáncer + dolor nocturno o progresivo sin mecánica clara → descartar causa neoplásica/metastásica.",
    "- BANDERAS ROJAS de esfínteres + debilidad en piernas + torpeza al caminar → sospecha de compromiso medular — urgencia absoluta."
  );

  return lines.filter(Boolean).join("\n");
}

export function isLastNeckSection(
  answers: NeckAdaptiveAnswers,
  sectionIndex: number
): boolean {
  const sections = getVisibleNeckSections(answers);
  return sectionIndex >= sections.length - 1;
}

export const NECK_LABEL_EN: Partial<Record<string, string>> = {
  rf_trauma_grave: "Was there significant trauma to the neck (accident, fall from height, hard blow)?",
  rf_debilidad_brazos_piernas: "New weakness in arms or legs, or clumsiness when walking?",
  rf_perdida_sensibilidad: "Marked loss of sensation or progressive numbness?",
  rf_fiebre: "Fever, extreme neck stiffness, or severe general malaise?",
  rf_mareo_vision: "Severe dizziness, double vision, or difficulty speaking or swallowing?",
  rf_esfinteres: "New problems controlling bladder or bowel?",
  rf_cefalea_subita:
    "A sudden, very intense headache, or different from any you've had before, together with the neck pain?",
  rf_manipulacion_reciente:
    "Have you recently had a neck manipulation or adjustment (physiotherapy, chiropractic, osteopathy)?",
  rf_torpeza_manos:
    "Do you drop objects from your hands or notice fine clumsiness (buttoning, writing)?",
  rf_lhermitte:
    "Do you notice an electric-shock sensation running down your back or arms when bending your neck forward?",
  rf_perdida_peso_cancer: "Unexplained weight loss or history of cancer?",
  evolucion: "How long have you had this problem?",
  inicio: "How did it start?",
  mecanismo: "What may have caused it? (you can select several)",
  mecanismo_otro: "Tell us what happened or how it started",
  intensidad_dolor: "Pain intensity (1–10)",
  localizacion_cuello: "Where do you feel the pain in the neck? (you can select several)",
  tipo_dolor: "How would you describe the pain?",
  limitacion_funcional: "How much does it limit you day to day?",
  irradiacion: "Does the pain spread to another area?",
  irradiacion_detalle: "Describe how far that pain goes and what it feels like",
  sintomas_asociados: "What other symptoms do you notice? (muscles, nerves…)",
  movimientos_agravantes: "Which neck movements provoke or worsen it? (you can select several)",
  cefalea_patron: "If you have a headache, does it start at the back of the head/neck and go up toward the temple/eye on the same side?",
  trauma_detalle: "Describe the blow or fall",
  trauma_chasquido: "Did you hear or feel a click in the neck?",
  latigazo_contexto: "In what context was the sudden movement? (car, sport, twist…)",
  latigazo_direccion: "In which direction was the impact or movement?",
  latigazo_dolor_inmediato: "When did the pain start after the movement?",
  postura_actividad: "Which posture or activity relates to it? (screen, sleep, driving…)",
  postura_horas: "How many hours a day are you usually in that posture?",
  entreno_ejercicio: "Which exercise or movement were you doing?",
  entreno_momento: "When did the pain appear?",
  repetitivo_actividad: "Which repetitive activity triggers it?",
  repetitivo_frecuencia: "How often do you do that activity?",
  neuro_lado: "On which side do you notice tingling, weakness, or pain into the arm?",
  neuro_dedos: "If it affects the hand, which fingers or area?",
  neuro_constante: "Are those nerve symptoms constant?",
  lesion_previa: "Have you had previous injuries or problems in the neck?",
  lesion_previa_detalle: "Describe previous injuries or treatments",
};

export const NECK_OPTION_EN: Record<string, string> = {
  No: "No",
  Sí: "Yes",
  "Ha sido ahora": "Just now",
  "Reciente (1-4 horas)": "Recent (1–4 hours)",
  "Menos de 48 horas": "Less than 48 hours",
  "Entre 2 y 7 días": "Between 2 and 7 days",
  "Entre 1 y 4 semanas": "Between 1 and 4 weeks",
  "Más de 1 mes": "More than 1 month",
  Repentino: "Sudden",
  "Poco a poco": "Gradual",
  Caída: "Fall",
  "Golpe directo / lesión fuerte": "Direct blow / hard impact",
  "Movimiento brusco (latigazo / giro)": "Sudden movement (whiplash / twist)",
  "Entrenamiento o ejercicio": "Training or exercise",
  "Postura mantenida (pantalla, dormir mal)": "Sustained posture (screen, poor sleep)",
  "Movimiento repetitivo": "Repetitive movement",
  "Empezó poco a poco, sin causa clara": "Gradual onset with no clear cause",
  Otro: "Other",
  "Base del cráneo / nuca alta": "Base of skull / upper nape",
  "Lateral del cuello (un lado)": "Side of the neck (one side)",
  "Ambos lados del cuello": "Both sides of the neck",
  "Parte media / posterior": "Middle / back of the neck",
  "Hacia el trapecio / hombro": "Toward the trapezius / shoulder",
  "Profundo en el cuello": "Deep in the neck",
  "No estoy seguro": "I'm not sure",
  Punzante: "Sharp",
  Quemazón: "Burning",
  Rigidez: "Stiffness",
  "Presión / peso": "Pressure / heaviness",
  Hormigueo: "Tingling",
  "Malestar difuso": "Diffuse discomfort",
  "En reposo": "At rest",
  "Al mover el cuello": "When moving the neck",
  "Mirando arriba o abajo": "Looking up or down",
  "Al girar la cabeza": "When turning the head",
  "Por la noche / al dormir": "At night / when sleeping",
  "Tras estar mucho rato con pantallas": "After long periods on screens",
  Constante: "Constant",
  Ninguna: "None",
  Leve: "Mild",
  Moderada: "Moderate",
  Severa: "Severe",
  "Casi no puedo mover el cuello": "I can barely move the neck",
  "Debilidad en brazo o mano": "Weakness in arm or hand",
  "Hormigueo o entumecimiento en brazo/mano": "Tingling or numbness in arm/hand",
  "Dolor que baja al brazo": "Pain radiating down the arm",
  "Dolor de cabeza": "Headache",
  Mareo: "Dizziness",
  "Rigidez matutina": "Morning stiffness",
  "Chasquidos al mover el cuello": "Clicking when moving the neck",
  "Espasmo muscular": "Muscle spasm",
  "Zumbido en el oído o sensación de oído tapado": "Ringing in the ear or feeling of a blocked ear",
  Ninguno: "None",
  "Doblar el cuello (mirar al pecho)": "Flexion (looking at the chest)",
  "Estirar el cuello (mirar al techo)": "Extension (looking at the ceiling)",
  "Rotar a la derecha": "Rotate to the right",
  "Rotar a la izquierda": "Rotate to the left",
  "Inclinar la oreja al hombro": "Tilt ear toward shoulder",
  "Cargar peso / mochila": "Carrying weight / backpack",
  "Trabajar con el ordenador": "Working at a computer",
  "Estirar e inclinar la cabeza hacia el lado donde duele/hormiguea":
    "Extending and tilting the head toward the side that hurts/tingles",
  "Ninguno en particular": "None in particular",
  "Hacia un hombro": "Toward one shoulder",
  "Hacia el brazo": "Toward the arm",
  "Hacia la mano / dedos": "Toward the hand / fingers",
  "Hacia la cabeza": "Toward the head",
  "Hacia la espalda alta": "Toward the upper back",
  Derecho: "Right",
  Izquierdo: "Left",
  Ambos: "Both",
  "No aplica": "Not applicable",
  "No afecta": "Does not affect",
  Parcialmente: "Partially",
  "No puedo entrenar o competir": "I can't train or compete",
  "Menos de 2 h": "Less than 2 h",
  "2–4 h": "2–4 h",
  "4–8 h": "4–8 h",
  "Más de 8 h": "More than 8 h",
  "Durante el ejercicio": "During exercise",
  "Justo después": "Right afterwards",
  "Al día siguiente": "The next day",
  "No, intermitente": "No, intermittent",
  "Sí, constante": "Yes, constant",
  "Por detrás (alcance trasero)": "From behind (rear-end collision)",
  "Por delante (frenazo/choque frontal)": "From the front (sudden braking/frontal collision)",
  Lateral: "Lateral",
  "Giro/torsión sin impacto vehicular": "Twist/rotation without vehicle impact",
  Inmediato: "Immediate",
  "A las pocas horas": "A few hours later",
  "Al día siguiente o después": "The next day or later",
  Diariamente: "Daily",
  "Varias veces por semana": "Several times a week",
  Ocasionalmente: "Occasionally",
};

export const NECK_SECTION_LABELS_EN: Record<string, string> = {
  red_flags: "Urgency check",
  core: "Problem characterization",
  trauma: "Trauma details",
  whiplash: "Sudden movement",
  posture: "Posture / screen",
  training: "Training details",
  repetitive: "Repetitive movement",
  neuro: "Nerve symptoms (arm / hand)",
  history: "History",
};

export type ConsultLocale = "es" | "en";
export function localizeNeckLabel(id: string, fallback: string, locale: ConsultLocale): string {
  if (locale !== "en") return fallback;
  return NECK_LABEL_EN[id] ?? fallback;
}
export function localizeNeckOption(option: string, locale: ConsultLocale): string {
  if (locale !== "en") return option;
  return NECK_OPTION_EN[option] ?? option;
}
export function localizeNeckSection(section: string, locale: ConsultLocale): string {
  if (locale !== "en") return (NECK_SECTION_LABELS as any)[section] ?? section;
  return NECK_SECTION_LABELS_EN[section] ?? (NECK_SECTION_LABELS as any)[section] ?? section;
}

