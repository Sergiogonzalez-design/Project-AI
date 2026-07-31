/**
 * Generates: 50 Most Difficult Injuries to Detect — Clinical Research Brief
 * Run: node docs/generate-difficult-injuries-pdf.mjs
 */
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "50-most-difficult-injuries-to-detect.pdf");

/** @typedef {{ id: number, title: string, category: string, actual: string, whyTricky: string, mimics: string, steps: string[], redFlags?: string[], imaging?: string }} Injury */

/** @type {Injury[]} */
const INJURIES = [
  {
    id: 1,
    title: "C7 Radiculopathy Mimicking Lateral Epicondylitis",
    category: "Referred / neurologic",
    actual:
      "Compression or irritation of the C7 nerve root (often C6–C7 disc), producing lateral elbow pain, middle-finger sensory change, and triceps/wrist-extensor weakness.",
    whyTricky:
      "Pain localizes to the lateral elbow and worsens with gripping—exactly like tennis elbow. Patients and clinicians focus on the tendon and miss the neck.",
    mimics: "Lateral epicondylitis / common extensor tendinopathy",
    steps: [
      "Ask about neck pain, stiffness, or symptoms that change with cervical rotation/extension.",
      "Map sensory symptoms: middle finger (C7) vs purely local epicondyle pain.",
      "Test triceps strength and reflex; compare wrist/finger extension endurance.",
      "Palpate the epicondyle: pure epicondylitis is exquisitely tender on the bone; radiculopathy often is not.",
      "Perform cervical screening (active ROM, Spurling-type compression if safe) before treating as isolated tennis elbow.",
      "If neurologic signs dominate, prioritize cervical work-up and specialist referral over local elbow injections alone.",
    ],
    redFlags: ["Progressive weakness", "Bilateral symptoms", "Gait change (myelopathy overlap)"],
    imaging: "Cervical MRI if persistent neurologic deficit or failed conservative care; elbow imaging only if local tendon signs dominate.",
  },
  {
    id: 2,
    title: "Hip Osteoarthritis Referred to the Knee",
    category: "Referred pain",
    actual:
      "Coxarthrosis (hip OA) referring pain along the obturator/femoral sensory pathways so the patient reports “knee pain” while the joint of origin is the hip.",
    whyTricky:
      "Many patients never mention the hip. Knee X-rays may be normal, so care stays stuck on the wrong joint.",
    mimics: "Meniscal injury, patellofemoral pain, local knee OA",
    steps: [
      "Always screen the hip when knee pain is atypical or imaging is normal.",
      "Ask about limp, difficulty putting on socks/shoes, and groin or buttock pain.",
      "Examine hip internal rotation in flexion—marked limitation/pain is a classic clue.",
      "Compare knee exam: if the knee is quiet but gait and hip ROM are abnormal, re-rank the hip first.",
      "Obtain hip radiographs (AP pelvis + lateral) when suspicion is moderate–high.",
    ],
    imaging: "Hip X-ray; MRI if AVN or soft-tissue differential remains.",
  },
  {
    id: 3,
    title: "Femoral Neck Stress Fracture",
    category: "Occult bone injury",
    actual:
      "Fatigue or insufficiency fracture of the femoral neck, common in runners and endurance athletes, or in low bone density.",
    whyTricky:
      "Early pain feels like a “groin strain” or iliopsoas tendinitis. Initial X-rays are often normal.",
    mimics: "Iliopsoas tendinopathy, adductor strain, hip flexor overuse",
    steps: [
      "Red-flag history: progressive groin pain in a runner, night pain, pain with impact that is escalating.",
      "Single-leg hop/hop test often impossible or severely painful—do not force if high suspicion.",
      "Log-roll and gentle IR/ER often provoke deep pain.",
      "Never treat as “psoas tendinitis” if night pain + inability to hop + progressive running pain.",
      "Urgent imaging pathway: MRI (preferred) or bone scan if MRI unavailable; protect weight-bearing pending results.",
    ],
    redFlags: ["Night pain", "Inability to hop", "Rapid progression", "Female athlete triad / RED-S risk"],
    imaging: "MRI gold standard early; X-ray may be falsely reassuring.",
  },
  {
    id: 4,
    title: "Avascular Necrosis of the Femoral Head",
    category: "Occult bone / vascular",
    actual:
      "Osteonecrosis of the femoral head from interrupted blood supply (steroids, alcohol, trauma, idiopathic), progressing to collapse if missed.",
    whyTricky:
      "Presents as deep hip pain without trauma and preserved strength, so it is labeled “tendinopathy” or “bursitis.”",
    mimics: "Hip flexor/adductor tendinopathy, GTPS, early OA",
    steps: [
      "Ask about corticosteroid use, alcohol excess, sickle cell disease, prior hip trauma.",
      "Deep groin pain + night pain + painful restricted internal rotation with relatively preserved strength.",
      "Do not stop at soft-tissue diagnosis if risk factors or night pain exist.",
      "Order MRI early (more sensitive than X-ray in early stages).",
      "Urgent orthopedic referral once confirmed or strongly suspected.",
    ],
    imaging: "MRI; X-ray later stages (crescent sign, collapse).",
  },
  {
    id: 5,
    title: "Radial Tunnel Syndrome",
    category: "Peripheral nerve",
    actual:
      "Compression of the posterior interosseous / radial nerve in the radial tunnel (arcade of Frohse region), causing lateral forearm/elbow pain.",
    whyTricky:
      "Overlaps almost perfectly with tennis elbow territory, but tenderness is distal to the epicondyle and local epicondyle care fails.",
    mimics: "Lateral epicondylitis",
    steps: [
      "Palpate: maximal tenderness ~3–5 cm distal to the lateral epicondyle, not on the epicondyle itself.",
      "Pain with resisted middle-finger extension and/or resisted supination with elbow extended.",
      "Look for weak finger/wrist extension endurance without clear epicondyle tenderness.",
      "If “tennis elbow” fails standard care, reclassify as radial tunnel / PIN spectrum.",
      "Neurophysiologic studies may be normal—diagnosis is often clinical.",
    ],
  },
  {
    id: 6,
    title: "Posterior Interosseous Nerve (PIN) Syndrome",
    category: "Peripheral nerve",
    actual:
      "Motor neuropathy of the PIN causing inability to extend the fingers/thumb, often with little pain and normal sensation.",
    whyTricky:
      "Absence of pain and preserved sensation make clinicians look for tendon rupture or “non-organic” weakness.",
    mimics: "Extensor tendon rupture, C7 radiculopathy, stroke (rarely)",
    steps: [
      "Key triad: little/no pain + finger extension paralysis + normal sensation.",
      "Wrist may show radial deviation on extension (ECU spared pattern).",
      "Distinguish from tendon rupture by tenodesis effect and palpation of tendon continuity.",
      "Screen cervical roots and CNS signs to exclude central causes.",
      "Urgent hand/ortho referral; imaging/EMG as indicated.",
    ],
    redFlags: ["Acute complete finger-drop", "Progressive motor loss"],
  },
  {
    id: 7,
    title: "Thoracic Outlet Syndrome (TOS)",
    category: "Neurovascular",
    actual:
      "Compression of the brachial plexus and/or subclavian vessels at the thoracic outlet (scalenes, costoclavicular space, pectoralis minor).",
    whyTricky:
      "Shoulder pain leads to a rotator-cuff pathway; vascular and positional clues are overlooked.",
    mimics: "Rotator cuff tendinopathy, cervical radiculopathy, adhesive capsulitis",
    steps: [
      "Ask about whole-arm paresthesias, backpack/overhead aggravation, cold hand, color change, swelling.",
      "Reproduce symptoms with arms elevated / Roos-type endurance and postural assessment.",
      "Compare cuff testing: if cuff strength is near normal but neurovascular symptoms dominate, raise TOS.",
      "Rule out cervical radiculopathy and true cuff tear in parallel.",
      "Refer to specialist experienced in TOS; duplex/EMG selectively.",
    ],
    redFlags: ["Acute arterial ischemia", "Significant venous swelling (effort thrombosis)"],
  },
  {
    id: 8,
    title: "SLAP Lesion (Superior Labrum)",
    category: "Intra-articular shoulder",
    actual:
      "Tear of the superior labrum anterior–posterior, often in throwers/overhead athletes, involving the biceps anchor.",
    whyTricky:
      "Deep pain and clicks are blamed on the rotator cuff; strength often remains nearly normal.",
    mimics: "Rotator cuff tendinopathy, biceps tendinopathy, internal impingement",
    steps: [
      "Sport history: throwing, overhead, peel-back mechanism.",
      "Deep click/catch/lock with near-normal rotator cuff strength.",
      "Combine history with provocative labral tests; interpret cautiously (no single test is definitive).",
      "If conservative care for “cuff” fails in a thrower with mechanical symptoms, image for labrum.",
      "MR arthrogram often preferred over standard MRI for SLAP.",
    ],
    imaging: "MR arthrogram; correlate surgically only when clinically indicated.",
  },
  {
    id: 9,
    title: "Occult Scaphoid Fracture",
    category: "Occult bone injury",
    actual:
      "Fracture of the scaphoid after FOOSH; initial radiographs frequently miss it because of delayed visibility.",
    whyTricky:
      "Labeled “wrist sprain.” Missed fractures risk nonunion and AVN of the proximal pole.",
    mimics: "Wrist sprain, De Quervain (without trauma history)",
    steps: [
      "Any FOOSH + snuffbox tenderness = scaphoid until proven otherwise.",
      "Add axial thumb load pain and scaphoid tubercle tenderness.",
      "If X-ray negative but clinical suspicion high: immobilize in thumb spica and re-image or MRI/CT.",
      "Never discharge “sprain” with classic signs and normal first X-ray without a safety-net plan.",
    ],
    redFlags: ["Persistent snuffbox pain at 10–14 days"],
    imaging: "Repeat X-ray, MRI (early), or CT.",
  },
  {
    id: 10,
    title: "Tarsal Tunnel Syndrome",
    category: "Peripheral nerve",
    actual:
      "Tibial nerve compression in the tarsal tunnel behind the medial malleolus, causing plantar burning/paresthesia.",
    whyTricky:
      "Plantar pain is almost automatically called plantar fasciitis.",
    mimics: "Plantar fasciitis, Baxter’s nerve entrapment, S1 radiculopathy",
    steps: [
      "Burning/tingling (not just first-step mechanical heel pain).",
      "Night pain and medial ankle pain; positive Tinel behind medial malleolus.",
      "Palpate plantar fascia origin—may be relatively quiet compared with classic fasciitis.",
      "Screen lumbar S1 so you do not miss radiculopathy.",
      "Consider EMG/US/MRI for space-occupying lesions if persistent.",
    ],
  },
  {
    id: 11,
    title: "S1 Radiculopathy Mimicking Plantar Fasciitis",
    category: "Referred / neurologic",
    actual:
      "S1 nerve-root irritation referring pain into the heel/plantar foot with sensory and reflex change.",
    whyTricky:
      "Patients present only with “heel pain”; lumbar symptoms may be mild or forgotten.",
    mimics: "Plantar fasciitis, fat-pad syndrome",
    steps: [
      "Ask specifically about low-back pain and leg symptoms.",
      "Check calf strength (heel raise endurance) and Achilles reflex.",
      "Map sensory change along S1.",
      "If neuro signs present, treat as radiculopathy work-up—not only fascia stretching.",
    ],
  },
  {
    id: 12,
    title: "Partial Achilles Tendon Rupture",
    category: "Tendon — incomplete tear",
    actual:
      "Incomplete tear of the Achilles; patient may still walk, so complete-rupture algorithms are not triggered.",
    whyTricky:
      "Walking ability and a doubtful Thompson test lead to “tendinitis.”",
    mimics: "Achilles tendinopathy, calf strain",
    steps: [
      "History of pop/snap + localized defect tenderness.",
      "Single-leg heel raise often impossible even if walking is possible.",
      "Thompson may be equivocal—do not rely on it alone.",
      "Urgent ultrasound or MRI; early ortho/sports referral.",
      "Protect from full loading until tear extent is known.",
    ],
    imaging: "Ultrasound or MRI.",
  },
  {
    id: 13,
    title: "L4 Radiculopathy Mimicking Meniscal Injury",
    category: "Referred / neurologic",
    actual:
      "L4 root irritation referring to the medial knee with quadriceps/reflex change.",
    whyTricky:
      "Knee pain + medial paresthesia is attributed to meniscus; lumbar clues are soft.",
    mimics: "Medial meniscus tear, MCL injury",
    steps: [
      "Ask about lumbar pain and medial-leg tingling.",
      "Test patellar reflex and knee-extension strength.",
      "If knee mechanical signs are weak but neuro signs exist, prioritize lumbar screening.",
      "Avoid unnecessary knee MRI-first pathways when the root explains the picture.",
    ],
  },
  {
    id: 14,
    title: "Pectoralis Major Rupture",
    category: "Muscle–tendon rupture",
    actual:
      "Tear of the pectoralis major (often at the tendon) during bench press or similar eccentric load.",
    whyTricky:
      "Pain is felt in the shoulder/axilla and labeled “shoulder strain,” delaying surgical windows for complete tears.",
    mimics: "Rotator cuff tear, biceps injury, AC sprain",
    steps: [
      "Bench-press / pec-deck mechanism + axillary ecchymosis is highly suggestive.",
      "Weakness of adduction/internal rotation with relatively preserved glenohumeral motion.",
      "Asymmetry of anterior axillary fold; loss of pec contour.",
      "Urgent MRI and orthopedic referral for complete tears (timing matters).",
    ],
    imaging: "MRI chest wall / shoulder protocol for pec major.",
  },
  {
    id: 15,
    title: "Myocardial Ischemia Presenting as Left Shoulder Pain",
    category: "Medical emergency (referred)",
    actual:
      "Cardiac ischemia referring to the left shoulder/arm via shared visceral afferent pathways.",
    whyTricky:
      "Patient seeks MSK care for “shoulder pain.” Movement-independent pain plus autonomic signs are missed.",
    mimics: "Rotator cuff, AC joint, cervical referral",
    steps: [
      "If shoulder pain does NOT change with shoulder movement, stop MSK-only thinking.",
      "Ask about chest pressure, nausea, sweating, dyspnea, jaw/arm radiation.",
      "Autonomic signs (cold sweat, nausea) → emergency pathway immediately.",
      "Do not perform functional MSK tests as the priority action.",
      "Activate emergency medical services / ED.",
    ],
    redFlags: ["Exertional chest pressure", "Diaphoresis", "Nausea", "Known CAD risk"],
  },
  {
    id: 16,
    title: "Sacroiliac Joint Pain vs Lumbar Disc Pain",
    category: "Referred / regional differential",
    actual:
      "Nociception from the SI joint referring to the low back, buttock, and sometimes thigh—without a primary discogenic driver.",
    whyTricky:
      "Everything “below L5” is labeled disc/sciatica; SI patterns are under-tested.",
    mimics: "Non-specific LBP, L5–S1 disc, piriformis pain",
    steps: [
      "Pain with sit-to-stand, rolling in bed, prolonged sitting; buttock-predominant pain.",
      "Use a cluster of SI provocation tests (not one test alone).",
      "Screen neurologic status to avoid missing true radiculopathy.",
      "Consider inflammatory SI disease in younger patients with morning stiffness.",
    ],
  },
  {
    id: 17,
    title: "Deep Gluteal / Piriformis Syndrome",
    category: "Peripheral nerve entrapment",
    actual:
      "Sciatic nerve irritation in the deep gluteal space (piriformis and related structures).",
    whyTricky:
      "Looks like lumbar radiculopathy or “simple gluteal strain.” Imaging of the spine may be nonspecific.",
    mimics: "L5–S1 radiculopathy, hamstring tendinopathy, GTPS",
    steps: [
      "Buttock pain with sitting intolerance; sciatic-like distal symptoms with quieter lumbar findings.",
      "Palpation and stretch/contraction of deep external rotators may reproduce symptoms.",
      "Still rule out lumbar root compression—deep gluteal is a diagnosis of careful exclusion plus positive local signs.",
      "MRI lumbar ± pelvis when unclear; specialist referral if progressive deficit.",
    ],
  },
  {
    id: 18,
    title: "Diaphragmatic / Visceral Referred Scapular Pain",
    category: "Visceral referral",
    actual:
      "Irritation of the diaphragm or upper abdominal/thoracic viscera referring to the scapular region via phrenic/shared pathways (e.g., gallbladder, subdiaphragmatic processes).",
    whyTricky:
      "Treated endlessly as scapular dyskinesis or cuff disease; MSK tests do not explain systemic/digestive links.",
    mimics: "Rhomboid strain, scapular tendinopathy, cervical referral",
    steps: [
      "Scapular pain poorly related to shoulder motion.",
      "Ask about digestion, respiration, fever, abdominal symptoms.",
      "If MSK exam is unrevealing, escalate medical evaluation rather than more shoulder rehab alone.",
    ],
    redFlags: ["Fever", "Jaundice", "Severe abdominal pain", "Dyspnea"],
  },
  {
    id: 19,
    title: "Ulnar Neuropathy at the Elbow vs Medial Epicondylitis",
    category: "Peripheral nerve",
    actual:
      "Compression/irritation of the ulnar nerve in the cubital tunnel causing medial elbow pain plus ulnar-digit paresthesia.",
    whyTricky:
      "Medial elbow pain is labeled golfer’s elbow; sensory/motor ulnar signs are ignored.",
    mimics: "Medial epicondylitis, UCL injury in throwers",
    steps: [
      "Ask about 4th/5th digit tingling and night symptoms.",
      "Tinel at cubital tunnel; elbow flexion test.",
      "Intrinsic weakness, clawing, or sensory loss → nerve pathway, not only tendon.",
      "Palpate medial epicondyle: pure tendinopathy lacks ulnar distribution symptoms.",
    ],
  },
  {
    id: 20,
    title: "Inflammatory Back Pain (Axial Spondyloarthritis Pattern)",
    category: "Inflammatory vs mechanical",
    actual:
      "Inflammatory axial disease pattern (e.g., axial SpA) presenting as chronic low-back/buttock pain with inflammatory features.",
    whyTricky:
      "Years of “mechanical LBP” labeling delay rheumatology referral and imaging.",
    mimics: "Mechanical nonspecific LBP, SI mechanical pain",
    steps: [
      "Age of onset <40–45, morning stiffness >45 minutes, improvement with activity, night pain in second half of night.",
      "Ask about psoriasis, IBD, uveitis, family history.",
      "Do not endlessly prescribe only “core stability” without inflammatory screening.",
      "Refer rheumatology; HLA-B27 and MRI SI joints per guidelines.",
    ],
  },
  {
    id: 21,
    title: "Early Cervical Myelopathy",
    category: "Central neurologic",
    actual:
      "Spinal cord compression in the cervical canal causing hand clumsiness, gait imbalance, and often underestimated neck symptoms.",
    whyTricky:
      "Early signs are subtle—“stiff neck” or hand numbness—until gait and dexterity clearly fail.",
    mimics: "Cervical radiculopathy, carpal tunnel, peripheral neuropathy",
    steps: [
      "Ask about bilateral hand numbness, dropping objects, buttons/zippers difficulty, unsteady gait.",
      "Upper motor neuron signs: hyperreflexia, Hoffmann, clonus, Babinski, spastic gait.",
      "This is NOT routine mechanical neck pain—urgent specialist imaging pathway.",
    ],
    redFlags: ["Gait ataxia", "Hand clumsiness", "Bowel/bladder change"],
    imaging: "Cervical MRI urgently when myelopathy suspected.",
  },
  {
    id: 22,
    title: "Vascular Claudication vs Neurogenic Claudication",
    category: "Vascular vs spine",
    actual:
      "Arterial insufficiency causing exertional leg pain that resolves promptly with standing rest (not necessarily flexion).",
    whyTricky:
      "Walking-related leg pain is reflexively called “sciatica” or stenosis.",
    mimics: "Neurogenic claudication from lumbar stenosis, radiculopathy",
    steps: [
      "Vascular: relief by standing still; neurogenic: often relief by sitting/flexing.",
      "Check pulses, skin, temperature, cardiovascular risk factors.",
      "Bike vs walk patterns can help differentiate in clinic.",
      "ABI / vascular referral when pulses diminished or risk high.",
    ],
  },
  {
    id: 23,
    title: "Deep Vein Thrombosis (DVT)",
    category: "Medical emergency",
    actual:
      "Lower-limb deep venous thrombosis; calf pain/swelling can mimic muscle tear.",
    whyTricky:
      "Athletes and clinicians assume “tennis leg.” Missed DVT risks PE.",
    mimics: "Medial gastrocnemius tear, soleus strain, cellulitis",
    steps: [
      "Wells score elements: swelling, warmth, risk factors (travel, surgery, OCP, cancer, prior DVT).",
      "No clear pop/mechanism + progressive unilateral swelling → think clot.",
      "Do not deep-massage or aggressive soft-tissue work on a suspected DVT.",
      "Urgent duplex ultrasound / ED pathway.",
    ],
    redFlags: ["Sudden dyspnea/chest pain (PE)"],
  },
  {
    id: 24,
    title: "Chronic Exertional Compartment Syndrome (CECS)",
    category: "Exertional syndrome",
    actual:
      "Reversible rise in intracompartmental pressure during exercise causing predictable distance-related pain and tightness.",
    whyTricky:
      "Labeled shin splints; resting exam is often normal.",
    mimics: "Medial tibial stress syndrome, tibial stress fracture",
    steps: [
      "Pain appears at a reproducible time/distance and eases after stopping.",
      "Sense of tightness/swelling in a compartment; possible transient numbness.",
      "Distinguish from stress fracture (focal bone tenderness, night pain).",
      "Confirm with post-exercise compartment pressure testing in specialist centers.",
    ],
  },
  {
    id: 25,
    title: "Stress Fracture with Initially Normal Radiographs",
    category: "Occult bone injury",
    actual:
      "Fatigue fracture of weight-bearing bone (tibia, metatarsals, pelvis, femoral neck, etc.) invisible on early X-ray.",
    whyTricky:
      "Normal X-ray falsely reassures; athletes continue loading and complete the fracture.",
    mimics: "Tendinopathy, MTSS, “growing pains” in adolescents",
    steps: [
      "Progressive focal bony pain, impact aggravation, night pain, hop pain.",
      "Point tenderness on bone, not diffuse soft tissue.",
      "If suspicion high: MRI despite normal X-ray; reduce load immediately.",
    ],
    imaging: "MRI preferred; repeat X-ray later may show callus.",
  },
  {
    id: 26,
    title: "Lisfranc Injury",
    category: "Midfoot instability / fracture-dislocation",
    actual:
      "Injury to the tarsometatarsal complex; ranges from subtle ligamentous injury to fracture-dislocation.",
    whyTricky:
      "Can look like a “foot sprain”; weight-bearing films needed; missed injuries cause chronic midfoot collapse.",
    mimics: "Midfoot sprain, metatarsal contusion",
    steps: [
      "Mechanism: axial load on plantarflexed foot; plantar ecchymosis is a classic clue.",
      "Pain with midfoot squeeze / stress; inability to toe-raise comfortably.",
      "Weight-bearing bilateral X-rays; CT/MRI if still suspected.",
      "Urgent ortho referral—do not “walk it off.”",
    ],
    imaging: "Weight-bearing X-ray; CT/MRI for occult injury.",
  },
  {
    id: 27,
    title: "Navicular Stress Fracture",
    category: "Occult bone injury",
    actual:
      "Stress fracture of the tarsal navicular—high-risk location due to watershed blood supply.",
    whyTricky:
      "Vague dorsal midfoot pain in runners; X-rays often normal early.",
    mimics: "Extensor tendinopathy, midfoot sprain",
    steps: [
      "Insistent dorsal-medial midfoot pain in impact athletes.",
      "Pain over navicular (“N” spot); hop/push-off pain.",
      "High suspicion → MRI/CT and non-weight-bearing protection pending diagnosis.",
      "Specialist management—high complication risk if missed.",
    ],
    imaging: "MRI or CT; X-ray insensitive early.",
  },
  {
    id: 28,
    title: "Syndesmotic (High Ankle) Sprain",
    category: "Ligament — often under-graded",
    actual:
      "Injury to the tibiofibular syndesmosis, often with external rotation force.",
    whyTricky:
      "Treated as ordinary lateral ankle sprain; recovery is much slower and instability persists.",
    mimics: "Lateral ankle sprain (ATFL)",
    steps: [
      "Pain above the ankle joint line; external rotation mechanism.",
      "Squeeze test and external-rotation stress reproduce proximal pain.",
      "Assess for associated Maisonneuve (proximal fibula) injury.",
      "Imaging for diastasis; ortho if unstable.",
    ],
  },
  {
    id: 29,
    title: "Cauda Equina Syndrome",
    category: "Surgical emergency",
    actual:
      "Compression of the cauda equina causing saddle anesthesia, bowel/bladder dysfunction, and often bilateral leg symptoms.",
    whyTricky:
      "Early stages may look like “bad sciatica”; embarrassment delays reporting of perineal/bladder symptoms.",
    mimics: "Severe radiculopathy, mechanical LBP flare",
    steps: [
      "Mandatory questions: saddle numbness, urinary retention/incontinence, fecal incontinence, bilateral sciatica, sexual dysfunction.",
      "Any positive → emergency MRI and surgical referral NOW.",
      "Do not wait for “a few days of physio.”",
    ],
    redFlags: ["Saddle anesthesia", "Urinary retention", "Bilateral motor loss"],
  },
  {
    id: 30,
    title: "Acute Compartment Syndrome",
    category: "Surgical emergency",
    actual:
      "Acute rise in compartment pressure after fracture, crush, or reperfusion—threatens muscle and nerve viability.",
    whyTricky:
      "Early pain is blamed on the fracture/contusion; classic “6 Ps” appear late.",
    mimics: "Severe contusion, tight cast discomfort",
    steps: [
      "Pain out of proportion, pain on passive stretch, tense compartment.",
      "Paresthesia early; pulselessness is a LATE sign—do not wait for it.",
      "Emergency surgical fasciotomy pathway—minutes matter.",
    ],
    redFlags: ["Pain out of proportion", "Tense swelling after trauma"],
  },
  {
    id: 31,
    title: "Occult Hip Fracture in the Elderly",
    category: "Occult bone injury",
    actual:
      "Femoral neck or intertrochanteric fracture after low-energy fall; initial X-ray may be negative.",
    whyTricky:
      "Patient “can move a little,” so it is called bruise/strain; delayed diagnosis increases morbidity.",
    mimics: "Soft-tissue contusion, GTPS flare",
    steps: [
      "Fall in older adult + inability to bear weight = fracture until cleared.",
      "Shortened/externally rotated limb when displaced; occult fractures may lack deformity.",
      "If X-ray negative but cannot walk: MRI (or CT) same-day pathway.",
    ],
    imaging: "X-ray first; MRI if occult suspected.",
  },
  {
    id: 32,
    title: "Proximal Humerus Fracture vs Rotator Cuff Tear",
    category: "Occult bone / trauma",
    actual:
      "Fracture of the proximal humerus (common in osteoporotic falls) presenting with shoulder pain and weakness.",
    whyTricky:
      "Weak elevation is attributed to cuff tear; fracture is missed without imaging.",
    mimics: "Acute rotator cuff tear, dislocation (reduced)",
    steps: [
      "Age + fall + global pain/weakness → radiograph before aggressive cuff testing.",
      "Ecchymosis down the arm is a useful clue.",
      "Never force PROM stress tests until fracture is excluded.",
    ],
    imaging: "Shoulder X-ray series first-line.",
  },
  {
    id: 33,
    title: "Distal Biceps Tendon Rupture",
    category: "Tendon rupture",
    actual:
      "Avulsion of the distal biceps from the radial tuberosity, usually during heavy eccentric flexion/supination.",
    whyTricky:
      "Elbow “strain” label; surgical delay worsens outcomes for complete tears.",
    mimics: "Biceps strain, cubital bursitis, lateral elbow pain syndromes",
    steps: [
      "Pop during lift + antecubital pain + ecchymosis.",
      "Weakness especially of supination; Hook test / squeeze tests as trained.",
      "MRI or ultrasound confirmation; urgent ortho for complete ruptures.",
    ],
  },
  {
    id: 34,
    title: "Extensor Mechanism Rupture (Quad or Patellar Tendon)",
    category: "Tendon rupture",
    actual:
      "Rupture of the quadriceps tendon or patellar tendon disrupting active knee extension.",
    whyTricky:
      "Patient may still walk with gait adaptation; swelling hides the gap.",
    mimics: "Patellar dislocation, ACL injury, contusion",
    steps: [
      "Inability to perform straight-leg raise / active terminal extension.",
      "Palpable gap above or below patella; patella alta/baja.",
      "Urgent imaging and surgical referral—this is not “rest and ice” alone.",
    ],
    imaging: "X-ray (patellar height); ultrasound/MRI for confirmation.",
  },
  {
    id: 35,
    title: "Gluteus Medius / Minimus Tear vs Trochanteric Bursitis",
    category: "Tendon — mislabeled bursitis",
    actual:
      "Insertional tear/tendinopathy of gluteus medius/minimus at the greater trochanter—often the true driver of “bursitis.”",
    whyTricky:
      "Decades of “trochanteric bursitis” labeling; tears need different loading and sometimes repair.",
    mimics: "Isolated bursitis, lumbar referral, hip OA",
    steps: [
      "Lateral hip pain, night pain lying on side, Trendelenburg/abduction weakness.",
      "Pain with resisted abduction and external rotation in sidelying.",
      "Ultrasound/MRI to grade tear if weakness is clear or injections fail.",
      "Rehab targets gluteal loading—not only “bursal anti-inflammatories.”",
    ],
  },
  {
    id: 36,
    title: "Fifth Metatarsal Base / Jones Fracture",
    category: "Occult / high-risk fracture",
    actual:
      "Fracture at zones of the proximal 5th metatarsal; Jones (zone 2) has higher nonunion risk.",
    whyTricky:
      "Treated as ankle sprain; patient keeps playing.",
    mimics: "Lateral ankle sprain, peroneal tendinopathy",
    steps: [
      "Point bone pain at base of 5th MT after inversion injury.",
      "Always palpate the 5th MT in “ankle sprains.”",
      "X-ray; classify zone; Jones often needs protected management / ortho.",
    ],
  },
  {
    id: 37,
    title: "Posterior Tibial Tendon Dysfunction (PTTD)",
    category: "Progressive tendon failure",
    actual:
      "Degeneration/failure of the tibialis posterior tendon leading to progressive adult-acquired flatfoot.",
    whyTricky:
      "Early medial ankle pain is called “fasciitis” or sprain; deformity progresses quietly.",
    mimics: "Plantar fasciitis, medial ankle sprain, tarsal tunnel",
    steps: [
      "Medial ankle/foot pain, “too many toes,” difficulty single-leg heel raise (heel fails to invert).",
      "Assess arch collapse and forefoot abduction.",
      "Early staging changes treatment (ortho/ortho-foot pathway).",
    ],
  },
  {
    id: 38,
    title: "Pronator Syndrome (Median Nerve Proximal)",
    category: "Peripheral nerve",
    actual:
      "Median nerve compression in the proximal forearm (pronator teres region), overlapping carpal-tunnel-like sensory symptoms.",
    whyTricky:
      "Automatically treated as carpal tunnel; night-only CTS pattern may be absent; forearm pain dominates.",
    mimics: "Carpal tunnel syndrome, C6–C7 radiculopathy",
    steps: [
      "Forearm pain with repetitive pronation; sensory symptoms in median distribution.",
      "Provocative pronator maneuvers; negative or incomplete response to CTS-only care.",
      "EMG may help localize; still a clinical diagnosis often.",
    ],
  },
  {
    id: 39,
    title: "Cubital Tunnel Syndrome",
    category: "Peripheral nerve",
    actual:
      "Ulnar nerve entrapment at the elbow with sensory ± motor loss in the ulnar hand.",
    whyTricky:
      "Intermittent tingling blamed on “circulation” or neck; intrinsic weakness appears late.",
    mimics: "Cervical C8–T1 radiculopathy, Guyon’s canal, medial epicondylitis",
    steps: [
      "4–5 digit paresthesia, worse with prolonged elbow flexion (phone, driving).",
      "Elbow flexion test, Tinel at groove; assess intrinsics and clawing.",
      "Differentiate from cervical root with neck exam and reflex/myotome map.",
      "Activity modification early; EMG if surgery considered.",
    ],
  },
  {
    id: 40,
    title: "Femoroacetabular Impingement / Labral Tear",
    category: "Intra-articular hip",
    actual:
      "Cam/pincer morphology with labral injury causing deep groin pain, clicking, and sitting intolerance.",
    whyTricky:
      "Misdiagnosed as adductor strain or sports hernia for months.",
    mimics: "Adductor tendinopathy, iliopsoas strain, inguinal disruption",
    steps: [
      "Deep groin pain, C-sign, pain with sitting/flexion, mechanical click.",
      "FADIR/FABER as screening—not definitive alone.",
      "X-ray for morphology; MR arthrogram for labrum when indicated.",
      "Exclude stress fracture/AVN when night pain or hop failure present.",
    ],
  },
  {
    id: 41,
    title: "Cervical Radiculopathy Presenting as Shoulder Pain",
    category: "Referred / neurologic",
    actual:
      "Cervical nerve-root pain referring to the shoulder girdle without prominent “neck complaint.”",
    whyTricky:
      "Shoulder pathways (cuff, bursitis) absorb all attention.",
    mimics: "Rotator cuff tendinopathy, subacromial pain syndrome",
    steps: [
      "Ask about neck movement aggravation and distal paresthesia.",
      "If cuff tests are inconsistent and cervical motions reproduce shoulder pain, raise cervical source.",
      "Spurling/cervical distraction as tolerated; neurologic screen of the limb.",
      "Image cervical spine when deficits persist—not only the shoulder.",
    ],
  },
  {
    id: 42,
    title: "Spinal Infection (Discitis / Osteomyelitis)",
    category: "Infection red flag",
    actual:
      "Infection of disc/vertebral body presenting as progressive back pain, often with insidious onset.",
    whyTricky:
      "May lack fever early; attributed to mechanical strain, especially post-procedure or in IVDU/immunocompromise.",
    mimics: "Mechanical LBP, vertebral compression fracture",
    steps: [
      "Risk: recent infection, surgery/injection, IV drug use, immunosuppression, diabetes.",
      "Constant pain, night pain, fever/chills, elevated inflammatory markers.",
      "Urgent labs (CRP/ESR/CBC) + MRI; do not delay for “failed physio.”",
    ],
    redFlags: ["Fever", "IVDU", "Recent spinal procedure", "Neurologic deficit"],
  },
  {
    id: 43,
    title: "Pars Interarticularis Stress Injury (Spondylolysis)",
    category: "Occult bone injury — adolescent athlete",
    actual:
      "Stress reaction/fracture of the pars, common in young athletes with repetitive extension (gymnastics, football, cricket bowling).",
    whyTricky:
      "Called “lumbar strain”; plain films may miss early lesions.",
    mimics: "Mechanical LBP, facet irritation, discogenic pain",
    steps: [
      "Adolescent + sport + extension-based pain, often unilateral.",
      "One-legged hyperextension pain is a clue (not pathognomonic).",
      "MRI (and sometimes CT for fracture detail) when suspicion high.",
      "Load management essential—early detection prevents nonunion/spondylolisthesis progression.",
    ],
  },
  {
    id: 44,
    title: "Meniscal Root Tear",
    category: "Intra-articular — subtle but severe",
    actual:
      "Avulsion/tear of the meniscal root that disables hoop stress function—biomechanically similar to total meniscectomy if missed.",
    whyTricky:
      "May lack classic locking; MRI can be subtle; patients get “degenerative meniscus” labels.",
    mimics: "Simple degenerative meniscal tear, early OA flare",
    steps: [
      "Middle-aged patient, deep joint-line pain, popping, subtle instability, rapid OA progression clues.",
      "Extrusion of meniscus on MRI is a warning sign.",
      "Specialist MRI review; early ortho discussion—repair windows matter.",
    ],
    imaging: "High-quality MRI with attention to root attachments.",
  },
  {
    id: 45,
    title: "Posterolateral Corner (PLC) Injury",
    category: "Multi-ligament — often missed",
    actual:
      "Injury to LCL/popliteus/popliteofibular complex; often with ACL/PCL in high-energy trauma.",
    whyTricky:
      "Focus stays on ACL; varus/rotatory instability is missed, and isolated ACL reconstruction fails.",
    mimics: "Isolated ACL tear, lateral meniscus tear",
    steps: [
      "Hyperextension/varus mechanism; lateral/posterolateral pain.",
      "Dial test, varus stress at 0° and 30°, reverse pivot patterns as trained.",
      "Always examine PLC when ACL/PCL injured.",
      "MRI + specialist multi-ligament expertise.",
    ],
  },
  {
    id: 46,
    title: "Common Peroneal Nerve Palsy vs L5 Radiculopathy",
    category: "Peripheral vs root neurologic",
    actual:
      "Compression of the common peroneal nerve at the fibular neck causing foot drop and sensory change on the dorsum of the foot.",
    whyTricky:
      "Foot drop is automatically “L5 radiculopathy”; local fibular compression (cast, habit sitting, trauma) is missed.",
    mimics: "L5 radiculopathy, sciatic neuropathy, stroke (central)",
    steps: [
      "Foot drop + sensory map: peroneal sensory vs L5 dermatome differences; hip abduction often weak in L5, spared in pure peroneal.",
      "Palpate/Tinel at fibular neck; history of compression.",
      "EMG localizes lesion; image lumbar only when root more likely.",
      "Urgent protection from falls; address reversible compression.",
    ],
  },
  {
    id: 47,
    title: "Proximal Hamstring Tendon Avulsion",
    category: "Tendon avulsion",
    actual:
      "Avulsion of proximal hamstring tendons from the ischial tuberosity during forceful hip flexion with knee extension (water skiing, splits, sprint).",
    whyTricky:
      "Called “high hamstring strain”; complete avulsions needing surgery are delayed.",
    mimics: "Hamstring muscle belly strain, ischial bursitis, sciatica",
    steps: [
      "Sudden pop at buttock, ecchymosis, weakness of hip extension/knee flexion.",
      "Palpable gap near ischium; sitting pain severe.",
      "MRI to grade; early ortho for complete multi-tendon avulsions.",
    ],
    imaging: "Pelvic MRI.",
  },
  {
    id: 48,
    title: "Osteochondral Lesion of the Talus (OLT)",
    category: "Intra-articular cartilage/bone",
    actual:
      "Cartilage ± underlying bone injury of the talar dome, often after ankle sprain.",
    whyTricky:
      "Chronic “sprain that never healed”; plain films may miss lesions.",
    mimics: "Chronic ankle instability, anterolateral impingement, peroneal tendinopathy",
    steps: [
      "Deep ankle pain, effusion, catching after prior sprain.",
      "If rehab for sprain fails, image for OLT.",
      "MRI preferred; CT for bone detail/surgical planning.",
    ],
    imaging: "MRI; X-ray may show cystic change later.",
  },
  {
    id: 49,
    title: "Upper Cervical Instability (Atlantoaxial / Craniovertebral)",
    category: "High-risk cervical",
    actual:
      "Instability at C1–C2 or craniovertebral junction (rheumatoid arthritis, Down syndrome, trauma) threatening the cord/brainstem.",
    whyTricky:
      "Presents as “neck pain/headache”; standard mechanical care is dangerous if instability exists.",
    mimics: "Cervicogenic headache, mechanical neck pain, migraine",
    steps: [
      "Screen RA, connective tissue disorders, Down syndrome, significant trauma.",
      "Red flags: occipital headache, cord signs, cranial nerve symptoms, severe restricted rotation.",
      "Avoid end-range manipulation; urgent specialist imaging (flexion-extension / MRI/CT per protocol).",
    ],
    redFlags: ["Neurologic long-tract signs", "RA + neck pain + myelopathy clues"],
  },
  {
    id: 50,
    title: "Parsonage–Turner Syndrome (Neuralgic Amyotrophy)",
    category: "Inflammatory plexopathy",
    actual:
      "Acute brachial plexitis: severe shoulder/arm pain followed by patchy weakness and atrophy as pain eases.",
    whyTricky:
      "Phase 1 looks like acute cuff tear or cervical radiculopathy; phase 2 weakness is blamed on “disuse.”",
    mimics: "Acute rotator cuff tear, C5–C6 radiculopathy, adhesive capsulitis",
    steps: [
      "Hyperacute severe pain (often night) followed days later by multifocal weakness (scapular winging, anterior interosseous, etc.).",
      "Patchy, non-myotomal pattern is a clue vs single-root disease.",
      "EMG after ~3 weeks; MRI plexus/cervical to exclude structural causes.",
      "Early recognition prevents futile “cuff tear surgery” pathways; pain control + specialist neurology/ortho.",
    ],
  },
];

function drawHeader(doc) {
  doc
    .font("Helvetica-Bold")
    .fontSize(20)
    .fillColor("#0f2744")
    .text("The 50 Most Difficult Injuries to Detect", { align: "left" });
  doc.moveDown(0.3);
  doc
    .font("Helvetica")
    .fontSize(11)
    .fillColor("#334155")
    .text("A Clinical Research Brief for Musculoskeletal Triage & Differential Reasoning", {
      align: "left",
    });
  doc.moveDown(0.4);
  doc
    .fontSize(9)
    .fillColor("#64748b")
    .text(
      `Prepared for FisioterapIA clinical reasoning validation · ${new Date().toLocaleDateString("en-GB", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })}`,
    );
  doc.moveDown(0.6);
  doc
    .moveTo(doc.page.margins.left, doc.y)
    .lineTo(doc.page.width - doc.page.margins.right, doc.y)
    .strokeColor("#cbd5e1")
    .lineWidth(1)
    .stroke();
  doc.moveDown(0.8);
}

function ensureSpace(doc, needed = 120) {
  if (doc.y + needed > doc.page.height - doc.page.margins.bottom) {
    doc.addPage();
  }
}

function sectionTitle(doc, title) {
  ensureSpace(doc, 60);
  doc.moveDown(0.4);
  doc.font("Helvetica-Bold").fontSize(14).fillColor("#0f2744").text(title);
  doc.moveDown(0.3);
}

function body(doc, text) {
  doc.font("Helvetica").fontSize(10).fillColor("#1e293b").text(text, { align: "justify", lineGap: 2 });
  doc.moveDown(0.4);
}

function bullet(doc, text) {
  ensureSpace(doc, 36);
  const x = doc.page.margins.left;
  const bulletX = x;
  const textX = x + 12;
  const width = doc.page.width - doc.page.margins.right - textX;
  doc.font("Helvetica").fontSize(10).fillColor("#1e293b");
  const y = doc.y;
  doc.text("•", bulletX, y, { width: 12, continued: false });
  doc.text(text, textX, y, { width, lineGap: 1.5 });
  doc.moveDown(0.15);
}

function labelValue(doc, label, value) {
  ensureSpace(doc, 40);
  doc.font("Helvetica-Bold").fontSize(10).fillColor("#0f2744").text(label, { continued: false });
  doc.font("Helvetica").fontSize(10).fillColor("#1e293b").text(value, { align: "justify", lineGap: 2 });
  doc.moveDown(0.35);
}

function renderInjury(doc, injury) {
  ensureSpace(doc, 160);
  // Number badge line
  doc
    .font("Helvetica-Bold")
    .fontSize(12)
    .fillColor("#0f2744")
    .text(`${injury.id}. ${injury.title}`, { lineGap: 2 });
  doc
    .font("Helvetica-Oblique")
    .fontSize(9)
    .fillColor("#64748b")
    .text(injury.category);
  doc.moveDown(0.35);

  labelValue(doc, "What it actually is", injury.actual);
  labelValue(doc, "Why it is tricky", injury.whyTricky);
  labelValue(doc, "Commonly mistaken for", injury.mimics);

  doc.font("Helvetica-Bold").fontSize(10).fillColor("#0f2744").text("Correct detection steps");
  doc.moveDown(0.2);
  for (const step of injury.steps) bullet(doc, step);

  if (injury.redFlags?.length) {
    doc.moveDown(0.2);
    doc.font("Helvetica-Bold").fontSize(10).fillColor("#0f2744").text("Red flags");
    doc.moveDown(0.15);
    for (const r of injury.redFlags) bullet(doc, r);
  }
  if (injury.imaging) {
    doc.moveDown(0.2);
    labelValue(doc, "Imaging / confirmation", injury.imaging);
  }

  doc.moveDown(0.35);
  doc
    .moveTo(doc.page.margins.left, doc.y)
    .lineTo(doc.page.width - doc.page.margins.right, doc.y)
    .strokeColor("#e2e8f0")
    .lineWidth(0.5)
    .stroke();
  doc.moveDown(0.55);
}

function buildToc(doc) {
  sectionTitle(doc, "Contents");
  body(
    doc,
    "Injuries are ordered by clinical detection difficulty and real-world miss risk—not by anatomical region. Each entry includes the true pathology, why it deceives, what it mimics, and a stepwise detection pathway.",
  );
  const cols = 2;
  const mid = Math.ceil(INJURIES.length / cols);
  const startY = doc.y;
  const colWidth = (doc.page.width - doc.page.margins.left - doc.page.margins.right - 20) / 2;
  for (let c = 0; c < cols; c++) {
    let y = startY;
    const x = doc.page.margins.left + c * (colWidth + 20);
    const slice = INJURIES.slice(c * mid, c * mid + mid);
    for (const inj of slice) {
      if (y > doc.page.height - doc.page.margins.bottom - 20) break;
      doc.font("Helvetica").fontSize(8).fillColor("#334155");
      doc.text(`${inj.id}. ${inj.title}`, x, y, { width: colWidth, lineGap: 1 });
      y = doc.y + 2;
    }
  }
  doc.y = Math.max(doc.y, startY + mid * 11);
  doc.moveDown(1);
}

async function main() {
  const doc = new PDFDocument({
    size: "A4",
    bufferPages: true,
    margins: { top: 54, bottom: 54, left: 54, right: 54 },
    info: {
      Title: "The 50 Most Difficult Injuries to Detect",
      Author: "FisioterapIA Clinical Research Brief",
      Subject: "Hard-to-detect musculoskeletal and referred injuries — detection pathways",
      Keywords: "differential diagnosis, referred pain, occult fracture, neuropathy, red flags",
    },
  });

  const stream = fs.createWriteStream(OUT);
  doc.pipe(stream);

  drawHeader(doc);

  sectionTitle(doc, "Abstract");
  body(
    doc,
    "A large share of diagnostic error in musculoskeletal care is not “rare disease ignorance” but pattern capture failure: the patient’s complaint is anatomically downstream of the true lesion, initial imaging is falsely normal, neurologic signs are subtle, or a dangerous medical mimic occupies an orthopedic niche. This brief synthesates fifty high-miss-risk presentations spanning referred pain, occult fractures, peripheral and root neuropathies, tendon ruptures that still allow walking, inflammatory and infectious red flags, and visceral/cardiac emergencies. For each entity we state the true pathology, the cognitive trap, the usual mislabel, and an ordered detection sequence clinicians (and clinical AI systems) should run before locking onto the obvious local diagnosis.",
  );

  sectionTitle(doc, "Method & scope");
  body(
    doc,
    "Selection prioritized (1) frequency of mislabeling in primary MSK pathways, (2) severity of harm if missed, and (3) availability of concrete bedside discriminators. Sources informing this synthesis include standard orthopedic/sports medicine differential frameworks, neurologic localization principles, Ottawa and stress-fracture imaging pathways, and published “missed diagnosis” patterns in emergency and outpatient MSK care. This document is educational and for clinical-reasoning validation; it is not a practice guideline and does not replace individualized clinical judgment, local protocols, or emergency pathways.",
  );

  sectionTitle(doc, "Cross-cutting detection principles");
  for (const p of [
    "Ask whether the local diagnosis explains ALL key findings (neurologic distribution, night pain, hop failure, systemic signs).",
    "Screen the joint above and the spine for referred-pain maps (hip→knee, neck→shoulder/elbow, lumbar→foot).",
    "Treat normal early radiographs as provisional when bone pain physiology is classic.",
    "Autonomic, vascular, saddle, febrile, or cord signs outrank orthopedic tests—escalate first.",
    "Failed standard care for a “common” diagnosis is a signal to reopen the differential, not to intensify the same plan indefinitely.",
  ]) {
    bullet(doc, p);
  }

  doc.addPage();
  buildToc(doc);

  doc.addPage();
  sectionTitle(doc, "The fifty injuries");
  doc.moveDown(0.2);
  for (const injury of INJURIES) {
    renderInjury(doc, injury);
  }

  sectionTitle(doc, "How to use this brief for AI / clinical validation");
  for (const p of [
    "Present each case vignette without the title; require ranked differentials and an action (treat locally / image / refer urgently).",
    "Score whether the true injury appears in the top three hypotheses and whether red-flag pathways were triggered when indicated.",
    "Penalize “obvious local” diagnoses that ignore neurologic, nocturnal, vascular, or visceral features listed in detection steps.",
    "Pair this brief with a larger easy/intermediate/expert vignette battery to measure calibration, not only rare-case recall.",
  ]) {
    bullet(doc, p);
  }

  sectionTitle(doc, "Disclaimer");
  body(
    doc,
    "Educational research brief for physiotherapy/MSK clinical reasoning. Not a substitute for licensed medical assessment, emergency care, or specialty guidelines. When in doubt about fracture, infection, cauda equina, compartment syndrome, DVT/PE, or cardiac ischemia, escalate immediately through appropriate urgent pathways.",
  );

  // Page numbers
  const pages = doc.bufferedPageRange();
  for (let i = 0; i < pages.count; i++) {
    doc.switchToPage(pages.start + i);
    doc
      .font("Helvetica")
      .fontSize(8)
      .fillColor("#94a3b8")
      .text(`Page ${i + 1} of ${pages.count}`, doc.page.margins.left, doc.page.height - 36, {
        width: doc.page.width - doc.page.margins.left - doc.page.margins.right,
        align: "center",
      });
  }

  doc.end();
  await new Promise((resolve, reject) => {
    stream.on("finish", resolve);
    stream.on("error", reject);
  });
  console.log(`Wrote ${OUT}`);
  console.log(`Injuries: ${INJURIES.length}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
