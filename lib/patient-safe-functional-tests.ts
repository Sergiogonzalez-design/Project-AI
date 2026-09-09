/**
 * Patient Sí/No functional tests must be home self-movements.
 * Clinician special tests (Lachman, Neer, Spurling, etc.) belong only in
 * the physio chat / report catalog — never as patient buttons.
 */

import { CLINICAL_TEST_IMAGES } from "./clinical-test-images";
import { stripFunctionalMediaMarker } from "./functional-test-media";

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^a-z0-9\s/+-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Proper-name aliases from the illustrated physio catalog (titles + short names).
 * Long everyday descriptions are excluded so patient bank wording is not rejected.
 */
const CLINICIAN_PROPER_NAMES: readonly string[] = (() => {
  const aliases = new Set<string>();
  for (const test of CLINICAL_TEST_IMAGES) {
    aliases.add(normalize(test.title));
    aliases.add(normalize(test.id.replace(/-/g, " ")));
    for (const a of test.aliases) {
      const n = normalize(a);
      // Keep short/medium proper names; skip long instructional phrases.
      if (n.length < 4 || n.length > 40) continue;
      if (n.split(" ").length > 5) continue;
      aliases.add(n);
    }
  }
  for (const extra of [
    "ottawa",
    "ulnt",
    "empty can",
    "full can",
    "pivot shift",
    "well leg",
    "slr cruzado",
    "lasegue",
    "relocation",
    "anterior drawer",
    "posterior drawer",
    "cajon anterior",
    "cajon posterior",
    "valgus stress",
    "varus stress",
    "estres en valgo",
    "estres en varo",
  ]) {
    aliases.add(normalize(extra));
  }
  return [...aliases].sort((a, b) => b.length - a.length);
})();

/** Everyday patient wording that overlaps catalog aliases — do not reject. */
const EVERYDAY_ALLOW: ReadonlySet<string> = new Set(
  [
    "pata coja",
    "puntillas",
    "tiptoes",
    "tiptoe",
    "heel raise",
    "heel raises",
    "hop test",
    "hop on one",
    "single leg hop",
    "single-leg hop",
    "stand on one leg",
    "standing on one leg",
    "single leg stance",
    "single-leg stance",
    "prayer position",
    "prayer pose",
    "posicion de rezo",
    "posicion de oracion",
    "figure 4",
    "painful arc",
    "drop arm",
    "big toe up",
    "dedo gordo hacia arriba",
  ].map(normalize)
);

const EXAMINER_LANGUAGE =
  /\b(fisioterapeuta|terapeuta|examinador|examiner|clinician|el fisio|tu fisio|que alguien|otra persona|pide a un|pide a alguien|el profesional|el explorador)\b/i;

const STARTS_LIKE_CLINICAL_NAME =
  /^(?:\*\*)?(?:test|prueba|maniobra|signo)\s+(?:de\s+)?/i;

function containsAlias(haystack: string, alias: string): boolean {
  if (!alias) return false;
  if (haystack === alias) return true;
  return (
    haystack.startsWith(`${alias} `) ||
    haystack.endsWith(` ${alias}`) ||
    haystack.includes(` ${alias} `) ||
    haystack.includes(`${alias}:`) ||
    haystack.includes(`${alias} /`) ||
    haystack.includes(`/ ${alias}`)
  );
}

/**
 * True when this Sí/No prompt is (or names) a clinician special test
 * from the physio catalog — not a home self-movement.
 */
export function isClinicianSpecialTestPrompt(prompt: string): boolean {
  const clean = stripFunctionalMediaMarker(prompt).trim();
  if (!clean) return false;
  if (STARTS_LIKE_CLINICAL_NAME.test(clean)) return true;
  if (EXAMINER_LANGUAGE.test(clean)) return true;

  const n = normalize(clean);
  if (!n) return false;

  for (const alias of CLINICIAN_PROPER_NAMES) {
    if (EVERYDAY_ALLOW.has(alias)) continue;
    if (containsAlias(n, alias)) return true;
  }
  return false;
}

/** Keep only patient-self prompts; renumber 1…n. */
export function filterPatientSafeFunctionalTests<
  T extends { n: number; prompt: string },
>(tests: T[]): T[] {
  return tests
    .filter((t) => !isClinicianSpecialTestPrompt(t.prompt))
    .map((t, i) => ({ ...t, n: i + 1 }));
}

export function hasClinicianSpecialTests(
  tests: { prompt: string }[]
): boolean {
  return tests.some((t) => isClinicianSpecialTestPrompt(t.prompt));
}
