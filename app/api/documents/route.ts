import { createServerClient } from "@supabase/ssr";
import { createClient as createSupabaseAdmin } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getOpenAI } from "@/lib/openai";
import { getSupabasePublishableKey, getSupabaseUrl } from "@/lib/supabase/env";

// Increase body size limit for large chunk batches
export const maxDuration = 60;

function batch<T>(arr: T[], size: number): T[][] {
  const batches: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    batches.push(arr.slice(i, i + size));
  }
  return batches;
}

export async function POST(request: NextRequest) {
  try {
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

    const admin = await requireAdmin(supabase);
    if (!admin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
    if (!serviceKey) {
      return NextResponse.json(
        { error: "Service role not configured for knowledge ingest." },
        { status: 503 }
      );
    }
    const adminDb = createSupabaseAdmin(getSupabaseUrl(), serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const openai = getOpenAI();
    const body = await request.json() as { chunks: string[]; sourceName: string };
    const { chunks, sourceName } = body;

    if (!chunks?.length || !sourceName) {
      return NextResponse.json({ error: "Missing chunks or sourceName" }, { status: 400 });
    }

    // Process in batches of 50 to stay within OpenAI + Supabase limits
    const rows: { source_name: string; content: string; embedding: number[] }[] = [];
    for (const batchChunks of batch(chunks, 50)) {
      const embeddingResponse = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: batchChunks,
      });
      embeddingResponse.data.forEach((e, i) => {
        rows.push({ source_name: sourceName, content: batchChunks[i], embedding: e.embedding });
      });
    }

    const { error } = await adminDb.from("document_chunks").insert(rows);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ inserted: rows.length });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
