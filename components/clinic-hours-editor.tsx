"use client";

import {
  CLINIC_WEEKDAYS,
  applyWeekdayTemplate,
  clinicTimeOptions,
  formatClinicHoursCompactSummary,
  type ClinicDayHours,
  type ClinicHoursSchedule,
  type ClinicWeekdayId,
} from "@/lib/clinic-hours";

type Props = {
  value: ClinicHoursSchedule;
  onChange: (next: ClinicHoursSchedule) => void;
  accent?: string;
  legacyText?: string | null;
};

const TIME_OPTIONS = clinicTimeOptions(15);

export function ClinicHoursEditor({
  value,
  onChange,
  accent = "#2563EB",
  legacyText,
}: Props) {
  function updateDay(id: ClinicWeekdayId, patch: Partial<ClinicDayHours>) {
    onChange({
      v: 1,
      days: value.days.map((d) => (d.id === id ? { ...d, ...patch } : d)),
    });
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
      <div className="flex items-start justify-between gap-3 border-b border-neutral-100 px-4 py-3">
        <div className="min-w-0">
          <p className="text-sm font-bold text-neutral-900">Horario</p>
          <p className="mt-0.5 text-xs text-neutral-500">
            {formatClinicHoursCompactSummary(value)}
          </p>
        </div>
        <button
          type="button"
          className="shrink-0 text-xs font-semibold"
          style={{ color: accent }}
          onClick={() => onChange(applyWeekdayTemplate(value, "09:00", "20:00"))}
        >
          Plantilla L–V
        </button>
      </div>

      {legacyText ? (
        <p className="border-b border-amber-100 bg-amber-50 px-4 py-2 text-xs text-amber-950">
          Horario anterior (texto libre): {legacyText}. Configura los días abajo
          para sustituirlo.
        </p>
      ) : null}

      <ul className="divide-y divide-neutral-100">
        {CLINIC_WEEKDAYS.map((meta) => {
          const day = value.days.find((d) => d.id === meta.id);
          if (!day) return null;
          return (
            <li
              key={meta.id}
              className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
            >
              <span className="min-w-[6.5rem] text-sm font-medium text-neutral-900">
                {meta.labelEs}
              </span>
              <div className="flex flex-1 flex-wrap items-center justify-end gap-3">
                {day.open ? (
                  <div className="flex items-center gap-2">
                    <select
                      className="rounded-lg border border-neutral-200 bg-slate-50 px-2 py-1.5 text-sm font-semibold tabular-nums text-neutral-800"
                      value={day.start}
                      onChange={(e) =>
                        updateDay(meta.id, { start: e.target.value })
                      }
                      aria-label={`${meta.labelEs} apertura`}
                    >
                      {TIME_OPTIONS.map((t) => (
                        <option key={`s-${t}`} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                    <span className="text-neutral-400">–</span>
                    <select
                      className="rounded-lg border border-neutral-200 bg-slate-50 px-2 py-1.5 text-sm font-semibold tabular-nums text-neutral-800"
                      value={day.end}
                      onChange={(e) =>
                        updateDay(meta.id, { end: e.target.value })
                      }
                      aria-label={`${meta.labelEs} cierre`}
                    >
                      {TIME_OPTIONS.map((t) => (
                        <option key={`e-${t}`} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <span className="text-sm font-semibold text-neutral-400">
                    Cerrado
                  </span>
                )}
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    className="peer sr-only"
                    checked={day.open}
                    onChange={(e) =>
                      updateDay(meta.id, { open: e.target.checked })
                    }
                  />
                  <span
                    className="h-7 w-12 rounded-full bg-neutral-200 transition peer-checked:bg-[var(--accent)] after:absolute after:left-0.5 after:top-0.5 after:h-6 after:w-6 after:rounded-full after:bg-white after:shadow after:transition peer-checked:after:translate-x-5"
                    style={{ ["--accent" as string]: accent }}
                  />
                </label>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
