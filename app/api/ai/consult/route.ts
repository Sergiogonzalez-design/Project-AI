import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { formatAthleteProfileContext } from "@/lib/format-athlete-profile";
import {
  AI_DATA_FIDELITY_RULES,
  AI_EVIDENCE_AND_SEVERITY_RULES,
  AI_PATIENT_RESPONSE_EMOJI_RULES,
  appendSourcesFooter,
  formatRagContext,
  type RagChunk,
} from "@/lib/ai-consult-rules";
import { buildFunctionalQuestionsPromptBlock } from "@/lib/consulta-functional-tests";
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
    symptomContext?: string;
  };

  const queryText = [
    `Zona afectada: ${body.bodyArea}`,
    `Cómo empezó: ${body.onsetType}`,
    `Nivel de dolor: ${body.painLevel}/10`,
    `Traumatismo: ${body.hadTrauma}`,
    body.description ? `Información adicional: ${body.description}` : "",
    body.symptomContext ? `Detalles del caso:\n${body.symptomContext}` : "",
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

  const athleteContext = formatAthleteProfileContext(profile);

  const embeddingResponse = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: queryText,
  });
  const queryEmbedding = embeddingResponse.data[0].embedding;

  const { data: chunks, error: matchError } = await supabase.rpc(
    "match_document_chunks",
    {
      query_embedding: queryEmbedding,
      match_count: 8,
      match_threshold: 0.3,
    }
  );

  if (matchError) {
    return NextResponse.json({ error: matchError.message }, { status: 500 });
  }

  const physioguideEmbedding = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: queryText.slice(0, 8000),
  });
  const { data: physioguideChunks } = await supabase.rpc(
    "match_document_chunks_prefixed",
    {
      query_embedding: physioguideEmbedding.data[0].embedding,
      name_prefix: "Physioguide —",
      match_count: 8,
      match_threshold: 0.25,
    }
  );

  const functionalEmbedding = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: `${body.bodyArea} Physioguide Functional Assessment Special Tests valoración funcional`,
  });
  const { data: functionalChunks } = await supabase.rpc("match_document_chunks", {
    query_embedding: functionalEmbedding.data[0].embedding,
    match_count: 4,
    match_threshold: 0.3,
  });

  const merged = new Map<string, RagChunk>();
  for (const c of [
    ...(chunks ?? []),
    ...(physioguideChunks ?? []),
    ...(functionalChunks ?? []),
  ] as RagChunk[]) {
    const key = `${c.source_name ?? ""}::${(c.content ?? "").slice(0, 80)}`;
    if (!merged.has(key)) merged.set(key, c);
  }
  const { context, sources } = formatRagContext([...merged.values()]);

  const systemPrompt = `Eres un asistente de fisioterapia y medicina deportiva para Kinora. Orientas al usuario en español con claridad, empatía y detalle moderado.

IMPORTANTE: NO emites diagnósticos definitivos.
CRÍTICO — DIFERENCIACIÓN KINORA: si el caso NO es urgente, la respuesta está incompleta sin la sección **Pruebas funcionales**. Incluye 3–6 pruebas concretas de la zona (del banco/protocolo inyectado), cada una como pregunta SÍ/NO. Frase introductoria: «Haz estas pruebas y pulsa Sí o No en cada una». NO pidas texto libre, escalas 1–10 ni comparar lados. Escribe cada prueba como pregunta cotidiana de movimiento (p. ej. ¿duele al elevar el brazo por encima de la cabeza?). NUNCA uses «Test de…» ni nombres clínicos (Neer, Hawkins, Spurling, etc.).

${AI_EVIDENCE_AND_SEVERITY_RULES}

${AI_DATA_FIDELITY_RULES}

${AI_PATIENT_RESPONSE_EMOJI_RULES}`;

  const userMessage = [
    `Síntomas actuales:\n${queryText}`,
    athleteContext ? athleteContext : "",
    context
      ? `Información relevante de los documentos:\n${context}`
      : "(No se encontró información específica en la base de conocimientos. Responde con tus conocimientos generales de fisioterapia.)",
    buildFunctionalQuestionsPromptBlock(body.bodyArea),
  ]
    .filter(Boolean)
    .join("\n\n");

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage },
    ],
    temperature: 0.3,
    max_tokens: 1700,
  });

  const answer = appendSourcesFooter(
    completion.choices[0].message.content ?? "",
    sources
  );

  return NextResponse.json({
    answer,
    sourcesUsed: sources.length,
    sources,
  });
}
