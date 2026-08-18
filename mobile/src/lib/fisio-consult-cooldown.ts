/** Cooldown before a patient can start another Fisioterapia consulta with the same physio. */
export const FISIO_NEW_CONSULT_COOLDOWN_MS = 24 * 60 * 60 * 1000;

/** Whole hours still left in the cooldown (0 = allowed). */
export function fisioNewConsultHoursRemaining(
  lastReportAt: string | null | undefined,
  nowMs: number = Date.now()
): number {
  if (!lastReportAt) return 0;
  const elapsed = nowMs - new Date(lastReportAt).getTime();
  if (!Number.isFinite(elapsed) || elapsed >= FISIO_NEW_CONSULT_COOLDOWN_MS) {
    return 0;
  }
  return Math.max(1, Math.ceil((FISIO_NEW_CONSULT_COOLDOWN_MS - elapsed) / (60 * 60 * 1000)));
}

export function canStartNewFisioConsult(
  lastReportAt: string | null | undefined,
  nowMs: number = Date.now()
): boolean {
  return fisioNewConsultHoursRemaining(lastReportAt, nowMs) === 0;
}

export function fisioNewConsultCooldownMessage(
  hoursLeft: number,
  locale: "es" | "en" = "es"
): string {
  if (locale === "en") {
    return hoursLeft <= 1
      ? "You can start a new consultation with this physiotherapist in about 1 hour. Until then, open an existing one or use the Consulta tab."
      : `You can start a new consultation with this physiotherapist in about ${hoursLeft} hours. Until then, open an existing one or use the Consulta tab.`;
  }
  return hoursLeft <= 1
    ? "Podrás iniciar una nueva consulta con este fisioterapeuta en aproximadamente 1 hora. Mientras tanto, abre una consulta existente o usa la pestaña Consulta."
    : `Podrás iniciar una nueva consulta con este fisioterapeuta en aproximadamente ${hoursLeft} horas. Mientras tanto, abre una consulta existente o usa la pestaña Consulta.`;
}
