"""Shared Kinora knowledge PDF helpers."""
from __future__ import annotations
from typing import Any
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch

RA = "Standring S. Gray's Anatomy. Moore KL et al. Clinically Oriented Anatomy. Netter FH."
RB = "Neumann DA. Kinesiology of the Musculoskeletal System."
RC = "Magee DJ. Orthopedic Physical Assessment. Brukner & Khan Clinical Sports Medicine."


def esc(text: Any) -> str:
    if text is None:
        return ""
    return str(text).replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def field_line(key: str, value: Any) -> str:
    return f"<b>{esc(key)}:</b> {esc(value)}"


def build_styles() -> dict[str, ParagraphStyle]:
    base = getSampleStyleSheet()
    return {
        "title": ParagraphStyle("KinoraTitle", parent=base["Title"], fontName="Helvetica-Bold", fontSize=22, leading=28, alignment=TA_CENTER, spaceAfter=12),
        "subtitle": ParagraphStyle("KinoraSubtitle", parent=base["Normal"], fontName="Helvetica", fontSize=12, leading=16, alignment=TA_CENTER, spaceAfter=8),
        "h1": ParagraphStyle("KinoraH1", parent=base["Heading1"], fontName="Helvetica-Bold", fontSize=16, leading=20, spaceBefore=14, spaceAfter=8, textColor=colors.HexColor("#1a365d")),
        "record": ParagraphStyle("KinoraRecord", parent=base["Heading3"], fontName="Helvetica-Bold", fontSize=11, leading=14, spaceBefore=8, spaceAfter=4, textColor=colors.HexColor("#744210")),
        "body": ParagraphStyle("KinoraBody", parent=base["Normal"], fontName="Helvetica", fontSize=9, leading=12, spaceAfter=3, alignment=TA_LEFT),
        "disclaimer": ParagraphStyle("KinoraDisclaimer", parent=base["Normal"], fontName="Helvetica-Oblique", fontSize=9, leading=12, spaceAfter=6, textColor=colors.HexColor("#744210")),
        "toc": ParagraphStyle("KinoraTOC", parent=base["Normal"], fontName="Helvetica", fontSize=10, leading=14, leftIndent=12, spaceAfter=4),
    }


def add_record(story, styles, name, fields):
    from reportlab.platypus import Paragraph, Spacer
    story.append(Paragraph(f"### RECORD: {esc(name)}", styles["record"]))
    for k, v in fields.items():
        story.append(Paragraph(field_line(k, v), styles["body"]))
    story.append(Spacer(1, 6))


def add_section(story, styles, title):
    from reportlab.platypus import Paragraph
    story.append(Paragraph(esc(title), styles["h1"]))


def make_footer(label: str):
    def page_footer(canvas, doc):
        canvas.saveState()
        canvas.setFont("Helvetica", 8)
        canvas.setFillColor(colors.grey)
        canvas.drawCentredString(letter[0] / 2, 0.45 * inch, f"Page {doc.page}")
        canvas.drawString(0.75 * inch, 0.45 * inch, label)
        canvas.restoreState()
    return page_footer
