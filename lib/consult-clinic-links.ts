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

export function slugifyClinicLabel(label: string): string {
  return label
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/** True when a numbered line is a clinic recommendation — not a patient functional test. */
export function isClinicRecommendLine(line: string): boolean {
  if (lineHasClinicCentroLink(line)) return true;
  const trimmed = line.trim();
  if (!/^(?:[-*•]\s+)?(?:\*\*)?\d+[.)](?:\*\*)?\s/i.test(trimmed)) return false;

  const body = stripListPrefix(trimmed);
  if (!body || body.includes("?")) return false;
  if (FUNCTIONAL_TEST_VERBS.test(body)) return false;

  if (/\bcl[ií]n/i.test(body)) return true;
  if (/\|/.test(body) && !FUNCTIONAL_TEST_VERBS.test(body)) return true;

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

/** Parse clinic button data from AI lines — with or without `/centro/{slug}`. */
export function parseClinicRecommendLine(line: string): ConsultClinicLink | null {
  const fromCentro = parseClinicCentroFromLine(line);
  if (fromCentro) return fromCentro;
  if (!isClinicRecommendLine(line)) return null;

  const body = stripListPrefix(line);
  const parts = body
    .split("|")
    .map((p) => p.replace(/\s+/g, " ").trim())
    .filter(Boolean);
  const label = (parts[0] ?? body).replace(/^[-•*]\s*/, "").trim();
  if (!label) return null;
  const meta = parts.slice(1).join(" · ").trim();
  const slug = slugifyClinicLabel(label);
  if (!slug) return null;
  return { slug, label, meta };
}
