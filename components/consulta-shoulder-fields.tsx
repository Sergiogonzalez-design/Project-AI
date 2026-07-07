"use client";

import {
  SHOULDER_INSTABILITY,
  SHOULDER_PAIN_LOCATION,
  SHOULDER_ROM_LIMIT,
  defaultShoulderDetails,
  type ShoulderDetails,
} from "@/lib/consulta-shoulder";
import { YES_NO } from "@/lib/consulta-symptoms";

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
          className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
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

type Props = {
  value: ShoulderDetails;
  onChange: (v: ShoulderDetails) => void;
};

export function ConsultaShoulderFields({ value, onChange }: Props) {
  const current = value ?? defaultShoulderDetails();
  const patch = (p: Partial<ShoulderDetails>) => onChange({ ...current, ...p });

  return (
    <div className="border-t border-blue-100 pt-6 mt-6">
      <h2 className="mb-4 text-base font-bold text-slate-800">Hombro (preguntas específicas)</h2>

      <label className={labelClass}>¿Dónde notas más el dolor?</label>
      <ChipGroup
        options={SHOULDER_PAIN_LOCATION}
        value={current.painLocation}
        onChange={(painLocation) => patch({ painLocation })}
      />

      <label className={labelClass}>¿Duele al elevar el brazo por encima de la cabeza?</label>
      <ChipGroup
        options={YES_NO}
        value={current.overheadPain}
        onChange={(overheadPain) => patch({ overheadPain })}
      />

      <label className={labelClass}>¿Tienes limitación para mover el brazo?</label>
      <ChipGroup
        options={SHOULDER_ROM_LIMIT}
        value={current.romLimit}
        onChange={(romLimit) => patch({ romLimit })}
      />

      <label className={labelClass}>¿Notas inestabilidad (sensación de que se sale)?</label>
      <ChipGroup
        options={SHOULDER_INSTABILITY}
        value={current.instability}
        onChange={(instability) => patch({ instability })}
      />

      <label className={labelClass}>¿También hay dolor de cuello?</label>
      <ChipGroup
        options={YES_NO}
        value={current.neckPain}
        onChange={(neckPain) => patch({ neckPain })}
      />

      <label className={labelClass}>¿Empeora al dormir sobre ese lado?</label>
      <ChipGroup
        options={YES_NO}
        value={current.nightPainShoulderSide}
        onChange={(nightPainShoulderSide) => patch({ nightPainShoulderSide })}
      />
    </div>
  );
}

