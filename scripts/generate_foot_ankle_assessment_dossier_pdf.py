#!/usr/bin/env python3
"""
Generate Kinora Foot & Ankle Physiotherapeutic Assessment Dossier (Part 24).

Clinical assessment workflow PDF for RAG — complements Part 10 (Ankle) and
Part 11 (Foot). Structured like sports-physio valuation dossiers:
anamnesis → inspection → gait → palpation → ROM → strength → functional tests
→ special tests → neuro → PROMs → return to sport → evidence.

Educational synthesis from: APTA/JOSPT lateral ankle sprain CPG (2021),
APTA/JOSPT plantar fasciitis CPG (2023), Magee, Dutton, Brukner & Khan,
international foot/ankle clinical measures consensus, Ottawa Ankle/Foot Rules.
"""
from __future__ import annotations

import sys
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(SCRIPT_DIR))

from _kinora_pdf_common import (  # noqa: E402
    RA,
    RB,
    RC,
    add_record,
    add_section,
    build_styles,
    esc,
    make_footer,
)
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.platypus import PageBreak, Paragraph, SimpleDocTemplate, Spacer

OUTPUT = SCRIPT_DIR.parent / "knowledge" / "Kinora_Foot_Ankle_Assessment_Dossier_AI_Orientation.pdf"
REF = (
    f"{RA} {RB} {RC} "
    "APTA/JOSPT Lateral Ankle Ligament Sprains CPG (2021). "
    "APTA/JOSPT Plantar Heel Pain / Plantar Fasciitis CPG (2023). "
    "Dutton M. Orthopaedic Examination, Evaluation, and Intervention. "
    "Clinical Measures of Musculoskeletal Foot and Ankle Assessment (international consensus). "
    "Ottawa Ankle Rules / Ottawa Foot Rules primary literature."
)
PART = "Part 24"
FOOTER = "Kinora Foot & Ankle Assessment Dossier Part 24 — Educational Use Only"

TOC = [
    "Disclaimer",
    "1. Anamnesis (History)",
    "2. Inspection",
    "3. Gait Analysis",
    "4. Palpation",
    "5. Range of Motion",
    "6. Muscle Strength (Oxford 0–5)",
    "7. Functional Tests",
    "8. Special Tests",
    "9. Neurological Screen",
    "10. Outcome Questionnaires (PROMs)",
    "11. Return to Sport Criteria",
    "12. Evidence & Bibliography",
]


def R(id_: str, name: str, fields: dict) -> tuple[str, dict]:
    out = {"ID": id_, **fields}
    if "References" not in out:
        out["References"] = REF
    return (name, out)


# ---------- 1. ANAMNESIS ----------
ANAMNESIS = [
    R("FA-ANAM-01", "Chief Complaint & Pain Location Map", {
        "Purpose": "Localize primary and referred pain before exam",
        "Key_Questions": "Exact pain site? Onset timing? Traumatic vs progressive? Audible pop/snap? Able to walk? Activities that worsen/relieve?",
        "Location_Checklist": (
            "Heel; Plantar surface; Medial arch; Lateral arch; Forefoot; Metatarsals; "
            "Hallux; Lesser toes; Hindfoot; Achilles tendon; Medial malleolus; "
            "Lateral malleolus; Dorsal foot; Plantar foot"
        ),
        "AI_Use": "Map patient free-text to checklist regions; do not invent locations not stated",
        "Clinical_Note": "Multiple sites common after sprain or in overload syndromes — rank primary vs secondary",
    }),
    R("FA-ANAM-02", "Pain Quality Descriptors", {
        "Descriptors": (
            "Sharp/stabbing; Burning; Tightness/pulling; Electric shock; Pressure/oppression; "
            "Pain on weight-bearing; Pain with walking; Night pain; Morning pain (first-step)"
        ),
        "Clinical_Clues": (
            "First-step morning pain → plantar fasciopathy pattern; burning/electric → neural (tarsal tunnel, radicular); "
            "night pain + trauma → fracture/infection red-flag screen"
        ),
        "Severity": "NPRS 0–10 at rest, with walking, and worst in last 24 h",
    }),
    R("FA-ANAM-03", "Injury Mechanism", {
        "Mechanisms": (
            "Inversion; Eversion; Hyper–plantarflexion; Hyper–dorsiflexion; Overload/overuse; "
            "Running; Jumping; Cutting/COD; Direct blow"
        ),
        "Lateral_Sprain_Pattern": "PF + inversion → ATFL ± CFL; audible pop possible",
        "Syndesmosis_Pattern": "DF + external rotation (high ankle)",
        "Medial_Pattern": "Eversion / ER → deltoid ± medial clear space concern",
        "Achilles_Pattern": "Sudden push-off, felt/heard snap, immediate inability to push off",
        "Overuse_Pattern": "Gradual plantar heel / midportion Achilles / medial arch with load spike",
    }),
    R("FA-ANAM-04", "Past History & Risk Factors", {
        "Checklist": (
            "Prior ankle sprains / CAI; Surgery; Plantar fasciitis; Fractures; Diabetes; Arthritis; "
            "Pes planus; Pes cavus; Orthotic / insole use"
        ),
        "Red_Flags_Screen": (
            "Inability to WB 4 steps after trauma (Ottawa); deformity; neurovascular deficit; "
            "fever/redness/spreading cellulitis; sudden calf squeeze–positive Achilles rupture suspicion; "
            "night pain, unexplained weight loss, history of cancer"
        ),
        "Diabetes_Note": "Neuropathy, Charcot, delayed healing — modify loading and footwear advice",
    }),
]

# ---------- 2. INSPECTION ----------
INSPECTION = [
    R("FA-INSP-01", "Weight-Bearing Inspection", {
        "Observe": (
            "Medial longitudinal arch; Transverse arch; Hindfoot alignment (varus/valgus); "
            "Hallux valgus; Claw/hammer toes; Bunions; Callosities; Edema; Erythema"
        ),
        "Too_Many_Toes_Sign": "More lateral toes visible from behind → abducted forefoot / PTTD pattern",
        "Arch": "Collapsed medial arch WB vs NWB difference suggests dynamic collapse",
        "Skin": "Callus under metatarsal heads → load transfer; erythema/warmth → inflammation/infection screen",
    }),
    R("FA-INSP-02", "Non–Weight-Bearing Inspection", {
        "Observe": "Muscle atrophy; Swelling topography; Deformities; Color; Temperature",
        "Compare": "Always bilateral — note side-to-side difference",
        "Achilles_Contour": "Gap / loss of tendon outline suggests rupture — confirm with Thompson",
        "Atrophy": "Calf wasting after prolonged unloading or tibial nerve / S1 patterns",
    }),
]

# ---------- 3. GAIT ----------
GAIT = [
    R("FA-GAIT-01", "Gait Cycle Analysis — Foot & Ankle", {
        "Phases": "Initial contact; Midstance; Propulsion/toe-off",
        "Observe": (
            "Pronation; Supination; Step length; Antalgic limp; Tibial rotation; "
            "Heel strike quality; Midfoot collapse; Push-off strength"
        ),
        "Antalgic": "Shortened stance on painful side — quantify visually / video if available",
        "Propulsion_Deficit": "Weak push-off → Achilles / FHL / first-ray / pain inhibition",
        "Excessive_Pronation": "Prolonged midfoot pronation — link to PTTD, plantar fascia load, medial knee stress",
        "AI_Use": "Ask patient what they notice when walking / stairs / uneven ground",
    }),
]

# ---------- 4. PALPATION ----------
PALPATION = [
    R("FA-PALP-01", "Bony & Soft-Tissue Palpation Map", {
        "Sites": (
            "Calcaneus; Medial calcaneal tuberosity; Plantar fascia; Tibialis posterior; "
            "Fibularis (peroneal) tendons; Achilles tendon (midportion + insertional); "
            "Deltoid ligament; Lateral ligaments (ATFL, CFL, PTFL region); "
            "Base of 5th metatarsal; Metatarsal heads; Sesamoids; First ray"
        ),
        "Ottawa_Landmarks": (
            "Posterior edge/tip of lateral malleolus (6 cm); Posterior edge/tip of medial malleolus (6 cm); "
            "Base of 5th MT; Navicular — for radiograph decision after trauma"
        ),
        "Clinical": "Maximal tenderness site guides structure hypothesis; diffuse swelling less localizing acutely",
    }),
]

# ---------- 5. ROM ----------
ROM = [
    R("FA-ROM-01", "Ankle Osteokinematic Norms", {
        "Dorsiflexion": "≈ 20° (measure knee flexed and extended — gastroc vs soleus limit)",
        "Plantarflexion": "≈ 50°",
        "Inversion": "≈ 35° (combined TC + STJ contribution clinically)",
        "Eversion": "≈ 15°",
        "Functional_DF": "Weight-bearing lunge / knee-to-wall often more functional than NWB goniometry",
        "Record": "Active + passive; pain through range; end-feel; side-to-side asymmetry (cm or degrees)",
    }),
    R("FA-ROM-02", "Hallux & First-Ray Motion", {
        "Hallux_Extension": "≈ 60–90° needed for efficient windlass / push-off",
        "Hallux_Flexion": "≈ 30–45°",
        "Hallux_Limitus_Rigidus": "Reduced DF of 1st MTP — pain with toe-off, dorsal osteophyte possible",
        "First_Ray_Mobility": "Assess plantar/dorsal excursion — hypermobility may impair windlass",
    }),
]

# ---------- 6. STRENGTH ----------
STRENGTH = [
    R("FA-STR-01", "Oxford Manual Muscle Testing 0–5", {
        "Scale": "0 none; 1 flicker; 2 gravity eliminated; 3 against gravity; 4 moderate resistance; 5 strong",
        "Muscles": (
            "Tibialis anterior; Tibialis posterior; Fibularis longus; Fibularis brevis; "
            "Gastrocnemius; Soleus; Flexor hallucis longus; Extensor hallucis longus; Intrinsic foot muscles"
        ),
        "Key_Functional": "Single-leg heel-rise endurance often more informative than NWB MMT for TP/Achilles",
        "Compare": "Always vs contralateral; note pain vs true weakness",
    }),
]

# ---------- 7. FUNCTIONAL TESTS ----------
FUNCTIONAL = [
    R("FA-FUNC-01", "Single-Leg Stance", {
        "Purpose": "Balance and neuromuscular control",
        "Protocol": "Barefoot preferred; eyes open then closed if safe; up to 30 s",
        "Record": "Time to failure; strategies (hip strategy, toe grasp); pain; asymmetry",
        "Clinical": "Impaired after LAS/CAI; progress to foam / dual-task for athletes",
    }),
    R("FA-FUNC-02", "Heel-Raise Test", {
        "Purpose": "Achilles, triceps surae, tibialis posterior capacity",
        "Record": "Repetition count to fatigue; heel height symmetry; pain; early medial collapse (TP)",
        "Normative_Context": "Often aim ≥20–25 single-leg raises for athletic RTS benchmarks (population-dependent)",
        "Bilateral_First": "If unable single-leg, document double-leg then progress",
    }),
    R("FA-FUNC-03", "Weight-Bearing Lunge Test (Knee-to-Wall)", {
        "Purpose": "Functional dorsiflexion",
        "Normal_Guide": "≈ 10–12 cm toe-to-wall distance commonly cited (side-to-side asymmetry critical)",
        "Method": "Knee touches wall while heel stays down; maximize distance",
        "Clinical": "DF deficit after immobilization/sprain predicts altered landing mechanics",
    }),
    R("FA-FUNC-04", "Navicular Drop Test", {
        "Purpose": "Estimate midfoot pronation / arch collapse from sitting subtalar neutral to standing",
        "Normal_Guide": "Often < ≈ 10 mm cited; higher values suggest greater drop (interpret with symptoms)",
        "Limitations": "Measurement error; use as part of cluster not alone",
    }),
    R("FA-FUNC-05", "Windlass Test", {
        "Purpose": "Plantar fascia / windlass mechanism",
        "Positive": "Reproduction of plantar medial heel / fascial pain with passive hallux extension (WB or NWB variants)",
        "Clinical": "Supports plantar fasciopathy hypothesis with first-step pain history",
    }),
    R("FA-FUNC-06", "Jack Test", {
        "Purpose": "Integrity of windlass / ability of hallux DF to raise medial arch",
        "Positive_Finding": "Failure of arch rise with hallux DF suggests impaired windlass (e.g., PTTD / midfoot dysfunction context)",
        "Use_With": "Windlass test, FPI, single heel rise",
    }),
    R("FA-FUNC-07", "Foot Posture Index (FPI-6)", {
        "Purpose": "Classify standing foot posture",
        "Categories": "Highly supinated; Supinated; Neutral; Pronated; Highly pronated",
        "Clinical": "Posture ≠ pathology alone — combine with symptoms and load history",
    }),
    R("FA-FUNC-08", "Star Excursion Balance Test (SEBT)", {
        "Directions_Core": "Anterior; Posteromedial; Posterolateral (most used clinically)",
        "Normalize": "Reach distance as % of stance-leg length",
        "Clinical": "Dynamic balance / reach asymmetry after ankle injury",
    }),
    R("FA-FUNC-09", "Y-Balance Test (YBT)", {
        "Purpose": "Clinical SEBT variant — highly useful for RTS screening",
        "Record": "Anterior / posteromedial / posterolateral reaches; composite; LSI %",
        "Asymmetry": "Anterior reach asymmetry thresholds researched in athletic populations (~4 cm discussed in literature — use current protocols)",
    }),
    R("FA-FUNC-10", "Hop Test Battery", {
        "Includes": "Single hop; Triple hop; Crossover hop; Side hop; Timed hop",
        "Metric": "Limb Symmetry Index (LSI) — commonly target ≥ 90% for RTS discussions",
        "Safety": "Only when pain, swelling, and strength allow; not in acute unprotected sprain",
    }),
    R("FA-FUNC-11", "Deep Squat Observation", {
        "Observe": "Arch collapse; Pronation; Dynamic valgus; Ankle DF mobility; Heel lift",
        "Clinical": "Quick functional screen of kinetic chain contribution to foot load",
    }),
]

# ---------- 8. SPECIAL TESTS ----------
SPECIAL = [
    R("FA-SPEC-01", "Anterior Drawer Test (Ankle)", {
        "Structure": "ATFL — anterior talar translation",
        "Positive": "Increased translation ± sulcus vs contralateral",
        "Timing": "More reliable when acute swelling/guarding settles",
        "Evidence_Note": "Variable Sn/Sp across studies — use in cluster with history + palpation",
    }),
    R("FA-SPEC-02", "Talar Tilt Test", {
        "Structure": "Primarily CFL (inversion stress); interpret with ATFL involvement",
        "Positive": "Increased inversion talar tilt vs other side",
        "Clinical": "Higher-grade lateral complex involvement",
    }),
    R("FA-SPEC-03", "Kleiger Test (External Rotation)", {
        "Structure": "Deltoid ligament / medial clear space stress; also used in syndesmosis context",
        "Positive": "Medial pain (deltoid) or syndesmotic pain depending on force/location",
        "Caution": "Correlate with squeeze test and AITFL tenderness for high ankle",
    }),
    R("FA-SPEC-04", "External Rotation Stress Test (Syndesmosis)", {
        "Structure": "Distal tibiofibular syndesmosis",
        "Positive": "Pain over AITFL / syndesmosis with DF-ER",
        "Clinical": "High ankle sprain — longer recovery than ATFL sprain typically",
    }),
    R("FA-SPEC-05", "Squeeze Test (Syndesmosis)", {
        "Structure": "Syndesmosis / interosseous membrane irritation",
        "Positive": "Distal syndesmotic pain when compressing mid-tibia/fibula",
        "Use": "Cluster with ER stress + palpation of AITFL",
    }),
    R("FA-SPEC-06", "Thompson (Simmonds) Test", {
        "Structure": "Achilles tendon continuity",
        "Positive": "Absent / markedly reduced PF of foot with calf squeeze → rupture suspicion",
        "Action": "Urgent orthopaedic pathway if positive — do not delay for 'wait and see' loading",
    }),
    R("FA-SPEC-07", "Royal London Hospital Test", {
        "Structure": "Achilles tendinopathy (insertional/midportion context)",
        "Concept": "Tenderness that lessens with active DF (tendon moves under finger) supports tendinopathy vs other local pain",
        "Use_With": "Arc sign, load history, VISA-A",
    }),
    R("FA-SPEC-08", "Arc Sign (Achilles)", {
        "Structure": "Midportion Achilles tendinopathy",
        "Positive": "Swelling/area of thickening that moves with PF/DF of ankle",
        "Clinical": "Helps distinguish moving tendon pathology from static paratenon/other local swelling",
    }),
    R("FA-SPEC-09", "Ottawa Ankle Rules", {
        "Purpose": "Decide need for ankle radiograph after acute trauma",
        "Criteria_Summary": (
            "Pain in malleolar zone AND any of: bone tenderness posterior edge/tip lateral malleolus; "
            "bone tenderness posterior edge/tip medial malleolus; OR inability to bear weight 4 steps both immediately and in ED/clinic"
        ),
        "AI_Use": "If Ottawa-positive features → recommend imaging/medical evaluation; do not clear fracture by chat alone",
    }),
    R("FA-SPEC-10", "Ottawa Foot Rules", {
        "Purpose": "Decide need for foot radiograph after midfoot trauma",
        "Criteria_Summary": (
            "Pain in midfoot zone AND any of: bone tenderness at base of 5th MT; bone tenderness at navicular; "
            "OR inability to bear weight 4 steps both immediately and in ED/clinic"
        ),
        "Clinical": "Lisfranc / navicular / 5th MT base injuries — do not miss",
    }),
    R("FA-SPEC-11", "Hallux Limitus / Rigidus Screen", {
        "Assess": "1st MTP DF ROM; pain with grind; dorsal osteophyte prominence",
        "Limitus": "Reduced motion with pain — still some motion",
        "Rigidus": "Advanced stiffness / near-ankylosis pattern",
        "Functional": "Impaired toe-off; may alter lateral column loading",
    }),
]

# ---------- 9. NEURO ----------
NEURO = [
    R("FA-NEURO-01", "Dermatome / Myotome / Reflex Screen (L4–S1)", {
        "Dermatomes": "L4 medial leg/foot; L5 dorsum foot / 1st web space; S1 lateral foot",
        "Myotomes": "L4 dorsiflexion; L5 hallux extension; S1 plantarflexion",
        "Reflexes": "Achilles (S1–2); Patellar (L3–4) for proximal comparison",
        "Peripheral_Nerves": "Deep/superficial fibular; tibial; sural; medial/lateral plantar — map if burning/paresthesia",
        "Red_Flag": "Progressive motor loss, saddle anesthesia, or bilateral deficits → urgent medical pathway (not foot-local only)",
    }),
]

# ---------- 10. PROMs ----------
PROMS = [
    R("FA-PROM-01", "FAAM — Foot and Ankle Ability Measure", {
        "Domains": "ADL subscale; Sports subscale",
        "Scoring": "% scale; higher = better function",
        "Use": "Ankle/foot–specific PROM for progress and RTS discussions",
    }),
    R("FA-PROM-02", "FFI — Foot Function Index", {
        "Domains": "Pain, disability, activity limitation themes (version-dependent)",
        "Use": "Foot-focused disability tracking",
    }),
    R("FA-PROM-03", "LEFS — Lower Extremity Functional Scale", {
        "Scale": "0–80; higher better",
        "Use": "Broad lower-extremity function when problem not purely foot-isolated",
        "MCID_Note": "≈ 9 points commonly cited — population-dependent",
    }),
    R("FA-PROM-04", "AOFAS — American Orthopaedic Foot & Ankle Score", {
        "Note": "Clinician-rated components historically common in ortho literature; know limitations vs patient-reported measures",
        "Use": "Context when reviewing surgical outcomes literature; prefer FAAM/LEFS for patient-centered tracking when possible",
    }),
]

# ---------- 11. RTS ----------
RTS = [
    R("FA-RTS-01", "Recommended Return-to-Sport Checklist (Foot & Ankle)", {
        "Pain": "≤ 2/10 with sport-specific tasks",
        "Swelling": "No meaningful edema with load progression",
        "ROM": "Full functional ROM vs other side (esp. DF)",
        "Strength": "≥ 90% vs uninjured side (MMT/dynamometry/heel-rise capacity)",
        "Heel_Raises": "≈ 25 single-leg heel raises without pain (common athletic benchmark — individualize)",
        "Y_Balance": "≥ 90% symmetry (and no large anterior asymmetry per protocol)",
        "Hop_Tests": "≥ 90% LSI across hop battery when indicated",
        "Sport_Tasks": "Run, sprint, jump, COD pain-free",
        "24h_Rule": "Complete sport-specific training without symptom flare in following 24 hours",
        "Psych": "Athlete confidence / fear of re-injury addressed",
        "AI_Use": "Present as criteria to discuss with clinician — not automatic clearance",
    }),
]

# ---------- 12. EVIDENCE ----------
EVIDENCE = [
    R("FA-EVID-01", "Core Clinical Practice Guidelines & Texts", {
        "CPG_Ankle": "APTA/JOSPT Clinical Practice Guideline — Lateral Ankle Ligament Sprains (2021)",
        "CPG_Plantar": "APTA/JOSPT Clinical Practice Guideline — Plantar Heel Pain / Plantar Fasciitis (2023)",
        "Measures": "Clinical Measures of Musculoskeletal Foot and Ankle Assessment (international consensus themes)",
        "Texts": "Magee — Orthopedic Physical Assessment (7th ed.); Dutton — Orthopaedic Examination; Brukner & Khan's Clinical Sports Medicine (6th ed.)",
        "Imaging_Rules": "Ottawa Ankle Rules; Ottawa Foot Rules",
        "Use_In_RAG": "Prefer CPG recommendations for acute LAS and plantar heel pain pathways; cite document names in Fuente lines",
    }),
    R("FA-EVID-02", "How This Dossier Relates to Parts 10–11", {
        "Part_10": "Kinora_Ankle_AI_Orientation.pdf — anatomy, ligaments, pathologies, rehab depth",
        "Part_11": "Kinora_Foot_AI_Orientation.pdf — foot bones, arches, forefoot pathology depth",
        "Part_24": "This dossier — end-to-end assessment workflow for AI/clinician orientation",
        "Workflow": "Use Part 24 to structure exam; pull Parts 10–11 for structure-specific detail and rehab progressions",
    }),
]


def build_pdf() -> Path:
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    doc = SimpleDocTemplate(
        str(OUTPUT),
        pagesize=letter,
        leftMargin=0.75 * inch,
        rightMargin=0.75 * inch,
        topMargin=0.75 * inch,
        bottomMargin=0.85 * inch,
        title="Kinora Foot & Ankle Assessment Dossier Part 24",
        author="Kinora AI Training",
    )
    styles = build_styles()
    story: list = []

    story.append(Spacer(1, 1.1 * inch))
    story.append(Paragraph("Kinora Foot &amp; Ankle", styles["title"]))
    story.append(Paragraph("Physiotherapeutic Assessment Dossier", styles["title"]))
    story.append(Paragraph(f"Clinical AI Orientation ({PART})", styles["subtitle"]))
    story.append(Spacer(1, 0.25 * inch))
    story.append(
        Paragraph(
            "Structured valuation workflow for RAG / AI-assisted physiotherapy consultation",
            styles["subtitle"],
        )
    )
    story.append(
        Paragraph(
            "Anamnesis · Inspection · Gait · Palpation · ROM · Strength · Functional &amp; Special Tests · "
            "Neuro · PROMs · Return to Sport",
            styles["subtitle"],
        )
    )
    story.append(Spacer(1, 0.35 * inch))
    story.append(Paragraph("Version 1.0 — Kinora Admin Conocimientos Upload", styles["subtitle"]))
    story.append(Paragraph("Complements Part 10 (Ankle) &amp; Part 11 (Foot)", styles["subtitle"]))
    story.append(PageBreak())

    add_section(story, styles, "Disclaimer")
    story.append(
        Paragraph(
            "Educational resource for Kinora AI — <b>NOT</b> a substitute for licensed clinical judgment "
            "or in-person examination. Normative values are approximate and population-dependent. "
            "<b>Red flags — suspected fracture (Ottawa-positive), Achilles rupture (Thompson-positive), "
            "neurovascular compromise, infection, Lisfranc injury, or inability to bear weight after trauma — "
            "require urgent medical / orthopaedic evaluation.</b> "
            "Return-to-sport checklists do not equal clearance; athlete-specific decisions belong to the treating clinician.",
            styles["disclaimer"],
        )
    )
    story.append(Spacer(1, 12))
    add_section(story, styles, "Table of Contents")
    for t in TOC:
        story.append(Paragraph(f"• {esc(t)}", styles["toc"]))
    story.append(PageBreak())

    sections = [
        ("1. Anamnesis (History)", ANAMNESIS),
        ("2. Inspection", INSPECTION),
        ("3. Gait Analysis", GAIT),
        ("4. Palpation", PALPATION),
        ("5. Range of Motion", ROM),
        ("6. Muscle Strength (Oxford 0–5)", STRENGTH),
        ("7. Functional Tests", FUNCTIONAL),
        ("8. Special Tests", SPECIAL),
        ("9. Neurological Screen", NEURO),
        ("10. Outcome Questionnaires (PROMs)", PROMS),
        ("11. Return to Sport Criteria", RTS),
        ("12. Evidence & Bibliography", EVIDENCE),
    ]

    for i, (title, records) in enumerate(sections):
        add_section(story, styles, title)
        story.append(Spacer(1, 6))
        for name, fields in records:
            add_record(story, styles, name, fields)
        if i < len(sections) - 1:
            story.append(PageBreak())

    ft = make_footer(FOOTER)
    doc.build(story, onFirstPage=ft, onLaterPages=ft)
    return OUTPUT


if __name__ == "__main__":
    out = build_pdf()
    print(f"Generated: {out}")
    print(f"File size: {out.stat().st_size / 1024:.1f} KB")
    try:
        from pypdf import PdfReader

        print(f"Page count: {len(PdfReader(str(out)).pages)}")
    except ImportError:
        pass
