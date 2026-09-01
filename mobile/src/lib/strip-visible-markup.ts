/**
 * Remove markdown # / * so they never appear in the patient or physio UI.
 * Call this on every visible string (or each bold/plain segment after ** split).
 */
export function stripVisibleMarkup(text: string): string {
  if (!text) return "";
  return (
    text
      // ATX headings: "# Title" / "##Title"
      .replace(/^#{1,6}\s*/gm, "")
      // Bold / italic (greedy enough for nested leftovers)
      .replace(/\*\*\*([^*]+)\*\*\*/g, "$1")
      .replace(/\*\*([^*]+)\*\*/g, "$1")
      .replace(/(^|[^*])\*([^*\n]+)\*(?!\*)/g, "$1$2")
      .replace(/___([^_]+)___/g, "$1")
      .replace(/__([^_]+)__/g, "$1")
      .replace(/(^|[^_])_([^_\n]+)_(?!_)/g, "$1$2")
      // Any leftover markers the model still emits
      .replace(/[*#]+/g, "")
      // Functional-test video id tags: "…prompt ⟦heel-raise⟧"
      .replace(/\s*⟦[a-z0-9-]+⟧/gi, "")
      .replace(/[ \t]+\n/g, "\n")
  );
}
