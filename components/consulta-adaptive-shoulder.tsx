"use client";

import { useEffect } from "react";
import {
  defaultShoulderAdaptiveAnswers,
  detectRedFlags,
  getVisibleShoulderQuestions,
  getVisibleShoulderSections,
  SHOULDER_SECTION_LABELS,
  validateShoulderSection,
  type ShoulderAdaptiveAnswers,
  type ShoulderQuestionDef,
  type ShoulderQuestionSection,
} from "@/lib/consulta-shoulder-adaptive";

const labelClass = "mb-2 block text-sm font-semibold text-slate-700";

function ChipGroup({
  options,
  value,
  onChange,
}: {
  options: readonly string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="mb-5 flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={`rounded-full border px-3 py-2 text-xs font-medium transition-colors sm:px-3 sm:py-1.5 sm:text-sm ${
            value === opt
              ? "border-blue-600 bg-blue-600 text-white"
              : "border-blue-200 bg-white text-slate-600 hover:border-blue-400"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

function MultiChipGroup({
  options,
  value,
  onChange,
}: {
  options: readonly string[];
  value: string[];
  onChange: (v: string[]) => void;
}) {
  const noneOption = options.find((o) => o === "Ninguno" || o === "Ninguno en particular");

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
    <div className="mb-5 flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => toggle(opt)}
          className={`rounded-full border px-3 py-2 text-xs font-medium transition-colors sm:px-3 sm:py-1.5 sm:text-sm ${
            value.includes(opt)
              ? "border-blue-600 bg-blue-600 text-white"
              : "border-blue-200 bg-white text-slate-600 hover:border-blue-400"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

function QuestionField({
  q,
  answers,
  onPatch,
}: {
  q: ShoulderQuestionDef;
  answers: ShoulderAdaptiveAnswers;
  onPatch: (p: Partial<ShoulderAdaptiveAnswers>) => void;
}) {
  const val = answers[q.id];

  if (q.type === "slider") {
    const num = typeof val === "number" ? val : 5;
    return (
      <div className="mb-5">
        <label className={labelClass}>
          {q.label}: <span className="text-blue-600">{num}/10</span>
        </label>
        <input
          type="range"
          min={1}
          max={10}
          value={num}
          onChange={(e) => onPatch({ [q.id]: Number(e.target.value) } as Partial<ShoulderAdaptiveAnswers>)}
          className="w-full accent-blue-600"
        />
      </div>
    );
  }

  if (q.type === "text") {
    return (
      <div className="mb-5">
        <label className={labelClass}>{q.label}</label>
        <textarea
          value={typeof val === "string" ? val : ""}
          onChange={(e) => onPatch({ [q.id]: e.target.value } as Partial<ShoulderAdaptiveAnswers>)}
          rows={2}
          className="w-full rounded-xl border border-blue-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
        />
      </div>
    );
  }

  if (q.type === "multi" && q.options) {
    return (
      <div className="mb-1">
        <label className={labelClass}>{q.label}</label>
        <MultiChipGroup
          options={q.options}
          value={Array.isArray(val) ? val : []}
          onChange={(v) => onPatch({ [q.id]: v } as Partial<ShoulderAdaptiveAnswers>)}
        />
      </div>
    );
  }

  if (q.options) {
    return (
      <div className="mb-1">
        <label className={labelClass}>{q.label}</label>
        <ChipGroup
          options={q.options}
          value={typeof val === "string" ? val : ""}
          onChange={(v) => onPatch({ [q.id]: v } as Partial<ShoulderAdaptiveAnswers>)}
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
};

export function ConsultaAdaptiveShoulder({
  value,
  onChange,
  sectionIndex,
  onSectionIndexChange,
  sectionError,
  onSectionError,
}: Props) {
  const answers = value ?? defaultShoulderAdaptiveAnswers();
  const sections = getVisibleShoulderSections(answers);
  const currentSection = sections[sectionIndex] ?? sections[0];
  const sectionQuestions = getVisibleShoulderQuestions(answers).filter(
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
    const err = validateShoulderSection(currentSection, answers);
    if (err) {
      onSectionError(err);
      return;
    }
    onSectionError(null);
    onSectionIndexChange(sectionIndex + 1);
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-xs font-medium text-slate-500">
          Paso {sectionIndex + 1} de {sections.length}
        </p>
        <div className="flex gap-1">
          {sections.map((s, i) => (
            <div
              key={s}
              className={`h-1.5 w-6 rounded-full ${
                i <= sectionIndex ? "bg-blue-600" : "bg-blue-100"
              }`}
            />
          ))}
        </div>
      </div>

      {currentSection === "red_flags" && (
        <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Estas preguntas detectan situaciones que pueden requerir atención médica urgente.
        </div>
      )}

      {urgent && currentSection !== "red_flags" && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          <strong>Banderas rojas detectadas:</strong> {triggered.join(", ")}.
          La IA priorizará recomendarte atención médica urgente.
        </div>
      )}

      <h2 className="mb-4 text-base font-bold text-slate-800">
        {SHOULDER_SECTION_LABELS[currentSection]}
      </h2>

      {sectionQuestions.map((q) => (
        <QuestionField key={q.id} q={q} answers={answers} onPatch={patch} />
      ))}

      {sectionError && <p className="mb-4 text-sm text-red-600">{sectionError}</p>}

      <div className="mt-4 flex gap-3">
        {sectionIndex > 0 && (
          <button
            type="button"
            onClick={() => onSectionIndexChange(sectionIndex - 1)}
            className="flex-1 rounded-xl border border-blue-200 py-3 text-sm font-semibold text-blue-600 hover:bg-blue-50"
          >
            Anterior
          </button>
        )}
        {!isLastSection && (
          <button
            type="button"
            onClick={handleNext}
            className="flex-1 rounded-xl bg-blue-600 py-3 text-sm font-bold text-white hover:bg-blue-700"
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
  sectionIndex: number
): boolean {
  const sections = getVisibleShoulderSections(answers);
  return sectionIndex >= sections.length - 1;
}
