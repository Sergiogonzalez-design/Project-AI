#!/usr/bin/env python3
"""
Generate Kinora Hip AI Orientation PDF (Part 7) for RAG/clinical training.
Output: knowledge/Kinora_Hip_AI_Orientation.pdf

Sources (educational synthesis): Gray's/Standring, Moore, Netter, Neumann kinesiology,
Magee assessment, FAI/labral literature (Ganz, Clohisy), GTPS (Grimaldi),
hip arthroplasty vascular anatomy (MCFA), Brukner & Khan sports medicine.
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
OUTPUT_PATH = PROJECT_ROOT / "knowledge" / "Kinora_Hip_AI_Orientation.pdf"


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
        "Kinora Hip AI Orientation Part 7 — Educational Use Only",
    )
    canvas.restoreState()


# ---------------------------------------------------------------------------
# 1. Bones
# ---------------------------------------------------------------------------

BONE_RECORDS: list[tuple[str, dict[str, Any]]] = [
    (
        "Femur (Proximal)",
        {
            "ID": "HIP-BONE-01",
            "Bone": "Proximal femur — femoral head, neck, greater/lesser trochanters, intertrochanteric regions",
            "Landmarks": (
                "Femoral head (2/3 sphere; fovea capitis for ligamentum teres); femoral neck "
                "(anteversion typically ~10-20 deg adults; neck-shaft angle ~125-135 deg); "
                "greater trochanter (glute med/min/piriformis/OI/gemelli insertions; GTPS landmark); "
                "lesser trochanter (iliopsoas insertion); intertrochanteric line (anterior — capsule/iliofemoral); "
                "intertrochanteric crest (posterior — quadratus femoris); quadrate tubercle; "
                "trochanteric fossa; calcar femorale (medial compressive trabeculae)"
            ),
            "Muscle Attachments": (
                "Gluteus medius/minimus → greater trochanter; piriformis, obturator internus, gemelli → "
                "medial/superior GT; obturator externus → trochanteric fossa; quadratus femoris → "
                "quadrate tubercle; iliopsoas → lesser trochanter; gluteus maximus → gluteal tuberosity "
                "(and ITB); vastus lateralis origin near GT; adductors insert more distal on linea aspera "
                "but influence proximal mechanics"
            ),
            "Ligament Attachments": (
                "Ligamentum teres to fovea capitis; iliofemoral/pubofemoral/ischiofemoral via capsule "
                "to intertrochanteric line/crest regions; zona orbicularis encircles neck"
            ),
            "Blood Supply": (
                "Primary adult femoral head supply: medial circumflex femoral artery (MCFA) deep branch "
                "via retinacular (especially posterior-superior) vessels; lateral circumflex femoral (LCFA) "
                "lesser contribution; artery of ligamentum teres (obturator) minor in adults, more important "
                "in children. Disruption of MCFA retinacular vessels → osteonecrosis risk (fracture, "
                "dislocation, surgical approaches)"
            ),
            "Biomechanics": (
                "Ball-and-socket articulation; neck length/angle creates lever arms for abductors; "
                "coxavara decreases abductor MA and may elevate shear; coxavalga opposite; "
                "anteversion alters IR/ER arc and patellofemoral tracking cascade"
            ),
            "Clinical Importance": (
                "Femoral neck fracture (osteoporosis — Garden classification); intertrochanteric fracture; "
                "cam morphology (aspherical head-neck — FAI); AVN of femoral head; "
                "proximal hamstring avulsion at ischium vs lesser trochanter avulsion (adolescents — iliopsoas); "
                "GT apophysitis/avulsion in youth athletes"
            ),
            "References": (
                "Standring S. Gray's Anatomy. Moore KL et al. Clinically Oriented Anatomy. "
                "Neumann DA. Kinesiology. Gautier E / Kalhor M MCFA anatomy literature (AVN relevance)."
            ),
        },
    ),
    (
        "Acetabulum",
        {
            "ID": "HIP-BONE-02",
            "Bone": "Acetabulum — hemispheric socket formed by ilium, ischium, and pubis fusion",
            "Landmarks": (
                "Lunate (articular) surface; acetabular fossa (non-articular fat/ligamentum teres); "
                "acetabular notch inferiorly closed by transverse acetabular ligament; "
                "acetabular rim/labrum attachment; anterior wall (pubic contribution); "
                "posterior wall (ischial — critical in fracture stability); roof/dome (iliac — primary load); "
                "center-edge angle (Wiberg) and acetabular version assessed radiographically"
            ),
            "Muscle Attachments": (
                "Indirect via capsule and reflected head of rectus femoris (ilioacetabular origin); "
                "obturator externus near inferior margin; hip external rotators influence stability; "
                "no large muscle belly originates inside the socket"
            ),
            "Ligament Attachments": (
                "Labrum and transverse acetabular ligament complete the rim; "
                "iliofemoral, pubofemoral, ischiofemoral ligaments blend with capsule at rim; "
                "ligamentum teres from acetabular notch/transverse ligament to fovea"
            ),
            "Blood Supply": (
                "Superior gluteal, inferior gluteal, obturator, and MCFA/LCFA anastomotic contributions "
                "to acetabular periosteum and walls; relevant in periacetabular osteotomy and fracture fixation"
            ),
            "Biomechanics": (
                "Covers ~170 deg of femoral head with labrum deepening socket; "
                "primary weight-bearing through dome in stance; under-coverage (dysplasia) elevates "
                "contact stress and labral load; over-coverage / retroversion associated with pincer FAI"
            ),
            "Clinical Importance": (
                "Developmental dysplasia of the hip (DDH); acetabular fracture (Letournel/Judet); "
                "pincer morphology FAI; osteoarthritis; acetabular labral tears at chondrolabral junction; "
                "posterior wall deficiency → instability"
            ),
            "References": (
                "Standring S. Gray's Anatomy. Ganz R / Clohisy JC FAI literature. "
                "Wiberg center-edge angle classic description. Moore KL Clinically Oriented Anatomy."
            ),
        },
    ),
]


# ---------------------------------------------------------------------------
# 2. Labrum
# ---------------------------------------------------------------------------

LABRUM_RECORDS: list[tuple[str, dict[str, Any]]] = [
    (
        "Acetabular Labrum",
        {
            "ID": "HIP-LAB-01",
            "Structure": (
                "Fibrocartilaginous ring attached to acetabular rim; triangular cross-section; "
                "completes socket with transverse acetabular ligament inferiorly; "
                "creates suction-seal / fluid seal with femoral head; richly innervated peripherally; "
                "relatively hypovascular — healing capacity limited especially in avascular zones"
            ),
            "Blood Supply": (
                "Radial branches from capsule and periacetabular network (gluteal, obturator, MCFA anastomoses); "
                "peripheral labrum better perfused than central free edge — tear location affects healing potential"
            ),
            "Innervation": (
                "Branches related to nerve to quadratus femoris, obturator, superior gluteal, and "
                "direct capsular nerves — explains nociceptive labral pain"
            ),
            "Biomechanics": (
                "Deepens acetabulum (~21% volume increase cited in anatomic studies); "
                "enhances stability via seal and negative pressure; load distribution; "
                "proprioception; tear disrupts seal → microinstability and chondral overload"
            ),
            "Clinical Tests": (
                "FADIR (flexion-adduction-IR) — sensitive but not specific for FAI/labral irritation; "
                "FABER — may provoke anterior/lateral pain; log roll; scour/quadrant; "
                "resisted SLR; clinical diagnosis requires imaging correlation — no single pathognomonic test"
            ),
            "MRI": (
                "MR arthrography historically gold-standard for labral tear; high-resolution 3T MRI "
                "increasingly sufficient; look for chondrolabral separation, paralabral cyst, "
                "cam/pincer morphology, cartilage delamination. Plain radiographs first for FAI bony morphology "
                "( Dunn, frog-leg, false-profile, AP pelvis)"
            ),
            "Pathologies": (
                "Labral tear (anterosuperior most common in cam FAI); degeneration; ossification; "
                "paralabral cyst; associated chondral injury; dysplasia-related hypertrophic labrum under shear"
            ),
            "Treatment": (
                "Activity modification; physical therapy focusing on deep stabilizer control, "
                "glute strength, avoiding provocative end-range FAdIR early; NSAIDs as appropriate; "
                "image-guided injection selective; arthroscopic repair/debridement ± osteochondroplasty "
                "for refractory FAI/labral pathology after failed conservative care"
            ),
            "Rehabilitation": (
                "Phase protection of repair (surgeon protocol — often limited flexion/IR/rotation early); "
                "isometrics → progressive ROM → glute med/max and deep rotator strength → "
                "single-leg control → running/cutting return. Non-operative: same kinetic chain without surgical precautions"
            ),
            "References": (
                "Ganz R et al. FAI concept. Clohisy JC et al. FAI clinical/radiographic. "
                "Griffin DR et al. Warwick Agreement on FAI syndrome. Standring S. Gray's Anatomy."
            ),
        },
    ),
]


# ---------------------------------------------------------------------------
# 3. Ligaments
# ---------------------------------------------------------------------------

LIGAMENT_RECORDS: list[tuple[str, dict[str, Any]]] = [
    (
        "Iliofemoral Ligament",
        {
            "ID": "HIP-LIG-01",
            "Ligament": "Iliofemoral ligament (Y ligament of Bigelow) — strongest hip ligament",
            "Origin": "AIIS and iliac portion of acetabular rim",
            "Insertion": (
                "Intertrochanteric line via two bands (superior/lateral and inferior/medial) — inverted Y"
            ),
            "Function": (
                "Limits hip extension and external rotation; resists anterior dislocation; "
                "allows upright standing with minimal muscle force ('hanging on ligaments')"
            ),
            "Biomechanics": (
                "Taut in extension; slackens in flexion; primary static restraint to hyperextension; "
                "critical for anterior stability with iliopsoas and anterior capsule"
            ),
            "Healing": (
                "Capsuloligamentous remodeling over months; post-arthroscopy capsular repair protocols "
                "protect against extension/ER stress early when capsule closed"
            ),
            "Clinical Tests": (
                "Passive hip extension end-feel; anterior apprehension patterns; "
                "differentiate from psoas pain and anterior labral pain"
            ),
            "Treatment": (
                "Sprain: protect extension extremes, progressive loading; "
                "laxity/microinstability: deepen stabilizer rehab, consider orthopaedic opinion if traumatic"
            ),
            "Rehabilitation": (
                "Avoid early aggressive hyperextension after anterior capsule injury/surgery; "
                "glute max and deep ER strengthening; neuromuscular control in stance"
            ),
            "References": (
                "Standring S. Gray's Anatomy. Neumann DA. Kinesiology. "
                "Myers CA / Torry MR hip capsule biomechanics literature."
            ),
        },
    ),
    (
        "Pubofemoral Ligament",
        {
            "ID": "HIP-LIG-02",
            "Ligament": "Pubofemoral ligament",
            "Origin": "Iliopubic eminence / superior pubic ramus and obturator crest region",
            "Insertion": "Blends with inferior iliofemoral band / capsule toward intertrochanteric region",
            "Function": "Limits extension, abduction, and some external rotation; reinforces inferior capsule",
            "Biomechanics": (
                "Works with iliofemoral to constrain extension-abduction extremes; "
                "inferior capsule important in hyperabduction injuries"
            ),
            "Healing": "Similar capsular timeline — progressive protected ROM then strength",
            "Clinical Tests": (
                "Pain/apprehension in extension-abduction; assess with FABER carefully; "
                "inferior instability rare but consider post-trauma"
            ),
            "Treatment": "Load modification; address adductor-abdominal balance in athletes if coexisting groin pain",
            "Rehabilitation": (
                "Graded abduction control; adductor strengthening if weak; "
                "avoid early forced hyperabduction after inferior capsule injury"
            ),
            "References": "Standring S. Gray's Anatomy. Moore KL. Neumann DA. Kinesiology.",
        },
    ),
    (
        "Ischiofemoral Ligament",
        {
            "ID": "HIP-LIG-03",
            "Ligament": "Ischiofemoral ligament",
            "Origin": "Ischial rim of acetabulum / posterior-inferior capsule origin",
            "Insertion": "Blends into zona orbicularis / posterior femoral neck capsule toward GT base",
            "Function": "Limits internal rotation and extension; primary posterior capsular restraint to IR",
            "Biomechanics": (
                "Taut in extension-IR; contributes to posterior stability; "
                "zona orbicularis collar constrains distraction"
            ),
            "Healing": "Posterior capsule injury after posterior dislocation — protected IR/flexion protocols per trauma team",
            "Clinical Tests": (
                "Passive IR in flexion may stress posterior structures; "
                "posterior apprehension; differentiate ischiofemoral impingement (QF space) from ligament sprain"
            ),
            "Treatment": (
                "Post-dislocation: urgent reduction, AVN counseling, protected rehab; "
                "isolated sprain uncommon — treat within capsular injury framework"
            ),
            "Rehabilitation": (
                "Posterior dislocation protocols typically limit flexion/IR/adduction early; "
                "progressive abductor and ER strength; gait restoration"
            ),
            "References": (
                "Standring S. Gray's Anatomy. Neumann DA. "
                "Hip dislocation orthopaedic trauma guidelines."
            ),
        },
    ),
    (
        "Ligamentum Teres",
        {
            "ID": "HIP-LIG-04",
            "Ligament": "Ligamentum teres (round ligament of femur)",
            "Origin": "Acetabular notch and transverse acetabular ligament (bifurcate attachments)",
            "Insertion": "Fovea capitis of femoral head",
            "Function": (
                "Secondary stabilizer (especially in flexion-ER / extremes in some studies); "
                "carries artery of ligamentum teres; proprioceptive role proposed; "
                "not primary stabilizer in intact adult bony/labral hip"
            ),
            "Biomechanics": (
                "Tension patterns debated — may check distraction and certain rotation extremes; "
                "more vascular importance in pediatric femoral head"
            ),
            "Healing": (
                "Tears often managed based on instability symptoms; "
                "reconstruction experimental/selected instability cases"
            ),
            "Clinical Tests": (
                "No reliable isolated bedside test; considered in differential of central groin pain "
                "with microinstability after labral/capsule injury"
            ),
            "Treatment": (
                "Address primary FAI/labral/capsule drivers; arthroscopic debridement vs reconstruction "
                "in selected instability — specialist decision"
            ),
            "Rehabilitation": (
                "Deep hip stabilizer and glute program; avoid early distraction-heavy activities "
                "if reconstruction performed (surgeon-guided)"
            ),
            "References": (
                "O'Donnell J / Martin RL ligamentum teres reviews. "
                "Standring S. Gray's Anatomy. Cerezal L imaging of ligamentum teres."
            ),
        },
    ),
]


# ---------------------------------------------------------------------------
# 4. Muscles
# ---------------------------------------------------------------------------

MUSCLE_RECORDS: list[tuple[str, dict[str, Any]]] = [
    (
        "Gluteus Maximus",
        {
            "ID": "HIP-MUS-01",
            "Name": "Gluteus maximus",
            "Origin": (
                "Posterior ilium behind posterior gluteal line, dorsal sacrum/coccyx, "
                "sacrotuberous ligament"
            ),
            "Insertion": (
                "Iliotibial tract (upper fibers ~75%) and gluteal tuberosity of femur (deep/lower fibers)"
            ),
            "Innervation": "Inferior gluteal nerve (L5-S2)",
            "Blood Supply": "Inferior gluteal artery; superior gluteal artery anastomoses",
            "Fiber Direction": "Inferolateral from pelvis to ITB/femur — large cross-sectional area",
            "Primary Action": "Hip extension; powerful external rotation; posterior pelvic tilt contribution",
            "Secondary Action": "Upper fibers assist abduction; lower fibers assist adduction; trunk extension over femur",
            "Stabilizing Function": (
                "Primary sagittal and rotary stabilizer in gait propulsion and load transfer; "
                "SI force closure via sacrotuberous/thoracolumbar fascia links"
            ),
            "EMG": (
                "High in sit-to-stand, climbing, sprint acceleration, hip thrust, step-up; "
                "lower in quiet standing than deep rotators/abductors for frontal plane"
            ),
            "Trigger Points": "Buttock referral; may mimic sciatica; sacral and ITB referral patterns",
            "Stretch": (
                "Knee-to-chest with adduction variants; figure-4; avoid aggressive neural stretch if sciatic irritation"
            ),
            "Strengthening": (
                "Hip thrusts, bridges, split squats, step-ups, Romanian deadlift, "
                "prone hip extension with knee flexed to bias glute vs hamstring"
            ),
            "Clinical Importance": (
                "Weakness → hip extensor dominance shift to hamstrings, anterior pelvic tilt patterns, "
                "reduced sprint power; relevant in low back and SI rehab"
            ),
            "Common Injuries": "Strain; contusion (hip pointer adjacent); enthesopathy near origin; post-injection neuropathy rare",
            "Rehabilitation": (
                "Pain-free isometrics → bridges → loaded thrusts → unilateral → plyometrics/sprint drills"
            ),
            "References": "Neumann DA. Distefano / Contreras EMG literature. Standring S. Gray's Anatomy.",
        },
    ),
    (
        "Gluteus Medius",
        {
            "ID": "HIP-MUS-02",
            "Name": "Gluteus medius",
            "Origin": "External ilium between posterior and anterior gluteal lines",
            "Insertion": "Lateral greater trochanter (broad footprint — anterior/middle/posterior facets)",
            "Innervation": "Superior gluteal nerve (L4-S1)",
            "Blood Supply": "Superior gluteal artery",
            "Fiber Direction": "Fan-shaped — anterior, middle, posterior fibers with distinct rotation roles",
            "Primary Action": "Hip abduction; pelvic leveling in single-leg stance",
            "Secondary Action": (
                "Anterior fibers: flexion/IR; posterior fibers: extension/ER (position-dependent)"
            ),
            "Stabilizing Function": "Primary frontal-plane pelvic stabilizer; controls femoral adduction/IR",
            "EMG": (
                "High in sidelying abduction, single-leg stance, pelvic drop control, "
                "single-leg squat; moderate in clamshells"
            ),
            "Trigger Points": "Lateral hip to buttock and posterior iliac crest referral — GTPS overlap",
            "Stretch": "Cross-body adduction in flexion; ITB/glute figure-4 (care if insertional pain)",
            "Strengthening": (
                "Sidelying abduction, hip hitches, band walks, single-leg stance endurance, step-downs"
            ),
            "Clinical Importance": "GTPS/gluteal tendinopathy; Trendelenburg gait; PFP kinetic chain",
            "Common Injuries": "Gluteal tendinopathy; partial tears at GT; enthesopathy; superior gluteal nerve injury (iatrogenic)",
            "Rehabilitation": (
                "Isometric abduction in slight hip abduction (Grimaldi-informed) → isotonic → "
                "functional single-leg → running return; reduce compressive adducted stretching early"
            ),
            "References": "Grimaldi A gluteal tendinopathy. Distefano LJ JOSPT EMG. Neumann DA.",
        },
    ),
    (
        "Gluteus Minimus",
        {
            "ID": "HIP-MUS-03",
            "Name": "Gluteus minimus",
            "Origin": "Ilium between anterior and inferior gluteal lines",
            "Insertion": "Anterior greater trochanter / capsule",
            "Innervation": "Superior gluteal nerve (L4-S1)",
            "Blood Supply": "Superior gluteal artery",
            "Fiber Direction": "Fan deep to medius — strong anterior IR component",
            "Primary Action": "Abduction and internal rotation; femoral head compression into acetabulum",
            "Secondary Action": "Assists flexion (anterior fibers)",
            "Stabilizing Function": "Intracapsular stabilizer; works with medius in frontal plane",
            "EMG": "Co-activates with medius in single-leg and abduction tasks",
            "Trigger Points": "Anterior-lateral hip referral into GT and groin occasionally",
            "Stretch": "Gentle extension-ER stretch variants — avoid aggressive if tendinopathy",
            "Strengthening": "Same closed-chain pelvic control as medius; IR control drills as indicated",
            "Clinical Importance": "Often concurrent pathology with medius in GTPS; femoral head stability",
            "Common Injuries": "Tendinopathy/tears with medius; enthesopathy",
            "Rehabilitation": "Integrated with glute med progressive loading and gait retraining",
            "References": "Semciw AI / Grimaldi A gluteal anatomy. Standring S. Gray's Anatomy. Neumann DA.",
        },
    ),
    (
        "Tensor Fasciae Latae (TFL)",
        {
            "ID": "HIP-MUS-04",
            "Name": "Tensor fasciae latae",
            "Origin": "ASIS and anterior iliac crest",
            "Insertion": "Iliotibial band → Gerdy's tubercle (lateral tibia)",
            "Innervation": "Superior gluteal nerve (L4-S1)",
            "Blood Supply": "Superior gluteal / ascending LCFA anastomoses",
            "Fiber Direction": "Vertical anterolateral thigh into ITB",
            "Primary Action": "Hip flexion, abduction, IR; tensions ITB",
            "Secondary Action": "Assists knee stability via ITB (extension moment when knee near extended)",
            "Stabilizing Function": "Anterolateral hip stabilizer; can dominate when glute med weak",
            "EMG": "High in flexion-abduction tasks and side-lying clam if form poor (compensation)",
            "Trigger Points": "Lateral hip/thigh referral; ITB-related lateral knee pain cascade",
            "Stretch": "Standing hip extension-adduction stretch; foam roll ITB adjunctive (evidence mixed)",
            "Strengthening": "Usually inhibit dominance — prioritize glute med/max; light abduction only if truly weak",
            "Clinical Importance": "Overactivity common in GTPS and PFP; ITB syndrome kinetic contributor",
            "Common Injuries": "Strain rare; more often myofascial overuse; snapping hip (external) with ITB",
            "Rehabilitation": "Reduce compressive load; strengthen glutes; gait/running cadence; soft-tissue as adjunct",
            "References": "Neumann DA. Grimaldi A. Magee DJ Orthopedic Physical Assessment.",
        },
    ),
    (
        "Iliopsoas",
        {
            "ID": "HIP-MUS-05",
            "Name": "Iliopsoas (iliacus + psoas major; psoas minor variable)",
            "Origin": (
                "Psoas major: T12-L5 vertebral bodies/discs and TPs. "
                "Iliacus: iliac fossa. Merge to common tendon."
            ),
            "Insertion": "Lesser trochanter of femur",
            "Innervation": (
                "Psoas: ventral rami L1-L3 (L2-L4 often cited). Iliacus: femoral nerve (L2-L3)"
            ),
            "Blood Supply": "Iliolumbar, obturator, external iliac / femoral branches",
            "Fiber Direction": "Passes under inguinal ligament over iliopectineal eminence — anterior hip",
            "Primary Action": "Primary hip flexor; lumbar stabilizer (psoas); anterior pelvic tilt contribution",
            "Secondary Action": "Slight ER of hip; ipsilateral lumbar side-bend (psoas)",
            "Stabilizing Function": "Anterior hip stabilizer in extension; lumbar segmental control role debated/nuanced",
            "EMG": "High in sit-up/hip flexion; active in late swing of gait to decelerate extension then flex",
            "Trigger Points": "Anterior groin, lumbar referral — differentiate from labral/FAI pain",
            "Stretch": (
                "Thomas stretch / half-kneeling hip flexor with posterior tilt — avoid lumbar extension substitute"
            ),
            "Strengthening": (
                "Short-lever hip flexion, standing marches, dead bug progressions with lumbar control; "
                "eccentrics for snapping hip when indicated"
            ),
            "Clinical Importance": (
                "Internal snapping hip (iliopsoas tendon); iliopsoas bursitis; "
                "post-THA anterior pain; contribution to lumbar lordosis patterns"
            ),
            "Common Injuries": "Strain; tendinopathy; lesser trochanter avulsion (youth); bursitis",
            "Rehabilitation": (
                "Load management of aggressive hip flexor stretching if insertional pain; "
                "progressive eccentric/concentric flexion; address FAI if mechanical snagging"
            ),
            "References": "Neumann DA. Standring S. Gray's Anatomy. Internal snapping hip clinical reviews.",
        },
    ),
    (
        "Sartorius",
        {
            "ID": "HIP-MUS-06",
            "Name": "Sartorius — longest muscle in body",
            "Origin": "ASIS",
            "Insertion": "Pes anserinus (proximal medial tibia)",
            "Innervation": "Femoral nerve (L2-L3)",
            "Blood Supply": "Femoral artery branches",
            "Fiber Direction": "Oblique across anterior thigh (lateral → medial)",
            "Primary Action": "Hip flexion, abduction, ER; knee flexion and tibial IR",
            "Secondary Action": "Tailor's position muscle; assists crossing leg",
            "Stabilizing Function": "Minor anteromedial dynamic support; more mobility than prime stability",
            "EMG": "Active in FABER-like motions and early swing",
            "Trigger Points": "Anterior thigh strip referral",
            "Stretch": "Extension-adduction-IR combined stretch carefully",
            "Strengthening": "FABER against resistance; step-ups; generally not primary rehab target",
            "Clinical Importance": "ASIS apophysitis/avulsion in adolescents; pes anserine pain differential",
            "Common Injuries": "Proximal avulsion; strain; contusion",
            "Rehabilitation": "Progressive loading after apophyseal injury per healing; kinetic chain hip-knee control",
            "References": "Standring S. Gray's Anatomy. Moore KL. Magee DJ.",
        },
    ),
    (
        "Rectus Femoris",
        {
            "ID": "HIP-MUS-07",
            "Name": "Rectus femoris (only biarticular quadriceps)",
            "Origin": (
                "Straight head: AIIS. Reflected head: superior acetabular rim / hip capsule"
            ),
            "Insertion": "Quadriceps tendon → patella → tibial tuberosity via patellar tendon",
            "Innervation": "Femoral nerve (L2-L4)",
            "Blood Supply": "LCFA descending branch; femoral perforators",
            "Fiber Direction": "Vertical anterior thigh — crosses hip and knee",
            "Primary Action": "Hip flexion and knee extension",
            "Secondary Action": "Anterior pelvic tilt influence",
            "Stabilizing Function": "Anterior hip restraint in extension; knee extensor mechanism",
            "EMG": "High in kicking, sprinting, jumping; AIIS stress in kicking sports",
            "Trigger Points": "Anterior thigh to knee referral",
            "Stretch": "Thomas / prone quad stretch with hip extension — protect lumbar spine",
            "Strengthening": "Short-arc quads, Spanish squat variants, Nordic progressions adjunct, kicking drills graded",
            "Clinical Importance": "AIIS avulsion; proximal tendinopathy; quadriceps strain (often mid-belly RF)",
            "Common Injuries": "Strain grades I-III; AIIS apophyseal injury; contusion/myositis ossificans risk",
            "Rehabilitation": (
                "POLICE/PEACE&LOVE principles → isometric → concentric → eccentric → "
                "sprint/kick return; imaging if rupture suspected"
            ),
            "References": "Brukner & Khan. Neumann DA. Standring S. Gray's Anatomy.",
        },
    ),
    (
        "Adductors (Hip Adductor Group)",
        {
            "ID": "HIP-MUS-08",
            "Name": (
                "Adductor group — adductor longus, brevis, magnus; gracilis; pectineus "
                "(functionally grouped)"
            ),
            "Origin": (
                "Pubic body/rami and ischiopubic ramus (magnus also ischial tuberosity — "
                "hamstring portion)"
            ),
            "Insertion": (
                "Linea aspera, medial supracondylar line, adductor tubercle (magnus); "
                "pes anserinus (gracilis); pectineal line (pectineus)"
            ),
            "Innervation": (
                "Obturator nerve (L2-L4) primarily; pectineus often femoral; "
                "hamstring portion of magnus tibial nerve"
            ),
            "Blood Supply": "Obturator artery; deep femoral / perforators; MCFA contributions",
            "Fiber Direction": "Medial thigh — oblique/vertical to linea aspera",
            "Primary Action": "Hip adduction",
            "Secondary Action": (
                "Flexion (anterior fibers/pectineus/longus); extension (magnus hamstring part); "
                "rotation position-dependent"
            ),
            "Stabilizing Function": (
                "Medial hip stabilizer in cutting; pelvic ring tension with abdominals "
                "(athletic pubalgia continuum)"
            ),
            "EMG": "High in cutting, side lunges, squeeze drills, skating strides",
            "Trigger Points": "Groin to medial thigh referral — Doha groin pain classification relevant",
            "Stretch": "Frog / butterfly / lateral lunge stretches — graded in osteitis pubis",
            "Strengthening": (
                "Isometric ball squeezes → Copenhagen adduction progression → "
                "lateral lunges → sport-specific change of direction"
            ),
            "Clinical Importance": (
                "Adductor-related groin pain; adductor longus enthesopathy; "
                "relationship to osteitis pubis / athletic pubalgia"
            ),
            "Common Injuries": "Adductor longus strain (most common); proximal enthesis injury; avulsion rare",
            "Rehabilitation": (
                "Doha-guided active rehab; Copenhagen protocol evidence for prevention/rehab; "
                "restore side-to-side strength symmetry before RTS"
            ),
            "References": (
                "Weir A et al. Doha agreement. Thorborg K / Serner A adductor literature. "
                "Neumann DA. Standring S."
            ),
        },
    ),
    (
        "Deep External Rotators",
        {
            "ID": "HIP-MUS-09",
            "Name": (
                "Deep external rotators — piriformis, gemellus superior/inferior, "
                "obturator internus/externus, quadratus femoris"
            ),
            "Origin": (
                "Pelvic surface of sacrum (piriformis); ischial spine/tuberosity (gemelli/QF); "
                "obturator membrane (OI/OE)"
            ),
            "Insertion": "Medial greater trochanter / trochanteric fossa (group insertions)",
            "Innervation": (
                "Nerve to piriformis (S1-S2); nerve to OI/gemellus superior; "
                "nerve to QF/gemellus inferior; obturator nerve (OE)"
            ),
            "Blood Supply": "Inferior gluteal, internal pudendal, MCFA anastomoses",
            "Fiber Direction": "Horizontal/oblique from pelvis through sciatic foramina to GT",
            "Primary Action": "External rotation (hip near extension); piriformis abducts flexed hip",
            "Secondary Action": "Femoral head centering; accessory extension/abduction fiber-dependent",
            "Stabilizing Function": "Short rotators compress femoral head — 'rotator cuff of the hip' analogy",
            "EMG": "Active in ER and fine rotational control; elevated tone in some pelvic pain cohorts",
            "Trigger Points": "Deep buttock; piriformis may refer like sciatica — deep gluteal syndrome differential",
            "Stretch": (
                "Figure-4 / FAIR carefully — avoid aggressive stretch if neural irritation or IFI"
            ),
            "Strengthening": "Band ER, side-lying clam (quality), isometric ER sets, functional rotational control",
            "Clinical Importance": (
                "Deep gluteal syndrome; ischiofemoral impingement (QF); "
                "pelvic floor sidewall link (OI); SI force closure contributors"
            ),
            "Common Injuries": "Myalgia/overactivity more than tear; QF edema in IFI; piriformis entrapment variants",
            "Rehabilitation": (
                "Differentiate underactive vs overactive; motor control + glute max/med; "
                "neural mobility if indicated; image if IFI suspected"
            ),
            "References": (
                "Martin HD deep gluteal syndrome. Standring S. Neumann DA. "
                "Ischiofemoral impingement MRI literature."
            ),
        },
    ),
    (
        "Hamstrings (Proximal)",
        {
            "ID": "HIP-MUS-10",
            "Name": (
                "Proximal hamstrings — biceps femoris long head, semitendinosus, "
                "semimembranosus (ischial origin complex)"
            ),
            "Origin": "Ischial tuberosity (conjoint tendon BF LH + ST; SM separate footprint)",
            "Insertion": (
                "Fibular head (BF); pes anserinus (ST); posterior medial tibial condyle (SM) — "
                "distal noted for kinetic chain"
            ),
            "Innervation": "Tibial portion of sciatic nerve (L5-S2) for these proximal hip extensors",
            "Blood Supply": "Inferior gluteal; perforating branches of deep femoral",
            "Fiber Direction": "Vertical posterior thigh from ischium",
            "Primary Action": "Hip extension and knee flexion; decelerate knee extension/hip flexion in swing",
            "Secondary Action": "Posterior pelvic tilt; tibial rotation fiber-dependent",
            "Stabilizing Function": "Eccentric control in late swing sprinting; sacral force closure via sacrotuberous link",
            "EMG": "Very high late-swing sprinting; Nordic curls; RDLs; bridging with knee more extended biases hamstrings",
            "Trigger Points": "Ischial and posterior thigh referral — screen sciatic nerve",
            "Stretch": "Supine SLR-based hamstring stretch with neural differentiation (slump/SLR)",
            "Strengthening": (
                "Isometrics at mid-length → Nordic progression → 45-deg hyperextensions → "
                "RDL → sprint drills"
            ),
            "Clinical Importance": (
                "Most common sprint muscle strain; proximal tendinopathy in runners/hockey; "
                "complete proximal avulsion needs urgent ortho opinion"
            ),
            "Common Injuries": (
                "Myofascial strain (BF LH classic); proximal free-tendon tear; "
                "ischial apophyseal avulsion (adolescents)"
            ),
            "Rehabilitation": (
                "BAMIC-informed imaging when available; progressive eccentric/lengthening; "
                "criteria-based RTS (strength symmetry, H-test, sprint mechanics)"
            ),
            "References": (
                "Askling C hamstring literature. British Athletics BAMIC. "
                "Brukner & Khan. Neumann DA."
            ),
        },
    ),
    (
        "Quadriceps (Hip-Crossing Components)",
        {
            "ID": "HIP-MUS-11",
            "Name": (
                "Hip-crossing quadriceps components — primarily rectus femoris; "
                "vastii influence knee but not hip directly (included for extensor mechanism context)"
            ),
            "Origin": "AIIS and acetabular rim (RF); vastii from femoral shaft (non-hip-crossing)",
            "Insertion": "Quadriceps tendon / patellar tendon complex",
            "Innervation": "Femoral nerve (L2-L4)",
            "Blood Supply": "LCFA; femoral artery branches",
            "Fiber Direction": "Anterior thigh vertical",
            "Primary Action": "RF: hip flexion + knee extension; vastii: knee extension only",
            "Secondary Action": "Shock absorption in landing via knee; anterior pelvic influence (RF)",
            "Stabilizing Function": "Patellofemoral and tibiofemoral control in squat/land; RF anterior hip check",
            "EMG": "High in jump landing, cut, squat, kick follow-through",
            "Trigger Points": "Anterior thigh to knee",
            "Stretch": "Prone quad / couch stretch with posterior pelvic tilt",
            "Strengthening": (
                "Squats, step-downs, Spanish squats, terminal knee extension; "
                "RF-specific hip flexion when hip flexor weakness isolated"
            ),
            "Clinical Importance": (
                "Landing mechanics ACL risk context; RF strain in kicking sports; "
                "extensor lag after knee injury affecting hip strategy"
            ),
            "Common Injuries": "RF strain; contusion; tendinopathy at quad tendon (more knee)",
            "Rehabilitation": "Progressive closed-chain loading; address hip-knee coupling; sport-specific decelerations",
            "References": "Neumann DA. Brukner & Khan. Escamilla squat EMG literature.",
        },
    ),
]


# ---------------------------------------------------------------------------
# 5. Tendons
# ---------------------------------------------------------------------------

TENDON_RECORDS: list[tuple[str, dict[str, Any]]] = [
    (
        "Gluteus Medius / Minimus Tendons",
        {
            "ID": "HIP-TEN-01",
            "Tendon": "Gluteus medius and minimus insertional tendons at greater trochanter",
            "Muscle": "Gluteus medius and gluteus minimus",
            "Insertion": (
                "Lateral, superoposterior, and anterior facets of greater trochanter "
                "(facet-specific footprints)"
            ),
            "Blood Supply": "Superior gluteal artery periosteal/retinacular branches — insertional zone watershed risk",
            "Biomechanics": "Transmit abductor torque; compressive wrapping under ITB in adduction increases tendon load",
            "Common Injuries": "Gluteal tendinopathy; partial articular-side tears; full-thickness tears (older adults)",
            "Ultrasound": "First-line for insertional thickening, tears, bursal fluid; dynamic assessment possible",
            "MRI": "Gold standard for tear grading, muscle atrophy/fatty infiltration, differential GTPS causes",
            "Treatment": (
                "Education (avoid aggressive stretching/adduction compression early); isometrics; "
                "graded loading; CSI selective; surgery rare for irreparable tears with atrophy"
            ),
            "Exercises": "Isometric abduction; sidelying abduction with pillow; hip hitches; functional single-leg",
            "Rehabilitation": "Grimaldi-style progressive tendon loading 12+ weeks typical; gait retraining",
            "References": "Grimaldi A et al. Gluteal tendinopathy. Connell D imaging. Fearon A clinical works.",
        },
    ),
    (
        "Iliopsoas Tendon",
        {
            "ID": "HIP-TEN-02",
            "Tendon": "Iliopsoas (conjoint) tendon",
            "Muscle": "Iliacus and psoas major",
            "Insertion": "Lesser trochanter",
            "Blood Supply": "Branches from iliolumbar, obturator, femoral circumflex anastomoses",
            "Biomechanics": (
                "Snaps over iliopectineal eminence / femoral head in internal snapping; "
                "high flexion loads in sprinting/kicking"
            ),
            "Common Injuries": "Tendinopathy; internal coxa saltans; post-THA irritation; lesser trochanter avulsion (youth)",
            "Ultrasound": "Dynamic visualization of snapping; guided injection into iliopsoas bursa",
            "MRI": "Tendon edema, bursitis, lesser trochanter pathology; assess for concurrent FAI labral disease",
            "Treatment": "Activity modification; PT; US-guided bursal injection; rare endoscopic release",
            "Exercises": "Eccentric hip flexor control; pelvic tilt coordination; graded sprint/kick volume",
            "Rehabilitation": "Address lumbar-pelvic control; avoid chronic aggressive end-range stretch if insertional",
            "References": "Internal snapping hip reviews. Standring S. Yen YM / Byrd JW hip arthroscopy contexts.",
        },
    ),
    (
        "Proximal Hamstring Tendons",
        {
            "ID": "HIP-TEN-03",
            "Tendon": "Proximal hamstring complex (conjoint BF LH–ST and semimembranosus tendons)",
            "Muscle": "Biceps femoris long head, semitendinosus, semimembranosus",
            "Insertion": "Ischial tuberosity footprints (distinct SM vs conjoint)",
            "Blood Supply": "Inferior gluteal and medial circumflex / perforator contributions — watershed near free tendon",
            "Biomechanics": "High eccentric load late swing; compressive load in deep hip flexion sitting/stretching",
            "Common Injuries": "Proximal tendinopathy; partial tearing; complete avulsion with retraction",
            "Ultrasound": "Useful for tendinopathy and some tears; operator-dependent for retraction measurement",
            "MRI": "Preferred for tear extent, retraction, sciatic nerve scar relationship",
            "Treatment": (
                "Tendinopathy: progressive loading, sit modification. "
                "Complete proximal avulsion: early ortho — surgery often if significant retraction/active athlete"
            ),
            "Exercises": "Isometrics → heavy slow resistance → Nordics/RDL → sprint mechanics",
            "Rehabilitation": "Long timeline for proximal free-tendon; criteria-based RTS testing",
            "References": "Askling C. Goom T proximal hamstring tendinopathy. BAMIC guidelines.",
        },
    ),
    (
        "Adductor Longus Tendon / Enthesis",
        {
            "ID": "HIP-TEN-04",
            "Tendon": "Adductor longus proximal tendon and pubic enthesis",
            "Muscle": "Adductor longus",
            "Insertion": "Pubic body / inferior to pubic crest — fibrocartilaginous enthesis",
            "Blood Supply": "Obturator and external pudendal / femoral branches",
            "Biomechanics": "High load in cutting and skating; shares pubic stress with contralateral adductors/abdominals",
            "Common Injuries": "Enthesopathy; acute proximal strain/tear; athletic pubalgia overlap",
            "Ultrasound": "Thickening, hyperemia (Doppler), partial fiber disruption",
            "MRI": "Pubic bone marrow edema patterns; secondary cleft sign; associated rectus abdominis aponeurosis injury",
            "Treatment": "Active rehab per Doha; CSI rarely curative alone; surgery selected chronic cases",
            "Exercises": "Copenhagen progression; isometric squeezes; multiplanar cutting graded",
            "Rehabilitation": "Restore adductor strength ratio vs abductors; sport-specific COD before RTS",
            "References": "Weir A Doha agreement. Thorborg K. Serner A adductor injury MRI studies.",
        },
    ),
    (
        "Rectus Femoris Proximal Tendons",
        {
            "ID": "HIP-TEN-05",
            "Tendon": "Rectus femoris direct (AIIS) and reflected (acetabular) heads",
            "Muscle": "Rectus femoris",
            "Insertion": "Merge into RF muscle then quadriceps tendon distally",
            "Blood Supply": "LCFA ascending/descending branches",
            "Biomechanics": "Kicking and sprint hip flexion with knee extension — dual tensile demand",
            "Common Injuries": "AIIS avulsion; proximal myotendinous strain; reflected head injury near hip",
            "Ultrasound": "Dynamic and static assessment of proximal RF; avulsion hematoma",
            "MRI": "Defines intramuscular degloving (characteristic RF injury patterns) and apophyseal injury",
            "Treatment": "Most strains conservative; displaced AIIS avulsion may need ortho review",
            "Exercises": "Graded hip flexion and eccentric quad-hip coupling; kicking volume control",
            "Rehabilitation": "Progress through pain-free kicking distances; sprint return last",
            "References": "Kassarjian A RF injury imaging. Brukner & Khan. Standring S.",
        },
    ),
]


# ---------------------------------------------------------------------------
# 6. Bursae
# ---------------------------------------------------------------------------

BURSA_RECORDS: list[tuple[str, dict[str, Any]]] = [
    (
        "Greater Trochanteric Bursa",
        {
            "ID": "HIP-BUR-01",
            "Bursa": (
                "Trochanteric bursae complex — subgluteus maximus (trochanteric) bursa most discussed; "
                "also subgluteus medius/minimus bursae"
            ),
            "Location": "Between GT / gluteal insertions and ITB–gluteus maximus",
            "Function": "Reduce friction of ITB and glute tendons over greater trochanter",
            "Clinical Importance": (
                "Pain lateral hip — historically 'trochanteric bursitis'; modern view often "
                "gluteal tendinopathy primary with secondary bursal reaction (GTPS)"
            ),
            "Common Pathologies": "Bursitis secondary to tendinopathy, trauma, or inflammatory disease; calcific rare",
            "Imaging": (
                "US: bursal fluid, tendon tears. MRI: bursal T2 signal, tendon pathology, "
                "differentiate from referred lumbar pain"
            ),
            "Treatment": (
                "Load management and tendon loading program primary; short-term NSAID; "
                "CSI may help pain but address tendon drivers; avoid sleep-on-side compression"
            ),
            "Rehabilitation": "Grimaldi GTPS protocol principles; abductor progressive loading; gait/running cues",
            "References": "Grimaldi A / Fearon A GTPS. Board TN trochanteric pain reviews.",
        },
    ),
    (
        "Iliopsoas Bursa",
        {
            "ID": "HIP-BUR-02",
            "Bursa": "Iliopsoas (iliopectineal) bursa — largest bursa around hip",
            "Location": (
                "Between iliopsoas tendon and anterior hip capsule / iliopectineal eminence; "
                "may communicate with hip joint in adults (~15% classically cited — variable)"
            ),
            "Function": "Reduce friction of iliopsoas over anterior capsule and eminence",
            "Clinical Importance": "Anterior groin pain differential with labral tear, OA, athletic pubalgia",
            "Common Pathologies": (
                "Iliopsoas bursitis; enlargement with RA/OA; internal snapping association; "
                "post-THA irritation"
            ),
            "Imaging": "US-guided assessment/injection; MRI for bursal distension and concurrent joint disease",
            "Treatment": "Activity modification; PT; US-guided aspiration/injection; treat underlying FAI/OA",
            "Rehabilitation": "Hip flexor load management; pelvic control; graded return to running/kicking",
            "References": "Standring S. Gray's Anatomy. Iliopsoas bursitis imaging reviews. Byrd JW hip scopes.",
        },
    ),
    (
        "Ischial Bursa",
        {
            "ID": "HIP-BUR-03",
            "Bursa": "Ischial (ischiogluteal) bursa",
            "Location": "Between ischial tuberosity and gluteus maximus — sitting surface",
            "Function": "Cushioning during sitting; reduce friction near hamstring origin",
            "Clinical Importance": (
                "Weaver's bottom — pain with sitting; differentiate proximal hamstring tendinopathy "
                "and pudendal pain"
            ),
            "Common Pathologies": "Ischial bursitis after prolonged sitting or trauma; chronic sitting occupations/sports",
            "Imaging": "MRI/US when needed to differentiate bursitis vs hamstring enthesopathy vs tumor (rare)",
            "Treatment": "Sitting load modification (cushion); activity adjustment; rare injection; address training errors",
            "Rehabilitation": "Graded sitting tolerance; proximal hamstring loading if concurrent tendinopathy; glute strength",
            "References": "Magee DJ. Brukner & Khan. Standring S. Gray's Anatomy.",
        },
    ),
]


# ---------------------------------------------------------------------------
# 7. Blood supply
# ---------------------------------------------------------------------------

BLOOD_RECORDS: list[tuple[str, dict[str, Any]]] = [
    (
        "Superior Gluteal Artery",
        {
            "ID": "HIP-ART-01",
            "Artery": "Superior gluteal artery",
            "Origin": "Posterior division of internal iliac artery",
            "Branches": "Superficial and deep branches within gluteal region after exiting greater sciatic foramen above piriformis",
            "Structures Supplied": (
                "Gluteus maximus (superficial branch); gluteus medius/minimus and TFL (deep branch); "
                "hip bone periosteum; contributions to hip joint anastomoses"
            ),
            "Venous Drainage": "Superior gluteal veins to internal iliac venous system",
            "Clinical Importance": (
                "At risk in posterior approaches; landmark with superior gluteal nerve; "
                "bleeding source in pelvic trauma; intramuscular injection quadrant awareness"
            ),
            "Imaging": "CTA/angiography in trauma; Doppler US limited deep gluteal detail",
            "References": "Standring S. Gray's Anatomy. Moore KL. Pelvic trauma vascular chapters.",
        },
    ),
    (
        "Inferior Gluteal Artery",
        {
            "ID": "HIP-ART-02",
            "Artery": "Inferior gluteal artery",
            "Origin": "Anterior division of internal iliac artery",
            "Branches": "Muscular branches; anastomotic rami; companion to inferior gluteal nerve/sciatic region",
            "Structures Supplied": (
                "Gluteus maximus; short external rotators; upper hamstrings; "
                "contributions to cruciate anastomosis of thigh"
            ),
            "Venous Drainage": "Inferior gluteal veins → internal iliac",
            "Clinical Importance": (
                "Exits greater sciatic foramen below piriformis; relevant in deep gluteal surgery "
                "and sciatic nerve exposure"
            ),
            "Imaging": "CTA in pelvic bleeding; anatomic variation awareness",
            "References": "Standring S. Gray's Anatomy. Moore KL Clinically Oriented Anatomy.",
        },
    ),
    (
        "Medial Circumflex Femoral Artery",
        {
            "ID": "HIP-ART-03",
            "Artery": "Medial circumflex femoral artery (MCFA)",
            "Origin": "Typically deep femoral artery (profunda femoris); occasionally femoral artery directly",
            "Branches": (
                "Ascending, descending, deep, and transverse branches; deep branch gives retinacular "
                "vessels to femoral head (critical posterior-superior retinacular group)"
            ),
            "Structures Supplied": (
                "Primary blood supply to adult femoral head/neck; adductors; "
                "contributions to cruciate anastomosis"
            ),
            "Venous Drainage": "Medial circumflex femoral veins to deep femoral / femoral veins",
            "Clinical Importance": (
                "Injury in femoral neck fracture, hip dislocation, or surgical approaches → "
                "avascular necrosis risk; preserve in fracture fixation and arthroplasty planning"
            ),
            "Imaging": "CTA/MRA when vascularity questioned; MRI for AVN staging (Ficat/ARCO systems)" ,
            "References": (
                "Gautier E et al. Anatomy of MCFA. Kalhor M et al. Femoral head blood supply. "
                "Standring S. Gray's Anatomy."
            ),
        },
    ),
    (
        "Lateral Circumflex Femoral Artery",
        {
            "ID": "HIP-ART-04",
            "Artery": "Lateral circumflex femoral artery (LCFA)",
            "Origin": "Deep femoral artery (usually)",
            "Branches": "Ascending, transverse, descending branches",
            "Structures Supplied": (
                "Vastus lateralis and anterior thigh; trochanteric region; "
                "lesser contribution to femoral head vs MCFA in adults; descending branch used in ALT flap"
            ),
            "Venous Drainage": "LCFA venae comitantes to profunda/femoral veins",
            "Clinical Importance": (
                "Anterior approach and soft-tissue flap planning; trochanteric anastomosis participant; "
                "descending branch landmark in anterolateral thigh"
            ),
            "Imaging": "Doppler/CTA for flap perforators; trauma angiography",
            "References": "Standring S. Gray's Anatomy. Moore KL. Plastic surgery ALT flap anatomy texts.",
        },
    ),
    (
        "Obturator Artery",
        {
            "ID": "HIP-ART-05",
            "Artery": "Obturator artery",
            "Origin": "Anterior division of internal iliac (typical); may anastomose with inferior epigastric (corona mortis)",
            "Branches": "Anterior and posterior branches around obturator foramen; acetabular branch → artery of ligamentum teres",
            "Structures Supplied": (
                "Adductor compartment; obturator externus; acetabulum; "
                "femoral head contribution via ligamentum teres (minor in adults, important in children)"
            ),
            "Venous Drainage": "Obturator veins to internal iliac",
            "Clinical Importance": (
                "Corona mortis variant — hemorrhage risk in pelvic surgery/hernia repair; "
                "acetabular fracture fixation bleeding"
            ),
            "Imaging": "CTA to map corona mortis before pelvic ring/acetabular surgery",
            "References": "Standring S. Gray's Anatomy. Corona mortis anatomic studies. Moore KL.",
        },
    ),
    (
        "Femoral Artery",
        {
            "ID": "HIP-ART-06",
            "Artery": "Femoral artery (common femoral at hip region)",
            "Origin": "Continuation of external iliac artery distal to inguinal ligament",
            "Branches": (
                "Superficial epigastric, superficial circumflex iliac, superficial/deep external pudendal; "
                "profunda femoris (deep femoral) arises in femoral triangle giving MCFA/LCFA/perforators"
            ),
            "Structures Supplied": (
                "Anterior thigh via profunda; superficial branches to skin/inguinal region; "
                "entire lower limb downstream"
            ),
            "Venous Drainage": "Femoral vein (medial to artery in mid triangle — NAVEL mnemonic at inguinal)" ,
            "Clinical Importance": (
                "Pulse landmark midway ASIS–pubic symphysis; catheterization access; "
                "injury in penetrating trauma; relationship to iliopsoas and femoral nerve in triangle"
            ),
            "Imaging": "Duplex US; CTA runoff; angiography",
            "References": "Standring S. Gray's Anatomy. Moore KL. Vascular surgery access anatomy.",
        },
    ),
]


# ---------------------------------------------------------------------------
# 8. Biomechanics
# ---------------------------------------------------------------------------

def bio(
    id_: str,
    movement: str,
    plane: str,
    axis: str,
    primary: str,
    secondary: str,
    stabilizers: str,
    arthro: str,
    osteo: str,
    jrf: str,
    emg: str,
    torque: str,
    compensations: str,
    dysfunctions: str,
    functional: str,
    sport: str,
    assessment: str,
    corrective: str,
) -> dict[str, Any]:
    return {
        "ID": id_,
        "Movement": movement,
        "Plane": plane,
        "Axis": axis,
        "Primary Movers": primary,
        "Secondary Movers": secondary,
        "Stabilizers": stabilizers,
        "Arthrokinematics": arthro,
        "Osteokinematics": osteo,
        "Joint Reaction Forces": jrf,
        "EMG": emg,
        "Torque": torque,
        "Compensations": compensations,
        "Common Dysfunctions": dysfunctions,
        "Functional Activities": functional,
        "Sport Applications": sport,
        "Assessment": assessment,
        "Corrective Exercises": corrective,
        "References": "Neumann DA. Kinesiology. Magee DJ. Brukner & Khan. Escamilla / Distefano EMG as applicable.",
    }


BIOMECHANICS_RECORDS: list[tuple[str, dict[str, Any]]] = [
    (
        "Hip Flexion",
        bio(
            "HIP-BIO-01", "Hip flexion", "Sagittal", "Mediolateral through femoral head",
            "Iliopsoas, rectus femoris, sartorius, TFL",
            "Adductor longus/pectineus (from extension), anterior glute med/min",
            "Deep rotators for head centering; abdominals for pelvic control",
            "Femoral head spins posteriorly relative to acetabulum (convex-on-concave); inferior glide accessory with flexion",
            "0 to ~120 deg pure flexion (soft-tissue dependent); more with knee flexed (RF slack)",
            "JRF rises with active flexion against load; anterior capsule slackens",
            "High iliopsoas/RF EMG in marches, kicks, high knees",
            "Hip flexor MA greatest mid-range; RF dual hip-knee torque tradeoff",
            "Lumbar extension substitution; anterior pelvic tilt; hip hike",
            "FAI pinching in deep flexion+IR; iliopsoas tendinopathy; flexion contracture",
            "Sit-to-stand initiation, stair ascent, swing phase",
            "Sprinting knee drive, kicking cocking, hurdling",
            "Thomas test; AROM/PROM flexion; FADIR for symptom reproduction",
            "Dead bugs, marches with posterior tilt, graded hip flexor loading, mobility if true length deficit",
        ),
    ),
    (
        "Hip Extension",
        bio(
            "HIP-BIO-02", "Hip extension", "Sagittal", "Mediolateral through femoral head",
            "Gluteus maximus, hamstrings (esp. magnus hamstring part)",
            "Posterior glute med; adductor magnus",
            "Abductors for frontal control; core for pelvic neutral",
            "Femoral head spins anteriorly; superior accessory tendencies with end-range",
            "~10-20 deg beyond neutral typical; limited by iliofemoral ligament",
            "High JRF in terminal stance and loaded hinge; posterior structures taut",
            "High glute max EMG in thrusts, sprint propulsion, climbing",
            "Glute max large CSA — high extension torque capacity",
            "Lumbar extension; hamstring dominance; knee flexion substitute",
            "Extensor weakness; hanging on Y-ligament; sprint-related hamstring risk",
            "Gait propulsion, rising from chair, climbing",
            "Sprinting, jumping takeoff, Olympic lifts lockout",
            "Prone extension MMT; bridge quality; gait terminal stance",
            "Hip thrusts, RDLs, step-ups, sprint mechanics drills",
        ),
    ),
    (
        "Hip Abduction",
        bio(
            "HIP-BIO-03", "Hip abduction", "Frontal", "Anteroposterior through femoral head",
            "Gluteus medius, gluteus minimus, TFL",
            "Piriformis (flexed hip), sartorius, upper glute max",
            "Contralateral trunk musculature in closed chain; QL may hike pelvis",
            "Femoral head rolls superior / glides inferior (convex-on-concave)",
            "~40-45 deg typical open-chain abduction",
            "Single-leg stance JRF often 2.5-4x BW classically cited (Pauwels/Bergmann ranges vary)",
            "High glute med EMG in sidelying abduction and pelvic drop control",
            "Abductor torque critical to counter contralateral pelvic drop moment",
            "Hip hike (QL); TFL dominance; trunk lean",
            "Trendelenburg; GTPS; contralateral pelvic drop in running",
            "Single-leg stance, side-stepping, getting out of car",
            "Cutting, skating, lateral agility",
            "Trendelenburg sign; sidelying MMT; single-leg stance endurance",
            "Hip hitches, sidelying ABD, band walks, step-downs",
        ),
    ),
    (
        "Hip Adduction",
        bio(
            "HIP-BIO-04", "Hip adduction", "Frontal", "Anteroposterior through femoral head",
            "Adductor magnus, longus, brevis; gracilis; pectineus",
            "Lower glute max; QF; hamstrings (accessory)",
            "Ipsilateral abductors eccentrically control; pelvic ring abdominal coupling",
            "Femoral head rolls inferior / glides superior",
            "~20-30 deg past midline typical",
            "High adductor demand in COD; pubic stress with repetitive load",
            "High adductor EMG in Copenhagen, squeeze, skating",
            "Adductor longus common strain site under eccentric lengthening",
            "Scissoring gait; crossing midline collapse in squat",
            "Adductor-related groin pain; osteitis pubis continuum",
            "Crossing legs, side-lying bed mobility, horse riding",
            "Soccer kick plant, skating push recovery, rugby scrum binding",
            "Squeeze tests; Copenhagen capacity; Doha groin classification",
            "Isometric squeezes → Copenhagen progression → COD drills",
        ),
    ),
    (
        "Hip Internal Rotation",
        bio(
            "HIP-BIO-05", "Hip internal rotation", "Transverse", "Longitudinal through femoral head/shaft",
            "Anterior glute med/min, TFL; adductors position-dependent",
            "Semitendinosus/semimembranosus at knee influence limb IR cascade",
            "Deep ERs eccentrically control IR in closed chain",
            "Spin with small accessory glides; capsule posterior structures restrain IR in flexion",
            "~30-40 deg typical (large individual variation; anteversion dependent)",
            "IR in flexion increases anterior/superior labral stress in cam FAI",
            "TFL/anterior glute EMG in IR tasks",
            "IR torque smaller than ER group aggregate in many positions",
            "Femoral IR collapse (dynamic valgus) in landing",
            "FAI pain with FAdIR; excessive IR from anteversion",
            "Pivoting, change of direction",
            "Golf follow-through, dance turnout opposite demand, cutting",
            "Seated/prone IR ROM; FADIR; single-leg step-down IR quality",
            "Deep ER strength; glute med posterior fibers; landing mechanics",
        ),
    ),
    (
        "Hip External Rotation",
        bio(
            "HIP-BIO-06", "Hip external rotation", "Transverse", "Longitudinal through femoral head/shaft",
            "Gluteus maximus, piriformis, OI, gemelli, QF, obturator externus",
            "Posterior glute med; sartorius",
            "Abductors and pelvic floor sidewall (OI) for combined stability",
            "Spin; anterior capsule/iliofemoral restrain ER extremes",
            "~40-60 deg typical (position and bony version dependent)",
            "ER strength protects against dynamic valgus; deep ERs center head",
            "High deep ER and glute max EMG in clam/ER band work and cutting",
            "Glute max large ER torque contributor especially in extension",
            "Lumbar rotation substitute; hip flexion substitute in clam",
            "Deep gluteal pain; ER weakness with ACL/PFP risk cascade",
            "Getting out of car, pivoting",
            "Dance turnout, martial arts kicks, cutting sports",
            "Prone ER MMT; sidelying clam quality; FABER ROM",
            "Band ER, clam progressions, glute max hinges, rotational control chops",
        ),
    ),
    (
        "Squat",
        bio(
            "HIP-BIO-07", "Squat pattern (bilateral sit-to-stand loading)",
            "Multiplanar (dominant sagittal)", "Instantaneous hip-knee-ankle axes",
            "Glute max, quadriceps; hamstrings co-contract",
            "Adductors in deep squat; erectors for trunk",
            "Glute med for knee alignment; core canister",
            "Increasing hip flexion with femoral posterior spin/relative glide needs; depth limited by FAI/bony morphology",
            "Hip flexion, knee flexion, ankle DF coupled",
            "Hip JRF substantial at depth; varies with trunk lean and bar position",
            "Quad vs glute bias depends on depth and trunk angle",
            "Extensor torques shared hip-knee; moment arms shift with depth",
            "Knee valgus; heel rise; lumbar flexion; hip shift asymmetry",
            "FAI pinching deep squat; adductor strain; posterior chain weakness",
            "Chair rise, toileting, lifting preparation",
            "Weightlifting, team sport strength training",
            "Bodyweight squat screen; overhead squat; pain mapping depth",
            "Box squat to tolerable depth; tempo; glute bias hinges; mobility only if true limit",
        ),
    ),
    (
        "Deadlift",
        bio(
            "HIP-BIO-08", "Deadlift / hip hinge",
            "Sagittal dominant", "Hip mediolateral axis primary",
            "Glute max, hamstrings, adductor magnus; erector spinae isometric",
            "Lats for bar path; quads off floor",
            "Abdominal brace; scapular stability",
            "Hip flexion-extension arc with relatively stable knees vs squat",
            "Hip hinge osteokinematics — vertical shin more than squat",
            "High hip extensor demand; lumbar shear if rounded under load",
            "High posterior chain EMG; technique-dependent lumbar erector load",
            "Hip extension torque primary after bar passes knees",
            "Lumbar flexion; bar drift; hyperextension lockout",
            "Hamstring strain risk with poor progression; lumbar pain from hinge fault",
            "Picking objects from floor",
            "Powerlifting, strongman, field sport strength",
            "Hip hinge screen; RDL capacity; pain with load",
            "Dowel hinge, RDL, block pulls, tempo deadlifts",
        ),
    ),
    (
        "Running",
        bio(
            "HIP-BIO-09", "Running",
            "Multiplanar", "Cyclical multi-joint axes",
            "Glute max propulsion; iliopsoas swing; glute med stance stability",
            "Hamstrings late-swing deceleration; adductors COD",
            "Pelvic floor/core canister; foot-ankle stiffness cascade",
            "Rapid flexion-extension with rotation and slight abd/add oscillations",
            "Flight phase + stance; step rate/length tradeoff",
            "Peak hip contact forces often several × BW (instrumented prosthesis data vary by speed)",
            "Burst patterns per phase — see literature phase plots",
            "High power requirements with speed; abductor moments each stance",
            "Overstride; contralateral pelvic drop; hip IR collapse; crossover gait",
            "GTPS, proximal hamstring tendinopathy, FAI flare, stress fracture risk",
            "Fitness running, field locomotion",
            "All running sports; sprint events highest hamstring demand",
            "Gait video; pelvic drop; cadence; pain localization",
            "Cadence cues, run-walk, hip abductor endurance, graded exposure",
        ),
    ),
    (
        "Walking",
        bio(
            "HIP-BIO-10", "Walking gait — hip contribution",
            "Multiplanar", "Cyclical",
            "Iliopsoas swing flexion; glute max early stance; abductors midstance",
            "Hamstrings terminal swing; adductors brief",
            "Glute med critical single-limb support",
            "Extension to ~10 deg terminal stance; flexion ~30 deg swing",
            "Normal gait ROM substantially less than available PROM",
            "Hip JRF ~2.5-4× BW typical walking citations (varies)",
            "Phasic low-moderate EMG vs running",
            "Abductor moment sustains contralateral pelvis",
            "Trendelenburg; vaulting; shortened step length; antalgic lean",
            "OA limited extension; abductor weakness; leg-length compensation",
            "Community ambulation, ADLs",
            "Base for return-to-run progressions",
            "Observational gait; timed walking; Trendelenburg",
            "Gait drill, assistive device as needed, abductor endurance, extension mobility",
        ),
    ),
    (
        "Single-Leg Stance",
        bio(
            "HIP-BIO-11", "Single-leg stance",
            "Frontal dominant + multiplanar sway", "Hip joint center",
            "Gluteus medius/minimus isometric/eccentric",
            "TFL, upper glute max, deep rotators",
            "Trunk position modulates demand — contralateral load increases abductor demand",
            "Minimal osteokinematic motion if stable; micro-adjustments continuous",
            "Pelvis level target; femur stacked over foot",
            "High sustained JRF — classic teaching model for cane use (ipsilateral cane reduces demand)",
            "High continuous glute med EMG",
            "Abductor torque ≈ body weight × lever to contralateral COM line",
            "Trunk lean over stance; pelvic drop; toe gripping",
            "GTPS, Trendelenburg gait, PGP, balance disorders",
            "Dressing, stairs pause, reaching",
            "Skating, kicking plant limb, landing hold",
            "SLS time/quality; pelvic landmarks; eyes open/closed",
            "Hip hitches, SLS holds, step-downs, suitcase carries",
        ),
    ),
    (
        "Jumping",
        bio(
            "HIP-BIO-12", "Jump takeoff",
            "Sagittal dominant", "Multi-joint",
            "Glute max, quads, plantarflexors triple extension",
            "Hamstrings co-contraction; adductors",
            "Core stiffness for force transfer",
            "Rapid hip extension from flexed countermovement",
            "Countermovement then propulsion",
            "Peak forces high — multiple × BW",
            "Explosive glute/quad EMG burst",
            "Hip extension power key to jump height",
            "Excessive forward lean; knee dominant only; asymmetric push",
            "Proximal hamstring or RF strain if unprepared",
            "Jumping to reach, hop sports",
            "Basketball, volleyball, athletics",
            "CMJ / hop testing when appropriate",
            "Progressive plyometric ladder after strength base",
        ),
    ),
    (
        "Landing",
        bio(
            "HIP-BIO-13", "Jump landing / deceleration",
            "Multiplanar", "Multi-joint",
            "Eccentric quads, glutes; hip extensors absorb",
            "Hamstrings; abductors control valgus",
            "Trunk and foot position dictate hip demand",
            "Rapid flexion with controlled IR/abd moments",
            "Soft landing increases hip-knee flexion excursion",
            "Very high transient JRF and soft-tissue loads",
            "High eccentric EMG in glute med/max and quads",
            "Frontal-plane moments linked to ACL injury risk cascade",
            "Stiff landing; dynamic valgus; contralateral pelvic drop",
            "ACL risk pattern; GTPS flare; patellofemoral pain",
            "Drop landing, cutting deceleration",
            "All jump-land sports; change of direction",
            "Drop-jump assessment; 2D frontal plane projection angle",
            "Soft-land cues, hip strategy, single-leg land progressions",
        ),
    ),
    (
        "Kicking",
        bio(
            "HIP-BIO-14", "Kicking (instep / side-foot models)",
            "Multiplanar — sagittal dominant swing limb", "Hip and knee axes",
            "Iliopsoas and RF swing limb acceleration; plant-limb glute med stability",
            "Adductors in side-foot; trunk rotators",
            "Plant-limb single-leg stance stabilizers critical",
            "Swing hip rapid flexion with rotation; end-range stress on AIIS/RF",
            "Approach angle changes plane demands",
            "High swing-limb velocity — RF and hip flexor peak loads",
            "RF and iliopsoas high toward ball contact; plant limb abductor high",
            "Large hip flexion torque on swing limb; large frontal torque on plant limb",
            "Lumbar side-bend; plant-foot crash; poor follow-through control",
            "RF strain, AIIS apophysitis, adductor strain, plant-limb GTPS",
            "Ball striking in soccer/football/martial arts",
            "Soccer, rugby place kicking, martial arts",
            "Kicking pain map; plant-limb SLS; RF strength/flexibility",
            "Graded kicking distances; RF and adductor capacity; plant-limb strength",
        ),
    ),
]


EVIDENCE_RECORDS: list[tuple[str, dict[str, Any]]] = [
    (
        "Key Evidence and Guidelines — Hip Module",
        {
            "ID": "HIP-EVID-01",
            "Topic": "Foundational references for Kinora hip AI orientation",
            "Anatomy": "Standring S. Gray's Anatomy. Moore KL et al. Clinically Oriented Anatomy. Netter FH. Atlas.",
            "Biomechanics": "Neumann DA. Kinesiology of the Musculoskeletal System. Instrumented hip force literature (Bergmann et al.).",
            "FAI / Labrum": "Ganz R et al. FAI. Griffin DR et al. Warwick Agreement on FAI syndrome. Clohisy JC radiographic standards.",
            "GTPS": "Grimaldi A et al. Gluteal tendinopathy / GTPS clinical and loading evidence.",
            "Groin": "Weir A et al. Doha agreement meeting on terminology and definitions of groin pain in athletes.",
            "Vascular / AVN": "Gautier E, Kalhor M et al. MCFA and femoral head blood supply anatomic studies.",
            "Assessment": "Magee DJ. Orthopedic Physical Assessment. Brukner & Khan Clinical Sports Medicine.",
            "AI Use Note": (
                "ROM values, JRF multiples, and test properties are approximate and study-dependent. "
                "Prefer current imaging/surgical protocols and individual assessment over static recall."
            ),
            "References": "See fields above.",
        },
    ),
]


TOC_SECTIONS = [
    "Disclaimer",
    "1. Hip Bones (Femur, Acetabulum)",
    "2. Acetabular Labrum",
    "3. Hip Ligaments (Iliofemoral, Pubofemoral, Ischiofemoral, Ligamentum Teres)",
    "4. Hip Muscles",
    "5. Tendons",
    "6. Bursae (Trochanteric, Iliopsoas, Ischial)",
    "7. Blood Supply",
    "8. Hip Biomechanics (Planes of Motion + Functional Patterns)",
    "9. Evidence and Guidelines",
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
        title="Kinora Hip AI Orientation Part 7",
        author="Kinora AI Training",
    )
    styles = build_styles()
    story: list = []

    story.append(Spacer(1, 1.2 * inch))
    story.append(Paragraph("Kinora Hip", styles["title"]))
    story.append(Paragraph("Clinical AI Orientation (Part 7)", styles["title"]))
    story.append(Spacer(1, 0.3 * inch))
    story.append(Paragraph(
        "Structured reference for RAG / AI-assisted physiotherapy consultation",
        styles["subtitle"],
    ))
    story.append(Spacer(1, 0.2 * inch))
    story.append(Paragraph(
        "Bones, Labrum, Ligaments, Muscles, Tendons, Bursae, Vascular Supply &amp; Biomechanics",
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
        "and specialty literature (FAI/Warwick Agreement, GTPS/Grimaldi, Doha groin agreement, MCFA/AVN anatomy). "
        "Approximate values vary by study. "
        "<b>Red flags — suspected fracture, dislocation, septic arthritis, acute neurovascular compromise, "
        "or progressive neurological deficit — require urgent medical/orthopaedic referral.</b> "
        "Femoral head AVN risk counseling applies after fracture/dislocation.",
        styles["disclaimer"],
    ))
    story.append(Spacer(1, 12))

    add_section(story, styles, "Table of Contents")
    for item in TOC_SECTIONS:
        story.append(Paragraph(f"• {esc(item)}", styles["toc"]))
    story.append(PageBreak())

    sections = [
        ("1. Hip Bones", BONE_RECORDS),
        ("2. Acetabular Labrum", LABRUM_RECORDS),
        ("3. Hip Ligaments", LIGAMENT_RECORDS),
        ("4. Hip Muscles", MUSCLE_RECORDS),
        ("5. Tendons", TENDON_RECORDS),
        ("6. Bursae", BURSA_RECORDS),
        ("7. Blood Supply", BLOOD_RECORDS),
        ("8. Hip Biomechanics", BIOMECHANICS_RECORDS),
        ("9. Evidence and Guidelines", EVIDENCE_RECORDS),
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
