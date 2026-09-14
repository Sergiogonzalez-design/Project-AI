/** Parse AIKinora clinic paths and hospital Maps buttons from Physio replies. */

import { googleMapsSearchUrl } from "./clinic-maps";

const CENTRO_PATH_RE = /\/centro\/([a-z0-9][a-z0-9-]{0,80})/gi;

export type ConsultClinicLink = {
  slug: string;
  label: string;
  /** Optional city / address / equipment snippet (never the path). */
  meta: string;
};

export type ConsultHospitalLink = {
  label: string;
  mapsUrl: string;
  meta: string;
};

export type ConsultLocale = "es" | "en";

export function clinicRecommendIntro(locale: ConsultLocale = "es"): string {
  return locale === "en"
    ? "Physio recommends the following clinics:"
    : "Physio te recomienda las siguientes clínicas:";
}

export function hospitalRecommendIntro(locale: ConsultLocale = "es"): string {
  return locale === "en"
    ? "Go to a hospital / ER near you:"
    : "Ve a un hospital / urgencias cerca de ti:";
}

/** Section title emitted by the AI for registered clinics. */
export function isClinicSectionHeadingLine(line: string): boolean {
  const t = line
    .trim()
    .replace(/\*/g, "")
    .replace(/^#{1,6}\s*/, "");
  return /^(?:cl[ií]nicas en aikinora cerca de ti|clinics on aikinora near you)\b/i.test(
    t
  );
}

/** Section title for hospital / ER recommendations. */
export function isHospitalSectionHeadingLine(line: string): boolean {
  const t = line
    .trim()
    .replace(/\*/g, "")
    .replace(/^#{1,6}\s*/, "");
  return /^(?:hospitales?\s*\/?\s*urgencias cerca de ti|hospitals?\s*\/?\s*er near you)\b/i.test(
    t
  );
}

export function contentHasHospitalSection(content: string): boolean {
  return /Hospitales\s*\/\s*Urgencias cerca de ti|Hospitals\s*\/\s*ER near you/i.test(
    content
  );
}

/**
 * If a reply mixes hospital urgency with AIKinora clinics, keep hospitals only.
 * Avoids contradicting “go to ER” with “visit this physio clinic”.
 * `forceHospitalOnly`: also strip clinics when an earlier message in the chat
 * already recommended hospitals (final resumen must not flip to clinics).
 */
export function reconcileDestinationSections(
  content: string,
  opts?: { forceHospitalOnly?: boolean }
): string {
  if (!opts?.forceHospitalOnly && !contentHasHospitalSection(content)) {
    return content;
  }
  const lines = content.split("\n");
  const out: string[] = [];
  let skippingClinic = false;
  for (const line of lines) {
    const trimmed = line.trim();
    if (isClinicSectionHeadingLine(trimmed)) {
      skippingClinic = true;
      continue;
    }
    if (skippingClinic) {
      if (
        !trimmed ||
        isHospitalSectionHeadingLine(trimmed) ||
        /^(?:qué debes hacer ahora|what you should do now|fuentes|sources|resumen|summary|contactar|contact)\b/i.test(
          trimmed.replace(/\*/g, "")
        )
      ) {
        skippingClinic = false;
        if (!trimmed || isClinicSectionHeadingLine(trimmed)) continue;
      } else if (
        lineHasClinicCentroLink(trimmed) ||
        isClinicRecommendLine(trimmed) ||
        /^(?:[-*•]\s+)?(?:\*\*)?\d+[.)]/i.test(trimmed)
      ) {
        continue;
      } else if (/^#{1,6}\s+\S/.test(trimmed) || /^\*\*[^*].+\*\*$/.test(trimmed)) {
        skippingClinic = false;
      } else {
        continue;
      }
    }
    if (lineHasClinicCentroLink(trimmed)) continue;
    out.push(line);
  }
  return out.join("\n");
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

/**
 * Parse a hospital / ER line into a Maps button.
 * Preferred formats:
 *   1. Hospital X | maps:urgencias Hospital X Madrid
 *   1. Hospital X | https://www.google.com/maps/search/?api=1&query=…
 * Fallback inside the hospital section: numbered name → Maps search for that name.
 */
export function parseHospitalRecommendLine(
  line: string,
  opts?: { inHospitalSection?: boolean; cityHint?: string | null }
): ConsultHospitalLink | null {
  if (lineHasClinicCentroLink(line)) return null;
  const trimmed = line.trim();
  if (!trimmed) return null;

  const body = stripListPrefix(trimmed);
  if (!body || body.includes("?")) return null;
  if (FUNCTIONAL_TEST_VERBS.test(body)) return null;

  const parts = body
    .split("|")
    .map((p) => p.replace(/\s+/g, " ").trim())
    .filter(Boolean);
  let label = (parts[0] ?? "")
    .replace(/^[-•*]\s*/, "")
    .replace(/^\d+[.)]\s*/, "")
    .trim();
  if (!label) return null;

  const rest = parts.slice(1);
  let mapsUrl = "";
  const metaParts: string[] = [];
  for (const p of rest) {
    const mapsToken = /^maps:\s*(.+)$/i.exec(p);
    if (mapsToken) {
      mapsUrl = googleMapsSearchUrl(mapsToken[1].trim());
      continue;
    }
    if (/^https?:\/\//i.test(p) && /maps\.google|google\.[^/]+\/maps|maps\.app\.goo/i.test(p)) {
      mapsUrl = p;
      continue;
    }
    if (/^https?:\/\//i.test(p)) {
      mapsUrl = p;
      continue;
    }
    metaParts.push(p);
  }

  const looksLikeHospital =
    opts?.inHospitalSection ||
    /\b(hospital|urgencias|emergency|er\b|112|samur|clinic[ao]?\s+universit)/i.test(
      body
    );

  if (!looksLikeHospital) return null;
  if (!/^(?:[-*•]\s+)?(?:\*\*)?\d+[.)]/i.test(trimmed) && !mapsUrl) {
    return null;
  }

  if (!mapsUrl) {
    const city = opts?.cityHint?.trim();
    const query = city ? `${label} urgencias ${city}` : `${label} urgencias`;
    mapsUrl = googleMapsSearchUrl(query);
  }

  return {
    label,
    mapsUrl,
    meta: metaParts.join(" · "),
  };
}
