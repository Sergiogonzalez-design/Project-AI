# AI video prompts — clinical tests
# Image folder: public/clinical-tests/
# Save videos as: public/clinical-tests/videos/<id>.mp4
#
# CAST (mandatory): same two people / clothes as Cozen — see CAST.md
#
# How to use (Kling / Runway / Luma / Sora / DaVinci):
# 1. Upload the matching .webp as image reference
# 2. Paste the PROMPT below
# 3. Duration 8–12s, no music, no text overlays
# 4. Export as <id>.mp4
# 5. Fit to 8.00s demo + 2.00s Kinora logo (10.00s total):
#      powershell -File scripts/append-kinora-logo-outro.ps1
#
# Batch 1: tests 1–31 (original)
# Batch 2: tests 32–45 (new trees — collaterals, wrist, neck/back extras)

COMMON_SUFFIX:
CAST LOCK � same two people as Cozen / first Kinora catalog. PATIENT: adult man, short brown hair, clean-shaven, fair skin, heather-grey crew-neck t-shirt, dark charcoal shorts. CLINICIAN: adult man, short dark hair, clean-shaven, fair skin, solid medium-blue V-neck medical scrubs (top and trousers), bare hands. Same light-blue studio, blue treatment table, polished medical-illustration style. FORBIDDEN: different faces, female clinician or patient, polo, khaki, tank top, shirtless, white coat, extra people. Educational physiotherapy demonstration video, soft neutral lighting, anatomically accurate hand placement, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.
# After export, every video is fit to 8.00s of demo plus the same 2.00s Kinora logo card (10.00s total).

---

# Batch 3 — Shoulder expansion 31 Aug 2026 (11 new tests)

Full copy-paste pack with embedded initial images:
→ **`SHOULDER_NEW_TESTS_VIDEO_PROMPTS.md`** (same folder)

Changelog of what was added in code/RAG:
→ `knowledge/PHYSIOGUIDE_SHOULDER_EXPANSION_2026-08-31.md`

---

## 1. lachman
IMAGE: public/clinical-tests/lachman.webp
FILE OUT: lachman.mp4
PROMPT:
Using this illustration as reference, animate a clinician performing the Lachman test: patient supine, knee flexed about 20–30 degrees, one hand stabilizing the femur, the other gently translating the tibia anteriorly. Side view of the knee. CAST LOCK � same two people as Cozen / first Kinora catalog. PATIENT: adult man, short brown hair, clean-shaven, fair skin, heather-grey crew-neck t-shirt, dark charcoal shorts. CLINICIAN: adult man, short dark hair, clean-shaven, fair skin, solid medium-blue V-neck medical scrubs (top and trousers), bare hands. Same light-blue studio, blue treatment table, polished medical-illustration style. FORBIDDEN: different faces, female clinician or patient, polo, khaki, tank top, shirtless, white coat, extra people. Educational physiotherapy demonstration video, soft neutral lighting, anatomically accurate hand placement, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.

## 2. anterior-drawer-knee
IMAGE: public/clinical-tests/anterior-drawer-knee.webp
FILE OUT: anterior-drawer-knee.mp4
PROMPT:
Using this illustration as reference, animate the anterior drawer test of the knee: patient supine, knee flexed about 90 degrees with foot flat, clinician sits on the foot and draws the tibia forward relative to the femur. CAST LOCK � same two people as Cozen / first Kinora catalog. PATIENT: adult man, short brown hair, clean-shaven, fair skin, heather-grey crew-neck t-shirt, dark charcoal shorts. CLINICIAN: adult man, short dark hair, clean-shaven, fair skin, solid medium-blue V-neck medical scrubs (top and trousers), bare hands. Same light-blue studio, blue treatment table, polished medical-illustration style. FORBIDDEN: different faces, female clinician or patient, polo, khaki, tank top, shirtless, white coat, extra people. Educational physiotherapy demonstration video, soft neutral lighting, anatomically accurate hand placement, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.

## 3. pivot-shift
IMAGE: public/clinical-tests/pivot-shift.webp
FILE OUT: pivot-shift.mp4
PROMPT:
Using this illustration as reference, animate the pivot-shift test: clinician applies valgus stress and internal rotation while flexing and extending the knee to demonstrate rotational instability assessment. CAST LOCK � same two people as Cozen / first Kinora catalog. PATIENT: adult man, short brown hair, clean-shaven, fair skin, heather-grey crew-neck t-shirt, dark charcoal shorts. CLINICIAN: adult man, short dark hair, clean-shaven, fair skin, solid medium-blue V-neck medical scrubs (top and trousers), bare hands. Same light-blue studio, blue treatment table, polished medical-illustration style. FORBIDDEN: different faces, female clinician or patient, polo, khaki, tank top, shirtless, white coat, extra people. Educational physiotherapy demonstration video, soft neutral lighting, anatomically accurate hand placement, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.

## 4. mcmurray — DOS VÍDEOS (misma imagen de inicio · CAST Cozen)

**Shared START:** `c:\Users\sergi\project-ai\public\clinical-tests\mcmurray-start.png`  
(also `mcmurray.png` / `mcmurray.webp` · copies `mcmurray-medial-start.png` / `mcmurray-lateral-start.png`)

CAST: grey crew-neck + charcoal shorts patient · medium-blue V-neck scrubs physio · light-blue studio · blue table (same as Cozen).

### 4a. Menisco INTERNO (medial) — pie hacia FUERA

**First:** `mcmurray-start.png` · **Last (optional):** `mcmurray-medial-end.png` · **Out:** `mcmurray-medial.mp4`

```
Using this illustration as the FIRST frame, animate McMurray for the MEDIAL / INTERNAL meniscus (menisco interno).

SETUP (locked from image): patient SUPINE. Tested knee and hip flexed ~90°. Clinician: ONE hand on the HEEL (moves the leg from the heel); the OTHER hand on the knee joint line.

FOOT LOCK — MEDIAL: turn the foot / toes OUTWARD (external tibial rotation — pie hacia FUERA). Keep that outward foot position for the whole motion.

MOTION (8s): from the start pose, repeatedly FLEX and EXTEND the knee while the foot stays pointing OUTWARD. All motion driven FROM THE HEEL hand. Smooth, controlled cycles (about 2–3 flex→extend reps). Knee hand only palpates / guides — does not yank.

CAST LOCK — same two people as Cozen / first Kinora catalog. PATIENT: adult man, short brown hair, clean-shaven, fair skin, heather-grey crew-neck t-shirt, dark charcoal shorts. CLINICIAN: adult man, short dark hair, clean-shaven, fair skin, solid medium-blue V-neck medical scrubs (top and trousers), bare hands. Same light-blue studio, blue treatment table, polished medical-illustration style. FORBIDDEN: different faces, female clinician or patient, polo, khaki, tank top, shirtless, white coat, extra people, bald/bearded patient, striped athletic pants.

FORBIDDEN: foot pointing inward; moving from the mid-shin instead of the heel; twisting only with a straight knee; aggressive yanking. Camera steady, 8 seconds, no logos, no captions, no watermarks.
```

### 4b. Menisco EXTERNO (lateral) — pie hacia DENTRO

**First:** `mcmurray-start.png` (SAME image) · **Last (optional):** `mcmurray-lateral-end.png` · **Out:** `mcmurray-lateral.mp4`

```
Using this illustration as the FIRST frame, animate McMurray for the LATERAL / EXTERNAL meniscus (menisco externo).

SETUP (locked from image): patient SUPINE. Tested knee and hip flexed ~90°. Clinician: ONE hand on the HEEL (moves the leg from the heel); the OTHER hand on the knee joint line.

FOOT LOCK — LATERAL: turn the foot / toes INWARD (internal tibial rotation — pie hacia DENTRO / toward the midline). Keep that inward foot position for the whole motion.

MOTION (8s): from the start pose, repeatedly FLEX and EXTEND the knee while the foot stays pointing INWARD. All motion driven FROM THE HEEL hand. Smooth, controlled cycles (about 2–3 flex→extend reps). Knee hand only palpates / guides — does not yank.

CAST LOCK — same two people as Cozen / first Kinora catalog. PATIENT: adult man, short brown hair, clean-shaven, fair skin, heather-grey crew-neck t-shirt, dark charcoal shorts. CLINICIAN: adult man, short dark hair, clean-shaven, fair skin, solid medium-blue V-neck medical scrubs (top and trousers), bare hands. Same light-blue studio, blue treatment table, polished medical-illustration style. FORBIDDEN: different faces, female clinician or patient, polo, khaki, tank top, shirtless, white coat, extra people, bald/bearded patient, striped athletic pants.

FORBIDDEN: foot pointing outward; moving from the mid-shin instead of the heel; twisting only with a straight knee; aggressive yanking. Camera steady, 8 seconds, no logos, no captions, no watermarks.
```

---
## 5. thessaly
IMAGE: public/clinical-tests/thessaly.webp
FILE OUT: thessaly.mp4
PROMPT:
Using this illustration as reference, animate the Thessaly test: patient stands on one leg with slight knee flexion, holds the clinician for balance, and rotates the body inward and outward over the planted foot. Educational physiotherapy demonstration video, realistic clinic setting, soft neutral lighting, anatomically accurate movement, calm professional clinician and patient, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.

## 6. neer
IMAGE: public/clinical-tests/neer.webp
FILE OUT: neer.mp4
PROMPT:
Using this illustration as reference, animate the Neer impingement test: clinician stabilizes the scapula and passively elevates the patient's arm in forward flexion, forcing the greater tuberosity under the acromion. CAST LOCK � same two people as Cozen / first Kinora catalog. PATIENT: adult man, short brown hair, clean-shaven, fair skin, heather-grey crew-neck t-shirt, dark charcoal shorts. CLINICIAN: adult man, short dark hair, clean-shaven, fair skin, solid medium-blue V-neck medical scrubs (top and trousers), bare hands. Same light-blue studio, blue treatment table, polished medical-illustration style. FORBIDDEN: different faces, female clinician or patient, polo, khaki, tank top, shirtless, white coat, extra people. Educational physiotherapy demonstration video, soft neutral lighting, anatomically accurate hand placement, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.

## 7. hawkins-kennedy
IMAGE: public/clinical-tests/hawkins-kennedy.webp
FILE OUT: hawkins-kennedy.mp4
PROMPT:
Using this illustration as reference, animate the Hawkins-Kennedy test with STRICT geometry: patient's shoulder flexed to exactly 90° (arm forward in front of the body) AND elbow flexed to exactly 90°. Clinician stabilizes the elbow/upper arm, then passively INTERNALLY ROTATES the shoulder by moving the FOREARM DOWNWARD toward the floor (palm/forearm descending) — NOT sideways, NOT upward, NOT wrist twisting. The motion pivot is the shoulder (humerus rotates); the wrist stays neutral. CAST LOCK � same two people as Cozen / first Kinora catalog. PATIENT: adult man, short brown hair, clean-shaven, fair skin, heather-grey crew-neck t-shirt, dark charcoal shorts. CLINICIAN: adult man, short dark hair, clean-shaven, fair skin, solid medium-blue V-neck medical scrubs (top and trousers), bare hands. Same light-blue studio, blue treatment table, polished medical-illustration style. FORBIDDEN: different faces, female clinician or patient, polo, khaki, tank top, shirtless, white coat, extra people. Educational physiotherapy demonstration video, soft neutral lighting, anatomically accurate hand placement, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.

## 8. jobe-empty-can
IMAGE: public/clinical-tests/jobe-empty-can.webp
FILE OUT: jobe-empty-can.mp4
PROMPT:
Using this illustration as reference, animate the Jobe empty-can test: arms elevated in the scapular plane with thumbs down, patient resists downward pressure from the clinician. CAST LOCK � same two people as Cozen / first Kinora catalog. PATIENT: adult man, short brown hair, clean-shaven, fair skin, heather-grey crew-neck t-shirt, dark charcoal shorts. CLINICIAN: adult man, short dark hair, clean-shaven, fair skin, solid medium-blue V-neck medical scrubs (top and trousers), bare hands. Same light-blue studio, blue treatment table, polished medical-illustration style. FORBIDDEN: different faces, female clinician or patient, polo, khaki, tank top, shirtless, white coat, extra people. Educational physiotherapy demonstration video, soft neutral lighting, anatomically accurate hand placement, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.

## 9. apprehension
IMAGE: public/clinical-tests/apprehension.webp
FILE OUT: apprehension.mp4
PROMPT:
Using this illustration as reference, animate the anterior shoulder Apprehension test EXACTLY like a Physiotutors demo: patient SUPINE on a treatment table. Symptomatic arm: shoulder abducted to EXACTLY 90° (upper arm perpendicular to the torso, sticking straight out to the side) AND elbow flexed to EXACTLY 90° so the forearm points vertically upward at the start. Clinician supports under the elbow/humerus with one hand and holds the wrist with the other, then slowly externally rotates the shoulder (forearm moves backward toward the table) while watching for apprehension — do NOT dislocate. Keep 90°/90° locked the whole time. CAST LOCK � same two people as Cozen / first Kinora catalog. PATIENT: adult man, short brown hair, clean-shaven, fair skin, heather-grey crew-neck t-shirt, dark charcoal shorts. CLINICIAN: adult man, short dark hair, clean-shaven, fair skin, solid medium-blue V-neck medical scrubs (top and trousers), bare hands. Same light-blue studio, blue treatment table, polished medical-illustration style. FORBIDDEN: different faces, female clinician or patient, polo, khaki, tank top, shirtless, white coat, extra people. Educational physiotherapy demonstration video, soft neutral lighting, anatomically accurate hand placement, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.

## 10. drop-arm
IMAGE: public/clinical-tests/drop-arm.webp
FILE OUT: drop-arm.mp4
PROMPT:
Using this illustration as reference, animate the drop-arm test: clinician passively abducts the arm fully, then asks the patient to slowly lower it; show controlled lowering of the arm. Educational physiotherapy demonstration video, realistic clinic setting, soft neutral lighting, anatomically accurate movement, calm professional clinician and patient, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.

## 11. painful-arc
IMAGE: public/clinical-tests/painful-arc.webp
FILE OUT: painful-arc.mp4
PROMPT:
Using this illustration as reference, animate the Painful Arc test: patient STANDING facing camera, START with the tested arm straight down by the side at 0°, then slowly actively abducts in a side arc all the way up toward 180° overhead. CRITICAL: overlay a clear semi-circular diagnostic graph anchored at the shoulder (like educational medical diagrams): label 0°→45–60° as "No Pain", shade/highlight 45–60°→120° as "Glenohumeral Painful arc", label 120°→170° as "No Pain", and shade the top tip 170°→180° as "Acromioclavicular painful arc". Movement must begin from the arm hanging straight down, not from mid-range. Educational physiotherapy demonstration video, realistic clinic setting, soft neutral lighting, anatomically accurate movement, calm professional clinician and patient, no blood, no gore, no logos, no captions except the diagram labels above, no watermarks, camera steady, 8 seconds.

## 12. spurling
IMAGE: public/clinical-tests/spurling.webp
FILE OUT: spurling.mp4
PROMPT:
Using this illustration as reference, animate Spurling's test: patient seated, clinician gently extends and side-bends the neck toward the symptomatic side and applies light axial compression. Educational physiotherapy demonstration video, realistic clinic setting, soft neutral lighting, anatomically accurate careful hand placement, calm professional clinician and patient, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.

## 13. ultt
IMAGE: public/clinical-tests/ultt.webp
FILE OUT: ultt.mp4
PROMPT:
Using this illustration as reference, animate the upper limb tension test (median bias): clinician depresses the shoulder, extends the elbow, wrist and fingers while abducting the arm to tension the neural pathway. CAST LOCK � same two people as Cozen / first Kinora catalog. PATIENT: adult man, short brown hair, clean-shaven, fair skin, heather-grey crew-neck t-shirt, dark charcoal shorts. CLINICIAN: adult man, short dark hair, clean-shaven, fair skin, solid medium-blue V-neck medical scrubs (top and trousers), bare hands. Same light-blue studio, blue treatment table, polished medical-illustration style. FORBIDDEN: different faces, female clinician or patient, polo, khaki, tank top, shirtless, white coat, extra people. Educational physiotherapy demonstration video, soft neutral lighting, anatomically accurate hand placement, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.

## 14. thompson
IMAGE: public/clinical-tests/thompson.webp
FILE OUT: thompson.mp4
PROMPT:
Using this illustration as reference, animate the Thompson / Simmonds test: patient prone with feet off the table, clinician squeezes the calf muscle belly and observes plantarflexion of the foot. CAST LOCK � same two people as Cozen / first Kinora catalog. PATIENT: adult man, short brown hair, clean-shaven, fair skin, heather-grey crew-neck t-shirt, dark charcoal shorts. CLINICIAN: adult man, short dark hair, clean-shaven, fair skin, solid medium-blue V-neck medical scrubs (top and trousers), bare hands. Same light-blue studio, blue treatment table, polished medical-illustration style. FORBIDDEN: different faces, female clinician or patient, polo, khaki, tank top, shirtless, white coat, extra people. Educational physiotherapy demonstration video, soft neutral lighting, anatomically accurate hand placement, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.

## 15. matles
IMAGE FIRST: public/clinical-tests/matles-start.png (prone, BOTH knees STRAIGHT)
IMAGE LAST / catalog: public/clinical-tests/matles-end.png (= matles.png)
FILE OUT: matles.mp4
PROMPT:
Using the FIRST illustration as the starting frame (and the END still as the last frame if available), animate the Matles test for Achilles. Photorealistic. NO anatomical drawings, NO skeleton overlays, NO arrows, NO captions.

CAMERA: keep the SAME side / three-quarter view from the foot end so BOTH legs and BOTH feet stay visible. Do NOT switch to overhead.

SEQUENCE (8s) — CRITICAL ORDER:
1) START (0–1.5s): patient PRONE (face down). BOTH knees FULLY STRAIGHT / EXTENDED flat on the table (piernas estiradas, 0°). Feet relaxed. Clinician at the foot of the table.
2) TRANSITION (1.5–4s): clinician gently flexes BOTH knees together up to ~90° (shins become vertical, heels toward buttocks). Smooth controlled motion — both legs move together.
3) END HOLD (4–8s): BOTH knees stay at 90°. Compare resting ankle positions:
   - ONE foot in clear PLANTAR FLEXIÓN (toes pointed / ankle plantarflexed).
   - THE OTHER foot in FLEXIÓN NEUTRA (ankle ~90° to the shin — NOT pointed, neutral).
   Asymmetry must be obvious. Brief calm hold while clinician observes. Do NOT push the ankles actively into position — show resting posture.

FORBIDDEN: starting already at 90°; only one knee flexed; both feet the same angle; SLR; Thompson calf squeeze as the main action; shirtless patient.

CAST LOCK — same two people as Cozen / first Kinora catalog. PATIENT: adult man, short brown hair, clean-shaven, fair skin, heather-grey crew-neck t-shirt, dark charcoal shorts. CLINICIAN: adult man, short dark hair, clean-shaven, fair skin, solid medium-blue V-neck medical scrubs (top and trousers), bare hands. Same light-blue studio, blue treatment table. FORBIDDEN: different faces, female clinician or patient, polo, khaki, tank top, shirtless, white coat, extra people. Educational physiotherapy demonstration video, soft neutral lighting, anatomically accurate positioning, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.

## 16. anterior-drawer-ankle
IMAGE: public/clinical-tests/anterior-drawer-ankle.webp
FILE OUT: anterior-drawer-ankle.mp4
PROMPT:
Using this illustration as reference, animate the anterior drawer test of the ankle: patient seated or supine, ankle slightly plantarflexed, clinician stabilizes the tibia and draws the calcaneus/talus forward. CAST LOCK � same two people as Cozen / first Kinora catalog. PATIENT: adult man, short brown hair, clean-shaven, fair skin, heather-grey crew-neck t-shirt, dark charcoal shorts. CLINICIAN: adult man, short dark hair, clean-shaven, fair skin, solid medium-blue V-neck medical scrubs (top and trousers), bare hands. Same light-blue studio, blue treatment table, polished medical-illustration style. FORBIDDEN: different faces, female clinician or patient, polo, khaki, tank top, shirtless, white coat, extra people. Educational physiotherapy demonstration video, soft neutral lighting, anatomically accurate hand placement, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.

## 17. windlass
IMAGE: public/clinical-tests/windlass.png
DaVinci upload: public/clinical-tests/windlass-start.png
FILE OUT: windlass.mp4
PROMPT:
Using this illustration as reference, animate the Windlass test (test de Windlass / fascia plantar). Photorealistic. NO anatomical drawings, NO skeleton overlays, NO arrows, NO captions.

SETUP: patient seated (or standing weight-bearing). Bare foot clearly visible — preferably side / three-quarter so the SOLE (planta) can be seen. Clinician stabilizes the heel/midfoot with one hand.

CRITICAL — PLANTA EN TENSIÓN (error if missing):
- Clinician firmly EXTENDS / dorsiflexes the BIG TOE (hallux / dedo gordo) upward — pull the hallux toward the shin / ceiling.
- As the hallux extends, the PLANTAR FASCIA / sole of the foot must visibly TIGHTEN — planta en tensión: arch rises, sole looks taut like a bowstring from heel to forefoot (NOT soft/floppy).
- Emphasize this tensioning of the planta as the main visual idea of the clip — hold at peak tension so the taut sole is obvious.
- Familiar pain at the medial heel / plantar fascia may be the clinical cue (do not dramatize pain).

MOTION (1–7s): grip hallux → progressive extension of the big toe → peak planta en tensión (brief hold) → gentle release. Calm, controlled.

FORBIDDEN: only wiggling the toe without stretching the sole; hands only on the ankle; overlays.

CAST LOCK — same two people as Cozen / first Kinora catalog. PATIENT: adult man, short brown hair, clean-shaven, fair skin, heather-grey crew-neck t-shirt, dark charcoal shorts. CLINICIAN: adult man, short dark hair, clean-shaven, fair skin, solid medium-blue V-neck medical scrubs (top and trousers), bare hands. Same light-blue studio, blue treatment table. FORBIDDEN: different faces, female clinician or patient, polo, khaki, tank top, shirtless, white coat, extra people. Educational physiotherapy demonstration video, soft neutral lighting, anatomically accurate hand placement, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.

## 18. heel-raise
IMAGE: public/clinical-tests/heel-raise.webp
FILE OUT: heel-raise.mp4
PROMPT:
Using this illustration as reference, animate a heel-raise / calf raise test: patient rises onto the toes bilaterally then on one leg, showing ankle plantarflexion strength. Educational physiotherapy demonstration video, realistic clinic setting, soft neutral lighting, anatomically accurate movement, calm professional clinician and patient, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.

## 19. hop-test
IMAGE: public/clinical-tests/hop-test.webp
FILE OUT: hop-test.mp4
PROMPT:
Using this illustration as reference, animate a single-leg hop test: patient hops forward on one leg with controlled landing, clinician observing. Educational physiotherapy demonstration video, realistic clinic setting, soft neutral lighting, anatomically accurate athletic movement, calm professional clinician and patient, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.

## 20. faber
IMAGE: public/clinical-tests/faber.webp
FILE OUT: faber.mp4
PROMPT:
Using this illustration as reference, animate the FABER / Patrick test: patient supine, tested leg in figure-4 position (flexion, abduction, external rotation), clinician gently presses the knee toward the table while stabilizing the opposite pelvis. CAST LOCK � same two people as Cozen / first Kinora catalog. PATIENT: adult man, short brown hair, clean-shaven, fair skin, heather-grey crew-neck t-shirt, dark charcoal shorts. CLINICIAN: adult man, short dark hair, clean-shaven, fair skin, solid medium-blue V-neck medical scrubs (top and trousers), bare hands. Same light-blue studio, blue treatment table, polished medical-illustration style. FORBIDDEN: different faces, female clinician or patient, polo, khaki, tank top, shirtless, white coat, extra people. Educational physiotherapy demonstration video, soft neutral lighting, anatomically accurate hand placement, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.

## 21. fadir
IMAGE: public/clinical-tests/fadir.webp
FILE OUT: fadir.mp4
PROMPT:
Using this illustration as reference, animate the FADIR test: patient supine, clinician flexes, adducts and internally rotates the hip toward the opposite shoulder. CAST LOCK � same two people as Cozen / first Kinora catalog. PATIENT: adult man, short brown hair, clean-shaven, fair skin, heather-grey crew-neck t-shirt, dark charcoal shorts. CLINICIAN: adult man, short dark hair, clean-shaven, fair skin, solid medium-blue V-neck medical scrubs (top and trousers), bare hands. Same light-blue studio, blue treatment table, polished medical-illustration style. FORBIDDEN: different faces, female clinician or patient, polo, khaki, tank top, shirtless, white coat, extra people. Educational physiotherapy demonstration video, soft neutral lighting, anatomically accurate hand placement, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.

## 22. trendelenburg
IMAGE: public/clinical-tests/trendelenburg.webp
FILE OUT: trendelenburg.mp4
PROMPT:
Using this illustration as reference, animate the Trendelenburg test: patient stands on one leg; show pelvic level maintenance on single-leg stance while the clinician observes from behind. Educational physiotherapy demonstration video, realistic clinic setting, soft neutral lighting, anatomically accurate posture, calm professional clinician and patient, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.

## 23. phalen
IMAGE: public/clinical-tests/phalen.webp
FILE OUT: phalen.mp4
PROMPT:
Using this illustration as reference, animate Phalen's test: patient holds both wrists in maximal flexion (backs of hands pressed together in prayer-reverse position) for several seconds. Educational physiotherapy demonstration video, realistic clinic setting, soft neutral lighting, anatomically accurate wrist position, calm professional clinician and patient, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.

## 24. tinel
IMAGE: public/clinical-tests/tinel.webp
FILE OUT: tinel.mp4
PROMPT:
Using this illustration as reference, animate Tinel's sign at the wrist: clinician gently taps over the carpal tunnel / median nerve at the wrist with a finger. CAST LOCK � same two people as Cozen / first Kinora catalog. PATIENT: adult man, short brown hair, clean-shaven, fair skin, heather-grey crew-neck t-shirt, dark charcoal shorts. CLINICIAN: adult man, short dark hair, clean-shaven, fair skin, solid medium-blue V-neck medical scrubs (top and trousers), bare hands. Same light-blue studio, blue treatment table, polished medical-illustration style. FORBIDDEN: different faces, female clinician or patient, polo, khaki, tank top, shirtless, white coat, extra people. Educational physiotherapy demonstration video, soft neutral lighting, anatomically accurate hand placement, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.

## 25. cozen
IMAGE: public/clinical-tests/cozen-start.png (also cozen.webp)
FILE OUT: cozen.mp4
REF: https://www.youtube.com/watch?v=8K7jzDIUpLI
NOTE: Movement is WRIST extension against resistance — elbow stays STILL. Video ✅ installed from animate_coze.mp4 (+ Kinora logo).
PROMPT:
Using this illustration as reference, animate Cozen's test EXACTLY like Physiotutors (youtube 8K7jzDIUpLI / lateral epicondylalgia). Patient seated; elbow nearly EXTENDED and STABLE (does not bend or swing); forearm PRONATED; patient makes a FIST with the wrist in slight extension + radial deviation. Clinician: one hand / thumb PALPATES the LATERAL EPICONDYLE and STABILIZES the elbow/forearm so the elbow does NOT move; the OTHER hand applies resistance on the dorsum of the fist / wrist — patient actively EXTENDS the WRIST against that downward force (resisted wrist extension). CRITICAL: the visible motion is at the WRIST only (fist lifts into extension against resistance). Do NOT flex/extend the elbow; do NOT swing the forearm; do NOT turn this into an elbow bend test. CAST LOCK � same two people as Cozen / first Kinora catalog. PATIENT: adult man, short brown hair, clean-shaven, fair skin, heather-grey crew-neck t-shirt, dark charcoal shorts. CLINICIAN: adult man, short dark hair, clean-shaven, fair skin, solid medium-blue V-neck medical scrubs (top and trousers), bare hands. Same light-blue studio, blue treatment table, polished medical-illustration style. FORBIDDEN: different faces, female clinician or patient, polo, khaki, tank top, shirtless, white coat, extra people. Educational physiotherapy demonstration video, soft neutral lighting, anatomically accurate hand placement, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.

## 26. mill
IMAGE: public/clinical-tests/mill-start.png
END REF (optional): public/clinical-tests/mill-end.png
FILE OUT: mill.mp4
REF: https://www.youtube.com/watch?v=r_A84ox9JRM
STATUS: video ✅ installed from animate_mill (1).mp4 (+ Kinora logo)
PROMPT (simple):
Using this illustration as reference, animate Mill's test. Keep it simple.

START: elbow at EXACTLY 90°. Physio presses on the wrist so the wrist stays flexed (hand bent down).

MOTION: while the physio KEEPS pressing on the wrist (wrist stays flexed), the arm goes DOWNWARDS until the elbow reaches 0° (straight arm).

END: hold the straight arm down with wrist still flexed under pressure.

Do NOT leave the arm up. Do NOT release the wrist. Camera steady, 8 seconds, no logos, no captions, no watermarks.

## 27. speed
IMAGE: public/clinical-tests/speed.webp
FILE OUT: speed.mp4
PROMPT:
Using this illustration as reference, animate Speed's test: elbow extended, forearm supinated, patient elevates the arm against resistance while the clinician palpates the bicipital groove. CAST LOCK � same two people as Cozen / first Kinora catalog. PATIENT: adult man, short brown hair, clean-shaven, fair skin, heather-grey crew-neck t-shirt, dark charcoal shorts. CLINICIAN: adult man, short dark hair, clean-shaven, fair skin, solid medium-blue V-neck medical scrubs (top and trousers), bare hands. Same light-blue studio, blue treatment table, polished medical-illustration style. FORBIDDEN: different faces, female clinician or patient, polo, khaki, tank top, shirtless, white coat, extra people. Educational physiotherapy demonstration video, soft neutral lighting, anatomically accurate hand placement, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.

## 28. yergason
IMAGE: public/clinical-tests/yergason.webp
FILE OUT: yergason.mp4
PROMPT:
Using this illustration as reference, animate Yergason's test: elbow flexed to 90 degrees, patient attempts to supinate against resistance while the clinician palpates the bicipital groove. CAST LOCK � same two people as Cozen / first Kinora catalog. PATIENT: adult man, short brown hair, clean-shaven, fair skin, heather-grey crew-neck t-shirt, dark charcoal shorts. CLINICIAN: adult man, short dark hair, clean-shaven, fair skin, solid medium-blue V-neck medical scrubs (top and trousers), bare hands. Same light-blue studio, blue treatment table, polished medical-illustration style. FORBIDDEN: different faces, female clinician or patient, polo, khaki, tank top, shirtless, white coat, extra people. Educational physiotherapy demonstration video, soft neutral lighting, anatomically accurate hand placement, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.

## 29. schober
IMAGE: public/clinical-tests/schober.webp
FILE OUT: schober.mp4
PROMPT:
Using this illustration as reference, animate the Schober test: marks on the lumbar spine, patient standing then bending forward into flexion while the clinician observes the increase in distance between marks. Educational physiotherapy demonstration video, realistic clinic setting, soft neutral lighting, anatomically accurate spinal flexion, calm professional clinician and patient, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.

## 30. slr-lasegue
IMAGE: public/clinical-tests/slr-lasegue.webp
FILE OUT: slr-lasegue.mp4
PROMPT:
Using this illustration as reference, animate the straight leg raise / Lasègue test: patient supine, clinician slowly raises the straight leg by flexing the hip with the knee extended. CAST LOCK � same two people as Cozen / first Kinora catalog. PATIENT: adult man, short brown hair, clean-shaven, fair skin, heather-grey crew-neck t-shirt, dark charcoal shorts. CLINICIAN: adult man, short dark hair, clean-shaven, fair skin, solid medium-blue V-neck medical scrubs (top and trousers), bare hands. Same light-blue studio, blue treatment table, polished medical-illustration style. FORBIDDEN: different faces, female clinician or patient, polo, khaki, tank top, shirtless, white coat, extra people. Educational physiotherapy demonstration video, soft neutral lighting, anatomically accurate hand placement, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.

## 31. kemp
IMAGE: public/clinical-tests/kemp.webp
FILE OUT: kemp.mp4
PROMPT:
Using this illustration as reference, animate Kemp's / lumbar quadrant test: patient standing, clinician guides the trunk into extension, side-bending and rotation toward the painful side. Educational physiotherapy demonstration video, realistic clinic setting, soft neutral lighting, anatomically accurate careful spinal movement, calm professional clinician and patient, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.

---

# BATCH 2 — 14 new tests (after tree expansion)

## 32. cross-body
IMAGE: public/clinical-tests/cross-body.webp
FILE OUT: cross-body.mp4
PROMPT:
Using this illustration as reference, animate the cross-body adduction test (Physiotutors / Chronopoulos): elevate the arm to 90° of forward flexion, then passively guide maximum horizontal adduction across the chest toward the opposite shoulder (elbow ~90° flexed, scarf position). Positive finding is pain on top of the shoulder at the AC joint. CAST LOCK � same two people as Cozen / first Kinora catalog. PATIENT: adult man, short brown hair, clean-shaven, fair skin, heather-grey crew-neck t-shirt, dark charcoal shorts. CLINICIAN: adult man, short dark hair, clean-shaven, fair skin, solid medium-blue V-neck medical scrubs (top and trousers), bare hands. Same light-blue studio, blue treatment table, polished medical-illustration style. FORBIDDEN: different faces, female clinician or patient, polo, khaki, tank top, shirtless, white coat, extra people. Educational physiotherapy demonstration video, soft neutral lighting, anatomically accurate hand placement, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.

## 33. valgus-stress-mcl
IMAGE: public/clinical-tests/valgus-stress-mcl.webp
DaVinci upload FIRST: public/clinical-tests/valgus-stress-mcl-start.png
FILE OUT: valgus-stress-mcl.mp4
PROMPT:
```
Using this illustration as the FIRST frame, animate the VALGUS stress test for the MCL exactly like a Physiotutors clinic demo. Photorealistic. NO anatomical drawings, NO skeleton overlays, NO arrows, NO captions.

CAMERA: keep the SAME side medium close-up of the RIGHT leg (mid-thigh to foot). Do NOT switch to overhead / bird's-eye.

KNEE LOCK: RIGHT leg stays FULLY STRAIGHT / completely extended on the table (0°). FORBIDDEN: any knee bend, 20°, 45°, 90°, McMurray pose.

HANDS (Physiotutors valgus):
- One hand on the OUTER / LATERAL side of the KNEE — pushes the knee INWARD (medially).
- Other hand grips the ANKLE / distal lower leg — moves the ankle OUTWARD (laterally).
Clear valgus: knee in + ankle out.

MOTION (8s): gentle valgus stress → brief hold → slight release → 1–2 calm reps. Leg stays straight the whole time.

CAST LOCK — Cozen pair: PATIENT heather-grey crew-neck t-shirt, dark charcoal shorts. CLINICIAN solid medium-blue V-neck scrubs, bare hands. Clinic table, soft neutral lighting. FORBIDDEN: bent knee; overhead camera; white coat; logos; watermarks. Camera steady, 8 seconds.
```

## 34. varus-stress-lcl
IMAGE: public/clinical-tests/varus-stress-lcl.webp
DaVinci upload FIRST: public/clinical-tests/varus-stress-lcl-start.png
FILE OUT: varus-stress-lcl.mp4
PROMPT:
```
Using this illustration as the FIRST frame, animate the VARUS stress test for the LCL exactly like a Physiotutors clinic demo. Photorealistic. NO anatomical drawings, NO skeleton overlays, NO arrows, NO captions.

CAMERA: keep the SAME side medium close-up of the RIGHT leg (mid-thigh to foot). Do NOT switch to overhead / bird's-eye.

KNEE LOCK: RIGHT leg stays FULLY STRAIGHT / completely extended on the table (0°). FORBIDDEN: any knee bend, 20°, 45°, 90°, McMurray pose.

HANDS (Physiotutors varus — opposite of valgus):
- One hand on the INNER / MEDIAL side of the KNEE — directs the knee OUTWARD (laterally).
- Other hand grips the ANKLE / distal lower leg — moves the ankle INWARD (medially).
Clear varus: knee out + ankle in.

MOTION (8s): gentle varus stress → brief hold → slight release → 1–2 calm reps. Leg stays straight the whole time.

CAST LOCK — Cozen pair: PATIENT heather-grey crew-neck t-shirt, dark charcoal shorts. CLINICIAN solid medium-blue V-neck medical scrubs, bare hands. Clinic table, soft neutral lighting. FORBIDDEN: bent knee; overhead camera; white coat; logos; watermarks. Camera steady, 8 seconds.
```

## 35. posterior-drawer-pcl
IMAGE: public/clinical-tests/posterior-drawer-pcl.webp
FILE OUT: posterior-drawer-pcl.mp4
PROMPT:
Using this illustration as reference, animate the posterior drawer / sag test for the PCL: patient supine, knee flexed about 90 degrees, clinician pushes the proximal tibia posteriorly relative to the femur. CAST LOCK � same two people as Cozen / first Kinora catalog. PATIENT: adult man, short brown hair, clean-shaven, fair skin, heather-grey crew-neck t-shirt, dark charcoal shorts. CLINICIAN: adult man, short dark hair, clean-shaven, fair skin, solid medium-blue V-neck medical scrubs (top and trousers), bare hands. Same light-blue studio, blue treatment table, polished medical-illustration style. FORBIDDEN: different faces, female clinician or patient, polo, khaki, tank top, shirtless, white coat, extra people. Educational physiotherapy demonstration video, soft neutral lighting, anatomically accurate hand placement, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.

## 36. resisted-wrist-flexion
IMAGE: public/clinical-tests/resisted-wrist-flexion.webp
FILE OUT: resisted-wrist-flexion.mp4
PROMPT:
Using this illustration as reference, animate resisted wrist flexion for medial epicondylalgia: elbow nearly extended, palm up, patient flexes the wrist against the clinician's resistance while the medial epicondyle is assessed. CAST LOCK � same two people as Cozen / first Kinora catalog. PATIENT: adult man, short brown hair, clean-shaven, fair skin, heather-grey crew-neck t-shirt, dark charcoal shorts. CLINICIAN: adult man, short dark hair, clean-shaven, fair skin, solid medium-blue V-neck medical scrubs (top and trousers), bare hands. Same light-blue studio, blue treatment table, polished medical-illustration style. FORBIDDEN: different faces, female clinician or patient, polo, khaki, tank top, shirtless, white coat, extra people. Educational physiotherapy demonstration video, soft neutral lighting, anatomically accurate hand placement, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.

## 37. elbow-flexion-cubital

**Refs:** Physiotutors Elbow Flexion Test — [youtube.com/watch?v=brN-VLUETVU](https://www.youtube.com/watch?v=brN-VLUETVU)

**DaVinci upload (preferred — HOLD in front):** `c:\Users\sergi\project-ai\public\clinical-tests\elbow-flexion-cubital-front.png`  
**Alt START (arms down):** `c:\Users\sergi\project-ai\public\clinical-tests\elbow-flexion-cubital-start.png`  
**END / hold:** `c:\Users\sergi\project-ai\public\clinical-tests\elbow-flexion-cubital-end.png`  
**IMAGE:** `public/clinical-tests/elbow-flexion-cubital.webp`  
**FILE OUT:** `elbow-flexion-cubital.mp4`

**REJECTED:** (64)(66) — arms ended next to the head / goalpost. Hands must stay IN FRONT of the chest.

**Prompt (copy/paste) — arms IN FRONT of chest, never beside the head:**

```
Using this illustration as reference, animate the Elbow Flexion Test for cubital tunnel. One patient facing camera, black polo, white studio, no clinician.

START (0–1s): arms relaxed DOWN at the sides.

MOTION (1–4s): bring BOTH arms IN FRONT of the chest. BOTH elbows go to MAXIMAL FLEXION. BOTH wrists FULLY EXTEND (bent backward). Forearms end PARALLEL in FRONT of the torso/chest — palms up in front of the chest/shoulders.

HOLD (4–8s): freeze with hands IN FRONT of the chest. Elbows fully bent, wrists extended.

DIRECTION — CRITICAL:
✅ CORRECT: hands in FRONT of the body / chest (you could clap in front of you).
❌ FORBIDDEN: hands next to the head, beside the ears, by the temples, or out to the sides like a goalpost / cactus / fists by the head. That is the WRONG pose.

Camera steady, 8 seconds, no logos, no captions, no watermarks.
```

**Ultra-short:**

```
Elbow flexion: arms DOWN → elbows MAX bend with wrists extended, hands IN FRONT of the chest. NEVER hands beside the head/ears. Hold. 8s, no text.
```

## 38. cervical-distraction
IMAGE: public/clinical-tests/cervical-distraction.webp
FILE OUT: cervical-distraction.mp4
PROMPT:
Using this illustration as reference, animate cervical distraction: patient seated or supine, clinician gently applies axial traction lifting the head to unload the cervical spine and assess relief of arm symptoms. Educational physiotherapy demonstration video, realistic clinic setting, soft neutral lighting, anatomically accurate careful hand placement, calm professional clinician and patient, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.

## 39. thumb-ucl-stress
IMAGE: public/clinical-tests/thumb-ucl-stress.webp
FILE OUT: thumb-ucl-stress.mp4
PROMPT:
Using this illustration as reference, animate ulnar collateral ligament stress of the thumb MCP: clinician stabilizes the metacarpal and applies gentle valgus stress to the proximal phalanx of the thumb. CAST LOCK � same two people as Cozen / first Kinora catalog. PATIENT: adult man, short brown hair, clean-shaven, fair skin, heather-grey crew-neck t-shirt, dark charcoal shorts. CLINICIAN: adult man, short dark hair, clean-shaven, fair skin, solid medium-blue V-neck medical scrubs (top and trousers), bare hands. Same light-blue studio, blue treatment table, polished medical-illustration style. FORBIDDEN: different faces, female clinician or patient, polo, khaki, tank top, shirtless, white coat, extra people. Educational physiotherapy demonstration video, soft neutral lighting, anatomically accurate hand placement, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.

## 40. finkelstein

**Refs:** Physiotutors original Finkelstein (NOT Eichhoff) — [youtube.com/watch?v=8WBVXBx34W0](https://www.youtube.com/watch?v=8WBVXBx34W0)

**DaVinci upload (START):** `c:\Users\sergi\project-ai\public\clinical-tests\finkelstein-start.png`  
**Last frame:** `c:\Users\sergi\project-ai\public\clinical-tests\finkelstein-end.png`  
**IMAGE:** `public/clinical-tests/finkelstein.webp`  
**FILE OUT:** `finkelstein.mp4`

**Still lock:** START = hand hanging off table edge, thumb UP (Physiotutors 0:00). END = clinician presses the thumb down / ulnar. NOT Eichhoff fist-over-thumb.

**Prompt (copy/paste) � original Finkelstein like Physiotutors:**

```
Using this illustration as reference, animate the ORIGINAL Finkelstein test for De Quervain EXACTLY like Physiotutors. NOT Eichhoff.

SETUP: patient's forearm rests on a treatment TABLE; the HAND hangs OFF the edge of the table.

START (0�1s): hand hanging freely off the edge, THUMB pointing UP (thumbs-up / radial side up), fingers relaxed and slightly curled. No pressure yet.

MOTION (1�7s): clinician's hands enter � one stabilizes the forearm on the table; the OTHER grasps the patient's THUMB and applies clear DOWNWARD PRESSURE, pushing the thumb toward the floor into ulnar deviation. Only the thumb is pressed � not the other fingers.

END (7�8s): hold with the thumb pressed down / ulnarly.

FORBIDDEN: Eichhoff fist with thumb tucked inside; pressing the fingers instead of the thumb; hand supported flat on the table. Camera steady, 8 seconds, no logos, no captions, no watermarks.
```

**Ultra-short:**

```
Finkelstein: hand hangs off table, thumb UP; clinician presses the thumb DOWN into ulnar deviation. NOT fist-over-thumb (Eichhoff). 8s, no text.
```

## 41. snuffbox-palpation
IMAGE: public/clinical-tests/snuffbox-palpation.webp
FILE OUT: snuffbox-palpation.mp4
PROMPT:
Using this illustration as reference, animate anatomical snuffbox palpation: thumb extended, clinician presses gently into the hollow between the extensor tendons on the radial wrist over the scaphoid. CAST LOCK � same two people as Cozen / first Kinora catalog. PATIENT: adult man, short brown hair, clean-shaven, fair skin, heather-grey crew-neck t-shirt, dark charcoal shorts. CLINICIAN: adult man, short dark hair, clean-shaven, fair skin, solid medium-blue V-neck medical scrubs (top and trousers), bare hands. Same light-blue studio, blue treatment table, polished medical-illustration style. FORBIDDEN: different faces, female clinician or patient, polo, khaki, tank top, shirtless, white coat, extra people. Educational physiotherapy demonstration video, soft neutral lighting, anatomically accurate hand placement, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.

## 42. thumb-axial-load
IMAGE: public/clinical-tests/thumb-axial-load.webp
FILE OUT: thumb-axial-load.mp4
PROMPT:
Using this illustration as reference, animate axial load of the thumb for scaphoid screening: clinician compresses along the thumb metacarpal toward the wrist/scaphoid. Show a HAND and WRIST only — not a foot. CAST LOCK � same two people as Cozen / first Kinora catalog. PATIENT: adult man, short brown hair, clean-shaven, fair skin, heather-grey crew-neck t-shirt, dark charcoal shorts. CLINICIAN: adult man, short dark hair, clean-shaven, fair skin, solid medium-blue V-neck medical scrubs (top and trousers), bare hands. Same light-blue studio, blue treatment table, polished medical-illustration style. FORBIDDEN: different faces, female clinician or patient, polo, khaki, tank top, shirtless, white coat, extra people. Educational physiotherapy demonstration video, soft neutral lighting, anatomically accurate hand placement, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.

## 43. tfcc-ulnar-load
IMAGE: public/clinical-tests/tfcc-ulnar-load.webp
FILE OUT: tfcc-ulnar-load.mp4
PROMPT:
Using this illustration as reference, animate ulnar load / TFCC provocation: wrist in ulnar deviation with axial load through the hand, clinician assessing the ulnar fovea region. CAST LOCK � same two people as Cozen / first Kinora catalog. PATIENT: adult man, short brown hair, clean-shaven, fair skin, heather-grey crew-neck t-shirt, dark charcoal shorts. CLINICIAN: adult man, short dark hair, clean-shaven, fair skin, solid medium-blue V-neck medical scrubs (top and trousers), bare hands. Same light-blue studio, blue treatment table, polished medical-illustration style. FORBIDDEN: different faces, female clinician or patient, polo, khaki, tank top, shirtless, white coat, extra people. Educational physiotherapy demonstration video, soft neutral lighting, anatomically accurate hand placement, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.

## 44. cmc-grind
IMAGE: public/clinical-tests/cmc-grind.webp
FILE OUT: cmc-grind.mp4
PROMPT:
Using this illustration as reference, animate the CMC grind test of the thumb.

CRITICAL FORCE DIRECTION: the axial compression (fuerza) must go INTO THE BONE / into the CMC joint — push the thumb metacarpal axially toward the trapezium so load is transmitted into the bones of the joint. Do NOT squeeze soft tissue sideways; do NOT bend the thumb as the main action; the force vector is along the metacarpal shaft INTO the joint (hacia el hueso).

MOTION: clinician grips the thumb metacarpal, applies clear axial compression into the CMC (bone-on-bone load), then gently rotates / grinds at the carpometacarpal joint while keeping that compressive force into the bone.

CAST LOCK � same two people as Cozen / first Kinora catalog. PATIENT: adult man, short brown hair, clean-shaven, fair skin, heather-grey crew-neck t-shirt, dark charcoal shorts. CLINICIAN: adult man, short dark hair, clean-shaven, fair skin, solid medium-blue V-neck medical scrubs (top and trousers), bare hands. Same light-blue studio, blue treatment table, polished medical-illustration style. FORBIDDEN: different faces, female clinician or patient, polo, khaki, tank top, shirtless, white coat, extra people. Educational physiotherapy demonstration video, soft neutral lighting, anatomically accurate hand placement, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.

## 45. crossed-slr
IMAGE: public/clinical-tests/crossed-slr.webp
FILE OUT: crossed-slr.mp4
PROMPT:
Using this illustration as reference, animate the crossed straight leg raise (well-leg raise): patient supine, clinician raises the asymptomatic straight leg while the symptomatic leg remains on the table. CAST LOCK � same two people as Cozen / first Kinora catalog. PATIENT: adult man, short brown hair, clean-shaven, fair skin, heather-grey crew-neck t-shirt, dark charcoal shorts. CLINICIAN: adult man, short dark hair, clean-shaven, fair skin, solid medium-blue V-neck medical scrubs (top and trousers), bare hands. Same light-blue studio, blue treatment table, polished medical-illustration style. FORBIDDEN: different faces, female clinician or patient, polo, khaki, tank top, shirtless, white coat, extra people. Educational physiotherapy demonstration video, soft neutral lighting, anatomically accurate hand placement, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.

## 46. resisted-knee-flexion
IMAGE: public/clinical-tests/resisted-knee-flexion.png
DaVinci upload: public/clinical-tests/resisted-knee-flexion-start.png
FILE OUT: resisted-knee-flexion.mp4
PROMPT:
Using this illustration as reference, animate resisted knee flexion (flexión de rodilla resistida / isquiotibiales). Photorealistic. NO anatomical drawings, NO skeleton overlays, NO arrows, NO captions.

SETUP: patient PRONE (face down) on the table. One knee flexed ~90° (heel toward buttock, lower leg vertical). Clinician beside the tested leg.

HANDS:
- One hand stabilizes the pelvis / posterior thigh (keeps the thigh down on the table).
- The OTHER hand cups the HEEL / posterior heel–Achilles (zona del talón) — main contact for resistance.

CRITICAL — EL FISIO RESISTE LA FLEXIÓN (error if missing):
- The PATIENT actively tries to FLEX the knee further (pull the heel toward the glute / isquiotibiales contraction).
- The CLINICIAN clearly RESISTS that effort at the heel — opposing force that BLOCKS / slows the heel from coming closer to the buttock.
- Show visible isometric struggle: patient pushing into flexion, physio bracing against it. The resisting arm looks loaded.
- This is NOT a passive stretch, NOT passive ROM, NOT the physio bending the knee for the patient. The physio's job is RESISTIR la flexión.

MOTION (1–7s): patient pushes into knee flexion against firm heel resistance → brief isometric hold (clear opposition) → slight release. Keep resisting hand on the heel the whole time.

CAST LOCK — same two people as Cozen / first Kinora catalog. PATIENT: adult man, short brown hair, clean-shaven, fair skin, heather-grey crew-neck t-shirt, dark charcoal shorts. CLINICIAN: adult man, short dark hair, clean-shaven, fair skin, solid medium-blue V-neck medical scrubs (top and trousers), bare hands. Same light-blue studio, blue treatment table. FORBIDDEN: different faces, female clinician or patient, polo, khaki, tank top, shirtless, white coat, extra people. Educational physiotherapy demonstration video, soft neutral lighting, anatomically accurate hand placement, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.

## 47. sitting-ischium
IMAGE: public/clinical-tests/sitting-ischium.webp
DaVinci upload: public/clinical-tests/sitting-ischium-start.png
FILE OUT: sitting-ischium.mp4
PROMPT:
Using this illustration as reference, animate pain on sitting / proximal hamstring ischial provocation (dolor al sentarse).

CRITICAL SETUP — SITTING ON A HARD SURFACE:
- Patient SITS on a hard chair or hard table edge (superficie dura). Weight on the buttocks / ischial tuberosities.
- NOT a straight-leg raise. NOT lying supine lifting the leg.
- Clinician may lightly indicate or press the sit-bone area (tuberosidad isquiática — under the buttock where it meets the seat), not the front of the hip/groin.

MOTION (1–7s): patient settles weight onto the hard seat → brief hold showing familiar ischial / proximal posterior thigh discomfort → slight shift of weight. Keep the scene clearly about sitting load on the ischium.

FORBIDDEN: active SLR; prone knee flexion; standing only. Camera steady, 8 seconds, no logos, no captions, no watermarks. Educational physiotherapy demonstration video, realistic clinic setting, soft neutral lighting, anatomically accurate hand placement, calm professional clinician and patient, no blood, no gore.

---

# Batch 3 — Shoulder expansion (ids 46–56) — see dedicated pack

Images are ready as `.webp`. Full prompts + embeds:
→ **`SHOULDER_NEW_TESTS_VIDEO_PROMPTS.md`**
