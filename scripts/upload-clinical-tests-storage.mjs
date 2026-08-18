/**
 * Upload clinical-test media from public/clinical-tests to Supabase Storage.
 * Usage:
 *   node scripts/upload-clinical-tests-storage.mjs
 *   node scripts/upload-clinical-tests-storage.mjs --only faber.mp4,cozen.mp4
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync, readdirSync, existsSync } from "fs";
import { join, relative } from "path";
import { fileURLToPath } from "url";

const root = join(fileURLToPath(import.meta.url), "..", "..");
const envPath = join(root, ".env.local");

function loadEnv() {
  if (!existsSync(envPath)) throw new Error("Missing .env.local");
  const env = {};
  for (const line of readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const m = /^([A-Z0-9_]+)=(.*)$/.exec(line.trim());
    if (!m) continue;
    env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
  return env;
}

const env = loadEnv();
const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) throw new Error("Need NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY");

const supabase = createClient(url, key, { auth: { persistSession: false } });
const localRoot = join(root, "public", "clinical-tests");
const bucket = "clinical-tests";

const onlyArg = process.argv.find((a) => a.startsWith("--only="));
const only = onlyArg
  ? new Set(
      onlyArg
        .slice("--only=".length)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    )
  : null;

function collectFiles(dir) {
  const out = [];
  for (const name of readdirSync(dir, { withFileTypes: true })) {
    if (name.name.startsWith(".")) continue;
    const full = join(dir, name.name);
    if (name.isDirectory()) out.push(...collectFiles(full));
    else if (/\.(mp4|webp|png|jpe?g)$/i.test(name.name)) out.push(full);
  }
  return out;
}

const files = collectFiles(localRoot).filter((full) => {
  if (!only) return true;
  const rel = relative(localRoot, full).replace(/\\/g, "/");
  return only.has(rel) || only.has(rel.split("/").pop());
});

if (!files.length) {
  console.error("No files to upload");
  process.exit(1);
}

let ok = 0;
let fail = 0;
for (const full of files) {
  const rel = relative(localRoot, full).replace(/\\/g, "/");
  const body = readFileSync(full);
  const contentType = rel.endsWith(".mp4")
    ? "video/mp4"
    : rel.endsWith(".webp")
      ? "image/webp"
      : rel.endsWith(".png")
        ? "image/png"
        : "image/jpeg";
  process.stdout.write(`Uploading ${rel} (${(body.length / 1024 / 1024).toFixed(2)} MB)… `);
  const { error } = await supabase.storage.from(bucket).upload(rel, body, {
    contentType,
    upsert: true,
    cacheControl: "3600",
  });
  if (error) {
    console.log(`FAIL: ${error.message}`);
    fail++;
  } else {
    console.log("ok");
    ok++;
  }
}

console.log(`Done. ok=${ok} fail=${fail}`);
console.log(
  `Public base: ${url}/storage/v1/object/public/${bucket}/`
);
process.exit(fail ? 1 : 0);
