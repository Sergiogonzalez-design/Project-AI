"use client";

import { consultaNavLabels } from "@/lib/consulta-nav-labels";

import { scrollToQuestionnaireQuestion } from "@/lib/consulta-validation";

import { chipClass } from "@/components/ui/chip-style";
import { PainScale } from "@/components/ui/pain-scale";
import { QuestionnaireProgress } from "@/components/ui/questionnaire-progress";
import { redFlagsDetectedLabel, redFlagsSectionIntro, redFlagsUrgencyNote } from "@/lib/consulta-red-flags-copy";

import { useEffect } from "react";
import {
  defaultElbowAdaptiveAnswers,
  detectElbowRedFlags,
  getVisibleElbowQuestions,
  getVisibleElbowSections,
  localizeElbowLabel,
  localizeElbowOption,
  localizeElbowSection,
  validateElbowSection,
  type ConsultLocale,
  type ElbowAdaptiveAnswers,
  type ElbowQuestionDef,
} from "@/lib/consulta-elbow-adaptive";

const labelClass = "mb-2.5 block text-base font-semibold text-slate-800";

function ChipGroup({
  options,
  value,
  onChange,
  displayOption,
}: {
  options: readonly string[];
  value: string;
  onChange: (v: string) => void;
  displayOption?: (opt: string) => string;
}) {
  return (
    <div className="mb-5 flex flex-wrap gap-2.5">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={chipClass(value === opt)}
        >
          {displayOption ? displayOption(opt) : opt}
        </button>
      ))}
    </div>
  );
}

function MultiChipGroup({
  options,
  value,
  onChange,
  displayOption,
}: {
  options: readonly string[];
  value: string[];
  onChange: (v: string[]) => void;
  displayOption?: (opt: string) => string;
}) {
  const exclusiveOption = options.find(
    (o) =>
      o === "Ninguno" ||
      o === "Ninguno en particular" ||
      o === "No" ||
      o === "Sin limitación" ||
      o === "Ninguna"
  );

  function toggle(opt: string) {
    if (exclusiveOption && opt === exclusiveOption) {
      onChange(value.includes(opt) ? [] : [opt]);
      return;
    }
    const withoutExclusive = exclusiveOption
      ? value.filter((v) => v !== exclusiveOption)
      : value;
    if (withoutExclusive.includes(opt)) {
      onChange(withoutExclusive.filter((v) => v !== opt));
    } else {
      onChange([...withoutExclusive, opt]);
    }
  }

  return (
    <div className="mb-5 flex flex-wrap gap-2.5">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => toggle(opt)}
          className={chipClass(value.includes(opt))}
        >
          {displayOption ? displayOption(opt) : opt}
        </button>
      ))}
    </div>
  );
}

function QuestionField({
  q,
  answers,
  onPatch,
  locale,
}: {
  q: ElbowQuestionDef;
  answers: ElbowAdaptiveAnswers;
  onPatch: (p: Partial<ElbowAdaptiveAnswers>) => void;
  locale: ConsultLocale;
}) {
  const val = answers[q.id];
  const label = localizeElbowLabel(q.id, q.label, locale);
  const displayOption = (opt: string) => localizeElbowOption(opt, locale);

  if (q.type === "slider") {
    const num = typeof val === "number" ? val : 5;
    return (
      <PainScale
        value={num}
        onChange={(v) => onPatch({ [q.id]: v } as Partial<ElbowAdaptiveAnswers>)}
        label={label}
        locale={locale}
      />
    );
  }

  if (q.type === "text") {
    return (
      <div className="mb-5">
        <label className={labelClass}>{label}</label>
        <textarea
          value={typeof val === "string" ? val : ""}
          onChange={(e) => onPatch({ [q.id]: e.target.value } as Partial<ElbowAdaptiveAnswers>)}
          rows={2}
          className="w-full rounded-[16px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 transition-all duration-200 focus:border-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-50"
        />
      </div>
    );
  }

  if (q.type === "multi" && q.options) {
    return (
      <div className="mb-1">
        <label className={labelClass}>{label}</label>
        <MultiChipGroup
          options={q.options}
          value={Array.isArray(val) ? val : []}
          onChange={(v) => onPatch({ [q.id]: v } as Partial<ElbowAdaptiveAnswers>)}
          displayOption={displayOption}
        />
      </div>
    );
  }

  if (q.options) {
    return (
      <div className="mb-1">
        <label className={labelClass}>{label}</label>
        <ChipGroup
          options={q.options}
          value={typeof val === "string" ? val : ""}
          onChange={(v) => onPatch({ [q.id]: v } as Partial<ElbowAdaptiveAnswers>)}
          displayOption={displayOption}
        />
      </div>
    );
  }

  return null;
}

type Props = {
  value: ElbowAdaptiveAnswers;
  onChange: (v: ElbowAdaptiveAnswers) => void;
  sectionIndex: number;
  onSectionIndexChange: (i: number) => void;
  sectionError: string | null;
  onSectionError: (msg: string | null) => void;
  locale?: ConsultLocale;
};

export function ConsultaAdaptiveElbow({
  value,
  onChange,
  sectionIndex,
  onSectionIndexChange,
  sectionError,
  onSectionError,
  locale = "es",
}: Props) {
  const answers = value ?? defaultElbowAdaptiveAnswers();
  const sections = getVisibleElbowSections(answers);
  const currentSection = sections[sectionIndex] ?? sections[0];
  const sectionQuestions = getVisibleElbowQuestions(answers).filter(
    (q) => q.section === currentSection
  );
  const { urgent, triggered } = detectElbowRedFlags(answers);
  const isLastSection = sectionIndex >= sections.length - 1;

  useEffect(() => {
    if (sectionIndex >= sections.length && sections.length > 0) {
      onSectionIndexChange(sections.length - 1);
    }
  }, [sectionIndex, sections.length, onSectionIndexChange]);

  function patch(p: Partial<ElbowAdaptiveAnswers>) {
    onChange({ ...answers, ...p });
  }

  function handleNext() {
    if (!currentSection) return;
    const issue = validateElbowSection(currentSection, answers);
    if (issue) {
      onSectionError(issue.message);
      scrollToQuestionnaireQuestion(issue.questionId);
      return;
    }
    onSectionError(null);
    onSectionIndexChange(sectionIndex + 1);
  }

  return (
    <div>
      <QuestionnaireProgress stepIndex={sectionIndex} totalSteps={sections.length} locale={locale} />

      {currentSection === "red_flags" && (
        <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-900 shadow-sm">
          {redFlagsSectionIntro(locale)}
        </div>
      )}

      {urgent && currentSection !== "red_flags" && (
        <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-relaxed text-red-800 shadow-sm">
          <strong>{redFlagsDetectedLabel(locale)}</strong> {triggered.join(", ")}. {redFlagsUrgencyNote(locale)}
        </div>
      )}

      <h2 className="mb-4 text-xl font-bold tracking-tight text-slate-900">
        {localizeElbowSection(currentSection, locale)}
      </h2>

      {sectionQuestions.map((q) => (
        <div key={q.id} data-question-id={q.id}>
          <QuestionField q={q} answers={answers} onPatch={patch} locale={locale} />
        </div>
      ))}

      {sectionError && <p className="mb-4 text-sm text-red-600">{sectionError}</p>}

      <div className="mt-4 flex gap-3">
        {sectionIndex > 0 && (
          <button
            type="button"
            onClick={() => onSectionIndexChange(sectionIndex - 1)}
            className="btn-secondary flex-1"
          >
            {consultaNavLabels(locale).previous}
          </button>
        )}
        {!isLastSection && (
          <button
            type="button"
            onClick={handleNext}
            className="btn-primary flex-1"
          >
            {consultaNavLabels(locale).next}
          </button>
        )}
      </div>
    </div>
  );
}

export function isLastElbowSection(
  answers: ElbowAdaptiveAnswers,
  sectionIndex: number
): boolean {
  const sections = getVisibleElbowSections(answers);
  return sectionIndex >= sections.length - 1;
}
