/**
 * Maps clinical special-test names (physio chat) to educational illustrations
 * in /public/clinical-tests/. Used to show an image under each named maneuver.
 */

export type ClinicalTestImage = {
  id: string;
  title: string;
  /** Public URL path served from /public */
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
    title: "Test de Lachman",
    src: "/clinical-tests/lachman.webp",
    aliases: ["lachman", "test de lachman"],
  },
  {
    id: "anterior-drawer-knee",
    title: "Cajón anterior (rodilla)",
    src: "/clinical-tests/anterior-drawer-knee.webp",
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
    src: "/clinical-tests/pivot-shift.webp",
    aliases: ["pivot shift", "pivot-shift", "test de pivot"],
  },
  {
    id: "mcmurray",
    title: "Test de McMurray",
    src: "/clinical-tests/mcmurray.webp",
    aliases: ["mcmurray", "mc murray", "test de mcmurray"],
  },
  {
    id: "thessaly",
    title: "Test de Thessaly",
    src: "/clinical-tests/thessaly.webp",
    aliases: ["thessaly", "test de thessaly"],
  },
  {
    id: "neer",
    title: "Test de Neer",
    src: "/clinical-tests/neer.webp",
    aliases: ["neer", "test de neer", "neer's"],
  },
  {
    id: "hawkins-kennedy",
    title: "Hawkins-Kennedy",
    src: "/clinical-tests/hawkins-kennedy.webp",
    aliases: ["hawkins", "hawkins-kennedy", "hawkins kennedy"],
  },
  {
    id: "jobe-empty-can",
    title: "Jobe / Empty can",
    src: "/clinical-tests/jobe-empty-can.webp",
    aliases: ["jobe", "empty can", "empty-can", "lata vacia", "lata vacía"],
  },
  {
    id: "apprehension",
    title: "Apprehension / Relocation",
    src: "/clinical-tests/apprehension.webp",
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
    src: "/clinical-tests/speed.webp",
    aliases: ["speed", "test de speed"],
  },
  {
    id: "yergason",
    title: "Test de Yergason",
    src: "/clinical-tests/yergason.webp",
    aliases: ["yergason", "test de yergason"],
  },
  {
    id: "drop-arm",
    title: "Drop arm",
    src: "/clinical-tests/drop-arm.webp",
    aliases: ["drop arm", "drop-arm", "caida del brazo", "caída del brazo"],
  },
  {
    id: "painful-arc",
    title: "Painful arc",
    src: "/clinical-tests/painful-arc.webp",
    aliases: ["painful arc", "arco doloroso", "arco doloroso de abduccion"],
  },
  {
    id: "spurling",
    title: "Test de Spurling",
    src: "/clinical-tests/spurling.webp",
    aliases: ["spurling", "test de spurling"],
  },
  {
    id: "ultt",
    title: "ULTT / ULNT",
    src: "/clinical-tests/ultt.webp",
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
    src: "/clinical-tests/thompson.webp",
    aliases: ["thompson", "test de thompson", "squeeze test", "simmonds"],
  },
  {
    id: "matles",
    title: "Test de Matles",
    src: "/clinical-tests/matles.webp",
    aliases: ["matles", "test de matles"],
  },
  {
    id: "anterior-drawer-ankle",
    title: "Cajón anterior (tobillo)",
    src: "/clinical-tests/anterior-drawer-ankle.webp",
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
    src: "/clinical-tests/windlass.webp",
    aliases: ["windlass", "test de windlass"],
  },
  {
    id: "heel-raise",
    title: "Heel raise / elevación de talones",
    src: "/clinical-tests/heel-raise.webp",
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
    src: "/clinical-tests/hop-test.webp",
    aliases: ["hop test", "hop-test", "salto monopodal", "single leg hop"],
  },
  {
    id: "faber",
    title: "FABER / Patrick",
    src: "/clinical-tests/faber.webp",
    aliases: ["faber", "patrick", "figure 4", "figura 4"],
  },
  {
    id: "fadir",
    title: "FADIR",
    src: "/clinical-tests/fadir.webp",
    aliases: ["fadir", "faddir", "impingement de cadera"],
  },
  {
    id: "trendelenburg",
    title: "Test de Trendelenburg",
    src: "/clinical-tests/trendelenburg.webp",
    aliases: [
      "trendelenburg",
      "test de trendelenburg",
      "pata coja",
      "apoyo monopodal",
      "single-leg stance",
    ],
  },
  {
    id: "phalen",
    title: "Test de Phalen",
    src: "/clinical-tests/phalen.webp",
    aliases: ["phalen", "test de phalen", "posicion de rezo", "posición de rezo"],
  },
  {
    id: "tinel",
    title: "Signo de Tinel",
    src: "/clinical-tests/tinel.webp",
    aliases: ["tinel", "signo de tinel", "test de tinel"],
  },
  {
    id: "cozen",
    title: "Test de Cozen",
    src: "/clinical-tests/cozen.webp",
    aliases: ["cozen", "test de cozen"],
  },
  {
    id: "mill",
    title: "Test de Mill",
    src: "/clinical-tests/mill.webp",
    aliases: ["mill", "test de mill", "mills", "test de mills"],
  },
  {
    id: "schober",
    title: "Test de Schober",
    src: "/clinical-tests/schober.webp",
    aliases: ["schober", "test de schober"],
  },
  {
    id: "slr-lasegue",
    title: "SLR / Lasègue",
    src: "/clinical-tests/slr-lasegue.webp",
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
    src: "/clinical-tests/kemp.webp",
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
    src: "/clinical-tests/cross-body.webp",
    aliases: [
      "cross body",
      "cross-body",
      "aduccion horizontal",
      "aducción horizontal",
      "test de cross body",
    ],
  },
  {
    id: "valgus-stress-mcl",
    title: "Estrés en valgo (LCM)",
    src: "/clinical-tests/valgus-stress-mcl.webp",
    aliases: [
      "estres en valgo",
      "estrés en valgo",
      "ligamento colateral medial",
      "valgus stress",
    ],
  },
  {
    id: "varus-stress-lcl",
    title: "Estrés en varo (LCL)",
    src: "/clinical-tests/varus-stress-lcl.webp",
    aliases: [
      "estres en varo",
      "estrés en varo",
      "ligamento colateral lateral",
      "varus stress",
    ],
  },
  {
    id: "posterior-drawer-pcl",
    title: "Cajón posterior / sag (LCP)",
    src: "/clinical-tests/posterior-drawer-pcl.webp",
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
    id: "resisted-wrist-flexion",
    title: "Flexión de muñeca resistida (medial)",
    src: "/clinical-tests/resisted-wrist-flexion.webp",
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
    src: "/clinical-tests/elbow-flexion-cubital.webp",
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
    src: "/clinical-tests/cervical-distraction.webp",
    aliases: [
      "distraccion cervical",
      "distracción cervical",
      "traccion cervical",
      "tracción cervical",
      "cervical distraction",
    ],
  },
  {
    id: "thumb-ucl-stress",
    title: "Estrés UCL del pulgar (valgo MCP)",
    src: "/clinical-tests/thumb-ucl-stress.webp",
    aliases: [
      "ucl pulgar",
      "skier",
      "skier's thumb",
      "gamekeeper",
      "estres ucl",
      "estrés ucl",
    ],
  },
  {
    id: "finkelstein",
    title: "Finkelstein (De Quervain)",
    src: "/clinical-tests/finkelstein.webp",
    aliases: [
      "finkelstein",
      "test de finkelstein",
      "de quervain",
      "dequervain",
    ],
  },
  {
    id: "snuffbox-palpation",
    title: "Palpación de la tabaquera anatómica",
    src: "/clinical-tests/snuffbox-palpation.webp",
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
    src: "/clinical-tests/thumb-axial-load.webp",
    aliases: [
      "carga axial",
      "carga axial del pulgar",
      "axial load thumb",
    ],
  },
  {
    id: "tfcc-ulnar-load",
    title: "Carga cubital / fosa cubital (TFCC)",
    src: "/clinical-tests/tfcc-ulnar-load.webp",
    aliases: [
      "tfcc",
      "carga cubital",
      "fosa cubital",
      "fibrocartilago triangular",
      "fibrocartílago triangular",
    ],
  },
  {
    id: "cmc-grind",
    title: "Grind test CMC del pulgar",
    src: "/clinical-tests/cmc-grind.webp",
    aliases: [
      "grind test",
      "artrosis cmc",
      "cmc grind",
      "base del pulgar",
    ],
  },
  {
    id: "crossed-slr",
    title: "SLR cruzado (well-leg)",
    src: "/clinical-tests/crossed-slr.webp",
    aliases: [
      "slr cruzado",
      "crossed slr",
      "well leg",
      "well-leg",
      "lasegue cruzado",
      "lasègue cruzado",
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
    ],
  },
  {
    label: "Hombro",
    ids: [
      "neer",
      "hawkins-kennedy",
      "jobe-empty-can",
      "apprehension",
      "speed",
      "yergason",
      "drop-arm",
      "painful-arc",
      "cross-body",
    ],
  },
  {
    label: "Cuello / neural miembro superior",
    ids: ["spurling", "ultt", "cervical-distraction"],
  },
  {
    label: "Tobillo / pie",
    ids: [
      "thompson",
      "matles",
      "anterior-drawer-ankle",
      "windlass",
      "heel-raise",
      "hop-test",
    ],
  },
  {
    label: "Cadera",
    ids: ["faber", "fadir", "trendelenburg", "hop-test"],
  },
  {
    label: "Muñeca / mano",
    ids: [
      "phalen",
      "tinel",
      "finkelstein",
      "snuffbox-palpation",
      "thumb-axial-load",
      "tfcc-ulnar-load",
      "cmc-grind",
      "thumb-ucl-stress",
    ],
  },
  {
    label: "Codo",
    ids: ["cozen", "mill", "resisted-wrist-flexion", "elbow-flexion-cubital"],
  },
  {
    label: "Columna lumbar / espalda",
    ids: ["schober", "slr-lasegue", "crossed-slr", "kemp"],
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
Cuando listes pruebas/maniobras/tests/pruebas funcionales numeradas (1. 2. 3.…), SOLO puedes usar tests de esta lista. Cada uno tiene VÍDEO e imagen en AIKinora; si inventas otro nombre (p. ej. «Agarre», «flexión resistida», «elevación activa»), el vídeo NO aparece.

VÍDEOS (CRÍTICO — fuerza del producto):
- Si el fisioterapeuta pide pruebas, tests, maniobras o «pruebas funcionales» de una zona, responde SIEMPRE con lista numerada usando EXACTAMENTE los nombres canónicos del grupo de ESA zona.
- PROHIBIDO inventar nombres cotidianos o genéricos en líneas numeradas (Sentadilla, Marcha, Agarre, etc.).
- Si pide N pruebas, elige las N más relevantes del catálogo de esa zona (si hay menos, lista todas las del grupo).
- Si pide TODAS las pruebas / all tests / el catálogo de una zona, lista TODAS las del grupo de esa zona (una línea numerada por test, nombre canónico). Así la app muestra el vídeo de cada una.
- Si pide todas las pruebas SIN zona, recorre CADA grupo con encabezado **Zona:** (p. ej. **Lumbar:**, **Rodilla:**) y lista todas las de ese grupo. NUNCA mezcles tests de rodilla bajo **Lumbar:**.
- Lumbar/espalda: SOLO Schober, SLR / Lasègue, SLR cruzado (well-leg), Kemp. PROHIBIDO Cajón posterior / sag / LCP (eso es RODILLA).

REGLA DE ZONA (CRÍTICO — error grave si se incumple):
- Identifica la ZONA LESIONADA del caso (pie/tobillo, rodilla, hombro, muñeca, lumbar/espalda, etc.).
- En listas numeradas (**Pruebas específicas**, exploración, maniobras a realizar, pruebas funcionales, etc.) SOLO puedes numerar tests del GRUPO de ESA zona.
- PROHIBIDO numerar tests de otra región. Ejemplos: dolor lumbar → NUNCA Cajón posterior, Lachman ni tests de rodilla; dolor de pie/tobillo → NUNCA Spurling, Phalen, Signo de Tinel (muñeca), ULTT, Neer, Lachman, etc.; dolor de muñeca → NUNCA Windlass/Thompson; dolor de rodilla → NUNCA tests de hombro.
- Signo de Tinel y Phalen del catálogo son de MUÑECA/MANO (imagen de muñeca). NO los numeres para pie/túnel tarsiano aunque el nombre “Tinel” se use en tobillo.
- Si una maniobra útil no está en el grupo de esa zona (p. ej. Mulder/compresión interdigital para Morton, Tinel en túnel tarsiano), menciónala en prosa SIN numerarla (así no aparece la imagen de otra región).
- Hipótesis a distancia se pueden explicar en texto; las pruebas numeradas son SOLO locales a la zona lesionada.

Catálogo por zona:
${groups}
- Usa exactamente el nombre canónico de la lista en la línea numerada (p. ej. "1. **Test de Lachman**: …").
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
  const pool = regionIds
    ? fallbackTests.filter((t) => regionIds.includes(t.id))
    : fallbackTests;
  return pool.filter((t) => !shownIds.has(t.id));
}

/**
 * Pick how many catalog tests to surface for a pruebas request (honours “dime 2”).
 * Without an explicit number — or with “todas” — return the full zone (or catalog).
 */
export function pickIllustratedTestsForPruebasQuery(
  userText: string
): ClinicalTestImage[] {
  const all = illustratedTestsForPruebasQuery(userText);
  if (all.length === 0) return [];
  if (isAllClinicalPruebasRequest(userText)) return all;
  const m = /\b(\d{1,2})\b/.exec(userText);
  if (!m) return all;
  const n = Math.min(Math.max(Number(m[1]), 1), all.length);
  return all.slice(0, n);
}

/**
 * Find the best matching clinical-test illustration for a line of assistant text.
 * Returns null when nothing matches, or when several different tests are named
 * in the same line (e.g. welcome text listing Neer, Hawkins, Lachman…).
 */
export function findClinicalTestImage(line: string): ClinicalTestImage | null {
  const normalized = normalizeForMatch(line);
  if (!normalized) return null;

  const ankleCue =
    normalized.includes("tobillo") ||
    normalized.includes("ankle") ||
    normalized.includes("atfl");

  // Posterior drawer is knee/LCP — never treat it as lumbar.
  if (
    !ankleCue &&
    (normalized.includes("cajon posterior") ||
      normalized.includes("posterior drawer") ||
      normalized.includes("posterior sag"))
  ) {
    return (
      CLINICAL_TEST_IMAGES.find((t) => t.id === "posterior-drawer-pcl") ?? null
    );
  }

  // Prefer ankle drawer when the line mentions ankle/tobillo together with drawer.
  if (
    ankleCue &&
    (normalized.includes("cajon") || normalized.includes("drawer"))
  ) {
    return (
      CLINICAL_TEST_IMAGES.find((t) => t.id === "anterior-drawer-ankle") ?? null
    );
  }

  // Prefer knee drawer when rodilla/knee + cajon without ankle cues.
  if (
    (normalized.includes("rodilla") || normalized.includes("knee")) &&
    (normalized.includes("cajon") || normalized.includes("drawer"))
  ) {
    return (
      CLINICAL_TEST_IMAGES.find((t) => t.id === "anterior-drawer-knee") ?? null
    );
  }

  const hits: ClinicalTestImage[] = [];
  for (const { alias, test } of ALIAS_INDEX) {
    if (!alias || !normalized.includes(alias)) continue;
    if (!hits.some((h) => h.id === test.id)) hits.push(test);
  }

  // Only attach an image when the line is clearly about ONE concrete maneuver.
  if (hits.length !== 1) return null;
  const hit = hits[0];

  // Wrist Tinel/Phalen illustrations must not attach when the line is about foot/ankle.
  const footAnkleCue =
    /\b(pie|plantar|dorso|tobillo|tarsiano|tarsal|ankle|foot|morton|aquiles|achilles|atfl)\b/.test(
      normalized
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
}): ClinicalTestImage | null {
  const { numberedText, headingText, wholeBoldText } = opts;
  if (numberedText) return findClinicalTestImage(numberedText);
  // Whole-line titles like **Test de Lachman** — not long prose headings.
  const title = wholeBoldText ?? headingText;
  if (!title) return null;
  const plain = title.replace(/\*\*/g, "").trim();
  // Skip long section titles / multi-clause sentences.
  if (plain.length > 80 || (plain.match(/,/g) ?? []).length >= 2) return null;
  return findClinicalTestImage(plain);
}
