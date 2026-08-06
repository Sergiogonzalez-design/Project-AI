"use client";

import { chipClass } from "@/components/ui/chip-style";
import { PainScale } from "@/components/ui/pain-scale";
import { QuestionnaireProgress } from "@/components/ui/questionnaire-progress";
import { redFlagsDetectedLabel, redFlagsUrgencyNote } from "@/lib/consulta-red-flags-copy";

import { useEffect } from "react";
import {
  defaultWristAdaptiveAnswers,
  detectWristRedFlags,
  getVisibleWristQuestions,
  getVisibleWristSections,
  localizeWristLabel,
  localizeWristOption,
  localizeWristSection,
  validateWristSection,
  WRIST_LOCATION_OPTIONS,
  type ConsultLocale,
  type WristAdaptiveAnswers,
  type WristQuestionDef,
  type WristQuestionSection,
} from "@/lib/consulta-wrist-adaptive";

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
      o === "No" ||
      o === "Sin limitación" ||
      o === "Ninguno en particular" ||
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

function WristLocationMap({
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

  const display = (opt: string) => localizeWristOption(opt, locale);

  return (
    <div className="mb-5">
      <div className="relative overflow-hidden rounded-2xl border border-blue-200 bg-gradient-to-b from-blue-50 to-white p-4 sm:p-6">
        <div className="pointer-events-none absolute inset-0 opacity-60">
          <div className="absolute left-1/2 top-6 h-24 w-16 -translate-x-1/2 rounded-[28px] border border-blue-200 bg-white" />
          <div className="absolute left-1/2 top-[118px] h-28 w-24 -translate-x-1/2 rounded-[34px] border border-blue-200 bg-white" />
          <div className="absolute left-1/2 top-[92px] h-8 w-14 -translate-x-1/2 rounded-full border border-blue-200 bg-white" />
        </div>

        <p className="mb-3 text-xs font-medium text-slate-600">
          {locale === "en"
            ? "Tap the map to mark areas (you can select several)."
            : "Toca en el “mapa” para marcar zonas (puedes elegir varias)."}
        </p>

        <div className="relative mx-auto h-[220px] max-w-[420px]">
          {[
            { opt: "Lado del pulgar", cls: "left-1 top-[86px]" },
            { opt: "Base del pulgar", cls: "left-6 top-[130px]" },
            { opt: "Lado del meñique", cls: "right-1 top-[86px]" },
            { opt: "Cara dorsal (parte externa)", cls: "left-1/2 top-4 -translate-x-1/2" },
            { opt: "Cara palmar (parte interna)", cls: "left-1/2 top-[182px] -translate-x-1/2" },
            { opt: "Centro de la muñeca", cls: "left-1/2 top-[104px] -translate-x-1/2" },
            { opt: "Toda la muñeca", cls: "left-1/2 top-[58px] -translate-x-1/2" },
            { opt: "Hacia la mano", cls: "left-1/2 top-[150px] -translate-x-1/2" },
          ].map(({ opt, cls }) => (
            <button
              key={opt}
              type="button"
              onClick={() => toggle(opt)}
              className={`absolute ${cls} rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                value.includes(opt)
                  ? "border-blue-600 bg-blue-600 text-white"
                  : "border-blue-200 bg-white text-slate-600 hover:border-blue-400"
              }`}
            >
              {display(opt)}
            </button>
          ))}
        </div>

        <div className="mt-2 flex flex-wrap gap-2">
          {WRIST_LOCATION_OPTIONS.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => toggle(opt)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
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
  q: WristQuestionDef;
  answers: WristAdaptiveAnswers;
  onPatch: (p: Partial<WristAdaptiveAnswers>) => void;
  locale: ConsultLocale;
}) {
  const val = answers[q.id];
  const label = localizeWristLabel(q.id, q.label, locale);
  const displayOption = (opt: string) => localizeWristOption(opt, locale);

  if (q.type === "slider") {
    const num = typeof val === "number" ? val : 5;
    const min = typeof q.min === "number" ? q.min : 0;
    const max = typeof q.max === "number" ? q.max : 10;
    if (q.id === "intensidad_dolor") {
      return (
        <PainScale
          value={num}
          onChange={(v) => onPatch({ [q.id]: v } as Partial<WristAdaptiveAnswers>)}
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
            onPatch({ [q.id]: Number(e.target.value) } as Partial<WristAdaptiveAnswers>)
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
          onChange={(e) => onPatch({ [q.id]: e.target.value } as Partial<WristAdaptiveAnswers>)}
          rows={2}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-50"
        />
      </div>
    );
  }

  if (q.type === "wrist_map") {
    return (
      <div className="mb-1">
        <label className={labelClass}>{label}</label>
        <WristLocationMap
          value={Array.isArray(val) ? val : []}
          onChange={(v) => onPatch({ [q.id]: v } as Partial<WristAdaptiveAnswers>)}
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
          onChange={(v) => onPatch({ [q.id]: v } as Partial<WristAdaptiveAnswers>)}
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
          onChange={(v) => onPatch({ [q.id]: v } as Partial<WristAdaptiveAnswers>)}
          displayOption={displayOption}
        />
      </div>
    );
  }

  return null;
}

type Props = {
  value: WristAdaptiveAnswers;
  onChange: (v: WristAdaptiveAnswers) => void;
  sectionIndex: number;
  onSectionIndexChange: (i: number) => void;
  sectionError: string | null;
  onSectionError: (msg: string | null) => void;
  locale?: ConsultLocale;
};

export function ConsultaAdaptiveWrist({
  value,
  onChange,
  sectionIndex,
  onSectionIndexChange,
  sectionError,
  onSectionError,
  locale = "es",
}: Props) {
  const answers = value ?? defaultWristAdaptiveAnswers();
  const sections = getVisibleWristSections(answers);
  const currentSection = (sections[sectionIndex] ?? sections[0]) as WristQuestionSection;
  const sectionQuestions = getVisibleWristQuestions(answers).filter(
    (q) => q.section === currentSection
  );
  const { urgent, triggered } = detectWristRedFlags(answers);
  const isLastSection = sectionIndex >= sections.length - 1;

  useEffect(() => {
    if (sectionIndex >= sections.length && sections.length > 0) {
      onSectionIndexChange(sections.length - 1);
    }
  }, [sectionIndex, sections.length, onSectionIndexChange]);

  function patch(p: Partial<WristAdaptiveAnswers>) {
    onChange({ ...answers, ...p });
  }

  function handleNext() {
    if (!currentSection) return;
    const err = validateWristSection(currentSection, answers);
    if (err) {
      onSectionError(err);
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
          <strong>{redFlagsDetectedLabel(locale)}</strong> {triggered.join(", ")}.
          {redFlagsUrgencyNote(locale)}
        </div>
      )}

      <h2 className="mb-4 text-xl font-bold tracking-tight text-slate-900">
        {localizeWristSection(currentSection, locale)}
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

export function isLastWristSection(value: WristAdaptiveAnswers, sectionIndex: number): boolean {
  const answers = value ?? defaultWristAdaptiveAnswers();
  const sections = getVisibleWristSections(answers);
  return sectionIndex >= sections.length - 1;
}
