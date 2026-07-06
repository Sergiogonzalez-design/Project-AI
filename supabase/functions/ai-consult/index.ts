import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import OpenAI from "npm:openai@4";

const openai = new OpenAI({ apiKey: Deno.env.get("OPENAI_API_KEY") });

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

type HistoryMessage = { role: "user" | "assistant"; content: string };

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: CORS });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...CORS, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...CORS, "Content-Type": "application/json" },
      });
    }

    const body = await req.json() as {
      bodyArea: string;
      onsetType: string;
      painLevel: number;
      hadTrauma: string;
      description: string;
      conversationHistory?: HistoryMessage[];
    };

    const { bodyArea, onsetType, painLevel, hadTrauma, description, conversationHistory } = body;

    // For follow-up messages, the key question is in onsetType; body area won't be "seguimiento"
    const isFollowUp = bodyArea === "seguimiento";

    const queryText = isFollowUp
      ? onsetType
      : [
          `Zona afectada: ${bodyArea}`,
          `Cómo empezó: ${onsetType}`,
          `Nivel de dolor: ${painLevel}/10`,
          `Traumatismo: ${hadTrauma}`,
          description ? `Información adicional: ${description}` : "",
        ]
          .filter(Boolean)
          .join("\n");

    const { data: profile } = await supabase
      .from("profiles")
      .select(
        "display_name, age, sex, height_cm, weight_kg, dominant_hand, dominant_foot, primary_sport, sport_position, competitive_level, sessions_per_week, hours_per_week, current_season, performance_goals"
      )
      .eq("id", user.id)
      .maybeSingle();

    const athleteContext = profile
      ? [
          profile.display_name ? `Nombre: ${profile.display_name}` : "",
          profile.age ? `Edad: ${profile.age} años` : "",
          profile.sex ? `Sexo: ${profile.sex}` : "",
          profile.height_cm ? `Altura: ${profile.height_cm} cm` : "",
          profile.weight_kg ? `Peso: ${profile.weight_kg} kg` : "",
          profile.dominant_hand ? `Mano dominante: ${profile.dominant_hand}` : "",
          profile.dominant_foot ? `Pie dominante: ${profile.dominant_foot}` : "",
          profile.primary_sport ? `Deporte principal: ${profile.primary_sport}` : "",
          profile.sport_position ? `Posición: ${profile.sport_position}` : "",
          profile.competitive_level ? `Nivel competitivo: ${profile.competitive_level}` : "",
          profile.sessions_per_week != null
            ? `Sesiones de entrenamiento por semana: ${profile.sessions_per_week}`
            : "",
          profile.hours_per_week != null
            ? `Horas de entrenamiento por semana: ${profile.hours_per_week}`
            : "",
          profile.current_season ? `Temporada actual: ${profile.current_season}` : "",
          profile.performance_goals?.length
            ? `Objetivos: ${profile.performance_goals.join(", ")}`
            : "",
        ]
          .filter(Boolean)
          .join("\n")
      : "";

    let context = "";
    if (queryText.length > 10) {
      const embeddingRes = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: queryText,
      });
      const queryEmbedding = embeddingRes.data[0].embedding;

      const { data: chunks } = await supabase.rpc("match_document_chunks", {
        query_embedding: queryEmbedding,
        match_count: 5,
        match_threshold: 0.3,
      });

      if (chunks && chunks.length > 0) {
        context = chunks.map((c: { content: string }) => c.content).join("\n\n---\n\n");
      }
    }

    const systemPrompt = `Eres un asistente de fisioterapia y medicina deportiva para PhysioGuide AI. Tu función es orientar al usuario en español de forma clara, empática y estructurada.

FORMATO OBLIGATORIO para la primera respuesta a un formulario de síntomas — responde SIEMPRE en este orden exacto con estos encabezados en negrita:

**Resumen de tu consulta**
Describe brevemente en 2-3 frases lo que el paciente ha explicado (zona, cómo empezó, nivel de dolor, si hubo traumatismo).

**Posibles causas**
Explica de forma sencilla qué puede haber provocado la lesión o molestia.

**Posibles lesiones**
Menciona las lesiones más probables según los síntomas descritos. No hagas diagnóstico definitivo.

**Qué hacer mientras esperas**
Da consejos prácticos y concretos: reposo, hielo/calor, elevación, medicación básica si aplica, movimientos a evitar, etc.

**¿Necesitas contactar con nuestro fisioterapeuta?**
Pregunta al usuario si quiere que le pongamos en contacto con nuestro fisioterapeuta para una valoración personalizada. Si hay signos de alarma (dolor muy intenso, entumecimiento, deformidad, pérdida de fuerza severa), recomienda atención médica urgente.

REGLAS DE FORMATO:
- Usa ** únicamente para los encabezados de sección, no para resaltar palabras dentro del texto
- Para listas usa guiones (-) nunca asteriscos (*)
- Lenguaje sencillo, no técnico
- En preguntas de seguimiento (conversación), responde de forma natural y directa sin repetir la estructura anterior`;

    // Build messages array: system + conversation history + new user message
    const history: HistoryMessage[] = conversationHistory ?? [];

    const userMessage = isFollowUp
      ? [
          athleteContext ? `Perfil del paciente:\n${athleteContext}` : "",
          queryText,
          context ? `Información relevante de los documentos:\n${context}` : "",
        ]
          .filter(Boolean)
          .join("\n\n")
      : [
          athleteContext ? `Perfil del paciente:\n${athleteContext}` : "",
          `Síntomas actuales:\n${queryText}`,
          context ? `Información relevante de los documentos:\n${context}` : "(No se encontró información específica en documentos. Responde con tus conocimientos generales de fisioterapia.)",
        ]
          .filter(Boolean)
          .join("\n\n");

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        ...history,
        { role: "user", content: userMessage },
      ],
      temperature: 0.3,
      max_tokens: 900,
    });

    const answer = completion.choices[0].message.content ?? "";

    return new Response(
      JSON.stringify({ answer }),
      { headers: { ...CORS, "Content-Type": "application/json" } }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...CORS, "Content-Type": "application/json" },
    });
  }
});
