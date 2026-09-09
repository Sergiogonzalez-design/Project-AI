"use client";

import { FunctionalTestYesNo } from "@/components/functional-test-yes-no";
import type { ConsultLocale } from "@/lib/consult-clinic-links";
import {
  functionalTestPreparingLabel,
  functionalTestRevealPreview,
} from "@/lib/functional-test-reveal";
import type { FunctionalTestItem } from "@/lib/functional-test-answers";
import { useEffect, useState, type ReactNode } from "react";

type ParsedBlock = {
  before: string;
  heading: string;
  tests: FunctionalTestItem[];
  after: string;
};

type Props = {
  parsed: ParsedBlock;
  language: ConsultLocale;
  disabled?: boolean;
  isRevealing: boolean;
  onSubmit: (text: string) => void;
  onScrollTick?: () => void;
  renderMarkdown: (text: string) => ReactNode;
};

export function FunctionalTestChatBlock({
  parsed,
  language,
  disabled,
  isRevealing,
  onSubmit,
  onScrollTick,
  renderMarkdown,
}: Props) {
  const [afterVisible, setAfterVisible] = useState(false);
  const testKey = parsed.tests.map((t) => t.prompt).join("|");

  useEffect(() => {
    setAfterVisible(false);
  }, [testKey]);

  if (isRevealing) {
    const preview = functionalTestRevealPreview(parsed);
    return (
      <div className="whitespace-pre-wrap break-words">
        {preview ? renderMarkdown(preview) : null}
        {parsed.heading ? (
          <p className="mt-2 text-xs text-slate-400 animate-pulse">
            {functionalTestPreparingLabel(language)}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <div className="whitespace-pre-wrap break-words">
      {parsed.before ? renderMarkdown(parsed.before) : null}
      {parsed.heading ? (
        <p className={parsed.before ? "mt-3" : undefined}>
          <strong className="font-bold text-blue-700">{parsed.heading}</strong>
        </p>
      ) : null}
      <FunctionalTestYesNo
        tests={parsed.tests}
        language={language}
        disabled={disabled}
        ready
        onSubmit={onSubmit}
        onStaggerTick={onScrollTick}
        onStaggerComplete={() => setAfterVisible(true)}
      />
      {afterVisible && parsed.after ? (
        <div className="mt-3">{renderMarkdown(parsed.after)}</div>
      ) : null}
    </div>
  );
}
