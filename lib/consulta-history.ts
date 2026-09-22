/** Chronological consulta numbers for a patient's clinical reports. */

export type ConsultaHistoryItem = {
  id: string;
  created_at: string;
};

/** Map report id → 1-based consulta number (oldest = #1). */
export function buildConsultaNumberMap(
  reports: ConsultaHistoryItem[]
): Map<string, number> {
  const sorted = [...reports].sort((a, b) =>
    a.created_at.localeCompare(b.created_at)
  );
  const map = new Map<string, number>();
  sorted.forEach((r, i) => map.set(r.id, i + 1));
  return map;
}

export function formatConsultaLabel(
  n: number,
  bodyArea: string | null | undefined,
  locale: "es" | "en" = "es"
): string {
  const area = (bodyArea || "").trim();
  if (locale === "en") {
    return area ? `Visit #${n} · ${area}` : `Visit #${n}`;
  }
  return area ? `Consulta #${n} · ${area}` : `Consulta #${n}`;
}

export function summarizeConsultaHistory(reports: ConsultaHistoryItem[]): {
  total: number;
  firstAt: string | null;
  lastAt: string | null;
} {
  if (reports.length === 0) {
    return { total: 0, firstAt: null, lastAt: null };
  }
  const sorted = [...reports].sort((a, b) =>
    a.created_at.localeCompare(b.created_at)
  );
  return {
    total: sorted.length,
    firstAt: sorted[0]?.created_at ?? null,
    lastAt: sorted[sorted.length - 1]?.created_at ?? null,
  };
}
