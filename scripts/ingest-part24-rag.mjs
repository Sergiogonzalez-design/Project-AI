/**
 * One-shot: extract Part 24 PDF text → chunk → embed → insert document_chunks.
 * Uses .env.local (OPENAI_API_KEY, NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY).
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import OpenAI from "openai";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const SOURCE =
  "Kinora_Foot_Ankle_Assessment_Dossier_AI_Orientation.pdf";
const PDF_PATH = resolve(root, "knowledge", SOURCE);
const CHUNK_SIZE = 150;
const CHUNK_OVERLAP = 20;
const EMBED_BATCH = 50;

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

function chunkText(text) {
  const words = text.split(/\s+/).filter(Boolean);
  const chunks = [];
  let i = 0;
  while (i < words.length) {
    const chunk = words.slice(i, i + CHUNK_SIZE).join(" ");
    if (chunk.trim()) chunks.push(chunk.trim());
    i += CHUNK_SIZE - CHUNK_OVERLAP;
  }
  return chunks;
}

async function extractPdfText(pdfPath) {
  const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.mjs");
  const data = new Uint8Array(readFileSync(pdfPath));
  const pdf = await pdfjsLib.getDocument({ data, useSystemFonts: true }).promise;
  const pages = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    pages.push(
      content.items.map((item) => ("str" in item ? item.str : "")).join(" ")
    );
  }
  return pages.join("\n\n");
}

function batch(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

async function main() {
  const env = loadEnvLocal();
  const openaiKey = env.OPENAI_API_KEY;
  const supabaseUrl =
    env.NEXT_PUBLIC_SUPABASE_URL || env.EXPO_PUBLIC_SUPABASE_URL;
  const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;
  if (!openaiKey) throw new Error("OPENAI_API_KEY missing in .env.local");
  if (!supabaseUrl) throw new Error("NEXT_PUBLIC_SUPABASE_URL missing");
  if (!serviceKey) throw new Error("SUPABASE_SERVICE_ROLE_KEY missing");
  if (!existsSync(PDF_PATH)) throw new Error(`PDF not found: ${PDF_PATH}`);

  console.log(`Extracting text from ${SOURCE}…`);
  const text = await extractPdfText(PDF_PATH);
  console.log(`Extracted ${text.length} chars`);
  const chunks = chunkText(text);
  if (!chunks.length) throw new Error("No chunks produced");
  console.log(`Chunks: ${chunks.length}`);

  const openai = new OpenAI({ apiKey: openaiKey });
  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { count: existing } = await supabase
    .from("document_chunks")
    .select("id", { count: "exact", head: true })
    .eq("source_name", SOURCE);
  if (existing && existing > 0) {
    console.log(`Removing ${existing} existing chunks for this source…`);
    const { error: delErr } = await supabase
      .from("document_chunks")
      .delete()
      .eq("source_name", SOURCE);
    if (delErr) throw delErr;
  }

  let inserted = 0;
  for (const [bi, batchChunks] of batch(chunks, EMBED_BATCH).entries()) {
    console.log(
      `Embedding batch ${bi + 1}/${Math.ceil(chunks.length / EMBED_BATCH)}…`
    );
    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: batchChunks,
    });
    const rows = embeddingResponse.data.map((e, i) => ({
      source_name: SOURCE,
      content: batchChunks[i],
      embedding: e.embedding,
    }));
    const { error } = await supabase.from("document_chunks").insert(rows);
    if (error) throw error;
    inserted += rows.length;
  }

  console.log(`Done. Inserted ${inserted} chunks as "${SOURCE}".`);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
