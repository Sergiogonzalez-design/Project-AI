export type AdaptiveValidationIssue = {
  message: string;
  questionId: string;
  section: string;
};

export function missingQuestionIssue(q: {
  id: string;
  section: string;
  label: string;
}): AdaptiveValidationIssue {
  return {
    message: `Responde: ${q.label.replace(/\?$/, "")}.`,
    questionId: q.id,
    section: q.section,
  };
}

/** Rephrase a missing-answer issue using a localized question label. */
export function formatValidationIssueMessage(
  issue: AdaptiveValidationIssue,
  locale: "es" | "en",
  localizedLabel: string
): string {
  const label = localizedLabel.replace(/[?？]\s*$/, "").trim();
  if (locale === "en") {
    return `Please answer: ${label || "this question"}.`;
  }
  return label ? `Responde: ${label}.` : issue.message;
}

/** Scroll the chat/questionnaire to the missing field and briefly highlight it. */
export function scrollToQuestionnaireQuestion(questionId: string): void {
  if (typeof document === "undefined") return;
  const run = () => {
    const el = document.querySelector(
      `[data-question-id="${CSS.escape(questionId)}"]`
    );
    if (!(el instanceof HTMLElement)) return;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    el.classList.add("questionnaire-question--missing");
    window.setTimeout(
      () => el.classList.remove("questionnaire-question--missing"),
      2000
    );
    const focusable = el.querySelector<HTMLElement>(
      "button, textarea, input, select, [tabindex]:not([tabindex='-1'])"
    );
    focusable?.focus({ preventScroll: true });
  };
  requestAnimationFrame(() => requestAnimationFrame(run));
}
