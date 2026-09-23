/**
 * Shared visual language for the answer "chips" used across every adaptive
 * questionnaire (shoulder, elbow, wrist, finger, neck, lower-leg, knee, back,
 * hip, generic). Centralizing the className here keeps every body-part
 * questionnaire visually consistent without changing any of their
 * independent selection logic (single vs multi, "none" clearing, etc.).
 */
function chipBase(selected: boolean, layout: "inline" | "stack"): string {
  const size =
    layout === "stack"
      ? "flex w-full min-h-[3.25rem] items-center justify-start rounded-2xl border-2 px-4 py-3"
      : "inline-flex items-center justify-start rounded-2xl border-2 px-4 py-2.5";
  return [
    "notranslate",
    size,
    "text-left text-sm font-semibold leading-snug tracking-normal whitespace-normal break-words",
    "transition-[background-color,border-color,color,box-shadow] duration-150 ease-out",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-1",
    selected
      ? "border-blue-600 bg-blue-600 text-white shadow-none"
      : "border-slate-200 bg-white text-slate-600 shadow-none hover:border-blue-300 hover:bg-blue-50/60 hover:text-slate-800",
  ].join(" ");
}

export function chipClass(selected: boolean): string {
  return chipBase(selected, "inline");
}

/** Full-width alertas / red-flag rows — stable height, no layout jump on select. */
export function chipStackClass(selected: boolean): string {
  return chipBase(selected, "stack");
}
