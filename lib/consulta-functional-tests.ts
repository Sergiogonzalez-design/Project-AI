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
    "¿Puedes elevar el brazo por encima de la cabeza? ¿Hasta dónde llega y dónde duele más?",
    "Si intentas alcanzar la espalda (como abrocharte un sujetador / meter la camiseta), ¿duele o se bloquea?",
    "Con el brazo a 90°, ¿puedes rotar la palma hacia arriba y hacia atrás sin miedo a que se ‘salga’?",
    "¿Aguantas un objeto ligero con el brazo extendido al frente unos 10–15 segundos?",
    "Al hacer el gesto de peinarte o alcanzarte el cinturón de seguridad, ¿reaparece el dolor?",
    "Gira o inclina la cabeza: ¿empeora el dolor del hombro o aparece hormigueo en el brazo?",
  ],
  elbow: [
    "Con el codo estirado, ¿duele al cerrar el puño con fuerza o al girar un pomo?",
    "¿Puedes flexionar y extender el codo completo comparando con el otro lado?",
    "Si apoyas el codo y intentas levantar la muñeca contra una resistencia suave (mano de un familiar), ¿dónde duele?",
    "¿Duele al llevar peso (bolsa, botella) con el codo casi estirado?",
    "Gira la cabeza a derecha e izquierda: ¿te aparece o empeora el dolor del codo, el hormigueo o la molestia del brazo?",
    "Si miras un poco hacia arriba o hacia el ombligo, ¿el dolor del brazo/codo cambia?",
  ],
  wrist_hand: [
    "¿Puedes apoyar la palma y levantarte un poco del asiento (carga en muñeca) sin dolor intenso?",
    "Al girar una llave o abrir un tarro, ¿duele más el lado cubital (meñique) o radial (pulgar)?",
    "¿Puedes flexionar y extender la muñeca comparando ambos lados?",
    "Si juntas las manos en posición de rezo y bajas los codos, ¿aparece hormigueo o dolor?",
  ],
  finger: [
    "¿Puedes hacer un puño completo y abrir la mano sin bloqueo?",
    "Al pellizcar (pulgar–índice), ¿hay dolor, debilidad o inestabilidad?",
    "¿Algún dedo se ‘traba’ o hace un chasquido al flexionar/extender?",
    "Comparando con la otra mano, ¿puedes separar y juntar los dedos con fuerza similar?",
  ],
  cervical: [
    "Gira la cabeza a derecha e izquierda: ¿hasta dónde llegas y en qué lado duele más?",
    "Si miras al techo (extensión) o al ombligo (flexión), ¿aparece mareo, visión borrosa o dolor que baja al brazo?",
    "Con los brazos relajados, ¿notas hormigueo, entumecimiento o debilidad en alguna mano?",
    "¿Aguantas 20–30 segundos mirando un poco hacia arriba sin empeorar síntomas?",
  ],
  thoracic: [
    "¿Puedes girar el tronco sentado (brazos cruzados) a ambos lados sin dolor en costillas o espalda media?",
    "Al inspirar hondo o toser, ¿el dolor se localiza en una costilla concreta?",
    "¿Puedes elevar ambos brazos y juntar los omoplatos sin pinzamiento en la zona media?",
  ],
  lumbar: [
    "¿Puedes inclinarte hacia delante como para tocar las rodillas y volver sin bloqueo o dolor que baje a la pierna?",
    "De pie, ¿aguantas 20–30 segundos a la pata coja (pierna más afectada) sin dolor lumbar intenso?",
    "Al sentarte y levantarte de una silla sin usar las manos, ¿hay debilidad o dolor irradiado?",
    "¿Caminar unos minutos mejora, empeora o no cambia el dolor?",
  ],
  pelvis: [
    "Al apoyar solo una pierna, ¿notas inestabilidad o dolor en la ingle/nalga/SI?",
    "¿Puedes tumbarte y levantar una pierna estirada unos 20–30 cm sin dolor pélvico intenso?",
    "Al subir un escalón, ¿duele más al impulsar o al recibir el peso?",
  ],
  hip: [
    "¿Puedes hacer una sentadilla parcial (como sentarte en una silla alta) sin dolor fuerte en la ingle?",
    "De pie a la pata coja 20–30 s: ¿aparece dolor en el costado de la cadera o cojera?",
    "Tumbado de lado, ¿duele al levantar la pierna de arriba (separarla del cuerpo)?",
    "¿Duele más al cruzar las piernas o al ponerte los calcetines?",
  ],
  knee: [
    "¿Puedes flexionar y extender la rodilla completa comparando con la otra?",
    "Al bajar un escalón despacio con la pierna afectada, ¿duele delante, dentro o fuera?",
    "¿Aguantas 20–30 s a la pata coja sin que la rodilla ‘falle’ o se hinche después?",
    "Si la rodilla se bloquea o no puedes estirarla del todo, descríbelo con detalle.",
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
    "¿Cuánto duele del 1 al 10?",
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
    "¿Puedes caminar de puntillas y de talones unos metros? ¿Qué lado duele o falla?",
    "¿Cuántas elevaciones de talón (de puntillas) haces con la pierna afectada antes del dolor?",
    "Tras actividad, ¿notas hinchazón tensa, hormigueo o dolor que aumenta mucho al esfuerzo y baja al parar?",
  ],
  ankle: [
    "¿Puedes hacer elevaciones de talón a una sola pierna? ¿Cuántas y con qué altura respecto a la otra?",
    "¿Aguantas 20–30 s a la pata coja con ojos abiertos? ¿Y con ojos cerrados (solo si es seguro)?",
    "Al caminar, ¿evitas apoyar el borde externo o interno del pie?",
    "Si das un pequeño salto a dos pies (solo si el dolor es leve), ¿hay inseguridad al aterrizar?",
  ],
  foot: [
    "Al dar el primer paso por la mañana, ¿duele mucho en el talón o arco y luego mejora?",
    "¿Puedes hacer elevaciones de talón notando si el arco ‘colapsa’ o duele por dentro?",
    "Al apoyar el peso en el antepié (como de puntillas suaves), ¿duele entre los metatarsianos?",
    "¿Notas chasquido o dolor en el espacio entre los dedos al comprimir el antepié?",
  ],
  generic: [
    "En una escala 0–10, ¿qué te limita más ahora: dolor en reposo, dolor al mover, o debilidad/inestabilidad?",
    "¿Qué dos movimientos de la vida diaria empeoran más la molestia?",
    "Comparando con el lado sano, ¿qué porcentaje de función sientes (0–100%)?",
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
  { match: /cuadr[ií]ceps|cu[aá]driceps|quad(?:riceps)?|muslo\s*anterior|recto\s*femoral/i, id: "quad" },
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
  { match: /tobillo|ankle/i, id: "ankle" },
  { match: /pie\b|foot|fascitis|plantar/i, id: "foot" },
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
    "OBLIGATORIO en la primera valoración no urgente: incluye la sección **Pruebas funcionales** con estas (o equivalentes) y pide al paciente que las haga y te responda.",
    "PRIORIDAD: protocolo estructurado de la zona (si existe) > RAG Functional Assessment / Special Tests > banco local:",
    ...questions.map((q, i) => `${i + 1}. ${q}`),
    "Si los documentos recuperados aportan tests más específicos, priorízalos y cita su fuente (salvo banco fijo del protocolo).",
  ].filter(Boolean);

  return parts.join("\n");
}
