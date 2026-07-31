#!/usr/bin/env python3
"""
Generate Kinora master clinical databases (Parts 13–21):
  Rib Cage/Thorax, TMJ, Head & Face, PNS, Vascular, Red Flags, Imaging,
  Exercise Library, Outcome Measures.
Also generates Thoracic (rib-integrated clinical DB) and Lumbar clinical DB
mirroring the cervical template (complements existing Parts 3 & 5).
"""
from __future__ import annotations
import sys
from pathlib import Path
from typing import Any

SCRIPT_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(SCRIPT_DIR))
from _kinora_pdf_common import RA, RB, RC, add_record, add_section, build_styles, esc, make_footer
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.platypus import PageBreak, Paragraph, SimpleDocTemplate, Spacer

KNOW = SCRIPT_DIR.parent / "knowledge"
REF = f"{RA} {RB} {RC}"


def pdf(path: Path, title: str, subtitle: str, part: str, disclaimer: str, sections: list[tuple[str, list]], footer: str):
    path.parent.mkdir(parents=True, exist_ok=True)
    doc = SimpleDocTemplate(str(path), pagesize=letter, leftMargin=0.75*inch, rightMargin=0.75*inch,
                            topMargin=0.75*inch, bottomMargin=0.85*inch, title=title, author="Kinora AI Training")
    styles = build_styles()
    story = []
    story.append(Spacer(1, 1.0*inch))
    story.append(Paragraph(esc(title), styles["title"]))
    story.append(Paragraph(esc(f"Clinical AI Orientation ({part})"), styles["title"]))
    story.append(Paragraph(esc(subtitle), styles["subtitle"]))
    story.append(Paragraph("Version 1.0 — Kinora Admin Conocimientos Upload", styles["subtitle"]))
    story.append(PageBreak())
    add_section(story, styles, "Disclaimer")
    story.append(Paragraph(disclaimer, styles["disclaimer"]))
    add_section(story, styles, "Table of Contents")
    for t, _ in sections:
        story.append(Paragraph(f"• {esc(t)}", styles["toc"]))
    story.append(PageBreak())
    for i, (t, recs) in enumerate(sections):
        add_section(story, styles, t)
        for name, fields in recs:
            add_record(story, styles, name, fields)
        if i < len(sections) - 1:
            story.append(PageBreak())
    ft = make_footer(footer)
    doc.build(story, onFirstPage=ft, onLaterPages=ft)
    print(f"Generated: {path} ({path.stat().st_size/1024:.1f} KB)")
    try:
        from pypdf import PdfReader
        print(f"  Pages: {len(PdfReader(str(path)).pages)}")
    except ImportError:
        pass


# ---------- RIB CAGE / THORAX ----------
def build_rib():
    bones = [
        ("Ribs 1–12 Overview", {"ID": "RIB-BONE-01", "Structure": "12 pairs; 1–7 true, 8–10 false, 11–12 floating",
         "Landmarks": "Head, neck, tubercle, angle, costal groove (VAN)", "Articulations": "Costovertebral, costotransverse, costochondral/sternocostal",
         "Clinical": "Rib fracture, flail chest, cervical rib TOS, slipping rib (8–10)", "Imaging": "CXR, CT trauma", "References": REF}),
        ("Sternum", {"ID": "RIB-BONE-02", "Structure": "Manubrium, body, xiphoid", "Landmarks": "Jugular notch, sternal angle (T4–5 / 2nd costal cartilage)",
         "Clinical": "Sternal fracture, manubriosternal junction, bone marrow biopsy site", "References": REF}),
        ("Costal Cartilage", {"ID": "RIB-BONE-03", "Structure": "Hyaline cartilage ribs to sternum / interchondral", "Clinical": "Costochondritis, Tietze syndrome", "References": REF}),
    ]
    joints = [
        ("Costovertebral Joint", {"ID": "RIB-JNT-01", "Type": "Synovial plane (head of rib–vertebral body demifacets)", "Motion": "Pump/bucket handle contributions", "Clinical": "Hypomobility with thoracic pain; trauma", "References": REF}),
        ("Costotransverse Joint", {"ID": "RIB-JNT-02", "Type": "Synovial (tubercle–TP)", "Motion": "Rotation gliding with respiration", "Clinical": "Manual therapy target; 1st rib elevation TOS", "References": REF}),
    ]
    muscles = [
        ("Diaphragm", {"ID": "RIB-MUS-01", "Origin": "Xiphoid, costal margin, lumbar crura", "Insertion": "Central tendon", "Innervation": "Phrenic C3–5",
         "Function": "Primary inspiratory muscle; IAP/canister with pelvic floor/TA", "Clinical": "Paradoxical breathing, phrenic palsy, referral shoulder (Kehr)", "References": REF}),
        ("External/Internal Intercostals", {"ID": "RIB-MUS-02", "Function": "External: inspiration assist; Internal: expiration assist", "Innervation": "Intercostal nerves T1–T11",
         "Clinical": "Strain, herpes zoster along dermatome", "References": REF}),
        ("Pectoralis Major/Minor", {"ID": "RIB-MUS-03", "Function": "Arm motion; pec minor depresses scapula / can compress brachial plexus (TOS)", "Clinical": "Pec minor TOS, strain", "References": REF}),
    ]
    bio = [
        ("Breathing Mechanics", {"ID": "RIB-BIO-01", "Pump_Handle": "Upper ribs — AP diameter increase", "Bucket_Handle": "Lower ribs — transverse diameter",
         "Diaphragm": "Dome descent increases vertical dimension; zone of apposition", "Clinical": "Dysfunctional breathing with neck pain/anxiety", "References": REF}),
        ("Thoracic Outlet", {"ID": "RIB-BIO-02", "Spaces": "Interscalene triangle, costoclavicular space, subcoracoid/pec minor",
         "Contents": "Brachial plexus, subclavian artery/vein", "Clinical": "NTOS/ATOS/VTOS differentials; effort thrombosis urgent", "References": REF}),
    ]
    path = [
        ("Rib Fracture / Flail Chest", {"ID": "RIB-PATH-01", "Red_Flag": "Respiratory compromise, pneumothorax, flail — emergency", "Rehab": "Pain control, breathing, incentive spirometry, early mobility", "References": REF}),
        ("Costochondritis / Tietze", {"ID": "RIB-PATH-02", "Symptoms": "Reproducible costal cartilage tenderness; Tietze has swelling", "DDx": "ACS cardiac — always screen cardiac red flags for chest pain", "References": REF}),
        ("1st Rib / TOS Related Pain", {"ID": "RIB-PATH-03", "Assessment": "Elevated 1st rib, Roos/Adson interpret cautiously (limited Sn/Sp)", "Treatment": "Scapular PT, breathing, neural mobility; vascular urgent if ischemic", "References": REF}),
    ]
    pdf(KNOW / "Kinora_Rib_Cage_Thorax_AI_Orientation.pdf", "Kinora Rib Cage & Thorax",
        "Ribs, Sternum, Costal Joints, Breathing, TOS & Injuries", "Part 13",
        "Educational only. <b>Chest pain — exclude cardiac/PE/pneumothorax emergently. Flail chest and vascular TOS complications are emergencies.</b>",
        [("1. Bones", bones), ("2. Joints", joints), ("3. Muscles", muscles), ("4. Biomechanics", bio), ("5. Pathologies", path)],
        "Kinora Rib Cage AI Orientation Part 13 — Educational Use Only")


# ---------- TMJ ----------
def build_tmj():
    bones = [
        ("Mandible", {"ID": "TMJ-BONE-01", "Landmarks": "Condyle, coronoid, ramus, body, angle, lingula", "Articulations": "Temporal bone via disc (TMJ)", "Muscles": "Masseter, temporalis, pterygoids, digastric, floor of mouth", "References": REF}),
        ("Temporal Bone (Mandibular Fossa)", {"ID": "TMJ-BONE-02", "Landmarks": "Mandibular fossa, articular eminence", "Clinical": "Eminence guides translation; steep eminence → locking risk", "References": REF}),
        ("Articular Disc", {"ID": "TMJ-BONE-03", "Structure": "Biconcave fibrocartilage; posterior bilaminar zone vascular/neural", "Function": "Congruence; shock; translation with condyle", "Pathologies": "Disc displacement with/without reduction; perforation", "References": REF}),
    ]
    ligs = [
        ("TMJ Ligaments", {"ID": "TMJ-LIG-01", "Include": "Temporomandibular (lateral) ligament, sphenomandibular, stylomandibular", "Function": "Limit excessive movement; lateral ligament resists posterior dislocation", "References": REF}),
    ]
    mus = [
        ("Masseter", {"ID": "TMJ-MUS-01", "Origin": "Zygomatic arch", "Insertion": "Ramus/angle", "Innervation": "CN V3", "Function": "Elevation (powerful); protrusion assist", "Clinical": "Bruxism hypertrophy; trigger points", "References": REF}),
        ("Temporalis", {"ID": "TMJ-MUS-02", "Origin": "Temporal fossa", "Insertion": "Coronoid", "Innervation": "CN V3", "Function": "Elevation; posterior fibers retraction", "Clinical": "Temporal headache overlap", "References": REF}),
        ("Lateral Pterygoid", {"ID": "TMJ-MUS-03", "Origin": "Sphenoid / lateral pterygoid plate", "Insertion": "Condyle neck + disc (superior head)", "Innervation": "CN V3", "Function": "Protrusion, contralateral excursion; disc control", "Clinical": "Key in disc displacement pathophysiology", "References": REF}),
        ("Medial Pterygoid", {"ID": "TMJ-MUS-04", "Origin": "Pterygoid plate", "Insertion": "Medial ramus", "Innervation": "CN V3", "Function": "Elevation, protrusion, contralateral excursion", "References": REF}),
    ]
    bio = [
        ("Opening Mechanics", {"ID": "TMJ-BIO-01", "Phases": "Rotation in fossa early (~20–25 mm) then translation down eminence", "Normal_ROM": "Opening often ~40–50 mm interincisal (individual)", "Clinical": "Deviation, deflection, locking", "References": REF}),
        ("Closing / Chewing / Speech", {"ID": "TMJ-BIO-02", "Closing": "Temporalis/masseter/medial pterygoid", "Chewing": "Alternate working/balancing sides", "Speech": "Fine mandibular control with hyoid/tongue", "References": REF}),
    ]
    path = [
        ("TMD Myalgia / Arthralgia", {"ID": "TMJ-PATH-01", "Symptoms": "Jaw pain, fatigue, headache, ear fullness mimic", "DDx": "Odontogenic, giant cell arteritis (age>50 temporal — urgent), otologic", "Treatment": "Education, soft diet brief, habit reversal, exercise, occlusal appliances selected evidence mixed", "References": REF}),
        ("Disc Displacement", {"ID": "TMJ-PATH-02", "With_Reduction": "Click, intermittent catch", "Without_Reduction": "Closed lock, limited opening", "Imaging": "MRI gold for disc position", "References": REF}),
        ("Headache Related to TMD", {"ID": "TMJ-PATH-03", "Note": "Overlap cervicogenic/migraine — screen SNNOOP10 red flags", "References": REF}),
    ]
    pdf(KNOW / "Kinora_TMJ_AI_Orientation.pdf", "Kinora TMJ",
        "Mandible, Disc, Mastication Muscles, Mechanics & Disorders", "Part 14",
        "Educational only. <b>Screen odontogenic infection, temporal arteritis red flags, and neurologic deficits. TMJ care does not replace dental/medical assessment.</b>",
        [("1. Bones & Disc", bones), ("2. Ligaments", ligs), ("3. Muscles", mus), ("4. Biomechanics", bio), ("5. Pathologies", path)],
        "Kinora TMJ AI Orientation Part 14 — Educational Use Only")


# ---------- HEAD & FACE ----------
def build_head():
    sections = [
        ("1. Facial Muscles (Overview)", [
            ("Facial Expression Muscles", {"ID": "HEAD-MUS-01", "Innervation": "CN VII facial nerve", "Clinical": "Bell's palsy vs central facial palsy sparing forehead", "References": REF}),
            ("Occipitofrontalis / Occipitalis", {"ID": "HEAD-MUS-02", "Function": "Scalp/forehead; tension-type headache contributor", "References": REF}),
        ]),
        ("2. Cranial Nerves — MSK Relevance", [
            ("CN Summary for Physio", {"ID": "HEAD-CN-01",
             "CN_II_III_IV_VI": "Vision/eye movements — dizziness/diplopia red flags",
             "CN_V": "Facial sensation; muscles of mastication (V3); neuralgia",
             "CN_VII": "Facial expression; corneal reflex efferent",
             "CN_VIII": "Hearing/vestibular — BPPV/vestibular neuritis differentials",
             "CN_XI": "SCM/trapezius",
             "Screen": "Any cranial nerve deficit after trauma/neck pain — urgent workup (CAD/central)",
             "References": REF}),
        ]),
        ("3. Headache Classifications (Clinical Framing)", [
            ("Primary vs Secondary", {"ID": "HEAD-HA-01",
             "Primary": "Migraine, tension-type, cluster (IHS ICHD frameworks)",
             "Secondary_MSK": "Cervicogenic; TMD-related",
             "Red_Flags_SNNOOP10": "Systemic, Neurologic, Onset sudden, Older, Pattern change, Positional, Precipitated by Valsalva, Papilledema, Progressive, Pregnancy — refer",
             "References": "ICHD headache classification themes; " + REF}),
        ]),
        ("4. Concussion Screening Basics", [
            ("Concussion Orientation", {"ID": "HEAD-CONC-01",
             "Definition": "Traumatic brain injury induced by biomechanical forces (Berlin/Amsterdam consensus themes)",
             "Screen": "SCAT-type symptom/cognitive/balance tools in trained settings; remove from play if suspected",
             "Red_Flags": "Declining consciousness, seizures, focal neuro — emergency",
             "Return_to_Sport": "Graduated RTS protocols after rest/symptom-limited activity per current consensus",
             "References": "Concussion in Sport consensus statements; " + REF}),
        ]),
        ("5. Vestibular Basics", [
            ("Vestibular Orientation for MSK Clinicians", {"ID": "HEAD-VEST-01",
             "Peripheral": "BPPV (canalithiasis) — Dix-Hallpike/CRM; vestibular neuritis",
             "Central_Red_Flags": "HINTS battery by trained clinicians; vertical skew, dangerous nystagmus, acute hearing loss patterns — urgent",
             "Cervicogenic_Dizziness": "Diagnosis of exclusion after vascular/vestibular/central screen",
             "References": REF}),
        ]),
    ]
    pdf(KNOW / "Kinora_Head_Face_AI_Orientation.pdf", "Kinora Head & Face",
        "Facial Muscles, Cranial Nerves, Headache, Concussion & Vestibular Basics", "Part 15",
        "Educational only. <b>Sudden severe headache, focal neurologic deficit, suspected stroke/CAD, or deteriorating concussion — emergency care.</b>",
        sections, "Kinora Head & Face AI Orientation Part 15 — Educational Use Only")


# ---------- PNS ----------
def build_pns():
    def n(id_, name, roots, motor, sensory, entrap, tests, neuro, rehab):
        return (name, {"ID": id_, "Nerve": name, "Roots": roots, "Motor Supply": motor, "Sensory Supply": sensory,
                       "Entrapment Sites": entrap, "Clinical Tests": tests, "Neurodynamic Tests": neuro,
                       "Rehabilitation": rehab, "References": REF})
    upper = [
        n("PNS-UE-01", "Median", "C5–T1", "Forearm flexors (most), LOAF hand", "Palmar lateral hand, digits 1–3.5", "Pronator, carpal tunnel", "Phalen, Tinel, weakness APB", "Median bias ULNT", "Nerve glides, ergonomics, night splint CTS"),
        n("PNS-UE-02", "Ulnar", "C8–T1", "FCU, FDP medial, most intrinsics", "Medial hand, digit 5", "Cubital tunnel, Guyon", "Froment, Tinel elbow/wrist", "Ulnar bias ULNT", "Avoid prolonged elbow flexion; glides"),
        n("PNS-UE-03", "Radial / Posterior Interosseous", "C5–T1", "Triceps, wrist/finger extensors", "Dorsal hand (superficial radial)", "Spiral groove, arcade of Frohse", "Wrist drop, thumb extension", "Radial bias", "Splint, progressive loading"),
        n("PNS-UE-04", "Musculocutaneous", "C5–C7", "Coracobrachialis, biceps, brachialis", "Lateral forearm (lateral cutaneous)", "Coracobrachialis", "Biceps weakness", "ULNT variants", "Trauma rehab"),
        n("PNS-UE-05", "Axillary", "C5–C6", "Deltoid, teres minor", "Sergeant's patch", "Quadrilateral space; shoulder dislocation", "ABD weakness", "—", "Post-dislocation screen"),
        n("PNS-UE-06", "Suprascapular", "C5–C6", "Supra/infraspinatus", "AC/GH sensory branches", "Suprascapular/spinoglenoid notch", "ER/ABD weakness atrophy", "—", "Overhead athlete"),
    ]
    lower = [
        n("PNS-LE-01", "Sciatic", "L4–S3", "Hamstrings then tibial/fibular", "Via branches", "Piriformis/deep gluteal continuum", "SLR", "SLR/slump", "Deep gluteal syndrome care"),
        n("PNS-LE-02", "Tibial", "L4–S3", "Posterior compartment, intrinsics via plantar", "Plantar foot", "Tarsal tunnel", "PF weakness, plantar sensory", "Tibial bias SLR", "Tarsal tunnel care"),
        n("PNS-LE-03", "Common Fibular", "L4–S2", "Short BF; then deep/superficial fibular", "Lateral leg/dorsum", "Fibular neck", "Foot drop", "Fibular bias", "AFO, decompress"),
        n("PNS-LE-04", "Femoral", "L2–L4", "Iliacus, quads, sartorius", "Anterior thigh; saphenous", "Iliacus hematoma; inguinal", "Quad lag", "PKB femoral", "NMES quads"),
        n("PNS-LE-05", "Obturator", "L2–L4", "Adductors", "Medial thigh", "Obturator canal", "Adductor weakness", "—", "Pelvic/hip ddx"),
        n("PNS-LE-06", "Lateral Femoral Cutaneous", "L2–L3", "None", "Lateral thigh", "Inguinal ligament (meralgia)", "Sensory only", "—", "Weight loss, avoid belts"),
    ]
    plex = [
        ("Brachial Plexus", {"ID": "PNS-PLX-01", "Roots": "C5–T1", "Injury_Patterns": "Erb (C5–6), Klumpke (C8–T1), burners/stingers", "References": REF}),
        ("Lumbar Plexus", {"ID": "PNS-PLX-02", "Roots": "L1–L4", "Major_Nerves": "Iliohypogastric, ilioinguinal, genitofemoral, lateral femoral cutaneous, femoral, obturator", "References": REF}),
        ("Sacral Plexus", {"ID": "PNS-PLX-03", "Roots": "L4–S4", "Major_Nerves": "Sciatic, pudendal, superior/inferior gluteal", "References": REF}),
    ]
    pdf(KNOW / "Kinora_Peripheral_Nervous_System_AI_Orientation.pdf", "Kinora Peripheral Nervous System",
        "Peripheral Nerves, Plexuses, Entrapments & Neurodynamics", "Part 16",
        "Educational only. <b>Progressive neurologic deficit, cauda equina, acute foot drop with trauma, or suspected acute inflammatory neuropathy — urgent referral.</b>",
        [("1. Upper Limb Nerves", upper), ("2. Lower Limb Nerves", lower), ("3. Plexuses", plex)],
        "Kinora PNS AI Orientation Part 16 — Educational Use Only")


# ---------- VASCULAR ----------
def build_vasc():
    secs = [
        ("1. Major Arteries (MSK-Relevant)", [
            ("Arterial Overview", {"ID": "VASC-ART-01",
             "Upper": "Subclavian → axillary → brachial → radial/ulnar; branches to scapular anastomosis",
             "Lower": "Iliac → femoral → popliteal → anterior/posterior tibial & fibular → DP/PT pulses",
             "Spinal": "Vertebral arteries (cervical); radicular/Adamkiewicz (thoracolumbar cord risk)",
             "References": REF}),
        ]),
        ("2. Veins & DVT", [
            ("Venous / DVT Screening", {"ID": "VASC-VEIN-01",
             "Wells_DVT": "Clinical prediction — high score → urgent medical pathway; do not rely on Homan's",
             "Signs": "Unilateral swelling, pain, erythema, warmth — refer for duplex",
             "PE_Red_Flags": "Dyspnea, chest pain, hemoptysis, syncope — emergency",
             "References": "Wells criteria literature; " + REF}),
        ]),
        ("3. Pulse Assessment", [
            ("Pulses", {"ID": "VASC-PULSE-01", "UE": "Brachial, radial, ulnar (Allen test)", "LE": "Femoral, popliteal, DP, PT",
             "ABI": "Ankle-brachial index for PAD suspicion", "References": REF}),
        ]),
        ("4. Compartment Syndrome", [
            ("Acute Compartment Syndrome", {"ID": "VASC-CS-01",
             "Signs": "Pain out of proportion, pain on passive stretch, paresthesia — late: pulselessness",
             "Action": "Emergency fasciotomy pathway — do not elevate as sole care / delay",
             "Chronic_Exertional": "Reversible with rest — distinct from acute",
             "References": REF}),
        ]),
    ]
    pdf(KNOW / "Kinora_Vascular_System_AI_Orientation.pdf", "Kinora Vascular System",
        "Arteries, Veins, Pulses, DVT/PE Screening & Compartment Syndrome", "Part 17",
        "Educational only. <b>Suspected DVT/PE, acute limb ischemia, or acute compartment syndrome — emergency medical care.</b>",
        secs, "Kinora Vascular AI Orientation Part 17 — Educational Use Only")


# ---------- RED FLAGS ----------
def build_redflags():
    items = [
        ("Fracture", {"ID": "RF-01", "Clues": "Trauma, Ottawa+/Canadian C-Spine+/NEXUS, inability to WB, deformity, osteoporosis + pain", "Action": "Immobilize/image/refer"}),
        ("Cancer", {"ID": "RF-02", "Clues": "Night pain, unexplained weight loss, history of cancer, constant progressive pain", "Action": "Urgent medical referral/imaging"}),
        ("Infection", {"ID": "RF-03", "Clues": "Fever, hot swollen joint, IVDU, immunosuppression, spinal infection risk", "Action": "Emergency if septic arthritis/spinal infection suspected"}),
        ("Cauda Equina", {"ID": "RF-04", "Clues": "Urinary retention, overflow incontinence, saddle anesthesia, bilateral sciatica, ULNAR? — bilateral leg neuro + bowel/bladder/sexual dysfunction", "Action": "Emergency MRI/surgical pathway NOW"}),
        ("DVT", {"ID": "RF-05", "Clues": "Wells factors, unilateral calf swelling", "Action": "Medical duplex pathway"}),
        ("PE", {"ID": "RF-06", "Clues": "Sudden dyspnea/chest pain/syncope post DVT risk", "Action": "Emergency"}),
        ("Compartment Syndrome", {"ID": "RF-07", "Clues": "Disproportionate pain, passive stretch pain post trauma/cast", "Action": "Emergency surgical"}),
        ("Inflammatory Arthritis", {"ID": "RF-08", "Clues": "Morning stiffness >>1h, multi-joint swelling, systemic features", "Action": "Rheumatology referral"}),
        ("Septic Arthritis", {"ID": "RF-09", "Clues": "Acute hot joint, fever, non-WB", "Action": "Emergency aspiration/abx pathway"}),
        ("Vascular Compromise", {"ID": "RF-10", "Clues": "Absent pulses, cold pale limb, CAD features (neck), 5 Ps of ischemia", "Action": "Emergency"}),
        ("Progressive Neurological Deficit", {"ID": "RF-11", "Clues": "Worsening strength/sensation, myelopathy signs, ascending deficits", "Action": "Urgent imaging/neurospine"}),
        ("Cervical Arterial Dysfunction", {"ID": "RF-12", "Clues": "Sudden severe neck/head pain, Horner, CN signs, dizziness with neuro features", "Action": "Emergency stroke/CAD pathway — avoid end-range manual Rx"}),
    ]
    for i in items:
        i[1]["References"] = REF
    pdf(KNOW / "Kinora_Red_Flags_Master_AI_Orientation.pdf", "Kinora Red Flags Master Database",
        "Cross-Region Emergency & Urgent Referral Indicators", "Part 18",
        "Educational screening aid — <b>when in doubt, refer urgently. This does not replace emergency protocols.</b>",
        [("1. Red Flag Conditions", items)],
        "Kinora Red Flags Part 18 — Educational Use Only")


# ---------- IMAGING ----------
def build_imaging():
    secs = [
        ("1. Modality Indications", [
            ("X-ray", {"ID": "IMG-01", "Indications": "Trauma fracture/dislocation, OA baseline, Ottawa-positive ankle/knee, Canadian C-Spine positive", "Limits": "Poor early stress Fx/soft tissue", "References": REF}),
            ("MRI", {"ID": "IMG-02", "Indications": "Disc/nerve/cord, ligament/tendon, occult Fx/stress, infection/tumor soft tissue, myelopathy", "Limits": "Cost/claustrophobia; incidental findings common", "References": REF}),
            ("CT", {"ID": "IMG-03", "Indications": "Complex fractures, surgical planning, dens/Jefferson detail, when MRI contraindicated for bone", "References": REF}),
            ("Ultrasound", {"ID": "IMG-04", "Indications": "Tendon dynamic, Baker cyst vs DVT adjunct pathway, infant hip, guided injection", "Limits": "Operator dependent; deep joints limited", "References": REF}),
        ]),
        ("2. Clinical Decision Rules", [
            ("Ottawa Ankle/Foot Rules", {"ID": "IMG-CDR-01", "Purpose": "Reduce unnecessary ankle/foot XR after acute injury", "Criteria": "Malleolar/midfoot pain PLUS bone tenderness OR inability to WB 4 steps", "Evidence": "High sensitivity validated", "References": REF}),
            ("Ottawa Knee Rules", {"ID": "IMG-CDR-02", "Purpose": "Acute knee trauma XR decision", "Criteria": "Age≥55, isolated patellar tenderness, fibular head tenderness, inability flex 90°, inability WB 4 steps", "References": REF}),
            ("Canadian C-Spine Rule", {"ID": "IMG-CDR-03", "Purpose": "Alert trauma patients — who needs c-spine imaging", "High_Risk": "Age≥65, dangerous mechanism, paresthesias → image", "Low_Risk_Then_ROM": "If low-risk factors allow safe assessment, rotate 45° each side — if unable, image", "References": "Canadian C-Spine Rule literature"}),
            ("NEXUS Criteria", {"ID": "IMG-CDR-04", "Purpose": "C-spine imaging decision (alternative framework)", "Criteria": "No midline tenderness, no focal neuro, normal alertness, no intoxication, no painful distracting injury — if all met, imaging may be deferred", "References": "NEXUS literature"}),
        ]),
        ("3. Radiological Findings (Orientation)", [
            ("Common Findings Glossary", {"ID": "IMG-FIND-01",
             "Spine": "Disc herniation, Modic, stenosis, listhesis, OPLL",
             "Shoulder": "Full-thickness RCT, labral tear — correlate clinically",
             "Knee": "ACL bone bruise pattern, meniscal signal grades",
             "Ankle": "Mortise clear space, syndesmosis diastasis",
             "Principle": "Image findings must match clinical presentation — avoid treating MRI alone",
             "References": REF}),
        ]),
    ]
    pdf(KNOW / "Kinora_Imaging_Clinical_Decision_AI_Orientation.pdf", "Kinora Imaging & Clinical Decision Rules",
        "XR/MRI/CT/US Indications, Ottawa, Canadian C-Spine, NEXUS", "Part 19",
        "Educational only. Imaging decisions follow clinical rules and local protocols.",
        secs, "Kinora Imaging Part 19 — Educational Use Only")


# ---------- EXERCISE LIBRARY ----------
def build_exercises():
    def ex(id_, name, region, muscles, diff, equip, prog, reg, contra, mistakes, evid):
        return (name, {"ID": id_, "Name": name, "Region": region, "Muscles Targeted": muscles, "Difficulty": diff,
                       "Equipment": equip, "Progression": prog, "Regression": reg, "Contraindications": contra,
                       "Common Mistakes": mistakes, "Evidence": evid, "References": REF})
    lib = [
        ex("EX-001", "Cranio-Cervical Flexion (CCFT holds)", "Cervical", "Longus colli/capitis", "Beginner", "Optional pressure biofeedback",
           "Increase hold time/pressure gently", "Shorter holds", "CAD red flags; acute fracture", "Jaw clench, global SCM dominance", "Supported for neck pain motor control (Jull themes)"),
        ex("EX-002", "Deep Neck Extensor Endurance", "Cervical", "Multifidus/semispinalis", "Beginner–mod", "Mat", "Lift/hold longer", "Assisted", "Fracture/instability", "Shrugging with upper trap", "Endurance deficits common in neck pain"),
        ex("EX-003", "Scapular Setting / Lower Trap", "Cervical-shoulder", "Lower/mid trapezius, serratus", "Beginner", "None/band", "Add arm elevation", "Support arms", "Acute unstable shoulder", "Upper trap shrug substitute", "Axioscapular training aids neck/shoulder pain"),
        ex("EX-004", "Side-Lying Thoracic Rotation (Open Book)", "Thoracic", "Thoracic rotators, stretch anterior", "Beginner", "Mat", "Add hold/reach", "Smaller ROM", "Acute fracture", "Lumbar substitution", "Common mobility drill — evidence as part of multimodal care"),
        ex("EX-005", "Diaphragmatic Breathing", "Thorax/core", "Diaphragm", "Beginner", "None", "Add functional tasks", "Hand cue only", "Unstable medical resp status", "Accessory neck breathing", "Breathing retraining adjunct"),
        ex("EX-006", "Bird-Dog", "Lumbar", "Multifidus, erector, glute, TA", "Beginner–mod", "Mat", "Opposite arm/leg holds", "Single limb only", "Acute unstable fracture", "Lumbar extension sag", "McGill-inspired stability evidence themes"),
        ex("EX-007", "Side Plank (regressed)", "Lumbar/core", "QL, obliques, glute med", "Mod", "Mat", "Full side plank", "Knees bent", "Shoulder injury limiting", "Hips sag", "Endurance core"),
        ex("EX-008", "Hip Thrust / Glute Bridge", "Hip/pelvis", "Glute max", "Beginner–adv", "Bodyweight/barbell", "Single-leg, loaded", "Isometric hold", "Acute sacral fracture", "Lumbar hyperextension", "Strong for glute strength"),
        ex("EX-009", "Sidelying Hip Abduction", "Hip", "Glute med/min", "Beginner", "Body/band", "Standing/hitches", "Isometric", "Acute GTPS severe pain — modify", "Hip hike/TFL dominant", "GTPS/PFP protocols"),
        ex("EX-010", "Quad Set / TKE", "Knee", "Quadriceps", "Beginner", "Towel/band", "Closed-chain squat", "Assisted", "Extensor mechanism rupture unprotected", "Holding breath", "AMI after effusion/ACL"),
        ex("EX-011", "Spanish Squat Isometric", "Knee", "Quad / patellar tendon load", "Mod", "Heavy band", "HSR decline squat", "Shallower angle", "Acute rupture", "Anterior knee shear if unggraded", "Patellar tendinopathy analgesia/loading"),
        ex("EX-012", "Nordic Hamstring Curl", "Knee/hip", "Hamstrings", "Adv", "Partner/device", "Assisted Nordics", "Eccentric slide outs", "Acute hamstring tear early", "Lumbar compensation", "Prevention evidence in football cohorts"),
        ex("EX-013", "Heel Raises (Straight / Bent Knee)", "Ankle", "Gastroc / soleus", "Beginner–adv", "Step/bodyweight", "Single-leg loaded", "Bilateral seated", "Unprotected Achilles rupture acute", "Bouncing ballistic early tendinopathy", "Achilles HSR protocols"),
        ex("EX-014", "Banded Ankle Eversion", "Ankle", "Fibularis longus/brevis", "Beginner", "Band", "Unstable surface", "Isometric", "Acute unstable fracture", "Toe substitution", "CAI rehab staple"),
        ex("EX-015", "Short Foot / Foot Doming", "Foot", "Intrinsics / AH", "Beginner", "None", "Single-leg/dynamic", "Seated", "Acute Lisfranc unprotected", "Toe clawing", "Arch control adjunct"),
        ex("EX-016", "Single-Leg Stance Balance", "Ankle/knee/hip", "Global stabilizers", "Beginner–mod", "None/foam", "Eyes closed/perturbation", "Bilateral", "Unstable fracture NWB", "Trendelenburg unchecked", "Sprain prevention/CAI"),
        ex("EX-017", "Y-Balance / SEBT Reach Practice", "LE kinetic chain", "Multiplanar control", "Mod", "YBT kit/tape", "Fatigue conditions", "Shorter reaches", "Acute injury irritable", "Trunk lean cheat", "RTS batteries"),
        ex("EX-018", "Farmer Carry / Suitcase Carry", "Trunk/LE", "Lateral core, grip, gait", "Mod", "DB/KB", "Heavier/longer", "Lighter", "Unstable hypertension uncontrolled medical", "Hiking shoulder", "Functional loaded carry"),
        ex("EX-019", "Deadlift Hip Hinge Pattern", "Lumbar/hip", "Glute, hamstring, erector isometric", "Mod–adv", "Barbell/KB", "Load increase", "Dowel hinge", "Acute disc with severe deficit — medical first", "Lumbar flexion under load", "Task-specific strength"),
        ex("EX-020", "Copenhagen Adduction", "Hip/groin", "Adductors", "Mod–adv", "Bench/partner", "Long lever", "Short lever isometric", "Acute adductor tear early", "Pelvic drop", "Groin injury prevention evidence"),
        ex("EX-021", "Sleeper Stretch (careful)", "Shoulder", "Posterior capsule/IR", "Beginner", "None", "Cross-body alternatives often preferred", "Gentle", "Instability/hyper", "Aggressive push into pain", "Evidence mixed — prefer symptom-free dosing"),
        ex("EX-022", "Serratus Wall Slide / Punch", "Shoulder girdle", "Serratus anterior", "Beginner–mod", "Wall/band", "Plus push-up", "Small range", "Acute unstable scapula fracture", "Upper trap dominance", "Scapular dyskinesis care"),
        ex("EX-023", "Rotator Cuff Sidelying ER", "Shoulder", "Infraspinatus/teres minor", "Beginner", "DB", "Standing band ER at 0/90", "Towel under arm isometric", "Acute repair protocol limits", "Deltoid substitution", "High EMG classic cuff exercise"),
        ex("EX-024", "Nerve Glider Median (gentle)", "PNS UE", "Median neurodynamics", "Beginner", "None", "Sliders→tensioners if indicated", "Less excursion", "Irritable radiculopathy/severe — dose carefully", "Forcing symptoms lasting", "Neurodynamic treatment evidence adjunctive"),
        ex("EX-025", "Pelvic Floor Coordinate Breath", "Pelvis", "Pelvic floor + diaphragm", "Beginner", "None", "Functional sit-to-stand", "Education only", "Red-flag cauda — refer not exercise", "Valsalva bearing-down", "ICS-aligned PFMT principles when underactive"),
    ]
    pdf(KNOW / "Kinora_Exercise_Library_AI_Orientation.pdf", "Kinora Exercise Library",
        "25 Flagship Exercises Across Regions with Progressions & Evidence Notes", "Part 20",
        "Educational exercise orientation — individualize dosing; respect post-op protocols and red flags.",
        [("1. Exercise Records", lib)],
        "Kinora Exercise Library Part 20 — Educational Use Only")


# ---------- OUTCOME MEASURES ----------
def build_outcomes():
    def om(id_, name, region, purpose, score, mcid, notes):
        return (name, {"ID": id_, "Measure": name, "Region/Construct": region, "Purpose": purpose,
                       "Scoring": score, "MCID/Notes": mcid, "Psychometrics_Notes": notes, "References": REF})
    measures = [
        om("OM-01", "Neck Disability Index (NDI)", "Cervical", "Disability from neck pain", "0–50 or %; higher = worse", "~5–10 points often cited (varies)", "Most common neck PROM"),
        om("OM-02", "Oswestry Disability Index (ODI)", "Lumbar", "Low back disability", "0–100%; higher worse", "~10% points often discussed", "Gold-standard LBP disability"),
        om("OM-03", "QuickDASH", "Upper limb", "UE disability/symptoms", "0–100; higher worse", "~8–16 points reported variously", "Faster than full DASH"),
        om("OM-04", "LEFS", "Lower extremity", "LE function", "0–80; higher better", "~9 points commonly cited", "Broad LE conditions"),
        om("OM-05", "FAAM", "Foot/ankle", "ADL and Sports subscales", "% scale; higher better", "MCID varies by subscale/population", "Ankle/foot specific"),
        om("OM-06", "KOOS", "Knee", "OA/injury knee domains", "0–100 subscales; higher better", "Domain-specific MCIDs", "Includes sport/QoL"),
        om("OM-07", "HOOS", "Hip", "Hip disability/OA", "0–100; higher better", "Domain-specific", "Analogous to KOOS"),
        om("OM-08", "Oxford Knee/Hip Scores", "Knee/Hip arthroplasty focus", "Joint-specific PROMs", "0–48 typically; higher better", "MCID literature specific", "Common arthroplasty pathways"),
        om("OM-09", "VAS Pain", "Any", "Pain intensity", "0–100 mm or 0–10", "~10–20 mm often discussed", "Simple; anchors matter"),
        om("OM-10", "NPRS", "Any", "Pain intensity", "0–10", "~2 points commonly cited", "Routine clinical use"),
        om("OM-11", "Patient-Specific Functional Scale (PSFS)", "Any", "Patient-nominated activities", "0–10 per activity; higher better", "~2 points often cited", "Highly individualized"),
        om("OM-12", "Timed Up and Go (TUG)", "Balance/mobility", "Functional mobility/fall risk screen", "Seconds; higher worse", "Context cutoffs vary by population", "Standardized chair/walk protocol"),
        om("OM-13", "Y-Balance Test", "LE motor control", "Dynamic balance asymmetry/reach", "Reach distance % leg length", "Asymmetry thresholds researched (~4 cm anterior in some athletic studies)", "RTS screening component"),
        om("OM-14", "VISA-A / VISA-P", "Achilles / patellar tendon", "Tendinopathy severity", "0–100; higher better", "Population-specific", "Tendon-specific PROMs"),
        om("OM-15", "CAIT", "Ankle instability", "Perceived ankle instability", "0–30; ≤24 often CAI cutoff in research", "Research selection tool", "International Ankle Consortium themes"),
    ]
    pdf(KNOW / "Kinora_Clinical_Outcome_Measures_AI_Orientation.pdf", "Kinora Clinical Outcome Measures",
        "NDI, ODI, QuickDASH, LEFS, FAAM, KOOS/HOOS, Oxford, VAS/NPRS, PSFS, TUG, YBT & More", "Part 21",
        "Educational. MCID values are approximate and population-dependent — use current primary sources for research.",
        [("1. Outcome Measure Records", measures)],
        "Kinora Outcome Measures Part 21 — Educational Use Only")


# ---------- THORACIC (template mirror) ----------
def build_thoracic_db():
    verts = [(f"T{i} Overview", {"ID": f"THOR-V-{i:02d}", "Vertebra": f"T{i}",
              "Features": "Costal facets on body; TP costal facet; SP longer/angled (mid-thoracic)",
              "Motion": "Limited by ribs; rotation relatively available mid-thoracic; extension limited",
              "Clinical": "Compression fracture risk osteoporosis mid-thoracic; referral visceral ddx",
              "References": REF}) for i in [1, 4, 6, 12]]
    verts.insert(0, ("Thoracic Typical Pattern", {"ID": "THOR-V-00", "Notes": "T1–T12 articulate with ribs; canal smaller than cervical; kyphosis normal", "References": REF}))
    extra = [
        ("Rib Articulations Summary", {"ID": "THOR-RIB-01", "Joints": "Costovertebral + costotransverse + sternocostal", "Breathing": "Pump/bucket handle", "References": REF}),
        ("Thoracic Mobility Clinical", {"ID": "THOR-MOB-01", "Assessment": "Rotation ROM, PAIVMs, rib spring, breathing symmetry", "Rehab": "Rotation mobility + extensor endurance + scapular", "References": REF}),
    ]
    path = [
        ("Thoracic Compression Fracture", {"ID": "THOR-PATH-01", "Red_Flag": "Osteoporosis, trauma, night pain — image", "References": REF}),
        ("Thoracic Disc / Radicular Pain", {"ID": "THOR-PATH-02", "Note": "Less common than lumbar; band-like pain; myelopathy possible", "References": REF}),
    ]
    pdf(KNOW / "Kinora_Thoracic_Spine_Clinical_Database_AI_Orientation.pdf", "Kinora Thoracic Spine Clinical Database",
        "Vertebrae, Rib Articulations, Breathing, Mobility (complements Part 3)", "Part 22",
        "Educational. Complements existing Part 3 thoracic orientation PDF. <b>Exclude cardiac/visceral red flags for thoracic pain.</b>",
        [("1. Vertebrae", verts), ("2. Ribs & Mobility", extra), ("3. Pathologies", path)],
        "Kinora Thoracic Clinical DB Part 22 — Educational Use Only")


# ---------- LUMBAR (template mirror large) ----------
def build_lumbar_db():
    verts = [(f"L{i}", {"ID": f"LUM-V-{i}", "Vertebra": f"L{i}",
              "Landmarks": "Large body, broad SP, mamillary processes, TP",
              "Facet_Orientation": "Progressively more sagittal caudal; L5–S1 transitional",
              "Clinical": "L4–5 / L5–S1 highest pathology burden", "References": REF}) for i in range(1, 6)]
    discs = [("Lumbar Discs L1–2 to L5–S1", {"ID": "LUM-DISC-01",
              "Nomenclature": "Protrusion/extrusion/sequestration; Pfirrmann degeneration grades; Modic endplate",
              "Herniation": "Posterolateral typical; may compress traversing root at L4–5 (L5 root) etc.",
              "References": REF})]
    ligs = [("ALL/PLL/Flavum/Interspinous/Supraspinous/Iliolumbar", {"ID": "LUM-LIG-01",
             "Iliolumbar": "Stabilizes L5 on ilium; resists anterior shear", "Flavum_Hypertrophy": "Stenosis contributor", "References": REF})]
    mus = [
        ("Multifidus", {"ID": "LUM-MUS-01", "Role": "Segmental stability; atrophy common in LBP", "Rehab": "Local activation then functional", "References": REF}),
        ("Erector Spinae", {"ID": "LUM-MUS-02", "Role": "Global extension/moment resistance", "References": REF}),
        ("Quadratus Lumborum", {"ID": "LUM-MUS-03", "Role": "Frontal plane; hip hike; breathing accessory", "References": REF}),
        ("Psoas Major", {"ID": "LUM-MUS-04", "Role": "Hip flexor; lumbar stabilizer debate; crosses lumbar", "References": REF}),
        ("Abdominals (RA/EO/IO/TA)", {"ID": "LUM-MUS-05", "Role": "IAP canister with diaphragm/PF", "References": REF}),
        ("Diaphragm & Pelvic Floor Integration", {"ID": "LUM-MUS-06", "Role": "Canister model; coordinate breath + continence + load", "References": REF}),
    ]
    nerves = [("Lumbar & Sacral Plexus / Neuro Screen", {"ID": "LUM-NRV-01",
               "Dermatomes": "L2 ant thigh; L3 medial knee; L4 medial leg; L5 dorsal foot/1st web; S1 lateral foot",
               "Myotomes": "L2–3 hip flex; L3–4 knee ext; L4 DF; L5 great toe ext; S1 PF",
               "Reflexes": "Patellar L3–4; Achilles S1–2",
               "Cauda_Equina": "EMERGENCY — retention, saddle anesthesia, bilateral deficits",
               "References": REF})]
    path = [
        ("Disc Herniation / Sciatica", {"ID": "LUM-PATH-01", "Care": "Most improve; guide persistent/progressive; surgery selected", "References": REF}),
        ("Stenosis", {"ID": "LUM-PATH-02", "Clues": "Neurogenic claudication relief with flexion", "References": REF}),
        ("Facet Syndrome", {"ID": "LUM-PATH-03", "Clues": "Extension-rotation pain", "References": REF}),
        ("Spondylolysis / Listhesis", {"ID": "LUM-PATH-04", "Clues": "Young athlete extension pain; step-off", "References": REF}),
        ("DDD", {"ID": "LUM-PATH-05", "Note": "Age-related; correlate clinically not MRI alone", "References": REF}),
        ("SI Referral", {"ID": "LUM-PATH-06", "Note": "Laslett cluster; see Pelvis Part 6", "References": REF}),
        ("Cauda Equina", {"ID": "LUM-PATH-07", "Action": "Emergency MRI/surgical decompression pathway", "References": REF}),
        ("Compression Fracture", {"ID": "LUM-PATH-08", "Clues": "Osteoporosis, trauma, sitting intolerance", "References": REF}),
    ]
    pdf(KNOW / "Kinora_Lumbar_Spine_Clinical_Database_AI_Orientation.pdf", "Kinora Lumbar Spine Clinical Database",
        "L1–L5, Discs, Ligaments, Canister Muscles, Plexuses, Pathologies incl. Cauda Equina (complements Part 5)", "Part 23",
        "Educational. Complements Part 5 lumbar orientation. <b>CAUDA EQUINA and progressive neuro deficit are emergencies.</b>",
        [("1. Vertebrae", verts), ("2. Discs", discs), ("3. Ligaments", ligs), ("4. Muscles & Canister", mus),
         ("5. Nerves", nerves), ("6. Pathologies", path)],
        "Kinora Lumbar Clinical DB Part 23 — Educational Use Only")


def main():
    build_rib()
    build_tmj()
    build_head()
    build_pns()
    build_vasc()
    build_redflags()
    build_imaging()
    build_exercises()
    build_outcomes()
    build_thoracic_db()
    build_lumbar_db()
    print("All master databases generated.")


if __name__ == "__main__":
    main()
