#!/usr/bin/env python3
"""Generate Kinora Ankle AI Orientation PDF (Part 10)."""
from __future__ import annotations
import sys
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(SCRIPT_DIR))
from _kinora_pdf_common import add_record, add_section, build_styles, esc, make_footer
from _ankle_part1 import BONES, JOINTS
from _ankle_part2 import (
    BIOMECHANICS, EVIDENCE, FUNCTIONAL, LIGAMENTS, MUSCLES, NERVES,
    PATHOLOGIES, REHAB, STABILITY, TENDONS, TESTS,
)
from reportlab.lib.units import inch
from reportlab.platypus import PageBreak, Paragraph, SimpleDocTemplate, Spacer

OUTPUT = SCRIPT_DIR.parent / "knowledge" / "Kinora_Ankle_AI_Orientation.pdf"
TOC = [
    "Disclaimer", "1. Bones", "2. Joints", "3. Ligaments", "4. Tendons", "5. Muscles",
    "6. Biomechanics", "7. Stability", "8. Neurovascular", "9. Functional Assessment",
    "10. Special Tests", "11. Pathologies", "12. Rehabilitation", "13. Evidence",
]


def build_pdf():
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    doc = SimpleDocTemplate(str(OUTPUT), pagesize=__import__("reportlab.lib.pagesizes", fromlist=["letter"]).letter,
                            leftMargin=0.75*inch, rightMargin=0.75*inch, topMargin=0.75*inch, bottomMargin=0.85*inch,
                            title="Kinora Ankle AI Orientation Part 10", author="Kinora AI Training")
    styles = build_styles()
    story = []
    story.append(Spacer(1, 1.2*inch))
    story.append(Paragraph("Kinora Ankle", styles["title"]))
    story.append(Paragraph("Clinical AI Orientation (Part 10)", styles["title"]))
    story.append(Spacer(1, 0.3*inch))
    story.append(Paragraph("Structured reference for RAG / AI-assisted physiotherapy consultation", styles["subtitle"]))
    story.append(Paragraph("Bones, Joints, Ligaments, Tendons, Muscles, Biomechanics, Stability, Neurovascular, Assessment, Pathologies &amp; Rehabilitation", styles["subtitle"]))
    story.append(Spacer(1, 0.4*inch))
    story.append(Paragraph("Version 1.0 — Kinora Admin Conocimientos Upload", styles["subtitle"]))
    story.append(PageBreak())
    add_section(story, styles, "Disclaimer")
    story.append(Paragraph(
        "Educational resource for Kinora AI — NOT a substitute for clinical judgment or licensed care. "
        "Content synthesizes Gray's/Standring, Moore, Netter, Neumann, Magee, Brukner &amp; Khan, Ottawa Ankle Rules, "
        "CAI consortium themes, and Achilles tendinopathy/rupture literature. Values approximate. "
        "<b>Red flags — Achilles rupture, fracture/dislocation, acute compartment syndrome, neurovascular compromise, "
        "infection, or inability to bear weight after trauma with Ottawa-positive findings — require urgent medical/orthopaedic care.</b>",
        styles["disclaimer"]))
    story.append(Spacer(1, 12))
    add_section(story, styles, "Table of Contents")
    for t in TOC:
        story.append(Paragraph(f"• {esc(t)}", styles["toc"]))
    story.append(PageBreak())
    sections = [
        ("1. Bones", BONES), ("2. Joints", JOINTS), ("3. Ligaments", LIGAMENTS),
        ("4. Tendons", TENDONS), ("5. Muscles", MUSCLES), ("6. Biomechanics", BIOMECHANICS),
        ("7. Stability", STABILITY), ("8. Neurovascular", NERVES),
        ("9. Functional Assessment", FUNCTIONAL), ("10. Special Tests", TESTS),
        ("11. Pathologies", PATHOLOGIES), ("12. Rehabilitation", REHAB),
        ("13. Evidence", EVIDENCE),
    ]
    for i, (title, records) in enumerate(sections):
        add_section(story, styles, title)
        story.append(Spacer(1, 6))
        for name, fields in records:
            add_record(story, styles, name, fields)
        if i < len(sections) - 1:
            story.append(PageBreak())
    doc.build(story, onFirstPage=make_footer("Kinora Ankle AI Orientation Part 10 — Educational Use Only"),
              onLaterPages=make_footer("Kinora Ankle AI Orientation Part 10 — Educational Use Only"))
    return OUTPUT


if __name__ == "__main__":
    out = build_pdf()
    print(f"Generated: {out}")
    print(f"File size: {out.stat().st_size/1024:.1f} KB")
    try:
        from pypdf import PdfReader
        print(f"Page count: {len(PdfReader(str(out)).pages)}")
    except ImportError:
        pass
