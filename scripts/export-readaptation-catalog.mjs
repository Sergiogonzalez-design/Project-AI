/**
 * Export compact readaptation catalog for Supabase edge function.
 * Run: node scripts/export-readaptation-catalog.mjs
 */
import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const src = readFileSync(
  resolve(root, "lib/readaptation-exercise-catalog.ts"),
  "utf8",
);

const entries = [];
const blockRe =
  /\{\s*id:\s*"([^"]+)"[\s\S]*?nameEs:\s*"([^"]+)"[\s\S]*?nameEn:\s*"([^"]+)"[\s\S]*?region:\s*"([^"]+)"[\s\S]*?phase:\s*"([^"]+)"[\s\S]*?dosageEs:\s*"([^"]+)"[\s\S]*?dosageEn:\s*"([^"]+)"/g;

let m;
while ((m = blockRe.exec(src))) {
  entries.push({
    id: m[1],
    nameEs: m[2],
    nameEn: m[3],
    region: m[4],
    phase: m[5],
    dosageEs: m[6],
    dosageEn: m[7],
  });
}

const out = resolve(
  root,
  "supabase/functions/ai-consult/readaptation-catalog.json",
);
writeFileSync(out, JSON.stringify(entries, null, 2));
console.log(`Wrote ${entries.length} exercises → ${out}`);
