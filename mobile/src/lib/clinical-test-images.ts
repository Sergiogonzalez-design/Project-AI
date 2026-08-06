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
    aliases: [
      "cajon anterior",
      "test del cajon anterior",
      "test de cajon anterior",
      "anterior drawer",
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
    aliases: [
      "neer",
      "test de neer",
      "elevar el brazo por encima de la cabeza",
      "levantar el brazo por encima de la cabeza",
      "elevar los brazos",
      "raise the arm overhead",
    ],
  },
  {
    id: "hawkins-kennedy",
    title: "Hawkins-Kennedy",
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
    aliases: [
      "jobe",
      "empty can",
      "empty-can",
      "lata vacia",
      "aguantar un objeto",
      "hold a light object",
    ],
  },
  {
    id: "apprehension",
    title: "Apprehension / Relocation",
    aliases: [
      "apprehension",
      "aprension",
      "relocation",
      "relocacion",
      "rotar sin miedo",
      "brazo a 90",
    ],
  },
  {
    id: "speed",
    title: "Test de Speed",
    aliases: ["speed", "test de speed", "cerrar el puno", "girar un pomo"],
  },
  {
    id: "spurling",
    title: "Test de Spurling",
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
    aliases: ["thompson", "test de thompson", "squeeze test", "simmonds"],
  },
  {
    id: "anterior-drawer-ankle",
    title: "Cajón anterior (tobillo)",
    aliases: [
      "cajon anterior del tobillo",
      "anterior drawer ankle",
      "drawer tobillo",
      "atfl",
      "apoyar el pie",
    ],
  },
  {
    id: "faber",
    title: "FABER / Patrick",
    aliases: [
      "faber",
      "patrick",
      "figure 4",
      "figura 4",
      "sentadilla parcial",
      "cruzar piernas",
    ],
  },
  {
    id: "fadir",
    title: "FADIR",
    aliases: ["fadir", "faddir", "levantar la pierna de arriba"],
  },
  {
    id: "phalen",
    title: "Test de Phalen",
    aliases: [
      "phalen",
      "test de phalen",
      "posicion de rezo",
      "apoyar la palma",
      "hacer un puno",
    ],
  },
  {
    id: "trendelenburg",
    title: "Test de Trendelenburg",
    aliases: [
      "trendelenburg",
      "test de trendelenburg",
      "pata coja",
      "single leg",
      "una pierna",
    ],
  },
];

export const CLINICAL_TEST_IMAGES: readonly ClinicalTestImage[] = TESTS.map(
  (t) => ({
    ...t,
    src: `${WEB_APP_URL}/clinical-tests/${t.id}.webp`,
  })
);

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
