/**
 * Maps clinical special-test names (physio chat) to educational illustrations.
 * Keep in sync with lib/clinical-test-images.ts (web).
 */

import { WEB_APP_URL } from "./admin-api";

export type ClinicalTestImage = {
  id: string;
  title: string;
  src: string;
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

const TESTS: readonly Omit<ClinicalTestImage, "src">[] = [
  {
    id: "lachman",
    title: "Test de Lachman",
    aliases: ["lachman", "test de lachman"],
  },
  {
    id: "anterior-drawer-knee",
    title: "Cajón anterior (rodilla)",
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
    aliases: ["pivot shift", "pivot-shift", "test de pivot"],
  },
  {
    id: "mcmurray",
    title: "Test de McMurray",
    aliases: ["mcmurray", "mc murray", "test de mcmurray"],
  },
  {
    id: "thessaly",
    title: "Test de Thessaly",
    aliases: ["thessaly", "test de thessaly"],
  },
  {
    id: "neer",
    title: "Test de Neer",
    aliases: ["neer", "test de neer", "neer's"],
  },
  {
    id: "hawkins-kennedy",
    title: "Hawkins-Kennedy",
    aliases: ["hawkins", "hawkins-kennedy", "hawkins kennedy"],
  },
  {
    id: "jobe-empty-can",
    title: "Jobe / Empty can",
    aliases: ["jobe", "empty can", "empty-can", "lata vacia", "lata vacía"],
  },
  {
    id: "apprehension",
    title: "Apprehension / Relocation",
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
    aliases: ["speed", "test de speed"],
  },
  {
    id: "yergason",
    title: "Test de Yergason",
    aliases: ["yergason", "test de yergason"],
  },
  {
    id: "drop-arm",
    title: "Drop arm",
    aliases: ["drop arm", "drop-arm", "caida del brazo", "caída del brazo"],
  },
  {
    id: "painful-arc",
    title: "Painful arc",
    aliases: ["painful arc", "arco doloroso", "arco doloroso de abduccion"],
  },
  {
    id: "spurling",
    title: "Test de Spurling",
    aliases: ["spurling", "test de spurling"],
  },
  {
    id: "ultt",
    title: "ULTT / ULNT",
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
    aliases: ["thompson", "test de thompson", "squeeze test", "simmonds"],
  },
  {
    id: "matles",
    title: "Test de Matles",
    aliases: ["matles", "test de matles"],
  },
  {
    id: "anterior-drawer-ankle",
    title: "Cajón anterior (tobillo)",
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
    aliases: ["windlass", "test de windlass"],
  },
  {
    id: "heel-raise",
    title: "Heel raise / elevación de talones",
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
    aliases: ["hop test", "hop-test", "salto monopodal", "single leg hop"],
  },
  {
    id: "faber",
    title: "FABER / Patrick",
    aliases: ["faber", "patrick", "figure 4", "figura 4"],
  },
  {
    id: "fadir",
    title: "FADIR",
    aliases: ["fadir", "faddir", "impingement de cadera"],
  },
  {
    id: "trendelenburg",
    title: "Test de Trendelenburg",
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
    aliases: ["phalen", "test de phalen", "posicion de rezo", "posición de rezo"],
  },
  {
    id: "tinel",
    title: "Signo de Tinel",
    aliases: ["tinel", "signo de tinel", "test de tinel"],
  },
  {
    id: "cozen",
    title: "Test de Cozen",
    aliases: ["cozen", "test de cozen"],
  },
  {
    id: "mill",
    title: "Test de Mill",
    aliases: ["mill", "test de mill", "mills", "test de mills"],
  },
  {
    id: "schober",
    title: "Test de Schober",
    aliases: ["schober", "test de schober"],
  },
  {
    id: "slr-lasegue",
    title: "SLR / Lasègue",
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
    aliases: [
      "kemp",
      "test de kemp",
      "cuadrante lumbar",
      "extension lumbar",
      "extensión lumbar",
      "prueba de extension lumbar",
    ],
  },
];

export const CLINICAL_TEST_IMAGES: readonly ClinicalTestImage[] = TESTS.map(
  (t) => ({
    ...t,
    src: `${WEB_APP_URL}/clinical-tests/${t.id}.webp`,
  })
);

export function illustratedClinicalTestsPromptBlock(): string {
  const lines = CLINICAL_TEST_IMAGES.map((t) => `- ${t.title}`).join("\n");
  return `CATÁLOGO ILUSTRADO DE MANIOBRAS (CRÍTICO — incumplir esto es un error):
Cuando listes pruebas/maniobras numeradas (1. 2. 3.…), SOLO puedes usar tests de esta lista. Cada uno tiene imagen en Kinora; si inventas otro nombre, la imagen NO aparece.
${lines}
- Usa exactamente el nombre canónico de la lista en la línea numerada (p. ej. "1. **Test de Lachman**: …").
- Elige las más relevantes para la zona/hipótesis; no inventes maniobras fuera del catálogo.
- Si necesitas otra maniobra no listada, menciónala en prosa SIN numerarla (así no queda una fila sin imagen).`;
}

const ALIAS_INDEX: { alias: string; test: ClinicalTestImage }[] =
  CLINICAL_TEST_IMAGES.flatMap((test) =>
    test.aliases.map((alias) => ({
      alias: normalizeForMatch(alias),
      test,
    }))
  ).sort((a, b) => b.alias.length - a.alias.length);

export function findClinicalTestImage(line: string): ClinicalTestImage | null {
  const normalized = normalizeForMatch(line);
  if (!normalized) return null;

  if (
    (normalized.includes("tobillo") ||
      normalized.includes("ankle") ||
      normalized.includes("atfl")) &&
    (normalized.includes("cajon") || normalized.includes("drawer"))
  ) {
    return (
      CLINICAL_TEST_IMAGES.find((t) => t.id === "anterior-drawer-ankle") ?? null
    );
  }

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

  if (hits.length !== 1) return null;
  return hits[0];
}

export function shouldShowClinicalTestImage(opts: {
  numberedText: string | null;
  headingText: string | null;
  wholeBoldText: string | null;
}): ClinicalTestImage | null {
  const { numberedText, headingText, wholeBoldText } = opts;
  if (numberedText) return findClinicalTestImage(numberedText);
  const title = wholeBoldText ?? headingText;
  if (!title) return null;
  const plain = title.replace(/\*\*/g, "").trim();
  if (plain.length > 80 || (plain.match(/,/g) ?? []).length >= 2) return null;
  return findClinicalTestImage(plain);
}
