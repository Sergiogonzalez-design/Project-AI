/** Stagger timing for the in-chat functional test (Sí/No) evaluation form. */

export const FUNCTIONAL_TEST_HINT_DELAY_MS = 280;
export const FUNCTIONAL_TEST_FIRST_TEST_DELAY_MS = 420;
export const FUNCTIONAL_TEST_STAGGER_MS = 480;

/** Delay before test `index` (0-based) appears after `ready` becomes true. */
export function functionalTestStaggerDelayMs(index: number): number {
  return (
    FUNCTIONAL_TEST_HINT_DELAY_MS +
    FUNCTIONAL_TEST_FIRST_TEST_DELAY_MS +
    index * FUNCTIONAL_TEST_STAGGER_MS
  );
}

export function functionalTestProgressLabel(
  visible: number,
  total: number,
  language: "es" | "en" = "es"
): string {
  const n = Math.min(Math.max(visible, 1), total);
  return language === "en"
    ? `Test ${n} of ${total}`
    : `Prueba ${n} de ${total}`;
}

export function functionalTestPreparingLabel(language: "es" | "en" = "es"): string {
  return language === "en"
    ? "Preparing your self-check questions…"
    : "Preparando las pruebas para que las hagas en casa…";
}

/** Text to show while the assistant reply is still revealing — no numbered test dump. */
export function functionalTestRevealPreview(parsed: {
  before: string;
  heading: string;
}): string {
  const parts: string[] = [];
  if (parsed.before?.trim()) parts.push(parsed.before.trim());
  if (parsed.heading?.trim()) parts.push(`**${parsed.heading}**`);
  return parts.join("\n\n");
}
