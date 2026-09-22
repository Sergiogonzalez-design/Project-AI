/** One-page consulta: keep a short core and fold red flags into one multi. */

export const ALERTAS_NONE = "Ninguno";

export const ALERTAS_LABEL =
  "¿Te ocurre alguna de estas cosas? (marca las que sí)";

function alertasOptionFromRfLabel(label: string): string {
  return label
    .replace(/^¿\s*/, "")
    .replace(/\?\s*$/, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Filter to the one-page keep-list and append the combined red-flag chips. */
export function toOnePageQuestionnaire<
  Q extends {
    id: string;
    section: string;
    label: string;
    type: string;
    options?: readonly string[];
    required?: boolean;
    showIf?: unknown;
  },
>(
  visible: Q[],
  keepIds: readonly string[],
  allQuestions: readonly Q[],
  coreSection: Q["section"]
): Q[] {
  const kept = compactVisibleQuestions(visible, new Set(keepIds), coreSection);
  return [...kept, buildAlertasQuestion(allQuestions, coreSection)];
}

export function compactVisibleQuestions<
  Q extends { id: string; section: string; showIf?: unknown },
>(questions: Q[], keepIds: ReadonlySet<string>, coreSection: Q["section"]): Q[] {
  return questions
    .filter((q) => keepIds.has(q.id))
    .map((q) => ({ ...q, section: coreSection }));
}

export function buildAlertasQuestion<
  Q extends {
    id: string;
    section: string;
    label: string;
    type: string;
    options?: readonly string[];
    required?: boolean;
  },
>(questions: readonly Q[], coreSection: Q["section"]): Q {
  const options = [
    ...questions
      .filter((q) => q.id.startsWith("rf_"))
      .map((q) => alertasOptionFromRfLabel(q.label)),
    ALERTAS_NONE,
  ];
  return {
    ...(questions[0] as Q),
    id: "alertas" as Q["id"],
    section: coreSection,
    label: ALERTAS_LABEL,
    type: "multi",
    options,
    required: true,
    showIf: undefined,
  };
}

export function alertasOptionToRfId(
  questions: readonly { id: string; label: string }[]
): Record<string, string> {
  const map: Record<string, string> = {};
  for (const q of questions) {
    if (!q.id.startsWith("rf_")) continue;
    map[alertasOptionFromRfLabel(q.label)] = q.id;
  }
  return map;
}

/** Copy `alertas` chips onto the original rf_* yes/no fields for detect/format. */
export function withAlertasSynced<T extends { alertas?: string[] }>(
  answers: T,
  optionToRfId: Record<string, string>
): T {
  const selected = answers.alertas;
  if (!Array.isArray(selected) || selected.length === 0) return answers;
  const none = selected.includes(ALERTAS_NONE);
  const next: Record<string, unknown> = { ...answers };
  for (const [option, rfId] of Object.entries(optionToRfId)) {
    next[rfId] = !none && selected.includes(option) ? "Sí" : "No";
  }
  return next as T;
}
