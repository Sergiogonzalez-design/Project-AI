#!/usr/bin/env python3
"""
Generate Kinora Upper Extremity Part 2 PDF — Vascular, Fascia & Biomechanics.
Output: knowledge/Kinora_Upper_Extremity_Vascular_Fascia_Biomechanics.pdf
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
OUTPUT_PATH = (
    PROJECT_ROOT / "knowledge" / "Kinora_Upper_Extremity_Vascular_Fascia_Biomechanics.pdf"
)

# ---------------------------------------------------------------------------
# Helpers (same patterns as generate_ue_knowledge_pdf.py)
# ---------------------------------------------------------------------------

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
            "KinoraTitle",
            parent=base["Title"],
            fontName="Helvetica-Bold",
            fontSize=22,
            leading=28,
            alignment=TA_CENTER,
            spaceAfter=12,
        ),
        "subtitle": ParagraphStyle(
            "KinoraSubtitle",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=12,
            leading=16,
            alignment=TA_CENTER,
            spaceAfter=8,
        ),
        "h1": ParagraphStyle(
            "KinoraH1",
            parent=base["Heading1"],
            fontName="Helvetica-Bold",
            fontSize=16,
            leading=20,
            spaceBefore=14,
            spaceAfter=8,
            textColor=colors.HexColor("#1a365d"),
        ),
        "h2": ParagraphStyle(
            "KinoraH2",
            parent=base["Heading2"],
            fontName="Helvetica-Bold",
            fontSize=13,
            leading=17,
            spaceBefore=10,
            spaceAfter=6,
            textColor=colors.HexColor("#2c5282"),
        ),
        "record": ParagraphStyle(
            "KinoraRecord",
            parent=base["Heading3"],
            fontName="Helvetica-Bold",
            fontSize=11,
            leading=14,
            spaceBefore=8,
            spaceAfter=4,
            textColor=colors.HexColor("#744210"),
        ),
        "body": ParagraphStyle(
            "KinoraBody",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=9,
            leading=12,
            spaceAfter=3,
            alignment=TA_LEFT,
        ),
        "disclaimer": ParagraphStyle(
            "KinoraDisclaimer",
            parent=base["Normal"],
            fontName="Helvetica-Oblique",
            fontSize=9,
            leading=12,
            spaceAfter=6,
            textColor=colors.HexColor("#744210"),
        ),
        "toc": ParagraphStyle(
            "KinoraTOC",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=10,
            leading=14,
            leftIndent=12,
            spaceAfter=4,
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
        0.75 * inch,
        0.45 * inch,
        "Kinora UE Vascular/Fascia/Biomechanics Part 2 — Educational Use Only",
    )
    canvas.restoreState()


# ---------------------------------------------------------------------------
# Record builders
# ---------------------------------------------------------------------------

VESSEL_KEYS = [
    "ID", "Name", "Latin Name", "Type", "Region", "Origin", "Termination", "Course",
    "Major Branches", "Minor Branches", "Structures Supplied", "Muscles Supplied",
    "Bones Supplied", "Joints Supplied", "Ligaments Supplied", "Tendons Supplied",
    "Skin Distribution", "Venous Drainage", "Anastomoses", "Clinical Importance",
    "Common Injuries", "Compression Sites", "Pulse Location", "Ultrasound Appearance",
    "MRI Appearance", "CT Angiography Findings", "Collateral Circulation",
    "Surgical Considerations", "Rehabilitation Considerations", "References",
]

FASCIA_KEYS = [
    "ID", "Name", "Region", "Layer", "Thickness", "Continuity", "Attachments",
    "Compartments", "Structures Enclosed", "Muscles Covered", "Nerves Passing Through",
    "Vessels Passing Through", "Biomechanical Role", "Force Transmission", "Mobility",
    "Sliding Characteristics", "Clinical Importance", "Palpation", "Ultrasound Appearance",
    "MRI Appearance", "Fibrosis", "Restrictions", "Common Injuries", "Manual Therapy",
    "Stretching", "Mobility Exercises", "Rehabilitation", "Evidence", "References",
]

MOVEMENT_KEYS = [
    "ID", "Movement", "Joint", "Body Region", "Plane", "Axis", "Open Chain",
    "Closed Chain", "Primary Movers", "Secondary Movers", "Stabilizers", "Force Couples",
    "Prime Stabilizers", "Dynamic Stabilizers", "Static Stabilizers", "Arthrokinematics",
    "Osteokinematics", "Joint Reaction Force", "Compression Forces", "Shear Forces",
    "Torque", "Moment Arm", "Lever Class", "Length-Tension Relationship", "EMG Evidence",
    "Normal ROM", "Functional ROM", "Compensations", "Common Dysfunctions",
    "Common Pain Patterns", "Clinical Relevance", "Functional Activities",
    "Sport-Specific Applications", "Common Injuries", "Assessment", "Treatment Implications",
    "Exercise Progressions", "References",
]

EMG_KEYS = [
    "ID", "Exercise", "Primary Muscle", "Secondary Muscles", "EMG %", "Study",
    "Population", "Resistance", "Equipment", "Movement Speed", "Reliability",
    "Evidence Level", "References",
]

FORCE_COUPLE_KEYS = [
    "ID", "Movement", "Muscle 1", "Muscle 2", "Muscle 3", "Biomechanical Role",
    "Clinical Importance", "Common Dysfunction", "Rehabilitation", "References",
]

KINETIC_KEYS = [
    "ID", "Movement", "Sport", "Starting Position", "Joint Sequence", "Primary Drivers",
    "Energy Transfer", "Common Compensation", "Injury Risk", "Clinical Assessment",
    "Corrective Exercise", "Progression", "Evidence", "References",
]


def vessel_record(name: str, fields: dict[str, Any]) -> tuple[str, dict[str, Any]]:
    out = {k: fields.get(k, "Not applicable — see regional anatomy references") for k in VESSEL_KEYS}
    out["Name"] = name
    return name, out


def fascia_record(name: str, fields: dict[str, Any]) -> tuple[str, dict[str, Any]]:
    out = {k: fields.get(k, "See regional fascial anatomy references") for k in FASCIA_KEYS}
    out["Name"] = name
    return name, out


def movement_record(name: str, fields: dict[str, Any]) -> tuple[str, dict[str, Any]]:
    out = {k: fields.get(k, "See biomechanics references for this movement") for k in MOVEMENT_KEYS}
    out["Movement"] = name
    return name, out


def emg_record(name: str, fields: dict[str, Any]) -> tuple[str, dict[str, Any]]:
    out = {k: fields.get(k, "See EMG literature") for k in EMG_KEYS}
    out["Exercise"] = name
    return name, out


def force_couple_record(name: str, fields: dict[str, Any]) -> tuple[str, dict[str, Any]]:
    out = {k: fields.get(k, "See scapulohumeral force couple literature") for k in FORCE_COUPLE_KEYS}
    return name, out


def kinetic_record(name: str, fields: dict[str, Any]) -> tuple[str, dict[str, Any]]:
    out = {k: fields.get(k, "See sport biomechanics literature") for k in KINETIC_KEYS}
    out["Movement"] = name
    return name, out


def _ref(topic: str) -> str:
    return f"Moore Clinically Oriented Anatomy; Netter Atlas; see PubMed [{topic}]"


def _us_artery(name: str) -> str:
    return (
        f"Color Doppler: {name} appears as pulsatile, anechoic/hypoechoic tubular structure with "
        "spectral broadening on stenosis; triphasic flow in proximal segments; assess for intimal "
        "flap (dissection), thrombus (non-compressible hypoechoic filling), or pseudoaneurysm."
    )


def _mri_artery(name: str) -> str:
    return (
        f"MRA/time-resolved CE-MRA: {name} flow void on T2; contrast-enhanced MRA delineates "
        "stenosis, occlusion, variant anatomy; TOF sensitive to slow flow; assess collateral "
        "reconstitution distal to occlusion."
    )


def _cta_artery(name: str) -> str:
    return (
        f"CTA: {name} opacifies with iodinated contrast; evaluate stenosis (&gt;50% hemodynamically "
        "significant), dissection (double lumen, intimal flap), aneurysm, embolus, or post-traumatic "
        "extravasation in acute trauma."
    )


def _us_vein(name: str) -> str:
    return (
        f"Compression ultrasound: {name} compressible when patent; loss of compressibility suggests "
        "thrombosis; augment distal segments to assess proximal obstruction; color flow absent in "
        "acute thrombosis; chronic thrombus may show recanalization."
    )


# ---------------------------------------------------------------------------
# Compact record builders
# ---------------------------------------------------------------------------

def _artery(name: str, **f: Any) -> tuple[str, dict[str, Any]]:
    base: dict[str, Any] = {
        "Type": "Artery",
        "Ultrasound Appearance": _us_artery(name),
        "MRI Appearance": _mri_artery(name),
        "CT Angiography Findings": _cta_artery(name),
        "References": _ref(f.pop("ref_topic", name)),
    }
    base.update(f)
    return vessel_record(name, base)


def _vein(name: str, **f: Any) -> tuple[str, dict[str, Any]]:
    base: dict[str, Any] = {
        "Type": "Vein",
        "Ultrasound Appearance": _us_vein(name),
        "MRI Appearance": (
            f"MRV/CE-MRV: {name} flow void on T2; contrast delineates thrombosis, compression, "
            "or variant drainage in upper extremity venous mapping."
        ),
        "CT Angiography Findings": (
            f"CTV: {name} opacifies with contrast; evaluate DVT, central venous stenosis, "
            "catheter thrombosis, or thoracic outlet venous compression."
        ),
        "References": _ref(f.pop("ref_topic", name)),
    }
    base.update(f)
    return vessel_record(name, base)


def _fasc(name: str, **f: Any) -> tuple[str, dict[str, Any]]:
    base: dict[str, Any] = {
        "References": _ref(f.pop("ref_topic", name)),
        "Ultrasound Appearance": (
            f"High-resolution US: {name} hyperechoic fibrillar layer; assess thickness, "
            "adhesion, and inter-layer sliding."
        ),
        "MRI Appearance": (
            f"MRI: {name} low T1/T2 signal; STIR hyperintensity with inflammation; "
            "defines compartment boundaries."
        ),
    }
    base.update(f)
    return fascia_record(name, base)


def _mov(name: str, **f: Any) -> tuple[str, dict[str, Any]]:
    base: dict[str, Any] = {"References": _ref(f.pop("ref_topic", name))}
    base.update(f)
    return movement_record(name, base)


def _emg(name: str, **f: Any) -> tuple[str, dict[str, Any]]:
    base: dict[str, Any] = {"References": _ref(f.pop("ref_topic", name))}
    base.update(f)
    return emg_record(name, base)


def _fc(name: str, **f: Any) -> tuple[str, dict[str, Any]]:
    base: dict[str, Any] = {"References": _ref(f.pop("ref_topic", name))}
    base.update(f)
    return force_couple_record(name, base)


def _kin(name: str, **f: Any) -> tuple[str, dict[str, Any]]:
    base: dict[str, Any] = {"References": _ref(f.pop("ref_topic", name))}
    base.update(f)
    return kinetic_record(name, base)


def _mb(
    mid: str,
    name: str,
    joint: str,
    region: str,
    plane: str,
    axis: str,
    primary: str,
    secondary: str,
    stabilizers: str,
    normal_rom: str,
    functional_rom: str,
    open_desc: str,
    closed_desc: str,
    arthro: str,
    osteo: str,
    clinical: str,
    assessment: str,
    treatment: str,
    sport: str,
    injuries: str,
    pain: str,
    dysfunc: str,
    comp: str,
    exercise: str,
    **extra: Any,
) -> tuple[str, dict[str, Any]]:
    fields: dict[str, Any] = {
        "ID": mid,
        "Joint": joint,
        "Body Region": region,
        "Plane": plane,
        "Axis": axis,
        "Open Chain": open_desc,
        "Closed Chain": closed_desc,
        "Primary Movers": primary,
        "Secondary Movers": secondary,
        "Stabilizers": stabilizers,
        "Force Couples": f"Agonist-antagonist pairs coordinating {name.lower()} with regional stabilizers",
        "Prime Stabilizers": stabilizers.split(";")[0].strip(),
        "Dynamic Stabilizers": secondary,
        "Static Stabilizers": "Capsuloligamentous restraints and bony architecture at end-range",
        "Arthrokinematics": arthro,
        "Osteokinematics": osteo,
        "Joint Reaction Force": f"Compression increases with load during {name.lower()} especially at end-range",
        "Compression Forces": "Articular approximation with muscle co-contraction and axial loading",
        "Shear Forces": "Shear minimized by capsular tension; excessive shear linked to instability",
        "Torque": "Muscular torque balanced by eccentric antagonists for controlled motion",
        "Moment Arm": "Moment arms vary with joint angle; typically optimal near mid-range",
        "Lever Class": "Third-class lever dominant in open-chain upper extremity motion",
        "Length-Tension Relationship": "Mid-range often optimizes force; end-range weakness common with inhibition",
        "EMG Evidence": f"EMG confirms {primary.split(',')[0].strip()} as primary during standardized {name.lower()}",
        "Normal ROM": normal_rom,
        "Functional ROM": functional_rom,
        "Compensations": comp,
        "Common Dysfunctions": dysfunc,
        "Common Pain Patterns": pain,
        "Clinical Relevance": clinical,
        "Functional Activities": f"ADL and occupational tasks requiring {name.lower()} within symptom-free range",
        "Sport-Specific Applications": sport,
        "Common Injuries": injuries,
        "Assessment": assessment,
        "Treatment Implications": treatment,
        "Exercise Progressions": exercise,
    }
    fields.update(extra)
    return _mov(name, **fields)


def _artery_from_row(row: tuple) -> tuple[str, dict[str, Any]]:
    (vid, name, latin, region, origin, term, course, maj, min_, struct, mus, bone, joint, lig,
     tend, skin, vein, anas, clin, inj, comp, pulse, coll, surg, rehab) = row
    return _artery(name, **{
        "ID": vid,
        "Latin Name": latin,
        "Region": region,
        "Origin": origin,
        "Termination": term,
        "Course": course,
        "Major Branches": maj,
        "Minor Branches": min_,
        "Structures Supplied": struct,
        "Muscles Supplied": mus,
        "Bones Supplied": bone,
        "Joints Supplied": joint,
        "Ligaments Supplied": lig,
        "Tendons Supplied": tend,
        "Skin Distribution": skin,
        "Venous Drainage": vein,
        "Anastomoses": anas,
        "Clinical Importance": clin,
        "Common Injuries": inj,
        "Compression Sites": comp,
        "Pulse Location": pulse,
        "Collateral Circulation": coll,
        "Surgical Considerations": surg,
        "Rehabilitation Considerations": rehab,
    })


def _fascia_from_row(row: tuple) -> tuple[str, dict[str, Any]]:
    (fid, name, region, layer, thick, cont, attach, comp, enclosed, covered, nerves, vessels,
     biomech, force, mob, slide, clin, palp, fib, restr, inj, manual, stretch, mobex, rehab,
     evidence) = row
    return _fasc(name, **{
        "ID": fid,
        "Region": region,
        "Layer": layer,
        "Thickness": thick,
        "Continuity": cont,
        "Attachments": attach,
        "Compartments": comp,
        "Structures Enclosed": enclosed,
        "Muscles Covered": covered,
        "Nerves Passing Through": nerves,
        "Vessels Passing Through": vessels,
        "Biomechanical Role": biomech,
        "Force Transmission": force,
        "Mobility": mob,
        "Sliding Characteristics": slide,
        "Clinical Importance": clin,
        "Palpation": palp,
        "Fibrosis": fib,
        "Restrictions": restr,
        "Common Injuries": inj,
        "Manual Therapy": manual,
        "Stretching": stretch,
        "Mobility Exercises": mobex,
        "Rehabilitation": rehab,
        "Evidence": evidence,
    })


def _vein_from_row(row: tuple) -> tuple[str, dict[str, Any]]:
    (vid, name, latin, region, origin, term, course, maj, min_, struct, mus, bone, joint, lig,
     tend, skin, vein, anas, clin, inj, comp, pulse, coll, surg, rehab) = row
    return _vein(name, **{
        "ID": vid,
        "Latin Name": latin,
        "Region": region,
        "Origin": origin,
        "Termination": term,
        "Course": course,
        "Major Branches": maj,
        "Minor Branches": min_,
        "Structures Supplied": struct,
        "Muscles Supplied": mus,
        "Bones Supplied": bone,
        "Joints Supplied": joint,
        "Ligaments Supplied": lig,
        "Tendons Supplied": tend,
        "Skin Distribution": skin,
        "Venous Drainage": vein,
        "Anastomoses": anas,
        "Clinical Importance": clin,
        "Common Injuries": inj,
        "Compression Sites": comp,
        "Pulse Location": pulse,
        "Collateral Circulation": coll,
        "Surgical Considerations": surg,
        "Rehabilitation Considerations": rehab,
    })


# ---------------------------------------------------------------------------


# ---------------------------------------------------------------------------


# ---------------------------------------------------------------------------


# ---------------------------------------------------------------------------
# 1. Blood Supply — Arteries (28)
# ---------------------------------------------------------------------------

ARTERY_ROWS: list[tuple] = [
    ("VES-UE-001", "Vertebral Artery", "Arteria vertebralis", "Cervical", "Subclavian artery (first branch)", "Basilar artery", "Ascends transverse foramina C6–C1, curves around atlas, enters cranium", "Meningeal and spinal branches", "Muscular branches to deep cervical muscles", "Brainstem, cerebellum, upper cervical spinal cord", "Deep cervical flexors and suboccipital muscles", "Cervical vertebrae via periosteal branches", "Atlanto-occipital and atlanto-axial joints", "Posterior atlanto-occipital and atlanto-axial ligaments", "None directly", "None — intracranial/intraforaminal", "Vertebral venous plexus", "Circle of Willis; contralateral vertebral; muscular collaterals", "Vertebrobasilar insufficiency; dissection risk with rotation trauma", "Arterial dissection; iatrogenic injury during cervical manipulation", "Transverse foramina; atlanto-axial rotation", "Not palpable externally", "Contralateral vertebral; posterior communicating arteries", "Avoid aggressive rotation/extension with known dissection", "Monitor neurologic symptoms during cervicothoracic mobility"),
    ("VES-UE-002", "Ascending Cervical Artery", "Arteria cervicalis ascendens", "Cervical — lateral neck", "Inferior thyroid artery (thyrocervical trunk)", "Anastomoses with vertebral and deep cervical arteries", "Ascends on scalenus anterior along cervical transverse processes", "Spinal branches to cervical cord and meninges", "Muscular branches to scalene and longus colli", "Cervical spinal cord segments and nerve roots", "Scalenes, longus colli/capitis, levator scapulae region", "Cervical vertebral bodies and transverse processes", "Facet joints via medial branches", "Posterior longitudinal ligament region", "None", "None direct", "Vertebral venous plexus and thyroid venous plexus", "Vertebral, deep cervical, occipital muscular network", "Collateral pathway in vertebral artery hypoplasia", "Rare direct trauma; compromised in anterior cervical surgery", "Scalene triangle in thoracic outlet syndrome", "Not palpable", "Vertebral and deep cervical anastomotic arcade", "Identify during anterior cervical approaches", "Thoracic outlet rehab considers reduced collateral flow"),
    ("VES-UE-003", "Deep Cervical Artery", "Arteria cervicalis profunda", "Cervical — posterior neck", "Costocervical trunk", "Anastomoses with vertebral, ascending cervical, occipital arteries", "Ascends posterior to cervical transverse processes with cervical nerves", "Spinal branches to posterior cervical cord", "Muscular branches to semispinalis, splenius, multifidus", "Posterior cervical spinal cord and nerve roots", "Semispinalis, splenius, multifidus, suboccipital muscles", "Cervical laminae, spinous processes, facet pillars", "Facet joints posteriorly", "Nuchal ligament and interspinous ligaments", "None", "None", "Vertebral venous plexus", "Vertebral, occipital, ascending cervical network", "Posterior cervical muscle perfusion; collateral in vertebral stenosis", "Blunt posterior neck trauma rarely causes pseudoaneurysm", "Not typically compressed by facet hypertrophy", "Not palpable", "Rich posterior cervical muscular anastomoses", "Posterior cervical fusion midline generally avoids major trunk", "Deep cervical extensor strengthening supports segmental stability"),
    ("VES-UE-004", "Occipital Artery", "Arteria occipitalis", "Cervical — posterior scalp/suboccipital", "External carotid artery", "Superior nuchal line anastomoses", "Crosses atlas apex, pierces trapezius to scalp", "SCM, auricular, meningeal, descending branches", "Muscular branches to suboccipital triangle", "Posterior scalp, posterior fossa dura, SCM", "Trapezius, semispinalis capitis, suboccipital muscles", "Occipital bone periosteum", "Atlanto-occipital joint region", "Nuchal ligament", "None", "Posterior scalp to vertex", "Occipital vein to suboccipital venous plexus", "Vertebral muscular, superficial temporal, posterior auricular", "Suboccipital landmark; migraine trigger region", "Scalp laceration hemorrhage; rare dissection", "Trapezius tunnel at superior nuchal line", "Palpable behind mastoid in thin individuals", "Contralateral occipital and superficial temporal arcade", "Cautery during posterior occipital approach", "Suboccipital release and upper trapezius mobility for tension headache"),
    ("VES-UE-005", "Subclavian Artery", "Arteria subclavia", "Shoulder girdle / thoracic inlet", "Aortic arch (left) or brachiocephalic trunk (right)", "Axillary artery at lateral border of 1st rib", "Arches over 1st rib between scalene anterior and medius", "Vertebral, internal thoracic, thyrocervical, costocervical", "Dorsal scapular branch (variant)", "Upper limb, brain via vertebral, anterior chest wall", "Scalenes, subclavius", "Clavicle and 1st rib", "Sternoclavicular and costoclavicular region", "Costoclavicular ligament area", "Subclavius tendon region", "Infraclavicular skin indirectly", "Subclavian vein companion", "Vertebral, internal mammary, intercostal collaterals", "Thoracic outlet and clavicle fracture vascular injury", "Compression in TOS; iatrogenic central line injury", "Interscalene triangle; costoclavicular space", "Supraclavicular fossa (avoid bilateral compression)", "Contralateral subclavian and vertebral collaterals", "First rib resection and decompression planning", "Avoid overhead loading early post-TOS surgery"),
    ("VES-UE-006", "Axillary Artery", "Arteria axillaris", "Shoulder / axilla", "Subclavian at lateral 1st rib", "Brachial artery at inferior teres major", "Three parts relative to pectoralis minor", "Superior thoracic, thoracoacromial, lateral thoracic, subscapular, circumflex humeral", "Muscular branches to pectoralis and deltoid", "Shoulder girdle, proximal arm, breast territory", "Pectoralis, deltoid, rotator cuff region", "Proximal humerus and scapula", "Glenohumeral and acromioclavicular joints", "Glenohumeral capsular region", "Long head biceps groove region", "Axillary skin", "Axillary vein", "Scapular circumflex and rich shoulder anastomoses", "Fracture/dislocation vascular compromise", "Anterior dislocation axillary injury", "Pectoralis minor; anterior humeral head dislocation", "Palpable in axilla (deep)", "Scapular and circumflex collaterals", "Proximal humerus ORIF vascular mapping", "Progressive ROM after dislocation with neurovascular monitoring"),
    ("VES-UE-007", "Superior Thoracic Artery", "Arteria thoracica superior", "Shoulder apex / upper chest", "Axillary artery first part", "Anastomoses with internal thoracic and intercostals", "Descends along superior thoracic wall", "None major", "Periosteal twigs to upper ribs", "Upper anterior chest wall", "Subclavius and upper pectoralis minor fibers", "1st and 2nd ribs; clavicle region", "Sternoclavicular region", "Costoclavicular ligament area", "None", "Upper chest skin", "Axillary venous plexus", "Internal thoracic and intercostal anastomoses", "Minor but relevant in apical chest trauma", "Rare isolated injury", "Apical thoracic outlet region", "Not routinely palpated", "Intercostal collateral network", "Apical surgery hemostasis awareness", "Upper chest breathing retraining post-thoracic surgery"),
    ("VES-UE-008", "Thoracoacromial Artery", "Arteria thoracoacromialis", "Shoulder", "Axillary artery second part", "Acromion, deltoid, clavicle, pectoralis territories", "Pierces clavipectoral fascia with coracoclavicular ligaments", "Acromial, deltoid, clavicular, pectoral branches", "Cutaneous twigs to anterior shoulder", "Deltoid, pectoralis major clavicular head, AC joint", "Deltoid and pectoralis major", "Distal clavicle and acromion", "Acromioclavicular joint", "Coracoacromial ligament region", "Deltoid tendon region", "Anterior shoulder skin", "Acromial veins", "Suprascapular and circumflex humeral anastomoses", "AC joint and clavicle perfusion", "Clavicle fracture bleeding source", "Coracoid and clavipectoral tunnel", "Not palpable as discrete pulse", "Deltoid branch collaterals", "Deltoid-preserving surgical approaches", "Early isometric deltoid activation post AC injury"),
    ("VES-UE-009", "Lateral Thoracic Artery", "Arteria thoracica lateralis", "Shoulder / lateral chest wall", "Axillary artery second part", "Anastomoses with intercostals and mammary branches", "Descends along lateral chest with long thoracic nerve", "Mammary branches when present", "Serratus anterior muscular branches", "Lateral chest wall and serratus anterior", "Serratus anterior and pectoralis minor", "Ribs 2–6", "Scapulothoracic interface", "Serratus fascia", "None major", "Lateral thorax skin", "Lateral thoracic vein", "Intercostal and internal thoracic network", "Serratus perfusion in long thoracic nerve injury", "Rare direct vascular injury", "Pectoralis minor compression in TOS variants", "Not palpable", "Intercostal collateral network", "Breast and chest wall surgery awareness", "Serratus punch rehab after nerve injury"),
    ("VES-UE-010", "Subscapular Artery", "Arteria subscapularis", "Shoulder / posterior axilla", "Axillary artery third part", "Circumflex scapular and thoracodorsal arteries", "Largest branch along subscapular fossa border", "Circumflex scapular and thoracodorsal arteries", "Multiple muscular branches", "Scapula, latissimus dorsi, teres major region", "Subscapularis, teres major, latissimus dorsi", "Scapula and proximal humerus", "Glenohumeral joint capsule region", "Glenohumeral ligaments indirectly", "Subscapularis tendon", "Posterior axillary skin", "Subscapular vein", "Rich scapular anastomotic network", "Posterior shoulder perfusion; flap surgery landmark", "Latissimus flap harvest affects regional perfusion", "Quadrangular space region (circumflex scapular)", "Not palpable", "Circumflex scapular collaterals", "Posterior shoulder surgical approaches", "Rowing and pulling rehab respects posterior supply"),
    ("VES-UE-011", "Anterior Circumflex Humeral Artery", "Arteria circumflexa humeri anterior", "Shoulder / anterior humerus", "Axillary artery third part", "Anastomoses with posterior circumflex humeral", "Wraps anterior surgical neck with ascending branch to head", "Ascending branch to humeral head", "Articular branches to head and biceps groove", "Humeral head and biceps groove region", "Coracobrachialis and short head biceps region", "Proximal humerus and greater tuberosity", "Glenohumeral joint head perfusion", "Rotator interval region", "Biceps long head tendon sheath", "Anterior shoulder skin", "Axillary venous plexus", "Posterior circumflex humeral arcade", "Critical head perfusion — AVN risk in surgical neck fracture", "Proximal humerus fracture with head ischemia", "Surgical neck fracture; anterior dislocation", "Not palpable", "Posterior circumflex collaterals", "ORIF planning for humeral head blood supply", "Protected ROM after proximal humerus fracture"),
    ("VES-UE-012", "Posterior Circumflex Humeral Artery", "Arteria circumflexa humeri posterior", "Shoulder / posterior humerus", "Axillary artery third part", "Anastomoses with anterior circumflex humeral", "Passes quadrangular space with axillary nerve", "Descending branch along posterior humerus", "Muscular branches to deltoid and teres minor", "Posterior humerus, deltoid, teres minor", "Deltoid, teres minor, infraspinatus region", "Proximal humerus posterior surface", "Glenohumeral joint posterior capsule", "Posterior glenohumeral ligaments", "Infraspinatus and teres minor tendons", "Posterior deltoid skin", "Axillary vein", "Anterior circumflex humeral network", "Quadrangular space syndrome vascular component", "Axillary nerve palsy with space-occupying lesion", "Quadrangular space fibrous bands or cysts", "Not palpable", "Anterior circumflex collaterals", "Posterior shoulder approach awareness", "External rotation strengthening after space decompression"),
    ("VES-UE-013", "Brachial Artery", "Arteria brachialis", "Arm", "Axillary at inferior teres major", "Bifurcates into radial and ulnar at cubital fossa", "Medial arm in medial bicipital groove with median nerve", "Profunda brachii and nutrient artery", "Muscular branches to flexor compartment", "Elbow, forearm, and hand via terminal branches", "Biceps, brachialis, coracobrachialis, flexor compartment", "Humerus", "Elbow joint", "Medial and lateral collateral regions", "Distal biceps insertion region", "Medial arm skin", "Paired brachial veins (venae comitantes)", "Profunda brachii and recurrent collaterals", "Blood pressure site; laceration risk in trauma", "Supracondylar fracture vascular injury in children", "Medial epicondyle and lacertus fibrosus region", "Palpable throughout medial arm to antecubital fossa", "Recurrent radial and ulnar collaterals around elbow", "Tourniquet time limits in arm surgery", "Gradual elbow ROM after supracondylar fracture with monitoring"),
    ("VES-UE-014", "Profunda Brachii Artery", "Arteria profunda brachii", "Arm / posterior elbow", "Brachial artery", "Anastomoses with radial and middle collateral arteries", "Travels with radial nerve in spiral groove", "Radial collateral and middle collateral arteries", "Muscular branches to triceps", "Posterior arm and elbow extension mechanism", "Triceps brachii all heads", "Posterior humerus", "Elbow olecranon region", "Olecranon bursa region", "Triceps tendon", "Posterior arm skin", "Deep brachial veins", "Elbow collateral anastomotic arcade", "Elbow perfusion when brachial injured", "Humeral shaft fracture with radial nerve", "Spiral groove fracture site", "Not palpable", "Middle and posterior collateral collaterals", "Posterior approach to humerus", "Triceps progressive loading after humeral shaft fracture"),
    ("VES-UE-015", "Superior Ulnar Collateral Artery", "Arteria collateralis ulnaris superior", "Elbow — medial", "Brachial artery", "Anastomoses with posterior ulnar recurrent", "Descends with ulnar nerve posterior to medial epicondyle", "None major", "Periarticular branches to medial elbow", "Medial elbow and ulnar nerve region", "Flexor carpi ulnaris origin region", "Medial epicondyle and olecranon", "Ulnohumeral joint medial aspect", "UCL complex region", "Common flexor origin", "Medial forearm skin", "Ulnar venous plexus", "Inferior ulnar collateral and recurrent ulnar network", "UCL reconstruction considerations; cubital tunnel region; thrower elbow medial perfusion", "UCL sprain and cubital tunnel syndrome", "Cubital tunnel retinaculum", "Not palpable", "Recurrent ulnar collaterals", "UCL surgery graft harvest planning", "Throwing progression monitors medial elbow symptoms"),
    ("VES-UE-016", "Inferior Ulnar Collateral Artery", "Arteria collateralis ulnaris inferior", "Elbow — medial anterior", "Brachial artery", "Anastomoses with anterior ulnar recurrent", "Crosses anterior to medial epicondyle", "None major", "Periarticular twigs", "Anterior medial elbow", "Pronator teres and flexor origin region", "Medial epicondyle", "Ulnohumeral joint", "UCL anterior band region", "Flexor-pronator mass", "Medial antecubital skin", "Median and basilic tributaries", "Superior ulnar collateral network", "Elbow flexion stability perfusion", "Valgus extension overload in throwers", "Medial epicondyle compression", "Not palpable", "Superior ulnar collateral collaterals", "Medial elbow surgical approach", "Eccentric wrist flexor training for medial tendinopathy"),
    ("VES-UE-017", "Radial Recurrent Artery", "Arteria recurrens radialis", "Elbow — lateral", "Radial artery", "Anastomoses with radial and middle collateral arteries", "Ascends lateral elbow with radial nerve", "None major", "Muscular branches to brachioradialis and ECRB", "Lateral elbow and mobile wad", "Brachioradialis and extensor carpi radialis brevis", "Lateral epicondyle", "Radiocapitellar joint", "Lateral collateral ligament region", "Common extensor origin", "Lateral forearm skin", "Radial veins", "Elbow collateral arcade", "Lateral elbow perfusion; collateral in brachial injury", "Lateral epicondylalgia context", "Radial tunnel region", "Not palpable", "Radial collateral collaterals", "Lateral epicondyle release hemostasis", "Eccentric wrist extension progression for lateral elbow pain"),
    ("VES-UE-018", "Ulnar Recurrent Artery", "Arteria recurrens ulnaris", "Elbow — medial", "Ulnar artery", "Anastomoses with inferior and superior ulnar collateral", "Anterior and posterior branches around medial elbow", "None major", "Periarticular branches", "Medial elbow stability zone", "Flexor carpi ulnaris and flexor mass", "Medial elbow osseous landmarks", "Ulnohumeral joint", "Ulnar collateral ligament", "Flexor tendons medially", "Medial forearm skin", "Ulnar veins", "Ulnar collateral network", "Medial elbow collateral circulation", "UCL injury in throwers", "Cubital tunnel compression", "Not palpable", "Collateral ulnar network", "Medial elbow surgery", "Medial isometrics progressing to functional valgus control"),
    ("VES-UE-019", "Radial Artery", "Arteria radialis", "Forearm and wrist", "Brachial bifurcation", "Deep palmar arch (dominant variant) with superficial contribution", "Lateral forearm with flexor carpi radialis tendon boundary", "Princeps pollicis and radialis indicis arteries", "Carpal and muscular branches", "Lateral forearm, thumb, radial hand", "Brachioradialis, extensors, thenar muscles", "Radius, scaphoid, trapezium", "Wrist and carpometacarpal joints", "Volar radiocarpal ligaments", "Brachioradialis and thumb tendons", "Thenar and radial hand skin", "Radial veins", "Ulnar artery via palmar arches", "Allen test patency; catheterization access", "Laceration at wrist; iatrogenic radial access injury", "Anatomical snuffbox; scaphoid groove", "Palpable at wrist radial to FCR tendon", "Ulnar artery palmar arch collaterals", "Flap harvest and radial artery graft", "Grip strengthening after harvest with ulnar dominance check"),
    ("VES-UE-020", "Ulnar Artery", "Arteria ulnaris", "Forearm and wrist", "Brachial bifurcation", "Superficial palmar arch (usually) with deep arch contribution", "Medial forearm under flexor digitorum superficialis", "Common palmar digital arteries", "Muscular and carpal branches", "Medial forearm, hypothenar, ulnar digits", "Flexor carpi ulnaris, flexor digitorum, hypothenar muscles", "Ulna, pisiform, hamate", "Wrist and elbow via collaterals", "UCL and TFCC region", "Flexor tendons", "Hypothenar and ulnar hand skin", "Ulnar veins", "Radial artery palmar arches", "Guyon's canal compression in cyclists", "Handlebar palsy with vascular and neural components", "Guyon's canal; hook of hamate fracture", "Palpable at wrist medial to FCU tendon", "Radial collaterals via palmar arches", "Ulnar artery transposition in trauma", "Progressive grip after Guyon's canal release"),
    ("VES-UE-021", "Common Interosseous Artery", "Arteria interossea communis", "Forearm / elbow region", "Ulnar artery", "Bifurcates into anterior and posterior interosseous arteries", "Short trunk before passing deep in forearm", "Anterior and posterior interosseous branches", "None on trunk", "Deep forearm compartment", "Deep flexors and extensors", "Radius and ulna", "Proximal radioulnar joint", "Interosseous membrane", "Deep flexor and extensor tendons", "Deep forearm region", "Interosseous veins", "Recurrent interosseous at elbow", "Forearm compartment perfusion", "Compartment syndrome vascular assessment", "Interosseous membrane", "Not palpable", "Elbow recurrent interosseous collaterals", "Forearm fasciotomy with vascular preservation", "Compartment rehab only after medical clearance"),
    ("VES-UE-022", "Anterior Interosseous Artery", "Arteria interossea anterior", "Forearm — deep anterior", "Common interosseous artery", "Palmar carpal network and muscular branches", "Descends on anterior interosseous membrane with AIN", "Muscular branches to deep flexors", "Palmar carpal branches", "Deep flexor compartment and pronator quadratus", "FDP, FPL, pronator quadratus", "Radius and ulna shafts", "Distal radioulnar joint", "Interosseous membrane anterior surface", "FDP and FPL tendons", "None specific cutaneous", "Anterior interosseous veins", "Posterior interosseous anastomoses", "Forearm perfusion; AIN syndrome context", "Forearm fracture vascular compromise", "Interosseous membrane", "Not palpable", "Posterior interosseous collaterals", "Forearm fracture ORIF", "Intrinsic hand rehab after AIN recovery"),
    ("VES-UE-023", "Posterior Interosseous Artery", "Arteria interossea posterior", "Forearm / dorsum hand", "Common interosseous artery", "Dorsal carpal arch", "Passes with PIN through or above supinator", "Recurrent interosseous branch to elbow", "Muscular branches to extensor compartment", "Extensor compartment and dorsum hand", "Extensor muscles and supinator", "Dorsal radius and ulna", "Distal radioulnar joint", "Interosseous membrane posterior surface", "Extensor tendons", "Dorsum hand skin", "Posterior interosseous veins", "Anterior interosseous network", "PIN syndrome and dorsal hand perfusion", "Monteggia fracture vascular injury", "Supinator arch (PIN compression)", "Not palpable", "Anterior interosseous collaterals", "Posterior forearm approach", "Supination strengthening after PIN neuropraxia"),
    ("VES-UE-024", "Superficial Palmar Arch", "Arcus palmaris superficialis", "Hand — palm", "Ulnar artery (usually dominant contributor)", "Common palmar digital arteries to fingers", "Curves across palm superficial to flexor tendons", "Common digital arteries to fingers II–V", "Thenar and hypothenar contributions", "Palmar skin, fingers, lumbricals and interossei", "Thenar, hypothenar, lumbrical muscles", "Metacarpals and phalanges", "MCP and PIP joints", "Palmar plate region", "Flexor tendons", "Palmar hand skin", "Superficial palmar venous plexus", "Deep palmar arch via perforators", "Allen test; palmar laceration hemorrhage", "Glass and hand trauma laceration", "Thenar and hypothenar fascial tunnels", "Not separately palpable as arch pulse", "Deep arch collaterals", "Palmar wound repair with vascular exam", "Progressive grip after palmar repair"),
    ("VES-UE-025", "Deep Palmar Arch", "Arcus palmaris profundus", "Hand — deep palm", "Radial artery (usually dominant contributor)", "Palmar metacarpal arteries", "Deep to flexor tendons on metacarpal bases", "Princeps pollicis and radialis indicis", "Perforators to superficial arch", "Thumb, index, deep hand structures", "Interossei and adductor pollicis", "Metacarpals", "CMC and MCP joints", "Deep transverse metacarpal ligaments", "Flexor tendons deep surface", "Thumb and index palmar skin", "Deep palmar veins", "Superficial arch anastomoses", "Thumb perfusion critical in crush injury", "Metacarpal fracture vascular injury", "Adductor pollicis space", "Not separately palpable", "Superficial arch collaterals", "Hand replantation microsurgery", "Pinch and grip rehab after deep hand injury"),
    ("VES-UE-026", "Dorsal Carpal Arch", "Rete carpale dorsale", "Wrist / dorsum hand", "Posterior interosseous and dorsal carpal branches", "Dorsal metacarpal arteries", "Arches across dorsum of carpus beneath extensor retinaculum", "Dorsal metacarpal arteries", "Dorsal digital branches", "Dorsum hand and digits dorsally", "Extensor compartment muscles", "Carpals and metacarpals", "Wrist extension mechanics", "Dorsal wrist ligaments", "Extensor tendons", "Dorsum hand skin", "Dorsal venous network", "Palmar arches via perforating branches", "Dorsal hand flap perfusion", "Extensor tendon zone injuries", "Extensor retinaculum compartments", "Not palpable", "Palmar arch collaterals", "Dorsal wrist surgery", "Edema control and tendon gliding after dorsal injury"),
    ("VES-UE-027", "Common Digital Arteries", "Arteriae digitales palmares communes", "Fingers — palm", "Superficial or deep palmar arch", "Proper digital arteries at web spaces", "Run with digital nerves in fibrous sheaths toward web spaces", "Proper digital artery pairs at each web space", "Dorsal perforators proximally", "Fingers II–V palmar pulp and joints", "Lumbricals, interossei, flexor digitorum", "Phalanges of digits II–V", "MCP, PIP, and DIP joints", "Collateral ligaments and volar plates", "Flexor digitorum tendons", "Palmar digit skin", "Palmar digital veins", "Contralateral digit collaterals via arches", "Finger perfusion in crush and replantation", "Flexor tendon zone vascular injury", "Fibrous flexor sheath pulleys", "Not individually palpable", "Palmar arch collaterals", "Digit replantation microvascular repair", "Tendon gliding within vascularized sheath post repair"),
    ("VES-UE-028", "Proper Digital Arteries", "Arteriae digitales palmares propriae", "Fingers — pulp", "Common digital arteries", "Terminal branches to finger pulp and nail bed", "Run lateral to flexor sheath with proper digital nerves", "Terminal branches to finger pulp", "Dorsal branches to nail bed", "Finger pulp, nail bed, DIP region", "Flexor digitorum profundus and superficialis", "Phalanges", "DIP, PIP, and MCP joints", "Collateral ligaments", "FDP and FDS tendons", "Finger pulp and nail bed", "Digital veins", "Adjacent digit collaterals via arches", "Fingertip amputation replantation viability", "Crush injury, frostbite, felon", "Pulp and nail bed compression", "Not palpable individually", "Palmar arch collaterals", "Microvascular finger repair", "Desensitization and ROM after fingertip injury"),
]
ARTERIES: list[tuple[str, dict[str, Any]]] = [_artery_from_row(r) for r in ARTERY_ROWS]

# ---------------------------------------------------------------------------
# 2. Veins (5)
# ---------------------------------------------------------------------------

VEIN_ROWS: list[tuple] = [
    ("VES-UE-V01", "Cephalic Vein", "Vena cephalica", "Arm/shoulder — lateral", "Dorsal venous network of hand", "Axillary vein (or deltopectoral groove)", "Ascends lateral arm in superficial fascia with deltopectoral groove", "Median cubital tributaries; dorsal metacarpal tributaries", "Cutaneous perforators", "Lateral arm, shoulder, lateral thorax", "Deltoid and biceps superficial region", "Clavicle lateral third", "Shoulder region", "Deltopectoral fascia", "None major", "Lateral arm and forearm skin", "Axillary vein", "Basilic and median cubital anastomoses", "Primary IV access site; flap harvest conduit", "Laceration, thrombophlebitis after cannulation", "Clavipectoral groove; deltopectoral groove", "Not a pulse — compressible vein", "Basilic and deep venous collaterals", "Preserve during shoulder surgery when possible", "Avoid aggressive shoulder flexion with fresh cephalic harvest site"),
    ("VES-UE-V02", "Basilic Vein", "Vena basilica", "Arm — medial", "Ulnar dorsal venous network", "Axillary or brachial vein", "Ascends medial arm with medial cutaneous nerve of forearm", "Median cubital vein; muscular tributaries", "Cutaneous branches", "Medial arm and forearm", "Flexor compartment superficial region", "Medial epicondyle region", "Elbow region", "Medial intermuscular septum region", "None major", "Medial arm skin", "Brachial/axillary vein", "Cephalic via median cubital; deep brachial veins", "Preferred AV fistula conduit; IV access", "Thrombophlebitis; post-cannulation scarring", "Medial bicipital groove at elbow", "Visible subcutaneous medial arm", "Cephalic and deep venous collaterals", "Protect during medial elbow surgery", "Elbow extension ROM after medial cannulation sites heal"),
    ("VES-UE-V03", "Median Cubital Vein", "Vena mediana cubiti", "Elbow — antecubital", "Cephalic and basilic veins", "Drains to brachial or axillary via connecting veins", "Oblique superficial vein across antecubital fossa", "None", "Cutaneous twigs", "Antecubital fossa skin", "Biceps/brachialis superficial region", "Distal humerus region", "Elbow joint anterior", "Bicipital aponeurosis region", "Biceps tendon region", "Antecubital skin", "Brachial vein", "Cephalic-basilic crossover — critical collateral", "Most common phlebotomy site", "Hematoma, nerve injury (median/lateral antebrachial cutaneous)", "Bicipital aponeurosis compression with elbow flexion", "Visible in antecubital fossa with tourniquet", "Cephalic and basilic collaterals", "Avoid repeated venipuncture same site in athletes", "Full elbow ROM once antecubital hematoma resolved"),
    ("VES-UE-V04", "Deep Veins (Paired Venae Comitantes)", "Venae comitantes", "Arm/forearm — deep", "Palmar/deep forearm venous plexus", "Axillary vein via brachial veins", "Accompany brachial, radial, and ulnar arteries deep to fascia", "Multiple unnamed tributaries from muscles", "Periosteal and articular drainage", "Deep muscle compartments", "All deep flexor/extensor muscles", "Humerus, radius, ulna", "Elbow and wrist joints", "Capsular plexus", "Deep tendons", "Minimal cutaneous", "Axillary vein", "Superficial cephalic/basilic via perforators", "Primary drainage for muscle compartments; DVT less common UE", "Paget-Schroetter effort thrombosis; post-traumatic thrombosis", "Thoracic outlet; hyperabduction", "Not superficially visible", "Superficial venous collaterals", "Fasciotomy does not require deep vein ligation routinely", "Gradual loading after UE DVT per hematology clearance"),
    ("VES-UE-V05", "Digital Veins", "Venae digitales", "Fingers/hand", "Palmar and dorsal digital venous plexus", "Deep palmar venous arch and dorsal network", "Parallel digital nerves along fingers", "Connecting branches at web spaces", "Pulp venous plexus", "Finger pulp and nail bed", "Intrinsic hand muscles", "Phalanges", "MCP/PIP/DIP joints", "Collateral ligament plexus", "Flexor/extensor tendons", "Finger skin dorsal and palmar", "Deep palmar and dorsal arch veins", "Interdigital anastomoses", "Replantation venous outflow critical for survival", "Crush injury thrombosis; felon spread", "Pulp and tight rings", "Visible on dorsum with tourniquet", "Contralateral digital and arch collaterals", "Microvascular replantation venous repair", "Edema management and ROM after finger replantation"),
]
VEINS: list[tuple[str, dict[str, Any]]] = [_vein_from_row(r) for r in VEIN_ROWS]

# ---------------------------------------------------------------------------
# 3. Fascia (18)
# ---------------------------------------------------------------------------

FASCIA_ROWS: list[tuple] = [
    ("FAS-UE-001", "Investing Layer (Cervical Fascia)", "Neck", "Superficial layer of deep cervical fascia", "1–2 mm variable", "Encircles neck like collar; splits to invest SCM and trapezius", "Mandible, hyoid, nuchal ligament, spinous processes, clavicle", "Superficial neck compartment", "Platysma, external jugular vein", "SCM, trapezius", "Spinal accessory, cervical plexus branches", "External jugular vein, transverse cervical vessels", "Maintains neck shape; transmits force from SCM/trapezius", "Links shoulder girdle elevation to cervical stabilizers", "Moderate — slides over deeper layers with swallowing/rotation", "Platysma and SCM glide over pretracheal fascia", "Infection spread (deep neck space); surgical landmark", "Palpable as tight band with SCM/trapezius tension", "Thickening in chronic neck pain and post-radiation fibrosis", "Reduced rotation with global neck guarding", "Blunt neck trauma contusion", "Myofascial release to SCM/trapezius; gentle skin rolling", "Upper trapezius and SCM stretching with chin tuck", "Cervical rotation and side flexion AROM", "Post-whiplash gradual mobility with red flag screening", "Limited RCT evidence; widely used clinically for neck tension"),
    ("FAS-UE-002", "Pretracheal Fascia", "Neck", "Middle layer of deep cervical fascia", "Thin", "Invests thyroid, trachea, esophagus; attaches to hyoid and fibrous pericardium", "Hyoid bone, manubrium, visceral fascia", "Visceral compartment of neck", "Thyroid, trachea, esophagus", "Infrahyoid strap muscles", "Recurrent laryngeal nerves", "Inferior thyroid arteries", "Visceral support during swallowing and neck extension", "Transmits hyoid stabilizer forces to thorax", "Low — moves with swallowing", "Slides relative to prevertebral fascia during neck motion", "Deep neck infection route; thyroid surgery landmark", "Not directly palpable; inferred with swallowing dysfunction", "Post-surgical adhesions after anterior neck surgery", "Dysphagia-related neck guarding", "Penetrating trauma infection risk", "Gentle throat/neck mobility post thyroidectomy when cleared", "Chin tuck and swallowing retraining", "Cervical AROM with swallowing coordination", "Speech-language pathology integration post neck surgery", "Clinical consensus for post-surgical neck mobility"),
    ("FAS-UE-003", "Prevertebral Fascia", "Neck", "Deep layer anterior to vertebral column", "Thick posteriorly", "Covers anterior vertebral bodies and longus colli/capitis", "Base of skull to anterior longitudinal ligament continuity", "Prevertebral space", "Cervical spine, longus muscles, sympathetic trunk region", "Longus colli, longus capitis, scalenes deep surface", "Cervical nerve roots (nearby)", "Vertebral and ascending cervical arteries", "Deep neck stability; barrier limiting infection spread to mediastinum", "Longitudinal force transmission during cervical flexion", "Moderate with flexion/extension", "Longus colli glides during cervical flexion", "Retropharyngeal abscess space boundary", "Deep anterior neck tightness with flexion loss", "Chronic postural flexion fibrosis in desk workers", "Flexion restriction with deep neck pain", "Whiplash-associated deep flexor inhibition", "Indirect release via deep neck flexor training", "Deep neck flexor activation before stretching", "Craniocervical flexion progression (CCF)", "Progressive deep neck flexor retraining protocol", "Jull et al. deep neck flexor training evidence for neck pain"),
    ("FAS-UE-004", "Carotid Sheath", "Neck", "Condensation of deep cervical fascia", "Dense tubular sheath", "Invests common carotid, internal jugular vein, vagus nerve", "Skull base to root of neck", "Carotid sheath compartment", "Carotid artery, IJV, vagus nerve", "None directly — adjacent infrahyoid muscles", "Vagus, glossopharyngeal nearby", "Common/internal carotid, internal jugular vein", "Protects neurovascular bundle; limits spread of infection", "Stabilizes carotid during neck rotation", "Low mobility", "Minimal sliding — tethered to cervical structures", "Carotid sinus hypersensitivity; central line placement", "Carotid pulse palpable lateral to trachea", "Post-radiation fibrosis encasing sheath", "Autonomic symptoms with carotid tightness", "Blunt carotid injury (BCVI) in trauma", "Avoid aggressive carotid triangle massage in vascular disease", "Gentle cervical rotation only when medically cleared", "Rotation AROM with monitoring for dizziness", "BCVI screening protocols in high-energy trauma rehab", "AHA guidelines for blunt cerebrovascular injury screening"),
    ("FAS-UE-005", "Clavipectoral Fascia", "Shoulder", "Deep fascia in deltopectoral groove", "Moderate", "Continuous with axillary sheath; pierced by cephalic vein and thoracoacromial vessels", "Clavicle, coracoid, axillary fascia", "Deltopectoral interval", "Cephalic vein, thoracoacromial trunk", "Pectoralis major, deltoid deep surface", "Lateral pectoral nerve", "Cephalic vein, thoracoacromial artery", "Suspends axillary contents; resists inferior shoulder girdle displacement", "Transfers pectoralis force toward humerus", "Moderate with shoulder flexion/abduction", "Deltoid glides over pectoralis in flexion", "Deltopectoral approach landmark; TOS region", "Palpable groove between deltoid and pec major", "Post-surgical scarring after shoulder approach", "Limited flexion with interval adhesions", "Pectoralis strain with fascial tearing", "Cross-friction and soft tissue mobilization to interval", "Pec minor/deltoid doorway stretch", "Shoulder flexion and horizontal abduction AROM", "Post-arthroscopy deltopectoral interval mobilization", "Clinical soft tissue mobilization literature"),
    ("FAS-UE-006", "Deltoid Fascia", "Shoulder", "Deep fascia investing deltoid", "Thin over muscle belly", "Continuous with arm fascia and pectoral fascia", "Acromion, clavicle, spine of scapula, deltoid tuberosity", "Shoulder superficial compartment", "Deltoid muscle", "Deltoid", "Axillary nerve terminal branches", "Thoracoacromial deltoid branch", "Envelops deltoid force transmission to humerus", "Multi-directional shoulder force distribution", "High with shoulder ROM", "Slides over humerus during abduction", "Deltoid strain and shoulder impingement context", "Palpable over deltoid with contraction", "Post-injection fibrosis nodules", "Painful arc with fascial restriction", "Deltoid contusion in contact sports", "Myofascial release over deltoid fibers", "Cross-body and overhead deltoid stretch", "Scaption and abduction isometrics", "Return to overhead sport after deltoid strain", "EMG-guided deltoid rehab protocols"),
    ("FAS-UE-007", "Supraspinous Fascia", "Shoulder/scapula", "Thick fascia over supraspinatus fossa", "Thick", "Attached to scapular spine margins", "Scapular spine, acromion continuity", "Supraspinatus compartment", "Supraspinatus muscle and bursa region", "Supraspinatus, trapezius inferior to spine", "Suprascapular nerve (supraspinatus fossa)", "Suprascapular artery", "Rotator cuff force transmission to scapula", "Links scapular elevation to humeral abduction", "Moderate with scapular motion", "Supraspinatus tendon glides beneath acromion", "Rotator cuff impingement and supraspinatus pathology", "Palpable tenderness over supraspinatus fossa", "Calcific tendinopathy associated thickening", "Painful abduction arc", "Supraspinatus tear and tendinopathy", "Posterior shoulder soft tissue mobilization", "Sleeper stretch for posterior capsule/fascia", "Scapular stabilization with external rotation", "Rotator cuff progressive loading (Neer/Jobe protocols)", "Strong evidence for rotator cuff exercise therapy"),
    ("FAS-UE-008", "Infraspinous Fascia", "Shoulder/scapula", "Thick fascia over infraspinatus fossa", "Thick", "Attached to scapular spine and axillary border", "Scapular spine, teres major/minor border", "Infraspinatus compartment", "Infraspinatus, teres minor", "Infraspinatus, teres minor", "Suprascapular nerve (after spinoglenoid notch)", "Suprascapular and circumflex scapular vessels", "Posterior rotator cuff stabilization force", "External rotation force transmission", "Moderate", "Infraspinatus glides during ER", "Posterior impingement and ER weakness", "Tenderness over infraspinous fossa", "Post-surgical posterior shoulder adhesions", "ER loss with posterior shoulder pain", "Infraspinatus strain in throwers", "Posterior glenohumeral mobilization", "Sleeper stretch; cross-body stretch", "Side-lying external rotation", "Thrower's interval program posterior cuff focus", "Jobe/Kuhn thrower's ten program evidence"),
    ("FAS-UE-009", "Brachial Fascia", "Arm", "Deep fascia sleeve of arm", "Moderate", "Continuous with antebrachial fascia and axillary sheath", "Medial/lateral epicondyles, olecranon, axillary fascia", "Arm anterior and posterior compartments", "Brachial artery/veins, median/ulnar/radial nerves in places", "Biceps, brachialis, triceps, coracobrachialis", "Median, ulnar, musculocutaneous nerves", "Brachial artery and venae comitantes", "Compartment boundary limiting muscle bulge", "Longitudinal tension transfer during elbow flexion/extension", "Moderate with elbow motion", "Muscles glide within fascial sleeve", "Compartment syndrome boundary; lymphatic flow", "Palpable tightness with flexion contracture", "Post-fracture arm fascial thickening", "Elbow flexion contracture", "Compartment syndrome (rare arm)", "Fascial stretching with elbow AROM", "Biceps/triceps stretching", "Elbow flexion/extension AROM", "Post-humerus fracture mobility progression", "Compartment syndrome clinical monitoring protocols"),
    ("FAS-UE-010", "Medial Intermuscular Septum", "Arm", "Transverse septum arm", "Thin to moderate", "From medial humeral lip to brachial fascia", "Medial epicondyle region, medial humeral intermuscular ridge", "Medial (flexor) arm compartment boundary", "Flexor compartment vessels and nerves", "Flexor compartment muscles", "Ulnar nerve (posterior to septum at elbow)", "Superior ulnar collateral artery region", "Separates flexor and extensor compartments", "Directs flexor force along humerus", "Low independent mobility", "Minimal sliding", "Cubital tunnel and flexor compartment syndrome", "Medial arm tenderness with nerve entrapment", "Post-traumatic septum thickening", "Elbow flexion loss with medial arm pain", "Flexor compartment strain", "Neural mobilization for ulnar nerve", "Flexor stretching with nerve glides", "Nerve gliding exercises", "Cubital tunnel conservative management", "Novak cubital tunnel treatment guidelines"),
    ("FAS-UE-011", "Lateral Intermuscular Septum", "Arm", "Transverse septum arm", "Thin to moderate", "From lateral humeral lip to brachial fascia", "Lateral epicondyle, deltoid tuberosity region", "Posterior/extensor boundary with anterior compartment", "Radial nerve in spiral groove region", "Triceps, brachialis, mobile wad origins", "Radial nerve", "Profunda brachii artery", "Separates anterior and posterior compartments", "Extensor/triceps force guidance", "Low", "Minimal", "Radial nerve palsy with humerus fracture", "Lateral arm tenderness post fracture", "Humeral shaft fracture hematoma", "Wrist drop with nerve injury", "Triceps/brachialis strain", "Radial nerve gliding", "Wrist extensor stretching", "Radial nerve tensioner/tolerance", "Humeral shaft fracture nerve recovery rehab", "Shao radial nerve palsy rehab protocols"),
    ("FAS-UE-012", "Antebrachial Fascia", "Forearm", "Deep fascia of forearm", "Moderate", "Continuous with brachial fascia and retinacula", "Olecranon, lateral epicondyle, styloid processes, palmar/dorsal hand fascia", "Flexor and extensor compartments (mobile wad)", "Forearm muscles, neurovascular bundles", "All forearm muscles", "Median, ulnar, radial nerves", "Radial/ulnar arteries, interosseous vessels", "Compartment envelope; retinacular anchor", "Grip and wrist force transmission to elbow", "High with wrist/pronation-supination", "Tendons glide under retinacula", "Compartment syndrome; De Quervain; intersection syndrome", "Palpable tightness with tenosynovitis", "Chronic tendinopathy thickening", "Wrist/forearm pain with gripping", "Forearm compartment syndrome", "Transverse friction massage to tendons", "Wrist flexor/extensor stretching", "Tendon gliding; nerve glides", "Carpal tunnel and tendinopathy protocols", "Strong evidence for tendon gliding in CTS"),
    ("FAS-UE-013", "Extensor Retinaculum", "Wrist — dorsal", "Fibrous band over wrist extensors", "Thick transverse band", "Spans wrist dorsum from radius to ulna/styloid", "Radius/ulna styloids, hand fascia", "Six extensor compartments", "Extensor tendons and synovial sheaths", "Extensor compartment muscles", "Sensory branches radial/ulnar", "Dorsal carpal branch radial artery", "Prevents bowstringing of extensors", "Wrist extension force concentration", "Low — tendons glide beneath", "Tendon excursion 2–4 cm with wrist motion", "De Quervain (1st compartment); extensor tenosynovitis", "Tenderness over compartments with resisted extension", "Stenosing tenosynovitis thickening", "Painful wrist extension/grip", "ECU subsheath tear in athletes", "Retinacular soft tissue mobilization", "Wrist extensor stretches; Tyler twist for lateral epicondyle", "Eccentric wrist extension", "De Quervain splinting and loading", "Cochrane review supports splinting and injection for De Quervain"),
    ("FAS-UE-014", "Flexor Retinaculum", "Wrist — volar", "Transverse carpal ligament", "Thick (~2–4 mm)", "Carpal arch to pisiform/hook hamate", "Scaphoid/triquetrum pillars, pisiform, hook hamate", "Carpal tunnel", "Median nerve, flexor tendons FDS/FPL", "Thenar/hypothenar origins", "Median nerve, ulnar nerve (Guyon's canal separate)", "Ulnar artery (Guyon's), palmar arches", "Maintains flexor mechanical advantage", "Grip force transmission through carpal arch", "Low — tendons glide in tunnel", "Tendon gliding beneath TCL", "Carpal tunnel syndrome primary structure", "Tinel over carpal tunnel", "Post-release scarring; pillar pain", "Night paresthesia, thenar weakness", "CTS from repetitive grip", "Median nerve gliding; TCL soft tissue", "Wrist flexor stretching; prayer stretch", "Tendon and nerve gliding programs", "CTS post-surgical nerve glide progression", "AAOS CTS clinical practice guideline"),
    ("FAS-UE-015", "Palmar Fascia", "Hand — palm", "Palmar aponeurosis", "Thick central triangle", "Continuous with flexor retinaculum and digital fascia", "Thenar/hypothenar fascia, skin, MCP joints", "Central palm and digital rays", "Flexor tendons, lumbricals, neurovascular bundles", "Thenar/hypothenar, lumbricals", "Digital nerves and arteries", "Palmar arches", "Grip force distribution; skin anchoring", "Longitudinal grip force to forearm", "Moderate with grip", "Skin-fascia glide for power grip", "Dupuytren contracture", "Nodules and cords palpable in palm", "Dupuytren cord thickening", "MCP/PIP flexion contracture", "Dupuytren disease", "Skin and fascial mobilization pre/post surgery", "Digit extension stretching", "Intrinsic strengthening", "Dupuytren post-fasciectomy therapy", "Dupuytren society rehab guidelines"),
    ("FAS-UE-016", "Thenar Fascia", "Hand — thumb", "Fascia over thenar eminence", "Moderate", "From flexor retinaculum to thumb MCP", "First metacarpal, thumb rays", "Thenar compartment", "Thenar muscles, thumb tendons", "Abductor pollicis brevis, opponens, FPB", "Median nerve motor branch", "Superficial palmar branch radial artery", "Thumb opposition and grip stability", "Pinch force transmission", "High with thumb motion", "Thenar glide during opposition", "Thenar weakness in CTS and CMC arthritis", "Thenar eminence palpation with APB test", "Post-op scarring after CMC surgery", "Opposition loss", "Skier's thumb; CMC sprain", "Thenar soft tissue mobilization", "Thumb opposition stretches", "Opposition and abduction strengthening", "CMC arthritis thumb stabilization program", "Eaton CMC arthritis staging and rehab"),
    ("FAS-UE-017", "Hypothenar Fascia", "Hand — ulnar", "Fascia over hypothenar eminence", "Moderate", "From flexor retinaculum/pisiform to 5th ray", "Pisiform, hook hamate, 5th metacarpal", "Hypothenar compartment", "Hypothenar muscles, ulnar nerve/artery", "Abductor digiti minimi, flexor digiti minimi, opponens digiti minimi", "Ulnar nerve deep branch nearby", "Ulnar artery in Guyon's canal", "Power grip ulnar border stability", "Ulnar grip force transmission", "Moderate", "Hypothenar glide with grip", "Guyon's canal syndrome; hook hamate fracture", "Tenderness over pisiform/hook hamate", "Post-fracture fibrosis", "Ulnar-sided wrist pain with grip", "Hypothenar hammer syndrome", "Pisiform mobilization when appropriate", "Wrist ulnar deviation stretch", "Hypothenar strengthening", "Guyon's canal decompression rehab", "Clinical Guyon's canal management consensus"),
    ("FAS-UE-018", "Digital Fascia", "Fingers", "Fibrous flexor sheaths and lateral digital fascia", "Thin over dorsum; thick volar sheath", "Continuous with palmar aponeurosis and extensor hood", "MCP, PIP, DIP pulleys (A1–A5, C1–C3)", "Digital compartments", "Flexor tendons, neurovascular bundles, extensor mechanism", "Lumbricals, interossei, flexors", "Digital nerves", "Proper digital arteries", "Pulley system for flexor mechanical advantage", "Precision and power grip force to hand", "High tendon excursion", "Tendon gliding within pulleys (2–3 cm FDP)", "Trigger finger; pulley injury in climbers", "Tenderness at A1 pulley with triggering", "Trigger finger nodule at A1", "Locking digit with pain", "Pulley rupture (A2/A4) in climbing", "Tendon gliding; pulley soft tissue care", "Tendon gliding exercises grades I–IV", "Blocking exercises for flexion", "Trigger finger post-release and conservative", "Wrist/hand tendon gliding evidence (Cannon)"),
]
FASCIA: list[tuple[str, dict[str, Any]]] = [_fascia_from_row(r) for r in FASCIA_ROWS]

# ---------------------------------------------------------------------------
# 4. Biomechanics Movements (54)
# ---------------------------------------------------------------------------

def _movement_from_row(row: tuple) -> tuple[str, dict[str, Any]]:
    padded = list(row) + ["Not specified for this grip pattern"] * 24
    (mid, name, joint, region, plane, axis, primary, secondary, stabilizers,
     normal_rom, functional_rom, open_desc, closed_desc, arthro, osteo, clinical,
     assessment, treatment, sport, injuries, pain, dysfunc, comp, exercise) = padded[:24]
    return _mb(
        mid, name, joint, region, plane, axis, primary, secondary, stabilizers,
        normal_rom, functional_rom, open_desc, closed_desc, arthro, osteo, clinical,
        assessment, treatment, sport, injuries, pain, dysfunc, comp, exercise,
    )

MOVEMENT_ROWS: list[tuple] = [
    ("MOV-UE-001", "Cervical Flexion", "Cervical spine", "Cervical", "Sagittal", "Mediolateral", "Longus colli, longus capitis, sternocleidomastoid", "Scalenes, platysma", "Deep cervical flexors; upper cervical extensors eccentrically", "0–45° total (varies by level)", "20–30° for reading and device use", "Chin tuck with head moving forward in space", "Quadruped neck neutral with scapular load", "Inferior facet slides posterior-superior; anterior vertebral bodies approximate", "Head translates anterior; chin moves toward sternum", "Neck pain with prolonged flexion posture; whiplash screening", "Active ROM, CCFT, postural assessment", "Deep neck flexor training before stretching", "Swimming starts, wrestling takedown posture", "Whiplash, disc herniation aggravation", "Suboccipital and upper trapezius referral", "Deep flexor inhibition; upper crossed syndrome", "Cervical protraction compensating for thoracic kyphosis", "Craniocervical flexion progression → seated postural re-education"),
    ("MOV-UE-002", "Cervical Extension", "Cervical spine", "Cervical", "Sagittal", "Mediolateral", "Semispinalis capitis/cervicis, splenius, upper trapezius", "Levator scapulae, erector spinae", "Deep cervical extensors; anterior neck flexors eccentrically", "0–55° total", "15–25° for overhead visual tasks", "Head extends in open chain from neutral", "Prone extension with thoracic support", "Facet joints approximate; spinous processes separate", "Head moves posterior-superior", "Extension-intolerant neck pain; stenosis caution", "Extension ROM, Spurling if indicated", "Limit end-range extension in stenosis", "Gymnastics, dance, overhead sport visual tracking", "Facet syndrome, stenosis", "Suboccipital and interscapular pain", "Extensor dominance; loss of flexor balance", "Thoracic extension substitute for cervical extension", "Isometric extension → controlled AROM with flexor co-contraction"),
    ("MOV-UE-003", "Cervical Rotation", "Cervical spine", "Cervical", "Transverse", "Vertical", "Sternocleidomastoid contralateral, splenius ipsilateral", "Scalenes, levator scapulae", "Deep rotators, upper cervical stabilizers", "0–80° each side (C1–C2 ~50% of motion)", "60–70° for driving mirror checks", "Head rotates in space", "Quadruped rotation with trunk stabilized", "Atlas rotates on axis at C1–C2; lower levels couple with lateral flexion", "Head turns left/right", "Vertebrobasilar insufficiency screening with rotation", "Rotation ROM, vertebral artery symptom monitoring", "Gradual rotation in VBI history", "Tennis serve prep, checking blind spots", "Whiplash, facet pain", "Occipital and trapezius pain", "Rotation loss after whiplash", "Thoracic rotation compensating", "Rotation AROM in pain-free range → combined patterns"),
    ("MOV-UE-004", "Cervical Side Flexion", "Cervical spine", "Cervical", "Frontal", "Anteroposterior", "Scalenes, levator scapulae, upper trapezius", "Sternocleidomastoid, splenius", "Deep cervical stabilizers contralateral", "0–45° each side", "30° for phone holding tasks", "Ear toward shoulder open chain", "Side-lying with head supported", "Uncinate processes guide lateral gliding; ipsilateral facets open", "Head tilts laterally", "Radiculopathy may increase with side flexion toward painful side", "Side flexion ROM, upper limb tension tests if indicated", "Avoid forced side flexion in acute radiculopathy", "Swimming breathing side preference", "Disc herniation, facet irritation", "Trapezius and levator scapulae trigger points", "Upper crossed posture", "Shoulder hiking substitute", "Side flexion AROM → combined with rotation patterns"),
    ("MOV-UE-005", "Shoulder Flexion", "Glenohumeral joint", "Shoulder", "Sagittal", "Mediolateral", "Anterior deltoid, pectoralis major clavicular head", "Coracobrachialis, biceps long head", "Rotator cuff, serratus anterior, lower trapezius", "0–180°", "120–150° for most ADL overhead", "Arm elevates forward in space", "Hand fixed — body moves over hand (push-up top)", "Humeral head rolls and glides inferior-posterior on glenoid with elevation", "Humerus moves anterior-superior in sagittal plane", "Impingement with painful arc; scapular dyskinesis common", "Flexion ROM, painful arc, Neer test", "Scapular stabilization before high flexion loading", "Swimming, volleyball, overhead throw", "Impingement, biceps tendinopathy", "Lateral deltoid and subacromial pain", "Scapular downward rotation with flexion", "Lumbar extension with overhead reach", "Scaption → full flexion with scapular control"),
    ("MOV-UE-006", "Shoulder Extension", "Glenohumeral joint", "Shoulder", "Sagittal", "Mediolateral", "Latissimus dorsi, teres major, posterior deltoid", "Triceps long head, sternal pectoralis", "Rotator cuff posterior, rhomboids", "0–60°", "30–45° for reaching behind back", "Arm moves posterior in space", "Closed chain pulling body forward", "Posterior roll-glide of humeral head", "Humerus moves posterior-inferior", "Posterior shoulder tightness limits extension", "Extension ROM, internal rotation composite", "Posterior capsule mobility for extension", "Rowing pull-through, gymnastics swing", "Posterior impingement in throwers", "Posterior shoulder and scapular pain", "Posterior capsule tightness", "Scapular anterior tilt substitute", "Prone extension → resisted extension with scapular retraction"),
    ("MOV-UE-007", "Shoulder Abduction", "Glenohumeral joint", "Shoulder", "Frontal", "Anteroposterior", "Middle deltoid, supraspinatus", "Trapezius upper, serratus anterior", "Rotator cuff, lower trapezius, serratus", "0–180° with scapulothoracic contribution", "90–120° functional reaching", "Arm elevates laterally", "Weight-bearing on fixed hand", "Humeral head inferior glide with abduction; scapular upward rotation after ~30°", "Humerus moves lateral away from trunk", "Subacromial impingement at 60–120° painful arc", "Abduction ROM, Hawkins/Kennedy", "Rotator cuff and scapular rehab before heavy abduction", "Swimming, lateral raises, volleyball", "Supraspinatus tendinopathy, impingement", "Lateral shoulder pain", "Hitting painful arc; shrugging", "Scapular elevation without upward rotation", "Scaption → abduction with serratus activation"),
    ("MOV-UE-008", "Shoulder Adduction", "Glenohumeral joint", "Shoulder", "Frontal", "Anteroposterior", "Pectoralis major, latissimus dorsi, teres major", "Coracobrachialis, short head biceps", "Rotator cuff, rhomboids", "0–30° across body", "Functional hugging, equipment carry", "Arm moves toward midline", "Closed chain adduction force in bear crawl", "Superior roll-glide with adduction force", "Humerus moves medial toward trunk", "AC joint pain with cross-body adduction", "Horizontal adduction ROM, cross-body test", "AC joint protection in painful cross-body", "Gymnastics iron cross prep, tackling", "AC sprain, pec strain", "AC joint and anterior shoulder pain", "Pec tightness limiting ER", "Scapular protraction substitute", "Isometric adduction → band pull-apart reverse"),
    ("MOV-UE-009", "Shoulder Horizontal Abduction", "Glenohumeral joint", "Shoulder", "Transverse", "Vertical", "Posterior deltoid, infraspinatus, teres minor", "Middle trapezius, rhomboids", "Rotator cuff, scapular retractors", "0–30°", "20° for reaching behind", "Arm moves posterior in horizontal plane", "Reverse fly closed chain against wall", "Posterior glide of humeral head", "Humerus moves posterior horizontal", "Posterior cuff strengthening for balance", "Horizontal abduction strength, ER at 90", "Posterior cuff and scapular retraction focus", "Swimming backstroke, rowing finish", "Posterior impingement", "Posterior shoulder pain", "Rhomboid dominance with winging", "Trunk rotation substitute", "Prone T → reverse fly progression"),
    ("MOV-UE-010", "Shoulder Horizontal Adduction", "Glenohumeral joint", "Shoulder", "Transverse", "Vertical", "Pectoralis major, anterior deltoid", "Coracobrachialis, latissimus", "Serratus anterior, rotator cuff", "0–130°", "90° for push and hug tasks", "Arm crosses body horizontally", "Push-up and bench press closed chain", "Anterior glide with horizontal adduction", "Humerus crosses midline anteriorly", "Pec dominance in bench press", "Horizontal adduction ROM, pec length", "Balance with posterior cuff", "Bench press, push-ups, blocking in football", "Pec strain, AC injury", "Anterior shoulder and pec pain", "Rounded shoulder posture", "Scapular abduction substitute", "Push-up plus → bench press progressive loading"),
    ("MOV-UE-011", "Shoulder Internal Rotation", "Glenohumeral joint", "Shoulder", "Transverse", "Vertical", "Subscapularis, pectoralis major, latissimus dorsi", "Teres major, anterior deltoid", "Rotator cuff posterior eccentrically", "0–70° at 0° abduction; 0–70° at 90° abduction", "60° for behind-back tasks", "Forearm rotates medially with humerus fixed or moving", "Closed chain IR in handstand prep", "Posterior-inferior roll-glide with IR", "Humerus rotates medially", "GIRD in throwers — IR tightness common", "IR ROM side-lying, total arc motion", "Posterior capsule stretch in throwers carefully", "Throwing, tennis serve, swimming", "Subscapularis strain, GIRD", "Posterior shoulder and anterior cuff pain", "Loss of IR after immobilization", "Scapular protraction with IR", "Side-lying IR → sleeper stretch protocol"),
    ("MOV-UE-012", "Shoulder External Rotation", "Glenohumeral joint", "Shoulder", "Transverse", "Vertical", "Infraspinatus, teres minor", "Posterior deltoid, middle trapezius", "Subscapularis eccentrically; scapular stabilizers", "0–90° at 0° abduction; 0–90° at 90° abduction", "70° at 90° abduction for throwers", "Forearm rotates laterally", "Closed chain ER in quadruped", "Anterior-superior roll-glide with ER", "Humerus rotates laterally", "ER weakness linked to impingement and instability", "ER strength at 0° and 90° abduction", "Rotator cuff ER progressive loading", "Throwing, racquet sports, swimming", "Rotator cuff tear, impingement", "Lateral and posterior shoulder pain", "ER weakness with scapular winging", "Abduction substitute for ER", "Side-lying ER → standing ER at 90° abduction"),
    ("MOV-UE-013", "Scaption", "Glenohumeral joint", "Shoulder", "Scapular plane", "Oblique", "Supraspinatus, deltoid middle/anterior", "Trapezius, serratus anterior", "Rotator cuff, lower trapezius", "0–180° in scapular plane (~30° anterior to frontal)", "90–120° functional", "Arm elevates 30° anterior to frontal plane", "Hand-supported scapular plane loading", "Optimal supraspinatus line of pull in scapular plane", "Humerus elevates in plane of scapula", "Preferred plane for impingement-minimized elevation", "Scaption strength and ROM", "Rehab standard for cuff-friendly elevation", "Overhead sport, lifting", "Supraspinatus tendinopathy", "Subacromial pain", "Shrugging during scaption", "Pure frontal plane substitute", "Light dumbbell scaption → progressive load"),
    ("MOV-UE-014", "Scapular Elevation", "Scapulothoracic joint", "Scapula", "Frontal", "Anteroposterior", "Upper trapezius, levator scapulae", "Rhomboids (minor elevation component)", "Serratus anterior lower fibers eccentrically", "0–15°", "10° for shrugging objects", "Scapula moves superior on thorax", "Handstand closed chain elevation", "Scapula rotates upward slightly with elevation", "Scapula translates superiorly", "Upper trapezius dominance in neck pain", "Scapular elevation observation, SHR test", "Lower trapezius/serratus balance", "Weightlifting shrugs, climbing", "Upper trapezius strain", "Neck and upper trapezius pain", "Elevated resting scapula posture", "Cervical side flexion substitute", "Scapular setting → shrug with lower trap activation"),
    ("MOV-UE-015", "Scapular Depression", "Scapulothoracic joint", "Scapula", "Frontal", "Anteroposterior", "Lower trapezius, pectoralis minor (eccentric)", "Latissimus dorsi, serratus anterior", "Rhomboids; upper trapezius eccentrically", "0–10°", "5° for reaching down", "Scapula moves inferior on thorax", "Supported dip position", "Inferior glide of scapula on thoracic wall", "Scapula translates inferiorly", "Depression important for upward rotation rhythm", "Scapular depression strength", "Serratus and lower trap co-activation", "Dips, swimming, pull-ups", "Long thoracic nerve injury", "Lower trapezius region pain", "Scapular winging with depression weakness", "Shoulder elevation substitute", "Scapular depression in wall slide → dip progression"),
    ("MOV-UE-016", "Scapular Upward Rotation", "Scapulothoracic joint", "Scapula", "Frontal", "Anteroposterior", "Serratus anterior, upper and lower trapezius", "Pectoralis minor (stabilizer)", "Rotator cuff; force couple UT/LT/SA", "0–60° upward rotation with arm elevation", "45° for overhead reach", "Scapula rotates glenoid superiorly", "Push-up plus, handstand", "Posterior tilt often couples with upward rotation", "Inferior angle moves lateral and superior", "Serratus weakness causes winging and impingement", "Scapular dyskinesis assessment, wall slide", "Serratus punch, push-up plus", "Overhead throwing, swimming", "Scapular dyskinesis, impingement", "Periscapular pain", "Winging; premature shrugging", "GH elevation without scapular rotation", "Serratus punch → Y raise → overhead loading"),
    ("MOV-UE-017", "Scapular Downward Rotation", "Scapulothoracic joint", "Scapula", "Frontal", "Anteroposterior", "Rhomboids, levator scapulae, pectoralis minor", "Latissimus dorsi", "Middle trapezius", "Returns from upward rotation", "Functional lowering from overhead", "Scapula rotates glenoid inferiorly", "Controlled lowering in pull-up eccentric", "Anterior tilt may couple", "Superior scapula moves medial-inferior", "Overactive downward rotators in neck pain", "Observation during lowering phase", "Balance with upward rotators", "Pull-ups, lat pulldown", "Rhomboid spasm", "Interscapular and neck pain", "Downward rotation dominance", "Excessive cervical extension", "Eccentric serratus/low trap → rhomboid flexibility"),
    ("MOV-UE-018", "Scapular Protraction", "Scapulothoracic joint", "Scapula", "Transverse", "Vertical", "Serratus anterior", "Pectoralis major/minor", "Lower trapezius; rhomboids eccentrically", "0–25°", "15° for reaching forward", "Scapula moves anterior around thorax", "Push-up protraction phase", "Scapula wraps anterior on curved thorax", "Scapula translates anteriorly", "Serratus weakness in long thoracic nerve palsy", "Push-up plus, serratus wall slide", "Serratus anterior strengthening", "Punching, push-ups, swimming", "Scapular winging", "Periscapular and anterior chest pain", "Winging with protraction weakness", "Shoulder rolling forward substitute", "Serratus punch → push-up plus → bear crawl"),
    ("MOV-UE-019", "Scapular Retraction", "Scapulothoracic joint", "Scapula", "Transverse", "Vertical", "Rhomboids, middle trapezius", "Latissimus dorsi, posterior deltoid", "Serratus anterior eccentrically", "0–25°", "15° for rowing finish", "Scapula moves posterior toward spine", "Rowing closed chain retraction", "Scapula adducts on thorax", "Scapula translates posteriorly", "Over-retraction in military posture", "Row test, scapular retraction endurance", "Balance retraction with serratus", "Rowing, climbing, swimming backstroke", "Rhomboid strain", "Interscapular pain", "Rounded shoulders with weak retraction", "Cervical extension with retraction", "Band row → face pull → heavy row"),
    ("MOV-UE-020", "Scapular Anterior Tilt", "Scapulothoracic joint", "Scapula", "Sagittal", "Mediolateral", "Pectoralis minor, serratus anterior", "Latissimus dorsi", "Lower trapezius eccentrically", "Variable coupling with elevation", "Functional in push and reach", "Coracoid tilts inferior-anterior", "Scapula tips anterior", "Anterior tilt increases subacromial space in some positions", "Observation in wall angel", "Pec minor length, serratus control", "Push-ups, bench press", "Pec minor syndrome", "Anterior shoulder pain", "Excessive anterior tilt in desk posture", "Thoracic flexion substitute", "Pec minor stretch → serratus activation in protraction"),
    ("MOV-UE-021", "Scapular Posterior Tilt", "Scapulothoracic joint", "Scapula", "Sagittal", "Mediolateral", "Lower trapezius, serratus anterior", "Rhomboids", "Upper trapezius", "Couples with upward rotation", "Overhead sport mechanics", "Coracoid moves superior-posterior", "Scapula tips posterior", "Posterior tilt reduces impingement in elevation", "Wall slide with posterior tilt cue", "Lower trap and serratus training", "Overhead throwing, serving", "Impingement", "Subacromial pain", "Loss of posterior tilt in elevation", "Lumbar hyperextension substitute", "Wall slides → Y raises with posterior tilt emphasis"),
    ("MOV-UE-022", "Scapular Internal Rotation", "Scapulothoracic joint", "Scapula", "Transverse", "Vertical", "Pectoralis minor, rhomboids", "Levator scapulae", "Serratus anterior", "Medial border prominence variable", "Postural assessment", "Glenoid rotates medial", "Scapula rotates around vertical axis medially", "Associated with rounded shoulder posture", "Resting scapular posture", "Pec minor and rhomboid balance", "Desk work posture", "Scapular dyskinesis", "Anterior chest and interscapular pain", "Medial border prominence", "Shoulder protraction substitute", "Postural re-education → scapular control drills"),
    ("MOV-UE-023", "Scapular External Rotation", "Scapulothoracic joint", "Scapula", "Transverse", "Vertical", "Serratus anterior, lower trapezius", "Middle trapezius", "Rhomboids eccentrically", "Couples with upward rotation", "Overhead athletes", "Glenoid rotates lateral", "Scapula rotates around vertical axis laterally", "Important for overhead athlete scapular mechanics", "Scapular control assessment", "Serratus/low trap emphasis", "Swimming, volleyball", "Scapular dyskinesis", "Periscapular fatigue", "Difficulty maintaining ER in overhead hold", "Compensatory GH elevation", "Serratus wall slides → overhead holds"),
    ("MOV-UE-024", "Elbow Flexion", "Elbow joint", "Elbow", "Sagittal", "Mediolateral", "Biceps brachii, brachialis, brachioradialis", "Pronator teres (weak flexor)", "Anconeus eccentrically; capsule", "0–140° (individual variation)", "120–130° for feeding and grooming", "Hand moves toward shoulder", "Pull-up, chin-up closed chain", "Olecranon moves away from humerus; anterior capsule distends", "Forearm approximates humerus anteriorly", "Flexion contracture after fracture/immobilization", "Elbow flexion ROM goniometry", "Progressive flexion after fracture protocol", "Weightlifting curls, climbing", "Distal biceps rupture, flexion contracture", "Anterior elbow and biceps pain", "Flexion loss post immobilization", "Shoulder elevation substitute", "Active flexion → resisted flexion progression"),
    ("MOV-UE-025", "Elbow Extension", "Elbow joint", "Elbow", "Sagittal", "Mediolateral", "Triceps brachii", "Anconeus", "Biceps eccentrically; capsule", "0° to 5° hyperextension common", "0° for push-off tasks", "Forearm moves away from humerus", "Push-up, bench press lockout", "Olecranon locks into olecranon fossa", "Forearm moves posterior away from humerus", "Olecranon bursitis with repetitive extension", "Extension ROM, triceps strength", "Triceps progressive loading", "Throwing, push-ups, pressing", "Triceps tendinopathy, olecranon bursitis", "Posterior elbow pain", "Extension lag after triceps injury", "Shoulder internal rotation substitute", "Triceps isometrics → extension against gravity"),
    ("MOV-UE-026", "Forearm Pronation", "Proximal/distal radioulnar joints", "Forearm", "Transverse", "Longitudinal", "Pronator teres, pronator quadratus", "Flexor carpi radialis, palmaris longus", "Interosseous membrane; joint capsules", "0–80°", "70° for typing and tool use", "Forearm rotates palm down open chain", "Weight-bearing pronation in push-up", "Radius crosses over ulna at proximal and distal RU joints", "Palm rotates posterior/inferior", "Pronation loss after fracture (Essex-Lopresti)", "Pronation/supination ROM", "Pronator strengthening after fracture", "Tennis forehand, screwdriver use", "Pronator teres syndrome, fracture", "Volar forearm pain", "Pronation stiffness post cast", "Shoulder internal rotation substitute", "Pronation AROM → resisted pronation"),
    ("MOV-UE-027", "Forearm Supination", "Proximal/distal radioulnar joints", "Forearm", "Transverse", "Longitudinal", "Biceps brachii, supinator", "Brachioradialis (from pronated)", "Interosseous membrane", "0–80°", "70° for supinated carry (palms up)", "Forearm rotates palm up", "Closed chain supination in chin-up", "Radius parallels ulna; supinator and biceps rotate radius", "Palm rotates anterior/superior", "Supination weakness after radial head injury", "Pronation/supination ROM, supination strength", "Supinator and biceps rehab", "Supinated curl, racquet backhand", "Radial head fracture, PIN palsy", "Lateral elbow and forearm pain", "Supination loss post immobilization", "External rotation substitute", "Supination AROM → hammer rotation exercises"),
    ("MOV-UE-028", "Wrist Flexion", "Wrist joint", "Wrist", "Sagittal", "Mediolateral", "Flexor carpi radialis, flexor carpi ulnaris, flexor digitorum superficialis", "Palmaris longus", "Extensors eccentrically; wrist capsule", "0–80°", "60° for grip and typing", "Hand moves toward volar forearm", "Weight-bearing wrist flexion in gymnastics", "Proximal carpal row glides posterior on radius/ulna", "Hand moves palmar toward forearm", "Flexor tendinopathy in climbers and typists", "Wrist flexion ROM, Phalen if indicated", "Eccentric flexor loading for tendinopathy", "Golf, climbing, keyboard use", "Carpal tunnel, flexor tendinopathy", "Volar wrist and forearm pain", "Flexion loss after fracture", "Finger flexion without wrist flexion", "Wrist flexion AROM → eccentric flexor exercises"),
    ("MOV-UE-029", "Wrist Extension", "Wrist joint", "Wrist", "Sagittal", "Mediolateral", "Extensor carpi radialis longus/brevis, extensor carpi ulnaris", "Extensor digitorum", "Flexors eccentrically; wrist capsule", "0–70°", "50° for push-off and typing", "Hand moves toward dorsal forearm", "Push-up wrist extension load", "Proximal row glides anterior on radius", "Hand moves dorsal toward forearm", "Extensor tendinopathy in racquet sports", "Extension ROM, resisted extension test", "Eccentric wrist extension for lateral epicondyle", "Tennis, typing, push-ups", "Intersection syndrome, lateral epicondylalgia", "Dorsal wrist and lateral elbow pain", "Extension weakness post fracture", "Metacarpophalangeal extension substitute", "Wrist extension AROM → Tyler twist progression"),
    ("MOV-UE-030", "Wrist Radial Deviation", "Wrist joint", "Wrist", "Frontal", "Anteroposterior", "Extensor carpi radialis longus/brevis, flexor carpi radialis", "Abductor pollicis longus", "FCU eccentrically", "0–20°", "15° for hammering radially", "Hand moves toward thumb/radius", "Closed chain radial bias in punch", "Scaphoid translates on radius", "Hand moves toward radius", "De Quervain aggravated by radial deviation", "Radial/ulnar deviation ROM", "FCR/ECRL balance training", "Hammering, racquet sports", "De Quervain tenosynovitis", "Radial wrist and thumb base pain", "Radial deviation pain in CTS", "Shoulder abduction substitute", "Radial deviation AROM → resisted deviation"),
    ("MOV-UE-031", "Wrist Ulnar Deviation", "Wrist joint", "Wrist", "Frontal", "Anteroposterior", "Extensor carpi ulnaris, flexor carpi ulnaris", "Flexor digitorum", "ECRL eccentrically", "0–30°", "25° for power grip ulnar bias", "Hand moves toward ulna/pinky side", "Golf swing ulnar deviation load", "Triquetrum moves on ulna", "Hand moves toward ulna", "ECU tendinopathy in golfers and tennis players", "Ulnar deviation ROM, ECU testing", "ECU stabilization for ulnar-sided wrist pain", "Golf, tennis, lifting", "ECU subsheath tear, TFCC injury", "Ulnar wrist pain", "Ulnar deviation weakness", "Elbow valgus substitute", "Ulnar deviation AROM → ECU isometrics"),
    ("MOV-UE-032", "Wrist Circumduction", "Wrist joint", "Wrist", "Multiple", "Multiple", "Combined wrist flexors and extensors", "Intrinsic stabilizers", "Forearm pronators/supinators", "Composite motion", "Functional circular wrist motion", "Wrist traces cone shape", "Closed chain circular loading rare", "Sequential carpal glides in multiple planes", "Hand traces circle at wrist", "Assesses global wrist mobility", "Composite wrist ROM observation", "Multi-planar wrist mobility drills", "Dance, gymnastics wrist circles", "Global wrist stiffness post cast", "Diffuse wrist pain", "Compensatory forearm rotation", "Elbow circumduction substitute", "Slow circles → resisted multi-planar ball control"),
    ("MOV-UE-033", "Dart Thrower's Motion", "Wrist/midcarpal", "Wrist", "Oblique", "Oblique", "ECRB, FCR, midcarpal stabilizers", "Extrinsic flexors/extensors", "Intrinsic ligaments", "Extension-radial to flexion-ulnar arc ~30° each component", "Throwing and hammering arc", "Wrist moves extension-radial to flexion-ulnar", "Functional closed chain in throwing", "Midcarpal joint primary driver (~60% of motion)", "Hand follows oblique dart-throw arc", "Critical for functional wrist athletic motion", "Dart thrower ER test for SL ligament", "Midcarpal stability rehab", "Baseball throw, hammering", "Scapholunate injury, midcarpal instability", "Dorsal radial wrist pain", "Loss of smooth dart arc", "Planar flexion/extension only", "Dart thrower motion AROM → weighted ball drills"),
    ("MOV-UE-034", "MCP Flexion", "Metacarpophalangeal joints", "Fingers", "Sagittal", "Mediolateral", "Flexor digitorum superficialis/profundus, lumbricals, interossei", "Palmar interossei", "Extensor hood eccentrically; collateral ligaments", "0–90°", "70° for power grip", "Fingers flex at knuckles open chain", "Hook grip closed chain", "Metacarpal head rolls and glides palmarly", "Proximal phalanx flexes toward palm", "MCP flexion essential for grip strength", "MCP ROM, grip strength", "Intrinsic plus/minus exercises", "Rock climbing, weightlifting", "MCP sprain, capsulitis", "Palmar MCP pain", "MCP extension contracture (claw hand)", "IP flexion without MCP flexion", "MCP flexion AROM → grip strengthening"),
    ("MOV-UE-035", "MCP Extension", "Metacarpophalangeal joints", "Fingers", "Sagittal", "Mediolateral", "Extensor digitorum, lumbricals, interossei via extensor hood", "Extensor indicis/proprius", "Flexors eccentrically; sagittal bands", "0–30° hyperextension variable", "20° for hand flat on table", "Fingers extend at knuckles", "Open hand push-up MCP extension load", "Metacarpal head glides dorsally", "Proximal phalanx extends", "MCP extension lag in claw deformity", "MCP extension observation, intrinsic tests", "Intrinsic muscle rehab", "Handstand, finger locks climbing", "Sagittal band rupture, MCP dislocation", "Dorsal MCP pain", "Intrinsic weakness", "Wrist extension substitute", "MCP extension AROM → rubber band extensions"),
    ("MOV-UE-036", "PIP Flexion", "Proximal interphalangeal joints", "Fingers", "Sagittal", "Mediolateral", "Flexor digitorum superficialis (FDS)", "Flexor digitorum profundus (limited at PIP)", "Lateral bands; collateral ligaments", "0–110°", "90° for fine grip", "Middle joint flexes open chain", "Crimp grip climbing", "Condylar roll-glide palmar", "Middle phalanx flexes", "PIP stiffness common after fracture", "PIP ROM, tenodesis effect", "Tendon gliding for PIP stiffness", "Climbing crimp, guitar", "PIP fracture, boutonniere", "Lateral PIP pain", "PIP flexion contracture", "DIP flexion substitute in isolation", "Tendon gliding → blocking exercises PIP"),
    ("MOV-UE-037", "PIP Extension", "Proximal interphalangeal joints", "Fingers", "Sagittal", "Mediolateral", "Central slip of extensor mechanism", "Lumbricals/interossei via lateral bands", "FDS eccentrically; collateral ligaments", "0° to 5° hyperextension", "0° for finger straight", "Middle joint extends", "Open chain extension against gravity", "Dorsal glide of middle phalanx", "Middle phalanx extends", "Boutonniere deformity — central slip injury", "PIP extension lag, Elson test", "Central slip protection and rehab", "Basketball finger, volleyball", "Boutonniere, PIP dislocation", "Dorsal PIP pain", "Extension lag", "MCP hyperextension substitute (swan neck)", "Static extension splint → active extension"),
    ("MOV-UE-038", "DIP Flexion", "Distal interphalangeal joints", "Fingers", "Sagittal", "Mediolateral", "Flexor digitorum profundus (FDP)", "None significant", "Oblique retinacular ligament", "0–90°", "60° for tip pinch grip", "Distal joint flexes", "Tip pinch closed chain", "Distal condylar roll-glide palmar", "Distal phalanx flexes", "FDP laceration — loss DIP flexion zone II", "DIP flexion isolation (hold PIP)", "FDP tendon repair protocol", "Rock climbing, guitar plucking", "Mallet finger (extensor), FDP avulsion (jersey finger)", "Volae and DIP pain", "DIP flexion loss after jersey finger", "Composite fist without isolated DIP", "Isolated DIP flexion → block exercises"),
    ("MOV-UE-039", "DIP Extension", "Distal interphalangeal joints", "Fingers", "Sagittal", "Mediolateral", "Terminal tendon of extensor mechanism", "Lumbricals/interossei indirect", "FDP eccentrically", "0° to 5° hyperextension", "0° for nail bed protection", "Distal joint extends", "Mallet splint extension", "Terminal tendon extends DIP", "Distal phalanx extends", "Mallet finger — terminal extensor rupture", "Extension lag at DIP, mallet test", "Mallet splint 6–8 weeks full-time", "Ball sports tip injuries", "Mallet finger, DIP fracture", "Dorsal DIP pain", "Extension lag (mallet deformity)", "Hyperextension at PIP substitute", "Stack splint → active extension when healed"),
    ("MOV-UE-040", "Thumb Opposition", "Carpometacarpal joint (saddle)", "Thumb", "Multi-planar", "Oblique", "Opponens pollicis, abductor pollicis brevis, flexor pollicis brevis", "Adductor pollicis", "First dorsal interosseous; CMC ligaments", "Wide arc — tip to each finger pad", "Tip-to-tip and tip-to-base pinch", "Thumb CMC pronates and flexes with abduction", "Thumb moves across palm to digit", "Opposition critical for precision grip", "Opposition test, Kapandji score", "Thenar strengthening progression", "Opposition for writing, pinching", "CMC arthritis, median nerve palsy", "Thenar and thumb base pain", "Opposition loss in CTS/advanced CMC", "Lateral pinch substitute", "Opposition AROM → pinch progression"),
    ("MOV-UE-041", "Thumb Reposition", "Carpometacarpal joint", "Thumb", "Multi-planar", "Oblique", "Extensor pollicis brevis, abductor pollicis longus", "Extensor pollicis longus", "Thenar muscles; CMC ligaments", "Returns from opposition to anatomical position", "Release from pinch", "Reverse CMC motion from opposition", "Thumb returns from palm to radial abduction", "Controlled reposition prevents CMC irritation", "Observation after opposition tasks", "EPL/EPB strengthening", "Releasing tool grip", "De Quervain, CMC strain", "Radial wrist pain with reposition", "Painful reposition in De Quervain", "Forced reposition pain", "EPL strengthening → controlled reposition drills"),
    ("MOV-UE-042", "Thumb Flexion", "CMC, MCP, IP joints", "Thumb", "Sagittal", "Mediolateral", "Flexor pollicis brevis, flexor pollicis longus", "Opponens pollicis", "Extensors eccentrically", "CMC ~15°, MCP ~50°, IP ~80°", "Composite flexion for grip", "Thumb flexes across joints open chain", "Hook grip thumb flexion", "Multi-joint sequential flexion", "Thumb moves into palm", "FPL tenosynovitis in texting/gaming", "Thumb flexion ROM, FPL test", "FPL tendon gliding", "Climbing, gaming, gripping", "Trigger thumb, FPL rupture", "Volar thumb and wrist pain", "Trigger thumb locking", "CMC collapse substitute", "Thumb flexion AROM → resisted flexion"),
    ("MOV-UE-043", "Thumb Extension", "CMC, MCP, IP joints", "Thumb", "Sagittal", "Mediolateral", "Extensor pollicis longus, extensor pollicis brevis", "Abductor pollicis longus", "Flexors eccentrically", "CMC ~60° extension/abduction component", "Extension for release and typing", "Thumb extends open chain", "Open hand position", "EPL drives IP extension strongly", "Thumb moves away from palm radially", "EPL rupture in RA — loss active extension", "Thumb extension lag, EPL test", "EPL protection and strengthening", "Typing, open hand sports", "EPL rupture, EPB tenosynovitis (De Quervain)", "Dorsal thumb and radial wrist pain", "Extension weakness", "MCP hyperextension substitute", "Thumb extension AROM → EPL strengthening"),
    ("MOV-UE-044", "Thumb Abduction", "Carpometacarpal joint", "Thumb", "Frontal", "Anteroposterior", "Abductor pollicis longus, abductor pollicis brevis", "Extensor pollicis brevis", "Adductor pollicis eccentrically", "0–50° palmar abduction; 45° radial abduction", "40° for wide grip", "Thumb moves away from index metacarpal", "Wide grip object hold", "CMC abduction in saddle joint", "Thumb moves perpendicular from palm", "First web space contracture limits abduction", "First web space ROM", "Web space stretching and APB/APL strength", "Opening jars, ball grip", "First web space contracture, CMC arthritis", "First web space pain", "Adduction contracture (thumb-in-palm)", "CMC flexion substitute", "Web space stretch → abduction strengthening"),
    ("MOV-UE-045", "Thumb Adduction", "Carpometacarpal joint", "Thumb", "Frontal", "Anteroposterior", "Adductor pollicis", "First dorsal interosseous", "Abductors eccentrically", "Returns thumb to index side", "Key pinch force", "CMC adduction with flexion component", "Thumb moves toward index", "Adductor strength for key pinch", "Key pinch strength test", "Adductor pollicis strengthening", "Key pinch, tool grip", "Adductor strain, CMC instability", "Thenar eminence pain", "Weak key pinch in ulnar palsy", "Flexor substitute pinch", "Key pinch isometrics → dynamic pinch"),
    ("MOV-UE-046", "Power Grip", "Hand composite", "Hand/grip", "Multi-planar", "Multiple", "Flexor digitorum profundus/superficialis, flexor pollicis longus", "Interossei, lumbricals, thenar/hypothenar", "Wrist extensors stabilize; intrinsic stabilize arches", "Full composite finger flexion with wrist ~30° extension", "Max force grip tasks", "All digits flex around object with wrist extension", "Isometric grip on object", "Carpometacarpal and MCP joints stabilize against flexion force", "Hand closes maximally on object", "Grip strength assessment in hand pathology", "Dynamometer grip test", "Progressive grip strengthening", "Weightlifting, climbing, manual labor", "Flexor tendinopathy, epicondylalgia", "Forearm and hand fatigue pain", "Weak grip post fracture", "Excessive wrist flexion during grip", "Isometric grip → dynamometer progressive loading"),
    ("MOV-UE-047", "Hook Grip", "Hand composite", "Hand/grip", "Sagittal", "Mediolateral", "Flexor digitorum profundus, flexor digitorum superficialis", "Lumbricals (MCP extended position)", "Extensors maintain MCP extension", "PIP/DIP flexion with MCP extended ~0–30°", "Carrying bags, pull-up hook", "Fingers flex at IP joints with extended MCPs", "Pull-up bar hook grip", "MCP extended — collateral ligaments tight", "Fingers form hook without thumb opposition", "Climbing and lifting carry technique", "Hook grip strength observation", "FDP strengthening in MCP extension", "Climbing, deadlift hook grip", "Pulley injury climbing, flexor strain", "Volar finger and pulley pain", "Inability to maintain hook in climbers", "Full fist grip substitute", "Hook grip hangs → progressive load"),
    ("MOV-UE-048", "Cylindrical Grip", "Hand composite", "Hand/grip", "Multi-planar", "Multiple", "Flexor digitorum, FPL, interossei", "Thenar/hypothenar", "Wrist extensors", "Composite around cylinder diameter", "Holding bottles, hammer handles", "Digits wrap around cylinder", "Carrying cylindrical object", "MCP and IP flexion adapt to cylinder diameter", "Hand encircles cylinder", "Common functional grip pattern", "Cylinder grip test various diameters", "Grip training multiple diameters", "Hammer, tennis racquet, bottles", "Epicondylalgia with repetitive cylindrical grip", "Forearm and hand pain", "Grip size intolerance post injury", "Tip pinch substitute for small objects", "Progressive cylinder diameters → functional carry"),
    ("MOV-UE-049", "Spherical Grip", "Hand composite", "Hand/grip", "Multi-planar", "Multiple", "Flexor digitorum, thenar/hypothenar, interossei", "Lumbricals", "Wrist stabilizers", "Adaptive to sphere size", "Holding balls, doorknobs", "Digits conform to spherical shape", "Ball catch and hold", "Multi-joint adaptive flexion", "Hand molds to sphere", "Ball sports and rehabilitation standard", "Spherical object grip test", "Ball grip progressive sizes", "Basketball, therapy ball exercises", "Metacarpal fracture, finger sprain", "Palm and finger pain", "Fear of gripping post fracture", "Flat palm substitute", "Soft ball grip → sport-specific ball drills"),
    ("MOV-UE-050", "Precision Grip", "Hand composite", "Hand/grip", "Multi-planar", "Multiple", "Flexor pollicis longus, flexor digitorum profundus index", "Opponens pollicis, APB", "Interossei stabilize", "Tip-to-tip precision", "Writing, tweezers, small object manipulation", "Thumb opposes fingertip with IP flexion", "Precision pinch on small object", "Fine motor control at fingertips", "Thumb and finger tips oppose", "Essential for fine motor ADL", "Tip pinch strength, Jebsen-Taylor test", "Precision pinch training", "Surgery, electronics, writing", "Median/ulnar nerve palsy", "Thenar and fingertip pain", "Weak tip pinch in nerve palsy", "Lateral pinch substitute", "Pegboard → tip pinch loading"),
    ("MOV-UE-051", "Lateral Pinch", "Hand composite", "Hand/grip", "Frontal", "Anteroposterior", "Adductor pollicis, flexor pollicis longus", "First dorsal interosseous", "Thenar stabilizers", "Key pinch between thumb pad and lateral index middle phalanx", "Key and tool lateral pinch", "Thumb adducts against radial side index", "Lateral key pinch on object", "Stable key pinch for tool use", "Key pinch force measurement", "Key pinch isometrics → functional tool use", "Key use, scissors, pliers", "CMC arthritis, adductor strain", "Thumb base and index radial pain", "Weak lateral pinch in ulnar palsy", "Tip pinch substitute", "Key pinch trainer → functional tools"),
    ("MOV-UE-052", "Tip Pinch", "Hand composite", "Hand/grip", "Multi-planar", "Multiple", "FPL, FDP index, opponens pollicis", "APB, interossei", "MCP stabilizers", "Thumb tip to fingertip", "Pick up small objects", "Opposition with IP flexion both digits", "Tip pinch on bead or coin", "Highest precision demand", "Tip pinch dynamometry", "Fine motor pinch progression", "Coin picking, sewing", "Median nerve palsy", "Fingertip pain", "Cannot oppose in advanced CTS", "Tripod substitute", "Smallest object pinch → graded resistance"),
    ("MOV-UE-053", "Tripod Pinch", "Hand composite", "Hand/grip", "Multi-planar", "Multiple", "FPL, FDP index/middle, opponens pollicis", "APB, lumbricals", "Interossei", "Thumb opposes index and middle tips simultaneously", "Writing tripod, chopstick grip", "Three-point precision grip", "Pen hold, chopstick control", "Standard pen grip pattern", "Tripod pinch observation", "Pen grip retraining", "Writing, chopsticks, tweezers", "Writer's cramp, thumb CMC pain", "Thenar and index pain with writing", "Poor tripod in pediatric motor delay", "Lateral pinch writing substitute", "Tripod pinch beads → writing practice"),
    ("MOV-UE-054", "Lumbrical Grip", "Hand composite", "Hand/grip", "Multi-planar", "Multiple", "Lumbricals (extend MCP, flex IP)", "Interossei, flexor digitorum", "Intrinsic arch stabilizers", "MCP extension with IP flexion — intrinsic plus position", "Plate grip, flat hand carry", "Lumbricals flex MCP extensors action at IP via lateral bands", "Flat hand on plate/table", "Intrinsic stability for flat hand tasks", "Intrinsic plus/minus tests", "Lumbrical blocking exercises", "Carrying plate, keyboard hand flat", "Intrinsic muscle paralysis", "Palm and MCP pain", "Claw deformity without lumbricals", "Hook grip substitute", "Intrinsic plus exercises → flat hand weight bearing"),
]
MOVEMENTS: list[tuple[str, dict[str, Any]]] = [_movement_from_row(r) for r in MOVEMENT_ROWS]

# ---------------------------------------------------------------------------
# 5. EMG Exercises (12)
# ---------------------------------------------------------------------------

EMG_RECORDS: list[tuple[str, dict[str, Any]]] = [
    _emg('Face Pull', **{
        "ID": 'EMG-UE-001', "Primary Muscle": 'Middle trapezius', "Secondary Muscles": 'Posterior deltoid, infraspinatus, rhomboids',
        "EMG %": '60–80% MVIC upper trapezius/middle trapezius ratio favoring mid trap', "Study": 'Cools et al. scapular muscle EMG review', "Population": 'Healthy adults', "Resistance": 'Band or cable at face height',
        "Equipment": 'Cable machine, resistance band', "Movement Speed": 'Controlled 2-1-2 tempo', "Reliability": 'Moderate ICC for surface EMG',
        "Evidence Level": 'Level B', "ref_topic": 'Cools scapular rehabilitation EMG',
    }),
    _emg('Push-Up Plus', **{
        "ID": 'EMG-UE-002', "Primary Muscle": 'Serratus anterior', "Secondary Muscles": 'Pectoralis major, lower trapezius',
        "EMG %": '80–100% MVIC serratus at top plus phase', "Study": 'Decker et al. push-up plus EMG', "Population": 'Healthy adults', "Resistance": 'Bodyweight to weighted',
        "Equipment": 'Floor, parallettes', "Movement Speed": 'Controlled plus at top', "Reliability": 'Good reliability surface EMG',
        "Evidence Level": 'Level B', "ref_topic": 'Decker serratus push-up plus',
    }),
    _emg('External Rotation at 0°', **{
        "ID": 'EMG-UE-003', "Primary Muscle": 'Infraspinatus', "Secondary Muscles": 'Teres minor, posterior deltoid',
        "EMG %": '40–60% MVIC infraspinatus dominant', "Study": 'Reinold et al. rotator cuff EMG', "Population": 'Healthy adults', "Resistance": 'Band or dumbbell at side',
        "Equipment": 'Resistance band, dumbbell', "Movement Speed": 'Slow controlled', "Reliability": 'Moderate reliability',
        "Evidence Level": 'Level B', "ref_topic": 'Reinold cuff EMG study',
    }),
    _emg('External Rotation at 90°', **{
        "ID": 'EMG-UE-004', "Primary Muscle": 'Infraspinatus', "Secondary Muscles": 'Teres minor, supraspinatus',
        "EMG %": '70–90% MVIC infraspinatus/teres minor', "Study": 'Reinold et al. side-lying ER 90 abduction', "Population": 'Healthy adults', "Resistance": 'Light dumbbell or band',
        "Equipment": 'Bench, dumbbell', "Movement Speed": 'Controlled arc', "Reliability": 'Moderate reliability',
        "Evidence Level": 'Level B', "ref_topic": 'Reinold ER 90 abduction',
    }),
    _emg('Serratus Punch', **{
        "ID": 'EMG-UE-005', "Primary Muscle": 'Serratus anterior', "Secondary Muscles": 'Pectoralis major, lower trapezius',
        "EMG %": '75–95% MVIC serratus', "Study": 'Hardwick et al. serratus exercises', "Population": 'Healthy adults', "Resistance": 'Band punch forward',
        "Equipment": 'Resistance band', "Movement Speed": 'Punch and protract', "Reliability": 'Good reliability',
        "Evidence Level": 'Level B', "ref_topic": 'Hardwick serratus punch',
    }),
    _emg('Scaption', **{
        "ID": 'EMG-UE-006', "Primary Muscle": 'Supraspinatus', "Secondary Muscles": 'Middle deltoid, upper trapezius',
        "EMG %": '50–70% MVIC supraspinatus in scapular plane', "Study": 'Reinold scapular plane elevation', "Population": 'Healthy adults', "Resistance": 'Light dumbbells 30° plane',
        "Equipment": 'Dumbbells', "Movement Speed": 'Controlled elevation', "Reliability": 'Moderate reliability',
        "Evidence Level": 'Level B', "ref_topic": 'Reinold scaption EMG',
    }),
    _emg('Y Raise', **{
        "ID": 'EMG-UE-007', "Primary Muscle": 'Lower trapezius', "Secondary Muscles": 'Serratus anterior, middle trapezius',
        "EMG %": '70–90% MVIC lower trapezius', "Study": 'Escamilla et al. shoulder EMG', "Population": 'Healthy adults', "Resistance": 'Light plate or dumbbells',
        "Equipment": 'Incline bench optional', "Movement Speed": 'Thumbs up Y pattern', "Reliability": 'Moderate reliability',
        "Evidence Level": 'Level B', "ref_topic": 'Escamilla lower trap exercises',
    }),
    _emg('T Raise', **{
        "ID": 'EMG-UE-008', "Primary Muscle": 'Middle trapezius', "Secondary Muscles": 'Rhomboids, posterior deltoid',
        "EMG %": '60–80% MVIC middle trapezius', "Study": 'Escamilla shoulder EMG', "Population": 'Healthy adults', "Resistance": 'Light dumbbells prone or bent',
        "Equipment": 'Bench, dumbbells', "Movement Speed": 'Controlled T raise', "Reliability": 'Moderate reliability',
        "Evidence Level": 'Level B', "ref_topic": 'Escamilla T raise EMG',
    }),
    _emg('Row', **{
        "ID": 'EMG-UE-009', "Primary Muscle": 'Middle trapezius', "Secondary Muscles": 'Rhomboids, latissimus dorsi, posterior deltoid',
        "EMG %": '60–80% MVIC mid trap/rhomboid', "Study": 'Lehman et al. rowing EMG', "Population": 'Healthy adults', "Resistance": 'Band, cable, barbell',
        "Equipment": 'Cable, barbell, band', "Movement Speed": 'Controlled pull', "Reliability": 'Good reliability',
        "Evidence Level": 'Level B', "ref_topic": 'Lehman rowing muscle activation',
    }),
    _emg('Bench Press', **{
        "ID": 'EMG-UE-010', "Primary Muscle": 'Pectoralis major', "Secondary Muscles": 'Anterior deltoid, triceps',
        "EMG %": '80–100% MVIC pec major at moderate loads', "Study": 'Barnett EMG bench press', "Population": 'Trained adults', "Resistance": 'Moderate to heavy load',
        "Equipment": 'Barbell, dumbbell', "Movement Speed": 'Controlled press', "Reliability": 'Moderate reliability',
        "Evidence Level": 'Level B', "ref_topic": 'Barnett bench press EMG',
    }),
    _emg('Pull-Up', **{
        "ID": 'EMG-UE-011', "Primary Muscle": 'Latissimus dorsi', "Secondary Muscles": 'Biceps, middle trapezius, rhomboids',
        "EMG %": '80–100% MVIC lats', "Study": 'Snarr pull-up EMG analysis', "Population": 'Trained adults', "Resistance": 'Bodyweight',
        "Equipment": 'Pull-up bar', "Movement Speed": 'Controlled pull', "Reliability": 'Moderate reliability',
        "Evidence Level": 'Level B', "ref_topic": 'Snarr pull-up EMG',
    }),
    _emg('Dead Hang', **{
        "ID": 'EMG-UE-012', "Primary Muscle": 'Flexor digitorum profundus/superficialis', "Secondary Muscles": 'Brachioradialis, latissimus, shoulder stabilizers',
        "EMG %": 'High forearm flexor activity; moderate cuff', "Study": 'Climbing hang EMG studies', "Population": 'Climbers and healthy adults', "Resistance": 'Bodyweight',
        "Equipment": 'Pull-up bar', "Movement Speed": 'Static hang', "Reliability": 'Variable reliability',
        "Evidence Level": 'Level C', "ref_topic": 'Climbing hang forearm EMG',
    }),
]

# ---------------------------------------------------------------------------
# 6. Force Couples (4)
# ---------------------------------------------------------------------------

FORCE_COUPLES: list[tuple[str, dict[str, Any]]] = [
    _fc('Scapular Upward Rotation Force Couple', **{
        "ID": 'FC-UE-001', "Movement": 'Scapular upward rotation / arm elevation', "Muscle 1": 'Upper trapezius', "Muscle 2": 'Lower trapezius',
        "Muscle 3": 'Serratus anterior', "Biomechanical Role": 'UT rotates upward; LT and SA rotate glenoid superiorly and protract — balanced upward rotation without excessive elevation', "Clinical Importance": 'Essential for overhead function and impingement prevention',
        "Common Dysfunction": 'Serratus weakness or upper trap dominance → winging and impingement', "Rehabilitation": 'Push-up plus, serratus punch, Y raise, lower/upper trap balance drills', "ref_topic": 'Cools scapular force couple literature',
    }),
    _fc('Glenohumeral Compression Force Couple', **{
        "ID": 'FC-UE-002', "Movement": 'Glenohumeral joint centration', "Muscle 1": 'Subscapularis', "Muscle 2": 'Infraspinatus',
        "Muscle 3": 'Teres minor', "Biomechanical Role": 'Rotator cuff compresses humeral head into glenoid while antagonist pair balances rotation — dynamic stability', "Clinical Importance": 'Critical for shoulder stability in athletes and post-dislocation rehab',
        "Common Dysfunction": 'Cuff imbalance → superior migration and impingement', "Rehabilitation": 'Rotator cuff co-contraction drills, ER/IR at multiple abduction angles, rhythmic stabilization', "ref_topic": 'Neer cuff force couple; Reinold cuff EMG',
    }),
    _fc('Wrist Flexor/Extensor Co-contraction Gripping', **{
        "ID": 'FC-UE-003', "Movement": 'Power grip and wrist stability', "Muscle 1": 'Wrist flexors (FCR, FCU, FDS)', "Muscle 2": 'Wrist extensors (ECRL, ECRB, ECU)',
        "Muscle 3": 'None — bilateral co-contraction', "Biomechanical Role": 'Co-contraction stabilizes wrist in neutral during grip — prevents excessive flexion/extension under load', "Clinical Importance": 'Epicondylalgia often involves grip imbalance; rehab targets balanced co-contraction',
        "Common Dysfunction": 'Overactive flexors or extensors → medial/lateral epicondylalgia', "Rehabilitation": 'Tyler twist, wrist neutral grip training, balanced flexor/extensor eccentric loading', "ref_topic": 'Wrist extensor/flexor co-contraction grip studies',
    }),
    _fc('Finger Extension Force Couple', **{
        "ID": 'FC-UE-004', "Movement": 'Finger extension / intrinsic stabilization', "Muscle 1": 'Dorsal interossei', "Muscle 2": 'Lumbricals',
        "Muscle 3": 'Long extensors (EDC)', "Biomechanical Role": 'Lumbricals extend IP via lateral bands while interossei extend MCP and adduct/abduct — coordinated with EDC', "Clinical Importance": 'Intrinsic weakness → claw deformity and grip dysfunction',
        "Common Dysfunction": 'Ulnar palsy → loss interossei/lumbrical coordination', "Rehabilitation": 'Intrinsic plus/minus exercises, rubber band extensions, pegboard, tendon gliding', "ref_topic": 'Ovalle intrinsic muscle biomechanics',
    }),
]

# ---------------------------------------------------------------------------
# 7. Kinetic Chain (12)
# ---------------------------------------------------------------------------

KINETIC_CHAIN: list[tuple[str, dict[str, Any]]] = [
    _kin('Baseball Throw', **{
        "ID": 'KIN-UE-001', "Sport": 'Baseball/softball', "Starting Position": 'Wind-up to ball release',
        "Joint Sequence": 'Ankle → knee → hip → trunk rotation → scapular rotation → GH IR → elbow extension → wrist snap', "Primary Drivers": 'Lower body and trunk', "Energy Transfer": 'Kinetic chain transfers ~50% energy from lower extremity; scapular and GH sequential timing critical',
        "Common Compensation": 'Early trunk opening; excessive elbow valgus; scapular dyskinesis', "Injury Risk": 'UCL injury, labral tears, rotator cuff strain', "Clinical Assessment": 'Throwing analysis, shoulder/elbow exam, total arc motion',
        "Corrective Exercise": 'Serratus/ cuff / hip rotation drills', "Progression": 'Interval throwing program', "Evidence": "ASMI interval throwing; Wilk thrower's ten", "ref_topic": 'Baseball Throw',
    }),
    _kin('Tennis Serve', **{
        "ID": 'KIN-UE-002', "Sport": 'Tennis', "Starting Position": 'Platform or pinpoint stance to racket contact',
        "Joint Sequence": 'Leg drive → trunk hyperextension-rotation → scapular upward rotation → GH abduction/ER → elbow extension → wrist snap', "Primary Drivers": 'Leg drive and trunk rotation', "Energy Transfer": 'Ground reaction force through kinetic chain to racket head speed',
        "Common Compensation": 'Shoulder-only serve; insufficient knee bend; scapular lag', "Injury Risk": 'Rotator cuff tendinopathy, impingement, tennis elbow', "Clinical Assessment": 'Serve video analysis, cuff strength, scapular tests',
        "Corrective Exercise": 'Leg drive drills, scapular strengthening, eccentric wrist extensors', "Progression": 'Progressive serve volume', "Evidence": 'Elliott tennis serve biomechanics', "ref_topic": 'Tennis Serve',
    }),
    _kin('Volleyball Spike', **{
        "ID": 'KIN-UE-003', "Sport": 'Volleyball', "Starting Position": 'Approach to ball contact overhead',
        "Joint Sequence": 'Approach steps → penultimate step → arm swing → trunk rotation → GH elevation → elbow whip → wrist snap', "Primary Drivers": 'Approach and trunk', "Energy Transfer": 'Vertical jump and trunk rotation transfer to hitting arm speed',
        "Common Compensation": 'Single-arm dominance without trunk rotation; poor scapular timing', "Injury Risk": 'Rotator cuff strain, finger sprains', "Clinical Assessment": 'Hitting mechanics review, cuff/scapular assessment',
        "Corrective Exercise": 'Approach footwork, trunk rotation med ball throws', "Progression": 'Progressive hitting reps', "Evidence": 'Coleman volleyball spike biomechanics', "ref_topic": 'Volleyball Spike',
    }),
    _kin('Swimming Freestyle', **{
        "ID": 'KIN-UE-004', "Sport": 'Swimming', "Starting Position": 'Streamline push-off to pull-through',
        "Joint Sequence": 'Kick → trunk rotation → catch → pull → recovery with scapular upward rotation', "Primary Drivers": 'Trunk rotation and lat pull', "Energy Transfer": 'Continuous chain linking kick, rotation, and pull; high repetition stress',
        "Common Compensation": 'Dropped elbow catch; excessive internal rotation; inadequate body roll', "Injury Risk": "Swimmer's shoulder, impingement", "Clinical Assessment": 'Stroke analysis, cuff endurance, scapular dyskinesis',
        "Corrective Exercise": 'Band rotator work, scapular drills, technique correction', "Progression": 'Progressive yardage', "Evidence": "Tovin swimmer's shoulder rehab", "ref_topic": 'Swimming Freestyle',
    }),
    _kin('Push-Up', **{
        "ID": 'KIN-UE-005', "Sport": 'Calisthenics/strength', "Starting Position": 'Plank position to bottom and return',
        "Joint Sequence": 'Wrist → elbow → GH horizontal adduction → scapular protraction at top', "Primary Drivers": 'Pectoralis and serratus', "Energy Transfer": 'Closed chain force from hands through trunk; serratus protraction at plus phase',
        "Common Compensation": 'Scapular winging; excessive cervical extension; elbow flare', "Injury Risk": 'Wrist pain, anterior shoulder strain', "Clinical Assessment": 'Push-up form, scapular control, wrist mobility',
        "Corrective Exercise": 'Incline push-up plus progression', "Progression": 'Floor to weighted push-up', "Evidence": 'Calatayud push-up EMG progression', "ref_topic": 'Push-Up',
    }),
    _kin('Pull-Up', **{
        "ID": 'KIN-UE-006', "Sport": 'Calisthenics/strength', "Starting Position": 'Dead hang to chin over bar',
        "Joint Sequence": 'Shoulder extension/adduction → elbow flexion → scapular depression/retraction', "Primary Drivers": 'Latissimus dorsi', "Energy Transfer": 'Closed chain vertical pull; scapular initiation before elbow flexion',
        "Common Compensation": 'Shrugging without scapular depression; kipping compensation', "Injury Risk": 'Elbow tendinopathy, shoulder impingement', "Clinical Assessment": 'Scapular pull, hang tolerance, grip strength',
        "Corrective Exercise": 'Scapular pulls, eccentric lowering', "Progression": 'Band-assisted to full pull-up', "Evidence": 'Snarr pull-up activation', "ref_topic": 'Pull-Up',
    }),
    _kin('Bench Press', **{
        "ID": 'KIN-UE-007', "Sport": 'Strength training', "Starting Position": 'Supine on bench, bar lower to chest, press',
        "Joint Sequence": 'GH horizontal adduction → elbow extension; scapular retraction maintained', "Primary Drivers": 'Pectoralis major', "Energy Transfer": 'Bar path over shoulders; leg drive stabilizes trunk',
        "Common Compensation": 'Excessive shoulder protraction loss; bench without scapular retraction', "Injury Risk": 'Pec strain, anterior shoulder pain', "Clinical Assessment": 'Bar path, scapular position, cuff balance',
        "Corrective Exercise": 'Retracted scapular bench technique drills', "Progression": 'Progressive load', "Evidence": 'Green bench press scapular position', "ref_topic": 'Bench Press',
    }),
    _kin('Overhead Press', **{
        "ID": 'KIN-UE-008', "Sport": 'Strength training', "Starting Position": 'Rack to overhead lockout',
        "Joint Sequence": 'Legs/trunk stability → scapular upward rotation → GH flexion/abduction → elbow extension', "Primary Drivers": 'Deltoid and triceps', "Energy Transfer": 'Vertical force through stable core; full scapular upward rotation required',
        "Common Compensation": 'Lumbar hyperextension; incomplete scapular rotation', "Injury Risk": 'Impingement, lower back strain', "Clinical Assessment": 'Overhead mobility, scapular assessment, core stability',
        "Corrective Exercise": 'Landmine press progression to full overhead', "Progression": 'Barbell/dumbbell progressive load', "Evidence": 'Saeterbakken overhead press EMG', "ref_topic": 'Overhead Press',
    }),
    _kin('Handstand', **{
        "ID": 'KIN-UE-009', "Sport": 'Gymnastics/calisthenics', "Starting Position": 'Kick-up or press to inverted support',
        "Joint Sequence": 'Wrist → elbow → GH flexion → scapular elevation/upward rotation → core', "Primary Drivers": 'Wrist extensors and shoulder stabilizers', "Energy Transfer": 'Closed chain vertical load through arms to trunk; cuff co-contraction critical',
        "Common Compensation": 'Excessive arch; inadequate shoulder flexion; wrist collapse', "Injury Risk": 'Wrist pain, shoulder impingement', "Clinical Assessment": 'Wall handstand hold, wrist prep, cuff endurance',
        "Corrective Exercise": 'Wall walks, shoulder taps', "Progression": 'Freestanding progression', "Evidence": 'Gymnastics handstand conditioning', "ref_topic": 'Handstand',
    }),
    _kin('Rock Climbing', **{
        "ID": 'KIN-UE-010', "Sport": 'Climbing', "Starting Position": 'Route start to sequence of reaches and pulls',
        "Joint Sequence": 'Fingers → wrist → elbow → GH → scapular → trunk → lower body foot drive', "Primary Drivers": 'Finger flexors and lats', "Energy Transfer": 'Alternating closed chain upper and lower body; high finger demand',
        "Common Compensation": 'Arm-only climbing; elbow hyperextension; shoulder elevation', "Injury Risk": 'Pulley injury, A2/A4 rupture, shoulder impingement', "Clinical Assessment": 'Climbing movement screen, finger strength, scapular control',
        "Corrective Exercise": 'Footwork drills, scapular pulls, fingerboard progressive', "Progression": 'Grade progression', "Evidence": 'Michailov climbing injury prevention', "ref_topic": 'Rock Climbing',
    }),
    _kin('Rowing', **{
        "ID": 'KIN-UE-011', "Sport": 'Rowing sport', "Starting Position": 'Catch to drive to finish to recovery',
        "Joint Sequence": 'Leg drive → trunk swing → arm pull with scapular retraction', "Primary Drivers": 'Quadriceps then lats and scapular retractors', "Energy Transfer": 'Leg-trunk-arm sequence; arms only finish',
        "Common Compensation": 'Excessive arm pull early; rounded upper back', "Injury Risk": 'Low back pain, rib stress, wrist extensor strain', "Clinical Assessment": 'Erg technique analysis, hip hinge, scapular endurance',
        "Corrective Exercise": 'Leg drive drills, band rows', "Progression": 'Stroke rate/volume progression', "Evidence": 'Hosea rowing biomechanics', "ref_topic": 'Rowing',
    }),
    _kin('Golf Swing', **{
        "ID": 'KIN-UE-012', "Sport": 'Golf', "Starting Position": 'Address to backswing to downswing to follow-through',
        "Joint Sequence": 'Hip rotation → trunk rotation → GH adduction/IR downswing → wrist release', "Primary Drivers": 'Hip and trunk rotators', "Energy Transfer": 'Ground reaction torque through chain to club head speed',
        "Common Compensation": 'Early upper body; reverse spine angle; lead arm excessive across body', "Injury Risk": "Golfer's elbow, lead wrist injury, low back pain", "Clinical Assessment": 'Swing analysis, hip mobility, scapular control',
        "Corrective Exercise": 'Hip rotation med ball, wrist neutral grip', "Progression": 'Progressive driving range volume', "Evidence": 'Myers golf kinetic chain research', "ref_topic": 'Golf Swing',
    }),
]

TOC_SECTIONS = [
    'Disclaimer',
    '1. Blood Supply — Arteries',
    '2. Veins',
    '3. Fascia',
    '4. Biomechanics Movements',
    '5. EMG Exercises',
    '6. Force Couples',
    '7. Kinetic Chain',
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
        title="Kinora Upper Extremity — Vascular, Fascia & Biomechanics (Part 2)",
        author="Kinora AI Training",
    )
    styles = build_styles()
    story: list = []

    story.append(Spacer(1, 1.5 * inch))
    story.append(Paragraph("Kinora Upper Extremity — Vascular, Fascia &amp; Biomechanics (Part 2)", styles["title"]))
    story.append(Spacer(1, 0.3 * inch))
    story.append(Paragraph("Structured reference for RAG / AI-assisted physiotherapy consultation", styles["subtitle"]))
    story.append(Spacer(1, 0.2 * inch))
    story.append(Paragraph("Part 2: Vascular Supply, Fascial Anatomy &amp; Upper Extremity Biomechanics", styles["subtitle"]))
    story.append(Spacer(1, 0.5 * inch))
    story.append(Paragraph("Version 1.0 — Kinora Admin Conocimientos Upload", styles["subtitle"]))
    story.append(PageBreak())

    add_section(story, styles, "Disclaimer")
    story.append(Paragraph(
        "This document is an educational orientation resource for Kinora AI clinical consultation support. "
        "It is NOT a substitute for professional clinical judgment, direct patient examination, or "
        "licensed medical/physiotherapy care. Content reflects established vascular anatomy, fascial "
        "science, and sports biomechanics concepts but must be verified against current peer-reviewed "
        "literature, local protocols, and individual patient presentation. Always screen for vascular "
        "and neurologic red flags requiring urgent medical referral.",
        styles["disclaimer"],
    ))
    story.append(Spacer(1, 12))

    add_section(story, styles, "Table of Contents")
    for item in TOC_SECTIONS:
        story.append(Paragraph(f"• {esc(item)}", styles["toc"]))
    story.append(PageBreak())

    sections_data = [
        ("1. Blood Supply — Arteries", ARTERIES),
        ("2. Veins", VEINS),
        ("3. Fascia", FASCIA),
        ("4. Biomechanics Movements", MOVEMENTS),
        ("5. EMG Exercises", EMG_RECORDS),
        ("6. Force Couples", FORCE_COUPLES),
        ("7. Kinetic Chain", KINETIC_CHAIN),
    ]
    for section_title, records in sections_data:
        add_section(story, styles, section_title)
        story.append(Spacer(1, 6))
        for name, fields in records:
            add_record(story, styles, name, fields)
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
    except Exception as exc:
        print(f"Note: could not determine page count: {exc}")


if __name__ == "__main__":
    main()