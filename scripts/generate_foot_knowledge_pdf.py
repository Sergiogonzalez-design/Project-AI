#!/usr/bin/env python3
"""Kinora Foot AI Orientation PDF (Part 11). Output: knowledge/Kinora_Foot_AI_Orientation.pdf"""
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

OUTPUT = SCRIPT_DIR.parent / "knowledge" / "Kinora_Foot_AI_Orientation.pdf"
REF = f"{RA} {RB} {RC}"


def B(id_, name, **kw):
    d = {"ID": id_, "Bone": name, **kw, "References": REF}
    return (name, d)


BONES = [
    B("FOOT-BONE-01", "First Metatarsal",
      Landmarks="Base, shaft, head; plantar crista for sesamoids",
      Articulations="Medial cuneiform (1st TMT), proximal phalanx (1st MTP), sesamoids",
      **{"Muscle Attachments": "TA, PL at base; FHB/AH/AdH via sesamoids/plantar plate complex",
         "Ligament Attachments": "TMT, MTP collaterals, plantar plate, deep transverse MT ligament",
         "Blood Supply": "First dorsal/plantar metatarsal arteries — AVN risk after osteotomy if disrupted",
         "Innervation": "Deep peroneal, medial plantar",
         "Ossification": "Primary shaft; epiphysis proximal (unique among MTs — base)",
         "Biomechanics": "Medial column lever; windlass via sesamoids; high load push-off",
         "Clinical Importance": "Hallux valgus/rigidus surgery; bunion; stress rare vs 2-5; sesamoid disorders",
         "Imaging": "WB AP/lateral/sesamoid view"}),
    B("FOOT-BONE-02", "Second Metatarsal",
      Landmarks="Longest MT; recessed base in cuneiform mortise",
      Articulations="Intermediate cuneiform; medial/lateral cuneiform partial; proximal phalanx",
      **{"Muscle Attachments": "Interossei, adductor hallucis oblique related",
         "Ligament Attachments": "Lisfranc ligament (medial cuneiform → 2nd MT base) critical",
         "Blood Supply": "Dorsal/plantar MT arteries", "Innervation": "Deep peroneal, plantar",
         "Ossification": "Epiphysis distal", "Biomechanics": "Keystone midfoot stability; high stress fracture rate",
         "Clinical Importance": "Lisfranc; march fracture classic; transfer metatarsalgia",
         "Imaging": "WB XR; MRI stress; CT Lisfranc"}),
    B("FOOT-BONE-03", "Third Metatarsal",
      Landmarks="Base articulates lateral cuneiform",
      Articulations="Lateral cuneiform, 2nd/4th MT bases, proximal phalanx",
      **{"Muscle Attachments": "Interossei", "Ligament Attachments": "TMT/intermetatarsal",
         "Blood Supply": "MT arteries", "Innervation": "Deep peroneal/plantar", "Ossification": "Distal epiphysis",
         "Biomechanics": "Central forefoot load share", "Clinical Importance": "Stress fracture; metatarsalgia",
         "Imaging": "WB XR; MRI"}),
    B("FOOT-BONE-04", "Fourth Metatarsal",
      Landmarks="Base with cuboid",
      Articulations="Cuboid, 3rd/5th MT, proximal phalanx",
      **{"Muscle Attachments": "Interossei", "Ligament Attachments": "TMT", "Blood Supply": "MT arteries",
         "Innervation": "Superficial/deep peroneal, lateral plantar", "Ossification": "Distal epiphysis",
         "Biomechanics": "Lateral forefoot", "Clinical Importance": "Stress fracture; Freiberg rare",
         "Imaging": "WB XR"}),
    B("FOOT-BONE-05", "Fifth Metatarsal",
      Landmarks="Tuberosity (PB insert); metaphyseal-diaphyseal junction (Jones zone); distal shaft",
      Articulations="Cuboid, 4th MT, proximal phalanx",
      **{"Muscle Attachments": "PB tuberosity; PL groove nearby; ADM; peroneus tertius dorsal base variable",
         "Ligament Attachments": "TMT; plantar/dorsal",
         "Blood Supply": "Watershed at Jones zone — healing risk",
         "Innervation": "Sural, lateral plantar, superficial peroneal",
         "Ossification": "Apophysis lateral tuberosity (Iselin) vs avulsion fracture differential in youth",
         "Biomechanics": "Lateral column; PB eversion lever",
         "Clinical Importance": "Zone 1 avulsion vs Zone 2 Jones vs Zone 3 stress — treatment differs markedly",
         "Imaging": "XR; MRI/CT if occult stress"}),
    B("FOOT-BONE-06", "Hallux Phalanges",
      Landmarks="Proximal and distal phalanx (IP joint); no middle phalanx",
      Articulations="1st MTP; hallux IP",
      **{"Muscle Attachments": "EHL, FHL, FHB, AH, AdH, EHB",
         "Ligament Attachments": "Collaterals, plantar plate, sesamoid apparatus",
         "Blood Supply": "Plantar/dorsal digital arteries", "Innervation": "Medial plantar / deep peroneal digital",
         "Ossification": "Epiphyses pattern standard",
         "Biomechanics": "Windlass and push-off; needs ~60+ deg MTP DF for normal gait push-off teaching values",
         "Clinical Importance": "Hallux valgus/rigidus, turf toe, sesamoiditis",
         "Imaging": "WB AP/lateral; sesamoid views"}),
    B("FOOT-BONE-07", "Lesser Toe Phalanges",
      Landmarks="Proximal, middle, distal phalanges toes 2-5 (5th middle often fused variants)",
      Articulations="MTP, PIP, DIP",
      **{"Muscle Attachments": "FDL/FDB, EDL/EDB, interossei, lumbricals",
         "Ligament Attachments": "Collaterals, plantar plates",
         "Blood Supply": "Digital arteries", "Innervation": "Plantar/digital nerves",
         "Ossification": "Standard phalangeal",
         "Biomechanics": "Grip and pressure distribution; deformity alters metatarsalgia",
         "Clinical Importance": "Hammer/claw/mallet toe; plantar plate tear (crossover toe)",
         "Imaging": "XR WB; MRI plantar plate"}),
    B("FOOT-BONE-08", "Hallucal Sesamoids",
      Landmarks="Tibial (medial) and fibular (lateral) under 1st MT head",
      Articulations="First MT head crista grooves",
      **{"Muscle Attachments": "FHB tendons embed; AH/AdH attachments via apparatus",
         "Ligament Attachments": "Sesamoid ligaments / plantar plate complex",
         "Blood Supply": "Plantar arteries — bipartite vs fracture differential",
         "Innervation": "Medial plantar branches",
         "Ossification": "Often multipartite (esp. tibial) — normal variant vs acute fracture",
         "Biomechanics": "Reduce friction; increase FHB MA; windlass contributors",
         "Clinical Importance": "Sesamoiditis, fracture, AVN (Renander), turf toe involvement",
         "Imaging": "Sesamoid axial view; MRI"}),
]

JOINTS = [
    ("First MTP Joint", {"ID": "FOOT-JNT-01", "Joint": "First metatarsophalangeal joint", "Type": "Synovial condyloid",
     "Capsule": "Reinforced by collaterals and plantar plate/sesamoid complex",
     "Articular Surfaces": "1st MT head with proximal phalanx base + sesamoids plantar",
     "Ligaments": "Medial/lateral collaterals, plantar plate, sesamoid ligaments",
     "Blood Supply": "First MT arteries", "Innervation": "Medial plantar, deep peroneal",
     "Arthrokinematics": "Roll/glide with DF/PF; sesamoids track under head",
     "Osteokinematics": "DF critical for push-off (~60 deg functional target often cited); PF; ABD/ADD",
     "Degrees of Freedom": "2 (DF/PF + ABD/ADD)", "Stability": "Plantar plate + sesamoid apparatus + dynamic FHL/FHB",
     "Biomechanics": "Windlass activation with hallux DF tightens plantar fascia",
     "Clinical Tests": "ROM DF/PF, grind (OA), Lachman of toe (plantar plate)",
     "Pain Referral": "1st MTP medial/plantar", "Common Pathologies": "HV, hallux rigidus, turf toe, sesamoiditis",
     "Rehabilitation": "Protect grade III turf toe; restore DF; toe flexor strength; rocker footwear selected",
     "References": REF}),
    ("Lesser MTP Joints", {"ID": "FOOT-JNT-02", "Joint": "Lesser metatarsophalangeal joints (2-5)", "Type": "Synovial condyloid",
     "Capsule": "Collaterals + plantar plates", "Articular Surfaces": "MT heads with proximal phalanges",
     "Ligaments": "Collaterals, plantar plates, deep transverse MT ligament",
     "Blood Supply": "MT arteries", "Innervation": "Plantar digital nerves",
     "Arthrokinematics": "DF/PF glides", "Osteokinematics": "DF/PF; minor ABD/ADD",
     "Degrees of Freedom": "2", "Stability": "Plantar plate primary plantar restraint",
     "Biomechanics": "Pressure share; failure → crossover toe / metatarsalgia",
     "Clinical Tests": "Vertical Lachman / drawer of toe; Mulder for neuroma interspace",
     "Pain Referral": "Plantar MT heads", "Common Pathologies": "Plantar plate tear, Freiberg, metatarsalgia, rheumatoid",
     "Rehabilitation": "Toe yoga, intrinsic strength, metatarsal pads, taping crossover toe",
     "References": REF}),
    ("IP Joints of Toes", {"ID": "FOOT-JNT-03", "Joint": "Interphalangeal joints (hallux IP; lesser PIP/DIP)", "Type": "Synovial hinge",
     "Capsule": "Collaterals + plantar plate", "Articular Surfaces": "Phalangeal heads/bases",
     "Ligaments": "Collaterals, plantar plates", "Blood Supply": "Digital arteries", "Innervation": "Digital nerves",
     "Arthrokinematics": "Hinge roll/glide", "Osteokinematics": "Flexion/extension",
     "Degrees of Freedom": "1", "Stability": "Collaterals", "Biomechanics": "Fine grip; deformity sites (hammer/mallet)",
     "Clinical Tests": "ROM; flexibility rigid vs flexible hammer toe",
     "Pain Referral": "Toe tips/dorsal PIP", "Common Pathologies": "Hammer/claw/mallet; arthritis",
     "Rehabilitation": "Flexible deformities — stretching/strengthening; rigid may need surgery consult",
     "References": REF}),
    ("Lisfranc (TMT) Joint Complex", {"ID": "FOOT-JNT-04", "Joint": "Tarsometatarsal / Lisfranc complex", "Type": "Synovial plane joints forming midfoot mortise",
     "Capsule": "Dorsal thinner than plantar", "Articular Surfaces": "Cuneiforms/cuboid with MT bases 1-5",
     "Ligaments": "Dorsal, plantar, interosseous; Lisfranc ligament (C1→MT2) critical",
     "Blood Supply": "Dorsalis pedis deep plantar branch courses near Lisfranc — injury risk",
     "Innervation": "Deep peroneal, plantar", "Arthrokinematics": "Limited glides — stability > mobility",
     "Osteokinematics": "Minimal; midfoot rigidity for push-off", "Degrees of Freedom": "Limited accessory",
     "Stability": "Osseous mortise of 2nd MT + Lisfranc ligament",
     "Biomechanics": "Transverse arch keystone; failure collapses midfoot",
     "Clinical Tests": "Piano key, midfoot squeeze, stress abduction; high index of suspicion after trauma",
     "Pain Referral": "Midfoot dorsal", "Common Pathologies": "Lisfranc sprain/fracture-dislocation — often missed",
     "Rehabilitation": "NWB period common if stable sprain; ORIF/arthrodesis if unstable — surgeon protocols",
     "References": REF}),
    ("Intermetatarsal Joints", {"ID": "FOOT-JNT-05", "Joint": "Intermetatarsal articulations / soft-tissue spaces", "Type": "Synovial plane (bases) + soft-tissue interspaces",
     "Capsule": "Limited base capsules", "Articular Surfaces": "MT bases",
     "Ligaments": "Deep transverse metatarsal ligament; interosseous",
     "Blood Supply": "MT network", "Innervation": "Digital/interdigital nerves (Morton neuroma site)",
     "Arthrokinematics": "Minimal", "Osteokinematics": "Splay under load", "Degrees of Freedom": "Accessory",
     "Stability": "Deep transverse MT ligament", "Biomechanics": "Forefoot splay; neuroma compression in 3-4 interspace classic",
     "Clinical Tests": "Mulder's click", "Pain Referral": "Web space / toes", "Common Pathologies": "Morton neuroma; bursitis",
     "Rehabilitation": "Wide toe box, met pads, injection selected", "References": REF}),
]

LIGAMENTS = [
    ("Lisfranc Ligament Complex", {"ID": "FOOT-LIG-01", "Ligament": "Lisfranc ligament (medial cuneiform to 2nd MT base) + dorsal/plantar TMT ligaments",
     "Origin": "Medial cuneiform (Lisfranc proper)", "Insertion": "Base 2nd MT medial",
     "Fiber Orientation": "Oblique plantar-medial strongest component often plantar/interosseous",
     "Function": "Prevents MT2 separation from medial column; midfoot stability keystone",
     "Biomechanics": "Failure allows diastasis and midfoot collapse under load",
     "Injury Mechanism": "Axial load on PF foot; twist; indirect sports trauma — often subtle",
     "Healing": "Unstable injuries need surgical stabilization; missed injury → midfoot OA/collapse",
     "Clinical Tests": "Pain midfoot, inability to toe raise, diastasis on WB XR",
     "Imaging": "WB bilateral AP — look >2 mm diastasis; CT/MRI",
     "Rehabilitation": "Strict per stability/surgery; delayed impact", "References": REF}),
    ("Plantar Plate (MTP)", {"ID": "FOOT-LIG-02", "Ligament": "Plantar plate of MTP joints",
     "Origin": "Metatarsal neck periosteum / plantar capsule", "Insertion": "Proximal phalanx plantar base",
     "Fiber Orientation": "Plantar fibrocartilage plate", "Function": "Resists MTP hyperextension / dorsal subluxation",
     "Biomechanics": "Fails in crossover 2nd toe deformity continuum", "Injury Mechanism": "Repetitive overload, acute turf-toe like lesser toes",
     "Healing": "Partial may stabilize with taping/offload; complete may need repair",
     "Clinical Tests": "Vertical drawer, crossover deformity", "Imaging": "MRI",
     "Rehabilitation": "Taping, rocker shoe, intrinsic strength", "References": REF}),
    ("Deep Transverse Metatarsal Ligament", {"ID": "FOOT-LIG-03", "Ligament": "Deep transverse metatarsal ligament",
     "Origin": "Plantar plate / MT head region spanning", "Insertion": "Adjacent MT heads/plantar plates",
     "Fiber Orientation": "Transverse forefoot", "Function": "Prevents excessive MT splay; neuroma lies dorsal to it",
     "Biomechanics": "Compression corridor for interdigital nerve", "Injury Mechanism": "Not typically isolated tear focus — neuroma context",
     "Healing": "N/A primary", "Clinical Tests": "Mulder", "Imaging": "US/MRI neuroma",
     "Rehabilitation": "Forefoot offload strategies", "References": REF}),
    ("Long & Short Plantar Ligaments", {"ID": "FOOT-LIG-04", "Ligament": "Long plantar and short plantar (plantar calcaneocuboid) ligaments",
     "Origin": "Calcaneus plantar", "Insertion": "Cuboid ± MT bases (long plantar)",
     "Fiber Orientation": "Longitudinal lateral column", "Function": "Static lateral longitudinal arch support",
     "Biomechanics": "PL tendon runs in long plantar tunnel/groove region", "Injury Mechanism": "Midfoot sprain continuum",
     "Healing": "With lateral column sprain care", "Clinical Tests": "Lateral midfoot pain map", "Imaging": "MRI",
     "Rehabilitation": "Load progressive; PL capacity", "References": REF}),
    ("Toe Collateral Ligaments", {"ID": "FOOT-LIG-05", "Ligament": "MTP/IP collateral ligaments",
     "Origin": "MT/phalanx heads", "Insertion": "Adjacent phalanx bases",
     "Fiber Orientation": "Medial/lateral", "Function": "Varus/valgus stability of toes",
     "Biomechanics": "HV attenuates medial 1st MTP restraints", "Injury Mechanism": "Trauma; chronic HV",
     "Healing": "Taping/stabilize; surgical in HV correction", "Clinical Tests": "Varus/valgus stress toes",
     "Imaging": "XR alignment; MRI selected", "Rehabilitation": "Protection; alignment footwear", "References": REF}),
]


def mus(id_, name, o, i, n, b, f, emg, clin, ex, prog):
    return (name, {"ID": id_, "Muscle": name, "Origin": o, "Insertion": i, "Innervation": n, "Blood Supply": b,
                   "Function": f, "EMG": emg, "Clinical Importance": clin, "Exercises": ex, "Progressions": prog, "References": REF})


INTRINSICS = [
    mus("FOOT-INT-01", "Abductor Hallucis", "Calcaneal tuberosity / flexor retinaculum", "Medial proximal phalanx hallux / medial sesamoid",
        "Medial plantar (S2-S3)", "Medial plantar artery", "Abducts/flexes hallux; medial arch dynamic", "High in short-foot tasks",
        "HV medial support; Baxter nerve nearby", "Short foot, toe spread, doming", "Isometrics → walking doming → run"),
    mus("FOOT-INT-02", "Flexor Digitorum Brevis", "Calcaneal tuberosity", "Middle phalanges 2-5",
        "Medial plantar", "Medial plantar artery", "Flexes PIP toes 2-5", "Stance grip", "Hammer toe balance with intrinsics",
        "Towel curls, piano toes", "Add load / single-leg"),
    mus("FOOT-INT-03", "Abductor Digiti Minimi", "Calcaneal tuberosity", "Lateral 5th proximal phalanx",
        "Lateral plantar", "Lateral plantar artery", "Abducts 5th toe; lateral arch assist", "Stance", "5th ray stability",
        "5th toe abduction drills", "Barefoot control progressions"),
    mus("FOOT-INT-04", "Quadratus Plantae", "Calcaneus plantar", "FDL tendon margin",
        "Lateral plantar", "Lateral plantar artery", "Straightens FDL pull line", "With FDL", "Toe flexion efficiency",
        "Toe flexion with alignment", "Combined FDL loading"),
    mus("FOOT-INT-05", "Lumbricals (Foot)", "FDL tendons", "Extensor expansions / proximal phalanges",
        "1st medial plantar; 2-4 lateral plantar", "Plantar arteries", "Flex MTP / extend IP (balance)", "Fine control",
        "Claw toe when intrinsic weak / extrinsic dominant", "Intrinsic toe yoga", "Progress to balance tasks"),
    mus("FOOT-INT-06", "Flexor Hallucis Brevis", "Cuboid/lateral cuneiform", "Both sides proximal phalanx via sesamoids",
        "Medial plantar", "Medial plantar artery", "Flexes hallux MTP; sesamoid control", "Push-off", "Sesamoiditis; HV surgery",
        "Hallux MTP flexion isometrics", "Push-off drills"),
    mus("FOOT-INT-07", "Adductor Hallucis", "Oblique: MT2-4 bases; Transverse: plantar plates 3-5", "Lateral hallux proximal phalanx / lateral sesamoid",
        "Lateral plantar deep branch", "Plantar arch arteries", "Adducts hallux; transverse arch assist", "Forefoot",
        "HV (adductor pull lateralizes); transverse arch", "Toe adduction control, metatarsal dome", "Footwear + strength"),
    mus("FOOT-INT-08", "Flexor Digiti Minimi Brevis", "Base 5th MT", "Proximal phalanx 5th",
        "Lateral plantar", "Lateral plantar artery", "Flexes 5th MTP", "Stance", "5th ray", "5th toe flexion", "Barefoot gait"),
    mus("FOOT-INT-09", "Plantar Interossei", "Medial sides MT3-5", "Proximal phalanges / extensor expansions",
        "Lateral plantar", "Plantar arteries", "Adduct toes toward 2nd; flex MTP", "Fine", "Toe alignment", "Toe adduction", "Progress balance"),
    mus("FOOT-INT-10", "Dorsal Interossei", "Adjacent MT shafts", "Proximal phalanges (abduct from 2nd ray axis)",
        "Lateral plantar", "Dorsal MT arteries", "Abduct toes; flex MTP", "Fine", "Metatarsalgia space", "Toe abduction spreads", "Wide toe box functional"),
]

EXTRINSICS = [
    mus("FOOT-EXT-01", "Tibialis Anterior (foot insertion)", "Lateral tibia", "Medial cuneiform/1st MT", "Deep peroneal", "Anterior tibial",
        "DF/inversion; decelerates PF at IC", "IC eccentric", "Foot drop; first-ray elevation couple with PL", "Heel walks", "Gait drills"),
    mus("FOOT-EXT-02", "Tibialis Posterior (foot insertion)", "IO membrane", "Navicular + plantar inserts", "Tibial", "PTA",
        "Dynamic arch; inversion", "Midstance", "PTTD / AAFD", "Arch control heel rises", "Stage-based loading"),
    mus("FOOT-EXT-03", "Peroneus Longus (foot)", "Fibula", "Medial cuneiform/1st MT plantar", "Superficial peroneal", "Fibular",
        "PF 1st ray; eversion", "Push-off/lateral", "1st ray stability vs TA", "PL heel raises", "Uneven ground"),
    mus("FOOT-EXT-04", "Peroneus Brevis (foot)", "Fibula", "5th MT tuberosity", "Superficial peroneal", "Fibular",
        "Eversion", "Lateral ankle", "5th MT avulsion / tears", "Eversion band", "CAI program"),
    mus("FOOT-EXT-05", "FHL (foot)", "Fibula", "Hallux distal phalanx", "Tibial", "Fibular/PTA",
        "Hallux PF push-off", "Toe-off", "Turf toe continuum / sesamoid load", "Toe flexion calf raises", "Push-off plyos"),
    mus("FOOT-EXT-06", "FDL (foot)", "Tibia", "Distal phalanges 2-5", "Tibial", "PTA",
        "Toe grip", "Stance", "Claw toe if overactive vs intrinsics", "Towel curls with MTP control", "Intrinsic balance"),
    mus("FOOT-EXT-07", "EHL/EDL (foot)", "Leg", "Distal phalanx hallux / toes 2-5", "Deep peroneal", "Anterior tibial",
        "Toe clearance", "Swing", "Laceration; L5 testing", "Toe extension", "Clearance drills"),
    mus("FOOT-EXT-08", "Achilles (foot insertion)", "Triceps surae", "Calcaneal tuberosity", "Tibial", "Watershed mid-tendon",
        "PF power into foot lever", "Propulsion", "Insertional vs midportion pathology; Haglund", "Heel raises per tendinopathy rules", "Energy storage late"),
]

PLANTAR_FASCIA = [("""Plantar Fascia (Aponeurosis)""", {
    "ID": "FOOT-PF-01", "Structure": "Dense plantar aponeurosis — central, medial, lateral bands",
    "Attachments": "Medial calcaneal tuberosity → digitate slips blending with plantar plates / proximal phalanges via windlass",
    "Continuity": "Continuous with Achilles/calcaneal periosteum continuum conceptually (superficial posterior chain)",
    "Windlass Mechanism": "Hallux DF winds fascia around MT heads → raises MLA and stiffens foot for push-off (Hicks)",
    "Biomechanics": "Static arch support + dynamic windlass; stores/releases energy in running",
    "Clinical Importance": "Plantar fasciopathy most common cause of inferior heel pain in runners/adults",
    "Assessment": "First-step pain, medial calcaneal tubercle tenderness, windlass test, exclude fat pad/nerve/stress Fx",
    "Treatment": "Load management, plantar fascia–specific stretching, calf loading, orthoses selected, CSI limited/ judicious, shockwave selected evidence",
    "Rehabilitation": "Pain-guided loading; avoid sudden hill/sprint spikes; footwear review; night splints optional adjunct",
    "References": REF + " Hicks windlass; plantar fasciopathy clinical practice guidelines themes.",
})]

ARCHES = [
    ("Medial Longitudinal Arch", {"ID": "FOOT-ARCH-01", "Arch": "Medial longitudinal arch (MLA)",
     "Bones": "Calcaneus, talus, navicular, cuneiforms, MT1-3",
     "Ligament Support": "Spring ligament, plantar fascia, deltoid/TN complex",
     "Muscular Support": "TP primary dynamic; intrinsics; FHL/FDL; TA",
     "Biomechanics": "Shock absorption early stance; windlass stiffens late stance",
     "Clinical Importance": "Pes planus / PTTD; pes cavus high arch overload lateral/forefoot",
     "Pathologies": "AAFD, plantar fasciopathy tension, navicular stress",
     "Assessment": "Navicular drop/drift, Feiss line, too-many-toes, WB XR Meary angle",
     "Rehabilitation": "TP/intrinsics, orthoses stage-based, footwear", "References": REF}),
    ("Lateral Longitudinal Arch", {"ID": "FOOT-ARCH-02", "Arch": "Lateral longitudinal arch",
     "Bones": "Calcaneus, cuboid, MT4-5", "Ligament Support": "Long/short plantar ligaments, lateral plantar fascia band",
     "Muscular Support": "PL, PB, ADM", "Biomechanics": "Lower/stabler than MLA; contact in stance",
     "Clinical Importance": "Cuboid syndrome; 5th MT overload in cavovarus", "Pathologies": "Jones fracture risk mechanics",
     "Assessment": "Lateral column pain map", "Rehabilitation": "PL capacity; lateral column load management", "References": REF}),
    ("Transverse Arch", {"ID": "FOOT-ARCH-03", "Arch": "Transverse metatarsal arch",
     "Bones": "Cuneiforms/cuboid midfoot + MT heads forefoot", "Ligament Support": "Deep transverse MT ligament; interossei",
     "Muscular Support": "Adductor hallucis transverse; PL", "Biomechanics": "Forefoot splay control; pressure distribution",
     "Clinical Importance": "Metatarsalgia; Morton neuroma; collapsed forefoot splay", "Pathologies": "Transfer lesions after 1st ray insufficiency",
     "Assessment": "Callus pattern; Mulder; metatarsal pad trial", "Rehabilitation": "Intrinsic dome, met pads, shoe width", "References": REF}),
]

BIO = [
    ("Windlass Mechanism", {"ID": "FOOT-BIO-01", "Topic": "Windlass", "Description": "Hallux DF tightens plantar fascia around MT heads elevating MLA (Hicks)",
     "Clinical Relevance": "Limited hallux DF impairs push-off stiffness; fasciopathy pain with windlass provocation",
     "Exercises": "Great toe DF mobility if limited; controlled heel rises", "References": REF}),
    ("Push-off", {"ID": "FOOT-BIO-02", "Topic": "Push-off / propulsion", "Description": "PF power via Achilles + windlass + hallux DF + FHL",
     "Clinical Relevance": "Hallux rigidus/turf toe reduce efficient push-off", "Exercises": "Heel rises, hallux DF strength, plyometrics graded", "References": REF}),
    ("Foot Pronation/Supination", {"ID": "FOOT-BIO-03", "Topic": "Pronation and supination of the foot", "Description": "Triplanar STJ+midtarsal motion; closed-chain tibial coupling",
     "Clinical Relevance": "Neither maximally pronated nor rigid is inherently pathologic — capacity and symptoms matter",
     "Exercises": "TP control, cadence, footwear matching load", "References": REF}),
    ("Load Distribution", {"ID": "FOOT-BIO-04", "Topic": "Plantar load distribution", "Description": "Heel → lateral border → metatarsal heads → hallux in typical walking pressure progression",
     "Clinical Relevance": "Callus maps overload; diabetic offloading critical", "Exercises": "Gait training, orthoses, metatarsal doming", "References": REF}),
    ("Walking/Running/Cutting Foot Demands", {"ID": "FOOT-BIO-05", "Topic": "Locomotor foot demands", "Description": "Walking moderate loads; running multiplies pressure/rates; cutting adds shear INV/EV",
     "Clinical Relevance": "BSI, neuroma, fasciopathy flare with spikes", "Exercises": "Graded exposure, surface progression", "References": REF}),
]

NV = [
    ("Medial Plantar Nerve", {"ID": "FOOT-NV-01", "Nerve": "Medial plantar nerve", "Sensory Distribution": "Medial sole / medial 3.5 toes plantar",
     "Motor Supply": "AH, FDB, FHB, 1st lumbrical", "Entrapment Sites": "Jogger's foot — entrapment in tunnel near navicular",
     "Clinical Tests": "Tinel medial arch; sensory map", "Vascular Supply": "Travels with medial plantar artery", "Pulses": "Document PT/DP", "References": REF}),
    ("Lateral Plantar Nerve / Baxter", {"ID": "FOOT-NV-02", "Nerve": "Lateral plantar nerve incl. Baxter's nerve (1st branch)", "Sensory Distribution": "Lateral sole / lateral 1.5 toes; Baxter mainly motor to ADM ± sensory calcaneal contribution variable",
     "Motor Supply": "ADM, QP, AddH, FDMB, interossei, lumbricals 2-4", "Entrapment Sites": "Baxter nerve under AH — chronic medial heel pain differential vs fasciopathy",
     "Clinical Tests": "ADM weakness rare clinically; pain map; diagnostic US/MRI selected", "Vascular Supply": "Lateral plantar artery", "Pulses": "PT pulse proximal", "References": REF}),
    ("Interdigital Nerves (Morton)", {"ID": "FOOT-NV-03", "Nerve": "Interdigital plantar nerves (esp. 3-4 web)", "Sensory Distribution": "Adjacent toe sides",
     "Motor Supply": "None significant clinically", "Entrapment Sites": "Under deep transverse MT ligament — Morton neuroma",
     "Clinical Tests": "Mulder's click; web space squeeze pain", "Vascular Supply": "Digital arteries", "Pulses": "DP/PT limb context", "References": REF}),
    ("Dorsalis Pedis / PT Pulses", {"ID": "FOOT-NV-04", "Nerve": "Vascular assessment landmark record", "Sensory Distribution": "N/A",
     "Motor Supply": "N/A", "Entrapment Sites": "PAD / trauma / compartment — ischemia emergency",
     "Clinical Tests": "Palpate DP (lat to EHL) and PT (posteroinferior medial malleolus); capillary refill; ABI if indicated",
     "Vascular Supply": "DP continuation of anterior tibial; PT → medial/lateral plantar arch", "Pulses": "DP + PT mandatory after trauma and in diabetics", "References": REF}),
]

FUNC = [("""Foot Functional Assessment""", {
    "ID": "FOOT-FUNC-01", "ROM": "1st MTP DF/PF, ankle DF, hallux IP; STJ INV/EV",
    "Strength": "Intrinsics (doming), TP heel rise, toe flexion, FHL",
    "Gait": "Heel-to-toe, early heel-off, propulsive hallux, callus pattern",
    "Balance": "SLS, foam, YBT",
    "Functional Tests": "Heel rises, single-leg hops, step-downs",
    "Hop Tests": "As ankle battery when RTS foot injuries",
    "Heel Raise": "Inversion for TP; height symmetry",
    "Landing": "Forefoot control without excessive INV",
    "Return-to-Sport Criteria": "Pain-free push-off, hop LSI, sport volume tolerance, footwear plan",
    "Outcome Measures": "FAAM, FFI, FAOS, VISA-A if Achilles related",
    "References": REF,
})]

TESTS = [
    ("Windlass Test", {"ID": "FOOT-TEST-01", "Test": "Windlass test", "Purpose": "Provocation for plantar fasciopathy",
     "Positive Finding": "Heel pain reproduced with passive hallux DF WB/NWB variants",
     "Sensitivity": "Moderate/variable", "Specificity": "Higher specificity reported in some studies vs Sn",
     "Evidence": "Useful cluster with history of first-step pain — not standalone", "References": REF}),
    ("Mulder's Click", {"ID": "FOOT-TEST-02", "Test": "Mulder's click / squeeze", "Purpose": "Morton neuroma",
     "Positive Finding": "Painful click with dorsal-plantar compression + web squeeze",
     "Sensitivity": "Moderate", "Specificity": "Moderate — clinical diagnosis supported by US",
     "Evidence": "Common clinical test; confirm with imaging if invasive care planned", "References": REF}),
    ("Tinel at Tarsal Tunnel", {"ID": "FOOT-TEST-03", "Test": "Tinel sign tarsal tunnel", "Purpose": "Tibial nerve entrapment",
     "Positive Finding": "Tingling into sole with percussion behind medial malleolus",
     "Sensitivity": "Limited alone", "Specificity": "Limited alone",
     "Evidence": "Part of cluster with neurodynamics and sensory testing", "References": REF}),
    ("Too-Many-Toes Sign", {"ID": "FOOT-TEST-04", "Test": "Too-many-toes sign", "Purpose": "Hindfoot valgus / AAFD screening",
     "Positive Finding": "More than 1-2 toes visible lateral when viewed from behind",
     "Sensitivity": "Clinical screening", "Specificity": "N/A formal",
     "Evidence": "Classic PTTD/AAFD exam element with heel rise", "References": REF}),
    ("Single Heel Rise (Foot)", {"ID": "FOOT-TEST-05", "Test": "Single heel rise for TP", "Purpose": "TP functional strength / staging PTTD",
     "Positive Finding": "Inability to invert/rise or early abort",
     "Sensitivity": "Clinically useful", "Specificity": "Pain may limit",
     "Evidence": "Core staging tool for PTTD", "References": REF}),
    ("Piano Key Test (Lisfranc)", {"ID": "FOOT-TEST-06", "Test": "Piano key / midfoot stress", "Purpose": "Lisfranc instability suspicion",
     "Positive Finding": "Pain/mobility midfoot with dorsal-plantar MT translation",
     "Sensitivity": "Limited — high clinical suspicion needed", "Specificity": "Limited",
     "Evidence": "Any midfoot trauma with swelling/ecchymosis plantar → image WB", "References": REF}),
]

PATH = [
    ("Plantar Fasciopathy", {"ID": "FOOT-PATH-01", "Condition": "Plantar fasciopathy", "Epidemiology": "Very common inferior heel pain; runners and middle-aged adults",
     "Mechanism": "Repetitive tensile overload at calcaneal enthesis continuum", "Symptoms": "First-step morning pain, medial calcaneal tubercle tenderness",
     "Differential Diagnosis": "Fat pad, Baxter nerve, calcaneal stress Fx, S1 radiculopathy",
     "Clinical Tests": "Windlass, palpation", "Imaging": "US thickening; MRI if atypical/stress Fx concern",
     "Conservative Treatment": "Load mod, stretching, calf capacity, orthoses, SWT selected; CSI judicious",
     "Surgical Treatment": "Rare partial release selected failures", "Rehabilitation": "12+ weeks progressive often",
     "Return to Sport": "Pain-guided running build", "Prognosis": "Good majority with active care", "References": REF}),
    ("Morton's Neuroma", {"ID": "FOOT-PATH-02", "Condition": "Morton's neuroma", "Epidemiology": "Women > men; 3-4 web most common",
     "Mechanism": "Perineural fibrosis interdigital nerve under transverse MT ligament", "Symptoms": "Forefoot burning, pebble-in-shoe, toe paresthesia",
     "Differential Diagnosis": "Metatarsalgia, plantar plate, stress Fx, bursitis",
     "Clinical Tests": "Mulder", "Imaging": "US/MRI", "Conservative Treatment": "Wide toe box, met pad, injection",
     "Surgical Treatment": "Neurectomy selected", "Rehabilitation": "Footwear + intrinsic dome", "Return to Sport": "When shoe/load tolerated",
     "Prognosis": "Variable; stump neuroma risk after surgery", "References": REF}),
    ("Hallux Valgus", {"ID": "FOOT-PATH-03", "Condition": "Hallux valgus (bunion)", "Epidemiology": "Common; female predominance; footwear/genetic factors",
     "Mechanism": "Progressive 1st MTP valgus / MT varus with medial capsule failure", "Symptoms": "Medial eminence pain, shoe conflict, transfer metatarsalgia",
     "Differential Diagnosis": "Gout, hallux rigidus, sesamoid", "Clinical Tests": "ROM, alignment, callus map",
     "Imaging": "WB XR angles (HVA, IMA)", "Conservative Treatment": "Wide toe box, orthoses, pain mod — does not reverse deformity",
     "Surgical Treatment": "Osteotomy/soft tissue procedures individualized", "Rehabilitation": "Post-op protocols surgeon-specific; gait/1st ray function",
     "Return to Sport": "Months post-op", "Prognosis": "Surgery for pain/function not cosmetics alone ideally", "References": REF}),
    ("Hallux Rigidus", {"ID": "FOOT-PATH-04", "Condition": "Hallux rigidus", "Epidemiology": "Common 1st MTP OA",
     "Mechanism": "Degenerative 1st MTP cartilage loss ± osteophytes", "Symptoms": "DF pain/stiffness, dorsal osteophyte irritation",
     "Differential Diagnosis": "Turf toe, gout, sesamoid", "Clinical Tests": "Grind, limited DF", "Imaging": "WB XR",
     "Conservative Treatment": "Rocker shoe, carbon insert, injection, activity mod",
     "Surgical Treatment": "Cheilectomy, fusion, implant selected", "Rehabilitation": "Protect DF extremes early post-op per procedure",
     "Return to Sport": "Fusion limits some sports — counsel", "Prognosis": "Fusion reliable pain relief", "References": REF}),
    ("Metatarsalgia", {"ID": "FOOT-PATH-05", "Condition": "Metatarsalgia (mechanical)", "Epidemiology": "Common forefoot overload",
     "Mechanism": "Excess pressure MT heads — long 2nd MT, cavus, HV transfer, fat pad atrophy", "Symptoms": "Plantar MT head pain with WB",
     "Differential Diagnosis": "Neuroma, plantar plate, Freiberg, stress Fx", "Clinical Tests": "Palpation, drawer of toe",
     "Imaging": "XR WB; MRI if Fx/plate", "Conservative Treatment": "Met pads, footwear, intrinsic strength, activity mod",
     "Surgical Treatment": "Address deformity drivers selected", "Rehabilitation": "Load redistribution", "Return to Sport": "Graded",
     "Prognosis": "Good if drivers addressed", "References": REF}),
    ("Lisfranc Injury", {"ID": "FOOT-PATH-06", "Condition": "Lisfranc injury", "Epidemiology": "Often missed in ED; sports and trauma",
     "Mechanism": "Axial PF load / twist", "Symptoms": "Midfoot pain/swelling, plantar ecchymosis classic, inability to push off",
     "Differential Diagnosis": "Ankle sprain mislabel, MT base fracture", "Clinical Tests": "Piano key; high suspicion",
     "Imaging": "WB XR bilateral; CT/MRI", "Conservative Treatment": "Stable nondisplaced — protected NWB often",
     "Surgical Treatment": "ORIF or primary arthrodesis if unstable", "Rehabilitation": "Prolonged; delayed run",
     "Return to Sport": "Often 4-6+ months", "Prognosis": "Missed → midfoot collapse/OA", "References": REF}),
    ("Turf Toe", {"ID": "FOOT-PATH-07", "Condition": "Turf toe (1st MTP plantar plate/capsule sprain)", "Epidemiology": "Football/artificial surfaces classic",
     "Mechanism": "Hyperextension 1st MTP", "Symptoms": "1st MTP pain, swelling, push-off weakness",
     "Differential Diagnosis": "Sesamoid fracture, HV", "Clinical Tests": "DF stress pain, weakened toe-off",
     "Imaging": "XR; MRI grade soft tissue", "Conservative Treatment": "Tapingspica, rigid insert, graded ROM grade I-II",
     "Surgical Treatment": "Grade III selected repair", "Rehabilitation": "Protect hyperextension; progressive push-off",
     "Return to Sport": "Grade-dependent weeks–months", "Prognosis": "Residual stiffness/pain if severe", "References": REF}),
    ("Metatarsal / Navicular Stress Fracture", {"ID": "FOOT-PATH-08", "Condition": "Foot bone stress injuries", "Epidemiology": "Runners; navicular high-risk; MT2-3 common",
     "Mechanism": "Load > remodeling; energy availability", "Symptoms": "Focal bony pain, hop pain",
     "Differential Diagnosis": "Neuroma, synovitis", "Clinical Tests": "Point tenderness, hop",
     "Imaging": "MRI gold early", "Conservative Treatment": "Unload risk-stratified; RED-S screen",
     "Surgical Treatment": "Navicular/selected 5th MT Jones may need fixation", "Rehabilitation": "Graded return run",
     "Return to Sport": "Site-dependent", "Prognosis": "Guarded high-risk sites", "References": REF}),
    ("Pes Planus / Cavus", {"ID": "FOOT-PATH-09", "Condition": "Pes planus and pes cavus foot types", "Epidemiology": "Planus common flexible childhood; cavus neurologic workup if progressive",
     "Mechanism": "Planus: ligamentous laxity/PTTD; Cavus: plantarflexed 1st ray / neurologic", "Symptoms": "Planus: medial strain; Cavus: lateral overload, ankle INV sprains, metatarsalgia",
     "Differential Diagnosis": "Coalition (rigid planus youth); Charcot-Marie-Tooth for cavus",
     "Clinical Tests": "Coleman block, heel rise, neurologic exam cavus", "Imaging": "WB XR; MRI/neuro studies as indicated",
     "Conservative Treatment": "Orthoses matched to type; strength; footwear",
     "Surgical Treatment": "Realignment selected symptomatic", "Rehabilitation": "Type-specific loading",
     "Return to Sport": "Individual", "Prognosis": "Depends on cause", "References": REF}),
    ("Sesamoiditis / Fat Pad Contusion", {"ID": "FOOT-PATH-10", "Condition": "Sesamoiditis and heel fat pad contusion", "Epidemiology": "Runners, dancers; older adults fat pad",
     "Mechanism": "Repetitive plantar overload", "Symptoms": "Plantar 1st MTP or central heel pain — fat pad worse with hard heel strike",
     "Differential Diagnosis": "Fasciopathy (more medial calcaneal), Fx sesamoid", "Clinical Tests": "Palpation map; windlass less for fat pad",
     "Imaging": "XR/MRI sesamoid", "Conservative Treatment": "Offload pads, footwear, activity mod",
     "Surgical Treatment": "Rare sesamoidectomy risks", "Rehabilitation": "Graded load", "Return to Sport": "When offload strategies allow training",
     "Prognosis": "Good with load care", "References": REF}),
]

REHAB = [
    ("Plantar Fasciopathy Rehab", {"ID": "FOOT-REHAB-01", "Condition": "Plantar fasciopathy",
     "Acute Phase": "Reduce provocative impact; maintain fitness cross-train",
     "Protection": "Supportive shoes; avoid barefoot on hard floors initially if irritable",
     "Mobility": "Plantar fascia and calf stretches", "Strength": "Heavy slow calf + intrinsic foot",
     "Balance": "SLS arch control", "Plyometrics": "Late", "Running Progression": "Pain-guided walk-run",
     "Cutting": "After linear tolerance", "Sport-Specific Drills": "Graded",
     "Return-to-Play Criteria": "First-step pain minimal; training loads stable 2+ weeks", "References": REF}),
    ("Turf Toe Rehab", {"ID": "FOOT-REHAB-02", "Condition": "Turf toe",
     "Acute Phase": "Protect hyperextension (boot/rigid insert)", "Protection": "Toe spica taping for return",
     "Mobility": "Graded MTP ROM after protection", "Strength": "FHL/FHB isometrics → isotonic",
     "Balance": "When WB comfortable", "Plyometrics": "Delayed push-off drills", "Running Progression": "After pain-free walk/push-off",
     "Cutting": "Late", "Sport-Specific Drills": "Position-specific with taping",
     "Return-to-Play Criteria": "Near-full DF without pain; push-off power; tape/insert plan", "References": REF}),
    ("Lisfranc Rehab Principles", {"ID": "FOOT-REHAB-03", "Condition": "Lisfranc injury",
     "Acute Phase": "NWB often until stability confirmed", "Protection": "Boot/cast per ortho",
     "Mobility": "After WB allowed — midfoot careful", "Strength": "Proximal + progressive foot intrinsics",
     "Balance": "Delayed", "Plyometrics": "Late", "Running Progression": "Often 3-6+ months",
     "Cutting": "Last", "Sport-Specific Drills": "Graded midfoot load",
     "Return-to-Play Criteria": "Surgeon clearance, hop, pain-free push-off, imaging as indicated", "References": REF}),
    ("Metatarsal Stress Fracture Rehab", {"ID": "FOOT-REHAB-04", "Condition": "Metatarsal stress fracture",
     "Acute Phase": "Unload impact", "Protection": "Boot/ crutches per site",
     "Mobility": "Maintain ankle/hip", "Strength": "Cross-train non-impact",
     "Balance": "When WB ok", "Plyometrics": "After bone healing window", "Running Progression": "Walk-run after clinical clearance",
     "Cutting": "After continuous run", "Sport-Specific Drills": "Graded",
     "Return-to-Play Criteria": "Pain-free hop and run volume build without delayed pain", "References": REF}),
    ("Morton Neuroma Rehab", {"ID": "FOOT-REHAB-05", "Condition": "Morton's neuroma",
     "Acute Phase": "Wide toe box immediately", "Protection": "Metatarsal pad proximal to heads",
     "Mobility": "Calf/ankle if limited DF increases forefoot load", "Strength": "Intrinsic dome",
     "Balance": "SLS", "Plyometrics": "As tolerated", "Running Progression": "If footwear/pad controls symptoms",
     "Cutting": "As tolerated", "Sport-Specific Drills": "Footwear critical",
     "Return-to-Play Criteria": "Symptom-controlled sport volumes; injection/surgery pathway if failed", "References": REF}),
]

EVID = [("""Evidence — Foot Module""", {
    "ID": "FOOT-EVID-01",
    "Anatomy_Biomechanics": REF + " Hicks windlass mechanism.",
    "Plantar_Fasciopathy": "Active loading and education first-line themes in clinical guidelines; CSI not first-line long-term.",
    "Lisfranc": "High index of suspicion; WB imaging; unstable injuries surgical.",
    "Diabetic_Foot": "Red-hot swollen foot — Charcot vs infection — urgent specialist care (educational red flag).",
    "AI_Note": "Angles, Sn/Sp, timelines approximate — verify individually.",
    "References": REF,
})]


def build():
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    doc = SimpleDocTemplate(str(OUTPUT), pagesize=letter, leftMargin=0.75*inch, rightMargin=0.75*inch,
                            topMargin=0.75*inch, bottomMargin=0.85*inch,
                            title="Kinora Foot AI Orientation Part 11", author="Kinora AI Training")
    styles = build_styles()
    story = []
    story.append(Spacer(1, 1.1*inch))
    story.append(Paragraph("Kinora Foot", styles["title"]))
    story.append(Paragraph("Clinical AI Orientation (Part 11)", styles["title"]))
    story.append(Spacer(1, 0.25*inch))
    story.append(Paragraph("Structured reference for RAG / AI-assisted physiotherapy consultation", styles["subtitle"]))
    story.append(Paragraph("Bones, Joints, Ligaments, Intrinsics/Extrinsics, Plantar Fascia, Arches, Biomechanics, Neurovascular, Assessment, Pathologies &amp; Rehabilitation", styles["subtitle"]))
    story.append(Spacer(1, 0.35*inch))
    story.append(Paragraph("Version 1.0 — Kinora Admin Conocimientos Upload", styles["subtitle"]))
    story.append(PageBreak())
    add_section(story, styles, "Disclaimer")
    story.append(Paragraph(
        "Educational Kinora AI resource — not a substitute for licensed clinical care. Synthesis of Gray's/Standring, Moore, Netter, Neumann, Magee, Brukner &amp; Khan, and foot/ankle specialty themes. "
        "<b>Red flags — suspected Charcot arthropathy or infected diabetic foot, acute Lisfranc injury, open fracture, critical ischemia, or progressive neurologic cavus — require urgent specialist referral.</b>",
        styles["disclaimer"]))
    for t in ["Disclaimer", "1. Bones", "2. Joints", "3. Ligaments", "4. Intrinsic Muscles", "5. Extrinsic Muscles",
              "6. Plantar Fascia", "7. Arches", "8. Biomechanics", "9. Neurovascular", "10. Functional Assessment",
              "11. Special Tests", "12. Pathologies", "13. Rehabilitation", "14. Evidence"]:
        if t == "Disclaimer":
            continue
    add_section(story, styles, "Table of Contents")
    for t in ["1. Bones", "2. Joints", "3. Ligaments", "4. Intrinsic Muscles", "5. Extrinsic Muscles",
              "6. Plantar Fascia", "7. Arches", "8. Biomechanics", "9. Neurovascular", "10. Functional Assessment",
              "11. Special Tests", "12. Pathologies", "13. Rehabilitation", "14. Evidence"]:
        story.append(Paragraph(f"• {esc(t)}", styles["toc"]))
    story.append(PageBreak())
    sections = [
        ("1. Bones", BONES), ("2. Joints", JOINTS), ("3. Ligaments", LIGAMENTS),
        ("4. Intrinsic Muscles", INTRINSICS), ("5. Extrinsic Muscles", EXTRINSICS),
        ("6. Plantar Fascia", PLANTAR_FASCIA), ("7. Arches", ARCHES), ("8. Biomechanics", BIO),
        ("9. Neurovascular", NV), ("10. Functional Assessment", FUNC), ("11. Special Tests", TESTS),
        ("12. Pathologies", PATH), ("13. Rehabilitation", REHAB), ("14. Evidence", EVID),
    ]
    for i, (title, records) in enumerate(sections):
        add_section(story, styles, title)
        story.append(Spacer(1, 6))
        for name, fields in records:
            add_record(story, styles, name, fields)
        if i < len(sections) - 1:
            story.append(PageBreak())
    footer = make_footer("Kinora Foot AI Orientation Part 11 — Educational Use Only")
    doc.build(story, onFirstPage=footer, onLaterPages=footer)
    return OUTPUT


if __name__ == "__main__":
    out = build()
    print(f"Generated: {out}")
    print(f"File size: {out.stat().st_size/1024:.1f} KB")
    try:
        from pypdf import PdfReader
        print(f"Page count: {len(PdfReader(str(out)).pages)}")
    except ImportError:
        pass
