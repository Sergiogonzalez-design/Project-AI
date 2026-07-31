#!/usr/bin/env python3
"""
Generate Kinora Knee AI Orientation PDF (Part 8) for RAG/clinical training.
Output: knowledge/Kinora_Knee_AI_Orientation.pdf

Educational synthesis from: Gray's/Standring, Moore, Netter, Neumann, Magee,
Brukner & Khan, ACL RTS criteria literature, PFPS consensus themes,
Cook & Purdam tendinopathy continuum, OARSI/NICE OA themes, LaPrade PLC.
"""
from __future__ import annotations

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
sys.path.insert(0, str(SCRIPT_DIR))

from _knee_data import BONE_RECORDS, JOINT_RECORDS, MENISCUS_RECORDS  # noqa: E402
from _knee_data2 import LIGAMENT_RECORDS, MUSCLE_RECORDS  # noqa: E402
from _knee_data3 import (  # noqa: E402
    BLOOD_RECORDS,
    BURSA_RECORDS,
    NERVE_RECORDS,
    TENDON_RECORDS,
)
from _knee_data4 import (  # noqa: E402
    BIOMECHANICS_RECORDS,
    EVIDENCE_RECORDS,
    PATHOLOGY_RECORDS,
    REHAB_RECORDS,
)

PROJECT_ROOT = SCRIPT_DIR.parent
OUTPUT_PATH = PROJECT_ROOT / "knowledge" / "Kinora_Knee_AI_Orientation.pdf"


def esc(text: Any) -> str:
    if text is None:
        return ""
    return str(text).replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def field_line(key: str, value: Any) -> str:
    return f"<b>{esc(key)}:</b> {esc(value)}"


def build_styles() -> dict[str, ParagraphStyle]:
    base = getSampleStyleSheet()
    return {
        "title": ParagraphStyle(
            "KinoraTitle", parent=base["Title"], fontName="Helvetica-Bold",
            fontSize=22, leading=28, alignment=TA_CENTER, spaceAfter=12,
        ),
        "subtitle": ParagraphStyle(
            "KinoraSubtitle", parent=base["Normal"], fontName="Helvetica",
            fontSize=12, leading=16, alignment=TA_CENTER, spaceAfter=8,
        ),
        "h1": ParagraphStyle(
            "KinoraH1", parent=base["Heading1"], fontName="Helvetica-Bold",
            fontSize=16, leading=20, spaceBefore=14, spaceAfter=8,
            textColor=colors.HexColor("#1a365d"),
        ),
        "record": ParagraphStyle(
            "KinoraRecord", parent=base["Heading3"], fontName="Helvetica-Bold",
            fontSize=11, leading=14, spaceBefore=8, spaceAfter=4,
            textColor=colors.HexColor("#744210"),
        ),
        "body": ParagraphStyle(
            "KinoraBody", parent=base["Normal"], fontName="Helvetica",
            fontSize=9, leading=12, spaceAfter=3, alignment=TA_LEFT,
        ),
        "disclaimer": ParagraphStyle(
            "KinoraDisclaimer", parent=base["Normal"], fontName="Helvetica-Oblique",
            fontSize=9, leading=12, spaceAfter=6, textColor=colors.HexColor("#744210"),
        ),
        "toc": ParagraphStyle(
            "KinoraTOC", parent=base["Normal"], fontName="Helvetica",
            fontSize=10, leading=14, leftIndent=12, spaceAfter=4,
        ),
    }


def add_record(story: list, styles: dict, name: str, fields: dict[str, Any]) -> None:
    story.append(Paragraph(f"### RECORD: {esc(name)}", styles["record"]))
    for key, value in fields.items():
        story.append(Paragraph(field_line(key, value), styles["body"]))
    story.append(Spacer(1, 6))


def add_section(story: list, styles: dict, title: str) -> None:
    story.append(Paragraph(esc(title), styles["h1"]))


def page_footer(canvas, doc) -> None:
    canvas.saveState()
    canvas.setFont("Helvetica", 8)
    canvas.setFillColor(colors.grey)
    canvas.drawCentredString(letter[0] / 2, 0.45 * inch, f"Page {doc.page}")
    canvas.drawString(
        0.75 * inch, 0.45 * inch,
        "Kinora Knee AI Orientation Part 8 — Educational Use Only",
    )
    canvas.restoreState()


TOC_SECTIONS = [
    "Disclaimer",
    "1. Knee Bones (Distal Femur, Proximal Tibia, Proximal Fibula, Patella)",
    "2. Joints (Tibiofemoral, Patellofemoral, Proximal Tibiofibular)",
    "3. Menisci (Medial, Lateral)",
    "4. Ligaments (ACL, PCL, MCL, LCL, MPFL, PLC, PMC, Coronary)",
    "5. Muscles",
    "6. Tendons",
    "7. Bursae",
    "8. Nerves",
    "9. Blood Supply (Popliteal & Genicular Arteries)",
    "10. Biomechanics (Gait, Sport, Strength Patterns)",
    "11. Pathologies",
    "12. Rehabilitation Pathways",
    "13. Evidence and Guidelines",
]


def build_pdf() -> Path:
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    doc = SimpleDocTemplate(
        str(OUTPUT_PATH),
        pagesize=letter,
        leftMargin=0.75 * inch,
        rightMargin=0.75 * inch,
        topMargin=0.75 * inch,
        bottomMargin=0.85 * inch,
        title="Kinora Knee AI Orientation Part 8",
        author="Kinora AI Training",
    )
    styles = build_styles()
    story: list = []

    story.append(Spacer(1, 1.2 * inch))
    story.append(Paragraph("Kinora Knee", styles["title"]))
    story.append(Paragraph("Clinical AI Orientation (Part 8)", styles["title"]))
    story.append(Spacer(1, 0.3 * inch))
    story.append(Paragraph(
        "Structured reference for RAG / AI-assisted physiotherapy consultation",
        styles["subtitle"],
    ))
    story.append(Spacer(1, 0.2 * inch))
    story.append(Paragraph(
        "Bones, Joints, Menisci, Ligaments, Muscles, Tendons, Bursae, Nerves, "
        "Vascular Supply, Biomechanics, Pathologies &amp; Rehabilitation",
        styles["subtitle"],
    ))
    story.append(Spacer(1, 0.5 * inch))
    story.append(Paragraph("Version 1.0 — Kinora Admin Conocimientos Upload", styles["subtitle"]))
    story.append(PageBreak())

    add_section(story, styles, "Disclaimer")
    story.append(Paragraph(
        "This document is an educational orientation resource for Kinora AI clinical consultation support. "
        "It is NOT a substitute for professional clinical judgment, direct patient examination, or licensed "
        "medical/physiotherapy care. Content reflects established musculoskeletal concepts from standard "
        "anatomical texts (Gray's/Standring, Moore, Netter), kinesiology (Neumann), clinical assessment (Magee), "
        "sports medicine (Brukner &amp; Khan), and specialty evidence themes (ACL RTS criteria, PFPS consensus, "
        "Cook &amp; Purdam tendinopathy continuum, OARSI/NICE OA, LaPrade PLC). Approximate values vary by study. "
        "<b>Red flags — knee dislocation (vascular emergency), septic arthritis, fracture, acute neurovascular "
        "deficit, or true locked knee — require urgent medical/orthopaedic referral.</b> "
        "Follow surgeon-specific protocols after operative care.",
        styles["disclaimer"],
    ))
    story.append(Spacer(1, 12))

    add_section(story, styles, "Table of Contents")
    for item in TOC_SECTIONS:
        story.append(Paragraph(f"• {esc(item)}", styles["toc"]))
    story.append(PageBreak())

    sections = [
        ("1. Knee Bones", BONE_RECORDS),
        ("2. Joints", JOINT_RECORDS),
        ("3. Menisci", MENISCUS_RECORDS),
        ("4. Ligaments", LIGAMENT_RECORDS),
        ("5. Muscles", MUSCLE_RECORDS),
        ("6. Tendons", TENDON_RECORDS),
        ("7. Bursae", BURSA_RECORDS),
        ("8. Nerves", NERVE_RECORDS),
        ("9. Blood Supply", BLOOD_RECORDS),
        ("10. Biomechanics", BIOMECHANICS_RECORDS),
        ("11. Pathologies", PATHOLOGY_RECORDS),
        ("12. Rehabilitation Pathways", REHAB_RECORDS),
        ("13. Evidence and Guidelines", EVIDENCE_RECORDS),
    ]
    for i, (title, records) in enumerate(sections):
        add_section(story, styles, title)
        story.append(Spacer(1, 6))
        for name, fields in records:
            add_record(story, styles, name, fields)
        if i < len(sections) - 1:
            story.append(PageBreak())

    doc.build(story, onFirstPage=page_footer, onLaterPages=page_footer)
    return OUTPUT_PATH


def main() -> None:
    out = build_pdf()
    size_kb = out.stat().st_size / 1024
    print(f"Generated: {out}")
    print(f"File size: {size_kb:.1f} KB ({out.stat().st_size} bytes)")
    try:
        from pypdf import PdfReader
        reader = PdfReader(str(out))
        print(f"Page count: {len(reader.pages)}")
    except ImportError:
        print("Page count: install pypdf for exact count (file generated successfully)")


if __name__ == "__main__":
    main()
