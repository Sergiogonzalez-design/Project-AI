/** Parse AIKinora clinic paths from Physio replies (`/centro/{slug}` → profile button). */

const CENTRO_PATH_RE = /\/centro\/([a-z0-9][a-z0-9-]{0,80})/gi;

export type ConsultClinicLink = {
  slug: string;
  label: string;
  /** Optional city / address / equipment snippet (never the path). */
  meta: string;
};

export type ConsultLocale = "es" | "en";

export function clinicRecommendIntro(locale: ConsultLocale = "es"): string {
  return locale === "en"
    ? "Physio recommends the following clinics:"
    : "Physio te recomienda las siguientes clínicas:";
}

/** Section title emitted by the AI for registered clinics. */
export function isClinicSectionHeadingLine(line: string): boolean {
  const t = line
    .trim()
    .replace(/\*/g, "")
    .replace(/^#{1,6}\s*/, "");
  return /^(?:cl[ií]nicas en aikinora cerca de ti|clinics on aikinora near you)\b/i.test(t);
}

/** True if the line points at an in-app clinic profile (not a hospital). */
export function lineHasClinicCentroLink(line: string): boolean {
  return /\/centro\/[a-z0-9][a-z0-9-]{0,80}/i.test(line);
}

const FUNCTIONAL_TEST_VERBS =
  /\b(puedes|puede|intent[aá]|prueba|haz|hacer|do you|can you|try to|try |stand on|salt|hop|flexion|flexiona|gira|levanta|agach|sentad|puntillas|tiptoe|raise|stretch|estira)\b/i;

function stripListPrefix(line: string): string {
  return line
    .trim()
    .replace(/^(?:[-*•]\s+)?(?:\*\*)?\d+[.)](?:\*\*)?\s+(?:\*\*)?/i, "")
    .replace(/\*\*/g, "")
    .trim();
}

/** True when a numbered line is a clinic recommendation — not a patient functional test. */
export function isClinicRecommendLine(line: string): boolean {
  if (lineHasClinicCentroLink(line)) return true;
  const trimmed = line.trim();
  if (!/^(?:[-*•]\s+)?(?:\*\*)?\d+[.)](?:\*\*)?\s/i.test(trimmed)) return false;

  const body = stripListPrefix(trimmed);
  if (!body || body.includes("?")) return false;
  if (FUNCTIONAL_TEST_VERBS.test(body)) return false;

  // Keyword only — do not treat bare numbered `|` lines as clinics
  // (those are often tests or addresses). Real profile links already
  // returned true via `/centro/{slug}` above.
  if (/\bcl[ií]n/i.test(body)) return true;

  return false;
}

export function isClinicRecommendPrompt(prompt: string): boolean {
  return isClinicRecommendLine(`1. ${prompt}`);
}

/** True if the line points at an in-app clinic profile (not a hospital). */
export function parseClinicCentroFromLine(line: string): ConsultClinicLink | null {
  const match = /\/centro\/([a-z0-9][a-z0-9-]{0,80})/i.exec(line);
  if (!match) return null;
  const slug = match[1].toLowerCase();
  const withoutPath = line.replace(CENTRO_PATH_RE, " ");
  const parts = withoutPath
    .split("|")
    .map((p) => p.replace(/\s+/g, " ").trim())
    .filter(Boolean);
  let label = (parts[0] ?? "")
    .replace(/^[-•*]\s*/, "")
    .replace(/^\d+[.)]\s*/, "")
    .replace(/[:\-–—]\s*$/, "")
    .trim();
  if (!label) label = slug.replace(/-/g, " ");
  const meta = parts.slice(1).join(" · ").trim();
  return { slug, label, meta };
}

/**
 * Parse a tappable clinic profile button.
 * Only real `/centro/{slug}` paths become links — never invent slugs from labels.
 */
export function parseClinicRecommendLine(line: string): ConsultClinicLink | null {
  return parseClinicCentroFromLine(line);
}
