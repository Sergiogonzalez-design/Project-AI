import { physioDisplayName } from "@/lib/physio-linked-welcome";

function physioClinicLine(
  physioName: string | null | undefined,
  clinicName: string | null | undefined
): string {
  const who = physioDisplayName(physioName, "es");
  const clinic = clinicName?.trim();
  return clinic ? `${who} · ${clinic}` : who;
}

/** First message after the patient opens a fisio WhatsApp link. */
export function buildWhatsAppNameWelcome(opts: {
  physioName?: string | null;
  clinicName?: string | null;
}): string {
  const from = physioClinicLine(opts.physioName, opts.clinicName);
  return `¡Hola! Soy Physio.\n\n${from} te ha pedido esta consulta previa.\n\n¿Cómo te llamas?`;
}

export function buildWhatsAppAskNameAgain(): string {
  return "¿Cómo te llamas?";
}

export function buildWhatsAppNeedCode(): string {
  return "¡Hola! Soy Physio.\n\nAbre el enlace que te envió tu fisioterapeuta, o escribe su código.";
}

export function buildWhatsAppIntakePrompt(
  name: string,
  reused?: boolean
): string {
  return reused
    ? `Hola de nuevo, ${name}.\n\n¿Qué zona te molesta ahora?`
    : `Gracias, ${name}.\n\n¿Qué zona te molesta?`;
}

export function buildWhatsAppIntakeMore(): string {
  return "Dime la zona (rodilla, espalda, hombro…)";
}

export function buildWhatsAppQuestionnaireIntro(): string {
  return "Vamos con unas preguntas cortas.";
}

export function buildWhatsAppComplete(physioName?: string | null): string {
  const who = physioDisplayName(physioName, "es");
  return `¡Gracias!\n\n${who} ya tiene tu informe en AIKinora.`;
}

export function buildWhatsAppAlreadyComplete(): string {
  return "Tu consulta previa ya está lista. Si quieres otra, escribe *reiniciar*.";
}

export function buildWhatsAppRestartWithoutCode(): string {
  return "Empezamos de nuevo.\n\nAbre el enlace de tu fisioterapeuta, o escribe su código.";
}
