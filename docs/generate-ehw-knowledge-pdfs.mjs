/**
 * Generates selectable-text PDFs from Physioguide markdown (Admin knowledge ingest).
 * Run: node docs/generate-ehw-knowledge-pdfs.mjs
 */
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.join(__dirname, "..");
const OUT_DIR = path.join(__dirname, "knowledge-ingest");

const DISCLAIMER =
  "AIKinora / Physioguide es orientativo: no sustituye criterio clínico ni diagnóstico presencial. " +
  "Ningún test aislado confirma diagnóstico. No se inventan sensibilidad, especificidad ni likelihood ratios. " +
  "Si la evidencia es mixta o procede de una sola serie, el texto lo indica.";

/** @type {{ file: string; pdf: string; title: string }[]} */
const DOCS = [
  {
    file: "knowledge/evidence/elbow-wrist-tests-expansion.md",
    pdf: "01-Physioguide-Evidencia-Tests-codo-muneca-mano-expansion.pdf",
    title: "Physioguide — Evidencia — Tests codo, muñeca y mano (expansión)",
  },
  {
    file: "knowledge/evidence/clusters-elbow-wrist-hand-tiers.md",
    pdf: "02-Physioguide-Evidencia-Clusters-Tier-ABC-codo-muneca-mano.pdf",
    title: "Physioguide — Evidencia — Clusters Tier A/B/C codo, muñeca y mano",
  },
  {
    file: "knowledge/clinical-reasoning/elbow-distal-biceps.md",
    pdf: "03-Physioguide-Clinica-Rotura-biceps-distal.pdf",
    title: "Physioguide — Clínica — Rotura del bíceps distal",
  },
  {
    file: "knowledge/clinical-reasoning/elbow-ucl-medial.md",
    pdf: "04-Physioguide-Clinica-UCL-medial-codo.pdf",
    title: "Physioguide — Clínica — UCL medial de codo (lanzadores)",
  },
  {
    file: "knowledge/clinical-reasoning/wrist-tfcc-ulnar.md",
    pdf: "05-Physioguide-Clinica-TFCC-dolor-cubital.pdf",
    title: "Physioguide — Clínica — TFCC y dolor cubital de muñeca",
  },
  {
    file: "knowledge/clinical-reasoning/wrist-druj.md",
    pdf: "06-Physioguide-Clinica-DRUJ.pdf",
    title: "Physioguide — Clínica — Inestabilidad DRUJ",
  },
  {
    file: "knowledge/clinical-reasoning/wrist-carpal-instability.md",
    pdf: "07-Physioguide-Clinica-Inestabilidad-carpiana-SL-LT.pdf",
    title: "Physioguide — Clínica — Inestabilidad carpiana (SL y LT)",
  },
  {
    file: "knowledge/clinical-reasoning/elbow-plri.md",
    pdf: "08-Physioguide-Clinica-PLRI-codo.pdf",
    title: "Physioguide — Clínica — PLRI / inestabilidad posterolateral",
  },
  {
    file: "knowledge/clinical-reasoning/elbow-radial-tunnel.md",
    pdf: "09-Physioguide-Clinica-Tunel-radial-vs-LET.pdf",
    title: "Physioguide — Clínica — Túnel radial / PIN vs LET",
  },
  {
    file: "knowledge/clinical-reasoning/elbow-distal-triceps.md",
    pdf: "10-Physioguide-Clinica-Triceps-distal.pdf",
    title: "Physioguide — Clínica — Tríceps distal",
  },
  {
    file: "knowledge/clinical-reasoning/elbow-wrist-guyon.md",
    pdf: "11-Physioguide-Clinica-Guyon-vs-tunel-cubital.pdf",
    title: "Physioguide — Clínica — Canal de Guyon vs túnel cubital",
  },
  {
    file: "knowledge/clinical-reasoning/elbow-wrist-hand-differentials.md",
    pdf: "12-Physioguide-Clinica-Diferenciales-finos-codo-muneca-mano.pdf",
    title: "Physioguide — Clínica — Diferenciales finos codo, muñeca y mano",
  },
];

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function stripInlineMd(s) {
  return s
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
}

/**
 * @param {PDFKit.PDFDocument} doc
 * @param {string} md
 * @param {string} title
 */
function renderMarkdown(doc, md, title) {
  const pageW = doc.page.width - doc.page.margins.left - doc.page.margins.right;
  const bottom = () => doc.page.height - doc.page.margins.bottom;

  const ensureSpace = (h = 48) => {
    if (doc.y + h > bottom()) doc.addPage();
  };

  doc.font("Helvetica-Bold").fontSize(16).fillColor("#0f172a").text(title, { width: pageW });
  doc.moveDown(0.35);
  doc.font("Helvetica").fontSize(8).fillColor("#64748b").text(DISCLAIMER, { width: pageW });
  doc.moveDown(0.8);

  const lines = md.replace(/\r\n/g, "\n").split("\n");
  let i = 0;
  let inFence = false;
  let fenceBuf = [];

  const flushFence = () => {
    if (!fenceBuf.length) return;
    ensureSpace(40);
    doc.font("Helvetica").fontSize(9).fillColor("#1e3a5f");
    for (const fl of fenceBuf) {
      ensureSpace(16);
      doc.text(fl.replace(/^\s+/, "") || " ", { width: pageW });
    }
    doc.fillColor("#0f172a").moveDown(0.4);
    fenceBuf = [];
  };

  while (i < lines.length) {
    const raw = lines[i];

    if (raw.trim().startsWith("```")) {
      if (inFence) {
        flushFence();
        inFence = false;
      } else {
        inFence = true;
        fenceBuf = [];
      }
      i++;
      continue;
    }
    if (inFence) {
      fenceBuf.push(raw);
      i++;
      continue;
    }

    if (raw.trim() === "---") {
      ensureSpace(20);
      const y = doc.y + 4;
      doc
        .strokeColor("#cbd5e1")
        .lineWidth(0.6)
        .moveTo(doc.page.margins.left, y)
        .lineTo(doc.page.width - doc.page.margins.right, y)
        .stroke();
      doc.y = y + 10;
      i++;
      continue;
    }

    if (raw.startsWith("# ") && !raw.startsWith("##")) {
      i++;
      continue;
    }

    if (raw.startsWith("## ")) {
      ensureSpace(36);
      doc.moveDown(0.35);
      doc
        .font("Helvetica-Bold")
        .fontSize(12)
        .fillColor("#1d4ed8")
        .text(stripInlineMd(raw.slice(3)), { width: pageW });
      doc.moveDown(0.25);
      i++;
      continue;
    }

    if (raw.startsWith("### ")) {
      ensureSpace(28);
      doc
        .font("Helvetica-Bold")
        .fontSize(10.5)
        .fillColor("#0f172a")
        .text(stripInlineMd(raw.slice(4)), { width: pageW });
      doc.moveDown(0.15);
      i++;
      continue;
    }

    if (raw.trim().startsWith("|") && raw.includes("|")) {
      const rows = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        const cells = lines[i]
          .split("|")
          .map((c) => stripInlineMd(c.trim()))
          .filter((c) => c.length);
        if (!cells.every((c) => /^[-:]+$/.test(c))) rows.push(cells.join(" — "));
        i++;
      }
      doc.font("Helvetica").fontSize(9).fillColor("#334155");
      for (const row of rows) {
        ensureSpace(18);
        doc.text("• " + row, { width: pageW });
      }
      doc.moveDown(0.25);
      continue;
    }

    if (/^\s*[-*]\s+/.test(raw)) {
      ensureSpace(18);
      doc
        .font("Helvetica")
        .fontSize(10)
        .fillColor("#0f172a")
        .text("• " + stripInlineMd(raw.replace(/^\s*[-*]\s+/, "")), {
          width: pageW,
          indent: 8,
        });
      i++;
      continue;
    }

    if (!raw.trim()) {
      doc.moveDown(0.2);
      i++;
      continue;
    }

    ensureSpace(24);
    const isLabel = /^\*\*[^*]+\*\*:/.test(raw.trim()) || /^\*\*[^*]+\*\*\s/.test(raw.trim());
    doc
      .font(isLabel ? "Helvetica" : "Helvetica")
      .fontSize(10)
      .fillColor("#0f172a")
      .text(stripInlineMd(raw), { width: pageW, align: "justify" });
    i++;
  }
}

async function writePdf(entry) {
  const mdPath = path.join(REPO, entry.file);
  const md = fs.readFileSync(mdPath, "utf8");
  const outPath = path.join(OUT_DIR, entry.pdf);

  const doc = new PDFDocument({
    size: "A4",
    bufferPages: true,
    margins: { top: 50, bottom: 56, left: 50, right: 50 },
    info: {
      Title: entry.title,
      Author: "Physioguide / AIKinora",
      Subject: "Evidence-based clinical reasoning — elbow, wrist, hand",
      Keywords: "physioguide, elbow, wrist, hand, clinical tests, clusters",
    },
  });

  const stream = fs.createWriteStream(outPath);
  doc.pipe(stream);
  renderMarkdown(doc, md, entry.title);

  const pages = doc.bufferedPageRange();
  for (let p = 0; p < pages.count; p++) {
    doc.switchToPage(pages.start + p);
    doc
      .font("Helvetica")
      .fontSize(8)
      .fillColor("#94a3b8")
      .text(
        `${entry.title}  ·  ${p + 1}/${pages.count}`,
        doc.page.margins.left,
        doc.page.height - 38,
        {
          width: doc.page.width - doc.page.margins.left - doc.page.margins.right,
          align: "center",
        },
      );
  }

  doc.end();
  await new Promise((resolve, reject) => {
    stream.on("finish", resolve);
    stream.on("error", reject);
  });
  const kb = Math.round(fs.statSync(outPath).size / 1024);
  console.log(`Wrote ${entry.pdf} (${kb} KB)`);
}

async function main() {
  ensureDir(OUT_DIR);
  const readme = [
    "# PDFs para pegar en Admin → Conocimientos",
    "",
    "Texto seleccionable (no escaneos). Sube cada PDF en `/admin/conocimientos`.",
    "Títulos RAG: prefijo **Physioguide — …**",
    "",
    "Fuente markdown en `knowledge/evidence/` y `knowledge/clinical-reasoning/`.",
    "",
    "| PDF | Contenido |",
    "|-----|-----------|",
    ...DOCS.map((d) => `| \`${d.pdf}\` | ${d.title} |`),
    "",
    "Regenerar: `node docs/generate-ehw-knowledge-pdfs.mjs`",
    "",
  ].join("\n");
  fs.writeFileSync(path.join(OUT_DIR, "README.md"), readme);

  for (const entry of DOCS) {
    await writePdf(entry);
  }
  console.log(`\n${DOCS.length} PDFs in ${OUT_DIR}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
