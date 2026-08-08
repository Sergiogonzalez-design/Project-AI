"use client";

import { scrollToQuestionnaireQuestion } from "@/lib/consulta-validation";

import { chipClass } from "@/components/ui/chip-style";
import { PainScale } from "@/components/ui/pain-scale";
import { QuestionnaireProgress } from "@/components/ui/questionnaire-progress";
import { redFlagsDetectedLabel, redFlagsUrgencyNote } from "@/lib/consulta-red-flags-copy";

import { useEffect } from "react";
import {
  defaultShoulderAdaptiveAnswers,
  detectRedFlags,
  getVisibleShoulderQuestions,
  getVisibleShoulderSections,
  localizeShoulderLabel,
  localizeShoulderOption,
  localizeShoulderSection,
  validateShoulderSection,
  type ConsultLocale,
  type ShoulderAdaptiveAnswers,
  type ShoulderQuestionDef,
  type ShoulderQuestionnaireFocus,
} from "@/lib/consulta-shoulder-adaptive";

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
  const noneOption = options.find(
    (o) =>
      o === "Ninguno" ||
      o === "Ninguno en particular" ||
      o === "Sin limitación" ||
      o === "Ninguna"
  );

  function toggle(opt: string) {
    if (noneOption && opt === noneOption) {
      onChange(value.includes(opt) ? [] : [opt]);
      return;
    }
    const withoutNone = noneOption ? value.filter((v) => v !== noneOption) : value;
    if (withoutNone.includes(opt)) {
      onChange(withoutNone.filter((v) => v !== opt));
    } else {
      onChange([...withoutNone, opt]);
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
  focus,
}: {
  q: ShoulderQuestionDef;
  answers: ShoulderAdaptiveAnswers;
  onPatch: (p: Partial<ShoulderAdaptiveAnswers>) => void;
  locale: ConsultLocale;
  focus: ShoulderQuestionnaireFocus;
}) {
  const val = answers[q.id];
  const label = localizeShoulderLabel(q.id, q.label, locale, focus);
  const displayOption = (opt: string) => localizeShoulderOption(opt, locale);

  if (q.type === "slider") {
    const num = typeof val === "number" ? val : 5;
    return (
      <PainScale
        value={num}
        onChange={(v) => onPatch({ [q.id]: v } as Partial<ShoulderAdaptiveAnswers>)}
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
          onChange={(e) => onPatch({ [q.id]: e.target.value } as Partial<ShoulderAdaptiveAnswers>)}
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
          onChange={(v) => onPatch({ [q.id]: v } as Partial<ShoulderAdaptiveAnswers>)}
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
          onChange={(v) => onPatch({ [q.id]: v } as Partial<ShoulderAdaptiveAnswers>)}
          displayOption={displayOption}
        />
      </div>
    );
  }

  return null;
}

type Props = {
  value: ShoulderAdaptiveAnswers;
  onChange: (v: ShoulderAdaptiveAnswers) => void;
  sectionIndex: number;
  onSectionIndexChange: (i: number) => void;
  sectionError: string | null;
  onSectionError: (msg: string | null) => void;
  locale?: ConsultLocale;
  focus?: ShoulderQuestionnaireFocus;
};

export function ConsultaAdaptiveShoulder({
  value,
  onChange,
  sectionIndex,
  onSectionIndexChange,
  sectionError,
  onSectionError,
  locale = "es",
  focus = "shoulder",
}: Props) {
  const answers = value ?? defaultShoulderAdaptiveAnswers();
  const sections = getVisibleShoulderSections(answers, focus);
  const currentSection = sections[sectionIndex] ?? sections[0];
  const sectionQuestions = getVisibleShoulderQuestions(answers, focus).filter(
    (q) => q.section === currentSection
  );
  const { urgent, triggered } = detectRedFlags(answers);
  const isLastSection = sectionIndex >= sections.length - 1;

  useEffect(() => {
    if (sectionIndex >= sections.length && sections.length > 0) {
      onSectionIndexChange(sections.length - 1);
    }
  }, [sectionIndex, sections.length, onSectionIndexChange]);

  function patch(p: Partial<ShoulderAdaptiveAnswers>) {
    onChange({ ...answers, ...p });
  }

  function handleNext() {
    if (!currentSection) return;
    const issue = validateShoulderSection(currentSection, answers, focus);
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
          Estas preguntas detectan situaciones que pueden requerir atención médica urgente.
        </div>
      )}

      {urgent && currentSection !== "red_flags" && (
        <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-relaxed text-red-800 shadow-sm">
          <strong>{redFlagsDetectedLabel(locale)}</strong> {triggered.join(", ")}. {redFlagsUrgencyNote(locale)}
        </div>
      )}

      <h2 className="mb-4 text-xl font-bold tracking-tight text-slate-900">
        {localizeShoulderSection(currentSection, locale)}
      </h2>

      {sectionQuestions.map((q) => (
        <div key={q.id} data-question-id={q.id}>
          <QuestionField
            q={q}
            answers={answers}
            onPatch={patch}
            locale={locale}
            focus={focus}
          />
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
            Anterior
          </button>
        )}
        {!isLastSection && (
          <button
            type="button"
            onClick={handleNext}
            className="btn-primary flex-1"
          >
            Siguiente
          </button>
        )}
      </div>
    </div>
  );
}

export function isLastShoulderSection(
  answers: ShoulderAdaptiveAnswers,
  sectionIndex: number,
  focus: ShoulderQuestionnaireFocus = "shoulder"
): boolean {
  const sections = getVisibleShoulderSections(answers, focus);
  return sectionIndex >= sections.length - 1;
}
