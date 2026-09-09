/** Structured clinic opening hours — stored in clinics.hours (JSON or legacy free text). */

export type ClinicWeekdayId =
  | "mon"
  | "tue"
  | "wed"
  | "thu"
  | "fri"
  | "sat"
  | "sun";

export type ClinicDayHours = {
  id: ClinicWeekdayId;
  open: boolean;
  /** HH:mm 24h */
  start: string;
  /** HH:mm 24h */
  end: string;
};

export type ClinicHoursSchedule = {
  v: 1;
  days: ClinicDayHours[];
};

export const CLINIC_WEEKDAYS: {
  id: ClinicWeekdayId;
  labelEs: string;
  labelShortEs: string;
}[] = [
  { id: "mon", labelEs: "Lunes", labelShortEs: "L" },
  { id: "tue", labelEs: "Martes", labelShortEs: "M" },
  { id: "wed", labelEs: "Miércoles", labelShortEs: "X" },
  { id: "thu", labelEs: "Jueves", labelShortEs: "J" },
  { id: "fri", labelEs: "Viernes", labelShortEs: "V" },
  { id: "sat", labelEs: "Sábado", labelShortEs: "S" },
  { id: "sun", labelEs: "Domingo", labelShortEs: "D" },
];

const DEFAULT_START = "09:00";
const DEFAULT_END = "20:00";

export function defaultClinicHoursSchedule(): ClinicHoursSchedule {
  return {
    v: 1,
    days: CLINIC_WEEKDAYS.map((d) => ({
      id: d.id,
      open: d.id !== "sun",
      start: DEFAULT_START,
      end: d.id === "sat" ? "14:00" : DEFAULT_END,
    })),
  };
}

export function isClinicHoursSchedule(value: unknown): value is ClinicHoursSchedule {
  if (!value || typeof value !== "object") return false;
  const v = value as ClinicHoursSchedule;
  return v.v === 1 && Array.isArray(v.days) && v.days.length === 7;
}

/** Persist to DB (JSON string). */
export function serializeClinicHours(schedule: ClinicHoursSchedule): string {
  return JSON.stringify(schedule);
}

/** Human-readable multi-line text for public profiles / Maps-style display. */
export function formatClinicHoursDisplay(schedule: ClinicHoursSchedule): string {
  return formatGroupedClinicHours(schedule, "long").join("\n");
}

/** Compact one-line summary for editor headers (e.g. "L–S 09:00–20:00 · Dom cerrado"). */
export function formatClinicHoursCompactSummary(
  schedule: ClinicHoursSchedule,
): string {
  return formatGroupedClinicHours(schedule, "short").join(" · ");
}

function formatGroupedClinicHours(
  schedule: ClinicHoursSchedule,
  style: "long" | "short",
): string[] {
  const days = CLINIC_WEEKDAYS.map((meta) => {
    const row = schedule.days.find((d) => d.id === meta.id);
    return {
      id: meta.id,
      label: style === "short" ? meta.labelShortEs : meta.labelEs,
      open: row?.open ?? false,
      start: row?.start ?? DEFAULT_START,
      end: row?.end ?? DEFAULT_END,
    };
  });

  const lines: string[] = [];
  let i = 0;
  while (i < days.length) {
    const first = days[i];
    let j = i;
    while (
      j + 1 < days.length &&
      days[j + 1].open === first.open &&
      (!first.open ||
        (days[j + 1].start === first.start && days[j + 1].end === first.end))
    ) {
      j++;
    }
    const last = days[j];
    const range =
      i === j ? first.label : `${first.label}–${last.label}`;
    if (!first.open) {
      lines.push(
        style === "short" ? `${range} cerrado` : `${range}: Cerrado`,
      );
    } else {
      lines.push(`${range}: ${first.start}–${first.end}`);
    }
    i = j + 1;
  }
  return lines;
}

/** Format DB `hours` column (JSON schedule or legacy free text) for UI. */
export function displayClinicHoursText(
  raw: string | null | undefined,
): string | null {
  const text = (raw ?? "").trim();
  if (!text) return null;
  const { schedule, legacyText } = parseClinicHours(text);
  if (legacyText) return legacyText;
  return formatClinicHoursDisplay(schedule);
}

/**
 * Load from DB. Supports:
 * - JSON schedule (v1)
 * - legacy free text (kept as opaque; returns default editable schedule + legacyNote)
 */
export function parseClinicHours(raw: string | null | undefined): {
  schedule: ClinicHoursSchedule;
  legacyText: string | null;
} {
  const text = (raw ?? "").trim();
  if (!text) {
    return { schedule: defaultClinicHoursSchedule(), legacyText: null };
  }
  if (text.startsWith("{")) {
    try {
      const parsed = JSON.parse(text) as unknown;
      if (isClinicHoursSchedule(parsed)) {
        const byId = new Map(parsed.days.map((d) => [d.id, d]));
        const days = CLINIC_WEEKDAYS.map((d) => {
          const row = byId.get(d.id);
          return {
            id: d.id,
            open: row?.open ?? false,
            start: normalizeTime(row?.start) ?? DEFAULT_START,
            end: normalizeTime(row?.end) ?? DEFAULT_END,
          };
        });
        return { schedule: { v: 1, days }, legacyText: null };
      }
    } catch {
      // fall through to legacy
    }
  }
  return { schedule: defaultClinicHoursSchedule(), legacyText: text };
}

export function normalizeTime(value: string | null | undefined): string | null {
  if (!value) return null;
  const m = /^(\d{1,2}):(\d{2})$/.exec(value.trim());
  if (!m) return null;
  const h = Number(m[1]);
  const min = Number(m[2]);
  if (h < 0 || h > 23 || min < 0 || min > 59) return null;
  return `${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
}

export function timeToDate(hhmm: string): Date {
  const [h, m] = (normalizeTime(hhmm) ?? DEFAULT_START).split(":").map(Number);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d;
}

export function dateToTime(d: Date): string {
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

/** 15-minute slots for web dropdowns / fallback pickers. */
export function clinicTimeOptions(stepMinutes = 15): string[] {
  const out: string[] = [];
  for (let mins = 0; mins < 24 * 60; mins += stepMinutes) {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    out.push(
      `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`,
    );
  }
  return out;
}

export function applyWeekdayTemplate(
  schedule: ClinicHoursSchedule,
  start: string,
  end: string,
): ClinicHoursSchedule {
  const weekdays: ClinicWeekdayId[] = ["mon", "tue", "wed", "thu", "fri"];
  return {
    v: 1,
    days: schedule.days.map((d) =>
      weekdays.includes(d.id)
        ? { ...d, open: true, start, end }
        : { ...d, open: false },
    ),
  };
}
