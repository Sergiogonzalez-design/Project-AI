/**
 * Welcome copy for the patient Fisioterapia flow (after entering a physio code).
 */

export function physioDisplayName(physioName: string | null | undefined): string {
  const trimmed = physioName?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : "tu fisioterapeuta";
}

/** Short greeting on the Physio intro screen before chat. */
export function buildPhysioLinkedIntroGreeting(
  physioName: string | null | undefined
): string {
  const name = physioDisplayName(physioName);
  return `¡Hola! Soy Physio. ${name} te ha pedido que completes esta consulta. Al terminar, recibirá un informe para entender mejor tu caso antes de la cita y hacer el tratamiento más rápido.`;
}

/** First assistant bubble once the chat opens. */
export function buildPhysioLinkedWelcome(
  physioName: string | null | undefined
): string {
  const name = physioDisplayName(physioName);
  return `Hola. Soy Physio, el asistente de Kinora. Tu fisioterapeuta **${name}** te ha enviado aquí para prepararos mejor la cita.

Cuéntame qué te molesta: dónde sientes dolor o limitación, cuándo empezó y cómo te afecta en el día a día. Te haré algunas preguntas y, al terminar, generaré un **informe clínico** que **${name}** verá en su panel antes de tu tratamiento, para llegar con más información y hacer el proceso más rápido y eficaz.

Cuando quieras, empieza describiendo tu molestia.`;
}
