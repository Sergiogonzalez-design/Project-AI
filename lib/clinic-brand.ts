export const CLINIC_ACCENT_SWATCHES = [
  { id: "blue", hex: "#2563EB", label: "Azul" },
  { id: "sky", hex: "#0284C7", label: "Cielo" },
  { id: "teal", hex: "#0D9488", label: "Teal" },
  { id: "emerald", hex: "#059669", label: "Verde" },
  { id: "violet", hex: "#7C3AED", label: "Violeta" },
  { id: "rose", hex: "#E11D48", label: "Rosa" },
  { id: "amber", hex: "#D97706", label: "Ámbar" },
  { id: "slate", hex: "#0F172A", label: "Pizarra" },
] as const;

export const CLINIC_SPECIALTY_PRESETS = [
  "Deportiva",
  "Pediátrica",
  "Suelo pélvico",
  "Traumatológica",
  "Neurológica",
  "Geriátrica",
  "Osteopatía",
  "Dolor crónico",
  "Invasiva",
  "ATM / mandíbula",
  "Raquis",
  "Readaptación",
] as const;

export const DEFAULT_CLINIC_ACCENT = "#2563EB";

const HEX6_RE = /^#[0-9A-F]{6}$/i;
const HEX3_RE = /^#[0-9A-F]{3}$/i;

/** Expand #RGB → #RRGGBB; return null if invalid. */
export function parseClinicAccentHex(hex: string | null | undefined): string | null {
  const raw = (hex ?? "").trim();
  if (!raw) return null;
  const withHash = raw.startsWith("#") ? raw : `#${raw}`;
  if (HEX6_RE.test(withHash)) return withHash.toUpperCase();
  if (HEX3_RE.test(withHash)) {
    const h = withHash.slice(1).toUpperCase();
    return `#${h[0]}${h[0]}${h[1]}${h[1]}${h[2]}${h[2]}`;
  }
  return null;
}

/** Any valid #RRGGBB, or default if invalid. */
export function normalizeClinicAccent(hex: string | null | undefined): string {
  return parseClinicAccentHex(hex) ?? DEFAULT_CLINIC_ACCENT;
}

export function clinicAccentSoft(hex: string): string {
  const h = normalizeClinicAccent(hex).replace("#", "");
  const r = Number.parseInt(h.slice(0, 2), 16);
  const g = Number.parseInt(h.slice(2, 4), 16);
  const b = Number.parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, 0.12)`;
}

export function parseClinicSpecialties(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .filter((s): s is string => typeof s === "string")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  if (typeof value === "string" && value.trim()) {
    return value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
}

export function isClinicSpecialtyPreset(value: string): boolean {
  return (CLINIC_SPECIALTY_PRESETS as readonly string[]).includes(value);
}

/** Specialties the clinic added via «Otro» (not in the preset list). */
export function customClinicSpecialties(specialties: string[]): string[] {
  return specialties.filter((s) => !isClinicSpecialtyPreset(s));
}

/**
 * Custom equipment / service entries are stored as:
 *   custom:{categoryId}:{label}
 * so they stay grouped under the right section.
 */
export const CUSTOM_EQUIPMENT_PREFIX = "custom:";

export function customEquipmentKey(categoryId: string, label: string): string {
  return `${CUSTOM_EQUIPMENT_PREFIX}${categoryId}:${label.trim()}`;
}

export function parseCustomEquipmentKey(
  id: string,
): { categoryId: string; label: string } | null {
  if (!id.startsWith(CUSTOM_EQUIPMENT_PREFIX)) return null;
  const rest = id.slice(CUSTOM_EQUIPMENT_PREFIX.length);
  const colon = rest.indexOf(":");
  if (colon <= 0) return null;
  const categoryId = rest.slice(0, colon);
  const label = rest.slice(colon + 1).trim();
  if (!categoryId || !label) return null;
  return { categoryId, label };
}

export function listCustomEquipmentForCategory(
  equipment: string[],
  categoryId: string,
): string[] {
  return equipment
    .map(parseCustomEquipmentKey)
    .filter((x): x is { categoryId: string; label: string } =>
      Boolean(x && x.categoryId === categoryId),
    )
    .map((x) => x.label);
}

export function displayEquipmentLabel(id: string): string {
  const custom = parseCustomEquipmentKey(id);
  return custom?.label ?? id;
}
