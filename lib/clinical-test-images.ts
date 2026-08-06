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
    aliases: [
      "lachman",
      "test de lachman",
      "flexionar y extender la rodilla",
      "flex and extend the knee",
    ],
  },
  {
    id: "anterior-drawer-knee",
    title: "Cajón anterior (rodilla)",
    src: "/clinical-tests/anterior-drawer-knee.webp",
    aliases: [
      "cajon anterior",
      "cajón anterior",
      "test del cajon anterior",
      "test de cajon anterior",
      "anterior drawer",
      "slocum",
      "drawer test of the knee",
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
    aliases: [
      "mcmurray",
      "mc murray",
      "test de mcmurray",
      "bajar un escalon",
      "bajar un escalón",
    ],
  },
  {
    id: "neer",
    title: "Test de Neer",
    src: "/clinical-tests/neer.webp",
    aliases: [
      "neer",
      "test de neer",
      "neer's",
      "elevar el brazo por encima de la cabeza",
      "levantar el brazo por encima de la cabeza",
      "elevar los brazos",
      "raise the arm overhead",
    ],
  },
  {
    id: "hawkins-kennedy",
    title: "Hawkins-Kennedy",
    src: "/clinical-tests/hawkins-kennedy.webp",
    aliases: [
      "hawkins",
      "hawkins-kennedy",
      "hawkins kennedy",
      "alcanzar la espalda",
      "reach behind your back",
    ],
  },
  {
    id: "jobe-empty-can",
    title: "Jobe / Empty can",
    src: "/clinical-tests/jobe-empty-can.webp",
    aliases: [
      "jobe",
      "empty can",
      "empty-can",
      "lata vacia",
      "lata vacía",
      "aguantar un objeto",
      "hold a light object",
    ],
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
      "rotar sin miedo",
      "brazo a 90",
    ],
  },
  {
    id: "speed",
    title: "Test de Speed",
    src: "/clinical-tests/speed.webp",
    aliases: [
      "speed",
      "test de speed",
      "palms up",
      "cerrar el puno",
      "girar un pomo",
      "levantar la muneca",
    ],
  },
  {
    id: "spurling",
    title: "Test de Spurling",
    src: "/clinical-tests/spurling.webp",
    aliases: [
      "spurling",
      "test de spurling",
      "girar la cabeza",
      "turn the head",
      "mirar al techo",
      "mirar al ombligo",
      "mirar arriba",
      "inclinar la cabeza",
      "mirar un poco hacia arriba",
    ],
  },
  {
    id: "thompson",
    title: "Test de Thompson",
    src: "/clinical-tests/thompson.webp",
    aliases: ["thompson", "test de thompson", "squeeze test", "simmonds"],
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
    id: "faber",
    title: "FABER / Patrick",
    src: "/clinical-tests/faber.webp",
    aliases: [
      "faber",
      "patrick",
      "figure 4",
      "figura 4",
      "sentadilla parcial",
      "cruzar piernas",
      "cross your legs",
    ],
  },
  {
    id: "fadir",
    title: "FADIR",
    src: "/clinical-tests/fadir.webp",
    aliases: [
      "fadir",
      "faddir",
      "impingement de cadera",
      "levantar la pierna de arriba",
    ],
  },
  {
    id: "phalen",
    title: "Test de Phalen",
    src: "/clinical-tests/phalen.webp",
    aliases: [
      "phalen",
      "test de phalen",
      "posicion de rezo",
      "posición de rezo",
      "apoyar la palma",
      "hacer un puno",
    ],
  },
  {
    id: "trendelenburg",
    title: "Test de Trendelenburg",
    src: "/clinical-tests/trendelenburg.webp",
    aliases: [
      "trendelenburg",
      "test de trendelenburg",
      "pata coja",
      "single leg",
      "una pierna",
    ],
  },
] as const;

/** Prefer longer aliases first so "cajon anterior del tobillo" beats "cajon anterior". */
const ALIAS_INDEX: { alias: string; test: ClinicalTestImage }[] = CLINICAL_TEST_IMAGES.flatMap(
  (test) =>
    [...test.aliases]
      .map((alias) => ({ alias: normalizeForMatch(alias), test }))
      .sort((a, b) => b.alias.length - a.alias.length)
).sort((a, b) => b.alias.length - a.alias.length);

/**
 * Find the best matching clinical-test illustration for a line of assistant text.
 * Returns null when nothing matches, or when several different tests are named
 * in the same line (e.g. welcome text listing Neer, Hawkins, Lachman…).
 */
export function findClinicalTestImage(line: string): ClinicalTestImage | null {
  const normalized = normalizeForMatch(line);
  if (!normalized) return null;

  // Prefer ankle drawer when the line mentions ankle/tobillo together with drawer.
  if (
    (normalized.includes("tobillo") || normalized.includes("ankle") || normalized.includes("atfl")) &&
    (normalized.includes("cajon") || normalized.includes("drawer"))
  ) {
    return CLINICAL_TEST_IMAGES.find((t) => t.id === "anterior-drawer-ankle") ?? null;
  }

  const hits: ClinicalTestImage[] = [];
  for (const { alias, test } of ALIAS_INDEX) {
    if (!alias || !normalized.includes(alias)) continue;
    if (!hits.some((h) => h.id === test.id)) hits.push(test);
  }

  // Only attach an image when the line is clearly about ONE concrete maneuver.
  if (hits.length !== 1) return null;
  return hits[0];
}

/**
 * Whether a chat line is a concrete maneuver recommendation (numbered item or
 * a whole-line title), not casual mention in prose / intro.
 */
export function shouldShowClinicalTestImage(opts: {
  numberedText: string | null;
  headingText: string | null;
  wholeBoldText: string | null;
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
