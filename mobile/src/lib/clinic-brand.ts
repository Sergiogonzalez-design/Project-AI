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

export function normalizeClinicAccent(hex: string | null | undefined): string {
  const raw = (hex ?? "").trim().toUpperCase();
  const match = CLINIC_ACCENT_SWATCHES.find((s) => s.hex === raw);
  return match?.hex ?? DEFAULT_CLINIC_ACCENT;
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
