/**
 * Shared visual language for the answer "chips" used across every adaptive
 * questionnaire (shoulder, elbow, wrist, finger, neck, lower-leg, knee, back,
 * hip, generic). Centralizing the className here keeps every body-part
 * questionnaire visually consistent without changing any of their
 * independent selection logic (single vs multi, "none" clearing, etc.).
 */
export function chipClass(selected: boolean): string {
  return [
    "rounded-2xl border-2 px-4 py-2.5 text-sm font-semibold transition-all duration-150 ease-out",
    "active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-1",
    selected
      ? "border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-600/20 -translate-y-0.5"
      : "border-slate-200 bg-white text-slate-600 hover:-translate-y-0.5 hover:border-blue-300 hover:bg-blue-50/60 hover:text-slate-800",
  ].join(" ");
}
