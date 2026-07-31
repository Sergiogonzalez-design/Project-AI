#!/usr/bin/env python3
"""
Generate Kinora Lower Leg AI Orientation PDF (Part 9).
Output: knowledge/Kinora_Lower_Leg_AI_Orientation.pdf

Sources: Gray's/Standring, Moore, Netter, Neumann, Magee, Brukner & Khan,
compartment syndrome literature, bone stress injury consensus themes,
MTSS/CECS clinical reviews.
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
OUTPUT_PATH = PROJECT_ROOT / "knowledge" / "Kinora_Lower_Leg_AI_Orientation.pdf"

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
    story.append(Paragraph(f"### RECORD: {esc(name)}", styles["record"]))
    for k, v in fields.items():
        story.append(Paragraph(field_line(k, v), styles["body"]))
    story.append(Spacer(1, 6))


def add_section(story, styles, title):
    story.append(Paragraph(esc(title), styles["h1"]))


def page_footer(canvas, doc):
    canvas.saveState()
    canvas.setFont("Helvetica", 8)
    canvas.setFillColor(colors.grey)
    canvas.drawCentredString(letter[0] / 2, 0.45 * inch, f"Page {doc.page}")
    canvas.drawString(0.75 * inch, 0.45 * inch, "Kinora Lower Leg AI Orientation Part 9 — Educational Use Only")
    canvas.restoreState()


def _m(id_, name, origin, insertion, nerve, blood, fiber, primary, secondary, stab, syn, ant,
       lt, emg, trg, ref_pain, stretch, strength, nmc, clin, inj, rehab):
    return {
        "ID": id_, "Muscle": name, "Origin": origin, "Insertion": insertion, "Innervation": nerve,
        "Blood Supply": blood, "Fiber Direction": fiber, "Primary Action": primary,
        "Secondary Action": secondary, "Stabilizing Function": stab, "Synergists": syn,
        "Antagonists": ant, "Length-Tension Relationship": lt, "EMG Activation": emg,
        "Trigger Points": trg, "Pain Referral": ref_pain, "Stretch": stretch, "Strengthening": strength,
        "Neuromuscular Control": nmc, "Clinical Importance": clin, "Common Injuries": inj,
        "Rehabilitation": rehab, "References": f"{RA} {RB} {RC}",
    }


BONE_RECORDS = [
    ("Tibia", {
        "ID": "LL-BONE-01", "Bone": "Tibia (shin bone) — primary weight-bearing bone of the leg",
        "Region": "Lower leg — medial",
        "Landmarks": "Tibial tuberosity; anterior border (shin); medial malleolus; soleal line; nutrient foramen; interosseous border; fibular notch distally; Gerdy's tubercle proximally",
        "Articulations": "Proximal: femur (via menisci), proximal fibula. Distal: talus (ankle mortise), distal fibula (syndesmosis)",
        "Muscle Attachments": "Pes anserinus, tibialis anterior, EDL, soleus, FDL, tibialis posterior, FHL (more fibular/interosseous), popliteus, gastroc not direct shaft",
        "Ligament Attachments": "MCL distal; coronary/meniscotibial proximally; deltoid ligament at medial malleolus; syndesmotic ligaments distally; interosseous membrane along shaft",
        "Blood Supply": "Nutrient artery from posterior tibial; periosteal vessels from anterior/posterior tibial; genicular contributions proximally",
        "Innervation": "Periosteal branches related to saphenous (medial), deep fibular/tibial regionally — bone pain in stress injury often diffuse",
        "Biomechanical Role": "Transmits ~80-100% of axial load in stance (fibula shares less); medial malleolus forms ankle mortise",
        "Clinical Importance": "Most common site of tibial stress fracture and MTSS; open fractures high infection risk; anterior border subcutaneous — contusion/fracture palpable",
        "Fractures": "Shaft (AO/OTA); plateau (proximal); pilon (distal); stress fracture posteromedial cortex classic in runners",
        "Healing Timeline": "Stress injury weeks–months by grade; complete shaft often 3–6+ months; delayed/nonunion risk with poor biology/smoking/NSAIDs overuse",
        "Imaging": "XR first for trauma; MRI preferred for stress injury; CT for complex articular; bone scan adjunct historical",
        "Rehabilitation": "Unload per grade (boot/crutches); progressive loading guided by pain and imaging stage; address training errors, calf capacity, footwear/surface",
        "References": f"{RA} {RC} Bone stress injury consensus themes (e.g. ACSM/sports medicine reviews).",
    }),
    ("Fibula", {
        "ID": "LL-BONE-02", "Bone": "Fibula — lateral non-primary axial load bone of the leg",
        "Region": "Lower leg — lateral",
        "Landmarks": "Fibular head; neck (common fibular nerve); shaft; lateral malleolus; malleolar fossa",
        "Articulations": "Proximal tibiofibular joint; distal tibiofibular syndesmosis; talus laterally (ankle)",
        "Muscle Attachments": "Biceps femoris (head); soleus; fibularis longus/brevis; FHL; tibialis posterior (via interosseous); EDL/EHL near interosseous",
        "Ligament Attachments": "LCL and PLC at head; interosseous membrane; AITFL/PITFL/inferior transverse at syndesmosis; lateral ankle ligaments at malleolus",
        "Blood Supply": "Fibular (peroneal) artery nutrient/periosteal branches; genicular proximally",
        "Innervation": "Common fibular nerve closely related at neck — critical clinical landmark",
        "Biomechanical Role": "Lateral ankle stability; syndesmosis integrity; ~6-30% load share cited variously; muscle attachment strut",
        "Clinical Importance": "Fibular neck fracture → foot drop risk; Maisonneuve fracture with ankle injury; stress fractures in runners/dancers; lateral malleolus fractures",
        "Fractures": "Head/neck; shaft; distal (Weber/Lauge-Hansen ankle classifications); stress fracture",
        "Healing Timeline": "Often 6-10 weeks isolated; dictated by ankle/syndesmosis involvement",
        "Imaging": "Full-length tibia-fibula views if Maisonneuve suspected; MRI for stress; CT syndesmosis",
        "Rehabilitation": "Protect nerve; progressive eversion strength; ankle stability; WB per fracture pattern",
        "References": f"{RA} {RC}",
    }),
]

COMPARTMENT_RECORDS = [
    ("Anterior Compartment", {
        "ID": "LL-COMP-01", "Compartment": "Anterior compartment of the leg",
        "Boundaries": "Tibia, interosseous membrane, anterior intermuscular septum, crural fascia",
        "Muscles": "Tibialis anterior, EHL, EDL, fibularis tertius",
        "Nerves": "Deep fibular nerve",
        "Arteries": "Anterior tibial artery",
        "Veins": "Anterior tibial veins (venae comitantes)",
        "Function": "Ankle dorsiflexion; toe extension; foot inversion (TA) / eversion assist (tertus)",
        "Biomechanics": "Eccentric control of plantarflexion at heel strike; clears foot in swing",
        "Clinical Importance": "Foot drop if deep fibular injured; common CECS site; shin contusion vulnerability",
        "Compartment Syndrome": "Acute: pain out of proportion, pain on passive stretch (PF), paresthesia 1st web — emergency fasciotomy. Chronic exertional: reversible pressure with exercise",
        "Assessment": "Passive stretch pain, neurovascular exam, needle manometry for CECS protocols, MRI/SPECT selected",
        "Treatment": "Acute = urgent fasciotomy. CECS = activity modification, gait retraining, fasciotomy if refractory",
        "References": f"{RA} {RC} Acute compartment syndrome orthopaedic emergencies literature.",
    }),
    ("Lateral Compartment", {
        "ID": "LL-COMP-02", "Compartment": "Lateral compartment of the leg",
        "Boundaries": "Fibula, anterior and posterior intermuscular septa, crural fascia",
        "Muscles": "Fibularis (peroneus) longus and brevis",
        "Nerves": "Superficial fibular nerve",
        "Arteries": "Branches from fibular artery / perforators (no major named artery exclusively inside)",
        "Veins": "Accompanying veins / perforators",
        "Function": "Foot eversion; PL plantarflexes 1st ray; ankle lateral dynamic stability",
        "Biomechanics": "Control inversion moments; important on uneven ground and cutting",
        "Clinical Importance": "Peroneal tendinopathy/subluxation; superficial fibular sensory entrapment; CECS less common than anterior/deep posterior",
        "Compartment Syndrome": "Possible but less frequent; assess with lateral pain and passive inversion stretch pain",
        "Assessment": "Resisted eversion, tendon palpation behind lateral malleolus, sensory map dorsum foot",
        "Treatment": "Tendinopathy loading; acute CS fasciotomy; address ankle instability drivers",
        "References": f"{RA} {RC}",
    }),
    ("Superficial Posterior Compartment", {
        "ID": "LL-COMP-03", "Compartment": "Superficial posterior compartment",
        "Boundaries": "Transverse intermuscular septum deep; crural fascia superficial; tibia/fibula margins via septa",
        "Muscles": "Gastrocnemius, soleus, plantaris — triceps surae forming Achilles",
        "Nerves": "Tibial nerve branches (motor)",
        "Arteries": "Posterior tibial and sural branches of popliteal",
        "Veins": "Small saphenous / sural veins related superficially; deep venae comitantes",
        "Function": "Powerful plantarflexion; soleus postural; gastroc also knee flexion",
        "Biomechanics": "Propulsion in gait; soleus high stance EMG; Achilles energy storage in running",
        "Clinical Importance": "Achilles tendinopathy continuum; tennis leg (medial gastroc); DVT differential for calf pain",
        "Compartment Syndrome": "Less common isolated; deep posterior more classic for CECS/MTSS overlap region",
        "Assessment": "Thompson test for Achilles continuity; calf squeeze; vascular screen if acute swelling",
        "Treatment": "Progressive loading for tendinopathy/strain; emergency care if acute CS/DVT suspected",
        "References": f"{RA} {RC} Achilles tendinopathy loading literature.",
    }),
    ("Deep Posterior Compartment", {
        "ID": "LL-COMP-04", "Compartment": "Deep posterior compartment",
        "Boundaries": "Tibia, fibula, interosseous membrane, transverse intermuscular septum",
        "Muscles": "Tibialis posterior, FDL, FHL; popliteus proximally related",
        "Nerves": "Tibial nerve",
        "Arteries": "Posterior tibial artery; fibular artery courses in/near this region",
        "Veins": "Posterior tibial and fibular venae comitantes",
        "Function": "Plantarflexion, inversion (TP), toe flexion; supports medial longitudinal arch (TP)",
        "Biomechanics": "TP eccentrically controls pronation in stance; FHL/FDL toe control",
        "Clinical Importance": "CECS common here; TP dysfunction/AHD continuum; tarsal tunnel distal tibial nerve",
        "Compartment Syndrome": "Acute and chronic — pain on passive eversion/dorsiflexion of toes; emergency if acute",
        "Assessment": "Toe flexion strength, TP single-heel-rise inversion, CECS testing protocols",
        "Treatment": "Acute fasciotomy; CECS conservative vs fasciotomy; TP progressive loading",
        "References": f"{RA} {RC} CECS reviews.",
    }),
]

MUSCLE_RECORDS = [
    ("Tibialis Anterior", _m(
        "LL-MUS-01", "Tibialis anterior",
        "Lateral tibial condyle and upper lateral tibia + IO membrane", "Medial cuneiform and base of 1st MT",
        "Deep fibular nerve (L4-L5)", "Anterior tibial artery", "Anterolateral tibia vertical",
        "Ankle dorsiflexion and inversion", "Supports medial arch dynamically",
        "Eccentric control of foot slap at heel strike", "EHL, EDL", "Gastroc/soleus, fibularis longus",
        "Active insufficiency less relevant; high demand eccentric heel strike",
        "High early stance eccentric and swing concentric", "Anterior shin", "Anterior ankle/shin",
        "Plantarflexion-eversion stretch", "Heel walks, resisted DF, eccentric lowering",
        "Heel-strike control; prevent foot slap", "Foot drop; anterior CECS; MTSS differential",
        "Strain; contusion over subcutaneous tibia", "Progressive DF loading; gait cadence; address footwear",
    )),
    ("Extensor Hallucis Longus", _m(
        "LL-MUS-02", "Extensor hallucis longus",
        "Middle fibula and IO membrane", "Dorsal base distal phalanx hallux",
        "Deep fibular nerve (L5)", "Anterior tibial artery", "Deep anterior compartment",
        "Extends hallux; assists dorsiflexion", "Assists inversion slightly",
        "Toe clearance in swing", "EDL, TA", "FHL",
        "Isolated hallux extension testing", "Swing phase hallux control", "Dorsal foot/ankle", "1st ray dorsal",
        "Plantarflexion stretch with hallux flexed", "Resisted hallux extension; toe yoga drills",
        "Push-off hallux alignment", "L5 myotome testing; anterior CS stretch pain",
        "Strain rare; laceration risk dorsum foot", "Progressive hallux loading",
    )),
    ("Extensor Digitorum Longus", _m(
        "LL-MUS-03", "Extensor digitorum longus",
        "Lateral tibial condyle, proximal fibula, IO membrane", "Middle and distal phalanges toes 2-5 (extensor expansion)",
        "Deep fibular nerve (L4-L5)", "Anterior tibial artery", "Anterior compartment lateral to TA/EHL",
        "Extends toes 2-5; assists dorsiflexion", "Weak eversion",
        "Toe clearance", "EHL, TA, fibularis tertius", "FDL",
        "Works with extensor digitorum brevis", "Swing toe extension EMG", "Anterior ankle", "Dorsum toes",
        "Plantarflexion stretch", "Resisted toe extension; heel walks",
        "Swing clearance", "Anterior CS; L5 testing", "Strain uncommon", "DF endurance training",
    )),
    ("Fibularis Tertius", _m(
        "LL-MUS-04", "Fibularis (peroneus) tertius",
        "Distal fibula / EDL continuum (variable)", "Dorsal base 5th MT",
        "Deep fibular nerve (L5-S1)", "Anterior tibial artery", "Anterolateral distal leg — variable presence",
        "Dorsiflexion and eversion", "May tension 5th MT region",
        "Lateral ankle dynamic assist in DF-eversion", "EDL, fibularis brevis", "TA (inversion), plantarflexors",
        "Absent in some individuals — anatomic variant", "Low-moderate eversion-DF tasks", "Lateral ankle", "5th MT base",
        "Inversion-PF stretch", "Resisted DF-eversion",
        "Uneven ground eversion control", "Differentiate from fibularis brevis injury at 5th MT",
        "Rare isolated injury", "Ankle stability progressions",
    )),
    ("Fibularis Longus", _m(
        "LL-MUS-05", "Fibularis (peroneus) longus",
        "Fibular head and proximal lateral fibula", "Plantar medial cuneiform and 1st MT base (after cuboid groove)",
        "Superficial fibular nerve (L5-S1)", "Fibular artery perforators", "Lateral compartment — longest course under foot",
        "Eversion; plantarflexes 1st ray", "Plantarflexion assist; stabilizes 1st ray against TA",
        "Lateral ankle dynamic stabilizer; supports transverse/lateral arch mechanics",
        "Fibularis brevis", "TA, TP",
        "Tendon turns at lateral malleolus and cuboid — high friction zones",
        "High on uneven terrain and cutting", "Lateral leg", "Lateral ankle/foot",
        "Inversion stretch", "Resisted eversion, band walks, single-leg balance on uneven surface",
        "Cut/cut landing eversion control", "Tendinopathy; subluxation with retinaculum injury; cuboid syndrome association",
        "Tendinopathy; tears; superior retinaculum injury", "Progressive eversion loading; address ankle instability",
    )),
    ("Fibularis Brevis", _m(
        "LL-MUS-06", "Fibularis (peroneus) brevis",
        "Distal lateral fibula", "Tuberosity of 5th MT base",
        "Superficial fibular nerve (L5-S1)", "Fibular artery perforators", "Lateral compartment deep to longus",
        "Eversion; weak plantarflexion", "Lateral ankle stability",
        "Primary everter at malleolus level", "Fibularis longus", "TA, TP",
        "Insertion avulsion / Jones fracture differential at 5th MT",
        "Eversion tasks high EMG", "Lateral ankle", "5th MT base",
        "Inversion stretch", "Resisted eversion; proprioceptive ankle drills",
        "Landing eversion control", "Most common peroneal tendon tear; 5th MT avulsion",
        "Longitudinal split tears; tendinopathy", "Load progressive; surgical if unstable subluxation/tear selected",
    )),
    ("Gastrocnemius", _m(
        "LL-MUS-07", "Gastrocnemius",
        "Medial and lateral femoral condyles", "Achilles tendon to calcaneus (with soleus)",
        "Tibial nerve (S1-S2)", "Sural branches of popliteal", "Biarticular posterior — crosses knee and ankle",
        "Powerful plantarflexion; knee flexion assist", "Propulsion in sprint/jump",
        "Dynamic posterior knee restraint to hyperextension", "Soleus, plantaris", "TA, tibialis anterior group",
        "Active insufficiency knee flexed + PF; medial head strain classic (tennis leg)",
        "High sprint push-off and jump EMG", "Calf", "Posterior knee/calf — DVT differential critical",
        "Wall stretch knee extended", "Heel raises knee extended; plyometrics graded",
        "Stiffness modulation landing", "Tennis leg; contributes Achilles load",
        "Medial head myofascial tear", "Progressive loading; rule out DVT if acute swelling",
    )),
    ("Soleus", _m(
        "LL-MUS-08", "Soleus",
        "Soleal line of tibia, proximal fibula, IO arch", "Achilles tendon to calcaneus",
        "Tibial nerve (S1-S2)", "Posterior tibial, fibular, popliteal branches", "Deep to gastroc — monoarticular ankle",
        "Plantarflexion (primary postural)", "Venous pump of leg",
        "Controls tibial advancement in midstance (eccentric)", "Gastroc, TP, FHL", "TA",
        "Best strengthened with knee flexed heel raises", "High continuous stance EMG",
        "Deep calf", "Achilles/heel — soleus strain often deep pain",
        "Knee-flexed calf stretch", "Seated/bent-knee heel raises, heavy slow Achilles loading",
        "Midstance control; cadence", "Achilles tendinopathy; soleus strain misdiagnosed as DVT/MTSS",
        "Strain; contusion", "Heavy slow resistance; graded return to run",
    )),
    ("Plantaris", _m(
        "LL-MUS-09", "Plantaris",
        "Lateral supracondylar femur / oblique popliteal ligament region", "Medial Achilles / calcaneus (variable)",
        "Tibial nerve (S1-S2)", "Sural/popliteal branches", "Tiny muscle long tendon — vestigial-like",
        "Weak plantarflexion and knee flexion", "Proprioceptive role proposed",
        "Minimal torque — tendon used as graft sometimes", "Gastroc", "TA",
        "Tendon rupture may cause sharp calf pain with intact Achilles (Thompson negative)",
        "Low EMG contribution", "Calf", "Posteromedial calf",
        "With gastroc stretch", "Not primary strengthening target",
        "Differentiate from tennis leg/Achilles rupture", "Plantaris rupture; graft harvest",
        "Tendon rupture", "Symptom-guided; reassure if Achilles intact",
    )),
    ("Tibialis Posterior", _m(
        "LL-MUS-10", "Tibialis posterior",
        "IO membrane, posterior tibia and fibula", "Navicular tuberosity and plantar tarsals/MTs (broad)",
        "Tibial nerve (L4-L5)", "Posterior tibial artery", "Deep posterior — closest to IO membrane",
        "Inversion and plantarflexion; key medial arch supporter", "Controls pronation eccentrically",
        "Dynamic medial longitudinal arch stabilizer", "FDL, FHL, TA (inversion)", "Fibularis longus/brevis",
        "Dysfunction linked to adult-acquired flatfoot continuum", "High midstance eccentric in runners",
        "Medial shin/arch", "Medial ankle/arch",
        "Eversion-DF stretch carefully", "Inversion strength, short-foot, heel raise with inversion bias, arch control drills",
        "Single-leg stance arch control", "PTTD; CECS deep posterior; MTSS differential",
        "Tendinopathy; rupture in degenerative PTTD", "Progressive loading; orthoses selected; surgical stages for PTTD",
    )),
    ("Flexor Hallucis Longus", _m(
        "LL-MUS-11", "Flexor hallucis longus",
        "Distal posterior fibula and IO membrane", "Distal phalanx hallux plantar",
        "Tibial nerve (S2-S3)", "Fibular / posterior tibial branches", "Deep posterior — lateral",
        "Flexes hallux; assists plantarflexion", "Supports medial arch",
        "Push-off hallux flexion force", "FDL, TP", "EHL",
        "Henry's knot intersection with FDL; stenosing tenosynovitis in dancers (trigger toe)",
        "Push-off high in dance/sprint", "Posteromedial ankle", "Plantar hallux",
        "Hallux extension stretch", "Toe curls, marble pickups, calf raises with toe flexion",
        "Push-off mechanics", "Dancer's tendinopathy; posteromedial ankle impingement overlap",
        "Tenosynovitis; strain", "Load management; progressive hallux flexion strength",
    )),
    ("Flexor Digitorum Longus", _m(
        "LL-MUS-12", "Flexor digitorum longus",
        "Posterior tibia below soleal line", "Distal phalanges toes 2-5",
        "Tibial nerve (S2-S3)", "Posterior tibial artery", "Deep posterior — medial",
        "Flexes toes 2-5; assists PF and inversion", "Arch support assist",
        "Toe grip in stance", "FHL, TP", "EDL",
        "Crosses FHL at Henry knot", "Stance toe flexion EMG", "Medial shin", "Plantar toes",
        "Toe extension stretch", "Towel curls; intrinsic foot + FDL loading",
        "Push-off toe flexion", "Deep posterior CECS; tarsal tunnel differential",
        "Strain uncommon", "Progressive toe flexor loading",
    )),
    ("Popliteus", _m(
        "LL-MUS-13", "Popliteus",
        "Lateral femoral condyle and fibular head via popliteofibular complex", "Posterior proximal tibia",
        "Tibial nerve (L4-S1)", "Popliteal / inferior medial genicular", "Floor of popliteal fossa — oblique",
        "Unlocks knee (tibial IR open chain)", "Dynamic PLC stabilizer",
        "Rotational control near extension", "PLC ligaments", "Knee extensors / tibial ER",
        "Screw-home reversal initiator", "Flexion initiation EMG", "Posterolateral knee", "Posterolateral knee",
        "Gentle ER stretch variants", "Tibial IR control drills",
        "PLC rehab", "PLC injury association", "With PLC trauma", "Protect varus/ER early post-PLC surgery",
    )),
]

NERVE_RECORDS = [
    ("Tibial Nerve", {
        "ID": "LL-NRV-01", "Nerve": "Tibial nerve", "Root Levels": "L4-S3",
        "Motor Function": "Posterior compartment muscles (gastroc, soleus, TP, FDL, FHL, popliteus) then plantar intrinsics via medial/lateral plantar",
        "Sensory Distribution": "Posterolateral leg via sural contributions; heel/plantar foot via calcaneal and plantar nerves",
        "Dermatomes": "S1-S2 plantar emphasis", "Myotomes": "S1-S2 plantarflexion / toe flexion",
        "Entrapment Sites": "Popliteal fossa; tarsal tunnel behind medial malleolus",
        "Clinical Presentation": "Calf weakness, plantar numbness, tarsal tunnel burning pain",
        "Neurodynamic Tests": "SLR with DF/eversion tibial bias",
        "Differential Diagnosis": "S1 radiculopathy, CECS, Achilles pathology, DVT",
        "EMG": "Localizes tibial vs root vs plantar nerve",
        "Imaging": "US/MRI tarsal tunnel or popliteal mass",
        "Treatment": "Relieve entrapment, orthoses, surgical release selected",
        "Rehabilitation": "Nerve mobility, calf/foot strength, load management",
        "References": f"{RA} {RC}",
    }),
    ("Common Fibular Nerve", {
        "ID": "LL-NRV-02", "Nerve": "Common fibular (peroneal) nerve", "Root Levels": "L4-S2",
        "Motor Function": "Short head biceps femoris; then divides to deep and superficial fibular",
        "Sensory Distribution": "Lateral leg proximal; continues via deep/superficial branches",
        "Dermatomes": "L5 lateral leg/dorsum foot", "Myotomes": "L4-L5 DF/eversion",
        "Entrapment Sites": "Fibular neck — cast, leg crossing, trauma, surgery",
        "Clinical Presentation": "Foot drop, steppage gait, sensory loss dorsum foot",
        "Neurodynamic Tests": "SLR with PF/inversion fibular bias",
        "Differential Diagnosis": "L4-L5 radiculopathy, anterior CS, sciatic injury",
        "EMG": "Critical for prognosis/localization",
        "Imaging": "US at fibular neck; MRI if mass",
        "Treatment": "Relieve compression, AFO, decompression selected",
        "Rehabilitation": "AFO gait, NMES DF, skin protection, progressive strength",
        "References": f"{RA} {RC}",
    }),
    ("Deep Fibular Nerve", {
        "ID": "LL-NRV-03", "Nerve": "Deep fibular nerve", "Root Levels": "L4-L5 (from common fibular)",
        "Motor Function": "Anterior compartment — TA, EHL, EDL, fibularis tertius; EDB/EHB in foot",
        "Sensory Distribution": "1st web space dorsal",
        "Dermatomes": "L4-L5 web space", "Myotomes": "L4-L5 dorsiflexion / hallux extension",
        "Entrapment Sites": "Anterior compartment pressure; anterior tarsal tunnel under extensor retinaculum",
        "Clinical Presentation": "Foot drop, 1st web numbness; anterior ankle pain if entrapment",
        "Neurodynamic Tests": "Fibular-biased SLR; local retinacular Tinel",
        "Differential Diagnosis": "Common fibular lesion, L4-L5 root, CECS",
        "EMG": "Distinguishes deep vs common fibular",
        "Imaging": "US/MRI anterior ankle",
        "Treatment": "Pressure relief, activity mod for CECS, release selected",
        "Rehabilitation": "DF strengthening, gait, CECS return-to-run plans",
        "References": f"{RA} {RC}",
    }),
    ("Superficial Fibular Nerve", {
        "ID": "LL-NRV-04", "Nerve": "Superficial fibular nerve", "Root Levels": "L5-S1",
        "Motor Function": "Fibularis longus and brevis",
        "Sensory Distribution": "Most of dorsum of foot (except 1st web and sural lateral border)",
        "Dermatomes": "L5 dorsum foot", "Myotomes": "L5-S1 eversion",
        "Entrapment Sites": "Exits crural fascia mid-lateral leg — fascial exit entrapment; ankle inversion trauma stretch",
        "Clinical Presentation": "Lateral leg/dorsal foot paresthesia; weak eversion if motor involved",
        "Neurodynamic Tests": "Fibular bias; local Tinel at fascial exit",
        "Differential Diagnosis": "L5 radiculopathy, peroneal tendinopathy, lateral ankle sprain sequelae",
        "EMG": "May show sensory changes",
        "Imaging": "US fascial exit",
        "Treatment": "Fascial release selected; ankle stability rehab",
        "Rehabilitation": "Eversion strength, neurodynamics, graded running",
        "References": f"{RA} {RC}",
    }),
    ("Sural Nerve", {
        "ID": "LL-NRV-05", "Nerve": "Sural nerve", "Root Levels": "S1-S2 (tibial + common fibular contributions typical)",
        "Motor Function": "None (pure sensory)",
        "Sensory Distribution": "Posterolateral distal leg and lateral foot border",
        "Dermatomes": "S1 lateral foot", "Myotomes": "N/A",
        "Entrapment Sites": "Lateral ankle; Achilles surgery; tight boots; sural nerve biopsy site neuroma",
        "Clinical Presentation": "Burning lateral foot/ankle; Tinel along sural course",
        "Neurodynamic Tests": "SLR with DF/inversion sural bias",
        "Differential Diagnosis": "S1 radiculopathy, lateral ankle ligament pain, Achilles-related",
        "EMG": "SNAP useful",
        "Imaging": "US neuroma",
        "Treatment": "Desensitization, padding, surgical neuroma selected",
        "Rehabilitation": "Nerve mobility, graded exposure, ankle strength",
        "References": f"{RA} {RC}",
    }),
    ("Saphenous Nerve", {
        "ID": "LL-NRV-06", "Nerve": "Saphenous nerve (leg)", "Root Levels": "L3-L4 (femoral continuation)",
        "Motor Function": "None",
        "Sensory Distribution": "Medial leg to medial malleolus/foot border",
        "Dermatomes": "L4 medial leg", "Myotomes": "N/A",
        "Entrapment Sites": "Hunter canal; medial knee surgery; along great saphenous vein harvest",
        "Clinical Presentation": "Medial shin/ankle numbness or neuropathic pain — MTSS differential",
        "Neurodynamic Tests": "Saphenous neurodynamics",
        "Differential Diagnosis": "MTSS, tibial stress fracture, L4 radiculopathy",
        "EMG": "Sensory NCS",
        "Imaging": "US if neuroma",
        "Treatment": "Desensitization, address entrapment",
        "Rehabilitation": "Load management of medial shin with neuropathic care if needed",
        "References": f"{RA} {RC}",
    }),
]

BLOOD_RECORDS = [
    ("Anterior Tibial Artery", {
        "ID": "LL-ART-01", "Artery": "Anterior tibial artery",
        "Origin": "Popliteal artery bifurcation (with posterior tibial)",
        "Course": "Through IO membrane to anterior compartment; becomes dorsalis pedis at ankle",
        "Branches": "Anterior/posterior tibial recurrent; muscular; malleolar; continues as dorsalis pedis",
        "Structures Supplied": "Anterior compartment muscles; anterior tibia periosteum; dorsum foot via DP",
        "Venous Drainage": "Anterior tibial veins → popliteal",
        "Clinical Importance": "Dorsalis pedis pulse; injury in anterior CS/trauma; vascular exam with fractures",
        "Imaging": "Duplex/CTA/angiography trauma",
        "References": f"{RA}",
    }),
    ("Posterior Tibial Artery", {
        "ID": "LL-ART-02", "Artery": "Posterior tibial artery",
        "Origin": "Popliteal bifurcation",
        "Course": "Deep posterior compartment behind medial malleolus into foot (medial/lateral plantar)",
        "Branches": "Circumflex fibular, nutrient tibial, muscular, medial malleolar; gives fibular artery (often)",
        "Structures Supplied": "Posterior compartments; tibia; plantar foot",
        "Venous Drainage": "Posterior tibial veins → popliteal",
        "Clinical Importance": "Posterior tibial pulse; tarsal tunnel companion; critical limb ischemia assessment",
        "Imaging": "ABI, duplex, CTA",
        "References": f"{RA}",
    }),
    ("Fibular Artery", {
        "ID": "LL-ART-03", "Artery": "Fibular (peroneal) artery",
        "Origin": "Usually posterior tibial artery (proximal)",
        "Course": "Along fibula in deep posterior / flexor hallucis plane; perforators to lateral compartment",
        "Branches": "Nutrient fibular; perforating; communicating; malleolar branches",
        "Structures Supplied": "Fibula; deep posterior lateral muscles; lateral compartment via perforators; ankle anastomoses",
        "Venous Drainage": "Fibular veins → posterior tibial / popliteal",
        "Clinical Importance": "Fibular graft vascular pedicle; lateral ankle trauma; collateral pathway if PTA diseased",
        "Imaging": "CTA/angiography for flap/trauma planning",
        "References": f"{RA}",
    }),
]

FASCIA_RECORDS = [
    ("Crural Fascia", {
        "ID": "LL-FAS-01", "Structure": "Crural (deep) fascia of the leg",
        "Attachments": "Continuous with fascia lata above; attaches to tibial periosteum medially (subcutaneous tibia); forms retinacula at ankle",
        "Continuity": "Blends with periosteum over medial tibia; continuous with extensor/flexor/fibular retinacula; septa inward to fibula/tibia",
        "Force Transmission": "Contains muscle expansion; contributes to venous pump; transmits tension from muscle contraction to bone (traction periostitis concept in MTSS)",
        "Clinical Importance": "Forms compartment walls; MTSS traction hypothesis along medial tibial fascia; CECS noncompliance of fascia",
        "Restrictions": "Thick/inelastic fascia implicated in CECS; post-traumatic scarring",
        "Assessment": "Palpation medial tibial border; compartment firmness post-exercise; fascial exit points of superficial fibular nerve",
        "Treatment": "Load management; gait retraining; fasciotomy for refractory CECS; soft-tissue techniques adjunctive (limited evidence alone)",
        "Evidence": "Fasciotomy outcomes for CECS supported in refractory athletes; MTSS multifactorial — fascial traction one proposed mechanism",
        "References": f"{RA} MTSS/CECS reviews. {RC}",
    }),
    ("Intermuscular Septa", {
        "ID": "LL-FAS-02", "Structure": "Anterior and posterior crural intermuscular septa (+ transverse intermuscular septum)",
        "Attachments": "From crural fascia to fibula (anterior/posterior septa); transverse septum separates superficial/deep posterior",
        "Continuity": "Define four leg compartments with IO membrane and bones",
        "Force Transmission": "Compartmentalize pressure; guide neurovascular courses",
        "Clinical Importance": "Surgical landmarks for fasciotomy; septal tightness contributes to compartment pressures",
        "Restrictions": "Fibrosis after trauma/CECS",
        "Assessment": "Clinical compartment testing; intraoperative recognition",
        "Treatment": "Fasciotomy divides fascia/septa as needed for decompression",
        "Evidence": "Anatomic basis of four-compartment fasciotomy well established in trauma surgery",
        "References": f"{RA} Orthopaedic trauma compartment release literature.",
    }),
    ("Compartment Fascia System (Integrated)", {
        "ID": "LL-FAS-03", "Structure": "Integrated fascial compartment system of the leg",
        "Attachments": "Crural fascia + septa + IO membrane + tibial periosteum forming closed osteofascial spaces",
        "Continuity": "Knee fascia lata to ankle retinacula continuum",
        "Force Transmission": "Muscle expansion raises intracompartmental pressure; venous return assisted in normal compliance",
        "Clinical Importance": "Pathophysiology of acute and chronic compartment syndromes; MTSS periosteal-fascial interface",
        "Restrictions": "Reduced fascial compliance → CECS; trauma/bleed → acute CS",
        "Assessment": "Pain on passive stretch, firmness, neurovascular status; manometry protocols for CECS",
        "Treatment": "Acute = emergency fasciotomy. Chronic = conservative then fasciotomy",
        "Evidence": "Acute CS is surgical emergency — do not delay for imaging if clinically clear",
        "References": f"{RA} {RC} ACS emergency guidelines themes.",
    }),
]


def bio(id_, movement, plane, axis, primary, secondary, stab, arthro, osteo, jrf, torque, lt, emg,
        func, sport, comp, dys, assess, corr):
    return {
        "ID": id_, "Movement": movement, "Plane": plane, "Axis": axis,
        "Primary Movers": primary, "Secondary Movers": secondary, "Stabilizers": stab,
        "Arthrokinematics": arthro, "Osteokinematics": osteo, "Joint Reaction Forces": jrf,
        "Torque": torque, "Length-Tension": lt, "EMG": emg, "Functional Activities": func,
        "Sport Applications": sport, "Compensations": comp, "Common Dysfunctions": dys,
        "Clinical Assessment": assess, "Corrective Exercises": corr,
        "References": f"{RB} {RC}",
    }


BIOMECHANICS_RECORDS = [
    ("Walking", bio(
        "LL-BIO-01", "Walking — lower leg contribution", "Sagittal primary", "Ankle mortise approximate",
        "TA eccentric heel strike; soleus midstance; gastroc late stance",
        "TP controls pronation; fibularis control inversion", "Syndesmosis/ankle ligaments passive",
        "Tibial advancement over foot; fibula minor load share", "Ankle DF then PF rockers",
        "Tibial axial load near BW to several x BW peak (model-dependent)", "Plantarflexor moment late stance",
        "Soleus near mid-length midstance", "Phasic TA/soleus/gastroc",
        "Community gait", "Base for run progressions",
        "Foot slap; early heel rise; vaulting", "MTSS, Achilles, foot drop",
        "Observational gait; DF ROM; heel rise", "Heel-toe drills, calf capacity, cadence",
    )),
    ("Running", bio(
        "LL-BIO-02", "Running — lower leg", "Multiplanar", "Ankle/foot complex",
        "Soleus/gastroc spring; TA swing/impact", "TP arch; fibularis lateral stability",
        "Bone stress risk with load spikes",
        "Higher rates of loading than walking", "Flight + stance; fore/mid/rearfoot strike variants",
        "Multiple x BW; tibial strain rises with speed/overstride", "High Achilles/PF torque",
        "Tendon energy storage critical", "High burst EMG",
        "Fitness/field running", "Endurance and team sports",
        "Overstride; crossover; excessive pronation or rigidity", "MTSS, stress fracture, CECS, tendinopathy",
        "Video; step rate; shin pain map", "Cadence up, run-walk, calf capacity, surface progression",
    )),
    ("Heel Strike", bio(
        "LL-BIO-03", "Heel strike / initial contact", "Sagittal", "Ankle",
        "TA eccentric", "EHL/EDL assist", "Ankle mortise stability",
        "Rapid PF controlled by dorsiflexors", "Heel rocker begins",
        "Impact transient", "DF eccentric torque", "TA lengthening under load",
        "High TA eccentric EMG", "Walking IC", "Rearfoot strike running",
        "Foot slap if weak TA", "Anterior CS symptoms; TA tendinopathy rare",
        "Listen/watch foot slap; DF strength", "Eccentric TA lowers; heel walks",
    )),
    ("Midstance", bio(
        "LL-BIO-04", "Midstance", "Sagittal + frontal foot", "Ankle/STJ",
        "Soleus eccentric tibial control; TP arch", "Fibularis lateral", "Osteoligamentous ankle",
        "Tibia rotates forward over foot; STJ pronation then resupination begins", "Ankle rocker",
        "High soleus demand", "PF eccentric torque controlling DF", "Soleus continuous load",
        "High soleus EMG", "Single-limb support", "Running midstance",
        "Excessive pronation or early heel rise", "Achilles, soleus strain, PTTD, MTSS",
        "Single-leg stance; navicular drop clinical context", "Bent-knee heel raises; short foot; cadence",
    )),
    ("Toe-Off", bio(
        "LL-BIO-05", "Toe-off / propulsion", "Sagittal", "Ankle/MTP",
        "Gastroc/soleus concentric; FHL/FDL toe flexion", "TP/fibularis", "Windlass via plantar fascia",
        "Rapid PF; heel rise", "Forefoot rocker",
        "Peak PF power walking", "Large PF torque", "Achilles spring release in run",
        "Peak gastroc/soleus EMG", "Push-off ADLs", "Sprint acceleration",
        "Reduced heel rise; hallux limitus compensation", "Achilles tendinopathy; turf toe differential",
        "Heel-rise symmetry; push-off video", "Heel raises progressive; hallux mobility/strength",
    )),
    ("Sprinting", bio(
        "LL-BIO-06", "Sprinting — lower leg demands", "Sagittal dominant", "Ankle",
        "Gastroc/soleus extreme PF power; TA swing recovery", "FHL push-off", "Bone/soft-tissue high strain rates",
        "Forefoot dominance common; minimal contact times", "Rapid stretch-shortening Achilles",
        "Very high tibial and Achilles loads", "Maximal PF power", "SSC optimal stiffness",
        "Maximal EMG bursts", "Track sprinting", "Speed sports",
        "Excess stiffness or overstride", "Tennis leg; Achilles rupture risk factors; bone stress",
        "Sprint mechanics; calf capacity; prior injury history", "Graded exposures; heavy calf strength; technique",
    )),
]


def path(id_, cond, definition, mech, risk, sx, red, ddx, exam, tests, img, heal, cons, surg,
         rehab, rtr, rts, prog, guide, evid):
    return {
        "ID": id_, "Condition": cond, "Definition": definition, "Mechanism": mech,
        "Risk Factors": risk, "Symptoms": sx, "Red Flags": red, "Differential Diagnosis": ddx,
        "Clinical Examination": exam, "Special Tests": tests, "Imaging": img,
        "Healing Timeline": heal, "Conservative Management": cons, "Surgical Management": surg,
        "Rehabilitation Phases": rehab, "Return to Running": rtr, "Return to Sport": rts,
        "Prognosis": prog, "Clinical Guidelines": guide, "Evidence Level": evid,
        "References": f"{RC} Specialty bone-stress/CECS/MTSS literature.",
    }


PATHOLOGY_RECORDS = [
    ("Medial Tibial Stress Syndrome", path(
        "LL-PATH-01", "Medial tibial stress syndrome (MTSS / shin splints)",
        "Exercise-related pain along posteromedial tibial border from bone stress continuum / fascial traction — not a single histology",
        "Repetitive loading exceeding tibial adaptation; traction of soleus/TP/fascial attachments proposed",
        "Novice runners, sudden volume increase, high BMI, female sex in some cohorts, prior MTSS, hard surfaces",
        "Diffuse posteromedial shin pain with running that may linger after; tenderness along border",
        "Focal pinpoint bony pain, night pain, hop pain severe — consider stress fracture; acute CS signs",
        "Tibial stress fracture, CECS, saphenous neuropathy, soft-tissue strain",
        "Palpation length of medial border; hop test; compartment symptoms screen",
        "Clinical diagnosis primarily; hop/fulcrum for fracture suspicion",
        "MRI if stress fracture suspected or refractory; XR often normal early",
        "Symptoms often 2-6+ weeks with load modification; bone adaptation longer",
        "Relative rest from impact, graded return, calf/hip strength, cadence increase, footwear/surface review",
        "Not indicated for MTSS proper",
        "Unload → cross-train → walk-run → build volume <10%/week heuristic",
        "Pain-guided walk-run when daily pain settles",
        "When training loads match sport without rebound pain",
        "Good with load management; recurrence if errors repeat",
        "Sports medicine MTSS reviews; bone stress continuum framing",
        "Moderate — clinical consensus strong; mechanisms multifactorial",
    )),
    ("Tibial Stress Fracture", path(
        "LL-PATH-02", "Tibial stress fracture",
        "Fatigue fracture of tibial cortex from repetitive overload on bone stress continuum",
        "Accumulated microdamage > remodeling; common posteromedial cortex; anterior cortex high-risk tension side",
        "Endurance athletes, RED-S/low energy availability, female athlete triad spectrum, rapid mileage, prior BSI",
        "Focal bony pain, night pain possible, pain with hopping; antalgic run",
        "Anterior mid-tibial 'dreaded black line' high-risk; neurologic/vascular change; inability to WB",
        "MTSS, CECS, tumor (rare), infection",
        "Point tenderness, hop test, tuning fork limited value",
        "Hop test; fulcrum",
        "MRI gold standard for early BSI; XR may lag 2-3 weeks; CT if delayed union",
        "Low-risk often 6-8+ weeks; high-risk anterior much longer / may need surgery",
        "Unload (boot/crutches) per risk site; nutrition/energy availability; graded reload",
        "Selected high-risk anterior / nonunion may need fixation",
        "Protected WB → progressive loading → run-walk when pain-free criteria met",
        "Only after clinical ± imaging clearance milestones",
        "Delayed until full training tolerance; site-dependent",
        "Good for low-risk; guarded for anterior tension-side",
        "Bone stress injury consensus themes (risk stratification)",
        "Strong imaging evidence; management risk-stratified",
    )),
    ("Fibular Stress Fracture", path(
        "LL-PATH-03", "Fibular stress fracture",
        "Fatigue fracture of fibula from repetitive load",
        "Repetitive running/jumping; distal fibula common in runners",
        "Endurance sports, training spikes, alignment factors",
        "Lateral leg pain focal, activity-related",
        "Same BSI red flags; common fibular nerve symptoms if proximal",
        "Peroneal tendinopathy, lateral ankle instability, CECS lateral",
        "Point tenderness along fibula; hop",
        "Clinical + imaging",
        "MRI preferred; XR may be negative early",
        "Often 6-8 weeks low-risk sites",
        "Load reduction, progressive return, address calf/evertors",
        "Rare",
        "Unload → cross-train → graded run",
        "Pain-free criteria",
        "When lateral load tolerated",
        "Generally favorable",
        "BSI risk-stratification frameworks",
        "Moderate",
    )),
    ("Chronic Exertional Compartment Syndrome", path(
        "LL-PATH-04", "Chronic exertional compartment syndrome (CECS)",
        "Reversible elevated intracompartmental pressure with exercise causing pain/neuro symptoms that resolve with rest",
        "Fascial noncompliance + muscle volume expansion with exertion",
        "Running athletes, anterior and deep posterior most common, prior MTSS misdiagnosis",
        "Predictable onset at same time/distance; tightness, weakness, paresthesia; resolves after stopping",
        "Pain at rest, severe neuro deficit, or trauma history — think acute CS emergency",
        "MTSS, stress fracture, nerve entrapment, POPA, arterial endofibrosis (rare cyclists)",
        "Post-exercise firmness, neuro exam, reproduction with sport-specific exertion",
        "Invasive manometry protocols still reference standard; some centers use continuous/other methods",
        "Manometry diagnostic aid; MRI/SPECT selected adjuncts — clinical correlation essential",
        "Symptoms chronic until load adapted or fasciotomy",
        "Gait retraining (forefoot/cadence cues evolving evidence), activity mod, fascial mobility adjunct",
        "Fasciotomy for refractory confirmed CECS — discuss risks (hernia, recurrence, nerve)",
        "Conservative trial → post-fasciotomy progressive loading if surgery",
        "Graded after symptoms controlled / post-op milestones",
        "Often good after successful fasciotomy in selected athletes",
        "Variable; surgery helps many refractory cases",
        "CECS clinical reviews; acute vs chronic distinction mandatory",
        "Moderate diagnostic heterogeneity; surgery outcomes generally favorable in series",
    )),
    ("Gastrocnemius Tear", path(
        "LL-PATH-05", "Gastrocnemius tear (tennis leg — typically medial head)",
        "Myofascial junction strain/tear of gastrocnemius, usually medial head",
        "Sudden push-off or eccentric DF with extended knee (tennis, sprint)",
        "Middle-aged athletes, inadequate warm-up, prior calf injury",
        "Sudden pop/stabbing calf pain, bruising, limp; Thompson negative if Achilles intact",
        "Positive Thompson / gap at Achilles = rupture; massive swelling + dyspnea = PE/DVT workup pathway",
        "Achilles rupture, plantaris rupture, soleus strain, DVT",
        "Palpation medial gastroc MJ, strength PF knee extended vs flexed, Thompson",
        "Thompson test to exclude Achilles",
        "US excellent for tear localization; MRI if unclear",
        "Grade-dependent 2-8+ weeks typical functional recovery window",
        "PEACE&LOVE/POLICE principles, early protected motion, progressive loading — avoid prolonged immobilization",
        "Rare for isolated MJ tear",
        "Protect → isometric → concentric → eccentric → plyometric/sprint",
        "When calf capacity and pain allow walk-run",
        "Criteria-based sprint/cut return",
        "Good; reinjury risk if rushed",
        "Muscle strain rehab evidence themes",
        "Good clinical consensus; US useful",
    )),
    ("Soleus Strain", path(
        "LL-PATH-06", "Soleus strain",
        "Strain of soleus muscle — often deep calf pain, may be subacute",
        "Repetitive eccentric load midstance or sudden overload",
        "Runners, hill training, inadequate calf capacity",
        "Deep calf pain worse with bent-knee heel raise; less dramatic than tennis leg",
        "DVT signs; Achilles rupture signs",
        "DVT, MTSS, CECS, radiculopathy",
        "Pain with knee-flexed heel raise; deep palpation",
        "Clinical; Thompson negative",
        "US/MRI if needed to confirm and grade",
        "Often 3-8 weeks",
        "Load modification, bent-knee heel raise progressive heavy slow",
        "Not typical",
        "Isometrics → HSR soleus → run-walk",
        "When soleus loading tolerated",
        "When sport volumes tolerated",
        "Good with progressive loading",
        "Calf strain rehab principles",
        "Moderate — under-recognized clinically",
    )),
    ("Peroneal Tendinopathy", path(
        "LL-PATH-07", "Peroneal (fibularis) tendinopathy",
        "Overuse pain/dysfunction of fibularis longus/brevis tendons at retromalleolar / cuboid regions",
        "Repetitive eversion load, ankle instability, training errors, cavovarus foot sometimes",
        "Runners, dancers, lateral ankle sprain history, unstable retinaculum",
        "Lateral ankle/foot pain with eversion/push-off; swelling behind lateral malleolus",
        "Acute dislocation of tendons; fracture of 5th MT; infection",
        "Lateral ankle sprain, sural nerve, 5th MT stress, cuboid syndrome",
        "Palpation tendons, resisted eversion, subluxation on DF-eversion",
        "Resisted eversion; dynamic subluxation observation",
        "US first-line dynamic; MRI for tears",
        "Tendinopathy months; tears may need longer/surgery",
        "Load management, progressive eversion loading, ankle stability, orthoses selected",
        "Repair/groove deepening/retinaculum for subluxation or selected tears",
        "Isometrics → isotonic eversion → plyometric/uneven surface",
        "When eversion capacity and pain allow",
        "When cutting on uneven ground tolerated",
        "Good if instability addressed",
        "Peroneal tendon clinical reviews",
        "Moderate evidence for progressive loading + stability",
    )),
]

REHAB_RECORDS = [
    ("MTSS Rehabilitation", {
        "ID": "LL-REHAB-01", "Condition": "Medial tibial stress syndrome", "Rehabilitation Phase": "Load modification to graded return",
        "Goals": "Settle medial tibial pain; restore run capacity without bone-stress progression",
        "Pain Management": "Relative rest from aggravating impact; ice after activity optional; avoid NSAID overuse masking bone pain",
        "Weight Bearing Status": "WBAT; reduce running first rather than full NWB unless fracture suspected",
        "ROM Goals": "Ankle DF mobility if limited; hip mobility as needed",
        "Strength Goals": "Soleus/gastroc, TP, hip abductors progressive",
        "Motor Control": "Cadence increase (~5-10%), reduce overstride",
        "Balance Training": "Single-leg stance progressions",
        "Proprioception": "Uneven surface graded later",
        "Functional Training": "Bike/swim/elliptical cross-train",
        "Sport-Specific Progression": "Walk-run schedule with pain rules (e.g. pain ≤2-3/10 and not rising day-to-day)",
        "Criteria to Progress": "Palpation less irritable; daily pain settled; hop comfortable before run build",
        "Return to Running": "Walk-run when symptoms allow — monitor 24h response",
        "Return to Sport": "When volume/intensity match sport without delayed pain",
        "Outcome Measures": "NPRS, running volume log, single-leg hop",
        "Clinical Guidelines": "MTSS load-management reviews; exclude BSI if red flags",
        "Evidence": "Load modification cornerstone; evidence for specific modalities mixed",
        "References": RC,
    }),
    ("Tibial Stress Fracture Rehabilitation", {
        "ID": "LL-REHAB-02", "Condition": "Tibial stress fracture", "Rehabilitation Phase": "Protected healing then reload (risk-site dependent)",
        "Goals": "Bone healing; safe graded impact return; correct energy availability",
        "Pain Management": "Unload until pain-free walking; nutrition referral if RED-S suspected",
        "Weight Bearing Status": "Boot/crutches per site/risk — high-risk anterior more protected",
        "ROM Goals": "Maintain ankle/knee/hip mobility in boot constraints",
        "Strength Goals": "Cross-training strength; progressive calf/hip when allowed",
        "Motor Control": "Gait retraining before run",
        "Balance Training": "When WB allows",
        "Proprioception": "Progressive",
        "Functional Training": "Deep-water run, bike per pain",
        "Sport-Specific Progression": "Walk → walk-run → continuous → speed/hills last",
        "Criteria to Progress": "Pain-free ADLs; clinician ± imaging milestones for high-risk",
        "Return to Running": "Only after cleared — often 6-8+ weeks low-risk",
        "Return to Sport": "Site-dependent; high-risk delayed substantially",
        "Outcome Measures": "Pain, hop, training log, RED-S screens",
        "Clinical Guidelines": "BSI risk stratification consensus themes",
        "Evidence": "MRI grading informs prognosis; high-risk sites need caution",
        "References": RC + " BSI consensus literature.",
    }),
    ("CECS Rehabilitation", {
        "ID": "LL-REHAB-03", "Condition": "Chronic exertional compartment syndrome", "Rehabilitation Phase": "Conservative trial ± post-fasciotomy",
        "Goals": "Reduce exertional pressure symptoms; return to desired sport",
        "Pain Management": "Stop at symptom onset early in rehab; avoid pushing through neuro symptoms",
        "Weight Bearing Status": "Full",
        "ROM Goals": "Ankle mobility; fascial glide adjunct",
        "Strength Goals": "Capacity of involved compartment muscles without symptom spike",
        "Motor Control": "Gait/run form cues (cadence, strike) — emerging supportive evidence",
        "Balance Training": "Standard ankle-leg progressions",
        "Proprioception": "Progressive",
        "Functional Training": "Cross-train below symptom threshold",
        "Sport-Specific Progression": "Timed run intervals below onset threshold then extend",
        "Criteria to Progress": "Delayed symptom onset; acceptable for goals OR proceed to surgery discussion",
        "Return to Running": "Symptom-threshold based",
        "Return to Sport": "Post-fasciotomy typically months with graded loading",
        "Outcome Measures": "Time-to-symptom onset, VAS, sport participation",
        "Clinical Guidelines": "Confirm diagnosis before fasciotomy; distinguish acute CS",
        "Evidence": "Fasciotomy success rates good in selected series; conservative first reasonable",
        "References": RC,
    }),
    ("Gastrocnemius Tear Rehabilitation", {
        "ID": "LL-REHAB-04", "Condition": "Gastrocnemius tear (tennis leg)", "Rehabilitation Phase": "Acute protect to RTS",
        "Goals": "Restore calf capacity and sprint/cut confidence",
        "Pain Management": "Early relative rest, compression, elevate; crutches if antalgic",
        "Weight Bearing Status": "WBAT as pain allows; avoid prolonged cast",
        "ROM Goals": "Early gentle DF within pain; restore full DF",
        "Strength Goals": "Isometrics → concentric heel raises → eccentric → loaded",
        "Motor Control": "Heel-toe gait restoration",
        "Balance Training": "Bilateral → unilateral",
        "Proprioception": "Progressive",
        "Functional Training": "Bike early; pool",
        "Sport-Specific Progression": "Jog → stride → sprint → sport COD",
        "Criteria to Progress": "Pain-free heel raises capacity, hop, sprint without apprehension",
        "Return to Running": "When walking and calf strength adequate",
        "Return to Sport": "Often 4-8+ weeks grade-dependent",
        "Outcome Measures": "Heel-rise endurance, NPRS, hop",
        "Clinical Guidelines": "Exclude Achilles rupture and DVT",
        "Evidence": "Early loading better than prolonged immobilization for muscle strain",
        "References": RC,
    }),
    ("Soleus Strain Rehabilitation", {
        "ID": "LL-REHAB-05", "Condition": "Soleus strain", "Rehabilitation Phase": "Progressive soleus loading",
        "Goals": "Restore bent-knee calf capacity for running midstance demands",
        "Pain Management": "Reduce hills/speed initially",
        "Weight Bearing Status": "Full",
        "ROM Goals": "Ankle DF with knee flexed",
        "Strength Goals": "Seated/bent-knee heavy slow heel raises primary",
        "Motor Control": "Midstance control drills",
        "Balance Training": "Single-leg",
        "Proprioception": "Progressive",
        "Functional Training": "Cross-train",
        "Sport-Specific Progression": "Walk-run → hills last",
        "Criteria to Progress": "Pain-free soleus loading volume",
        "Return to Running": "When bent-knee raises and walk pain-free",
        "Return to Sport": "When run volume tolerated",
        "Outcome Measures": "Bent-knee heel-rise endurance, run log",
        "Clinical Guidelines": "Differentiate DVT/MTSS",
        "Evidence": "Muscle loading principles; soleus-specific bias important",
        "References": RC,
    }),
    ("Peroneal Tendinopathy Rehabilitation", {
        "ID": "LL-REHAB-06", "Condition": "Peroneal tendinopathy", "Rehabilitation Phase": "Progressive tendon loading + stability",
        "Goals": "Improve eversion load tolerance; control subluxation risk",
        "Pain Management": "Reduce provocative cutting/uneven volume; isometrics for analgesia",
        "Weight Bearing Status": "Full",
        "ROM Goals": "Ankle inversion/eversion mobility without forcing unstable tendons",
        "Strength Goals": "Isometric eversion → isotonic → functional",
        "Motor Control": "Single-leg landing with frontal control",
        "Balance Training": "Uneven surface graded",
        "Proprioception": "Ankle disc/star excursion",
        "Functional Training": "Lateral band walks, side steps",
        "Sport-Specific Progression": "Linear → lateral → cutting",
        "Criteria to Progress": "Pain rules + strength + no subluxation apprehension",
        "Return to Running": "When daily pain settled with eversion loading",
        "Return to Sport": "When COD on uneven ground tolerated",
        "Outcome Measures": "NPRS, eversion strength, FAAM",
        "Clinical Guidelines": "Assess retinaculum/subluxation — surgical if mechanical instability",
        "Evidence": "Progressive loading + neuromuscular control supported clinically",
        "References": RC,
    }),
    ("Fibular Stress Fracture Rehabilitation", {
        "ID": "LL-REHAB-07", "Condition": "Fibular stress fracture", "Rehabilitation Phase": "Unload to graded impact",
        "Goals": "Bone healing; return to run without recurrence",
        "Pain Management": "Reduce impact until pain-free ADLs",
        "Weight Bearing Status": "Modify per pain; boot selected cases",
        "ROM Goals": "Maintain ankle mobility",
        "Strength Goals": "Hip/calf/eversion progressive when allowed",
        "Motor Control": "Gait retraining",
        "Balance Training": "When WB comfortable",
        "Proprioception": "Progressive",
        "Functional Training": "Cross-train",
        "Sport-Specific Progression": "Walk-run build",
        "Criteria to Progress": "Pain-free hop and ADLs",
        "Return to Running": "After clinical clearance window (~6-8 weeks typical low-risk)",
        "Return to Sport": "When training loads restored",
        "Outcome Measures": "Pain, hop, training log",
        "Clinical Guidelines": "BSI risk stratification",
        "Evidence": "Similar principles to other low-risk BSI",
        "References": RC,
    }),
]

EVIDENCE_RECORDS = [
    ("Key Evidence and Guidelines — Lower Leg Module", {
        "ID": "LL-EVID-01",
        "Topic": "Foundational references for Kinora lower leg AI orientation",
        "Anatomy": RA,
        "Biomechanics": RB,
        "Assessment": RC,
        "Compartment": "Acute compartment syndrome is a surgical emergency. CECS is distinct — exertional, reversible with rest; manometry protocols used for confirmation.",
        "Bone Stress": "MRI preferred for early BSI; risk-stratify anterior tibial cortex as higher risk; screen energy availability/RED-S when recurrent.",
        "MTSS": "Clinical diagnosis; load management first; exclude stress fracture if focal/night/hop pain.",
        "Calf": "Always differentiate tennis leg vs Achilles rupture (Thompson) vs DVT.",
        "AI Use Note": "Timelines and pressure cutoffs vary by protocol — prefer current orthopaedic/sports medicine guidance and individual assessment.",
        "References": "See fields above.",
    }),
]

TOC_SECTIONS = [
    "Disclaimer",
    "1. Bones (Tibia, Fibula)",
    "2. Compartments (Anterior, Lateral, Superficial Posterior, Deep Posterior)",
    "3. Muscles",
    "4. Nerves",
    "5. Blood Supply",
    "6. Fascia",
    "7. Biomechanics",
    "8. Pathologies",
    "9. Rehabilitation Pathways",
    "10. Evidence and Guidelines",
]


def build_pdf() -> Path:
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    doc = SimpleDocTemplate(
        str(OUTPUT_PATH), pagesize=letter,
        leftMargin=0.75 * inch, rightMargin=0.75 * inch,
        topMargin=0.75 * inch, bottomMargin=0.85 * inch,
        title="Kinora Lower Leg AI Orientation Part 9", author="Kinora AI Training",
    )
    styles = build_styles()
    story: list = []

    story.append(Spacer(1, 1.2 * inch))
    story.append(Paragraph("Kinora Lower Leg", styles["title"]))
    story.append(Paragraph("Clinical AI Orientation (Part 9)", styles["title"]))
    story.append(Spacer(1, 0.3 * inch))
    story.append(Paragraph("Structured reference for RAG / AI-assisted physiotherapy consultation", styles["subtitle"]))
    story.append(Spacer(1, 0.2 * inch))
    story.append(Paragraph(
        "Bones, Compartments, Muscles, Nerves, Vessels, Fascia, Biomechanics, Pathologies &amp; Rehabilitation",
        styles["subtitle"],
    ))
    story.append(Spacer(1, 0.5 * inch))
    story.append(Paragraph("Version 1.0 — Kinora Admin Conocimientos Upload", styles["subtitle"]))
    story.append(PageBreak())

    add_section(story, styles, "Disclaimer")
    story.append(Paragraph(
        "This document is an educational orientation resource for Kinora AI clinical consultation support. "
        "It is NOT a substitute for professional clinical judgment, direct patient examination, or licensed care. "
        "Content reflects Gray's/Standring, Moore, Netter, Neumann, Magee, Brukner &amp; Khan, and sports medicine "
        "themes for MTSS, bone stress injury, CECS, and calf injury. "
        "<b>Red flags — acute compartment syndrome, suspected DVT/PE, Achilles rupture, high-risk/open fracture, "
        "or acute foot drop with trauma — require urgent medical/orthopaedic referral.</b> "
        "Acute compartment syndrome is a surgical emergency; do not delay for imaging if clinically evident.",
        styles["disclaimer"],
    ))
    story.append(Spacer(1, 12))
    add_section(story, styles, "Table of Contents")
    for item in TOC_SECTIONS:
        story.append(Paragraph(f"• {esc(item)}", styles["toc"]))
    story.append(PageBreak())

    sections = [
        ("1. Bones", BONE_RECORDS),
        ("2. Compartments", COMPARTMENT_RECORDS),
        ("3. Muscles", MUSCLE_RECORDS),
        ("4. Nerves", NERVE_RECORDS),
        ("5. Blood Supply", BLOOD_RECORDS),
        ("6. Fascia", FASCIA_RECORDS),
        ("7. Biomechanics", BIOMECHANICS_RECORDS),
        ("8. Pathologies", PATHOLOGY_RECORDS),
        ("9. Rehabilitation Pathways", REHAB_RECORDS),
        ("10. Evidence and Guidelines", EVIDENCE_RECORDS),
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
    print(f"Generated: {out}")
    print(f"File size: {out.stat().st_size / 1024:.1f} KB")
    try:
        from pypdf import PdfReader
        print(f"Page count: {len(PdfReader(str(out)).pages)}")
    except ImportError:
        print("Page count: install pypdf for exact count")


if __name__ == "__main__":
    main()
