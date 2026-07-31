#!/usr/bin/env python3
"""
Generate Kinora Thoracic Spine & Back AI Orientation PDF (Part 3) for RAG/clinical training.
Output: knowledge/Kinora_Thoracic_Back_AI_Orientation.pdf
"""
from __future__ import annotations

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
OUTPUT_PATH = PROJECT_ROOT / "knowledge" / "Kinora_Thoracic_Back_AI_Orientation.pdf"


def esc(text: Any) -> str:
    if text is None:
        return ""
    s = str(text)
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


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
        "h2": ParagraphStyle(
            "KinoraH2", parent=base["Heading2"], fontName="Helvetica-Bold",
            fontSize=13, leading=17, spaceBefore=10, spaceAfter=6,
            textColor=colors.HexColor("#2c5282"),
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


def add_section(story: list, styles: dict, title: str, level: int = 1) -> None:
    style = styles["h1"] if level == 1 else styles["h2"]
    story.append(Paragraph(esc(title), style))


def page_footer(canvas, doc) -> None:
    canvas.saveState()
    canvas.setFont("Helvetica", 8)
    canvas.setFillColor(colors.grey)
    canvas.drawCentredString(letter[0] / 2, 0.45 * inch, f"Page {doc.page}")
    canvas.drawString(
        0.75 * inch, 0.45 * inch,
        "Kinora Thoracic Spine & Back AI Orientation Part 3 — Educational Use Only",
    )
    canvas.restoreState()


# ---------------------------------------------------------------------------
# Section 1: Vertebral level builders
# ---------------------------------------------------------------------------

VERTEBRAL_FIELDS = [
    "ID", "Vertebral Level", "Region", "Bone", "Facet Orientation", "Disc Characteristics",
    "Ligaments", "Muscles", "Innervation", "Blood Supply", "Biomechanics", "Normal ROM",
    "Arthrokinematics", "Osteokinematics", "Force Transmission", "Shock Absorption",
    "Respiratory Function", "Clinical Examination", "Palpation", "Segmental Mobility",
    "Special Tests", "Common Dysfunctions", "Common Pathologies", "Imaging",
    "Manual Therapy", "Rehabilitation", "Mobility Exercises", "Strengthening",
    "Return to Sport", "Clinical Guidelines", "Evidence", "References",
]


def _region_for_level(level: int) -> str:
    if level <= 4:
        return "Upper thoracic (cervicothoracic transition zone)"
    if level <= 8:
        return "Mid thoracic (typical thoracic cage)"
    return "Lower thoracic (thoracolumbar transition zone)"


def build_vertebral_record(level: int) -> tuple[str, dict[str, Any]]:
    region = _region_for_level(level)
    rib_num = level
    is_upper = level <= 4
    is_mid = 5 <= level <= 8
    is_lower = level >= 9
    is_t1 = level == 1
    is_t12 = level == 12

    if is_t1:
        facet = "Superior facets face posterior-superior; inferior facets posterior-inferior; more sagittal than mid-thoracic (~45-55 deg coronal); cervicothoracic transition"
        bone = "Body smaller than T2; prominent transverse processes with costal facets for rib 1; no body demifacets for rib (full facet on T1); vertebral foramen smaller than cervical"
        lig = "ALL, PLL, ligamentum flavum, intertransverse, interspinous; costovertebral/costotransverse caps for rib 1; supraspinous ligament continuous with nuchal ligament superiorly"
        muscles = "Semispinalis cervicis/thoracis, multifidus, rotatores, longissimus, iliocostalis, levator scapulae (TP), splenius attachments; deep neck extensors at cervicothoracic junction"
        innerv = "Segmental dorsal rami T1 (major contributor to T1 radiculopathy/brachial plexus overlap); ventral rami T1 form lower trunk/brachial plexus components"
        blood = "Segmental arteries from supreme intercostal/vertebral tributaries; vertebral venous plexus; first intercostal artery branch patterns"
        bio = "Minimal independent flexion-extension; coupled with C7-T2; rib 1 ring creates stiff segment; critical for scapular rhythm and TOS proximity"
        rom = "Flexion 3-5 deg, extension 2-4 deg, lateral flexion 3-5 deg, rotation 2-4 deg segmentally; region moves more as cervicothoracic unit"
        path = "T1 radiculopathy, cervicothoracic dysfunction, first rib hypomobility, TOS-related pain referral, Scheuermann apex nearby in adolescents"
    elif is_t12:
        facet = "Facets transition toward lumbar orientation (~90 deg sagittal); inferior facets face lateral; superior facets medial; increased sagittal plane freedom"
        bone = "Body resembles lumbar vertebra; articular processes large; often no costal facets on body (floating rib 12); mamillary processes may appear"
        lig = "ALL, PLL, ligamentum flavum; thoracolumbar fascia attachment; iliolumbar ligament analogues at transition; strong interspinous region"
        muscles = "Multifidus, erector spinae, quadratus lumborum proximity, latissimus dorsi via TL fascia, psoas minor attachment region"
        innerv = "T12 dorsal rami; ventral rami contribute to subcostal nerve; overlap with L1 innervation patterns at transition"
        blood = "Segmental T12 arteries from lumbar/intercostal anastomoses; Batson plexus drainage"
        bio = "Transition zone: greatest thoracolumbar shear potential; facet orientation permits more sagittal motion than mid-thoracic"
        rom = "Flexion 6-8 deg, extension 5-7 deg, lateral flexion 4-6 deg, rotation 3-5 deg; highest thoracic segmental ROM"
        path = "Thoracolumbar junction syndrome, pars stress at transition, disc herniation (rare but possible), facet arthropathy, QL referral overlap"
    elif is_upper:
        facet = f"Zygapophyseal facets oriented ~55-65 deg to coronal plane; T{level} superior/inferior facets permit rotation with limited flexion-extension"
        bone = f"T{level} body with paired superior/inferior costal demifacets for rib {rib_num}; pedicles, laminae, spinous process angled inferiorly; transverse costal facet for rib {rib_num} tubercle"
        lig = "ALL, PLL, ligamentum flavum, interspinous, supraspinous, costovertebral and costotransverse ligaments for rib {0}; radiate ligaments stabilize costovertebral joint".format(rib_num)
        muscles = "Multifidus, rotatores, semispinalis thoracis, longissimus thoracis, iliocostalis, rhomboids (upper), trapezius (middle), serratus posterior superior"
        innerv = f"T{level} medial branch dorsal rami (facet/facet capsule); ventral rami T{level} intercostal nerve segment"
        blood = f"Segmental artery T{level}; dorsal branch supplies facet; intercostal artery from aorta segment T{level}"
        bio = f"Rib {rib_num} ring increases stiffness; upper thoracic contributes to scapular base stability; rotation primary motion with respiration"
        rom = "Flexion 2-4 deg, extension 2-3 deg, lateral flexion 2-4 deg, rotation 2-4 deg per segment"
        path = f"Upper thoracic hypomobility, costovertebral dysfunction rib {rib_num}, postural kyphosis segments, facet syndrome T{level}-T{level+1}"
    elif is_mid:
        facet = f"Classic thoracic facet ~60 deg coronal; T{level} resists flexion-extension, favors rotation and lateral flexion within rib cage constraints"
        bone = f"T{level} typical thoracic vertebral body; heart/ mediastinum anterior; spinous process long and overlapping; rib {rib_num} articulations bilateral"
        lig = "ALL, PLL, flavum, interspinous, supraspinous; costovertebral joint capsule; costotransverse; superior/inferior costotransverse ligaments"
        muscles = "Multifidus, rotatores (long segment), semispinalis, erector spinae, intercostals, serratus posterior inferior (lower mid), latissimus origin broad"
        innerv = f"T{level} dorsal ramus medial branch; intercostal nerve T{level} (ventral ramus); lateral cutaneous branch at mid-axillary line"
        blood = f"Intercostal artery and vein pair T{level}; segmental spinal branches to cord and meninges"
        bio = "Mid-thoracic cage is most rigid; torsion transmitted during gait; scoliosis apex often T8-T9 region in adolescents"
        rom = "Flexion 2-3 deg, extension 2 deg, lateral flexion 2-3 deg, rotation 2-3 deg segmentally"
        path = "Scheuermann kyphosis apex, idiopathic scoliosis, compression fracture (osteoporosis), intercostal neuralgia, postural pain"
    else:
        facet = f"Lower thoracic facets progressively more sagittal; T{level} permits increased flexion-extension vs mid-thoracic"
        bone = f"T{level} body larger; rib {rib_num} false rib (costal cartilage joins cartilage above); reduced bony rib ring constraint vs true ribs"
        lig = "ALL, PLL, flavum; costovertebral for rib {0}; thoracolumbar fascia attachments increase inferiorly".format(rib_num)
        muscles = "Multifidus, erector spinae ( iliocostalis lumborum transition), QL proximity T12, latissimus, internal/external oblique attachments via fascia"
        innerv = f"T{level} segmental nerve; subcostal overlap at T12 region when applicable"
        blood = f"Segmental T{level} intercostal/lumbar anastomotic branches"
        bio = "Reduced rib cage constraint allows more segmental flexion; important for lifting mechanics and thoracolumbar load transfer"
        rom = "Flexion 4-6 deg, extension 3-5 deg, lateral flexion 3-4 deg, rotation 2-4 deg"
        path = "Thoracolumbar strain, facet irritation, disc degeneration (uncommon), rib cartilage pain referral"

    fields: dict[str, Any] = {
        "ID": f"VERT-T-{level:02d}",
        "Vertebral Level": f"T{level}",
        "Region": region,
        "Bone": bone,
        "Facet Orientation": facet,
        "Disc Characteristics": (
            f"T{level}-T{level+1 if level < 12 else 'L1'} disc: nucleus pulposus constrained by rib cage; "
            "annulus fibrosus thinner than lumbar; limited disc height change with loading; "
            "posterior annulus reinforced; lateral bulge less common than lumbar due to rigidity; "
            "Schmorl nodes possible in adolescents at endplates"
        ),
        "Ligaments": lig,
        "Muscles": muscles,
        "Innervation": innerv,
        "Blood Supply": blood,
        "Biomechanics": bio,
        "Normal ROM": rom,
        "Arthrokinematics": (
            "Facet glides: extension — inferior facet slides inferior-posterior on superior facet of segment below; "
            "flexion reverses; rotation couples with contralateral facet opening; "
            "costovertebral joint rolls/slides with respiration and trunk rotation"
        ),
        "Osteokinematics": (
            "Regional flexion-extension minimal mid-thoracic; rotation and lateral flexion coupled; "
            "whole thoracic kyphosis 20-40 deg; upper and lower transitions contribute disproportionately to regional motion"
        ),
        "Force Transmission": (
            "Axial compression through vertebral bodies and discs; lateral rib cage dissipates forces; "
            "facet joints share shear in rotation; costovertebral joints transfer bucket/pump handle forces during breathing"
        ),
        "Shock Absorption": (
            "Disc viscoelasticity limited vs lumbar; rib cage hoop tension; paraspinal muscle eccentric control; "
            "kyphotic curve distributes axial load anteriorly through vertebral bodies"
        ),
        "Respiratory Function": (
            f"Rib {rib_num} attachment contributes to thoracic volume change; segmental rotation with inspiration; "
            "posterior intercostals and paraspinals stabilize during forced breathing"
        ),
        "Clinical Examination": (
            "Observation: kyphosis, scoliosis, winging; active ROM thoracic rotation/lateral flexion in sitting; "
            "passive accessory glide PA/central; neuro screen dermatomes T1-T12 (T4 nipple, T10 umbilicus landmarks)"
        ),
        "Palpation": (
            f"Spinous process T{level} midline; transverse processes ~3 cm lateral; paraspinal soft tissue; "
            "costotransverse angle palpation for rib hypomobility; facet tenderness 1-2 cm lateral to SP"
        ),
        "Segmental Mobility": (
            "PA central/over-unilateral glides; spring test for stiffness; compare segment above/below; "
            "rib spring at costotransverse angle; note pain reproduction vs stiffness only"
        ),
        "Special Tests": (
            "Slump/neural tension if radicular; Adam's forward bend for scoliosis; "
            "thoracic extension rotation test; first rib mobility test if T1; "
            "instability tests generally not applicable except thoracolumbar transition"
        ),
        "Common Dysfunctions": (
            "Segmental hypomobility, hypermobility at transition zones, postural extension loss, "
            "facet irritation, costovertebral restriction, muscle guarding pattern"
        ),
        "Common Pathologies": path,
        "Imaging": (
            "X-ray AP/lateral for alignment, fractures, scoliosis; CT for complex fractures; "
            "MRI for disc, cord, tumor, infection; bone scan for metastases in oncology screen"
        ),
        "Manual Therapy": (
            "Grade I-II mobilization for pain; grade III-IV PA glides for hypomobility; "
            "costovertebral mobilization; muscle energy for rotation; HVLA only with clear diagnosis and consent"
        ),
        "Rehabilitation": (
            "Phase 1: pain control, breathing, postural awareness; Phase 2: mobility thoracic rotation/extension; "
            "Phase 3: scapular-thoracic integration; Phase 4: sport-specific rotation/load"
        ),
        "Mobility Exercises": (
            "Open book, thread the needle, foam roller extension (mid-thoracic), cat-camel segmental, "
            "seated rotation with block, rib expansion breathing in side-lying"
        ),
        "Strengthening": (
            "Prone extension holds, row variations, face pulls, dead bug with rotation control, "
            "anti-rotation pallof press, bird dog, lower trap activation"
        ),
        "Return to Sport": (
            "Full pain-free ROM; symmetric rotation >45 deg each side; no neural symptoms; "
            "progressive loaded rotation and extension; contact sports after fracture healing 8-12 weeks if applicable"
        ),
        "Clinical Guidelines": (
            "NICE low back/thoracic pain: reassurance, activity modification, manual therapy optional; "
            "red flags: cauda equina, progressive neuro deficit, fever, trauma, cancer history"
        ),
        "Evidence": (
            "Thoracic manipulation may reduce neck pain (indirect evidence); "
            "motor control training for scapular dyskinesis Level B; "
            "see Cochrane reviews spinal manipulative therapy for mixed chronic pain"
        ),
        "References": (
            "Neumann Kinesiology of the Musculoskeletal System; Bogduk clinical anatomy; "
            "ISIS thoracic spine guidelines; PubMed: thoracic spine mobilization systematic reviews"
        ),
    }
    return (f"Vertebral Level T{level}", fields)


def build_joint_records() -> list[tuple[str, dict[str, Any]]]:
    records = []
    facet = {
        "ID": "JOINT-T-FACET", "Vertebral Level": "T1-T12 bilateral pairs",
        "Region": "Posterior thoracic column",
        "Bone": "Inferior articular facet of cranial vertebra with superior facet of caudal vertebra",
        "Facet Orientation": "~60 degrees to coronal plane (upper slightly more sagittal, lower trending sagittal at T11-T12)",
        "Disc Characteristics": "N/A — facet joint synovial; interposed meniscoids/fat pads",
        "Ligaments": "Joint capsule, flavum contribution posteriorly, medial branch nerve innervates capsule",
        "Muscles": "Multifidus, rotatores, semispinalis — dynamic stabilization; erector spinae global",
        "Innervation": "Medial branch dorsal ramus each level; facet pain maps locally and referred paraspinal",
        "Blood Supply": "Segmental arterial anastomoses from dorsal branches",
        "Biomechanics": "Guide rotation; resist anterior shear in extension; load sharing in axial compression ~15-20% in lumbar analog",
        "Normal ROM": "Primary plane rotation; flexion-extension limited 2-5 deg per segment",
        "Arthrokinematics": "Convex-on-concave glides with coupled motion; capsular slack in flexion, taut in extension",
        "Osteokinematics": "Thoracic rotation 35-50 deg total; lateral flexion 25-35 deg total",
        "Force Transmission": "Posterior column shear and torsion; facet tropism rare in thoracic vs lumbar",
        "Shock Absorption": "Minimal; facet loading increases in extension and rotation end-range",
        "Respiratory Function": "Indirect — rib cage motion alters facet loading with breathing",
        "Clinical Examination": "Extension pain suggests facet loading; rotation restriction; palpation 1-2 cm lateral to SP",
        "Palpation": "Facet line parallel to SP; tenderness grading; compare bilateral",
        "Segmental Mobility": "PA glide, gapping, rotation mobilization",
        "Special Tests": "No single gold standard; extension-rotation provocative; medial branch block diagnostic for chronic facet pain",
        "Common Dysfunctions": "Facet arthropathy, synovial impingement, meniscoid entrapment, post-whiplash upper thoracic",
        "Common Pathologies": "Facet joint syndrome, osteoarthritis, inflammatory spondyloarthropathy",
        "Imaging": "X-ray limited; CT/MRI for effusion, synovitis, fracture; bone scan for active facet arthropathy",
        "Manual Therapy": "Mobilization grades III-IV, manipulation when appropriate, flexion distraction rare in thoracic",
        "Rehabilitation": "Extension control exercises, rotation mobility, avoid repeated end-range extension loading early",
        "Mobility Exercises": "Open book, seated rotation, extension in neutral (not hyperextension)",
        "Strengthening": "Anti-extension core, multifidus activation, rows with scapular retraction",
        "Return to Sport": "Pain-free rotation and controlled extension under load",
        "Clinical Guidelines": "Diagnostic medial branch blocks for chronic facet-mediated pain prior to radiofrequency",
        "Evidence": "Thoracic facet pain less studied than lumbar; medial branch RF evidence extrapolated from lumbar literature",
        "References": "Bogduk facet joint innervation; Cohen SP facet interventions systematic reviews",
    }
    records.append(("Thoracic Facet Joints (Zygapophyseal)", facet))

    disc = {
        "ID": "JOINT-T-DISC", "Vertebral Level": "T1-T12 intervertebral",
        "Region": "Anterior thoracic column between vertebral bodies",
        "Bone": "Endplates of adjacent vertebral bodies",
        "Facet Orientation": "N/A",
        "Disc Characteristics": (
            "Thin relative to lumbar; nucleus constrained; annulus lamellae; "
            "limited hydration change; Schmorl nodes in adolescents; herniation uncommon (~0.25-4% of disc herniations)"
        ),
        "Ligaments": "ALL anterior, PLL posterior, endplate cartilage",
        "Muscles": "Indirect — erector spinae tension affects loading",
        "Innervation": "Sinuvertebral nerve (recurrent meningeal); outer annulus only; referred pain to chest wall possible",
        "Blood Supply": "Endplate diffusion nutrition; segmental vessels peripherally",
        "Biomechanics": "Resists compression; minimal flexion-extension contribution due to rib cage",
        "Normal ROM": "Disc contributes to micro-motion; macro ROM limited by ribs",
        "Arthrokinematics": "Nucleus migrates slightly with flexion-extension in free segments",
        "Osteokinematics": "Disc height loss with aging/degeneration less clinically prominent than lumbar",
        "Force Transmission": "Primary axial load bearer anterior column",
        "Shock Absorption": "Viscoelastic nucleus and annulus; rib cage shares load",
        "Respiratory Function": "Minimal direct; indirect via thoracic cage expansion",
        "Clinical Examination": "Central PA pain; flexion may provoke; dermatomal symptoms if herniation (rare)",
        "Palpation": "Not directly palpable; indirect via segmental tenderness",
        "Segmental Mobility": "Central PA spring; flexion opening",
        "Special Tests": "Slump test if radicular; Valsalva if discogenic radicular suspected",
        "Common Dysfunctions": "Internal disc disruption (rare thoracic), endplate edema Modic changes",
        "Common Pathologies": "Disc herniation, Scheuermann apophyseal ring, infection (discitis), tumor",
        "Imaging": "MRI gold standard; T2 signal loss degeneration; contrast for infection/tumor",
        "Manual Therapy": "Gentle mobilization; avoid aggressive flexion in acute radicular presentation",
        "Rehabilitation": "McKenzie extension if centralization (case dependent); core stability; gradual loading",
        "Mobility Exercises": "Cat-camel gentle range, rotation within tolerance",
        "Strengthening": "Progressive extension endurance, row patterns",
        "Return to Sport": "No radicular symptoms; MRI clearance if herniation; gradual axial loading",
        "Clinical Guidelines": "Thoracic disc herniation: conservative trial unless myelopathy; surgery for cord compression",
        "Evidence": "Surgical outcomes for thoracic disc herniation variable; conservative evidence limited case series",
        "References": "Wood KB thoracic disc herniation review; PubMed thoracic disc management",
    }
    records.append(("Thoracic Intervertebral Discs", disc))

    cv = {
        "ID": "JOINT-T-CV", "Vertebral Level": "T1-T10 typically (ribs 1-10 heads)",
        "Region": "Lateral vertebral body — rib head articulation",
        "Bone": "Rib head two facets (demifacets on two vertebrae except rib 1, 11, 12 variants)",
        "Facet Orientation": "Synovial planar/biplanar joint",
        "Disc Characteristics": "N/A",
        "Ligaments": "Radiate ligament (stout), intra-articular ligament rib 2-9 often, joint capsule",
        "Muscles": "Intercostals, levator costae, serratus posterior",
        "Innervation": "Intercostal nerve; joint referral to anterior chest wall",
        "Blood Supply": "Intercostal artery branches",
        "Biomechanics": "Rib elevation/depression; rotation of rib during respiration; stabilizes rib cage ring",
        "Normal ROM": "Small amplitude glides with breathing; larger with forced respiration and trunk motion",
        "Arthrokinematics": "Roll-glide with pump/bucket handle rib motion",
        "Osteokinematics": "Rib rises with inspiration, descends expiration",
        "Force Transmission": "Transfers lateral thoracic loads; coughing/Valsalva increases compressive load",
        "Shock Absorption": "Cartilaginous interface; ligamentous give",
        "Respiratory Function": "Primary — each costovertebral joint contributes to thoracic volume change",
        "Clinical Examination": "Pain with deep breath, cough, rotation; palpation costotransverse angle",
        "Palpation": "Posterior angle tenderness; spring test hypomobility",
        "Segmental Mobility": "Posteroanterior rib mobilization, muscle energy inhalation/exhalation",
        "Special Tests": "Hooking maneuver, rib spring test, reproducing with cough",
        "Common Dysfunctions": "Rib fixation, post-traumatic hypomobility, post-surgical pain",
        "Common Pathologies": "Costovertebral sprain, inflammatory arthritis, Tietze adjacent referral",
        "Imaging": "X-ray rarely shows; CT for fracture/dislocation; MRI for inflammation",
        "Manual Therapy": "Mulligan/snag rib elevation, MET, HVLA rib adjustment trained clinicians",
        "Rehabilitation": "Breathing retraining, thoracic rotation, intercostal stretching",
        "Mobility Exercises": "Side-lying rib expansion, seated rotation with breath",
        "Strengthening": "Serratus, intercostal endurance via resisted breathing devices (moderate evidence)",
        "Return to Sport": "Pain-free deep breathing and contact without rib pain",
        "Clinical Guidelines": "Differentiate cardiac vs musculoskeletal chest pain; red flags cardiac/pulmonary",
        "Evidence": "Manual therapy for rib dysfunction mostly expert opinion and case series",
        "References": "Greenman principles; manual medicine rib dysfunction texts",
    }
    records.append(("Costovertebral Joints", cv))

    ct = {
        "ID": "JOINT-T-CT", "Vertebral Level": "T1-T10 transverse process costal facets",
        "Region": "Posterolateral — rib tubercle on transverse process",
        "Bone": "Rib tubercle articulates with transverse process costal facet",
        "Facet Orientation": "Synovial; planar",
        "Disc Characteristics": "N/A",
        "Ligaments": "Superior/inferior costotransverse ligaments, lateral costotransverse ligament (rib 1)",
        "Muscles": "Levator costae brevis/longus, intercostals, rotatores",
        "Innervation": "Intercostal nerve dorsal branch region",
        "Blood Supply": "Dorsal intercostal branches",
        "Biomechanics": "Pivot for rib rotation in transverse plane; stabilizes rib during bucket handle",
        "Normal ROM": "Coupled with costovertebral and sternocostal motion",
        "Arthrokinematics": "Posterior glide with inspiration at some ribs",
        "Osteokinematics": "Rib external rotation during inspiration",
        "Force Transmission": "Rotational torque during upper limb loading via serratus/pec minor chain",
        "Shock Absorption": "Ligamentous restraint primary",
        "Respiratory Function": "Essential for rib cage kinematics",
        "Clinical Examination": "TTP at costotransverse angle; pain lifting arm if serratus/rib coupling involved",
        "Palpation": "Angle of rib posterior to axilla line; compare left/right spring",
        "Segmental Mobility": "Direct rib angle mobilization in side-lying/prone",
        "Special Tests": "Rib spring test; seated arm elevation reproducing pain",
        "Common Dysfunctions": "Hypomobile rib, slipping rib adjacent structures",
        "Common Pathologies": "Costotransverse sprain, stress from coughing, scoliosis asymmetry",
        "Imaging": "Usually normal X-ray; ultrasound for dynamic slipping rib",
        "Manual Therapy": "Rib raising techniques, MET, soft tissue intercostals",
        "Rehabilitation": "Scapular stability, breathing mechanics, gradual loading",
        "Mobility Exercises": "Quadruped serratus push, wall slides with expansion",
        "Strengthening": "Serratus punch, band pull-apart",
        "Return to Sport": "Asymmetric rib pain resolved; full push/pull",
        "Clinical Guidelines": "Rule out visceral pathology for unilateral chest wall pain",
        "Evidence": "Limited RCTs; clinical tradition strong in manual physiotherapy",
        "References": "Manual therapy rib cage literature; Heiderscheit TOS/rib interaction",
    }
    records.append(("Costotransverse Joints", ct))
    return records


VERTEBRAL_RECORDS: list[tuple[str, dict[str, Any]]] = (
    [build_vertebral_record(i) for i in range(1, 13)] + build_joint_records()
)


# ---------------------------------------------------------------------------
# Section 2: Ribs
# ---------------------------------------------------------------------------

RIB_FIELDS = [
    "ID", "Rib Number", "Type", "Articulations", "Muscle Attachments", "Ligament Attachments",
    "Blood Supply", "Innervation", "Biomechanics", "Movement During Inspiration",
    "Movement During Expiration", "Pump Handle Motion", "Bucket Handle Motion", "Caliper Motion",
    "Clinical Examination", "Palpation", "Spring Test", "Common Injuries", "Costochondritis",
    "Rib Fracture", "Slipping Rib Syndrome", "Intercostal Strain", "Manual Therapy",
    "Breathing Exercises", "Mobility", "Evidence", "References",
]


def _rib_type(n: int) -> str:
    if n <= 7:
        return "True rib (vertebrosternal)"
    if n <= 10:
        return "False rib (vertebrochondral)"
    return "Floating rib (vertebral only, no anterior sternal/costal cartilage attachment to sternum)"


def build_rib_record(n: int) -> tuple[str, dict[str, Any]]:
    rtype = _rib_type(n)
    if n == 1:
        art = "Single costovertebral facet on T1; costotransverse T1; costochondral junction; no sternocostal demifacet sharing"
        muscle = "Scalenus anterior/medius (TOS), subclavius groove, serratus anterior, intercostals, serratus posterior superior"
        bio = "Shortest broadest rib; protects subclavian vessels/brachial plexus; hypomobility linked to TOS"
        pump = "Minimal elevation — more caliper than pump due to obliquity"
        costo = "Uncommon at rib 1; more TOS/scalene overload"
        slip = "First rib elevated (cervical rib variant) mimics TOS; not classic slipping rib"
    elif n == 2:
        art = "Two demifacets T1-T2; costotransverse T2; costochondral; sternocostal angle prominent"
        muscle = "Serratus posterior superior, intercostals, levator scapulae adjacent fascia, rhomboid overlay"
        bio = "Longest rib; highest bucket handle arc; common post-MVA seatbelt fracture site"
        pump = "Moderate pump handle at sternocostal junction"
        costo = "Sternocostal angle T2 region costochondritis reported"
        slip = "Slipping rib syndrome more common lower ribs but possible 8-10"
    elif n <= 7:
        art = f"Demifacets T{n-1}-T{n}; costotransverse T{n}; costochondral cartilage; direct sternocostal articulation ribs 1-7"
        muscle = "External/internal/innermost intercostals, serratus anterior (ribs 1-8), transversus thoracis inner surface, levator costae"
        bio = f"True rib {n}; forms rigid thoracic ring; rotation and elevation in respiration; protects heart/lungs"
        pump = "Pump handle increases ribs 2-5; rib {0} contributes proportionally".format(n)
        costo = f"Costochondritis at rib {n} costochondral or sternocostal junction; reproducible palpation"
        slip = "Less common true ribs; rule out intercostal neuralgia"
    elif n <= 10:
        art = f"Costovertebral T{n-1}-T{n}; costotransverse; costal cartilage joins rib {n+1} cartilage (shared), not sternum directly"
        muscle = "Intercostals, diaphragm attachment lower ribs, transversus abdominis via costal margin, obliques"
        bio = f"False rib {n}; greater caliper motion; floating anterior attachment via cartilage cascade"
        pump = "Reduced direct sternal pump; indirect via cartilage unit ribs 8-10"
        costo = "Costochondral junction pain common; slipping rib syndrome ribs 8-10 classic"
        slip = f"Rib {n} hypermobile anterior cartilage — Hooking test positive; ultrasound diagnostic"
    else:
        art = f"Costovertebral T{n-1}-T{n}; often no costotransverse facet T11-T12 variants; no anterior sternal connection"
        muscle = "Quadratus lumborum (rib 12), serratus posterior inferior, iliocostalis lumborum, internal oblique"
        bio = f"Floating rib {n}; vulnerable tip trauma; QL attachment rib 12 clinically relevant"
        pump = "Negligible pump handle"
        costo = "Tip tenderness vs renal referral differential lower ribs"
        slip = "Rib 12 fracture more common than slipping; palpate free end"

    fields = {
        "ID": f"RIB-{n:02d}",
        "Rib Number": str(n),
        "Type": rtype,
        "Articulations": art,
        "Muscle Attachments": muscle,
        "Ligament Attachments": "Radiate ligament head; costotransverse superior/inferior/lateral; costochondral periosteum continuity",
        "Blood Supply": f"Intercostal artery branch {n}; anterior intercostal from internal thoracic (upper), musculophrenic (lower)",
        "Innervation": f"Intercostal nerve T{n} ventral ramus; lateral cutaneous branch; anterior cutaneous branch",
        "Biomechanics": bio,
        "Movement During Inspiration": "Elevation, external rotation, lateral translation (bucket/caliper/pump components by level)",
        "Movement During Expiration": "Depression, internal rotation, passive recoil of cartilage and lung elastic recoil",
        "Pump Handle Motion": pump,
        "Bucket Handle Motion": "Transverse plane lateral elevation ribs 6-10 primary; increases AP diameter",
        "Caliper Motion": "Lower ribs 8-12 increase transverse thoracic diameter; minimal sternal rise",
        "Clinical Examination": "Observe breathing pattern; palpate length of rib; spring test; cough/sneeze repro; neuro screen intercostal",
        "Palpation": f"Posterior angle rib {n}, costochondral junction anterior, compare symmetry",
        "Spring Test": "Posterior-anterior pressure on rib angle; assess hypomobility vs hypermobility/pain",
        "Common Injuries": "Contusion, stress fracture (rowers, golfers), avulsion in contact sports",
        "Costochondritis": costo,
        "Rib Fracture": f"Fracture rib {n}: point tenderness, crepi, pain inspiration; X-ray often needed; protect breathing; avoid flail if multiple",
        "Slipping Rib Syndrome": slip,
        "Intercostal Strain": f"Intercostal muscle strain rib {n} interspace: sharp pain twist/sneeze; palpation intercostal groove tenderness",
        "Manual Therapy": "Rib mobilization grade I-IV, soft tissue intercostals, MET inhalation/exhalation, taping support",
        "Breathing Exercises": "Diaphragmatic breathing, pursed lip, segmental expansion painful side, avoided Valsalva early",
        "Mobility": "Thoracic rotation, serratus wall slide, gentle rib expansion side-lying",
        "Evidence": "Rib fracture management: analgesia and pulmonary hygiene (NICE trauma); manual therapy evidence low quality",
        "References": "Miller slipping rib syndrome; De Maeseneer costochondritis review; Bordoni intercostal muscles",
    }
    return (f"Rib {n}", fields)


RIB_RECORDS: list[tuple[str, dict[str, Any]]] = [build_rib_record(i) for i in range(1, 13)]


# ---------------------------------------------------------------------------
# Section 3: Thoracic muscles
# ---------------------------------------------------------------------------

def _muscle(
    rid: str, name: str, origin: str, insertion: str, innerv: str, blood: str,
    fiber: str, primary: str, secondary: str, resp: str, stab: str, couple: str,
    emg: str, stretch: str, strengthen: str, tp: str, referral: str, tests: str,
    injuries: str, rehab: str, refs: str,
) -> tuple[str, dict[str, Any]]:
    return (name, {
        "ID": rid, "Name": name, "Origin": origin, "Insertion": insertion,
        "Innervation": innerv, "Blood Supply": blood, "Fiber Direction": fiber,
        "Primary Function": primary, "Secondary Function": secondary,
        "Respiratory Function": resp, "Stabilizing Role": stab, "Force Couple": couple,
        "EMG": emg, "Stretch": stretch, "Strengthening": strengthen,
        "Trigger Points": tp, "Pain Referral": referral, "Clinical Tests": tests,
        "Common Injuries": injuries, "Rehabilitation": rehab, "References": refs,
    })


MUSCLE_RECORDS: list[tuple[str, dict[str, Any]]] = [
    _muscle(
        "MUS-T-001", "Multifidus (Thoracic)",
        "Sacrum to C2 spinous processes — thoracic portion from thoracic SPs and laminae",
        "Spinous process 2-4 segments superior",
        "Medial branch dorsal rami segmental",
        "Segmental dorsal branches, lumbar/thoracic arteries",
        "Oblique cephalad from lateral origin to medial insertion",
        "Segmental spinal stabilization; extension; contralateral rotation",
        "Controls neutral zone; proprioceptive feedback",
        "Minimal direct; stabilizes rib cage base during forced expiration",
        "Deep local stabilizer with transversus thoracis/intercostals",
        "Couples with transversus abdominis via thoracolumbar fascia",
        "High activation extension and rotation tasks; chronic LBP/thoracic pain shows atrophy",
        "Child pose rotation away, seated lumbar lock thoracic stretch indirect",
        "Bird dog, prone extension holds, segmental multifidus cueing at T/L junction",
        "Paraspinal TP medial to facet line",
        "Local paraspinal pain; may refer adjacent segment",
        "Palpation tone; ultrasound thickness; no isolated strength test",
        "Strain rare; atrophy with chronic pain; post-surgical dissection",
        "Motor control retraining, isometric holds, progressive loading",
        "Hides JA multifidus size and LBP; MacDonald multifidus activation",
    ),
    _muscle(
        "MUS-T-002", "Rotatores (Thoracic)",
        "Thoracic transverse processes",
        "Lamina and spinous process 1-2 segments above",
        "Medial branch dorsal rami",
        "Segmental arteries",
        "Oblique short fibers — most developed in thoracic spine",
        "Fine segmental rotation and extension",
        "Proprioception; facet joint positioning",
        "Stabilizes during intercostal breathing",
        "Deep segmental stabilizer with multifidus",
        "Works with semispinalis for rotation control",
        "Moderate in rotation; low in quiet standing",
        "Thoracic rotation stretch open book",
        "Prone rotation isometrics, quadruped reach-through",
        "Deep paraspinal TP difficult to isolate",
        "Segmental paraspinal ache",
        "Segmental rotation resistance",
        "Overuse with repetitive rotation sports",
        "Rotation mobility plus endurance",
        "Bogduk deep paraspinal anatomy",
    ),
    _muscle(
        "MUS-T-003", "Semispinalis Thoracis",
        "Transverse processes T6-T10 (variable)",
        "Spinous processes T1-T4 and C6-C7 region",
        "Dorsal rami thoracic",
        "Dorsal branches segmental, occipital artery superiorly",
        "Long parallel fibers cephalad",
        "Thoracic and cervicothoracic extension; ipsilateral rotation",
        "Head/neck extension when cervical portion acts",
        "Accessory expiration when active",
        "Global extensor stabilizing kyphosis control",
        "Couples with contralateral multifidus",
        "High in extension against gravity; moderate rotation",
        "Prayer stretch, foam roller mid-thoracic extension",
        "Prone Y/T/W, extension endurance holds",
        "TP along muscle belly paraspinal lateral to SP",
        "Referral to scapular region and lower cervical",
        "Extension strength prone lift",
        "Strain in weightlifting; trigger point headaches cervicothoracic",
        "Gradual extension loading, scapular integration",
        "Kapandji spinal muscles; Travell trigger point maps",
    ),
    _muscle(
        "MUS-T-004", "Erector Spinae (Iliocostalis & Longissimus Thoracis)",
        "Iliac crest, sacrum, lumbar SPs (common erector mass)",
        "Ribs (iliocostalis), thoracic TP/SP (longissimus), skull (longissimus capitis cephalad)",
        "Dorsal rami segmental",
        "Cervical, intercostal, lumbar arteries",
        "Long vertical columns lateral to transversospinalis",
        "Global spinal extension; lateral flexion; ipsilateral rotation",
        "Postural maintenance upright stance",
        "Forced expiration accessory; stabilizes trunk during cough",
        "Antigravity extensor chain",
        "Force couple with rectus abdominis front-back; with hamstrings via fascia",
        "High deadlift, extension, heavy carry; moderate walking",
        "Child's pose, knee-to-chest partial flexion stretch",
        "Romanian deadlift, back extension, good morning (advanced), row",
        "Lateral paraspinal TP common",
        "Diffuse paraspinal referral gluteal (iliocostalis lumborum overlap)",
        "Sorensen extension endurance test (lumbar bias but extensor global)",
        "Muscle strain, DOMS, overuse hyperextension sports",
        "Progressive extensor endurance, hip hinge pattern",
        "McGill big three adapted; Neumann erector spinae mechanics",
    ),
    _muscle(
        "MUS-T-005", "Serratus Posterior Superior",
        "Ligamentum nuchae, C7-T3 SPs",
        "Ribs 2-5 superior aspect",
        "Intercostal nerves T1-T5 anterior rami branches",
        "Intercostal and supreme intercostal arteries",
        "Oblique inferolateral",
        "Elevates ribs 2-5 (accessory inspiration)",
        "May extend spine slightly via rib attachment",
        "Classic accessory inspiratory muscle — disputed by some modern EMG studies",
        "Stabilizes upper rib cage during arm elevation",
        "Couples with scalenes and upper trapezius during apical breathing",
        "Low-moderate forced inspiration; minimal quiet breathing",
        "Side-lying rib depression stretch",
        "Deep breathing resisted, serratus anterior strengthening primary clinically",
        "TP deep to rhomboids",
        "Deep ache under scapula, referral to posterior shoulder",
        "Palpation deep rhomboid layer; breathing repro",
        "Overuse with apical breathing pattern dysfunction",
        "Diaphragmatic retraining, scapular exercises",
        "Bordoni serratus posterior nomenclature debate",
    ),
    _muscle(
        "MUS-T-006", "Serratus Posterior Inferior",
        "T11-L2 spinous processes, thoracolumbar fascia",
        "Ribs 9-12 inferior border",
        "Intercostal nerves T9-L2",
        "Intercostal and lumbar arteries",
        "Oblique inferolateral",
        "Depresses lower ribs (accessory expiration)",
        "Assists trunk extension via rib pull",
        "Forced expiration and coughing",
        "Lower rib cage stabilization",
        "Couples with obliques and QL",
        "Moderate forced expiration",
        "Side-lying lower rib expansion",
        "Oblique crunches, expiration against resistance",
        "TP over lower ribs posterior",
        "Lower thoracic flank pain",
        "Palpation inferior rib angle tenderness",
        "Strain with persistent cough",
        "Breathing retraining post-respiratory illness",
        "Moore Clinically Oriented Anatomy",
    ),
    _muscle(
        "MUS-T-007", "External Intercostals",
        "Inferior border rib above",
        "Superior border rib below — oblique inferoanterior",
        "Intercostal nerve same level",
        "Intercostal artery",
        "Oblique anteroinferior (same direction as external oblique)",
        "Elevate ribs in inspiration; stiffen interspace",
        "Prevent inward sucking during inspiration",
        "Primary inspiratory intercostal layer",
        "Rib cage hoop integrity",
        "Couples with diaphragm descent",
        "Active quiet and forced inspiration",
        "Side-lying open painful side, rotation away",
        "Inspiratory resisted breathing, swimming endurance",
        "TP in intercostal groove",
        "Anterior chest wall along rib",
        "Palpation intercostal groove; pain with deep breath",
        "Intercostal strain, tear rare",
        "Gradual return to rotation sports",
        "De Troyer respiratory mechanics",
    ),
    _muscle(
        "MUS-T-008", "Internal Intercostals",
        "Superior border costal groove rib below",
        "Inferior border rib above — oblique inferoposterior",
        "Intercostal nerve",
        "Intercostal vessels",
        "Oblique posteroinferior (perpendicular to external)",
        "Depress ribs (esp lower interspaces expiration); subcostales portion",
        "Stabilize interspace",
        "Forced expiration primary",
        "Prevent excessive rib elevation",
        "Couples with transversus thoracis",
        "High forced expiration cough",
        "Seated slump opening anterior chest",
        "Forced expiration resisted, pursed lip",
        "Deep TP near sternum posterior intercostal",
        "Anterior chest referral",
        "Pain with cough/manual intercostal resistance",
        "Intercostal strain common",
        "Breathing control, gradual loading",
        "Bordoni intercostal functional anatomy",
    ),
    _muscle(
        "MUS-T-009", "Innermost Intercostals (Transversus Thoracis component)",
        "Inner surface thoracic cage — transversus thoracis from sternum; innermost intercostals in interspaces",
        "Opposite rib/costal cartilage internal surface",
        "Intercostal nerves",
        "Intercostal vessels",
        "Transverse horizontal on inner wall",
        "Depress ribs; stiffen thoracic wall",
        "Protect viscera; minimal ROM change",
        "Expiration; stabilize during Valsalva",
        "Deep thoracic wall stabilizer",
        "Works with internal intercostals and diaphragm",
        "Moderate Valsalva/cough",
        "Diaphragmatic expansion indirectly",
        "Transversus thoracis isometric cough training",
        "Not commonly described TP",
        "Deep sternal pain rare",
        "Not isolated clinically",
        "Rare",
        "Post-operative cardiac/thoracic surgery breathing",
        "Standring Gray's Anatomy thoracic wall",
    ),
    _muscle(
        "MUS-T-010", "Diaphragm",
        "Xiphoid, lower 6 ribs costal margin, L1-L3 vertebral bodies/right crus",
        "Central tendon",
        "Phrenic nerve C3-C5",
        "Pericardiacophrenic, musculophrenic, inferior phrenic arteries",
        "Radial fibers to central tendon; crural portions",
        "Primary inspiratory muscle — 70-80% tidal volume quiet breathing",
        "Increases intra-abdominal pressure; sphincter esophagus crural part",
        "Essential respiration; accessory roles postural",
        "Lumbopelvic stability via IAP with pelvic floor/transversus",
        "Couples with pelvic floor and TA — anticipatory postural",
        "Continuous tonic activity; increases with exercise",
        "Crocodile breathing, child pose side stretch indirect",
        "Supine 90-90 breathing, weighted breathing, dead bug",
        "Trigger points crura and costal margin (controversial)",
        "Referred shoulder (Kehr phenomenon surgical); neck via scalene compensation",
        "Observation breathing pattern; hi-lo test; MIP/MEP spirometry medical",
        "Hiatus hernia, eventration, paralysis phrenic nerve",
        "Diaphragmatic breathing retraining, post-COVID pulmonary rehab",
        "Kolar et al postural-respiratory function; McKenzie breathing",
    ),
    _muscle(
        "MUS-T-011", "Latissimus Dorsi",
        "Spinous processes T7-S5, thoracolumbar fascia, iliac crest, lower 3-4 ribs",
        "Floor of bicipital groove humerus (teres major junction)",
        "Thoracodorsal nerve C6-C8",
        "Thoracodorsal artery",
        "Broad fan — horizontal lower, oblique superior fibers",
        "Shoulder extension, adduction, internal rotation",
        "Depression of scapula via humeral action; forced expiration accessory",
        "Accessory expiration when arms fixed",
        "Thoracolumbar fascia tension; anti-flexion",
        "Couples with glute max in posterior chain; contralateral lat-glute",
        "High pull-ups, swimming, throwing deceleration",
        "Child pose arm reach, overhead lat stretch",
        "Pull-up, lat pulldown, single arm row, straight arm pulldown",
        "TP inferior angle scapula region",
        "Referral to mid-back and down arm posterior",
        "Reach test; lat length overhead",
        "Strain, tendinopathy humeral insertion, overuse swimmers",
        "Gradual pull progression, scapular control",
        "Neumann latissimus mechanics; Escamilla EMG lat pull",
    ),
    _muscle(
        "MUS-T-012", "Rhomboid Major",
        "Spinous processes T2-T5",
        "Medial border scapula below spine",
        "Dorsal scapular nerve C4-C5",
        "Dorsal scapular artery",
        "Oblique inferolateral",
        "Scapular retraction; downward rotation component; elevation assist",
        "Scapular stabilization during rowing",
        "Minimal respiratory",
        "Maintains scapula on thorax",
        "Couples with middle trapezius retraction; antagonist serratus anterior",
        "High rowing, high retraction holds",
        "Wall angel, doorway stretch pec minor indirect",
        "Row, face pull, prone rhomboid squeeze",
        "TP medial scapular border",
        "Interscapular ache, referral to rhomboid region",
        "Manual muscle test retraction; scapular dyskinesis observation",
        "Overuse rowing; strain",
        "Scapular retraction endurance, lower trap balance",
        "Cools AM scapular muscle EMG",
    ),
    _muscle(
        "MUS-T-013", "Rhomboid Minor",
        "Spinous processes C7-T1",
        "Medial scapular border at spine level",
        "Dorsal scapular nerve",
        "Dorsal scapular artery",
        "Oblique inferolateral short fibers",
        "Retraction; slight elevation scapula",
        "Cervicothoracic transition stability",
        "Minimal",
        "Upper scapular control",
        "With levator scapulae for elevation-retraction",
        "Moderate retraction tasks",
        "Seated rotation stretch",
        "Same as rhomboid major",
        "TP at medial superior scapula",
        "Upper interscapular pain, neck referral",
        "Palpation C7-T1 region",
        "Postural overload desk workers",
        "Postural education, thoracic mobility",
        "Travell rhomboid trigger points",
    ),
    _muscle(
        "MUS-T-014", "Trapezius — Upper Fibers",
        "Occipital protuberance, nuchal ligament, C7 SP",
        "Lateral third clavicle, acromion",
        "Accessory nerve XI, C3-C4 proprioception",
        "Transverse cervical/suprascapular arteries",
        "Oblique inferolateral",
        "Scapular elevation; upward rotation assist; neck extension",
        "Occipital stabilization",
        "Apical breathing accessory when hypertonic",
        "Cervicothoracic posture",
        "Couples with serratus anterior for upward rotation",
        "High overhead lifting, shrugs",
        "Upper trap stretch side bend away",
        "Shrug, overhead carry (moderate load)",
        "TP common at angle neck-shoulder",
        "Headache, neck pain, lateral shoulder",
        "Shrug strength; upper trap overactivity in impingement",
        "Tension neck syndrome, whiplash",
        "Scapular motor control, lower trap emphasis",
        "Cools trapezius EMG divisions",
    ),
    _muscle(
        "MUS-T-015", "Trapezius — Middle Fibers",
        "C7-T3 spinous processes",
        "Spine of scapula",
        "Accessory nerve XI",
        "Transverse cervical artery",
        "Horizontal",
        "Scapular retraction",
        "Thoracic extension assist via scapula",
        "Minimal",
        "Scapular centralization",
        "Force couple with serratus anterior protraction/retraction balance",
        "High rowing horizontal abduction",
        "Pec stretch, thoracic extension",
        "Row, band pull-apart, prone T",
        "TP interscapular",
        "Interscapular pain",
        "Retraction MMT",
        "Postural strain",
        "Retraction endurance",
        "Reinold scapular biomechanics",
    ),
    _muscle(
        "MUS-T-016", "Trapezius — Lower Fibers",
        "T4-T12 spinous processes",
        "Medial spine scapula apex tubercle region",
        "Accessory nerve XI",
        "Transverse cervical artery",
        "Oblique superolateral",
        "Scapular depression; upward rotation; posterior tilt assist",
        "Counteracts upper trap elevation dominance",
        "Minimal",
        "Scapulothoracic rhythm  upward rotation",
        "Primary upward rotation couple with serratus anterior",
        "High overhead, swimming recovery phase",
        "Child pose arms overhead",
        "Prone Y, wall slide lower trap, scaption",
        "TP inferior medial scapula",
        "Interscapular lower pain",
        "Prone Y hold endurance test",
        "Weakness in overhead athletes impingement",
        "Lower trap strengthening progression",
        "Kibler scapula dyskinesis",
    ),
]


# ---------------------------------------------------------------------------
# Section 4: Breathing mechanics
# ---------------------------------------------------------------------------

def _breath(
    rid: str, movement: str, muscles: str, joints: str, rib: str, thoracic: str,
    accessory: str, diaphragm: str, pressure: str, assess: str, pattern: str,
    dysfunction: str, corrective: str, evidence: str, refs: str,
) -> tuple[str, dict[str, Any]]:
    return (movement, {
        "ID": rid, "Movement": movement, "Muscles": muscles, "Joint Motion": joints,
        "Rib Motion": rib, "Thoracic Motion": thoracic, "Accessory Muscles": accessory,
        "Diaphragm Function": diaphragm, "Pressure Changes": pressure,
        "Clinical Assessment": assess, "Breathing Pattern": pattern,
        "Common Dysfunction": dysfunction, "Corrective Exercises": corrective,
        "Evidence": evidence, "References": refs,
    })


BREATHING_RECORDS = [
    _breath(
        "BRTH-001", "Diaphragmatic (Abdominal) Breathing",
        "Diaphragm primary; external intercostals; minimal accessory",
        "Costovertebral and sternocostal glides; thoracic spine subtle extension on deep inhale",
        "Lower rib lateral expansion (bucket/caliper); minimal superior rib rise",
        "Lower thoracic expansion; posterior-lateral excursion",
        "Scalenes, SCM, upper trap minimally active",
        "Descent increases vertical thoracic dimension; dome flattens; efficient O2 cost",
        "Inspiratory negative intrathoracic; increased intra-abdominal pressure coordinated with pelvic floor",
        "Observe hand on abdomen vs chest; hi-lo test supine; count respiratory rate",
        "Slow nasal inhale 360-degree rib expansion; exhale via pursed lips or relaxed mouth",
        "Paradoxical pattern, hyperventilation, stress breathing upper chest only",
        "90-90 breathing, crocodile breathing, balloon blowing exhalation, dead bug coordination",
        "Diaphragmatic training improves GERD, anxiety symptoms Level B; athletic performance mixed",
        "McConnell respiratory; Chaitow breathing pattern disorders",
    ),
    _breath(
        "BRTH-002", "Apical (Clavicular) Breathing",
        "Scalenes, SCM, upper trapezius, pectoralis minor, levator scapulae",
        "First rib elevation; limited costovertebral bucket handle",
        "Superior rib elevation pump handle dominant; poor lateral expansion",
        "Upper thoracic extension; cervical protraction often coupled",
        "High accessory muscle reliance",
        "Diaphragm underutilized; shallow tidal volume",
        "Rapid shallow breathing; increased accessory muscle oxygen demand",
        "Observe superior rib cage rise; palpate SCM/scalene overactivity",
        "Visible shoulder elevation on inhale; mouth breathing common",
        "TOS risk, neck pain, hyperventilation syndrome, poor CO2 tolerance",
        "Diaphragm retraining, soft tissue scalenes, first rib mobilization, postural correction",
        "Linked to chronic neck pain; causation vs correlation debated",
        "Bradley apical breathing and neck disorders",
    ),
    _breath(
        "BRTH-003", "Accessory Breathing",
        "SCM, scalenes, pec minor, serratus anterior, upper trap, erector spinae, lat (fixed arms)",
        "Increased costovertebral motion; scapular protraction/elevation",
        "Exaggerated pump and bucket handle all levels",
        "Extension and rotation with forced breath",
        "All listed accessory muscles — active in exercise and respiratory distress",
        "Diaphragm plus accessory for increased ventilation demand",
        "Large negative intrapleural pressure; IAP rise with effort",
        "Observation at rest vs exertion; capnography if hyperventilation",
        "Normal during high-intensity exercise; pathological at rest",
        "Chronic overuse accessory at rest; muscle fatigue; poor recovery",
        "Graded exercise tolerance, diaphragm priority at rest, interval training",
        "Accessory muscle fatigue in COPD well documented; athletic extrapolation",
        "De Troyer accessory muscle respiratory mechanics",
    ),
    _breath(
        "BRTH-004", "Paradoxical Breathing",
        "Diaphragm paralysis/dysfunction; abdominal wall paradoxical inward draw",
        "Costovertebral motion reversed or absent; sternal retraction on inhale",
        "Ribs may draw inward on inspiration instead of expansion",
        "Flaring or collapse inconsistent with normal kinematics",
        "Compensatory extreme accessory use",
        "Absent or weak diaphragm contraction unilateral/bilateral",
        "Inefficient ventilation; may see indrawing intercostal spaces",
        "Visual inspection supine; fluoroscopy/ultrasound medical; MIP testing",
        "Inward abdominal wall motion during inhale",
        "Phrenic nerve injury, COPD hyperinflation, post-surgical, obesity",
        "Medical workup first; inspiratory muscle training if appropriate; surgical plication severe cases",
        "Documented in diaphragm paralysis; rehab case series inspiratory muscle training",
        "McCool diaphragm dysfunction review",
    ),
]


# ---------------------------------------------------------------------------
# Section 5: Scapular biomechanics
# ---------------------------------------------------------------------------

def _scap(
    rid: str, movement: str, plane: str, axis: str, primary: str, secondary: str,
    couples: str, joint: str, rhythm: str, emg: str, importance: str,
    dysfunction: str, assess: str, corrective: str, progressions: str, refs: str,
) -> tuple[str, dict[str, Any]]:
    return (movement, {
        "ID": rid, "Movement": movement, "Plane": plane, "Axis": axis,
        "Primary Muscles": primary, "Secondary Muscles": secondary,
        "Force Couples": couples, "Joint Contribution": joint,
        "Scapulohumeral Rhythm": rhythm, "EMG": emg, "Clinical Importance": importance,
        "Common Dysfunctions": dysfunction, "Assessment": assess,
        "Corrective Exercises": corrective, "Progressions": progressions, "References": refs,
    })


SCAPULAR_RECORDS = [
    _scap("SCAP-001", "Elevation", "Frontal", "Anterior-posterior through scapula",
          "Upper trapezius, levator scapulae", "Rhomboids minor assist",
          "Upper trap/levator vs lower trap depression couple",
          "AC joint slight; scapulothoracic glide superior",
          "Necessary first 30 deg humeral elevation before upward rotation dominates",
          "High shrugs; moderate initial abduction",
          "Overhead reach, carrying loads, apical breathing",
          "Upper trap dominance, levator tightness, TOS posture",
          "Shrug test; observation overhead",
          "Lower trap emphasis, upper trap stretch, scapular setting",
          "Wall slide without elevation → weighted overhead",
          "Kibler scapula kinematics"),
    _scap("SCAP-002", "Depression", "Frontal", "AP axis",
          "Lower trapezius, pectoralis minor (from rib pull), latissimus via humerus fixed",
          "Serratus anterior lower fibers",
          "Lower trap/serratus vs upper trap",
          "Scapulothoracic inferior glide",
          "Counterpart to elevation in arm lowering",
          "High lowering phase pull-up; rowing eccentric",
          "Pull-ups, dips, push-up plus",
          "Depression weakness in overhead athletes",
          "Prone Y; observation sag during push-up",
          "Push-up plus, dip support holds",
          "Band assisted → full dip depression control",
          "Reinold scapular depression"),
    _scap("SCAP-003", "Upward Rotation", "Coronal oblique", "Transverse through scapula",
          "Serratus anterior, lower trapezius", "Upper trapezius",
          "Serratus + lower trap primary couple — most critical for overhead",
          "GH abduction/flexion coupled 2:1 rhythm overall",
          "~1 deg scap upward rotation per 2 deg humeral elevation after initial phase",
          "Very high overhead activities swimming throwing",
          "Impingement prevention; full flexion 180 deg",
          "Serratus weakness winging; lower trap insufficiency",
          "Scapular dyskinesis type II; wall slide; LSST",
          "Serratus punch, wall slide, prone Y",
          "Isometric → band → full overhead sport",
          "Ludewig scapulothoracic rhythm"),
    _scap("SCAP-004", "Downward Rotation", "Coronal oblique", "Transverse",
          "Rhomboids major/minor, levator scapulae, pec minor",
          "Middle trapezius eccentric",
          "Rhomboids/levator vs serratus/lower trap",
          "Scapulothoracic downward rotation; glenoid tilts inferiorly",
          "Coupled with humeral extension/adduction during pull-through",
          "High rowing, lat pull, climbing pull phases",
          "Climbing, rowing, swimming pull-through, cross-country ski poling",
          "Overactive rhomboids postural pain; scapular downward rotation dominance",
          "Row end-range retraction hold; observation during lat pull",
          "Row, face pull with external rotation, rhomboid endurance",
          "Light band → heavy row → weighted pull-ups",
          "Cools rowing EMG"),
    _scap("SCAP-005", "Protraction", "Transverse", "Vertical sagittal",
          "Serratus anterior", "Pectoralis major/minor assist",
          "Serratus vs rhomboids retraction couple",
          "Scapula slides around rib cage anteriorly",
          "Reach and punch motions; serratus-on-wall glide",
          "High punching, push-up plus, throwing follow-through",
          "Push reach sports, bench press, overhead press stability",
          "Serratus weakness winging; long thoracic nerve injury",
          "Push-up plus test; wall punch; dynamic scapular dyskinesis",
          "Serratus wall slide, push-up plus, band protraction",
          "Knees → standard → single arm → plyometric punch",
          "Martin serratus anterior review"),
    _scap("SCAP-006", "Retraction", "Transverse", "Vertical sagittal",
          "Middle trapezius, rhomboids", "Lat posterior fibers",
          "Middle trap/rhomboid vs serratus/pec minor",
          "Scapula medial glide on thorax",
          "Rowing phase; posture",
          "High horizontal pull",
          "Desk posture dysfunction; interscapular pain",
          "Rounded shoulders; poor scapular control",
          "Retraction endurance test",
          "Band pull-apart, row, prone T",
          "Endurance → load",
          "Cools retraction EMG"),
    _scap("SCAP-007", "Internal Rotation (Scapular)", "Transverse", "Vertical",
          "Pectoralis minor, levator scapulae, upper trap", "Anterior deltoid via humerus",
          "Pec minor vs lower trap posterior tilt",
          "Coracoid moves inferior-medial",
          "Often coupled protraction",
          "Moderate bench press bottom",
          "Forward head posture component",
          "Pec minor shortness; thoracic outlet risk",
          "Horizon test pec minor length",
          "Pec stretch, lower trap/Y raises",
          "Stretch → strengthen posterior chain",
          "Borstad pec minor length"),
    _scap("SCAP-008", "External Rotation (Scapular)", "Transverse", "Vertical",
          "Middle/lower trapezius, serratus", "Rhomboids eccentric control",
          "Posterior tilt couple with external rotation",
          "Posterior scapula rotates on rib cage",
          "Overhead external rotation preparation",
          "High throwing cocking phase indirectly",
          "Throwing athletes scapular control",
          "Lost ER scapular in impingement",
          "Observation throwing; wall test",
          "External rotation rows, prone horizontal abduction ER",
          "Band ER → weighted",
          "Myers scapular ER throwing"),
    _scap("SCAP-009", "Anterior Tilt", "Sagittal", "Medial-lateral scapula",
          "Pectoralis minor, levator scapulae", "Short head biceps via coracoid",
          "Pec minor vs lower trap posterior tilt",
          "Inferior angle lifts off thorax",
          "Early elevation; poor overhead",
          "Moderate unless pathological",
          "Impingement; subacromial space reduction",
          "Excessive anterior tilt dyskinesis",
          "Inferior angle palpation off rib cage",
          "Lower trap, serratus, thoracic extension",
          "Wall angels, foam roller extension",
          "Ludewig anterior tilt impingement"),
    _scap("SCAP-010", "Posterior Tilt", "Sagittal", "Medial-lateral",
          "Lower trapezius, serratus anterior", "Middle trapezius",
          "Lower trap/serratus vs pec minor",
          "Superior scapula rotates posterior; increases subacromial space",
          "Critical 120-180 deg elevation",
          "Very high overhead throwing serving",
          "Impingement prevention",
          "Insufficient posterior tilt in overhead athletes",
          "Wall slide observation; Kibler dyskinesis",
          "Prone Y, wall slide, scaption",
          "Low load → sport specific",
          "Reinold posterior tilt exercises"),
]


# ---------------------------------------------------------------------------
# Section 6: Thoracic Outlet Syndrome
# ---------------------------------------------------------------------------

TOS_TYPE_RECORDS = [
    ("TOS — Neurogenic (nTOS)", {
        "ID": "TOS-001", "Type": "Neurogenic TOS (most common ~95%)",
        "Compression Site": "Interscalene triangle, costoclavicular space, subpectoral/minor space",
        "Structures Compressed": "Brachial plexus lower trunk (C8-T1) most often; upper trunk less common",
        "Symptoms": "Unilateral arm paresthesia ulnar distribution, hand intrinsic weakness, neck-shoulder pain, worse overhead",
        "Differential Diagnosis": "Cervical radiculopathy, peripheral neuropathy, CTS, Pancoast tumor, MS",
        "Special Tests": "Roos, Adson, Wright, upper limb tension, Tinel at scalene",
        "Imaging": "X-ray cervical rib; MRI brachial plexus; EMG/NCS if chronic",
        "Conservative Management": "Postural correction, first rib mobilization, scalene soft tissue, strengthening middle/lower trap",
        "Exercises": "Chin tuck, scapular retraction, nerve glides cautious, diaphragmatic breathing",
        "Return to Sport": "Overhead tolerance without paresthesia; strength symmetric; gradual throw/swim progression",
        "Evidence": "Conservative success 50-90% mild-moderate; surgery reserved failed rehab documented vascular or severe neuro",
        "References": "Sanders TOS classification; Nord KM conservative nTOS outcomes",
    }),
    ("TOS — Venous (vTOS)", {
        "ID": "TOS-002", "Type": "Venous TOS (Paget-Schroetter effort thrombosis)",
        "Compression Site": "Costoclavicular space subclavian vein",
        "Structures Compressed": "Subclavian vein",
        "Symptoms": "Arm swelling, cyanosis, heaviness, venous distention, sudden after exertion",
        "Differential Diagnosis": "DVT other causes, lymphedema, cellulitis",
        "Special Tests": "Adson less specific; imaging primary — duplex US, venography",
        "Imaging": "Duplex ultrasound, CT/MR venography, D-dimer",
        "Conservative Management": "Anticoagulation medical; thrombolysis acute; then rib resection often surgical",
        "Exercises": "Post-surgical rehab only after medical clearance; scapular stabilization later",
        "Return to Sport": "Medical team clearance; often months; contact sports individualized",
        "Evidence": "Acute thrombolysis plus decompression standard; delay increases chronic disability",
        "References": "Illig venous TOS guidelines; Thompson effort thrombosis",
    }),
    ("TOS — Arterial (aTOS)", {
        "ID": "TOS-003", "Type": "Arterial TOS (rare)",
        "Compression Site": "Subclavian artery scalene/costoclavicular",
        "Structures Compressed": "Subclavian artery",
        "Symptoms": "Arm claudication, cold pale hand, pulse deficit, embolic phenomena",
        "Differential Diagnosis": "Peripheral arterial disease, embolic stroke young patient, vasculitis",
        "Special Tests": "Adson pulse change; imaging mandatory",
        "Imaging": "CT/MR angiography, arterial duplex",
        "Conservative Management": "Rarely sufficient; surgical decompression/resection cervical rib",
        "Exercises": "Post-op rehab similar neurogenic without vascular stress",
        "Return to Sport": "Specialist guided; vascular monitoring",
        "Evidence": "Surgery recommended to prevent embolic complications",
        "References": "Illig arterial TOS; Sanders aTOS outcomes",
    }),
]

TOS_TEST_RECORDS = [
    ("TOS Special Test — Roos (Elevated Arm Stress Test)", {
        "ID": "TOS-T-001", "Type": "Special Test — Roos",
        "Compression Site": "Costoclavicular and subpectoral spaces under load",
        "Structures Compressed": "Brachial plexus and subclavian vessels",
        "Symptoms": "Reproduction paresthesia or heaviness within 3 minutes",
        "Differential Diagnosis": "Not diagnostic alone — combine history and other tests",
        "Special Tests": "Procedure: arms 90 deg abduction ER, open/close hands 3 min; positive = symptom reproduction",
        "Imaging": "N/A for test",
        "Conservative Management": "N/A",
        "Exercises": "N/A",
        "Return to Sport": "N/A",
        "Evidence": "Sensitivity moderate; specificity low — better as stress reproducer than rule-out",
        "References": "Gillen TOS tests systematic review",
    }),
    ("TOS Special Test — Adson (Scalene Maneuver)", {
        "ID": "TOS-T-002", "Type": "Special Test — Adson",
        "Compression Site": "Interscalene triangle",
        "Structures Compressed": "Subclavian artery (primarily); brachial plexus",
        "Symptoms": "Pulse diminution and/or symptom reproduction",
        "Differential Diagnosis": "Vascular vs neurogenic differentiation",
        "Special Tests": "Extend neck ipsilateral, rotate to affected side, hold breath; palpate radial pulse",
        "Imaging": "Follow positive with duplex if vascular suspected",
        "Conservative Management": "N/A",
        "Exercises": "N/A",
        "Return to Sport": "N/A",
        "Evidence": "Low sensitivity/specificity for nTOS; some utility vascular",
        "References": "Rayan Adson test critique",
    }),
    ("TOS Special Test — Wright (Hyperabduction)", {
        "ID": "TOS-T-003", "Type": "Special Test — Wright",
        "Compression Site": "Subpectoral/minor space, costoclavicular",
        "Structures Compressed": "Neurovascular bundle under pectoralis minor",
        "Symptoms": "Paresthesia or pulse change with hyperabduction",
        "Differential Diagnosis": "Pec minor syndrome overlap",
        "Special Tests": "Arm passively hyperabducted 180 deg; monitor pulse and symptoms 1-3 min",
        "Imaging": "N/A",
        "Conservative Management": "N/A",
        "Exercises": "N/A",
        "Return to Sport": "N/A",
        "Evidence": "Moderate sensitivity neurogenic in some series",
        "References": "Gillen TOS physical exam",
    }),
    ("TOS Special Test — Costoclavicular (Military Brace)", {
        "ID": "TOS-T-004", "Type": "Special Test — Costoclavicular",
        "Compression Site": "Between clavicle and first rib",
        "Structures Compressed": "Subclavian artery/vein, brachial plexus",
        "Symptoms": "Pulse reduction, arm symptoms",
        "Differential Diagnosis": "First rib fixation, clavicle malunion",
        "Special Tests": "Shoulders thrust back and down (military posture); hold breath optional",
        "Imaging": "X-ray if bony anomaly",
        "Conservative Management": "N/A",
        "Exercises": "N/A",
        "Return to Sport": "N/A",
        "Evidence": "Part of TOS test battery; not standalone diagnostic",
        "References": "Sanders physical diagnosis TOS",
    }),
]

TOS_RECORDS = TOS_TYPE_RECORDS + TOS_TEST_RECORDS


# ---------------------------------------------------------------------------
# Section 7: Myofascial system
# ---------------------------------------------------------------------------

def _fascia(
    rid: str, structure: str, region: str, continuity: str, role: str, force: str,
    sliding: str, clinical: str, restrictions: str, referral: str, assess: str,
    treatment: str, evidence: str, refs: str,
) -> tuple[str, dict[str, Any]]:
    return (structure, {
        "ID": rid, "Structure": structure, "Region": region, "Continuity": continuity,
        "Biomechanical Role": role, "Force Transmission": force,
        "Sliding Mechanism": sliding, "Clinical Importance": clinical,
        "Restrictions": restrictions, "Pain Referral": referral, "Assessment": assess,
        "Treatment": treatment, "Evidence": evidence, "References": refs,
    })


MYOFASCIAL_RECORDS = [
    _fascia(
        "FAS-T-001", "Thoracolumbar Fascia (TLF)",
        "Posterior thorax and lumbar region",
        "Continuous with latissimus, glute max, serratus posterior, internal oblique/aponeurosis",
        "Transfers load between upper and lower extremity; IAP containment; extensor force transmission",
        "Posterior chain tension; contralateral lat-glute coupling in gait",
        "Multi-layer sliding thoracolumbar junction; hyaluronan-dependent",
        "Central to LBP and thoracic stiffness; lifting mechanics",
        "Thickening/adhesion post-injury; connective tissue densification",
        "Diffuse back/flank pain; referred gluteal",
        "Palpation shear layers; movement loss trunk rotation",
        "Myofascial release, instrument assisted soft tissue, movement hydration, loading",
        "Stecco fascial manipulation RCTs emerging; McGill posterior chain",
        "Schleip fascia as sensory organ; Willard TLF anatomy",
    ),
    _fascia(
        "FAS-T-002", "Deep Cervical Fascia",
        "Invests neck muscles; pretracheal, prevertebral layers extending to upper thoracic",
        "Continuous with thoracic prevertebral fascia to mediastinum",
        "Compartmentalization; carotid sheath; support viscera and deep neck flexors",
        "Cervicothoracic force to first rib and upper thoracic spine",
        "Sliding between SCM and deep layers; important post-whiplash",
        "TOS, cervicogenic headache, upper thoracic pain",
        "Post-traumatic restriction; forward head posture",
        "Occipital and upper thoracic referral",
        "Cervical rotation coupled with upper thoracic assessment",
        "Deep neck flexor training, soft tissue, first rib mobilization",
        "Limited high-quality RCTs; clinical integration common",
        "Standring Gray's fascia; Jull deep neck flexor",
    ),
    _fascia(
        "FAS-T-003", "Brachial Fascia (Axillary/Clavipectoral continuity)",
        "Shoulder girdle extending from clavipectoral to arm",
        "Clavipectoral fascia continuous with pectoralis minor, axillary fascia, serratus",
        "Encloses neurovascular bundle; scapulothoracic glide interface",
        "Load transfer push/pull to thoracic wall",
        "Sliding scapula on thorax beneath brachial fascia",
        "TOS, pec minor syndrome, scapular dyskinesis",
        "Pec minor/adhesive restriction overhead",
        "Anterior chest, medial arm referral",
        "Overhead reach, pec minor length, TOS tests",
        "Fascial release pec minor, serratus strengthening",
        "Anatomy strong; treatment evidence case-based",
        "Moore clavipectoral fascia; Stecco upper limb",
    ),
    _fascia(
        "FAS-T-004", "Clavipectoral Fascia",
        "Between clavicle and pectoralis minor; costocoracoid ligament region",
        "Blends with costoclavicular membrane; suspensory ligaments",
        "Suspends subclavian vessels and brachial plexus; divides axillary compartments",
        "Compression site TOS costoclavicular",
        "Limited sliding — dense fascial ring",
        "Critical TOS landmark; post-surgical scarring",
        "Post-op TOS, clavicle fracture malunion",
        "Medial arm, paresthesia TOS pattern",
        "Pulse exam Adson; palpation infraclavicular",
        "Conservative postural; surgical if vascular",
        "Illig TOS surgical anatomy",
        "Illig; Sanders costoclavicular space",
    ),
    _fascia(
        "FAS-T-005", "Palmar Fascia (Connection via SBL)",
        "Hand — linked via Superficial Back Line to thoracolumbar fascia",
        "Continuous myofascial chain through epicondyle, triceps, lat, TLF (Anatomy Trains model)",
        "Grip force transmission to axial skeleton in climbing/lifting",
        "Long chain tension — elbow/wrist/thoracic coupling",
        "Sliding carpal tunnel retinaculum separate; fascial continuity functional",
        "Dupuytren adjacent; climber flexor chain overload affects posture",
        "Flexor retinaculum thickening; chain tightness",
        "Medial epicondyle, thoracic extension loss secondary",
        "Grip strength, thoracic rotation screen",
        "Chain stretching, thoracic mobility, grip training balanced",
        "Anatomy Trains model partially validated; Dupuytren surgical evidence strong",
        "Myers Anatomy Trains; Wilbrand Dupuytren",
    ),
]


# ---------------------------------------------------------------------------
# Section 8: Myofascial chains (Anatomy Trains style)
# ---------------------------------------------------------------------------

def _chain(
    rid: str, chain: str, muscles: str, function: str, clinical: str, sports: str,
    assess: str, exercises: str, evidence: str, refs: str,
) -> tuple[str, dict[str, Any]]:
    return (chain, {
        "ID": rid, "Chain": chain, "Muscles Included": muscles,
        "Function": function, "Clinical Importance": clinical, "Sports": sports,
        "Assessment": assess, "Exercises": exercises, "Evidence": evidence,
        "References": refs,
    })


CHAIN_RECORDS = [
    _chain(
        "CHN-T-001", "Superficial Back Line (SBL)",
        "Plantar fascia, gastroc-soleus, hamstrings, sacrotuberous, erector spinae, splenius capitis, scalp fascia",
        "Extends body; maintains upright posture; limits forward bend",
        "Flexibility deficits limit toe touch and thoracic flexion; linked to posterior chain tightness",
        "Running, deadlift, rowing, swimming starts",
        "Toe touch, squat depth, thoracic flexion seated",
        "Downward dog, hamstring stretch, thoracic cat, foam roll erectors",
        "Myers model widely used clinically; partial EMG/kinetic validation",
        "Myers Anatomy Trains 4th ed",
    ),
    _chain(
        "CHN-T-002", "Superficial Front Line (SFL)",
        "Tibialis anterior, quads, rectus abdominis, sternalis/pectoralis, SCM",
        "Flexes trunk and hip; balances SBL",
        "Dominance in sitting posture; pec tightness thoracic kyphosis",
        "Sprinting start, kicking, gymnastics",
        "Thomas test hip, pec minor length, thoracic extension",
        "Hip flexor stretch, thoracic extension mobilization, chin tuck",
        "Force balance front-back clinically applied",
        "Myers; Liebenson Janda crossed syndromes overlap",
    ),
    _chain(
        "CHN-T-003", "Deep Front Line (DFL)",
        "Tibialis posterior, popliteus, adductors, psoas, diaphragm, TFL/deep lateral pelvis, scalenes",
        "Core stability; breathing; axial support",
        "Breathing-posture integration; psoas-diaphragm coupling",
        "All sports requiring trunk stability — gymnastics, combat, throwing",
        "Hi-lo breathing, psoas length, hip internal rotation",
        "90-90 breathing, psoas release cautious, dead bug, plank variations",
        "Kolar DNS overlaps; growing fascial research",
        "Myers; Kolar Dynamic Neuromuscular Stabilization",
    ),
    _chain(
        "CHN-T-004", "Spiral Line (SL)",
        "Splenius capitis to opposite rhomboids, serratus anterior, external oblique, ITB, tibialis anterior",
        "Rotational force transmission across body",
        "Thoracic rotation restrictions affect gait and throwing",
        "Golf, tennis, baseball, hockey",
        "Seated rotation, gait observation trunk counter-rotation",
        "Open book, lunge with rotation, cable chop/lift",
        "Functional rotation patterns validated kinetically",
        "Myers; McGill rotational training",
    ),
    _chain(
        "CHN-T-005", "Functional Lines (FL)",
        "Anterior: pec to opposite adductors via rectus abdominis; Posterior: lat to opposite glute via TLF",
        "Cross-body stabilization in gait and sport",
        "Contralateral lat-glute delay in LBP and running injury",
        "Running, throwing, cross-country skiing",
        "Single leg stance reach, bird dog cross-body",
        "Bird dog, cross-body cable, single arm row opposite leg",
        "Sahrmann and McGill cross-body patterns supported",
        "Myers; McGill bird dog evidence",
    ),
    _chain(
        "CHN-T-006", "Lateral Line (LL)",
        "Peroneals, ITB/TFL, glute med, QL, intercostals, SCM",
        "Lateral stability; side bending; frontal plane control",
        "QL-thoracic lateral flexion pain; ITB-knee but thoracic contribution",
        "Skating, basketball cutting, side plank sports",
        "Single leg squat frontal plane; side bend ROM",
        "Side plank, lateral line stretch, QL stretch side-lying",
        "Frontal plane training reduces injury risk meta-analyses",
        "Myers; Powers frontal plane knee but lateral line trunk",
    ),
]


# ---------------------------------------------------------------------------
# Supplementary: Pathologies, Special Tests, Rehab, Exercises, RTS, Imaging, Evidence
# ---------------------------------------------------------------------------

def _path(
    rid: str, name: str, region: str, epi: str, etiology: str, patho: str,
    presentation: str, redflags: str, diff: str, exam: str, tests: str,
    imaging: str, conservative: str, manual: str, exercise: str, prognosis: str,
    rts: str, evidence: str, refs: str,
) -> tuple[str, dict[str, Any]]:
    return (name, {
        "ID": rid, "Name": name, "Region": region, "Epidemiology": epi,
        "Etiology": etiology, "Pathophysiology": patho, "Clinical Presentation": presentation,
        "Red Flags": redflags, "Differential Diagnosis": diff, "Examination": exam,
        "Special Tests": tests, "Imaging": imaging, "Conservative Management": conservative,
        "Manual Therapy": manual, "Exercise Prescription": exercise, "Prognosis": prognosis,
        "Return to Sport": rts, "Evidence": evidence, "References": refs,
    })


PATHOLOGY_RECORDS = [
    _path("PATH-T-001", "Thoracic Hyperkyphosis (Postural / Age-Related)",
          "Thoracic spine T1-T12",
          "Prevalence increases with age; adolescent postural kyphosis common desk workers",
          "Prolonged flexion posture, osteoporosis, Scheuermann excluded, muscle imbalance pec/upper trap dominance",
          "Anterior soft tissue shortening; posterior extensor weakness; increased flexion moment on thoracic segments",
          "Rounded shoulders, forward head, stiff extension, aching mid-upper back after sitting",
          "Sudden severe deformity trauma, neurological deficit, fever weight loss — not typical postural",
          "Scheuermann disease, compression fracture, ankylosing spondylitis, tumor",
          "Observe sagittal alignment; thoracic extension ROM; scapular position; breathing pattern",
          "Adam's forward bend for structural vs postural; extension active/passive",
          "X-ray lateral if structural deformity >60 deg or progressive; DEXA if osteoporosis suspected",
          "Postural education, ergonomic setup, activity breaks, pain education",
          "Thoracic extension mobilization PA; rib mobilization; soft tissue pec/scalene",
          "Extension endurance, lower trap, deep neck flexors, thoracic rotation, row patterns",
          "Good response postural cases weeks-months; structural Scheuermann different course",
          "Full extension ROM sport-specific; swimming golf rotation sports need thoracic mobility",
          "Motor control and extension exercise Level B chronic mid-back pain",
          "Katzman hyperkyphosis review; Bae thoracic posture exercise RCTs"),
    _path("PATH-T-002", "Scheuermann Disease (Juvenile Kyphosis)",
          "Thoracic T7-T9 apex typical",
          "1-8% adolescents; males > females",
          "Vertebral endplate irregularity; wedge vertebrae >5 deg three consecutive levels",
          "Rigid kyphosis; anterior vertebral wedging; Schmorl nodes",
          "Fixed rounded back adolescent; pain activity-related; hamstring tightness common",
          "Progressive deformity, neurological symptoms, severe pain night pain",
          "Postural kyphosis (corrects extension), AS, infection, tumor",
          "Rigid kyphosis on extension; positive Adam's structural curve; reduced ROM",
          "Extension correction test; Adam's forward bend rib hump thoracic",
          "Lateral X-ray: wedge vertebrae, endplate changes, kyphosis >45 deg diagnostic",
          "PT monitoring growth; extension strengthening; bracing if progressive moderate-severe",
          "Mobilization limited rigid segments; adjacent level mobility",
          "Core stability, thoracic extension isometrics, hamstring stretch, sport modification",
          "Often stable after skeletal maturity; bracing if >55 deg kyphosis and growing",
          "Low-impact until pain controlled; contact sport individualized by severity",
          "Bracing evidence moderate for progressive curves; PT for pain function",
          "Lowe Scheuermann management; Monticone exercise studies"),
    _path("PATH-T-003", "Thoracic Idiopathic Scoliosis",
          "Thoracic or thoracolumbar curves",
          "2-3% adolescents screened; adults degenerative scoliosis separate entity",
          "Multifactorial genetic, growth-related; not postural habit alone",
          "Vertebral rotation, lateral curvature, rib hump; asymmetric loading costovertebral joints",
          "Visible asymmetry shoulders/ribs; back ache; rarely cardiopulmonary if severe",
          "Rapid progression prepubertal, neurological signs, bowel/bladder — rare",
          "Postural scoliosis, leg length, Scheuermann, tumor syringomyelia",
          "Adam's forward bend; scoliometer; limb length; neurological screen",
          "Adam's test, trunk rotation measurement, Adams forward bend rib hump",
          "Full spine PA/lateral standing; Cobb angle; maturity Risser",
          "Observation mild curves; Schroth/PSSE; bracing per SRS criteria",
          "Segmental mobility adjacent to curve; not correct structural curve manually",
          "Schroth 3-dimensional exercises, core, respiratory expansion concave side",
          "Progression risk highest during growth spurts; adult stable curves often manageable",
          "Sport usually continued; monitor curve sport-specific asymmetry",
          "Bracing 45-50 deg Cobb growing skeleton evidence; PSSE growing evidence emerging",
          "Negrini scoliosis exercise Cochrane; Weinstein bracing RCT"),
    _path("PATH-T-004", "Thoracic Compression Fracture",
          "Mid-lower thoracic T6-T12 common osteoporosis",
          "Osteoporotic elderly common; trauma young athletes rare high-energy",
          "Axial load flexion; osteoporosis; metastatic pathologic fracture",
          "Anterior vertebral height loss; acute or insufficiency fracture",
          "Localized midline pain; increased with flexion loading; height loss multiple fractures",
          "Progressive neuro deficit, bowel/bladder, fever, known malignancy, high-energy incomplete assessment",
          "Disc herniation thoracic rare, MSK strain, herpes zoster, aortic pathology referred",
          "Palpation SP tenderness; flexion painful; neuro exam lower extremities reflexes",
          "Percussion tenderness; single leg stance load test cautious",
          "X-ray AP/lateral; MRI if neuro deficit osteoporosis unclear; CT surgical planning",
          "Relative rest, analgesia medical, thoracic extension brace some protocols, early ambulation",
          "Gentle mobilization after acute phase; avoid aggressive flexion early",
          "Extension progressive loading, balance, osteoporosis weight-bearing medical co-management",
          "Most osteoporotic heal 8-12 weeks pain; kyphoplasty if severe pain selected cases",
          "Return after pain-free extension loading; contact sport after structural healing trauma cases",
          "Early mobilization superior to bed rest osteoporotic VF; EAA guidelines",
          "McCarthy osteoporotic vertebral fracture management"),
    _path("PATH-T-005", "Thoracic Facet Joint Syndrome",
          "Unilateral or bilateral facet pain T4-T10 common",
          "Middle age; degenerative; whiplash upper thoracic; rotation sports",
          "Facet arthropathy, synovitis, meniscoid entrapment, postural overload extension",
          "Inflamed facet capsule; medial branch nociception",
          "Paraspinal pain 1-2 cm lateral to SP; extension rotation provocative; morning stiffness",
          "Weight loss, night pain unrelenting, neuro deficit",
          "Discogenic pain, rib dysfunction, internal organ referred, costotransverse sprain",
          "Extension rotation reproduces; segmental hypomobility or hypermobility",
          "Extension rotation test; PA palpation facet line",
          "MRI facet effusion limited sensitivity; diagnostic medial branch block gold standard invasive",
          "Activity modification, NSAIDs short term medical, PT mobilization",
          "Grade III-IV PA glides, rotation mobilization, dry needling medial branch region",
          "Extension control, rotation mobility, scapular stability",
          "Good with conservative care; RF ablation chronic cases after diagnostic block",
          "Gradual return rotation extension sports after pain-free ROM",
          "Thoracic RF medial branch evidence extrapolated lumbar Level B",
          "Manchikanti facet joint interventions review"),
    _path("PATH-T-006", "Costochondritis (Tietze if swelling)",
          "Ribs 2-5 costochondral/sternocostal anterior chest",
          "Common young adults; female slight predominance; no trauma required",
          "Overuse upper body, coughing, viral illness, repetitive strain",
          "Inflammation costochondral junction cartilage; not infection",
          "Sharp anterior chest pain; reproducible palpation; worse deep breath push-up",
          "Fever, diaphoresis, exertional crushing pain, tachycardia — cardiac red flags",
          "Cardiac ACS, PE, pneumonia, rib fracture, Tietze with swelling",
          "Palpation costochondral junction reproduces; normal cardiac auscultation if cleared",
          "Chest wall palpation; no single special test; reproduce with push-up",
          "Clinical diagnosis; X-ray if trauma; exclude cardiac per protocol",
          "Reassurance, NSAIDs, activity modification, heat",
          "Gentle rib mobilization posterior; soft tissue intercostals; avoid aggressive anterior",
          "Gradual push-up return, breathing exercises, pec stretch",
          "Self-limiting weeks to months; recurrence possible",
          "Return when palpation pain minimal and push/pull progressions tolerated",
          "NSAIDs and reassurance standard; PT adjunct low evidence",
          "Disla costochondritis review; Family Practice guidelines chest wall pain"),
    _path("PATH-T-007", "Rib Fracture (Traumatic / Stress)",
          "Ribs 4-9 most common traumatic; 1st rib high energy",
          "Trauma MVA falls contact sports; stress rowers golfers baseball pitchers",
          "Direct blow; repetitive torsion; coughing severe osteoporotic",
          "Cortical disruption; pain inspiration; protective splinting intercostals",
          "Point tenderness; crepi if significant; pain cough sneeze twist",
          "Multiple ribs flail, pneumothorax, hemothorax, abdominal trauma association",
          "MSK strain, costochondritis, referred visceral pain",
          "Palpation along rib; inspiration pain; observe breathing shallow",
          "Hooking test slipping rib different; chest expansion measurement",
          "X-ray often confirms; CT if complex; ultrasound point of care emerging",
          "Analgesia, pulmonary hygiene incentive spirometry, rib belt controversial",
          "Generally avoid aggressive mobilization acute; posterior rib grade I-II after pain subsides",
          "Diaphragmatic breathing, gradual rotation, return sport 6-8 weeks typical uncomplicated",
          "Healing 6 weeks bone; pain may persist longer intercostal neuralgia",
          "Contact sport after radiographic healing and pain-free tackle simulation",
          "Early mobilization and analgesia improve pulmonary outcomes trauma guidelines",
          "Bemelman rib fracture management review"),
    _path("PATH-T-008", "Slipping Rib Syndrome (Painful Rib Hypermobility)",
          "Ribs 8-10 false ribs anterior cartilage",
          "Underdiagnosed; athletes swimmers rowers; post-trauma",
          "Hypermobile costal cartilage; trauma; congenital laxity",
          "Anterior rib tip moves excessively; intercostal nerve irritation",
          "Lower anterior rib pain; clicking popping; Hooking test positive",
          "Abdominal pathology, cholecystitis, hepatic referral",
          "Costochondritis, intercostal strain, T8-T10 radiculopathy",
          "Hooking maneuver reproduces click pain; palpation mobile rib tip",
          "Hooking test; ultrasound dynamic subluxation",
          "Ultrasound dynamic best; X-ray limited",
          "Rest, NSAIDs, rib support taping, activity modification",
          "Posterior rib stabilization; core breathing; avoid aggressive anterior manipulation",
          "Core stability, gradual return swimming rowing",
          "Conservative often successful; surgical excision refractory cases",
          "Swimming rowing after Hooking negative and core stable",
          "Surgical case series good outcomes refractory; conservative first line expert",
          "Heiderscheit slipping rib syndrome review; McBeath diagnostic criteria"),
    _path("PATH-T-009", "Intercostal Muscle Strain",
          "Any interspace; rotation sports common",
          "Common athletes tennis golf baseball twisting",
          "Sudden rotation extension; sneeze; overuse repetitive trunk rotation",
          "Muscle fiber tear external/internal intercostal; inflammation",
          "Sharp lateral chest/back pain twist; palpation intercostal groove; bracing pain",
          "Cardiac pulmonary if anterior crushing dyspnea",
          "Rib fracture, costochondritis, thoracic radiculopathy",
          "Palpation intercostal; reproduce rotation; resisted rotation pain",
          "Rotation reproduces; intercostal palpation",
          "Usually none; X-ray if fracture suspected",
          "Relative rest ice early; NSAIDs short term; avoid Valsalva early",
          "Gentle soft tissue; rib mobilization after acute; dry needling optional",
          "Progressive rotation, core anti-rotation, return throwing progression",
          "2-6 weeks typical grade I-II",
          "Sport-specific rotation progression when pain-free isometric rotation",
          "Limited RCTs; standard muscle strain protocols applied",
          "Bordoni intercostal muscle anatomy and function"),
    _path("PATH-T-010", "Thoracic Disc Herniation",
          "T8-T12 most common thoracic disc levels clinically",
          "Rare vs cervical/lumbar; ~0.25-4% disc herniations",
          "Degeneration; trauma; Scheuermann association",
          "Posterolateral disc protrusion/extrusion; cord compression central paramedian",
          "Band-like dermatomal pain; myelopathy if central — gait disturbance, UMNL signs",
          "Progressive weakness, bowel bladder, saddle anesthesia — surgical emergency",
          "Radiculopathy abdominal mimic, MSK strain, tumor infection",
          "Neuro exam essential; dermatomal sensory; reflexes; Babinski if myelopathy",
          "Slump test; hyperreflexia; Hoffmann upper motor neuron",
          "MRI gold standard; T2 disc herniation cord compression",
          "Conservative if no myelopathy; epidural selective cases; PT pain centralization approach case dependent",
          "Gentle extension mobilization if tolerated; avoid flexion loading acute radicular",
          "Core stability, extension bias if centralizes, gradual loading",
          "Myelopathy requires surgery; radicular may resolve conservative months",
          "No sport until neuro cleared; gradual return non-contact then contact",
          "Surgery for myelopathy strong; conservative radicular limited evidence case series",
          "Wood thoracic disc herniation outcomes review"),
    _path("PATH-T-011", "Thoracic Outlet Syndrome — Neurogenic",
          "Brachial plexus compression scalene/costoclavicular/pec minor",
          "Most common TOS ~95%; women young adults; overhead athletes",
          "Anomaly cervical rib; posture; trauma; repetitive overhead",
          "Plexus compression ischemic and mechanical; fibrous bands",
          "Ulnar paresthesia hand; neck shoulder pain; overhead intolerance",
          "Progressive atrophy intrinsic hand; vascular TOS signs; Pancoast tumor",
          "Cervical radiculopathy, CTS, ulnar neuropathy cubital tunnel",
          "Roos Adson Wright battery; posture; first rib mobility; strength intrinsics",
          "Roos, Adson, Wright, costoclavicular, ULTT",
          "X-ray cervical rib; MRI plexus; EMG/NCS chronic",
          "Posture, first rib mobilization, scalene release, strengthening lower/middle trap",
          "Soft tissue scalenes; cervical/thoracic mobilization; nerve glides cautious",
          "Chin tuck, scapular retraction, diaphragmatic breathing, progressive overhead",
          "50-90% mild-moderate conservative success literature variable",
          "Overhead sport gradual throw/swim program symptom-guided",
          "Conservative first line Level C expert; surgery failed rehab documented vascular",
          "Sanders TOS; Nord conservative outcomes"),
    _path("PATH-T-012", "Thoracolumbar Junction Syndrome",
          "T11-L2 transition zone",
          "Common active adults; dancers gymnasts weightlifters",
          "Shear stress transition; facet orientation change; QL iliolumbar stress",
          "Increased sagittal mobility lower thoracic; pars stress rare T12",
          "Local pain extension rotation; QL referral flank; lifting aggravates",
          "Severe trauma fracture dislocation; cauda equina lower",
          "Lumbar facet, disc L1-L2, renal referral",
          "Thoracolumbar ROM; QL length strength; extension rotation testing",
          "Extension rotation; one-leg standing load",
          "X-ray oblique if pars concern; MRI if neuro",
          "Activity modification; core lumbopelvic control; thoracic and hip mobility",
          "T12-L1 mobilization; QL soft tissue; iliolumbar region",
          "Bird dog, dead bug, hip hinge, anti-rotation, gradual deadlift progression",
          "Good with motor control; chronic if undiagnosed transition overload",
          "Lifting sports after pain-free hinge and loaded rotation",
          "Motor control training Level B chronic spinal pain",
          "McGill spine stability; Sahrmann movement impairment"),
]


def _test(
    rid: str, name: str, purpose: str, structures: str, procedure: str,
    positive: str, sensitivity: str, specificity: str, utility: str,
    precautions: str, evidence: str, refs: str,
) -> tuple[str, dict[str, Any]]:
    return (name, {
        "ID": rid, "Test Name": name, "Purpose": purpose, "Structures Stressed": structures,
        "Procedure": procedure, "Positive Finding": positive,
        "Sensitivity": sensitivity, "Specificity": specificity,
        "Clinical Utility": utility, "Precautions": precautions,
        "Evidence": evidence, "References": refs,
    })


SPECIAL_TEST_RECORDS = [
    _test("TST-T-001", "Thoracic Extension Rotation Test (BERT)",
          "Provoke thoracic facet and costovertebral pain with extension rotation",
          "Thoracic facets, costovertebral joints, paraspinal muscles",
          "Patient seated arms crossed; therapist extension rotation each side end-range",
          "Reproduction familiar posterior/thoracic pain; compare sides asymmetry",
          "Moderate for thoracic pain source localization", "Low specificity — multiple structures",
          "Useful clinical reasoning tool segmental pain; not standalone diagnosis",
          "Avoid acute fracture, severe osteoporosis, hypermobility instability",
          "Clinical reasoning support; limited psychometric studies thoracic specifically",
          "Manual therapy texts Cleland; Flynn clinical prediction rules thoracic"),
    _test("TST-T-002", "Spring Test (Central PA Thoracic)",
          "Assess segmental stiffness and pain response central posterior-anterior glide",
          "Intervertebral disc, vertebral body, ALL, segmental mobility",
          "Patient prone; central PA pressure each thoracic spinous process grades I-IV",
          "Pain reproduction; stiffness compared adjacent segments; muscle guarding",
          "N/A quantitative — qualitative stiffness assessment", "N/A",
          "Fundamental manual therapy assessment; guides mobilization level",
          "Fracture, tumor, infection, anticoagulation — caution grade IV",
          "Foundation of Maitland mobilization assessment",
          "Hengeveld Maitland Vertebral Manipulation"),
    _test("TST-T-003", "Rib Spring Test",
          "Assess costotransverse/costovertebral hypomobility or pain",
          "Costotransverse joint, costovertebral joint, intercostals",
          "Patient side-lying/prone; PA pressure on posterior rib angle",
          "Asymmetric spring; pain reproduction; hypomobility fixation",
          "Clinical tradition high; limited formal psychometrics",
          "Low — many anterior chest pain sources",
          "Essential rib dysfunction assessment; guides rib mobilization",
          "Rib fracture acute, osteoporosis, tumor",
          "Expert consensus manual medicine",
          "Greenman Principles of Manual Medicine"),
    _test("TST-T-004", "First Rib Mobility Test",
          "Assess first rib elevation hypomobility TOS contribution",
          "First rib, scalenes, costovertebral T1, brachial plexus proximity",
          "Supine or seated palpate first rib supraclavicular; compare side-to-side elevation spring",
          "Restricted first rib; tenderness; symptom reproduction TOS",
          "Moderate in TOS clinical series not isolated", "Low alone",
          "Part of TOS assessment battery with Roos Adson",
          "Vascular TOS caution aggressive testing",
          "TOS literature Sanders; physiotherapy TOS protocols",
          "Sanders physical diagnosis TOS"),
    _test("TST-T-005", "Hooking Maneuver (Slipping Rib Test)",
          "Detect anterior rib hypermobility ribs 8-10",
          "Costal cartilage false ribs, intercostal nerve",
          "Hook fingers under costal margin pull anterior; reproduce click pain",
          "Clicking; anterior pain reproduction; symptomatic relief after repositioning sometimes",
          "High in slipping rib confirmed cases", "Moderate — operator dependent",
          "Key test slipping rib syndrome diagnosis",
          "Avoid acute fracture, post-surgical",
          "Heiderscheit criteria; ultrasound confirmation recommended",
          "McBeath slipping rib diagnostic criteria"),
    _test("TST-T-006", "Adam's Forward Bend Test (Scoliosis Screen)",
          "Screen structural scoliosis vertebral rotation rib hump",
          "Thoracic spine rotation, rib cage asymmetry",
          "Standing forward flexion; observe rib hump thoracic; scoliometer optional",
          "Rib hump rotation asymmetry; structural curve does not correct",
          "Screening test high sensitivity structural curve", "Low specificity postural",
          "School screening standard; referral Cobb >10 deg rotation",
          "Non-diagnostic alone — imaging for confirmation",
          "SRS screening guidelines",
          "Adolescent idiopathic scoliosis screening literature"),
    _test("TST-T-007", "Chest Expansion Measurement",
          "Quantify restrictive thoracic cage motion respiratory or ankylosis",
          "Intercostals, costovertebral joints, thoracic spine",
          "Tape measure at xiphoid level max inspiration vs expiration difference",
          "<5 cm expansion abnormal adult; compare norms age sex",
          "Moderate restrictive disease detection", "Low musculoskeletal specificity",
          "Ankylosing spondylitis monitoring; post-thoracic surgery",
          "Acute rib fracture pain limit effort",
          "ASAS assessment criteria includes chest expansion",
          "Braun ankylosing spondylitis assessment"),
    _test("TST-T-008", "Wall Angel / Flexion-Rotation Test",
          "Combined thoracic extension rotation mobility assessment",
          "Thoracic spine, ribs, scapulothoracic",
          "Back to wall arms W position slide up maintaining contact lumbar/thoracic",
          "Inability maintain contact; pain; asymmetry shoulder elevation",
          "N/A — functional mobility screen", "N/A",
          "Quick clinic screen desk workers swimmers overhead athletes",
          "Acute pain limit range",
          "Functional movement screening adaptation",
          "Cook FMS influenced screens; Kibler shoulder"),
    _test("TST-T-009", "Seated Rotation Active ROM Test",
          "Compare thoracic rotation bilateral sport baseline",
          "Thoracic spine segments, rib articulations",
          "Seated knees fixed hands across chest rotate each way measure degrees inclinometer",
          "<30 deg or >10 deg asymmetry clinically notable many sports",
          "N/A", "N/A",
          "Golf tennis baseball hockey screening; track rehab progress",
          "Acute strain perform within pain-free range",
          "Sport-specific normative data emerging",
          "Johnson golf thoracic rotation norms"),
    _test("TST-T-010", "Hi-Lo Breathing Assessment",
          "Distinguish diaphragmatic vs apical dominant breathing",
          "Diaphragm, scalenes, SCM, intercostals",
          "Supine one hand chest one abdomen; observe which rises first/more with inhale",
          "Chest rises predominantly = apical pattern; abdomen = diaphragmatic",
          "N/A qualitative", "N/A",
          "Breathing retraining baseline; TOS neck pain cases",
          "None significant",
          "Clinical physiotherapy respiratory assessment standard",
          "Chaitow breathing pattern disorders"),
]


REHAB_PHASES = [
    ("Rehab Phase 1 — Acute Pain Control (Thoracic)", {
        "ID": "REH-T-001", "Phase": "Acute (0-2 weeks typical MSK)",
        "Goals": "Reduce pain/inflammation; protect tissue; maintain safe ROM; patient education red flags",
        "Pain Management": "Relative rest from aggravators; heat/ice preference; medical analgesia coordinated",
        "Mobility": "Pain-free gentle rotation flexion extension within tolerance; diaphragmatic breathing",
        "Strengthening": "Isometric scapular setting; gentle core activation dead bug level 1",
        "Manual Therapy": "Grade I-II mobilization; soft tissue gentle; rib grade I if rib involvement",
        "Modalities": "TENS optional; not primary; avoid passive-only approach",
        "Patient Education": "Prognosis reassurance MSK; ergonomics; avoid prolonged flexion sitting",
        "Progression Criteria": "Pain trending down; sleep improved; basic ADL without sharp pain",
        "References": "NICE back pain principles applied thoracic MSK",
    }),
    ("Rehab Phase 2 — Mobility Restoration", {
        "ID": "REH-T-002", "Phase": "Subacute (2-6 weeks)",
        "Goals": "Restore thoracic rotation extension; normalize breathing; segmental mobility",
        "Pain Management": "Gradual exposure to previously painful movements",
        "Mobility": "Open book, thread needle, foam roller extension, cat-camel, rib expansion",
        "Strengthening": "Band rows, scapular retraction endurance, prone Y/T low load",
        "Manual Therapy": "Grade III-IV PA glides hypomobile segments; costovertebral mobilization",
        "Modalities": "Reduce emphasis; active care primary",
        "Patient Education": "Importance movement; desk breaks; sleeping support",
        "Progression Criteria": "ROM >75% baseline; pain <3/10 daily activities",
        "References": "Thoracic manipulation chronic neck pain indirect evidence",
    }),
    ("Rehab Phase 3 — Strengthening & Motor Control", {
        "ID": "REH-T-003", "Phase": "Strengthening (4-10 weeks)",
        "Goals": "Paraspinal endurance; scapulothoracic control; anti-rotation stability",
        "Pain Management": "Manage post-exercise soreness vs pain flare distinction",
        "Mobility": "Maintain rotation extension; sport-specific patterns",
        "Strengthening": "Rows, face pulls, lat pull, bird dog, pallof press, dead bug progressions",
        "Manual Therapy": "Maintenance hypomobile segments; soft tissue as needed",
        "Modalities": "Minimal",
        "Patient Education": "Load management; technique lifting sport",
        "Progression Criteria": "Strength endurance targets met; scapular dyskinesis improved",
        "References": "McGill big three; Kibler scapular protocols",
    }),
    ("Rehab Phase 4 — Return to Sport / Function", {
        "ID": "REH-T-004", "Phase": "Return to Sport (variable 8-16 weeks)",
        "Goals": "Sport-specific loads; rotation power; contact tolerance if applicable",
        "Pain Management": "Pain-free sport progressions; flare management plan",
        "Mobility": "Full sport-required ROM symmetric",
        "Strengthening": "Plyometric rotation; overhead progressions; weighted carries",
        "Manual Therapy": "Maintenance only",
        "Modalities": "None routine",
        "Patient Education": "Warm-up routine; maintenance exercises; recognize early warning signs",
        "Progression Criteria": "Sport test battery passed; confidence; coach clearance",
        "References": "Sport-specific RTS criteria individualized",
    }),
    ("Rehab Phase — Post-Thoracic Surgery (General)", {
        "ID": "REH-T-005", "Phase": "Post-surgical (protocol surgeon-specific)",
        "Goals": "Wound healing; pulmonary hygiene; gradual mobility per surgical restrictions",
        "Pain Management": "Surgeon analgesia protocol; splinting incision coughing technique",
        "Mobility": "Only within surgeon restrictions — often limited rotation/extension early",
        "Strengthening": "Delayed until clearance — typically isometric then progressive",
        "Manual Therapy": "Not over incision site early; rib/thoracic distant segments gentle later",
        "Modalities": "Per hospital protocol",
        "Patient Education": "Strict adherence restrictions; incentive spirometry; signs infection",
        "Progression Criteria": "Surgeon follow-up clearance each phase",
        "References": "Institutional post-thoracotomy/ spinal surgery protocols",
    }),
]


EXERCISE_RECORDS = [
    ("Open Book (Thoracic Rotation)", {"ID": "EX-T-001", "Name": "Open Book", "Region": "Thoracic rotation",
     "Purpose": "Restore thoracic rotation; reduce reliance on lumbar/cervical compensation",
     "Starting Position": "Side-lying hips/knees flexed 90 deg arms extended together",
     "Execution": "Rotate top arm and trunk open like book following hand with eyes; exhale end-range",
     "Dosage": "2-3 sets 10-15 reps each side; hold 2-3 sec end-range",
     "Progression": "Add foam roller under top knee; increase range; add light dumbbell hand",
     "Regression": "Smaller range; pillow between knees",
     "Contraindications": "Acute rib fracture; severe osteoporosis HVLA adjacent",
     "Cues": "Keep knees stacked; rotate from mid-back not just shoulder",
     "Evidence": "Commonly prescribed; indirect evidence thoracic rotation benefits throwing",
     "References": "TPI golf mobility; physiotherapy clinical practice"}),
    ("Thread the Needle", {"ID": "EX-T-002", "Name": "Thread the Needle", "Region": "Thoracic rotation",
     "Purpose": "Combined rotation extension mobility quadruped",
     "Starting Position": "Quadruped neutral spine",
     "Execution": "Slide one arm under opposite arm rotating thoracic; hip stays level",
     "Dosage": "2-3 x 8-12 each side",
     "Progression": "Hold end-range 5 sec; band resistance",
     "Regression": "Hand on chair seated variant",
     "Contraindications": "Wrist pain quadruped; acute disc radicular flexion intolerance",
     "Cues": "Rotate through mid-back; breathe into upper back",
     "Evidence": "Clinical standard mobility exercise",
     "References": "Movement system impairment approach"}),
    ("Foam Roller Thoracic Extension", {"ID": "EX-T-003", "Name": "Foam Roller Extension",
     "Region": "Mid-thoracic extension",
     "Purpose": "Mobilize extension mid-thoracic counter kyphotic posture",
     "Starting Position": "Supine foam roller perpendicular mid-thoracic; hands support head",
     "Execution": "Gentle extension over roller segment by segment; avoid lumbar",
     "Dosage": "1-2 min total; 5-10 slow extensions",
     "Progression": "Arms overhead; narrow base",
     "Regression": "Towel roll smaller diameter",
     "Contraindications": "Osteoporosis severe; acute compression fracture; dizziness",
     "Cues": "Small segment focus; exhale into extension",
     "Evidence": "Improves extension ROM short-term studies",
     "References": "Mid-back pain extension mobilization literature"}),
    ("Cat-Camel (Segmental)", {"ID": "EX-T-004", "Name": "Cat-Camel",
     "Region": "Full spine thoracic emphasis",
     "Purpose": "Segmental flexion-extension awareness; spinal warm-up",
     "Starting Position": "Quadruped",
     "Execution": "Alternate flexion rounding and extension sagging; segmental initiation cue",
     "Dosage": "2 x 10-15 slow repetitions",
     "Progression": "Pause end ranges; eyes closed proprioception",
     "Regression": "Seated cat-camel",
     "Contraindications": "Acute radicular flexion/extension intolerance",
     "Cues": "Initiate from mid-thoracic not lumbar only",
     "Evidence": "McGill spine warm-up standard",
     "References": "McGill Ultimate Back Fitness"}),
    ("Prone Y Raise (Lower Trap)", {"ID": "EX-T-005", "Name": "Prone Y",
     "Region": "Scapulothoracic / lower trapezius",
     "Purpose": "Lower trap activation; upward rotation posterior tilt",
     "Starting Position": "Prone arms Y ~130 deg abduction thumbs up",
     "Execution": "Lift arms squeezing lower trap; minimal upper trap",
     "Dosage": "3 x 10-15 holds 3 sec; light weight 0.5-2 kg",
     "Progression": "Incline bench; add weight",
     "Regression": "Smaller angle; no weight",
     "Contraindications": "Acute shoulder impingement painful",
     "Cues": "Slide scapula into pocket; long neck",
     "Evidence": "High lower trap EMG prone Y",
     "References": "Reinold scapular EMG exercises"}),
    ("Wall Slide / Wall Angel", {"ID": "EX-T-006", "Name": "Wall Angel",
     "Region": "Thoracic extension scapular",
     "Purpose": "Combined extension scapular upward rotation mobility",
     "Starting Position": "Back against wall feet slightly forward arms W",
     "Execution": "Slide arms up maintaining wrist/elbow/back contact if possible",
     "Dosage": "2-3 x 8-10 slow",
     "Progression": "Add mini band; single arm",
     "Regression": "Partial range acceptable",
     "Contraindications": "Shoulder pain end-range",
     "Cues": "Ribs down; breathe lateral expansion",
     "Evidence": "Functional screen and rehab common",
     "References": "Kibler shoulder rehabilitation"}),
    ("Bird Dog", {"ID": "EX-T-007", "Name": "Bird Dog",
     "Region": "Thoracolumbar stability",
     "Purpose": "Anti-extension anti-rotation core; multifidus erector coactivation",
     "Starting Position": "Quadruped neutral",
     "Execution": "Extend opposite arm leg maintaining trunk level hold",
     "Dosage": "3 x 10 each side 5-10 sec hold",
     "Progression": "Band resistance; unstable surface",
     "Regression": "Arm only or leg only",
     "Contraindications": "Wrist pain; acute extension pain",
     "Cues": "Level hips; long spine",
     "Evidence": "McGill endurance protocol evidence",
     "References": "McGill bird dog studies"}),
    ("Pallof Press Anti-Rotation", {"ID": "EX-T-008", "Name": "Pallof Press",
     "Region": "Thoracic anti-rotation",
     "Purpose": "Rotational stability; oblique activation; sport transfer",
     "Starting Position": "Standing band/cable at chest height",
     "Execution": "Press band forward resisting rotation; hold extended",
     "Dosage": "3 x 10-15 each side",
     "Progression": "Kneeling half-kneeling split stance sport stance",
     "Regression": "Lighter band shorter hold",
     "Contraindications": "Acute intercostal strain painful rotation",
     "Cues": "Ribs stacked over pelvis; exhale on press",
     "Evidence": "High anti-rotation demand EMG obliques",
     "References": "McGill anti-rotation training"}),
    ("Diaphragmatic Breathing 90-90", {"ID": "EX-T-009", "Name": "90-90 Diaphragmatic Breathing",
     "Region": "Respiratory / core",
     "Purpose": "Restore diaphragm dominance; reduce apical pattern",
     "Starting Position": "Supine hips/knees 90 deg on chair/wall",
     "Execution": "Inhale expand lower ribs/back; exhale ribs down without chest lift",
     "Dosage": "5-10 min daily; 5-8 breaths/min",
     "Progression": "Add arm movement; standing",
     "Regression": "Crocodile breathing prone",
     "Contraindications": "None typical",
     "Cues": "360 expansion; slow nasal inhale",
     "Evidence": "Breathing retraining chronic pain Level B",
     "References": "Chaitow; Kolar DNS breathing"}),
    ("Side-Lying Rib Expansion", {"ID": "EX-T-010", "Name": "Rib Expansion Side-Lying",
     "Region": "Intercostals costovertebral",
     "Purpose": "Mobilize restricted hemithorax; post-rib injury; scoliosis convex side",
     "Starting Position": "Side-lying restricted side up or down per protocol",
     "Execution": "Inhale into top/back ribs; manual facilitation optional",
     "Dosage": "2-3 min each side",
     "Progression": "Add arm overhead",
     "Regression": "Seated",
     "Contraindications": "Acute rib fracture painful side",
     "Cues": "Breathe into hand placement lateral ribs",
     "Evidence": "Schroth scoliosis breathing principles",
     "References": "Schroth PSSE methods"}),
    ("Serratus Wall Slide", {"ID": "EX-T-011", "Name": "Serratus Wall Slide",
     "Region": "Scapulothoracic protraction upward rotation",
     "Purpose": "Serratus activation; scapular protraction control",
     "Starting Position": "Forearms on wall slide position",
     "Execution": "Slide arms up maintaining protraction plus at top",
     "Dosage": "3 x 10-12",
     "Progression": "Foam roller wall; single arm",
     "Regression": "Partial range",
     "Contraindications": "Long thoracic nerve acute winging painful",
     "Cues": "Push wall away; plus at top",
     "Evidence": "High serratus EMG wall slide variations",
     "References": "Decker serratus EMG"}),
    ("Quadruped Serratus Push (Push-Up Plus)", {"ID": "EX-T-012", "Name": "Push-Up Plus",
     "Region": "Serratus scapular",
     "Purpose": "End-range protraction serratus strength",
     "Starting Position": "Push-up position or wall incline",
     "Execution": "At top protract scapula further rounding upper back slightly",
     "Dosage": "3 x 12-20",
     "Progression": "Full push-up; band around back",
     "Regression": "Wall incline high angle",
     "Contraindications": "Wrist pain",
     "Cues": "Separate scapula at top; do not bend elbows for plus",
     "Evidence": "Standard serratus strengthening exercise",
     "References": "Reinold push-up plus EMG"}),
    ("Seated Row / Band Row", {"ID": "EX-T-013", "Name": "Seated Row",
     "Region": "Scapular retraction thoracic posture",
     "Purpose": "Middle trap rhomboid endurance; posterior chain",
     "Starting Position": "Seated band or cable chest height",
     "Execution": "Pull elbows back squeeze scapulae; control return",
     "Dosage": "3 x 12-15 moderate load",
     "Progression": "Single arm; unstable surface",
     "Regression": "Light band high reps",
     "Contraindications": "Acute shoulder impingement",
     "Cues": "Chest tall; ribs down",
     "Evidence": "High middle trap rhomboid EMG",
     "References": "Cools scapular muscle EMG"}),
    ("Cable Chop / Lift (Spiral Line)", {"ID": "EX-T-014", "Name": "Cable Chop/Lift",
     "Region": "Thoracic rotation obliques",
     "Purpose": "Rotational power stability; spiral line integration",
     "Starting Position": "Standing cable high-to-low chop or low-to-high lift",
     "Execution": "Rotate through thoracic hips; control eccentric",
     "Dosage": "3 x 8-12 each direction",
     "Progression": "Heavier load; sport stance",
     "Regression": "Light band",
     "Contraindications": "Acute disc radicular rotation",
     "Cues": "Power from hips trunk follows",
     "Evidence": "Functional training rotational athletes",
     "References": "McGill rotational training guidelines"}),
    ("Dead Bug", {"ID": "EX-T-015", "Name": "Dead Bug",
     "Region": "Core respiratory coordination",
     "Purpose": "IAP maintenance limb loading; diaphragm-pelvic floor coordination",
     "Starting Position": "Supine 90-90 arms up",
     "Execution": "Lower opposite arm/leg maintaining neutral spine and breathing",
     "Dosage": "3 x 8-10 each side slow",
     "Progression": "Band resistance; lower starting position",
     "Regression": "Heel taps only",
     "Contraindications": "Acute flexion intolerance",
     "Cues": "Ribs down; exhale on extension",
     "Evidence": "Core stability literature support",
     "References": "Kolar DNS; McGill modified curl-up progressions"}),
]


RTS_RECORDS = [
    ("RTS — General Thoracic MSK", {"ID": "RTS-T-001", "Sport/Context": "General athletic population",
     "Criteria": "Pain-free ADL; symmetric rotation >45 deg; extension without pain; no night pain",
     "Strength": "Row and push patterns symmetric 90% limb symmetry optional",
     "Functional Tests": "Sport-specific movements pain-free; push-up plus; overhead reach",
     "Progression": "Linear load increase 10-15% weekly if symptom-free",
     "Timeline": "2-8 weeks mild strain; 8-12 weeks fracture; variable surgery",
     "Red Flags Stop": "Radiating pain; numbness; chest pain cardiac; fever",
     "References": "Clinical consensus RTS spinal MSK"}),
    ("RTS — Throwing / Overhead Athlete", {"ID": "RTS-T-002", "Sport/Context": "Baseball tennis volleyball swimming",
     "Criteria": "Full painless overhead ROM; scapular dyskinesis resolved; TOS tests negative",
     "Strength": "Serratus lower trap endurance; rotator cuff balance; Kibler scapular tests",
     "Functional Tests": "Throwing interval program; serve progression; swim volume build",
     "Progression": "Structured interval throwing ASMI model; 10% volume rule",
     "Timeline": "4-12 weeks post thoracic strain; longer post rib fracture",
     "Red Flags Stop": "Vascular symptoms; winging progression; ulnar paresthesia",
     "References": "ASMI interval throwing; Reinold overhead athlete RTS"}),
    ("RTS — Contact / Collision Sport", {"ID": "RTS-T-003", "Sport/Context": "Rugby football hockey martial arts",
     "Criteria": "Radiographic healing if fracture; pain-free contact simulation; rib cage expansion normal",
     "Strength": "Trunk rotation power; tackle bag tolerance",
     "Functional Tests": "Progressive contact drills non-contact → limited → full",
     "Progression": "Medical clearance; 6-12 weeks post rib fracture typical",
     "Timeline": "Minimum 6 weeks uncomplicated rib fracture often cited",
     "Red Flags Stop": "Flail chest history; pneumothorax; unhealed fracture pain",
     "References": "Bemelman rib fracture return contact"}),
    ("RTS — Rotational Sport (Golf/Tennis/Hockey)", {"ID": "RTS-T-004", "Sport/Context": "High thoracic rotation demand",
     "Criteria": "Rotation ROM symmetric within 10 deg sport norm; no pain ball contact",
     "Strength": "Rotational power chop/lift; hip-thoracic dissociation",
     "Functional Tests": "Gradual swing progression tee → half → full",
     "Progression": "Volume before intensity; monitor next-day stiffness",
     "Timeline": "2-6 weeks intercostal; 8+ weeks significant rib injury",
     "Red Flags Stop": "Catch pain mid-swing; intercostal sharp pain",
     "References": "TPI golf return; tennis medicine protocols"}),
    ("RTS — Respiratory / Endurance Sport", {"ID": "RTS-T-005", "Sport/Context": "Running cycling rowing swimming distance",
     "Criteria": "Normal breathing pattern; chest expansion; no pain deep inspiration sustained",
     "Strength": "Intercostal endurance; diaphragmatic efficiency",
     "Functional Tests": "Gradual volume build 10% rule; talk test",
     "Progression": "Return to volume before intensity intervals",
     "Timeline": "Post costochondritis 2-4 weeks; post rib fracture longer",
     "Red Flags Stop": "Dyspnea disproportionate; chest pain cardiac pattern",
     "References": "Respiratory rehab post COVID applicable principles"}),
    ("RTS — Weightlifting / Powerlifting", {"ID": "RTS-T-006", "Sport/Context": "Squat deadlift bench overhead press",
     "Criteria": "Pain-free hip hinge; thoracic extension under load; Valsalva tolerance if used",
     "Strength": "Progressive loading 50-60-70-80-90% 1RM protocol",
     "Functional Tests": "Technique video; belt optional; no thoracic rounding pain",
     "Progression": "Return deadlift before heavy squat if extension sensitive",
     "Timeline": "Thoracolumbar strain 2-6 weeks; fracture 12+ weeks",
     "Red Flags Stop": "Radicular symptoms under load; thoracic sharp pain flexion",
     "References": "McGill spine loading guidelines lifters"}),
]


IMAGING_RECORDS = [
    ("Thoracic X-Ray AP/Lateral", {"ID": "IMG-T-001", "Modality": "Radiography",
     "Indications": "Trauma, scoliosis screen, kyphosis assessment, suspected fracture, pre-operative",
     "Views": "PA/AP standing; lateral; optional oblique pars if indicated",
     "Findings": "Alignment Cobb kyphosis; vertebral height; rib fractures; pedicle integrity",
     "Limitations": "Low soft tissue contrast; early metastases missed; disc herniation not seen",
     "Radiation": "Moderate; ALARA principle; pregnancy shielding",
     "Clinical Action": "Correlate exam; MRI if neuro deficit normal X-ray",
     "References": "ACR appropriateness criteria thoracic spine"}),
    ("Thoracic MRI", {"ID": "IMG-T-002", "Modality": "MRI",
     "Indications": "Cord compression, disc herniation, infection tumor, persistent radicular/myelopathic",
     "Views": "Sagittal T1 T2 STIR; axial affected levels; contrast if infection tumor",
     "Findings": "Disc herniation; cord signal; paraspinal abscess; Modic endplate changes",
     "Limitations": "Cost; claustrophobia; implants; incidental degenerative changes",
     "Radiation": "None ionizing; gadolinium caution renal",
     "Clinical Action": "Surgical consult myelopathy; PT radicular without progressive deficit often",
     "References": "ACR MRI spine appropriateness"}),
    ("CT Thoracic Spine", {"ID": "IMG-T-003", "Modality": "CT",
     "Indications": "Complex fracture surgical planning; osseous detail; trauma FAST complement",
     "Views": "Axial bone window; sagittal/coronal reconstructions",
     "Findings": "Fracture comminution; canal compromise osseous; facet fracture",
     "Limitations": "Radiation higher; soft tissue inferior MRI",
     "Radiation": "Higher than X-ray; minimize pediatric pregnancy",
     "Clinical Action": "Trauma ortho/spine consult unstable patterns",
     "References": "Trauma imaging guidelines"}),
    ("Bone Scan / PET", {"ID": "IMG-T-004", "Modality": "Nuclear medicine",
     "Indications": "Metastatic workup; occult fracture; infection inflammatory",
     "Views": "Whole body or limited thoracic",
     "Findings": "Increased uptake fracture metastasis infection",
     "Limitations": "Non-specific; anatomical detail poor without SPECT/CT fusion",
     "Radiation": "Radiotracer exposure",
     "Clinical Action": "Oncology referral if metastases; correlate MRI",
     "References": "Oncologic imaging guidelines"}),
    ("Ultrasound — Rib/Intercostal/Slipping Rib", {"ID": "IMG-T-005", "Modality": "Ultrasound",
     "Indications": "Slipping rib dynamic; intercostal tear; point of care rib fracture",
     "Views": "Dynamic anterior rib margin; intercostal muscle",
     "Findings": "Hypermobility slipping rib; hematoma strain; cortical step fracture",
     "Limitations": "Operator dependent; obesity limit; posterior ribs difficult",
     "Radiation": "None",
     "Clinical Action": "Confirms slipping rib pre-surgical consult",
     "References": "Heiderscheit ultrasound slipping rib"}),
    ("DEXA Scan", {"ID": "IMG-T-006", "Modality": "Dual-energy X-ray absorptiometry",
     "Indications": "Osteoporosis screen compression fracture age >65 women >70 men risk factors",
     "Views": "Lumbar hip; sometimes thoracic lateral vertebral assessment FRAX",
     "Findings": "T-score osteoporosis osteopenia",
     "Limitations": "Does not predict all fractures; artifact post-surgery",
     "Radiation": "Very low",
     "Clinical Action": "Medical management bisphosphonate etc per guidelines; PT weight-bearing",
     "References": "NOF osteoporosis guidelines"}),
    ("Thoracic CT Angiography / MR Angiography", {"ID": "IMG-T-007", "Modality": "Angiography CT/MR",
     "Indications": "Suspected arterial/venous TOS; aortic pathology exclusion referred pain",
     "Views": "Subclavian artery vein course; cervical rib",
     "Findings": "Stenosis occlusion aneurysm cervical rib",
     "Limitations": "Contrast allergy renal; not first line MSK chest wall pain",
     "Radiation": "CTA radiation",
     "Clinical Action": "Vascular surgery TOS; emergency if acute arterial",
     "References": "Illig TOS imaging"}),
    ("Scoliosis Full Spine EOS/Long Cassette", {"ID": "IMG-T-008", "Modality": "Long cassette/EOS low-dose",
     "Indications": "Scoliosis monitoring Cobb; leg length; sagittal balance",
     "Views": "PA standing full spine lateral",
     "Findings": "Cobb angle; Risser; kyphosis lordosis balance",
     "Limitations": "Radiation cumulative serial imaging; EOS reduces dose",
     "Radiation": "Manage serial exposure adolescents",
     "Clinical Action": "SRS bracing surgery thresholds Cobb progression",
     "References": "SRS scoliosis imaging standards"}),
]


EVIDENCE_RECORDS = [
    ("Evidence — Thoracic Manipulation Neck Pain", {"ID": "EVD-T-001", "Topic": "Cervicothoracic manipulation for neck pain",
     "Evidence Level": "Level B", "Summary": "Thoracic spine thrust manipulation may reduce neck pain and improve ROM indirectly",
     "Clinical Application": "Consider for neck pain patients with thoracic hypomobility after assessment",
     "Reference Note": "Cross et al thoracic manipulation neck pain systematic review"}),
    ("Evidence — Scapular Exercise Impingement", {"ID": "EVD-T-002", "Topic": "Scapular-focused exercise shoulder impingement",
     "Evidence Level": "Level B", "Summary": "Scapular stabilization exercises reduce impingement symptoms medium term",
     "Clinical Application": "Lower trap serratus progressions for overhead athletes",
     "Reference Note": "Struyf scapular exercise review"}),
    ("Evidence — Breathing Retraining Chronic Pain", {"ID": "EVD-T-003", "Topic": "Diaphragmatic breathing chronic pain",
     "Evidence Level": "Level B", "Summary": "Breathing retraining reduces pain anxiety in chronic pain populations",
     "Clinical Application": "Apical pattern correction TOS neck thoracic pain",
     "Reference Note": "Hopper breath therapy chronic pain"}),
    ("Evidence — Schroth Scoliosis Exercise", {"ID": "EVD-T-004", "Topic": "PSSE/Schroth adolescent scoliosis",
     "Evidence Level": "Level C emerging B", "Summary": "Physiotherapeutic scoliosis-specific exercises may reduce progression when combined bracing",
     "Clinical Application": "Refer certified Schroth therapist growing adolescents",
     "Reference Note": "Negrini Cochrane scoliosis exercise"}),
    ("Evidence — Osteoporotic Vertebral Fracture Mobilization", {"ID": "EVD-T-005", "Topic": "Early mobilization osteoporotic VF",
     "Evidence Level": "Level B", "Summary": "Early activity superior bed rest; targeted exercise reduces future fracture risk with medical therapy",
     "Clinical Application": "Gradual extension loading post VF medical clearance",
     "Reference Note": "Giangregorio exercise osteoporosis guidelines"}),
    ("Evidence — TOS Conservative Management", {"ID": "EVD-T-006", "Topic": "Conservative nTOS",
     "Evidence Level": "Level C", "Summary": "Posture exercise scalene management successful many mild-moderate cases before surgery",
     "Clinical Application": "First rib mobilization scapular strengthening program 3-6 months trial",
     "Reference Note": "Nord conservative TOS outcomes"}),
    ("Evidence — Myofascial Release Thoracic", {"ID": "EVD-T-007", "Topic": "Myofascial release thoracic pain",
     "Evidence Level": "Level C", "Summary": "Short-term ROM pain benefit; long-term superiority not established vs exercise",
     "Clinical Application": "Adjunct not replacement active exercise",
     "Reference Note": "Ajimsha myofascial release systematic review"}),
    ("Evidence — Motor Control Chronic Spinal Pain", {"ID": "EVD-T-008", "Topic": "Motor control exercise thoracic/lumbar",
     "Evidence Level": "Level B", "Summary": "Motor control training reduces chronic spinal pain vs minimal intervention",
     "Clinical Application": "Bird dog dead bug progressive lumbopelvic control",
     "Reference Note": "Saragiotto motor control Cochrane"}),
    ("Evidence — Return to Sport Rib Fracture", {"ID": "EVD-T-009", "Topic": "Rib fracture RTS timelines",
     "Evidence Level": "Level C expert", "Summary": "6 weeks minimum uncomplicated; contact later; pulmonary complications reduced early mobilization",
     "Clinical Application": "Individualize by fracture number pain sport",
     "Reference Note": "Bemelman rib fracture management"}),
    ("Evidence — Thoracic Disc Herniation Surgery", {"ID": "EVD-T-010", "Topic": "Thoracic disc surgery indications",
     "Evidence Level": "Level B surgical", "Summary": "Myelopathy surgical decompression; radicular conservative trial reasonable",
     "Clinical Application": "Urgent MRI progressive neuro deficit",
     "Reference Note": "Wood thoracic disc review"}),
    ("Evidence — Costochondritis Management", {"ID": "EVD-T-011", "Topic": "Costochondritis treatment",
     "Evidence Level": "Level C", "Summary": "NSAIDs reassurance activity modification mainstay; PT adjunct",
     "Clinical Application": "Rule out cardiac before MSK diagnosis",
     "Reference Note": "Disla costochondritis review"}),
    ("Evidence — Thoracic Kyphosis Exercise", {"ID": "EVD-T-012", "Topic": "Exercise for thoracic hyperkyphosis elderly",
     "Evidence Level": "Level B", "Summary": "Progressive extension strengthening improves kyphosis angle and function meta-analyses",
     "Clinical Application": "Extension endurance prone rows face pulls elderly fall prevention overlap",
     "Reference Note": "Katzman hyperkyphosis exercise meta-analysis"}),
]


CLINICAL_EXAM = {
    "Template Name": "Thoracic Spine & Rib Cage Clinical Examination",
    "ID": "EXAM-T-001",
    "Subjective": "Onset mechanism; pain location deep vs superficial; breathing cough sneeze effect; morning stiffness; sport occupation; red flags cardiac pulmonary neuro; prior imaging surgery",
    "Observation": "Posture sagittal frontal planes; scapular position winging; rib cage symmetry; breathing pattern apical vs diaphragmatic; skin marks",
    "Palpation": "Spinous processes TP paraspinals; costotransverse angles; costochondral junctions if anterior; facet line; muscle tone scalenes pec",
    "Active ROM": "Thoracic flexion extension rotation lateral flexion seated; combined patterns sport-specific",
    "Passive ROM": "Segmental PA glides; rib spring; first rib mobility",
    "Special Tests": "As indicated: Adam's test, Roos TOS, Hooking rib, extension rotation, slump if radicular",
    "Neurological": "Dermatomes T1-T12 key points; myotomes; reflexes if indicated; upper motor neuron screen myelopathy",
    "Functional": "Push-up plus; wall angel; overhead reach; lift simulation",
    "Outcome Measures": "Numeric pain rating; Oswestry if thoracolumbar overlap; SRS-22 scoliosis; chest expansion",
    "Clinical Impression": "Synthesize mobility vs stability; regional interdependence cervical lumbar shoulder; breathing contribution",
    "Plan": "Education; manual therapy grade; exercise prescription phase; referral imaging medical if red flags",
    "References": "ISIS guidelines; clinical reasoning textbooks",
}


RED_FLAG_SCREEN = {
    "Template Name": "Thoracic Red Flags & Medical Referral Screen",
    "ID": "EXAM-T-002",
    "Cardiac": "Exertional chest pain; diaphoresis; radiation jaw/arm; dyspnea disproportionate; syncope — emergency cardiac workup before MSK treatment",
    "Pulmonary": "Fever cough hemoptysis; unexplained weight loss; pleuritic pain tachypnea — pulmonary infection PE tumor workup",
    "Neurological": "Progressive bilateral leg weakness; gait disturbance; bowel bladder dysfunction; saddle anesthesia — cord compression emergency MRI",
    "Oncologic": "Age >50 new unremitting pain; night pain unrelieved rest; history cancer; unexplained weight loss — imaging and medical referral",
    "Infection": "Fever IV drug use immunocompromise recent procedure — MRI contrast discitis epidural abscess",
    "Trauma": "High-energy mechanism; suspected fracture dislocation; neuro deficit post-trauma — imaging trauma protocol",
    "Vascular TOS": "Arm swelling cyanosis acute effort thrombosis — emergency vascular workup",
    "Fracture Risk": "Known osteoporosis acute flexion load severe pain — imaging before aggressive manual therapy",
    "References": "NICE red flags; clinical reasoning textbooks; emergency medicine guidelines",
}


TOC_SECTIONS = [
    "Disclaimer",
    "1. Thoracic Spine / Regional Structures (T1-T12, Facets, Discs, Costovertebral, Costotransverse)",
    "2. Ribs (1-12)",
    "3. Thoracic Muscles",
    "4. Breathing Mechanics",
    "5. Scapular Biomechanics",
    "6. Thoracic Outlet Syndrome (Types & Special Tests)",
    "7. Myofascial System",
    "8. Myofascial Chains (Anatomy Trains)",
    "9. Pathologies",
    "10. Special Tests (Thoracic / Rib / Breathing)",
    "11. Clinical Examination Template",
    "12. Rehabilitation Phases",
    "13. Exercise Library",
    "14. Return to Sport",
    "15. Imaging",
    "16. Evidence & Guidelines",
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
        title="Kinora Thoracic Spine & Back AI Orientation Part 3",
        author="Kinora AI Training",
    )
    styles = build_styles()
    story: list = []

    story.append(Spacer(1, 1.2 * inch))
    story.append(Paragraph("Kinora Thoracic Spine &amp; Back", styles["title"]))
    story.append(Paragraph("Clinical AI Orientation (Part 3)", styles["title"]))
    story.append(Spacer(1, 0.3 * inch))
    story.append(Paragraph(
        "Structured reference for RAG / AI-assisted physiotherapy consultation",
        styles["subtitle"],
    ))
    story.append(Spacer(1, 0.2 * inch))
    story.append(Paragraph(
        "Thoracic Spine, Ribs, Breathing, Scapula, TOS, Fascia &amp; Myofascial Chains",
        styles["subtitle"],
    ))
    story.append(Spacer(1, 0.5 * inch))
    story.append(Paragraph("Version 1.0 — Kinora Admin Conocimientos Upload", styles["subtitle"]))
    story.append(PageBreak())

    add_section(story, styles, "Disclaimer")
    story.append(Paragraph(
        "This document is an educational orientation resource for Kinora AI clinical consultation support. "
        "It is NOT a substitute for professional clinical judgment, direct patient examination, or "
        "licensed medical/physiotherapy care. Content reflects established musculoskeletal medicine "
        "and sports rehabilitation concepts but must be verified against current peer-reviewed literature, "
        "local protocols, and individual patient presentation. Always screen for red flags requiring "
        "urgent medical referral (cardiac, pulmonary, cauda equina, progressive neurological deficit, "
        "infection, malignancy). Diagnostic sensitivity/specificity values are approximate and vary by study.",
        styles["disclaimer"],
    ))
    story.append(Spacer(1, 12))

    add_section(story, styles, "Table of Contents")
    for item in TOC_SECTIONS:
        story.append(Paragraph(f"• {esc(item)}", styles["toc"]))
    story.append(PageBreak())

    sections = [
        ("1. Thoracic Spine / Regional Structures", VERTEBRAL_RECORDS),
        ("2. Ribs", RIB_RECORDS),
        ("3. Thoracic Muscles", MUSCLE_RECORDS),
        ("4. Breathing Mechanics", BREATHING_RECORDS),
        ("5. Scapular Biomechanics", SCAPULAR_RECORDS),
        ("6. Thoracic Outlet Syndrome", TOS_RECORDS),
        ("7. Myofascial System", MYOFASCIAL_RECORDS),
        ("8. Myofascial Chains", CHAIN_RECORDS),
    ]

    for title, records in sections:
        add_section(story, styles, title)
        story.append(Spacer(1, 6))
        for name, fields in records:
            add_record(story, styles, name, fields)
        story.append(PageBreak())

    add_section(story, styles, "9. Pathologies")
    for name, fields in PATHOLOGY_RECORDS:
        add_record(story, styles, name, fields)
    story.append(PageBreak())

    add_section(story, styles, "10. Special Tests (Thoracic / Rib / Breathing)")
    for name, fields in SPECIAL_TEST_RECORDS:
        add_record(story, styles, name, fields)
    story.append(PageBreak())

    add_section(story, styles, "11. Clinical Examination Template")
    add_record(story, styles, CLINICAL_EXAM["Template Name"], CLINICAL_EXAM)
    add_record(story, styles, RED_FLAG_SCREEN["Template Name"], RED_FLAG_SCREEN)
    story.append(PageBreak())

    add_section(story, styles, "12. Rehabilitation Phases")
    for name, fields in REHAB_PHASES:
        add_record(story, styles, name, fields)
    story.append(PageBreak())

    add_section(story, styles, "13. Exercise Library")
    for name, fields in EXERCISE_RECORDS:
        add_record(story, styles, name, fields)
    story.append(PageBreak())

    add_section(story, styles, "14. Return to Sport")
    for name, fields in RTS_RECORDS:
        add_record(story, styles, name, fields)
    story.append(PageBreak())

    add_section(story, styles, "15. Imaging")
    for name, fields in IMAGING_RECORDS:
        add_record(story, styles, name, fields)
    story.append(PageBreak())

    add_section(story, styles, "16. Evidence & Guidelines")
    for name, fields in EVIDENCE_RECORDS:
        add_record(story, styles, name, fields)

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
