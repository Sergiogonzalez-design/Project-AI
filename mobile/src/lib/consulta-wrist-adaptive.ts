import { missingQuestionIssue, type AdaptiveValidationIssue } from "./consulta-validation";
import {
  filterSleepDependentOptions,
  shouldShowSleepDependentQuestion,
} from "./consulta-timing";
export const YES_NO = ["No", "Sí"] as const;

export const WRIST_ONSET_OPTIONS = [
  "Empezó poco a poco, sin causa clara",
  "Tras entrenamiento",
  "Tras levantar pesas",
  "Tras movimientos repetitivos",
  "Tras una caída",
  "Tras un golpe directo",
  "Tras torcer la muñeca",
  "Al apoyarme con la mano",
  "Apoyo repetido de peso (flexiones, plancha, pesas con muñeca estirada hacia atrás)",
  "No lo sé",
] as const;

export const WRIST_BEGIN_OPTIONS = [
  "Ha sido ahora",
  "Reciente (1-4 horas)",
  "Hoy",
  "Hace 2–7 días",
  "Hace 1–4 semanas",
  "Hace más de un mes",
  "Hace varios meses",
] as const;

export const WRIST_LOCATION_OPTIONS = [
  "Lado del pulgar",
  "Lado del meñique",
  "Palma de la mano (parte de dentro)",
  "Dorso de la mano (parte de atrás)",
  "Centro de la muñeca",
  "Toda la muñeca",
  "Base del pulgar",
  "Hacia la mano",
] as const;

export const WRIST_PAIN_QUALITY_OPTIONS = [
  "Punzante",
  "Dolor sordo",
  "Quemazón",
  "Tirantez",
  "Tirón",
  "Descarga eléctrica",
  "Palpitante",
  "Punzadas / pinchazos",
] as const;

export const WRIST_AGGRAVATING_MOVEMENTS = [
  "Doblar la muñeca hacia delante",
  "Estirar la muñeca hacia atrás",
  "Mover la muñeca de lado a lado",
  "Rotar el antebrazo",
  "Agarrar objetos",
  "Pinzar con el pulgar",
  "Levantar objetos",
  "Empujarme para levantarme (silla/suelo)",
  "Teclear",
  "Escribir",
  "Girar / retorcer (abrir tarros, llaves)",
  "Ninguno",
] as const;

export const WRIST_FUNCTIONAL_LIMIT = [
  "Sin limitación",
  "Molestia leve",
  "No puedo entrenar",
  "Dificultad para agarrar objetos",
  "Dificultad para escribir",
  "Dificultad para abrir tarros o botellas",
  "Dificultad para cargar objetos",
  "No puedo usar la mano con normalidad",
] as const;

export const WRIST_ASSOCIATED_SYMPTOMS = [
  "Hinchazón",
  "Moretón",
  "Calor",
  "Chasquidos",
  "Bloqueo",
  "Debilidad",
  "Rigidez",
  "Hormigueo",
  "Entumecimiento",
  "Sensación de que algo se mueve dentro",
  "Bulto o protuberancia visible",
  "Ninguno",
] as const;

export const WRIST_RADIATION = [
  "No",
  "Hacia el pulgar",
  "Hacia los dedos",
  "Hacia el antebrazo",
  "Hacia el codo",
] as const;

export const WRIST_PREVIOUS_EPISODE = ["Nunca", "Una vez", "Varias veces"] as const;

export const FALL_WRIST_POSITION = [
  "Hacia atrás (estirada)",
  "Hacia delante (doblada)",
  "No lo sé",
] as const;

export const WEIGHTS_TIMING = ["Durante el levantamiento", "Después", "Horas más tarde / al día siguiente"] as const;

export const NUMB_FINGERS = ["Pulgar", "Índice", "Medio", "Anular", "Meñique"] as const;

export type WristAdaptiveAnswers = {
  // Red flags
  rf_deformidad: string;
  rf_no_movimiento: string;
  rf_inflamacion_severa: string;
  rf_herida_abierta: string;
  rf_fiebre: string;
  rf_dedos_frios: string;
  rf_perdida_fuerza: string;
  rf_perdida_sensibilidad: string;

  // Core
  inicio: string;
  comienzo: string;
  intensidad_dolor: number;
  localizacion_muneca: string[];
  dolor_familiar: string;
  calidad_dolor: string[];
  movimientos_agravantes: string[];
  limitacion_funcional: string[];
  sintomas_asociados: string[];
  irradiacion: string;
  episodio_previo: string;
  actividad_tipo: string;
  actividad_detalle: string;

  // Fall branch
  caida_mano_extendida: string;
  caida_posicion_muneca: string;
  caida_crack_pop: string;
  caida_pudo_usar: string;
  caida_hinchazon_inmediata: string;
  caida_dolor_tabaquera: string;

  // Weights branch
  pesas_ejercicio: string;
  pesas_peso: string;
  pesas_momento: string;
  pesas_pop: string;

  // Repetitive branch
  repetitivo_actividad: string;
  repetitivo_horas_dia: string;
  repetitivo_empeora: string;

  // Neuro branch
  num_dedos: string[];
  num_constante: string;
  num_noche: string;
  num_sacudir_mejora: string;
  num_durkan: string;

  // Thumb side branch
  pulgar_pinza_agrava: string;
  pulgar_cargar_agrava: string;
  pulgar_mover_reproduce: string;
  pulgar_rigidez_matutina: string;
  pulgar_what: string;

  // Ulnar side branch
  menique_torsion_agrava: string;
  menique_empujar_silla_agrava: string;
  menique_click_inestabilidad: string;
  menique_fovea: string;

  // Clicking / locking branch
  bloqueo_atasca: string;
  click_duele: string;
  click_siente_desplaza: string;

  // Weakness branch
  debilidad_por_dolor: string;
  debilidad_agarre: string;
  debilidad_se_caen_objetos: string;
};

export function defaultWristAdaptiveAnswers(): WristAdaptiveAnswers {
  return {
    rf_deformidad: "",
    rf_no_movimiento: "",
    rf_inflamacion_severa: "",
    rf_herida_abierta: "",
    rf_fiebre: "",
    rf_dedos_frios: "",
    rf_perdida_fuerza: "",
    rf_perdida_sensibilidad: "",
    inicio: "",
    comienzo: "",
    intensidad_dolor: 5,
    localizacion_muneca: [],
    dolor_familiar: "",
    calidad_dolor: [],
    movimientos_agravantes: [],
    limitacion_funcional: [],
    sintomas_asociados: [],
    irradiacion: "",
    episodio_previo: "",
    actividad_tipo: "",
    actividad_detalle: "",
    caida_mano_extendida: "",
    caida_posicion_muneca: "",
    caida_crack_pop: "",
    caida_pudo_usar: "",
    caida_hinchazon_inmediata: "",
    caida_dolor_tabaquera: "",
    pesas_ejercicio: "",
    pesas_peso: "",
    pesas_momento: "",
    pesas_pop: "",
    repetitivo_actividad: "",
    repetitivo_horas_dia: "",
    repetitivo_empeora: "",
    num_dedos: [],
    num_constante: "",
    num_noche: "",
    num_sacudir_mejora: "",
    num_durkan: "",
    pulgar_pinza_agrava: "",
    pulgar_cargar_agrava: "",
    pulgar_mover_reproduce: "",
    pulgar_rigidez_matutina: "",
    pulgar_what: "",
    menique_torsion_agrava: "",
    menique_empujar_silla_agrava: "",
    menique_click_inestabilidad: "",
    menique_fovea: "",
    bloqueo_atasca: "",
    click_duele: "",
    click_siente_desplaza: "",
    debilidad_por_dolor: "",
    debilidad_agarre: "",
    debilidad_se_caen_objetos: "",
  };
}

export type WristQuestionSection =
  | "red_flags"
  | "core"
  | "fall"
  | "weights"
  | "repetitive"
  | "neuro"
  | "thumb_side"
  | "ulnar_side"
  | "clicking_locking"
  | "weakness";

export const WRIST_SECTION_LABELS: Record<WristQuestionSection, string> = {
  red_flags: "Banderas rojas",
  core: "Cuestionario principal",
  fall: "Detalles sobre la caída",
  weights: "Detalles sobre pesas",
  repetitive: "Movimientos repetitivos",
  neuro: "Hormigueo / entumecimiento",
  thumb_side: "Dolor lado del pulgar",
  ulnar_side: "Dolor lado del meñique",
  clicking_locking: "Chasquidos / bloqueo",
  weakness: "Debilidad",
};

export type WristQuestionDef = {
  id: keyof WristAdaptiveAnswers;
  section: WristQuestionSection;
  label: string;
  type: "single" | "multi" | "text" | "slider" | "wrist_map";
  options?: readonly string[];
  required?: boolean;
  showIf?: (a: WristAdaptiveAnswers) => boolean;
  min?: number;
  max?: number;
};

function hasSymptom(a: WristAdaptiveAnswers, s: string) {
  return a.sintomas_asociados.includes(s);
}

function hasAnyLocation(a: WristAdaptiveAnswers, loc: string) {
  return a.localizacion_muneca.includes(loc);
}

function hasMedianDigits(a: WristAdaptiveAnswers) {
  return a.num_dedos.some((d) => d === "Pulgar" || d === "Índice" || d === "Medio");
}

export const WRIST_QUESTIONS: WristQuestionDef[] = [
  // Red flags (always)
  { id: "rf_deformidad", section: "red_flags", label: "¿Tras la lesión, se ve torcido, deformado o muy distinto de lo normal?", type: "single", options: YES_NO, required: true },
  { id: "rf_no_movimiento", section: "red_flags", label: "¿No puedes mover la muñeca?", type: "single", options: YES_NO, required: true },
  { id: "rf_inflamacion_severa", section: "red_flags", label: "¿Hinchazón severa inmediatamente tras el golpe/caída?", type: "single", options: YES_NO, required: true },
  { id: "rf_herida_abierta", section: "red_flags", label: "¿Herida abierta?", type: "single", options: YES_NO, required: true },
  { id: "rf_fiebre", section: "red_flags", label: "¿Fiebre?", type: "single", options: YES_NO, required: true },
  { id: "rf_dedos_frios", section: "red_flags", label: "¿Dedos pálidos/azules/fríos?", type: "single", options: YES_NO, required: true },
  { id: "rf_perdida_fuerza", section: "red_flags", label: "¿Pérdida súbita de fuerza?", type: "single", options: YES_NO, required: true },
  { id: "rf_perdida_sensibilidad", section: "red_flags", label: "¿Pérdida de sensibilidad marcada?", type: "single", options: YES_NO, required: true },

  // Core — location + familiar pain before mechanism
  { id: "localizacion_muneca", section: "core", label: "1. ¿Dónde duele? (puedes seleccionar varias zonas)", type: "wrist_map", options: WRIST_LOCATION_OPTIONS, required: true },
  {
    id: "dolor_familiar",
    section: "core",
    label: "2. ¿Es el mismo dolor que notas al agarrar, usar el pulgar, flexionar la muñeca o al despertar con hormigueo?",
    type: "single",
    options: ["Sí, es el mismo", "No, es otra molestia", "No estoy seguro"],
    required: true,
  },
  { id: "inicio", section: "core", label: "3. ¿Cómo empezó el problema?", type: "single", options: WRIST_ONSET_OPTIONS, required: true },
  { id: "comienzo", section: "core", label: "4. ¿Cuándo comenzó?", type: "single", options: WRIST_BEGIN_OPTIONS, required: true },
  { id: "intensidad_dolor", section: "core", label: "5. Intensidad de dolor actual", type: "slider", required: true, min: 0, max: 10 },
  { id: "calidad_dolor", section: "core", label: "6. ¿Cómo es el dolor?", type: "multi", options: WRIST_PAIN_QUALITY_OPTIONS, required: true },
  { id: "movimientos_agravantes", section: "core", label: "7. ¿Qué movimientos lo empeoran? (puedes marcar varias)", type: "multi", options: WRIST_AGGRAVATING_MOVEMENTS, required: true },
  { id: "limitacion_funcional", section: "core", label: "8. ¿Qué te cuesta hacer? (puedes marcar varias)", type: "multi", options: WRIST_FUNCTIONAL_LIMIT, required: true },
  { id: "sintomas_asociados", section: "core", label: "9. ¿Qué más notas?", type: "multi", options: WRIST_ASSOCIATED_SYMPTOMS, required: true },
  { id: "irradiacion", section: "core", label: "10. ¿El dolor se extiende a otra zona?", type: "single", options: WRIST_RADIATION, required: true },
  { id: "episodio_previo", section: "core", label: "11. ¿Te ha pasado antes?", type: "single", options: WRIST_PREVIOUS_EPISODE, required: true },

  // No preguntamos deporte: pedimos actividad tipo + detalle (dinámico)
  {
    id: "actividad_tipo",
    section: "core",
    label: "12. ¿Qué actividad estabas realizando cuando empezó o empeoró?",
    type: "single",
    options: ["Pesas / gimnasio", "Deporte", "Escalada", "Trabajo de oficina (teclado/ratón)", "Otra"] as const,
    required: true,
  },
  {
    id: "actividad_detalle",
    section: "core",
    label: "13. Detalla la actividad",
    type: "text",
    required: true,
  },

  // Fall branch
  { id: "caida_mano_extendida", section: "fall", label: "¿Aterrizaste con la mano estirada hacia atrás?", type: "single", options: YES_NO, required: true, showIf: (a) => a.inicio === "Tras una caída" || a.inicio === "Al apoyarme con la mano" },
  { id: "caida_posicion_muneca", section: "fall", label: "¿La muñeca estaba doblada hacia delante o hacia atrás?", type: "single", options: FALL_WRIST_POSITION, required: true, showIf: (a) => a.inicio === "Tras una caída" || a.inicio === "Al apoyarme con la mano" },
  { id: "caida_crack_pop", section: "fall", label: "¿Oíste un crack o pop?", type: "single", options: YES_NO, required: true, showIf: (a) => a.inicio === "Tras una caída" || a.inicio === "Al apoyarme con la mano" },
  { id: "caida_pudo_usar", section: "fall", label: "¿Pudiste seguir usando la mano?", type: "single", options: ["Sí", "Parcialmente", "No"] as const, required: true, showIf: (a) => a.inicio === "Tras una caída" || a.inicio === "Al apoyarme con la mano" },
  { id: "caida_hinchazon_inmediata", section: "fall", label: "¿La hinchazón apareció inmediatamente?", type: "single", options: YES_NO, required: true, showIf: (a) => a.inicio === "Tras una caída" || a.inicio === "Al apoyarme con la mano" },
  { id: "caida_dolor_tabaquera", section: "fall", label: "¿Duele al presionar en el hueco de la base del pulgar, entre los tendones (el «valle» junto al pulgar)?", type: "single", options: YES_NO, required: true, showIf: (a) => (a.inicio === "Tras una caída" || a.inicio === "Al apoyarme con la mano") && (hasAnyLocation(a, "Lado del pulgar") || hasAnyLocation(a, "Base del pulgar")) },

  // Weights
  { id: "pesas_ejercicio", section: "weights", label: "¿Qué ejercicio estabas haciendo?", type: "text", required: true, showIf: (a) => a.inicio === "Tras levantar pesas" || a.actividad_tipo === "Pesas / gimnasio" },
  { id: "pesas_peso", section: "weights", label: "Peso aproximado (si lo recuerdas)", type: "text", required: true, showIf: (a) => a.inicio === "Tras levantar pesas" || a.actividad_tipo === "Pesas / gimnasio" },
  { id: "pesas_momento", section: "weights", label: "¿Durante el levantamiento o después?", type: "single", options: WEIGHTS_TIMING, required: true, showIf: (a) => a.inicio === "Tras levantar pesas" || a.actividad_tipo === "Pesas / gimnasio" },
  { id: "pesas_pop", section: "weights", label: "¿Notaste un pop?", type: "single", options: YES_NO, required: true, showIf: (a) => a.inicio === "Tras levantar pesas" || a.actividad_tipo === "Pesas / gimnasio" },

  // Repetitive
  { id: "repetitivo_actividad", section: "repetitive", label: "¿Qué actividad repetías?", type: "text", required: true, showIf: (a) => a.inicio === "Tras movimientos repetitivos" },
  { id: "repetitivo_horas_dia", section: "repetitive", label: "¿Cuántas horas al día aproximadamente?", type: "text", required: true, showIf: (a) => a.inicio === "Tras movimientos repetitivos" },
  { id: "repetitivo_empeora", section: "repetitive", label: "¿Ha ido empeorando progresivamente?", type: "single", options: YES_NO, required: true, showIf: (a) => a.inicio === "Tras movimientos repetitivos" },

  // Neuro
  { id: "num_dedos", section: "neuro", label: "¿Qué dedos están afectados?", type: "multi", options: NUMB_FINGERS, required: true, showIf: (a) => hasSymptom(a, "Hormigueo") || hasSymptom(a, "Entumecimiento") },
  { id: "num_constante", section: "neuro", label: "¿Es constante o intermitente?", type: "single", options: ["Constante", "Intermitente"] as const, required: true, showIf: (a) => hasSymptom(a, "Hormigueo") || hasSymptom(a, "Entumecimiento") },
  { id: "num_noche", section: "neuro", label: "¿Es peor por la noche?", type: "single", options: YES_NO, required: true, showIf: (a) => (hasSymptom(a, "Hormigueo") || hasSymptom(a, "Entumecimiento")) && shouldShowSleepDependentQuestion("num_noche", a.comienzo, a.inicio) },
  { id: "num_sacudir_mejora", section: "neuro", label: "¿Sacudir la mano mejora los síntomas?", type: "single", options: YES_NO, required: true, showIf: (a) => hasSymptom(a, "Hormigueo") || hasSymptom(a, "Entumecimiento") },
  { id: "num_durkan", section: "neuro", label: "¿Si aprietas el centro de la palma (cerca de la muñeca) unos segundos, aparece el mismo hormigueo en pulgar, índice o medio?", type: "single", options: YES_NO, required: true, showIf: (a) => (hasSymptom(a, "Hormigueo") || hasSymptom(a, "Entumecimiento")) && hasMedianDigits(a) },

  // Thumb side
  { id: "pulgar_pinza_agrava", section: "thumb_side", label: "¿Pinzar o agarrar lo empeora?", type: "single", options: YES_NO, required: true, showIf: (a) => hasAnyLocation(a, "Lado del pulgar") || hasAnyLocation(a, "Base del pulgar") },
  { id: "pulgar_cargar_agrava", section: "thumb_side", label: "¿Cargar peso (niños/bolsas) lo empeora?", type: "single", options: YES_NO, required: true, showIf: (a) => hasAnyLocation(a, "Lado del pulgar") || hasAnyLocation(a, "Base del pulgar") },
  { id: "pulgar_mover_reproduce", section: "thumb_side", label: "¿Mover el pulgar reproduce el dolor?", type: "single", options: YES_NO, required: true, showIf: (a) => hasAnyLocation(a, "Lado del pulgar") || hasAnyLocation(a, "Base del pulgar") },
  { id: "pulgar_what", section: "thumb_side", label: "¿Duele el borde del pulgar de la muñeca si doblas la muñeca hacia la palma y apartas el pulgar hacia fuera?", type: "single", options: YES_NO, required: true, showIf: (a) => hasAnyLocation(a, "Lado del pulgar") || hasAnyLocation(a, "Base del pulgar") },
  { id: "pulgar_rigidez_matutina", section: "thumb_side", label: "¿Notas rigidez o crujido al mover el pulgar, especialmente por la mañana?", type: "single", options: YES_NO, required: true, showIf: (a) => (hasAnyLocation(a, "Lado del pulgar") || hasAnyLocation(a, "Base del pulgar")) && shouldShowSleepDependentQuestion("pulgar_rigidez_matutina", a.comienzo, a.inicio) },

  // Ulnar side
  { id: "menique_torsion_agrava", section: "ulnar_side", label: "¿Girar / retorcer la muñeca lo empeora?", type: "single", options: YES_NO, required: true, showIf: (a) => hasAnyLocation(a, "Lado del meñique") },
  { id: "menique_empujar_silla_agrava", section: "ulnar_side", label: "¿Empujarte para levantarte (silla/suelo) lo empeora?", type: "single", options: YES_NO, required: true, showIf: (a) => hasAnyLocation(a, "Lado del meñique") },
  { id: "menique_click_inestabilidad", section: "ulnar_side", label: "¿Notas chasquidos o inestabilidad en esa zona?", type: "single", options: YES_NO, required: true, showIf: (a) => hasAnyLocation(a, "Lado del meñique") },
  { id: "menique_fovea", section: "ulnar_side", label: "¿Duele al presionar el huequito de la palma junto al hueso del meñique (justo debajo de la muñeca, lado cubital)?", type: "single", options: YES_NO, required: true, showIf: (a) => hasAnyLocation(a, "Lado del meñique") },

  // Clicking / locking
  { id: "bloqueo_atasca", section: "clicking_locking", label: "¿Se queda atascada la muñeca o algún movimiento?", type: "single", options: YES_NO, required: true, showIf: (a) => hasSymptom(a, "Chasquidos") || hasSymptom(a, "Bloqueo") || hasSymptom(a, "Sensación de que algo se mueve dentro") },
  { id: "click_duele", section: "clicking_locking", label: "¿El chasquido es doloroso?", type: "single", options: YES_NO, required: true, showIf: (a) => hasSymptom(a, "Chasquidos") || hasSymptom(a, "Bloqueo") || hasSymptom(a, "Sensación de que algo se mueve dentro") },
  { id: "click_siente_desplaza", section: "clicking_locking", label: "¿Sientes que algo se desplaza dentro?", type: "single", options: YES_NO, required: true, showIf: (a) => hasSymptom(a, "Chasquidos") || hasSymptom(a, "Bloqueo") || hasSymptom(a, "Sensación de que algo se mueve dentro") },

  // Weakness
  { id: "debilidad_por_dolor", section: "weakness", label: "¿La debilidad parece ser por dolor?", type: "single", options: YES_NO, required: true, showIf: (a) => hasSymptom(a, "Debilidad") },
  { id: "debilidad_agarre", section: "weakness", label: "¿Notas el agarre más débil de lo normal?", type: "single", options: YES_NO, required: true, showIf: (a) => hasSymptom(a, "Debilidad") },
  { id: "debilidad_se_caen_objetos", section: "weakness", label: "¿Se te caen objetos?", type: "single", options: YES_NO, required: true, showIf: (a) => hasSymptom(a, "Debilidad") },
];

export function detectWristRedFlags(answers: WristAdaptiveAnswers): {
  urgent: boolean;
  triggered: string[];
} {
  const triggered: string[] = [];
  const pairs: Array<[keyof WristAdaptiveAnswers, string]> = [
    ["rf_deformidad", "se ve torcido, deformado o muy distinto"],
    ["rf_no_movimiento", "incapacidad para mover la muñeca"],
    ["rf_inflamacion_severa", "hinchazón severa inmediata"],
    ["rf_herida_abierta", "herida abierta"],
    ["rf_fiebre", "fiebre"],
    ["rf_dedos_frios", "dedos fríos/azules/pálidos"],
    ["rf_perdida_fuerza", "pérdida súbita de fuerza"],
    ["rf_perdida_sensibilidad", "pérdida de sensibilidad"],
  ];
  for (const [k, label] of pairs) {
    if (answers[k] === "Sí") triggered.push(label);
  }
  return { urgent: triggered.length > 0, triggered };
}

export function getVisibleWristQuestions(answers: WristAdaptiveAnswers): WristQuestionDef[] {
  return WRIST_QUESTIONS.filter((q) => !q.showIf || q.showIf(answers)).map((q) => {
    if (!q.options?.length) return q;
    const filtered = filterSleepDependentOptions(q.options, answers.comienzo, answers.inicio);
    if (filtered.length === q.options.length) return q;
    return { ...q, options: filtered };
  });
}

export function getVisibleWristSections(answers: WristAdaptiveAnswers): WristQuestionSection[] {
  const sections: WristQuestionSection[] = ["red_flags", "core"];

  const fall = answers.inicio === "Tras una caída" || answers.inicio === "Al apoyarme con la mano";
  const weights = answers.inicio === "Tras levantar pesas" || answers.actividad_tipo === "Pesas / gimnasio";
  const repetitive = answers.inicio === "Tras movimientos repetitivos";
  const neuro = hasSymptom(answers, "Hormigueo") || hasSymptom(answers, "Entumecimiento");
  const thumb = hasAnyLocation(answers, "Lado del pulgar") || hasAnyLocation(answers, "Base del pulgar");
  const ulnar = hasAnyLocation(answers, "Lado del meñique");
  const clicking =
    hasSymptom(answers, "Chasquidos") ||
    hasSymptom(answers, "Bloqueo") ||
    hasSymptom(answers, "Sensación de que algo se mueve dentro");
  const weakness = hasSymptom(answers, "Debilidad");

  if (fall) sections.push("fall");
  if (weights) sections.push("weights");
  if (repetitive) sections.push("repetitive");
  if (neuro) sections.push("neuro");
  if (thumb) sections.push("thumb_side");
  if (ulnar) sections.push("ulnar_side");
  if (clicking) sections.push("clicking_locking");
  if (weakness) sections.push("weakness");

  return sections;
}

function isAnswered(q: WristQuestionDef, answers: WristAdaptiveAnswers): boolean {
  const v = answers[q.id];
  if (q.type === "slider") return typeof v === "number";
  if (q.type === "multi" || q.type === "wrist_map") return Array.isArray(v) && v.length > 0;
  return typeof v === "string" ? v.trim().length > 0 : false;
}

export function validateWristSection(section: WristQuestionSection, answers: WristAdaptiveAnswers): AdaptiveValidationIssue | null {
  const questions = getVisibleWristQuestions(answers).filter((q) => q.section === section);
  for (const q of questions) {
    if (q.required && !isAnswered(q, answers)) {
      return missingQuestionIssue(q);
    }
  }
  return null;
}

export function validateWristAdaptive(answers: WristAdaptiveAnswers): AdaptiveValidationIssue | null {
  const sections = getVisibleWristSections(answers);
  for (const s of sections) {
    const err = validateWristSection(s, answers);
    if (err) return err;
  }
  return null;
}

function fmtList(items: string[]): string {
  return items.length ? items.join(", ") : "—";
}

export function formatWristAdaptive(answers: WristAdaptiveAnswers, introText?: string): string {
  const { urgent, triggered } = detectWristRedFlags(answers);
  const header = "Cuestionario adaptativo — Muñeca/mano";
  const redFlagLine = urgent
    ? `Banderas rojas: **SÍ** (${triggered.join(", ")})`
    : "Banderas rojas: No detectadas";

  const mechanismBlock = [
    "— MECANISMO DE LA LESIÓN (prioridad máxima — citar exactamente en el resumen) —",
    `Origen según cuestionario: ${answers.inicio || "—"}`,
    `Actividad cuando empezó o empeoró: ${answers.actividad_tipo || "—"} — ${answers.actividad_detalle || "—"}`,
    "NO sustituir por el deporte habitual del perfil del paciente.",
  ].join("\n");

  const core = [
    `Inicio: ${answers.inicio}`,
    `Cuándo empezó: ${answers.comienzo}`,
    `Dolor actual: ${answers.intensidad_dolor}/10`,
    `Localización: ${fmtList(answers.localizacion_muneca)}`,
    `Dolor familiar: ${answers.dolor_familiar || "—"}`,
    `Calidad: ${fmtList(answers.calidad_dolor)}`,
    `Empeora con: ${fmtList(answers.movimientos_agravantes)}`,
    `Limitación: ${answers.limitacion_funcional.join(", ") || "—"}`,
    `Síntomas: ${fmtList(answers.sintomas_asociados)}`,
    `Irradiación: ${answers.irradiacion || "—"}`,
    `Episodios previos: ${answers.episodio_previo || "—"}`,
    `Actividad: ${answers.actividad_tipo || "—"} — ${answers.actividad_detalle || "—"}`,
  ].join("\n");

  const fall =
    answers.inicio === "Tras una caída" || answers.inicio === "Al apoyarme con la mano"
      ? [
          "",
          "Detalles caída:",
          `- Mano extendida: ${answers.caida_mano_extendida || "—"}`,
          `- Posición muñeca: ${answers.caida_posicion_muneca || "—"}`,
          `- Crack/pop: ${answers.caida_crack_pop || "—"}`,
          `- Pudo usar: ${answers.caida_pudo_usar || "—"}`,
          `- Hinchazón inmediata: ${answers.caida_hinchazon_inmediata || "—"}`,
          answers.caida_dolor_tabaquera
            ? `- Dolor en tabaquera anatómica: ${answers.caida_dolor_tabaquera}${answers.caida_dolor_tabaquera === "Sí" ? " ⚠️ RIESGO DE FRACTURA DE ESCAFOIDES — priorizar valoración/imagen" : ""}`
            : "",
        ].join("\n")
      : "";

  const weights =
    answers.inicio === "Tras levantar pesas" || answers.actividad_tipo === "Pesas / gimnasio"
      ? [
          "",
          "Detalles pesas:",
          `- Ejercicio: ${answers.pesas_ejercicio || "—"}`,
          `- Peso aprox.: ${answers.pesas_peso || "—"}`,
          `- Momento: ${answers.pesas_momento || "—"}`,
          `- Pop: ${answers.pesas_pop || "—"}`,
        ].join("\n")
      : "";

  const repetitive =
    answers.inicio === "Tras movimientos repetitivos"
      ? [
          "",
          "Movimientos repetitivos:",
          `- Actividad: ${answers.repetitivo_actividad || "—"}`,
          `- Horas/día: ${answers.repetitivo_horas_dia || "—"}`,
          `- Empeora progresivamente: ${answers.repetitivo_empeora || "—"}`,
        ].join("\n")
      : "";

  const neuro =
    hasSymptom(answers, "Hormigueo") || hasSymptom(answers, "Entumecimiento")
      ? [
          "",
          "Neurológico:",
          `- Dedos: ${fmtList(answers.num_dedos)}`,
          `- Constante: ${answers.num_constante || "—"}`,
          `- Peor noche: ${answers.num_noche || "—"}`,
          `- Sacudir mejora: ${answers.num_sacudir_mejora || "—"}`,
          answers.num_durkan ? `- Presión palma (Durkan): ${answers.num_durkan}` : "",
        ].join("\n")
      : "";

  const thumb =
    hasAnyLocation(answers, "Lado del pulgar") || hasAnyLocation(answers, "Base del pulgar")
      ? [
          "",
          "Lado pulgar:",
          `- Pinza/agarre agrava: ${answers.pulgar_pinza_agrava || "—"}`,
          `- Cargar agrava: ${answers.pulgar_cargar_agrava || "—"}`,
          `- Mover pulgar reproduce: ${answers.pulgar_mover_reproduce || "—"}`,
          answers.pulgar_what ? `- Dolor al doblar muñeca + apartar pulgar (WHAT): ${answers.pulgar_what}` : "",
          `- Rigidez/crujido matutino: ${answers.pulgar_rigidez_matutina || "—"}`,
        ].join("\n")
      : "";

  const ulnar = hasAnyLocation(answers, "Lado del meñique")
    ? [
        "",
        "Lado meñique:",
        `- Torsión agrava: ${answers.menique_torsion_agrava || "—"}`,
        `- Empujar silla agrava: ${answers.menique_empujar_silla_agrava || "—"}`,
        `- Click/inestabilidad: ${answers.menique_click_inestabilidad || "—"}`,
        answers.menique_fovea ? `- Dolor al presionar el huequito palmar-cubital (fóvea): ${answers.menique_fovea}` : "",
      ].join("\n")
    : "";

  const clicking =
    hasSymptom(answers, "Chasquidos") ||
    hasSymptom(answers, "Bloqueo") ||
    hasSymptom(answers, "Sensación de que algo se mueve dentro")
      ? [
          "",
          "Chasquidos/bloqueo:",
          `- Se atasca: ${answers.bloqueo_atasca || "—"}`,
          `- Click doloroso: ${answers.click_duele || "—"}`,
          `- Siente desplaza: ${answers.click_siente_desplaza || "—"}`,
        ].join("\n")
      : "";

  const weakness = hasSymptom(answers, "Debilidad")
    ? [
        "",
        "Debilidad:",
        `- Por dolor: ${answers.debilidad_por_dolor || "—"}`,
        `- Agarre más débil: ${answers.debilidad_agarre || "—"}`,
        `- Se caen objetos: ${answers.debilidad_se_caen_objetos || "—"}`,
      ].join("\n")
    : "";

  const differentialHint = [
    "",
    "ORIENTACIÓN DIFERENCIAL (usar el cuestionario; no inventar datos):",
    "- Dolor en lado del pulgar/base del pulgar + empeora al pinzar o al doblar la muñeca y apartar el pulgar → tenosinovitis de De Quervain (cluster; no confirma).",
    "- Hormigueo/entumecimiento en pulgar-índice-medio + peor por la noche + sacudir la mano mejora ± presión en la palma reproduce el hormigueo → síndrome del túnel carpiano (cluster; Durkan/Phalen no confirman).",
    "- Bulto o protuberancia visible, blando, en cara dorsal o palmar → ganglión (quiste sinovial).",
    "- Caída con la mano extendida + dolor en la tabaquera anatómica → riesgo de fractura de escafoides (priorizar imagen).",
    "- Dolor en cara cubital (lado del meñique) + empeora al girar el antebrazo o cargar peso ± dolor al presionar el huequito palmar junto al meñique → lesión del complejo fibrocartilaginoso triangular (TFCC).",
    "- Dolor cubital dorsal + empeora al girar/rotar la muñeca → tendinopatía o subluxación del extensor cubital del carpo (ECU).",
    "- Dolor y rigidez matutina en la base del pulgar, progresivo, en paciente de mayor edad → rizartrosis (artrosis trapeciometacarpiana).",
    "- Caída sobre la mano extendida + deformidad evidente + edad avanzada → fractura de Colles / Smith.",
    "- Chasquido o sensación de desplazamiento en el dorso de la muñeca tras torsión o caída → inestabilidad escafolunar.",
  ].join("\n");

  const intro = introText ? `Descripción inicial del paciente:\n${introText}\n\n` : "";
  return [intro + header, redFlagLine, "", mechanismBlock, "", core, fall, weights, repetitive, neuro, thumb, ulnar, clicking, weakness, differentialHint]
    .filter(Boolean)
    .join("\n");
}


export const WRIST_LABEL_EN: Partial<Record<string, string>> = {
  rf_deformidad: "Obvious deformity after the injury?",
  rf_no_movimiento: "Can't you move the wrist?",
  rf_inflamacion_severa: "Severe swelling immediately after the blow/fall?",
  rf_herida_abierta: "Open wound?",
  rf_fiebre: "Fever?",
  rf_dedos_frios: "Pale/blue/cold fingers?",
  rf_perdida_fuerza: "Sudden loss of strength?",
  rf_perdida_sensibilidad: "Marked loss of sensation?",
  localizacion_muneca: "1. Where does it hurt? (you can select several areas)",
  dolor_familiar:
    "2. Is it the same pain you notice when gripping, using the thumb, bending the wrist, or waking with tingling?",
  inicio: "3. How did the problem start?",
  comienzo: "4. When did it begin?",
  intensidad_dolor: "5. Current pain intensity",
  calidad_dolor: "6. What is the pain like?",
  movimientos_agravantes: "7. Which movements make it worse? (you can select several)",
  limitacion_funcional: "8. Functional limitation",
  sintomas_asociados: "8. Do you notice anything else?",
  irradiacion: "9. Does the pain spread to another area?",
  episodio_previo: "10. Has this happened before?",
  actividad_tipo: "11. What activity were you doing when it started or worsened?",
  actividad_detalle: "12. Describe the activity",
  caida_mano_extendida: "Did you land with the hand outstretched?",
  caida_posicion_muneca: "Was the wrist flexed or extended?",
  caida_crack_pop: "Did you hear a crack or pop?",
  caida_pudo_usar: "Could you keep using the hand?",
  caida_hinchazon_inmediata: "Did the swelling appear immediately?",
  caida_dolor_tabaquera: "Does it hurt when pressing the hollow at the base of the thumb, between the tendons (anatomical snuffbox)?",
  pesas_ejercicio: "Which exercise were you doing?",
  pesas_peso: "Approximate weight (if you remember)",
  pesas_momento: "During the lift or afterwards?",
  pesas_pop: "Did you notice a pop?",
  repetitivo_actividad: "Which activity were you repeating?",
  repetitivo_horas_dia: "About how many hours a day?",
  repetitivo_empeora: "Has it been getting progressively worse?",
  num_dedos: "Which fingers are affected?",
  num_constante: "Is it constant or intermittent?",
  num_noche: "Is it worse at night?",
  num_sacudir_mejora: "Does shaking the hand improve the symptoms?",
  num_durkan: "If you press the centre of the palm (near the wrist) for a few seconds, does the same tingling appear in the thumb, index or middle finger?",
  pulgar_pinza_agrava: "Does pinching or gripping make it worse?",
  pulgar_cargar_agrava: "Does carrying weight (children/bags) make it worse?",
  pulgar_mover_reproduce: "Does moving the thumb reproduce the pain?",
  pulgar_what: "Does the thumb-side of the wrist hurt if you bend the wrist toward the palm and move the thumb out to the side?",
  pulgar_rigidez_matutina: "Do you notice stiffness or crunching when moving the thumb, especially in the morning?",
  menique_torsion_agrava: "Does twisting/turning the wrist make it worse?",
  menique_empujar_silla_agrava: "Does pushing up from a chair/floor make it worse?",
  menique_click_inestabilidad: "Do you notice clicking or instability in that area?",
  menique_fovea: "Does it hurt when pressing the little hollow on the palm next to the pinky bone (just below the wrist, little-finger side)?",
  bloqueo_atasca: "Does the wrist or a movement get stuck?",
  click_duele: "Is the click painful?",
  click_siente_desplaza: "Do you feel something shifting inside?",
  debilidad_por_dolor: "Does the weakness seem to be due to pain?",
  debilidad_agarre: "Is your grip weaker than usual?",
  debilidad_se_caen_objetos: "Do objects fall from your hand?",
};

export const WRIST_OPTION_EN: Record<string, string> = {
  No: "No",
  Sí: "Yes",
  "No estoy seguro": "I'm not sure",
  "No, es distinto o solo duele en ciertos gestos": "No, it's different or only hurts with certain movements",
  "No, es otra molestia": "No, it's a different problem",
  "Sí, es el mismo": "Yes, it's the same",
  "Empezó poco a poco, sin causa clara": "Gradual onset with no clear cause",
  "Tras entrenamiento": "After training",
  "Tras levantar pesas": "After lifting weights",
  "Tras movimientos repetitivos": "After repetitive movements",
  "Tras una caída": "After a fall",
  "Tras un golpe directo": "After a direct blow",
  "Tras torcer la muñeca": "After twisting the wrist",
  "Al apoyarme con la mano": "When bracing myself with the hand",
  "Apoyo repetido de peso (flexiones, plancha, pesas con muñeca estirada hacia atrás)": "Repeated weight-bearing (push-ups, planks, weights with the wrist extended)",
  "No lo sé": "I don't know",
  "Ha sido ahora": "Just now",
  "Reciente (1-4 horas)": "Recent (1–4 hours)",
  Hoy: "Today",
  "Hace 2–7 días": "2–7 days ago",
  "Hace 1–4 semanas": "1–4 weeks ago",
  "Hace más de un mes": "More than a month ago",
  "Hace varios meses": "Several months ago",
  "De repente": "Suddenly",
  Progresivamente: "Gradually",
  "Va y viene": "Comes and goes",
  "Lado del pulgar": "Thumb side",
  "Lado del meñique": "Little-finger side",
  "Palma de la mano (parte de dentro)": "Palm side (inside)",
  "Dorso de la mano (parte de atrás)": "Back of the hand (dorsal)",
  "Centro de la muñeca": "Center of the wrist",
  "Toda la muñeca": "Whole wrist",
  "Base del pulgar": "Base of the thumb",
  "Hacia la mano": "Toward the hand",
  Punzante: "Sharp",
  "Dolor sordo": "Dull ache",
  Quemazón: "Burning",
  Tirantez: "Tightness",
  Tirón: "Pulling",
  "Descarga eléctrica": "Electric shock",
  Palpitante: "Throbbing",
  "Punzadas / pinchazos": "Stabbing / pinching",
  "Doblar la muñeca hacia delante": "Flexing the wrist (forward)",
  "Estirar la muñeca hacia atrás": "Extending the wrist (backward)",
  "Mover la muñeca de lado a lado": "Moving the wrist side to side",
  "Rotar el antebrazo": "Rotating the forearm",
  "Agarrar objetos": "Gripping objects",
  "Pinzar con el pulgar": "Pinching with the thumb",
  "Levantar objetos": "Lifting objects",
  "Empujarme para levantarme (silla/suelo)": "Pushing up from a chair/floor",
  Teclear: "Typing",
  Escribir: "Writing",
  "Girar / retorcer (abrir tarros, llaves)": "Twisting (opening jars, keys)",
  Ninguno: "None",
  "Solo al mover": "Only when moving",
  "Con agarre o al levantar": "With grip or lifting",
  "En reposo": "At rest",
  "Por la noche": "At night",
  Constantemente: "Constantly",
  "Sin limitación": "No limitation",
  "Molestia leve": "Mild discomfort",
  "No puedo entrenar": "I can't train",
  "Dificultad para agarrar objetos": "Difficulty gripping objects",
  "Dificultad para escribir": "Difficulty writing",
  "Dificultad para abrir tarros o botellas": "Difficulty opening jars or bottles",
  "Dificultad para cargar objetos": "Difficulty carrying objects",
  "No puedo usar la mano con normalidad": "I can't use the hand normally",
  Hinchazón: "Swelling",
  Moretón: "Bruising",
  Chasquidos: "Clicking",
  Bloqueo: "Locking",
  Debilidad: "Weakness",
  Rigidez: "Stiffness",
  Hormigueo: "Tingling",
  Entumecimiento: "Numbness",
  "Sensación de que algo se mueve dentro": "Feeling that something moves inside",
  "Bulto o protuberancia visible": "Visible lump or bump",
  "Hacia el pulgar": "Toward the thumb",
  "Hacia los dedos": "Toward the fingers",
  "Hacia el antebrazo": "Toward the forearm",
  "Hacia el codo": "Toward the elbow",
  Nunca: "Never",
  "Una vez": "Once",
  "Varias veces": "Several times",
  Reposo: "Rest",
  Hielo: "Ice",
  Calor: "Heat",
  Antiinflamatorios: "Anti-inflammatories",
  "Muñequera / férula": "Wrist brace / splint",
  Movimiento: "Movement",
  Nada: "Nothing",
  Fisioterapia: "Physiotherapy",
  Radiografía: "X-ray",
  Ecografía: "Ultrasound",
  "Resonancia (RM)": "MRI",
  TAC: "CT scan",
  Infiltración: "Injection",
  Cirugía: "Surgery",
  "Hacia atrás (estirada)": "Backward (extended)",
  "Hacia delante (doblada)": "Forward (flexed)",
  "Durante el levantamiento": "During the lift",
  Después: "Afterwards",
  "Horas más tarde / al día siguiente": "Hours later / the next day",
  Pulgar: "Thumb",
  Índice: "Index",
  Medio: "Middle",
  Anular: "Ring",
  Meñique: "Little finger",
  "Pesas / gimnasio": "Weights / gym",
  Deporte: "Sport",
  Escalada: "Climbing",
  "Trabajo de oficina (teclado/ratón)": "Office work (keyboard/mouse)",
  Otra: "Other",
  Parcialmente: "Partially",
  Constante: "Constant",
  Intermitente: "Intermittent",
};

export const WRIST_SECTION_LABELS_EN: Record<string, string> = {
  red_flags: "Red flags",
  core: "Main questionnaire",
  fall: "Fall details",
  weights: "Weightlifting details",
  repetitive: "Repetitive movements",
  neuro: "Tingling / numbness",
  thumb_side: "Thumb-side pain",
  ulnar_side: "Little-finger-side pain",
  clicking_locking: "Clicking / locking",
  weakness: "Weakness",
};

export type ConsultLocale = "es" | "en";
export function localizeWristLabel(id: string, fallback: string, locale: ConsultLocale): string {
  if (locale !== "en") return fallback;
  return WRIST_LABEL_EN[id] ?? fallback;
}
export function localizeWristOption(option: string, locale: ConsultLocale): string {
  if (locale !== "en") return option;
  return WRIST_OPTION_EN[option] ?? option;
}
export function localizeWristSection(section: string, locale: ConsultLocale): string {
  if (locale !== "en") return (WRIST_SECTION_LABELS as any)[section] ?? section;
  return WRIST_SECTION_LABELS_EN[section] ?? (WRIST_SECTION_LABELS as any)[section] ?? section;
}

