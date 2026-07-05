import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { getSupabasePublishableKey, getSupabaseUrl } from "@/lib/supabase/env";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    getSupabaseUrl(),
    getSupabasePublishableKey(),
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (toSet) =>
          toSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          ),
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json() as {
    bodyArea: string;
    onsetType: string;
    painLevel: number;
    hadTrauma: string;
    description: string;
  };

  const queryText = [
    `Zona afectada: ${body.bodyArea}`,
    `Cómo empezó: ${body.onsetType}`,
    `Nivel de dolor: ${body.painLevel}/10`,
    `Traumatismo: ${body.hadTrauma}`,
    body.description ? `Información adicional: ${body.description}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const embeddingResponse = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: queryText,
  });
  const queryEmbedding = embeddingResponse.data[0].embedding;

  const { data: chunks, error: matchError } = await supabase.rpc(
    "match_document_chunks",
    {
      query_embedding: queryEmbedding,
      match_count: 5,
      match_threshold: 0.3,
    }
  );

  if (matchError) {
    return NextResponse.json({ error: matchError.message }, { status: 500 });
  }

  const context =
    chunks && chunks.length > 0
      ? chunks.map((c: { content: string }) => c.content).join("\n\n---\n\n")
      : "";

  const systemPrompt = `Eres un asistente de fisioterapia y medicina deportiva para PhysioGuide AI. Tu función es orientar al usuario en español de forma clara, empática y estructurada.

FORMATO OBLIGATORIO — responde SIEMPRE en este orden exacto con estos encabezados en negrita:

**Resumen de tu consulta**
Describe brevemente en 2-3 frases lo que el paciente ha explicado (zona, cómo empezó, nivel de dolor, si hubo traumatismo).

**Posibles causas**
Explica de forma sencilla qué puede haber provocado la lesión o molestia.

**Posibles lesiones**
Menciona las lesiones más probables según los síntomas descritos. No hagas diagnóstico definitivo.

**Qué hacer mientras esperas**
Da consejos prácticos y concretos: reposo, hielo/calor, elevación, medicación básica si aplica, movimientos a evitar, etc.

**¿Necesitas contactar con nuestro fisioterapeuta?**
Pregunta al usuario si quiere que le pongamos en contacto con nuestro fisioterapeuta para una valoración personalizada. Si hay signos de alarma, recomienda atención médica urgente.

REGLAS DE FORMATO:
- Usa ** únicamente para los encabezados de sección, no para resaltar palabras dentro del texto
- Para listas usa guiones (-) nunca asteriscos (*)
- Lenguaje sencillo, no técnico`;

  const userMessage = context
    ? `El usuario tiene los siguientes síntomas:\n${queryText}\n\nInformación relevante de los documentos:\n${context}`
    : `El usuario tiene los siguientes síntomas:\n${queryText}\n\n(No se encontró información específica en la base de conocimientos. Responde con tus conocimientos generales de fisioterapia.)`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage },
    ],
    temperature: 0.3,
    max_tokens: 900,
  });

  const answer = completion.choices[0].message.content ?? "";

  return NextResponse.json({
    answer,
    sourcesUsed: chunks?.length ?? 0,
  });
}
