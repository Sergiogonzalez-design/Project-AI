#!/usr/bin/env python3
"""
Generate one PDF per interactive clinical reasoning tree (lib/clinical-reasoning/trees.ts).

Usage:
  python scripts/generate_clinical_reasoning_tree_pdfs.py

Requires: reportlab, and Node + esbuild (for exporting trees to JSON).
Output: knowledge/clinical-reasoning/pdfs/Kinora_Arbol_*.pdf
"""
from __future__ import annotations

import json
import subprocess
import sys
from pathlib import Path
from typing import Any

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import PageBreak, Paragraph, SimpleDocTemplate, Spacer

SCRIPT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = SCRIPT_DIR.parent
JSON_PATH = SCRIPT_DIR / ".tmp" / "clinical-reasoning-trees.json"
OUT_DIR = PROJECT_ROOT / "knowledge" / "clinical-reasoning" / "pdfs"

BODY_PART_SLUG = {
    "ankle_foot": "Tobillo_Pie",
    "knee": "Rodilla",
    "hip": "Cadera_Ingle",
    "shoulder": "Hombro",
    "elbow": "Codo",
    "wrist_hand": "Muneca_Mano",
    "finger": "Dedos",
    "neck": "Cuello",
    "back": "Espalda",
    "head": "Cabeza",
}


def esc(text: Any) -> str:
    if text is None:
        return ""
    return str(text).replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def build_styles() -> dict[str, ParagraphStyle]:
    base = getSampleStyleSheet()
    return {
        "title": ParagraphStyle(
            "TreeTitle",
            parent=base["Title"],
            fontName="Helvetica-Bold",
            fontSize=20,
            leading=26,
            alignment=TA_CENTER,
            spaceAfter=10,
        ),
        "subtitle": ParagraphStyle(
            "TreeSubtitle",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=11,
            leading=15,
            alignment=TA_CENTER,
            spaceAfter=8,
            textColor=colors.HexColor("#2c5282"),
        ),
        "h1": ParagraphStyle(
            "TreeH1",
            parent=base["Heading1"],
            fontName="Helvetica-Bold",
            fontSize=14,
            leading=18,
            spaceBefore=12,
            spaceAfter=6,
            textColor=colors.HexColor("#1a365d"),
        ),
        "h2": ParagraphStyle(
            "TreeH2",
            parent=base["Heading2"],
            fontName="Helvetica-Bold",
            fontSize=11,
            leading=14,
            spaceBefore=10,
            spaceAfter=4,
            textColor=colors.HexColor("#2c5282"),
        ),
        "body": ParagraphStyle(
            "TreeBody",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=9,
            leading=12,
            spaceAfter=3,
            alignment=TA_LEFT,
        ),
        "meta": ParagraphStyle(
            "TreeMeta",
            parent=base["Normal"],
            fontName="Helvetica-Oblique",
            fontSize=8,
            leading=11,
            spaceAfter=2,
            textColor=colors.HexColor("#4a5568"),
        ),
        "disclaimer": ParagraphStyle(
            "TreeDisclaimer",
            parent=base["Normal"],
            fontName="Helvetica-Oblique",
            fontSize=8,
            leading=11,
            spaceAfter=8,
            textColor=colors.HexColor("#744210"),
        ),
        "branch": ParagraphStyle(
            "TreeBranch",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=9,
            leading=12,
            leftIndent=12,
            spaceAfter=2,
        ),
    }


def make_footer(label: str):
    def page_footer(canvas, doc) -> None:
        canvas.saveState()
        canvas.setFont("Helvetica", 8)
        canvas.setFillColor(colors.grey)
        canvas.drawCentredString(letter[0] / 2, 0.45 * inch, f"Página {doc.page}")
        canvas.drawString(0.75 * inch, 0.45 * inch, label[:70])
        canvas.restoreState()

    return page_footer


def walk_order(tree: dict[str, Any]) -> list[str]:
    """BFS from entry, then append any unvisited nodes."""
    nodes: dict[str, Any] = tree["nodes"]
    entry = tree["entryNodeId"]
    order: list[str] = []
    seen: set[str] = set()
    queue = [entry]

    def enqueue(nid: str | None) -> None:
        if nid and nid in nodes and nid not in seen and nid not in queue:
            queue.append(nid)

    while queue:
        nid = queue.pop(0)
        if nid in seen or nid not in nodes:
            continue
        seen.add(nid)
        order.append(nid)
        node = nodes[nid]
        if node.get("type") == "test":
            enqueue(node.get("positive", {}).get("nextId"))
            enqueue(node.get("negative", {}).get("nextId"))
        else:
            enqueue(node.get("nextNodeId"))

    for nid in nodes:
        if nid not in seen:
            order.append(nid)
    return order


def add_node(story: list, styles: dict, node: dict[str, Any], index: int) -> None:
    ntype = node.get("type")
    title = node.get("title") or node.get("id")
    kind = "TEST / GATE" if ntype == "test" else "CONCLUSIÓN"
    story.append(
        Paragraph(
            f"{index}. [{esc(kind)}] {esc(title)}",
            styles["h2"],
        )
    )
    story.append(Paragraph(f"<b>id:</b> {esc(node.get('id'))}", styles["meta"]))

    if ntype == "test":
        if node.get("testId"):
            story.append(Paragraph(f"<b>testId:</b> {esc(node['testId'])}", styles["meta"]))
        if node.get("description"):
            story.append(Paragraph(f"<b>Descripción:</b> {esc(node['description'])}", styles["body"]))
        if node.get("procedure"):
            story.append(Paragraph(f"<b>Procedimiento:</b> {esc(node['procedure'])}", styles["body"]))
        if node.get("evidenceNote"):
            story.append(Paragraph(f"<b>Evidencia:</b> {esc(node['evidenceNote'])}", styles["body"]))
        pos = node.get("positive") or {}
        neg = node.get("negative") or {}
        story.append(
            Paragraph(
                f"→ <b>Positivo / Sí:</b> {esc(pos.get('label') or '(sin etiqueta)')} → <b>{esc(pos.get('nextId'))}</b>",
                styles["branch"],
            )
        )
        story.append(
            Paragraph(
                f"→ <b>Negativo / No:</b> {esc(neg.get('label') or '(sin etiqueta)')} → <b>{esc(neg.get('nextId'))}</b>",
                styles["branch"],
            )
        )
    else:
        if node.get("summary"):
            story.append(Paragraph(f"<b>Resumen:</b> {esc(node['summary'])}", styles["body"]))
        hyps = node.get("hypotheses") or []
        if hyps:
            story.append(Paragraph("<b>Hipótesis:</b>", styles["body"]))
            for h in hyps:
                story.append(
                    Paragraph(
                        f"· <b>{esc(h.get('name'))}</b> ({esc(h.get('probability'))}) — {esc(h.get('rationale'))}",
                        styles["branch"],
                    )
                )
        if node.get("nextNodeId"):
            story.append(
                Paragraph(
                    f"→ Continúa en: <b>{esc(node['nextNodeId'])}</b>",
                    styles["branch"],
                )
            )
        else:
            story.append(Paragraph("→ Nodo terminal (fin de rama).", styles["branch"]))
    story.append(Spacer(1, 6))


def build_pdf(tree: dict[str, Any], out_path: Path) -> None:
    styles = build_styles()
    story: list = []
    title = tree.get("title") or tree.get("bodyPart")
    body_part = tree.get("bodyPart")
    entry = tree.get("entryNodeId")
    nodes = tree.get("nodes") or {}

    story.append(Paragraph(esc(title), styles["title"]))
    story.append(Paragraph(f"bodyPart: {esc(body_part)} · entry: {esc(entry)}", styles["subtitle"]))
    story.append(
        Paragraph(
            "Árbol interactivo de razonamiento clínico (Physioguide / AIKinora). "
            "Uso educativo para fisioterapeutas. No sustituye valoración presencial.",
            styles["disclaimer"],
        )
    )
    story.append(Paragraph(f"Nodos totales: {len(nodes)}", styles["body"]))
    story.append(Spacer(1, 8))

    entry_map = tree.get("entryByTestId") or {}
    if entry_map:
        story.append(Paragraph("Entrada alternativa por test del informe", styles["h1"]))
        for test_id, node_id in entry_map.items():
            story.append(
                Paragraph(f"· <b>{esc(test_id)}</b> → {esc(node_id)}", styles["body"])
            )
        story.append(Spacer(1, 6))

    story.append(Paragraph("Flujo de nodos (desde la entrada)", styles["h1"]))
    order = walk_order(tree)
    for i, nid in enumerate(order, start=1):
        add_node(story, styles, nodes[nid], i)

    out_path.parent.mkdir(parents=True, exist_ok=True)
    doc = SimpleDocTemplate(
        str(out_path),
        pagesize=letter,
        leftMargin=0.75 * inch,
        rightMargin=0.75 * inch,
        topMargin=0.7 * inch,
        bottomMargin=0.7 * inch,
        title=str(title),
        author="AIKinora",
    )
    footer = make_footer(f"AIKinora · {title}")
    doc.build(story, onFirstPage=footer, onLaterPages=footer)


def export_json() -> dict[str, Any]:
    export_script = SCRIPT_DIR / "export-clinical-reasoning-trees.mjs"
    print("Exporting trees from TypeScript…")
    subprocess.run(
        ["node", str(export_script)],
        cwd=str(PROJECT_ROOT),
        check=True,
    )
    if not JSON_PATH.exists():
        raise FileNotFoundError(JSON_PATH)
    return json.loads(JSON_PATH.read_text(encoding="utf-8"))


def main() -> int:
    trees = export_json()
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    written: list[Path] = []
    for body_part, tree in trees.items():
        slug = BODY_PART_SLUG.get(body_part, str(body_part))
        out = OUT_DIR / f"Kinora_Arbol_Razonamiento_{slug}.pdf"
        print(f"Building {out.name}…")
        build_pdf(tree, out)
        written.append(out)

    print(f"\nGenerated {len(written)} PDFs in {OUT_DIR}:")
    for p in written:
        size_kb = p.stat().st_size / 1024
        print(f"  - {p.name} ({size_kb:.0f} KB)")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except subprocess.CalledProcessError as e:
        print(f"Export failed: {e}", file=sys.stderr)
        raise SystemExit(1)
