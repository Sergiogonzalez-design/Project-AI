/**
 * Bundle + dump CLINICAL_REASONING_TREES to JSON for PDF generation.
 * Run via: node scripts/export-clinical-reasoning-trees.mjs
 */
import { spawnSync } from "child_process";
import fs from "fs";
import path from "path";
import { createRequire } from "module";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const TMP = path.join(__dirname, ".tmp");
const ENTRY = path.join(TMP, "export-entry.ts");
const OUT_BUNDLE = path.join(TMP, "clinical-reasoning-trees.cjs");
const OUT_JSON = path.join(TMP, "clinical-reasoning-trees.json");

fs.mkdirSync(TMP, { recursive: true });
fs.writeFileSync(
  ENTRY,
  `import { CLINICAL_REASONING_TREES } from "@/lib/clinical-reasoning/trees";
module.exports = CLINICAL_REASONING_TREES;
`
);

const esbuildBin = path.join(ROOT, "node_modules", "esbuild", "bin", "esbuild");
const result = spawnSync(
  process.execPath,
  [
    esbuildBin,
    ENTRY,
    "--bundle",
    "--platform=node",
    "--format=cjs",
    `--outfile=${OUT_BUNDLE}`,
    `--alias:@=${ROOT}`,
    "--log-level=warning",
  ],
  { cwd: ROOT, encoding: "utf8" }
);

if (result.status !== 0) {
  console.error(result.stderr || result.stdout || "esbuild failed");
  process.exit(result.status ?? 1);
}

const require = createRequire(import.meta.url);
delete require.cache[require.resolve(OUT_BUNDLE)];
const trees = require(OUT_BUNDLE);
fs.writeFileSync(OUT_JSON, JSON.stringify(trees, null, 2), "utf8");
console.log(`Wrote ${OUT_JSON} (${Object.keys(trees).length} trees)`);
