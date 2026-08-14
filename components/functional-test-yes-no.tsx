"use client";

import { ClinicalTestMediaBlock } from "@/components/clinical-test-media";
import { chipClass } from "@/components/ui/chip-style";
import { shouldShowClinicalTestImage } from "@/lib/clinical-test-images";
import {
  formatFunctionalTestAnswers,
  type FunctionalTestAnswer,
  type FunctionalTestItem,
} from "@/lib/functional-test-answers";
import { useState } from "react";

type Props = {
  tests: FunctionalTestItem[];
  language?: "es" | "en";
  disabled?: boolean;
  onSubmit: (text: string) => void;
};

export function FunctionalTestYesNo({
  tests,
  language = "es",
  disabled,
  onSubmit,
}: Props) {
  const [answers, setAnswers] = useState<Record<number, FunctionalTestAnswer>>(
    {}
  );
  const [sent, setSent] = useState(false);
  const shown = new Set<string>();
  const complete = tests.every((t) => answers[t.n]);
  const yes = language === "en" ? "Yes" : "Sí";
  const no = language === "en" ? "No" : "No";
  const hint =
    language === "en"
      ? "Do each test, then tap Yes or No."
      : "Haz cada prueba y pulsa Sí o No.";
  const send =
    language === "en" ? "Send answers" : "Enviar respuestas";

  function choose(n: number, value: FunctionalTestAnswer) {
    if (disabled || sent) return;
    setAnswers((prev) => ({ ...prev, [n]: value }));
  }

  return (
    <div className="mt-3 space-y-4">
      <p className="text-xs text-slate-500">{hint}</p>
      {tests.map((test) => {
        const media = shouldShowClinicalTestImage({ numberedText: `${test.n}. ${test.prompt}` });
        const showMedia = media && !shown.has(media.id) ? media : null;
        if (showMedia) shown.add(showMedia.id);
        return (
          <div key={test.n}>
            <p className="text-sm text-neutral-900">
              <strong className="font-bold text-blue-700">
                {test.n}. {test.prompt}
              </strong>
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
      {complete ? (
        <button
          type="button"
          disabled={disabled || sent}
          onClick={() => {
            if (sent) return;
            setSent(true);
            onSubmit(formatFunctionalTestAnswers(tests, answers, language));
          }}
          className="btn-primary w-full px-4 py-2.5 text-sm disabled:opacity-50"
        >
          {send}
        </button>
      ) : null}
    </div>
  );
}
