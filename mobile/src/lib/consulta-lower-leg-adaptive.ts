import {
  filterSleepDependentOptions,
  shouldShowSleepDependentQuestion,
} from "./consulta-timing";
import type { AnkleFootFocus } from "./detect-body-part";
/**
 * Adaptive questionnaire for lower leg / shin / calf / Achilles / ankle / foot
 * (ankle_foot region) — adapts labels and location options to region_focus
 * (foot vs ankle vs lower_leg) from the patient's initial complaint.
 */
import { missingQuestionIssue, type AdaptiveValidationIssue } from "./consulta-validation";

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
  "Torcedura / inversión del tobillo",
  "Caída",
  "Golpe directo",
  "Entrenamiento o ejercicio",
  "Movimiento repetitivo / correr",
  "Empezó poco a poco, sin causa clara",
  "Otro",
] as const;

export const LOWER_LEG_LOCATION_OPTIONS = [
  "Justo debajo de la rodilla (prominencia ósea)",
  "Espinilla anterior",
  "Cara interna",
  "Cara externa",
  "Pantorrilla",
  "Tendón de Aquiles",
  "Transición al tobillo",
  "No estoy seguro",
] as const;

export const FOOT_LOCATION_OPTIONS = [
  "Planta del pie / arco",
  "Talón (debajo / inserción)",
  "Talón (lateral o posterior)",
  "Dorso del pie",
  "Parte media del pie",
  "Parte delantera del pie / dedos",
  "Tobillo",
  "No estoy seguro",
] as const;

export const ANKLE_LOCATION_OPTIONS = [
  "Tobillo por fuera",
  "Tobillo por dentro",
  "Parte anterior del tobillo",
  "Parte posterior / Aquiles",
  "Transición a la pierna",
  "Hacia el pie / planta",
  "No estoy seguro",
] as const;

export const MIXED_LOCATION_OPTIONS = [
  ...LOWER_LEG_LOCATION_OPTIONS.filter((o) => o !== "No estoy seguro"),
  "Planta del pie / arco",
  "Talón",
  "Dorso del pie",
  "Dedos / parte delantera del pie",
  "No estoy seguro",
] as const;

/** Whole leg — used when patient only said "pierna" (could be thigh, knee, or below). */
export const WHOLE_LEG_LOCATION_OPTIONS = [
  "Muslo / encima de la rodilla",
  "Rodilla",
  "Justo debajo de la rodilla (prominencia ósea)",
  "Espinilla anterior",
  "Pantorrilla",
  "Tendón de Aquiles",
  "Tobillo",
  "Pie / planta",
  "No estoy seguro",
] as const;

/** Thigh / hamstring / quadriceps — patient named muslo or isquio, not the knee. */
export const THIGH_LOCATION_OPTIONS = [
  "Parte de atrás del muslo (isquiotibiales)",
  "Parte de delante del muslo (cuádriceps)",
  "Parte interna del muslo",
  "Parte externa del muslo",
  "Cerca del glúteo / isquion",
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
  "Leve (puedo caminar pero molesta)",
  "Moderada (limita caminar o estar de pie)",
  "Severa (cojeo o evito apoyar)",
  "No puedo apoyar / caminar",
] as const;

export const ASSOCIATED_SYMPTOM_OPTIONS = [
  "Hinchazón / inflamación",
  "Hematoma",
  "Hormigueo o entumecimiento",
  "Debilidad",
  "Chasquido",
  "Calor",
  "Crujido al caminar",
  "Ninguno",
] as const;

export const AGGRAVATING_MOVEMENT_OPTIONS = [
  "Caminar",
  "Correr",
  "Saltar",
  "Subir / bajar escaleras",
  "Ponerse de puntillas",
  "Doblar el tobillo",
  "Estirar la pantorrilla",
  "Tocar la zona",
  "Primeros pasos al despertar",
  "Ninguno en particular",
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
  "Ejercicio de resistencia (mucho tiempo o muchas repeticiones)",
] as const;

export const NEURO_ZONE_OPTIONS = [
  "Pie completo",
  "Dedos del pie",
  "Planta del pie",
  "Dorso del pie",
  "Tobillo",
  "Pantorrilla",
  "Espinilla",
] as const;

export const SWELLING_ONSET_OPTIONS = [
  "Inmediata tras la lesión",
  "En las primeras horas",
  "Al día siguiente",
  "Poco a poco en días",
] as const;

export type LowerLegAdaptiveAnswers = {
  /** Matches what the patient said first: foot vs ankle vs shin/calf */
  region_focus: AnkleFootFocus;
  // Red flags
  rf_deformidad: string;
  rf_no_apoyo: string;
  rf_hinchazon_subita: string;
  rf_perdida_sensibilidad: string;
  rf_fiebre: string;
  rf_vascular: string;
  rf_compartimental: string;
  // Core
  evolucion: string;
  inicio: string;
  mecanismo: string[];
  mecanismo_otro: string;
  inicio_chasquido: string;
  intensidad_dolor: number;
  localizacion_pierna: string[];
  dolor_familiar: string;
  ottawa_dolor_oseo: string;
  tipo_dolor: string[];
  limitacion_funcional: string[];
  irradiacion: string;
  irradiacion_detalle: string;
  sintomas_asociados: string[];
  movimientos_agravantes: string[];
  // Trauma branch
  trauma_detalle: string;
  trauma_chasquido: string;
  trauma_apoyo: string;
  // Training branch
  entreno_ejercicio: string;
  entreno_momento: string;
  entreno_carga: string;
  // Repetitive branch
  repetitivo_actividad: string;
  repetitivo_frecuencia: string;
  // Neuro branch
  neuro_zona: string[];
  neuro_constante: string;
  // Swelling branch
  hinchazon_inicio: string;
  hinchazon_progresion: string;
  hinchazon_calor: string;
  // Achilles branch
  aquiles_pedrada: string;
  aquiles_puntillas: string;
  aquiles_hueco: string;
  // Shin discriminator branch
  espinilla_focal: string;
  espinilla_reposo: string;
  // History
  lesion_previa: string;
  lesion_previa_detalle: string;
};

export function defaultLowerLegAdaptiveAnswers(
  focus: AnkleFootFocus = "mixed"
): LowerLegAdaptiveAnswers {
  const prefilledLocation =
    focus === "foot"
      ? [] // user still picks; we may prefill via withAnkleFootFocusFromText
      : [];
  return {
    region_focus: focus,
    rf_deformidad: "",
    rf_no_apoyo: "",
    rf_hinchazon_subita: "",
    rf_perdida_sensibilidad: "",
    rf_fiebre: "",
    rf_vascular: "",
    rf_compartimental: "",
    evolucion: "",
    inicio: "",
    mecanismo: [],
    mecanismo_otro: "",
    inicio_chasquido: "",
    intensidad_dolor: 5,
    localizacion_pierna: prefilledLocation,
    dolor_familiar: "",
    ottawa_dolor_oseo: "",
    tipo_dolor: [],
    limitacion_funcional: [],
    irradiacion: "",
    irradiacion_detalle: "",
    sintomas_asociados: [],
    movimientos_agravantes: [],
    trauma_detalle: "",
    trauma_chasquido: "",
    trauma_apoyo: "",
    entreno_ejercicio: "",
    entreno_momento: "",
    entreno_carga: "",
    repetitivo_actividad: "",
    repetitivo_frecuencia: "",
    neuro_zona: [],
    neuro_constante: "",
    hinchazon_inicio: "",
    hinchazon_progresion: "",
    hinchazon_calor: "",
    aquiles_pedrada: "",
    aquiles_puntillas: "",
    aquiles_hueco: "",
    espinilla_focal: "",
    espinilla_reposo: "",
    lesion_previa: "",
    lesion_previa_detalle: "",
  };
}

/** Seed region_focus (+ optional planta prefill) from the patient's free-text complaint. */
export function withAnkleFootFocusFromText(
  text: string,
  focus: AnkleFootFocus
): LowerLegAdaptiveAnswers {
  const base = defaultLowerLegAdaptiveAnswers(focus);
  const t = text.trim();
  if (focus === "foot") {
    if (/planta|arco\s+plantar|sole/i.test(t)) {
      return { ...base, localizacion_pierna: ["Planta del pie / arco"] };
    }
    if (/tal[oó]n|heel/i.test(t)) {
      return { ...base, localizacion_pierna: ["Talón (debajo / inserción)"] };
    }
  }

  const mecanismo: string[] = [...base.mecanismo];
  const movimientos: string[] = [...(base.movimientos_agravantes ?? [])];
  let evolucion = base.evolucion;
  let inicio = base.inicio;

  if (/ahora mismo|acaba de|ha sido ahora|just\s+now/i.test(t)) {
    evolucion = "Ha sido ahora";
  } else if (/hace\s*(unas?\s*)?(pocas\s+)?horas|1-4\s*h/i.test(t)) {
    evolucion = "Reciente (1-4 horas)";
  } else if (/ayer|48\s*h|menos de (dos|2)\s*d[ií]as/i.test(t)) {
    evolucion = "Menos de 48 horas";
  } else if (/hace\s*(\d+|varios|unas)\s*d[ií]as|esta semana/i.test(t)) {
    evolucion = "Entre 2 y 7 días";
  } else if (/semana|semanas/i.test(t) && !/mes/i.test(t)) {
    evolucion = "Entre 1 y 4 semanas";
  } else if (/mes|meses|cr[oó]nic/i.test(t)) {
    evolucion = "Más de 1 mes";
  }

  if (/de\s+golpe|repentin|s[uú]bit|chasquido|pop\b/i.test(t)) inicio = "Repentino";
  else if (/poco a poco|progresiv|gradual/i.test(t)) inicio = "Poco a poco";

  if (/ca[ií]da|caer|fall/i.test(t) && !mecanismo.includes("Caída")) {
    mecanismo.push("Caída");
  }
  if (
    /torc[ií]|inversi[oó]n|se me fue el tobillo|ankle\s*sprain|rolled\s*(my\s*)?ankle/i.test(
      t
    ) &&
    !mecanismo.includes("Torcedura / inversión del tobillo")
  ) {
    mecanismo.push("Torcedura / inversión del tobillo");
  }
  if (/golpe|trauma/i.test(t) && !mecanismo.includes("Golpe directo")) {
    mecanismo.push("Golpe directo");
  }
  if (
    /correr|running|entrenamiento|ejercicio|gimnasio/i.test(t) &&
    !mecanismo.includes("Entrenamiento o ejercicio") &&
    !mecanismo.includes("Movimiento repetitivo / correr")
  ) {
    if (/correr|running|footing/i.test(t)) {
      mecanismo.push("Movimiento repetitivo / correr");
    } else {
      mecanismo.push("Entrenamiento o ejercicio");
    }
  }

  if (/correr|running/i.test(t)) movimientos.push("Correr");
  if (/saltar|jump/i.test(t)) movimientos.push("Saltar");
  if (/escalera|stairs/i.test(t)) movimientos.push("Subir / bajar escaleras");

  if (focus === "thigh") {
    const locs: string[] = [];
    if (/isquiotibial|\bisquios?\b|hamstring|muslo\s*posterior|parte\s+de\s+atr[aá]s/i.test(t)) {
      locs.push("Parte de atrás del muslo (isquiotibiales)");
    }
    if (/cuadr[ií]ceps|cu[aá]driceps|\bquads?\b|muslo\s*anterior|recto\s*femoral/i.test(t)) {
      locs.push("Parte de delante del muslo (cuádriceps)");
    }
    if (/muslo\s*interno|inner\s*thigh|aductor|adductor/i.test(t)) {
      locs.push("Parte interna del muslo");
    }
    if (/muslo\s*externo|outer\s*thigh/i.test(t)) {
      locs.push("Parte externa del muslo");
    }
    return {
      ...base,
      evolucion: evolucion || base.evolucion,
      inicio: inicio || base.inicio,
      mecanismo,
      movimientos_agravantes: [...new Set(movimientos)],
      localizacion_pierna: locs,
    };
  }

  if (focus === "lower_leg" || focus === "leg") {
    if (/espinilla|shin|tibial/i.test(t)) {
      return {
        ...base,
        evolucion: evolucion || base.evolucion,
        inicio: inicio || base.inicio,
        mecanismo,
        movimientos_agravantes: [...new Set(movimientos)],
        localizacion_pierna:
          base.localizacion_pierna.length > 0
            ? base.localizacion_pierna
            : ["Espinilla anterior"],
      };
    }
    if (/gemelo|pantorrilla|calf/i.test(t)) {
      return {
        ...base,
        evolucion: evolucion || base.evolucion,
        inicio: inicio || base.inicio,
        mecanismo,
        movimientos_agravantes: [...new Set(movimientos)],
        localizacion_pierna:
          base.localizacion_pierna.length > 0
            ? base.localizacion_pierna
            : ["Pantorrilla"],
      };
    }
  }

  return {
    ...base,
    ...(evolucion ? { evolucion } : {}),
    ...(inicio ? { inicio } : {}),
    mecanismo,
    movimientos_agravantes: [...new Set(movimientos)],
  };
}

export type LowerLegQuestionSection =
  | "red_flags"
  | "core"
  | "trauma"
  | "training"
  | "repetitive"
  | "neuro"
  | "swelling"
  | "achilles"
  | "shin_discriminator"
  | "history";

export type LowerLegQuestionDef = {
  id: keyof LowerLegAdaptiveAnswers;
  section: LowerLegQuestionSection;
  label: string;
  type: "single" | "multi" | "text" | "slider";
  options?: readonly string[];
  required?: boolean;
  showIf?: (a: LowerLegAdaptiveAnswers) => boolean;
};

function hasSymptom(a: LowerLegAdaptiveAnswers, name: string): boolean {
  return a.sintomas_asociados.includes(name);
}

function isTrauma(a: LowerLegAdaptiveAnswers): boolean {
  return (
    a.mecanismo.includes("Caída") ||
    a.mecanismo.includes("Golpe directo") ||
    a.mecanismo.includes("Torcedura / inversión del tobillo")
  );
}

function hasNeuro(a: LowerLegAdaptiveAnswers): boolean {
  return (
    hasSymptom(a, "Hormigueo o entumecimiento") ||
    a.tipo_dolor.includes("Hormigueo")
  );
}

function hasSwelling(a: LowerLegAdaptiveAnswers): boolean {
  return (
    hasSymptom(a, "Hinchazón / inflamación") || hasSymptom(a, "Calor")
  );
}

function hasChasquidoQuestion(a: LowerLegAdaptiveAnswers): boolean {
  return (
    isTrauma(a) ||
    a.mecanismo.includes("Entrenamiento o ejercicio") ||
    a.mecanismo.includes("Movimiento repetitivo / correr")
  );
}

function hasAchillesSection(a: LowerLegAdaptiveAnswers): boolean {
  return (
    a.localizacion_pierna.includes("Tendón de Aquiles") ||
    a.localizacion_pierna.includes("Parte posterior / Aquiles")
  );
}

function hasShinDiscriminatorSection(a: LowerLegAdaptiveAnswers): boolean {
  return (
    a.localizacion_pierna.includes("Espinilla anterior") ||
    a.localizacion_pierna.includes("Cara interna")
  );
}

export const LOWER_LEG_QUESTIONS: LowerLegQuestionDef[] = [

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
    label: "¿La pierna, espinilla o tobillo se ve torcido, deformado o muy distinto de lo normal?",
    type: "single",
    options: YES_NO,
    required: true,
  },
  {
    id: "rf_no_apoyo",
    section: "red_flags",
    label: "¿No puedes apoyar o caminar en absoluto?",
    type: "single",
    options: YES_NO,
    required: true,
  },
  {
    id: "rf_hinchazon_subita",
    section: "red_flags",
    label: "¿Hinchazón súbita e intensa de la pantorrilla?",
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
    id: "rf_fiebre",
    section: "red_flags",
    label: "¿Tienes fiebre junto con el dolor?",
    type: "single",
    options: YES_NO,
    required: true,
  },
  {
    id: "rf_vascular",
    section: "red_flags",
    label:
      "¿Dolor en pantorrilla con hinchazón en una sola pierna que te preocupa?",
    type: "single",
    options: YES_NO,
    required: true,
  },
  {
    id: "rf_compartimental",
    section: "red_flags",
    label:
      "¿Dolor mucho más fuerte de lo que parece, que empeora al estirar los dedos del pie o el tobillo, con tensión extrema en pantorrilla/espinilla?",
    type: "single",
    options: YES_NO,
    required: true,
  },

  // Core — location + familiar pain before mechanism (Physioguide)
  {
    id: "localizacion_pierna",
    section: "core",
    label: "¿Dónde sientes el dolor en la pierna baja? (puedes marcar varias)",
    type: "multi",
    options: LOWER_LEG_LOCATION_OPTIONS,
    required: true,
  },
  {
    id: "dolor_familiar",
    section: "core",
    label:
      "¿Es el mismo dolor que notas al caminar, torcer el tobillo, ponerte de puntillas o al dar los primeros pasos por la mañana?",
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
    id: "inicio_chasquido",
    section: "core",
    label: "¿Notaste un chasquido o 'pedrada' repentina durante el gesto?",
    type: "single",
    options: YES_NO,
    required: true,
    showIf: hasChasquidoQuestion,
  },
  {
    id: "ottawa_dolor_oseo",
    section: "core",
    label:
      "¿Duele al tocar el hueso del tobillo (maleolo por detrás o la punta), el hueso del empeine (navicular) o la base del 5.º metatarsiano (borde externo del pie)?",
    type: "single",
    options: YES_NO,
    required: true,
    showIf: (a) => isTrauma(a) && a.region_focus !== "thigh",
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
    label: "¿Cuánto te limita al caminar o apoyar? (puedes marcar varias)",
    type: "multi",
    options: FUNCTIONAL_LIMIT_OPTIONS,
    required: true,
  },
  {
    id: "irradiacion",
    section: "core",
    label: "¿El dolor se extiende hacia el pie, tobillo u otra zona?",
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

  // Repetitive branch
  {
    id: "repetitivo_actividad",
    section: "repetitive",
    label: "¿Qué actividad repetitiva o de carrera lo desencadena?",
    type: "text",
    required: true,
    showIf: (a) => a.mecanismo.includes("Movimiento repetitivo / correr"),
  },
  {
    id: "repetitivo_frecuencia",
    section: "repetitive",
    label: "¿Con qué frecuencia realizas esa actividad?",
    type: "single",
    options: ["Diariamente", "Varias veces por semana", "Ocasionalmente"],
    required: true,
    showIf: (a) => a.mecanismo.includes("Movimiento repetitivo / correr"),
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
  // Swelling branch
  {
    id: "hinchazon_inicio",
    section: "swelling",
    label: "¿Cuándo apareció la hinchazón o inflamación?",
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

  // Achilles branch
  {
    id: "aquiles_pedrada",
    section: "achilles",
    label:
      "¿Sentiste como si te hubieran golpeado o disparado en la parte baja de la pantorrilla/talón?",
    type: "single",
    options: YES_NO,
    required: true,
    showIf: hasAchillesSection,
  },
  {
    id: "aquiles_puntillas",
    section: "achilles",
    label: "¿Puedes ponerte de puntillas con esa pierna sola?",
    type: "single",
    options: YES_NO,
    required: true,
    showIf: hasAchillesSection,
  },
  {
    id: "aquiles_hueco",
    section: "achilles",
    label: "¿Notas un hueco o escalón en el tendón al tocarlo?",
    type: "single",
    options: YES_NO,
    required: true,
    showIf: hasAchillesSection,
  },

  // Shin discriminator branch (MTSS vs stress fracture vs CECS)
  {
    id: "espinilla_focal",
    section: "shin_discriminator",
    label:
      "¿El dolor es puntual en un solo punto del hueso, o difuso a lo largo de la espinilla?",
    type: "single",
    options: ["Puntual en un punto", "Difuso a lo largo", "No estoy seguro"],
    required: true,
    showIf: hasShinDiscriminatorSection,
  },
  {
    id: "espinilla_reposo",
    section: "shin_discriminator",
    label:
      "¿El dolor persiste en reposo o empeora semana a semana, o mejora al parar de correr?",
    type: "single",
    options: [
      "Persiste/empeora en reposo o semanas",
      "Mejora al parar",
      "Variable",
    ],
    required: true,
    showIf: hasShinDiscriminatorSection,
  },

  // History
  {
    id: "lesion_previa",
    section: "history",
    label: "¿Has tenido lesiones previas en esta pierna, espinilla, pantorrilla o Aquiles?",
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

export const LOWER_LEG_SECTION_LABELS: Record<LowerLegQuestionSection, string> = {
  red_flags: "Comprobación de urgencia",
  core: "Caracterización del problema",
  trauma: "Detalles del golpe o la caída",
  training: "Detalles del entrenamiento",
  repetitive: "Movimiento repetitivo / carrera",
  neuro: "Hormigueo / entumecimiento",
  swelling: "Hinchazón / inflamación",
  achilles: "Tendón de Aquiles",
  shin_discriminator: "Caracterización de la espinilla",
  history: "Antecedentes",
};

export const LOWER_LEG_SECTION_ORDER: LowerLegQuestionSection[] = [
  "red_flags",
  "core",
  "trauma",
  "training",
  "repetitive",
  "neuro",
  "swelling",
  "achilles",
  "shin_discriminator",
  "history",
];

function locationOptionsForFocus(focus: AnkleFootFocus): readonly string[] {
  if (focus === "foot") return FOOT_LOCATION_OPTIONS;
  if (focus === "ankle") return ANKLE_LOCATION_OPTIONS;
  if (focus === "lower_leg") return LOWER_LEG_LOCATION_OPTIONS;
  if (focus === "leg") return WHOLE_LEG_LOCATION_OPTIONS;
  if (focus === "thigh") return THIGH_LOCATION_OPTIONS;
  return MIXED_LOCATION_OPTIONS;
}

function focusAwareQuestion(
  q: LowerLegQuestionDef,
  answers: LowerLegAdaptiveAnswers
): LowerLegQuestionDef {
  const focus = answers.region_focus ?? "mixed";
  if (q.id === "localizacion_pierna") {
    const label =
      focus === "foot"
        ? "¿Dónde sientes el dolor en el pie? (puedes marcar varias)"
        : focus === "ankle"
          ? "¿Dónde sientes el dolor en el tobillo? (puedes marcar varias)"
          : focus === "lower_leg"
            ? "¿Dónde sientes el dolor en la pierna baja? (puedes marcar varias)"
            : focus === "leg"
              ? "¿Dónde sientes el dolor en la pierna? (muslo, rodilla, debajo de la rodilla, pantorrilla, tobillo o pie — puedes marcar varias)"
              : focus === "thigh"
                ? "¿Dónde sientes el dolor en el muslo? (puedes marcar varias)"
                : "¿Dónde sientes el dolor (pierna baja, tobillo o pie)? (puedes marcar varias)";
    return { ...q, label, options: locationOptionsForFocus(focus) };
  }
  if (q.id === "irradiacion") {
    if (focus === "foot") {
      return {
        ...q,
        label: "¿El dolor sube hacia el tobillo o la pierna?",
      };
    }
    if (focus === "ankle") {
      return {
        ...q,
        label: "¿El dolor se extiende hacia el pie o hacia la pierna?",
      };
    }
    if (focus === "thigh") {
      return {
        ...q,
        label: "¿El dolor se extiende hacia la rodilla, el glúteo o la ingle?",
      };
    }
  }
  if (q.id === "rf_deformidad") {
    if (focus === "foot") {
      return { ...q, label: "¿El pie o el tobillo se ve torcido, deformado o muy distinto de lo normal?" };
    }
    if (focus === "ankle") {
      return { ...q, label: "¿El tobillo se ve torcido, deformado o muy distinto de lo normal?" };
    }
    if (focus === "thigh") {
      return { ...q, label: "¿El muslo se ve hundido, deformado o muy distinto del otro?" };
    }
  }
  if (q.id === "rf_hinchazon_subita" && focus === "thigh") {
    return { ...q, label: "¿Hinchazón súbita e intensa del muslo?" };
  }
  if (q.id === "rf_perdida_sensibilidad" && focus === "foot") {
    return { ...q, label: "¿Pérdida de sensibilidad en la planta, dorso o dedos del pie?" };
  }
  if (q.id === "lesion_previa" && focus === "foot") {
    return {
      ...q,
      label: "¿Has tenido lesiones previas en este pie, planta o tobillo?",
    };
  }
  if (q.id === "lesion_previa" && focus === "thigh") {
    return {
      ...q,
      label: "¿Has tenido lesiones previas en este muslo o en los isquiotibiales?",
    };
  }
  return q;
}

export function getVisibleLowerLegQuestions(
  answers: LowerLegAdaptiveAnswers
): LowerLegQuestionDef[] {
  return LOWER_LEG_QUESTIONS.filter((q) => !q.showIf || q.showIf(answers)).map((q) => {
    let next = focusAwareQuestion(q, answers);
    if (next.options?.length) {
      const filtered = filterSleepDependentOptions(next.options, answers.evolucion);
      if (filtered.length !== next.options.length) {
        next = { ...next, options: filtered };
      }
    }
    return next;
  });
}

export function getVisibleLowerLegSections(
  answers: LowerLegAdaptiveAnswers
): LowerLegQuestionSection[] {
  const visible = getVisibleLowerLegQuestions(answers);
  return LOWER_LEG_SECTION_ORDER.filter((s) => visible.some((q) => q.section === s));
}

const RED_FLAG_IDS: (keyof LowerLegAdaptiveAnswers)[] = [
  "rf_deformidad",
  "rf_no_apoyo",
  "rf_hinchazon_subita",
  "rf_perdida_sensibilidad",
  "rf_fiebre",
  "rf_vascular",
  "rf_compartimental",
];

export function detectLowerLegRedFlags(answers: LowerLegAdaptiveAnswers): {
  urgent: boolean;
  triggered: string[];
} {
  const labels: Record<string, string> = {
    rf_deformidad: "Se ve torcido, deformado o muy distinto",
    rf_no_apoyo: "No puedes apoyar o caminar en absoluto",
    rf_hinchazon_subita: "Hinchazón súbita e intensa de pantorrilla",
    rf_perdida_sensibilidad: "Pérdida de sensibilidad en el pie",
    rf_fiebre: "Fiebre junto con el dolor",
    rf_vascular: "Dolor de pantorrilla con hinchazón en una sola pierna (posible problema de circulación)",
    rf_compartimental:
      "Dolor mucho más fuerte de lo que parece al estirar dedos/tobillo, con tensión extrema (posible síndrome compartimental)",
  };
  const triggered: string[] = [];
  for (const id of RED_FLAG_IDS) {
    if (answers[id] === "Sí") triggered.push(labels[id] ?? id);
  }
  return { urgent: triggered.length > 0, triggered };
}

function isAnswered(q: LowerLegQuestionDef, answers: LowerLegAdaptiveAnswers): boolean {
  const val = answers[q.id];
  if (q.type === "multi") return Array.isArray(val) && val.length > 0;
  if (q.type === "slider") return typeof val === "number" && val >= 1;
  if (q.type === "text") return typeof val === "string" && val.trim().length > 0;
  return typeof val === "string" && val.length > 0;
}

export function validateLowerLegAdaptive(
  answers: LowerLegAdaptiveAnswers
): AdaptiveValidationIssue | null {
  const visible = getVisibleLowerLegQuestions(answers);
  for (const q of visible) {
    if (q.required !== false && !isAnswered(q, answers)) {
      return missingQuestionIssue(q);
    }
  }
  return null;
}

export function validateLowerLegSection(
  section: LowerLegQuestionSection,
  answers: LowerLegAdaptiveAnswers
): AdaptiveValidationIssue | null {
  const questions = getVisibleLowerLegQuestions(answers).filter(
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

function locs(a: LowerLegAdaptiveAnswers): string[] {
  return a.localizacion_pierna ?? [];
}

function hasLoc(a: LowerLegAdaptiveAnswers, ...needles: string[]): boolean {
  const L = locs(a);
  return needles.some((n) =>
    L.some((x) => x.toLowerCase().includes(n.toLowerCase()))
  );
}

/** Exact option match (avoids "encima de la rodilla" counting as Rodilla). */
function hasExactLoc(a: LowerLegAdaptiveAnswers, ...options: string[]): boolean {
  const L = locs(a);
  return options.some((o) => L.includes(o));
}

/**
 * Precise zone for the AI from questionnaire location answers.
 * Bare "Pierna" is not enough — must reflect muslo / rodilla / pantorrilla / etc.
 */
export function bodyAreaLabelFromLowerLegAnswers(
  answers: LowerLegAdaptiveAnswers,
  locale: "es" | "en" = "es"
): string {
  const parts: string[] = [];
  const push = (es: string, en: string) => {
    const v = locale === "en" ? en : es;
    if (!parts.includes(v)) parts.push(v);
  };

  if (hasExactLoc(answers, "Muslo / encima de la rodilla") || hasLoc(answers, "Thigh", "muslo", "isquio", "cuádriceps")) {
    push("Muslo / isquiotibiales", "Thigh / hamstrings");
  }
  if (hasExactLoc(answers, "Rodilla")) {
    push("Rodilla", "Knee");
  }
  if (
    hasExactLoc(answers, "Justo debajo de la rodilla (prominencia ósea)") ||
    hasLoc(answers, "prominencia") || hasLoc(answers, "tuberosidad")
  ) {
    push(
      "Prominencia ósea debajo de la rodilla",
      "Tibial tuberosity / below knee"
    );
  }
  if (hasLoc(answers, "Espinilla", "Cara interna", "Cara externa")) {
    push("Espinilla / periostio tibial", "Shin / tibial periosteum");
  }
  if (hasLoc(answers, "Pantorrilla")) {
    push("Pantorrilla / gemelos", "Calf / gastrocnemius");
  }
  if (hasLoc(answers, "Aquiles")) {
    push("Tendón de Aquiles", "Achilles tendon");
  }
  if (hasLoc(answers, "Tobillo") || hasLoc(answers, "Transición al tobillo")) {
    push("Tobillo", "Ankle");
  }
  if (
    hasLoc(
      answers,
      "Pie",
      "Planta",
      "Talón",
      "Dorso",
      "Dedos",
      "Parte delantera del pie",
      "Parte media del pie"
    )
  ) {
    push("Pie", "Foot");
  }

  if (parts.length > 0) return parts.join(", ");

  if (answers.region_focus === "foot") return locale === "en" ? "Foot" : "Pie";
  if (answers.region_focus === "ankle")
    return locale === "en" ? "Ankle" : "Tobillo";
  if (answers.region_focus === "lower_leg") {
    return locale === "en" ? "Lower leg" : "Pierna baja";
  }
  if (answers.region_focus === "leg") {
    return locale === "en"
      ? "Leg (location still vague)"
      : "Pierna (localización aún vaga)";
  }
  if (answers.region_focus === "thigh") {
    return locale === "en" ? "Thigh / hamstrings" : "Muslo / isquiotibiales";
  }
  return locale === "en"
    ? "Lower leg / ankle / foot"
    : "Pierna baja / tobillo / pie";
}

function differentialGuidanceForLocations(
  answers: LowerLegAdaptiveAnswers
): string[] {
  const lines: string[] = [
    "ORIENTACIÓN DIFERENCIAL (OBLIGATORIO — solo zonas marcadas en localización; NO inventar gemelos/Aquiles/espinilla si el paciente NO las marcó):",
    `Localización marcada por el paciente: ${formatMulti(locs(answers))}`,
  ];

  if (hasExactLoc(answers, "Muslo / encima de la rodilla") || hasLoc(answers, "Thigh", "muslo", "isquio", "cuádriceps")) {
    lines.push(
      "- Muslo / encima de la rodilla + correr o movimiento repetitivo → sobrecarga / lesión muscular de **cuádriceps** (recto femoral) o **isquiotibiales** (si es posterior). Hipótesis locales del MUSLO.",
      "- Muslo anterior + dolor al chutar, sentadilla o extensión resistida → cuádriceps / tendón cuadricipital.",
      "- Muslo posterior + pedrada al correr o dolor al estirar con rodilla estirada → isquiotibiales.",
      "- PROHIBIDO proponer gemelos, Aquiles, periostitis tibial o fractura por estrés de tibia: el paciente localizó el **muslo**."
    );
  }
  if (hasExactLoc(answers, "Rodilla")) {
    lines.push(
      "- Rodilla → diferenciales de **rodilla** (patelofemoral, menisco, tendón rotuliano, LCA/LCL según mecanismo). NO pantorrilla ni Aquiles salvo irradiación explícita."
    );
  }
  if (hasExactLoc(answers, "Justo debajo de la rodilla (prominencia ósea)")) {
    lines.push(
      "- Justo debajo de rodilla / tuberosidad tibial + salto/carga → Osgood-Schlatter / tendón rotuliano distal."
    );
  }
  if (hasLoc(answers, "Espinilla", "Cara interna")) {
    lines.push(
      "- Espinilla anterior o cara interna + dolor DIFUSO a lo largo del hueso + mejora al parar de correr → periostitis tibial / MTSS.",
      "- Espinilla + dolor PUNTUAL en un solo punto + persiste en reposo o empeora semana a semana → sospecha FRACTURA POR ESTRÉS.",
      "- Cara interna/espinilla + patrón que aparece con esfuerzo y CEDE al parar → considerar CECS vs MTSS."
    );
  }
  if (hasLoc(answers, "Pantorrilla")) {
    lines.push(
      "- Pantorrilla + inicio súbito + chasquido/'pedrada' → rotura/desgarro de gemelos (tennis leg).",
      "- Hinchazón súbita unilateral pantorrilla + rf_vascular → priorizar urgencia vascular (TVP)."
    );
  }
  if (hasLoc(answers, "Aquiles")) {
    lines.push(
      "- Aquiles + pedrada + NO puntillas + hueco palpable → sospecha ROTURA COMPLETA DE AQUILES (urgencia).",
      "- Aquiles + dolor progresivo, SÍ puede punta de pie, SIN hueco → tendinopatía aquílea."
    );
  }
  if (hasLoc(answers, "Tobillo", "Pie", "Planta", "Talón")) {
    lines.push(
      "- Tobillo/pie → esguince, fascitis, tendinopatías locales según subzona marcada; no inventar lesión de gemelos o muslo."
    );
  }

  lines.push(
    "- Dolor desproporcionado al estirar pasivamente dedos/tobillo + tensión extrema (rf_compartimental) → sospecha SÍNDROME COMPARTIMENTAL AGUDO (urgencia).",
    "- Hormigueo pie + zona neuro → atrapamiento nervioso periférico vs radicular."
  );

  return lines;
}

export function formatLowerLegAdaptive(
  answers: LowerLegAdaptiveAnswers,
  bodyMapText: string
): string {
  const { urgent, triggered } = detectLowerLegRedFlags(answers);
  const zoneLabel = bodyAreaLabelFromLowerLegAnswers(answers, "es");
  const lines: string[] = [
    `=== CUESTIONARIO ADAPTATIVO — ${zoneLabel.toUpperCase()} ===`,
    "",
    bodyMapText,
    "",
    `CRÍTICO — FIDELIDAD A LA LOCALIZACIÓN: El paciente localizó el dolor en: ${formatMulti(locs(answers)) || "(sin marcar)"}.`,
    `La zona clínica a orientar es «${zoneLabel}».`,
    "NO enumeres estructuras de OTRA zona de la pierna (p. ej. gemelos/Aquiles/espinilla si marcó muslo; muslo si marcó pantorrilla).",
    "En **Estructuras que podrían estar afectadas** y **Posibles lesiones** usa SOLO estructuras coherentes con esa localización.",
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
    `Incapacidad para apoyar/caminar: ${answers.rf_no_apoyo || "—"}`,
    `Hinchazón súbita pantorrilla: ${answers.rf_hinchazon_subita || "—"}`,
    `Pérdida sensibilidad pie: ${answers.rf_perdida_sensibilidad || "—"}`,
    `Fiebre: ${answers.rf_fiebre || "—"}`,
    `Sospecha vascular (dolor + hinchazón en una sola pierna): ${answers.rf_vascular || "—"}`,
    `Dolor desproporcionado con estiramiento pasivo + tensión extrema (sospecha compartimental agudo): ${answers.rf_compartimental || "—"}`,
    "",
    "— VARIABLES CLÍNICAS —",
    `Tiempo de evolución: ${answers.evolucion}`,
    `Forma de inicio: ${answers.inicio}`,
    `Mecanismo: ${answers.mecanismo.join(", ")}${answers.mecanismo.includes("Otro") && answers.mecanismo_otro ? ` (${answers.mecanismo_otro})` : ""}`,
    hasChasquidoQuestion(answers)
      ? `Chasquido/'pedrada' repentina durante el gesto: ${answers.inicio_chasquido}`
      : "",
    `Intensidad dolor: ${answers.intensidad_dolor}/10`,
    `Localización (${zoneLabel}): ${formatMulti(answers.localizacion_pierna)}`,
    `Dolor familiar (caminar/torcer/puntillas/primeros pasos): ${answers.dolor_familiar || "—"}`,
    answers.ottawa_dolor_oseo
      ? `Ottawa — dolor óseo (maléolo/navicular/base 5.º MT): ${answers.ottawa_dolor_oseo}`
      : "",
    `Tipo de dolor: ${formatMulti(answers.tipo_dolor)}`,
    `Limitación funcional (caminar/apoyo): ${answers.limitacion_funcional.join(", ") || "—"}`,
    `Irradiación: ${answers.irradiacion}${answers.irradiacion === "Sí" && answers.irradiacion_detalle ? ` — ${answers.irradiacion_detalle}` : ""}`,
    `Síntomas asociados: ${formatMulti(answers.sintomas_asociados)}`,
    `Movimientos agravantes: ${formatMulti(answers.movimientos_agravantes)}`,
  ];

  if (isTrauma(answers)) {
    lines.push(
      "",
      "— DETALLE TRAUMA —",
      `Detalle: ${answers.trauma_detalle}`,
      `Chasquido: ${answers.trauma_chasquido}`,
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
  if (answers.mecanismo.includes("Movimiento repetitivo / correr")) {
    lines.push(
      "",
      "— MOVIMIENTO REPETITIVO / CARRERA —",
      `Actividad: ${answers.repetitivo_actividad}`,
      `Frecuencia: ${answers.repetitivo_frecuencia}`
    );
  }
  if (hasNeuro(answers)) {
    lines.push(
      "",
      "— HORMIGUEO / ENTUMECIMIENTO —",
      `Zona: ${formatMulti(answers.neuro_zona)}`,
      `Constante: ${answers.neuro_constante}`
    );
  }
  if (hasSwelling(answers)) {
    lines.push(
      "",
      "— HINCHAZÓN / INFLAMACIÓN —",
      `Inicio: ${answers.hinchazon_inicio}`,
      `Progresión: ${answers.hinchazon_progresion}`,
      `Calor al tacto: ${answers.hinchazon_calor}`
    );
  }
  if (hasAchillesSection(answers)) {
    lines.push(
      "",
      "— TENDÓN DE AQUILES —",
      `Sensación de golpe/disparo en pantorrilla baja/talón: ${answers.aquiles_pedrada}`,
      `Puede ponerse de puntillas con esa pierna sola: ${answers.aquiles_puntillas}`,
      `Hueco o escalón palpable en el tendón: ${answers.aquiles_hueco}`
    );
  }
  if (hasShinDiscriminatorSection(answers)) {
    lines.push(
      "",
      "— CARACTERIZACIÓN DE LA ESPINILLA —",
      `Dolor puntual vs difuso: ${answers.espinilla_focal}`,
      `Patrón con reposo/semanas vs mejora al parar: ${answers.espinilla_reposo}`
    );
  }

  lines.push(
    "",
    "— ANTECEDENTES —",
    `Lesión previa pierna baja: ${answers.lesion_previa}${answers.lesion_previa === "Sí" && answers.lesion_previa_detalle ? ` — ${answers.lesion_previa_detalle}` : ""}`,
    "",
    "NOTA: El sistema recopila variables clínicas para estimar estructuras afectadas de la ZONA LOCALIZADA, no para diagnosticar.",
    "",
    ...differentialGuidanceForLocations(answers)
  );

  return lines.filter(Boolean).join("\n");
}

export function isLastLowerLegSection(
  answers: LowerLegAdaptiveAnswers,
  sectionIndex: number
): boolean {
  const sections = getVisibleLowerLegSections(answers);
  return sectionIndex >= sections.length - 1;
}

export const LOWER_LEG_LABEL_EN: Partial<Record<string, string>> = {
  rf_deformidad: "Is there an obvious deformity in the leg, shin, or ankle?",
  rf_no_apoyo: "Are you completely unable to bear weight or walk?",
  rf_hinchazon_subita: "Sudden, intense swelling of the calf?",
  rf_perdida_sensibilidad: "Loss of sensation in the foot?",
  rf_fiebre: "Do you have a fever along with the pain?",
  rf_vascular:
    "Calf pain with unilateral swelling (one leg only) that concerns you?",
  rf_compartimental:
    "Disproportionate pain that worsens when you stretch your toes or ankle, with extreme tightness in the calf/shin?",
  evolucion: "How long have you had this problem?",
  inicio: "How did it start?",
  mecanismo: "What may have caused it? (you can select several)",
  mecanismo_otro: "Tell us what happened or how it started",
  inicio_chasquido: "Did you notice a sudden snap or 'pop' during the movement?",
  intensidad_dolor: "Pain intensity (1–10)",
  localizacion_pierna:
    "Where do you feel the pain in the lower leg? (you can select several)",
  dolor_familiar:
    "Is it the same pain you notice when walking, twisting the ankle, going on tiptoes, or with the first steps in the morning?",
  ottawa_dolor_oseo:
    "Does it hurt to touch the ankle bone (behind or tip of the malleolus), the midfoot bone (navicular), or the base of the 5th metatarsal (outer border of the foot)?",
  tipo_dolor: "How would you describe the pain? (you can select several)",
  limitacion_funcional: "How much does it limit walking or weight-bearing?",
  irradiacion: "Does the pain spread to the foot, ankle, or another area?",
  irradiacion_detalle: "How far does that pain go?",
  sintomas_asociados: "What other symptoms do you notice? (you can select several)",
  movimientos_agravantes:
    "Which movements provoke or worsen it? (you can select several)",
  trauma_detalle: "Describe the blow or fall",
  trauma_chasquido: "Did you hear or feel a click or crack?",
  trauma_apoyo: "Could you keep bearing weight or walking afterwards?",
  entreno_ejercicio: "Which exercise or movement were you doing?",
  entreno_momento: "When did the pain appear?",
  entreno_carga: "What type of load were you using?",
  repetitivo_actividad: "Which repetitive or running activity triggers it?",
  repetitivo_frecuencia: "How often do you do that activity?",
  neuro_zona:
    "Which areas have tingling or numbness? (you can select several)",
  neuro_constante: "Is the tingling or numbness constant?",
  hinchazon_inicio: "When did the swelling or inflammation appear?",
  hinchazon_progresion: "Has the swelling increased, stayed the same, or gone down?",
  hinchazon_calor: "Is the area warm to the touch?",
  aquiles_pedrada:
    "Did it feel like you were struck or shot in the lower calf/heel?",
  aquiles_puntillas: "Can you rise onto tiptoes on that leg alone?",
  aquiles_hueco: "Do you notice a gap or step in the tendon when you touch it?",
  espinilla_focal:
    "Is the pain focal at one single point on the bone, or diffuse along the shin?",
  espinilla_reposo:
    "Does the pain persist at rest or worsen week by week, or does it improve when you stop running?",
  lesion_previa:
    "Have you had previous injuries in this leg, shin, calf, or Achilles?",
  lesion_previa_detalle: "Describe previous injuries or treatments",
};

export const LOWER_LEG_OPTION_EN = {
  No: "No",
  Sí: "Yes",
  "No, es distinto o solo duele en ciertos gestos": "No, it's different or only hurts with certain movements",
  "Ha sido ahora": "Just now",
  "Reciente (1-4 horas)": "Recent (1–4 hours)",
  "Menos de 48 horas": "Less than 48 hours",
  "Entre 2 y 7 días": "Between 2 and 7 days",
  "Entre 1 y 4 semanas": "Between 1 and 4 weeks",
  "Más de 1 mes": "More than 1 month",
  Repentino: "Sudden",
  "Poco a poco": "Gradual",
  Caída: "Fall",
  "Torcedura / inversión del tobillo": "Ankle twist / inversion",
  "Golpe directo": "Direct blow",
  "Sí, es el mismo": "Yes, it's the same",
  "No, es otra molestia": "No, it's a different discomfort",
  "No estoy seguro": "I'm not sure",
  "Entrenamiento o ejercicio": "Training or exercise",
  "Movimiento repetitivo / correr": "Repetitive movement / running",
  "Empezó poco a poco, sin causa clara": "Gradual onset with no clear cause",
  Otro: "Other",
  "Justo debajo de la rodilla (prominencia ósea)":
    "Just below the knee / tibial tuberosity",
  "Muslo / encima de la rodilla": "Thigh / above the knee",
  "Parte de atrás del muslo (isquiotibiales)": "Back of the thigh (hamstrings)",
  "Parte de delante del muslo (cuádriceps)": "Front of the thigh (quadriceps)",
  "Parte interna del muslo": "Inner thigh",
  "Parte externa del muslo": "Outer thigh",
  "Cerca del glúteo / isquion": "Near the buttock / sit bone",
  Rodilla: "Knee",
  Tobillo: "Ankle",
  "Pie / planta": "Foot / sole",
  "Espinilla anterior": "Anterior shin",
  "Cara interna": "Inner side (medial)",
  "Cara externa": "Outer side (lateral)",
  Pantorrilla: "Calf",
  "Tendón de Aquiles": "Achilles tendon",
  "Transición al tobillo": "Transition to the ankle",
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
  "Moderada (limita caminar o estar de pie)":
    "Moderate (limits walking or standing)",
  "Severa (cojeo o evito apoyar)": "Severe (limp or avoid weight-bearing)",
  "No puedo apoyar / caminar": "I can't bear weight / walk",
  "Hinchazón / inflamación": "Swelling / inflammation",
  Hematoma: "Bruising / hematoma",
  "Hormigueo o entumecimiento": "Tingling or numbness",
  Debilidad: "Weakness",
  Chasquido: "Clicking",
  Calor: "Warmth / heat",
  "Crujido al caminar": "Creaking when walking",
  Ninguno: "None",
  Caminar: "Walking",
  Correr: "Running",
  Saltar: "Jumping",
  "Subir / bajar escaleras": "Going up / down stairs",
  "Ponerse de puntillas": "Rising onto tiptoes",
  "Doblar el tobillo": "Flexing the ankle",
  "Estirar la pantorrilla": "Stretching the calf",
  "Tocar la zona": "Touching the area",
  "Primeros pasos al despertar": "First steps on waking",
  "Ninguno en particular": "None in particular",
  "Sí, pude seguir caminando": "Yes, I could keep walking",
  "Parcialmente / cojeando": "Partially / limping",
  "No, no pude apoyar": "No, I couldn't bear weight",
  "Durante el ejercicio": "During exercise",
  "Justo después": "Right afterwards",
  "Al día siguiente": "The next day",
  "Carga elevada": "Heavy load",
  "Carga moderada": "Moderate load",
  "Peso corporal": "Bodyweight",
  "Ejercicio de resistencia (mucho tiempo o muchas repeticiones)": "Endurance / resistance",
  "Pie completo": "Whole foot",
  "Dedos del pie": "Toes",
  "Planta del pie": "Sole of the foot",
  "Dorso del pie": "Top of the foot",
  "Planta del pie / arco": "Sole of the foot / arch",
  "Talón (debajo / inserción)": "Heel (underside / insertion)",
  "Talón (lateral o posterior)": "Heel (side or back)",
  "Parte media del pie": "Midfoot",
  "Parte delantera del pie / dedos": "Forefoot / toes",
  "Tobillo por fuera": "Ankle (outer / lateral side)",
  "Tobillo por dentro": "Ankle (inner / medial side)",
  "Parte anterior del tobillo": "Front of the ankle",
  "Parte posterior / Aquiles": "Back of the ankle / Achilles",
  "Transición a la pierna": "Transition to the lower leg",
  "Hacia el pie / planta": "Toward the foot / sole",
  Talón: "Heel",
  "Dedos / parte delantera del pie": "Toes / forefoot",
  Espinilla: "Shin",
  "Inmediata tras la lesión": "Immediate after the injury",
  "En las primeras horas": "Within the first hours",
  "Poco a poco en días": "Gradual over days",
  "Ha aumentado": "Has increased",
  "Se mantiene": "Stayed the same",
  "Ha bajado": "Has gone down",
  "No afecta": "Does not affect",
  Parcialmente: "Partially",
  "No puedo entrenar o competir": "I can't train or compete",
  Diariamente: "Daily",
  "Varias veces por semana": "Several times a week",
  Ocasionalmente: "Occasionally",
  "No, intermitente": "No, intermittent",
  "Sí, constante": "Yes, constant",
  "Puntual en un punto": "Focal, at one point",
  "Difuso a lo largo": "Diffuse, along the length",
  "Persiste/empeora en reposo o semanas": "Persists/worsens at rest or over weeks",
  "Mejora al parar": "Improves when stopping",
  Variable: "Variable",
  "Se ve torcido, deformado o muy distinto": "Is there an obvious deformity in the leg, shin, or ankle",
  "No puedes apoyar o caminar en absoluto": "Are you completely unable to bear weight or walk",
  "Hinchazón súbita e intensa de pantorrilla": "Sudden, intense swelling of the calf",
  "Pérdida de sensibilidad en el pie": "Loss of sensation in the foot",
  "Fiebre junto con el dolor": "Do you have a fever along with the pain",
  "Dolor de pantorrilla con hinchazón en una sola pierna (posible problema de circulación)": "Calf pain with unilateral swelling (one leg only) that concerns you",
  "Dolor mucho más fuerte de lo que parece al estirar dedos/tobillo, con tensión extrema (posible síndrome compartimental)": "Disproportionate pain that worsens when you stretch your toes or ankle, with extreme tightness in the calf/shin",
};

export const LOWER_LEG_SECTION_LABELS_EN: Record<string, string> = {
  red_flags: "Urgency check",
  core: "Problem characterization",
  trauma: "Trauma details",
  training: "Training details",
  repetitive: "Repetitive movement / running",
  neuro: "Tingling / numbness",
  swelling: "Swelling / inflammation",
  achilles: "Achilles tendon",
  shin_discriminator: "Shin characterization",
  history: "History",
};

export type ConsultLocale = "es" | "en";
export function localizeLowerLegLabel(
  id: string,
  fallback: string,
  locale: ConsultLocale
): string {
  if (locale !== "en") return fallback;
  return LOWER_LEG_LABEL_EN[id] ?? fallback;
}
export function localizeLowerLegOption(option: string, locale: ConsultLocale): string {
  if (locale !== "en") return option;
  return LOWER_LEG_OPTION_EN[option] ?? option;
}
export function localizeLowerLegSection(
  section: string,
  locale: ConsultLocale
): string {
  if (locale !== "en") return (LOWER_LEG_SECTION_LABELS as any)[section] ?? section;
  return (
    LOWER_LEG_SECTION_LABELS_EN[section] ??
    (LOWER_LEG_SECTION_LABELS as any)[section] ??
    section
  );
}
