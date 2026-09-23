import { Colors } from "../../lib/colors";

/**
 * Shared visual language for the answer "chips" used across every adaptive
 * questionnaire (shoulder, elbow, wrist, finger, neck, lower-leg, knee, back,
 * hip, generic). Centralizing the style here keeps every body-part
 * questionnaire visually consistent without touching each file's independent
 * selection logic (single vs multi, "none" clearing, etc.).
 */
const chipBase = {
  borderWidth: 1.5,
  borderColor: Colors.border,
  backgroundColor: Colors.white,
  borderRadius: 999,
  paddingHorizontal: 15,
  paddingVertical: 10,
} as const;

const chipSelected = {
  borderColor: Colors.primary,
  backgroundColor: Colors.primary,
} as const;

const chipStackBase = {
  ...chipBase,
  borderRadius: 16,
  alignSelf: "stretch" as const,
  width: "100%" as const,
  minHeight: 52,
  paddingVertical: 12,
} as const;

const chipTextBase = {
  fontSize: 13,
  fontWeight: "600" as const,
  color: Colors.text,
  letterSpacing: 0,
  lineHeight: 18,
} as const;

const chipTextSelected = {
  color: Colors.white,
  fontWeight: "700",
} as const;

export function chipStyle(selected: boolean) {
  return selected ? [chipBase, chipSelected] : [chipBase];
}

export function chipStackStyle(selected: boolean) {
  return selected ? [chipStackBase, chipSelected] : [chipStackBase];
}

export function chipTextStyle(selected: boolean) {
  return selected ? [chipTextBase, chipTextSelected] : [chipTextBase];
}
