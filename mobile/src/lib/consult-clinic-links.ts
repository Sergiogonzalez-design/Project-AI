/** Parse AIKinora clinic paths from Physio replies (`/centro/{slug}` → profile button). */

const CENTRO_PATH_RE = /\/centro\/([a-z0-9][a-z0-9-]{0,80})/gi;

export type ConsultClinicLink = {
  slug: string;
  label: string;
  /** Optional city / address / equipment snippet (never the path). */
  meta: string;
};

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

export function lineHasClinicCentroLink(line: string): boolean {
  return /\/centro\/[a-z0-9][a-z0-9-]{0,80}/i.test(line);
}
