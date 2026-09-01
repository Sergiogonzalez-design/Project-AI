/**
 * Quick RAG smoke test: verify Physioguide hip modules are retrievable.
 * Usage: node scripts/test-rag-retrieval.mjs "dolor lateral cadera GTPS trendelenburg"
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import OpenAI from "openai";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

function loadEnvLocal() {
  const path = resolve(root, ".env.local");
  if (!existsSync(path)) throw new Error("Missing .env.local");
  const env = {};
  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i < 0) continue;
    let v = t.slice(i + 1).trim();
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    ) {
      v = v.slice(1, -1);
    }
    env[t.slice(0, i).trim()] = v;
  }
  return env;
}

async function match(openai, supabase, text, count) {
  const emb = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text.slice(0, 8000),
  });
  const { data, error } = await supabase.rpc("match_document_chunks", {
    query_embedding: emb.data[0].embedding,
    match_count: count,
    match_threshold: 0.3,
  });
  if (error) throw error;
  return data ?? [];
}

function rankRagChunks(chunks, max = 10) {
  const pg = [];
  const other = [];
  const seen = new Set();
  for (const c of chunks) {
    const key = `${c.source_name ?? ""}::${String(c.content ?? "").slice(0, 80)}`;
    if (seen.has(key)) continue;
    seen.add(key);
    if (String(c.source_name ?? "").startsWith("Physioguide —")) pg.push(c);
    else other.push(c);
  }
  const pgKeep = pg.slice(0, 6);
  const otherKeep = other.slice(0, Math.max(2, max - pgKeep.length));
  return [...pgKeep, ...otherKeep].slice(0, max);
}

async function main() {
  const query = process.argv.slice(2).join(" ") || "dolor lateral cadera GTPS";
  const env = loadEnvLocal();
  const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });
  const supabase = createClient(
    env.NEXT_PUBLIC_SUPABASE_URL || env.EXPO_PUBLIC_SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );

  const primary = await match(openai, supabase, query, 8);
  const pgEmb = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: query.slice(0, 8000),
  });
  const { data: physioguideQ, error: pgErr } = await supabase.rpc(
    "match_document_chunks_prefixed",
    {
      query_embedding: pgEmb.data[0].embedding,
      name_prefix: "Physioguide —",
      match_count: 8,
      match_threshold: 0.25,
    }
  );
  if (pgErr) throw pgErr;
  const ranked = rankRagChunks([...primary, ...(physioguideQ ?? [])], 10);

  console.log(`Query: "${query}" (ranked like production)\n`);
  for (const row of ranked) {
    const sim =
      typeof row.similarity === "number"
        ? `[${(row.similarity * 100).toFixed(1)}%] `
        : "";
    console.log(`- ${sim}${row.source_name}`);
    console.log(`  ${String(row.content).slice(0, 120)}…\n`);
  }

  const physioguide = ranked.filter((r) =>
    String(r.source_name).startsWith("Physioguide —")
  );
  console.log(
    physioguide.length
      ? `✓ ${physioguide.length} Physioguide chunk(s) in ranked results`
      : "⚠ No Physioguide chunks after ranking"
  );
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
