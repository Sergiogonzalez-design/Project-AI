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
      symptomContext?: string;
      conversationHistory?: HistoryMessage[];
    };

    const { bodyArea, onsetType, painLevel, hadTrauma, description, symptomContext, conversationHistory } = body;

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
          symptomContext ? `Detalles del caso:\n${symptomContext}` : "",
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

    const initialSystemPrompt = `Eres un asistente de fisioterapia y medicina deportiva para PhysioGuide AI. Orientas al usuario en español con claridad, empatía y detalle moderado (respuestas completas pero no excesivamente largas: aprox. 450-700 palabras).

IMPORTANTE: NO emites diagnósticos definitivos. Usas las variables clínicas para estimar estructuras afectadas, posibles lesiones (con confianza alta/media/baja), gravedad y el siguiente paso adecuado.

FORMATO OBLIGATORIO — responde SIEMPRE en este orden con estos encabezados en negrita:

**Resumen de tu consulta**
2-4 frases con lo esencial (zona, mecanismo, evolución, intensidad, limitación). Si hay banderas rojas o PRIORIDAD ALTA, destácalo al inicio.

**Estructuras que podrían estar afectadas**
Lista estructuras anatómicas posiblemente implicadas con confianza (alta/media/baja) para cada una.

**Posibles lesiones (orientativas)**
Lesiones compatibles con el cuadro, con nivel de confianza. Sin diagnóstico definitivo.

**Qué hacer mientras tanto**
Consejos prácticos concretos: reposo relativo, hielo/calor, movimientos a evitar, ergonomía, etc.

**Qué debes hacer ahora**
Sección FINAL y la más importante. Indica con claridad qué debe hacer el paciente:
- Si debe ir a urgencias, médico, fisioterapeuta o puede autocuidarse
- Plazo recomendado (hoy, en 48-72 h, si empeora...)
- Qué señales de alarma vigilar
- Si puede entrenar o debe parar
Sé específico y accionable, como si le dijeras "esto es lo que yo haría en tu situación".

**¿Necesitas contactar con nuestro fisioterapeuta?**
Pregunta si quiere valoración personalizada. Si hay banderas rojas, insiste en atención médica urgente.

REGLAS:
- Usa todo el contexto clínico del cuestionario
- Lenguaje sencillo, tono cercano
- Usa ** solo para encabezados; listas con guiones (-)`;

    const followUpSystemPrompt = `Eres un asistente de fisioterapia para PhysioGuide AI. Estás en una conversación de SEGUIMIENTO: el paciente ya recibió una valoración inicial estructurada.

REGLAS ESTRICTAS PARA ESTE MENSAJE:
- Responde SOLO a la pregunta concreta del paciente en este turno
- NO repitas el informe completo ni vuelvas a usar todas las secciones de la primera respuesta
- NO reescribas el "Resumen de tu consulta" salvo que lo pidan explícitamente
- Usa el historial de chat para mantener coherencia con lo ya dicho
- Sé directo, empático y específico (normalmente 4-10 frases; más solo si la pregunta lo requiere)
- Si preguntan qué hacer, adónde ir o si preocuparse: responde con pasos claros (urgencias / médico / fisioterapeuta / autocuidado) y cuándo
- Puedes usar un encabezado **Qué debes hacer ahora** si la pregunta es sobre acciones concretas
- NO emitas diagnóstico definitivo
- No uses formato de informe completo con todas las secciones`;

    const systemPrompt = isFollowUp ? followUpSystemPrompt : initialSystemPrompt;

    // Build messages array: system + conversation history + new user message
    const history: HistoryMessage[] = conversationHistory ?? [];

    const userMessage = isFollowUp
      ? [
          context ? `Información de referencia:\n${context}` : "",
          `Pregunta del paciente: ${onsetType}`,
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
      temperature: isFollowUp ? 0.4 : 0.3,
      max_tokens: isFollowUp ? 700 : 1200,
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
