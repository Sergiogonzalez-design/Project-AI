"use client";

import { chipClass } from "@/components/ui/chip-style";
import { PainScale } from "@/components/ui/pain-scale";
import { QuestionnaireProgress } from "@/components/ui/questionnaire-progress";
import { redFlagsDetectedLabel, redFlagsUrgencyNote } from "@/lib/consulta-red-flags-copy";

import { useEffect } from "react";
import {
  defaultFingerAdaptiveAnswers,
  detectFingerRedFlags,
  FINGER_INTRO,
  FINGER_LOCATION_OPTIONS,
  getVisibleFingerQuestions,
  getVisibleFingerSections,
  localizeFingerLabel,
  localizeFingerOption,
  localizeFingerSection,
  validateFingerSection,
  type ConsultLocale,
  type FingerAdaptiveAnswers,
  type FingerQuestionDef,
  type FingerQuestionSection,
} from "@/lib/consulta-finger-adaptive";

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
  const exclusiveOption = options.find((o) => o === "Ninguna" || o === "No" || o === "Nada específico");

  function toggle(opt: string) {
    if (exclusiveOption && opt === exclusiveOption) {
      onChange(value.includes(opt) ? [] : [opt]);
      return;
    }
    const withoutExclusive = exclusiveOption
      ? value.filter((v) => v !== exclusiveOption)
      : value;
    if (withoutExclusive.includes(opt)) onChange(withoutExclusive.filter((v) => v !== opt));
    else onChange([...withoutExclusive, opt]);
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

function FingerLocationMap({
  value,
  onChange,
  locale,
}: {
  value: string[];
  onChange: (v: string[]) => void;
  locale: ConsultLocale;
}) {
  function toggle(opt: string) {
    if (value.includes(opt)) onChange(value.filter((v) => v !== opt));
    else onChange([...value, opt]);
  }

  const display = (opt: string) => localizeFingerOption(opt, locale);

  return (
    <div className="mb-5">
      <div className="relative overflow-hidden rounded-2xl border border-blue-200 bg-gradient-to-b from-blue-50 to-white p-4 sm:p-6">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-50">
          <div className="flex flex-col items-center gap-1">
            <div className="h-10 w-8 rounded-t-full border border-blue-200 bg-white" />
            <div className="h-8 w-7 rounded-md border border-blue-200 bg-white" />
            <div className="h-8 w-7 rounded-md border border-blue-200 bg-white" />
            <div className="h-14 w-10 rounded-b-2xl border border-blue-200 bg-white" />
          </div>
        </div>
        <p className="mb-3 text-xs font-medium text-slate-600">
          {locale === "en"
            ? "Mark where it hurts most (you can select several areas)."
            : "Marca dónde duele más (puedes elegir varias zonas)."}
        </p>
        <div className="relative flex flex-wrap gap-2">
          {FINGER_LOCATION_OPTIONS.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => toggle(opt)}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                value.includes(opt)
                  ? "border-blue-600 bg-blue-600 text-white"
                  : "border-blue-200 bg-white text-slate-600 hover:border-blue-400"
              }`}
            >
              {display(opt)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function QuestionField({
  q,
  answers,
  onPatch,
  locale,
}: {
  q: FingerQuestionDef;
  answers: FingerAdaptiveAnswers;
  onPatch: (p: Partial<FingerAdaptiveAnswers>) => void;
  locale: ConsultLocale;
}) {
  const val = answers[q.id];
  const label = localizeFingerLabel(q.id, q.label, locale);
  const displayOption = (opt: string) => localizeFingerOption(opt, locale);

  if (q.type === "slider") {
    const num = typeof val === "number" ? val : 5;
    const min = typeof q.min === "number" ? q.min : 0;
    const max = typeof q.max === "number" ? q.max : 10;
    if (q.id === "intensidad_dolor") {
      return (
        <PainScale
          value={num}
          onChange={(v) => onPatch({ [q.id]: v } as Partial<FingerAdaptiveAnswers>)}
          label={label}
          locale={locale}
        />
      );
    }
    return (
      <div className="mb-5">
        <label className={labelClass}>
          {label}: <span className="text-blue-600">{num}/{max}</span>
        </label>
        <input
          type="range"
          min={min}
          max={max}
          value={num}
          onChange={(e) =>
            onPatch({ [q.id]: Number(e.target.value) } as Partial<FingerAdaptiveAnswers>)
          }
          className="h-2 w-full cursor-pointer accent-blue-600"
        />
      </div>
    );
  }

  if (q.type === "text") {
    return (
      <div className="mb-5">
        <label className={labelClass}>{label}</label>
        <textarea
          value={typeof val === "string" ? val : ""}
          onChange={(e) => onPatch({ [q.id]: e.target.value } as Partial<FingerAdaptiveAnswers>)}
          rows={2}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-50"
        />
      </div>
    );
  }

  if (q.type === "finger_map") {
    return (
      <div className="mb-1">
        <label className={labelClass}>{label}</label>
        <FingerLocationMap
          value={Array.isArray(val) ? val : []}
          onChange={(v) => onPatch({ [q.id]: v } as Partial<FingerAdaptiveAnswers>)}
          locale={locale}
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
          onChange={(v) => onPatch({ [q.id]: v } as Partial<FingerAdaptiveAnswers>)}
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
          onChange={(v) => onPatch({ [q.id]: v } as Partial<FingerAdaptiveAnswers>)}
          displayOption={displayOption}
        />
      </div>
    );
  }

  return null;
}

type Props = {
  value: FingerAdaptiveAnswers;
  onChange: (v: FingerAdaptiveAnswers) => void;
  sectionIndex: number;
  onSectionIndexChange: (i: number) => void;
  sectionError: string | null;
  onSectionError: (msg: string | null) => void;
  locale?: ConsultLocale;
};

export function ConsultaAdaptiveFinger({
  value,
  onChange,
  sectionIndex,
  onSectionIndexChange,
  sectionError,
  onSectionError,
  locale = "es",
}: Props) {
  const answers = value ?? defaultFingerAdaptiveAnswers();
  const sections = getVisibleFingerSections(answers);
  const currentSection = (sections[sectionIndex] ?? sections[0]) as FingerQuestionSection;
  const sectionQuestions = getVisibleFingerQuestions(answers).filter(
    (q) => q.section === currentSection
  );
  const { urgent, triggered } = detectFingerRedFlags(answers);
  const isLastSection = sectionIndex >= sections.length - 1;

  useEffect(() => {
    if (sectionIndex >= sections.length && sections.length > 0) {
      onSectionIndexChange(sections.length - 1);
    }
  }, [sectionIndex, sections.length, onSectionIndexChange]);

  function patch(p: Partial<FingerAdaptiveAnswers>) {
    onChange({ ...answers, ...p });
  }

  function handleNext() {
    if (!currentSection) return;
    const err = validateFingerSection(currentSection, answers);
    if (err) {
      onSectionError(err);
      return;
    }
    onSectionError(null);
    onSectionIndexChange(sectionIndex + 1);
  }

  return (
    <div>
      {sectionIndex === 0 && (
        <p className="mb-4 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-slate-700">
          {FINGER_INTRO}
        </p>
      )}

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
        {localizeFingerSection(currentSection, locale)}
      </h2>

      {sectionQuestions.map((q) => (
        <QuestionField key={q.id} q={q} answers={answers} onPatch={patch} locale={locale} />
      ))}

      {sectionError && <p className="mb-4 text-sm text-red-600">{sectionError}</p>}

      <div className="mt-4 flex gap-3">
        {sectionIndex > 0 && (
          <button
            type="button"
            onClick={() => onSectionIndexChange(sectionIndex - 1)}
            className="rounded-2xl border-2 border-slate-200 bg-white px-4 py-3.5 text-sm font-semibold text-slate-600 transition-all duration-150 hover:border-slate-300 hover:bg-slate-50 active:scale-[0.98]"
          >
            Atrás
          </button>
        )}
        {!isLastSection ? (
          <button
            type="button"
            onClick={handleNext}
            className="flex-1 rounded-2xl bg-blue-600 px-4 py-3.5 text-sm font-bold text-white shadow-sm shadow-blue-600/20 transition-all duration-150 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-md active:scale-[0.98]"
          >
            Siguiente
          </button>
        ) : (
          <div className="flex-1 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3.5 text-center text-sm font-semibold text-emerald-700">
            Listo para enviar a la IA
          </div>
        )}
      </div>
    </div>
  );
}

export function isLastFingerSection(value: FingerAdaptiveAnswers, sectionIndex: number): boolean {
  const answers = value ?? defaultFingerAdaptiveAnswers();
  const sections = getVisibleFingerSections(answers);
  return sectionIndex >= sections.length - 1;
}
