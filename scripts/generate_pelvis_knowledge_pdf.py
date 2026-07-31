#!/usr/bin/env python3
"""
Generate Kinora Pelvis AI Orientation PDF (Part 6) for RAG/clinical training.
Output: knowledge/Kinora_Pelvis_AI_Orientation.pdf

Sources reflected (educational synthesis): Gray's/Standring, Moore, Netter, Bogduk,
Vleeming (form/force closure), Neumann kinesiology, Magee assessment, Laslett SI cluster,
ICS pelvic floor terminology, peer-reviewed EMG/hip stabilizer literature.
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
OUTPUT_PATH = PROJECT_ROOT / "knowledge" / "Kinora_Pelvis_AI_Orientation.pdf"


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
        "Kinora Pelvis AI Orientation Part 6 — Educational Use Only",
    )
    canvas.restoreState()


# ---------------------------------------------------------------------------
# 1. Pelvic bones
# ---------------------------------------------------------------------------

BONE_RECORDS: list[tuple[str, dict[str, Any]]] = [
    (
        "Ilium",
        {
            "ID": "PEL-BONE-01",
            "Bone": "Ilium (os ilium) — largest of the three innominate bones; forms superior pelvis",
            "Landmarks": (
                "Iliac crest (L4 often at highest point of crest); ASIS; AIIS; PSIS (dimples of Venus ~S2); "
                "PIIS; iliac fossa (iliacus origin); auricular surface (SI joint); iliac tuberosity; "
                "arcuate line (pelvic brim); greater sciatic notch (superior border); gluteal lines "
                "(posterior, anterior, inferior) for gluteus maximus/medius/minimus origins; "
                "acetabulum contribution (superior ~2/5)"
            ),
            "Articulations": (
                "Sacroiliac joint (auricular surface with sacrum); pubic symphysis via pubis (indirect); "
                "hip joint via acetabulum with ischium and pubis; L5 via iliolumbar ligament to iliac crest"
            ),
            "Muscle Attachments": (
                "Iliacus (iliac fossa); gluteus maximus (posterior gluteal line/iliac crest/sacrum); "
                "gluteus medius (between posterior and anterior gluteal lines); gluteus minimus "
                "(between anterior and inferior gluteal lines); tensor fasciae latae (ASIS/iliac crest); "
                "sartorius (ASIS); rectus femoris (AIIS and superior acetabular rim); "
                "obliquus externus/internus and transversus abdominis (iliac crest); "
                "erector spinae / multifidus via iliac crest and PSIS region; "
                "latissimus dorsi via thoracolumbar fascia to iliac crest"
            ),
            "Ligament Attachments": (
                "Anterior and posterior SI ligaments; interosseous SI ligament (iliac tuberosity); "
                "iliolumbar ligament (iliac crest near PSIS/L4-L5 TP); inguinal ligament (ASIS to pubic tubercle); "
                "sacrotuberous (indirect via PSIS/iliac contribution to ligament complex); "
                "hip capsule and labrum at acetabular margin"
            ),
            "Blood Supply": (
                "Iliolumbar artery (deep circumflex iliac / lumbar anastomosis); deep circumflex iliac artery; "
                "superior gluteal artery periosteal branches; nutrient vessels from internal iliac system"
            ),
            "Biomechanics": (
                "Primary load-transfer bone between spine and lower limb; iliac wings provide lever arms for "
                "abdominal and gluteal musculature; auricular surface transmits shear and compression at SI joint; "
                "pelvic ring continuity with pubis/ischium; ASIS-PSIS orientation used clinically for pelvic tilt assessment"
            ),
            "Clinical Importance": (
                "Iliac crest bone graft donor site; ASIS/AIIS avulsion in adolescent athletes (sartorius/rectus femoris); "
                "PSIS landmark for SI joint palpation; iliac wing fractures (lateral compression pelvic trauma); "
                "enthesopathy at gluteal origins; referral pain from SI joint and lumbar facets to iliac crest region"
            ),
            "Imaging": (
                "AP pelvis radiograph: iliac wings, SI joint margins, acetabulum; outlet/inlet views for ring integrity; "
                "CT for complex pelvic fracture mapping; MRI for bone marrow edema, enthesitis, SI inflammatory disease "
                "(ASAS criteria often use MRI of SI joints including iliac side)"
            ),
            "References": (
                "Standring S. Gray's Anatomy. Moore KL et al. Clinically Oriented Anatomy. "
                "Bogduk N. Clinical Anatomy of the Lumbar Spine and Sacrum. Netter FH. Atlas of Human Anatomy."
            ),
        },
    ),
    (
        "Ischium",
        {
            "ID": "PEL-BONE-02",
            "Bone": "Ischium (os ischii) — posteroinferior innominate bone; forms lower posterior pelvis",
            "Landmarks": (
                "Ischial tuberosity (sitting bone; hamstring and adductor magnus origin); ischial spine "
                "(sacrospinous ligament; coccygeus; pelvic diaphragm landmark; pudendal nerve wraps around); "
                "ischial ramus (joins inferior pubic ramus — ischiopubic ramus); lesser sciatic notch "
                "(between spine and tuberosity); acetabulum contribution (posteroinferior ~2/5); "
                "obturator foramen contribution"
            ),
            "Articulations": (
                "Hip joint via acetabulum; pubis at ischiopubic ramus (synostosis in adult); "
                "indirect SI/sacral linkage via sacrotuberous and sacrospinous ligaments"
            ),
            "Muscle Attachments": (
                "Semitendinosus, semimembranosus, biceps femoris long head, adductor magnus (hamstring portion) "
                "from ischial tuberosity; quadratus femoris (ischial tuberosity lateral); "
                "inferior gemellus (ischial tuberosity); superior gemellus (ischial spine); "
                "obturator internus tendon exits lesser sciatic foramen near ischium; "
                "coccygeus and levator ani attachments near ischial spine/tendinous arch region"
            ),
            "Ligament Attachments": (
                "Sacrotuberous ligament to ischial tuberosity; sacrospinous ligament to ischial spine; "
                "hip joint capsule posterior acetabulum; falciform process of sacrotuberous continuous with "
                "obturator fascia / pudendal canal (Alcock)"
            ),
            "Blood Supply": (
                "Inferior gluteal artery; internal pudendal artery; obturator artery branches; "
                "medial circumflex femoral artery anastomosis around hip"
            ),
            "Biomechanics": (
                "Ischial tuberosity is primary sitting load-bearing surface; lever for hip extensors (hamstrings); "
                "ischial spine divides greater/lesser sciatic notches — critical for neurovascular routing "
                "(sciatic nerve greater sciatic foramen; pudendal nerve lesser sciatic foramen); "
                "contributes to pelvic outlet and birth canal boundaries"
            ),
            "Clinical Importance": (
                "Ischial bursitis / weaver's bottom; proximal hamstring tendinopathy and avulsion; "
                "ischial tuberosity fractures; pudendal neuralgia related to Alcock's canal near ischial spine; "
                "sacrotuberous ligament pain referral; sitting tolerance assessment in pelvic pain"
            ),
            "Imaging": (
                "AP/lateral pelvis; dedicated hamstring origin MRI (ischial tuberosity edema, tendon tear); "
                "CT for pelvic ring and acetabular posterior column fractures involving ischium"
            ),
            "References": (
                "Standring S. Gray's Anatomy. Moore KL et al. Clinically Oriented Anatomy. "
                "Neumann DA. Kinesiology of the Musculoskeletal System. Magee DJ. Orthopedic Physical Assessment."
            ),
        },
    ),
    (
        "Pubis",
        {
            "ID": "PEL-BONE-03",
            "Bone": "Pubis (os pubis) — anteroinferior innominate bone; forms anterior pelvic ring",
            "Landmarks": (
                "Pubic body; superior pubic ramus; inferior pubic ramus; pubic tubercle "
                "(inguinal ligament insertion); pubic crest; pecten pubis / pectineal line "
                "(Cooper's ligament surgical landmark); obturator crest; "
                "symphyseal surface (fibrocartilaginous pubic symphysis); acetabulum contribution (anterior ~1/5)"
            ),
            "Articulations": (
                "Pubic symphysis (secondary cartilaginous joint with contralateral pubis); "
                "hip joint via acetabulum; ischium at ischiopubic ramus; "
                "indirect sacral linkage via pelvic ring and ligaments"
            ),
            "Muscle Attachments": (
                "Adductor longus, adductor brevis, adductor magnus (adductor portion), gracilis, pectineus "
                "from pubic body/rami; rectus abdominis and pyramidalis (pubic crest/symphysis); "
                "obliquus externus via inguinal ligament to pubic tubercle; "
                "levator ani (pubococcygeus / puborectalis) from posterior pubis / arcus tendineus; "
                "obturator externus near obturator foramen / pubic ramus"
            ),
            "Ligament Attachments": (
                "Superior and inferior (arcuate) pubic ligaments at symphysis; inguinal ligament "
                "(ASIS to pubic tubercle); lacunar and pectineal (Cooper) ligaments; "
                "hip capsule anterior acetabulum; anterior SI ligament complex transmits load through pelvic ring to pubis"
            ),
            "Blood Supply": (
                "Obturator artery; inferior epigastric artery anastomosis (corona mortis variant important surgically); "
                "internal pudendal contributions; medial circumflex femoral anastomosis"
            ),
            "Biomechanics": (
                "Anterior pelvic ring closes load path between hemipelves; pubic symphysis allows small motion "
                "(~1-2 mm shear/rotation under load; increases in pregnancy); "
                "adductor force couples act across pubis — relevant to athletic osteitis pubis / adductor-related groin pain"
            ),
            "Clinical Importance": (
                "Athletic pubalgia / osteitis pubis; adductor longus enthesopathy; pubic rami fractures "
                "(common osteoporotic pelvic fractures); diastasis of pubic symphysis (trauma, peripartum); "
                "inguinal hernia landmarks at pubic tubercle; corona mortis vascular variant in pelvic surgery"
            ),
            "Imaging": (
                "AP pelvis with symphysis centered; flamingo views for dynamic symphyseal instability (selected cases); "
                "MRI for osteitis pubis (bone marrow edema straddling symphysis), adductor enthesopathy; "
                "CT for rami fracture displacement and pelvic ring classification (APC/LC/VS)"
            ),
            "References": (
                "Standring S. Gray's Anatomy. Moore KL et al. Clinically Oriented Anatomy. "
                "Weir A et al. Doha agreement on groin pain in athletes. Br J Sports Med. "
                "Neumann DA. Kinesiology of the Musculoskeletal System."
            ),
        },
    ),
    (
        "Sacrum",
        {
            "ID": "PEL-BONE-04",
            "Bone": "Sacrum (os sacrum) — five fused sacral vertebrae (S1-S5); keystone of pelvic ring",
            "Landmarks": (
                "Sacral promontory (S1 anterior superior — pelvic brim / obstetric conjugate); "
                "alae (wings); sacral canal; anterior (pelvic) sacral foramina (ventral rami); "
                "posterior sacral foramina (dorsal rami); median sacral crest (fused SPs); "
                "intermediate and lateral sacral crests; sacral hiatus (S4-S5 failure of fusion — caudal epidural landmark); "
                "sacral cornua; auricular surfaces (SI joints); apex articulates with coccyx; "
                "S2 level approximates PSIS / center of SI joint"
            ),
            "Articulations": (
                "L5-S1 lumbosacral disc and facets (zygapophyseal); bilateral sacroiliac joints; "
                "sacrococcygeal joint; ligamentous continuity with ilium via SI, sacrotuberous, sacrospinous ligaments"
            ),
            "Muscle Attachments": (
                "Multifidus and erector spinae (posterior sacrum / median crest); gluteus maximus "
                "(posterior sacrum and sacrotuberous ligament); piriformis (anterior sacrum S2-S4 / sacral foramina margins); "
                "iliacus overlaps ala region; pelvic floor (coccygeus near sacrospinous / lower sacrum; "
                "levator ani to coccyx/lower sacrum via anococcygeal raphe)"
            ),
            "Ligament Attachments": (
                "Anterior SI ligaments; posterior SI ligaments (long and short); interosseous SI ligaments "
                "(strongest — iliac tuberosity to sacral tuberosity); sacrotuberous; sacrospinous; "
                "iliolumbar (to L4/L5 and iliac crest — stabilizes lumbosacral junction relative to pelvis); "
                "anterior and posterior sacrococcygeal ligaments; ligamentum flavum remnants in sacral canal"
            ),
            "Blood Supply": (
                "Lateral sacral arteries (from internal iliac); median sacral artery (from aorta bifurcation); "
                "iliolumbar artery contributions; anastomoses with superior/inferior gluteal arteries; "
                "venous drainage via sacral venous plexus to internal iliac (Batson communication clinically relevant)"
            ),
            "Biomechanics": (
                "Keystone wedged between ilia — transmits upper body load to pelvic ring and lower limbs; "
                "nutation (sacral base nods anteriorly / apex posteriorly) and counternutation are primary SI motions; "
                "self-bracing via form closure (shape) and force closure (ligaments/muscles) per Vleeming model; "
                "L5-S1 disc and facets share shear — high clinical load zone"
            ),
            "Clinical Importance": (
                "SI joint pain referral; sacral stress fractures (runners, military, postpartum, osteoporosis); "
                "sacralization of L5 / lumbarization of S1 transitional anomalies; "
                "caudal epidural via sacral hiatus; piriformis-related sciatic symptoms near greater sciatic foramen; "
                "metastatic disease common in sacrum — red-flag night pain"
            ),
            "Imaging": (
                "AP pelvis / Ferguson view for SI joints; CT for fracture and fusion anomalies; "
                "MRI gold standard for sacral stress fracture and inflammatory sacroiliitis; "
                "bone scan adjunct for occult stress injury"
            ),
            "References": (
                "Bogduk N. Clinical Anatomy of the Lumbar Spine and Sacrum. "
                "Vleeming A et al. The sacroiliac joint: an overview of its anatomy, function and potential clinical implications. "
                "J Anat. Standring S. Gray's Anatomy."
            ),
        },
    ),
    (
        "Coccyx",
        {
            "ID": "PEL-BONE-05",
            "Bone": "Coccyx (os coccygis) — usually 3-5 fused rudimentary vertebrae; terminal axial skeleton",
            "Landmarks": (
                "Base articulates with sacral apex; apex (terminal tip); coccygeal cornua "
                "(articulate with sacral cornua); rudimentary transverse processes; "
                "anterior concave pelvic surface; posterior convex surface"
            ),
            "Articulations": (
                "Sacrococcygeal joint (symphysis or synovial variant; fibrocartilage disc); "
                "occasionally intercoccygeal joints if segmentation persists"
            ),
            "Muscle Attachments": (
                "Coccygeus (ischiococcygeus) to coccyx/lower sacrum; levator ani via anococcygeal ligament/raphe "
                "(pubococcygeus, iliococcygeus); sphincter ani externus; gluteus maximus fibers; "
                "some sacrococcygeal ligament continuity with pelvic floor"
            ),
            "Ligament Attachments": (
                "Anterior, posterior, and lateral sacrococcygeal ligaments; anococcygeal ligament; "
                "intercornual ligaments; sacrotuberous ligament inferior fibers may blend near region"
            ),
            "Blood Supply": (
                "Median sacral artery; inferior gluteal and internal pudendal anastomoses; "
                "lateral sacral contributions"
            ),
            "Biomechanics": (
                "Small flexion/extension at sacrococcygeal joint during sitting and defecation; "
                "pelvic floor muscles dynamically tension coccyx; load-bearing in sitting shifts to ischial "
                "tuberosities with coccyx as posterior midline support — vulnerable to contusion/fracture on fall"
            ),
            "Clinical Importance": (
                "Coccydynia (post-traumatic, idiopathic, postpartum); hypermobile or rigid coccyx; "
                "referral pain from pelvic floor dysfunction; rare coccygeal tumors; "
                "dynamic sitting pain worse leaning back — classic clinical pattern"
            ),
            "Imaging": (
                "Lateral coccyx radiograph sitting vs standing (dynamic assessment of hypermobility); "
                "MRI for soft tissue, disc, and tumor exclusion; CT if fracture detail needed"
            ),
            "References": (
                "Standring S. Gray's Anatomy. Moore KL et al. Clinically Oriented Anatomy. "
                "Maigne JY et al. Causes and mechanisms of common coccydynia. Spine."
            ),
        },
    ),
]


# ---------------------------------------------------------------------------
# 2. SI joint
# ---------------------------------------------------------------------------

SI_JOINT_RECORDS: list[tuple[str, dict[str, Any]]] = [
    (
        "Sacroiliac Joint",
        {
            "ID": "PEL-SIJ-01",
            "Joint": "Sacroiliac joint (SIJ) — auricular surfaces of sacrum and ilium; paired left/right",
            "Type": (
                "Atypical synovial joint (diarthrosis) anteriorly with fibrocartilage/hyaline cartilage; "
                "extensive fibrous/syndesmotic component posteriorly via interosseous ligament; "
                "not a simple planar joint — reciprocal interlocking elevations/depressions increase congruence"
            ),
            "Capsule": (
                "Thin anterior capsule continuous with anterior SI ligament; posterior capsule poorly developed — "
                "stabilization dominated by dense interosseous and posterior SI ligaments; "
                "synovial lining anteriorly; age-related ankylosis/fibrosis common"
            ),
            "Ligaments": (
                "Anterior (ventral) SI ligament; interosseous SI ligament (strongest intrinsic stabilizer); "
                "short and long posterior (dorsal) SI ligaments; accessory pelvic stabilizers: "
                "sacrotuberous, sacrospinous, iliolumbar — contribute to pelvic ring and nutation control"
            ),
            "Innervation": (
                "Posterior SI joint predominantly dorsal rami of L5-S4 (esp. L5-S2 lateral branches) — "
                "variable; anterior SI joint from ventral rami L4-S2 and superior gluteal nerve contributions "
                "(anatomic studies vary). Clinical implication: pain referral broad (buttock, posterior thigh, "
                "groin, lumbar) — not a single dermatome"
            ),
            "Blood Supply": (
                "Branches of iliolumbar, lateral sacral, and superior gluteal arteries; "
                "venous drainage to internal iliac / sacral plexuses"
            ),
            "Motion": (
                "Small amplitude: typically ~1-4 deg rotation and ~1-3 mm translation under physiologic load "
                "(values vary by measurement method). Primary osteokinematics described as nutation "
                "(sacral promontory anterior-inferior; iliac bones approximate posteriorly) and counternutation "
                "(opposite). Motion decreases with age and may increase temporarily in pregnancy"
            ),
            "Stability": (
                "Depends on both form closure (bony congruence, wedge shape, ridges) and force closure "
                "(ligament tension + muscle co-contraction). Gravity and body weight compress SIJ in standing; "
                "shear forces rise with single-leg stance and asymmetric loading"
            ),
            "Force Closure": (
                "Dynamic compression generated by muscles and fascia crossing the SIJ or increasing ligament tension: "
                "gluteus maximus, latissimus dorsi (via thoracolumbar fascia — posterior oblique sling), "
                "biceps femoris / sacrotuberous, erector spinae, multifidus, transversus abdominis / "
                "internal oblique (via deep lamina of thoracolumbar fascia), pelvic floor, "
                "piriformis and deep external rotators. Force closure can compensate when form closure is suboptimal"
            ),
            "Form Closure": (
                "Passive stability from shape and ligamentous integrity: wedge-shaped sacrum, "
                "interlocking articular ridges, interosseous ligament, posterior SI ligaments. "
                "Optimal in upright loading; reduced if ligamentous laxity (pregnancy, trauma) or "
                "articular incongruence after injury"
            ),
            "Special Tests": (
                "Laslett cluster (pain provocation): distraction, compression, thigh thrust (posterior shear), "
                "Gaenslen, sacral thrust — ≥3/5 positive raises SIJ pain likelihood when lumbar disc/radicular "
                "sources screened. Also: FABER (Patrick) as provocation (non-specific); "
                "active straight leg raise (ASLR) for load-transfer / force-closure impairment; "
                "palpation of long dorsal SI ligament and PSIS region. No single test is definitive — use cluster + clinical reasoning"
            ),
            "Pain Referral": (
                "Most common: unilateral buttock caudal to PSIS; may refer to posterior thigh (rarely below knee "
                "as sole source), groin, lower lumbar. Fortin finger test: patient points within 1 cm of PSIS. "
                "Must differentiate lumbar discogenic/facet, hip OA, greater trochanteric pain, "
                "piriformis/deep gluteal, pelvic floor, and cluneal nerve entrapment"
            ),
            "Pathologies": (
                "Mechanical SIJ dysfunction / sprain; pregnancy-related pelvic girdle pain (PGP); "
                "inflammatory sacroiliitis (axial SpA / AS — MRI bone marrow edema); "
                "post-traumatic SIJ instability; degenerative SI arthropathy; "
                "infection (rare — IVDU, immunocompromise); sacral fracture involving SI articulation"
            ),
            "Treatment": (
                "Education and graded loading; belting for selected pregnancy PGP; motor control of "
                "force-closure muscles (glute max, TA/multifidus, pelvic floor); avoid prolonged "
                "asymmetrical postures; manual therapy as adjunct (evidence mixed — short-term pain relief possible); "
                "pharmacologic/medical management for inflammatory disease; "
                "image-guided SI injection diagnostic/therapeutic in refractory cases; "
                "fusion rare and reserved for carefully selected chronic instability"
            ),
            "Exercises": (
                "Gluteus maximus bridges / hip thrusts; clam shells and sidelying hip abduction (glute med); "
                "bird-dog; ASLR with pelvic compression cueing; transversus abdominis / multifidus co-contraction; "
                "pelvic floor coordination with breath; posterior oblique sling rows with contralateral glute set; "
                "progressive single-leg stance and step-downs when load transfer improves"
            ),
            "References": (
                "Vleeming A et al. J Anat (SIJ overview). Laslett M et al. Man Ther (SI provocation cluster). "
                "European guidelines on pelvic girdle pain (Vleeming et al.). Bogduk N. Clinical Anatomy of Lumbar Spine and Sacrum. "
                "Nejati P et al. / APTA pelvic girdle pain evidence summaries."
            ),
        },
    ),
]


# ---------------------------------------------------------------------------
# 3. Pelvic ligaments
# ---------------------------------------------------------------------------

LIGAMENT_RECORDS: list[tuple[str, dict[str, Any]]] = [
    (
        "Sacrotuberous Ligament",
        {
            "ID": "PEL-LIG-01",
            "Ligament": "Sacrotuberous ligament",
            "Origin": (
                "Posterior superior iliac spine region, lateral sacrum (S3-S5), and coccyx — broad fan-shaped origin"
            ),
            "Insertion": (
                "Medial ischial tuberosity; falciform process continues along ischial ramus toward "
                "obturator fascia / pudendal canal"
            ),
            "Function": (
                "Resists sacral nutation; stabilizes sacrum against anterior rotation of base; "
                "forms boundary of greater and lesser sciatic foramina with sacrospinous; "
                "links hamstrings (biceps femoris) and gluteus maximus into pelvic force closure"
            ),
            "Biomechanics": (
                "Increases tension with nutation; biceps femoris proximal fibers often continuous with "
                "sacrotuberous — kinetic chain from lower limb to sacrum; "
                "gluteus maximus also blends — posterior oblique sling contributor"
            ),
            "Healing": (
                "Dense connective tissue — slow remodeling (months); responds to progressive loading "
                "and addressing kinetic-chain drivers (hamstring load, sitting compression); "
                "chronic enthesopathy possible at ischial insertion"
            ),
            "Clinical Tests": (
                "Palpation tenderness along ligament from sacrum to ischial tuberosity; "
                "pain with nutation-biased loading; differentiate from proximal hamstring tendinopathy "
                "(often coexist); sacral thrust / thigh thrust may provoke if SI-related"
            ),
            "Rehabilitation": (
                "Load management for sitting and sprinting/hamstring sports; glute max strengthening; "
                "graded hamstring loading; pelvic floor and deep external rotator coordination; "
                "avoid aggressive end-range stretching into painful nutation early"
            ),
            "References": (
                "Vleeming A et al. The sacrotuberous ligament: a conceptual approach... "
                "Standring S. Gray's Anatomy. Neumann DA. Kinesiology of the Musculoskeletal System."
            ),
        },
    ),
    (
        "Sacrospinous Ligament",
        {
            "ID": "PEL-LIG-02",
            "Ligament": "Sacrospinous ligament",
            "Origin": (
                "Lateral margin of lower sacrum and coccyx"
            ),
            "Insertion": (
                "Ischial spine"
            ),
            "Function": (
                "Resists nutation; separates greater sciatic foramen (above) from lesser sciatic foramen (below); "
                "provides attachment/continuity with coccygeus muscle (often considered musculoligamentous unit)"
            ),
            "Biomechanics": (
                "Works with sacrotuberous to control sacral rotation; shorter/deeper than sacrotuberous; "
                "surgical landmark in sacrospinous fixation for pelvic organ prolapse"
            ),
            "Healing": (
                "Ligamentous remodeling slow; post-surgical scarring after sacrospinous fixation may alter "
                "pelvic floor mechanics and pudendal nerve proximity"
            ),
            "Clinical Tests": (
                "Deep pelvic palpation (vaginal/rectal) of ischial spine region by trained pelvic health clinician; "
                "differentiate pudendal neuralgia (Alcock's canal) — nerve exits lesser sciatic foramen "
                "around sacrospinous/sacrotuberous complex"
            ),
            "Rehabilitation": (
                "Pelvic floor down-training or strengthening per assessment; address SI force closure; "
                "nerve gliding / pudendal-safe loading strategies when neural irritation present; "
                "coordinate with pelvic health specialist for internal findings"
            ),
            "References": (
                "Standring S. Gray's Anatomy. Moore KL et al. Clinically Oriented Anatomy. "
                "Vleeming A et al. J Anat SIJ overview."
            ),
        },
    ),
    (
        "Anterior SI Ligament",
        {
            "ID": "PEL-LIG-03",
            "Ligament": "Anterior (ventral) sacroiliac ligament",
            "Origin": (
                "Anterior surface of sacral ala and anterolateral sacrum"
            ),
            "Insertion": (
                "Medial iliac fossa / anterior margin of auricular ilium; blends with anterior joint capsule"
            ),
            "Function": (
                "Thickening of anterior capsule; resists distraction and counternutation components; "
                "weaker than posterior/interosseous complex — anterior SIJ relatively less ligamentously reinforced"
            ),
            "Biomechanics": (
                "First structure stressed in anterior pelvic ring disruption patterns; "
                "contributes to capsule integrity for synovial portion of SIJ"
            ),
            "Healing": (
                "Capsuloligamentous healing 6-12+ weeks depending on grade of sprain; "
                "pregnancy-related laxity mediated partly by relaxin — typically improves postpartum "
                "but may persist in pelvic girdle pain"
            ),
            "Clinical Tests": (
                "SI distraction (gapping) test stresses anterior ligaments — part of Laslett cluster; "
                "positive reproduction of familiar pain supports SI pain contribution (not structure-specific proof)"
            ),
            "Rehabilitation": (
                "Force-closure training; pelvic belt in selected pregnancy PGP; graded return to impact; "
                "avoid early aggressive end-range rotation/shear if acute sprain"
            ),
            "References": (
                "Bogduk N. Clinical Anatomy of the Lumbar Spine and Sacrum. "
                "Laslett M et al. Man Ther. Vleeming A et al. European guidelines on PGP."
            ),
        },
    ),
    (
        "Posterior SI Ligament",
        {
            "ID": "PEL-LIG-04",
            "Ligament": "Posterior (dorsal) sacroiliac ligaments — short and long dorsal SI ligaments",
            "Origin": (
                "Short posterior SI: intermediate/lateral sacral crests and sacral tuberosity region. "
                "Long posterior (long dorsal) SI: lateral sacral crest (approx. S3-S4) spanning toward PSIS"
            ),
            "Insertion": (
                "Short: iliac tuberosity / posterior ilium. Long dorsal: PSIS region of ilium"
            ),
            "Function": (
                "Resist counternutation (especially long dorsal SI ligament — taut in counternutation); "
                "posterior reinforcement of SIJ; long dorsal SI ligament clinically palpable pain generator"
            ),
            "Biomechanics": (
                "Reciprocal tension pattern with sacrotuberous: long dorsal SI taut in counternutation; "
                "sacrotuberous taut in nutation (Vleeming). Useful clinically when interpreting positional pain patterns"
            ),
            "Healing": (
                "Posterior ligament enthesopathy may chronify with sustained counternutation postures "
                "(e.g., prolonged posterior pelvic tilt sitting) — address posture and load transfer"
            ),
            "Clinical Tests": (
                "Palpation of long dorsal SI ligament just inferior/medial to PSIS — common tender point "
                "in SI-related pain; counternutation-biased positions may aggravate"
            ),
            "Rehabilitation": (
                "Motor control of multifidus/erector and glute max; avoid sustained end-range postures; "
                "progressive loading; manual soft-tissue techniques as adjunct if indicated"
            ),
            "References": (
                "Vleeming A et al. The function of the long dorsal sacroiliac ligament... "
                "Bogduk N. Clinical Anatomy of the Lumbar Spine and Sacrum."
            ),
        },
    ),
    (
        "Interosseous SI Ligament",
        {
            "ID": "PEL-LIG-05",
            "Ligament": "Interosseous sacroiliac ligament",
            "Origin": (
                "Sacral tuberosity (dorsal sacrum deep to posterior ligaments)"
            ),
            "Insertion": (
                "Iliac tuberosity — fills the space posterior to auricular surfaces"
            ),
            "Function": (
                "Strongest bond between sacrum and ilium; primary passive stabilizer (form-closure core); "
                "resists separation and shear of SIJ"
            ),
            "Biomechanics": (
                "Lies deep to short posterior SI ligaments; major contributor to extracapsular stability; "
                "damage in high-energy pelvic trauma associated with SI instability"
            ),
            "Healing": (
                "High-grade traumatic disruption may require surgical stabilization (ORIF / SI screws) "
                "per trauma protocols; low-grade strains managed conservatively with force-closure rehab"
            ),
            "Clinical Tests": (
                "No isolated clinical test; instability inferred from trauma mechanism, imaging (CT), "
                "and load-transfer tests (ASLR) combined with provocation cluster for pain"
            ),
            "Rehabilitation": (
                "After medical clearance: progressive force-closure, gait restoration, "
                "avoidance of asymmetric high-load early; trauma cases follow surgical weight-bearing orders"
            ),
            "References": (
                "Bogduk N. Clinical Anatomy of the Lumbar Spine and Sacrum. "
                "Standring S. Gray's Anatomy. Tile pelvic fracture classification literature."
            ),
        },
    ),
    (
        "Iliolumbar Ligament",
        {
            "ID": "PEL-LIG-06",
            "Ligament": "Iliolumbar ligament",
            "Origin": (
                "Tips of L4 and especially L5 transverse processes (strongest from L5); "
                "may have anterior and posterior bands"
            ),
            "Insertion": (
                "Iliac crest (inner lip) near PSIS region; some fibers to sacral ala / SI region (variable descriptions)"
            ),
            "Function": (
                "Stabilizes L5 on sacrum/ilium; resists anterior shear of L5; restrains lateral flexion and "
                "rotation at lumbosacral junction; functionally links lumbar spine to pelvis"
            ),
            "Biomechanics": (
                "Critical at lumbosacral junction where shear forces are high; "
                "iliolumbar ligament development completes in adulthood (more muscular/fibrous earlier in life — "
                "developmental anatomy relevant to adolescent spondylolysis context)"
            ),
            "Healing": (
                "Sprain may present as unilateral lumbosacral/iliac crest pain; remodeling with graded "
                "stabilization of multifidus, QL, and hip girdle musculature"
            ),
            "Clinical Tests": (
                "Palpation at L5 TP to iliac crest band; pain with lumbar side-bending/rotation; "
                "differentiate L5-S1 disc, facet, and SI sources — often overlapping"
            ),
            "Rehabilitation": (
                "Lumbopelvic neutral training; multifidus and glute strengthening; hip flexor length if "
                "anterior shear drivers present; graded extension/rotation control for athletes"
            ),
            "References": (
                "Bogduk N. Clinical Anatomy of the Lumbar Spine and Sacrum. "
                "Pool-Goudzwaard A et al. The iliolumbar ligament... Man Ther / Clin Biomech literature. "
                "Standring S. Gray's Anatomy."
            ),
        },
    ),
]


# ---------------------------------------------------------------------------
# 4. Pelvic floor muscles
# ---------------------------------------------------------------------------

PELVIC_FLOOR_RECORDS: list[tuple[str, dict[str, Any]]] = [
    (
        "Pubococcygeus",
        {
            "ID": "PEL-PF-01",
            "Muscle": "Pubococcygeus (part of levator ani)",
            "Origin": (
                "Posterior surface of pubis and anterior portion of arcus tendineus levator ani (ATLA)"
            ),
            "Insertion": (
                "Anococcygeal raphe / ligament and coccyx; fibers cradle urethra, vagina (female), "
                "and prostate region (male) — forms muscular sling"
            ),
            "Innervation": (
                "Nerve to levator ani (S3-S5); direct pudendal contributions variable; "
                "ICS notes dual innervation concepts — clinical variability"
            ),
            "Blood Supply": (
                "Inferior gluteal artery; internal pudendal artery; inferior vesical / vaginal arterial branches"
            ),
            "Function": (
                "Elevates pelvic floor; supports pelvic organs; contributes to urethral closure pressure; "
                "part of levator hiatus borders; assists anorectal angle maintenance with puborectalis"
            ),
            "Continence": (
                "Supports urethral and vaginal/prostatic continence mechanisms via lift and compression "
                "against pubic bone; weakness associated with stress urinary incontinence; "
                "overactivity may contribute to voiding dysfunction / pelvic pain"
            ),
            "Breathing": (
                "Eccentric lengthens slightly on inspiration as diaphragm descends; concentric lift on "
                "expiration / effort — should coordinate, not chronically brace or bear down (Valsalva)"
            ),
            "Core Stability": (
                "Works with diaphragm, transversus abdominis, and multifidus as canister system; "
                "anticipatory activation with limb load in healthy patterns"
            ),
            "Assessment": (
                "External observation of perineal lift; digital pelvic floor muscle exam by trained clinician "
                "(Oxford/Modified Oxford, endurance, coordination, tenderness); "
                "real-time ultrasound (transabdominal/transperineal); exclude red flags (cauda equina, infection)"
            ),
            "Exercises": (
                "Correct pelvic floor muscle training (PFMT): lift-and-squeeze without breath-holding; "
                "endurance holds and quick flicks; functional integration with sit-to-stand and lifts; "
                "down-training / reverse Kegels and diaphragmatic breathing if hypertonic"
            ),
            "Clinical Conditions": (
                "Stress urinary incontinence; pelvic organ prolapse support role; postpartum dysfunction; "
                "chronic pelvic pain with trigger points; sexual dysfunction (dyspareunia) when overactive"
            ),
            "References": (
                "ICS terminology reports. Bo K et al. Evidence-based physical therapy for the pelvic floor. "
                "Standring S. Gray's Anatomy. Messelink B et al. Standardization of pelvic floor muscle function."
            ),
        },
    ),
    (
        "Iliococcygeus",
        {
            "ID": "PEL-PF-02",
            "Muscle": "Iliococcygeus (part of levator ani)",
            "Origin": (
                "Arcus tendineus levator ani (from pubis to ischial spine) and ischial spine region"
            ),
            "Insertion": (
                "Anococcygeal raphe and coccyx — forms a relatively flat diaphragmatic sheet"
            ),
            "Innervation": (
                "Nerve to levator ani (S3-S5); pudendal contributions variable"
            ),
            "Blood Supply": (
                "Inferior gluteal; internal pudendal; lateral sacral anastomoses"
            ),
            "Function": (
                "Primary sheet-like support of pelvic viscera; elevates pelvic floor; "
                "closes posterior levator plate; assists shelf supporting rectum"
            ),
            "Continence": (
                "Indirect continence support via organ position and levator plate integrity; "
                "less direct urethral sphincter role than puborectalis/pubococcygeus"
            ),
            "Breathing": (
                "Moves with respiratory cycle as part of pelvic diaphragm; "
                "dyscoordination with chronic apnea/bracing common in pelvic pain"
            ),
            "Core Stability": (
                "Maintains pelvic diaphragm tension for intra-abdominal pressure modulation "
                "during lifting and sport"
            ),
            "Assessment": (
                "As part of levator ani assessment — tone, bulk, symmetry, pain to palpation; "
                "prolapse staging (POP-Q) by qualified clinician when indicated"
            ),
            "Exercises": (
                "PFMT focusing on full elevator lift (not merely sphincter squeeze); "
                "functional bracing without bearing down; graded loading for postpartum return to sport"
            ),
            "Clinical Conditions": (
                "Levator plate descent; pelvic organ prolapse association; levator avulsion "
                "(especially puborectalis/pubococcygeus more than iliococcygeus) after traumatic birth — "
                "MRI/ultrasound diagnosis"
            ),
            "References": (
                "Standring S. Gray's Anatomy. Dietz HP. Pelvic floor ultrasound. "
                "Bo K et al. Evidence-based physical therapy for the pelvic floor."
            ),
        },
    ),
    (
        "Puborectalis",
        {
            "ID": "PEL-PF-03",
            "Muscle": "Puborectalis (part of levator ani; U-shaped sling)",
            "Origin": (
                "Bilateral posterior pubis — forms a sling without inserting mid-coccyx like other levator parts"
            ),
            "Insertion": (
                "Loops behind anorectal junction joining contralateral fibers — no direct coccyx insertion "
                "(sling configuration)"
            ),
            "Innervation": (
                "Nerve to levator ani (S3-S5); close relationship with external anal sphincter innervation "
                "(pudendal — inferior rectal)"
            ),
            "Blood Supply": (
                "Inferior rectal (from internal pudendal); inferior gluteal contributions"
            ),
            "Function": (
                "Maintains anorectal angle (~80-100 deg at rest) critical for fecal continence; "
                "relaxes appropriately during defecation; contributes to levator hiatus closure"
            ),
            "Continence": (
                "Key to fecal continence via anorectal angle and canal compression; "
                "paradoxical contraction (anismus / dyssynergic defecation) causes outlet obstruction constipation"
            ),
            "Breathing": (
                "Should relax with lengthening during defecation mechanics (hips flexed, gentle bulge); "
                "inappropriate breath-hold and lift worsen obstructed defecation"
            ),
            "Core Stability": (
                "Participates in pelvic canister; overactivity may coexist with lumbar bracing patterns"
            ),
            "Assessment": (
                "Digital rectal exam for puborectalis tone, tenderness, paradoxical contraction; "
                "balloon expulsion / anorectal manometry in specialty settings; "
                "surface EMG biofeedback for dyssynergia"
            ),
            "Exercises": (
                "For weakness/incontinence: coordinated PFMT. For dyssynergia: "
                "down-training, toileting posture (feet support, forward lean), biofeedback-assisted relaxation, "
                "avoid chronic straining"
            ),
            "Clinical Conditions": (
                "Fecal incontinence; dyssynergic defecation; levator ani syndrome / puborectalis spasm pain; "
                "postpartum injury"
            ),
            "References": (
                "ICS / IUGA terminology. Rao SSC. Dyssynergic defecation. "
                "Bo K et al. Evidence-based physical therapy for the pelvic floor. Standring S. Gray's Anatomy."
            ),
        },
    ),
    (
        "Coccygeus (Ischiococcygeus)",
        {
            "ID": "PEL-PF-04",
            "Muscle": "Coccygeus (ischiococcygeus) — posterior pelvic floor; musculoligamentous with sacrospinous",
            "Origin": (
                "Ischial spine and sacrospinous ligament"
            ),
            "Insertion": (
                "Lateral borders of inferior sacrum and coccyx"
            ),
            "Innervation": (
                "Ventral rami S4-S5 (nerve to coccygeus / levator complex)"
            ),
            "Blood Supply": (
                "Inferior gluteal artery; internal pudendal branches"
            ),
            "Function": (
                "Supports pelvic viscera posteriorly; flexes coccyx; reinforces sacrospinous ligament; "
                "closes posterior pelvic outlet"
            ),
            "Continence": (
                "Indirect support role; less primary continence muscle than puborectalis/urethral sphincters"
            ),
            "Breathing": (
                "Part of posterior pelvic diaphragm respiratory coordination"
            ),
            "Core Stability": (
                "Stabilizes sacrococcygeal region during load transfer; tension relates to coccydynia patterns"
            ),
            "Assessment": (
                "Internal palpation near ischial spine/sacrospinous (trained clinician); "
                "coccyx mobility testing; sitting pain maps"
            ),
            "Exercises": (
                "Pelvic floor coordination; gentle coccyx mobility as indicated; "
                "glute max and deep rotator training for posterior pelvic support; "
                "sitting load management (wedge cushion) for coccydynia"
            ),
            "Clinical Conditions": (
                "Coccydynia; pelvic floor myalgia; postpartum pelvic pain; "
                "relationship to pudendal nerve proximity at sacrospinous complex"
            ),
            "References": (
                "Standring S. Gray's Anatomy. Moore KL et al. Clinically Oriented Anatomy. "
                "Maigne JY coccydynia literature."
            ),
        },
    ),
    (
        "Pelvic Floor Complex (Integrated)",
        {
            "ID": "PEL-PF-05",
            "Muscle": (
                "Pelvic floor complex — levator ani (pubococcygeus, iliococcygeus, puborectalis), "
                "coccygeus, and related sphincters/perineal muscles functioning as a unit"
            ),
            "Origin": (
                "Pubic rami, ATLA, ischial spines — forming a dynamic hammock/diaphragm across pelvic outlet"
            ),
            "Insertion": (
                "Coccyx, anococcygeal raphe, perineal body, and visceral sphincteric integrations"
            ),
            "Innervation": (
                "S3-S5 nerve to levator ani; pudendal nerve (S2-S4) to sphincters and perineum — "
                "dual system clinically important"
            ),
            "Blood Supply": (
                "Internal pudendal artery (primary perineal/sphincter); inferior gluteal; "
                "inferior vesical/vaginal; middle rectal anastomoses"
            ),
            "Function": (
                "Organ support; continence; sexual function; intra-abdominal pressure modulation; "
                "lumbopelvic stability contribution; childbirth accommodation (female)"
            ),
            "Continence": (
                "Urinary and fecal continence via sphincteric and supportive mechanisms; "
                "PFMT first-line for many stress incontinence presentations (NICE/ICS-aligned evidence)"
            ),
            "Breathing": (
                "Optimal: 360-deg diaphragmatic breath with gentle pelvic floor mobility; "
                "pathologic patterns: chronic hold, breath-holding with lifts, or bearing-down with effort"
            ),
            "Core Stability": (
                "Canister model: diaphragm + TA + multifidus + pelvic floor; "
                "SI force closure contributor; assess before aggressive core bracing prescription"
            ),
            "Assessment": (
                "Screen: continence, prolapse symptoms, pain, sexual function, bowel habits; "
                "red flags: progressive neuro deficit, cauda equina signs, unexplained bleeding, fever; "
                "refer to pelvic health PT for internal exam when indicated"
            ),
            "Exercises": (
                "Individualized: strengthen underactive; relax overactive; coordinate with breath and function; "
                "sport-specific graded return; avoid one-size-fits-all Kegel prescription"
            ),
            "Clinical Conditions": (
                "SUI/UUI; POP; chronic pelvic pain; vaginismus/genito-pelvic pain; "
                "post-prostatectomy incontinence; pregnancy-related PGP with PF involvement"
            ),
            "References": (
                "NICE guidance on urinary incontinence / pelvic floor. ICS standards. "
                "Bo K et al. Evidence-based physical therapy for the pelvic floor. "
                "Vleeming A et al. European guidelines on pelvic girdle pain."
            ),
        },
    ),
]


# ---------------------------------------------------------------------------
# 5. Hip stabilizers
# ---------------------------------------------------------------------------

HIP_STABILIZER_RECORDS: list[tuple[str, dict[str, Any]]] = [
    (
        "Gluteus Medius",
        {
            "ID": "PEL-HS-01",
            "Muscle": "Gluteus medius",
            "Role": (
                "Primary frontal-plane hip stabilizer; pelvic leveler in single-leg stance; "
                "abductor and (fiber-dependent) internal/external rotator"
            ),
            "EMG": (
                "High EMG in single-leg stance, sidelying hip abduction, pelvic drop control, "
                "and weight-bearing hip hikes; anterior fibers active with flexion/IR components; "
                "posterior fibers with extension/ER. Clamshells produce moderate EMG — useful early but "
                "often less than sidelying abduction / single-leg squat progressions for functional demand"
            ),
            "Function": (
                "Origin between posterior and anterior gluteal lines of ilium to greater trochanter; "
                "prevents contralateral pelvic drop (Trendelenburg mechanics); "
                "controls femoral adduction/IR in landing and running"
            ),
            "Clinical Importance": (
                "Weakness linked to Trendelenburg gait, greater trochanteric pain syndrome (GTPS) overload patterns, "
                "patellofemoral pain, and ITB-related syndromes via kinetic chain; "
                "tendinopathy at trochanteric insertion common in middle-aged runners and postpartum"
            ),
            "Exercises": (
                "Sidelying hip abduction (neutral pelvis); standing hip hitch / pelvic hike; "
                "single-leg stance endurance; banded side-stepping (careful with form); "
                "single-leg squat / step-down with pelvic control; hip thrusts with abduction bias"
            ),
            "Progressions": (
                "Non-weight-bearing isometrics → sidelying isotonic → bilateral stance → "
                "single-leg stance → dynamic step-downs → running-specific drills / lateral bounds"
            ),
            "Evidence": (
                "Gluteus medius strengthening widely supported in GTPS and PFP rehab protocols; "
                "EMG studies (e.g., Distefano, Selkowitz, etc.) guide exercise selection — "
                "prefer exercises matching functional demands over isolated low-load only"
            ),
            "References": (
                "Neumann DA. Kinesiology of the Musculoskeletal System. "
                "Grimaldi A et al. Gluteal tendinopathy literature. "
                "Distefano LJ et al. Gluteal EMG exercise ranking. J Orthop Sports Phys Ther."
            ),
        },
    ),
    (
        "Gluteus Minimus",
        {
            "ID": "PEL-HS-02",
            "Muscle": "Gluteus minimus",
            "Role": (
                "Deep abductor and primary internal rotator of hip in many positions; "
                "femoral head stabilizer into acetabulum"
            ),
            "EMG": (
                "Co-activates with gluteus medius in abduction and single-leg tasks; "
                "anterior fibers contribute strongly to IR; often under-differentiated clinically from medius"
            ),
            "Function": (
                "Origin between anterior and inferior gluteal lines to anterior greater trochanter; "
                "compresses femoral head; assists abduction; important for intracapsular stability"
            ),
            "Clinical Importance": (
                "Involved in GTPS continuum; tears/tendinopathy may accompany medius disease; "
                "weakness contributes to dynamic valgus; anterior fiber dysfunction affects IR control"
            ),
            "Exercises": (
                "Similar closed-chain pelvic control as medius; hip IR control drills in flexion as indicated; "
                "sidelying abduction with slight hip IR bias for anterior fibers (clinician-tailored); "
                "single-leg stance with trunk/pelvis alignment cues"
            ),
            "Progressions": (
                "Isometric abduction/IR → controlled isotonic → single-leg functional tasks → "
                "deceleration and cutting drills"
            ),
            "Evidence": (
                "Anatomic and EMG literature supports minimus as key femoral head stabilizer; "
                "imaging studies show concomitant minimus pathology in many GTPS cases"
            ),
            "References": (
                "Neumann DA. Kinesiology. Standring S. Gray's Anatomy. "
                "Grimaldi A / Semciw AI gluteal anatomy and tendinopathy reviews."
            ),
        },
    ),
    (
        "Piriformis",
        {
            "ID": "PEL-HS-03",
            "Muscle": "Piriformis",
            "Role": (
                "Deep hip external rotator (hip extended); abducts flexed hip; "
                "sacral stabilizer contributing to SI force closure; sciatic nerve relationship clinically critical"
            ),
            "EMG": (
                "Active in ER and in stabilization during gait; elevated activity reported in some "
                "lumbopelvic pain cohorts — interpret cautiously (guarding vs primary driver)"
            ),
            "Function": (
                "Origin anterior sacrum (S2-S4) / sacrotuberous margin through greater sciatic foramen "
                "to superior greater trochanter; forms landmark dividing superior/inferior gluteal neurovascular bundles"
            ),
            "Clinical Importance": (
                "Piriformis syndrome / deep gluteal syndrome continuum — sciatic nerve entrapment or irritation "
                "(anatomic variants: tibial/peroneal split around/through muscle ~10-20% depending on series); "
                "overactivity vs weakness must be differentiated; SI and lumbar referral often mimic"
            ),
            "Exercises": (
                "If weak/inhibited: prone/side-lying ER, clams, monster walks with ER bias. "
                "If overactive/painful: down-training, gentle neural mobility, avoid aggressive "
                "end-range stretch into pain; address hip abductor endurance and SI load transfer"
            ),
            "Progressions": (
                "Pain-free motor control → strength in mid-range ER → functional single-leg → "
                "return to running with stride mechanics review"
            ),
            "Evidence": (
                "Deep gluteal syndrome concept preferred over isolated 'piriformis syndrome' by many authors; "
                "diagnosis of exclusion after lumbar radiculopathy screening; "
                "evidence for stretching alone is limited — multimodal approach advised"
            ),
            "References": (
                "Hopayian K / Martin HD deep gluteal syndrome reviews. "
                "Standring S. Gray's Anatomy. Magee DJ. Orthopedic Physical Assessment."
            ),
        },
    ),
    (
        "Obturator Internus",
        {
            "ID": "PEL-HS-04",
            "Muscle": "Obturator internus",
            "Role": (
                "Deep external rotator and femoral head stabilizer; pelvic sidewall muscle with "
                "fascial links to pelvic floor (ATLA / obturator fascia)"
            ),
            "EMG": (
                "Active during hip ER and isometric stabilization; clinically relevant co-contraction "
                "with pelvic floor in some motor-control models"
            ),
            "Function": (
                "Origin pelvic surface of obturator membrane and surrounding bone; tendon exits lesser "
                "sciatic foramen, turns 90 deg over lesser sciatic notch (ischium), inserts medial greater trochanter; "
                "tram-track with gemelli"
            ),
            "Clinical Importance": (
                "Trigger points refer to pelvic/perineal and posterior hip pain; "
                "obturator internus dysfunction common in chronic pelvic pain presentations; "
                "relationship to pudendal canal (Alcock) on obturator fascia — pudendal neuralgia differential"
            ),
            "Exercises": (
                "Hip ER strengthening in neutral flexion; isometric deep rotator sets; "
                "pelvic floor coordination (not forced Kegels if hypertonic); "
                "gentle mobility of hip IR/ER within tolerance"
            ),
            "Progressions": (
                "Isometrics → band ER → functional stance control → sport-specific rotation control"
            ),
            "Evidence": (
                "Anatomic continuity with pelvic floor fascia supports integrated assessment "
                "(pelvic health + hip) in persistent pelvic pain; high-level RCTs muscle-specific still limited"
            ),
            "References": (
                "Standring S. Gray's Anatomy. "
                "Pelvic pain clinical texts (e.g., Lee & Lee-Style / Vleeming pelvic concepts). "
                "Moore KL Clinically Oriented Anatomy."
            ),
        },
    ),
    (
        "Gemelli (Superior and Inferior)",
        {
            "ID": "PEL-HS-05",
            "Muscle": "Gemellus superior and gemellus inferior (triceps coxae with obturator internus)",
            "Role": (
                "Assist obturator internus in external rotation and femoral head stabilization; "
                "reinforce OI tendon at the lesser sciatic notch turn"
            ),
            "EMG": (
                "Typically studied with deep ER group; contribute to fine control of hip rotation "
                "rather than large torque compared with gluteus maximus"
            ),
            "Function": (
                "Superior gemellus: ischial spine to OI tendon / trochanter. "
                "Inferior gemellus: ischial tuberosity to OI tendon / trochanter. "
                "Together form 'triceps coxae' inserting on medial greater trochanter"
            ),
            "Clinical Importance": (
                "Part of deep gluteal pain differential; rarely isolated injury; "
                "considered in deep ER strengthening and pelvic sidewall pain maps"
            ),
            "Exercises": (
                "Same deep ER progression as obturator internus; emphasize quality of rotation "
                "without lumbar substitution"
            ),
            "Progressions": (
                "Low-load ER isometrics → isotonic ER → integrated single-leg stability"
            ),
            "Evidence": (
                "Anatomic descriptions consistent across Gray's/Moore; "
                "clinical targeting usually as deep ER group rather than gemelli-only"
            ),
            "References": (
                "Standring S. Gray's Anatomy. Neumann DA. Kinesiology of the Musculoskeletal System. "
                "Moore KL et al. Clinically Oriented Anatomy."
            ),
        },
    ),
    (
        "Quadratus Femoris",
        {
            "ID": "PEL-HS-06",
            "Muscle": "Quadratus femoris",
            "Role": (
                "Strong external rotator and adductor of thigh; stabilizes femoral head; "
                "ischiofemoral interval relationship (quadratus femoris space)"
            ),
            "EMG": (
                "Active in ER and during stabilization against IR moments; "
                "edema in quadratus femoris seen on MRI in ischiofemoral impingement"
            ),
            "Function": (
                "Origin lateral ischial tuberosity to quadrate tubercle on intertrochanteric crest; "
                "short powerful ER"
            ),
            "Clinical Importance": (
                "Ischiofemoral impingement: narrowed ischiofemoral space compresses quadratus femoris — "
                "buttock pain, possible sciatic irritation; differentiate from proximal hamstring and SI pain; "
                "MRI useful when suspected"
            ),
            "Exercises": (
                "If non-impingement weakness: ER strengthening, glute max, pelvic control. "
                "If IFI suspected: avoid end-range extension+adduction positions that narrow space; "
                "abductor endurance; activity modification; refer for imaging if progressive"
            ),
            "Progressions": (
                "Pain-guided mid-range loading → functional gait → graded return avoiding provocative extremes"
            ),
            "Evidence": (
                "IFI increasingly recognized on MRI series; conservative care first-line in many cases; "
                "surgical decompression selected failures"
            ),
            "References": (
                "Tosun O / Gollwitzer H ischiofemoral impingement literature. "
                "Standring S. Gray's Anatomy. Neumann DA. Kinesiology."
            ),
        },
    ),
]


# ---------------------------------------------------------------------------
# 6. Biomechanics
# ---------------------------------------------------------------------------

BIOMECHANICS_RECORDS: list[tuple[str, dict[str, Any]]] = [
    (
        "Force Transmission Through the Pelvis",
        {
            "ID": "PEL-BIO-01",
            "Movement": "Axial load transfer spine → sacrum → SI joints → innominates → hips → lower limbs",
            "Force Transmission": (
                "Body weight through L5 to sacral base; distributed across SI joints into iliac bones; "
                "anterior ring (pubic symphysis) completes closed osteoligamentous loop; "
                "ground reaction forces ascend via femurs/acetabula. Failure at any ring segment "
                "(rami, symphysis, SI) alters load path"
            ),
            "Pelvic Rotation": "Horizontal-plane rotation accompanies gait pelvic step and sport cutting",
            "Anterior Tilt": "Increases lumbar lordosis demand; lengthens abdominals; shortens hip flexors",
            "Posterior Tilt": "Reduces lordosis; increases hamstring/glute relative advantage for hip extension",
            "Lateral Tilt": "Frontal-plane drop/hike controlled primarily by stance-limb hip abductors",
            "Load Transfer": (
                "ASLR test clinically probes ability to transfer load across pelvis; "
                "improved by force closure (compression) and motor control"
            ),
            "Gait": "Pelvis rotates forward on swing side; slight lateral tilt; SI micro-motion assists compliance",
            "Running": "Higher GRF and faster load rates — demand on glute med/max and pelvic floor coordination rise",
            "Single Leg Stance": "Critical test of frontal-plane force closure and abductor endurance",
            "Compensations": (
                "Trendelenburg; trunk lean over stance limb; lumbar side-bend; overactive QL; "
                "contralateral vaulting"
            ),
            "Clinical Relevance": (
                "Pelvic ring integrity and SI force/form closure are foundational to low back, groin, "
                "and hip rehab prescription"
            ),
            "Exercises": (
                "ASLR with facilitation; glute med/max progressive loading; "
                "anti-lateral-flexion carries; step-downs"
            ),
            "References": (
                "Vleeming A et al. SIJ form/force closure. Neumann DA. Kinesiology. "
                "Bogduk N. Clinical Anatomy of Lumbar Spine and Sacrum."
            ),
        },
    ),
    (
        "Pelvic Rotation",
        {
            "ID": "PEL-BIO-02",
            "Movement": "Transverse-plane rotation of pelvis on hips / relative to lumbar spine",
            "Force Transmission": (
                "Rotational moments shared by hips, SI joints (small), and lumbar segments; "
                "oblique abdominals and glute max important transmitters"
            ),
            "Pelvic Rotation": (
                "Normal gait: pelvis rotates ~4-10+ deg depending on speed; "
                "excess or asymmetric rotation may reflect hip IR/ER deficit or lumbar hypermobility"
            ),
            "Anterior Tilt": "Often couples with rotation in sport postures — assess 3D, not single plane",
            "Posterior Tilt": "May be used to reduce anterior shear when rotation under load is provocative",
            "Lateral Tilt": "Coupled with rotation in gait (pelvic list)",
            "Load Transfer": "Asymmetric rotation increases unilateral SI shear demand",
            "Gait": "Forward rotation of pelvis toward swing limb advances step length",
            "Running": "Increased rotation with speed; crosstalk with trunk counter-rotation",
            "Single Leg Stance": "Rotary control prevents femoral IR collapse",
            "Compensations": "Lumbar twist substituting for hip rotation; pivoting on fixed pelvis",
            "Clinical Relevance": "Golf, racquet, kicking sports; postpartum PGP with asymmetric twist pain",
            "Exercises": (
                "Supported pelvic clocks; reciprocal chops/lifts; hip IR/ER mobility + control; "
                "split-stance rows"
            ),
            "References": "Neumann DA. Kinesiology. Perry J gait textbooks. Vleeming PGP guidelines.",
        },
    ),
    (
        "Anterior Pelvic Tilt",
        {
            "ID": "PEL-BIO-03",
            "Movement": "ASIS moves inferior/anterior relative to PSIS; increases lumbopelvic extension bias",
            "Force Transmission": (
                "Increases lumbar facet loading and anterior shear at L5-S1; "
                "hip flexors become relatively shortened; abdominals lengthened"
            ),
            "Pelvic Rotation": "May coexist asymmetrically (one innominate anteriorly rotated — clinical model)",
            "Anterior Tilt": (
                "Common resting posture variant — not automatically pathologic; "
                "becomes relevant when linked to symptoms and movement fault under load"
            ),
            "Posterior Tilt": "Opposite strategy used in some McGill-style bracing cues — individualize",
            "Lateral Tilt": "Unilateral anterior rotation presents as asymmetric landmarks",
            "Load Transfer": "Excess anterior tilt may impair ASLR efficiency if abdominal wall not coordinating",
            "Gait": "Increased anterior tilt can accompany weak glutes / overactive hip flexors",
            "Running": "Overstride + anterior tilt may elevate braking forces and lumbar demand",
            "Single Leg Stance": "Watch lumbar hyperextension substitute for hip control",
            "Compensations": "Knee hyperextension; rib flare; breath-holding",
            "Clinical Relevance": "Facet pain, spondylolysis risk sports, hip flexor tendinopathy contexts",
            "Exercises": (
                "Posterior tilt awareness without crushing lordosis; glute max; "
                "abdominal wall endurance; hip flexor mobility if length-limited"
            ),
            "References": "Neumann DA. Kinesiology. Sahrmann movement system concepts. Bogduk biomechanics.",
        },
    ),
    (
        "Posterior Pelvic Tilt",
        {
            "ID": "PEL-BIO-04",
            "Movement": "ASIS moves superior/posterior relative to PSIS; flattens lumbar lordosis",
            "Force Transmission": (
                "Increases disc flexion loading pattern; tensions long dorsal SI ligament "
                "(counternutation-biased); may unload facets"
            ),
            "Pelvic Rotation": "Symmetric posterior tilt vs unilateral posterior innominate models",
            "Anterior Tilt": "Opposite end of sagittal continuum",
            "Posterior Tilt": (
                "Useful cue for some extension-sensitive backs; harmful if over-cued into sustained flexion "
                "for flexion-intolerant disc presentations"
            ),
            "Lateral Tilt": "Assess in combination with sagittal posture",
            "Load Transfer": "Sustained posterior tilt sitting may aggravate long dorsal SI ligament pain",
            "Gait": "Excess may reduce shock absorption from lumbar lordosis",
            "Running": "Over-tucking can limit hip extension and increase hamstring demand",
            "Single Leg Stance": "May hide true hip extension control",
            "Compensations": "Thoracic flexion; posterior trunk lean",
            "Clinical Relevance": "Match tilt strategy to directional preference and sport demands",
            "Exercises": (
                "Hip hinge proficiency; glute strengthening in neutral; "
                "avoid exclusive end-range posterior tilt training"
            ),
            "References": "McGill SM. Low Back Disorders. Vleeming long dorsal SI ligament papers. Neumann DA.",
        },
    ),
    (
        "Lateral Pelvic Tilt",
        {
            "ID": "PEL-BIO-05",
            "Movement": "Frontal-plane elevation/depression of one hemipelvis relative to the other",
            "Force Transmission": (
                "Stance hip abductors (glute med/min, TFL) generate force closure against gravity "
                "on contralateral drop"
            ),
            "Pelvic Rotation": "Coupled in gait with transverse rotation",
            "Anterior Tilt": "3D posture often mixes sagittal and frontal faults",
            "Posterior Tilt": "Same — multiplanar assessment required",
            "Lateral Tilt": (
                "Trendelenburg: stance pelvis drops opposite (contralateral iliac crest falls); "
                "compensated Trendelenburg: trunk leans over stance limb"
            ),
            "Load Transfer": "Key impairment in GTPS, PFP, and pregnancy PGP",
            "Gait": "Normal small lateral tilt; excess indicates abductor deficit or pain inhibition",
            "Running": "Contralateral pelvic drop associated with common running injury patterns",
            "Single Leg Stance": "Gold-standard clinical screen for 10-30+ seconds with quality",
            "Compensations": "Trunk lean; hip hike from QL; wide BOS; shortened stance time",
            "Clinical Relevance": "Prioritize abductor endurance and pelvic control before impact progressions",
            "Exercises": (
                "Hip hitches; sidelying abduction; single-leg stance; "
                "step-downs; lateral band walks with level pelvis"
            ),
            "References": (
                "Neumann DA. Kinesiology. Grimaldi A gluteal tendinopathy. "
                "Running biomechanics reviews on contralateral pelvic drop."
            ),
        },
    ),
    (
        "Load Transfer and Gait / Running / Single-Leg Stance",
        {
            "ID": "PEL-BIO-06",
            "Movement": "Integrated functional loading: walking, running, single-leg stance",
            "Force Transmission": (
                "Each step is a single-leg load-transfer event across SI joints and hips; "
                "running multiplies GRF (often 2-3x BW)"
            ),
            "Pelvic Rotation": "Scales with walking/running speed",
            "Anterior Tilt": "Monitor for speed-related increase and lumbar extension stress",
            "Posterior Tilt": "Monitor for over-cueing that shortens stride abnormally",
            "Lateral Tilt": "Primary quality metric in single-leg tasks",
            "Load Transfer": (
                "Clinical: ASLR, single-leg stand, step-down, hop testing when appropriate; "
                "pregnancy PGP: modify high asymmetric load"
            ),
            "Gait": (
                "Observe pelvic list, rotation, Trendelenburg, stride symmetry, "
                "and arm swing compensation"
            ),
            "Running": (
                "Cadence, overstride, pelvic drop, trunk posture, and hip extension — "
                "retrain gradually with 10% rule heuristics for volume"
            ),
            "Single Leg Stance": (
                "Hands on iliac crests; quality > time; progress to eyes-closed / unstable surfaces cautiously"
            ),
            "Compensations": (
                "Listed across planes: Trendelenburg, lumbar hinge, hip IR collapse, "
                "breath-hold bracing, pelvic floor bearing-down"
            ),
            "Clinical Relevance": (
                "Functional tests guide RTS for pelvic girdle, hip, and lumbar patients better than "
                "isolated ROM alone"
            ),
            "Exercises": (
                "Gait drills; run-walk programs; single-leg RDL; lateral step-down ladders; "
                "plyometric progressions after control established"
            ),
            "References": (
                "Vleeming European PGP guidelines. Neumann DA. "
                "Brukner & Khan Clinical Sports Medicine (pelvis/hip chapters)."
            ),
        },
    ),
    (
        "Compensations and Clinical Exercise Links",
        {
            "ID": "PEL-BIO-07",
            "Movement": "Common maladaptive strategies around pelvic dysfunction",
            "Force Transmission": (
                "Compensations redistribute load to lumbar facets, hips, or soft tissues — "
                "short-term helpful, long-term symptom drivers"
            ),
            "Pelvic Rotation": "Asymmetric sport patterns without recovery capacity",
            "Anterior Tilt": "Chronic rib-flare bracing",
            "Posterior Tilt": "Chronic tuck with flexed lumbar spine",
            "Lateral Tilt": "Trunk lean masking abductor weakness",
            "Load Transfer": "Avoidance of single-leg tasks → further deconditioning",
            "Gait": "Shortened stride, antalgic lean, trendelenburg",
            "Running": "Volume spikes without pelvic control capacity",
            "Single Leg Stance": "Inability >10-15 s with quality suggests priority impairment",
            "Compensations": (
                "Overactive TFL vs glute med; hamstring dominance vs glute max; "
                "pelvic floor overactivity mimicking 'core strength'; breath-holding"
            ),
            "Clinical Relevance": (
                "Treat the driver: strength, motor control, load management, and referral "
                "when inflammatory/traumatic red flags present"
            ),
            "Exercises": (
                "Re-educate breathing + pelvic floor; build glute med/max; "
                "restore single-leg capacity; integrate sport; educate on flare management"
            ),
            "References": (
                "Vleeming A et al. J Anat / PGP guidelines. Grimaldi A. "
                "Bo K pelvic floor. Laslett SI testing."
            ),
        },
    ),
]


# ---------------------------------------------------------------------------
# 7. Evidence summary records
# ---------------------------------------------------------------------------

EVIDENCE_RECORDS: list[tuple[str, dict[str, Any]]] = [
    (
        "Key Evidence and Guidelines — Pelvis Module",
        {
            "ID": "PEL-EVID-01",
            "Topic": "Foundational references for Kinora pelvis AI orientation",
            "Anatomy": (
                "Standring S. Gray's Anatomy. Moore KL, Dalley AF, Agur AMR. Clinically Oriented Anatomy. "
                "Netter FH. Atlas of Human Anatomy. Bogduk N. Clinical Anatomy of the Lumbar Spine and Sacrum."
            ),
            "SI Joint and PGP": (
                "Vleeming A et al. The sacroiliac joint: an overview... J Anat. "
                "Vleeming A et al. European guidelines for the diagnosis and treatment of pelvic girdle pain. "
                "Laslett M et al. Diagnosis of SIJ pain: validity of two pain provocation tests / cluster studies."
            ),
            "Biomechanics": (
                "Neumann DA. Kinesiology of the Musculoskeletal System. "
                "Vleeming form and force closure model papers."
            ),
            "Pelvic Floor": (
                "Bo K et al. Evidence-based Physical Therapy for the Pelvic Floor. "
                "ICS standardization documents. NICE guidance on urinary incontinence in women (PFMT first-line elements)."
            ),
            "Hip Stabilizers": (
                "Grimaldi A et al. Gluteal tendinopathy clinical works. "
                "Distefano LJ et al. JOSPT gluteal EMG. Deep gluteal syndrome reviews (Martin HD et al.)."
            ),
            "Assessment Texts": (
                "Magee DJ. Orthopedic Physical Assessment. Brukner & Khan Clinical Sports Medicine."
            ),
            "AI Use Note": (
                "Values for motion (degrees/mm), EMG rankings, and test accuracy are approximate and study-dependent. "
                "Always prefer current guidelines and individual clinical assessment over static document recall."
            ),
            "References": "See fields above — primary educational synthesis sources for this PDF.",
        },
    ),
]


TOC_SECTIONS = [
    "Disclaimer",
    "1. Pelvic Bones (Ilium, Ischium, Pubis, Sacrum, Coccyx)",
    "2. Sacroiliac Joint (Form Closure, Force Closure, Tests, Pathologies)",
    "3. Pelvic Ligaments (Sacrotuberous, Sacrospinous, Anterior SI, Posterior SI, Interosseous SI, Iliolumbar)",
    "4. Pelvic Floor (Pubococcygeus, Iliococcygeus, Puborectalis, Coccygeus, Integrated Complex)",
    "5. Hip Stabilizers (Gluteus Medius/Minimus, Piriformis, Obturator Internus, Gemelli, Quadratus Femoris)",
    "6. Pelvic Biomechanics (Force Transmission, Tilts, Gait, Running, Single-Leg Stance, Compensations)",
    "7. Evidence and Guidelines",
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
        title="Kinora Pelvis AI Orientation Part 6",
        author="Kinora AI Training",
    )
    styles = build_styles()
    story: list = []

    story.append(Spacer(1, 1.2 * inch))
    story.append(Paragraph("Kinora Pelvis", styles["title"]))
    story.append(Paragraph("Clinical AI Orientation (Part 6)", styles["title"]))
    story.append(Spacer(1, 0.3 * inch))
    story.append(Paragraph(
        "Structured reference for RAG / AI-assisted physiotherapy consultation",
        styles["subtitle"],
    ))
    story.append(Spacer(1, 0.2 * inch))
    story.append(Paragraph(
        "Pelvic Bones, SI Joint, Ligaments, Pelvic Floor, Hip Stabilizers &amp; Biomechanics",
        styles["subtitle"],
    ))
    story.append(Spacer(1, 0.5 * inch))
    story.append(Paragraph("Version 1.0 — Kinora Admin Conocimientos Upload", styles["subtitle"]))
    story.append(PageBreak())

    add_section(story, styles, "Disclaimer")
    story.append(Paragraph(
        "This document is an educational orientation resource for Kinora AI clinical consultation support. "
        "It is NOT a substitute for professional clinical judgment, direct patient examination, or licensed "
        "medical/physiotherapy care. Content reflects established musculoskeletal and pelvic health concepts from "
        "standard anatomical texts (Gray's/Standring, Moore, Netter, Bogduk), biomechanical models "
        "(Vleeming form/force closure, Neumann), orthopedic assessment (Magee, Laslett SI cluster), "
        "and pelvic floor evidence (ICS, Bo et al., NICE-aligned PFMT principles). "
        "All values and test properties are approximate and must be verified against current peer-reviewed "
        "literature, local protocols, and individual presentation. "
        "<b>Red flags — cauda equina signs, progressive neurological deficit, suspected fracture, infection, "
        "inflammatory sacroiliitis needing rheumatology, or unexplained visceral symptoms — require appropriate "
        "urgent medical referral.</b> Internal pelvic floor examination must only be performed by appropriately "
        "trained clinicians with informed consent.",
        styles["disclaimer"],
    ))
    story.append(Spacer(1, 12))

    add_section(story, styles, "Table of Contents")
    for item in TOC_SECTIONS:
        story.append(Paragraph(f"• {esc(item)}", styles["toc"]))
    story.append(PageBreak())

    sections = [
        ("1. Pelvic Bones", BONE_RECORDS),
        ("2. Sacroiliac Joint", SI_JOINT_RECORDS),
        ("3. Pelvic Ligaments", LIGAMENT_RECORDS),
        ("4. Pelvic Floor", PELVIC_FLOOR_RECORDS),
        ("5. Hip Stabilizers", HIP_STABILIZER_RECORDS),
        ("6. Pelvic Biomechanics", BIOMECHANICS_RECORDS),
        ("7. Evidence and Guidelines", EVIDENCE_RECORDS),
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
