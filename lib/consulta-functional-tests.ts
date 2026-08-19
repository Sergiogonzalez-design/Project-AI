/**
 * Patient-facing functional assessment questions by body region.
 * Drawn from Kinora knowledge "Functional Assessment" / special-test sections.
 * Structured bilingual protocols (e.g. quad) live in consulta-functional-protocols.ts.
 */

import { buildFunctionalProtocolPromptBlock, buildUniversalNonUrgentPathwayPrompt } from "@/lib/consulta-functional-protocols";

export type FunctionalRegionId =
  | "shoulder"
  | "elbow"
  | "wrist_hand"
  | "finger"
  | "cervical"
  | "thoracic"
  | "lumbar"
  | "pelvis"
  | "hip"
  | "knee"
  | "quad"
  | "hamstring"
  | "calf"
  | "achilles"
  | "adductor"
  | "biceps"
  | "pectoral"
  | "triceps"
  | "lower_leg"
  | "ankle"
  | "foot"
  | "generic";

/** Questions the AI may ask when the case is NOT urgent (no hospital now). */
export const FUNCTIONAL_TEST_QUESTIONS: Record<FunctionalRegionId, string[]> = {
  shoulder: [
    "¿Puedes elevar el brazo por encima de la cabeza sin dolor fuerte? (SÍ/NO)",
    "¿Puedes alcanzar la espalda sin dolor o bloqueo fuerte? (SÍ/NO)",
    "Con el brazo a 90°, ¿puedes rotar sin miedo a que se ‘salga’? (SÍ/NO)",
    "¿Aguantas un objeto ligero al frente 10–15 s sin dolor fuerte? (SÍ/NO)",
    "¿Al girar/inclinar la cabeza empeora el dolor del hombro o hay hormigueo? (SÍ/NO)",
  ],
  elbow: [
    "Con el codo estirado, ¿duele al cerrar el puño o girar un pomo? (SÍ/NO)",
    "¿Puedes flexionar y extender el codo completo vs el otro lado? (SÍ/NO)",
    "¿Duele al levantar la muñeca contra resistencia suave? (SÍ/NO)",
    "¿Duele al llevar peso con el codo casi estirado? (SÍ/NO)",
    "¿Al girar la cabeza empeora el dolor del codo o el hormigueo? (SÍ/NO)",
  ],
  wrist_hand: [
    "¿Puedes apoyar la palma y cargar un poco de peso sin dolor intenso? (SÍ/NO)",
    "¿Duele al girar una llave o abrir un tarro? (SÍ/NO)",
    "¿Puedes flexionar y extender la muñeca vs el otro lado? (SÍ/NO)",
    "En posición de rezo, ¿aparece hormigueo o dolor? (SÍ/NO)",
    "¿Puedes hacer un puño completo sin bloqueo? (SÍ/NO)",
  ],
  finger: [
    "¿Puedes hacer un puño completo y abrir la mano sin bloqueo? (SÍ/NO)",
    "Al pellizcar (pulgar–índice), ¿hay dolor, debilidad o inestabilidad? (SÍ/NO)",
    "¿Algún dedo se ‘traba’ o hace un chasquido al flexionar/extender? (SÍ/NO)",
    "¿Puedes separar y juntar los dedos con fuerza similar al otro lado? (SÍ/NO)",
  ],
  cervical: [
    "¿Puedes girar la cabeza a ambos lados sin dolor fuerte? (SÍ/NO)",
    "Al mirar arriba/abajo, ¿aparece mareo, visión borrosa o dolor al brazo? (SÍ/NO)",
    "¿Hay hormigueo, entumecimiento o debilidad en mano/brazo? (SÍ/NO)",
    "¿Aguantas 20–30 s mirando un poco arriba sin empeorar? (SÍ/NO)",
    "¿Al elevar brazos o llevar mochila empeora cuello/hormigueo? (SÍ/NO)",
  ],
  thoracic: [
    "¿Puedes girar el tronco sentado a ambos lados sin dolor en costillas/espalda media? (SÍ/NO)",
    "Al inspirar hondo o toser, ¿duele una costilla concreta? (SÍ/NO)",
    "¿Puedes elevar ambos brazos y juntar omoplatos sin pinzamiento? (SÍ/NO)",
  ],
  lumbar: [
    "¿Puedes inclinarte hacia delante y volver sin bloqueo ni dolor a la pierna? (SÍ/NO)",
    "¿Aguantas 20–30 s a la pata coja sin dolor lumbar intenso? (SÍ/NO)",
    "Al levantarte de una silla sin manos, ¿hay debilidad o dolor irradiado? (SÍ/NO)",
    "¿Caminar unos minutos empeora el dolor o el hormigueo? (SÍ/NO)",
    "¿Toser/estornudar aumenta el dolor que baja a la pierna? (SÍ/NO)",
  ],
  pelvis: [
    "Al apoyar solo una pierna, ¿hay inestabilidad o dolor en ingle/nalga/SI? (SÍ/NO)",
    "¿Duele al levantar una pierna estirada 20–30 cm tumbado? (SÍ/NO)",
    "Al subir un escalón, ¿aumenta el dolor en la pelvis o la ingle? (SÍ/NO)",
  ],
  hip: [
    "¿Puedes hacer una sentadilla parcial sin dolor fuerte en la ingle? (SÍ/NO)",
    "A la pata coja 20–30 s, ¿dolor en el costado de la cadera o cojera? (SÍ/NO)",
    "Tumbado de lado, ¿duele al levantar la pierna de arriba? (SÍ/NO)",
    "¿Duele al cruzar piernas o ponerte los calcetines? (SÍ/NO)",
    "Si es seguro: ¿puedes hacer un pequeño salto monopodal sin dolor inguinal fuerte? (SÍ/NO)",
  ],
  knee: [
    "¿Puedes flexionar y extender la rodilla completa vs la otra? (SÍ/NO)",
    "Al bajar un escalón despacio con la pierna afectada, ¿te duele la rodilla? (SÍ/NO)",
    "¿Aguantas 20–30 s a la pata coja sin que ‘falle’? (SÍ/NO)",
    "¿La rodilla se bloquea o no puedes estirarla del todo? (SÍ/NO)",
    "¿Duele también al ponerte calcetines o girar la cadera? (SÍ/NO)",
  ],
  /** Prefer structured QUAD_PROTOCOL when cuádriceps/muslo anterior. */
  quad: [
    "¿Duele al correr?",
    "¿Duele al pegar una patada o chutar un balón?",
    "¿Duele al hacer una extensión resistida?",
    "¿Duele al hacer una sentadilla?",
    "¿Hay hematoma?",
  ],
  /** Prefer structured HAMSTRING_PROTOCOL. */
  hamstring: [
    "¿Ibas corriendo y/o notaste una pedrada?",
    "¿Te llevaste la mano hacia atrás cuando lo notaste?",
    "¿Pudiste seguir corriendo?",
    "¿Estabas haciendo peso muerto con mucho peso?",
    "¿Duele al flexionar la rodilla?",
    "¿Duele al tocar la punta de los pies con la rodilla estirada?",
    "¿El dolor es fuerte (más de 4 sobre 10)?",
    "¿Duele al hacer curl nórdico?",
  ],
  /** Prefer structured CALF_PROTOCOL / ACHILLES_PROTOCOL (all SÍ/NO). */
  calf: [
    "¿Ibas corriendo y/o notaste una pedrada? (SÍ/NO)",
    "¿Has arrancado a correr repentinamente desde parado / en frío? (SÍ/NO)",
    "¿Puedes apoyar completamente el pie? (SÍ/NO)",
    "¿Has notado inflamación en la zona? (SÍ/NO)",
    "¿Tienes dolor al saltar? (SÍ/NO)",
    "¿Tienes dolor al estirar el gemelo? (SÍ/NO)",
    "¿Te duele al apoyar el talón sobre el suelo con los dedos al aire? (SÍ/NO)",
    "¿Te duele de puntillas? (SÍ/NO)",
  ],
  achilles: [
    "¿Ibas corriendo y/o notaste una pedrada? (SÍ/NO)",
    "¿Has arrancado a correr repentinamente desde parado / en frío? (SÍ/NO)",
    "¿Puedes apoyar completamente el pie? (SÍ/NO)",
    "¿Has notado inflamación en la zona? (SÍ/NO)",
    "¿Tienes dolor al saltar? (SÍ/NO)",
    "¿Tienes dolor al estirar el gemelo? (SÍ/NO)",
    "¿Te duele al apoyar el talón sobre el suelo con los dedos al aire? (SÍ/NO)",
    "¿Te duele de puntillas? (SÍ/NO)",
  ],
  /** Prefer structured ADDUCTOR_PROTOCOL (all SÍ/NO). */
  adductor: [
    "¿Duele al abrir lateralmente la pierna? (SÍ/NO)",
    "¿Duele al hacer el estiramiento mariposa desde sentado? (SÍ/NO)",
    "¿Duele al hacer una sentadilla profunda hasta el suelo? (SÍ/NO)",
    "¿Puedes comprimir una pelota con las piernas? (SÍ/NO)",
    "¿Duele al hacer la plancha de Copenhague? (SÍ/NO)",
  ],
  /** Prefer structured BICEPS_PROTOCOL (all SÍ/NO). Rotura grave → urgencias. */
  biceps: [
    "¿Has ido a coger un gran peso con el codo estirado? (SÍ/NO)",
    "¿Has notado como que crujiese o se partiese algo? (SÍ/NO)",
    "¿Se ha inflamado mucho? (SÍ/NO)",
    "¿Puedes flexionar el codo? (SÍ/NO)",
    "¿Puedes flexionar el codo con peso? (SÍ/NO)",
  ],
  /** Prefer structured PECTORAL_PROTOCOL (all SÍ/NO). Stepped retest if improving. */
  pectoral: [
    "¿Has notado un latigazo al hacer algún ejercicio de pecho? (SÍ/NO)",
    "¿Has podido seguir entrenando? (SÍ/NO)",
    "¿Puedes llevar el brazo atrás con el codo estirado sin dolor? (SÍ/NO)",
    "¿Puedes poner los brazos en forma de cruz sin un dolor fuerte? (SÍ/NO)",
    "¿Puedes hacer flexiones sin un dolor elevado? (SÍ/NO)",
  ],
  /** Prefer structured TRICEPS_PROTOCOL (all SÍ/NO). */
  triceps: [
    "¿Puedes estirar / flexionar el codo sin dolor? (SÍ/NO)",
    "¿Puedes hacer un fondo de tríceps (fondo con manos en diamante)? (SÍ/NO)",
    "¿Puedes hacer press de banca? (SÍ/NO)",
  ],
  lower_leg: [
    "¿Puedes caminar de puntillas y de talones unos metros sin dolor o fallo? (SÍ/NO)",
    "¿Duele o no puedes hacer elevaciones de talón (de puntillas) con la pierna afectada? (SÍ/NO)",
    "Tras actividad, ¿notas hinchazón tensa, hormigueo o dolor que aumenta mucho al esfuerzo y baja al parar? (SÍ/NO)",
  ],
  ankle: [
    "¿Puedes apoyar el pie completo y dar 4 pasos sin cojera marcada? (SÍ/NO)",
    "¿Duele o no puedes hacer elevaciones de talón a una sola pierna? (SÍ/NO)",
    "¿Aguantas 20–30 segundos a la pata coja sin dolor fuerte o inestabilidad? (SÍ/NO)",
    "¿Duele al tocar delante/debajo del maleolo lateral (tobillo por fuera) o el maleolo medial?",
    "Al caminar o girar, ¿notas que el tobillo “falla” o evitas el borde externo/interno del pie?",
    "Si el dolor es leve y es seguro: ¿hay inseguridad al aterrizar un pequeño salto a dos pies?",
  ],
  foot: [
    "¿Te duele mucho el primer paso de la mañana en el talón o el arco, y luego mejora al caminar?",
    "¿Duele la planta (cerca del talón) al extender el dedo gordo hacia arriba (Windlass casero)?",
    "¿Puedes hacer elevaciones de talón sin que el arco “colapse” o duela por dentro?",
    "Al apoyar el peso en el antepié (puntillas suaves), ¿duele entre los metatarsianos?",
    "¿Notas chasquido o dolor en el espacio entre los dedos al comprimir el antepié?",
  ],
  generic: [
    "¿Duele al mover la zona afectada? (SÍ/NO)",
    "¿Duele en reposo? (SÍ/NO)",
    "¿Sientes debilidad o inestabilidad al apoyar o cargar esa zona? (SÍ/NO)",
    "¿El dolor te impide hacer tus actividades habituales? (SÍ/NO)",
  ],
};

const REGION_ALIASES: { match: RegExp; id: FunctionalRegionId }[] = [
  { match: /tr[ií]ceps(?!\s*sural)|fondo\s*(de\s*)?tr[ií]ceps|manos\s*en\s*diamante/i, id: "triceps" },
  { match: /pectoral|p[eé]ctoral|pecho|chest|press\s*banca|bench\s*press/i, id: "pectoral" },
  { match: /b[ií]ceps(?!\s*femoral)|biceps\s*braquial|popeye/i, id: "biceps" },
  { match: /aquiles|achilles|tend[oó]n\s*(de\s*)?aquiles/i, id: "achilles" },
  { match: /gemelo|pantorrilla|calf|gastroc|s[oó]leo|tr[ií]ceps\s*sural/i, id: "calf" },
  { match: /gl[uú]teo|piriforme|buttock/i, id: "hamstring" },
  { match: /aductor|adductor|pubalgia|muslo\s*interno|inner\s*thigh|copenhague|copenhagen|mariposa|ingle/i, id: "adductor" },
  { match: /isquiotibial|isquio|hamstring|muslo\s*posterior|b[ií]ceps\s*femoral|corva/i, id: "hamstring" },
  { match: /cuadr[ií]ceps|cu[aá]driceps|quad(?:riceps)?|muslo(\s*anterior)?|thigh|recto\s*femoral/i, id: "quad" },
  { match: /hombro|shoulder|manguito/i, id: "shoulder" },
  { match: /codo|elbow|epicóndil/i, id: "elbow" },
  { match: /muñeca|muneca|wrist/i, id: "wrist_hand" },
  { match: /dedo|finger|pulgar|mano\b/i, id: "finger" },
  { match: /cervical|cuello|neck/i, id: "cervical" },
  { match: /torácic|toracic|dorsal|costilla|rib/i, id: "thoracic" },
  { match: /lumbar|lumbago|ciática|ciatica/i, id: "lumbar" },
  { match: /pelvis|sacro|sacroil/i, id: "pelvis" },
  { match: /cadera|hip/i, id: "hip" },
  { match: /rodilla|knee/i, id: "knee" },
  { match: /pantorrilla|pierna\s*baja|lower\s*leg|tibial/i, id: "lower_leg" },
  { match: /tobillo|ankle|esguince|maleolo|ankle_foot/i, id: "ankle" },
  { match: /pie\b|foot|fascitis|plantar|tal[oó]n|hallux|metatars/i, id: "foot" },
];

export function resolveFunctionalRegion(bodyArea: string): FunctionalRegionId {
  const text = bodyArea.trim();
  for (const { match, id } of REGION_ALIASES) {
    if (match.test(text)) return id;
  }
  return "generic";
}

/** Text block injected into the model prompt for non-urgent follow-up questions. */
export function buildFunctionalQuestionsPromptBlock(bodyArea: string): string {
  const region = resolveFunctionalRegion(bodyArea || "");
  const protocolBlock = buildFunctionalProtocolPromptBlock(bodyArea || "");
  const questions = FUNCTIONAL_TEST_QUESTIONS[region] ?? FUNCTIONAL_TEST_QUESTIONS.generic;

  const parts = [
    buildUniversalNonUrgentPathwayPrompt(bodyArea || ""),
    protocolBlock,
    `Banco de tests de valoración funcional para la zona "${bodyArea || region}" (región: ${region}).`,
    "Sigue siempre el PROTOCOLO UNIVERSAL: tests → reposo 24–36 h → retest → imagen adaptada si no mejora.",
    "CRÍTICO — DIFERENCIACIÓN KINORA: en la PRIMERA valoración no urgente DEBES incluir la sección **Pruebas funcionales** con 3–6 pruebas concretas de ESTE banco/protocolo, cada una como pregunta SÍ/NO. Frase introductoria: «Haz estas pruebas y pulsa Sí o No en cada una». NO pidas texto libre, escalas 1–10 ni comparar lados. Sin esa sección la respuesta está incompleta.",
    "LENGUAJE PARA EL PACIENTE (CRÍTICO): escribe cada prueba como pregunta cotidiana de SÍ/NO (p. ej. «¿Puedes elevar el brazo por encima de la cabeza sin dolor fuerte?»). NUNCA uses «Test de…» ni nombres clínicos (Neer, Hawkins, Spurling, Lachman, etc.). Si el banco trae jerga o una escala, tradúcela a SÍ/NO.",
    "PRIORIDAD: protocolo estructurado de la zona (si existe) > RAG Functional Assessment / Special Tests / Assessment Dossier > banco local:",
    ...questions.map((q, i) => `${i + 1}. ${q}`),
    "Si los documentos recuperados aportan tests más específicos, priorízalos y cita su fuente (salvo banco fijo del protocolo).",
  ].filter(Boolean);

  return parts.join("\n");
}
