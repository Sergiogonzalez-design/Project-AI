/**
 * Remove junk / duplicate sources from document_chunks (RAG knowledge base).
 * Uses .env.local SUPABASE_SERVICE_ROLE_KEY.
 *
 * Usage: node scripts/cleanup-knowledge-junk.mjs
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

/** Entire sources to delete (failed scrapes, reCAPTCHA titles, duplicates). */
const DELETE_SOURCES = [
  // Failed URL scrapes
  "Checking your browser - reCAPTCHA — pmc.ncbi.nlm.nih.gov",
  "Checking your browser - reCAPTCHA — pubmed.ncbi.nlm.nih.gov",
  "NCBI - WWW Error Blocked Diagnostic — pubmed.ncbi.nlm.nih.gov",
  "NCBI - WWW Error Blocked Diagnostic — www.ncbi.nlm.nih.gov",
  "Orthopedic Physical Assessment - David J. Magee - Google Libros — books.google.hn",
  "Research for Your Most Important Health Purchases — www.innerbody.com",

  // Duplicate re-uploads (canonical version kept with more / cleaner title)
  "ADDUCTOR-RELATED GROIN PAIN (dolor inguinal relacionado con los aductores).",
  "ADDUCTOR-RELATED GROIN PAIN / ADDUCTOR TENDINOPATHY.",
  "ILIOPSOAS-RELATED GROIN PAIN (dolor inguinal relacionado con el iliopsoas).",
  "ILIOPSOAS-RELATED GROIN PAIN / INTERNAL SNAPPING HIP.",
  "ILIOPSOAS-RELATED GROIN PAIN,",
  "INGUINAL-RELATED GROIN PAIN,",
  "INGUINAL-RELATED GROIN PAIN.",
  "PUBIC-RELATED GROIN PAIN (dolor inguinal relacionado con el pubis)",
  "PUBIC-RELATED GROIN PAIN,",
  "PUBIC-RELATED GROIN PAIN.",
  "HIP-RELATED GROIN PAIN, empezando por FEMOROACETABULAR IMPINGEMENT (FAI) SYNDROME.",
  "HIP-RELATED GROIN PAIN.",
  "Kinora_Cadera_GTPS_Tendinopatia_Glutea_Fase_3(1).pdf",
  "Kinora_Exercise_Library_AI_Orientation (1).pdf",
  "Kinora_Red_Flags_Master_AI_Orientation (1).pdf",

  // Meta / instructions — not clinical content for RAG
  "¿QUÉ HACEMOS CON VUESTROS 3 TEST?",
  "AÑADIR NEUROLOGÍA",
  "Arquitectura final",
  "Como guardarlo en la base de datos",
  "Conclusión importante",
  "EL CLUSTER",
  "EL CLUSTER QUE DEBEMOS GUARDAR",
  "ESTRUCTURA DEFINITIVA DE CADA TEST",
  "FASE 2: evidencia científica",
  "LA PARTE MÁS IMPORTANTE: CÓMO DEBE GUARDARSE EN LA IA",
  "LOS 3 TESTS DEL CATÁLOGO",
  "LOS 4 ELEMENTOS CLAVE",
  "MOTOR DE RAZONAMIENTO CLÍNICO — ESTRUCTURA MAESTRA",
  "Para cada patología tendremos algo así:",
  "PARA LA BASE",
  "RESUMEN PARA LA BASE DE DATOS",
  "RESUMEN PARA PHYSIOGUIDE",
  "Resumen para la base de datos",
  "Segunda Instruccion",
  "Y AQUÍ ESTÁ LA PARTE MÁS IMPORTANTE",
  "CLÚSTERES: TRES NIVELES",
  "Lo más potente de este bloque",
  "Regla fundamental",
  "Regla Importante",
];

/** Delete individual chunks matching junk content (even inside otherwise good sources). */
const JUNK_CONTENT_PATTERNS = [
  "checking your browser",
  "click here if you are not automatically redirected",
  "blocked diagnostic",
  "recaptcha",
  "ncbi error access denied",
  "access to the ncbi website",
];

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

async function countBySource(supabase, sourceName) {
  const { count } = await supabase
    .from("document_chunks")
    .select("id", { count: "exact", head: true })
    .eq("source_name", sourceName);
  return count ?? 0;
}

async function deleteBySource(supabase, sourceName) {
  const { error, count } = await supabase
    .from("document_chunks")
    .delete({ count: "exact" })
    .eq("source_name", sourceName);
  if (error) throw error;
  return count ?? 0;
}

async function deleteJunkContentChunks(supabase) {
  let total = 0;
  for (const pattern of JUNK_CONTENT_PATTERNS) {
    const { error, count } = await supabase
      .from("document_chunks")
      .delete({ count: "exact" })
      .ilike("content", `%${pattern}%`);
    if (error) throw error;
    if (count) {
      console.log(`  Junk content "${pattern}": ${count} chunks`);
      total += count;
    }
  }
  return total;
}

/** PMC page shell without article body. */
async function deletePmcShellChunks(supabase) {
  const { error, count } = await supabase
    .from("document_chunks")
    .delete({ count: "exact" })
    .ilike("content", "%Cite Collections Permalink%");
  if (error) throw error;
  return count ?? 0;
}

async function main() {
  const env = loadEnvLocal();
  const supabaseUrl =
    env.NEXT_PUBLIC_SUPABASE_URL || env.EXPO_PUBLIC_SUPABASE_URL;
  const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) throw new Error("Missing Supabase env");

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { count: beforeTotal } = await supabase
    .from("document_chunks")
    .select("id", { count: "exact", head: true });

  console.log(`Chunks before cleanup: ${beforeTotal}\n`);

  console.log("1) Deleting junk content patterns across all sources…");
  const junkContentDeleted = await deleteJunkContentChunks(supabase);

  console.log("\n2) Deleting PMC page-shell chunks (Permalink/Collections only)…");
  const pmcShellDeleted = await deletePmcShellChunks(supabase);
  console.log(`  PMC shell chunks: ${pmcShellDeleted}`);

  console.log("\n3) Deleting junk / duplicate / meta sources by name…");
  let sourcesDeleted = 0;
  for (const source of DELETE_SOURCES) {
    const n = await countBySource(supabase, source);
    if (n === 0) continue;
    const deleted = await deleteBySource(supabase, source);
    console.log(`  ✗ ${source} (${deleted} chunks)`);
    sourcesDeleted += deleted;
  }

  const { count: afterTotal } = await supabase
    .from("document_chunks")
    .select("id", { count: "exact", head: true });

  const { count: sourceCount } = await supabase
    .from("document_chunks")
    .select("source_name", { count: "exact", head: true });

  console.log("\n--- Summary ---");
  console.log(`Junk content chunks removed: ${junkContentDeleted}`);
  console.log(`PMC shell chunks removed: ${pmcShellDeleted}`);
  console.log(`Named sources removed: ${sourcesDeleted}`);
  console.log(
    `Total chunks removed: ${(beforeTotal ?? 0) - (afterTotal ?? 0)}`
  );
  console.log(`Chunks remaining: ${afterTotal}`);
  console.log(`Distinct sources remaining: ${sourceCount}`);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
