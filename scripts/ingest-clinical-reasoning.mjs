/**
 * Ingest Physioguide clinical-reasoning markdown modules → document_chunks (RAG).
 * Uses .env.local (OPENAI_API_KEY, NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY).
 *
 * Usage:
 *   node scripts/ingest-clinical-reasoning.mjs
 *   node scripts/ingest-clinical-reasoning.mjs hip-lateral-pain.md
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync, readdirSync } from "fs";
import { resolve, dirname, basename } from "path";
import { fileURLToPath } from "url";
import OpenAI from "openai";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const CR_DIR = resolve(root, "knowledge", "clinical-reasoning");
const EV_DIR = resolve(root, "knowledge", "evidence");

const CHUNK_SIZE = 150;
const CHUNK_OVERLAP = 20;
const EMBED_BATCH = 50;

/** Stable source_name titles (searchable in RAG + Admin Conocimientos). */
const MODULE_SOURCES = {
  "hip-groin-doha.md": "Physioguide — Cadera — ingle Doha + hip-related",
  "hip-lateral-pain.md": "Physioguide — Cadera — dolor lateral / GTPS",
  "hip-posterior-pain.md": "Physioguide — Cadera — dolor posterior / isquio / glúteo",
  "hip-traumatic.md": "Physioguide — Cadera — trauma y pelvis aguda",
  "hip-master-integration.md": "Physioguide — Cadera — integración maestro hip/groin",
  "knee-anterior-pain.md": "Physioguide — Rodilla — dolor anterior / PFPS / tendón rotuliano",
  "knee-medial-pain.md": "Physioguide — Rodilla — dolor medial / LCM / menisco / pes anserino",
  "knee-lateral-pain.md": "Physioguide — Rodilla — dolor lateral / LCL / menisco / ITB",
  "knee-instability-acl.md": "Physioguide — Rodilla — inestabilidad / LCA / LCP",
  "knee-master-integration.md": "Physioguide — Rodilla — integración maestro",
  "shoulder-master-integration.md": "Physioguide — Hombro — integración maestro",
  "shoulder-lateral-rcrsp.md": "Physioguide — Hombro — lateral / RCRSP / manguito",
  "shoulder-anterior-pain.md": "Physioguide — Hombro — dolor anterior / bíceps",
  "shoulder-superior-ac.md": "Physioguide — Hombro — superior / AC",
  "shoulder-instability-trauma.md": "Physioguide — Hombro — inestabilidad / trauma",
  "shoulder-posterior-instability.md": "Physioguide — Hombro — inestabilidad posterior",
  "shoulder-slap-labrum-screen.md": "Physioguide — Hombro — screening SLAP/labrum",
  "ankle-foot-master-integration.md": "Physioguide — Tobillo/pie — integración maestro",
  "ankle-lateral-sprain.md": "Physioguide — Tobillo — esguince lateral / sindesmosis",
  "ankle-achilles.md": "Physioguide — Tobillo — Aquiles (rotura / tendinopatía)",
  "foot-plantar-heel.md": "Physioguide — Pie — fasciopatía / talón / S1",
  "ankle-trauma-ottawa.md": "Physioguide — Tobillo/pie — trauma / Ottawa",
  "elbow-wrist-master-integration.md": "Physioguide — Codo/muñeca — integración maestro",
  "elbow-epicondylalgia.md": "Physioguide — Codo — epicondilalgia lateral/medial",
  "elbow-wrist-neural.md": "Physioguide — Codo/muñeca — neural STC/cubital/cervical",
  "elbow-distal-biceps.md": "Physioguide — Codo — bíceps distal",
  "elbow-distal-triceps.md": "Physioguide — Codo — tríceps distal",
  "elbow-plri.md": "Physioguide — Codo — PLRI / inestabilidad posterolateral",
  "elbow-radial-tunnel.md": "Physioguide — Codo — túnel radial / PIN vs LET",
  "elbow-ucl-medial.md": "Physioguide — Codo — UCL medial / lanzadores",
  "elbow-wrist-guyon.md": "Physioguide — Codo/muñeca — Guyon vs túnel cubital",
  "elbow-wrist-hand-differentials.md": "Physioguide — Codo/muñeca/mano — diferenciales finos",
  "wrist-dequervain.md": "Physioguide — Muñeca — De Quervain",
  "wrist-trauma-scaphoid.md": "Physioguide — Muñeca — trauma / escafoides",
  "wrist-tfcc-ulnar.md": "Physioguide — Muñeca — TFCC / dolor cubital",
  "wrist-druj.md": "Physioguide — Muñeca — DRUJ",
  "wrist-carpal-instability.md": "Physioguide — Muñeca — inestabilidad carpiana SL/LT",
  "spine-master-integration.md": "Physioguide — Raquis — integración maestro cervical/lumbar",
  "cervical-neck-pain.md": "Physioguide — Cervical — mecánico / radiculopatía",
  "cervical-trauma-redflags.md": "Physioguide — Cervical — trauma / red flags",
  "lumbar-back-pain.md": "Physioguide — Lumbar — mecánico / ciática",
  "lumbar-redflags-inflammatory.md": "Physioguide — Lumbar — cauda / inflamatorio",
  "global-cross-region-integration.md": "Physioguide — Global — integración cross-region",
  "finger-digital-pain.md": "Physioguide — Dedos — dolor digital / STC vs local",
  "head-headache-master.md": "Physioguide — Cabeza — cefalea maestro (SNOOP / cervicogénica / primaria)",
  "hip-tests.md": "Physioguide — Evidencia — tests de cadera",
  "knee-tests.md": "Physioguide — Evidencia — tests de rodilla",
  "clusters-hip-knee.md": "Physioguide — Evidencia — clusters cadera y rodilla",
  "shoulder-tests.md": "Physioguide — Evidencia — tests de hombro",
  "clusters-shoulder.md": "Physioguide — Evidencia — clusters de hombro",
  "spine-tests.md": "Physioguide — Evidencia — tests de raquis (cervical/lumbar)",
  "clusters-spine.md": "Physioguide — Evidencia — clusters de raquis",
  "ankle-foot-tests.md": "Physioguide — Evidencia — tests de tobillo y pie",
  "clusters-ankle-foot.md": "Physioguide — Evidencia — clusters tobillo y pie",
  "elbow-wrist-tests.md": "Physioguide — Evidencia — tests de codo y muñeca",
  "elbow-wrist-tests-expansion.md": "Physioguide — Evidencia — tests codo/muñeca/mano (expansión)",
  "clusters-elbow-wrist.md": "Physioguide — Evidencia — clusters codo y muñeca",
  "clusters-elbow-wrist-hand-tiers.md": "Physioguide — Evidencia — clusters codo/muñeca/mano (tiers A–C)",
  "finger-hand-tests.md": "Physioguide — Evidencia — tests de dedos y mano",
  "clusters-finger-hand.md": "Physioguide — Evidencia — clusters dedos y mano",
  "head-tests.md": "Physioguide — Evidencia — tests de cabeza / cefalea",
  "clusters-head.md": "Physioguide — Evidencia — clusters cefalea",
  "hypothesis-exploration-mode.md": "Physioguide — Razonamiento — modo exploración de hipótesis",
  "mtrp-framework.md": "Physioguide — Miofascial — marco MTrP y controversia",
  "shoulder-lateral-referred-differential.md": "Physioguide — Hombro — lateral referido / tests negativos (pilot)",
  "negative-test-reasoning.md": "Physioguide — Evidencia — qué significa una prueba negativa",
  "referred-pain-shoulder-lateral.md": "Physioguide — Referido — dolor lateral de hombro",
  "referred-pain-cervical.md": "Physioguide — Referido — cervical",
  "referred-pain-lumbar.md": "Physioguide — Referido — lumbar",
  "referred-pain-hip.md": "Physioguide — Referido — cadera / ingle / glúteo",
  "referred-pain-knee.md": "Physioguide — Referido — rodilla",
  "referred-pain-ankle-foot.md": "Physioguide — Referido — tobillo / pie",
  "referred-pain-elbow-wrist.md": "Physioguide — Referido — codo / muñeca / mano",
  "referred-pain-head.md": "Physioguide — Referido — cabeza / cefalea",
  "referred-pain-thoracic.md": "Physioguide — Referido — torácica / costillas / escápula",
  "referred-pain-sources.md": "Physioguide — Evidencia — fuentes ancla de la biblioteca de referido",
  "clarity-and-no-overdiagnosis.md": "Physioguide — Razonamiento — claridad y no sobrediagnóstico",
  "persistence-reevaluation.md": "Physioguide — Razonamiento — persistencia y reevaluación",
  "no-imaging-decision.md": "Physioguide — Razonamiento — decisión sin imagen",
  "differential-matrices-by-location.md": "Physioguide — Razonamiento — matrices diferenciales por localización",
  "mtrp-muscle-atlas.md": "Physioguide — Miofascial — atlas muscular por región",
  "evidence-levels-A-D.md": "Physioguide — Evidencia — niveles A–D",
  "test-reliability-framework.md": "Physioguide — Evidencia — marco de fiabilidad de pruebas",
  "readaptation-master.md": "Physioguide — Evidencia — readaptación marco maestro",
  "readaptation-protocols-upper.md": "Physioguide — Evidencia — readaptación miembro superior",
  "readaptation-protocols-lower.md": "Physioguide — Evidencia — readaptación miembro inferior",
  "readaptation-protocols-spine-core.md": "Physioguide — Evidencia — readaptación raquis y core",
};

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

function batch(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

function sourceNameForFile(filename) {
  return (
    MODULE_SOURCES[filename] ??
    `Physioguide — ${basename(filename, ".md").replace(/-/g, " ")}`
  );
}

function resolveModulePath(filename) {
  const inCr = resolve(CR_DIR, filename);
  if (existsSync(inCr)) return inCr;
  const inEv = resolve(EV_DIR, filename);
  if (existsSync(inEv)) return inEv;
  return null;
}

function prepareText(filename, raw) {
  const source = sourceNameForFile(filename);
  const isEvidence = filename.includes("test") || filename.includes("cluster");
  const header = [
    `# ${source}`,
    isEvidence
      ? "Physioguide Fase 3 evidence DB. No inventar Sn/Sp. Cluster > test aislado."
      : "Physioguide clinical reasoning module.",
    "Uso: consulta paciente, chat fisioterapeuta (Physio), informe pre-visita.",
    "",
  ].join("\n");
  return `${header}${raw.trim()}\n`;
}

async function ingestFile(supabase, openai, filename) {
  const filePath = resolveModulePath(filename);
  if (!filePath) throw new Error(`File not found: ${filename}`);

  const sourceName = sourceNameForFile(filename);
  const text = prepareText(filename, readFileSync(filePath, "utf8"));
  const chunks = chunkText(text);
  if (!chunks.length) throw new Error(`No chunks for ${filename}`);

  const { count: existing } = await supabase
    .from("document_chunks")
    .select("id", { count: "exact", head: true })
    .eq("source_name", sourceName);

  if (existing && existing > 0) {
    console.log(`  Removing ${existing} existing chunks for "${sourceName}"…`);
    const { error: delErr } = await supabase
      .from("document_chunks")
      .delete()
      .eq("source_name", sourceName);
    if (delErr) throw delErr;
  }

  let inserted = 0;
  for (const [bi, batchChunks] of batch(chunks, EMBED_BATCH).entries()) {
    console.log(
      `  Embedding batch ${bi + 1}/${Math.ceil(chunks.length / EMBED_BATCH)} (${batchChunks.length} chunks)…`
    );
    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: batchChunks,
    });
    const rows = embeddingResponse.data.map((e, i) => ({
      source_name: sourceName,
      content: batchChunks[i],
      embedding: e.embedding,
    }));
    const { error } = await supabase.from("document_chunks").insert(rows);
    if (error) throw error;
    inserted += rows.length;
  }

  console.log(`  ✓ ${sourceName}: ${inserted} chunks`);
  return inserted;
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
  if (!existsSync(CR_DIR)) throw new Error(`Missing directory: ${CR_DIR}`);

  const argFiles = process.argv.slice(2).filter((a) => a.endsWith(".md"));
  const files =
    argFiles.length > 0
      ? argFiles
      : [
          ...readdirSync(CR_DIR).filter((f) => f.endsWith(".md")),
          ...(existsSync(EV_DIR)
            ? readdirSync(EV_DIR).filter((f) => f.endsWith(".md") && f !== "README.md")
            : []),
        ];

  if (!files.length) throw new Error("No .md modules found");

  const openai = new OpenAI({ apiKey: openaiKey });
  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  console.log(`Ingesting ${files.length} module(s) from knowledge/…\n`);
  let total = 0;
  for (const file of files) {
    total += await ingestFile(supabase, openai, file);
  }
  console.log(`\nDone. Inserted ${total} chunks total.`);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
