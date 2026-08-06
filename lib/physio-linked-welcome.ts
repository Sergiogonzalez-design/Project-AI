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
  return `Hola. Soy Physio, el asistente de Kinora. Tu fisioterapeuta **${name}** te ha enviado aquí para preparar un **informe clínico** que verá en su panel antes de la cita.

Este chat es **solo para eso**: cuéntame qué te molesta (dónde, cuándo empezó y cómo te afecta), te haré preguntas y, al terminar, generaré el informe para **${name}**.

Si tienes otras dudas generales o quieres hablar libremente con la IA, usa la pestaña **Consulta**.

Cuando quieras, empieza describiendo tu molestia.`;
}

/** Short chat bubble saved after the physio report is sent (patient does not see clinical summary). */
export function buildPhysioLinkedCompletionMessage(
  physioName: string | null | undefined
): string {
  const name = physioDisplayName(physioName);
  return `¡Gracias por tu tiempo!

**${name}** ya ha recibido toda la información sobre tu molestia y podrá prepararse mejor para tu tratamiento.

Si quieres seguir usando la IA, abre la pestaña **Consulta**.`;
}
