/**
 * Maps clinical special-test names (physio chat) to educational illustrations
 * on the public clinical-tests Storage CDN.
 */

import { CLINICAL_TEST_CDN } from "./clinical-test-cdn";

export type ClinicalTestImage = {
  id: string;
  title: string;
  /** Public CDN URL for the illustration */
  src: string;
  /** Lowercase, accent-stripped substrings to match in assistant text */
  aliases: readonly string[];
};

function normalizeForMatch(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^a-z0-9\s/+-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export const CLINICAL_TEST_IMAGES: readonly ClinicalTestImage[] = [
  {
    id: "lachman",
    title: "Test de Lachman (rodilla / LCA)",
    src: `${CLINICAL_TEST_CDN}/lachman.webp`,
    aliases: [
      "lachman rodilla",
      "lachman lca",
      "lachman acl",
      "test de lachman",
      "lachman",
    ],
  },
  {
    id: "anterior-drawer-knee",
    title: "Cajón anterior (rodilla)",
    src: `${CLINICAL_TEST_CDN}/anterior-drawer-knee.webp`,
    aliases: [
      "cajon anterior de la rodilla",
      "cajon anterior rodilla",
      "test del cajon anterior",
      "test de cajon anterior",
      "anterior drawer knee",
      "slocum",
    ],
  },
  {
    id: "pivot-shift",
    title: "Pivot Shift",
    src: `${CLINICAL_TEST_CDN}/pivot-shift.webp`,
    aliases: ["pivot shift", "pivot-shift", "test de pivot"],
  },
  {
    id: "mcmurray",
    title: "Test de McMurray",
    src: `${CLINICAL_TEST_CDN}/mcmurray.webp?v=20260922mcm`,
    aliases: ["mcmurray", "mc murray", "test de mcmurray"],
  },
  {
    id: "thessaly",
    title: "Test de Thessaly",
    src: `${CLINICAL_TEST_CDN}/thessaly.webp`,
    aliases: ["thessaly", "test de thessaly"],
  },
  {
    id: "neer",
    title: "Test de Neer",
    src: `${CLINICAL_TEST_CDN}/neer.webp`,
    aliases: ["neer", "test de neer", "neer's"],
  },
  {
    id: "hawkins-kennedy",
    title: "Hawkins-Kennedy",
    src: `${CLINICAL_TEST_CDN}/hawkins-kennedy.webp`,
    aliases: ["hawkins", "hawkins-kennedy", "hawkins kennedy"],
  },
  {
    id: "jobe-empty-can",
    title: "Jobe / Empty can",
    src: `${CLINICAL_TEST_CDN}/jobe-empty-can.webp`,
    aliases: ["jobe", "empty can", "empty-can", "lata vacia", "lata vacía"],
  },
  {
    id: "apprehension",
    title: "Apprehension / Relocation",
    src: `${CLINICAL_TEST_CDN}/apprehension.webp`,
    aliases: [
      "apprehension",
      "aprension",
      "aprehensión",
      "relocation",
      "relocacion",
      "reubicación",
    ],
  },
  {
    id: "speed",
    title: "Test de Speed",
    src: `${CLINICAL_TEST_CDN}/speed.webp`,
    aliases: ["speed", "test de speed"],
  },
  {
    id: "yergason",
    title: "Test de Yergason",
    src: `${CLINICAL_TEST_CDN}/yergason.webp`,
    aliases: ["yergason", "test de yergason"],
  },
  {
    id: "drop-arm",
    title: "Drop arm",
    src: `${CLINICAL_TEST_CDN}/drop-arm.webp`,
    aliases: ["drop arm", "drop-arm", "caida del brazo", "caída del brazo"],
  },
  {
    id: "painful-arc",
    title: "Painful arc",
    src: `${CLINICAL_TEST_CDN}/painful-arc.webp`,
    aliases: ["painful arc", "arco doloroso", "arco doloroso de abduccion"],
  },
  {
    id: "spurling",
    title: "Test de Spurling",
    src: `${CLINICAL_TEST_CDN}/spurling.webp`,
    aliases: ["spurling", "test de spurling"],
  },
  {
    id: "ultt",
    title: "ULTT / ULNT",
    src: `${CLINICAL_TEST_CDN}/ultt.webp`,
    aliases: [
      "ultt",
      "ulnt",
      "upper limb tension",
      "test de tension neural",
      "tension neural del miembro superior",
    ],
  },
  {
    id: "thompson",
    title: "Test de Thompson",
    src: `${CLINICAL_TEST_CDN}/thompson.webp`,
    aliases: ["thompson", "test de thompson", "squeeze test", "simmonds"],
  },
  {
    id: "matles",
    title: "Test de Matles",
    src: `${CLINICAL_TEST_CDN}/matles.webp`,
    aliases: ["matles", "test de matles"],
  },
  {
    id: "anterior-drawer-ankle",
    title: "Cajón anterior (tobillo)",
    src: `${CLINICAL_TEST_CDN}/anterior-drawer-ankle.webp?v=20260916drawer`,
    aliases: [
      "cajon anterior del tobillo",
      "cajón anterior del tobillo",
      "anterior drawer ankle",
      "drawer tobillo",
      "atfl",
    ],
  },
  {
    id: "windlass",
    title: "Test de Windlass",
    src: `${CLINICAL_TEST_CDN}/windlass.webp`,
    aliases: ["windlass", "test de windlass"],
  },
  {
    id: "heel-raise",
    title: "Heel raise / elevación de talones",
    src: `${CLINICAL_TEST_CDN}/heel-raise.webp`,
    aliases: [
      "heel raise",
      "heel-rise",
      "elevacion de talones",
      "elevación de talones",
      "elevacion del talon",
      "elevación del talón",
      "puntillas",
    ],
  },
  {
    id: "hop-test",
    title: "Hop test",
    src: `${CLINICAL_TEST_CDN}/hop-test.webp`,
    aliases: ["hop test", "hop-test", "salto monopodal", "single leg hop"],
  },
  {
    id: "syndesmosis-squeeze",
    title: "Squeeze de sindesmosis",
    src: `${CLINICAL_TEST_CDN}/syndesmosis-squeeze.webp`,
    aliases: [
      "syndesmosis squeeze",
      "squeeze sindesmosis",
      "squeeze de sindesmosis",
      "tibiofibular squeeze",
      "compresion tibiofibular",
      "compresión tibiofibular",
    ],
  },
  {
    id: "kleiger",
    title: "Kleiger / rotación externa",
    src: `${CLINICAL_TEST_CDN}/kleiger.webp`,
    aliases: [
      "kleiger",
      "kleiger test",
      "external rotation ankle",
      "rotacion externa tobillo",
      "rotación externa tobillo",
      "prueba de kleiger",
    ],
  },
  {
    id: "talar-tilt",
    title: "Talar tilt",
    src: `${CLINICAL_TEST_CDN}/talar-tilt.webp`,
    aliases: [
      "talar tilt",
      "talar-tilt",
      "inversion stress ankle",
      "estres en inversion tobillo",
      "estrés en inversión tobillo",
    ],
  },
  {
    id: "mulder",
    title: "Test de Mulder",
    src: `${CLINICAL_TEST_CDN}/mulder.webp`,
    aliases: [
      "mulder",
      "mulder test",
      "test de mulder",
      "morton squeeze",
      "compresion metatarsiana",
      "compresión metatarsiana",
    ],
  },
  {
    id: "tinel-tarsal",
    title: "Tinel tarsal",
    src: `${CLINICAL_TEST_CDN}/tinel-tarsal.webp`,
    aliases: [
      "tinel tarsal",
      "tinel-tarsal",
      "tinel tunel tarsiano",
      "tinel túnel tarsiano",
      "tarsal tunnel tinel",
    ],
  },
  {
    id: "faber",
    title: "FABER / Patrick",
    src: `${CLINICAL_TEST_CDN}/faber.webp`,
    aliases: ["faber", "patrick", "figure 4", "figura 4"],
  },
  {
    id: "fadir",
    title: "FADIR",
    src: `${CLINICAL_TEST_CDN}/fadir.webp`,
    aliases: ["fadir", "faddir", "impingement de cadera"],
  },
  {
    id: "trendelenburg",
    title: "Test de Trendelenburg",
    src: `${CLINICAL_TEST_CDN}/trendelenburg.webp`,
    aliases: [
      "trendelenburg",
      "test de trendelenburg",
      "pata coja",
      "apoyo monopodal",
      "single-leg stance",
    ],
  },
  {
    id: "resisted-adduction",
    title: "Aducción resistida (squeeze)",
    src: `${CLINICAL_TEST_CDN}/resisted-adduction.webp`,
    aliases: [
      "resisted adduction",
      "aduccion resistida",
      "aducción resistida",
      "squeeze test",
      "squeeze",
      "apretar rodillas",
    ],
  },
  {
    id: "resisted-hip-flexion",
    title: "Flexión de cadera resistida",
    src: `${CLINICAL_TEST_CDN}/resisted-hip-flexion.webp`,
    aliases: [
      "resisted hip flexion",
      "flexion resistida cadera",
      "flexión resistida de cadera",
      "slr resistido",
      "iliopsoas resistido",
    ],
  },
  {
    id: "thomas-test",
    title: "Test de Thomas",
    src: `${CLINICAL_TEST_CDN}/thomas-test.webp`,
    aliases: ["thomas", "thomas test", "test de thomas"],
  },
  {
    id: "resisted-abduction",
    title: "Abducción de cadera resistida",
    src: `${CLINICAL_TEST_CDN}/resisted-abduction.webp`,
    aliases: [
      "resisted abduction",
      "abduccion resistida",
      "abducción resistida",
      "abduccion de cadera resistida",
    ],
  },
  {
    id: "log-roll",
    title: "Log roll",
    src: `${CLINICAL_TEST_CDN}/log-roll.webp`,
    aliases: ["log roll", "log-roll", "rodamiento de cadera", "passive log roll"],
  },
  {
    id: "stinchfield",
    title: "Stinchfield",
    src: `${CLINICAL_TEST_CDN}/stinchfield.webp`,
    aliases: ["stinchfield", "stinchfield test", "test de stinchfield"],
  },
  {
    id: "hip-scour",
    title: "Hip scour / quadrant",
    src: `${CLINICAL_TEST_CDN}/hip-scour.webp?v=20260922scour`,
    aliases: [
      "hip scour",
      "scour",
      "scour test",
      "quadrant test",
      "quadrant",
      "hip quadrant",
    ],
  },
  {
    id: "phalen",
    title: "Test de Phalen",
    src: `${CLINICAL_TEST_CDN}/phalen.webp`,
    aliases: ["phalen", "test de phalen", "posicion de rezo", "posición de rezo"],
  },
  {
    id: "tinel",
    title: "Signo de Tinel",
    src: `${CLINICAL_TEST_CDN}/tinel.webp`,
    aliases: ["tinel", "signo de tinel", "test de tinel"],
  },
  {
    id: "durkan",
    title: "Test de Durkan / compresión carpiana",
    src: `${CLINICAL_TEST_CDN}/durkan.webp`,
    aliases: [
      "durkan",
      "test de durkan",
      "compresion carpiana",
      "compresión carpiana",
      "carpal compression",
    ],
  },
  {
    id: "cozen",
    title: "Test de Cozen",
    src: `${CLINICAL_TEST_CDN}/cozen.webp?v=20260921shoulder`,
    aliases: ["cozen", "test de cozen"],
  },
  {
    id: "mill",
    title: "Test de Mill",
    src: `${CLINICAL_TEST_CDN}/mill.webp?v=20260921shoulder`,
    aliases: ["mill", "test de mill", "mills", "test de mills"],
  },
  {
    id: "maudsley",
    title: "Test de Maudsley",
    src: `${CLINICAL_TEST_CDN}/maudsley.webp?v=20260921shoulder`,
    aliases: [
      "maudsley",
      "test de maudsley",
      "extension dedo medio",
      "extensión dedo medio",
      "middle finger extension",
    ],
  },
  {
    id: "hook-test",
    title: "Hook test (bíceps distal)",
    src: `${CLINICAL_TEST_CDN}/hook-test.webp?v=20260921shoulder`,
    aliases: [
      "hook",
      "hook test",
      "test de hook",
      "hook bíceps",
      "hook biceps",
      "bíceps distal",
      "biceps distal",
    ],
  },
  {
    id: "biceps-squeeze",
    title: "Biceps squeeze (bíceps distal)",
    src: `${CLINICAL_TEST_CDN}/biceps-squeeze.webp?v=20260921shoulder`,
    aliases: [
      "biceps squeeze",
      "bíceps squeeze",
      "squeeze bíceps",
      "squeeze biceps",
      "compresión bíceps",
      "compresion biceps",
      "ruland",
    ],
  },
  {
    id: "milking-maneuver",
    title: "Milking maneuver (UCL)",
    src: `${CLINICAL_TEST_CDN}/milking-maneuver.webp`,
    aliases: [
      "milking",
      "milking maneuver",
      "maniobra de milking",
      "milking ucl",
      "ucl milking",
    ],
  },
  {
    id: "moving-valgus",
    title: "Moving valgus stress (UCL)",
    src: `${CLINICAL_TEST_CDN}/moving-valgus.webp`,
    aliases: [
      "moving valgus",
      "moving valgus stress",
      "valgus stress móvil",
      "valgus movil",
      "valgus móvil",
      "test de valgus móvil",
      "lachman de codo",
      "lachman codo",
      "elbow lachman",
      "modified lachman elbow",
      "test de lachman codo",
      "lachman ucl",
    ],
  },
  {
    id: "schober",
    title: "Test de Schober",
    src: `${CLINICAL_TEST_CDN}/schober.webp`,
    aliases: ["schober", "test de schober"],
  },
  {
    id: "thigh-thrust",
    title: "Thigh thrust (SIJ)",
    src: `${CLINICAL_TEST_CDN}/thigh-thrust.webp`,
    aliases: [
      "thigh thrust",
      "posterior shear",
      "shear sacroiliaco",
      "shear sacroilíaco",
      "thrust de muslo",
    ],
  },
  {
    id: "si-distraction",
    title: "Distracción sacroilíaca",
    src: `${CLINICAL_TEST_CDN}/si-distraction.webp`,
    aliases: [
      "distraccion si",
      "distracción si",
      "si distraction",
      "gapping si",
      "distraccion sacroiliaca",
      "distracción sacroilíaca",
    ],
  },
  {
    id: "si-compression",
    title: "Compresión sacroilíaca",
    src: `${CLINICAL_TEST_CDN}/si-compression.webp`,
    aliases: [
      "compresion si",
      "compresión si",
      "si compression",
      "compresion sacroiliaca",
      "compresión sacroilíaca",
    ],
  },
  {
    id: "active-slr",
    title: "Active SLR (pelvic girdle)",
    src: `${CLINICAL_TEST_CDN}/active-slr.webp`,
    aliases: [
      "active slr",
      "aslr",
      "slr activo",
      "elevacion activa pierna",
      "elevación activa pierna",
      "pelvic girdle",
    ],
  },
  {
    id: "slr-lasegue",
    title: "SLR / Lasègue",
    src: `${CLINICAL_TEST_CDN}/slr-lasegue.webp`,
    aliases: [
      "lasegue",
      "lasègue",
      "straight leg raise",
      "elevacion de pierna recta",
      "elevación de pierna recta",
      "elevacion de piernas rectas",
      "slr",
    ],
  },
  {
    id: "kemp",
    title: "Test de Kemp / cuadrante lumbar",
    src: `${CLINICAL_TEST_CDN}/kemp.webp`,
    aliases: [
      "kemp",
      "test de kemp",
      "cuadrante lumbar",
      "extension lumbar",
      "extensión lumbar",
      "prueba de extension lumbar",
    ],
  },
  {
    id: "cross-body",
    title: "Cross-body / aducción horizontal",
    src: `${CLINICAL_TEST_CDN}/cross-body.webp`,
    aliases: [
      "cross body",
      "cross-body",
      "aduccion horizontal",
      "aducción horizontal",
      "test de cross body",
    ],
  },
  {
    id: "full-can",
    title: "Full can / Jobe pulgar arriba",
    src: `${CLINICAL_TEST_CDN}/full-can.webp`,
    aliases: [
      "full can",
      "full-can",
      "jobe pulgar arriba",
      "lata llena",
      "jobe thumb up",
    ],
  },
  {
    id: "surprise",
    title: "Surprise / Release (inestabilidad anterior)",
    src: `${CLINICAL_TEST_CDN}/surprise.webp`,
    aliases: [
      "surprise",
      "release test",
      "surprise test",
      "anterior release",
      "sorpresa",
    ],
  },
  {
    id: "paxinos",
    title: "Paxinos (AC)",
    src: `${CLINICAL_TEST_CDN}/paxinos.webp`,
    aliases: [
      "paxinos",
      "test de paxinos",
      "compresion ac",
      "compresión ac",
    ],
  },
  {
    id: "obrien",
    title: "O'Brien / Active compression",
    src: `${CLINICAL_TEST_CDN}/obrien.webp`,
    aliases: [
      "obrien",
      "o'brien",
      "o brien",
      "active compression",
      "compresion activa",
    ],
  },
  {
    id: "uppercut",
    title: "Uppercut (bíceps)",
    src: `${CLINICAL_TEST_CDN}/uppercut.webp`,
    aliases: ["uppercut", "test uppercut", "upper cut", "test de uppercut"],
  },
  {
    id: "crank",
    title: "Crank (screening labral)",
    src: `${CLINICAL_TEST_CDN}/crank.webp?v=20260921shoulder`,
    aliases: [
      "crank",
      "crank test",
      "test de crank",
      "compresion rotacion hombro",
      "compresión rotación",
    ],
  },
  {
    id: "er-lag",
    title: "ER lag sign",
    src: `${CLINICAL_TEST_CDN}/er-lag.webp`,
    aliases: [
      "er lag",
      "er-lag",
      "lag sign",
      "lag rotacion externa",
      "external rotation lag",
    ],
  },
  {
    id: "belly-press",
    title: "Belly press / Napoleon",
    src: `${CLINICAL_TEST_CDN}/belly-press.webp`,
    aliases: [
      "belly press",
      "belly-press",
      "napoleon",
      "press barriga",
      "test de napoleon",
    ],
  },
  {
    id: "lift-off",
    title: "Lift-off / Gerber",
    src: `${CLINICAL_TEST_CDN}/lift-off.webp`,
    aliases: ["lift off", "lift-off", "gerber", "levantar mano espalda", "test de gerber"],
  },
  {
    id: "kim-test",
    title: "Kim test (inestabilidad posterior)",
    src: `${CLINICAL_TEST_CDN}/kim-test.webp?v=20260921kim`,
    aliases: ["kim test", "kim-test", "test de kim", "prueba de kim"],
  },
  {
    id: "jerk-test",
    title: "Jerk test (inestabilidad posterior)",
    src: `${CLINICAL_TEST_CDN}/jerk-test.webp?v=20260921shoulder`,
    aliases: ["jerk test", "jerk-test", "test de jerk", "prueba de jerk"],
  },
  {
    id: "valgus-stress-mcl",
    title: "Estrés en valgo (LCM)",
    src: `${CLINICAL_TEST_CDN}/valgus-stress-mcl.webp?v=20260922valgus2`,
    aliases: [
      "estres en valgo lcm",
      "estrés en valgo lcm",
      "estres en valgo (lcm)",
      "estrés en valgo (lcm)",
      "estres en valgo",
      "estrés en valgo",
      "ligamento colateral medial",
      "valgus stress mcl",
      "valgus stress knee",
      "mcl stress",
    ],
  },
  {
    id: "varus-stress-lcl",
    title: "Estrés en varo (LCL)",
    src: `${CLINICAL_TEST_CDN}/varus-stress-lcl.webp?v=20260922varus`,
    aliases: [
      "estres en varo",
      "estrés en varo",
      "ligamento colateral lateral",
      "varus stress",
    ],
  },
  {
    id: "chair-push-plri",
    title: "Chair push-up / chair sign (PLRI)",
    src: `${CLINICAL_TEST_CDN}/chair-push-plri.webp?v=20260921chair`,
    aliases: [
      "chair push",
      "chair push-up",
      "chair sign",
      "plri",
      "posterolateral",
      "pivot shift codo",
      "tabletop relocation",
      "inestabilidad posterolateral",
      "plri codo",
    ],
  },
  {
    id: "posterior-drawer-pcl",
    title: "Cajón posterior / sag (LCP)",
    src: `${CLINICAL_TEST_CDN}/posterior-drawer-pcl.webp`,
    aliases: [
      "cajon posterior",
      "cajón posterior",
      "posterior drawer",
      "posterior sag",
      "godfrey",
      "ligamento cruzado posterior",
    ],
  },
  {
    id: "noble-compression",
    title: "Noble compression (ITB)",
    src: `${CLINICAL_TEST_CDN}/noble-compression.webp?v=20260922noble`,
    aliases: [
      "noble",
      "noble compression",
      "noble test",
      "test de noble",
      "compresion de noble",
      "compresión de noble",
    ],
  },
  {
    id: "ober-test",
    title: "Test de Ober",
    src: `${CLINICAL_TEST_CDN}/ober-test.webp`,
    aliases: ["ober", "ober test", "test de ober", "ober's test"],
  },
  {
    id: "patellar-apprehension",
    title: "Aprensión rotuliana",
    src: `${CLINICAL_TEST_CDN}/patellar-apprehension.webp`,
    aliases: [
      "patellar apprehension",
      "aprehension rotuliana",
      "aprensión rotuliana",
      "apprehension test",
      "aprehension de rotula",
      "aprensión de rótula",
      "moving apprehension",
    ],
  },
  {
    id: "dial-test",
    title: "Dial test (PLC)",
    src: `${CLINICAL_TEST_CDN}/dial-test.webp?v=20260922dial90`,
    aliases: [
      "dial test",
      "dial",
      "test dial",
      "external rotation dial",
      "prueba dial",
    ],
  },
  {
    id: "resisted-wrist-flexion",
    title: "Flexión de muñeca resistida (medial)",
    src: `${CLINICAL_TEST_CDN}/resisted-wrist-flexion.webp`,
    aliases: [
      "flexion de muneca resistida",
      "flexión de muñeca resistida",
      "codo de golfista",
      "epicondilalgia medial",
    ],
  },
  {
    id: "elbow-flexion-cubital",
    title: "Test de flexión de codo (cubital)",
    src: `${CLINICAL_TEST_CDN}/elbow-flexion-cubital.webp?v=20260921elbow`,
    aliases: [
      "tunel cubital",
      "túnel cubital",
      "elbow flexion test",
      "test de flexion de codo",
      "test de flexión de codo",
    ],
  },
  {
    id: "cervical-distraction",
    title: "Distracción cervical",
    src: `${CLINICAL_TEST_CDN}/cervical-distraction.webp`,
    aliases: [
      "distraccion cervical",
      "distracción cervical",
      "traccion cervical",
      "tracción cervical",
      "cervical distraction",
    ],
  },
  {
    id: "flexion-rotation",
    title: "Flexion–rotation test (FRT / C1–C2)",
    src: `${CLINICAL_TEST_CDN}/flexion-rotation.webp`,
    aliases: [
      "flexion rotation",
      "flexion-rotation",
      "frt",
      "test de flexion rotacion",
      "test de flexión rotación",
      "c1 c2",
      "upper cervical rotation",
    ],
  },
  {
    id: "bakody",
    title: "Bakody (shoulder abduction relief)",
    src: `${CLINICAL_TEST_CDN}/bakody.webp`,
    aliases: [
      "bakody",
      "signo de bakody",
      "shoulder abduction relief",
      "abduccion alivio",
      "abducción alivio",
      "mano en la cabeza",
    ],
  },
  {
    id: "thumb-ucl-stress",
    title: "Estrés UCL del pulgar (valgo MCP)",
    src: `${CLINICAL_TEST_CDN}/thumb-ucl-stress.webp`,
    aliases: [
      "ucl pulgar",
      "skier",
      "skier's thumb",
      "gamekeeper",
      "estres ucl",
      "estrés ucl",
      "stener",
      "lesión de stener",
      "stener lesion",
    ],
  },
  {
    id: "finkelstein",
    title: "Finkelstein (De Quervain)",
    src: `${CLINICAL_TEST_CDN}/finkelstein.webp?v=20260921finkel`,
    aliases: [
      "finkelstein",
      "test de finkelstein",
      "de quervain",
      "dequervain",
    ],
  },
  {
    id: "what-test",
    title: "WHAT (De Quervain)",
    src: `${CLINICAL_TEST_CDN}/what-test.webp`,
    aliases: [
      "what",
      "what test",
      "test what",
      "wrist hyperflexion abduction thumb",
      "hiperflexion pulgar",
      "hiperflexión pulgar",
    ],
  },
  {
    id: "watson-scaphoid-shift",
    title: "Watson / scaphoid shift",
    src: `${CLINICAL_TEST_CDN}/watson-scaphoid-shift.webp`,
    aliases: [
      "watson",
      "watson test",
      "test de watson",
      "scaphoid shift",
      "scaphoid shift test",
      "shift del escafoides",
      "desplazamiento escafoides",
      "lunotriquetral",
      "ballottement lt",
      "reagan",
      "kleinman shear",
      "lt shear",
    ],
  },
  {
    id: "snuffbox-palpation",
    title: "Palpación de la tabaquera anatómica",
    src: `${CLINICAL_TEST_CDN}/snuffbox-palpation.webp`,
    aliases: [
      "tabaquera",
      "tabaquera anatomica",
      "tabaquera anatómica",
      "snuffbox",
      "escafoides palpacion",
      "escafoides palpación",
    ],
  },
  {
    id: "thumb-axial-load",
    title: "Carga axial del pulgar (escafoides)",
    src: `${CLINICAL_TEST_CDN}/thumb-axial-load.webp`,
    aliases: [
      "carga axial",
      "carga axial del pulgar",
      "axial load thumb",
    ],
  },
  {
    id: "tfcc-ulnar-load",
    title: "Carga cubital / fosa cubital (TFCC)",
    src: `${CLINICAL_TEST_CDN}/tfcc-ulnar-load.webp`,
    aliases: [
      "tfcc",
      "carga cubital",
      "fosa cubital",
      "fibrocartilago triangular",
      "fibrocartílago triangular",
    ],
  },
  {
    id: "press-test",
    title: "Press test (Lester / TFCC)",
    src: `${CLINICAL_TEST_CDN}/press-test.webp`,
    aliases: [
      "press test",
      "press test tfcc",
      "lester press",
      "lester",
      "press test muñeca",
    ],
  },
  {
    id: "fovea-sign",
    title: "Fovea sign (TFCC)",
    src: `${CLINICAL_TEST_CDN}/fovea-sign.webp?v=20260921fovea`,
    aliases: [
      "fovea",
      "fovea sign",
      "signo de fovea",
      "signo de fóvea",
      "ulnar fovea",
      "fóvea cubital",
      "fovea cubital",
    ],
  },
  {
    id: "piano-key",
    title: "Piano-key (DRUJ)",
    src: `${CLINICAL_TEST_CDN}/piano-key.webp?v=20260921piano3`,
    aliases: [
      "piano key",
      "piano-key",
      "test piano key",
      "test de piano",
      "tecla de piano",
      "druj",
    ],
  },
  {
    id: "cmc-grind",
    title: "Grind test CMC del pulgar",
    src: `${CLINICAL_TEST_CDN}/cmc-grind.webp`,
    aliases: [
      "grind test",
      "artrosis cmc",
      "cmc grind",
      "base del pulgar",
      "cmc lever",
      "lever cmc",
      "palanca cmc",
      "rizartrosis",
    ],
  },
  {
    id: "froment",
    title: "Test de Froment (cubital)",
    src: `${CLINICAL_TEST_CDN}/froment.webp`,
    aliases: [
      "froment",
      "test de froment",
      "signo de froment",
      "froment sign",
      "papel froment",
      "wartenberg",
      "signo de wartenberg",
      "wartenberg sign",
    ],
  },
  {
    id: "jersey-finger",
    title: "Jersey finger (FDP)",
    src: `${CLINICAL_TEST_CDN}/jersey-finger.webp`,
    aliases: [
      "jersey",
      "jersey finger",
      "dedo de jersey",
      "fdp",
      "avulsion fdp",
      "avulsión fdp",
    ],
  },
  {
    id: "mallet-finger",
    title: "Mallet finger (extensor)",
    src: `${CLINICAL_TEST_CDN}/mallet-finger.webp`,
    aliases: [
      "mallet",
      "mallet finger",
      "dedo en martillo",
      "dedo martillo",
      "extensor DIP",
    ],
  },
  {
    id: "trigger-a1",
    title: "Trigger finger (A1)",
    src: `${CLINICAL_TEST_CDN}/trigger-a1.webp`,
    aliases: [
      "trigger",
      "trigger finger",
      "dedo en resorte",
      "dedo gatillo",
      "a1",
      "polea a1",
      "a1 pulley",
    ],
  },
  {
    id: "crossed-slr",
    title: "SLR cruzado (well-leg)",
    src: `${CLINICAL_TEST_CDN}/crossed-slr.webp`,
    aliases: [
      "slr cruzado",
      "crossed slr",
      "well leg",
      "well-leg",
      "lasegue cruzado",
      "lasègue cruzado",
    ],
  },
  {
    id: "cmc-lever",
    title: "CMC lever (rizartrosis)",
    src: `${CLINICAL_TEST_CDN}/cmc-grind.webp`,
    aliases: [
      "cmc lever",
      "lever cmc",
      "palanca cmc",
      "test lever",
      "cmc lever test",
    ],
  },
  {
    id: "lt-ballottement",
    title: "Ballottement LT / Reagan",
    src: `${CLINICAL_TEST_CDN}/lt-ballottement.webp?v=20260922lt`,
    aliases: [
      "ballottement lt",
      "lt ballottement",
      "reagan",
      "reagan test",
      "kleinman shear",
      "lt shear",
      "ballottement lunotriquetral",
    ],
  },
  {
    id: "hamstring-stretch",
    title: "Estiramiento de isquiotibiales",
    src: `${CLINICAL_TEST_CDN}/slr-lasegue.webp`,
    aliases: [
      "estiramiento de isquiotibiales",
      "estiramiento isquiotibiales",
      "hamstring stretch",
      "elongacion isquiotibiales",
      "elongación isquiotibiales",
    ],
  },
  {
    id: "resisted-knee-flexion",
    title: "Flexión de rodilla resistida (isquiotibiales)",
    src: `${CLINICAL_TEST_CDN}/resisted-knee-flexion.webp?v=20260922rkf`,
    aliases: [
      "flexion de rodilla resistida",
      "flexión de rodilla resistida",
      "flexion rodilla resistida",
      "resisted knee flexion",
      "isquiotibiales resistidos",
    ],
  },
  {
    id: "sitting-ischium",
    title: "Dolor al sentarse (isquion / proximal)",
    src: `${CLINICAL_TEST_CDN}/sitting-ischium.webp?v=20260922sit`,
    aliases: [
      "dolor al sentarse",
      "sitting ischium",
      "dolor isquion",
      "tuberosidad isquiatica",
      "tuberosidad isquiática",
      "proximal hamstring sitting",
    ],
  },
] as const;

/** Prefer longer aliases first so "cajon anterior del tobillo" beats "cajon anterior". */
const ALIAS_INDEX: { alias: string; test: ClinicalTestImage }[] =
  CLINICAL_TEST_IMAGES.flatMap((test) =>
    [...test.aliases]
      .map((alias) => ({ alias: normalizeForMatch(alias), test }))
      .sort((a, b) => b.alias.length - a.alias.length)
  ).sort((a, b) => b.alias.length - a.alias.length);

/** Illustrated maneuvers grouped by body region for physio/patient prompts. */
const CLINICAL_TEST_REGION_GROUPS: readonly {
  label: string;
  ids: readonly string[];
}[] = [
  {
    label: "Rodilla",
    ids: [
      "lachman",
      "anterior-drawer-knee",
      "pivot-shift",
      "mcmurray",
      "thessaly",
      "valgus-stress-mcl",
      "varus-stress-lcl",
      "posterior-drawer-pcl",
      "noble-compression",
      "ober-test",
      "patellar-apprehension",
      "dial-test",
      "resisted-knee-flexion",
    ],
  },
  {
    label: "Hombro",
    ids: [
      "neer",
      "hawkins-kennedy",
      "jobe-empty-can",
      "full-can",
      "apprehension",
      "surprise",
      "speed",
      "yergason",
      "uppercut",
      "drop-arm",
      "painful-arc",
      "er-lag",
      "belly-press",
      "lift-off",
      "cross-body",
      "paxinos",
      "obrien",
      "crank",
      "kim-test",
      "jerk-test",
    ],
  },
  {
    label: "Cuello / neural miembro superior",
    ids: ["spurling", "ultt", "cervical-distraction", "flexion-rotation", "bakody"],
  },
  {
    label: "Tobillo / pie",
    ids: [
      "thompson",
      "matles",
      "anterior-drawer-ankle",
      "talar-tilt",
      "syndesmosis-squeeze",
      "kleiger",
      "windlass",
      "heel-raise",
      "mulder",
      "tinel-tarsal",
      "hop-test",
    ],
  },
  {
    label: "Cadera",
    ids: [
      "faber",
      "fadir",
      "trendelenburg",
      "resisted-adduction",
      "resisted-hip-flexion",
      "thomas-test",
      "resisted-abduction",
      "log-roll",
      "stinchfield",
      "hip-scour",
      "hamstring-stretch",
      "sitting-ischium",
      "hop-test",
    ],
  },
  {
    label: "Muñeca / mano",
    ids: [
      "phalen",
      "tinel",
      "durkan",
      "finkelstein",
      "what-test",
      "watson-scaphoid-shift",
      "snuffbox-palpation",
      "thumb-axial-load",
      "tfcc-ulnar-load",
      "press-test",
      "fovea-sign",
      "piano-key",
      "cmc-grind",
      "cmc-lever",
      "lt-ballottement",
      "thumb-ucl-stress",
      "froment",
      "jersey-finger",
      "mallet-finger",
      "trigger-a1",
    ],
  },
  {
    label: "Codo",
    ids: [
      "cozen",
      "mill",
      "maudsley",
      "hook-test",
      "biceps-squeeze",
      "milking-maneuver",
      "moving-valgus",
      "resisted-wrist-flexion",
      "elbow-flexion-cubital",
      "chair-push-plri",
    ],
  },
  {
    label: "Columna lumbar / espalda",
    ids: [
      "slr-lasegue",
      "crossed-slr",
      "kemp",
      "faber",
      "schober",
      "thigh-thrust",
      "si-distraction",
      "si-compression",
      "active-slr",
    ],
  },
];

/**
 * Closed list injected into Fisioterapia prompts so numbered maneuvers always
 * match an illustration in the app — and stay on the injured body region.
 */
export function illustratedClinicalTestsPromptBlock(): string {
  const byId = new Map(CLINICAL_TEST_IMAGES.map((t) => [t.id, t]));
  const groups = CLINICAL_TEST_REGION_GROUPS.map(({ label, ids }) => {
    const lines = ids
      .map((id) => byId.get(id)?.title)
      .filter(Boolean)
      .map((title) => `  - ${title}`)
      .join("\n");
    return `**${label}**\n${lines}`;
  }).join("\n");

  return `CATÁLOGO ILUSTRADO DE MANIOBRAS (CRÍTICO — incumplir esto es un error):
ÁMBITO: SOLO chat/informe para FISIOTERAPEUTA (listas de exploración en consulta). NUNCA uses este catálogo en la sección **Pruebas funcionales** que ve el paciente (Sí/No en casa): ahí solo movimientos cotidianos autoejecutables, sin nombres de maniobras clínicas.

Cuando listes pruebas/maniobras/tests numeradas PARA EL FISIO (1. 2. 3.…), SOLO puedes usar tests de esta lista. Cada uno tiene VÍDEO e imagen en AIKinora; si inventas otro nombre (p. ej. «Agarre», «flexión resistida», «elevación activa»), el vídeo NO aparece.

VÍDEOS (CRÍTICO — fuerza del producto):
- Si el fisioterapeuta pide pruebas, tests, maniobras o «pruebas funcionales» de una zona, responde SIEMPRE con lista numerada usando EXACTAMENTE los nombres canónicos del grupo de ESA zona.
- PROHIBIDO inventar nombres cotidianos o genéricos en líneas numeradas (Sentadilla, Marcha, Agarre, etc.).
- Si pide N pruebas, elige las N más relevantes del catálogo de esa zona (si hay menos, lista todas las del grupo).
- Si pide TODAS las pruebas / all tests / el catálogo de una zona, lista TODAS las del grupo de esa zona (una línea numerada por test, nombre canónico). Así la app muestra el vídeo de cada una.
- Si pide todas las pruebas SIN zona, recorre CADA grupo con encabezado **Zona:** (p. ej. **Lumbar:**, **Rodilla:**) y lista todas las de ese grupo. NUNCA mezcles tests de rodilla bajo **Lumbar:**.
- Lumbar/espalda: SOLO SLR / Lasègue, SLR cruzado (well-leg), Kemp, FABER (Patrick), Schober, Thigh thrust (SIJ), Distracción/Compresión SI, Active SLR. PROHIBIDO Cajón posterior / sag / LCP (eso es RODILLA).
- Si el caso es «Espalda» (sin más detalle), trata como lumbar y lista 4–5 de ese grupo (no tests genéricos).

REGLA DE ZONA (CRÍTICO — error grave si se incumple):
- Identifica la ZONA LESIONADA del caso (pie/tobillo, rodilla, hombro, muñeca, lumbar/espalda, etc.).
- En listas numeradas (**Pruebas específicas**, exploración, maniobras a realizar, pruebas funcionales, etc.) SOLO puedes numerar tests del GRUPO de ESA zona.
- PROHIBIDO numerar tests de otra región. Ejemplos: dolor lumbar → NUNCA Cajón posterior, Lachman ni tests de rodilla; dolor de pie/tobillo → NUNCA Spurling, Phalen, Signo de Tinel (muñeca), ULTT, Neer, Lachman, etc.; dolor de muñeca → NUNCA Windlass/Thompson; dolor de rodilla → NUNCA tests de hombro; dolor de codo/UCL → NUNCA Test de Lachman (eso es RODILLA / LCA).
- Signo de Tinel y Phalen (sin «tarsal») del catálogo son de MUÑECA/MANO. Para pie/túnel tarsiano numerar **Tinel tarsal** (grupo Tobillo / pie), NUNCA «Signo de Tinel» de muñeca.
- Codo medial / UCL / lanzadores: numerar **Moving valgus stress (UCL)** y/o **Milking maneuver (UCL)**. PROHIBIDO numerar «Test de Lachman» o «Lachman de codo» (no hay vídeo de Lachman de codo; Lachman del catálogo es solo rodilla).
- Si una maniobra útil no está en el grupo de esa zona, menciónala en prosa SIN numerarla (así no aparece la imagen de otra región).
- Hipótesis a distancia se pueden explicar en texto; las pruebas numeradas son SOLO locales a la zona lesionada.

Catálogo por zona:
${groups}
- Usa exactamente el nombre canónico de la lista en la línea numerada (p. ej. "1. **Test de Lachman (rodilla / LCA)**: …").
- Elige las más relevantes para la zona/hipótesis; no inventes maniobras fuera del catálogo.
- Si necesitas otra maniobra no listada, menciónala en prosa SIN numerarla (así no queda una fila sin imagen).`;
}

/** True when the message is asking for a list of tests / functional pruebas. */
export function isClinicalPruebasListRequest(text: string): boolean {
  const n = normalizeForMatch(text);
  if (!n) return false;
  return (
    /\b(pruebas?|tests?|maniobras?|exploracion)\b/.test(n) ||
    /\bpruebas?\s+funcionales?\b/.test(n) ||
    /\bfunctional\s+tests?\b/.test(n)
  );
}

/** True when the physio wants the full catalog (not a short sample). */
export function isAllClinicalPruebasRequest(text: string): boolean {
  const n = normalizeForMatch(text);
  if (!n) return false;
  return /\b(todas|todos|all|completas?|catalogo|el catalogo)\b/.test(n);
}

const ZONE_QUERY_PATTERNS: readonly { ids: readonly string[]; re: RegExp }[] = [
  {
    ids: CLINICAL_TEST_REGION_GROUPS.find((g) =>
      g.label.startsWith("Columna")
    )!.ids,
    re: /\b(espalda|lumbar(?:es)?|lumbalgia|lumbago|lumbosacr\w*|ciatic\w*|back)\b/,
  },
  {
    ids: CLINICAL_TEST_REGION_GROUPS.find((g) => g.label.startsWith("Muñeca"))!
      .ids,
    re: /\b(muneca|wrist|mano|hand|carpo|carpal)\b/,
  },
  {
    ids: CLINICAL_TEST_REGION_GROUPS.find((g) => g.label === "Codo")!.ids,
    re: /\b(codo|elbow|epicondil)/,
  },
  {
    ids: CLINICAL_TEST_REGION_GROUPS.find((g) => g.label === "Hombro")!.ids,
    re: /\b(hombro|shoulder|manguito|cuff)\b/,
  },
  {
    ids: CLINICAL_TEST_REGION_GROUPS.find((g) => g.label === "Rodilla")!.ids,
    re: /\b(rodilla|knee|menisc)\b/,
  },
  {
    ids: CLINICAL_TEST_REGION_GROUPS.find((g) => g.label.startsWith("Tobillo"))!
      .ids,
    re: /\b(tobillo|ankle|pie|foot|aquiles|achilles|plantar|fascitis)\b/,
  },
  {
    ids: CLINICAL_TEST_REGION_GROUPS.find((g) => g.label === "Cadera")!.ids,
    re: /\b(cadera|hip|ingle|groin|muslo|thigh|isquio)\b/,
  },
  {
    ids: CLINICAL_TEST_REGION_GROUPS.find((g) =>
      g.label.startsWith("Cuello")
    )!.ids,
    re: /\b(cuello|cervical|neck)\b/,
  },
];

export function clinicalTestsForRegionIds(
  ids: readonly string[]
): ClinicalTestImage[] {
  const seen = new Set<string>();
  const out: ClinicalTestImage[] = [];
  for (const id of ids) {
    if (seen.has(id)) continue;
    seen.add(id);
    const t = CLINICAL_TEST_IMAGES.find((x) => x.id === id);
    if (t) out.push(t);
  }
  return out;
}

export function allIllustratedClinicalTests(): ClinicalTestImage[] {
  return clinicalTestsForRegionIds(
    CLINICAL_TEST_REGION_GROUPS.flatMap((g) => [...g.ids])
  );
}

/** Region catalog ids for a section heading such as **Lumbar:**. */
export function clinicalTestRegionIdsForHeading(
  text: string
): readonly string[] | null {
  const n = normalizeForMatch(text);
  if (!n) return null;
  for (const { ids, re } of ZONE_QUERY_PATTERNS) {
    if (re.test(n)) return ids;
  }
  return null;
}

/** True for a short region label line (Lumbar:, Rodilla), not a sentence that mentions the zone. */
export function isClinicalRegionSectionLabel(text: string): boolean {
  const n = normalizeForMatch(text);
  if (!n || n.length > 40 || n.split(" ").length > 5) return false;
  if (
    /\b(evaluar|dolor|paciente|capacidad|carrera|sentadilla|marcha|prueba|test)\b/.test(
      n
    )
  ) {
    return false;
  }
  return clinicalTestRegionIdsForHeading(text) !== null;
}

/**
 * When a physio asks for pruebas of a body region, return catalog tests for
 * that zone (so the UI can still show videos if the model invents names).
 * “Todas las pruebas” without a zone returns the full illustrated catalog.
 */
export function illustratedTestsForPruebasQuery(
  userText: string
): ClinicalTestImage[] {
  if (!isClinicalPruebasListRequest(userText)) return [];
  const normalized = normalizeForMatch(userText);
  for (const { ids, re } of ZONE_QUERY_PATTERNS) {
    if (!re.test(normalized)) continue;
    return clinicalTestsForRegionIds(ids);
  }
  if (isAllClinicalPruebasRequest(userText)) {
    return allIllustratedClinicalTests();
  }
  return [];
}

/**
 * True when the physio wants a zone battery / catalog list — not one named maneuver.
 * Singular «prueba del cajón anterior…» → false; «pruebas del tobillo» → true.
 */
export function asksForZoneTestBattery(userText: string): boolean {
  const n = normalizeForMatch(userText);
  if (!n) return false;
  if (isAllClinicalPruebasRequest(userText)) return true;
  if (
    /\b(todas|varios|varias|bater[ií]a|lista completa|cat[aá]logo)\b/.test(n)
  ) {
    return true;
  }
  if (
    /\b(cu[aá]les|qu[eé])\s+(son\s+)?(las\s+)?(pruebas|tests|maniobras)\b/.test(
      n
    )
  ) {
    return true;
  }
  // Plural zone request: "pruebas del tobillo", "tests de rodilla", …
  if (
    /\b(pruebas|tests|maniobras)\s+(del?|de la|de el|de)\s+\w+/.test(n) ||
    /\b(pruebas|tests|maniobras)\s+(funcionales\s+)?(de|del|para)\b/.test(n)
  ) {
    return true;
  }
  const m = /\b(\d{1,2})\b/.exec(userText);
  if (m && Number(m[1]) >= 2) return true;
  return false;
}

export function nextIllustratedFallbackTest(
  fallbackTests: ClinicalTestImage[],
  shownIds: Set<string>,
  regionIds: readonly string[] | null
): ClinicalTestImage | null {
  const pool = regionIds
    ? fallbackTests.length > 0
      ? fallbackTests.filter((t) => regionIds.includes(t.id))
      : clinicalTestsForRegionIds(regionIds)
    : fallbackTests;
  return pool.find((t) => !shownIds.has(t.id)) ?? null;
}

export function leftoverIllustratedTests(
  fallbackTests: ClinicalTestImage[],
  shownIds: Set<string>,
  regionIds: readonly string[] | null
): ClinicalTestImage[] {
  if (fallbackTests.length === 0) return [];
  // Single named-test asks must not dump the rest of the zone catalog.
  if (fallbackTests.length === 1) return [];
  const pool = regionIds
    ? fallbackTests.filter((t) => regionIds.includes(t.id))
    : fallbackTests;
  return pool.filter((t) => !shownIds.has(t.id));
}

/**
 * Pick catalog tests to surface for a pruebas request.
 * Named single maneuver (e.g. «cajón anterior del tobillo») → only that test.
 * Zone battery / «todas» / «dime 3» → zone list (honours count).
 */
export function pickIllustratedTestsForPruebasQuery(
  userText: string
): ClinicalTestImage[] {
  if (!isClinicalPruebasListRequest(userText)) return [];

  if (isAllClinicalPruebasRequest(userText)) {
    const all = illustratedTestsForPruebasQuery(userText);
    return all.length > 0 ? all : allIllustratedClinicalTests();
  }

  const named = findClinicalTestImage(userText);
  if (named && !asksForZoneTestBattery(userText)) {
    return [named];
  }

  const all = illustratedTestsForPruebasQuery(userText);
  if (all.length === 0) return named ? [named] : [];
  const m = /\b(\d{1,2})\b/.exec(userText);
  if (!m) return all;
  const n = Math.min(Math.max(Number(m[1]), 1), all.length);
  return all.slice(0, n);
}

/**
 * Find the best matching clinical-test illustration for a line of assistant text.
 * Returns null when nothing matches, or when several different tests are named
 * in the same line (e.g. welcome text listing Neer, Hawkins, Lachman…).
 *
 * Optional `bodyArea` / `regionHint` blocks cross-region false positives
 * (e.g. elbow UCL “Lachman” must never attach the knee Lachman video).
 */
export function findClinicalTestImage(
  line: string,
  opts?: { bodyArea?: string | null; regionHint?: string | null }
): ClinicalTestImage | null {
  const normalized = normalizeForMatch(line);
  if (!normalized) return null;

  const context = normalizeForMatch(
    [opts?.bodyArea, opts?.regionHint].filter(Boolean).join(" ")
  );
  const haystack = `${normalized} ${context}`.trim();

  const byId = (id: string) =>
    CLINICAL_TEST_IMAGES.find((t) => t.id === id) ?? null;

  const kneeIds = new Set(
    CLINICAL_TEST_REGION_GROUPS.find((g) => g.label === "Rodilla")?.ids ?? []
  );

  const thumbCue =
    /\b(pulgar|thumb|mcp|esquiador|gamekeeper|skier)\b/.test(haystack);
  const kneeCue =
    /\b(rodilla|knee|lca|acl|lcp|pcl|menisc|rotul|patell)\b/.test(haystack);
  const elbowCue =
    /\b(codo|elbow|epicondil|lanzador|thrower|milking|moving valgus|plri|chair push|chair sign|biceps distal|hook test)\b/.test(
      haystack
    ) ||
    (/\b(ucl|ligamento colateral cubital|colateral cubital)\b/.test(haystack) &&
      !thumbCue);

  const ankleCue =
    normalized.includes("tobillo") ||
    normalized.includes("ankle") ||
    normalized.includes("atfl") ||
    context.includes("tobillo") ||
    context.includes("ankle");

  // Elbow / UCL “Lachman” is a clinical nickname — never the knee Lachman clip.
  if (
    normalized.includes("lachman") &&
    elbowCue &&
    !kneeCue &&
    !thumbCue
  ) {
    return byId("moving-valgus");
  }

  // Elbow valgo/UCL lines must not attach knee MCL valgus stress.
  if (
    elbowCue &&
    !kneeCue &&
    !thumbCue &&
    (normalized.includes("valgus") ||
      normalized.includes("valgo") ||
      normalized.includes("ucl") ||
      normalized.includes("colateral cubital"))
  ) {
    if (normalized.includes("milking")) return byId("milking-maneuver");
    if (
      normalized.includes("valgus") ||
      normalized.includes("valgo") ||
      normalized.includes("lachman") ||
      normalized.includes("ucl") ||
      normalized.includes("colateral cubital")
    ) {
      return byId("moving-valgus");
    }
  }

  // Posterior drawer is knee/LCP — never treat it as lumbar.
  if (
    !ankleCue &&
    (normalized.includes("cajon posterior") ||
      normalized.includes("posterior drawer") ||
      normalized.includes("posterior sag"))
  ) {
    return byId("posterior-drawer-pcl");
  }

  // Prefer ankle drawer when the line mentions ankle/tobillo together with drawer.
  if (
    ankleCue &&
    (normalized.includes("cajon") || normalized.includes("drawer"))
  ) {
    return byId("anterior-drawer-ankle");
  }

  // Prefer knee drawer when rodilla/knee + cajon without ankle cues.
  if (
    (normalized.includes("rodilla") ||
      normalized.includes("knee") ||
      context.includes("rodilla") ||
      context.includes("knee")) &&
    (normalized.includes("cajon") || normalized.includes("drawer"))
  ) {
    return byId("anterior-drawer-knee");
  }

  const hits: ClinicalTestImage[] = [];
  for (const { alias, test } of ALIAS_INDEX) {
    if (!alias || !normalized.includes(alias)) continue;
    if (!hits.some((h) => h.id === test.id)) hits.push(test);
  }

  // Only attach an image when the line is clearly about ONE concrete maneuver.
  if (hits.length !== 1) return null;
  const hit = hits[0];

  // Hard region gate: elbow context must never show a knee-only video.
  if (elbowCue && !kneeCue && kneeIds.has(hit.id)) {
    if (hit.id === "lachman" || hit.id === "valgus-stress-mcl") {
      return byId("moving-valgus");
    }
    return null;
  }

  // Wrist Tinel/Phalen illustrations must not attach when the line is about foot/ankle.
  const footAnkleCue =
    /\b(pie|plantar|dorso|tobillo|tarsiano|tarsal|ankle|foot|morton|aquiles|achilles|atfl)\b/.test(
      haystack
    );
  if (footAnkleCue && (hit.id === "tinel" || hit.id === "phalen")) {
    return null;
  }

  return hit;
}

/**
 * Whether a chat line is a concrete maneuver recommendation (numbered item or
 * a whole-line title), not casual mention in prose / intro.
 */
export function shouldShowClinicalTestImage(opts: {
  numberedText: string | null;
  headingText?: string | null;
  wholeBoldText?: string | null;
  bodyArea?: string | null;
  regionHint?: string | null;
}): ClinicalTestImage | null {
  const { numberedText, headingText, wholeBoldText, bodyArea, regionHint } =
    opts;
  const matchOpts = { bodyArea, regionHint };
  if (numberedText) return findClinicalTestImage(numberedText, matchOpts);
  // Whole-line titles like **Test de Lachman** — not long prose headings.
  const title = wholeBoldText ?? headingText;
  if (!title) return null;
  const plain = title.replace(/\*\*/g, "").trim();
  // Skip long section titles / multi-clause sentences.
  if (plain.length > 80 || (plain.match(/,/g) ?? []).length >= 2) return null;
  return findClinicalTestImage(plain, matchOpts);
}
