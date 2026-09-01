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
