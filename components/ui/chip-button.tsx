"use client";

import { chipClass } from "@/components/ui/chip-style";

type Props = {
  selected: boolean;
  onClick: () => void;
  label: string;
  disabled?: boolean;
  className?: string;
};

/**
 * Chip whose visible label is CSS `attr()` — not a React text node.
 * Chrome Translate wraps/duplicates text nodes on click; CSS content is left alone.
 */
export function ChipButton({ selected, onClick, label, disabled, className }: Props) {
  return (
    <button
      type="button"
      translate="no"
      aria-pressed={selected}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={className ?? chipClass(selected)}
    >
      <span className="chip-label notranslate" translate="no" data-label={label} />
    </button>
  );
}
