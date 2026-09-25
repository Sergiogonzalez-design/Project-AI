# AI video prompts — Functional athletic taping (vendaje funcional)

**For DaVinci AI / Kling / Runway / Luma / Sora (image-to-video)**

Taping is one of the hardest things for generative video AI: tape looks like skin, strips melt together, paths reverse, sticky side flips, and hands teleport. This document is written so the model has **almost no room to invent geometry**.

---

## Folder layout

| What | Path |
|------|------|
| Reference stills | `public/taping/` — prefer `*-start.png` for DaVinci input; `*-end.png` / finished stills are targets only |
| Prompts (this file) | `public/taping/TAPING_AI_PROMPTS.md` |
| Export videos | `public/taping/videos/<id>.mp4` |

For each technique: upload the **START** image to DaVinci. Finished photos alone usually produce a static “already taped” clip.

---

## DaVinci AI — how to run each shot (do not skip)

### Critical: START frame vs END frame

If you feed DaVinci a **finished taped photo**, it usually **freezes on the end result** and never shows application. Always upload the **START** image (bare joint / ready to tape) as the main image / first frame.

| Role | What to upload |
|------|----------------|
| **START (required)** | Bare skin, clinician ready with tape roll — video begins here |
| **END / target (optional if tool supports end-frame)** | Finished taping still — geometry to morph toward |

1. **Image-to-video only.** Upload the **START** PNG for that technique. Do not text-to-video taping from scratch. Do **not** use the finished still as the only input.
2. If DaVinci / the model offers **first frame + last frame**: START = first, END = last.
3. Paste the **FULL PROMPT** (including NEGATIVE / FAILURE AVOIDANCE). Do not shorten.
4. Duration **10 seconds**. Lock camera (no orbit, no zoom punches).
5. Pace for 10 s: fewer strips is OK if the **active path direction** stays unmistakable; never rush so fast that geometry blurs.
6. Motion: **slow clinical hands only**. Prefer “minimal camera motion, high subject detail”. The ankle must **gain tape over time** — never stay bare and never stay fully finished for the whole clip.
7. Export: H.264 `.mp4`, no music, no captions burned in.
8. If the take only shows the finished job: you used the END image as input — switch to START and regenerate. If tape melts or stirrups reverse: same prompt + stronger path wording; do not shorten.

### Why AI fails on taping (teach the model by naming failures)

Common failure modes — each prompt forbids them explicitly:

- Tape painted onto skin with no strip edges / no overlaps
- Sticky side outward or roll floating in air
- Stirrup direction reversed (medial↔lateral swap)
- Anchors crossing the joint like a tourniquet
- Toes / fingers wrapped shut
- Hands morphing, extra fingers, tape spawning already finished
- Cartoon / glossy CGI tape, logos, subtitles, watermarks
- Blood, injury gore, brand packaging in frame

### Material defaults

- **Rigid athletic tape** (zinc oxide style), **white**, matte, visible woven texture
- Width: **~3.8 cm (1.5")** ankle / wrist / elbow / thumb; **~5 cm (2")** knee / some shoulder
- Tear ends square; show peeling from roll; **sticky side toward skin**
- Underwrap only if the prompt says so
- Elastic **kinesiology tape** only for neck / lumbar cues (never rigid circumferential neck)

### Camera language (all rigid-tape clips)

- Steady tripod, medium close-up on the joint
- Three-quarter angle so **start landmark → path → end landmark** are all visible in one frame
- Soft neutral clinic lighting, shallow but readable depth of field
- One clinician (light blue scrubs), one adult patient; calm, educational
- No text, logos, watermarks, captions, UI chrome

### Shared clinical language

**Anchors** = circular strips that **do not cross the joint**; they fix ends of active strips.

**Active strips** = strips that cross the joint to **limit a named motion**:

| Goal | Active path (ankle stirrup) | Foot position while applying |
|------|----------------------------|------------------------------|
| Limit **inversion** | MEDIAL → under heel → LATERAL (tension on lateral upward pass) | Slight DF (~10°) + slight **eversion** |
| Limit **eversion** | LATERAL → under heel → MEDIAL (tension on medial upward pass) | Slight DF + slight **inversion** |

---

## GLOBAL NEGATIVE (append mentally to every prompt)

```
NEGATIVE / DO NOT GENERATE:
melting tape into skin, invisible strip edges, tape with no overlap layers,
reversed stirrup direction, sticky side facing out, floating tape roll,
tourniquet circumferential wrap across joint, toes or fingers fully enclosed,
extra fingers, morphing hands, teleporting strips, already-finished tape
appearing before hands place it, cartoon style, CGI plastic shine, blood,
gore, wounds, brand logos, packaging text, subtitles, captions, watermarks,
on-screen text, shaky cam, rapid cuts, music UI, black bars with titles
```

---

## COMMON_SUFFIX (end every prompt with this)

```
Educational physiotherapy demonstration, realistic clinic, soft neutral lighting,
white matte rigid athletic tape with CLEAR woven texture and VISIBLE strip edges
and 50% overlaps, anatomically accurate landmarks, slow deliberate clinician hands,
sticky side to skin, peel from roll then place then smooth with palm,
no blood, no gore, no logos, no captions, no watermarks, no on-screen text,
camera locked steady, continuous single take, 10 seconds.
```

---

# TECHNIQUES

---

## 1. ankle-figure-8-inversion-lock

| | |
|--|--|
| **IMAGE START (upload this)** | `public/taping/ankle-figure-8-taping-start.png` |
| **IMAGE END (target / optional last frame)** | `public/taping/ankle-figure-8-taping-end.png` (same as `ankle-figure-8-taping.png`) |
| **FILE OUT** | `ankle-figure-8-inversion-lock.mp4` |
| **GOAL** | Limit **inversion** (lateral ankle sprain protection): stirrups + heel locks + figure-8 |
| **DURATION** | 10 s |

**DaVinci input:** upload **`ankle-figure-8-taping-start.png` only** as the image. If the tool has first+last frame, set START = start PNG, END = end PNG. Do not upload the finished taped photo alone — that makes a static “already done” clip.

### Geometry lock (model must obey)

- Proximal anchors: **2** circles on **lower third of shin, ABOVE both malleoli** (not on joint)
- Distal anchors: **2** circles on **midfoot / metatarsal shafts**; **all toes free**
- Stirrups ×2 (10 s budget): start **MEDIAL** proximal anchor → down past medial malleolus → **under calcaneus** → up past **lateral** malleolus → proximal anchor; tension on **lateral ascent**
- Heel locks: cup calcaneus left and right
- Figure-8: clear **X on dorsum** of foot–ankle
- Protected position whenever active strips go on: **slight DF + slight eversion** (clinician’s free hand holds it)

### Second-by-second timeline (compressed for 10 s — prioritize path clarity over strip count)

| t | Action |
|---|--------|
| 0–1 s | START frame: bare ankle; peel first strip; sticky side visible; tape not on skin yet |
| 1–2.5 s | Proximal anchors ×2 + distal midfoot anchors ×2 (toes free); smooth |
| 2.5–5.5 s | Stirrups ×2 (not 3): medial→plantar→lateral; hold everted DF; smooth each |
| 5.5–7 s | One clear heel lock cupping calcaneus |
| 7–9 s | Figure-8 with clear dorsal **X** (one strong crossing is enough) |
| 9–10 s | Closing anchors + **final hold** matching END image |

### FULL PROMPT

```
IMAGE-TO-VIDEO FROM THE START FRAME PROVIDED.
The uploaded image is the FIRST FRAME: bare RIGHT ankle/foot on a clinic table, ZERO tape on the skin yet, clinician in light blue scrubs holding a white rigid athletic tape roll ready to apply. Keep the SAME camera angle, SAME foot pose, SAME clinic background for the whole shot.

Animate a continuous 10-second APPLICATION sequence: tape must APPEAR progressively on the ankle (bare → anchors → stirrups → heel lock → figure-8 → finished). Do NOT freeze on a finished taped ankle. Do NOT keep the ankle bare after 1s. Do NOT teleport a full finished job in one frame.

If an END / last-frame image is also provided, morph toward that finished figure-8 + stirrup pattern by second 9–10. If no end frame, invent the finished look from the steps below.

Scene lock: soft neutral clinic light, pants rolled, right lower leg and bare foot visible at start. White matte rigid athletic tape ~3.8 cm (1.5 in), woven texture, sharp strip edges. Camera LOCKED, three-quarter MEDIAL-to-front so medial malleolus, dorsum, plantar heel edge, and lateral malleolus stay readable.

Protected position (during ALL active strips): ~10° dorsiflexion AND slight eversion (not inverted). Non-dominant hand stabilizes the foot.

CRITICAL MOTION LIMITED: INVERSION. Every active strip resists inversion.

Timeline (must change every phase):

0–1s START: Bare skin only. Peel strip from roll; sticky side toward skin; approach the shin. No tape stuck yet.

1–2.5s ANCHORS: Apply TWO proximal circular strips on lower shin ABOVE both malleoli (join on anterior shin, not a tourniquet, do not cross the joint). Then TWO distal midfoot circles over metatarsal shafts; ALL toes free. Palm-smooth. Ankle now has anchors only.

2.5–5.5s STIRRUPS ×2 (do not reverse): Each strip STARTS MEDIAL on proximal anchor → DOWN past medial malleolus → UNDER heel → UP LATERAL past lateral malleolus → ends on proximal anchor. CLEAR tension on the LATERAL upward pass. Overlap ~50%. Smooth each; strip edges visible.

5.5–7s HEEL LOCK: One clear heel lock cupping calcaneus (medial→under→lateral). Keep protected position.

7–9s FIGURE-8: Create a clear white “X” on the DORSUM (medial start / lateral reinforcement, anti-inversion).

9–10s CLOSE: Proximal + distal closing circles. Smooth malleoli + dorsum. End on finished figure-8 + stirrups matching the end-target look; toes free; slight DF/eversion.

Hands move slowly; no morphing fingers; tape does not appear fully finished before the closing phase. Educational physiotherapy demonstration, anatomically accurate, camera steady, 10 seconds.
NEGATIVE: static finished tape for the whole video, bare ankle for the whole video, melting tape, reversed medial-lateral stirrup, toes wrapped, tourniquet, logos, captions, watermarks, text, cartoon, blood, gore, shaky cam.
```

---

## 2. ankle-eversion-lock

| | |
|--|--|
| **IMAGE START (upload this)** | `public/taping/ankle-eversion-lock-start.png` |
| **IMAGE END (optional last frame)** | `public/taping/ankle-eversion-lock-end.png` |
| **FILE OUT** | `ankle-eversion-lock.mp4` |
| **GOAL** | Limit **eversion** (medial / deltoid protection): stirrups + heel lock + figure-8 |
| **DURATION** | 10 s |

**DaVinci input:** upload **`ankle-eversion-lock-start.png` only** as the image. If first+last frame: START = start PNG, END = end PNG. Do not upload the finished photo alone.

### Geometry lock (model must obey)

- Proximal anchors ×2 on lower shin **ABOVE** both malleoli
- Distal anchors ×2 on midfoot; **toes free**
- Stirrups ×2: **LATERAL → under heel → MEDIAL**; tension on **medial ascent** (OPPOSITE of inversion stirrups)
- Heel lock cupping calcaneus with medial restraint
- Figure-8 with dorsal X reinforcing **medial** complex
- Protected position during actives: slight DF + slight **inversion**
- Camera: three-quarter **LATERAL-to-front**

### Second-by-second timeline (10 s)

| t | Action |
|---|--------|
| 0–1 s | START: bare ankle; peel strip; sticky visible; nothing stuck yet |
| 1–2.5 s | Proximal ×2 + distal ×2 anchors; toes free |
| 2.5–5.5 s | Stirrups ×2 lateral→plantar→medial; tension medially; hold inverted DF |
| 5.5–7 s | One heel lock cupping calcaneus |
| 7–9 s | Figure-8 / dorsal X with medial bias |
| 9–10 s | Closing + final hold matching END (medial denser) |

### FULL PROMPT

```
IMAGE-TO-VIDEO FROM THE START FRAME PROVIDED.
The uploaded image is the FIRST FRAME: bare RIGHT ankle/foot on a clinic table, ZERO tape on the skin yet, clinician in light blue scrubs holding a white rigid athletic tape roll ready. Keep the SAME camera angle, SAME foot pose, SAME clinic background for the whole shot.

Animate a continuous 10-second APPLICATION sequence: tape must APPEAR progressively (bare → anchors → stirrups → heel lock → figure-8 → finished). Do NOT freeze on a finished taped ankle. Do NOT keep the ankle bare after 1s. Do NOT teleport a full finished job in one frame.

If an END / last-frame image is also provided, morph toward that finished eversion-lock pattern by second 9–10.

Scene lock: soft neutral clinic light, pants rolled, right lower leg and bare foot visible at start. White matte rigid athletic tape ~3.8 cm (1.5 in), woven texture, sharp strip edges. Camera LOCKED, three-quarter LATERAL-to-front so lateral malleolus, dorsum, plantar heel edge, and medial malleolus stay readable.

Protected position (during ALL active strips): ~10° dorsiflexion AND slight INVERSION (not everted). Non-dominant hand stabilizes the foot.

CRITICAL MOTION LIMITED: EVERSION (foot rolling outward / medial ankle sprain pattern). Every active strip resists eversion. This is the OPPOSITE stirrup direction of an inversion-lock.

Timeline (must change every phase):

0–1s START: Bare skin only. Peel strip from roll; sticky side toward skin; approach the shin. No tape stuck yet.

1–2.5s ANCHORS: Apply TWO proximal circular strips on lower shin ABOVE both malleoli (join on anterior shin, not a tourniquet, do not cross the joint). Then TWO distal midfoot circles over metatarsal shafts; ALL toes free. Palm-smooth. Ankle now has anchors only.

2.5–5.5s STIRRUPS ×2 (CRITICAL — do not reverse): Each strip STARTS LATERAL on proximal anchor → DOWN past lateral malleolus → UNDER heel → UP MEDIAL past medial malleolus → ends on proximal anchor. CLEAR tension on the MEDIAL upward pass. Overlap ~50%. Smooth each; strip edges visible. Medial complex should look denser.

5.5–7s HEEL LOCK: One clear heel lock cupping calcaneus with medial restraint emphasis. Keep protected position (slight DF + inversion).

7–9s FIGURE-8: Create a clear white “X” on the DORSUM starting laterally so the crossing reinforces the medial complex (anti-eversion).

9–10s CLOSE: Proximal + distal closing circles. Smooth malleoli + dorsum. End on finished eversion-lock matching the end-target look; toes free; slight DF/inversion; denser white on medial side.

Hands move slowly; no morphing fingers; tape does not appear fully finished before the closing phase. Educational physiotherapy demonstration, anatomically accurate, camera steady, 10 seconds.
NEGATIVE: static finished tape for the whole video, bare ankle for the whole video, melting tape, reversed stirrup (medial-first like inversion-lock), toes wrapped, tourniquet, logos, captions, watermarks, text, cartoon, blood, gore, shaky cam.
```

---

## 3. ankle-combined-inversion-eversion

| | |
|--|--|
| **IMAGE START (upload this)** | `public/taping/ankle-combined-full-start.png` |
| **IMAGE END (optional last frame)** | `public/taping/ankle-combined-full-end.png` |
| **FILE OUT** | `ankle-combined-inversion-eversion.mp4` |
| **GOAL** | Teaching: show **both** active systems; directions must stay visually opposite |
| **DURATION** | 10 s |

### FULL PROMPT

```
IMAGE-TO-VIDEO FROM THE START FRAME (bare ankle). Teaching clip: progressive tape application in 10 seconds — FIRST anti-INVERSION actives, THEN anti-EVERSION actives, then close. Same camera as start. Do not freeze on finished basket-weave.

Clinic, seated patient, bare right foot, light blue scrubs, white rigid tape ~3.8 cm, locked three-quarter front-medial camera.

Phase A (0–1.5s): Proximal + distal anchors (readable; toes free).
Phase B (1.5–4.5s): ONE anti-INVERSION stirrup: MEDIAL → under heel → LATERAL, foot in DF + slight eversion. Brief anti-inversion dorsal cross.
Phase C (4.5–8s): Reposition to DF + slight inversion. ONE anti-EVERSION stirrup: LATERAL → under heel → MEDIAL. Brief anti-eversion dorsal cross.
Phase D (8–10s): Closing anchors + final hold matching the dense combined reference.
(Keep opposite stirrup directions unmistakable even with fewer strips.)

Emphasize opposite stirrup directions with clear strip edges and overlaps. No melting into one white sock. Educational demo, camera steady, 10 seconds.
NEGATIVE: same-direction stirrups only, melting tape, logos, text, captions, watermarks, cartoon, blood.
```

---

## 4. knee-mcl-support

| | |
|--|--|
| **IMAGE START (upload this)** | `public/taping/knee-mcl-support-start.png` |
| **IMAGE END (optional last frame)** | `public/taping/knee-mcl-support-end.png` |
| **FILE OUT** | `knee-mcl-support.mp4` |
| **GOAL** | Limit **valgus** / support MCL |
| **DURATION** | 10 s |

### Geometry lock

- Knee flexed **~20–30°**
- Proximal circle: distal thigh **above patella**
- Distal circle: proximal tibia **below tibial tuberosity**
- **3** vertical actives crossing **MEDIAL joint line**; overlap ~50%; **do not compress patella**
- Camera: three-quarter **medial**

### Second-by-second (10 s)

| t | Action |
|---|--------|
| 0–1 s | Establish medial knee; peel tape (~5 cm) |
| 1–2.5 s | Proximal + distal anchors |
| 2.5–7.5 s | Vertical actives ×2–3 across MCL line with distal tension resisting valgus |
| 7.5–8.5 s | Optional quick medial X (skip if behind) |
| 8.5–10 s | Closing anchors + final hold |

### FULL PROMPT

```
IMAGE-TO-VIDEO FROM THE START FRAME (bare medial knee flexed ~20–30°, tape ready). Apply white rigid tape (~5 cm) to support MCL / LIMIT VALGUS over 10 seconds, same camera. Progress bare→anchors→vertical actives→close. Do not freeze on finished tape.

Clinic soft light, shorts rolled, clinician light blue scrubs. Camera three-quarter MEDIAL view of the knee. Matte white tape with clear strip edges.

Sequence:
1) Proximal circular anchor around distal thigh well ABOVE the patella; smooth.
2) Distal circular anchor around proximal tibia / upper calf BELOW tibial tuberosity; smooth.
3) ACTIVE STRIPS (limit valgus): THREE vertical strips from proximal anchor to distal anchor crossing the MEDIAL joint line (MCL line). Apply with knee flexed; pull the distal end with tension that resists the tibia going into valgus. Overlap ~50% from posteromedial to anteromedial. Do NOT lay compressing tape over the patella.
4) Optional light X / crossing strips only on the medial joint line.
5) Closing circular strips over free ends. Final still matches reference: medial vertical fan spanning MCL.

Slow palm-smoothing after each strip. Educational physiotherapy demo, anatomically accurate, camera steady, 10 seconds.
NEGATIVE: tape crushing patella, melting strips, logos, text, captions, watermarks, cartoon, blood, varus-focused lateral strips by mistake.
```

---

## 5. knee-lcl-support

| | |
|--|--|
| **IMAGE START (upload this)** | `public/taping/knee-lcl-support-start.png` |
| **IMAGE END (optional last frame)** | `public/taping/knee-lcl-support-end.png` |
| **FILE OUT** | `knee-lcl-support.mp4` |
| **GOAL** | Limit **varus** / support LCL |
| **DURATION** | 10 s |

### FULL PROMPT

```
IMAGE-TO-VIDEO FROM THE START FRAME (bare lateral knee). Progressive LCL / LIMIT VARUS taping, 10 seconds, same lateral camera, knee flexed ~20–30°. Do not freeze on finished tape.

White rigid tape ~5 cm. Proximal thigh circular anchor above patella level laterally; distal tibial circular anchor. THREE overlapping vertical ACTIVE strips crossing the LATERAL joint line from proximal to distal with tension resisting varus. Optional lateral X. Closing anchors. Final hold matches reference.

Clear strip edges, slow hands, no melting. Educational demo, no logos/text/captions/watermarks, camera steady, 10 seconds.
NEGATIVE: medial MCL pattern, melting tape, logos, text, cartoon, blood.
```

---

## 6. knee-patellar-medial-glide-limit

| | |
|--|--|
| **IMAGE START (upload this)** | `public/taping/knee-patella-tape-start.png` |
| **IMAGE END (optional last frame)** | `public/taping/knee-patella-tape-end.png` |
| **FILE OUT** | `knee-patellar-medial-glide-limit.mp4` |
| **GOAL** | McConnell-style: limit **lateral** patellar glide via **medial** active pull |
| **DURATION** | 10 s |

### FULL PROMPT

```
IMAGE-TO-VIDEO FROM THE START FRAME (bare anterior knee). McConnell-style medializing patellar tape over 10 seconds, same close-up. Progress bare→manual medial glide hold→active strip→finish. Do not freeze on finished tape.

1) Optional thin under-tape base only if needed; otherwise bare skin.
2) Clinician manually glides patella slightly MEDIAL and HOLDS.
3) ACTIVE rigid strip STARTS on LATERAL border of patella → crosses over patella → ANCHORS firmly on MEDIAL femoral condyle / medial soft tissue with tension that MAINTAINS the medial glide (limits lateral tracking). Sticky side to skin; smooth without losing medial hold.
4) Optional second reinforcing strip slightly inferior or superior.
5) Final hold: patella centered, medializing tape obvious, matching reference.

Educational physiotherapy demo, clear tape edges, camera locked, 10 seconds.
NEGATIVE: lateralizing pull, melting tape, logos, text, captions, watermarks, cartoon, blood.
```

---

## 7. shoulder-ac-joint-support

| | |
|--|--|
| **IMAGE START (upload this)** | `public/taping/shoulder-ac-support-start.png` |
| **IMAGE END (optional last frame)** | `public/taping/shoulder-ac-support-end.png` |
| **FILE OUT** | `shoulder-ac-joint-support.mp4` |
| **GOAL** | Limit superior AC separation / settle distal clavicle |
| **DURATION** | 10 s |

**DaVinci input:** upload **`shoulder-ac-support-start.png` only**. If first+last: START + END. Do not upload finished alone.

### Geometry lock (model must obey)

- **NECK MUST STAY FREE** — never wrap tape around throat / circumferential neck
- Proximal anchor: short strip on **upper trapezius / superior scapula only** (not circling neck)
- Distal anchor: mid-**deltoid** / upper arm (elbow free)
- Actives ×2–3: from over **distal clavicle / AC joint STRAIGHT DOWN** onto deltoid with **downward** tension settling distal clavicle
- Optional short **horizontal** strip across AC only
- Camera: anterior-lateral three-quarter on right shoulder

### Second-by-second timeline (10 s)

| t | Action |
|---|--------|
| 0–1 s | START: bare shoulder; peel tape; nothing stuck |
| 1–3 s | Trap/scap anchor + mid-deltoid anchor (neck free) |
| 3–7.5 s | 2–3 downward AC actives distal clavicle → deltoid |
| 7.5–9 s | Optional short horizontal across AC; smooth |
| 9–10 s | Final hold matching END |

### FULL PROMPT

```
IMAGE-TO-VIDEO FROM THE START FRAME PROVIDED.
The uploaded image is the FIRST FRAME: bare RIGHT shoulder with ZERO tape on skin, adult patient in tank top or shirtless so distal clavicle, AC joint, upper trapezius and deltoid are visible. Clinician in light blue scrubs holds a white rigid athletic tape roll ready. Keep SAME camera, SAME pose, SAME background.

Animate a continuous 10-second APPLICATION: bare → anchors → downward AC actives → finished. Do NOT freeze on finished tape. Do NOT keep the shoulder bare after 1s. Do NOT teleport a finished job.

If an END / last-frame is provided, morph toward that AC support pattern by second 9–10.

Scene lock: soft clinic light. White matte rigid athletic tape ~3.8–5 cm, woven texture, sharp strip edges. Camera LOCKED anterior-lateral three-quarter on the right shoulder.

CRITICAL SAFETY: NEVER wrap tape around the neck or throat. Neck skin stays completely free for the whole video. No circumferential cervical tape.

CRITICAL GOAL: limit SUPERIOR separation of the AC joint / settle the distal clavicle with DOWNWARD active strips.

Timeline:

0–1s START: Bare shoulder only. Peel strip; sticky toward skin; approach trap/AC area. Nothing stuck yet.

1–3s ANCHORS: Place ONE short proximal anchor on upper trapezius / superior scapula ONLY (do not circle the neck). Place ONE mid-deltoid / upper-arm anchor that does not block elbow motion. Smooth. Shoulder has anchors only; neck free.

3–7.5s ACTIVES ×2–3 (CRITICAL): Each strip starts over the distal clavicle / AC joint and runs STRAIGHT DOWN onto the deltoid anchor with clear DOWNWARD tension that settles the distal clavicle (limits superior AC separation). Overlap ~50%. Visible strip edges. Smooth each. Do not route strips around the neck.

7.5–9s OPTIONAL: One short horizontal strip across the AC joint only. Smooth deltoid + AC.

9–10s CLOSE: Palm-smooth. Final hold matching end-target: downward AC strips obvious, neck free, elbow free.

Slow deliberate hands; no morphing; no finished pattern before closing. Educational physiotherapy demonstration, anatomically accurate, camera steady, 10 seconds.
NEGATIVE: tape around neck/throat, choking wrap, static finished tape whole video, bare shoulder whole video, melting tape, logos, captions, watermarks, text, cartoon, blood, gore, shaky cam.
```

---

## 8. shoulder-glenohumeral-anterior-limit

| | |
|--|--|
| **IMAGE START (upload this)** | `public/taping/shoulder-anterior-stability-start.png` |
| **IMAGE END (optional last frame)** | `public/taping/shoulder-anterior-stability-end.png` |
| **FILE OUT** | `shoulder-glenohumeral-anterior-limit.mp4` |
| **GOAL** | Limit excessive **anterior** humeral translation |
| **DURATION** | 10 s |

### FULL PROMPT

```
IMAGE-TO-VIDEO FROM THE START FRAME (bare shoulder). Anterior GH stability taping over 10 seconds, same camera, ~20° abd + slight ER. Progress bare→anchors→anterior sling actives→finish. Do not freeze on finished tape.

1) Posterior scapular / posterior deltoid anchor.
2) Anterior proximal humerus anchor (no aggressive chest compression).
3) ACTIVE strips from posterior around humeral head to anterior spanning the anterior joint line, tension resisting ANTERIOR glide of the humeral head. 2–3 overlapping strips forming an anterior sling.
4) Closing. Final hold matching reference.

Slow readable placement, clear edges. Educational demo, camera steady, 10 seconds.
NEGATIVE: melting tape, logos, text, captions, watermarks, cartoon, blood, gore.
```

---

## 9. elbow-lateral-epicondylalgia

| | |
|--|--|
| **IMAGE START (upload this)** | `public/taping/elbow-lateral-epi-start.png` |
| **IMAGE END (optional last frame)** | `public/taping/elbow-lateral-epi-end.png` |
| **FILE OUT** | `elbow-lateral-epicondylalgia.mp4` |
| **GOAL** | Unload common extensor origin |
| **DURATION** | 10 s |

### FULL PROMPT

```
IMAGE-TO-VIDEO FROM THE START FRAME (bare lateral elbow). Progressive unloading taping over 10 seconds, same camera. Do not freeze on finished tape.

1) Anchor just distal to lateral epicondyle on proximal forearm extensors.
2) Anchor near mid-forearm over extensor mass.
3) ACTIVE fan strips from near lateral epicondyle toward wrist/extensor direction with tension that slightly SHORTENS / unloads the common extensor tendon (reduce stress from wrist extension/grip). 2–3 strips over extensor wad; visible edges and fan.
4) Optional light non-tourniquet circular secure.
5) Final hold matching reference.

Educational demo, no logos/text/captions/watermarks, camera steady, 10 seconds.
NEGATIVE: medial elbow pattern, melting tape, tourniquet, logos, text, cartoon, blood.
```

---

## 10. elbow-medial-epicondylalgia

| | |
|--|--|
| **IMAGE START (upload this)** | `public/taping/elbow-medial-epi-start.png` |
| **IMAGE END (optional last frame)** | `public/taping/elbow-medial-epi-end.png` |
| **FILE OUT** | `elbow-medial-epicondylalgia.mp4` |
| **GOAL** | Unload common flexor-pronator origin |
| **DURATION** | 10 s |

### FULL PROMPT

```
IMAGE-TO-VIDEO FROM THE START FRAME (bare medial elbow). Progressive flexor-pronator unload taping over 10 seconds, same camera. Do not freeze on finished tape.

Anchors on proximal medial forearm; 2–3 ACTIVE fan strips unloading common flexor-pronator origin with tension limiting stress from wrist flexion/pronation; secure ends without tourniquet; final hold matches reference.

Clear strip edges, slow hands. Educational demo, camera steady, 10 seconds.
NEGATIVE: lateral tennis-elbow pattern only, melting tape, logos, text, cartoon, blood.
```

---

## 11. wrist-extension-limit

| | |
|--|--|
| **IMAGE START (upload this)** | `public/taping/wrist-extension-limit-start.png` |
| **IMAGE END (optional last frame)** | `public/taping/wrist-extension-limit-end.png` |
| **FILE OUT** | `wrist-extension-limit.mp4` |
| **GOAL** | Limit **wrist extension** |
| **DURATION** | 10 s |

### Geometry lock

- Protected position while actives applied: wrist in **slight flexion**
- Actives: **3** longitudinal strips on **DORSUM** across radiocarpal joint, distal→proximal tension resisting extension
- Fingers free; proximal forearm + mid-metacarpal anchors

### FULL PROMPT

```
IMAGE-TO-VIDEO FROM THE START FRAME (bare wrist/hand). Progressive dorsal extension-limit taping over 10 seconds, same camera. Do not freeze on finished tape.

Protected position during active strips: wrist held in slight FLEXION.

1) Proximal circular anchor around distal forearm.
2) Distal circular anchor around mid-metacarpals; fingers free.
3) ACTIVE (CRITICAL): three overlapping longitudinal strips across the DORSUM of the wrist from hand toward forearm with tension that pulls into slight flexion and RESISTS extension spanning the radiocarpal joint. Show peel, sticky-to-skin, smooth.
4) Optional light dorsal X without vascular compression.
5) Closing anchors. Final hold: slight flexion, dorsal actives obvious, matches reference.

Educational demo, camera steady, 10 seconds.
NEGATIVE: volar-only strips, melting tape, fingers wrapped shut, logos, text, captions, watermarks, cartoon, blood.
```

---

## 12. wrist-flexion-limit

| | |
|--|--|
| **IMAGE START (upload this)** | `public/taping/wrist-flexion-limit-start.png` |
| **IMAGE END (optional last frame)** | `public/taping/wrist-flexion-limit-end.png` |
| **FILE OUT** | `wrist-flexion-limit.mp4` |
| **GOAL** | Limit **wrist flexion** |
| **DURATION** | 10 s |

**DaVinci input:** upload **`wrist-flexion-limit-start.png` only**. If first+last: START + END.

### Geometry lock (model must obey)

- Camera shows **VOLAR / palm side** of wrist clearly
- Protected position during actives: wrist in **slight EXTENSION**
- Proximal circular anchor on distal forearm
- Distal circular anchor on mid-metacarpals; **fingers free**
- Actives ×3: overlapping **longitudinal VOLAR** strips across radiocarpal joint resisting flexion (this is the OPPOSITE of dorsal extension-limit)
- Bare hands preferred (no gloves)

### Second-by-second timeline (10 s)

| t | Action |
|---|--------|
| 0–1 s | START: bare volar wrist; peel tape |
| 1–3 s | Proximal + distal anchors; fingers free |
| 3–8 s | THREE overlapping volar longitudinal actives |
| 8–10 s | Closing + final hold slight extension |

### FULL PROMPT

```
IMAGE-TO-VIDEO FROM THE START FRAME PROVIDED.
The uploaded image is the FIRST FRAME: bare adult RIGHT forearm/wrist/hand with ZERO tape on skin, VOLAR (palm) side facing camera, wrist resting in slight EXTENSION on a clinic table. Clinician in light blue scrubs, bare hands (no gloves), holding white rigid athletic tape roll ready. Keep SAME camera, SAME pose, SAME background.

Animate a continuous 10-second APPLICATION: bare → anchors → volar actives → finished. Do NOT freeze on finished tape. Do NOT keep the wrist bare after 1s. Do NOT teleport a finished job.

If an END / last-frame is provided, morph toward that volar flexion-limit pattern by second 9–10.

Scene lock: soft clinic light. White matte rigid athletic tape ~3.8 cm, woven texture, sharp strip edges. Camera LOCKED medium close-up on the VOLAR wrist.

Protected position during ALL active strips: wrist held in slight EXTENSION (not flexed). Non-dominant hand may stabilize.

CRITICAL MOTION LIMITED: WRIST FLEXION. Actives must be on the VOLAR side (palm side), NOT the dorsum. This is the opposite of extension-limit taping.

Timeline:

0–1s START: Bare volar wrist only. Peel strip; sticky toward skin. Nothing stuck yet.

1–3s ANCHORS: ONE proximal circular anchor around distal forearm (not crossing the radiocarpal joint as a tourniquet). ONE distal circular anchor around mid-metacarpals; ALL fingers free and movable. Smooth. Wrist has anchors only.

3–8s ACTIVES ×3 (CRITICAL): Apply THREE overlapping longitudinal strips on the VOLAR surface of the wrist spanning the radiocarpal joint from hand toward forearm (or forearm toward hand) with tension that maintains slight EXTENSION and RESISTS flexion. ~50% overlap. Clear strip edges. Peel → place → palm-smooth each. Do NOT place the main actives on the dorsum only.

8–10s CLOSE: Light closing over anchors if needed. Final hold: slight extension, three clear volar actives, fingers free, matching end-target.

Slow hands; no morphing; no finished pattern early. Educational physiotherapy demonstration, anatomically accurate, camera steady, 10 seconds.
NEGATIVE: dorsal-only extension-limit pattern, static finished tape whole video, bare wrist whole video, melting tape, fingers wrapped shut, gloves clutter, logos, captions, watermarks, text, cartoon, blood, gore, shaky cam.
```

---

## 13. thumb-spica-ucl

| | |
|--|--|
| **IMAGE START (upload this)** | `public/taping/thumb-spica-start.png` |
| **IMAGE END (optional last frame)** | `public/taping/thumb-spica-end.png` |
| **FILE OUT** | `thumb-spica-ucl.mp4` |
| **GOAL** | Limit thumb abduction / hyperextension stress on UCL |
| **DURATION** | 10 s |

### FULL PROMPT

```
IMAGE-TO-VIDEO FROM THE START FRAME (bare thumb/hand). Progressive thumb spica over 10 seconds, same camera. Do not freeze on finished tape.

1) Wrist/hand anchor.
2) Continuous spica wraps around thumb MCP and wrist (figure-spica).
3) ACTIVE reinforcement across the ULNAR side of thumb MCP that LIMITS abduction and hyperextension.
4) Prefer IP joint freer than MCP. Closing. Final hold matches reference.

Educational demo, clear edges, camera steady, 10 seconds.
NEGATIVE: melting tape, entire hand casted shut, logos, text, cartoon, blood.
```

---

## 14. finger-buddy-tape

| | |
|--|--|
| **IMAGE START (upload this)** | `public/taping/finger-buddy-start.png` |
| **IMAGE END (optional last frame)** | `public/taping/finger-buddy-end.png` |
| **FILE OUT** | `finger-buddy.mp4` |
| **GOAL** | Buddy two fingers; limit isolated painful motion |
| **DURATION** | 10 s |

### FULL PROMPT

```
IMAGE-TO-VIDEO FROM THE START FRAME (bare fingers). Progressive buddy taping over 10 seconds, same close-up. Do not freeze on finished tape.

Place soft padding between fingers (visible). Circular white tape around proximal phalanges binding both fingers; then middle phalanx strips. Not tourniquet-tight; nails remain visible. End with a gentle nail-bed capillary refill press gesture. Final hold matches reference.

Educational demo. NEGATIVE: one finger only, crushing ischemia look, logos, text, cartoon, blood.
```

---

## 15. finger-extension-support

| | |
|--|--|
| **IMAGE START (upload this)** | `public/taping/finger-mallet-support-start.png` |
| **IMAGE END (optional last frame)** | `public/taping/finger-mallet-support-end.png` |
| **FILE OUT** | `finger-extension-support.mp4` |
| **GOAL** | Hold DIP in slight extension (mallet-pattern protection) |
| **DURATION** | 10 s |

**DaVinci input:** upload **`finger-mallet-support-start.png` only**. If first+last: START + END.

### Geometry lock (model must obey)

- **ONE finger only** — never buddy-tape two fingers
- Use **rigid athletic tape**, not Steri-Strips / tiny wound strips
- DIP held in **slight EXTENSION** (tip not drooped)
- Longitudinal strip(s) on **DORSUM** across DIP onto distal phalanx
- Optional 1–2 small circles around **middle phalanx** only
- Nail tip remains visible; PIP may stay freer than DIP

### Second-by-second timeline (10 s)

| t | Action |
|---|--------|
| 0–1 s | START: bare finger; peel short strip |
| 1–3 s | Hold DIP in slight extension |
| 3–7 s | Dorsal longitudinal strip across DIP |
| 7–9 s | Small mid-phalanx circle(s) |
| 9–10 s | Final hold matching END (one finger) |

### FULL PROMPT

```
IMAGE-TO-VIDEO FROM THE START FRAME PROVIDED.
The uploaded image is the FIRST FRAME: ONE bare adult finger on a clinic table with ZERO tape, DIP joint clearly visible, clinician in light blue scrubs holding a roll of white rigid athletic tape ready. Keep SAME camera, SAME pose, SAME background.

Animate a continuous 10-second APPLICATION on THAT SINGLE FINGER: bare → hold extension → dorsal strip → small circle → finished. Do NOT freeze on finished tape. Do NOT keep the finger bare after 1s.

CRITICAL: tape ONLY ONE finger. Do NOT buddy-tape two fingers together. Adjacent fingers stay free and untaped (or out of focus).

If an END / last-frame is provided, morph toward that single-finger mallet support by second 9–10.

Scene lock: soft clinic light, extreme/medium close-up. White matte rigid athletic tape (normal athletic tape, NOT Steri-Strip, NOT a tiny bandage strip), sharp edges.

CRITICAL GOAL: hold the DIP joint in slight EXTENSION (mallet-finger protection). The fingertip must NOT droop into flexion.

Timeline:

0–1s START: Bare finger only. Peel a short strip from the roll; sticky toward skin. Nothing stuck yet.

1–3s POSITION: Non-dominant hand gently holds the DIP in slight EXTENSION (tip joint straight, not drooped).

3–7s DORSAL ACTIVE: Place one longitudinal white athletic tape strip on the DORSUM of the finger from the middle phalanx across the DIP onto the distal phalanx, tension maintaining slight DIP extension. Smooth. Nail tip stays visible.

7–9s REINFORCE: Apply one (or two) small circular wrap(s) around the MIDDLE phalanx only of the SAME finger to secure the strip. Do not tape a second finger. Do not crush circulation.

9–10s CLOSE: Final hold matching end-target: ONE finger, DIP slightly extended, dorsal strip + mid-phalanx circle clear, nail visible.

Slow precise hands; no morphing; no buddy taping. Educational physiotherapy demonstration, anatomically accurate, camera steady, 10 seconds.
NEGATIVE: buddy taping two fingers, Steri-Strip only, DIP flexed/drooped, static finished whole video, bare finger whole video, melting tape, logos, captions, watermarks, text, cartoon, blood, gore, shaky cam.
```

---

## 16. neck-postural-cue-kinesio

| | |
|--|--|
| **IMAGE START (upload this)** | `public/taping/neck-postural-start.png` |
| **IMAGE END (optional last frame)** | `public/taping/neck-postural-end.png` |
| **FILE OUT** | `neck-postural-cue.mp4` |
| **GOAL** | Elastic kinesiology postural cue ONLY — never rigid airway-restricting tape |
| **DURATION** | 10 s |

### FULL PROMPT

```
IMAGE-TO-VIDEO FROM THE START FRAME (bare neck/upper back). Progressive light kinesio postural cue over 10 seconds, same camera. NO rigid neck wrap. Do not freeze on finished tape.

HARD RULES: NO rigid athletic tape around the neck. NO circumferential airway-restricting wrap. Paper-off / very gentle tension only. Round the tape corners. Measure, apply Y- or I-strip from mid-thoracic toward lower cervical, smooth, final hold matching reference.

Educational demo, soft light, camera steady, 10 seconds.
NEGATIVE: rigid zinc-oxide neck collar, choking wrap, logos, text, captions, watermarks, cartoon, blood.
```

---

## 17. lumbar-postural-kinesio

| | |
|--|--|
| **IMAGE START (upload this)** | `public/taping/lumbar-kinesio-start.png` |
| **IMAGE END (optional last frame)** | `public/taping/lumbar-kinesio-end.png` |
| **FILE OUT** | `lumbar-postural-kinesio.mp4` |
| **GOAL** | Lumbar elastic proprioceptive cue / mild unload |
| **DURATION** | 10 s |

### FULL PROMPT

```
IMAGE-TO-VIDEO FROM THE START FRAME (bare lumbar skin). Progressive lumbar kinesio over 10 seconds, same camera. Two paravertebral I-strips or star; gentle tension; no rigid constriction. Do not freeze on finished tape.

Educational demo. NEGATIVE: rigid full torso cast, logos, text, cartoon, blood.
```

---

## 18. hip-greater-trochanter-unload

| | |
|--|--|
| **IMAGE START (upload this)** | `public/taping/hip-trochanter-start.png` |
| **IMAGE END (optional last frame)** | `public/taping/hip-trochanter-end.png` |
| **FILE OUT** | `hip-greater-trochanter-unload.mp4` |
| **GOAL** | Unload lateral hip / greater trochanter |
| **DURATION** | 10 s |

### FULL PROMPT

```
IMAGE-TO-VIDEO FROM THE START FRAME (bare lateral hip). Progressive trochanter unload taping over 10 seconds, same camera. Do not freeze on finished tape.

Educational demo. NEGATIVE: melting tape, logos, text, cartoon, blood.
```

---

## 19. plantar-fascia-low-dye

| | |
|--|--|
| **IMAGE START (upload this)** | `public/taping/plantar-low-dye-start.png` |
| **IMAGE END (optional last frame)** | `public/taping/plantar-low-dye-end.png` |
| **FILE OUT** | `plantar-fascia-low-dye.mp4` |
| **GOAL** | Support medial arch / limit excessive pronation stretch on fascia |
| **DURATION** | 10 s |

### FULL PROMPT

```
IMAGE-TO-VIDEO FROM THE START FRAME (bare sole/arch). Progressive Low-Dye taping over 10 seconds, same camera. Arch raised during actives. Do not freeze on finished tape.

1) Lateral border anchor along foot.
2) Strips under forefoot as base.
3) ACTIVE strips from lateral midfoot under arch toward medial calcaneus pulling the arch UP (limits excessive pronation / fascial stretch). Visible strip edges.
4) Careful dorsal closing without vascular compromise; toes free and pink.
5) Final hold matches reference (supported arch).

Educational demo. NEGATIVE: toes tourniqueted, melting tape into a white sock, logos, text, cartoon, blood.
```

---

## 20. achilles-unload

| | |
|--|--|
| **IMAGE START (upload this)** | `public/taping/achilles-unload-start.png` |
| **IMAGE END (optional last frame)** | `public/taping/achilles-unload-end.png` |
| **FILE OUT** | `achilles-unload.mp4` |
| **GOAL** | Unload Achilles — limit stressful dorsiflexion |
| **DURATION** | 10 s |

**DaVinci input:** upload **`achilles-unload-start.png` only**. If first+last: START + END.

### Geometry lock (model must obey)

- Camera: **POSTERIOR / posterior-lateral** so mid-calf → Achilles → heel are visible
- Proximal circular anchor mid-calf
- Distal anchor around **heel / calcaneus** (plantar edge OK)
- Actives ×2–3: **longitudinal strips DOWN the Achilles** from calf onto heel (unload straps)
- **NOT** a full ankle figure-8, **NOT** medial/lateral stirrups around malleoli as the main pattern
- Protected position during actives: slight **plantarflexion**

### Second-by-second timeline (10 s)

| t | Action |
|---|--------|
| 0–1 s | START: bare Achilles/calf; peel tape |
| 1–3 s | Mid-calf proximal anchor + heel anchor |
| 3–8 s | 2–3 longitudinal Achilles unload strips |
| 8–10 s | Closing + final hold slight PF |

### FULL PROMPT

```
IMAGE-TO-VIDEO FROM THE START FRAME PROVIDED.
The uploaded image is the FIRST FRAME: bare adult lower leg with ZERO tape, POSTERIOR or posterior-lateral view so the Achilles tendon from mid-calf to heel is the focus, foot in slight plantarflexion, clinician in light blue scrubs holding white rigid athletic tape ready. Keep SAME camera, SAME pose, SAME background.

Animate a continuous 10-second APPLICATION: bare → anchors → longitudinal Achilles strips → finished. Do NOT freeze on finished tape. Do NOT keep the Achilles bare after 1s. Do NOT teleport a finished job.

If an END / last-frame is provided, morph toward that Achilles unload pattern by second 9–10.

Scene lock: soft clinic light, padded table. White matte rigid athletic tape ~3.8 cm, woven texture, sharp strip edges. Camera LOCKED on the POSTERIOR Achilles corridor (calf → tendon → heel).

Protected position during ALL active strips: slight PLANTARFLEXION (do not force dorsiflexion while applying).

CRITICAL GOAL: unload the Achilles by limiting stressful dorsiflexion with longitudinal posterior strips. This is NOT ankle figure-8 inversion taping and NOT stirrup taping around the malleoli as the main job.

Timeline:

0–1s START: Bare calf/Achilles/heel only. Peel strip; sticky toward skin. Nothing stuck yet.

1–3s ANCHORS: ONE proximal circular anchor around mid-calf. ONE distal circular or U-anchor around the heel/calcaneus (may touch plantar heel edge). Smooth. Achilles corridor still mostly bare between anchors.

3–8s ACTIVES ×2–3 (CRITICAL): Apply TWO or THREE overlapping longitudinal strips running DOWN the POSTERIOR Achilles from the calf anchor onto the heel/plantar heel surface, with tension that maintains slight plantarflexion and unloads the tendon (resists stressful dorsiflexion). ~50% overlap. Clear strip edges. Peel → place → smooth each. Do NOT convert the job into a full figure-8 around the ankle or medial/lateral stirrups as the primary pattern.

8–10s CLOSE: Light closing over anchors if needed. Final hold matching end-target: clear longitudinal Achilles unload strips, slight PF, woven edges visible.

Slow hands; no morphing; no finished pattern early. Educational physiotherapy demonstration, anatomically accurate, camera steady, 10 seconds.
NEGATIVE: full ankle figure-8 as main pattern, forced dorsiflexion during application, static finished whole video, bare Achilles whole video, melting tape, logos, captions, watermarks, text, cartoon, blood, gore, shaky cam.
```

---

## Quick index (id → image → motion)

| id | IMAGE file | Primary goal |
|----|------------|--------------|
| ankle-figure-8-inversion-lock | `ankle-figure-8-taping-start.png` → end: `ankle-figure-8-taping-end.png` | Limit **inversion** |
| ankle-eversion-lock | `ankle-eversion-lock-start.png` → end: `ankle-eversion-lock-end.png` | Limit **eversion** |
| ankle-combined-inversion-eversion | `ankle-combined-full-start.png` → end: `ankle-combined-full-end.png` | Both (teaching) |
| knee-mcl-support | `knee-mcl-support-start.png` → end: `knee-mcl-support-end.png` | Limit valgus |
| knee-lcl-support | `knee-lcl-support-start.png` → end: `knee-lcl-support-end.png` | Limit varus |
| knee-patellar-medial-glide-limit | `knee-patella-tape-start.png` → end: `knee-patella-tape-end.png` | Limit lateral patellar glide |
| shoulder-ac-joint-support | `shoulder-ac-support-start.png` → end: `shoulder-ac-support-end.png` | AC superior support |
| shoulder-glenohumeral-anterior-limit | `shoulder-anterior-stability-start.png` → end: `shoulder-anterior-stability-end.png` | Limit anterior GH translation |
| elbow-lateral-epicondylalgia | `elbow-lateral-epi-start.png` → end: `elbow-lateral-epi-end.png` | Extensor unload |
| elbow-medial-epicondylalgia | `elbow-medial-epi-start.png` → end: `elbow-medial-epi-end.png` | Flexor-pronator unload |
| wrist-extension-limit | `wrist-extension-limit-start.png` → end: `wrist-extension-limit-end.png` | Limit extension |
| wrist-flexion-limit | `wrist-flexion-limit-start.png` → end: `wrist-flexion-limit-end.png` | Limit flexion |
| thumb-spica-ucl | `thumb-spica-start.png` → end: `thumb-spica-end.png` | Limit abd / hyperextension |
| finger-buddy-tape | `finger-buddy-start.png` → end: `finger-buddy-end.png` | Buddy support |
| finger-extension-support | `finger-mallet-support-start.png` → end: `finger-mallet-support-end.png` | DIP extension protect |
| neck-postural-cue-kinesio | `neck-postural-start.png` → end: `neck-postural-end.png` | Elastic postural cue |
| lumbar-postural-kinesio | `lumbar-kinesio-start.png` → end: `lumbar-kinesio-end.png` | Lumbar elastic cue |
| hip-greater-trochanter-unload | `hip-trochanter-start.png` → end: `hip-trochanter-end.png` | Lateral hip unload |
| plantar-fascia-low-dye | `plantar-low-dye-start.png` → end: `plantar-low-dye-end.png` | Arch / fascia |
| achilles-unload | `achilles-unload-start.png` → end: `achilles-unload-end.png` | Limit stressful DF |

---

## Ankle cheat-sheet (tiras activas)

**Limitar INVERSIÓN**
- Posición: ligera dorsiflexión + ligera eversión
- Estribos: medial → bajo el talón → lateral (tensión al subir por lateral)
- Figura en 8: X visible en el dorso; heel locks abrazan el calcáneo
- START: `ankle-figure-8-taping-start.png` · END: `ankle-figure-8-taping-end.png`

**Limitar EVERSIÓN**
- Posición: ligera dorsiflexión + ligera inversión
- Estribos: lateral → bajo el talón → medial (tensión al subir por medial)
- START: `ankle-eversion-lock-start.png` · END: `ankle-eversion-lock-end.png`

Never apply circumferential tape as a tourniquet. Toes/fingers stay pink and movable. Prefer a second generate pass over a shortened prompt if geometry fails.

---

## Finalize exports (logo + glitch cut)

After DaVinci export, run:

```bash
python scripts/taping_finalize_video.py path/to/clip.mp4 public/taping/videos/<id>.mp4
```

Appends a **3-second AIKinora logo** outro. For the combined ankle three-hand glitch:

```bash
python scripts/taping_finalize_video.py path/to/combined.mp4 public/taping/videos/ankle-combined-inversion-eversion.mp4 --cut-start 4.35 --cut-end 5.65
```

Batch all `Downloads/davinci*.mp4` (logo on each; auto-cuts combined ankle):

```bash
python scripts/taping_finalize_video.py --batch-downloads
```
