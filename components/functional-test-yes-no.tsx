"use client";

import { ClinicalTestMediaBlock } from "@/components/clinical-test-media";
import { chipClass } from "@/components/ui/chip-style";
import {
  formatFunctionalTestAnswers,
  type FunctionalTestAnswer,
  type FunctionalTestItem,
} from "@/lib/functional-test-answers";
import {
  functionalTestProgressLabel,
  functionalTestStaggerDelayMs,
  FUNCTIONAL_TEST_HINT_DELAY_MS,
} from "@/lib/functional-test-reveal";
import {
  resolveFunctionalTestMedia,
  stripFunctionalMediaMarker,
} from "@/lib/functional-test-media";
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

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function FunctionalTestYesNo({
  tests,
  language = "es",
  disabled,
  ready = true,
  onSubmit,
  onStaggerTick,
  onStaggerComplete,
}: Props) {
  const [answers, setAnswers] = useState<Record<number, FunctionalTestAnswer>>(
    {}
  );
  const [sent, setSent] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [revealedCount, setRevealedCount] = useState(0);
  const wasDisabledRef = useRef(Boolean(disabled));
  const onStaggerTickRef = useRef(onStaggerTick);
  const onStaggerCompleteRef = useRef(onStaggerComplete);
  onStaggerTickRef.current = onStaggerTick;
  onStaggerCompleteRef.current = onStaggerComplete;
  const shown = new Set<string>();
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

    if (prefersReducedMotion()) {
      setShowHint(true);
      setRevealedCount(tests.length);
      onStaggerCompleteRef.current?.();
      return;
    }

    let cancelled = false;
    const timers: number[] = [];

    setShowHint(false);
    setRevealedCount(0);

    timers.push(
      window.setTimeout(() => {
        if (!cancelled) setShowHint(true);
      }, FUNCTIONAL_TEST_HINT_DELAY_MS)
    );

    tests.forEach((_, index) => {
      timers.push(
        window.setTimeout(() => {
          if (cancelled) return;
          const count = index + 1;
          setRevealedCount(count);
          onStaggerTickRef.current?.();
          if (count >= tests.length) onStaggerCompleteRef.current?.();
        }, functionalTestStaggerDelayMs(index))
      );
    });

    return () => {
      cancelled = true;
      timers.forEach((t) => window.clearTimeout(t));
    };
    // Callbacks are read via refs so parent scroll handlers cannot reset stagger.
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
        <p className="text-xs text-slate-500 questionnaire-question-enter">{hint}</p>
      ) : null}
      {showHint && revealedCount > 0 && tests.length > 1 ? (
        <div
          className="mt-2 questionnaire-question-enter"
          style={{ animationDelay: "40ms" }}
        >
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
              className="h-full rounded-full bg-blue-500 transition-[width] duration-500 ease-out"
              style={{ width: `${(revealedCount / tests.length) * 100}%` }}
            />
          </div>
        </div>
      ) : null}
      <div className="mt-3 space-y-4">
        {visibleTests.map((test, index) => {
          const prompt = stripFunctionalMediaMarker(test.prompt);
          const media = resolveFunctionalTestMedia({ prompt: test.prompt });
          const showMedia = media && !shown.has(media.id) ? media : null;
          if (showMedia) shown.add(showMedia.id);
          return (
            <div
              key={test.n}
              className="questionnaire-question-enter"
              style={{ animationDelay: `${Math.min(index, 6) * 32}ms` }}
            >
              <p className="break-words text-sm leading-relaxed text-neutral-900">
                <span className="block break-words font-bold text-blue-700">
                  {test.n}. {prompt}
                </span>
              </p>
              {showMedia ? <ClinicalTestMediaBlock test={showMedia} /> : null}
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  disabled={disabled || sent}
                  onClick={() => choose(test.n, "si")}
                  className={chipClass(answers[test.n] === "si")}
                >
                  {yes}
                </button>
                <button
                  type="button"
                  disabled={disabled || sent}
                  onClick={() => choose(test.n, "no")}
                  className={chipClass(answers[test.n] === "no")}
                >
                  {no}
                </button>
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
          className="btn-primary questionnaire-question-enter mt-4 w-full px-4 py-2.5 text-sm disabled:opacity-50"
        >
          {send}
        </button>
      ) : null}
    </div>
  );
}
