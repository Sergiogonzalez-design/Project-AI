export const REVEAL_LINE_INTERVAL_MS = 48;

export function splitRevealLines(text: string): string[] {
  if (!text) return [""];
  return text.split("\n");
}

export function visibleTextFromLines(lines: string[], visibleCount: number): string {
  if (visibleCount <= 0) return "";
  return lines.slice(0, visibleCount).join("\n");
}
