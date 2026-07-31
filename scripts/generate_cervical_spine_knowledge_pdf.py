#!/usr/bin/env python3
"""Kinora Cervical Spine AI Orientation (Part 12)."""
from __future__ import annotations
import sys
from pathlib import Path
SCRIPT_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(SCRIPT_DIR))
from _kinora_pdf_common import RA, RB, RC, add_record, add_section, build_styles, esc, make_footer
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.platypus import PageBreak, Paragraph, SimpleDocTemplate, Spacer

OUT = SCRIPT_DIR.parent / "knowledge" / "Kinora_Cervical_Spine_AI_Orientation.pdf"
REF = f"{RA} {RB} {RC} Bogduk N. Clinical Anatomy of the Cervical Spine. Magee DJ. APTA Neck Pain CPG themes."


def vert(id_, name, typ, land, mus, lig, blood, bio, clin, img, notes=""):
    return (name, {"ID": id_, "Vertebra": name, "Type": typ, "Landmarks": land, "Muscle Attachments": mus,
                   "Ligament Attachments": lig, "Blood Supply": blood, "Biomechanics": bio,
                   "Clinical Importance": clin, "Imaging": img, "Notes": notes, "References": REF})


VERTEBRAE = [
    vert("CERV-VERT-01", "Atlas (C1)", "Atypical — no body/spinous process; anterior & posterior arches + lateral masses",
         "Anterior tubercle, posterior tubercle, superior articular facets (concave for occipital condyles), inferior facets, transverse foramen, groove for vertebral artery on posterior arch",
         "Rectus capitis anterior/lateralis; obliquus capitis superior/inferior; levator scapulae; splenius/scalenes contributions via TP",
         "Transverse ligament of atlas (holds dens); alar ligaments (occiput–dens); anterior/posterior atlanto-occipital membranes; facet capsules",
         "Vertebral arteries through transverse foramina; anastomoses around OA joint",
         "Atlanto-occipital: primarily flexion/extension (nodding ~10–25° combined teaching ranges). Atlas rotates on axis via dens pivot.",
         "Jefferson fracture (burst); transverse ligament integrity critical (ADI); vertebral artery groove trauma risk; rheumatoid atlantoaxial instability screening",
         "Open-mouth odontoid; lateral ADI; CT trauma; MRI ligaments/cord",
         "ADI adults normally ≤3 mm; increased ADI suggests transverse ligament incompetence"),
    vert("CERV-VERT-02", "Axis (C2)", "Atypical — dens (odontoid process); bifid SP often large",
         "Dens, superior articular facets (nearly flat for atlas), inferior facets (typical orientation begins), pars/pedicle, transverse foramen, bifid SP",
         "Obliquus capitis inferior; rectus capitis posterior major; multifidus/semispinalis; levator scapulae",
         "Alar ligaments; apical ligament; transverse ligament articulates dens posteriorly; tectorial membrane; facet capsules",
         "Vertebral arteries; ascending cervical contributions",
         "Atlantoaxial complex provides ~50% of cervical rotation (dens pivot). Flexion/extension less than OA.",
         "Odontoid fractures (Anderson-D'Alonzo I–III); Hangman's fracture (traumatic spondylolisthesis C2); dens nonunion risk Type II",
         "Open-mouth; CT dens; MRI cord/ligaments",
         "Rule out dens injury before mobilization in trauma"),
    vert("CERV-VERT-03", "C3 Vertebra", "Typical cervical",
         "Small body, bifid SP, uncinate processes, transverse foramen, superior facets face posteromedially-upward",
         "Longus colli/capitis, scalenes, multifidus, semispinalis, splenius, levator, trapezius via SP/ligamentum nuchae continuum",
         "ALL, PLL, ligamentum flavum, interspinous, nuchal, uncovertebral capsules, facet capsules",
         "Vertebral artery in foramen; ascending cervical",
         "Segmental flexion/extension/sidebend/rotation with coupled motion (lower cervical typically ipsilateral SB-rotation coupling)",
         "Disc/facet degeneration; radiculopathy less common than C5–C7; myelopathy if canal narrows",
         "XR lateral/AP/oblique; MRI disc/cord", ""),
    vert("CERV-VERT-04", "C4 Vertebra", "Typical cervical",
         "Uncinate processes; bifid SP; transverse foramen",
         "As C3 — longus, scalenes, deep extensors, trapezius/levator",
         "ALL/PLL/flavum/nuchal/uncovertebral/facet",
         "Vertebral artery",
         "Mid-cervical mobility; coupled SB/rotation",
         "Common degenerative level; referred scapular pain patterns",
         "MRI for radiculopathy workup", ""),
    vert("CERV-VERT-05", "C5 Vertebra", "Typical cervical",
         "Uncinates; SP bifid; large transverse processes relative",
         "Scalenes, longus, multifidus, trapezius, levator, rhomboid minor near C7–T1 but attachments cascade",
         "Standard cervical ligaments + uncovertebral",
         "Vertebral artery; C5 root exits above C5 pedicle (cervical roots exit above same-numbered vertebra except C8)",
         "High mobility segment; C5 radiculopathy (deltoid/biceps) common",
         "Disc herniation C4–5; facet arthropathy; foraminal stenosis",
         "MRI; oblique XR foramina", "C5 myotome: shoulder ABD; reflex: biceps"),
    vert("CERV-VERT-06", "C6 Vertebra", "Typical cervical — carotid tubercle (Chassaignac) on TP anterior",
         "Carotid tubercle landmark; bifid SP; uncinates",
         "Scalenes (important), longus, deep neck extensors, trapezius",
         "Standard + uncovertebral prominent clinically",
         "Vertebral artery; carotid pulse palpable at Chassaignac",
         "C5–6 often most mobile lower cervical; frequent spondylosis site",
         "C6 radiculopathy (wrist extensors/biceps); uncovertebral osteophytes → foraminal stenosis",
         "MRI; CT for bony stenosis", "C6 myotome: wrist extension; reflex: brachioradialis"),
    vert("CERV-VERT-07", "C7 Vertebra", "Transitional — vertebra prominens; often non-bifid SP; small/absent transverse foramen for vertebral a. (vein may pass)",
         "Vertebra prominens SP; transitional facets toward thoracic; uncinates smaller",
         "Trapezius, rhomboid minor, levator, serratus posterior superior, scalenes, erectors",
         "Nuchal ligament ends near C7; ALL/PLL/flavum; first rib relation via C7 TP variants (cervical rib)",
         "Vertebral artery usually enters at C6; C7 foramen often only venous",
         "Less rotation than mid-cervical; load transfer to T1",
         "C7 radiculopathy (triceps/wrist flexors/finger extensors); cervical rib/TOS; clay-shoveler's SP avulsion",
         "XR; MRI; rule out cervical rib on AP", "C7 myotome: elbow extension; reflex: triceps"),
    vert("CERV-VERT-08", "Typical vs Atypical Summary", "Classification record",
         "Atypical: C1 (no body/SP), C2 (dens), C7 (prominens/transitional). Typical: C3–C6 (uncinates, bifid SP, transverse foramen for VA)",
         "See individual records", "See individual records", "VA course C1–C6 typically",
         "Atypical anatomy drives unique fracture patterns and instability rules (ADI, dens, Jefferson)",
         "Never treat C1–C2 like typical segments clinically",
         "Trauma imaging algorithms (Canadian C-Spine / NEXUS) then targeted CT",
         "Canadian C-Spine Rule and NEXUS for imaging decisions after blunt trauma"),
]


def joint(id_, name, typ, cap, ligs, motion, arthro, osteo, stab, pain, tests, path, tx):
    return (name, {"ID": id_, "Joint": name, "Type": typ, "Capsule": cap, "Ligaments": ligs, "Motion": motion,
                   "Arthrokinematics": arthro, "Osteokinematics": osteo, "Stability": stab, "Pain Referral": pain,
                   "Clinical Tests": tests, "Pathologies": path, "Treatment": tx, "References": REF})


JOINTS = [
    joint("CERV-JNT-01", "Atlanto-occipital (C0–C1)", "Synovial condyloid",
          "Loose capsule allowing nodding", "Anterior/posterior atlanto-occipital membranes; OA joint capsules; alar influence",
          "Primarily flexion/extension (nodding); minimal rotation/SB",
          "Occipital condyles convex on concave atlas facets — opposite roll/glide teaching",
          "Combined OA flexion/extension often cited ~15–25°; rotation minimal",
          "Bony congruence + membranes; alar ligaments limit extremes",
          "Suboccipital headache; occipital referral",
          "OA flexion-extension mobility; Sharp-Purser is AA not OA; rule out VBI/cervical arterial dysfunction per guidelines before end-range",
          "OA headache, rheumatoid involvement rare vs AA, fracture",
          "Manual therapy only after red-flag/CAD screen; deep neck flexor + suboccipital motor control"),
    joint("CERV-JNT-02", "Atlanto-axial (C1–C2)", "Synovial pivot (dens) + plane facet joints",
          "Facet capsules; cruciform/transverse ligament complex critical",
          "Transverse ligament of atlas; alar; apical; tectorial membrane; AA facet capsules",
          "~40–50% of cervical rotation from AA complex (teaching approximation)",
          "Atlas rotates about dens; lateral masses glide",
          "Rotation primary; flexion/extension secondary smaller",
          "Transverse ligament prevents anterior atlas subluxation on dens; alar limit rotation/SB extremes",
          "Upper cervical, suboccipital, sometimes facial",
          "Sharp-Purser (transverse ligament — trained clinicians); lateral shear; ADI on imaging; CAD screen",
          "AA instability (RA, Down syndrome, trauma); dens fracture; alar injury (whiplash)",
          "Stabilize/refer instability; never aggressive rotation if instability suspected"),
    joint("CERV-JNT-03", "Cervical Facet (Zygapophyseal) Joints C2–3 to C7–T1", "Synovial plane joints",
          "Fibrous capsule richly innervated (medial branches)",
          "Facet capsules; ligamentum flavum anteriorly related; interspinous/supraspinous/nuchal posterior",
          "Guide SB and rotation; bear load in extension",
          "Inferior facet of superior vertebra glides on superior facet of inferior vertebra",
          "Orientation ~45° in mid-cervical — favors coupled motion",
          "Capsule + muscular control (multifidus)",
          "Cervical facet referral maps (e.g., C2–3 → headache; C5–6 → scapular) — classic Bogduk patterns approximate",
          "Extension-rotation provocation; palpation; medial branch blocks diagnostic (interventional)",
          "Facet syndrome, arthropathy, whiplash facet pain, fracture",
          "Manual therapy + exercise; radiofrequency neurotomy selected chronic facet pain after dual blocks"),
    joint("CERV-JNT-04", "Uncovertebral Joints (of Luschka)", "Pseudoarthroses / synovial clefts along uncinate processes C3–C7",
          "Uncinate process articulates with bevel of superior vertebral body",
          "Not classic ligaments — disc/uncinate complex; osteophytes common",
          "Guide SB; limit translation; foraminal relations",
          "Uncinate guides coupled motion; osteophytes encroach foramen/VA",
          "Sidebending constrained by uncinates",
          "Bony + disc integrity",
          "Neck pain with SB; arm symptoms if foraminal stenosis",
          "Spurling related; imaging for uncovertebral hypertrophy",
          "Uncovertebral arthrosis → foraminal stenosis/radiculopathy",
          "Traction trial, nerve mobility, surgery (foraminotomy) selected"),
    joint("CERV-JNT-05", "Cervical Intervertebral Discs", "Fibrocartilaginous symphysis (anulus + nucleus); no disc between C0–C1 or C1–C2",
          "Anulus fibrosis; nucleus pulposus (less gelatinous with age); cartilaginous endplates",
          "ALL/PLL continuity; uncovertebral clefts laterally",
          "Shock absorption; height for foramina; motion segment flexibility",
          "Compression/shear/torsion loading; posterolateral herniation toward root",
          "Segmental DF/PF/SB/rotation shared with facets",
          "Anulus + PLL; posterior herniation risks cord (myelopathy) vs root (radiculopathy)",
          "Neck pain ± radicular arm pain in dermatome; cough/sneeze may worsen",
          "Spurling, distraction, ULNT1, reflex/myotome/sensory screen",
          "Disc herniation, DDD, inflammatory discitis (red flag)",
          "Nonsurgical care first for most radiculopathy; ACDF/disc arthroplasty selected"),
]

LIGAMENTS = [
    ("Anterior Longitudinal Ligament", {"ID": "CERV-LIG-01", "Ligament": "ALL", "Origin": "Occiput/C1 continuum down anterior bodies", "Insertion": "Anterior vertebral bodies/discs to sacrum",
     "Function": "Limits extension; reinforces anulus anteriorly", "Clinical": "Hyperextension injury; ossification (DISH) can stiffen", "References": REF}),
    ("Posterior Longitudinal Ligament", {"ID": "CERV-LIG-02", "Ligament": "PLL", "Origin": "Body of axis / tectorial membrane continuum", "Insertion": "Posterior bodies/discs within canal",
     "Function": "Limits flexion; bars central disc somewhat — herniations often posterolateral", "Clinical": "OPLL → myelopathy in some populations", "References": REF}),
    ("Ligamentum Flavum", {"ID": "CERV-LIG-03", "Ligament": "Ligamentum flavum", "Origin": "Lamina above", "Insertion": "Lamina below",
     "Function": "Elastic; limits flexion; restores extension", "Clinical": "Hypertrophy → stenosis/myelopathy", "References": REF}),
    ("Interspinous Ligament", {"ID": "CERV-LIG-04", "Ligament": "Interspinous", "Origin": "SP above", "Insertion": "SP below",
     "Function": "Limits flexion", "Clinical": "Whiplash sprain continuum", "References": REF}),
    ("Supraspinous / Nuchal Ligament", {"ID": "CERV-LIG-05", "Ligament": "Supraspinous continuous with ligamentum nuchae in cervical region", "Origin": "EOP / nuchal line", "Insertion": "Cervical SPs to C7 then thoracic supraspinous",
     "Function": "Limits flexion; muscle attachment septum; proprioception", "Clinical": "Nuchal pain; attachment for trapezius/splenius", "References": REF}),
    ("Alar Ligaments", {"ID": "CERV-LIG-06", "Ligament": "Alar ligaments", "Origin": "Dens superolateral", "Insertion": "Occipital condyles (medial)",
     "Function": "Limit AA rotation and OA SB extremes", "Clinical": "Whiplash/trauma; instability if torn — specialist assessment", "References": REF}),
    ("Transverse Ligament of Atlas", {"ID": "CERV-LIG-07", "Ligament": "Transverse ligament (cruciform complex horizontal band)", "Origin": "Atlas lateral mass", "Insertion": "Opposite lateral mass behind dens",
     "Function": "Primary restraint preventing anterior atlas subluxation on dens", "Clinical": "RA/Down syndrome/trauma — check ADI; Sharp-Purser by trained clinicians only", "References": REF}),
]


def mus(id_, name, o, i, n, f, clin, ex):
    return (name, {"ID": id_, "Muscle": name, "Origin": o, "Insertion": i, "Innervation": n, "Function": f,
                   "Clinical Importance": clin, "Exercises": ex, "References": REF})


MUSCLES = [
    mus("CERV-MUS-01", "Longus Colli", "Cervical/thoracic bodies/TPs", "Bodies/TPs superiorly to atlas", "C2–C6 ventral rami", "Deep neck flexion; segmental stability", "Inhibited in neck pain; DNF training target", "Supine cranio-cervical flexion (CCFT progressions)"),
    mus("CERV-MUS-02", "Longus Capitis", "C3–C6 TPs", "Occipital basilar part", "C1–C3", "Capital flexion; OA control", "With longus colli in DNF synergy", "CCFT; chin nod holds"),
    mus("CERV-MUS-03", "Multifidus (Cervical)", "Articular pillars/TPs", "SPs 2–4 levels above", "Dorsal rami", "Segmental extension/rotation control", "Atrophy/fatty infiltrate in some neck pain/whiplash cohorts", "Prone/4pt activation; with DNF co-contraction"),
    mus("CERV-MUS-04", "Semispinalis Capitis/Cervicis", "TPs thoracic/cervical", "Occiput / cervical SPs", "Dorsal rami", "Extension; cervical lordosis support", "Endurance deficits common in neck pain", "Prone lifts graded; avoid global shrugging"),
    mus("CERV-MUS-05", "Suboccipitals (RCPmaj/min, OCSup/Inf)", "C1/C2/SP dens region", "Occiput / C1", "Suboccipital nerve C1 (dorsal ramus)", "Fine OA/AA control; proprioception; dens rotation (OCI)", "Cervicogenic headache; muscle tension; CAD screen before aggressive MET", "Gentle nod control; avoid end-range rotation if CAD risk"),
    mus("CERV-MUS-06", "Sternocleidomastoid", "Manubrium & clavicle", "Mastoid / superior nuchal line", "Spinal accessory XI + C2–C3", "Ipsilateral SB, contralateral rotation; bilateral flexion", "Torticollis; accessory nerve; scales with breathing; CAD relative contraindication caution for end-range", "Side-lying isometrics; avoid ballistic stretching"),
    mus("CERV-MUS-07", "Scalenes (Ant/Med/Post)", "Cervical TPs", "1st/2nd ribs", "C3–C8 ventral rami", "SB; elevate ribs; anterior contributes contralateral rotation assist", "TOS thoracic outlet; respiratory accessory; brachial plexus relation", "1st rib mobilizing breathing; scalene stretches careful; neural screen"),
    mus("CERV-MUS-08", "Levator Scapulae", "C1–C4 TPs", "Superior medial scapular border", "Dorsal scapular C5 + C3–C4", "Elevate scapula; ipsilateral SB/rotation of neck", "Trigger points to neck/scapula; with upper trap dominance", "Scapular upward rotation training (lower trap/serratus) to unload"),
    mus("CERV-MUS-09", "Upper Trapezius", "Occiput/nuchal/C7–T12 SP continuum upper fibers", "Clavicle/acromion", "XI + C3–C4", "Elevate/upwardly rotate scapula; ipsilateral SB contralateral rotation neck", "Overactivity with neck pain; headache contributor", "Scapular setting; reduce shrugging; lower/mid trap emphasis"),
    mus("CERV-MUS-10", "Splenius Capitis/Cervicis", "Nuchal/C7–T6 SPs", "Mastoid/occiput; C1–C3 TPs", "Dorsal rami", "Extension; ipsilateral SB/rotation", "Global extensor overactivity vs deep stabilizer weakness", "Retrain deep before global heavy loading"),
]


NERVES = [("""Cervical Neural & Plexus Overview""", {
    "ID": "CERV-NRV-01",
    "Dermatomes": "C2 occiput/behind ear; C3 neck collar; C4 shoulder tip/upper trap; C5 lateral arm; C6 thumb/index lateral forearm; C7 middle finger; C8 little finger/medial hand; T1 medial forearm — classic teaching maps (overlap exists)",
    "Myotomes": "C4 diaphragm/shoulder shrug; C5 shoulder ABD; C6 elbow flex/wrist ext; C7 elbow ext/wrist flex; C8 finger flex; T1 intrinsics — screen bilaterally",
    "Reflexes": "Biceps C5–6; brachioradialis C6; triceps C7",
    "Cranial_MSK_Relevance": "CN XI (SCM/trapezius); CN V (TMJ/headache overlap); CN II–VIII in dizziness/vision differential for cervicogenic vs central",
    "Brachial_Plexus": "Roots C5–T1 → trunks/divisions/cords → terminal nerves (musculocutaneous, axillary, radial, median, ulnar). Scalene/1st rib/clavicle compression → TOS continuum",
    "Radiculopathy_vs_Myelopathy": "Root: unilateral arm pain/dermatomal/myotomal. Cord: gait, hand clumsiness, hyperreflexia, Babinski/Hoffmann, bowel/bladder — urgent imaging",
    "References": REF,
})]

BIO = [
    ("Flexion", {"ID": "CERV-BIO-01", "Movement": "Cervical flexion", "Primary": "Longus colli/capitis, SCM bilateral", "Notes": "Upper vs lower cervical differentiation important clinically", "Clinical": "Disc loading increases; myelopathy may worsen with extension more often but individualize", "Exercises": "CCFT, supine flexor endurance", "References": REF}),
    ("Extension", {"ID": "CERV-BIO-02", "Movement": "Cervical extension", "Primary": "Semispinalis, splenius, multifidus, trapezius", "Notes": "Facet loading increases; foraminal volume decreases", "Clinical": "Extension-rotation may provoke CAD — screen per guidelines", "Exercises": "Deep extensor endurance prone graded", "References": REF}),
    ("Rotation", {"ID": "CERV-BIO-03", "Movement": "Cervical rotation", "Primary": "AA complex major contributor; SCM contralateral; splenius ipsilateral", "Notes": "~50% from C1–2 teaching model", "Clinical": "AA instability contraindication to aggressive rotation", "Exercises": "Controlled rotation in neutral with DNF", "References": REF}),
    ("Side Bending", {"ID": "CERV-BIO-04", "Movement": "Side bending", "Primary": "Scalenes, levator, upper trap ipsilateral", "Notes": "Coupled with rotation in lower cervical (ipsilateral typically)", "Clinical": "Uncovertebral osteophytes limit SB", "Exercises": "Gentle SB with support", "References": REF}),
    ("Coupled Motion", {"ID": "CERV-BIO-05", "Movement": "Coupled SB-rotation", "Primary": "Facet/uncinate guided", "Notes": "Lower cervical: SB and rotation same direction (classic); upper cervical opposite patterns often taught — simplify clinically with assessment", "Clinical": "Manual therapy coupling principles", "Exercises": "Combined movement control", "References": REF}),
    ("Deep Neck Stability", {"ID": "CERV-BIO-06", "Movement": "Segmental stability / DNF–multifidus", "Primary": "Longus colli/capitis + multifidus", "Notes": "Feed-forward activation before arm load in healthy patterns", "Clinical": "Core of modern neck pain rehab (Jull et al. themes)", "Exercises": "CCFT biofeedback, co-contraction", "References": REF}),
    ("Gaze Stabilization", {"ID": "CERV-BIO-07", "Movement": "Cervico-ocular / gaze", "Primary": "Suboccipitals + vestibulo-ocular systems", "Notes": "Neck afferents contribute to postural orientation", "Clinical": "Whiplash dizziness differential vs vestibular", "Exercises": "Gaze stability, smooth pursuit screen for central red flags", "References": REF}),
    ("Load Transfer / Posture / Sport", {"ID": "CERV-BIO-08", "Movement": "Sitting, running, lifting head-neck load", "Primary": "Endurance of deep flexors/extensors", "Notes": "Forward head increases lever arm on extensors", "Clinical": "Ergonomics + capacity > 'perfect posture' alone", "Exercises": "Endurance holds, graded lifting with brace strategy", "References": REF}),
]

PATH = [
    ("Cervical Strain / Sprain", {"ID": "CERV-PATH-01", "Condition": "Cervical strain/sprain", "Mechanism": "Overload/whiplash soft tissue", "Symptoms": "Pain, stiffness, muscle spasm", "Red_Flags": "Hard neuro signs, trauma imaging rules", "Treatment": "Early activity, advice, exercise; avoid prolonged collar usually", "References": REF}),
    ("Facet Syndrome", {"ID": "CERV-PATH-02", "Condition": "Cervical facet syndrome", "Mechanism": "Extension-rotation overload; arthropathy", "Symptoms": "Localized neck pain; referral per Bogduk maps; headache if upper", "Red_Flags": "Myelopathy signs", "Treatment": "Manual therapy + exercise; interventional dual blocks/RF selected", "References": REF}),
    ("Disc Herniation / Radiculopathy", {"ID": "CERV-PATH-03", "Condition": "Cervical disc herniation with radiculopathy", "Mechanism": "Posterolateral disc → root", "Symptoms": "Neck/arm pain, dermatomal sensory, myotomal weakness, reflex change", "Red_Flags": "Progressive deficit, myelopathy", "Treatment": "Majority improve nonsurgically; PT, meds; ACDF/foraminotomy selected", "References": REF}),
    ("Cervical Myelopathy", {"ID": "CERV-PATH-04", "Condition": "Cervical spondylotic myelopathy", "Mechanism": "Cord compression — stenosis/OPLL/disc", "Symptoms": "Clumsy hands, gait disturbance, hyperreflexia, Hoffmann/Babinski, bladder changes", "Red_Flags": "THIS IS A RED FLAG — urgent surgical opinion", "Treatment": "Decompression often; do not mobilize aggressively", "References": REF}),
    ("Whiplash (WAD)", {"ID": "CERV-PATH-05", "Condition": "Whiplash-associated disorder", "Mechanism": "Acceleration-deceleration energy transfer to neck", "Symptoms": "Pain, stiffness, headache, dizziness, cognitive complaints variable", "Red_Flags": "Canadian C-Spine/NEXUS; neurologic deficit; CAD features", "Treatment": "Early activation, education, exercise; grade-based care (QTF)", "References": REF}),
    ("Cervicogenic Headache", {"ID": "CERV-PATH-06", "Condition": "Cervicogenic headache", "Mechanism": "Upper cervical afferent convergence (C1–C3)", "Symptoms": "Unilateral neck-triggered headache, limited ROM, manual palpation provocation", "Red_Flags": "SNNOOP10 headache red flags — sudden/ thunderclap, neuro deficit, etc.", "Treatment": "Manual therapy + DNF/exercise (evidence supportive)", "References": REF}),
    ("Thoracic Outlet Syndrome", {"ID": "CERV-PATH-07", "Condition": "TOS (neurogenic most common)", "Mechanism": "Brachial plexus ± vessel compression at scalene/1st rib/pec minor", "Symptoms": "Arm pain/paresthesia with overhead; vascular signs if arterial/venous", "Red_Flags": "Acute ischemia / effort thrombosis — urgent", "Treatment": "Scapular/postural PT first for NTOS; surgery selected", "References": REF}),
    ("Degeneration / Stenosis", {"ID": "CERV-PATH-08", "Condition": "Spondylosis and stenosis", "Mechanism": "Age-related disc/facet/uncovertebral hypertrophy", "Symptoms": "Stiffness, foraminal or central stenosis syndromes", "Red_Flags": "Myelopathy", "Treatment": "Exercise, traction trial, surgery for cord/progressive root", "References": REF}),
]

REHAB = [("""Cervical Rehabilitation Principles""", {
    "ID": "CERV-REHAB-01",
    "Acute": "Screen red flags/CAD/imaging rules; advice to remain active; short-term pain strategies",
    "Motor_Control": "Cranio-cervical flexion training; multifidus co-contraction; scapular mechanics",
    "Mobility": "Restore rotation/SB/extension as appropriate directional preference",
    "Strength_Endurance": "Deep flexor/extensor endurance; axioscapular strength",
    "Sensorimotor": "Joint position error, gaze stability if dizziness (after central screen)",
    "Functional": "Ergonomics, lifting, sport return graded",
    "Outcome_Measures": "NDI, NPRS, PSFS, headache diary",
    "References": REF + " APTA Neck Pain CPG; Jull deep cervical flexor research themes.",
})]


def build():
    OUT.parent.mkdir(parents=True, exist_ok=True)
    doc = SimpleDocTemplate(str(OUT), pagesize=letter, leftMargin=0.75*inch, rightMargin=0.75*inch,
                            topMargin=0.75*inch, bottomMargin=0.85*inch,
                            title="Kinora Cervical Spine Part 12", author="Kinora AI Training")
    styles = build_styles()
    story = []
    story.append(Spacer(1, 1.1*inch))
    story.append(Paragraph("Kinora Cervical Spine", styles["title"]))
    story.append(Paragraph("Clinical AI Orientation (Part 12)", styles["title"]))
    story.append(Paragraph("Vertebrae, Joints, Ligaments, Muscles, Nerves, Biomechanics, Pathologies &amp; Rehabilitation", styles["subtitle"]))
    story.append(Paragraph("Version 1.0 — Kinora Admin Conocimientos Upload", styles["subtitle"]))
    story.append(PageBreak())
    add_section(story, styles, "Disclaimer")
    story.append(Paragraph(
        "Educational Kinora AI resource — not clinical care. Sources: Gray's/Standring, Moore, Bogduk, Neumann, Magee, APTA Neck Pain CPG themes. "
        "<b>Red flags — cervical myelopathy, progressive neuro deficit, suspected fracture/instability (Canadian C-Spine/NEXUS), cervical arterial dissection features "
        "(sudden severe neck/head pain, Horner, cranial nerve signs), inflammatory atlantoaxial instability — require urgent medical referral. "
        "Screen for cervical arterial dysfunction per current guidelines before end-range manual techniques.</b>",
        styles["disclaimer"]))
    add_section(story, styles, "Table of Contents")
    for t in ["1. Vertebrae", "2. Joints", "3. Ligaments", "4. Muscles", "5. Nerves", "6. Biomechanics", "7. Pathologies", "8. Rehabilitation"]:
        story.append(Paragraph(f"• {esc(t)}", styles["toc"]))
    story.append(PageBreak())
    for i, (title, recs) in enumerate([
        ("1. Vertebrae", VERTEBRAE), ("2. Joints", JOINTS), ("3. Ligaments", LIGAMENTS),
        ("4. Muscles", MUSCLES), ("5. Nerves", NERVES), ("6. Biomechanics", BIO),
        ("7. Pathologies", PATH), ("8. Rehabilitation", REHAB),
    ]):
        add_section(story, styles, title)
        for n, f in recs:
            add_record(story, styles, n, f)
        if i < 7:
            story.append(PageBreak())
    ft = make_footer("Kinora Cervical Spine AI Orientation Part 12 — Educational Use Only")
    doc.build(story, onFirstPage=ft, onLaterPages=ft)
    return OUT


if __name__ == "__main__":
    p = build()
    print(f"Generated: {p} ({p.stat().st_size/1024:.1f} KB)")
    try:
        from pypdf import PdfReader
        print(f"Pages: {len(PdfReader(str(p)).pages)}")
    except ImportError:
        pass
