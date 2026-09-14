"use client";

import { Children, isValidElement, type ReactNode } from "react";

type Props = {
  /** Changes when the section changes so the list remounts cleanly. */
  sectionKey: string | number;
  children: ReactNode;
};

/**
 * Renders questionnaire questions without staggered slide-in animations.
 */
export function QuestionnaireQuestionList({ sectionKey, children }: Props) {
  const items = Children.toArray(children).filter(isValidElement);

  return (
    <div key={sectionKey} className="questionnaire-question-list space-y-0">
      {items.map((child, index) => (
        <div key={child.key ?? index}>{child}</div>
      ))}
    </div>
  );
}
