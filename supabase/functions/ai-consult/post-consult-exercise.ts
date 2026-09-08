import { buildReadaptationPromptBlock } from "./readaptation.ts";

export function postConsultExerciseOfferSymptomContext(
  bodyArea: string,
  language: "es" | "en" = "es",
): string {
  const zone =
    bodyArea.trim() || (language === "en" ? "this case" : "este caso");
  if (language === "en") {
    return `POST-CONSULT EXERCISE OFFER (CRITICAL — end of consultation for **${zone}**):
The patient finished the clinical orientation and related questions for THIS injury.
Your ONLY job now: send ONE short follow-up message (3–6 sentences) asking whether they want guidance for home.

SMART ADAPTATION (mandatory):
- If PRIORIDAD ALTA, red flags, suspected fracture/luxation, neuro deficit, severe acute trauma, or you already told them HOSPITAL/ER → do NOT offer exercises. Explain that **rest, ice, elevation, and medical care** come first. Ask: "Would you like me to summarize safe self-care for the next 24–48 h while you follow the plan above?"
- If moderate/severe but not emergency (needs imaging, physio soon, relative rest) → explain that **aggressive exercise is not appropriate yet**. Offer a **self-care plan** (relative rest, ice/heat as fits, what to avoid, when to move) OR very gentle mobility only if clearly safe. Ask if they want that summary.
- If mild–moderate, stable, no red flags, and home exercises are reasonable → ask clearly if they want a **personalized phased exercise plan** adapted to their injury (protection → loading), with pain rules.

Do NOT list exercises or a full plan in this message — only the smart question/offer.
Do NOT reopen functional tests or questionnaire.
End with a clear yes/no style question.`;
  }
  return `OFERTA DE EJERCICIOS / AUTOCUIDADO POST-CONSULTA (CRÍTICO — fin de consulta sobre **${zone}**):
El paciente terminó la orientación clínica y las preguntas relacionadas de ESTA lesión.
Tu ÚNICO trabajo ahora: enviar UN mensaje breve (3–6 frases) preguntando si quiere orientación para casa.

ADAPTACIÓN INTELIGENTE (obligatorio):
- Si PRIORIDAD ALTA, banderas rojas, sospecha de fractura/luxación, déficit neurológico, trauma agudo grave, o ya recomendaste HOSPITAL/URGENCIAS → NO ofrezcas ejercicios. Explica que lo prioritario es **reposo, hielo, elevación y atención médica**. Pregunta: «¿Quieres que te resuma el autocuidado seguro para las próximas 24–48 h mientras sigues el plan de arriba?»
- Si es moderado/grave pero no urgencia (necesita imagen, fisio pronto, reposo relativo) → explica que **aún no toca un plan de ejercicios intenso**. Ofrece **autocuidado** (reposo relativo, hielo/calor según encaje, qué evitar, cuándo mover) o movilidad muy suave solo si es claramente seguro. Pregunta si quiere ese resumen.
- Si es leve–moderado, estable, sin banderas rojas y los ejercicios en casa son razonables → pregunta claramente si quiere un **plan de ejercicios personalizado por fases** adaptado a su lesión (protección → carga), con reglas de dolor.

NO listes ejercicios ni el plan completo en este mensaje — solo la pregunta/oferta inteligente.
NO reabras pruebas funcionales ni cuestionario.
Termina con una pregunta clara de sí/no.`;
}

export function postConsultExercisePlanSymptomContext(
  bodyArea: string,
  language: "es" | "en" = "es",
): string {
  const zone =
    bodyArea.trim() || (language === "en" ? "this case" : "este caso");
  if (language === "en") {
    return `POST-CONSULT EXERCISE / SELF-CARE PLAN (CRITICAL — patient said YES for **${zone}**):
Generate the plan NOW based on the FULL case summary and functional test interpretation above.

SMART ADAPTATION (mandatory):
- PRIORIDAD ALTA / red flags / fracture-luxation suspicion / neuro deficit / ER already recommended → section **What to do in the meantime** ONLY: rest, ice (15–20 min, cloth barrier), elevation, no loading, when to go to ER. NO [id=] exercise lines. NO hops/plyometrics.
- Moderate–severe, needs imaging or physio first → **What to do at home for now**: relative rest, ice/heat guidance, sleep positions if relevant, what NOT to do, when to start gentle movement. Optional: 1–2 very gentle [id=] protection-phase exercises ONLY if clearly safe; otherwise none.
- Mild–moderate, exercises appropriate → section **Exercises** with 3–6 lines using catalog [id=…] tokens, phases, dose, pain ≤3/10 rule. Add brief intro on phase and reassess in 1–2 weeks.

Always close: not a diagnosis; stop and seek care if worsening/red flags.
Use patient language; cite evidence qualitatively if needed.`;
  }
  return `PLAN DE EJERCICIOS / AUTOCUIDADO POST-CONSULTA (CRÍTICO — el paciente dijo SÍ para **${zone}**):
Genera el plan AHORA según el resumen completo del caso y la interpretación de pruebas funcionales de arriba.

ADAPTACIÓN INTELIGENTE (obligatorio):
- PRIORIDAD ALTA / banderas rojas / sospecha fractura-luxación / déficit neurológico / ya recomendaste URGENCIAS → sección **Qué hacer mientras tanto** SOLO: reposo, hielo (15–20 min, paño), elevación, no cargar, cuándo ir a urgencias. SIN líneas [id=] de ejercicios. SIN saltos/pliometría.
- Moderado–grave, necesita imagen o fisio primero → **Qué hacer en casa por ahora**: reposo relativo, hielo/calor según encaje, posturas al dormir si aplica, qué NO hacer, cuándo empezar movimiento suave. Opcional: 1–2 ejercicios [id=] fase protección SOLO si es claramente seguro; si no, ninguno.
- Leve–moderado, ejercicios adecuados → sección **Ejercicios** con 3–6 líneas con [id=…] del catálogo, fases, dosis, regla dolor ≤3/10. Breve intro de fase y reevaluar en 1–2 semanas.

Cierra siempre: no es diagnóstico; parar y consultar si empeora/banderas rojas.
Lenguaje para paciente; evidencia cualitativa si hace falta.`;
}

const POST_CONSULT_EXERCISE_OFFER_PROMPT = `Eres Physio, asistente de fisioterapia de Kinora.

El paciente acaba de terminar su consulta sobre una lesión. Ya recibió orientación, pruebas funcionales (si aplicaba) y respondió preguntas relacionadas.

Tu tarea en ESTE mensaje: enviar UNA pregunta/oferta breve y adaptada al caso sobre si quiere orientación para casa (ejercicios O autocuidado según gravedad).

REGLAS:
- Lee el resumen del caso completo antes de escribir.
- NO repitas el informe ni las pruebas funcionales.
- NO listes ejercicios todavía.
- Sé empático y claro (3–6 frases + pregunta final).
- Adapta la oferta a la gravedad (ver bloque POST-CONSULT en el mensaje del usuario).

${"" /* AI_READAPTATION_RULES excerpt injected via user context */}`;

const POST_CONSULT_EXERCISE_PLAN_PROMPT = `Eres Physio, asistente de fisioterapia de Kinora.

El paciente respondió SÍ a tu oferta de plan para casa al final de la consulta.

Genera el plan adaptado al caso (ejercicios con [id=…] del catálogo Kinora O autocuidado/reposo/hielo si la lesión no permite ejercicios ahora).

REGLAS:
- Basa TODO en el resumen del caso; no inventes síntomas.
- Lesión grave/urgente → solo autocuidado, sin ejercicios.
- Lesión leve–moderada → plan por fases con [id=…] cuando corresponda.
- No es diagnóstico; cierra con cuándo reevaluar o consultar presencialmente.`;

export function buildPostConsultExerciseSystemPrompt(
  step: "offer" | "plan",
  language: "es" | "en",
): string {
  const base =
    step === "offer"
      ? POST_CONSULT_EXERCISE_OFFER_PROMPT
      : POST_CONSULT_EXERCISE_PLAN_PROMPT;
  if (language === "en") {
    return `${base}\n\nReply entirely in English.`;
  }
  return `${base}\n\nResponde en español.`;
}

export function buildPostConsultExerciseUserMessage(
  step: "offer" | "plan",
  caseSummary: string,
  bodyArea: string,
  language: "es" | "en",
  patientReply?: string,
): string {
  const offerCtx = postConsultExerciseOfferSymptomContext(bodyArea, language);
  const planCtx = postConsultExercisePlanSymptomContext(bodyArea, language);
  const readaptBlock =
    step === "plan"
      ? buildReadaptationPromptBlock(
          patientReply ?? "yes exercise plan",
          bodyArea,
          language,
        )
      : "";

  return [
    `Resumen del caso (orientaciones y seguimiento de esta consulta):\n${caseSummary}`,
    step === "offer" ? offerCtx : planCtx,
    patientReply
      ? language === "en"
        ? `Patient reply: ${patientReply}`
        : `Respuesta del paciente: ${patientReply}`
      : "",
    readaptBlock,
  ]
    .filter(Boolean)
    .join("\n\n");
}
