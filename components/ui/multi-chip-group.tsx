"use client";

import { ChipButton } from "@/components/ui/chip-button";
import { chipClass, chipStackClass } from "@/components/ui/chip-style";

type Props = {
  options: readonly string[];
  value: string[];
  onChange: (v: string[]) => void;
  displayOption?: (opt: string) => string;
  /** Stack = full-width rows (alertas / red flags). Wrap = pill grid (default). */
  layout?: "wrap" | "stack";
};

export function MultiChipGroup({
  options,
  value,
  onChange,
  displayOption,
  layout = "wrap",
}: Props) {
  const noneOption = options.find(
    (o) =>
      o === "Ninguno" ||
      o === "Ninguno en particular" ||
      o === "Sin limitación" ||
      o === "Ninguna" ||
      o === "No" ||
      o === "Nada específico"
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

  if (layout === "stack") {
    return (
      <div className="mb-5 flex flex-col gap-2.5">
        {options.map((opt) => (
          <ChipButton
            key={opt}
            selected={value.includes(opt)}
            onClick={() => toggle(opt)}
            label={displayOption ? displayOption(opt) : opt}
            className={chipStackClass(value.includes(opt))}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="mb-5 flex flex-wrap gap-2.5">
      {options.map((opt) => (
        <ChipButton
          key={opt}
          selected={value.includes(opt)}
          onClick={() => toggle(opt)}
          label={displayOption ? displayOption(opt) : opt}
          className={chipClass(value.includes(opt))}
        />
      ))}
    </div>
  );
}
