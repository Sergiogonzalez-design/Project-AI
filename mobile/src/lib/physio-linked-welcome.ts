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
  return `¡Hola! Soy Physio. ${name} te ha pedido que completes esta consulta. Al terminar —incluido un breve bloque de pruebas funcionales—, recibirá un informe para entender mejor tu caso antes de la cita.`;
}

/** First assistant bubble once the chat opens. */
export function buildPhysioLinkedWelcome(
  physioName: string | null | undefined
): string {
  const name = physioDisplayName(physioName);
  return `Hola. Soy Physio, el asistente de AIKinora. Tu fisioterapeuta **${name}** te ha enviado aquí para preparar un **informe clínico** que verá en su panel antes de la cita.

Este chat es **solo para eso**: cuéntame qué te molesta (dónde, cuándo empezó y cómo te afecta), te haré preguntas y te pediré unas **pruebas funcionales** sencillas. Cuando me envíes esos resultados, generaré el informe para **${name}**.

Si tienes otras dudas generales o quieres hablar libremente con la IA, usa la pestaña **Consulta**.

Cuando quieras, empieza describiendo tu molestia.

_AIKinora es una IA orientativa: no sustituye una valoración presencial._`;
}

/** After questionnaire: ask the patient to complete functional tests before closing. */
export function buildPhysioLinkedFunctionalTestsPrompt(
  physioName: string | null | undefined
): string {
  const name = physioDisplayName(physioName);
  return `Antes de enviar el informe a **${name}**, haz las **pruebas funcionales** de arriba (en casa, con cuidado) y responde aquí a cada una con **sí/no**, dónde duele y si se parece al otro lado.

Cuando me envíes esos resultados, cerraré la consulta y **${name}** recibirá el informe completo con tus respuestas.`;
}

/** Short chat bubble saved after the physio report is sent (patient does not see clinical summary). */
export function buildPhysioLinkedCompletionMessage(
  physioName: string | null | undefined
): string {
  const name = physioDisplayName(physioName);
  return `¡Gracias por tu tiempo!

**${name}** ya ha recibido la información de tu molestia **y los resultados de las pruebas funcionales**, y podrá prepararse mejor para tu tratamiento.

Si quieres seguir usando la IA, abre la pestaña **Consulta**.

_AIKinora es una IA orientativa: no sustituye una valoración presencial._`;
}
