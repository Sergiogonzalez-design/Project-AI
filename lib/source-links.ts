export type CitedSource = {
  title: string;
  href: string | null;
};

const HEADING_LINE =
  /^(?:\*\*)?(Fuentes consultadas|Sources consulted)(?:\*\*)?$/i;
const FUENTE_LINE = /^(?:[-•*]\s*)?(?:Fuente|Source)\s*:\s*(.+)$/i;
const HTTP_URL = /https?:\/\/[^\s<>"'\)\]]+/i;
const DOI = /\b(10\.\d{4,9}\/[-._;()/:A-Z0-9]+)/i;
const JOSPT = /jospt\.(\d{4})\.(\d{4})/i;
const PMCID = /\bPMC(\d{5,8})\b/i;
const PMID = /\bPMID[:\s]*(\d{5,8})\b/i;

function stripTrailingPunct(value: string): string {
  return value.replace(/[.,;:]+$/g, "");
}

function sanitizeHttpUrl(raw: string): string | null {
  try {
    const url = new URL(stripTrailingPunct(raw));
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return url.toString();
  } catch {
    return null;
  }
}

function markdownLink(text: string): { title: string; href: string } | null {
  const match = /^\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)$/i.exec(text.trim());
  if (!match) return null;
  const href = sanitizeHttpUrl(match[2]);
  return href ? { title: match[1].trim(), href } : null;
}

export function displaySourceTitle(raw: string): string {
  const md = markdownLink(raw);
  if (md) return md.title;

  let title = raw
    .replace(/^Fuente:\s*/i, "")
    .replace(/^Source:\s*/i, "")
    .replace(/^[-•*]\s+/, "")
    .trim();

  const withUrl = /^(.*?)\s+[—–-]\s+(https?:\/\/\S+)$/i.exec(title);
  if (withUrl?.[1]) return withUrl[1].trim();

  const withHost = /^(.*?)\s+[—–-]\s+([a-z0-9.-]+\.[a-z]{2,})$/i.exec(title);
  if (withHost?.[1]) return withHost[1].trim();

  return title;
}

function hostSearchUrl(title: string, host: string): string {
  const h = host.toLowerCase();
  if (h.includes("pmc.ncbi") || h.includes("ncbi.nlm.nih.gov")) {
    return `https://www.ncbi.nlm.nih.gov/pmc/?term=${encodeURIComponent(title)}`;
  }
  if (h.includes("pubmed")) {
    return `https://pubmed.ncbi.nlm.nih.gov/?term=${encodeURIComponent(title)}`;
  }
  if (h.includes("jospt.org")) {
    return `https://www.jospt.org/action/doSearch?AllField=${encodeURIComponent(title)}`;
  }
  return `https://www.google.com/search?q=${encodeURIComponent(`${title} site:${host}`)}`;
}

function isInternalSource(label: string): boolean {
  return (
    /criterio cl[ií]nico general/i.test(label) ||
    /^Physioguide —/i.test(label.trim())
  );
}

export function resolveSourceHref(raw: string): string | null {
  if (isInternalSource(raw)) return null;

  const md = markdownLink(raw);
  if (md) return md.href;

  const http = HTTP_URL.exec(raw);
  if (http) return sanitizeHttpUrl(http[0]);

  const pmcid = PMCID.exec(raw);
  if (pmcid) return `https://www.ncbi.nlm.nih.gov/pmc/articles/PMC${pmcid[1]}/`;

  const pmid = PMID.exec(raw);
  if (pmid) return `https://pubmed.ncbi.nlm.nih.gov/${pmid[1]}/`;

  const doi = DOI.exec(raw);
  if (doi) return `https://doi.org/${stripTrailingPunct(doi[1])}`;

  const jospt = JOSPT.exec(raw);
  if (jospt) {
    return `https://www.jospt.org/doi/10.2519/jospt.${jospt[1]}.${jospt[2]}`;
  }

  const withHost = /^(.*?)\s+[—–-]\s+([a-z0-9.-]+\.[a-z]{2,})$/i.exec(raw.trim());
  if (withHost?.[1] && withHost[2]) {
    return hostSearchUrl(withHost[1].trim(), withHost[2]);
  }

  if (/\.pdf$/i.test(raw.trim())) {
    const query = raw.replace(/\.pdf$/i, "").replace(/[_-]+/g, " ").trim();
    return `https://scholar.google.com/scholar?q=${encodeURIComponent(query)}`;
  }

  return null;
}

export function toCitedSource(raw: string): CitedSource {
  const title = displaySourceTitle(raw);
  return { title, href: resolveSourceHref(raw) };
}

function uniqueSources(labels: string[]): CitedSource[] {
  const seen = new Set<string>();
  const sources: CitedSource[] = [];
  for (const label of labels) {
    const trimmed = label.trim();
    if (!trimmed || HEADING_LINE.test(trimmed.replace(/\*/g, ""))) continue;
    const source = toCitedSource(trimmed);
    const key = source.title.toLowerCase();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    sources.push(source);
  }
  return sources;
}

/** Pull unique sources out of an assistant message and return the body without them. */
export function extractCitedSources(content: string): {
  body: string;
  sources: CitedSource[];
  heading: string;
} {
  const lines = content.split("\n");
  let headingIndex = -1;
  let heading = "Fuentes consultadas";

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim().replace(/\*/g, "");
    if (HEADING_LINE.test(trimmed)) {
      headingIndex = i;
      heading = /sources consulted/i.test(trimmed)
        ? "Sources consulted"
        : "Fuentes consultadas";
      break;
    }
  }

  const labels: string[] = [];
  const bodyLines: string[] = [];
  const end = headingIndex === -1 ? lines.length : headingIndex;

  for (let i = 0; i < end; i++) {
    const match = FUENTE_LINE.exec(lines[i].trim());
    if (match) {
      labels.push(match[1].trim());
      continue;
    }
    bodyLines.push(lines[i]);
  }

  if (headingIndex !== -1) {
    for (let i = headingIndex + 1; i < lines.length; i++) {
      const trimmed = lines[i].trim();
      if (!trimmed) continue;
      const match = FUENTE_LINE.exec(trimmed);
      if (match) {
        labels.push(match[1].trim());
        continue;
      }
      labels.push(trimmed.replace(/^[-•*]\s+/, "").trim());
    }
  }

  return {
    body: bodyLines.join("\n").trimEnd(),
    sources: uniqueSources(labels),
    heading,
  };
}

export function isInlineFuenteLine(line: string): boolean {
  return FUENTE_LINE.test(line.trim());
}
