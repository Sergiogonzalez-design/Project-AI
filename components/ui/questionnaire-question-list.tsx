"use client";

import { Children, isValidElement, type ReactNode } from "react";

type Props = {
  /** Changes when the section changes so entrances re-run. */
  sectionKey: string | number;
  children: ReactNode;
};

/**
 * Staggers questionnaire questions so a section doesn't dump all fields at once.
 */
export function QuestionnaireQuestionList({ sectionKey, children }: Props) {
  const items = Children.toArray(children).filter(isValidElement);

  return (
    <div key={sectionKey} className="questionnaire-question-list">
      {items.map((child, index) => (
        <div
          key={child.key ?? index}
          className="questionnaire-question-enter"
          style={{ animationDelay: `${Math.min(index, 8) * 48}ms` }}
        >
          {child}
        </div>
      ))}
    </div>
  );
}
