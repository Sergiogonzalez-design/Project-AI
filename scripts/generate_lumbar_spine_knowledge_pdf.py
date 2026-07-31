#!/usr/bin/env python3
"""
Generate Kinora Lumbar Spine AI Orientation PDF (Part 5) for RAG/clinical training.
Output: knowledge/Kinora_Lumbar_Spine_AI_Orientation.pdf
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
OUTPUT_PATH = PROJECT_ROOT / "knowledge" / "Kinora_Lumbar_Spine_AI_Orientation.pdf"


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
        "Kinora Lumbar Spine AI Orientation Part 5 — Educational Use Only",
    )
    canvas.restoreState()


# ---------------------------------------------------------------------------
# Section 1: Lumbar vertebrae L1–L5
# ---------------------------------------------------------------------------

def build_vertebral_record(level: int) -> tuple[str, dict[str, Any]]:
    names = {1: "First lumbar vertebra", 2: "Second lumbar vertebra",
             3: "Third lumbar vertebra", 4: "Fourth lumbar vertebra",
             5: "Fifth lumbar vertebra"}
    is_l5 = level == 5
    is_l1 = level == 1
    facet_sag = {1: "~90 deg coronal (frontal plane dominant)",
                 2: "~80-85 deg coronal",
                 3: "~70-75 deg coronal",
                 4: "~60-65 deg (transitional toward sagittal)",
                 5: "~45-55 deg (most sagittal lumbar level; transitional to sacrum)"}
    body_desc = {
        1: "Kidney-shaped body; smaller than L2; anterior height slightly greater than posterior; endplates flat",
        2: "Large vertebral body; increased cross-sectional area vs L1; supports upper lumbar load",
        3: "Largest lumbar body typically; central load-bearing segment; endplates broad",
        4: "Large body; iliolumbar ligament attachment region on transverse processes; transition to lumbosacral mechanics",
        5: "Largest and most massive lumbar body; wedge-shaped tendency (anterior taller); sacralization/common transitional anatomy possible; bears greatest lumbosacral shear",
    }
    tp_desc = {
        1: "Long slender transverse processes; no accessory process; mamillary process on superior articular process",
        2: "Long TP; mamillary processes present; attachment for lumbar fascia and quadratus lumborum",
        3: "Long TP; iliocostalis and longissimus attachments; intertransverse ligament anchor",
        4: "TP with iliolumbar ligament attachment (L4 strongest iliolumbar origin); QL insertion",
        5: "Thickest and shortest TP relative to body; robust iliolumbar ligament attachment; highest stress at lumbosacral junction",
    }
    pars = (
        "Pars interarticularis (pedicle-lamina junction) between superior and inferior articular processes; "
        "stress concentration site for spondylolysis; L5 pars most commonly affected in athletes; "
        "orientation permits sagittal plane motion at inferior facets"
    )
    if is_l5:
        pars += "; L5 pars defects common in spondylolysis/spondylolisthesis (isthmic); Scottie dog sign on oblique radiograph"

    fields: dict[str, Any] = {
        "ID": f"VERT-L-{level:02d}",
        "Vertebral Level": f"L{level}",
        "Name": names[level],
        "Region": "Lumbar spine" + (" — lumbosacral transition" if is_l5 else (" — thoracolumbar transition" if is_l1 else "")),
        "Bone Type": "Irregular vertebra (lumbar type)",
        "Body": body_desc[level],
        "Pedicles": (
            f"L{level} pedicles short and strong; project posterolaterally from body; "
            "form lateral vertebral canal boundary; pedicle screw trajectory target in surgery; "
            "nerve root exits below pedicle at same numbered level (e.g., L4 root under L4 pedicle)"
        ),
        "Lamina": (
            "Broad laminae unite spinous process to articular pillars; ligamentum flavum attaches to anterior surface; "
            "multifidus origin from lamina and spinous process; laminectomy removes lamina for decompression"
        ),
        "Spinous Process": (
            "Broad quadrilateral spinous process; horizontal orientation (vs thoracic oblique); "
            "supraspinous and interspinous ligament attachment; palpable midline landmark; "
            + ("L5 SP often prominent at lumbosacral junction" if is_l5 else f"L{level} SP palpable with patient flexed")
        ),
        "Transverse Processes": tp_desc[level],
        "Pars Interarticularis": pars,
        "Articular Facets": (
            f"Superior articular facets face medially-posteriorly; inferior facets face laterally-anteriorly; "
            f"paired zygapophyseal joints with L{level-1 if level > 1 else 'T12'} superiorly and "
            f"L{level+1 if level < 5 else 'S1'} inferiorly; hyaline cartilage; synovial joint"
        ),
        "Facet Orientation": facet_sag[level],
        "Vertebral Canal": (
            "Triangular canal containing cauda equina (below ~L1-L2 conus); dura mater, arachnoid, CSF; "
            "epidural space; ligamentum flavum forms posterior wall; stenosis reduces cross-sectional area"
        ),
        "Intervertebral Foramina": (
            f"Formed by pedicles superior/inferior, vertebral body/disc anteriorly, facet joints posteriorly; "
            f"L{level} nerve root exits foramen; far-lateral/foraminal disc herniation can compress exiting root; "
            "foraminal height decreases in extension and disc height loss"
        ),
        "Articulations": (
            f"L{level}-L{level+1 if level < 5 else 'S1'} disc (symphysis); bilateral facet joints; "
            + ("L5-S1 lumbosacral junction — highest mobility and load" if is_l5 else
               "T12-L1 junction above L1" if is_l1 else f"L{level-1}-L{level} and L{level}-L{level+1} facet pairs")
        ),
        "Muscle Attachments": (
            "Multifidus (SP, lamina, mamillary); erector spinae — iliocostalis lumborum, longissimus thoracis (TP, angles); "
            "quadratus lumborum (TP L1-L4, iliolumbar); psoas major (bodies/Tps L1-L5); "
            "latissimus dorsi via thoracolumbar fascia; intertransversarii and rotatores segmental"
        ),
        "Ligament Attachments": (
            "ALL on anterior body; PLL posterior body; ligamentum flavum lamina-lamina; "
            "interspinous and supraspinous between SPs; intertransverse between TPs; "
            + ("iliolumbar ligament L5 TP to iliac crest (major stabilizer)" if is_l5 else
               "iliolumbar ligament attachment on TP (strongest L4-L5)" if level >= 4 else "intertransverse ligaments")
        ),
        "Blood Supply": (
            f"Segmental lumbar arteries from aorta (typically 4 pairs); spinal branches through intervertebral foramen; "
            f"metameric supply to body, pedicle, lamina; L{level} radicular artery may contribute (variable; artery of Adamkiewicz usually T9-L2)"
        ),
        "Venous Drainage": (
            "Segmental lumbar veins to inferior vena cava/ascending lumbar vein; internal vertebral venous plexus (Batson); "
            "valveless plexus permits metastatic spread; epidural venous engorgement in stenosis"
        ),
        "Innervation": (
            f"Segmental L{level} medial branch dorsal rami innervate facet capsules and multifidus; "
            f"L{level} ventral ramus contributes to lumbar plexus branches; recurrent sinuvertebral nerve to disc/PLL"
        ),
        "Biomechanical Role": (
            f"L{level} contributes to lordosis (~40-60 deg total lumbar); "
            + ("primary lumbosacral load transfer; resists anterior shear of L5 on sacrum" if is_l5 else
               "thoracolumbar transition stiffness at L1" if is_l1 else "central lumbar load bearing and flexion-extension")
        ),
        "Normal Motion": (
            "Segmental flexion 8-12 deg, extension 4-6 deg, lateral flexion 4-6 deg, rotation 1-2 deg (rotation minimal in lumbar); "
            "coupled motions; L4-L5 and L5-S1 greatest total ROM"
        ),
        "Load Transmission": (
            "80% axial load through anterior column (body/disc); 20% through facet joints at neutral standing (approximate); "
            "facets share more load in extension; disc bears compression; posterior elements resist shear"
        ),
        "Clinical Importance": (
            f"L{level} common site for degenerative change, facet arthropathy, and disc pathology; "
            + ("L5 pars/listhesis screening in adolescent athletes" if is_l5 else
               "referral patterns for radiculopathy at this level" if level >= 3 else "upper lumbar disc herniation less common than L4-L5/L5-S1")
        ),
        "Common Injuries": (
            "Disc herniation, facet joint sprain/arthropathy, compression fracture (osteoporosis), "
            "spondylolysis (L5>L4), spondylolisthesis, pars stress reaction, transverse process avulsion (rare)"
        ),
        "Imaging": (
            "AP/lateral X-ray: alignment, spondylolisthesis Meyerding grade, disc height, lordosis; "
            "MRI: disc hydration (Pfirrmann), nerve root compression, Modic endplate changes, stenosis; "
            "CT: pars defects, facet tropism, surgical planning"
        ),
        "Healing": (
            "Bone: 6-12 weeks uncomplicated fracture; pars non-union possible in spondylolysis; "
            "disc: limited intrinsic healing; annular repair fibrotic; modifiable via load management and rehab"
        ),
        "Rehabilitation": (
            "Direction preference (flexion vs extension) per assessment; core stabilization; "
            "progressive loading; avoid prolonged bed rest; motor control multifidus/transversus; "
            "return to activity when pain controlled and functional goals met"
        ),
        "References": "Moore Clinically Oriented Anatomy; Bogduk Clinical Anatomy of the Lumbar Spine and Sacrum 2012; Netter Atlas; Gray's Anatomy",
    }
    return f"L{level} Vertebra", fields


VERTEBRAL_RECORDS: list[tuple[str, dict[str, Any]]] = [
    build_vertebral_record(i) for i in range(1, 6)
]


# ---------------------------------------------------------------------------
# Section 2: Intervertebral discs L1–2 through L5–S1
# ---------------------------------------------------------------------------

def build_disc_record(upper: int) -> tuple[str, dict[str, Any]]:
    lower_label = f"L{upper + 1}" if upper < 5 else "S1"
    level = f"L{upper}-{lower_label}"
    is_l5s1 = upper == 5
    is_l4l5 = upper == 4
    fields: dict[str, Any] = {
        "ID": f"DISC-{level.replace('-', '')}",
        "Level": level,
        "Annulus Fibrosus": (
            "Concentric lamellae of type I collagen (outer) and type II (inner); oblique fiber orientation (~30 deg); "
            "posterior annulus thinner than anterior; outer third innervated by sinuvertebral nerve; "
            "Sharpey fibers anchor to endplate and ring apophysis; circumferential tears (annular fissures) with degeneration"
        ),
        "Nucleus Pulposus": (
            "Gelatinous proteoglycan-rich core (aggrecan, water ~70-90% young adult); "
            "notochordal remnant; imbibition-dehydration cycle with loading; "
            "migrates posteriorly with flexion loading (clinical relevance for flexion-intolerant LBP)"
        ),
        "Endplates": (
            "Hyaline cartilage (~0.6-1 mm) bonded to vertebral body; semipermeable for disc nutrition diffusion; "
            "Modic type 1 (edema/inflammation), type 2 (fatty), type 3 (sclerosis) on MRI indicate endplate-bone marrow changes"
        ),
        "Hydration": (
            "Highest water content in young adults; decreases with age; T2 MRI signal reflects hydration (Pfirrmann grade I-V); "
            + ("L5-S1 earliest/most common degeneration" if is_l5s1 else
               "L4-L5 second most common symptomatic level" if is_l4l5 else f"{level} typically less symptomatic than lower lumbar")
        ),
        "Blood Supply": (
            "Avascular in adult nucleus and inner annulus after ~ age 20; nutrition via diffusion through endplates and annulus periphery; "
            "limited healing capacity after annular tear"
        ),
        "Nutrition": (
            "Mechanical pumping with diurnal loading; impaired nutrition with endplate sclerosis, smoking, sustained static loading; "
            "concentration gradients for glucose and oxygen via endplate"
        ),
        "Innervation": (
            "Sinuvertebral (recurrent meningeal) nerve: posterior annulus, PLL; outer annulus only; "
            "nucleus aneural; pain from annular tear, endplate injury, inflammatory mediators (PLIF, TNF-alpha in disc pathology literature)"
        ),
        "Biomechanics": (
            "Viscoelastic behavior; diurnal height loss ~1% with upright activity; "
            "intradiscal pressure highest sitting (~0.27 MPa approx standing, higher slouched sitting per Nachemson classic studies); "
            "flexion increases posterior annular stress; compression resists axial load"
        ),
        "Compression": (
            "Primary load mode standing/lifting; nucleus pressurizes, annulus tensile hoop stress; "
            "vertical disc height 8-15 mm lumbar (level dependent); endplate failure before annulus in some compression injuries"
        ),
        "Shear": (
            "Resisted by facet joints and posterior annulus; lumbosacral junction highest anterior shear (L5 on S1); "
            "iliolumbar ligament and facets resist shear; relevant in spondylolisthesis mechanics"
        ),
        "Torsion": (
            "Limited lumbar rotation (~1-2 deg/segment); facets and fibers resist torsion; "
            "combined flexion-rotation increases herniation risk in biomechanical models"
        ),
        "Degeneration": (
            "Pfirrmann grading I (homogeneous bright) to V (collapsed dark); dehydration, fissures, height loss, osteophytes; "
            "common imaging finding; weak correlation with pain alone — clinical correlation required"
        ),
        "Bulging": (
            "Circumferential or broad-based annular extension beyond disc margin (>50% circumference or 3 mm beyond); "
            "often age-related; may indent thecal sac without focal nerve displacement"
        ),
        "Protrusion": (
            "Focal base broader than dome; annulus outer fibers intact; contained herniation; "
            "may contact nerve root in lateral recess or foramen depending on location (central, paracentral, foraminal, extraforaminal)"
        ),
        "Extrusion": (
            "Annular defect; herniated material base narrower than apex; may migrate craniocaudally; "
            "often symptomatic if compresses nerve root or causes inflammation"
        ),
        "Sequestration": (
            "Free fragment separated from parent disc; may migrate; surgical consultation often considered if progressive deficit; "
            "MRI best demonstrates migrated fragment"
        ),
        "Clinical Presentation": (
            f"{level} radiculopathy if nerve compressed (dermatome/myotome per level); "
            "central herniation: back pain ± bilateral symptoms; large central: cauda equina risk (EMERGENCY); "
            "leg pain worse than back pain typical radicular pattern; Valsalva may aggravate"
        ),
        "MRI Findings": (
            "T2 signal disc hydration; HIZ (high-intensity zone) annular tear; nerve root displacement/compression; "
            "Modic endplate changes; differentiate bulge vs protrusion vs extrusion vs sequestration per standardized nomenclature"
        ),
        "Treatment": (
            "Conservative first for uncomplicated radiculopathy: education, stay active, NSAIDs, PT; "
            "epidural steroid injection selective cases; surgery (microdiscectomy) for persistent radiculopathy or cauda equina; "
            "NICE NG59 / APTA LBP CPG: avoid bed rest, reassurance, graded activity"
        ),
        "Rehabilitation": (
            "McKenzie directional preference if applicable; neural mobilization; core stabilization; "
            "progressive walking and loading; avoid prolonged flexion early if flexion-intolerant; "
            "return to sport when pain controlled, strength symmetric, no neurological progression"
        ),
        "References": "Bogduk 2012; Jensen et al. N Engl J Med disc herniation imaging; Pfirrmann classification; NICE NG59; APTA Low Back Pain CPG",
    }
    return f"Disc {level}", fields


DISC_RECORDS = [build_disc_record(i) for i in range(1, 6)]


# ---------------------------------------------------------------------------
# Section 3: Facet joints L1–2 through L5–S1
# ---------------------------------------------------------------------------

def build_facet_record(upper: int) -> tuple[str, dict[str, Any]]:
    lower = upper + 1
    lower_label = f"L{lower}" if lower <= 5 else "S1"
    level = f"L{upper}-{lower_label}"
    orient = {
        1: "Biomechanical plane ~90 deg to sagittal (coronal dominant); resists rotation, permits limited flexion-extension",
        2: "~85 deg coronal; increasing sagittal component inferiorly",
        3: "~75 deg; transitional orientation",
        4: "~60 deg; more sagittal — increased flexion-extension freedom",
        5: "~45-50 deg sagittal dominant at L5-S1; greatest flexion-extension, highest facet load in extension",
    }
    fields: dict[str, Any] = {
        "ID": f"FACET-{level.replace('-', '')}",
        "Level": level,
        "Orientation": orient[upper],
        "Joint Type": "Synovial zygapophyseal (plane) joint; hyaline cartilage; fibrous capsule",
        "Capsule": (
            "Loose fibrous capsule; innervated by medial branch dorsal ramus; "
            "capsular distension/synovitis source of facet-mediated pain; fibroadipose meniscoids at superior-inferior poles"
        ),
        "Ligaments": (
            "Facet capsule reinforced by adjacent ligamentum flavum (posterior); "
            "ALL/PLL indirect influence; no separate named ligament beyond capsule at lumbar facets"
        ),
        "Blood Supply": (
            "Medial branch of dorsal ramus accompanying artery; capillary supply to capsule and articular cartilage (limited)"
        ),
        "Innervation": (
            "Medial branch dorsal ramus of same level and level below (dual innervation pattern); "
            "facet denervation via medial branch block/radiofrequency ablation targets in chronic facet pain workup"
        ),
        "Arthrokinematics": (
            "Extension: inferior facet slides inferior-posterior on superior facet of vertebra below; "
            "flexion: superior glide; gapping on ipsilateral side bending; "
            "close-pack position extension; open-pack flexion-rotation"
        ),
        "Osteokinematics": (
            "Guide and limit lumbar motion; sagittal plane primary; rotation minimal; "
            "facet asymmetry (tropism) alters motion and may predispose to degeneration"
        ),
        "Normal Motion": (
            f"Segmental contribution to total lumbar ROM; {level} flexion-extension primary; "
            "rotation restricted by facet orientation and disc"
        ),
        "Pain Referral": (
            "Deep axial low back pain; may refer to buttock, posterior thigh (sclerotomal pattern); "
            "typically NOT below knee (vs radicular); paraspinal tenderness 1-2 cm lateral to SP"
        ),
        "Facet Syndrome": (
            "Clinical diagnosis of facet-mediated pain; extension/rotation loading reproduces pain; "
            "relief with flexion; common in extension-intolerant LBP; degenerative facet arthropathy on imaging common with age"
        ),
        "Special Tests": (
            "Extension-rotation test; Kemp's quadrant (extension-rotation compression); "
            "facet loading in standing extension; PA spring test over articular pillar; "
            "diagnostic medial branch block (≥80% relief threshold in research protocols for facet pain confirmation)"
        ),
        "Manual Therapy": (
            "Grade III-IV PA mobilization; flexion distraction techniques; "
            "HVLA manipulation when appropriate and no contraindications; "
            "avoid aggressive extension manipulation in stenosis"
        ),
        "Rehabilitation": (
            "Flexion-biased exercises if extension provocative; core stabilization; "
            "hip hinge pattern training; avoid prolonged lumbar extension loading; "
            "aerobic conditioning; motor control for neutral spine with functional tasks"
        ),
        "References": "Bogduk 2012 facet joint innervation; Magee 2014; Cohen et al. facet joint interventions systematic reviews",
    }
    return f"Facet Joint {level}", fields


FACET_RECORDS = [build_facet_record(i) for i in range(1, 6)]


# ---------------------------------------------------------------------------
# Section 4: Ligaments
# ---------------------------------------------------------------------------

LIGAMENT_RECORDS: list[tuple[str, dict[str, Any]]] = [
    ("Anterior Longitudinal Ligament (ALL)", {
        "ID": "LIG-LUM-001", "Name": "Anterior Longitudinal Ligament (ALL)",
        "Origin": "Basilar occiput (atlanto-occipital) continuous inferiorly along anterior vertebral bodies and discs to sacrum",
        "Insertion": "Anterior annulus and vertebral body margins at each level; broadest in lumbar spine",
        "Function": "Resists hyperextension, distraction anteriorly, and some rotation; stabilizes anterior column",
        "Biomechanics": "Primary anterior tension band; limits disc bulge anteriorly; loaded in extension",
        "Load Capacity": "High tensile strength; ossification (DISH) may reduce segmental motion",
        "Blood Supply": "Periosteal and segmental branches; relatively avascular mid-substance",
        "Healing": "Slow fibrous healing; calcification possible with chronic injury or DISH",
        "Clinical Tests": "Hyperextension pain; not isolated ligament test — inferred from mechanism and imaging",
        "Common Injuries": "Avulsion rare; more commonly involved in hyperextension trauma with vertebral body fracture",
        "MRI": "Low signal T1/T2; thickening or ossification visible; DISH: flowing ossification along ALL",
        "Ultrasound": "Limited deep visualization; not primary modality for ALL",
        "Treatment": "Extension restriction if acute sprain; bracing rarely; progressive ROM when pain allows",
        "Rehabilitation": "Neutral spine training; avoid aggressive extension early; core stabilization",
        "Return to Sport": "When extension pain-free and functional loading tolerated",
        "References": "Moore; Bogduk 2012; Gray's Anatomy",
    }),
    ("Posterior Longitudinal Ligament (PLL)", {
        "ID": "LIG-LUM-002", "Name": "Posterior Longitudinal Ligament (PLL)",
        "Origin": "C2 body (cranial continuation) along posterior vertebral bodies inside vertebral canal",
        "Insertion": "Posterior annulus and posterior body margins; narrows at disc levels (hourglass shape)",
        "Function": "Resists posterior disc herniation centrally; limits flexion distraction posteriorly",
        "Biomechanics": "Weaker centrally than ALL; lateral disc herniations may occur where PLL is narrowest",
        "Load Capacity": "Moderate; ossification of PLL (OPLL) causes stenosis (more cervical but concept applies)",
        "Blood Supply": "Sinuvertebral artery branches",
        "Healing": "Limited; ossification in chronic conditions",
        "Clinical Tests": "No direct test; central disc herniation may compress thecal sac despite PLL",
        "Common Injuries": "Indirect — disc herniation under PLL; PLL rupture in severe trauma",
        "MRI": "Visible posterior to disc; OPLL if ossified; stenosis assessment",
        "Ultrasound": "Not applicable deep structure",
        "Treatment": "Conservative for disc; surgical if stenosis/myelopathy/cauda equina",
        "Rehabilitation": "Per underlying disc pathology; neural mobilization if radiculopathy",
        "Return to Sport": "Per disc herniation rehab protocol",
        "References": "Bogduk 2012; Netter",
    }),
    ("Ligamentum Flavum", {
        "ID": "LIG-LUM-003", "Name": "Ligamentum Flavum",
        "Origin": "Anterior surface of cranial lamina",
        "Insertion": "Posterior surface of caudal lamina; spans interlaminar space",
        "Function": "Elastin-rich ligament maintains upright posture; prevents buckling into canal in flexion; aids extension return",
        "Biomechanics": "Hypertrophy with age/degeneration contributes to central and lateral recess stenosis; buckling in extension",
        "Load Capacity": "Elastic recoil; 80% elastin content approx",
        "Blood Supply": "Segmental spinal branches",
        "Healing": "Hypertrophic fibrosis rather than normal restoration — may worsen stenosis",
        "Clinical Tests": "Stenosis symptoms worse extension-standing walking (shopping cart sign); not isolated flavum test",
        "Common Injuries": "Hypertrophy/degeneration; calcification rare",
        "MRI": "Best modality; thickening measured on axial T2; contributes to stenosis grade",
        "Ultrasound": "Not used",
        "Treatment": "Surgical decompression (laminectomy/laminotomy) when neurogenic claudication refractory",
        "Rehabilitation": "Flexion-biased mobility; stationary bike; strengthen hip flexors for flexed posture relief",
        "Return to Sport": "Walking/cycling first; avoid extension-loaded sports until symptoms controlled",
        "References": "Bogduk 2012; Magee 2014 lumbar stenosis",
    }),
    ("Interspinous Ligament", {
        "ID": "LIG-LUM-004", "Name": "Interspinous Ligament",
        "Origin": "Base of spinous process",
        "Insertion": "Apex of spinous process below",
        "Function": "Resists flexion separation of SPs; connects posterior column",
        "Biomechanics": "Loaded in flexion; weak link compared to supraspinous in some bending models",
        "Load Capacity": "Moderate tensile",
        "Blood Supply": "Dorsal rami branches",
        "Healing": "Fibrous healing 6-12 weeks typical sprain",
        "Clinical Tests": "Palpation midline tenderness; flexion pain",
        "Common Injuries": "Sprain with hyperflexion; may accompany extension injury of anterior structures",
        "MRI": "Edema between SPs if acute tear",
        "Ultrasound": "Limited utility",
        "Treatment": "Relative rest, NSAIDs, gradual ROM",
        "Rehabilitation": "Cat-camel, bird dog, progressive extension control",
        "Return to Sport": "Pain-free flexion-extension and rotation",
        "References": "Moore; Gray's Anatomy",
    }),
    ("Supraspinous Ligament", {
        "ID": "LIG-LUM-005", "Name": "Supraspinous Ligament",
        "Origin": "Tips of spinous processes",
        "Insertion": "Continuous superiorly to thoracolumbar region; merges with thoracic supraspinous",
        "Function": "Posterior tension band limiting flexion; palpable landmark",
        "Biomechanics": "Works with thoracolumbar fascia and erector spinae; loaded in forward bending",
        "Load Capacity": "Moderate; can sprain with sudden flexion load",
        "Blood Supply": "Segmental cutaneous and dorsal branches",
        "Healing": "6-12 weeks sprain",
        "Clinical Tests": "Midline SP tenderness; forward bend pain",
        "Common Injuries": "Sprain; avulsion rare",
        "MRI": "Signal change at SP tips if torn",
        "Ultrasound": "Superficial portions occasionally imaged",
        "Treatment": "Activity modification, heat, progressive loading",
        "Rehabilitation": "Prone extension progressions if tolerated; core stability",
        "Return to Sport": "Full pain-free ROM and lifting",
        "References": "Moore; Magee 2014",
    }),
    ("Intertransverse Ligament", {
        "ID": "LIG-LUM-006", "Name": "Intertransverse Ligament",
        "Origin": "Transverse process",
        "Insertion": "Adjacent transverse process",
        "Function": "Limits lateral flexion; attachment site for psoas and quadratus lumborum",
        "Biomechanics": "Lateral bending restraint; weak compared to iliolumbar at L4-L5",
        "Load Capacity": "Low-moderate",
        "Blood Supply": "Segmental arteries",
        "Healing": "Standard soft tissue healing",
        "Clinical Tests": "Side bending pain; palpation lateral to SP",
        "Common Injuries": "Strain with lateral bending trauma",
        "MRI": "Uncommon isolated finding",
        "Ultrasound": "Limited",
        "Treatment": "Conservative",
        "Rehabilitation": "Lateral core stability; QL stretching/strengthening",
        "Return to Sport": "Symmetric lateral flexion strength",
        "References": "Bogduk 2012",
    }),
    ("Iliolumbar Ligament", {
        "ID": "LIG-LUM-007", "Name": "Iliolumbar Ligament",
        "Origin": "Transverse processes L4 and L5 (strongest L5 attachment)",
        "Insertion": "Iliac crest posteriorly",
        "Function": "Critical lumbosacral stabilizer; resists L5 anterior shear and side bending",
        "Biomechanics": "Major restraint at lumbosacral junction; stressed in lifting and rotation; weaker in spondylolisthesis",
        "Load Capacity": "High — strongest lumbar ligament by cross-sectional area",
        "Blood Supply": "Iliolumbar artery branch",
        "Healing": "Slow; chronic insufficiency contributes to instability sensation",
        "Clinical Tests": "Pelvic distortion test; palpation TP to iliac crest tenderness; not highly specific",
        "Common Injuries": "Sprain with torsion/lifting; associated with LBP and SI region pain",
        "MRI": "Difficult to visualize; edema at TP attachment if acute",
        "Ultrasound": "Limited deep structure",
        "Treatment": "Stabilization exercises; avoid heavy rotation loading acute phase",
        "Rehabilitation": "QL and multifidus; hip hinge; progressive unilateral loading",
        "Return to Sport": "Single-leg stability tests passed; no shear-provocative pain",
        "References": "Bogduk 2012; lumbosacral biomechanics texts",
    }),
    ("Capsular Facet Ligaments", {
        "ID": "LIG-LUM-008", "Name": "Capsular Facet Ligaments (Zygapophyseal Joint Capsule)",
        "Origin": "Margins of superior and inferior articular processes",
        "Insertion": "Opposite articular process forming joint capsule",
        "Function": "Encloses synovial facet joint; limits excessive translation and rotation",
        "Biomechanics": "Tension in extension and rotation; capsule fold/meniscoid entrapment theorized in acute facet lock",
        "Load Capacity": "Moderate; sprain with whiplash-type or extension-rotation injury",
        "Blood Supply": "Medial branch vascular supply",
        "Healing": "Synovial inflammation may persist — facet arthropathy",
        "Clinical Tests": "Extension-rotation Kemp; PA pillar tenderness; medial branch block diagnostic",
        "Common Injuries": "Facet capsule sprain; synovitis; degenerative capsular thickening",
        "MRI": "Capsular edema if acute; facet joint effusion",
        "Ultrasound": "Not standard",
        "Treatment": "Manual therapy mobilization; anti-inflammatory; RF ablation chronic confirmed facet pain",
        "Rehabilitation": "Flexion preference if extension intolerant; core and hip mobility",
        "Return to Sport": "Extension-rotation without pain",
        "References": "Bogduk 2012; Cohen facet intervention reviews",
    }),
]


# ---------------------------------------------------------------------------
# Section 5: Lumbar muscles
# ---------------------------------------------------------------------------

def _muscle(id_: str, name: str, **kwargs: Any) -> tuple[str, dict[str, Any]]:
    base = {"ID": id_, "Name": name}
    base.update(kwargs)
    return name, base


MUSCLE_RECORDS_RAW: list[tuple[str, dict[str, Any]]] = [
    _muscle("MUS-LUM-001", "Multifidus", Origin="Posterior sacrum, PSIS, mamillary processes of lumbar vertebrae, transverse processes of thoracic vertebrae",
        Insertion="Spinous processes 2-4 segments cranially",
        Innervation="Medial branch dorsal rami of spinal nerves (segmental)",
        Blood_Supply="Segmental arteries and dorsal rami",
        Fiber_Direction="Oblique upward and medial (short segmental stabilizer)",
        Primary_Action="Segmental extension and rotation control of lumbar spine",
        Secondary_Action="Contralateral rotation; stabilizes vertebrae during limb movement",
        Stabilizing_Function="Deep local stabilizer; anticipatory activation before limb movement; atrophy with LBP",
        Length_Tension="Optimal in neutral lordosis; inhibited with pain and segmental instability",
        EMG="High activation during rotation, extension, and anticipatory postural tasks; reduced in chronic LBP",
        Trigger_Points="Deep paraspinal tenderness; may refer locally along spine",
        Pain_Referral="Local axial LBP; not typically distal radicular pattern",
        Stretch="Not primary stretch target; focus on activation",
        Strengthening="Bird dog, side plank with posterior pelvic tilt, prone leg lifts with neutral spine, segmental co-contraction cues",
        Motor_Control="Re-education early in LBP rehab; co-activation with transversus abdominis",
        Clinical_Importance="Multifidus atrophy correlates with recurrent LBP; target in core stability programs",
        Common_Injuries="Strain with rotation/lifting; inhibition post-disc injury",
        Rehabilitation="Low-load isometric → dynamic stabilization → functional integration",
        References="Bogduk 2012; Richardson et al. therapeutic exercise for spinal stabilization; APTA LBP CPG"),
    _muscle("MUS-LUM-002", "Rotatores", Origin="Transverse processes",
        Insertion="Lamina and spinous process of vertebrae 1-2 segments above",
        Innervation="Medial branch dorsal rami", Blood_Supply="Segmental spinal branches",
        Fiber_Direction="Oblique ascending", Primary_Action="Segmental rotation and extension",
        Secondary_Action="Fine-tuning intersegmental motion", Stabilizing_Function="Deep intrinsic stabilizer with multifidus",
        Length_Tension="Short muscles — length changes minimal per segment", EMG="Moderate during rotation tasks",
        Trigger_Points="Deep paraspinal", Pain_Referral="Local", Stretch="Indirect via global rotation mobility",
        Strengthening="Rotational bird dog, controlled segmental rotation", Motor_Control="Integrated with multifidus training",
        Clinical_Importance="Less commonly isolated in clinical practice vs multifidus", Common_Injuries="Rare isolated strain",
        Rehabilitation="Part of deep stabilizer program", References="Moore; Gray's Anatomy"),
    _muscle("MUS-LUM-003", "Interspinales", Origin="Spinous process", Insertion="Spinous process immediately above",
        Innervation="Medial branch dorsal rami", Blood_Supply="Segmental", Fiber_Direction="Vertical between adjacent SPs",
        Primary_Action="Segmental extension", Secondary_Action="Assist multifidus", Stabilizing_Function="Local extensor",
        Length_Tension="Neutral spine optimal", EMG="Active in extension", Trigger_Points="Midline tenderness possible",
        Pain_Referral="Local axial", Stretch="Flexion-based mobility", Strengthening="Prone extension holds, superman progressions",
        Motor_Control="Co-contraction with global extensors", Clinical_Importance="Minor contributor vs erector spinae mass",
        Common_Injuries="Uncommon isolated", Rehabilitation="Extension control training", References="Gray's Anatomy"),
    _muscle("MUS-LUM-004", "Intertransversarii (Lumbar)", Origin="Transverse process", Insertion="Transverse process of vertebra above",
        Innervation="Medial branch dorsal rami", Blood_Supply="Segmental", Fiber_Direction="Vertical between TPs",
        Primary_Action="Lateral flexion (ipsilateral)", Secondary_Action="Stabilization", Stabilizing_Function="Segmental lateral control",
        Length_Tension="Short intersegmental", EMG="Lateral flexion tasks", Trigger_Points="Lateral paraspinal",
        Pain_Referral="Local lateral LBP", Stretch="Side bending opposite", Strengthening="Side plank, suitcase carry",
        Motor_Control="QL and lateral chain integration", Clinical_Importance="Rarely isolated clinically",
        Common_Injuries="Strain with lateral bending", Rehabilitation="Lateral core stability", References="Moore"),
    _muscle("MUS-LUM-005", "Erector Spinae — Iliocostalis Lumborum",
        Origin="Iliac crest, sacrum, lumbar TPs and angles", Insertion="Angles of lower ribs and cervical transverse processes",
        Innervation="Dorsal rami of spinal nerves", Blood_Supply="Lumbar and intercostal arteries",
        Fiber_Direction="Vertical/oblique superior-lateral", Primary_Action="Extension of spine; lateral flexion (unilateral)",
        Secondary_Action="Ipsilateral rotation assistance", Stabilizing_Function="Global extensor; eccentric control during flexion",
        Length_Tension="Lengthened in flexion; shortened in extension", EMG="High in extension, lifting, running",
        Trigger_Points="Paraspinal lateral column; may refer to gluteal region", Pain_Referral="Lower back, iliac crest, gluteal",
        Stretch="Child's pose, knee-to-chest (if flexion tolerated)", Strengthening="Back extension, deadlift pattern, rowing",
        Motor_Control="Co-activation with glutes; hip hinge retraining", Clinical_Importance="Common muscle strain in lifting athletes",
        Common_Injuries="Erector strain (weightlifting, golf)", Rehabilitation="Graded extension loading; hip hinge retraining",
        References="Magee 2014; McGill back biomechanics"),
    _muscle("MUS-LUM-006", "Erector Spinae — Longissimus Thoracis/Lumborum",
        Origin="Lumbar TP, sacrum, iliac crest", Insertion="Lumbar and thoracic TPs, ribs, thoracic SPs",
        Innervation="Dorsal rami", Blood_Supply="Segmental lumbar arteries", Fiber_Direction="Vertical long segments",
        Primary_Action="Spinal extension and lateral flexion", Secondary_Action="Head/neck extension (thoracic portion)",
        Stabilizing_Function="Primary global extensor mass", Length_Tension="Flexion lengthens", EMG="High during standing, walking, lifting",
        Trigger_Points="Paraspinal; thoracolumbar junction", Pain_Referral="Axial and buttock",
        Stretch="Flexion-based as tolerated", Strengthening="Back extension, bird dog, deadlift variations",
        Motor_Control="Balance with anterior core", Clinical_Importance="Major contributor to lifting mechanics",
        Common_Injuries="Strain with flexion-rotation under load", Rehabilitation="Progressive loading; motor pattern retraining",
        References="Moore; McGill"),
    _muscle("MUS-LUM-007", "Quadratus Lumborum (QL)", Origin="Iliac crest, iliolumbar ligament",
        Insertion="Transverse processes L1-L4, 12th rib", Innervation="Ventrolateral rami T12-L4",
        Blood_Supply="Lumbar, iliolumbar arteries", Fiber_Direction="Vertical from iliac crest to TP/12th rib",
        Primary_Action="Ipsilateral lateral flexion; fixes 12th rib during respiration", Secondary_Action="Extension assistance",
        Stabilizing_Function="Lateral stabilizer; single-leg stance", Length_Tension="Shortened with scoliosis/listing",
        EMG="High in side plank, suitcase carry, single-leg tasks", Trigger_Points="Deep lateral LBP; SI and trochanter referral",
        Pain_Referral="Lower back, hip, lateral thigh (somatic)", Stretch="Side-lying over ball, overhead reach opposite",
        Strengthening="Side plank, suitcase carry, single-leg deadlift", Motor_Control="Balance with obliques",
        Clinical_Importance="Frequently implicated in nonspecific LBP", Common_Injuries="Strain with lifting and rotation",
        Rehabilitation="Stretch + strengthen + hip/pelvic stability", References="Travell & Simons; Magee 2014"),
    _muscle("MUS-LUM-008", "Psoas Major", Origin="Transverse processes and bodies L1-L5",
        Insertion="Lesser trochanter of femur (with iliacus)", Innervation="L1-L3 ventral rami (lumbar plexus)",
        Blood_Supply="Lumbar branch iliolumbar artery", Fiber_Direction="Oblique inferior-lateral",
        Primary_Action="Hip flexion; lumbar flexion bilateral", Secondary_Action="Anterior pelvic tilt; increases lordosis",
        Stabilizing_Function="Deep hip flexor; spine-LE linkage", Length_Tension="Shortened with prolonged sitting",
        EMG="High in walking, running, leg raises", Trigger_Points="Deep anterior hip/LBP",
        Pain_Referral="Anterior groin, lumbar region", Stretch="Half-kneeling hip flexor stretch, Thomas test",
        Strengthening="Resisted hip flexion, psoas march", Motor_Control="Avoid dominant psoas in sit-ups",
        Clinical_Importance="Hip flexor tightness linked to LBP presentations", Common_Injuries="Strain in kicking sports",
        Rehabilitation="Hip flexor mobility + glute activation", References="Moore; Magee 2014"),
    _muscle("MUS-LUM-009", "Iliacus", Origin="Iliac fossa", Insertion="Lesser trochanter (iliopsoas tendon)",
        Innervation="Femoral nerve (L2-L4)", Blood_Supply="Iliac branches internal iliac; iliolumbar artery",
        Fiber_Direction="Fan-shaped to tendon", Primary_Action="Hip flexion", Secondary_Action="Anterior pelvic tilt",
        Stabilizing_Function="Pelvic-femoral linkage", Length_Tension="Shortened with sitting", EMG="Hip flexion activities",
        Trigger_Points="Groin, anterior hip", Pain_Referral="Anterior hip", Stretch="Hip flexor stretches",
        Strengthening="Hip flexion against resistance", Motor_Control="Co-activate with glute in gait",
        Clinical_Importance="Iliopsoas vs intra-articular hip differential", Common_Injuries="Contusion; tendinopathy",
        Rehabilitation="Hip flexor eccentric loading", References="Moore; Netter"),
    _muscle("MUS-LUM-010", "Latissimus Dorsi (Lumbar Attachments)",
        Origin="SP T7-L5 via thoracolumbar fascia; iliac crest; inferior ribs",
        Insertion="Intertubercular groove humerus", Innervation="Thoracodorsal nerve (C6-C8)",
        Blood_Supply="Thoracodorsal artery", Fiber_Direction="Oblique superior-lateral to humerus",
        Primary_Action="Shoulder extension, adduction, IR", Secondary_Action="Trunk extension via TL fascia",
        Stabilizing_Function="UE-pelvis kinetic chain", Length_Tension="Affects lumbar fascia tension",
        EMG="Pull-ups, rows, swimming", Trigger_Points="Mid-scapular, lower rib", Pain_Referral="Scapular, lower thoracic",
        Stretch="Overhead reach, doorway lat stretch", Strengthening="Pull-ups, rows, lat pulldown",
        Motor_Control="Coordinate with glute in contralateral patterns", Clinical_Importance="TL fascia via lat affects lumbar mechanics",
        Common_Injuries="Strain with overhead activity", Rehabilitation="Scapular control + core + lat strengthening",
        References="Anatomy Trains superficial back line; Magee 2014"),
    _muscle("MUS-LUM-011", "Gluteus Maximus (Kinetic Chain Partner)",
        Origin="Posterior ilium, sacrum, coccyx, sacrotuberous ligament",
        Insertion="Gluteal tuberosity; iliotibial tract", Innervation="Inferior gluteal nerve (L5-S2)",
        Blood_Supply="Superior and inferior gluteal arteries", Fiber_Direction="Oblique inferior-lateral",
        Primary_Action="Hip extension, external rotation", Secondary_Action="Posterior pelvic tilt; SI force closure",
        Stabilizing_Function="Primary hip extensor; reduces lumbar erector dominance", Length_Tension="Inhibited with sitting",
        EMG="Squat, deadlift, sprint", Trigger_Points="Buttock to posterior thigh", Pain_Referral="Buttock somatic",
        Stretch="Figure-4, pigeon pose", Strengthening="Bridge, hip thrust, RDL, squat",
        Motor_Control="Glute activation before spinal loading", Clinical_Importance="Essential LBP rehab — hip extension offloads spine",
        Common_Injuries="Sprint strain; tendinopathy", Rehabilitation="Glute activation progressions",
        References="McGill; APTA LBP CPG"),
    _muscle("MUS-LUM-012", "Transversus Abdominis",
        Origin="Costal cartilages 7-12, TL fascia, iliac crest, inguinal ligament",
        Insertion="Linea alba, pubic crest", Innervation="T7-L1 intercostal, iliohypogastric/ilioinguinal",
        Blood_Supply="Lower intercostal, deep circumflex iliac", Fiber_Direction="Horizontal (transverse)",
        Primary_Action="Abdominal compression; IAP increase", Secondary_Action="Minimal trunk motion",
        Stabilizing_Function="Anticipatory trunk stability; corset with multifidus and pelvic floor",
        Length_Tension="Optimal at neutral spine", EMG="Low sustained; drawing-in increases selectively",
        Trigger_Points="Deep lower abdominal", Pain_Referral="Lower abdominal",
        Stretch="Activation focus over stretch", Strengthening="Drawing-in, dead bug, plank, Pallof press",
        Motor_Control="Motor control cornerstone (Hodges/Richardson)", Clinical_Importance="Delayed activation in LBP",
        Common_Injuries="Rare strain", Rehabilitation="Low-level isometric → functional carry/lift",
        References="Hodges Richardson; APTA LBP CPG; Cochrane exercise chronic LBP"),
    _muscle("MUS-LUM-013", "Internal Oblique", Origin="TL fascia, iliac crest, inguinal ligament",
        Insertion="Linea alba, pubic crest, ribs 10-12", Innervation="T7-L1 intercostal, iliohypogastric/ilioinguinal",
        Blood_Supply="Lower intercostal, lumbar arteries", Fiber_Direction="Superior-anterior",
        Primary_Action="Ipsilateral lateral flexion; bilateral flexion; same-side rotation",
        Secondary_Action="IAP; TL fascia tension", Stabilizing_Function="Anterolateral stability",
        Length_Tension="Shortened with lateral shift", EMG="Rotation, anti-rotation tasks",
        Trigger_Points="Lower lateral abdomen", Pain_Referral="Groin (differentiate hernia)",
        Stretch="Side-lying stretch", Strengthening="Side plank, Pallof press, wood chop",
        Motor_Control="Coordinate with deep stabilizers", Clinical_Importance="Abdominal wall strain rotation sports",
        Common_Injuries="Oblique strain baseball/golf", Rehabilitation="Graded rotation loading",
        References="Magee 2014"),
    _muscle("MUS-LUM-014", "External Oblique", Origin="External surfaces ribs 5-12",
        Insertion="Linea alba, pubic tubercle, iliac crest", Innervation="T7-L1 intercostal",
        Blood_Supply="Lower intercostal arteries", Fiber_Direction="Inferior-medial",
        Primary_Action="Contralateral rotation; ipsilateral lateral flexion; flexion",
        Secondary_Action="IAP; TL fascia", Stabilizing_Function="Global anterolateral mover",
        Length_Tension="As internal oblique", EMG="Rotation, sit-up, throwing",
        Trigger_Points="Lower ribs, lateral abdomen", Pain_Referral="Groin, lateral hip",
        Stretch="Rotation opposite", Strengthening="Controlled rotation, anti-rotation",
        Motor_Control="Balance bilateral obliques", Clinical_Importance="Athletic rotation power and strain",
        Common_Injuries="External oblique strain", Rehabilitation="Progressive rotation with stability",
        References="Magee 2014"),
    _muscle("MUS-LUM-015", "Rectus Abdominis", Origin="Pubic symphysis and crest",
        Insertion="Xiphoid and costal cartilages 5-7", Innervation="T7-T12 intercostal",
        Blood_Supply="Superior and inferior epigastric arteries", Fiber_Direction="Vertical segmented",
        Primary_Action="Trunk flexion; posterior pelvic tilt", Secondary_Action="IAP; pelvic stabilization",
        Stabilizing_Function="Global flexor", Length_Tension="Lengthened in lordosis",
        EMG="Sit-up, curl-up, leg raise", Trigger_Points="Periumbilical", Pain_Referral="Midline abdominal",
        Stretch="Cobra if extension tolerated", Strengthening="McGill curl-up, dead bug",
        Motor_Control="Avoid excessive sit-up volume in LBP", Clinical_Importance="Diastasis recti modifications",
        Common_Injuries="Strain forceful sit-up", Rehabilitation="Graded flexion with TA co-contraction",
        References="McGill curl-up; Magee 2014"),
]

def _normalize_muscle_records(records: list[tuple[str, dict]]) -> list[tuple[str, dict]]:
    key_map = {
        "Blood_Supply": "Blood Supply", "Fiber_Direction": "Fiber Direction",
        "Primary_Action": "Primary Action", "Secondary_Action": "Secondary Action",
        "Stabilizing_Function": "Stabilizing Function", "Length_Tension": "Length-Tension",
        "Trigger_Points": "Trigger Points", "Pain_Referral": "Pain Referral",
        "Motor_Control": "Motor Control", "Clinical_Importance": "Clinical Importance",
        "Common_Injuries": "Common Injuries",
    }
    out = []
    for name, fields in records:
        normalized = {key_map.get(k, k): v for k, v in fields.items()}
        out.append((name, normalized))
    return out

MUSCLE_RECORDS = _normalize_muscle_records(MUSCLE_RECORDS_RAW)


# ---------------------------------------------------------------------------
# Section 6: Lumbar nerves L1–S1
# ---------------------------------------------------------------------------

def build_nerve_record(root: str) -> tuple[str, dict[str, Any]]:
    data = {
        "L1": {
            "Dermatome": "Groin/inguinal region (limited distinct patch; overlaps L2)",
            "Myotome": "Hip flexion (iliopsoas — L1-L2 contribution); no isolated reliable manual muscle test",
            "Reflex": "No primary deep tendon reflex for L1",
            "Motor": "Iliopsoas (with L2-L3); quadratus lumborum partial",
            "Sensory": "Upper anterior/medial thigh proximal (overlap with L2)",
            "Entrapment": "Rare isolated L1 radiculopathy; upper lumbar disc less common",
            "Clinical Presentation": "Groin/anterior thigh pain; weak hip flexion if severe",
            "Neurodynamic Tests": "Femoral nerve tension (if L2-L3 overlap); SLR typically negative for L1",
            "Differential Diagnosis": "Hip joint pathology, hernia, psoas pathology, upper lumbar facet pain",
            "MRI": "Upper lumbar disc/facet; nerve root at L1 foramen",
            "EMG": "Iliopsoas, quadriceps if L2-L3 involved",
            "Rehabilitation": "Hip flexor strengthening; core stability; address upper lumbar hypomobility if present",
        },
        "L2": {
            "Dermatome": "Anterior thigh to knee (proximal)",
            "Myotome": "Hip flexion (iliopsoas); knee extension (quadriceps contribution L2-L4)",
            "Reflex": "No isolated L2 reflex",
            "Motor": "Iliopsoas, hip adductors (obturator L2-L4 overlap)",
            "Sensory": "Anterior mid-thigh",
            "Entrapment": "Lateral recess or foraminal disc at L2-L3 affects L2 root",
            "Clinical Presentation": "Anterior thigh pain/numbness; hip flexor weakness",
            "Neurodynamic Tests": "Femoral nerve bias (prone knee bend); SLR may be negative",
            "Differential Diagnosis": "Meralgia paresthetica (LFCN), hip pathology, femoral neuropathy",
            "MRI": "L2-L3 disc/foraminal stenosis",
            "EMG": "Iliopsoas, quadriceps",
            "Rehabilitation": "Neural mobilization femoral bias; progressive hip/knee strengthening",
        },
        "L3": {
            "Dermatome": "Anterior thigh and knee; medial knee region",
            "Myotome": "Knee extension (quadriceps — primarily L3-L4)",
            "Reflex": "Patellar reflex contribution (dominant L4)",
            "Motor": "Quadriceps, hip flexors, hip adductors",
            "Sensory": "Anterior thigh, medial knee",
            "Entrapment": "L3-L4 disc paracentral/foraminal",
            "Clinical Presentation": "Anterior thigh pain; knee extension weakness if significant",
            "Neurodynamic Tests": "Femoral nerve tension; SLR usually negative unless L4+ involvement",
            "Differential Diagnosis": "Quadriceps strain, patellofemoral pain, L4 radiculopathy",
            "MRI": "L3-L4 level pathology",
            "EMG": "Quadriceps",
            "Rehabilitation": "Quadriceps strengthening; patellar mobilization if referred knee pain",
        },
        "L4": {
            "Dermatome": "Medial leg and medial malleolus (classic L4 distribution)",
            "Myotome": "Knee extension (quadriceps); ankle dorsiflexion (tibialis anterior contribution L4-L5)",
            "Reflex": "Patellar (quadriceps) reflex — primary L4",
            "Motor": "Quadriceps, tibialis anterior (with L5), hip adductors",
            "Sensory": "Medial lower leg, medial foot",
            "Entrapment": "L4-L5 disc most common paracentral herniation level; lateral recess stenosis",
            "Clinical Presentation": "Low back pain with medial leg pain; quadriceps weakness; reduced patellar reflex",
            "Neurodynamic Tests": "SLR positive if L4/L5 root tension; crossed SLR increases specificity",
            "Differential Diagnosis": "L5 radiculopathy (lateral leg), spinal stenosis, hip OA referred pain",
            "MRI": "Gold standard for L4 root compression at L4-L5",
            "EMG": "Quadriceps, tibialis anterior",
            "Rehabilitation": "Directional preference; neural glides; progressive LE strengthening; monitor reflex",
        },
        "L5": {
            "Dermatome": "Lateral leg, dorsum of foot, great toe (web space)",
            "Myotome": "Great toe extension (EHL — primarily L5); hip abduction (gluteus medius L5-S1)",
            "Reflex": "No primary deep tendon reflex (medial hamstring reflex variable, not routine)",
            "Motor": "Extensor hallucis longus, gluteus medius, tibialis anterior (shared L4-L5)",
            "Sensory": "Lateral lower leg, dorsum foot, 1st toe",
            "Entrapment": "L5-S1 and L4-L5 discs; foraminal/extraforaminal L5 compression common clinically",
            "Clinical Presentation": "Sciatica lateral leg/foot; foot drop component if EHL weak; difficulty heel walk",
            "Neurodynamic Tests": "SLR, slump test, femoral nerve test negative unless dual level",
            "Differential Diagnosis": "Peroneal neuropathy at fibular head (foot drop), SI joint pain, piriformis syndrome",
            "MRI": "L4-L5 and L5-S1 disc; L5 nerve root in foramen",
            "EMG": "EHL, tibialis anterior, gluteus medius",
            "Rehabilitation": "Ankle dorsiflexion/EHL strengthening; hip abduction; avoid prolonged flexion if disc",
        },
        "S1": {
            "Dermatome": "Posterior leg, lateral foot, heel, 4th-5th toes",
            "Myotome": "Plantarflexion (gastrocnemius/soleus — S1); hip extension (gluteus maximus)",
            "Reflex": "Achilles (ankle jerk) reflex — primary S1",
            "Motor": "Gastrocnemius, soleus, gluteus maximus, hamstrings (partial)",
            "Sensory": "Posterior calf, lateral foot, sole",
            "Entrapment": "L5-S1 disc herniation; lateral recess at L5-S1; piriformis syndrome (sciatic nerve not root but S1 distribution overlap)",
            "Clinical Presentation": "Classic sciatica posterior leg; calf weakness; reduced Achilles reflex",
            "Neurodynamic Tests": "SLR most sensitive for S1 radiculopathy; slump test; bowstring test",
            "Differential Diagnosis": "Hamstring strain, Achilles tendinopathy, SI joint, vascular claudication",
            "MRI": "L5-S1 disc and S1 root; differentiate from canal stenosis",
            "EMG": "Gastrocnemius, gluteus maximus",
            "Rehabilitation": "Plantarflexor and hip extension strengthening; walking program; monitor reflex recovery",
        },
    }
    d = data[root]
    fields: dict[str, Any] = {
        "ID": f"NERVE-{root}",
        "Root": root,
        **d,
        "References": "Netter dermatomes/myotomes; Magee 2014; Bogduk 2012 nerve root anatomy",
    }
    if root in ("L4", "L5", "S1"):
        fields["Clinical Presentation"] += (
            "; CAUDA EQUINA: bilateral leg symptoms, saddle anesthesia, urinary retention/incontinence, "
            "progressive bilateral weakness — EMERGENCY surgical referral; not isolated single-root pattern"
        )
    return f"Nerve Root {root}", fields


NERVE_RECORDS = [build_nerve_record(r) for r in ("L1", "L2", "L3", "L4", "L5", "S1")]

CAUDA_EQUINA_NOTE = ("Cauda Equina Syndrome (Urgent Pathology Entity)", {
    "ID": "NERVE-CAUDA-001",
    "Root": "Cauda equina (L2-L5 nerve roots within thecal sac below conus medullaris ~L1-L2)",
    "Dermatome": "Saddle area (perianal, genitals, medial buttocks) — bilateral",
    "Myotome": "Multiple root levels — bilateral leg weakness",
    "Reflex": "May lose ankle and patellar reflexes bilaterally",
    "Motor": "Bilateral lower extremity weakness; foot drop possible; reduced anal sphincter tone",
    "Sensory": "Saddle anesthesia/paresthesia; bilateral leg sensory loss",
    "Entrapment": "Large central disc herniation, tumor, epidural abscess, hematoma, fracture fragment",
    "Clinical Presentation": "URGENCIA MÉDICA: urinary retention or overflow incontinence, fecal incontinence, "
        "saddle anesthesia, bilateral sciatica, progressive neurological deficit; may have back pain",
    "Neurodynamic Tests": "Do NOT delay imaging for exhaustive testing — urgent MRI if suspected",
    "Differential Diagnosis": "Must distinguish from bilateral radiculopathy, spinal stenosis (usually gradual), "
        "conus medullaris syndrome (upper motor neuron signs, earlier bladder involvement at T12-L2)",
    "MRI": "EMERGENCY MRI whole lumbar spine with contrast if infection/malignancy suspected",
    "EMG": "Not for acute diagnosis — surgical emergency takes priority",
    "Rehabilitation": "Post-surgical rehab only after decompression; bowel/bladder rehab; long-term may need multidisciplinary care",
    "References": "NICE NG59 red flags; ACR appropriateness MRI lumbar; Bogduk 2012; APTA LBP CPG emergency referral",
})

NERVE_RECORDS.append(CAUDA_EQUINA_NOTE)


# ---------------------------------------------------------------------------
# Section 7: Blood supply
# ---------------------------------------------------------------------------

BLOOD_SUPPLY_RECORDS: list[tuple[str, dict[str, Any]]] = [
    ("Abdominal Aorta — Lumbar Segment", {
        "ID": "VAS-LUM-001", "Artery": "Abdominal Aorta (lumbar segment)",
        "Origin": "Continuation of thoracic aorta through diaphragm aortic hiatus (~T12)",
        "Course": "Retroperitoneal anterior to lumbar vertebral bodies; bifurcates L4-L5 into common iliac arteries",
        "Branches": "Four paired lumbar arteries (L1-L4 typical); middle sacral artery from posterior aspect",
        "Structures Supplied": "Posterior abdominal wall, vertebral bodies via segmental branches, spinal cord/cauda equina via radicular arteries",
        "Venous Drainage": "Paired lumbar veins to inferior vena cava; ascending lumbar veins anastomose",
        "Clinical Importance": "Aortic pathology (aneurysm) may present as back pain; surgical approach awareness",
        "Imaging": "CT angiography for vascular pathology; MRI for soft tissue",
        "References": "Moore; Gray's Anatomy; Netter",
    }),
    ("Lumbar Arteries (Segmental)", {
        "ID": "VAS-LUM-002", "Artery": "Lumbar Arteries (Segmental — typically 4 pairs)",
        "Origin": "Posterolateral abdominal aorta at each lumbar level",
        "Course": "Pass posteriorly along vertebral body; divide into spinal, psoas, and dorsal branches",
        "Branches": "Spinal branch enters intervertebral foramen; psoas branch; dorsal branch to paraspinal muscles",
        "Structures Supplied": "Vertebral body, pedicle, paraspinal muscles, psoas, dura, nerve roots",
        "Venous Drainage": "Companion lumbar veins; internal vertebral venous plexus communication",
        "Clinical Importance": "Bleeding risk in anterior lumbar surgery; segmental artery ligation considerations",
        "Imaging": "CT for preoperative vascular mapping",
        "References": "Bogduk 2012; surgical anatomy texts",
    }),
    ("Spinal/Radicular Arteries", {
        "ID": "VAS-LUM-003", "Artery": "Radicular and Medullary Arteries (Variable)",
        "Origin": "Spinal branches of segmental arteries entering IVF",
        "Course": "Accompany nerve roots; anterior and posterior radicular arteries; great anterior radiculomedullary artery (artery of Adamkiewicz) typically T9-L2",
        "Branches": "Supply nerve roots and contribute to cauda equina/cord perfusion",
        "Structures Supplied": "Nerve roots, dura, cauda equina; cord below T8 via Adamkiewicz",
        "Venous Drainage": "Radicular veins to internal vertebral plexus",
        "Clinical Importance": "Iatrogenic injury during surgery rare but catastrophic (spinal cord/cauda ischemia); "
            "collateral circulation variable",
        "Imaging": "Angiography rarely preoperative unless vascular malformation suspected",
        "References": "Bogduk 2012; Netter neurovascular",
    }),
    ("Iliolumbar Artery", {
        "ID": "VAS-LUM-004", "Artery": "Iliolumbar Artery",
        "Origin": "Posterior division of internal iliac artery (or common iliac variant)",
        "Course": "Ascends behind psoas to iliac fossa; iliolumbar ligament region",
        "Branches": "Spinal, iliac, lumbar muscular branches",
        "Structures Supplied": "Iliolumbar ligament, QL, psoas, L5 vertebral body region, anastomosis with lumbar arteries",
        "Venous Drainage": "Iliolumbar vein to internal iliac system",
        "Clinical Importance": "L5 vascular supply; relevant in lumbosacral fusion and posterior approaches",
        "Imaging": "CT angiography if vascular anomaly suspected",
        "References": "Moore; Bogduk 2012",
    }),
    ("Middle Sacral Artery", {
        "ID": "VAS-LUM-005", "Artery": "Middle Sacral Artery",
        "Origin": "Posterior aspect of aortic bifurcation",
        "Course": "Descends anterior to sacrum to coccyx",
        "Branches": "Lateral sacral branches anastomose with iliolumbar and lateral sacral arteries",
        "Structures Supplied": "Sacrum, rectum (anterior branches), coccygeal region",
        "Venous Drainage": "Middle sacral vein",
        "Clinical Importance": "Sacral surgery hemostasis; anastomotic network at lumbosacral junction",
        "Imaging": "CT for pelvic vascular anatomy",
        "References": "Gray's Anatomy",
    }),
    ("Internal Vertebral Venous Plexus (Batson)", {
        "ID": "VAS-LUM-006", "Artery": "Internal Vertebral Venous Plexus (Batson's Plexus) — Venous",
        "Origin": "Valveless venous network within vertebral canal and epidural space",
        "Course": "Communicates cranially with intracranial sinuses; caudally to sacral plexus; "
            "laterally via intervertebral veins to azygos/segmental systems",
        "Branches": "Basivertebral veins from vertebral bodies; anterior and posterior plexuses",
        "Structures Supplied": "N/A (venous drainage of vertebrae, epidural space, nerve roots)",
        "Venous Drainage": "Route for metastatic spread (prostate, breast, lung); engorgement with Valsalva and stenosis",
        "Clinical Importance": "Epidural venous engorgement contributes to neurogenic claudication; "
            "metastatic workup if cancer history and new back pain",
        "Imaging": "MRI shows epidural vein prominence; bone scan/CT for metastases",
        "References": "Batson vertebral venous plexus classic description; Moore",
    }),
    ("Ascending Lumbar Veins", {
        "ID": "VAS-LUM-007", "Artery": "Ascending Lumbar Veins — Venous",
        "Origin": "Common iliac and lumbar venous tributaries",
        "Course": "Ascend on anterior vertebral bodies; connect IVC and azygos systems",
        "Branches": "Anastomoses with lumbar veins and vertebral plexus",
        "Structures Supplied": "Venous drainage posterior abdominal wall and vertebrae",
        "Venous Drainage": "Collateral pathway if IVC obstruction",
        "Clinical Importance": "Surgical landmark in retroperitoneal approaches",
        "Imaging": "CT venography if indicated",
        "References": "Gray's Anatomy",
    }),
]


# ---------------------------------------------------------------------------
# Section 8: Lumbar fascia
# ---------------------------------------------------------------------------

FASCIA_RECORDS: list[tuple[str, dict[str, Any]]] = [
    ("Thoracolumbar Fascia", {
        "ID": "FAS-LUM-001", "Structure": "Thoracolumbar Fascia (TLF)",
        "Attachments": "Spinous processes, iliac crest, ribs, latissimus dorsi, internal oblique, transversus abdominis, "
            "sacroiliac region; three layers (posterior, middle, anterior) investing QL",
        "Continuity": "Continuous with thoracic fascia superiorly, gluteal fascia inferiorly, "
            "abdominal fascia anteriorly; integrates with posterior layer of abdominal wall",
        "Force Transmission": "Transfers loads between spine, pelvis, and lower extremity; "
            "eccentric load during lifting via latissimus and glute connections; fascial tensioning with IAP",
        "Clinical Importance": "Central to lumbopelvic stability models; TLF dysfunction implicated in LBP and lifting mechanics",
        "Restrictions": "Thickened/fibrotic fascia may limit trunk mobility; post-surgical scarring",
        "Assessment": "Palpation paraspinal and lateral to QL; fascial glide assessment in side-lying; "
            "observe lifting pattern and fascial tension with bracing",
        "Treatment": "Myofascial release, instrument-assisted soft tissue mobilization (limited evidence), "
            "loading through functional patterns preferred over passive-only",
        "Evidence": "Fascial role in force transfer supported biomechanically; manual fascial release evidence modest — "
            "exercise and loading stronger evidence base (APTA LBP CPG)",
        "References": "Myers Anatomy Trains; Bogduk 2012; Willard TLF anatomy research",
    }),
    ("Lumbar Fascia (Paraspinal/Investing)", {
        "ID": "FAS-LUM-002", "Structure": "Lumbar Fascia (Paraspinal and Investing Layers)",
        "Attachments": "Invests erector spinae; attaches to lumbar SP, TP, and iliac crest",
        "Continuity": "Part of TLF system; separates paraspinal compartment",
        "Force Transmission": "Compartmental pressure during extension and lifting; distributes erector spinae force",
        "Clinical Importance": "Paraspinal compartment concept in back muscle strain; palpation tenderness in myofascial LBP",
        "Restrictions": "Muscle guarding increases fascial tension; chronic pain central sensitization overlap",
        "Assessment": "Palpation paraspinal muscle and overlying fascia; tone at rest vs activation",
        "Treatment": "Heat, gentle mobilization, progressive loading, dry needling (where permitted) for trigger points",
        "Evidence": "Active exercise superior to passive-only for chronic LBP (Cochrane reviews)",
        "References": "Gray's Anatomy; Travell & Simons",
    }),
    ("Abdominal Fascia (Anterior/Lateral Abdominal Wall)", {
        "ID": "FAS-LUM-003", "Structure": "Abdominal Fascia (Anterior and Lateral Wall)",
        "Attachments": "Rectus sheath, linea alba, external/internal oblique aponeuroses, inguinal ligament, iliac crest",
        "Continuity": "Integrates with TLF posteriorly; forms rectus sheath enwrapping rectus abdominis",
        "Force Transmission": "Transfers IAP and anterior tension; oblique lines of force to pelvis and spine",
        "Clinical Importance": "Core stability — fascial tension with TA/oblique co-contraction; hernia differential in groin pain",
        "Restrictions": "Post-surgical (C-section, appendectomy) adhesions may alter motor control",
        "Assessment": "Abdominal bracing observation; diastasis recti gap measurement; cough impulse",
        "Treatment": "Progressive core training; address diastasis with appropriate progressions",
        "Evidence": "Motor control and graded exercise for LBP — moderate-strong recommendation (NICE NG59, APTA CPG)",
        "References": "Moore; Hodges/Richardson core stability research",
    }),
]


# ---------------------------------------------------------------------------
# Section 9: Biomechanics movements
# ---------------------------------------------------------------------------

BIOMECHANICS_RECORDS: list[tuple[str, dict[str, Any]]] = [
    ("Flexion", {
        "ID": "BIO-LUM-001", "Movement": "Lumbar Flexion",
        "Plane": "Sagittal", "Axis": "Coronal axis (mediolateral)",
        "Primary Movers": "Rectus abdominis, psoas (bilateral), external obliques",
        "Stabilizers": "Erector spinae eccentric control; multifidus; transversus abdominis",
        "Arthrokinematics": "Superior facets slide anterior-superior; disc nucleus migrates posteriorly; posterior annulus tension increases",
        "Joint Reaction Forces": "Posterior annulus and PLL loaded; intradiscal pressure increases with flexion load",
        "Torque": "Flexion moment increases with forward bending and anterior load (lifting far from body)",
        "Length-Tension": "Erector spinae lengthened; may reduce passive tension capacity if held prolonged flexion",
        "EMG": "Abdominals increase; erector spinae eccentric activity in controlled flexion",
        "Compensations": "Hip hinge loss → excessive lumbar flexion in lifting; thoracic kyphosis compensation",
        "Common Dysfunctions": "Flexion-intolerant LBP (disc, facet in some); flexion-relief stenosis pattern opposite",
        "Clinical Relevance": "McKenzie extension vs flexion preference; sit-to-stand pattern assessment",
        "Assessment": "Repeated flexion/extension testing; finger-to-floor; sit-slouch test",
        "Exercises": "Cat-camel, curl-up (McGill), hip hinge drill, dead bug",
        "References": "McGill; Nachemson intradiscal pressure; Bogduk 2012",
    }),
    ("Extension", {
        "ID": "BIO-LUM-002", "Movement": "Lumbar Extension",
        "Plane": "Sagittal", "Axis": "Coronal axis",
        "Primary Movers": "Erector spinae, multifidus, QL (assist)",
        "Stabilizers": "Abdominals eccentric; gluteus maximus posterior pelvic tilt assist",
        "Arthrokinematics": "Inferior facets slide posterior-inferior; foraminal narrowing; ligamentum flavum buckling",
        "Joint Reaction Forces": "Facet joints load-share increases (~30% approx in extension); pars stress in hyperextension athletes",
        "Torque": "Extension moment in standing backbend, overhead reach, running uphill",
        "Length-Tension": "Erector spinae shortened; abdominals lengthened",
        "EMG": "High erector activity in prone extension, standing extension",
        "Compensations": "Hyperlordosis — dominant lumbar extension vs hip extension; spondylolytic athlete extension pain",
        "Common Dysfunctions": "Extension-intolerant LBP (facet syndrome, stenosis); spondylolysis pain with extension/rotation",
        "Clinical Relevance": "Stenosis worse extension-standing; facet syndrome extension provocative",
        "Assessment": "Prone press-up; standing extension; repeated extension test",
        "Exercises": "Prone props (McKenzie), hip extension (bridge), avoid end-range extension in stenosis",
        "References": "Bogduk 2012; Magee 2014",
    }),
    ("Rotation", {
        "ID": "BIO-LUM-003", "Movement": "Lumbar Rotation",
        "Plane": "Transverse", "Axis": "Vertical (superior-inferior)",
        "Primary Movers": "Internal/external obliques, multifidus, rotatores",
        "Stabilizers": "Transversus abdominis; contralateral QL",
        "Arthrokinematics": "Minimal lumbar rotation (~1-2 deg/segment); coupled with lateral flexion",
        "Joint Reaction Forces": "Torsional stress on disc annulus; pars stress in rotation-extension (cricket, golf)",
        "Torque": "Rotation torque in throwing, golf swing, shoveling",
        "Length-Tension": "Obliques alternately shortened/lengthened",
        "EMG": "High oblique and paraspinal during rotation sports",
        "Compensations": "Thoracic rotation compensation if lumbar stiff; excessive lumbar rotation in golf",
        "Common Dysfunctions": "Disc annular tear with rotation-flexion; spondylolysis in rotation sports",
        "Clinical Relevance": "Modify rotation load in acute disc injury; golf swing biomechanics",
        "Assessment": "Seated rotation ROM; rotation with extension Kemp test",
        "Exercises": "Thoracic rotation mobility, anti-rotation Pallof press, controlled wood chop progressions",
        "References": "McGill; sports biomechanics literature",
    }),
    ("Side Bending (Lateral Flexion)", {
        "ID": "BIO-LUM-004", "Movement": "Side Bending (Lateral Flexion)",
        "Plane": "Frontal", "Axis": "Anteroposterior axis",
        "Primary Movers": "Quadratus lumborum, erector spinae (unilateral), obliques",
        "Stabilizers": "Contralateral QL and obliques; multifidus",
        "Arthrokinematics": "Ipsilateral facets close; contralateral gapping; intertransverse ligament tension",
        "Joint Reaction Forces": "Asymmetric disc loading; iliolumbar ligament stress",
        "Torque": "Lateral bend with carrying load on one side (suitcase)",
        "Length-Tension": "Ipsilateral QL shortened; contralateral lengthened",
        "EMG": "QL and obliques high in side plank, lateral carry",
        "Compensations": "Listing antalgic posture in radiculopathy; scoliosis structural vs functional",
        "Common Dysfunctions": "QL strain; disc herniation with lateral shift (McKenzie correction)",
        "Clinical Relevance": "Antalgic list reduction via extension or side glide techniques",
        "Assessment": "Standing lateral flexion; observe list; side glide response",
        "Exercises": "Side plank, suitcase carry, controlled lateral flexion mobility",
        "References": "Magee 2014; McKenzie mechanical diagnosis",
    }),
    ("Lifting", {
        "ID": "BIO-LUM-005", "Movement": "Lifting (Manual Material Handling)",
        "Plane": "Multi-planar (primarily sagittal)", "Axis": "Multiple",
        "Primary Movers": "Gluteus maximus, hamstrings, quadriceps, erector spinae",
        "Stabilizers": "Transversus abdominis, multifidus, IAP, TL fascia",
        "Arthrokinematics": "Hip hinge preserves neutral lumbar lordosis; flexion increases disc pressure",
        "Joint Reaction Forces": "Intradiscal pressure highest with flexion + compression + anterior load (Nachemson classic studies)",
        "Torque": "Moment arm of load critical — keep load close to body",
        "Length-Tension": "Glute/hamstring length in hip hinge; erector co-contraction",
        "EMG": "Glute and erector high; abdominals bracing pre-lift",
        "Compensations": "Leg-dominant vs back-dominant lifter; stoop lift vs squat lift patterns",
        "Common Dysfunctions": "Disc injury with flexion-rotation under load; erector strain",
        "Clinical Relevance": "Workplace ergonomics; return-to-work lifting assessment",
        "Assessment": "Observe lifting technique; load tolerance testing graduated",
        "Exercises": "Hip hinge, deadlift progression, farmer carry, bracing drills",
        "References": "McGill Big 3; NIOSH lifting equation; APTA RTW guidelines",
    }),
    ("Sitting", {
        "ID": "BIO-LUM-006", "Movement": "Sitting",
        "Plane": "Sagittal (postural)", "Axis": "Coronal",
        "Primary Movers": "Minimal active — postural muscles isometric",
        "Stabilizers": "Erector spinae, multifidus, abdominals maintain lordosis",
        "Arthrokinematics": "Flexed sitting flattens lordosis; increased posterior disc pressure",
        "Joint Reaction Forces": "Intradiscal pressure elevated vs standing (slouched sitting worst per classic studies)",
        "Torque": "Sustained flexion creep in disc viscoelastic tissues",
        "Length-Tension": "Hip flexors shortened; glutes inhibited",
        "EMG": "Low-level paraspinal; increased with unsupported sitting",
        "Compensations": "Posterior pelvic tilt slouch; perching on seat edge",
        "Common Dysfunctions": "Prolonged sitting LBP risk factor (multifactorial)",
        "Clinical Relevance": "Micro-breaks, lumbar support, sit-stand desks",
        "Assessment": "Workstation ergonomics; sitting tolerance",
        "Exercises": "Hip flexor stretch, glute activation, postural breaks",
        "References": "NICE NG59 stay active; occupational health guidelines",
    }),
    ("Walking", {
        "ID": "BIO-LUM-007", "Movement": "Walking (Gait)",
        "Plane": "Sagittal primary with transverse rotation", "Axis": "Multiple",
        "Primary Movers": "Hip flexors/extensors, erector spinae, abdominals rhythmically",
        "Stabilizers": "Multifidus, QL, gluteus medius",
        "Arthrokinematics": "Pelvic rotation and lumbar counter-rotation (~2-4 deg)",
        "Joint Reaction Forces": "Moderate cyclic loading; beneficial disc nutrition pumping",
        "Torque": "Alternating hip moments",
        "Length-Tension": "Rhythmic muscle length changes",
        "EMG": "Erector and abdominals alternate; glute max at terminal stance",
        "Compensations": "Reduced arm swing; shortened stride in LBP; flexed posture in stenosis",
        "Common Dysfunctions": "Neurogenic claudication limits walking distance in stenosis",
        "Clinical Relevance": "First-line aerobic activity for LBP (NICE); graded walking programs",
        "Assessment": "Gait observation; walking tolerance; distance to symptom onset",
        "Exercises": "Graded walking progression; treadmill incline for stenosis (flexed posture)",
        "References": "NICE NG59; Cochrane walking exercise LBP",
    }),
    ("Running", {
        "ID": "BIO-LUM-008", "Movement": "Running",
        "Plane": "Sagittal with transverse components", "Axis": "Multiple",
        "Primary Movers": "Hip extensors, quadriceps, erector spinae, abdominals",
        "Stabilizers": "Multifidus, gluteus medius, core",
        "Arthrokinematics": "Higher impact than walking; lumbar lordosis maintained by co-contraction",
        "Joint Reaction Forces": "Ground reaction force 2-3× body weight approx; disc cyclical loading",
        "Torque": "Increased trunk stabilization demand at faster speeds",
        "Length-Tension": "Hip flexor tightness affects stride and lumbar posture",
        "EMG": "Higher paraspinal and glute than walking",
        "Compensations": "Overstriding; excessive lumbar extension at toe-off; pelvic drop",
        "Common Dysfunctions": "Disc and facet irritation with high impact if not conditioned",
        "Clinical Relevance": "Return-to-run criteria after LBP; gradual load progression",
        "Assessment": "Running gait analysis; symptom response 24h post-run",
        "Exercises": "Bridge, single-leg stability, gradual run-walk progression, cadence modification",
        "References": "Sports medicine return-to-run protocols; McGill spine stability for athletes",
    }),
]


# ---------------------------------------------------------------------------
# Section 10: Pathologies
# ---------------------------------------------------------------------------

PATHOLOGY_RECORDS: list[tuple[str, dict[str, Any]]] = [
    ("Disc Herniation", {
        "ID": "PATH-LUM-001", "Condition": "Lumbar Disc Herniation (Protrusion/Extrusion/Sequestration)",
        "Definition": "Displacement of disc material beyond intervertebral disc space — bulge, protrusion, extrusion, or sequestration per standardized nomenclature",
        "Mechanism": "Annular tear with nucleus migration; often flexion-rotation loading; degeneration predisposes",
        "Symptoms": "Axial LBP ± radicular leg pain below knee; dermatomal paresthesia; worse with flexion/sit/Valsalva",
        "Red Flags": "Cauda equina (bilateral symptoms, saddle anesthesia, urinary retention), progressive motor deficit, fever, cancer history",
        "Differential Diagnosis": "Radiculopathy other causes, facet syndrome, SI joint, hip pathology, hamstring strain",
        "Clinical Tests": "SLR (sensitive sciatica), crossed SLR (specific), slump test, neurological exam myotome/reflex",
        "Imaging": "MRI gold standard; X-ray excludes other pathology; CT for bony detail",
        "Healing": "Many improve conservatively 6-12 weeks; sequestration may resolve or need surgery",
        "Treatment": "Stay active, education, NSAIDs, PT; epidural injection selective; microdiscectomy if persistent radiculopathy or cauda equina",
        "Manual Therapy": "McKenzie directional preference; neural mobilization; mobilization per tolerance",
        "Exercises": "Directional preference exercises; core stability; walking; avoid provocative flexion if intolerant",
        "Return to Activity": "Gradual loading when leg pain resolving, strength normalized, no neuro progression",
        "Evidence": "NICE NG59 conservative first; surgery faster leg pain relief short-term, similar long-term many cases (SPORT trial concept)",
        "References": "NICE NG59; APTA LBP CPG; Jensen NEJM disc imaging; Bogduk 2012",
    }),
    ("Lumbar Stenosis", {
        "ID": "PATH-LUM-002", "Condition": "Lumbar Spinal Stenosis",
        "Definition": "Narrowing of spinal canal, lateral recess, or foramen causing neural compression — central, lateral recess, or foraminal",
        "Mechanism": "Degenerative — disc height loss, facet hypertrophy, ligamentum flavum buckling; congenital narrow canal",
        "Symptoms": "Neurogenic claudication — bilateral leg pain/heaviness with walking/standing, relieved by sitting/flexion (shopping cart sign)",
        "Red Flags": "Acute cauda equina, progressive bilateral weakness, bowel/bladder dysfunction",
        "Differential Diagnosis": "Vascular claudication (pulses, ABI), hip OA, peripheral neuropathy, radiculopathy",
        "Clinical Tests": "Walking tolerance; symptom relief with lumbar flexion; bicycle test (flexed) vs treadmill (extended)",
        "Imaging": "MRI or CT myelography; Schizas grade for canal stenosis; standing imaging if dynamic stenosis suspected",
        "Healing": "Chronic progressive degenerative condition; symptoms fluctuate",
        "Treatment": "PT flexion-biased exercises, activity modification; NSAIDs; epidural injections; decompression surgery if refractory",
        "Manual Therapy": "Flexion mobilization; avoid extension HVLA; gentle neural glides",
        "Exercises": "Cycling, flexion-based core, hip flexor strengthening, stationary bike, partial curl-up",
        "Return to Activity": "Walking distance goals with flexion relief strategies; pacing",
        "Evidence": "Moderate evidence for PT and surgical decompression for moderate-severe symptomatic stenosis (Cochrane/systematic reviews)",
        "References": "NICE NG59; North American Spine Society stenosis guidelines; Magee 2014",
    }),
    ("Spondylolysis", {
        "ID": "PATH-LUM-003", "Condition": "Spondylolysis (Pars Interarticularis Defect)",
        "Definition": "Stress fracture or defect in pars interarticularis without vertebral slippage",
        "Mechanism": "Repetitive extension-rotation loading in adolescents (gymnastics, cricket, football linemen); L5 most common",
        "Symptoms": "Extension-intolerant LBP; localized paraspinal pain; may mimic disc pain in young athlete",
        "Red Flags": "Night pain, fever, weight loss (tumor/infection), neurological deficit (unusual isolated pars)",
        "Differential Diagnosis": "Disc injury, facet sprain, SI joint, muscle strain in adolescent athlete",
        "Clinical Tests": "One-legged hyperextension test (Stork test — low sensitivity); extension-rotation pain; palpation L5-S1",
        "Imaging": "Oblique X-ray (Scottie dog collar defect); MRI (bone edema early); SPECT/CT for active vs chronic",
        "Healing": "Acute: 3-6 months bracing and activity modification may heal; chronic fibrous non-union may be asymptomatic",
        "Treatment": "Relative rest from extension sports; bracing acute phase; PT core and hip; bone stimulator selective cases",
        "Manual Therapy": "Avoid extension manipulation; flexion-based mobilization; soft tissue",
        "Exercises": "McGill Big 3, glute/hamstring strengthening, anti-extension core, gradual return",
        "Return to Activity": "Pain-free sport-specific drills; no extension pain; imaging stability optional",
        "Evidence": "Activity modification and rehabilitation mainstay; surgical fusion rare unilateral active defect failing conservative care",
        "References": "Magee 2014 adolescent spine; Bogduk 2012; sports medicine pars literature",
    }),
    ("Spondylolisthesis", {
        "ID": "PATH-LUM-004", "Condition": "Spondylolisthesis (Vertebral Slippage)",
        "Definition": "Anterior slippage of vertebral body on subjacent — isthmic (pars defect), degenerative, traumatic, dysplastic",
        "Mechanism": "Isthmic: pars bilateral defect (often L5 on S1); degenerative: facet arthritis L4-L5 common",
        "Symptoms": "LBP, hamstring tightness, radiculopathy if nerve compressed; step-off palpable severe cases",
        "Red Flags": "Progressive slip, cauda equina, bowel/bladder dysfunction, high-grade slip in adolescent",
        "Differential Diagnosis": "Disc herniation, stenosis, SI joint; differentiate isthmic vs degenerative by age/imaging",
        "Clinical Tests": "Meyerding grade on lateral X-ray; Phalen-Dickson sign (flexed knee gait); neuro exam",
        "Imaging": "Standing lateral X-ray (flexion-extension views if instability suspected); MRI for nerve compression",
        "Healing": "Low-grade isthmic may stabilize; high-grade may progress in adolescents",
        "Treatment": "Conservative PT core stabilization for low-grade; fusion for high-grade, progressive slip, or refractory neuro symptoms",
        "Manual Therapy": "Stabilization focus; avoid aggressive extension manipulation high-grade",
        "Exercises": "Multifidus/TA training, hip strengthening, neutral spine functional training",
        "Return to Activity": "Sport-dependent; low-grade may return with core conditioning; monitor symptoms",
        "Evidence": "Conservative care first low-grade; surgical fusion for progression or neuro compression (guideline consensus)",
        "References": "Bogduk 2012; Wiltse classification; Magee 2014",
    }),
    ("Facet Syndrome", {
        "ID": "PATH-LUM-005", "Condition": "Lumbar Facet Syndrome (Zygapophyseal Joint Pain)",
        "Definition": "Pain arising from lumbar facet joints and capsules — clinical diagnosis supported by response to diagnostic blocks",
        "Mechanism": "Degeneration, synovitis, capsular strain, extension-rotation injury; age-related arthropathy",
        "Symptoms": "Deep axial LBP; buttock referral; extension-rotation provocative; morning stiffness",
        "Red Flags": "Standard red flags apply; fracture, infection, malignancy if trauma/systemic symptoms",
        "Differential Diagnosis": "Discogenic pain, SI joint, myofascial pain, radiculopathy (below knee suggests nerve root)",
        "Clinical Tests": "Extension-rotation Kemp; PA pillar tenderness; diagnostic medial branch block (research threshold ≥80% relief)",
        "Imaging": "X-ray/MRI facet arthropathy common age-related; imaging correlates poorly with pain",
        "Healing": "Fluctuating chronic course; acute capsular sprain 4-8 weeks",
        "Treatment": "PT flexion-biased, NSAIDs, medial branch block, radiofrequency ablation chronic confirmed cases",
        "Manual Therapy": "Mobilization grade I-IV; flexion distraction; avoid HVLA extension stenosis",
        "Exercises": "Flexion preference, core stability, hip mobility, postural education",
        "Return to Activity": "Extension-rotation without pain; functional lifting with neutral spine",
        "Evidence": "RF ablation moderate evidence short-medium term for confirmed facet pain (Cohen systematic reviews)",
        "References": "Bogduk 2012 facet innervation; Cohen facet interventions; APTA LBP CPG",
    }),
    ("SI Referral (Sacroiliac Joint Related Pain)", {
        "ID": "PATH-LUM-006", "Condition": "Sacroiliac Joint Related Low Back Pain (Referral Pattern)",
        "Definition": "Pain arising from or referring through sacroiliac joint region — often presents as lower lumbar/buttock pain",
        "Mechanism": "Joint dysfunction, ligamentous strain (iliolumbar), pregnancy hormones, trauma, leg length asymmetry",
        "Symptoms": "Unilateral buttock pain below L5, groin referral possible; sit-to-stand pain; PSIS tenderness",
        "Red Flags": "Inflammatory arthritis (AS), infection, fracture, malignancy, cauda equina (different pattern)",
        "Differential Diagnosis": "L5-S1 radiculopathy, facet pain, hip OA, piriformis syndrome, disc herniation",
        "Clinical Tests": "Cluster: distraction, thigh thrust, FABER, compression, Gaenslen (3+ positive suggests SI — modest specificity)",
        "Imaging": "X-ray/MRI often normal; bone scan/CT for inflammatory or fracture workup",
        "Healing": "Acute sprain 4-8 weeks; chronic may need stabilization program",
        "Treatment": "Manual therapy SI mobilization; exercise lumbopelvic stability; injection if persistent",
        "Manual Therapy": "Muscle energy, SI mobilization, soft tissue QL/piriformis",
        "Exercises": "Bridge, clamshell, single-leg stability, hip hinge retraining",
        "Return to Activity": "Single-leg tasks pain-free; sport-specific loading",
        "Evidence": "Multimodal PT and manual therapy modest benefit; diagnostic injection gold standard for research",
        "References": "Magee 2014 SI tests; APTA; Laslett SI cluster research",
    }),
    ("Muscle Strain (Lumbar Paraspinal / QL)", {
        "ID": "PATH-LUM-007", "Condition": "Lumbar Muscle Strain (Paraspinal / Quadratus Lumborum)",
        "Definition": "Overstretch or tear of lumbar musculature — erector spinae, multifidus, QL common",
        "Mechanism": "Sudden lift, rotation, or eccentric overload; deconditioning; poor hip hinge mechanics",
        "Symptoms": "Localized LBP worsened by movement; muscle spasm; no radicular pattern below knee typically",
        "Red Flags": "If trauma high-energy — fracture; if fever — infection; neuro deficit — radiculopathy not strain",
        "Differential Diagnosis": "Disc, facet, SI joint, kidney stones, aortic aneurysm (elderly/vascular risk)",
        "Clinical Tests": "Palpation spasm/trigger points; pain with resisted extension/rotation; normal neuro exam",
        "Imaging": "Not required initial uncomplicated strain; MRI if not improving 4-6 weeks",
        "Healing": "Grade I 1-2 weeks, Grade II 3-6 weeks, Grade III months",
        "Treatment": "Relative rest not bed rest, heat, NSAIDs, progressive mobility and strengthening",
        "Manual Therapy": "Soft tissue, gentle mobilization, dry needling where available",
        "Exercises": "Graded walking, McGill Big 3, hip hinge retraining, return to lifting progression",
        "Return to Activity": "Full ROM and strength without spasm; sport when functional tests pass",
        "Evidence": "Active recovery superior to bed rest (Cochrane); early PT beneficial",
        "References": "NICE NG59; APTA LBP CPG; Magee 2014",
    }),
    ("Radiculopathy", {
        "ID": "PATH-LUM-008", "Condition": "Lumbar Radiculopathy",
        "Definition": "Nerve root pathology causing dermatomal pain, paresthesia, weakness, reflex changes",
        "Mechanism": "Disc herniation, foraminal stenosis, lateral recess stenosis, synovial cyst compressing root",
        "Symptoms": "Leg pain below knee often > back pain; dermatomal sensory loss; myotome weakness; reflex diminished",
        "Red Flags": "Cauda equina, progressive deficit, bilateral symptoms, sphincter dysfunction — EMERGENCY",
        "Differential Diagnosis": "Peripheral nerve entrapment (sciatic, peroneal), hip pathology, vascular claudication",
        "Clinical Tests": "SLR, crossed SLR, slump, femoral stretch L2-L4; myotome/reflex/sensation mapping",
        "Imaging": "MRI nerve root compression correlation; EMG/NCV subacute/chronic or if surgery planned",
        "Healing": "80% improve non-surgically within 3 months many cases; depends on compression severity",
        "Treatment": "Conservative PT, medications, epidural steroid; surgery if progressive or cauda equina",
        "Manual Therapy": "Neural mobilization, directional preference, centralization techniques",
        "Exercises": "Core stability, nerve glides, progressive LE strengthening, walking",
        "Return to Activity": "When neuro exam stable/improving, leg pain centralizing or resolving",
        "Evidence": "NICE NG59; SPORT trial concepts — surgery vs conservative similar long-term many patients",
        "References": "NICE NG59; APTA LBP CPG; Magee 2014 neuro exam",
    }),
    ("Cauda Equina Syndrome", {
        "ID": "PATH-LUM-009", "Condition": "Cauda Equina Syndrome (CES) — EMERGENCY",
        "Definition": "Compression of cauda equina nerve roots (below conus ~L1-L2) causing bilateral neuro deficits and sphincter dysfunction",
        "Mechanism": "Large central disc herniation most common; also tumor, hematoma, abscess, fracture, stenosis",
        "Symptoms": "Bilateral leg pain/weakness/numbness; saddle anesthesia; urinary retention or incontinence; fecal incontinence; reduced anal tone",
        "Red Flags": "ALL ARE RED FLAGS — URGENT SURGICAL REFERRAL WITHIN HOURS: urinary retention, post-void residual >100-200 mL, "
            "saddle anesthesia, bilateral sciatica, progressive weakness, fecal incontinence; do not delay MRI for prolonged PT trial",
        "Differential Diagnosis": "Conus medullaris syndrome (UMN signs, symmetric, earlier bladder, T12-L2 level); bilateral radiculopathy; "
            "peripheral neuropathy (diabetes — gradual not acute)",
        "Clinical Tests": "Perianal sensation; anal sphincter tone (PR exam by physician); post-void bladder scan; "
            "bilateral lower extremity motor/sensory exam; DO NOT rely on SLR alone",
        "Imaging": "EMERGENCY MRI whole lumbar spine — gold standard; if unavailable urgent transfer to center with MRI",
        "Healing": "Time-dependent — best outcome surgical decompression within 24-48 hours; delayed may have permanent bladder/bowel/sexual dysfunction",
        "Treatment": "EMERGENCY neurosurgical/orthopedic spinal decompression; IV steroids controversial; NOT conservative PT as primary",
        "Manual Therapy": "CONTRAINDICATED as primary treatment — urgent referral; PT only post-operative rehabilitation",
        "Exercises": "Post-surgical rehab only after decompression per surgical protocol",
        "Return to Activity": "Long-term multidisciplinary; bladder training; mobility and strength per residual deficit",
        "Evidence": "Strong consensus: CES is surgical emergency; delayed decompression worsens outcomes (systematic reviews/guidelines)",
        "References": "NICE NG59 red flags; ACR appropriateness MRI lumbar; Bogduk 2012; APTA emergency referral protocols",
    }),
]


# ---------------------------------------------------------------------------
# Section 11: Rehabilitation phases
# ---------------------------------------------------------------------------

def _rehab_phase(id_: str, condition: str, phase: str, **kwargs: Any) -> tuple[str, dict[str, Any]]:
    fields: dict[str, Any] = {"ID": id_, "Condition": condition, "Phase": phase}
    fields.update(kwargs)
    return f"{condition} — {phase}", fields


def _build_rehab_programs() -> list[tuple[str, dict[str, Any]]]:
    records: list[tuple[str, dict[str, Any]]] = []
    programs = {
        "Disc Herniation": {
            "Acute": {
                "Goals": "Reduce leg pain centralization if possible; maintain ADLs; avoid bed rest; screen red flags",
                "Pain Management": "NSAIDs per MD; relative activity modification; avoid prolonged flexion if intolerant",
                "Education": "Prognosis favorable most cases; stay active; avoid catastrophizing; red flag awareness",
                "Mobility": "Directional preference (often extension); gentle walking; avoid SLR aggravation early",
                "Motor Control": "Light TA bracing; neutral spine supine; diaphragmatic breathing",
                "Strengthening": "Deferred or isometric glute/quad if leg pain allows",
                "Core Stability": "McGill curl-up minimal range; side plank modified knees",
                "Functional Training": "Sit-stand cues; avoid heavy lifting",
                "Return to Work": "Modified duties; no heavy lifting 2-4 weeks typically",
                "Return to Sport": "Not acute phase",
                "Progression": "Pain centralizing or reducing → subacute loading",
                "Evidence": "NICE NG59 stay active; avoid bed rest",
                "References": "NICE NG59; McKenzie; APTA LBP CPG",
            },
            "Subacute": {
                "Goals": "Restore ROM; begin strengthening; normalize gait",
                "Pain Management": "Gradual exposure to provocative movements per assessment",
                "Education": "Disc healing biology; flare management; posture variability not rigid",
                "Mobility": "Repeated extension or flexion per preference; neural glides if radicular",
                "Motor Control": "Bird dog, dead bug, TA-multifidus co-contraction",
                "Strengthening": "Bridge, clamshell, bodyweight squat pattern",
                "Core Stability": "McGill Big 3 progressions",
                "Functional Training": "Light lifting technique hip hinge introduction",
                "Return to Work": "Gradual increase load tolerance",
                "Return to Sport": "Light aerobic (bike, walk)",
                "Progression": "Strength 50% baseline → remodeling phase",
                "Evidence": "Exercise therapy moderate effect chronic/subacute LBP (Cochrane)",
                "References": "Cochrane exercise LBP; McGill",
            },
            "Remodeling/Functional": {
                "Goals": "Full strength; sport/work specific capacity; prevent recurrence",
                "Pain Management": "Intermittent soreness acceptable; distinguish from radicular worsening",
                "Education": "Self-management; independent program; yellow flags psychosocial screen",
                "Mobility": "Full ROM; rotation and extension per tolerance",
                "Motor Control": "Dynamic stabilization under load",
                "Strengthening": "Deadlift/RDL progression, lunges, row, hip thrust",
                "Core Stability": "Loaded carries, Pallof press, anti-rotation",
                "Functional Training": "Sport-specific patterns; lifting capacity testing",
                "Return to Work": "Full duties if lifting tests passed",
                "Return to Sport": "Running/jumping progressions if applicable",
                "Progression": "Functional testing → RTS/RTW clearance",
                "Evidence": "Graded activity and exercise reduce recurrence risk",
                "References": "APTA LBP CPG; sports return-to-play consensus",
            },
            "RTS/RTW": {
                "Goals": "Full return without symptom limitation; confidence and self-efficacy",
                "Pain Management": "Independent flare plan",
                "Education": "Maintenance program 2-3×/week",
                "Mobility": "Maintain hip and thoracic mobility",
                "Motor Control": "Automatic stabilization with sport/work tasks",
                "Strengthening": "Continued periodized program",
                "Core Stability": "Integrated with athletic training",
                "Functional Training": "Full sport drills or job simulation",
                "Return to Work": "Full duty achieved",
                "Return to Sport": "Full competition; no antalgic movement; neuro exam normal",
                "Progression": "Maintenance and periodized deload",
                "Evidence": "Active patients have better long-term outcomes",
                "References": "NICE NG59; return-to-work guidelines",
            },
        },
        "Lumbar Stenosis": {
            "Acute": {
                "Goals": "Reduce neurogenic claudication symptoms; maintain safe mobility",
                "Pain Management": "Flexion relief positions; pacing walking",
                "Education": "Stenosis anatomy; flexion opens canal; realistic pacing expectations",
                "Mobility": "Knee-to-chest; pelvic tilt; avoid prolonged standing extension",
                "Motor Control": "Flexion-biased posture awareness",
                "Strengthening": "Seated or flexed-position hip strengthening",
                "Core Stability": "Partial curl-up; flexion-based",
                "Functional Training": "Shopping cart posture for walking tolerance",
                "Return to Work": "Modified standing duties",
                "Return to Sport": "Not applicable acute",
                "Progression": "Walking distance improving",
                "Evidence": "Flexion-based PT supported for stenosis symptoms",
                "References": "NASS stenosis guidelines; APTA",
            },
            "Subacute": {
                "Goals": "Increase walking tolerance; hip flexor strength for flexed posture",
                "Pain Management": "Activity pacing; seated rest breaks",
                "Education": "Cycle vs walk for exercise; avoid extension exercises initially",
                "Mobility": "Hip flexion stretches; thoracic mobility",
                "Motor Control": "Abdominal bracing in flexion",
                "Strengthening": "Stationary bike; hip flexor/endurance",
                "Core Stability": "Flexion-biased core exercises",
                "Functional Training": "Graded walking program with flexion breaks",
                "Return to Work": "Standing tolerance building",
                "Return to Sport": "Cycling, swimming preferred",
                "Progression": "Walking >15-20 min with manageable symptoms",
                "Evidence": "Moderate evidence supervised exercise stenosis",
                "References": "Cochrane stenosis exercise reviews",
            },
            "Remodeling/Functional": {
                "Goals": "Maximize functional walking capacity; hip and core endurance",
                "Pain Management": "Intermittent claudication management strategies",
                "Education": "Long-term self-management; surgical consultation if refractory",
                "Mobility": "Maintain flexion ROM hip and lumbar",
                "Motor Control": "Dynamic flexion bias during prolonged standing tasks",
                "Strengthening": "Leg press, hip flexion endurance, glute strengthening",
                "Core Stability": "Endurance focus over max strength",
                "Functional Training": "Simulated work standing tasks with pacing",
                "Return to Work": "Full duty with accommodation if needed",
                "Return to Sport": "Golf modification (flexed setup); cycling",
                "Progression": "Functional goals met or surgical pathway",
                "Evidence": "Surgery vs PT — shared decision moderate stenosis",
                "References": "NASS; NICE",
            },
            "RTS/RTW": {
                "Goals": "Sustainable activity level; independence",
                "Pain Management": "Self-pacing strategies",
                "Education": "Maintenance flexion-biased program",
                "Mobility": "Daily hip flexor mobility",
                "Motor Control": "Automatic pacing",
                "Strengthening": "Maintenance 2-3× weekly",
                "Core Stability": "Endurance maintenance",
                "Functional Training": "Community walking programs",
                "Return to Work": "Achieved with or without modifications",
                "Return to Sport": "Low-impact sport maintenance",
                "Progression": "Annual review if symptoms progressive",
                "Evidence": "Long-term management chronic stenosis",
                "References": "North American Spine Society",
            },
        },
        "Spondylolysis / Spondylolisthesis": {
            "Acute": {
                "Goals": "Pain control; protect pars in acute phase; maintain fitness",
                "Pain Management": "Avoid extension/rotation sports; bracing per MD protocol adolescent acute",
                "Education": "Pars anatomy; healing timeline 3-6 months; sport modification",
                "Mobility": "Flexion-biased gentle ROM; hip mobility",
                "Motor Control": "Neutral spine awareness; anti-extension bracing",
                "Strengthening": "Isometric glute; avoid loaded extension",
                "Core Stability": "McGill Big 3 — curl-up, side plank, bird dog",
                "Functional Training": "Non-impact cardio (bike, pool)",
                "Return to Work": "Avoid extension-loaded work tasks",
                "Return to Sport": "Stop extension sports acutely",
                "Progression": "Pain-free daily activities → subacute loading",
                "Evidence": "Activity modification key for pars healing adolescents",
                "References": "Magee adolescent spine; sports medicine pars protocols",
            },
            "Subacute": {
                "Goals": "Core and hip strengthening; gradual activity reintroduction",
                "Pain Management": "Monitor extension pain response",
                "Education": "Neutral spine lifting; sport-specific modification plan",
                "Mobility": "Hip flexor/hamstring; thoracic extension (not lumbar hyperextension)",
                "Motor Control": "Hip hinge mastery; lumbopelvic dissociation",
                "Strengthening": "Bridge, hip thrust, RDL light, clamshell",
                "Core Stability": "Progress bird dog load; anti-rotation",
                "Functional Training": "Sport-specific non-extension drills",
                "Return to Work": "Gradual loading",
                "Return to Sport": "Phase 1 sport drills without extension",
                "Progression": "Strength benchmarks → functional phase",
                "Evidence": "Core stabilization reduces LBP recurrence athletes",
                "References": "McGill; APTA",
            },
            "Remodeling/Functional": {
                "Goals": "Full lumbopelvic control; sport-specific return",
                "Pain Management": "Extension monitoring in sport",
                "Education": "Maintenance program; technique coaching",
                "Mobility": "Full hip ROM; controlled lumbar ROM",
                "Motor Control": "Automatic hip hinge under load",
                "Strengthening": "Deadlift progression; single-leg work",
                "Core Stability": "Loaded carries; sport integration",
                "Functional Training": "Sport-specific progressions with technique modification",
                "Return to Work": "Full duty",
                "Return to Sport": "Gradual return extension activities with monitoring",
                "Progression": "Full sport participation",
                "Evidence": "Structured return reduces re-injury",
                "References": "Sports physio return-to-sport frameworks",
            },
            "RTS/RTW": {
                "Goals": "Unrestricted activity with maintenance program",
                "Pain Management": "Independent management",
                "Education": "Lifetime core maintenance for athletes",
                "Mobility": "Regular hip and thoracic mobility",
                "Motor Control": "Technique maintenance coaching",
                "Strengthening": "Periodized strength program",
                "Core Stability": "Integrated training",
                "Functional Training": "Full competition",
                "Return to Work": "Full",
                "Return to Sport": "Full with technique optimization",
                "Progression": "Maintenance",
                "Evidence": "Long-term athlete management pars defects",
                "References": "Cricket/baseball pars literature",
            },
        },
        "Facet Syndrome": {
            "Acute": {
                "Goals": "Reduce extension-provoked pain; restore basic ADLs",
                "Pain Management": "NSAIDs; avoid extension loading; heat",
                "Education": "Facet pain mechanism; extension intolerance common",
                "Mobility": "Flexion-based gentle ROM; knee-to-chest",
                "Motor Control": "Posterior pelvic tilt awareness",
                "Strengthening": "Minimal — isometric glute",
                "Core Stability": "Curl-up flexion bias",
                "Functional Training": "Avoid prolonged standing",
                "Return to Work": "Modified standing/sitting",
                "Return to Sport": "Pause extension sports",
                "Progression": "Extension pain reducing",
                "Evidence": "Manual therapy + exercise for LBP",
                "References": "APTA LBP CPG",
            },
            "Subacute": {
                "Goals": "Flexion ROM full; begin hip and core strengthening",
                "Pain Management": "Gradual extension exposure if tolerated",
                "Education": "Posture variability; avoid fear-avoidance",
                "Mobility": "Hip flexor stretch; thoracic mobility",
                "Motor Control": "Neutral spine with hip hinge",
                "Strengthening": "Bridge, squat, row",
                "Core Stability": "McGill Big 3",
                "Functional Training": "Light functional tasks",
                "Return to Work": "Gradual standing tolerance",
                "Return to Sport": "Low-impact aerobic",
                "Progression": "Functional loading",
                "Evidence": "Exercise effective facet-related LBP subgroup",
                "References": "Cochrane manual therapy LBP",
            },
            "Remodeling/Functional": {
                "Goals": "Full function; extension tolerance if possible",
                "Pain Management": "Self-management",
                "Education": "Maintenance exercises",
                "Mobility": "Full ROM all planes per tolerance",
                "Motor Control": "Dynamic control",
                "Strengthening": "Full strength program",
                "Core Stability": "Anti-rotation and carries",
                "Functional Training": "Work and sport simulation",
                "Return to Work": "Full",
                "Return to Sport": "Extension sports with monitoring",
                "Progression": "Clearance testing",
                "Evidence": "Multimodal rehab facet syndrome",
                "References": "Bogduk facet pain management",
            },
            "RTS/RTW": {
                "Goals": "Independent maintenance",
                "Pain Management": "Flare plan",
                "Education": "Home program",
                "Mobility": "Maintenance",
                "Motor Control": "Automatic",
                "Strengthening": "2-3× week maintenance",
                "Core Stability": "Ongoing",
                "Functional Training": "Full activity",
                "Return to Work": "Full",
                "Return to Sport": "Full",
                "Progression": "Maintenance",
                "Evidence": "Active lifestyle reduces chronic LBP",
                "References": "NICE NG59",
            },
        },
        "Radiculopathy": {
            "Acute": {
                "Goals": "Centralize symptoms if discogenic; monitor neuro status; avoid cauda equina miss",
                "Pain Management": "NSAIDs/neuropathic agents per MD; positional relief",
                "Education": "Red flags; prognosis; stay active within tolerance",
                "Mobility": "Directional preference; gentle neural glides if not worsening",
                "Motor Control": "Minimal loading; protect nerve",
                "Strengthening": "Avoid if increasing leg pain",
                "Core Stability": "Gentle TA activation supine",
                "Functional Training": "Walking short distances",
                "Return to Work": "Modified; no prolonged sitting if flexion intolerant",
                "Return to Sport": "Hold",
                "Progression": "Leg pain reducing or centralizing",
                "Evidence": "Conservative care first unless cauda equina/progressive deficit",
                "References": "NICE NG59; SPORT trial",
            },
            "Subacute": {
                "Goals": "Normalize gait; begin LE strengthening; neural mobility",
                "Pain Management": "Graded exposure",
                "Education": "Neuro recovery timeline; activity pacing",
                "Mobility": "Neural flossing/sliders per established protocols carefully",
                "Motor Control": "Bird dog; avoid SLR stretch early if provocative",
                "Strengthening": "Quad, glute, calf per affected myotome",
                "Core Stability": "McGill progressions",
                "Functional Training": "Stairs, sit-stand",
                "Return to Work": "Gradual",
                "Return to Sport": "Walking/bike",
                "Progression": "Motor strength improving",
                "Evidence": "Neural mobilization adjunct evidence moderate",
                "References": "Magee neurodynamic testing",
            },
            "Remodeling/Functional": {
                "Goals": "Full LE strength; reflex may lag; functional symmetry",
                "Pain Management": "Intermittent symptoms acceptable if improving trend",
                "Education": "Self-neural mobilization; maintenance",
                "Mobility": "Full neural and joint mobility",
                "Motor Control": "Dynamic single-leg stability",
                "Strengthening": "Full LE and core program",
                "Core Stability": "Loaded stabilization",
                "Functional Training": "Sport/work specific",
                "Return to Work": "Full if strength adequate",
                "Return to Sport": "Gradual run/jump if S1/L5 affected",
                "Progression": "Functional testing",
                "Evidence": "Exercise improves radiculopathy outcomes conservative group",
                "References": "APTA; Cochrane",
            },
            "RTS/RTW": {
                "Goals": "Full return; monitor neuro annually if residual numbness",
                "Pain Management": "Independent",
                "Education": "Maintenance program",
                "Mobility": "Ongoing",
                "Motor Control": "Sport automatic",
                "Strengthening": "Maintenance",
                "Core Stability": "Integrated",
                "Functional Training": "Full",
                "Return to Work": "Full",
                "Return to Sport": "Full when neuro stable and strength symmetric",
                "Progression": "Maintenance",
                "Evidence": "Most radiculopathy resolves or stabilizes without surgery",
                "References": "NICE NG59",
            },
        },
        "Nonspecific Low Back Pain": {
            "Acute": {
                "Goals": "Reduce pain sufficient for ADLs; reassurance; screen red flags and yellow flags",
                "Pain Management": "Heat, NSAIDs short course, stay active — AVOID bed rest >1-2 days",
                "Education": "Favorable prognosis acute LBP; pain ≠ damage; psychosocial yellow flags (fear, catastrophizing, work dissatisfaction)",
                "Mobility": "Gentle walking; movement within tolerance; no forced stretching acute",
                "Motor Control": "Breathing; gentle pelvic tilt",
                "Strengthening": "Not primary acute unless mild",
                "Core Stability": "Gentle activation only",
                "Functional Training": "Maintain ADLs modified",
                "Return to Work": "Stay at work or early return modified preferred (NICE)",
                "Return to Sport": "Modified or pause if painful",
                "Progression": "Pain improving 1-2 weeks → subacute",
                "Evidence": "Strong: stay active, reassurance, avoid bed rest (NICE NG59, Cochrane)",
                "References": "NICE NG59; APTA LBP CPG; Cochrane acute LBP",
            },
            "Subacute": {
                "Goals": "Restore full ROM; begin graded exercise; address yellow flags",
                "Pain Management": "Graded activity exposure; CBT/behavioral if yellow flags",
                "Education": "Self-management; flare plan; workplace ergonomics",
                "Mobility": "Hip flexor, hamstring, thoracic mobility as needed — not excessive",
                "Motor Control": "TA bracing; bird dog; dead bug",
                "Strengthening": "Bridge, squat, row, walking program",
                "Core Stability": "McGill Big 3; Pilates-style optional",
                "Functional Training": "Lifting technique introduction",
                "Return to Work": "Full or graded return",
                "Return to Sport": "Gradual aerobic",
                "Progression": "Pain controlled with daily activity → remodeling",
                "Evidence": "Exercise therapy moderate effect subacute/chronic LBP (Cochrane)",
                "References": "Cochrane exercise chronic LBP; APTA CPG",
            },
            "Remodeling/Functional": {
                "Goals": "Full strength and function; prevent recurrence; address psychosocial factors",
                "Pain Management": "Self-efficacy focus; pain coping strategies",
                "Education": "Independent program; recognize recurrence early",
                "Mobility": "Maintain hip/thoracic mobility",
                "Motor Control": "Automatic stabilization",
                "Strengthening": "Progressive resistance full body",
                "Core Stability": "Integrated functional training",
                "Functional Training": "Work and sport specific",
                "Return to Work": "Full duties",
                "Return to Sport": "Full participation",
                "Progression": "Functional tests passed",
                "Evidence": "Combined exercise + psychosocial best chronic LBP (guidelines)",
                "References": "NICE NG59; STarT Back stratified care research",
            },
            "RTS/RTW": {
                "Goals": "Sustained recovery; reduced recurrence; self-management",
                "Pain Management": "Independent flare management",
                "Education": "Maintenance 1-2× week; physical activity habit",
                "Mobility": "Regular mobility practice",
                "Motor Control": "Habitual good movement patterns",
                "Strengthening": "Ongoing resistance training general health",
                "Core Stability": "Maintenance",
                "Functional Training": "Full life/work/sport participation",
                "Return to Work": "Sustained full duty",
                "Return to Sport": "Full",
                "Progression": "Long-term active lifestyle",
                "Evidence": "Physical activity reduces LBP recurrence",
                "References": "NICE NG59; WHO physical activity guidelines",
            },
        },
    }
    idx = 1
    for condition, phases in programs.items():
        for phase_name, phase_data in phases.items():
            records.append(_rehab_phase(
                f"REHAB-LUM-{idx:03d}", condition, phase_name, **phase_data
            ))
            idx += 1
    return records


REHAB_PHASES = _build_rehab_programs()

SPECIAL_TEST_RECORDS: list[tuple[str, dict[str, Any]]] = [
    ("Straight Leg Raise (SLR)", {
        "ID": "TEST-LUM-001", "Test Name": "Straight Leg Raise (Lasègue)",
        "Purpose": "Neural tension / L4-S1 radiculopathy screening",
        "Technique": "Supine passive hip flexion with knee extended; note angle of leg pain vs hamstring stretch",
        "Positive Finding": "Radicular leg pain below knee reproduced (not hamstring pull only)",
        "Sensitivity": "~91% approx for disc herniation radiculopathy (variable by study)",
        "Specificity": "~26% approx — low; crossed SLR increases specificity (~88% approx)",
        "References": "Magee 2014; Deville SLR systematic review",
    }),
    ("Slump Test", {
        "ID": "TEST-LUM-002", "Test Name": "Slump Test",
        "Purpose": "Neural tension sciatic/femoral bias",
        "Technique": "Seated slumped flexion, knee extension, ankle dorsiflexion sequential",
        "Positive Finding": "Reproduction radicular symptoms with cervical flexion component",
        "Sensitivity": "Moderate for radiculopathy",
        "Specificity": "Low-moderate",
        "References": "Magee 2014; Butler neurodynamics",
    }),
    ("Prone Instability Test", {
        "ID": "TEST-LUM-003", "Test Name": "Prone Instability Test",
        "Purpose": "Clinical lumbar instability subgroup",
        "Technique": "Prone, feet on floor, lift LEs — pain central segment; then ask patient brace abs and repeat",
        "Positive Finding": "Pain decreases with abdominals braced (suggests instability subgroup)",
        "Sensitivity": "~71% approx", "Specificity": "~57% approx",
        "References": "Hicks instability subgroup research; Magee 2014",
    }),
    ("One-Legged Hyperextension (Stork Test)", {
        "ID": "TEST-LUM-004", "Test Name": "Stork Test (One-Legged Hyperextension)",
        "Purpose": "Spondylolysis screening adolescent",
        "Technique": "Stand on one leg, extend spine; compare sides",
        "Positive Finding": "Unilateral extension pain at pars region",
        "Sensitivity": "Low (~50-65% approx); MRI/CT gold standard",
        "Specificity": "Moderate",
        "References": "Magee 2014 adolescent athlete screening",
    }),
    ("Femoral Nerve Tension Test", {
        "ID": "TEST-LUM-005", "Test Name": "Femoral Nerve Tension Test (Prone Knee Bend)",
        "Purpose": "L2-L4 radiculopathy / femoral nerve irritation",
        "Technique": "Prone, flex knee toward buttock; optionally extend hip",
        "Positive Finding": "Anterior thigh radicular pain (L2-L4 dermatomes)",
        "Sensitivity": "Moderate for upper lumbar radiculopathy",
        "Specificity": "Moderate",
        "References": "Magee 2014",
    }),
    ("Crossed Straight Leg Raise", {
        "ID": "TEST-LUM-006", "Test Name": "Crossed Straight Leg Raise (Crossed SLR)",
        "Purpose": "Sciatica / disc herniation specificity",
        "Technique": "Passive SLR symptomatic leg reproduces contralateral leg radicular pain",
        "Positive Finding": "Radicular pain in opposite leg when raising affected leg",
        "Sensitivity": "~29% approx", "Specificity": "~88% approx",
        "References": "Deville SLR systematic review; Magee 2014",
    }),
    ("Kemp Test (Extension-Rotation)", {
        "ID": "TEST-LUM-007", "Test Name": "Kemp Test (Quadrant Test / Extension-Rotation)",
        "Purpose": "Facet joint pain, stenosis provocation, disc (non-specific)",
        "Technique": "Seated or standing extension and rotation to same side with overpressure",
        "Positive Finding": "Reproduction familiar back/leg pain",
        "Sensitivity": "Low-moderate facet syndrome", "Specificity": "Low",
        "References": "Magee 2014; Bogduk facet pain",
    }),
    ("SI Joint Cluster (Laslett)", {
        "ID": "TEST-LUM-008", "Test Name": "Sacroiliac Joint Pain Provocation Cluster",
        "Purpose": "SI joint pain identification",
        "Technique": "Distraction, thigh thrust, FABER/Patrick, compression, Gaenslen — count positives",
        "Positive Finding": "≥3 of 5 tests positive suggests SI joint pain (research cluster)",
        "Sensitivity": "~94% approx cluster", "Specificity": "~78% approx cluster",
        "References": "Laslett SIJ cluster research; Magee 2014",
    }),
    ("Waddell Signs", {
        "ID": "TEST-LUM-009", "Test Name": "Waddell Non-Organic Signs",
        "Purpose": "Behavioral/yellow flag screening in chronic LBP — NOT malingering test",
        "Technique": "Tenderness simulation, axial loading, rotation distraction, SLR distraction, regional sensory/motor",
        "Positive Finding": "≥3 categories positive — psychosocial overlay; guide biopsychosocial approach",
        "Sensitivity": "N/A screening tool", "Specificity": "N/A",
        "References": "Waddell et al.; STarT Back; use cautiously without stigmatizing",
    }),
    ("Bicycle Test (Stenosis)", {
        "ID": "TEST-LUM-010", "Test Name": "Bicycle / Treadmill Test for Stenosis",
        "Purpose": "Differentiate neurogenic vs vascular claudication",
        "Technique": "Upright treadmill walking vs recumbent cycling — stenosis often better cycling (flexion)",
        "Positive Finding": "Walking limited, cycling tolerated suggests stenosis component",
        "Sensitivity": "Clinical observation", "Specificity": "Moderate vs vascular",
        "References": "Neurogenic claudication clinical exam; Magee 2014",
    }),
]

EXAM_TEMPLATE = {
    "Template Name": "Lumbar Spine Clinical Examination",
    "ID": "EXAM-LUM-001",
    "Subjective": "Onset, mechanism, location (axial vs leg), dermatomal symptoms, aggravating/easing, bowel/bladder, saddle symptoms, fever, weight loss, cancer history, steroid use, night pain",
    "Red Flag Screen": "Cauda equina (saddle, retention, bilateral weakness), fracture (trauma, osteoporosis), infection (fever, IV drug use), malignancy (age >50 unexplained, history, weight loss), progressive deficit",
    "Yellow Flags": "Catastrophizing, fear-avoidance, depression, work dissatisfaction, litigation — STarT Back tool",
    "Observation": "Posture, antalgic list, gait, scoliosis, muscle wasting",
    "ROM": "Flexion finger-to-floor, extension, lateral flexion, rotation; repeated movements McKenzie",
    "Neurological": "Dermatomes L1-S1, myotomes (EHL L5, GSC S1, TA, quads), reflexes patellar L4 Achilles S1, SLR, crossed SLR, slump",
    "Special Tests": "SI cluster, Kemp extension-rotation, stenosis walking test, Waddell signs if chronic",
    "Palpation": "Spinous processes, facets, paraspinal, QL, SI region",
    "Functional": "Squat, single-leg stance, hip ROM, neurodynamic tests",
    "Imaging Indications": "Red flags, progressive neuro deficit, cauda equina emergency MRI, no improvement 6 weeks with radiculopathy consider MRI per NICE",
    "References": "Magee 2014; NICE NG59; STarT Back tool",
}

EVIDENCE_RECORDS: list[tuple[str, dict[str, Any]]] = [
    ("NICE NG59 Low Back Pain", {
        "ID": "EVD-LUM-001", "Guideline": "NICE NG59 Low Back Pain and Sciatica in Over 16s",
        "Key Recommendations": "Reassurance; stay active; avoid routine imaging without red flags; exercise therapy; manual therapy short course; consider CBT for chronic; epidural for sciatica selective",
        "Red Flags": "Cauda equina, cancer, infection, fracture, progressive neuro deficit",
        "References": "NICE NG59",
    }),
    ("APTA Low Back Pain CPG", {
        "ID": "EVD-LUM-002", "Guideline": "APTA Orthopedic Section Low Back Pain Clinical Practice Guideline",
        "Key Recommendations": "Classify patients; manual therapy + exercise; trunk stabilization; patient education; psychosocial factors; return to activity emphasis",
        "References": "APTA LBP CPG",
    }),
    ("Cochrane Exercise for Chronic LBP", {
        "ID": "EVD-LUM-003", "Review": "Cochrane — Exercise therapy for chronic low back pain",
        "Key Findings": "Exercise reduces pain and improves function vs no treatment; type less important than doing exercise; moderate certainty",
        "References": "Cochrane Library exercise chronic LBP review",
    }),
    ("ACR Appropriateness — Lumbar MRI", {
        "ID": "EVD-LUM-004", "Guideline": "ACR Appropriateness Criteria — Low Back Pain",
        "Key Recommendations": "MRI appropriate with red flags, progressive neuro deficit, suspected cauda equina, infection, malignancy; "
            "usually not first-line uncomplicated acute LBP without red flags; consider after 6 weeks persistent radiculopathy",
        "References": "ACR Appropriateness Criteria lumbar spine",
    }),
    ("SPORT Trial — Disc Herniation", {
        "ID": "EVD-LUM-005", "Study": "SPORT — Spine Patient Outcomes Research Trial (disc herniation arm)",
        "Key Findings": "Surgery (microdiscectomy) provided faster leg pain relief early; differences diminished by 2 years for many patients; "
            "shared decision-making emphasized; non-inferiority of conservative care long-term many cases",
        "References": "Weinstein et al. SPORT trial publications",
    }),
]


EXERCISE_LIBRARY: list[tuple[str, dict[str, Any]]] = [
    ("McGill Curl-Up", {
        "ID": "EX-LUM-001", "Exercise": "McGill Curl-Up",
        "Target": "Rectus abdominis, transversus abdominis — minimal lumbar flexion",
        "Phase": "Acute-subacute LBP, disc herniation, nonspecific LBP",
        "Technique": "Supine, one knee bent, hands under lumbar to maintain neutral; lift head/shoulders slightly without low back flattening",
        "Dosage": "3 sets × 10-15 reps; hold 8-10 sec optional isometric variant",
        "Cues": "Brace before lift; avoid pulling on neck; breathe normally",
        "Contraindications": "Acute severe flexion intolerance (modify range); cauda equina — not applicable (emergency)",
        "Progression": "Increase hold time → feet on floor both bent → add arm reach",
        "Evidence": "Spine-sparing abdominal training (McGill)",
        "References": "McGill Low Back Disorders",
    }),
    ("Bird Dog (Quadruped Opposite Arm/Leg)", {
        "ID": "EX-LUM-002", "Exercise": "Bird Dog",
        "Target": "Multifidus, erector spinae, gluteus maximus, transversus abdominis",
        "Phase": "Subacute-remodeling all LBP conditions except acute severe pain",
        "Technique": "Quadruped neutral spine; extend opposite arm/leg to horizontal without trunk rotation or lumbar sag",
        "Dosage": "3 sets × 8-10 each side; 5-10 sec holds",
        "Cues": "Keep pelvis level; brace core; slow controlled return",
        "Contraindications": "Wrist pain (modify on bench); acute extension intolerance",
        "Progression": "Add holds → draw squares with foot → light cuff weight",
        "Evidence": "Core stability staple; moderate EMG multifidus/glute",
        "References": "McGill Big 3; APTA LBP CPG",
    }),
    ("Side Plank", {
        "ID": "EX-LUM-003", "Exercise": "Side Plank",
        "Target": "Quadratus lumborum, obliques, gluteus medius",
        "Phase": "Subacute onward",
        "Technique": "Forearm or hand support; body straight line; hips elevated; knees bent (modified) or legs straight",
        "Dosage": "3 sets × 20-45 sec each side",
        "Cues": "Don't let hips drop; breathe; top arm rest on hip or reach ceiling",
        "Contraindications": "Acute shoulder injury; acute lateral pain that worsens",
        "Progression": "Knees bent → full plank → add top leg abduction",
        "Evidence": "McGill Big 3; high QL EMG",
        "References": "McGill",
    }),
    ("Bridge / Hip Thrust", {
        "ID": "EX-LUM-004", "Exercise": "Bridge / Hip Thrust",
        "Target": "Gluteus maximus, hamstrings, core stabilization",
        "Phase": "Subacute-remodeling; essential disc/radiculopathy/spondylolisthesis",
        "Technique": "Supine feet flat hip-width; posterior pelvic tilt; lift hips to neutral alignment without hyperextension",
        "Dosage": "3 sets × 12-15; progress to barbell hip thrust",
        "Cues": "Drive through heels; squeeze glutes top; don't over-arch lumbar",
        "Contraindications": "Acute extension intolerance (limit height)",
        "Progression": "Double leg → single leg → weighted hip thrust",
        "Evidence": "Hip extension offloads lumbar erectors in lifting models",
        "References": "McGill; glute activation LBP literature",
    }),
    ("Dead Bug", {
        "ID": "EX-LUM-005", "Exercise": "Dead Bug",
        "Target": "Transversus abdominis, obliques, hip flexors with lumbar stability",
        "Phase": "Subacute all conditions",
        "Technique": "Supine 90/90 hips/knees; lower opposite arm/leg while maintaining neutral lumbar (press back to floor lightly)",
        "Dosage": "3 sets × 8-10 each side slow",
        "Cues": "Exhale on extension; small range if losing neutral",
        "Contraindications": "Acute severe pain with leg lowering",
        "Progression": "Band resistance → straight leg lower",
        "Evidence": "Motor control training moderate evidence",
        "References": "Hodges/Richardson; APTA CPG",
    }),
    ("Prone Press-Up (Extension in Lying)", {
        "ID": "EX-LUM-006", "Exercise": "Prone Press-Up (McKenzie Extension)",
        "Target": "Lumbar extension ROM; centralization disc herniation",
        "Phase": "Acute-subacute disc herniation with extension preference ONLY",
        "Technique": "Prone, hands under shoulders; press upper body up keeping pelvis down; oscillate or hold",
        "Dosage": "10-15 reps × 3-4 sessions/day if centralizing per McKenzie",
        "Cues": "Monitor symptom response — must centralize or improve; stop if peripheralization",
        "Contraindications": "Stenosis, spondylolysis acute, cauda equina, extension worsens symptoms",
        "Progression": "Add overpressure → standing extension",
        "Evidence": "McKenzie mechanical diagnosis; extension preference subgroup benefit",
        "References": "McKenzie Treat Your Own Back; clinical reasoning",
    }),
    ("Hip Hinge / Romanian Deadlift Pattern", {
        "ID": "EX-LUM-007", "Exercise": "Hip Hinge / Romanian Deadlift (RDL)",
        "Target": "Gluteus maximus, hamstrings, erector spinae isometric",
        "Phase": "Remodeling-functional; RTW/RTS",
        "Technique": "Soft knees, push hips back, neutral spine, bar/DB close to legs; feel hamstring stretch not lumbar flexion",
        "Dosage": "3 sets × 8-12 progressive load",
        "Cues": "Chest up; lats engaged; bar path vertical over mid-foot",
        "Contraindications": "Acute radiculopathy uncontrolled; flexion intolerance without modification",
        "Progression": "PVC pipe → dumbbell → barbell → single-leg RDL",
        "Evidence": "Functional lifting retraining cornerstone",
        "References": "McGill; NIOSH lifting; APTA RTW",
    }),
    ("Pallof Press (Anti-Rotation)", {
        "ID": "EX-LUM-008", "Exercise": "Pallof Press",
        "Target": "Obliques, transversus abdominis, multifidus anti-rotation",
        "Phase": "Subacute-remodeling",
        "Technique": "Cable/band at chest height; press forward resisting rotation; hold 3-5 sec",
        "Dosage": "3 sets × 10-12 each side",
        "Cues": "Don't rotate trunk; hips square; breathe",
        "Contraindications": "Acute rotation pain",
        "Progression": "Increase band tension → half-kneeling → split stance",
        "Evidence": "Anti-rotation core training functional carryover",
        "References": "APTA core stability programs",
    }),
    ("Stationary Bike (Flexion Bias)", {
        "ID": "EX-LUM-009", "Exercise": "Stationary Cycling",
        "Target": "Aerobic conditioning; hip/knee ROM; flexion-biased stenosis",
        "Phase": "Subacute stenosis, chronic LBP, all conditions needing low-impact cardio",
        "Technique": "Seat height hip flexion ~30 deg; upright or slight forward lean for stenosis",
        "Dosage": "20-30 min moderate intensity; progress duration before intensity",
        "Cues": "Neutral spine; avoid slumped flexion if disc intolerant",
        "Contraindications": "Severe flexion intolerance (adjust seat)",
        "Progression": "Duration → interval → outdoor cycling",
        "Evidence": "Aerobic exercise recommended NICE NG59; stenosis flexion relief",
        "References": "NICE NG59; NASS stenosis",
    }),
    ("Cat-Camel (Spinal Mobility)", {
        "ID": "EX-LUM-010", "Exercise": "Cat-Camel",
        "Target": "Lumbar/thoracic mobility; disc nutrition motion",
        "Phase": "Subacute nonspecific LBP; warm-up",
        "Technique": "Quadruped slow flexion-extension cycles through available ROM without forcing end range",
        "Dosage": "10-15 slow cycles × 2-3 sets",
        "Cues": "Move segmentally if possible; pain-free range",
        "Contraindications": "Acute severe pain either direction; stenosis extension end-range",
        "Progression": "Add rotation in quadruped (thread the needle)",
        "Evidence": "Gentle mobility adjunct; not standalone treatment",
        "References": "APTA LBP CPG",
    }),
    ("Neural Glide — Sciatic (Slump Slider)", {
        "ID": "EX-LUM-011", "Exercise": "Sciatic Neural Glide (Slump Slider)",
        "Target": "Sciatic nerve mobility; radiculopathy L4-S1",
        "Phase": "Subacute radiculopathy when irritability decreasing",
        "Technique": "Seated slump, extend knee then dorsiflex; flex knee to slacken; oscillate",
        "Dosage": "10-15 slow reps × 2-3 sets; monitor 24h response",
        "Cues": "Do not push into severe pain; differentiate hamstring vs neural",
        "Contraindications": "High irritability radiculopathy; cauda equina; progressive deficit",
        "Progression": "Add cervical flexion component carefully",
        "Evidence": "Adjunct neural mobilization moderate evidence",
        "References": "Butler/Mobilisation of the Nervous System; Magee",
    }),
    ("Clamshell", {
        "ID": "EX-LUM-012", "Exercise": "Clamshell",
        "Target": "Gluteus medius, deep hip external rotators",
        "Phase": "Subacute all LBP — lumbopelvic stability",
        "Technique": "Side-lying hips/knees flexed 45 deg; open top knee without pelvis rolling back",
        "Dosage": "3 sets × 15-20 each side; band above knees progress",
        "Cues": "Heels together; pelvis stacked; controlled tempo",
        "Contraindications": "Hip pathology limiting side-lying",
        "Progression": "Band resistance → side-lying hip abduction",
        "Evidence": "Glute med weakness associated with LBP in some studies",
        "References": "Hip-spine syndrome literature",
    }),
    ("Suitcase Carry", {
        "ID": "EX-LUM-013", "Exercise": "Suitcase Carry (Unilateral Farmer Carry)",
        "Target": "QL, obliques, gluteus medius, grip, functional anti-lateral flexion",
        "Phase": "Remodeling-functional; RTW",
        "Technique": "Single dumbbell/kettlebell at side; walk tall without lateral lean; neutral spine",
        "Dosage": "3 sets × 20-40 m each hand",
        "Cues": "Don't shrug toward weight; brace core; even steps",
        "Contraindications": "Acute lateral pain; severe stenosis walking limited",
        "Progression": "Heavier load → longer distance → overhead carry variant",
        "Evidence": "Functional core training; occupational carry simulation",
        "References": "McGill carries; APTA functional training",
    }),
    ("Walking Program (Graded)", {
        "ID": "EX-LUM-014", "Exercise": "Graded Walking Program",
        "Target": "Aerobic fitness, disc nutrition, general LBP recovery",
        "Phase": "Acute onward — first-line activity NICE",
        "Technique": "Start pain-free or mildly acceptable distance; increase 10-15% per week; upright posture",
        "Dosage": "Daily or 5×/week; 20-45 min goal",
        "Cues": "Arm swing natural; avoid shopping cart unless stenosis (then flexion OK)",
        "Contraindications": "Neurogenic claudication — use pacing and flexion breaks",
        "Progression": "Distance → speed → incline → weighted vest optional",
        "Evidence": "Strong stay-active recommendation NICE NG59",
        "References": "NICE NG59; Cochrane walking LBP",
    }),
    ("Pool Therapy / Aquatic Exercise", {
        "ID": "EX-LUM-015", "Exercise": "Aquatic Therapy",
        "Target": "De-loaded spinal movement; aerobic and strengthening",
        "Phase": "Acute-subacute when land-based exercise intolerant; stenosis, spondylolysis",
        "Technique": "Walking in pool, water aerobics, gentle swimming; buoyancy reduces axial load",
        "Dosage": "30-45 min sessions 2-3×/week",
        "Cues": "Maintain neutral spine with flutter board if swimming",
        "Contraindications": "Open wounds; infection risk; fear of water",
        "Progression": "Reduce water depth → land-based transition",
        "Evidence": "Moderate benefit chronic LBP aquatic exercise reviews",
        "References": "Cochrane aquatic exercise LBP",
    }),
    ("Thoracic Rotation Mobility (Open Book)", {
        "ID": "EX-LUM-016", "Exercise": "Open Book / Thread the Needle",
        "Target": "Thoracic rotation mobility — reduces compensatory lumbar rotation",
        "Phase": "Subacute onward",
        "Technique": "Side-lying or quadruped rotation with thoracic emphasis; block lumbar if needed",
        "Dosage": "10 reps each side × 2 sets daily",
        "Cues": "Rotate through mid-back not low back",
        "Contraindications": "Acute rotation-provoked pain",
        "Progression": "Add foam roller thoracic extension",
        "Evidence": "Thoracic hypomobility linked to LBP compensations",
        "References": "Manual therapy LBP adjunct evidence",
    }),
    ("Hip Flexor Stretch (Half-Kneeling)", {
        "ID": "EX-LUM-017", "Exercise": "Half-Kneeling Hip Flexor Stretch",
        "Target": "Iliopsoas, rectus femoris",
        "Phase": "Subacute all LBP with hip flexor tightness",
        "Technique": "Half-kneeling, posterior pelvic tilt, lean forward until anterior hip stretch felt without lumbar extension",
        "Dosage": "3 sets × 30-45 sec each side",
        "Cues": "Tuck pelvis first; don't arch low back",
        "Contraindications": "Knee pain on floor (pad); hip pathology",
        "Progression": "Overhead reach same side → add light contract-relax",
        "Evidence": "Hip flexor length part of lumbopelvic management",
        "References": "Magee 2014 hip examination",
    }),
    ("Wall Squat / Sit-to-Stand", {
        "ID": "EX-LUM-018", "Exercise": "Wall Squat / Sit-to-Stand",
        "Target": "Quadriceps, glutes, functional ADL",
        "Phase": "Subacute-remodeling; stenosis (flexion OK)",
        "Technique": "Back against wall slide to comfortable depth; or chair sit-to-stand without arms",
        "Dosage": "3 sets × 10-15",
        "Cues": "Knees track toes; chest up; hip hinge on stand",
        "Contraindications": "Patellofemoral pain modify depth",
        "Progression": "Single leg sit-to-stand → weighted squat",
        "Evidence": "Functional strengthening NICE recommended exercise",
        "References": "NICE NG59; APTA",
    }),
]


IMAGING_RECORDS: list[tuple[str, dict[str, Any]]] = [
    ("Lumbar X-Ray (AP/Lateral)", {
        "ID": "IMG-LUM-001", "Modality": "Lumbar X-Ray AP and Lateral",
        "Indications": "Trauma, suspected fracture, spondylolisthesis grading, scoliosis screening, pre-operative baseline, "
            "failed conservative care needing alignment assessment",
        "Views": "AP, lateral standing (flexion-extension if instability suspected)",
        "Findings": "Lordosis angle, disc height loss, osteophytes, pars defect (oblique views), Meyerding grade listhesis, "
            "spondylolisthesis, sacralization L5",
        "Limitations": "Poor soft tissue/disc/nerve visualization; radiation exposure",
        "Red Flags": "Fracture line, listhesis progression, destructive lesion",
        "References": "ACR Appropriateness; Magee 2014",
    }),
    ("Lumbar MRI", {
        "ID": "IMG-LUM-002", "Modality": "Lumbar MRI (without contrast first line)",
        "Indications": "Red flags, cauda equina EMERGENCY, progressive neuro deficit, persistent radiculopathy >6 weeks, "
            "suspected infection/malignancy (with contrast), pre-surgical planning",
        "Findings": "Disc herniation type (bulge/protrusion/extrusion/sequestration), nerve root compression, "
            "central/lateral recess/foraminal stenosis, Modic changes, Pfirrmann grade, facet effusion, cord/conus level",
        "Limitations": "High false-positive disc findings asymptomatic adults; correlate clinically",
        "Red Flags": "Cauda equina compression, epidural abscess, metastatic lesion, conus lesion",
        "References": "NICE NG59 imaging; ACR Appropriateness; Jensen NEJM incidental disc findings",
    }),
    ("Lumbar CT", {
        "ID": "IMG-LUM-003", "Modality": "Lumbar CT (often with myelography legacy; CT myelogram selective)",
        "Indications": "Pars defect characterization, post-operative fusion assessment, MRI contraindicated (pacemaker rare now), "
            "fracture detail, surgical planning bony anatomy",
        "Findings": "Pars lysis, facet tropism, bony stenosis dimensions, fusion mass",
        "Limitations": "Radiation; limited direct nerve visualization without myelogram",
        "References": "Magee 2014; adolescent spondylolysis protocols",
    }),
    ("Bone Scan (SPECT-CT)", {
        "ID": "IMG-LUM-004", "Modality": "Nuclear Medicine Bone Scan / SPECT-CT",
        "Indications": "Suspected metastases, occult fracture, active pars stress (SPECT), infection, inflammatory conditions",
        "Findings": "Increased uptake active pars, metastatic lesions, facet inflammation",
        "Limitations": "Non-specific; MRI often preferred",
        "References": "Oncology red flag workup; sports pars imaging",
    }),
    ("EMG/NCS Lumbar", {
        "ID": "IMG-LUM-005", "Modality": "Electromyography and Nerve Conduction Studies",
        "Indications": "Subacute/chronic radiculopathy confirmation, differentiate peripheral neuropathy, "
            "pre-surgical baseline, multilevel disease",
        "Findings": "Denervation potentials affected myotome, fibrillations, chronic reinnervation",
        "Limitations": "May be normal early acute radiculopathy; does not show compressive level directly always",
        "References": "AANEM guidelines; Magee 2014",
    }),
]


RTS_RECORDS: list[tuple[str, dict[str, Any]]] = [
    ("Disc Herniation — Return to Sport", {
        "ID": "RTS-LUM-001", "Condition": "Disc Herniation",
        "Criteria": "Leg pain resolved or minimal; full ROM; SLR negative; strength ≥90% bilateral LE; "
            "no neurological deficit; sport-specific drills without peripheralization",
        "Testing": "Single-leg hop symmetry, sport-specific simulation 24h symptom check",
        "Timeline": "Variable — weeks to months; no fixed calendar — criteria-based",
        "References": "Sports medicine return-to-play consensus",
    }),
    ("Spondylolysis — Return to Sport", {
        "ID": "RTS-LUM-002", "Condition": "Spondylolysis / Spondylolisthesis",
        "Criteria": "Pain-free extension-rotation sport movements; CT/MRI stable pars; core and hip strength symmetric; "
            "MD clearance adolescent athletes",
        "Testing": "Sport-specific throwing/bowling/gymnastics progressions monitored",
        "Timeline": "3-6 months minimum often; high-load sports longer",
        "References": "Adolescent athlete pars return protocols",
    }),
    ("Lumbar Stenosis — Return to Activity", {
        "ID": "RTS-LUM-003", "Condition": "Lumbar Stenosis",
        "Criteria": "Walking tolerance meets functional goals (often modified); flexion strategies mastered; "
            "no progressive neuro deficit",
        "Testing": "Timed walk test; community ambulation distance",
        "Timeline": "Chronic management — ongoing pacing",
        "References": "NASS stenosis functional outcomes",
    }),
    ("Nonspecific LBP — Return to Work", {
        "ID": "RTS-LUM-004", "Condition": "Nonspecific Low Back Pain",
        "Criteria": "Vocational tasks simulated pain-free; lifting capacity meets job demands; yellow flags addressed",
        "Testing": "Material handling assessment; sit-stand tolerance; job-specific simulation",
        "Timeline": "Early return modified work preferred NICE — often days to 2 weeks",
        "References": "NICE NG59 return to work; occupational health guidelines",
    }),
    ("Radiculopathy — Return to Sport", {
        "ID": "RTS-LUM-005", "Condition": "Radiculopathy",
        "Criteria": "Myotome strength full; reflex may still be diminished if stable; no progressive sensory loss; "
            "running/jumping without leg pain",
        "Testing": "Neurological re-exam; functional LE tests; gradual sport progression",
        "Timeline": "6-12 weeks typical uncomplicated; longer if surgical",
        "References": "APTA; SPORT trial follow-up concepts",
    }),
]


RED_FLAG_SCREEN = {
    "Template Name": "Lumbar Red Flag Screening (Emergency Referral)",
    "ID": "RF-LUM-001",
    "Cauda Equina": "URGENT: urinary retention, overflow incontinence, fecal incontinence, saddle anesthesia, bilateral sciatica, progressive bilateral weakness, reduced anal sphincter tone — EMERGENCY MRI and surgical consult",
    "Fracture": "Major trauma, minor trauma osteoporosis/steroids, prolonged corticosteroid use, age >70 with trauma",
    "Malignancy": "Age >50 new unexplained LBP, history cancer, unexplained weight loss, night pain unrelieved by rest",
    "Infection": "Fever, IV drug use, recent spinal procedure, immunosuppression, severe constant pain",
    "Inflammatory": "Morning stiffness >30 min improving with activity, alternating buttock pain (consider AS), family history",
    "Progressive Neurological Deficit": "Worsening motor weakness, new foot drop, ascending sensory loss — urgent imaging",
    "Action": "Do not continue conservative trial as primary management when cauda equina or progressive deficit suspected; "
        "direct emergency department or spinal on-call referral; document time of referral",
    "References": "NICE NG59 red flags; APTA LBP CPG; Magee 2014",
}


OUTCOME_MEASURES: list[tuple[str, dict[str, Any]]] = [
    ("Oswestry Disability Index (ODI)", {
        "ID": "OM-LUM-001", "Measure": "Oswestry Disability Index (ODI)",
        "Type": "Patient-reported outcome — functional disability",
        "Items": "10 sections: pain intensity, personal care, lifting, walking, sitting, standing, sleeping, sex life, social life, traveling",
        "Scoring": "0-100%; minimal disability 0-20%; moderate 21-40%; severe 41-60%; crippled 61-80%; bed-bound 81-100%",
        "MCID": "Minimum clinically important difference ~10-15 points (approximate; varies by study)",
        "Use": "Track LBP disability over treatment; research standard",
        "References": "Fairbank ODI; orthopedic outcome measure literature",
    }),
    ("Numeric Pain Rating Scale (NPRS)", {
        "ID": "OM-LUM-002", "Measure": "Numeric Pain Rating Scale (NPRS 0-10)",
        "Type": "Pain intensity patient-reported",
        "Items": "Single item current pain 0 no pain to 10 worst imaginable",
        "Scoring": "0-10 continuous",
        "MCID": "~2 points approx for LBP (variable)",
        "Use": "Quick serial pain monitoring; telehealth friendly",
        "References": "IMMPACT recommendations chronic pain",
    }),
    ("STarT Back Screening Tool", {
        "ID": "OM-LUM-003", "Measure": "STarT Back Screening Tool",
        "Type": "Risk stratification — psychosocial yellow flags",
        "Items": "9 items: 5 subgroups psychosocial distress; 4 physical; subscore for high-risk",
        "Scoring": "Low, medium, high risk subgroups guide matched treatment pathways",
        "Use": "Primary care and PT triage — high-risk may benefit targeted psychologically informed PT",
        "References": "Hill STarT Back trial; UK stratified care model",
    }),
    ("Quebec Back Pain Disability Scale", {
        "ID": "OM-LUM-004", "Measure": "Quebec Back Pain Disability Scale",
        "Type": "Functional disability scale",
        "Items": "20 items daily activities",
        "Scoring": "0-100 disability score",
        "Use": "Alternative to ODI; validated LBP",
        "References": "Quebec scale validation studies",
    }),
    ("Patient-Specific Functional Scale (PSFS)", {
        "ID": "OM-LUM-005", "Measure": "Patient-Specific Functional Scale (PSFS)",
        "Type": "Individualized functional outcome",
        "Items": "Patient identifies up to 3 important activities rated 0-10 ability",
        "Scoring": "Track patient-nominated activities",
        "MCID": "~2 points approx per activity",
        "Use": "Goal-oriented rehab; patient-centered outcomes",
        "References": "Stratford PSFS validation",
    }),
    ("Fear-Avoidance Beliefs Questionnaire (FABQ)", {
        "ID": "OM-LUM-006", "Measure": "Fear-Avoidance Beliefs Questionnaire (FABQ)",
        "Type": "Yellow flag psychosocial measure",
        "Items": "FABQ-Work and FABQ-Physical activity subscales",
        "Scoring": "Higher scores = greater fear-avoidance beliefs",
        "Use": "Identify patients needing cognitive-behavioral approaches; work-related fear",
        "References": "Waddell FABQ; chronic LBP biopsychosocial model",
    }),
]


CLINICAL_PATHWAYS: list[tuple[str, dict[str, Any]]] = [
    ("Acute Low Back Pain with Leg Pain — Initial Pathway", {
        "ID": "PATHWAY-LUM-001", "Presentation": "Acute LBP with leg pain (<6 weeks)",
        "Step 1": "Red flag screen FIRST — cauda equina, fracture, infection, malignancy, progressive deficit",
        "Step 2": "If red flags → emergency referral/imaging per protocol; STOP conservative primary pathway",
        "Step 3": "Neurological exam: dermatomes L1-S1, myotomes, patellar/Achilles reflexes, SLR, crossed SLR",
        "Step 4": "Classify: radiculopathy vs referred somatic pain vs SI/hip; leg pain below knee suggests radicular",
        "Step 5": "Education: favorable prognosis, stay active, avoid bed rest; analgesia per MD",
        "Step 6": "Physical therapy: directional preference assessment; neural mobilization if radicular low irritability",
        "Step 7": "Reassess 2-4 weeks; if progressive neuro deficit or cauda equina symptoms → urgent MRI",
        "Step 8": "Imaging if not improving 6 weeks persistent radiculopathy per NICE or earlier if red flags",
        "References": "NICE NG59; APTA LBP CPG; Magee examination",
    }),
    ("Chronic Low Back Pain — Biopsychosocial Pathway", {
        "ID": "PATHWAY-LUM-002", "Presentation": "Chronic LBP (>12 weeks)",
        "Step 1": "Red flag re-screen; STarT Back or FABQ yellow flag assessment",
        "Step 2": "ODI or PSFS baseline functional measure",
        "Step 3": "Subgroup: movement preference (flexion/extension/intolerance), instability signs, stenosis pattern, chronic widespread",
        "Step 4": "Graded exercise program — type less important than adherence (Cochrane)",
        "Step 5": "Manual therapy short course adjunct if indicated",
        "Step 6": "CBT or psychologically informed PT if high yellow flags (STarT Back high-risk)",
        "Step 7": "Work participation emphasis — modified duties vs prolonged disability",
        "Step 8": "Reassess 6-8 weeks with ODI/NPRS MCID tracking",
        "References": "NICE NG59 chronic LBP; STarT Back; Cochrane exercise",
    }),
    ("Neurogenic Claudication — Stenosis Pathway", {
        "ID": "PATHWAY-LUM-003", "Presentation": "Leg pain/heaviness with walking/standing, relieved by sitting/flexion",
        "Step 1": "Differentiate vascular claudication — pulses, ABI if indicated, bicycle vs walking test",
        "Step 2": "Red flags: acute cauda equina rare in isolated stenosis but screen bowel/bladder",
        "Step 3": "Confirm neurogenic pattern: shopping cart sign, flexion relief, bilateral often",
        "Step 4": "Conservative PT: flexion-biased exercises, cycling, hip flexor strengthening, pacing education",
        "Step 5": "Imaging MRI if not previously done and symptoms functionally limiting for shared decision",
        "Step 6": "Epidural injection trial selective cases",
        "Step 7": "Surgical decompression discussion if moderate-severe refractory to conservative 3-6 months",
        "References": "NASS lumbar stenosis guidelines; neurogenic claudication literature",
    }),
    ("Adolescent Athlete Back Pain — Pars Pathway", {
        "ID": "PATHWAY-LUM-004", "Presentation": "Adolescent athlete extension-intolerant LBP",
        "Step 1": "Red flags standard; high index pars suspicion gymnastics/cricket/football/dance",
        "Step 2": "Stork test, extension-rotation pain; reduce extension sports immediately",
        "Step 3": "Imaging: MRI with STIR for bone edema early; CT for pars defect confirmation",
        "Step 4": "Bracing and activity modification 3-6 months per sports medicine protocol",
        "Step 5": "Rehab: McGill Big 3, glute/hip focus, no end-range extension loading",
        "Step 6": "Gradual return sport-specific with technique modification; MD clearance",
        "Step 7": "Spondylolisthesis grading if bilateral pars defect — monitor slip standing X-ray",
        "References": "Magee adolescent spine; sports spondylolysis consensus",
    }),
    ("Cauda Equina Suspicion — Emergency Pathway", {
        "ID": "PATHWAY-LUM-005", "Presentation": "Suspected cauda equina syndrome",
        "Step 1": "IMMEDIATE — do not schedule routine PT follow-up as primary action",
        "Step 2": "History: urinary retention, overflow incontinence, saddle numbness, bilateral leg symptoms, fecal incontinence, progressive weakness",
        "Step 3": "Exam: perianal sensation, anal tone (physician), post-void residual bladder scan, bilateral neuro exam",
        "Step 4": "Emergency MRI whole lumbar spine — contact on-call spinal service/ED",
        "Step 5": "If confirmed → emergency surgical decompression; document time symptom onset (time-sensitive outcomes)",
        "Step 6": "PT role: post-operative rehabilitation ONLY after surgical management",
        "Step 7": "Medicolegal documentation critical — clear referral communication",
        "References": "NICE NG59 cauda equina; ACR MRI appropriateness emergency; Bogduk",
    }),
    ("Return-to-Work Decision Pathway", {
        "ID": "PATHWAY-LUM-006", "Presentation": "Occupational LBP — RTW planning",
        "Step 1": "Job demands analysis: sitting/standing/lifting/frequency",
        "Step 2": "Yellow flags: work dissatisfaction, FABQ-work elevated, litigation — address biopsychosocial",
        "Step 3": "Early RTW modified preferred over prolonged sick leave (NICE)",
        "Step 4": "Functional capacity evaluation: material handling, sit tolerance, walking distance",
        "Step 5": "Graded exposure to job tasks simulation in clinic",
        "Step 6": "Employer communication with patient consent — ergonomic modifications",
        "Step 7": "Full duty when job simulation pain-free and strength criteria met",
        "References": "NICE NG59 RTW; occupational health LBP guidelines",
    }),
]


MANUAL_THERAPY_RECORDS: list[tuple[str, dict[str, Any]]] = [
    ("Posterior-Anterior (PA) Central Mobilization", {
        "ID": "MT-LUM-001", "Technique": "PA Central Vertebral Mobilization",
        "Grade": "Maitland Grade I-II pain modulation; III-IV stiffness (IV small amplitude end-range)",
        "Indications": "Segmental hypomobility, nonspecific LBP, facet hypomobility",
        "Contraindications": "Acute disc herniation with peripheralization on extension, cauda equina, fracture, malignancy, hypermobility instability",
        "Technique Detail": "Patient prone; central pressure over spinous process; oscillatory or sustained",
        "Evidence": "Manual therapy adjunct moderate short-term benefit LBP (Cochrane)",
        "References": "Maitland; APTA LBP CPG",
    }),
    ("Flexion Distraction", {
        "ID": "MT-LUM-002", "Technique": "Flexion Distraction (Cox technique concept)",
        "Grade": "Rhythmic flexion-distraction table or manual equivalent",
        "Indications": "Disc herniation flexion-intolerant alternative, stenosis, facet pain",
        "Contraindications": "Cauda equina, fracture, abdominal aortic aneurysm, pregnancy considerations",
        "Technique Detail": "Gentle repetitive flexion traction segment; monitor symptom centralization",
        "Evidence": "Limited high-quality RCTs; widely used clinically",
        "References": "Cox flexion distraction literature",
    }),
    ("Muscle Energy — Pelvic Rotation", {
        "ID": "MT-LUM-003", "Technique": "Muscle Energy for Pelvic/Lumbar Rotation Dysfunction",
        "Grade": "Isometric patient effort 3-5 sec, 3-5 reps",
        "Indications": "Rotational dysfunction, SI region, mild segmental restriction",
        "Contraindications": "Acute severe pain, hypermobility, acute disc",
        "Technique Detail": "Patient positioned in restriction barrier; isometric into rotation against therapist resistance; reassess",
        "Evidence": "Manual therapy component multimodal care",
        "References": "Magee 2014; osteopathic/PT manual therapy texts",
    }),
    ("Neural Mobilization — Slump Technique", {
        "ID": "MT-LUM-004", "Technique": "Slump Neural Mobilization (Treatment)",
        "Grade": "Oscillatory neural glide not sustained aggressive stretch",
        "Indications": "Radiculopathy low irritability, neural tension positive tests",
        "Contraindications": "High irritability radiculopathy, cauda equina, progressive deficit",
        "Technique Detail": "Seated slump sequence with knee/ankle components; monitor 24h symptom response",
        "Evidence": "Adjunct moderate evidence neural mobilization sciatica",
        "References": "Butler; Magee neurodynamics",
    }),
    ("Soft Tissue — Quadratus Lumborum", {
        "ID": "MT-LUM-005", "Technique": "QL Soft Tissue Mobilization / Trigger Point Release",
        "Grade": "Ischemic compression, myofascial release, dry needling where licensed",
        "Indications": "QL trigger point, lateral LBP, somatic hip referral",
        "Contraindications": "Renal pathology left side caution; anticoagulation; acute radiculopathy misidentified",
        "Technique Detail": "Side-lying access to QL between iliac crest and 12th rib; avoid excessive depth",
        "Evidence": "Short-term pain relief; combine with exercise for lasting effect",
        "References": "Travell & Simons; dry needling LBP reviews",
    }),
]


DIFFERENTIAL_RECORDS: list[tuple[str, dict[str, Any]]] = [
    ("Leg Pain Below Knee — Differential", {
        "ID": "DDX-LUM-001", "Chief Complaint": "Leg pain below knee",
        "Most Likely MSK": "Lumbar radiculopathy L4/L5/S1 disc herniation or stenosis",
        "Alternative MSK": "SI joint referral, hip OA, hamstring strain, piriformis syndrome",
        "Key Discriminators": "Dermatomal pattern, reflex change, SLR positive, myotome weakness",
        "References": "Magee 2014",
    }),
    ("Back Pain Only — Differential", {
        "ID": "DDX-LUM-002", "Chief Complaint": "Axial low back pain only",
        "Most Likely MSK": "Nonspecific LBP, facet syndrome, myofascial pain, SI joint",
        "Red Flags": "Fever, cancer history, trauma, cauda equina if bladder symptoms develop",
        "References": "NICE NG59; Magee 2014",
    }),
    ("Bilateral Leg Symptoms — Differential", {
        "ID": "DDX-LUM-006", "Chief Complaint": "Bilateral leg symptoms",
        "Urgent": "Cauda equina — saddle anesthesia, bladder/bowel dysfunction — EMERGENCY MRI",
        "Stenosis": "Neurogenic claudication — extension worse, flexion better, gradual onset",
        "References": "NICE NG59",
    }),
]


LUMBOSACRAL_RECORDS: list[tuple[str, dict[str, Any]]] = [
    ("Lumbosacral Junction (L5-S1)", {
        "ID": "LSJ-LUM-001", "Structure": "Lumbosacral Junction",
        "Anatomy": "L5 on sacrum; highest shear; iliolumbar ligaments",
        "Common Pathology": "L5-S1 disc herniation; spondylolysis L5; listhesis",
        "References": "Bogduk 2012",
    }),
    ("Conus vs Cauda Equina", {
        "ID": "LSJ-LUM-003", "Structure": "Conus Medullaris vs Cauda Equina",
        "Clinical Distinction": "Conus: UMN, symmetric, early bladder; Cauda: LMN, asymmetric roots L2-S5",
        "Emergency": "Urgent MRI both presentations when suspected",
        "References": "Netter; Bogduk 2012",
    }),
    ("Dermatomal Reference L1-S1", {
        "ID": "LSJ-LUM-004", "Structure": "Dermatome/Myotome/Reflex Quick Reference",
        "L4": "Medial leg — patellar reflex — quadriceps/TA",
        "L5": "Lateral leg/dorsum foot — EHL — no primary DTR",
        "S1": "Posterior leg — Achilles reflex — plantarflexion",
        "References": "Netter; Magee 2014",
    }),
]


PATIENT_EDUCATION_RECORDS: list[tuple[str, dict[str, Any]]] = [
    ("Stay Active — Avoid Bed Rest", {
        "ID": "EDU-LUM-001", "Topic": "Stay Active; Avoid Prolonged Bed Rest",
        "Key Message": "Acute LBP: continue normal activities within pain tolerance; bed rest >1-2 days not recommended",
        "Rationale": "Maintains conditioning, disc nutrition, reduces fear-avoidance; faster recovery vs rest",
        "Practical Advice": "Short walks, modify not stop work if possible, pain does not equal harm for nonspecific LBP",
        "Cautions": "Modify if radiculopathy; emergency if cauda equina symptoms",
        "References": "NICE NG59 strong recommendation",
    }),
    ("Understanding Disc Herniation", {
        "ID": "EDU-LUM-002", "Topic": "Patient Education — Disc Herniation",
        "Key Message": "Many disc herniations improve without surgery; leg pain may centralize to back (good sign)",
        "Rationale": "Natural history favorable for majority; MRI findings common in asymptomatic adults",
        "Practical Advice": "Avoid prolonged sitting if flexion intolerant; walking; positional relief; report bowel/bladder changes immediately",
        "Cautions": "Cauda equina emergency signs must be reviewed",
        "References": "NICE NG59 sciatica; Jensen incidental disc findings",
    }),
    ("Red Flags — When to Seek Emergency Care", {
        "ID": "EDU-LUM-003", "Topic": "Red Flags Patient Education",
        "Key Message": "Seek emergency care for: inability to urinate, saddle numbness, bilateral leg weakness, fecal incontinence, fever with back pain after procedure",
        "Rationale": "Cauda equina, infection, fracture may need urgent treatment",
        "Practical Advice": "Provide written red flag list; ensure patient understands bladder symptoms",
        "References": "NICE NG59; APTA LBP CPG",
    }),
    ("Yellow Flags and Recovery", {
        "ID": "EDU-LUM-004", "Topic": "Yellow Flags — Psychosocial Recovery Factors",
        "Key Message": "Fear of movement, belief that back is damaged, work dissatisfaction predict slower recovery — addressable",
        "Rationale": "Biopsychosocial model; STarT Back stratified care improves outcomes high-risk patients",
        "Practical Advice": "Graded exposure, realistic prognosis, stay at work modified, CBT if needed",
        "References": "STarT Back trial; FABQ literature",
    }),
    ("Lifting and Work Ergonomics", {
        "ID": "EDU-LUM-005", "Topic": "Lifting Education and Ergonomics",
        "Key Message": "Hip hinge, load close to body, avoid twist under load; vary posture — no single perfect posture",
        "Rationale": "Reduces flexion-compression injury risk; occupational LBP multifactorial",
        "Practical Advice": "Micro-breaks from sitting; sit-stand options; job rotation",
        "References": "NIOSH lifting; NICE RTW guidance",
    }),
    ("Stenosis — Walking and Pacing", {
        "ID": "EDU-LUM-006", "Topic": "Neurogenic Claudication Patient Education",
        "Key Message": "Leg heaviness when walking that eases with sitting or leaning forward (shopping cart) is common in stenosis",
        "Rationale": "Flexion opens spinal canal; pacing prevents symptom escalation",
        "Practical Advice": "Use cart in supermarket, stationary bike, flexion stretches before walking",
        "References": "NASS stenosis patient education",
    }),
    ("Spondylolysis in Young Athletes", {
        "ID": "EDU-LUM-007", "Topic": "Adolescent Athlete Pars Education",
        "Key Message": "Extension-sport back pain needs medical assessment; rest from extension loading allows pars healing",
        "Rationale": "Early diagnosis improves healing chance; chronic non-union may still be managed conservatively",
        "Practical Advice": "Core stability, bracing if prescribed, gradual return with technique modification",
        "References": "Sports medicine spondylolysis consensus",
    }),
    ("Self-Management and Flare Plan", {
        "ID": "EDU-LUM-008", "Topic": "Chronic LBP Self-Management Plan",
        "Key Message": "Flares common; return to baseline exercises not full rest; maintain aerobic activity",
        "Rationale": "Self-efficacy reduces recurrence and healthcare utilization",
        "Practical Advice": "Home exercise program 2-3× week maintenance; heat; resume walking early in flare",
        "References": "NICE NG59 chronic LBP; Cochrane self-management",
    }),
]


SUPPLEMENTARY_CLINICAL_RECORDS: list[tuple[str, dict[str, Any]]] = [
    ("L5 Transitional Vertebra — Lumbosacral Variant", {
        "ID": "SUP-LUM-001", "Topic": "L5 Transitional Vertebra (Bertolotti Syndrome)",
        "Definition": "Partial or complete fusion L5 transverse process to sacrum/ilium; sacralization or lumbarization S1",
        "Clinical Relevance": "Altered biomechanics; may predispose to adjacent segment disease; pars stress at transition",
        "Imaging": "Castellvi classification; identify on AP X-ray enlarged transverse process",
        "Management": "Same LBP principles; address adjacent segment overload",
        "References": "Bogduk; spinal variant anatomy",
    }),
    ("Modic Changes — Endplate MRI Classification", {
        "ID": "SUP-LUM-002", "Topic": "Modic Endplate Changes",
        "Type 1": "Edema/inflammation — low T1, high T2; may correlate with active discogenic pain",
        "Type 2": "Fatty replacement — high T1 and T2",
        "Type 3": "Sclerosis — low T1 and T2",
        "Clinical Relevance": "Type 1 may indicate inflammatory disc pathology; weak correlation with symptoms overall",
        "References": "Modic et al.; lumbar MRI interpretation",
    }),
    ("Pfirrmann Disc Degeneration Grades", {
        "ID": "SUP-LUM-003", "Topic": "Pfirrmann MRI Disc Grading",
        "Grade I": "Homogeneous bright white nucleus; normal disc height",
        "Grade II": "Inhomogeneous structure; clear nucleus/annulus distinction",
        "Grade III": "Inhomogeneous gray; unclear nucleus/annulus boundary",
        "Grade IV": "Homogeneous gray; no distinction; disc height loss may begin",
        "Grade V": "Collapsed disc space; black signal",
        "Clinical Relevance": "Correlates with age; poor sole predictor of pain",
        "References": "Pfirrmann classification spine MRI",
    }),
    ("Centralization vs Peripheralization (McKenzie)", {
        "ID": "SUP-LUM-004", "Topic": "Centralization and Peripheralization Phenomenon",
        "Centralization": "Distal leg symptoms retreat toward spine with repeated movements — favorable sign",
        "Peripheralization": "Symptoms spread distally — stop provocative movement/direction",
        "Application": "Guide directional preference therapy; monitor each session",
        "References": "McKenzie mechanical diagnosis and therapy",
    }),
    ("Hip-Spine Syndrome", {
        "ID": "SUP-LUM-005", "Topic": "Hip-Spine Syndrome — Concurrent Pathology",
        "Concept": "Lumbar and hip pathology co-exist; hip ROM loss increases lumbar compensation",
        "Examination": "Always screen hip IR/FADIR with LBP especially groin/buttock predominant",
        "Management": "Treat both regions; hip arthroplasty may reduce referred LBP",
        "References": "Hip-spine syndrome orthopedics literature",
    }),
]


TOC_SECTIONS = [
    "Disclaimer",
    "1. Lumbar Vertebrae (L1-L5)",
    "2. Intervertebral Discs (L1-2 through L5-S1)",
    "3. Facet Joints (L1-2 through L5-S1)",
    "4. Ligaments",
    "5. Lumbar Muscles",
    "6. Lumbar Nerves (L1-S1) and Cauda Equina",
    "7. Blood Supply",
    "8. Lumbar Fascia",
    "9. Biomechanics (Flexion, Extension, Rotation, Side Bending, Lifting, Sitting, Walking, Running)",
    "10. Pathologies (Disc Herniation, Stenosis, Spondylolysis, Spondylolisthesis, Facet, SI, Strain, Radiculopathy, Cauda Equina)",
    "11. Rehabilitation Phases",
    "12. Special Tests",
    "13. Clinical Examination Template and Red Flag Screen",
    "14. Exercise Library",
    "15. Imaging Recommendations",
    "16. Return to Sport / Return to Work Criteria",
    "17. Outcome Measures (ODI, NPRS, STarT Back, FABQ)",
    "18. Clinical Reasoning Pathways",
    "19. Manual Therapy Techniques",
    "20. Differential Diagnosis by Presentation",
    "21. Lumbosacral Junction Reference",
    "22. Patient Education Topics",
    "23. Supplementary Clinical Reference (Modic, Pfirrmann, McKenzie)",
    "24. Evidence and Guidelines",
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
        title="Kinora Lumbar Spine AI Orientation Part 5",
        author="Kinora AI Training",
    )
    styles = build_styles()
    story: list = []

    story.append(Spacer(1, 1.2 * inch))
    story.append(Paragraph("Kinora Lumbar Spine", styles["title"]))
    story.append(Paragraph("Clinical AI Orientation (Part 5)", styles["title"]))
    story.append(Spacer(1, 0.3 * inch))
    story.append(Paragraph(
        "Structured reference for RAG / AI-assisted physiotherapy consultation",
        styles["subtitle"],
    ))
    story.append(Spacer(1, 0.2 * inch))
    story.append(Paragraph(
        "Lumbar Anatomy, Biomechanics, Pathology, Red Flags &amp; Rehabilitation",
        styles["subtitle"],
    ))
    story.append(Spacer(1, 0.5 * inch))
    story.append(Paragraph("Version 1.0 — Kinora Admin Conocimientos Upload", styles["subtitle"]))
    story.append(PageBreak())

    add_section(story, styles, "Disclaimer")
    story.append(Paragraph(
        "This document is an educational orientation resource for Kinora AI clinical consultation support. "
        "It is NOT a substitute for professional clinical judgment, direct patient examination, or licensed "
        "medical/physiotherapy care. Content reflects established musculoskeletal medicine concepts from "
        "standard anatomical texts (Gray's, Moore, Netter, Bogduk), orthopedic assessment references (Magee), "
        "and clinical guidelines (NICE NG59, APTA Low Back Pain CPG) but must be verified against current "
        "peer-reviewed literature, local protocols, and individual patient presentation. "
        "<b>CAUDA EQUINA SYNDROME and all red flags require URGENT emergency medical/surgical referral — "
        "do not delay imaging or specialist care for conservative trial.</b> "
        "Urinary retention, saddle anesthesia, bilateral leg weakness, or progressive neurological deficit "
        "are emergencies. Diagnostic sensitivity/specificity values are approximate and vary by study.",
        styles["disclaimer"],
    ))
    story.append(Spacer(1, 12))

    add_section(story, styles, "Table of Contents")
    for item in TOC_SECTIONS:
        story.append(Paragraph(f"• {esc(item)}", styles["toc"]))
    story.append(PageBreak())

    sections = [
        ("1. Lumbar Vertebrae (L1-L5)", VERTEBRAL_RECORDS),
        ("2. Intervertebral Discs", DISC_RECORDS),
        ("3. Facet Joints", FACET_RECORDS),
        ("4. Ligaments", LIGAMENT_RECORDS),
        ("5. Lumbar Muscles", MUSCLE_RECORDS),
        ("6. Lumbar Nerves", NERVE_RECORDS),
        ("7. Blood Supply", BLOOD_SUPPLY_RECORDS),
        ("8. Lumbar Fascia", FASCIA_RECORDS),
        ("9. Biomechanics", BIOMECHANICS_RECORDS),
    ]
    for title, records in sections:
        add_section(story, styles, title)
        story.append(Spacer(1, 6))
        for name, fields in records:
            add_record(story, styles, name, fields)
        story.append(PageBreak())

    add_section(story, styles, "10. Pathologies")
    for name, fields in PATHOLOGY_RECORDS:
        add_record(story, styles, name, fields)
    story.append(PageBreak())

    add_section(story, styles, "11. Rehabilitation Phases")
    for name, fields in REHAB_PHASES:
        add_record(story, styles, name, fields)
    story.append(PageBreak())

    add_section(story, styles, "12. Special Tests")
    for name, fields in SPECIAL_TEST_RECORDS:
        add_record(story, styles, name, fields)
    story.append(PageBreak())

    add_section(story, styles, "13. Clinical Examination Template and Red Flag Screen")
    add_record(story, styles, EXAM_TEMPLATE["Template Name"], EXAM_TEMPLATE)
    add_record(story, styles, RED_FLAG_SCREEN["Template Name"], RED_FLAG_SCREEN)
    story.append(PageBreak())

    add_section(story, styles, "14. Exercise Library")
    for name, fields in EXERCISE_LIBRARY:
        add_record(story, styles, name, fields)
    story.append(PageBreak())

    add_section(story, styles, "15. Imaging Recommendations")
    for name, fields in IMAGING_RECORDS:
        add_record(story, styles, name, fields)
    story.append(PageBreak())

    add_section(story, styles, "16. Return to Sport / Return to Work Criteria")
    for name, fields in RTS_RECORDS:
        add_record(story, styles, name, fields)
    story.append(PageBreak())

    add_section(story, styles, "17. Outcome Measures")
    for name, fields in OUTCOME_MEASURES:
        add_record(story, styles, name, fields)
    story.append(PageBreak())

    add_section(story, styles, "18. Clinical Reasoning Pathways")
    for name, fields in CLINICAL_PATHWAYS:
        add_record(story, styles, name, fields)
    story.append(PageBreak())

    add_section(story, styles, "19. Manual Therapy Techniques")
    for name, fields in MANUAL_THERAPY_RECORDS:
        add_record(story, styles, name, fields)
    story.append(PageBreak())

    add_section(story, styles, "20. Differential Diagnosis by Presentation")
    for name, fields in DIFFERENTIAL_RECORDS:
        add_record(story, styles, name, fields)
    story.append(PageBreak())

    add_section(story, styles, "21. Lumbosacral Junction Reference")
    for name, fields in LUMBOSACRAL_RECORDS:
        add_record(story, styles, name, fields)
    story.append(PageBreak())

    add_section(story, styles, "22. Patient Education Topics")
    for name, fields in PATIENT_EDUCATION_RECORDS:
        add_record(story, styles, name, fields)
    story.append(PageBreak())

    add_section(story, styles, "23. Supplementary Clinical Reference")
    for name, fields in SUPPLEMENTARY_CLINICAL_RECORDS:
        add_record(story, styles, name, fields)
    story.append(PageBreak())

    add_section(story, styles, "24. Evidence and Guidelines")
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
