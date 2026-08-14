import { missingQuestionIssue, type AdaptiveValidationIssue } from "@/lib/consulta-validation";
import {
  filterSleepDependentOptions,
  shouldShowSleepDependentQuestion,
} from "@/lib/consulta-timing";
export const YES_NO = ["No", "Sí"] as const;

export const EVOLUTION_OPTIONS = [
  "Ha sido ahora",
  "Reciente (1-4 horas)",
  "Menos de 48 horas",
  "Entre 2 y 7 días",
  "Entre 1 y 4 semanas",
  "Más de 1 mes",
] as const;

export const ONSET_FORM_OPTIONS = [
  "Repentino",
  "Poco a poco",
  "Va y viene",
] as const;

export const MECHANISM_OPTIONS = [
  "Empezó poco a poco, sin causa clara",
  "Tras entrenamiento o ejercicio",
  "Tras levantar pesas",
  "Tras lanzar",
  "Tras una caída",
  "Tras golpe directo",
  "Tras torcer / movimiento brusco",
  "No lo sé",
] as const;

export const ELBOW_LOCATION_OPTIONS = [
  "Parte externa del codo",
  "Parte interna del codo",
  "Parte posterior del codo",
  "Parte anterior del codo",
  "Profundo en la articulación",
  "Todo el codo",
  "No estoy seguro",
] as const;

export const PAIN_TYPE_OPTIONS = [
  "Punzante",
  "Dolor sordo",
  "Quemazón",
  "Tirantez o tirón",
  "Descarga eléctrica",
  "Latido o punzadas",
] as const;

export const AGGRAVATING_MOVEMENT_OPTIONS = [
  "Doblar el codo",
  "Estirar el codo",
  "Rotar el antebrazo",
  "Girar un pomo o llave",
  "Levantar objetos",
  "Agarrar objetos",
  "Empujar",
  "Tirar",
  "Lanzar",
  "Escribir o teclear",
  "Ninguno en particular",
] as const;

export const FUNCTIONAL_LIMIT_OPTIONS = [
  "Ninguna",
  "Molestia leve",
  "No puedo entrenar",
  "Dificultad para cargar objetos",
  "Dificultad para vestirme",
  "Me cuesta doblar o estirar del todo",
  "No puedo usar el brazo con normalidad",
] as const;

export const ASSOCIATED_SYMPTOM_OPTIONS = [
  "Inflamación / hinchazón",
  "Moretón",
  "Calor",
  "Chasquidos",
  "Bloqueo",
  "Debilidad",
  "Inestabilidad",
  "Hormigueo",
  "Entumecimiento",
  "Rigidez",
  "Ninguno",
] as const;

export const RADIATION_OPTIONS = [
  "No",
  "Hacia el hombro",
  "Hacia el antebrazo",
  "Hacia la mano",
  "Hacia dedos concretos",
  "Desde el cuello hacia el brazo/codo",
] as const;

export const PREVIOUS_EPISODE_OPTIONS = [
  "Nunca",
  "Una vez",
  "Varias veces",
] as const;

export const FALL_LANDING_OPTIONS = [
  "Sobre la mano",
  "Sobre el codo",
  "Con el brazo extendido",
  "De otra forma",
] as const;

export const FALL_ARM_USE_OPTIONS = [
  "Sí, pude seguir usándolo",
  "Parcialmente",
  "No, no pude usarlo",
] as const;

export const WEIGHTS_TIMING_OPTIONS = [
  "Durante el levantamiento",
  "Justo después",
  "Al día siguiente",
] as const;

export const THROWING_PHASE_OPTIONS = [
  "Durante la aceleración",
  "Al terminar el lanzamiento (fase final)",
  "En ambas fases",
] as const;

export const TINGLING_FINGER_OPTIONS = [
  "Pulgar",
  "Índice",
  "Medio",
  "Anular",
  "Meñique",
] as const;

export const ROM_LIMIT_CAUSE_OPTIONS = [
  "Por dolor",
  "Porque se traba / no deja pasar",
  "Por falta de fuerza",
] as const;

export const INSTABILITY_PREVIOUS_OPTIONS = ["Una vez", "Varias veces"] as const;

export type ElbowAdaptiveAnswers = {
  // Red flags
  rf_deformidad: string;
  rf_no_movimiento: string;
  rf_inflamacion_severa: string;
  rf_fiebre: string;
  rf_herida_abierta: string;
  rf_perdida_fuerza: string;
  rf_perdida_sensibilidad: string;
  rf_dedos_frios: string;
  // Core
  evolucion: string;
  inicio: string;
  mecanismo: string;
  intensidad_dolor: number;
  localizacion_codo: string[];
  dolor_familiar: string;
  tipo_dolor: string[];
  movimientos_agravantes: string[];
  limitacion_funcional: string[];
  sintomas_asociados: string[];
  irradiacion: string;
  irradiacion_detalle: string;
  cuello_sintomas: string;
  cuello_empeora_brazo: string;
  // Fall branch
  caida_como: string;
  caida_chasquido: string;
  caida_uso_brazo: string;
  // Weights branch
  pesas_ejercicio: string;
  pesas_peso: string;
  pesas_momento: string;
  pesas_pop: string;
  pesas_deformidad_biceps: string;
  // Throwing branch
  lanzar_fase: string;
  lanzar_velocidad: string;
  lanzar_inestabilidad: string;
  // Training branch
  entreno_ejercicio: string;
  entreno_momento: string;
  // Tingling branch
  hormigueo_dedos: string[];
  hormigueo_constante: string;
  hormigueo_flexion: string;
  // Locking branch
  bloqueo_atascado: string;
  bloqueo_desbloqueo: string;
  bloqueo_chasquido: string;
  // Instability branch
  inestabilidad_cede: string;
  inestabilidad_antes: string;
  inestabilidad_posicion: string;
  // ROM branch
  rom_limit_causa: string;
  // Self-test branch
  test_extension_muneca: string;
  test_flexion_muneca: string;
  // History
  episodios_previos: string;
  episodios_previos_detalle: string;
};

export function defaultElbowAdaptiveAnswers(): ElbowAdaptiveAnswers {
  return {
    rf_deformidad: "",
    rf_no_movimiento: "",
    rf_inflamacion_severa: "",
    rf_fiebre: "",
    rf_herida_abierta: "",
    rf_perdida_fuerza: "",
    rf_perdida_sensibilidad: "",
    rf_dedos_frios: "",
    evolucion: "",
    inicio: "",
    mecanismo: "",
    intensidad_dolor: 5,
    localizacion_codo: [],
    dolor_familiar: "",
    tipo_dolor: [],
    movimientos_agravantes: [],
    limitacion_funcional: [],
    sintomas_asociados: [],
    irradiacion: "",
    irradiacion_detalle: "",
    cuello_sintomas: "",
    cuello_empeora_brazo: "",
    caida_como: "",
    caida_chasquido: "",
    caida_uso_brazo: "",
    pesas_ejercicio: "",
    pesas_peso: "",
    pesas_momento: "",
    pesas_pop: "",
    pesas_deformidad_biceps: "",
    lanzar_fase: "",
    lanzar_velocidad: "",
    lanzar_inestabilidad: "",
    entreno_ejercicio: "",
    entreno_momento: "",
    hormigueo_dedos: [],
    hormigueo_constante: "",
    hormigueo_flexion: "",
    bloqueo_atascado: "",
    bloqueo_desbloqueo: "",
    bloqueo_chasquido: "",
    inestabilidad_cede: "",
    inestabilidad_antes: "",
    inestabilidad_posicion: "",
    rom_limit_causa: "",
    test_extension_muneca: "",
    test_flexion_muneca: "",
    episodios_previos: "",
    episodios_previos_detalle: "",
  };
}

/** Prefill elbow answers from the patient's free-text complaint. */
export function withElbowHintsFromText(text: string): ElbowAdaptiveAnswers {
  const base = defaultElbowAdaptiveAnswers();
  const t = text.trim();
  if (!t) return base;

  const movimientos: string[] = [];
  const localizacion: string[] = [];
  const sintomas: string[] = [];
  let inicio = "";
  let evolucion = "";
  let mecanismo = "";
  let irradiacion = "";

  if (/ahora mismo|acaba de|justo ahora|ha sido ahora|just\s+now/i.test(t)) {
    evolucion = "Ha sido ahora";
  } else if (/hace\s*(unas?\s*)?(pocas\s+)?horas|1-4\s*h|reciente/i.test(t)) {
    evolucion = "Reciente (1-4 horas)";
  } else if (/ayer|menos de (dos|2)\s*d[ií]as|48\s*h/i.test(t)) {
    evolucion = "Menos de 48 horas";
  } else if (/hace\s*(\d+|varios|unas)\s*d[ií]as|esta semana/i.test(t)) {
    evolucion = "Entre 2 y 7 días";
  } else if (/semana|semanas/i.test(t) && !/mes/i.test(t)) {
    evolucion = "Entre 1 y 4 semanas";
  } else if (/mes|meses|cr[oó]nic/i.test(t)) {
    evolucion = "Más de 1 mes";
  }

  if (/de\s+golpe|repentin|s[uú]bit|chasquido|crack|pop\b/i.test(t)) {
    inicio = "Repentino";
  } else if (/poco a poco|progresiv|gradual|fue apareciendo/i.test(t)) {
    inicio = "Poco a poco";
  } else if (/va y viene|intermitente/i.test(t)) {
    inicio = "Va y viene";
  }

  if (/pesas|curl|press|gimnasio|gym/i.test(t)) mecanismo = "Tras levantar pesas";
  else if (/lanzar|throw|pitch/i.test(t)) mecanismo = "Tras lanzar";
  else if (/ca[ií]da|caer|fall/i.test(t)) mecanismo = "Tras una caída";
  else if (/golpe|trauma|blow/i.test(t)) mecanismo = "Tras golpe directo";
  else if (/torcer|brusco|twist/i.test(t)) mecanismo = "Tras torcer / movimiento brusco";
  else if (/entrenamiento|ejercicio|tenis|p[aá]del|golf/i.test(t)) {
    mecanismo = "Tras entrenamiento o ejercicio";
  } else if (/progresiv|poco a poco|sin causa/i.test(t)) {
    mecanismo = "Empezó poco a poco, sin causa clara";
  }

  if (/flexionar|doblar|bend/i.test(t)) movimientos.push("Doblar el codo");
  if (/estirar|extender|straighten/i.test(t)) movimientos.push("Estirar el codo");
  if (/rotar|girar|antebrazo|pronaci|supinaci/i.test(t)) {
    movimientos.push("Rotar el antebrazo");
  }
  if (/pomo|llave|door|jar/i.test(t)) movimientos.push("Girar un pomo o llave");
  if (/agarrar|grip|coger/i.test(t)) movimientos.push("Agarrar objetos");
  if (/levantar|peso|cargar/i.test(t)) movimientos.push("Levantar objetos");
  if (/empujar|push/i.test(t)) movimientos.push("Empujar");
  if (/tirar|pull/i.test(t)) movimientos.push("Tirar");
  if (/lanzar|throw/i.test(t)) movimientos.push("Lanzar");
  if (/escribir|teclear|typing|mouse/i.test(t)) {
    movimientos.push("Escribir o teclear");
  }

  if (/extern|lateral|tenista|tennis\s*elbow/i.test(t)) {
    localizacion.push("Parte externa del codo");
  }
  if (/intern|medial|golfista|golfer/i.test(t)) {
    localizacion.push("Parte interna del codo");
  }
  if (/detr[aá]s|posterior|olecranon/i.test(t)) {
    localizacion.push("Parte posterior del codo");
  }
  if (/delante|anterior|b[ií]ceps/i.test(t)) {
    localizacion.push("Parte anterior del codo");
  }
  if (/antebrazo|forearm/i.test(t) && localizacion.length === 0) {
    localizacion.push("Parte anterior del codo");
  }

  if (/hormigueo|entumec/i.test(t)) {
    sintomas.push("Hormigueo");
    sintomas.push("Entumecimiento");
    irradiacion = "Hacia la mano";
  }
  if (/hinchaz|inflam/i.test(t)) sintomas.push("Inflamación / hinchazón");
  if (/moret[oó]n|hematoma|bruise/i.test(t)) sintomas.push("Moretón");
  if (/chasquido|crujido/i.test(t)) sintomas.push("Chasquidos");
  if (/debilidad|flojo/i.test(t)) sintomas.push("Debilidad");
  if (/bloqueo|traba/i.test(t)) sintomas.push("Bloqueo");
  if (/inestabil/i.test(t)) sintomas.push("Inestabilidad");
  if (/rigidez/i.test(t)) sintomas.push("Rigidez");

  return {
    ...base,
    ...(evolucion ? { evolucion } : {}),
    ...(inicio ? { inicio } : {}),
    ...(mecanismo ? { mecanismo } : {}),
    movimientos_agravantes: [...new Set(movimientos)],
    localizacion_codo: [...new Set(localizacion)],
    sintomas_asociados: [...new Set(sintomas.filter((s) => s))],
    ...(irradiacion ? { irradiacion } : {}),
  };
}

export type ElbowQuestionSection =
  | "red_flags"
  | "core"
  | "fall"
  | "weights"
  | "throwing"
  | "training"
  | "tingling"
  | "locking"
  | "instability"
  | "rom_limit"
  | "self_tests"
  | "history";

export type ElbowQuestionDef = {
  id: keyof ElbowAdaptiveAnswers;
  section: ElbowQuestionSection;
  label: string;
  type: "single" | "multi" | "text" | "slider";
  options?: readonly string[];
  required?: boolean;
  showIf?: (a: ElbowAdaptiveAnswers) => boolean;
};

function hasSymptom(a: ElbowAdaptiveAnswers, name: string): boolean {
  return a.sintomas_asociados.includes(name);
}

function hasTingling(a: ElbowAdaptiveAnswers): boolean {
  return (
    hasSymptom(a, "Hormigueo") ||
    hasSymptom(a, "Entumecimiento") ||
    a.tipo_dolor.includes("Descarga eléctrica")
  );
}

function hasRomLimit(a: ElbowAdaptiveAnswers): boolean {
  return a.limitacion_funcional.includes("Me cuesta doblar o estirar del todo");
}

function hasLateralElbowPain(a: ElbowAdaptiveAnswers): boolean {
  return a.localizacion_codo.includes("Parte externa del codo");
}

function hasMedialElbowPain(a: ElbowAdaptiveAnswers): boolean {
  return a.localizacion_codo.includes("Parte interna del codo");
}

export const ELBOW_QUESTIONS: ElbowQuestionDef[] = [

  // Timing first (hide sleep/night questions if injury is hours-old)
  { id: "evolucion", section: "red_flags", label: "¿Cuándo comenzó el problema?", type: "single", options: EVOLUTION_OPTIONS, required: true },
  // Red flags
  { id: "rf_deformidad", section: "red_flags", label: "¿Tras la lesión, se ve torcido, deformado o muy distinto de lo normal?", type: "single", options: YES_NO, required: true },
  { id: "rf_no_movimiento", section: "red_flags", label: "¿No puedes mover el codo en absoluto?", type: "single", options: YES_NO, required: true },
  { id: "rf_inflamacion_severa", section: "red_flags", label: "¿Hinchazón fuerte justo después de un golpe o caída?", type: "single", options: YES_NO, required: true },
  { id: "rf_fiebre", section: "red_flags", label: "¿Tienes fiebre junto con el dolor?", type: "single", options: YES_NO, required: true },
  { id: "rf_herida_abierta", section: "red_flags", label: "¿Hay herida abierta en la zona?", type: "single", options: YES_NO, required: true },
  { id: "rf_perdida_fuerza", section: "red_flags", label: "¿Pérdida súbita de fuerza en el brazo?", type: "single", options: YES_NO, required: true },
  { id: "rf_perdida_sensibilidad", section: "red_flags", label: "¿Pérdida de sensibilidad (entumecimiento marcado)?", type: "single", options: YES_NO, required: true },
  { id: "rf_dedos_frios", section: "red_flags", label: "¿Dedos fríos, pálidos o azulados tras la lesión?", type: "single", options: YES_NO, required: true },

  // Core — location + familiar pain before mechanism
  { id: "localizacion_codo", section: "core", label: "¿Dónde sientes el dolor en el codo? (puedes marcar varias)", type: "multi", options: ELBOW_LOCATION_OPTIONS, required: true },
  {
    id: "dolor_familiar",
    section: "core",
    label: "¿Es el mismo dolor que notas al agarrar, usar el ratón, girar un pomo o al despertar con hormigueo?",
    type: "single",
    options: ["Sí, es el mismo", "No, es otra molestia", "No estoy seguro"],
    required: true,
  },
  { id: "inicio", section: "core", label: "¿Cómo apareció el dolor?", type: "single", options: ONSET_FORM_OPTIONS, required: true },
  { id: "mecanismo", section: "core", label: "¿Cómo empezó el problema?", type: "single", options: MECHANISM_OPTIONS, required: true },
  { id: "intensidad_dolor", section: "core", label: "Intensidad actual del dolor (1–10)", type: "slider", required: true },
  { id: "tipo_dolor", section: "core", label: "¿Cómo describirías el dolor?", type: "multi", options: PAIN_TYPE_OPTIONS, required: true },
  { id: "movimientos_agravantes", section: "core", label: "¿Qué movimientos lo empeoran? (puedes marcar varias)", type: "multi", options: AGGRAVATING_MOVEMENT_OPTIONS, required: true },
  { id: "limitacion_funcional", section: "core", label: "¿Cuánto te limita en tu día a día? (puedes marcar varias)", type: "multi", options: FUNCTIONAL_LIMIT_OPTIONS, required: true },
  { id: "sintomas_asociados", section: "core", label: "¿Qué otros síntomas notas?", type: "multi", options: ASSOCIATED_SYMPTOM_OPTIONS, required: true },
  { id: "irradiacion", section: "core", label: "¿El dolor se extiende a otra zona?", type: "single", options: RADIATION_OPTIONS, required: true },
  { id: "irradiacion_detalle", section: "core", label: "¿Hasta dónde llega o qué dedos afecta?", type: "text", required: true, showIf: (a) => a.irradiacion === "Hacia dedos concretos" },
  { id: "cuello_sintomas", section: "core", label: "¿También notas dolor, rigidez u hormigueo en el cuello?", type: "single", options: YES_NO, required: true },
  {
    id: "cuello_empeora_brazo",
    section: "core",
    label: "¿Al girar o inclinar la cabeza te empeora el dolor del codo o el hormigueo del brazo?",
    type: "single",
    options: YES_NO,
    required: true,
    showIf: (a) =>
      a.cuello_sintomas === "Sí" ||
      a.irradiacion === "Desde el cuello hacia el brazo/codo" ||
      hasTingling(a),
  },

  // Fall
  { id: "caida_como", section: "fall", label: "¿Cómo caíste?", type: "single", options: FALL_LANDING_OPTIONS, required: true, showIf: (a) => a.mecanismo === "Tras una caída" },
  { id: "caida_chasquido", section: "fall", label: "¿Escuchaste un crujido o chasquido?", type: "single", options: YES_NO, required: true, showIf: (a) => a.mecanismo === "Tras una caída" },
  { id: "caida_uso_brazo", section: "fall", label: "¿Pudiste seguir usando el brazo después?", type: "single", options: FALL_ARM_USE_OPTIONS, required: true, showIf: (a) => a.mecanismo === "Tras una caída" },

  // Weights
  { id: "pesas_ejercicio", section: "weights", label: "¿Qué ejercicio estabas haciendo?", type: "text", required: true, showIf: (a) => a.mecanismo === "Tras levantar pesas" },
  { id: "pesas_peso", section: "weights", label: "¿Peso aproximado?", type: "text", required: false, showIf: (a) => a.mecanismo === "Tras levantar pesas" },
  { id: "pesas_momento", section: "weights", label: "¿Cuándo apareció el dolor?", type: "single", options: WEIGHTS_TIMING_OPTIONS, required: true, showIf: (a) => a.mecanismo === "Tras levantar pesas" },
  { id: "pesas_pop", section: "weights", label: "¿Notaste un chasquido o pop?", type: "single", options: YES_NO, required: true, showIf: (a) => a.mecanismo === "Tras levantar pesas" },
  { id: "pesas_deformidad_biceps", section: "weights", label: "¿Notas un hueco o bulto en la parte delantera del brazo, como si el músculo se hubiera desplazado?", type: "single", options: YES_NO, required: true, showIf: (a) => a.mecanismo === "Tras levantar pesas" && a.pesas_pop === "Sí" },

  // Throwing
  { id: "lanzar_fase", section: "throwing", label: "¿En qué fase del lanzamiento apareció?", type: "single", options: THROWING_PHASE_OPTIONS, required: true, showIf: (a) => a.mecanismo === "Tras lanzar" },
  { id: "lanzar_velocidad", section: "throwing", label: "¿Disminuyó tu velocidad o fuerza al lanzar?", type: "single", options: YES_NO, required: true, showIf: (a) => a.mecanismo === "Tras lanzar" },
  { id: "lanzar_inestabilidad", section: "throwing", label: "¿Notaste inestabilidad al lanzar?", type: "single", options: YES_NO, required: true, showIf: (a) => a.mecanismo === "Tras lanzar" },

  // Training
  { id: "entreno_ejercicio", section: "training", label: "¿Qué ejercicio o actividad estabas realizando?", type: "text", required: true, showIf: (a) => a.mecanismo === "Tras entrenamiento o ejercicio" },
  { id: "entreno_momento", section: "training", label: "¿Cuándo apareció el dolor?", type: "single", options: WEIGHTS_TIMING_OPTIONS, required: true, showIf: (a) => a.mecanismo === "Tras entrenamiento o ejercicio" },

  // Tingling
  { id: "hormigueo_dedos", section: "tingling", label: "¿Qué dedos están afectados?", type: "multi", options: TINGLING_FINGER_OPTIONS, required: true, showIf: hasTingling },
  { id: "hormigueo_constante", section: "tingling", label: "¿El hormigueo es constante o intermitente?", type: "single", options: ["Constante", "Intermitente"], required: true, showIf: hasTingling },
  { id: "hormigueo_flexion", section: "tingling", label: "¿Empieza o empeora al doblar el codo?", type: "single", options: YES_NO, required: true, showIf: hasTingling },

  // Locking
  { id: "bloqueo_atascado", section: "locking", label: "¿El codo se queda atascado?", type: "single", options: YES_NO, required: true, showIf: (a) => hasSymptom(a, "Bloqueo") },
  { id: "bloqueo_desbloqueo", section: "locking", label: "¿Puedes desbloquearlo tú solo?", type: "single", options: YES_NO, required: true, showIf: (a) => hasSymptom(a, "Bloqueo") },
  { id: "bloqueo_chasquido", section: "locking", label: "¿Hace chasquido antes de desbloquearse?", type: "single", options: YES_NO, required: true, showIf: (a) => hasSymptom(a, "Bloqueo") },

  // Instability
  { id: "inestabilidad_cede", section: "instability", label: "¿Sientes que el codo cede o falla?", type: "single", options: YES_NO, required: true, showIf: (a) => hasSymptom(a, "Inestabilidad") },
  { id: "inestabilidad_antes", section: "instability", label: "¿Ha pasado antes?", type: "single", options: INSTABILITY_PREVIOUS_OPTIONS, required: true, showIf: (a) => hasSymptom(a, "Inestabilidad") },
  { id: "inestabilidad_posicion", section: "instability", label: "¿Ocurre al empujarte para levantarte de una silla o del suelo con la palma hacia arriba?", type: "single", options: YES_NO, required: true, showIf: (a) => hasSymptom(a, "Inestabilidad") },

  // ROM limit
  { id: "rom_limit_causa", section: "rom_limit", label: "¿Por qué no puedes doblar o estirar del todo?", type: "single", options: ROM_LIMIT_CAUSE_OPTIONS, required: true, showIf: hasRomLimit },

  // Self-tests (gated to lateral / medial location)
  { id: "test_extension_muneca", section: "self_tests", label: "¿Duele en la parte externa del codo al estirar la muñeca contra resistencia?", type: "single", options: YES_NO, required: true, showIf: hasLateralElbowPain },
  { id: "test_flexion_muneca", section: "self_tests", label: "¿Duele en la parte interna al doblar la muñeca contra resistencia?", type: "single", options: YES_NO, required: true, showIf: hasMedialElbowPain },

  // History
  { id: "episodios_previos", section: "history", label: "¿Has tenido este problema antes en el codo?", type: "single", options: PREVIOUS_EPISODE_OPTIONS, required: true },
  { id: "episodios_previos_detalle", section: "history", label: "Describe episodios o tratamientos previos", type: "text", required: true, showIf: (a) => a.episodios_previos === "Varias veces" || a.episodios_previos === "Una vez" },
];

export const ELBOW_SECTION_LABELS: Record<ElbowQuestionSection, string> = {
  red_flags: "Comprobación de urgencia",
  core: "Caracterización del problema",
  fall: "Detalles de la caída",
  weights: "Detalles con pesas",
  throwing: "Detalles del lanzamiento",
  training: "Detalles del entrenamiento",
  tingling: "Hormigueo / entumecimiento",
  locking: "Bloqueo del codo",
  instability: "Inestabilidad",
  rom_limit: "Limitación de movimiento",
  self_tests: "Autoevaluación",
  history: "Antecedentes",
};

export const ELBOW_SECTION_ORDER: ElbowQuestionSection[] = [
  "red_flags",
  "core",
  "fall",
  "weights",
  "throwing",
  "training",
  "tingling",
  "locking",
  "instability",
  "rom_limit",
  "self_tests",
  "history",
];

export function getVisibleElbowQuestions(answers: ElbowAdaptiveAnswers): ElbowQuestionDef[] {
  return ELBOW_QUESTIONS.filter((q) => !q.showIf || q.showIf(answers)).map((q) => {
    if (!q.options?.length) return q;
    const filtered = filterSleepDependentOptions(q.options, answers.evolucion);
    if (filtered.length === q.options.length) return q;
    return { ...q, options: filtered };
  });
}

export function getVisibleElbowSections(answers: ElbowAdaptiveAnswers): ElbowQuestionSection[] {
  const visible = getVisibleElbowQuestions(answers);
  return ELBOW_SECTION_ORDER.filter((s) => visible.some((q) => q.section === s));
}

const RED_FLAG_IDS: (keyof ElbowAdaptiveAnswers)[] = [
  "rf_deformidad",
  "rf_no_movimiento",
  "rf_inflamacion_severa",
  "rf_fiebre",
  "rf_herida_abierta",
  "rf_perdida_fuerza",
  "rf_perdida_sensibilidad",
  "rf_dedos_frios",
];

export function detectElbowRedFlags(answers: ElbowAdaptiveAnswers): {
  urgent: boolean;
  triggered: string[];
} {
  const labels: Record<string, string> = {
    rf_deformidad: "Se ve torcido, deformado o muy distinto tras lesión",
    rf_no_movimiento: "No puedes mover el codo en absoluto",
    rf_inflamacion_severa: "Hinchazón fuerte justo después de un golpe o caída",
    rf_fiebre: "Fiebre junto con el dolor",
    rf_herida_abierta: "Herida abierta",
    rf_perdida_fuerza: "Pérdida súbita de fuerza",
    rf_perdida_sensibilidad: "Pérdida de sensibilidad",
    rf_dedos_frios: "Dedos fríos, pálidos o azulados",
  };
  const triggered: string[] = [];
  for (const id of RED_FLAG_IDS) {
    if (answers[id] === "Sí") triggered.push(labels[id] ?? id);
  }
  return { urgent: triggered.length > 0, triggered };
}

function isAnswered(q: ElbowQuestionDef, answers: ElbowAdaptiveAnswers): boolean {
  const val = answers[q.id];
  if (q.type === "multi") return Array.isArray(val) && val.length > 0;
  if (q.type === "slider") return typeof val === "number" && val >= 1;
  if (q.type === "text") return typeof val === "string" && val.trim().length > 0;
  return typeof val === "string" && val.length > 0;
}

export function validateElbowAdaptive(answers: ElbowAdaptiveAnswers): AdaptiveValidationIssue | null {
  const visible = getVisibleElbowQuestions(answers);
  for (const q of visible) {
    if (q.required !== false && !isAnswered(q, answers)) {
      return missingQuestionIssue(q);
    }
  }
  return null;
}

export function validateElbowSection(
  section: ElbowQuestionSection,
  answers: ElbowAdaptiveAnswers
): AdaptiveValidationIssue | null {
  const questions = getVisibleElbowQuestions(answers).filter((q) => q.section === section);
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

export function formatElbowAdaptive(
  answers: ElbowAdaptiveAnswers,
  bodyMapText: string
): string {
  const { urgent, triggered } = detectElbowRedFlags(answers);
  const lines: string[] = [
    "=== CUESTIONARIO ADAPTATIVO — CODO ===",
    "",
    bodyMapText,
    "",
    "— MECANISMO DE LA LESIÓN (prioridad máxima — citar exactamente en el resumen) —",
    `Mecanismo según cuestionario: ${answers.mecanismo}`,
    "NO sustituir por el deporte habitual del perfil del paciente.",
    "",
    "— BANDERAS ROJAS —",
    urgent
      ? `⚠️ URGENCIA DETECTADA: ${triggered.join("; ")}`
      : "Ninguna bandera roja marcada como Sí",
    `Deformidad: ${answers.rf_deformidad || "—"}`,
    `Incapacidad movimiento: ${answers.rf_no_movimiento || "—"}`,
    `Inflamación severa post-trauma: ${answers.rf_inflamacion_severa || "—"}`,
    `Fiebre: ${answers.rf_fiebre || "—"}`,
    `Herida abierta: ${answers.rf_herida_abierta || "—"}`,
    `Pérdida fuerza súbita: ${answers.rf_perdida_fuerza || "—"}`,
    `Pérdida sensibilidad: ${answers.rf_perdida_sensibilidad || "—"}`,
    `Dedos fríos/pálidos/azulados: ${answers.rf_dedos_frios || "—"}`,
    "",
    "— VARIABLES CLÍNICAS —",
    `Tiempo de evolución: ${answers.evolucion}`,
    `Forma de aparición: ${answers.inicio}`,
    `Mecanismo: ${answers.mecanismo}`,
    `Intensidad dolor actual: ${answers.intensidad_dolor}/10`,
    `Localización anatómica codo: ${formatMulti(answers.localizacion_codo)}`,
    `Dolor familiar (agarrar/ratón/pomo/hormigueo nocturno): ${answers.dolor_familiar || "—"}`,
    `Tipo de dolor: ${formatMulti(answers.tipo_dolor)}`,
    `Movimientos agravantes: ${formatMulti(answers.movimientos_agravantes)}`,
    `Limitación funcional: ${answers.limitacion_funcional.join(", ") || "—"}`,
    `Síntomas asociados: ${formatMulti(answers.sintomas_asociados)}`,
    `Irradiación: ${answers.irradiacion}${answers.irradiacion_detalle ? ` — ${answers.irradiacion_detalle}` : ""}`,
    `Síntomas de cuello: ${answers.cuello_sintomas || "—"}`,
    answers.cuello_empeora_brazo
      ? `Cabeza empeora codo/brazo: ${answers.cuello_empeora_brazo}`
      : "",
  ];

  if (answers.mecanismo === "Tras una caída") {
    lines.push(
      "",
      "— DETALLE CAÍDA —",
      `Cómo cayó: ${answers.caida_como}`,
      `Crujido/chasquido: ${answers.caida_chasquido}`,
      `Uso del brazo tras caída: ${answers.caida_uso_brazo}`
    );
  }
  if (answers.mecanismo === "Tras levantar pesas") {
    lines.push(
      "",
      "— DETALLE PESAS —",
      `Ejercicio: ${answers.pesas_ejercicio}`,
      answers.pesas_peso ? `Peso: ${answers.pesas_peso}` : "",
      `Momento: ${answers.pesas_momento}`,
      `Pop/chasquido: ${answers.pesas_pop}`,
      answers.pesas_pop === "Sí" ? `Hueco/bulto en cara anterior del brazo: ${answers.pesas_deformidad_biceps || "—"}` : ""
    );
  }
  if (answers.mecanismo === "Tras lanzar") {
    lines.push(
      "",
      "— DETALLE LANZAMIENTO —",
      `Fase: ${answers.lanzar_fase}`,
      `Disminución velocidad/fuerza: ${answers.lanzar_velocidad}`,
      `Inestabilidad: ${answers.lanzar_inestabilidad}`
    );
  }
  if (answers.mecanismo === "Tras entrenamiento o ejercicio") {
    lines.push(
      "",
      "— DETALLE ENTRENAMIENTO —",
      `Ejercicio/actividad: ${answers.entreno_ejercicio}`,
      `Momento: ${answers.entreno_momento}`
    );
  }
  if (hasTingling(answers)) {
    lines.push(
      "",
      "— HORMIGUEO —",
      `Dedos: ${formatMulti(answers.hormigueo_dedos)}`,
      `Patrón: ${answers.hormigueo_constante}`,
      `Desencadenado por flexión: ${answers.hormigueo_flexion}`
    );
  }
  if (hasSymptom(answers, "Bloqueo")) {
    lines.push(
      "",
      "— BLOQUEO —",
      `Se atasca: ${answers.bloqueo_atascado}`,
      `Desbloqueo propio: ${answers.bloqueo_desbloqueo}`,
      `Chasquido previo: ${answers.bloqueo_chasquido}`
    );
  }
  if (hasSymptom(answers, "Inestabilidad")) {
    lines.push(
      "",
      "— INESTABILIDAD —",
      `Cede o falla: ${answers.inestabilidad_cede}`,
      `Episodios previos: ${answers.inestabilidad_antes}`,
      `Ocurre al empujarse para levantarse (silla/suelo) con palma arriba: ${answers.inestabilidad_posicion || "—"}`
    );
  }
  if (hasRomLimit(answers)) {
    lines.push("", "— LIMITACIÓN DE MOVIMIENTO —", `Causa principal: ${answers.rom_limit_causa}`);
  }

  if (hasLateralElbowPain(answers) || hasMedialElbowPain(answers)) {
    lines.push("", "— AUTOEVALUACIÓN —");
    if (hasLateralElbowPain(answers)) {
      lines.push(
        `Dolor externo al estirar muñeca contra resistencia: ${answers.test_extension_muneca || "—"}`
      );
    }
    if (hasMedialElbowPain(answers)) {
      lines.push(
        `Dolor interno al doblar muñeca contra resistencia: ${answers.test_flexion_muneca || "—"}`
      );
    }
  }

  lines.push(
    "",
    "— ANTECEDENTES —",
    `Episodios previos codo: ${answers.episodios_previos}${answers.episodios_previos_detalle ? ` — ${answers.episodios_previos_detalle}` : ""}`,
    "",
    "NOTA: El sistema recopila variables clínicas para estimar estructuras afectadas, no para diagnosticar.",
    "",
    "ORIENTACIÓN DIFERENCIAL (usar el cuestionario; no inventar datos):",
    "- Dolor externo del codo + duele al estirar la muñeca contra resistencia → epicondilitis lateral (codo de tenista).",
    "- Dolor interno del codo + duele al doblar la muñeca contra resistencia → epicondilitis medial (codo de golfista) / pronador.",
    "- Hormigueo en dedo anular/meñique + empeora al doblar el codo o apoyarse con la palma hacia arriba → síndrome del túnel cubital.",
    "- Dolor e hinchazón en la punta posterior del codo, sin gran limitación funcional → bursitis olecraneana.",
    "- Dolor interno en lanzadores + inestabilidad en valgo → lesión del ligamento colateral cubital (UCL) del lanzador.",
    "- Pop/chasquido al levantar peso + hueco o bulto en cara anterior del brazo → rotura del tendón del bíceps distal.",
    "- Caída sobre la mano con el codo extendido + dolor en cara externa profunda → fractura de cabeza radial.",
    "- Se ve torcido, deformado o muy distinto tras trauma + incapacidad de movimiento → luxación de codo.",
    "- Inestabilidad al empujarse para levantarse con la palma hacia arriba tras luxación previa → inestabilidad posterolateral rotatoria (PLRI).",
    "- Adolescente/deportista con dolor externo de esfuerzo repetitivo (lanzamiento/gimnasia) → osteocondritis disecante (OCD) del cóndilo humeral.",
    "- Dolor en el antebrazo proximal con pronación repetitiva, sin claros signos de epicondilitis → síndrome del pronador redondo.",
    "- Dolor/hormigueo en brazo-codo + síntomas de cuello, o empeora al girar/inclinar la cabeza, o tests locales del codo poco provocativos → considerar origen cervical / radiculopatía / dolor referido desde el cuello (no solo lesión local del codo).",
    "- Si los tests locales del codo son negativos pero el paciente describe otro dolor o zona → no forzar epicondilitis; reinterpretar (otra estructura o causa a distancia)."
  );

  return lines.filter(Boolean).join("\n");
}

export const ELBOW_LABEL_EN: Partial<Record<string, string>> = {
  rf_deformidad: "Is there an obvious deformity after the injury?",
  rf_no_movimiento: "Are you completely unable to move the elbow?",
  rf_inflamacion_severa: "Did it swell a lot right after a hit or fall?",
  rf_fiebre: "Do you have a fever along with the pain?",
  rf_herida_abierta: "Is there an open wound in the area?",
  rf_perdida_fuerza: "Sudden loss of strength in the arm?",
  rf_perdida_sensibilidad: "Loss of sensation (marked numbness)?",
  rf_dedos_frios: "Cold, pale, or bluish fingers after the injury?",
  evolucion: "When did the problem start?",
  inicio: "How did the pain appear?",
  mecanismo: "How did the problem begin?",
  intensidad_dolor: "Current pain intensity (1–10)",
  localizacion_codo: "Where do you feel the pain in the elbow? (you can select several)",
  dolor_familiar:
    "Is it the same pain you notice when gripping, using a mouse, turning a doorknob, or waking with tingling?",
  tipo_dolor: "How would you describe the pain?",
  movimientos_agravantes: "Which movements make it worse? (you can select several)",
  limitacion_funcional: "How much does it limit you day to day?",
  sintomas_asociados: "What other symptoms do you notice?",
  irradiacion: "Does the pain spread to another area?",
  irradiacion_detalle: "How far does it go, or which fingers are affected?",
  cuello_sintomas: "Do you also notice pain, stiffness, or tingling in the neck?",
  cuello_empeora_brazo:
    "When you turn or tilt your head, does the elbow pain or arm tingling get worse?",
  caida_como: "How did you fall?",
  caida_chasquido: "Did you hear a crack or click?",
  caida_uso_brazo: "Could you keep using the arm afterwards?",
  pesas_ejercicio: "Which exercise were you doing?",
  pesas_peso: "Approximate weight?",
  pesas_momento: "When did the pain appear?",
  pesas_pop: "Did you notice a click or pop?",
  pesas_deformidad_biceps: "Do you notice a gap or bulge in the front of your arm, as if the muscle had shifted?",
  lanzar_fase: "In which phase of the throw did it appear?",
  lanzar_velocidad: "Did your throwing speed or force decrease?",
  lanzar_inestabilidad: "Did you notice instability when throwing?",
  entreno_ejercicio: "Which exercise or activity were you doing?",
  entreno_momento: "When did the pain appear?",
  hormigueo_dedos: "Which fingers are affected?",
  hormigueo_constante: "Is the tingling constant or intermittent?",
  hormigueo_flexion: "Is it triggered by bending the elbow?",
  bloqueo_atascado: "Does the elbow get stuck?",
  bloqueo_desbloqueo: "Can you unlock it yourself?",
  bloqueo_chasquido: "Does it click before unlocking?",
  inestabilidad_cede: "Does the elbow give way or feel unstable?",
  inestabilidad_antes: "Has this happened before?",
  inestabilidad_posicion: "Does it happen when pushing yourself up from a chair or the floor with your palm facing up?",
  rom_limit_causa: "Why can't you fully bend or straighten it?",
  test_extension_muneca: "Does it hurt on the outside of the elbow when extending the wrist against resistance?",
  test_flexion_muneca: "Does it hurt on the inside when flexing the wrist against resistance?",
  episodios_previos: "Have you had this elbow problem before?",
  episodios_previos_detalle: "Describe previous episodes or treatments",
};

export const ELBOW_OPTION_EN: Record<string, string> = {
  No: "No",
  Sí: "Yes",
  "Sí, es el mismo": "Yes, it's the same",
  "No, es otra molestia": "No, it's a different discomfort",
  "Ha sido ahora": "Just now",
  "Reciente (1-4 horas)": "Recent (1–4 hours)",
  "Menos de 48 horas": "Less than 48 hours",
  "Entre 2 y 7 días": "Between 2 and 7 days",
  "Entre 1 y 4 semanas": "Between 1 and 4 weeks",
  "Más de 1 mes": "More than 1 month",
  Repentino: "Sudden",
  "Poco a poco": "Gradual",
  "Va y viene": "Comes and goes",
  "Empezó poco a poco, sin causa clara": "Gradual onset with no clear cause",
  "Tras entrenamiento o ejercicio": "After training or exercise",
  "Tras levantar pesas": "After lifting weights",
  "Tras lanzar": "After throwing",
  "Tras una caída": "After a fall",
  "Tras golpe directo": "After a direct blow",
  "Tras torcer / movimiento brusco": "After twisting / sudden movement",
  "No lo sé": "I don't know",
  "Parte externa del codo": "Outer side of the elbow",
  "Parte interna del codo": "Inner side of the elbow",
  "Parte posterior del codo": "Back of the elbow",
  "Parte anterior del codo": "Front of the elbow",
  "Profundo en la articulación": "Deep in the joint",
  "Todo el codo": "Whole elbow",
  "No estoy seguro": "I'm not sure",
  Punzante: "Sharp",
  "Dolor sordo": "Dull ache",
  Quemazón: "Burning",
  "Tirantez o tirón": "Tightness or pulling",
  "Descarga eléctrica": "Electric shock",
  "Latido o punzadas": "Throbbing or stabbing",
  "Doblar el codo": "Bending the elbow",
  "Estirar el codo": "Straightening the elbow",
  "Rotar el antebrazo": "Rotating the forearm",
  "Girar un pomo o llave": "Turning a doorknob or key",
  "Levantar objetos": "Lifting objects",
  "Agarrar objetos": "Gripping objects",
  Empujar: "Pushing",
  Tirar: "Pulling",
  Lanzar: "Throwing",
  "Escribir o teclear": "Writing or typing",
  "Ninguno en particular": "None in particular",
  "Solo al mover": "Only when moving",
  "Con esfuerzo o carga": "With effort or load",
  "En reposo": "At rest",
  "Por la noche": "At night",
  Constantemente: "Constantly",
  Ninguna: "None",
  "Molestia leve": "Mild discomfort",
  "No puedo entrenar": "I can't train",
  "Dificultad para cargar objetos": "Difficulty carrying objects",
  "Dificultad para vestirme": "Difficulty dressing",
  "Me cuesta doblar o estirar del todo": "Difficulty fully bending or straightening",
  "No puedo usar el brazo con normalidad": "I can't use the arm normally",
  "Inflamación / hinchazón": "Inflammation / swelling",
  Moretón: "Bruising",
  Chasquidos: "Clicking",
  Bloqueo: "Locking",
  Debilidad: "Weakness",
  Inestabilidad: "Instability",
  Hormigueo: "Tingling",
  Entumecimiento: "Numbness",
  Rigidez: "Stiffness",
  Ninguno: "None",
  "Hacia el hombro": "Toward the shoulder",
  "Hacia el antebrazo": "Toward the forearm",
  "Hacia la mano": "Toward the hand",
  "Hacia dedos concretos": "Toward specific fingers",
  "Desde el cuello hacia el brazo/codo": "From the neck toward the arm/elbow",
  Nunca: "Never",
  "Una vez": "Once",
  "Varias veces": "Several times",
  Reposo: "Rest",
  Hielo: "Ice",
  Calor: "Heat / warmth",
  Antiinflamatorios: "Anti-inflammatories",
  Movimiento: "Movement",
  Compresión: "Compression",
  Nada: "Nothing",
  "Sobre la mano": "Onto the hand",
  "Sobre el codo": "Onto the elbow",
  "Con el brazo extendido": "With the arm outstretched",
  "De otra forma": "Another way",
  "Sí, pude seguir usándolo": "Yes, I could keep using it",
  Parcialmente: "Partially",
  "No, no pude usarlo": "No, I couldn't use it",
  "Durante el levantamiento": "During the lift",
  "Justo después": "Right afterwards",
  "Al día siguiente": "The next day",
  "Durante la aceleración": "During acceleration",
  "Al terminar el lanzamiento (fase final)": "At the end of the throw (follow-through)",
  "En ambas fases": "In both phases",
  Pulgar: "Thumb",
  Índice: "Index",
  Medio: "Middle",
  Anular: "Ring",
  Meñique: "Little finger",
  "Por dolor": "Because of pain",
  "Porque se traba / no deja pasar": "Because of mechanical locking",
  "Por falta de fuerza": "Because of lack of strength",
  Constante: "Constant",
  Intermitente: "Intermittent",
};

export const ELBOW_SECTION_LABELS_EN: Record<string, string> = {
  red_flags: "Urgency check",
  core: "Problem characterization",
  fall: "Fall details",
  weights: "Weightlifting details",
  throwing: "Throwing details",
  training: "Training details",
  tingling: "Tingling / numbness",
  locking: "Elbow locking",
  instability: "Instability",
  rom_limit: "Movement limitation",
  self_tests: "Self-assessment",
  history: "History",
};

export type ConsultLocale = "es" | "en";
export function localizeElbowLabel(id: string, fallback: string, locale: ConsultLocale): string {
  if (locale !== "en") return fallback;
  return ELBOW_LABEL_EN[id] ?? fallback;
}
export function localizeElbowOption(option: string, locale: ConsultLocale): string {
  if (locale !== "en") return option;
  return ELBOW_OPTION_EN[option] ?? option;
}
export function localizeElbowSection(section: string, locale: ConsultLocale): string {
  if (locale !== "en") return (ELBOW_SECTION_LABELS as any)[section] ?? section;
  return ELBOW_SECTION_LABELS_EN[section] ?? (ELBOW_SECTION_LABELS as any)[section] ?? section;
}

