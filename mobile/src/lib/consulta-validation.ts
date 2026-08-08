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
