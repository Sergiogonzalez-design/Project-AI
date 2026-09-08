/** Base delay between reveal chunks (ms). Adaptive delays layer on top. */
export const REVEAL_LINE_INTERVAL_MS = 72;

const MAX_CHUNK_CHARS = 132;
const MIN_SENTENCE_CHARS = 28;

export type RevealChunk = {
  /** Exclusive end index into the original text. */
  endIndex: number;
};

/**
 * Build reveal breakpoints that preserve the original string.
 * Visible text is always `text.slice(0, chunks[n-1].endIndex)` — never a re-join,
 * so markdown / layout stay identical after the animation finishes.
 */
export function buildRevealChunks(text: string): RevealChunk[] {
  if (!text) return [{ endIndex: 0 }];

  const chunks: RevealChunk[] = [];
  let i = 0;

  while (i < text.length) {
    const nl = text.indexOf("\n", i);
    const lineContentEnd = nl === -1 ? text.length : nl;
    const lineEnd = nl === -1 ? text.length : nl + 1;
    const lineLen = lineContentEnd - i;

    if (lineLen <= MAX_CHUNK_CHARS) {
      chunks.push({ endIndex: lineEnd });
      i = lineEnd;
      continue;
    }

    let start = i;
    while (start < lineContentEnd) {
      const remaining = lineContentEnd - start;
      if (remaining <= MAX_CHUNK_CHARS) {
        chunks.push({ endIndex: lineEnd });
        break;
      }

      const windowEnd = Math.min(start + MAX_CHUNK_CHARS, lineContentEnd);
      const window = text.slice(start, windowEnd);
      const breakAt = findSoftBreak(window, MIN_SENTENCE_CHARS);

      if (breakAt != null) {
        chunks.push({ endIndex: start + breakAt });
        start += breakAt;
        continue;
      }

      const ws = window.lastIndexOf(" ");
      if (ws >= MIN_SENTENCE_CHARS) {
        chunks.push({ endIndex: start + ws + 1 });
        start += ws + 1;
        continue;
      }

      chunks.push({ endIndex: windowEnd });
      start = windowEnd;
    }

    i = lineEnd;
  }

  if (chunks.length === 0 || chunks[chunks.length - 1].endIndex !== text.length) {
    chunks.push({ endIndex: text.length });
  }

  return chunks;
}

/** @deprecated Prefer buildRevealChunks + visibleTextFromChunks. */
export function splitRevealLines(text: string): string[] {
  if (!text) return [""];
  const chunks = buildRevealChunks(text);
  const lines: string[] = [];
  let prev = 0;
  for (const chunk of chunks) {
    lines.push(text.slice(prev, chunk.endIndex).replace(/\n$/, ""));
    prev = chunk.endIndex;
  }
  return lines.length ? lines : [""];
}

export function visibleTextFromChunks(
  text: string,
  chunks: RevealChunk[],
  visibleCount: number
): string {
  if (visibleCount <= 0) return "";
  if (visibleCount >= chunks.length) return text;
  return text.slice(0, chunks[visibleCount - 1].endIndex);
}

/** @deprecated Prefer visibleTextFromChunks. */
export function visibleTextFromLines(lines: string[], visibleCount: number): string {
  if (visibleCount <= 0) return "";
  return lines.slice(0, visibleCount).join("\n");
}

/** Adaptive pause before revealing the chunk at `index` (0-based). */
export function revealDelayMs(text: string, chunks: RevealChunk[], index: number): number {
  const start = index === 0 ? 0 : chunks[index - 1].endIndex;
  const end = chunks[index]?.endIndex ?? text.length;
  const piece = text.slice(start, end);
  const trimmed = piece.trim();

  if (!trimmed) return 150;
  if (/^#{1,6}\s/.test(trimmed) || /^\*\*[^*].+[^*]\*\*$/.test(trimmed)) return 115;
  if (/^\d+[.)]\s/.test(trimmed) || /^[-*•]\s/.test(trimmed)) return 88;
  if (piece.length > 110) return 98;
  if (trimmed.length < 18) return 58;
  return REVEAL_LINE_INTERVAL_MS;
}

function findSoftBreak(window: string, minChars: number): number | null {
  const re = /[.!?…」』](?:["'”’)]+)?(?=\s|$)/g;
  let best: number | null = null;
  let m: RegExpExecArray | null;
  while ((m = re.exec(window)) != null) {
    const after = m.index + m[0].length;
    if (after < minChars) continue;
    if (m[0] === "." && isLikelyAbbreviationOrDecimal(window, m.index)) continue;
    best = after;
  }
  if (best != null) {
    while (best < window.length && window[best] === " ") best += 1;
    return best;
  }

  const secondary = /[;:—–](?=\s)/g;
  while ((m = secondary.exec(window)) != null) {
    const after = m.index + m[0].length;
    if (after < minChars) continue;
    let end = after;
    while (end < window.length && window[end] === " ") end += 1;
    return end;
  }

  return null;
}

function isLikelyAbbreviationOrDecimal(window: string, dotIndex: number): boolean {
  const before = window[dotIndex - 1];
  const after = window[dotIndex + 1];
  if (before && /\d/.test(before) && after && /\d/.test(after)) return true;
  if (before && /[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/.test(before)) {
    let start = dotIndex - 1;
    while (start > 0 && /[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/.test(window[start - 1])) start -= 1;
    const word = window.slice(start, dotIndex);
    if (word.length <= 3) return true;
  }
  return false;
}
