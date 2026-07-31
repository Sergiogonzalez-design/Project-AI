/**
 * Volume 2 — another 50 hard-to-detect injuries (no overlap with Volume 1).
 * Run: node docs/generate-difficult-injuries-pdf-vol2.mjs
 */
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "50-most-difficult-injuries-to-detect-vol2.pdf");

/** @typedef {{ id: number, title: string, category: string, actual: string, whyTricky: string, mimics: string, steps: string[], redFlags?: string[], imaging?: string }} Injury */

/** @type {Injury[]} */
const INJURIES = [
  {
    id: 1,
    title: "Slipped Capital Femoral Epiphysis (SCFE)",
    category: "Pediatric / adolescent hip",
    actual:
      "Displacement of the femoral head epiphysis through the growth plate, typically in overweight adolescents.",
    whyTricky:
      "Often presents as knee or thigh pain only; hip exam is skipped and the slip progresses.",
    mimics: "Growing pains, patellofemoral pain, groin strain",
    steps: [
      "Any adolescent with limp + knee/thigh pain must have a hip exam.",
      "Limited internal rotation and obligate external rotation in flexion are classic.",
      "Bilateral AP pelvis + frog-lateral radiographs urgently.",
      "Non-weight-bearing and immediate ortho referral once suspected—do not “mobilize.”",
    ],
    redFlags: ["Inability to bear weight", "Bilateral symptoms", "Endocrine risk factors"],
    imaging: "AP pelvis and frog-lateral X-rays; MRI if high suspicion and X-ray equivocal.",
  },
  {
    id: 2,
    title: "Septic Arthritis of the Hip (Child or Adult)",
    category: "Infection emergency",
    actual:
      "Bacterial infection of the hip joint that rapidly destroys cartilage if delayed.",
    whyTricky:
      "Early cases may lack dramatic fever; in children it overlaps with transient synovitis.",
    mimics: "Transient synovitis, appendicitis (referred), muscle strain",
    steps: [
      "Non-weight-bearing, fever, irritability, or toxic appearance → infection pathway.",
      "Kocher/modified criteria in children (fever, non-weight-bearing, ESR/CRP, WBC).",
      "Urgent labs + ultrasound/MRI and orthopedic emergency referral for aspiration.",
      "Never inject or aggressively mobilize a hot irritable hip before infection is excluded.",
    ],
    redFlags: ["Fever", "Refusal to walk", "Immunosuppression"],
  },
  {
    id: 3,
    title: "Sacral Insufficiency Fracture",
    category: "Occult bone injury",
    actual:
      "Fracture of the sacrum in osteoporotic or post-radiation bone, often without major trauma.",
    whyTricky:
      "Presents as “severe lumbosacral pain”; plain lumbar X-rays miss it; labeled mechanical LBP.",
    mimics: "Facet syndrome, SI mechanical pain, lumbar stenosis flare",
    steps: [
      "Older adult, osteoporosis, sudden buttock/sacral pain, difficulty walking.",
      "Focal sacral tenderness; pain with transfers more than with classic disc maneuvers.",
      "MRI or CT of the pelvis/sacrum—not only lumbar MRI.",
      "Protect loading; bone-health work-up and specialist input.",
    ],
    imaging: "MRI preferred; CT if MRI unavailable; X-ray insensitive.",
  },
  {
    id: 4,
    title: "Pubic Ramus / Pelvic Stress Fracture",
    category: "Occult bone injury",
    actual:
      "Stress fracture of the pubic rami or pelvic ring in runners, military recruits, or osteoporotic patients.",
    whyTricky:
      "Groin pain is treated as adductor tendinopathy; athletes keep training.",
    mimics: "Adductor strain, osteitis pubis, inguinal hernia",
    steps: [
      "Progressive groin/perineal pain with impact; one-leg stance or hop painful.",
      "Point bony tenderness on pubic ramus; adductor squeeze may hurt but bone pain dominates.",
      "MRI when suspicion high despite normal X-ray.",
      "Relative rest; rule out femoral neck stress fracture in the same athlete phenotype.",
    ],
    imaging: "MRI; X-ray often normal early.",
  },
  {
    id: 5,
    title: "Transient Osteoporosis of the Hip / Bone Marrow Edema Syndrome",
    category: "Occult bone / marrow",
    actual:
      "Acute bone marrow edema of the femoral head/neck causing severe hip pain, usually self-limited but easily confused with AVN.",
    whyTricky:
      "Looks like AVN or “severe tendinopathy”; wrong labeling changes urgency and load advice.",
    mimics: "AVN, stress fracture, synovitis",
    steps: [
      "Acute/subacute deep groin pain, marked antalgic gait, often middle-aged men or pregnancy-associated in women.",
      "Severe pain with IR and weight-bearing; X-ray may be normal early or show osteopenia later.",
      "MRI distinguishes diffuse marrow edema pattern from classic AVN demarcation—radiology liaison matters.",
      "Protect weight-bearing until imaging clarifies; do not assume “soft tissue only.”",
    ],
    imaging: "MRI is essential for differentiation from AVN/stress fracture.",
  },
  {
    id: 6,
    title: "Osteoid Osteoma",
    category: "Tumor — often missed",
    actual:
      "Benign bone-forming tumor with intense night pain typically relieved by NSAIDs.",
    whyTricky:
      "Pain is blamed on “growing pains,” tendinopathy, or psychogenic causes for months–years.",
    mimics: "Night-pain tendinopathy, osteomyelitis, stress fracture",
    steps: [
      "Focal bone pain worse at night, dramatic NSAID relief is a classic clue.",
      "Normal early X-ray does not exclude—CT often shows nidus best.",
      "Do not endless-treat as soft tissue if night bone pain persists.",
      "Refer orthopedics/oncology pathways for confirmation and ablation/excision options.",
    ],
    imaging: "CT for nidus; MRI/bone scan as adjuncts.",
  },
  {
    id: 7,
    title: "Soft-Tissue Sarcoma Misdiagnosed as Hematoma or “Muscle Tear”",
    category: "Oncology red flag",
    actual:
      "Malignant soft-tissue tumor presenting as a lump or “strain that never heals.”",
    whyTricky:
      "History of minor trauma invites hematoma labeling; mass grows quietly.",
    mimics: "Hematoma, muscle strain, lipoma, abscess",
    steps: [
      "Any deep mass >5 cm, growing, firm, or painless deep swelling needs tumor pathway—not repeated aspiration.",
      "Night pain, systemic symptoms, or recurrence after “hematoma” treatment raise concern.",
      "Urgent ultrasound/MRI via sarcoma referral guidelines; avoid unplanned excision.",
    ],
    redFlags: ["Growing mass", "Deep firm lump", "Constitutional symptoms"],
  },
  {
    id: 8,
    title: "Morel-Lavallée Lesion",
    category: "Closed degloving soft-tissue",
    actual:
      "Closed shear degloving injury creating a hemolymphatic collection between subcutaneous fat and fascia (often hip/thigh/knee).",
    whyTricky:
      "Looks like a simple bruise or bursitis; fluctuance and delayed swelling are missed.",
    mimics: "Contusion, trochanteric bursitis, hematoma",
    steps: [
      "Shearing trauma (motorcycle, sports) + fluctuant fluid collection over greater trochanter/thigh.",
      "Ultrasound/MRI confirms encapsulated collection.",
      "Refer for appropriate drainage/compression—do not treat as ordinary bruise indefinitely.",
    ],
    imaging: "Ultrasound or MRI.",
  },
  {
    id: 9,
    title: "Hook of Hamate Fracture",
    category: "Occult wrist fracture",
    actual:
      "Fracture of the hamate hook, common in bat/racket/golf sports from direct impact or repetitive stress.",
    whyTricky:
      "Standard wrist X-rays miss it; labeled ulnar-sided wrist sprain or ECU tendinopathy.",
    mimics: "ECU tendinopathy, TFCC strain, pisotriquetral arthritis",
    steps: [
      "Ulnar palm pain in grip sports; pain over Guyon’s/hamate region.",
      "Pain with resisted flexion of 4th/5th digits; grip weakness.",
      "Request carpal tunnel view or CT dedicated to hamate if clinical suspicion high.",
      "Early diagnosis prevents nonunion and ulnar nerve/flexor irritation.",
    ],
    imaging: "Carpal tunnel X-ray view; CT is often definitive.",
  },
  {
    id: 10,
    title: "Stener Lesion (Complete UCL Thumb with Adductor Interposition)",
    category: "Thumb UCL — surgical",
    actual:
      "Complete rupture of the thumb MCP ulnar collateral ligament where the adductor aponeurosis blocks healing.",
    whyTricky:
      "All “skier’s thumb” injuries get the same splint advice; Stener lesions need surgery.",
    mimics: "Partial UCL sprain, MCP capsular sprain",
    steps: [
      "Valgus injury to thumb; tenderness at UCL; laxity without firm end-feel.",
      "Palpable displaced stump sometimes present; compare to contralateral side carefully.",
      "Ultrasound/MRI to assess displacement/Stener anatomy.",
      "Urgent hand surgery referral for complete/Stener—do not prolonged “buddy tape only.”",
    ],
    imaging: "Ultrasound or MRI; stress X-rays selectively by specialist.",
  },
  {
    id: 11,
    title: "Essex-Lopresti Injury",
    category: "Forearm longitudinal instability",
    actual:
      "Radial head fracture + interosseous membrane disruption + DRUJ injury causing longitudinal forearm instability.",
    whyTricky:
      "Attention stays on the radial head; wrist/DRUJ pain is dismissed until the radius migrates proximally.",
    mimics: "Isolated radial head fracture, wrist sprain",
    steps: [
      "Always examine the wrist/DRUJ in every radial head fracture.",
      "Wrist pain, DRUJ instability, or radiographic ulnar-positive variance change after elbow injury.",
      "Compare bilateral wrist films; consider MRI/CT for IOM.",
      "Early specialist management—delayed recognition is hard to salvage.",
    ],
    imaging: "Elbow + wrist X-rays; MRI for interosseous membrane.",
  },
  {
    id: 12,
    title: "Posterolateral Rotatory Instability of the Elbow (PLRI)",
    category: "Elbow instability — subtle",
    actual:
      "Insufficiency of the lateral ulnar collateral ligament complex allowing rotatory subluxation of the ulnohumeral joint.",
    whyTricky:
      "Patients report clicking/apprehension with push-up or chair rise; standard “tennis elbow” care fails.",
    mimics: "Lateral epicondylitis, radial tunnel, loose body",
    steps: [
      "History of elbow dislocation/sprain or corticosteroid injection near LUCL.",
      "Lateral pivot-shift / tabletop / chair push-up apprehension.",
      "MRI for LUCL; exam under anesthesia sometimes needed.",
      "Stop repeated epicondylar injections if instability signs exist.",
    ],
  },
  {
    id: 13,
    title: "Anterior Interosseous Nerve (AIN) Syndrome",
    category: "Peripheral nerve — pure motor",
    actual:
      "Motor neuropathy of the AIN causing weakness of FPL, FDP to index (and often PQ) with no sensory loss.",
    whyTricky:
      "Inability to make an “OK” sign is blamed on tendon rupture of FPL.",
    mimics: "FPL tendon rupture, brachial neuritis (can overlap), C8 root",
    steps: [
      "Pure motor deficit: cannot flex thumb IP and index DIP; sensation intact.",
      "Tenodesis effect intact if tendon continuous—distinguishes from rupture.",
      "Consider Parsonage–Turner spectrum when pain precedes weakness.",
      "EMG localization; hand/neuro referral.",
    ],
  },
  {
    id: 14,
    title: "Suprascapular Nerve Entrapment (Spinoglenoid / Suprascapular Notch)",
    category: "Peripheral nerve at shoulder",
    actual:
      "Compression of the suprascapular nerve (notch → supra- and infraspinatus; spinoglenoid → infraspinatus mainly), often by cyst from labral tear.",
    whyTricky:
      "Infraspinatus atrophy and weak external rotation are labeled “cuff tear” indefinitely.",
    mimics: "Infraspinatus tear, C5–C6 radiculopathy, Parsonage–Turner",
    steps: [
      "Vague posterolateral shoulder pain + isolated infra ± supra atrophy.",
      "Weak ER with relatively quiet subacromial tests.",
      "MRI for paralabral cyst / notch anatomy; EMG confirms.",
      "Treat labral/cyst source—not endless cuff strengthening alone.",
    ],
    imaging: "Shoulder MRI; EMG.",
  },
  {
    id: 15,
    title: "Quadrilateral Space Syndrome",
    category: "Axillary nerve entrapment",
    actual:
      "Compression of the axillary nerve (and posterior humeral circumflex artery) in the quadrilateral space.",
    whyTricky:
      "Poorly localized shoulder pain in throwers; cuff imaging often “almost normal.”",
    mimics: "Posterior cuff tendinopathy, thoracic outlet, referred cervical pain",
    steps: [
      "Thrower/overhead athlete with poorly localized posterior shoulder pain and fatigue.",
      "Point tenderness over quadrilateral space; delayed deltoid/teres minor weakness or paresthesia.",
      "MRI may show teres minor denervation edema; angiography selectively for vascular form.",
      "Specialist sports shoulder pathway if persistent.",
    ],
  },
  {
    id: 16,
    title: "Long Thoracic Nerve Palsy (Serratus Anterior)",
    category: "Peripheral nerve",
    actual:
      "Injury/neuritis of the long thoracic nerve causing serratus anterior weakness and medial scapular winging.",
    whyTricky:
      "Labeled “scapular dyskinesis” or poor posture; true winging and nerve cause are missed.",
    mimics: "Scapular dyskinesis, trapezius palsy, cuff weakness",
    steps: [
      "Medial border winging worse with wall push-up / forward flexion.",
      "Distinguish from spinal accessory (trapezius) winging pattern.",
      "EMG of serratus; MRI cervical/brachial plexus if needed to exclude structural causes.",
      "Protect from fatigue; neurology/ortho referral for persistent deficits.",
    ],
  },
  {
    id: 17,
    title: "Spinal Accessory Nerve Injury",
    category: "Peripheral nerve — iatrogenic risk",
    actual:
      "Injury to CN XI causing trapezius weakness (often after lymph node biopsy or trauma).",
    whyTricky:
      "Shoulder droop and pain are treated as cuff disease; surgical scar history is ignored.",
    mimics: "Rotator cuff tear, long thoracic palsy, adhesive capsulitis",
    steps: [
      "Ask about neck surgery/biopsy trauma.",
      "Shoulder droop, asymmetric neckline, weak shrug, lateral winging pattern.",
      "EMG of trapezius; early recognition improves reconstructive options.",
    ],
  },
  {
    id: 18,
    title: "Effort Thrombosis (Paget–Schroetter Syndrome)",
    category: "Vascular emergency",
    actual:
      "Primary upper-extremity deep vein thrombosis of the subclavian vein, often in young overhead athletes.",
    whyTricky:
      "Arm “pump” swelling after training is called muscle hypertrophy or TOS soft-tissue pain.",
    mimics: "TOS (neurogenic), biceps strain, allergic angioedema",
    steps: [
      "Acute/subacute unilateral arm swelling, heaviness, cyanosis after repetitive overhead effort.",
      "Visible venous collaterals over shoulder/chest.",
      "Urgent duplex ultrasound and vascular referral—this is not “rest and ice.”",
    ],
    redFlags: ["Rapid arm swelling", "Discoloration", "Chest pain/dyspnea (PE)"],
  },
  {
    id: 19,
    title: "Popliteal Artery Entrapment Syndrome",
    category: "Vascular — exertional",
    actual:
      "Anatomic or functional compression of the popliteal artery by gastrocnemius/medial head variants causing exertional calf ischemia.",
    whyTricky:
      "Young athletes with calf pain are labeled CECS or shin splints; pulses at rest may be normal.",
    mimics: "CECS, tibial stress fracture, medial gastroc strain",
    steps: [
      "Exertional calf pain/paresthesia in young patient; symptoms with resisted plantarflexion/active ankle maneuvers.",
      "Pulse diminish with provocative ankle positions.",
      "Duplex with provocation / MRA / CTA via vascular specialist.",
      "Do not proceed to compartment release without vascular exclusion when clues fit.",
    ],
    imaging: "Provocation duplex, MRA/CTA.",
  },
  {
    id: 20,
    title: "Occult Tibial Plateau Fracture",
    category: "Occult bone injury",
    actual:
      "Minimally displaced tibial plateau fracture after valgus/axial load; may be invisible on initial films.",
    whyTricky:
      "Knee “sprain” with inability to bear weight; ligament testing is done on an unstable fracture.",
    mimics: "MCL sprain, meniscal tear, contusion",
    steps: [
      "Age + axial/valgus trauma + effusion + inability to walk → image before aggressive stress testing.",
      "Lipohemarthrosis on X-ray/CT is a clue to intra-articular fracture.",
      "CT if X-ray negative but high suspicion; MRI for occult fracture and soft tissue.",
    ],
    imaging: "X-ray then CT/MRI as needed.",
  },
  {
    id: 21,
    title: "Meniscal Ramp Lesion",
    category: "Knee — frequently missed on MRI",
    actual:
      "Meniscocapsular tear of the posterior horn medial meniscus, strongly associated with ACL rupture.",
    whyTricky:
      "Standard MRI reports may miss it; residual instability persists after ACL reconstruction if untreated.",
    mimics: "Simple medial meniscus tear, posteromedial pain from MCL",
    steps: [
      "ACL injury + posteromedial joint-line pain / instability sensations.",
      "Ask radiology specifically about ramp; arthroscopic probing remains gold standard when suspected.",
      "Ortho ACL pathway should routinely assess ramp lesions.",
    ],
    imaging: "High-quality MRI; intraoperative confirmation.",
  },
  {
    id: 22,
    title: "Posterolateral Meniscal Root / Posterior Horn Subtle Tear Patterns",
    category: "Knee cartilage–meniscus",
    actual:
      "Subtle posterior horn/root pathology of the lateral meniscus, sometimes with ACL injury, easy to under-call.",
    whyTricky:
      "Mechanical symptoms are intermittent; MRI subtlety leads to “normal knee” labels.",
    mimics: "IT band syndrome, patellofemoral pain, plica",
    steps: [
      "Deep joint-line pain, squatting pain, subtle locking after pivot injury.",
      "Correlate MRI with clinical mechanical signs; seek second radiology read if mismatch.",
      "Ortho review when effusion + mechanical symptoms persist.",
    ],
  },
  {
    id: 23,
    title: "Cyclops Lesion (After ACL Reconstruction)",
    category: "Post-surgical complication",
    actual:
      "Nodular fibroproliferative tissue anterior in the notch causing extension block after ACLR.",
    whyTricky:
      "Blamed on “quad inhibition” or arthrofibrosis generally; specific lesion is treatable arthroscopically.",
    mimics: "Extension deficit from pain inhibition, graft impingement, arthrofibrosis diffuse",
    steps: [
      "Loss of terminal extension weeks–months after ACLR, anterior clunk.",
      "MRI shows anterior notch nodule.",
      "Early ortho arthroscopy discussion if extension does not progress with rehab.",
    ],
    imaging: "MRI knee.",
  },
  {
    id: 24,
    title: "Isolated Subscapularis Tear",
    category: "Shoulder — under-detected cuff tear",
    actual:
      "Tear of subscapularis, often with biceps subluxation, missed on casual cuff screening focused on supra/infra.",
    whyTricky:
      "Patients can still elevate the arm; lift-off/belly-press are skipped.",
    mimics: "Biceps tendinopathy, anterior cuff tendinopathy, capsulitis",
    steps: [
      "Anterior shoulder pain, weak internal rotation, positive bear-hug/belly-press/lift-off as able.",
      "Look for biceps instability signs.",
      "MRI/ultrasound with specific subscapularis attention.",
      "Early repair consideration for full-thickness tears—timing matters.",
    ],
    imaging: "MRI or high-quality ultrasound.",
  },
  {
    id: 25,
    title: "PASTA Lesion (Partial Articular Supraspinatus Tendon Avulsion)",
    category: "Shoulder — partial cuff",
    actual:
      "Partial-thickness articular-sided supraspinatus tear that behaves like refractory “impingement.”",
    whyTricky:
      "Bursal-sided exam and subacromial injections give partial relief; articular lesion persists.",
    mimics: "Subacromial pain syndrome, bursitis alone",
    steps: [
      "Overhead athlete/worker with persistent pain despite bursal care.",
      "MRI/MRA for articular partial tear grading.",
      "Escalate imaging when 3–6 months of quality rehab fails and strength/pain remain discrepant.",
    ],
    imaging: "MRI; MR arthrogram improves articular-sided detection.",
  },
  {
    id: 26,
    title: "Posterior Sternoclavicular Joint Dislocation",
    category: "Trauma emergency",
    actual:
      "Posterior displacement of the medial clavicle threatening trachea, vessels, and esophagus.",
    whyTricky:
      "Looks like a medial clavicle sprain; vital structure compression can be catastrophic.",
    mimics: "SC sprain, medial clavicle physeal injury in teens, costochondritis",
    steps: [
      "Trauma to shoulder/chest + medial clavicle pain; dysphagia, stridor, venous congestion are emergencies.",
      "Do not attempt blind reduction in clinic.",
      "CT angiography pathway and emergency specialist care.",
    ],
    redFlags: ["Dyspnea", "Stridor", "Swallowing difficulty", "Arm swelling/vascular signs"],
  },
  {
    id: 27,
    title: "First Rib Stress Fracture",
    category: "Occult bone injury — overhead athletes",
    actual:
      "Stress fracture of the first rib in throwers, rowers, or laborers with repetitive scapular load.",
    whyTricky:
      "Vague shoulder/neck/upper chest pain; standard shoulder MRI may omit the first rib.",
    mimics: "TOS, scalene strain, cuff tendinopathy",
    steps: [
      "Insidious upper thoracic/shoulder girdle pain in overhead athletes.",
      "Pain with deep breath, ipsilateral side-bend, or scapular loading.",
      "Dedicated rib radiographs/CT/bone scan/MRI as indicated.",
      "Relative rest from causative load.",
    ],
    imaging: "CT or MRI/bone scan; plain films may miss early lesions.",
  },
  {
    id: 28,
    title: "Slipping Rib Syndrome / Rib-Tip Syndrome",
    category: "Chest wall — underdiagnosed",
    actual:
      "Hypermobility of false ribs (often 8–10) irritating intercostal nerves, causing sharp flank/upper abdominal pain.",
    whyTricky:
      "Triggers GI work-ups for years; MSK cause is never examined.",
    mimics: "Cholecystitis, splenic flexure syndrome, intercostal strain",
    steps: [
      "Sharp positional pain under rib margin, “popping” sensation, reproducible with hooking maneuver by trained clinician.",
      "Pain reproducible to palpation of rib tip; GI red flags still screened.",
      "Dynamic ultrasound sometimes helpful; specialist chest-wall/MSK referral.",
    ],
  },
  {
    id: 29,
    title: "Maigne Syndrome (Thoracolumbar Junction Referral)",
    category: "Referred spinal pain",
    actual:
      "Dysfunction/irritation at T12–L2 referring to low back, iliac crest, groin, or trochanter via posterior rami / cluneal nerves.",
    whyTricky:
      "Patient and clinician focus on the lumbosacral pain site; the thoracolumbar junction is never examined.",
    mimics: "Facet L4–L5 pain, SI pain, GTPS, inguinal strain",
    steps: [
      "Iliac crest/buttock pain with tenderness of the iliac crest skin rolling (posterior rami territory).",
      "Examine thoracolumbar junction motion and provocation—not only L5–S1.",
      "If local LS treatments fail repeatedly, reassess T12–L2.",
    ],
  },
  {
    id: 30,
    title: "Bertolotti Syndrome (Lumbosacral Transitional Vertebra)",
    category: "Congenital variant with pain generator",
    actual:
      "Pain associated with a lumbosacral transitional vertebra and anomalous articulation (often L5 transverse process–sacrum).",
    whyTricky:
      "Variant is called “incidental”; true Bertolotti pain is under-recognized and over-called equally—needs careful linkage.",
    mimics: "Facet syndrome, SI pain, discogenic LBP",
    steps: [
      "Younger patient with unilateral lumbosacral pain; imaging shows transitional anatomy.",
      "Correlate side of anomaly with pain; diagnostic injection sometimes used by specialists.",
      "Do not attribute all LBP to Bertolotti—but do not ignore a matching pattern either.",
    ],
    imaging: "Lumbar radiographs/CT/MRI showing transitional vertebra.",
  },
  {
    id: 31,
    title: "Extraforaminal Far-Lateral Disc Herniation (e.g., L5–S1 far-out)",
    category: "Radiculopathy — MRI can miss if not looked for",
    actual:
      "Disc herniation lateral to the foramen compressing the exiting root (e.g., L5 at L5–S1 far-lateral).",
    whyTricky:
      "Standard MRI focus on the canal looks “normal”; severe root pain persists.",
    mimics: "Hip OA, GTPS, peroneal palsy, “MRI-negative sciatica”",
    steps: [
      "Severe root pain with negative canal reading—ask specifically about far-lateral/exit zones.",
      "L5 signs with L5–S1 far-lateral herniation pattern.",
      "Coronal/foraminal sequences or CT; specialist radiology review.",
    ],
    imaging: "MRI with attention to extraforaminal zones.",
  },
  {
    id: 32,
    title: "Thoracic Disc Herniation",
    category: "Central / thoracic neurologic",
    actual:
      "Thoracic disc prolapse causing band-like chest/abdominal pain or cord signs.",
    whyTricky:
      "Band-like pain triggers cardiac/GI pathways; thoracic spine is rarely examined.",
    mimics: "Intercostal neuralgia, cholecystitis, cardiac pain, shingles pre-rash",
    steps: [
      "Band-like trunk pain, worse with cough/sneeze; examine thoracic cord signs (gait, reflexes).",
      "If myelopathic signs → urgent MRI thoracic spine.",
      "Still exclude cardiac/visceral emergencies first when appropriate.",
    ],
    redFlags: ["Gait change", "Hyperreflexia", "Bowel/bladder change"],
  },
  {
    id: 33,
    title: "Cervical Artery Dissection Presenting as Neck Pain / Headache",
    category: "Vascular neurologic emergency",
    actual:
      "Dissection of carotid or vertebral artery presenting with neck pain, headache, or Horner’s—before stroke is obvious.",
    whyTricky:
      "Attributed to “cervical strain” after minor trauma or sudden movement; manipulation risk context.",
    mimics: "Mechanical neck pain, migraine, musculoskeletal headache",
    steps: [
      "Sudden unusual neck pain/headache, especially unilateral, ± Horner’s, pulsatile tinnitus, or neuro symptoms.",
      "Any focal neuro sign → emergency pathway (CTA/MRA), not physio progression.",
      "Avoid end-range cervical thrust when dissection possible.",
    ],
    redFlags: ["Horner’s syndrome", "Acute focal neurology", "Thunderclap or unique severe headache"],
  },
  {
    id: 34,
    title: "Pulmonary Embolism Mimicking Musculoskeletal Chest/Scapular Pain",
    category: "Medical emergency",
    actual:
      "PE presenting with pleuritic chest, scapular, or upper-back pain without obvious dyspnea at rest.",
    whyTricky:
      "Patients seek care for “rib strain” after travel or surgery.",
    mimics: "Rib sprain, costochondritis, scapular myalgia",
    steps: [
      "Risk factors: recent surgery, immobility, cancer, prior VTE, OCP, leg swelling.",
      "Pleuritic pain, tachycardia, breathlessness on exertion, hemoptysis.",
      "Wells/PERC-informed urgent medical assessment—not massage of the scapula.",
    ],
    redFlags: ["Syncope", "Hypoxia", "Hemoptysis", "Unilateral leg swelling"],
  },
  {
    id: 35,
    title: "Herpes Zoster Sine Herpete (Radicular Pain Before or Without Rash)",
    category: "Infectious neuropathic",
    actual:
      "Varicella-zoster reactivation causing severe dermatomal pain with delayed, minimal, or absent rash.",
    whyTricky:
      "Treated as radiculopathy or “muscle spasm” until vesicles appear—or they never clearly do.",
    mimics: "Cervical/lumbar radiculopathy, intercostal strain",
    steps: [
      "Acute unilateral burning dermatomal pain out of proportion, allodynia, older/immunocompromised patient.",
      "Inspect skin daily; early antiviral window if vesicles appear.",
      "Consider zoster in severe unexplained dermatomal pain.",
    ],
  },
  {
    id: 36,
    title: "Polymyalgia Rheumatica (PMR)",
    category: "Inflammatory — shoulder/hip girdle",
    actual:
      "Inflammatory condition of older adults with bilateral shoulder/hip girdle stiffness and pain, dramatically steroid-responsive.",
    whyTricky:
      "Labeled bilateral cuff tendinopathy or “fibromyalgia onset.”",
    mimics: "Bilateral rotator cuff disease, cervical spondylosis, hypothyroidism myalgia",
    steps: [
      "Age >50, bilateral shoulder ± pelvic girdle morning stiffness >45 minutes, systemic symptoms.",
      "Check ESR/CRP; screen for giant cell arteritis symptoms (headache, jaw claudication, vision).",
      "Rheumatology pathway—do not endless cuff rehab alone.",
    ],
    redFlags: ["Jaw claudication", "Visual disturbance", "New temporal headache"],
  },
  {
    id: 37,
    title: "Calcaneal Stress Fracture",
    category: "Occult bone injury — hindfoot",
    actual:
      "Stress fracture of the calcaneus in runners, military recruits, or osteoporotic patients.",
    whyTricky:
      "Heel pain is almost automatically plantar fasciitis.",
    mimics: "Plantar fasciitis, fat-pad contusion, Sever’s in teens",
    steps: [
      "Squeeze test of calcaneus positive; pain more posterior/body of calcaneus than fascia origin.",
      "Impact progression history; night pain possible.",
      "MRI if X-ray negative; unload early.",
    ],
    imaging: "MRI; X-ray late sclerosis/line.",
  },
  {
    id: 38,
    title: "Plantar Plate Tear (Metatarsophalangeal)",
    category: "Forefoot — underdiagnosed",
    actual:
      "Tear of the plantar plate at the MTP (often 2nd), causing pain, swelling, and progressive toe deformity.",
    whyTricky:
      "Called metatarsalgia or Morton’s neuroma; toe alignment slowly worsens.",
    mimics: "Morton’s neuroma, capsulitis, stress fracture of metatarsal",
    steps: [
      "Pain under MTP, swelling, positive drawer of toe, starting crossover toe deformity.",
      "Ultrasound/MRI for plantar plate integrity.",
      "Protect toe extension stress; foot & ankle specialist if unstable.",
    ],
    imaging: "Ultrasound or MRI.",
  },
  {
    id: 39,
    title: "Cuboid Syndrome",
    category: "Midfoot — clinical diagnosis",
    actual:
      "Painful disruption of cuboid position/mobility, often after inversion ankle injury or overuse.",
    whyTricky:
      "X-rays normal; residual lateral midfoot pain after “resolved sprain.”",
    mimics: "Peroneal tendinopathy, 5th MT stress reaction, sinus tarsi pain",
    steps: [
      "Lateral midfoot pain, pain with push-off, tenderness over cuboid.",
      "Often follows inversion sprain; peroneal tightness common.",
      "Clinical diagnosis; imaging excludes fracture. Trial of cuboid mobilization by skilled clinician.",
    ],
  },
  {
    id: 40,
    title: "Os Trigonum / Posterior Ankle Impingement",
    category: "Posterior ankle — dancers/soccer",
    actual:
      "Painful posterior impingement from os trigonum or Stieda process, often with FHL irritation.",
    whyTricky:
      "Labeled Achilles tendinopathy; pain is deeper and provoked by plantarflexion.",
    mimics: "Achilles insertional tendinopathy, posterior ankle sprain, FHL tenosynovitis alone",
    steps: [
      "Plantarflexion pain in dancers/soccer players; posteromedial/lateral ankle pain.",
      "Pain with forced PF; FHL tunnel signs may coexist.",
      "Lateral X-ray/MRI for os trigonum and soft-tissue edema.",
    ],
    imaging: "X-ray + MRI.",
  },
  {
    id: 41,
    title: "ECU Subluxation / Instability",
    category: "Ulnar wrist — dynamic",
    actual:
      "Disruption of the ECU subsheath allowing the tendon to snap over the ulnar groove.",
    whyTricky:
      "Static MRI may look nearly normal; patient describes painful snap with rotation.",
    mimics: "TFCC tear, ulnar styloid fracture, ECU tendinopathy without instability",
    steps: [
      "Painful snap on ulnar wrist with supination/ulnar deviation (racquet sports).",
      "Palpate ECU during rotation—reproduce subluxation.",
      "Dynamic ultrasound is highly useful; MRI for associated TFCC.",
    ],
    imaging: "Dynamic ultrasound ± MRI.",
  },
  {
    id: 42,
    title: "Intersection Syndrome",
    category: "Forearm / wrist tendinopathy — location trap",
    actual:
      "Tenosynovitis where 1st and 2nd dorsal compartments cross (~4 cm proximal to Lister’s).",
    whyTricky:
      "Confused with De Quervain, which is more distal at the radial styloid.",
    mimics: "De Quervain’s tenosynovitis, radial sensory neuritis",
    steps: [
      "Rowers/weightlifters with pain/crepitus proximal to the wrist on the radial forearm.",
      "Tenderness at intersection site, not primarily at styloid.",
      "Ultrasound confirms; activity modification and load management.",
    ],
  },
  {
    id: 43,
    title: "Wartenberg Syndrome (Superficial Radial Nerve)",
    category: "Peripheral nerve — sensory",
    actual:
      "Entrapment/neuritis of the superficial sensory branch of the radial nerve causing dorsal-radial hand dysesthesia.",
    whyTricky:
      "Called De Quervain or “cervical”; tight watch/brace history is missed.",
    mimics: "De Quervain, C6 radiculopathy, intersection syndrome",
    steps: [
      "Burning/numbness over dorsal first web without true motor loss.",
      "Tinel along radial sensory course; aggravation by ulnar flexion stretch.",
      "Remove compressive straps; differentiate from De Quervain Finkelstein-local pain.",
    ],
  },
  {
    id: 44,
    title: "Meralgia Paresthetica (Lateral Femoral Cutaneous Nerve)",
    category: "Peripheral nerve — sensory",
    actual:
      "Compression of the LFCN under the inguinal ligament causing lateral thigh burning/numbness.",
    whyTricky:
      "Labeled L2–L3 radiculopathy or “hip bursitis.”",
    mimics: "Lumbar radiculopathy, GTPS, hip OA referral",
    steps: [
      "Pure sensory lateral thigh symptoms; no motor deficit.",
      "Worse with tight belts, pregnancy, weight change; pelvic compression may ease.",
      "Normal hip motor exam; lumbar motor/reflex screen still done once.",
      "Usually clinical diagnosis; imaging if atypical or progressive.",
    ],
  },
  {
    id: 45,
    title: "Obturator Nerve Entrapment",
    category: "Peripheral nerve — medial thigh",
    actual:
      "Entrapment of the obturator nerve causing medial thigh pain and adductor weakness/paresthesia, seen in athletes after pelvic trauma or overuse.",
    whyTricky:
      "Medial thigh pain is called chronic adductor strain; nerve signs are subtle.",
    mimics: "Adductor tendinopathy, osteitis pubis, inguinal disruption",
    steps: [
      "Exercise-related medial thigh pain ± sensory change; adductor weakness out of proportion to tendon tenderness.",
      "Pain may be deep and poorly localized vs focal enthesis pain.",
      "MRI pelvis/EMG selectively; sports hip/groin specialist.",
    ],
  },
  {
    id: 46,
    title: "Athletic Pubalgia / Inguinal Disruption (Sports Hernia Complex)",
    category: "Groin — overlapping entities",
    actual:
      "Spectrum of injuries to the inguinal canal posterior wall, conjoined tendon, and rectus/adductor aponeurotic plate without a true hernia bulge.",
    whyTricky:
      "Normal hernia exam; athletes bounce between “adductor strain” and “hip impingement” labels.",
    mimics: "Adductor strain, FAI/labral pain, true inguinal hernia, osteitis pubis",
    steps: [
      "Sports cutting/sprinting; pain with sit-up and resisted adductor together.",
      "Examine inguinal canal, pubic plate, hip ROM/FAI signs—map the pain generator(s).",
      "MRI protocols for athletic pubalgia; surgical opinion if recalcitrant.",
    ],
    imaging: "Dedicated groin MRI.",
  },
  {
    id: 47,
    title: "Osteitis Pubis",
    category: "Pubic symphysis overuse / inflammation",
    actual:
      "Inflammatory/overuse condition of the pubic symphysis and adjacent bone, common in kicking/cutting sports.",
    whyTricky:
      "Overlaps with adductor enthesopathy and athletic pubalgia; imaging changes are nonspecific if clinical linkage is weak.",
    mimics: "Adductor tear, infection of symphysis (rare but serious), stress fracture",
    steps: [
      "Central pubic pain, pain with squeeze test, kicking sports.",
      "Exclude infection if fever/systemic signs.",
      "MRI for bone-edema pattern; graded return-to-run/kick program.",
    ],
    redFlags: ["Fever", "IVDU", "Severe constant night pain (infection/tumor)"],
  },
  {
    id: 48,
    title: "Baxter’s Nerve Entrapment (Inferior Calcaneal Nerve)",
    category: "Heel pain — neuropathic",
    actual:
      "Entrapment of the first branch of the lateral plantar nerve causing medial heel pain, sometimes with abductor digiti minimi denervation.",
    whyTricky:
      "Indistinguishable from plantar fasciitis at first glance; fails fascia-only care.",
    mimics: "Plantar fasciitis, fat-pad syndrome, calcaneal stress fracture",
    steps: [
      "Medial heel pain with burning quality; maximal tenderness more medial/proximal than fascia origin alone.",
      "Chronic cases: look for ADM atrophy on MRI.",
      "Screen S1 and tarsal tunnel concurrently.",
      "If classic fasciitis care fails, reopen neuropathic heel differentials.",
    ],
    imaging: "MRI may show ADM atrophy; diagnosis often clinical.",
  },
  {
    id: 49,
    title: "Complex Regional Pain Syndrome (CRPS) — Early",
    category: "Disproportionate pain syndrome",
    actual:
      "Disproportionate regional pain with sensory, vasomotor, sudomotor, and/or motor-trophic changes after trauma or surgery.",
    whyTricky:
      "Early CRPS is labeled “low pain threshold” or delayed healing; intervention window is missed.",
    mimics: "Normal post-fracture pain, infection, arterial insufficiency, malingering (incorrect)",
    steps: [
      "Pain disproportionate to injury stage; allodynia, color/temperature change, sweating change, edema, reduced ROM.",
      "Use Budapest clinical criteria; early specialist pain/rehab referral.",
      "Exclude infection and vascular occlusion first when signs overlap.",
      "Early gentle reactivation—avoid immobilization spirals.",
    ],
    redFlags: ["Rapid trophic change", "Severe allodynia blocking care"],
  },
  {
    id: 50,
    title: "Double Crush Syndrome (Proximal + Distal Nerve Compromise)",
    category: "Neurologic — multi-site",
    actual:
      "Coexistence of proximal (root/plexus/TOS) and distal (entrapment) lesions so neither alone fully explains the deficit/symptoms.",
    whyTricky:
      "Treating only carpal tunnel or only the neck fails; each site is “almost enough” to convince the clinician.",
    mimics: "Isolated CTS, isolated cervical radiculopathy, isolated cubital tunnel",
    steps: [
      "When distal release or isolated cervical care fails, re-screen the entire neural path.",
      "Map mixed distributions (e.g., CTS sensory + neck aggravation + positive Spurling).",
      "EMG can show dual lesions; treat both contributors.",
      "Ergonomic/load factors at multiple sites matter for durable recovery.",
    ],
  },
];

function drawHeader(doc) {
  doc
    .font("Helvetica-Bold")
    .fontSize(20)
    .fillColor("#0f2744")
    .text("The 50 Most Difficult Injuries to Detect — Volume 2", { align: "left" });
  doc.moveDown(0.3);
  doc
    .font("Helvetica")
    .fontSize(11)
    .fillColor("#334155")
    .text("A Second Clinical Research Brief — New High-Miss-Risk Presentations (No Overlap with Volume 1)", {
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
  const textX = x + 12;
  const width = doc.page.width - doc.page.margins.right - textX;
  doc.font("Helvetica").fontSize(10).fillColor("#1e293b");
  const y = doc.y;
  doc.text("•", x, y, { width: 12, continued: false });
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
  doc
    .font("Helvetica-Bold")
    .fontSize(12)
    .fillColor("#0f2744")
    .text(`${injury.id}. ${injury.title}`, { lineGap: 2 });
  doc.font("Helvetica-Oblique").fontSize(9).fillColor("#64748b").text(injury.category);
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
    "Volume 2 expands into pediatric slips/infections, occult pelvic and carpal fractures, dynamic tendon instability, vascular entrapments, post-surgical cyclops lesions, inflammatory girdle disease, and multi-site “double crush” neuropathy. None of these fifty titles repeat Volume 1.",
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
      Title: "The 50 Most Difficult Injuries to Detect — Volume 2",
      Author: "FisioterapIA Clinical Research Brief",
      Subject: "Second set of hard-to-detect MSK and referred injuries",
      Keywords: "differential diagnosis, occult fracture, neuropathy, vascular, pediatric, red flags",
    },
  });

  const stream = fs.createWriteStream(OUT);
  doc.pipe(stream);

  drawHeader(doc);

  sectionTitle(doc, "Abstract");
  body(
    doc,
    "This second volume catalogues fifty additional high-miss-risk presentations that commonly defeat “obvious local injury” reasoning. Emphasis shifts toward pediatric hip emergencies (SCFE, septic arthritis), occult pelvic and carpal bone injury, dynamic ulnar wrist and elbow instability, nerve entrapments with normal sensation or normal canal MRI, vascular syndromes in athletes (effort thrombosis, popliteal entrapment), post-ACLR cyclops lesions, inflammatory girdle disease, dermatomal zoster without rash, and double-crush neuropathy. Together with Volume 1, the set supports a 100-case expert detection library for clinicians and clinical AI validation.",
  );

  sectionTitle(doc, "Method & scope");
  body(
    doc,
    "Entries were chosen to avoid duplication with Volume 1 titles while preserving the same structure: true pathology, cognitive trap, usual mislabel, ordered detection steps, and imaging/red-flag notes. Educational use only—not a substitute for emergency protocols or specialty guidelines.",
  );

  sectionTitle(doc, "Cross-cutting detection principles (Volume 2 additions)");
  for (const p of [
    "In adolescents with knee pain, examine the hip before committing to a knee pathway (SCFE).",
    "In radial head fractures, always clear the wrist/DRUJ (Essex-Lopresti).",
    "Dynamic symptoms (snapping ECU, PLRI apprehension) need dynamic exam/ultrasound—not only static MRI.",
    "Exertional limb pain in the young: think vascular entrapment and effort thrombosis, not only compartments/tendons.",
    "When canal MRI is “normal” but root pain is severe, demand far-lateral / exit-zone review.",
  ]) {
    bullet(doc, p);
  }

  doc.addPage();
  buildToc(doc);

  doc.addPage();
  sectionTitle(doc, "The fifty injuries (Volume 2)");
  doc.moveDown(0.2);
  for (const injury of INJURIES) {
    renderInjury(doc, injury);
  }

  sectionTitle(doc, "Disclaimer");
  body(
    doc,
    "Educational research brief for physiotherapy/MSK clinical reasoning. Not a substitute for licensed medical assessment, emergency care, or specialty guidelines. Escalate immediately for infection, dissection, PE/DVT, posterior SC dislocation, septic joint, SCFE, and acute vascular syndromes.",
  );

  const pages = doc.bufferedPageRange();
  for (let i = 0; i < pages.count; i++) {
    doc.switchToPage(pages.start + i);
    doc
      .font("Helvetica")
      .fontSize(8)
      .fillColor("#94a3b8")
      .text(`Volume 2 · Page ${i + 1} of ${pages.count}`, doc.page.margins.left, doc.page.height - 36, {
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
