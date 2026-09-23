"use client";

import { ChipButton } from "@/components/ui/chip-button";
import {
  formatFunctionalTestAnswers,
  type FunctionalTestAnswer,
  type FunctionalTestItem,
} from "@/lib/functional-test-answers";
import { functionalTestProgressLabel } from "@/lib/functional-test-reveal";
import { stripFunctionalMediaMarker } from "@/lib/functional-test-media";
import { useEffect, useRef, useState } from "react";

type Props = {
  tests: FunctionalTestItem[];
  language?: "es" | "en";
  disabled?: boolean;
  /** When false, the form stays hidden (e.g. while assistant text is still revealing). */
  ready?: boolean;
  onSubmit: (text: string) => void;
  onStaggerTick?: () => void;
  onStaggerComplete?: () => void;
};

export function FunctionalTestYesNo({
  tests,
  language = "es",
  disabled,
  ready = true,
  onSubmit,
  onStaggerComplete,
}: Props) {
  const [answers, setAnswers] = useState<Record<number, FunctionalTestAnswer>>(
    {}
  );
  const [sent, setSent] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [revealedCount, setRevealedCount] = useState(0);
  const wasDisabledRef = useRef(Boolean(disabled));
  const onStaggerCompleteRef = useRef(onStaggerComplete);
  onStaggerCompleteRef.current = onStaggerComplete;
  const allRevealed = revealedCount >= tests.length;
  const complete = tests.every((t) => answers[t.n]);
  const yes = language === "en" ? "Yes" : "Sí";
  const no = language === "en" ? "No" : "No";
  const hint =
    language === "en"
      ? "Do each test at home, then tap Yes or No."
      : "Haz cada prueba en casa y pulsa Sí o No.";
  const send =
    language === "en" ? "Send answers" : "Enviar respuestas";

  const testKey = tests.map((t) => `${t.n}:${t.prompt}`).join("|");

  useEffect(() => {
    if (wasDisabledRef.current && !disabled && sent) {
      setSent(false);
    }
    wasDisabledRef.current = Boolean(disabled);
  }, [disabled, sent]);

  useEffect(() => {
    if (!ready || tests.length === 0) {
      setShowHint(false);
      setRevealedCount(0);
      return;
    }

    // Instant reveal — matches mobile and avoids delayed Sí/No buttons.
    setShowHint(true);
    setRevealedCount(tests.length);
    onStaggerCompleteRef.current?.();
  }, [ready, testKey, tests.length]);

  function choose(n: number, value: FunctionalTestAnswer) {
    if (disabled || sent) return;
    setAnswers((prev) => ({ ...prev, [n]: value }));
  }

  if (!ready) return null;

  const visibleTests = tests.slice(0, revealedCount);

  return (
    <div className="functional-test-form mt-3">
      {showHint ? (
        <p className="text-xs text-slate-500">{hint}</p>
      ) : null}
      {showHint && revealedCount > 0 && tests.length > 1 ? (
        <div className="mt-2">
          <div className="mb-1 flex items-center justify-between gap-2">
            <span className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
              {functionalTestProgressLabel(revealedCount, tests.length, language)}
            </span>
            <span className="text-[11px] tabular-nums text-slate-400">
              {Math.round((revealedCount / tests.length) * 100)}%
            </span>
          </div>
          <div
            className="h-1 overflow-hidden rounded-full bg-slate-100"
            role="progressbar"
            aria-valuenow={revealedCount}
            aria-valuemin={0}
            aria-valuemax={tests.length}
          >
            <div
              className="h-full rounded-full bg-blue-500"
              style={{ width: `${(revealedCount / tests.length) * 100}%` }}
            />
          </div>
        </div>
      ) : null}
      <div className="mt-3 space-y-4">
        {visibleTests.map((test) => {
          const prompt = stripFunctionalMediaMarker(test.prompt);
          return (
            <div key={test.n}>
              <p className="break-words text-sm leading-relaxed text-neutral-900">
                <span className="block break-words font-bold text-blue-700">
                  {test.n}. {prompt}
                </span>
              </p>
              <div className="mt-2 flex gap-2">
                <ChipButton
                  selected={answers[test.n] === "si"}
                  disabled={disabled || sent}
                  onClick={() => choose(test.n, "si")}
                  label={yes}
                />
                <ChipButton
                  selected={answers[test.n] === "no"}
                  disabled={disabled || sent}
                  onClick={() => choose(test.n, "no")}
                  label={no}
                />
              </div>
            </div>
          );
        })}
      </div>
      {allRevealed && complete ? (
        <button
          type="button"
          disabled={disabled || sent}
          onClick={() => {
            if (sent || disabled) return;
            setSent(true);
            onSubmit(formatFunctionalTestAnswers(tests, answers, language));
          }}
          className="btn-primary mt-4 w-full px-4 py-2.5 text-sm disabled:opacity-50"
        >
          {send}
        </button>
      ) : null}
    </div>
  );
}
