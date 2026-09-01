import {
  filterSleepDependentOptions,
  shouldShowSleepDependentQuestion,
} from "@/lib/consulta-timing";
/**
 * Adaptive questionnaire for knee pain — same structure as shoulder / neck / lower leg
 * (urgency → core → mechanism branches → neuro / swelling / instability → history).
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
  "Torsión / cambio de dirección",
  "Entrenamiento o ejercicio",
  "Movimiento repetitivo",
  "Empezó poco a poco, sin causa clara",
  "Otro",
] as const;

export const KNEE_LOCATION_OPTIONS = [
  "Cara anterior / rótula",
  "Cara interna (lado de dentro)",
  "Cara externa (lado de fuera)",
  "Hueco detrás de la rodilla",
  "Donde se juntan los huesos (línea de la articulación)",
  "Debajo de la rótula / tendón de la rótula",
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
  "Estirar del todo",
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
  "Ejercicio de resistencia (mucho tiempo o muchas repeticiones)",
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
  "Poco a poco en días",
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
  /** If true after red flags, skip remaining sections (urgency). */
  acortar_por_urgencia: boolean;
  // Core
  evolucion: string;
  inicio: string;
  mecanismo: string[];
  mecanismo_otro: string;
  intensidad_dolor: number;
  localizacion_rodilla: string[];
  dolor_familiar: string;
  tipo_dolor: string[];
  limitacion_funcional: string[];
  irradiacion: string;
  irradiacion_detalle: string;
  sintomas_asociados: string[];
  movimientos_agravantes: string[];
  // Anterior PFPS / patellar tendon branch
  anterior_escaleras_bajar: string;
  anterior_sentadilla: string;
  anterior_sentado_largo: string;
  anterior_saltar: string;
  anterior_palpacion_tendon: string;
  // Medial LCM / meniscus / pes anserinus branch
  medial_contacto: string;
  medial_linea_articular: string;
  medial_pes_anserino: string;
  medial_pivot_carga: string;
  medial_valgo_estres: string;
  // Lateral LCL / meniscus / ITB branch
  lateral_contacto: string;
  lateral_linea_articular: string;
  lateral_carrera_patron: string;
  lateral_pivot_carga: string;
  lateral_varo_estres: string;
  // Posterior / popliteal branch
  posterior_flexionar: string;
  posterior_bulto: string;
  posterior_bloqueo_flex: string;
  // Trauma branch
  trauma_detalle: string;
  trauma_chasquido: string;
  trauma_apoyo: string;
  trauma_pcl: string;
  // Twist branch
  torsion_detalle: string;
  torsion_chasquido: string;
  torsion_apoyo: string;
  // Instability / ACL cluster
  acl_sin_contacto: string;
  acl_pop: string;
  acl_continuar: string;
  acl_hinchazon_horas: string;
  acl_cede_giro: string;
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
  // Swelling branch
  hinchazon_inicio: string;
  hinchazon_progresion: string;
  hinchazon_calor: string;
  // Instability / locking branch
  inestabilidad_cede: string;
  bloqueo_tipo: string;
  bloqueo_desbloqueo: string;
  // Patellar instability branch
  rotula_desplaza: string;
  rotula_antes: string;
  rotula_recolocacion: string;
  // History
  lesion_previa: string;
  lesion_previa_detalle: string;
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
    acortar_por_urgencia: false,
    evolucion: "",
    inicio: "",
    mecanismo: [],
    mecanismo_otro: "",
    intensidad_dolor: 5,
    localizacion_rodilla: [],
    dolor_familiar: "",
    tipo_dolor: [],
    limitacion_funcional: [],
    irradiacion: "",
    irradiacion_detalle: "",
    sintomas_asociados: [],
    movimientos_agravantes: [],
    anterior_escaleras_bajar: "",
    anterior_sentadilla: "",
    anterior_sentado_largo: "",
    anterior_saltar: "",
    anterior_palpacion_tendon: "",
    medial_contacto: "",
    medial_linea_articular: "",
    medial_pes_anserino: "",
    medial_pivot_carga: "",
    medial_valgo_estres: "",
    lateral_contacto: "",
    lateral_linea_articular: "",
    lateral_carrera_patron: "",
    lateral_pivot_carga: "",
    lateral_varo_estres: "",
    posterior_flexionar: "",
    posterior_bulto: "",
    posterior_bloqueo_flex: "",
    trauma_detalle: "",
    trauma_chasquido: "",
    trauma_apoyo: "",
    trauma_pcl: "",
    torsion_detalle: "",
    torsion_chasquido: "",
    torsion_apoyo: "",
    acl_sin_contacto: "",
    acl_pop: "",
    acl_continuar: "",
    acl_hinchazon_horas: "",
    acl_cede_giro: "",
    entreno_ejercicio: "",
    entreno_momento: "",
    entreno_carga: "",
    repetitivo_actividad: "",
    repetitivo_frecuencia: "",
    itb_patron: "",
    neuro_zona: [],
    neuro_constante: "",
    hinchazon_inicio: "",
    hinchazon_progresion: "",
    hinchazon_calor: "",
    inestabilidad_cede: "",
    bloqueo_tipo: "",
    bloqueo_desbloqueo: "",
    rotula_desplaza: "",
    rotula_antes: "",
    rotula_recolocacion: "",
    lesion_previa: "",
    lesion_previa_detalle: "",
  };
}

export type KneeQuestionSection =
  | "red_flags"
  | "core"
  | "anterior_pfp"
  | "medial"
  | "lateral"
  | "posterior"
  | "trauma"
  | "twist"
  | "instability_acl"
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
    a.mecanismo.includes("Empezó poco a poco, sin causa clara")
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

function hasAnteriorPfpSection(a: KneeAdaptiveAnswers): boolean {
  return (
    a.localizacion_rodilla.includes("Cara anterior / rótula") ||
    a.localizacion_rodilla.includes("Debajo de la rótula / tendón de la rótula") ||
    a.localizacion_rodilla.includes("Por encima de la rótula")
  );
}

function hasMedialSection(a: KneeAdaptiveAnswers): boolean {
  return (
    a.localizacion_rodilla.includes("Cara interna (lado de dentro)") ||
    a.localizacion_rodilla.includes("Donde se juntan los huesos (línea de la articulación)")
  );
}

function hasLateralSection(a: KneeAdaptiveAnswers): boolean {
  return (
    a.localizacion_rodilla.includes("Cara externa (lado de fuera)") ||
    a.localizacion_rodilla.includes("Donde se juntan los huesos (línea de la articulación)")
  );
}

function hasAclSection(a: KneeAdaptiveAnswers): boolean {
  return isTwist(a) || hasInstability(a) || hasClickPop(a);
}

function hasPosteriorSection(a: KneeAdaptiveAnswers): boolean {
  return a.localizacion_rodilla.includes("Hueco detrás de la rodilla");
}

function isPatellarDislocation(a: KneeAdaptiveAnswers): boolean {
  return a.rotula_desplaza === "Sí";
}

function isLateralRunningMechanism(a: KneeAdaptiveAnswers): boolean {
  return (
    a.localizacion_rodilla.includes("Cara externa (lado de fuera)") &&
    (a.mecanismo.includes("Movimiento repetitivo") ||
      a.mecanismo.includes("Empezó poco a poco, sin causa clara"))
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
    label: "¿La rodilla se ve torcida, deformada o muy distinta de lo normal?",
    type: "single",
    options: YES_NO,
    required: true,
  },
  {
    id: "rf_no_apoyo",
    section: "red_flags",
    label: "¿Te resulta imposible apoyar peso o caminar?",
    type: "single",
    options: YES_NO,
    required: true,
  },
  {
    id: "rf_bloqueo",
    section: "red_flags",
    label: "¿La rodilla se queda trabada o no puedes estirarla del todo?",
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
    label: "¿Tienes fiebre junto con el dolor?",
    type: "single",
    options: YES_NO,
    required: true,
  },
  {
    id: "rf_vascular",
    section: "red_flags",
    label:
      "¿Dolor en pantorrilla con hinchazón (posible problema de circulación) que te preocupa?",
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

  // Core — localización y dolor familiar ANTES de mecanismo
  {
    id: "localizacion_rodilla",
    section: "core",
    label: "¿Dónde sientes el dolor en la rodilla? (puedes marcar varias)",
    type: "multi",
    options: KNEE_LOCATION_OPTIONS,
    required: true,
  },
  {
    id: "dolor_familiar",
    section: "core",
    label:
      "¿El dolor que describes es el mismo que notas al bajar escaleras, agacharte, correr o saltar?",
    type: "single",
    options: ["Sí, es el mismo", "No, es distinto o solo duele en ciertos gestos", "No estoy seguro"],
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
    label: "¿Cuánto te limita al caminar o apoyar? (puedes marcar varias)",
    type: "multi",
    options: FUNCTIONAL_LIMIT_OPTIONS,
    required: true,
  },
  {
    id: "irradiacion",
    section: "core",
    label: "¿El dolor se extiende hacia la pierna, pantorrilla o pie?",
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

  // Anterior PFPS / patellar tendon branch
  {
    id: "anterior_escaleras_bajar",
    section: "anterior_pfp",
    label: "¿Duele más al bajar escaleras que al subir?",
    type: "single",
    options: YES_NO,
    required: true,
    showIf: hasAnteriorPfpSection,
  },
  {
    id: "anterior_sentadilla",
    section: "anterior_pfp",
    label: "¿Duele al agacharte o levantarte de una silla?",
    type: "single",
    options: YES_NO,
    required: true,
    showIf: hasAnteriorPfpSection,
  },
  {
    id: "anterior_sentado_largo",
    section: "anterior_pfp",
    label: "¿Duele después de estar sentado mucho rato (al levantarte)?",
    type: "single",
    options: YES_NO,
    required: true,
    showIf: hasAnteriorPfpSection,
  },
  {
    id: "anterior_saltar",
    section: "anterior_pfp",
    label: "¿Duele al saltar, aterrizar o correr con impulso?",
    type: "single",
    options: YES_NO,
    required: true,
    showIf: hasAnteriorPfpSection,
  },
  {
    id: "anterior_palpacion_tendon",
    section: "anterior_pfp",
    label: "¿Duele si presionas justo debajo de la rótula (tendón)?",
    type: "single",
    options: YES_NO,
    required: true,
    showIf: hasAnteriorPfpSection,
  },

  // Medial LCM / meniscus / pes anserinus branch
  {
    id: "medial_contacto",
    section: "medial",
    label: "¿Te dolió por un golpe o contacto en la parte de dentro de la rodilla?",
    type: "single",
    options: YES_NO,
    required: true,
    showIf: hasMedialSection,
  },
  {
    id: "medial_linea_articular",
    section: "medial",
    label: "¿Duele en la línea de la articulación por dentro (donde se juntan los huesos)?",
    type: "single",
    options: YES_NO,
    required: true,
    showIf: hasMedialSection,
  },
  {
    id: "medial_pes_anserino",
    section: "medial",
    label:
      "¿Duele más abajo, en la zona interna bajo la rodilla (donde se sienten varios tendones)?",
    type: "single",
    options: YES_NO,
    required: true,
    showIf: hasMedialSection,
  },
  {
    id: "medial_pivot_carga",
    section: "medial",
    label: "¿Duele al girar o pivotar con el peso encima?",
    type: "single",
    options: YES_NO,
    required: true,
    showIf: hasMedialSection,
  },
  {
    id: "medial_valgo_estres",
    section: "medial",
    label:
      "¿Duele si alguien (o tú con la otra pierna) empuja suavemente la rodilla hacia dentro?",
    type: "single",
    options: YES_NO,
    required: true,
    showIf: hasMedialSection,
  },

  // Lateral LCL / meniscus / ITB branch
  {
    id: "lateral_contacto",
    section: "lateral",
    label: "¿Te dolió por un golpe o contacto en la parte de fuera de la rodilla?",
    type: "single",
    options: YES_NO,
    required: true,
    showIf: hasLateralSection,
  },
  {
    id: "lateral_linea_articular",
    section: "lateral",
    label: "¿Duele en la línea de la articulación por fuera (donde se juntan los huesos)?",
    type: "single",
    options: YES_NO,
    required: true,
    showIf: hasLateralSection,
  },
  {
    id: "lateral_carrera_patron",
    section: "lateral",
    label:
      "¿Duele al correr, sobre todo siempre a la misma distancia o al bajar escaleras/cuestas?",
    type: "single",
    options: YES_NO,
    required: true,
    showIf: hasLateralSection,
  },
  {
    id: "lateral_pivot_carga",
    section: "lateral",
    label: "¿Duele al girar o pivotar con el peso encima?",
    type: "single",
    options: YES_NO,
    required: true,
    showIf: hasLateralSection,
  },
  {
    id: "lateral_varo_estres",
    section: "lateral",
    label:
      "¿Duele si alguien (o tú con la otra pierna) empuja suavemente la rodilla hacia fuera?",
    type: "single",
    options: YES_NO,
    required: true,
    showIf: hasLateralSection,
  },

  // Posterior / popliteal branch
  {
    id: "posterior_flexionar",
    section: "posterior",
    label: "¿Duele más al doblar del todo la rodilla (hueco de detrás)?",
    type: "single",
    options: YES_NO,
    required: true,
    showIf: hasPosteriorSection,
  },
  {
    id: "posterior_bulto",
    section: "posterior",
    label: "¿Notas un bulto o pelota en la parte de detrás de la rodilla?",
    type: "single",
    options: YES_NO,
    required: true,
    showIf: hasPosteriorSection,
  },
  {
    id: "posterior_bloqueo_flex",
    section: "posterior",
    label: "¿Te cuesta doblarla del todo por tirantez o presión detrás?",
    type: "single",
    options: YES_NO,
    required: true,
    showIf: hasPosteriorSection,
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

  // Instability / ACL cluster
  {
    id: "acl_sin_contacto",
    section: "instability_acl",
    label: "¿Te torciste o cambiaste de dirección sin que te golpearan?",
    type: "single",
    options: YES_NO,
    required: true,
    showIf: hasAclSection,
  },
  {
    id: "acl_pop",
    section: "instability_acl",
    label: "¿Sentiste o escuchaste un «pop» o chasquido en el momento de la lesión?",
    type: "single",
    options: YES_NO,
    required: true,
    showIf: hasAclSection,
  },
  {
    id: "acl_continuar",
    section: "instability_acl",
    label: "¿Pudiste seguir jugando o entrenando después?",
    type: "single",
    options: YES_NO,
    required: true,
    showIf: hasAclSection,
  },
  {
    id: "acl_hinchazon_horas",
    section: "instability_acl",
    label: "¿Se hinchó mucho la rodilla en las primeras horas?",
    type: "single",
    options: YES_NO,
    required: true,
    showIf: hasAclSection,
  },
  {
    id: "acl_cede_giro",
    section: "instability_acl",
    label: "¿La rodilla cede o falla al girar o cambiar de dirección?",
    type: "single",
    options: YES_NO,
    required: true,
    showIf: hasAclSection,
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
  },  {
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
  },];

export const KNEE_SECTION_LABELS: Record<KneeQuestionSection, string> = {
  red_flags: "Comprobación de urgencia",
  core: "Caracterización del problema",
  anterior_pfp: "Dolor anterior / rótula / tendón",
  medial: "Dolor cara interna / LCM / menisco",
  lateral: "Dolor cara externa / LCL / ITB",
  posterior: "Hueco poplíteo / parte de detrás",
  trauma: "Detalles del golpe o la caída",
  twist: "Torsión / cambio de dirección",
  instability_acl: "Inestabilidad / LCA (pop, hinchazón, ceder)",
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
  "anterior_pfp",
  "medial",
  "lateral",
  "posterior",
  "trauma",
  "twist",
  "instability_acl",
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
  const list = KNEE_QUESTIONS.filter((q) => !q.showIf || q.showIf(answers)).map((q) => {
    if (!q.options?.length) return q;
    const filtered = filterSleepDependentOptions(q.options, answers.evolucion);
    if (filtered.length === q.options.length) return q;
    return { ...q, options: filtered };
  });
  // Urgent early exit: only red-flag items remain required / shown.
  if (answers.acortar_por_urgencia) {
    return list.filter((q) => q.section === "red_flags");
  }
  return list;
}

export function getVisibleKneeSections(
  answers: KneeAdaptiveAnswers
): KneeQuestionSection[] {
  if (answers.acortar_por_urgencia) return ["red_flags"];
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
    rf_deformidad: "Se ve torcido, deformado o muy distinto en rodilla",
    rf_no_apoyo: "Incapacidad para apoyar peso o caminar",
    rf_bloqueo: "Rodilla bloqueada / no puede estirar del todo",
    rf_hinchazon_subita: "Hinchazón súbita e intensa",
    rf_fiebre: "Fiebre junto con el dolor",
    rf_vascular: "Dolor de pantorrilla con hinchazón (posible problema de circulación)",
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

export function validateKneeAdaptive(answers: KneeAdaptiveAnswers): AdaptiveValidationIssue | null {
  const visible = getVisibleKneeQuestions(answers);
  for (const q of visible) {
    if (q.required !== false && !isAnswered(q, answers)) {
      return missingQuestionIssue(q);
    }
  }
  return null;
}

export function validateKneeSection(
  section: KneeQuestionSection,
  answers: KneeAdaptiveAnswers
): AdaptiveValidationIssue | null {
  const questions = getVisibleKneeQuestions(answers).filter(
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
    answers.acortar_por_urgencia
      ? "CUESTIONARIO ACORTADO POR URGENCIA — prioriza HOSPITAL / URGENCIAS; no pidas tests funcionales."
      : "",
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
    `Dolor familiar (mismo que en actividad): ${answers.dolor_familiar || "—"}`,
    `Tipo de dolor: ${formatMulti(answers.tipo_dolor)}`,
    `Limitación funcional: ${answers.limitacion_funcional.join(", ") || "—"}`,
    `Irradiación: ${answers.irradiacion}${answers.irradiacion === "Sí" && answers.irradiacion_detalle ? ` — ${answers.irradiacion_detalle}` : ""}`,
    `Síntomas asociados: ${formatMulti(answers.sintomas_asociados)}`,
    `Movimientos agravantes: ${formatMulti(answers.movimientos_agravantes)}`,
  ];

  if (hasAnteriorPfpSection(answers)) {
    lines.push(
      "",
      "— DOLOR ANTERIOR / RÓTULA / TENDÓN (PFPS / tendinopatía rotuliana) —",
      `Duele más al bajar escaleras: ${answers.anterior_escaleras_bajar}`,
      `Duele al agacharse/levantarse: ${answers.anterior_sentadilla}`,
      `Duele tras sentado prolongado: ${answers.anterior_sentado_largo}`,
      `Duele al saltar/aterrizar: ${answers.anterior_saltar}`,
      `Palpación tendón rotuliano dolorosa: ${answers.anterior_palpacion_tendon}`
    );
  }
  if (hasMedialSection(answers)) {
    lines.push(
      "",
      "— DOLOR MEDIAL (LCM / MENISCO / PES ANSERINO) —",
      `Golpe/contacto parte interna: ${answers.medial_contacto}`,
      `Dolor línea articular interna: ${answers.medial_linea_articular}`,
      `Dolor zona pes anserino (interna baja): ${answers.medial_pes_anserino}`,
      `Dolor al pivotar con carga: ${answers.medial_pivot_carga}`,
      `Dolor con estrés en valgo (empujar hacia dentro): ${answers.medial_valgo_estres}`
    );
  }
  if (hasLateralSection(answers)) {
    lines.push(
      "",
      "— DOLOR LATERAL (LCL / MENISCO / ITB) —",
      `Golpe/contacto parte externa: ${answers.lateral_contacto}`,
      `Dolor línea articular externa: ${answers.lateral_linea_articular}`,
      `Patrón carrera/escaleras/cuestas: ${answers.lateral_carrera_patron}`,
      `Dolor al pivotar con carga: ${answers.lateral_pivot_carga}`,
      `Dolor con estrés en varo (empujar hacia fuera): ${answers.lateral_varo_estres}`
    );
  }
  if (hasPosteriorSection(answers)) {
    lines.push(
      "",
      "— HUECO POPLÍTEO / POSTERIOR —",
      `Duele más al doblar del todo: ${answers.posterior_flexionar}`,
      `Bulto/pelota detrás de la rodilla: ${answers.posterior_bulto}`,
      `Tirantez/presión que impide doblar del todo: ${answers.posterior_bloqueo_flex}`
    );
  }
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
  if (hasAclSection(answers)) {
    lines.push(
      "",
      "— INESTABILIDAD / LCA (CLUSTER) —",
      `Torsión/corte sin contacto: ${answers.acl_sin_contacto}`,
      `Pop/chasquido en el momento: ${answers.acl_pop}`,
      `Pudo seguir jugando/entrenando: ${answers.acl_continuar}`,
      `Hinchazón intensa en las primeras horas: ${answers.acl_hinchazon_horas}`,
      `Cede/falla al girar o cambiar de dirección: ${answers.acl_cede_giro}`
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
      `Constante: ${answers.neuro_constante}`
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
      lines.push(`Rodilla cede/falla: ${answers.inestabilidad_cede}`);
    }
    if (hasLocking(answers)) {
      lines.push(
        `Tipo bloqueo: ${answers.bloqueo_tipo}`,
        `Desbloqueo: ${answers.bloqueo_desbloqueo}`
      );
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
    "",
    "NOTA: El sistema recopila variables clínicas para estimar estructuras afectadas (ligamentos, meniscos, cartílago, tendón, bursa, nervio), no para diagnosticar.",
    "",
    "ORIENTACIÓN DIFERENCIAL (usar el cuestionario; no inventar datos):",
    "- ÁRBOL MAESTRO PHYSIOGUIDE RODILLA: red flags → mecanismo (torsión/pop/LCA) → localización → rama (anterior / medial / lateral / posterior / inestabilidad) → coexistencia permitida.",
    "- Dolor familiar en escaleras/sentadilla/sentado → PFPS ↑ (NO = condromalacia confirmada).",
    "- Debajo rótula + salto + palpación tendón → tendinopatía rotuliana ↑.",
    "- Anterior SIN torsión/pop/bloqueo/hinchazón aguda → NO priorizar LCA/menisco sobre PFPS.",
    "- Torsión + pop + hinchazón en horas + no pudo continuar + cede al girar → LCA ↑ (NO confirmar rotura completa por un test).",
    "- Pop aislado o ceder por dolor SIN hinchazón/pop → NO = LCA confirmado (giving-way funcional / rotuliana / menisco).",
    "- Rótula se desplaza/sale de sitio → inestabilidad rotuliana, no LCA.",
    "- Bloqueo mecánico + línea articular + torsión → lesión meniscal (bloqueo) vs cuerpo libre.",
    "- Cara anterior / rótula + escaleras / agacharse / sentado → PFPS (síndrome femoropatelar) vs condromalacia.",
    "- Rótula se desplaza/sale de sitio (con o sin recolocación espontánea), especialmente si ya ocurrió antes → sospecha luxación/inestabilidad rotuliana recidivante.",
    "- Debajo rótula / tendón rotuliano + salto / carga → tendinopatía rotuliana (jumper's knee).",
    "- Cara interna + contacto/valgo → LCM ↑ (NO confirmar grado por un test).",
    "- Cara interna/línea articular + torsión + bloqueo → menisco medial ↑.",
    "- Zona interna baja (pes anserino) + carrera sin bloqueo → pes anserinus ↑.",
    "- Cara interna + trauma/contacto → LCM vs lesión meniscal medial (pueden coexistir).",
    "- Cara externa + contacto/varo → LCL ↑ (NO confirmar grado por un test).",
    "- Cara externa/línea articular + torsión + bloqueo → menisco lateral ↑.",
    "- Cara externa + carrera/escaleras/cuestas reproducible sin bloqueo → ITB ↑.",
    "- Cara externa + trauma/contacto → LCL vs lesión meniscal lateral (pueden coexistir).",
    "- Golpe directo en la espinilla con la rodilla flexionada (salpicadero, caída de rodillas) → mecanismo típico de lesión del LCP (ligamento cruzado posterior).",
    "- Incapacidad para levantar la pierna estirada tras el inicio (extensión activa contra gravedad) → sospecha rotura del mecanismo extensor (tendón rotuliano o cuadricipital) — URGENCIA, valorar cuanto antes.",
    "- Inicio progresivo + edad + rigidez matutina / escaleras → artrosis (OA) vs inflamación.",
    "- Hinchazón + calor + fiebre → artritis séptica / inflamatoria (priorizar urgencia).",
    "- Hueco poplíteo + bulto/limitación flexión → quiste de Baker ↑ (a menudo menisco/OA); torsión → menisco posterior; salpicadero → LCP.",
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
  rf_no_apoyo: "Is it impossible for you to put weight on the knee or walk?",
  rf_bloqueo: "Is the knee locked or unable to fully straighten?",
  rf_hinchazon_subita: "Sudden, intense swelling of the knee?",
  rf_fiebre: "Do you have a fever along with the pain?",
  rf_vascular: "Calf pain with swelling that concerns you (vascular concern)?",
  rf_perdida_sensibilidad: "Loss of sensation in the foot?",
  rf_extension_activa:
    "After it started, can you lift your leg straight (without bending the knee) unassisted?",
  evolucion: "How long have you had this problem?",
  inicio: "How did it start?",
  mecanismo: "What may have caused it? (you can select several)",
  mecanismo_otro: "Tell us what happened or how it started",
  intensidad_dolor: "Pain intensity (1–10)",
  localizacion_rodilla: "Where do you feel the pain in the knee? (you can select several)",
  tipo_dolor: "How would you describe the pain? (you can select several)",
  limitacion_funcional: "How much does it limit walking or weight-bearing?",
  irradiacion: "Does the pain spread to the leg, calf, or foot?",
  irradiacion_detalle: "How far does that pain go?",
  sintomas_asociados: "What other symptoms do you notice? (you can select several)",
  movimientos_agravantes: "Which movements provoke or worsen it? (you can select several)",
  dolor_familiar:
    "Is the pain you describe the same you feel when going down stairs, squatting, running, or jumping?",
  anterior_escaleras_bajar: "Does it hurt more going down stairs than going up?",
  anterior_sentadilla: "Does it hurt when squatting or standing up from a chair?",
  anterior_sentado_largo: "Does it hurt after sitting for a long time (when standing up)?",
  anterior_saltar: "Does it hurt when jumping, landing, or running with impact?",
  anterior_palpacion_tendon: "Does it hurt if you press just below the kneecap (tendon)?",
  medial_contacto: "Did a blow or contact on the inner side of the knee cause the pain?",
  medial_linea_articular: "Does it hurt on the inner joint line (where the bones meet)?",
  medial_pes_anserino:
    "Does it hurt lower down on the inner side below the knee (where several tendons meet)?",
  medial_pivot_carga: "Does it hurt when pivoting or turning with weight on the leg?",
  medial_valgo_estres:
    "Does it hurt if someone (or you with the other leg) gently pushes the knee inward?",
  lateral_contacto: "Did a blow or contact on the outer side of the knee cause the pain?",
  lateral_linea_articular: "Does it hurt on the outer joint line (where the bones meet)?",
  lateral_carrera_patron:
    "Does it hurt when running, especially always at the same distance or when going down stairs/hills?",
  lateral_pivot_carga: "Does it hurt when pivoting or turning with weight on the leg?",
  lateral_varo_estres:
    "Does it hurt if someone (or you with the other leg) gently pushes the knee outward?",
  posterior_flexionar: "Does it hurt more when fully bending the knee (hollow at the back)?",
  posterior_bulto: "Do you notice a lump or ball at the back of the knee?",
  posterior_bloqueo_flex:
    "Is it hard to fully bend because of tightness or pressure at the back?",
  trauma_detalle: "Describe the blow or fall",
  trauma_chasquido: "Did you hear or feel a click or pop?",
  trauma_apoyo: "Could you keep bearing weight or walking afterwards?",
  trauma_pcl:
    "Was the blow to the shin with the knee bent (e.g. dashboard injury, falling on your knees)?",
  torsion_detalle: "Describe the twist or change of direction",
  torsion_chasquido: "Did you hear or feel a click or pop?",
  torsion_apoyo: "Could you keep bearing weight or walking afterwards?",
  acl_sin_contacto:
    "Did you twist or change direction without being hit?",
  acl_pop: "Did you feel or hear a pop or click at the moment of injury?",
  acl_continuar: "Could you keep playing or training afterwards?",
  acl_hinchazon_horas: "Did the knee swell a lot within the first few hours?",
  acl_cede_giro: "Does the knee give way or fail when turning or changing direction?",
  entreno_ejercicio: "Which exercise or movement were you doing?",
  entreno_momento: "When did the pain appear?",
  entreno_carga: "What type of load were you using?",
  repetitivo_actividad: "Which repetitive or progressive activity triggers it?",
  repetitivo_frecuencia: "How often do you do that activity?",
  itb_patron:
    "Does it always appear at the same running distance or after going down stairs/hills?",
  neuro_zona: "Which areas have tingling or numbness? (you can select several)",
  neuro_constante: "Is the tingling or numbness constant?",
  hinchazon_inicio: "When did the swelling appear?",
  hinchazon_progresion: "Has the swelling increased, stayed the same, or gone down?",
  hinchazon_calor: "Is the area warm to the touch?",
  inestabilidad_cede: "Does the knee give way or fail when bearing weight or turning?",
  bloqueo_tipo: "What type of locking do you notice?",
  bloqueo_desbloqueo: "Can it unlock on its own or do you need help?",
  rotula_desplaza: "Do you feel like the kneecap shifts or has come out of place?",
  rotula_antes: "Has this happened before?",
  rotula_recolocacion: "Did it go back into place on its own?",
  lesion_previa: "Have you had previous injuries in this knee?",
  lesion_previa_detalle: "Describe previous injuries or treatments",
};

export const KNEE_OPTION_EN = {
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
  "Torsión / cambio de dirección": "Twist / change of direction",
  "Entrenamiento o ejercicio": "Training or exercise",
  "Movimiento repetitivo": "Repetitive movement",
  "Empezó poco a poco, sin causa clara": "Gradual onset with no clear cause",
  Otro: "Other",
  "Cara anterior / rótula": "Front / kneecap",
  "Cara interna (lado de dentro)": "Inner side (medial)",
  "Cara externa (lado de fuera)": "Outer side (lateral)",
  "Hueco detrás de la rodilla": "Hollow behind the knee",
  "Donde se juntan los huesos (línea de la articulación)": "Joint line",
  "Debajo de la rótula / tendón de la rótula": "Below kneecap / patellar tendon",
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
  "Estirar del todo": "Fully straightening",
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
  Tobillo: "Ankle",
  Pantorrilla: "Calf",
  "Cara anterior rodilla": "Front of knee",
  "Cara interna rodilla": "Inner knee",
  "Cara externa rodilla": "Outer knee",
  "Inmediata tras la lesión": "Immediate after the injury",
  "En las primeras horas": "Within the first hours",
  "Poco a poco en días": "Gradual over days",
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
  "Se ve torcido, deformado o muy distinto en rodilla": "Is there an obvious deformity in the knee",
  "Incapacidad para apoyar peso o caminar": "Is it impossible for you to put weight on the knee or walk",
  "Rodilla bloqueada / no puede estirar del todo": "Is the knee locked or unable to fully straighten",
  "Hinchazón súbita e intensa": "Sudden, intense swelling of the knee",
  "Fiebre junto con el dolor": "Do you have a fever along with the pain",
  "Dolor de pantorrilla con hinchazón (posible problema de circulación)": "Calf pain with swelling that concerns you (vascular concern)",
  "Pérdida de sensibilidad en el pie": "Loss of sensation in the foot",
  "Incapacidad para levantar la pierna estirada tras el inicio (sospecha rotura del mecanismo extensor: tendón rotuliano o cuadricipital)": "After it started, can you lift your leg straight (without bending the knee) unassisted",
};

export const KNEE_SECTION_LABELS_EN: Record<string, string> = {
  red_flags: "Urgency check",
  core: "Problem characterization",
  anterior_pfp: "Front / kneecap / tendon pain",
  medial: "Inner knee / MCL / meniscus",
  lateral: "Outer knee / LCL / ITB",
  posterior: "Hollow behind the knee / popliteal",
  trauma: "Trauma details",
  twist: "Twist / change of direction",
  instability_acl: "Instability / ACL (pop, swelling, giving way)",
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
