/**
 * Structured functional-test protocols (bilingual).
 * Spanish is the authoring language; English is for the EN locale / English UI.
 *
 * Universal non-urgent pathway (every region):
 * tests → 24–36 h rest → retest → imaging if still painful (adapted per region).
 */

export type AppLocale = "es" | "en";

export type LocalizedString = { es: string; en: string };

export type FunctionalYesNoItem = {
  id: string;
  kind?: "yesno";
  question: LocalizedString;
  /** Which answer counts as positive/concerning (default "yes"). */
  positiveWhen?: "yes" | "no";
};

export type FunctionalScaleItem = {
  id: string;
  kind: "scale";
  question: LocalizedString;
  /** Values >= this count as “positive / still hurts” for scoring */
  scalePositiveFrom: number;
  scaleMin?: number;
  scaleMax?: number;
};

export type FunctionalItem = FunctionalYesNoItem | FunctionalScaleItem;

export type FunctionalProtocolId =
  | "quad"
  | "hamstring"
  | "calf"
  | "achilles"
  | "adductor"
  | "biceps"
  | "pectoral"
  | "triceps";

export type FunctionalProtocol = {
  id: FunctionalProtocolId;
  /** Match body area / symptom text */
  match: RegExp;
  name: LocalizedString;
  /** Mechanism / history — ask on first pass (not required on retest) */
  historyItems?: FunctionalYesNoItem[];
  /** Movement tests — first pass + retest after 24–36 h */
  items: FunctionalItem[];
  /** e.g. 0.6 = 60% positive test answers → suspect injury */
  suspectThreshold: number;
  restHoursMin: number;
  restHoursMax: number;
  retestNotifyHours: number;
  ifRetestStillPositive: LocalizedString;
  restProtocolNote: LocalizedString;
  /** If present: skip rest/retest cycle and escalate (hospital / urgent imaging). */
  urgentRedFlagNote?: LocalizedString;
  /** Stepped pathway: pain improved on first retest → wait again then retest. */
  ifRetestImproved?: LocalizedString;
  /** Hours after first retest (or absolute from injury) for second check when improving. */
  secondRetestNotifyHours?: number;
  ifSecondRetestStillPositive?: LocalizedString;
  ifSecondRetestCleared?: LocalizedString;
  /** After a “normal” ultrasound, pain still same days later → second US elsewhere or MRI. */
  ifNegativeUltrasoundPersistentPain?: LocalizedString;
};

export function t(s: LocalizedString, locale: AppLocale): string {
  return locale === "en" ? s.en : s.es;
}

function isScaleItem(item: FunctionalItem): item is FunctionalScaleItem {
  return item.kind === "scale";
}

function formatItemLine(item: FunctionalItem, index: number): string {
  if (isScaleItem(item)) {
    const min = item.scaleMin ?? 1;
    const max = item.scaleMax ?? 10;
    return `${index}. [id=${item.id} scale=${min}-${max}] ES: ${item.question.es} | EN: ${item.question.en}`;
  }
  const polarity =
    item.positiveWhen === "no"
      ? " (SÍ/NO; positivo/preocupante si responde NO)"
      : " (SÍ/NO)";
  return `${index}. [id=${item.id}] ES: ${item.question.es} | EN: ${item.question.en}${polarity}`;
}

/** Especially common in gemelo / cuádriceps / isquiotibiales. */
export const NEGATIVE_US_PERSISTENT_PAIN_NOTE: LocalizedString = {
  es:
    "Si ya se hizo una ecografía y no se ve lesión clara, pero días después el dolor sigue igual: repetir la ecografía en otro centro (segunda opinión) o solicitar una resonancia magnética (RMN). Esto ocurre con frecuencia en gemelo, cuádriceps e isquiotibiales (lesiones a veces poco visibles en la primera eco).",
  en:
    "If an ultrasound was already done and nothing clear is injured, but days later the pain is still the same: get another ultrasound at a different clinic (second opinion) or request an MRI. This often happens with calf, quadriceps, and hamstring injuries (sometimes hard to see on the first US).",
};

/** Shared calf / Achilles battery (all yes/no). */
const CALF_ACHILLES_HISTORY: FunctionalYesNoItem[] = [
  {
    id: "hx_running_pedrada",
    question: {
      es: "¿Ibas corriendo y/o notaste una “pedrada”?",
      en: "Were you running and/or did you feel a sudden “stone-hit” sensation?",
    },
  },
  {
    id: "hx_sudden_cold_start",
    question: {
      es: "¿Has arrancado a correr repentinamente desde parado / en frío?",
      en: "Did you suddenly start running from a standstill / while cold?",
    },
  },
];

const CALF_ACHILLES_TESTS: FunctionalYesNoItem[] = [
  {
    id: "test_full_weight_bear",
    positiveWhen: "no",
    question: {
      es: "¿Puedes apoyar completamente el pie?",
      en: "Can you put your full weight on the foot?",
    },
  },
  {
    id: "test_inflammation",
    question: {
      es: "¿Has notado inflamación en la zona?",
      en: "Have you noticed swelling in the area?",
    },
  },
  {
    id: "test_pain_jumping",
    question: {
      es: "¿Tienes dolor al saltar?",
      en: "Do you have pain when jumping?",
    },
  },
  {
    id: "test_pain_stretch_calf",
    question: {
      es: "¿Tienes dolor al estirar el gemelo?",
      en: "Do you have pain when stretching the calf?",
    },
  },
  {
    id: "test_pain_heel_down_toes_up",
    question: {
      es: "¿Te duele al apoyar el talón sobre el suelo con los dedos al aire?",
      en: "Does it hurt when you place the heel on the floor with the toes lifted?",
    },
  },
  {
    id: "test_pain_tiptoes",
    question: {
      es: "¿Te duele de puntillas?",
      en: "Does it hurt when standing on tiptoes?",
    },
  },
];

/** Quadriceps battery — user-supplied clinical screening questions. */
export const QUAD_PROTOCOL: FunctionalProtocol = {
  id: "quad",
  match:
    /cuadr[ií]ceps|cu[aá]driceps|quad(?:riceps)?|muslo\s*anterior|anterior\s*thigh|recto\s*femoral|vast[oa]/i,
  name: {
    es: "Valoración funcional — Cuádriceps",
    en: "Functional assessment — Quadriceps",
  },
  items: [
    {
      id: "pain_running",
      question: {
        es: "¿Duele al correr?",
        en: "Does it hurt when running?",
      },
    },
    {
      id: "pain_kicking",
      question: {
        es: "¿Duele al pegar una patada o chutar un balón?",
        en: "Does it hurt when kicking a ball?",
      },
    },
    {
      id: "pain_resisted_extension",
      question: {
        es: "¿Duele al hacer una extensión resistida (estirar la rodilla contra resistencia)?",
        en: "Does it hurt with resisted knee extension?",
      },
    },
    {
      id: "pain_squat",
      question: {
        es: "¿Duele al hacer una sentadilla?",
        en: "Does it hurt when doing a squat?",
      },
    },
    {
      id: "hematoma",
      question: {
        es: "¿Hay hematoma (moratón) visible?",
        en: "Is there a visible bruise (hematoma)?",
      },
    },
  ],
  suspectThreshold: 0.6,
  restHoursMin: 24,
  restHoursMax: 36,
  retestNotifyHours: 36,
  restProtocolNote: {
    es:
      "Protocolo establecido: 24–36 h de reposo relativo (evitar correr, chutar y cargas que provoquen dolor). Luego repetir exactamente los mismos tests.",
    en:
      "Established protocol: 24–36 h of relative rest (avoid running, kicking, and painful loading). Then repeat exactly the same tests.",
  },
  ifRetestStillPositive: {
    es:
      "Si al repetir el test (tras 24–36 h) sigue doliendo de forma similar o empeora, recomendar ecografía (ultrasonido) para valorar el cuádriceps.",
    en:
      "If on retest (after 24–36 h) pain is similar or worse, recommend an ultrasound scan to assess the quadriceps.",
  },
  ifNegativeUltrasoundPersistentPain: NEGATIVE_US_PERSISTENT_PAIN_NOTE,
};

/** Hamstring / isquiotibiales — history + tests (user-supplied). */
export const HAMSTRING_PROTOCOL: FunctionalProtocol = {
  id: "hamstring",
  match:
    /isquiotibial|isquio|hamstring|femoral\s*posterior|muslo\s*posterior|parte\s*posterior\s*del\s*muslo|atr[aá]s\s*del\s*muslo|b[ií]ceps\s*femoral|semitend|semimembr|corva/i,
  name: {
    es: "Valoración funcional — Isquiotibiales (hamstring)",
    en: "Functional assessment — Hamstrings",
  },
  historyItems: [
    {
      id: "hx_running_pedrada",
      question: {
        es: "¿Ibas corriendo y/o notaste una “pedrada” (golpe brusco en el muslo posterior)?",
        en: "Were you running and/or did you feel a sudden “stone-hit” sensation in the back of the thigh?",
      },
    },
    {
      id: "hx_hand_back",
      question: {
        es: "¿Te llevaste la mano hacia atrás cuando lo notaste?",
        en: "Did you reach your hand toward the back of the thigh when you felt it?",
      },
    },
    {
      id: "hx_keep_running",
      question: {
        es: "¿Pudiste seguir corriendo después?",
        en: "Were you able to keep running afterward?",
      },
    },
    {
      id: "hx_deadlift_heavy",
      question: {
        es: "¿Estabas haciendo peso muerto con mucho peso?",
        en: "Were you doing a heavy deadlift?",
      },
    },
  ],
  items: [
    {
      id: "test_knee_flexion",
      question: {
        es: "¿Duele al flexionar la rodilla (llevar el talón hacia el glúteo)?",
        en: "Does it hurt when flexing the knee (heel toward the buttock)?",
      },
    },
    {
      id: "test_toe_touch_extended",
      question: {
        es: "¿Duele al tocar la punta de los pies con la rodilla estirada?",
        en: "Does it hurt when reaching for your toes with the knee straight?",
      },
    },
    {
      id: "pain_nprs",
      kind: "scale",
      scaleMin: 1,
      scaleMax: 10,
      scalePositiveFrom: 4,
      question: {
        es: "¿Cuánto duele del 1 al 10?",
        en: "How much does it hurt from 1 to 10?",
      },
    },
    {
      id: "test_nordic_curl",
      question: {
        es: "¿Duele al hacer curl nórdico (o el gesto de curl nórdico, aunque sea suave)?",
        en: "Does it hurt when doing a Nordic curl (or a gentle Nordic-curl motion)?",
      },
    },
  ],
  suspectThreshold: 0.5,
  restHoursMin: 24,
  restHoursMax: 36,
  retestNotifyHours: 36,
  restProtocolNote: {
    es:
      "Protocolo establecido: 24–36 h de reposo relativo (evitar sprint, estiramientos agresivos y peso muerto pesado). Luego repetir exactamente los mismos tests (flexión, punta de pies, dolor 1–10, curl nórdico).",
    en:
      "Established protocol: 24–36 h of relative rest (avoid sprinting, aggressive stretching, and heavy deadlifts). Then repeat exactly the same tests (knee flexion, toe touch, pain 1–10, Nordic curl).",
  },
  ifRetestStillPositive: {
    es:
      "Si al repetir los tests (tras ~36 h) sigue doliendo, recomendar ecografía (ultrasonido) de isquiotibiales.",
    en:
      "If on retest (after ~36 h) it still hurts, recommend an ultrasound of the hamstrings.",
  },
  ifNegativeUltrasoundPersistentPain: NEGATIVE_US_PERSISTENT_PAIN_NOTE,
};

/** Calf / gemelo — history + yes/no tests (user-supplied). */
export const CALF_PROTOCOL: FunctionalProtocol = {
  id: "calf",
  match:
    /gemelo|gemelos|pantorrilla|calf|gastroc|s[oó]leo|soleus|tr[ií]ceps\s*sural|pierna\s*baja(?!\s*anterior)/i,
  name: {
    es: "Valoración funcional — Gemelo (pantorrilla)",
    en: "Functional assessment — Calf",
  },
  historyItems: CALF_ACHILLES_HISTORY,
  items: CALF_ACHILLES_TESTS,
  suspectThreshold: 0.5,
  restHoursMin: 24,
  restHoursMax: 36,
  retestNotifyHours: 36,
  restProtocolNote: {
    es:
      "Protocolo establecido: 24–36 h de reposo relativo (evitar sprint, saltos y cargas que provoquen dolor). Luego repetir exactamente los mismos tests SÍ/NO.",
    en:
      "Established protocol: 24–36 h of relative rest (avoid sprinting, jumping, and painful loading). Then repeat exactly the same yes/no tests.",
  },
  ifRetestStillPositive: {
    es:
      "Si al repetir los tests (tras ~36 h) sigue doliendo, recomendar ecografía (ultrasonido) de gemelo / pantorrilla.",
    en:
      "If on retest (after ~36 h) it still hurts, recommend an ultrasound of the calf.",
  },
  ifNegativeUltrasoundPersistentPain: NEGATIVE_US_PERSISTENT_PAIN_NOTE,
};

/** Achilles — same yes/no battery; imaging targets the Achilles tendon. */
export const ACHILLES_PROTOCOL: FunctionalProtocol = {
  id: "achilles",
  match:
    /aquiles|aquilles|achilles|tend[oó]n\s*(de\s*)?aquiles|tend[oó]n\s*de\s*Aquiles/i,
  name: {
    es: "Valoración funcional — Tendón de Aquiles",
    en: "Functional assessment — Achilles tendon",
  },
  historyItems: CALF_ACHILLES_HISTORY,
  items: CALF_ACHILLES_TESTS,
  suspectThreshold: 0.5,
  restHoursMin: 24,
  restHoursMax: 36,
  retestNotifyHours: 36,
  restProtocolNote: {
    es:
      "Protocolo establecido: 24–36 h de reposo relativo (evitar sprint, saltos y cargas que provoquen dolor). Luego repetir exactamente los mismos tests SÍ/NO.",
    en:
      "Established protocol: 24–36 h of relative rest (avoid sprinting, jumping, and painful loading). Then repeat exactly the same yes/no tests.",
  },
  ifRetestStillPositive: {
    es:
      "Si al repetir los tests (tras ~36 h) sigue doliendo, recomendar ecografía (ultrasonido) del tendón de Aquiles.",
    en:
      "If on retest (after ~36 h) it still hurts, recommend an ultrasound of the Achilles tendon.",
  },
};

/** Adductor / aductor — yes/no tests (user-supplied). */
export const ADDUCTOR_PROTOCOL: FunctionalProtocol = {
  id: "adductor",
  match:
    /aductor|aductores|adductor|adductores|ingle\s*(media|interna)|pubalgia|oste[ií]tis\s*p[uú]bica|muslo\s*interno|inner\s*thigh/i,
  name: {
    es: "Valoración funcional — Aductores",
    en: "Functional assessment — Adductors",
  },
  items: [
    {
      id: "test_lateral_leg_open",
      question: {
        es: "¿Duele al abrir lateralmente la pierna?",
        en: "Does it hurt when opening the leg out to the side?",
      },
    },
    {
      id: "test_butterfly_stretch",
      question: {
        es: "¿Duele al hacer el estiramiento mariposa desde sentado?",
        en: "Does it hurt doing the butterfly stretch while seated?",
      },
    },
    {
      id: "test_deep_squat_floor",
      question: {
        es: "¿Duele al hacer una sentadilla profunda hasta el suelo?",
        en: "Does it hurt doing a deep squat all the way to the floor?",
      },
    },
    {
      id: "test_ball_squeeze",
      positiveWhen: "no",
      question: {
        es: "¿Puedes comprimir una pelota con las piernas?",
        en: "Can you squeeze a ball between your legs?",
      },
    },
    {
      id: "test_copenhagen_plank",
      question: {
        es: "¿Duele al hacer la plancha de Copenhague?",
        en: "Does it hurt doing the Copenhagen plank?",
      },
    },
  ],
  suspectThreshold: 0.6,
  restHoursMin: 24,
  restHoursMax: 36,
  retestNotifyHours: 36,
  restProtocolNote: {
    es:
      "Protocolo establecido: 24–36 h de reposo relativo (evitar abducciones forzadas, mariposa agresiva, sentadilla profunda y plancha de Copenhague si provocan dolor). Luego repetir exactamente los mismos tests SÍ/NO.",
    en:
      "Established protocol: 24–36 h of relative rest (avoid forced abduction, aggressive butterfly, deep squat, and Copenhagen plank if painful). Then repeat exactly the same yes/no tests.",
  },
  ifRetestStillPositive: {
    es:
      "Si al repetir los tests (tras ~36 h) el dolor sigue alto en esos estiramientos / gestos, recomendar ecografía (ultrasonido) de aductores.",
    en:
      "If on retest (after ~36 h) pain is still high on those stretches / movements, recommend an ultrasound of the adductors.",
  },
};

/** Biceps (arm) — yes/no tests; severe rupture → ER. */
export const BICEPS_PROTOCOL: FunctionalProtocol = {
  id: "biceps",
  match:
    /b[ií]ceps(?!\s*femoral)|biceps\s*braquial|braquial\s*anterior|popeye|tend[oó]n\s*distal\s*(del\s*)?b[ií]ceps/i,
  name: {
    es: "Valoración funcional — Bíceps",
    en: "Functional assessment — Biceps",
  },
  urgentRedFlagNote: {
    es:
      "URGENTE: si es evidente una rotura grave de bíceps (chasquido/rotura súbita + deformidad tipo Popeye + imposibilidad clara de flexionar + dolor muy intenso), mandar a urgencias / hospital ahora. No aplicar el ciclo de reposo 24–36 h en ese caso.",
    en:
      "URGENT: if a severe biceps rupture is evident (sudden pop/tear + Popeye deformity + clear inability to flex + very severe pain), send to the ER / hospital now. Do not use the 24–36 h rest cycle in that case.",
  },
  items: [
    {
      id: "hx_heavy_load_elbow_extended",
      question: {
        es: "¿Has ido a coger un gran peso con el codo estirado?",
        en: "Were you picking up a heavy weight with the elbow straight?",
      },
    },
    {
      id: "hx_pop_tear_sensation",
      question: {
        es: "¿Has notado como que crujiese o se partiese algo?",
        en: "Did you feel something crack or tear?",
      },
    },
    {
      id: "test_much_swelling",
      question: {
        es: "¿Se ha inflamado mucho?",
        en: "Has it swollen a lot?",
      },
    },
    {
      id: "test_can_flex_elbow",
      positiveWhen: "no",
      question: {
        es: "¿Puedes flexionar el codo?",
        en: "Can you bend (flex) the elbow?",
      },
    },
    {
      id: "test_can_flex_with_weight",
      positiveWhen: "no",
      question: {
        es: "¿Puedes flexionar el codo con peso?",
        en: "Can you bend the elbow while holding a weight?",
      },
    },
  ],
  suspectThreshold: 0.6,
  restHoursMin: 24,
  restHoursMax: 36,
  retestNotifyHours: 36,
  restProtocolNote: {
    es:
      "Protocolo establecido (solo si NO hay rotura evidente grave): 24–36 h de reposo relativo (evitar cargas con codo estirado y curls pesados). Luego repetir exactamente los mismos tests SÍ/NO.",
    en:
      "Established protocol (only if there is NO clear severe rupture): 24–36 h of relative rest (avoid loads with a straight elbow and heavy curls). Then repeat exactly the same yes/no tests.",
  },
  ifRetestStillPositive: {
    es:
      "Si al repetir los tests (tras ~36 h) sigue doliendo, recomendar ecografía (ultrasonido) de bíceps.",
    en:
      "If on retest (after ~36 h) it still hurts, recommend an ultrasound of the biceps.",
  },
};

/** Pectoral / pecho — yes/no tests with stepped retest if improving. */
export const PECTORAL_PROTOCOL: FunctionalProtocol = {
  id: "pectoral",
  match:
    /pectoral|p[eé]ctorales?|pecho|chest|press\s*banca|bench\s*press|flyes?|aperturas?/i,
  name: {
    es: "Valoración funcional — Pectoral",
    en: "Functional assessment — Pectoral (chest)",
  },
  items: [
    {
      id: "hx_whip_chest_exercise",
      question: {
        es: "¿Has notado un latigazo al hacer algún ejercicio de pecho?",
        en: "Did you feel a sudden whip-like snap while doing a chest exercise?",
      },
    },
    {
      id: "hx_keep_training",
      positiveWhen: "no",
      question: {
        es: "¿Has podido seguir entrenando?",
        en: "Were you able to keep training?",
      },
    },
    {
      id: "test_arm_back_elbow_straight",
      positiveWhen: "no",
      question: {
        es: "¿Puedes llevar el brazo atrás con el codo estirado sin dolor?",
        en: "Can you take the arm back with the elbow straight without pain?",
      },
    },
    {
      id: "test_arms_cross_shape",
      positiveWhen: "no",
      question: {
        es: "¿Puedes poner los brazos en forma de cruz sin un dolor fuerte?",
        en: "Can you hold your arms out in a cross (T-pose) without strong pain?",
      },
    },
    {
      id: "test_pushups_no_high_pain",
      positiveWhen: "no",
      question: {
        es: "¿Puedes hacer flexiones sin un dolor elevado?",
        en: "Can you do push-ups without high pain?",
      },
    },
  ],
  suspectThreshold: 0.6,
  restHoursMin: 24,
  restHoursMax: 36,
  retestNotifyHours: 36,
  secondRetestNotifyHours: 24,
  restProtocolNote: {
    es:
      "Si hay dolor en los tests: reposo relativo 24–36 h (evitar press de banca, aperturas y flexiones que provoquen dolor). Luego repetir exactamente los mismos tests SÍ/NO.",
    en:
      "If there is pain on the tests: 24–36 h of relative rest (avoid bench press, flyes, and push-ups that provoke pain). Then repeat exactly the same yes/no tests.",
  },
  ifRetestStillPositive: {
    es:
      "Si en el retest (~36 h) el dolor es igual o mayor → recomendar ecografía (ultrasonido) de pectoral.",
    en:
      "If on retest (~36 h) pain is the same or worse → recommend an ultrasound of the pectoral.",
  },
  ifRetestImproved: {
    es:
      "Si en el retest (~36 h) el dolor ha bajado → esperar ~24 h más, avisar con notificación y repetir otra vez los mismos tests SÍ/NO.",
    en:
      "If on retest (~36 h) pain has gone down → wait ~24 h more, notify, and repeat the same yes/no tests again.",
  },
  ifSecondRetestStillPositive: {
    es:
      "Si en el segundo retest (~24 h después) sigue doliendo → recomendar ecografía (ultrasonido) de pectoral.",
    en:
      "If on the second retest (~24 h later) it still hurts → recommend an ultrasound of the pectoral.",
  },
  ifSecondRetestCleared: {
    es:
      "Si en el segundo retest ya no duele → reposo relativo y hielo / frío local según tolerancia; vigilancia y retorno gradual al entrenamiento de pecho.",
    en:
      "If on the second retest there is no pain → relative rest and ice/cold as tolerated; monitor and gradually return to chest training.",
  },
};

/** Tríceps (brazo) — yes/no tests; standard rest → retest → ultrasound. */
export const TRICEPS_PROTOCOL: FunctionalProtocol = {
  id: "triceps",
  match:
    /tr[ií]ceps(?!\s*sural)|triceps\s*braquial|fondo\s*(de\s*)?tr[ií]ceps|diamond\s*push|manos\s*en\s*diamante/i,
  name: {
    es: "Valoración funcional — Tríceps",
    en: "Functional assessment — Triceps",
  },
  items: [
    {
      id: "test_elbow_extend_flex_painless",
      positiveWhen: "no",
      question: {
        es: "¿Puedes estirar / flexionar el codo sin dolor?",
        en: "Can you straighten / bend the elbow without pain?",
      },
    },
    {
      id: "test_triceps_dip_diamond",
      positiveWhen: "no",
      question: {
        es: "¿Puedes hacer un fondo de tríceps (fondo con manos en diamante)?",
        en: "Can you do a triceps dip (diamond-hand dip / diamond push-up position)?",
      },
    },
    {
      id: "test_bench_press",
      positiveWhen: "no",
      question: {
        es: "¿Puedes hacer press de banca?",
        en: "Can you do the bench press?",
      },
    },
  ],
  suspectThreshold: 0.67,
  restHoursMin: 24,
  restHoursMax: 36,
  retestNotifyHours: 36,
  restProtocolNote: {
    es:
      "Protocolo establecido: 24–36 h de reposo relativo (evitar fondos de tríceps, press de banca y cargas que provoquen dolor). Luego repetir exactamente los mismos tests SÍ/NO.",
    en:
      "Established protocol: 24–36 h of relative rest (avoid triceps dips, bench press, and painful loading). Then repeat exactly the same yes/no tests.",
  },
  ifRetestStillPositive: {
    es:
      "Si al repetir los tests (tras ~36 h) sigue doliendo, recomendar ecografía (ultrasonido) de tríceps.",
    en:
      "If on retest (after ~36 h) it still hurts, recommend an ultrasound of the triceps.",
  },
};

export const FUNCTIONAL_PROTOCOLS: FunctionalProtocol[] = [
  TRICEPS_PROTOCOL,
  PECTORAL_PROTOCOL,
  BICEPS_PROTOCOL,
  ACHILLES_PROTOCOL,
  CALF_PROTOCOL,
  ADDUCTOR_PROTOCOL,
  HAMSTRING_PROTOCOL,
  QUAD_PROTOCOL,
];

/** Default rest / retest timing for every non-urgent body region. */
export const UNIVERSAL_REST_HOURS = { min: 24, max: 36, notify: 36 } as const;

/** Imaging suggestion after a failed retest — adapt to body region. */
export function imagingAfterFailedRetest(
  bodyArea: string,
  locale: AppLocale
): string {
  const area = bodyArea.toLowerCase();
  const en = locale === "en";

  if (/tr[ií]ceps(?!\s*sural)|fondo\s*(de\s*)?tr[ií]ceps|manos\s*en\s*diamante/i.test(area)) {
    return en
      ? "Ultrasound (US) of the triceps."
      : "Ecografía (US) de tríceps.";
  }
  if (/pectoral|p[eé]ctoral|pecho|chest/i.test(area)) {
    return en
      ? "Ultrasound (US) of the pectoral (chest) muscle/tendon."
      : "Ecografía (US) de pectoral (músculo/tendón).";
  }
  if (/b[ií]ceps(?!\s*femoral)|biceps\s*braquial|popeye/i.test(area)) {
    return en
      ? "Ultrasound (US) of the biceps (tendon/muscle)."
      : "Ecografía (US) de bíceps (tendón/músculo).";
  }
  if (/aductor|adductor|pubalgia|muslo\s*interno|inner\s*thigh/i.test(area)) {
    return en
      ? "Ultrasound (US) of the adductors."
      : "Ecografía (US) de aductores.";
  }
  if (/aquiles|achilles|tend[oó]n\s*(de\s*)?aquiles/i.test(area)) {
    return en
      ? "Ultrasound (US) of the Achilles tendon."
      : "Ecografía (US) del tendón de Aquiles.";
  }
  if (/gemelo|pantorrilla|calf|gastroc|s[oó]leo/i.test(area)) {
    return en
      ? "Ultrasound (US) of the calf."
      : "Ecografía (US) de gemelo / pantorrilla.";
  }
  if (/isquio|hamstring|femoral\s*posterior|muslo\s*posterior|corva/i.test(area)) {
    return en
      ? "Ultrasound (US) of the hamstrings."
      : "Ecografía (US) de isquiotibiales.";
  }
  if (/cuadr|quad|muslo\s*anterior|tend[oó]n/i.test(area)) {
    return en
      ? "Ultrasound (US) to assess muscle/tendon."
      : "Ecografía (US) para valorar músculo/tendón.";
  }
  if (/hombro|shoulder|manguito|labrum\s*(glen|hombro)|SLAP/i.test(area)) {
    return en
      ? "Ultrasound and/or MRI for rotator cuff / soft tissue; X-ray if trauma. If labral tear is suspected: MRI, noting that MR arthrography (contrast) is more specific/precise than standard MRI for the labrum."
      : "Ecografía y/o RMN de manguito / partes blandas; RX si hubo traumatismo. Si sospecha de labrum: RMN, aclarando que la artro-RMN / artroresonancia (con contraste) es más específica y precisa que la RMN convencional para el labrum.";
  }
  if (/codo|elbow/i.test(area)) {
    return en
      ? "X-ray if trauma; ultrasound or MRI for tendon/ligament issues."
      : "RX si hubo traumatismo; ecografía o RMN si sospecha tendón/ligamento.";
  }
  if (/muñeca|muneca|wrist|mano|dedo|finger|hand/i.test(area)) {
    return en
      ? "X-ray first if trauma/fracture risk; ultrasound for tendons; MRI if still unclear."
      : "RX primero si trauma/riesgo de fractura; ecografía para tendones; RMN si sigue poco claro.";
  }
  if (/cuello|cervical|neck/i.test(area)) {
    return en
      ? "X-ray if significant trauma; MRI if arm pain/neurological symptoms persist."
      : "RX si traumatismo relevante; RMN si persiste dolor al brazo / síntomas neurológicos.";
  }
  if (/espalda|lumbar|dorsal|back|torácic/i.test(area)) {
    return en
      ? "X-ray if trauma/red-flag concern; MRI if radicular pain or no improvement."
      : "RX si trauma/alarma; RMN si dolor irradiado o no mejora.";
  }
  if (/cadera|hip|ingle|labrum\s*(acet|cadera)/i.test(area)) {
    return en
      ? "X-ray first; MRI if soft-tissue / bone-stress concern persists. If labral tear is suspected: MRI, noting that MR arthrography (contrast) is more specific/precise than standard MRI for the hip labrum."
      : "RX primero; RMN si persiste sospecha de partes blandas / estrés óseo. Si sospecha de labrum: RMN, aclarando que la artro-RMN / artroresonancia (con contraste) es más específica y precisa que la RMN convencional para el labrum de cadera.";
  }
  if (/rodilla|knee/i.test(area)) {
    return en
      ? "Ultrasound for quad/patellar tendon; X-ray if trauma; MRI for meniscus/ligaments if needed."
      : "Ecografía si cuádriceps/tendón rotuliano; RX si trauma; RMN si menisco/ligamentos.";
  }
  if (/tobillo|ankle|pie|foot|fascitis/i.test(area)) {
    return en
      ? "X-ray if Ottawa/trauma criteria; ultrasound for tendons; MRI if still limited."
      : "RX si criterios Ottawa/trauma; ecografía para tendones; RMN si sigue limitado.";
  }
  return en
    ? "Choose X-ray, ultrasound, or MRI based on trauma vs soft-tissue suspicion for this region."
    : "Elige RX, ecografía o RMN según sospecha ósea vs partes blandas en esta zona.";
}

/** Always injected: same pathway for every body part when not urgent. */
export function buildUniversalNonUrgentPathwayPrompt(bodyArea: string): string {
  const imagingEs = imagingAfterFailedRetest(bodyArea || "general", "es");
  const imagingEn = imagingAfterFailedRetest(bodyArea || "general", "en");
  return [
    "PROTOCOLO UNIVERSAL NO URGENTE (obligatorio en TODAS las zonas):",
    "1) OBLIGATORIO: pide **Pruebas funcionales** (3–6 tests concretos). El paciente debe hacerlas y responderte los resultados para orientar mejor qué tiene.",
    `2) Si los tests sugieren lesión/molestia relevante → reposo relativo ${UNIVERSAL_REST_HOURS.min}–${UNIVERSAL_REST_HOURS.max} h (frío/elevación si hay inflamación).`,
    `3) Retest: repetir los MISMOS tests tras ese plazo (aviso ~${UNIVERSAL_REST_HOURS.notify} h).`,
    "4) Si el retest no mejora o sigue doliendo → imagen adaptada a la zona (NO en la primera pasada, salvo urgencia).",
    `   Imagen sugerida para "${bodyArea || "esta zona"}": ES: ${imagingEs} | EN: ${imagingEn}`,
  ].join("\n");
}

export function generalRetestReminderCopy(
  locale: AppLocale,
  bodyArea: string
): { title: string; body: string } {
  const area =
    bodyArea.trim() || (locale === "en" ? "your injury" : "tu lesión");
  if (locale === "en") {
    return {
      title: `Repeat your ${area} tests`,
      body: `About 36 hours have passed. Open Kinora and repeat the same movement tests for ${area}. If it still hurts or has not improved, we may recommend imaging (X-ray, ultrasound, or MRI) for that area.`,
    };
  }
  return {
    title: `Repite los tests de ${area}`,
    body: `Han pasado ~36 h. Abre Kinora y repite las mismas pruebas de movimiento de ${area}. Si sigue doliendo o no ha mejorado, puede hacer falta una prueba de imagen (RX, eco o RMN) adaptada a esa zona.`,
  };
}

export function findFunctionalProtocol(
  text: string
): FunctionalProtocol | null {
  const hay = text.trim();
  if (!hay) return null;
  for (const p of FUNCTIONAL_PROTOCOLS) {
    if (p.match.test(hay)) return p;
  }
  return null;
}

/**
 * Resolve protocol from free text.
 * Prefer specific structures (triceps > pectoral > biceps > Achilles > calf > adductor > hamstring > quad).
 */
export function findFunctionalProtocolLoose(
  text: string
): FunctionalProtocol | null {
  const direct = findFunctionalProtocol(text);
  if (direct) return direct;

  if (
    /tr[ií]ceps(?!\s*sural)|fondo\s*(de\s*)?tr[ií]ceps|manos\s*en\s*diamante|diamond\s*push/i.test(
      text
    )
  ) {
    return TRICEPS_PROTOCOL;
  }

  if (
    /pectoral|p[eé]ctoral|pecho|chest|press\s*banca|bench\s*press|latigazo.*pecho|pecho.*latigazo/i.test(
      text
    )
  ) {
    return PECTORAL_PROTOCOL;
  }

  if (
    /b[ií]ceps(?!\s*femoral)|biceps\s*braquial|popeye|codo\s*estirado.*peso|peso.*codo\s*estirado/i.test(
      text
    )
  ) {
    return BICEPS_PROTOCOL;
  }

  if (/aquiles|achilles|tend[oó]n\s*(de\s*)?aquiles/i.test(text)) {
    return ACHILLES_PROTOCOL;
  }

  if (
    /gemelo|pantorrilla|calf|gastroc|s[oó]leo|tr[ií]ceps\s*sural|de\s*puntillas|estirar\s*el\s*gemelo/i.test(
      text
    )
  ) {
    return CALF_PROTOCOL;
  }

  if (
    /aductor|adductor|pubalgia|mariposa|copenhague|copenhagen|muslo\s*interno|inner\s*thigh|abrir\s*lateralmente/i.test(
      text
    )
  ) {
    return ADDUCTOR_PROTOCOL;
  }

  if (
    /isquio|hamstring|corva|muslo\s*atr[aá]s|posterior\s*thigh|peso\s*muerto|deadlift|n[oó]rdico|nordic|muslo\s*posterior/i.test(
      text
    )
  ) {
    return HAMSTRING_PROTOCOL;
  }

  if (
    /cuadr|quad|recto\s*femoral|muslo\s*anterior|sentadilla|squat|extensi[oó]n\s*resistida/i.test(
      text
    )
  ) {
    return QUAD_PROTOCOL;
  }

  return null;
}

export function yesThresholdCount(protocol: FunctionalProtocol): number {
  return Math.ceil(protocol.items.length * protocol.suspectThreshold);
}

export type ProtocolScore = {
  yesCount: number;
  total: number;
  ratio: number;
  suspectInjury: boolean;
  thresholdCount: number;
};

function isYesAnswer(
  raw: boolean | number | "Sí" | "No" | "yes" | "no" | string
): boolean {
  return (
    raw === true ||
    raw === "Sí" ||
    raw === "yes" ||
    String(raw).toLowerCase() === "si"
  );
}

function isNoAnswer(
  raw: boolean | number | "Sí" | "No" | "yes" | "no" | string
): boolean {
  return (
    raw === false ||
    raw === "No" ||
    raw === "no" ||
    String(raw).toLowerCase() === "no"
  );
}

function isPositiveAnswer(
  item: FunctionalItem,
  raw: boolean | number | "Sí" | "No" | "yes" | "no" | string
): boolean {
  if (isScaleItem(item)) {
    const n = typeof raw === "number" ? raw : Number(raw);
    if (!Number.isFinite(n)) return false;
    return n >= item.scalePositiveFrom;
  }
  if (item.positiveWhen === "no") {
    return isNoAnswer(raw);
  }
  return isYesAnswer(raw);
}

export function scoreProtocolAnswers(
  protocol: FunctionalProtocol,
  answers: Record<string, boolean | number | "Sí" | "No" | "yes" | "no" | "">
): ProtocolScore {
  let yesCount = 0;
  for (const item of protocol.items) {
    const raw = answers[item.id];
    if (raw === undefined || raw === "") continue;
    if (isPositiveAnswer(item, raw)) yesCount += 1;
  }
  const total = protocol.items.length;
  const ratio = total === 0 ? 0 : yesCount / total;
  const thresholdCount = yesThresholdCount(protocol);
  return {
    yesCount,
    total,
    ratio,
    suspectInjury: yesCount >= thresholdCount,
    thresholdCount,
  };
}

/** Prompt block for the AI (Spanish system; includes EN labels for bilingual apps). */
export function buildFunctionalProtocolPromptBlock(
  bodyArea: string,
  extraContext = ""
): string {
  const protocol = findFunctionalProtocolLoose(
    `${bodyArea}\n${extraContext}`
  );
  if (!protocol) return "";

  const thresholdCount = yesThresholdCount(protocol);
  const pct = Math.round(protocol.suspectThreshold * 100);
  const structureName =
    protocol.id === "hamstring"
      ? "isquiotibiales / hamstrings"
      : protocol.id === "quad"
        ? "cuádriceps / quadriceps"
        : protocol.id === "calf"
          ? "gemelo / calf"
          : protocol.id === "achilles"
            ? "tendón de Aquiles / Achilles"
            : protocol.id === "adductor"
              ? "aductores / adductors"
              : protocol.id === "biceps"
                ? "bíceps / biceps"
                : protocol.id === "pectoral"
                  ? "pectoral / chest"
                  : protocol.id === "triceps"
                    ? "tríceps / triceps"
                    : protocol.id;

  const lines = [
    `PROTOCOLO ESTRUCTURADO — ${protocol.name.es} / ${protocol.name.en}`,
    "IMPORTANTE: todas las preguntas de este protocolo son SÍ/NO (mejor contexto para la IA; no uses escalas abiertas salvo que un ítem indique scale=).",
    "Ortografía ES: cada pregunta en español debe empezar por ¿ y terminar en ?; respeta tildes (algún, atrás, etc.).",
  ];

  if (protocol.urgentRedFlagNote) {
    lines.push(
      `BANDERA ROJA / URGENCIA: ${protocol.urgentRedFlagNote.es}`,
      `EN: ${protocol.urgentRedFlagNote.en}`
    );
  }

  if (protocol.historyItems?.length) {
    lines.push(
      "HISTORIA / MECANISMO (primera pasada; SÍ/NO; no hace falta repetir en el retest si ya respondió):"
    );
    protocol.historyItems.forEach((item, i) => {
      lines.push(formatItemLine(item, i + 1));
    });
    lines.push("");
  }

  lines.push(
    "TESTS SÍ/NO (primera pasada Y retests — usar exactamente estos; idioma del usuario ES o EN):"
  );
  protocol.items.forEach((item, i) => {
    lines.push(formatItemLine(item, i + 1));
  });

  lines.push(
    "",
    `PUNTUACIÓN (tests): si ≥ ${thresholdCount} de ${protocol.items.length} positivos (~${pct}%+; en escalas 1–10 cuenta positivo si ≥ umbral indicado; si el ítem marca “positivo si NO”, cuenta la respuesta NO), sospecha de lesión de ${structureName}.`,
    "Historia sugerente refuerza la sospecha aunque el umbral de tests sea límite.",
    "SI SOSPECHA (primera pasada) y NO hay bandera roja de urgencia:",
    `- ${protocol.restProtocolNote.es}`,
    `- EN: ${protocol.restProtocolNote.en}`,
    `- Indica que Kinora le recordará (~${protocol.retestNotifyHours} h) para repetir los MISMOS tests.`,
    "- NO pidas imagen todavía en la primera pasada (salvo banderas rojas / urgencia).",
    "SI ES RETEST (tras reposo 24–36 h) y el dolor es igual o mayor / tests positivos:",
    `- ${protocol.ifRetestStillPositive.es}`,
    `- EN: ${protocol.ifRetestStillPositive.en}`
  );

  if (protocol.ifRetestImproved) {
    lines.push(
      "SI ES RETEST y el dolor HA BAJADO:",
      `- ${protocol.ifRetestImproved.es}`,
      `- EN: ${protocol.ifRetestImproved.en}`
    );
    if (protocol.secondRetestNotifyHours != null) {
      lines.push(
        `- Kinora puede avisar de nuevo ~${protocol.secondRetestNotifyHours} h después de esa mejora para el segundo retest.`
      );
    }
  }
  if (protocol.ifSecondRetestStillPositive) {
    lines.push(
      "SI ES SEGUNDO RETEST y sigue doliendo:",
      `- ${protocol.ifSecondRetestStillPositive.es}`,
      `- EN: ${protocol.ifSecondRetestStillPositive.en}`
    );
  }
  if (protocol.ifSecondRetestCleared) {
    lines.push(
      "SI ES SEGUNDO RETEST y ya no duele:",
      `- ${protocol.ifSecondRetestCleared.es}`,
      `- EN: ${protocol.ifSecondRetestCleared.en}`
    );
  }

  if (protocol.ifNegativeUltrasoundPersistentPain) {
    lines.push(
      "SI YA HUBO ECOGRAFÍA “NORMAL” Y DÍAS DESPUÉS EL DOLOR SIGUE IGUAL:",
      `- ${protocol.ifNegativeUltrasoundPersistentPain.es}`,
      `- EN: ${protocol.ifNegativeUltrasoundPersistentPain.en}`
    );
  }

  return lines.join("\n");
}

export function quadRetestReminderCopy(locale: AppLocale): {
  title: string;
  body: string;
} {
  if (locale === "en") {
    return {
      title: "Repeat your quadriceps test",
      body:
        "36 hours have passed. Open Kinora and answer the same 5 questions again (running, kicking, resisted extension, squat, bruise). If it still hurts, we may recommend an ultrasound.",
    };
  }
  return {
    title: "Repite el test de cuádriceps",
    body:
      "Han pasado ~36 h. Abre Kinora y responde otra vez las mismas 5 preguntas (correr, chutar, extensión resistida, sentadilla, hematoma). Si sigue doliendo, puede hacer falta una ecografía.",
  };
}

export function hamstringRetestReminderCopy(locale: AppLocale): {
  title: string;
  body: string;
} {
  if (locale === "en") {
    return {
      title: "Repeat your hamstring tests",
      body:
        "36 hours have passed. Open Kinora and repeat the same tests (knee flexion, toe touch with straight knee, pain 1–10, Nordic curl). If it still hurts, we may recommend an ultrasound.",
    };
  }
  return {
    title: "Repite los tests de isquiotibiales",
    body:
      "Han pasado ~36 h. Abre Kinora y repite los mismos tests (flexionar rodilla, tocar punta de los pies con rodilla estirada, dolor 1–10, curl nórdico). Si sigue doliendo, puede hacer falta una ecografía.",
  };
}

export function calfRetestReminderCopy(locale: AppLocale): {
  title: string;
  body: string;
} {
  if (locale === "en") {
    return {
      title: "Repeat your calf tests",
      body:
        "36 hours have passed. Open Kinora and answer the same yes/no tests again (full weight-bearing, swelling, jumping, calf stretch, heel down/toes up, tiptoes). If it still hurts, we may recommend an ultrasound.",
    };
  }
  return {
    title: "Repite los tests de gemelo",
    body:
      "Han pasado ~36 h. Abre Kinora y responde otra vez los mismos tests SÍ/NO (apoyo completo, inflamación, saltar, estirar gemelo, talón con dedos al aire, puntillas). Si sigue doliendo, puede hacer falta una ecografía.",
  };
}

export function achillesRetestReminderCopy(locale: AppLocale): {
  title: string;
  body: string;
} {
  if (locale === "en") {
    return {
      title: "Repeat your Achilles tests",
      body:
        "36 hours have passed. Open Kinora and answer the same yes/no tests again (full weight-bearing, swelling, jumping, calf stretch, heel down/toes up, tiptoes). If it still hurts, we may recommend an ultrasound of the Achilles.",
    };
  }
  return {
    title: "Repite los tests de Aquiles",
    body:
      "Han pasado ~36 h. Abre Kinora y responde otra vez los mismos tests SÍ/NO (apoyo completo, inflamación, saltar, estirar gemelo, talón con dedos al aire, puntillas). Si sigue doliendo, puede hacer falta una ecografía de Aquiles.",
  };
}

export function adductorRetestReminderCopy(locale: AppLocale): {
  title: string;
  body: string;
} {
  if (locale === "en") {
    return {
      title: "Repeat your adductor tests",
      body:
        "36 hours have passed. Open Kinora and answer the same yes/no tests again (side leg open, butterfly stretch, deep squat, ball squeeze, Copenhagen plank). If pain is still high on those stretches, we may recommend an ultrasound.",
    };
  }
  return {
    title: "Repite los tests de aductores",
    body:
      "Han pasado ~36 h. Abre Kinora y responde otra vez los mismos tests SÍ/NO (abrir pierna, mariposa, sentadilla profunda, comprimir pelota, plancha Copenhague). Si el dolor sigue alto en esos estiramientos, puede hacer falta una ecografía.",
  };
}

export function bicepsRetestReminderCopy(locale: AppLocale): {
  title: string;
  body: string;
} {
  if (locale === "en") {
    return {
      title: "Repeat your biceps tests",
      body:
        "36 hours have passed. Open Kinora and answer the same yes/no tests again (heavy lift with straight elbow, pop/tear, swelling, elbow flexion, flexion with weight). If it still hurts, we may recommend an ultrasound.",
    };
  }
  return {
    title: "Repite los tests de bíceps",
    body:
      "Han pasado ~36 h. Abre Kinora y responde otra vez los mismos tests SÍ/NO (peso con codo estirado, crujido/rotura, inflamación, flexionar codo, flexionar con peso). Si sigue doliendo, puede hacer falta una ecografía.",
  };
}

export function pectoralRetestReminderCopy(locale: AppLocale): {
  title: string;
  body: string;
} {
  if (locale === "en") {
    return {
      title: "Repeat your pectoral tests",
      body:
        "36 hours have passed. Open Kinora and answer the same yes/no tests again (chest whip, keep training, arm back, arms in a cross, push-ups). If pain is the same or worse, we may recommend an ultrasound. If pain went down, retest again in about 24 hours.",
    };
  }
  return {
    title: "Repite los tests de pectoral",
    body:
      "Han pasado ~36 h. Abre Kinora y responde otra vez los mismos tests SÍ/NO (latigazo en pecho, seguir entrenando, brazo atrás, brazos en cruz, flexiones). Si el dolor es igual o mayor, puede hacer falta una ecografía. Si ha bajado, vuelve a testear en ~24 h.",
  };
}

export function pectoralSecondRetestReminderCopy(locale: AppLocale): {
  title: string;
  body: string;
} {
  if (locale === "en") {
    return {
      title: "Second pectoral check",
      body:
        "About 24 hours after your improved retest. Open Kinora and repeat the same yes/no pectoral tests. If it still hurts, we may recommend an ultrasound. If pain-free, rest and ice.",
    };
  }
  return {
    title: "Segundo control de pectoral",
    body:
      "Han pasado ~24 h tras la mejora. Abre Kinora y repite los mismos tests SÍ/NO de pectoral. Si sigue doliendo, puede hacer falta una ecografía. Si ya no duele, reposo y hielo.",
  };
}

export function tricepsRetestReminderCopy(locale: AppLocale): {
  title: string;
  body: string;
} {
  if (locale === "en") {
    return {
      title: "Repeat your triceps tests",
      body:
        "36 hours have passed. Open Kinora and answer the same yes/no tests again (elbow straighten/bend without pain, triceps dip / diamond hands, bench press). If it still hurts, we may recommend an ultrasound.",
    };
  }
  return {
    title: "Repite los tests de tríceps",
    body:
      "Han pasado ~36 h. Abre Kinora y responde otra vez los mismos tests SÍ/NO (estirar/flexionar el codo sin dolor, fondo de tríceps con manos en diamante, press de banca). Si sigue doliendo, puede hacer falta una ecografía.",
  };
}
