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
  | "triceps"
  | "ankle"
  | "foot"
  | "shoulder"
  | "elbow"
  | "wrist_hand"
  | "knee"
  | "hip"
  | "lumbar"
  | "cervical";

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
      question: {
        es: "¿El dolor es fuerte (más de 4 sobre 10)?",
        en: "Is the pain strong (more than 4 out of 10)?",
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

/** Ankle — from Foot & Ankle Assessment Dossier (Part 24). */
export const ANKLE_PROTOCOL: FunctionalProtocol = {
  id: "ankle",
  match: /tobillo|ankle|esguince(\s*(de\s*)?tobillo)?|maleolo|ATFL|CAI|ankle_foot/i,
  name: {
    es: "Valoración funcional — Tobillo",
    en: "Functional assessment — Ankle",
  },
  urgentRedFlagNote: {
    es:
      "Si hay deformidad marcada, imposibilidad de apoyar 4 pasos tras trauma (Ottawa), o sospecha de fractura/luxación → HOSPITAL / URGENCIAS. NO pidas batería de tests funcionales en ese caso.",
    en:
      "If there is marked deformity, inability to walk 4 steps after trauma (Ottawa), or suspected fracture/dislocation → go to ER/hospital. Do NOT run the functional test battery in that case.",
  },
  historyItems: [
    {
      id: "hx_inversion_twist",
      question: {
        es: "¿Fue un torcedura / inversión (el pie hacia dentro)?",
        en: "Was it a twist / inversion (foot rolling inward)?",
      },
    },
    {
      id: "hx_pop_snap",
      question: {
        es: "¿Escuchaste o notaste un chasquido?",
        en: "Did you hear or feel a pop/snap?",
      },
    },
  ],
  items: [
    {
      id: "test_full_wb_walk",
      question: {
        es: "¿Puedes apoyar el pie completo y dar 4 pasos sin cojera marcada?",
        en: "Can you put full weight on the foot and take 4 steps without a marked limp?",
      },
      positiveWhen: "no",
    },
    {
      id: "test_single_heel_raise",
      question: {
        es: "¿Duele o no puedes hacer elevaciones de talón a una sola pierna?",
        en: "Does it hurt or can you not do single-leg heel raises?",
      },
    },
    {
      id: "test_single_leg_stance",
      question: {
        es: "¿Aguantas 20–30 segundos a la pata coja sin dolor fuerte o inestabilidad?",
        en: "Can you hold a single-leg stance 20–30 seconds without strong pain or instability?",
      },
      positiveWhen: "no",
    },
    {
      id: "test_lateral_ligament_pain",
      question: {
        es: "¿Duele al tocar justo delante/debajo del maleolo lateral (tobillo por fuera)?",
        en: "Does it hurt to touch just in front of / below the lateral malleolus (outer ankle)?",
      },
    },
    {
      id: "test_giving_way",
      question: {
        es: "¿Notas que el tobillo “falla” o se va al caminar o girar?",
        en: "Does the ankle feel like it “gives way” when walking or turning?",
      },
    },
  ],
  suspectThreshold: 0.4,
  restHoursMin: 24,
  restHoursMax: 36,
  retestNotifyHours: 36,
  restProtocolNote: {
    es:
      "Protocolo establecido: 24–36 h de reposo relativo (evitar carrera, saltos y cambios de dirección). Protección con vendaje/tobillera si ayuda. Luego repetir exactamente los mismos tests SÍ/NO.",
    en:
      "Established protocol: 24–36 h of relative rest (avoid running, jumping, and cutting). Brace/tape if helpful. Then repeat exactly the same yes/no tests.",
  },
  ifRetestStillPositive: {
    es:
      "Si al repetir los tests (tras ~36 h) sigue doliendo o inestable, recomendar valoración presencial; RX si criterios Ottawa / trauma; eco o RMN según sospecha de tendón/ligamento.",
    en:
      "If on retest (after ~36 h) it still hurts or feels unstable, recommend in-person assessment; X-ray if Ottawa/trauma criteria; ultrasound or MRI depending on tendon/ligament suspicion.",
  },
};

/** Foot / plantar — from Foot & Ankle Assessment Dossier (Part 24). */
export const FOOT_PROTOCOL: FunctionalProtocol = {
  id: "foot",
  match:
    /pie\b|foot|fascitis|plantar|tal[oó]n|hallux|metatars|antepi[eé]|arco\s*(medial|plantar)/i,
  name: {
    es: "Valoración funcional — Pie / fascia plantar",
    en: "Functional assessment — Foot / plantar fascia",
  },
  urgentRedFlagNote: {
    es:
      "Si hay trauma de mediopié con imposibilidad de apoyar, dolor óseo en 5.º metatarsiano/navicular (Ottawa pie), o deformidad → HOSPITAL / imagen urgente.",
    en:
      "If midfoot trauma with inability to bear weight, bone pain at 5th MT/navicular (Ottawa foot), or deformity → ER / urgent imaging.",
  },
  historyItems: [
    {
      id: "hx_first_step_pain",
      question: {
        es: "¿Te duele mucho el primer paso de la mañana en el talón o el arco?",
        en: "Is the first step in the morning very painful in the heel or arch?",
      },
    },
  ],
  items: [
    {
      id: "test_morning_first_step",
      question: {
        es: "¿El dolor del talón/arco es peor al primer apoyo y luego mejora un poco al caminar?",
        en: "Is heel/arch pain worst with the first steps and then eases a bit as you walk?",
      },
    },
    {
      id: "test_windlass_hallux",
      question: {
        es: "¿Duele la planta (cerca del talón) al extender el dedo gordo hacia arriba?",
        en: "Does the sole (near the heel) hurt when you extend the big toe upward?",
      },
    },
    {
      id: "test_forefoot_tiptoe",
      question: {
        es: "¿Duele el antepié al ponerte de puntillas suaves?",
        en: "Does the forefoot hurt when you gently rise onto tiptoes?",
      },
    },
    {
      id: "test_metatarsal_squeeze",
      question: {
        es: "¿Duele o hay chasquido al comprimir el antepié entre los metatarsianos?",
        en: "Is there pain or a click when squeezing the forefoot across the metatarsals?",
      },
    },
    {
      id: "test_heel_raise_arch",
      question: {
        es: "¿Duele por dentro del arco o notas que el arco “colapsa” al hacer elevaciones de talón?",
        en: "Does the inner arch hurt or feel like it “collapses” during heel raises?",
      },
    },
  ],
  suspectThreshold: 0.4,
  restHoursMin: 24,
  restHoursMax: 36,
  retestNotifyHours: 36,
  restProtocolNote: {
    es:
      "Protocolo establecido: 24–36 h de reposo relativo (evitar carrera descalzo, saltos y carga intensa en antepié). Hielo breve si hay inflamación. Luego repetir exactamente los mismos tests SÍ/NO.",
    en:
      "Established protocol: 24–36 h of relative rest (avoid barefoot running, jumping, and heavy forefoot load). Brief ice if swollen. Then repeat exactly the same yes/no tests.",
  },
  ifRetestStillPositive: {
    es:
      "Si al repetir los tests (tras ~36 h) sigue doliendo, recomendar valoración presencial; eco si fascitis/tendón persistente; RX si trauma/Ottawa pie.",
    en:
      "If on retest (after ~36 h) it still hurts, recommend in-person assessment; ultrasound if persistent fasciopathy/tendon pain; X-ray if trauma/Ottawa foot.",
  },
};

/** Shoulder — elevation, reach behind, ER, cervical screen. */
export const SHOULDER_PROTOCOL: FunctionalProtocol = {
  id: "shoulder",
  match: /hombro|shoulder|manguito|rotator\s*cuff|supraespin|deltoides/i,
  name: {
    es: "Valoración funcional — Hombro",
    en: "Functional assessment — Shoulder",
  },
  urgentRedFlagNote: {
    es:
      "Si hay deformidad marcada, imposibilidad total de mover el brazo tras trauma, sospecha de luxación/fractura, o dolor de hombro izquierdo con sudor frío/náuseas/opresión torácica → URGENCIAS YA. No batería de tests.",
    en:
      "If marked deformity, total inability to move the arm after trauma, suspected dislocation/fracture, or left shoulder pain with cold sweat/nausea/chest pressure → ER NOW. No test battery.",
  },
  historyItems: [
    {
      id: "hx_overhead_trauma",
      question: {
        es: "¿El dolor empezó al levantar el brazo por encima de la cabeza, lanzar o caer sobre el hombro/brazo?",
        en: "Did the pain start when raising the arm overhead, throwing, or falling on the shoulder/arm?",
      },
    },
  ],
  items: [
    {
      id: "test_overhead_elevation",
      positiveWhen: "no",
      question: {
        es: "¿Puedes elevar el brazo por encima de la cabeza sin dolor fuerte?",
        en: "Can you raise the arm overhead without strong pain?",
      },
    },
    {
      id: "test_reach_behind",
      positiveWhen: "no",
      question: {
        es: "¿Puedes alcanzar la espalda (como abrocharte / meter la camiseta) sin dolor o bloqueo fuerte?",
        en: "Can you reach behind your back (as if fastening a bra / tucking a shirt) without strong pain or blocking?",
      },
    },
    {
      id: "test_er_at_90",
      positiveWhen: "no",
      question: {
        es: "Con el brazo a 90°, ¿puedes rotar la palma hacia arriba/atrás sin miedo a que se ‘salga’?",
        en: "With the arm at 90°, can you rotate the palm up/back without fear it will ‘pop out’?",
      },
    },
    {
      id: "test_hold_light_front",
      positiveWhen: "no",
      question: {
        es: "¿Aguantas un objeto ligero con el brazo extendido al frente 10–15 segundos sin dolor fuerte?",
        en: "Can you hold a light object with the arm straight out in front for 10–15 seconds without strong pain?",
      },
    },
    {
      id: "test_neck_screen_shoulder",
      question: {
        es: "¿Al girar o inclinar la cabeza empeora el dolor del hombro o aparece hormigueo en el brazo?",
        en: "Does turning or tilting the head worsen the shoulder pain or cause arm tingling?",
      },
    },
  ],
  suspectThreshold: 0.4,
  restHoursMin: 24,
  restHoursMax: 36,
  retestNotifyHours: 36,
  restProtocolNote: {
    es:
      "Protocolo: 24–36 h de reposo relativo (evitar press, lanzamientos y cargas por encima de la cabeza). Luego repetir los mismos tests SÍ/NO.",
    en:
      "Protocol: 24–36 h relative rest (avoid press, throwing, and overhead loads). Then repeat the same yes/no tests.",
  },
  ifRetestStillPositive: {
    es:
      "Si el retest sigue malo → valoración presencial; eco y/o RMN de manguito/partes blandas; si sospecha labrum → RMN (artro-RMN más específica).",
    en:
      "If retest still bad → in-person assessment; US and/or MRI for cuff/soft tissue; if labral suspicion → MRI (MR arthrogram more specific).",
  },
};

/** Elbow — grip, ROM, resisted wrist, cervical screen. */
export const ELBOW_PROTOCOL: FunctionalProtocol = {
  id: "elbow",
  match: /codo|elbow|epic[oó]ndil|epicondilit|codo\s*de\s*tenista|codo\s*de\s*golfista/i,
  name: {
    es: "Valoración funcional — Codo",
    en: "Functional assessment — Elbow",
  },
  urgentRedFlagNote: {
    es:
      "Si hay deformidad, bloqueo total tras trauma, o imposibilidad clara de flexionar/extender → HOSPITAL / imagen urgente.",
    en:
      "If deformity, total lock after trauma, or clear inability to flex/extend → ER / urgent imaging.",
  },
  historyItems: [
    {
      id: "hx_grip_overload",
      question: {
        es: "¿El dolor empeora al agarrar, girar un pomo o levantar peso con el brazo?",
        en: "Does pain worsen when gripping, turning a doorknob, or lifting with the arm?",
      },
    },
  ],
  items: [
    {
      id: "test_grip_pain",
      question: {
        es: "Con el codo estirado, ¿duele al cerrar el puño con fuerza o al girar un pomo?",
        en: "With the elbow straight, does it hurt to make a strong fist or turn a doorknob?",
      },
    },
    {
      id: "test_elbow_full_rom",
      positiveWhen: "no",
      question: {
        es: "¿Puedes flexionar y extender el codo completo comparando con el otro lado?",
        en: "Can you fully bend and straighten the elbow compared with the other side?",
      },
    },
    {
      id: "test_resisted_wrist",
      question: {
        es: "¿Duele al levantar la muñeca contra una resistencia suave (mano de un familiar)?",
        en: "Does it hurt to lift the wrist against light resistance (a relative’s hand)?",
      },
    },
    {
      id: "test_carry_weight_elbow",
      question: {
        es: "¿Duele al llevar peso (bolsa, botella) con el codo casi estirado?",
        en: "Does it hurt to carry weight (bag, bottle) with the elbow nearly straight?",
      },
    },
    {
      id: "test_neck_screen_elbow",
      question: {
        es: "¿Al girar la cabeza a derecha e izquierda empeora el dolor del codo o el hormigueo del brazo?",
        en: "Does turning the head left/right worsen elbow pain or arm tingling?",
      },
    },
  ],
  suspectThreshold: 0.4,
  restHoursMin: 24,
  restHoursMax: 36,
  retestNotifyHours: 36,
  restProtocolNote: {
    es:
      "Protocolo: 24–36 h de reposo relativo (evitar agarre fuerte, press y cargas con codo estirado). Luego repetir los mismos tests.",
    en:
      "Protocol: 24–36 h relative rest (avoid hard gripping, pressing, and loads with a straight elbow). Then repeat the same tests.",
  },
  ifRetestStillPositive: {
    es:
      "Si el retest sigue malo → presencial; RX si trauma; eco/RMN si tendón/ligamento; mantener cribado cervical si hay hormigueo.",
    en:
      "If retest still bad → in-person; X-ray if trauma; US/MRI if tendon/ligament; keep cervical screen if tingling.",
  },
};

/** Wrist / hand — load, twist, prayer, fist. */
export const WRIST_HAND_PROTOCOL: FunctionalProtocol = {
  id: "wrist_hand",
  match: /mu[nñ]eca|wrist|mano\b|hand|t[uú]nel\s*carpiano|TFCC|escafoides/i,
  name: {
    es: "Valoración funcional — Muñeca / mano",
    en: "Functional assessment — Wrist / hand",
  },
  urgentRedFlagNote: {
    es:
      "Tras caída sobre la mano: dolor en la “tabaquera” (base del pulgar) o imposibilidad de apoyar → sospecha de escafoides / fractura → HOSPITAL / RX (RX normal inicial no descarta).",
    en:
      "After a fall on the hand: snuffbox pain (base of thumb) or inability to load → suspect scaphoid/fracture → ER / X-ray (early normal X-ray does not rule it out).",
  },
  historyItems: [
    {
      id: "hx_fall_outstretched",
      question: {
        es: "¿Caíste apoyando la mano abierta o recibiste un golpe directo en la muñeca?",
        en: "Did you fall onto an outstretched hand or take a direct blow to the wrist?",
      },
    },
  ],
  items: [
    {
      id: "test_palm_load",
      positiveWhen: "no",
      question: {
        es: "¿Puedes apoyar la palma y cargar un poco de peso sin dolor intenso?",
        en: "Can you put the palm down and take a little weight without intense pain?",
      },
    },
    {
      id: "test_key_twist",
      question: {
        es: "¿Duele al girar una llave o abrir un tarro?",
        en: "Does it hurt to turn a key or open a jar?",
      },
    },
    {
      id: "test_wrist_rom",
      positiveWhen: "no",
      question: {
        es: "¿Puedes flexionar y extender la muñeca de forma similar al otro lado?",
        en: "Can you bend and extend the wrist similarly to the other side?",
      },
    },
    {
      id: "test_prayer_tingle",
      question: {
        es: "Si juntas las manos en posición de rezo y bajas los codos, ¿aparece hormigueo o dolor?",
        en: "If you put palms together in a prayer position and lower the elbows, do tingling or pain appear?",
      },
    },
    {
      id: "test_full_fist",
      positiveWhen: "no",
      question: {
        es: "¿Puedes hacer un puño completo y abrirlo sin bloqueo ni chasquido fuerte?",
        en: "Can you make a full fist and open it without locking or a strong click?",
      },
    },
  ],
  suspectThreshold: 0.4,
  restHoursMin: 24,
  restHoursMax: 36,
  retestNotifyHours: 36,
  restProtocolNote: {
    es:
      "Protocolo: 24–36 h de reposo relativo (evitar apoyo de palma, giros fuertes y cargas). Hielo breve si hay hinchazón. Luego repetir los mismos tests.",
    en:
      "Protocol: 24–36 h relative rest (avoid palm loading, hard twists, and heavy loads). Brief ice if swollen. Then repeat the same tests.",
  },
  ifRetestStillPositive: {
    es:
      "Si el retest sigue malo → presencial; RX si trauma/escafoides; eco/RMN según tendón/TFCC/nervio.",
    en:
      "If retest still bad → in-person; X-ray if trauma/scaphoid; US/MRI depending on tendon/TFCC/nerve.",
  },
};

/** Knee — ROM, step-down, SLS, lock. */
export const KNEE_PROTOCOL: FunctionalProtocol = {
  id: "knee",
  match: /rodilla|knee|menisco|r[oó]tula|patel|LCA|ACL|LCL|MCL|cruzado/i,
  name: {
    es: "Valoración funcional — Rodilla",
    en: "Functional assessment — Knee",
  },
  urgentRedFlagNote: {
    es:
      "Si la rodilla está muy hinchada tras trauma, no puedes apoyarla, hay deformidad, o se bloquea y no puedes estirarla → HOSPITAL / imagen urgente.",
    en:
      "If the knee is very swollen after trauma, you cannot bear weight, there is deformity, or it locks and will not straighten → ER / urgent imaging.",
  },
  historyItems: [
    {
      id: "hx_twist_pop_knee",
      question: {
        es: "¿Hubo un giro, un chasquido o un traumatismo directo en la rodilla?",
        en: "Was there a twist, a pop, or a direct blow to the knee?",
      },
    },
  ],
  items: [
    {
      id: "test_knee_full_rom",
      positiveWhen: "no",
      question: {
        es: "¿Puedes flexionar y extender la rodilla completa comparando con la otra?",
        en: "Can you fully bend and straighten the knee compared with the other side?",
      },
    },
    {
      id: "test_step_down",
      question: {
        es: "Al bajar un escalón despacio con la pierna afectada, ¿te duele la rodilla?",
        en: "When stepping down slowly on the affected leg, does your knee hurt?",
      },
    },
    {
      id: "test_sls_knee",
      positiveWhen: "no",
      question: {
        es: "¿Aguantas 20–30 segundos a la pata coja sin que la rodilla ‘falle’?",
        en: "Can you hold a single-leg stance 20–30 seconds without the knee ‘giving way’?",
      },
    },
    {
      id: "test_knee_lock",
      question: {
        es: "¿La rodilla se bloquea o no puedes estirarla del todo?",
        en: "Does the knee lock or can you not fully straighten it?",
      },
    },
    {
      id: "test_hip_screen_knee",
      question: {
        es: "¿Duele también al ponerte los calcetines o al girar la cadera del mismo lado?",
        en: "Does it also hurt when putting on socks or rotating the hip on the same side?",
      },
    },
  ],
  suspectThreshold: 0.4,
  restHoursMin: 24,
  restHoursMax: 36,
  retestNotifyHours: 36,
  restProtocolNote: {
    es:
      "Protocolo: 24–36 h de reposo relativo (evitar carrera, saltos y sentadillas profundas). Hielo/elevación si hay hinchazón. Luego repetir los mismos tests.",
    en:
      "Protocol: 24–36 h relative rest (avoid running, jumping, and deep squats). Ice/elevation if swollen. Then repeat the same tests.",
  },
  ifRetestStillPositive: {
    es:
      "Si el retest sigue malo → presencial; RX si trauma; RMN si menisco/ligamento; cribado de cadera si el patrón no es típico local.",
    en:
      "If retest still bad → in-person; X-ray if trauma; MRI if meniscus/ligament; hip screen if the pattern is not typical local.",
  },
};

/** Hip — squat, SLS, side-leg raise, socks. */
export const HIP_PROTOCOL: FunctionalProtocol = {
  id: "hip",
  match: /cadera|hip|FAI|trocanter|acet[aá]bul|labrum\s*(de\s*)?cadera/i,
  name: {
    es: "Valoración funcional — Cadera",
    en: "Functional assessment — Hip",
  },
  urgentRedFlagNote: {
    es:
      "Corredor con dolor inguinal progresivo + dolor nocturno + imposibilidad de salto monopodal → sospecha fractura de estrés / AVN → valoración médica/imagen urgente (no trates como tendinitis benigna).",
    en:
      "Runner with progressive groin pain + night pain + inability to hop → suspect stress fracture / AVN → urgent medical/imaging assessment (do not treat as benign tendinitis).",
  },
  historyItems: [
    {
      id: "hx_groin_deep",
      question: {
        es: "¿El dolor principal es profundo en la ingle (parte delantera)?",
        en: "Is the main pain deep in the groin (front of the hip)?",
      },
    },
  ],
  items: [
    {
      id: "test_partial_squat_hip",
      positiveWhen: "no",
      question: {
        es: "¿Puedes hacer una sentadilla parcial (como sentarte en una silla alta) sin dolor fuerte en la ingle?",
        en: "Can you do a partial squat (as if sitting on a tall chair) without strong groin pain?",
      },
    },
    {
      id: "test_sls_hip",
      question: {
        es: "De pie a la pata coja 20–30 s, ¿aparece dolor en el costado de la cadera o cojera?",
        en: "In a single-leg stance 20–30 s, does side-hip pain or a limp appear?",
      },
    },
    {
      id: "test_side_leg_raise",
      question: {
        es: "Tumbado de lado, ¿duele al levantar la pierna de arriba (separarla del cuerpo)?",
        en: "Lying on your side, does it hurt to lift the top leg (away from the body)?",
      },
    },
    {
      id: "test_socks_cross_legs",
      question: {
        es: "¿Duele al cruzar las piernas o al ponerte los calcetines?",
        en: "Does it hurt when crossing the legs or putting on socks?",
      },
    },
    {
      id: "test_hop_hip",
      positiveWhen: "no",
      question: {
        es: "Si es seguro: ¿puedes hacer un pequeño salto a una sola pierna sin dolor inguinal fuerte?",
        en: "If safe: can you do a small single-leg hop without strong groin pain?",
      },
    },
  ],
  suspectThreshold: 0.4,
  restHoursMin: 24,
  restHoursMax: 36,
  retestNotifyHours: 36,
  restProtocolNote: {
    es:
      "Protocolo: 24–36 h de reposo relativo (evitar carrera, sentadillas profundas y estiramientos agresivos de flexores). Luego repetir los mismos tests.",
    en:
      "Protocol: 24–36 h relative rest (avoid running, deep squats, and aggressive hip-flexor stretches). Then repeat the same tests.",
  },
  ifRetestStillPositive: {
    es:
      "Si el retest sigue malo → presencial; RX si trauma/sospecha ósea; eco/RMN de partes blandas; artro-RMN si sospecha labrum.",
    en:
      "If retest still bad → in-person; X-ray if trauma/bony suspicion; US/MRI for soft tissue; MR arthrogram if labral suspicion.",
  },
};

/** Lumbar — forward bend, SLS, sit-to-stand, walk. */
export const LUMBAR_PROTOCOL: FunctionalProtocol = {
  id: "lumbar",
  match: /lumbar|lumbago|espalda\s*baja|low\s*back|ci[aá]tica|lumbalgia/i,
  name: {
    es: "Valoración funcional — Lumbar / espalda baja",
    en: "Functional assessment — Lumbar / low back",
  },
  urgentRedFlagNote: {
    es:
      "Si hay retención/incontinencia de orina o heces, anestesia en silla de montar, debilidad grave en ambas piernas o pie caído súbito → URGENCIAS YA (posible cauda equina).",
    en:
      "If urinary/fecal retention or incontinence, saddle anesthesia, severe bilateral leg weakness, or sudden foot drop → ER NOW (possible cauda equina).",
  },
  historyItems: [
    {
      id: "hx_leg_radiation",
      question: {
        es: "¿El dolor baja por la nalga o la pierna (más allá de la espalda baja)?",
        en: "Does the pain go down into the buttock or leg (beyond the low back)?",
      },
    },
  ],
  items: [
    {
      id: "test_forward_bend",
      positiveWhen: "no",
      question: {
        es: "¿Puedes inclinarte hacia delante como para tocar las rodillas y volver sin bloqueo o dolor que baje a la pierna?",
        en: "Can you bend forward as if to touch the knees and return without locking or pain going down the leg?",
      },
    },
    {
      id: "test_sls_lumbar",
      positiveWhen: "no",
      question: {
        es: "¿Aguantas 20–30 segundos a la pata coja (lado más afectado) sin dolor lumbar intenso?",
        en: "Can you hold a single-leg stance 20–30 seconds (more affected side) without intense low-back pain?",
      },
    },
    {
      id: "test_sit_to_stand",
      question: {
        es: "Al sentarte y levantarte de una silla sin usar las manos, ¿hay debilidad o dolor que baje a la pierna?",
        en: "When sitting and standing from a chair without using your hands, is there weakness or pain going down the leg?",
      },
    },
    {
      id: "test_walk_change",
      question: {
        es: "¿Caminar unos minutos empeora claramente el dolor o el hormigueo de la pierna?",
        en: "Does walking for a few minutes clearly worsen the pain or leg tingling?",
      },
    },
    {
      id: "test_cough_sneeze",
      question: {
        es: "¿Al toser o estornudar aumenta el dolor que baja a la pierna?",
        en: "Does coughing or sneezing increase pain that goes down the leg?",
      },
    },
  ],
  suspectThreshold: 0.4,
  restHoursMin: 24,
  restHoursMax: 36,
  retestNotifyHours: 36,
  restProtocolNote: {
    es:
      "Protocolo: 24–36 h de reposo relativo (evitar flexiones forzadas, cargas pesadas y estar mucho rato encorvado). Camina suave si no empeora. Luego repetir los mismos tests.",
    en:
      "Protocol: 24–36 h relative rest (avoid forced bending, heavy lifting, and long periods slumped). Gentle walking if it does not worsen. Then repeat the same tests.",
  },
  ifRetestStillPositive: {
    es:
      "Si el retest sigue malo → presencial; RMN si irradiación/neurológicos persistentes; mantener vigilancia de banderas rojas.",
    en:
      "If retest still bad → in-person; MRI if persistent radiation/neurological signs; keep watching for red flags.",
  },
};

/** Cervical — rotation, flexion/extension, arm neuro, sustained look-up. */
export const CERVICAL_PROTOCOL: FunctionalProtocol = {
  id: "cervical",
  match: /cervical|cuello|neck|whiplash|latigazo\s*cervical/i,
  name: {
    es: "Valoración funcional — Cervical / cuello",
    en: "Functional assessment — Cervical / neck",
  },
  urgentRedFlagNote: {
    es:
      "Si hay trauma + dolor de cuello y no puedes girar 45°, o aparecen déficits neurológicos graves, o signos de CAD/ictus (mareo + diplopía + disartria + ataxia + caída) → URGENCIAS YA.",
    en:
      "If trauma + neck pain and you cannot turn 45°, or severe neurological deficits, or CAD/stroke signs (dizziness + diplopia + dysarthria + ataxia + drop attacks) → ER NOW.",
  },
  historyItems: [
    {
      id: "hx_trauma_neck",
      question: {
        es: "¿Hubo un golpe, latigazo o accidente antes del dolor de cuello?",
        en: "Was there a blow, whiplash, or accident before the neck pain?",
      },
    },
  ],
  items: [
    {
      id: "test_neck_rotation",
      positiveWhen: "no",
      question: {
        es: "¿Puedes girar la cabeza a derecha e izquierda de forma similar, sin dolor fuerte?",
        en: "Can you turn the head left and right similarly, without strong pain?",
      },
    },
    {
      id: "test_look_up_down",
      question: {
        es: "Al mirar al techo o al ombligo, ¿aparece mareo, visión borrosa o dolor que baja al brazo?",
        en: "When looking up at the ceiling or down at the navel, do dizziness, blurred vision, or arm pain appear?",
      },
    },
    {
      id: "test_arm_neuro",
      question: {
        es: "¿Notas hormigueo, entumecimiento o debilidad en alguna mano o brazo?",
        en: "Do you notice tingling, numbness, or weakness in either hand or arm?",
      },
    },
    {
      id: "test_sustained_look_up",
      positiveWhen: "no",
      question: {
        es: "¿Aguantas 20–30 segundos mirando un poco hacia arriba sin empeorar síntomas?",
        en: "Can you hold a slight upward gaze for 20–30 seconds without worsening symptoms?",
      },
    },
    {
      id: "test_overhead_reach_neck",
      question: {
        es: "¿Al elevar los brazos o cargar una mochila empeora el dolor del cuello o el hormigueo?",
        en: "Does raising the arms or wearing a backpack worsen the neck pain or tingling?",
      },
    },
  ],
  suspectThreshold: 0.4,
  restHoursMin: 24,
  restHoursMax: 36,
  retestNotifyHours: 36,
  restProtocolNote: {
    es:
      "Protocolo: 24–36 h de reposo relativo (evitar mirar arriba forzado, cargas en cabeza/hombros y pantallas muy bajas). Movilidad suave si no hay banderas rojas. Luego repetir los mismos tests.",
    en:
      "Protocol: 24–36 h relative rest (avoid forced looking up, head/shoulder loads, and very low screens). Gentle mobility if no red flags. Then repeat the same tests.",
  },
  ifRetestStillPositive: {
    es:
      "Si el retest sigue malo → presencial; RMN si irradiación/neurológicos persistentes; RX/C-spine rules si trauma.",
    en:
      "If retest still bad → in-person; MRI if persistent radiation/neurological signs; X-ray/C-spine rules if trauma.",
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
  ANKLE_PROTOCOL,
  FOOT_PROTOCOL,
  SHOULDER_PROTOCOL,
  ELBOW_PROTOCOL,
  WRIST_HAND_PROTOCOL,
  KNEE_PROTOCOL,
  HIP_PROTOCOL,
  LUMBAR_PROTOCOL,
  CERVICAL_PROTOCOL,
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
    "1) OBLIGATORIO: pide **Pruebas funcionales** (3–6 preguntas SÍ/NO en lenguaje cotidiano, SIN nombres clínicos). El paciente las responde con botones Sí/No; no pidas texto libre ni escalas.",
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

  if (
    /fascitis|plantar|tal[oó]n|hallux|metatars|antepi[eé]|arco\s*(medial|plantar)|primer\s*paso/i.test(
      text
    )
  ) {
    return FOOT_PROTOCOL;
  }

  if (/tobillo|ankle|esguince|maleolo|ATFL|CAI|ankle_foot/i.test(text)) {
    return ANKLE_PROTOCOL;
  }

  if (/\bpie\b|foot/i.test(text)) {
    return FOOT_PROTOCOL;
  }

  if (/hombro|shoulder|manguito|rotator\s*cuff/i.test(text)) {
    return SHOULDER_PROTOCOL;
  }

  if (/codo|elbow|epic[oó]ndil/i.test(text)) {
    return ELBOW_PROTOCOL;
  }

  if (/mu[nñ]eca|wrist|mano\b|hand|t[uú]nel\s*carpiano|TFCC|escafoides/i.test(text)) {
    return WRIST_HAND_PROTOCOL;
  }

  if (/rodilla|knee|menisco|r[oó]tula|patel|LCA|ACL|cruzado/i.test(text)) {
    return KNEE_PROTOCOL;
  }

  if (/cadera|hip|FAI|trocanter/i.test(text)) {
    return HIP_PROTOCOL;
  }

  if (/lumbar|lumbago|espalda\s*baja|low\s*back|ci[aá]tica/i.test(text)) {
    return LUMBAR_PROTOCOL;
  }

  if (/cervical|cuello|neck|whiplash/i.test(text)) {
    return CERVICAL_PROTOCOL;
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
                    : protocol.id === "ankle"
                      ? "tobillo / ankle"
                      : protocol.id === "foot"
                        ? "pie / fascia plantar / foot"
                        : protocol.id === "shoulder"
                          ? "hombro / shoulder"
                          : protocol.id === "elbow"
                            ? "codo / elbow"
                            : protocol.id === "wrist_hand"
                              ? "muñeca-mano / wrist-hand"
                              : protocol.id === "knee"
                                ? "rodilla / knee"
                                : protocol.id === "hip"
                                  ? "cadera / hip"
                                  : protocol.id === "lumbar"
                                    ? "lumbar / low back"
                                    : protocol.id === "cervical"
                                      ? "cervical / neck"
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
