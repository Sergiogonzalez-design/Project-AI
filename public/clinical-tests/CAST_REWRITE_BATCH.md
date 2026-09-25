# CAST rewrite batch — same motion, Cozen people only

**Goal:** Re-export every video below so the **patient and physio match Cozen** (grey t-shirt + blue scrubs).  
**Do not change the clinical technique** — copy the prompt for that test exactly.

**Do NOT rewrite** first-catalog clips that already match (Cozen, Mill, Lachman, Neer, Faber, etc.).

## How to run each clip

1. Upload the **new still** listed under Image.
2. Paste the **Prompt**.
3. Export `videos/<id>.mp4` (8s demo).
4. Fit logo:

```powershell
powershell -File scripts/append-kinora-logo-outro.ps1 -Only <id>.mp4
```

5. Upload:

```powershell
node scripts/upload-clinical-tests-storage.mjs --only videos/<id>.mp4,<id>.webp
```

(If you also convert the new `.png` still to `.webp`, include that file in `--only`.)

## CAST LOCK (already at the end of every prompt)

Same two people as Cozen: grey crew-neck patient + medium-blue V-neck scrubs physio. No new faces, no polo, khaki, tank, shirtless, white coat, female actors.

---

## Checklist (25 videos)

| # | id | Image (upload this) | Out |
|---|-----|---------------------|-----|
| 1 | thomas-test | `thomas-test.png` | `thomas-test.mp4` |
| 2 | resisted-adduction | `resisted-adduction.png` | `resisted-adduction.mp4` |
| 3 | resisted-hip-flexion | `resisted-hip-flexion.png` | `resisted-hip-flexion.mp4` |
| 4 | resisted-abduction | `resisted-abduction.png` | `resisted-abduction.mp4` |
| 5 | log-roll | `log-roll.png` | `log-roll.mp4` |
| 6 | stinchfield | `stinchfield-start.png` + last `stinchfield-end.png` | `stinchfield.mp4` |
| 7 | hip-scour | `hip-scour.png` | `hip-scour.mp4` |
| 8 | noble-compression | `noble-compression.png` | `noble-compression.mp4` |
| 9 | ober-test | `ober-test.png` | `ober-test.mp4` |
| 10 | patellar-apprehension | `patellar-apprehension.png` | `patellar-apprehension.mp4` |
| 11 | dial-test | `dial-test.png` | `dial-test.mp4` |
| 12 | kim-test | `kim-test-start.png` + last `kim-test-end.png` | `kim-test.mp4` |
| 13 | jerk-test | `jerk-test-start.png` | `jerk-test.mp4` |
| 14 | thigh-thrust | `thigh-thrust.png` | `thigh-thrust.mp4` |
| 15 | si-distraction | `si-distraction.png` | `si-distraction.mp4` |
| 16 | si-compression | `si-compression.png` | `si-compression.mp4` |
| 17 | active-slr | `active-slr.png` | `active-slr.mp4` |
| 18 | syndesmosis-squeeze | `syndesmosis-squeeze.png` | `syndesmosis-squeeze.mp4` |
| 19 | kleiger | `kleiger.png` | `kleiger.mp4` |
| 20 | talar-tilt (×3) | `talar-tilt-atfl/deltoid/cfl.png` | `talar-tilt-*.mp4` |
| 21 | flexion-rotation | `flexion-rotation.png` | `flexion-rotation.mp4` |
| 22 | bakody | `bakody.png` | `bakody.mp4` |
| 23 | chair-push-plri | `chair-push-plri-start.png` | `chair-push-plri.mp4` |
| 24 | biceps-squeeze | `biceps-squeeze-start.png` | `biceps-squeeze.mp4` |
| 25 | press-test | `press-test.png` | `press-test.mp4` |

All paths under: `c:\Users\sergi\project-ai\public\clinical-tests\`

**Use only the Image column.** Those 25 files already show the Cozen pair (grey t-shirt + blue scrubs, both men). Do **not** upload leftover siblings such as `kim-test.png`, `jerk-test.png`, `hip-scour-start.png`, `patellar-apprehension-start.png`, `dial-test-start.png`, `chair-push-plri.png`, or `biceps-squeeze.png` — those were old-cast leftovers and have now been recast, but the video batch still uses the listed start stills.

---

## 1. thomas-test

**Image:** `thomas-test.png` · **Out:** `thomas-test.mp4`

```
Using this illustration as reference, animate the Thomas test for hip flexors: patient supine at the table edge hugs one knee to the chest; the opposite thigh extends/lowers controlled; brief hold then slight return; do not dramatize pain. Optional soft cyan highlight on the iliopsoas/anterior hip. CAST LOCK — same two people as Cozen / first Kinora catalog. PATIENT: adult man, short brown hair, clean-shaven, fair skin, heather-grey crew-neck t-shirt, dark charcoal shorts. CLINICIAN: adult man, short dark hair, clean-shaven, fair skin, solid medium-blue V-neck medical scrubs (top and trousers), bare hands. Same light-blue studio, blue treatment table, polished medical-illustration style. FORBIDDEN: different faces, female clinician or patient, polo, khaki, tank top, shirtless, white coat, extra people. Educational physiotherapy demonstration video, soft neutral lighting, anatomically accurate hand placement, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.
```

---

## 2. resisted-adduction

**Image:** `resisted-adduction.png` · **Out:** `resisted-adduction.mp4`

```
Using this illustration as reference, animate the resisted adduction / squeeze test: patient supine with hips slightly flexed; clinician resists between the knees as the patient gently squeezes the knees together; brief hold then release. Optional soft cyan highlight on the medial groin/adductors. CAST LOCK — same two people as Cozen / first Kinora catalog. PATIENT: adult man, short brown hair, clean-shaven, fair skin, heather-grey crew-neck t-shirt, dark charcoal shorts. CLINICIAN: adult man, short dark hair, clean-shaven, fair skin, solid medium-blue V-neck medical scrubs (top and trousers), bare hands. Same light-blue studio, blue treatment table, polished medical-illustration style. FORBIDDEN: different faces, female clinician or patient, polo, khaki, tank top, shirtless, white coat, extra people. Educational physiotherapy demonstration video, soft neutral lighting, anatomically accurate hand placement, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.
```

---

## 3. resisted-hip-flexion

**Image:** `resisted-hip-flexion.png` · **Out:** `resisted-hip-flexion.mp4`

```
Using this illustration as reference, animate resisted hip flexion: patient supine attempts to lift the leg into hip flexion while the clinician applies controlled downward resistance on the distal thigh; brief hold then release. Optional soft cyan highlight on the iliopsoas/anterior hip. CAST LOCK — same two people as Cozen / first Kinora catalog. PATIENT: adult man, short brown hair, clean-shaven, fair skin, heather-grey crew-neck t-shirt, dark charcoal shorts. CLINICIAN: adult man, short dark hair, clean-shaven, fair skin, solid medium-blue V-neck medical scrubs (top and trousers), bare hands. Same light-blue studio, blue treatment table, polished medical-illustration style. FORBIDDEN: different faces, female clinician or patient, polo, khaki, tank top, shirtless, white coat, extra people. Educational physiotherapy demonstration video, soft neutral lighting, anatomically accurate hand placement, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.
```

---

## 4. resisted-abduction

**Image:** `resisted-abduction.png` · **Out:** `resisted-abduction.mp4`

```
Using this illustration as reference, animate resisted hip abduction for GTPS: patient side-lying; top leg gently abducts against clinician resistance at the lateral distal thigh; brief hold then release. Optional soft cyan highlight on the greater trochanter / gluteus medius. CAST LOCK — same two people as Cozen / first Kinora catalog. PATIENT: adult man, short brown hair, clean-shaven, fair skin, heather-grey crew-neck t-shirt, dark charcoal shorts. CLINICIAN: adult man, short dark hair, clean-shaven, fair skin, solid medium-blue V-neck medical scrubs (top and trousers), bare hands. Same light-blue studio, blue treatment table, polished medical-illustration style. FORBIDDEN: different faces, female clinician or patient, polo, khaki, tank top, shirtless, white coat, extra people. Educational physiotherapy demonstration video, soft neutral lighting, anatomically accurate hand placement, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.
```

---

## 5. log-roll

**Image:** `log-roll.png` · **Out:** `log-roll.mp4`

```
Using this illustration as reference, animate the passive log roll test: patient supine with hip and knee extended; clinician gently rolls the whole leg into internal then external rotation by guiding the ankle/foot; slow calm motion, brief hold each way. Optional soft cyan highlight on the hip joint. CAST LOCK — same two people as Cozen / first Kinora catalog. PATIENT: adult man, short brown hair, clean-shaven, fair skin, heather-grey crew-neck t-shirt, dark charcoal shorts. CLINICIAN: adult man, short dark hair, clean-shaven, fair skin, solid medium-blue V-neck medical scrubs (top and trousers), bare hands. Same light-blue studio, blue treatment table, polished medical-illustration style. FORBIDDEN: different faces, female clinician or patient, polo, khaki, tank top, shirtless, white coat, extra people. Educational physiotherapy demonstration video, soft neutral lighting, anatomically accurate hand placement, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.
```

---

## 6. stinchfield

**First frame:** `stinchfield-start.png` · **Last frame:** `stinchfield-end.png` · **Out:** `stinchfield.mp4`  
**Camera lock:** high-angle looking from the patient's HEAD toward the FEET (Physiotutors POV).  
**Motion lock:** External Rotation Stinchfield — straight leg in ER; patient pushes UP against resistance at the ankle.

```
Using this illustration as reference, animate the External Rotation Stinchfield test EXACTLY like Physiotutors.

CAMERA (CRITICAL): keep the SAME high-angle view looking DOWN the body from near the patient's HEAD toward the FEET. Do NOT switch to a side-on camera.

SETUP: patient SUPINE. Tested leg STRAIGHT (knee extended). Hip in EXTERNAL ROTATION — foot / toes point OUTWARD to the side. Clinician grips the distal leg JUST ABOVE THE ANKLE with both hands.

START (0–1s): leg on/near the table in ER; clinician ready to resist.

MOTION (1–7s): patient ACTIVELY LIFTS / PUSHES the straight leg UPWARD (hip flexion) against the clinician's DOWNWARD resistance at the ankle — patient “apretar hacia arriba”. Keep knee straight and keep EXTERNAL ROTATION (toes stay out). Rise about 20–30°, brief hold.

END (7–8s): hold the elevated resisted position in ER.

FORBIDDEN: side camera; bend the knee; foot pointing to the ceiling without ER; resistance on the thigh only; passive flop. Camera steady, 8 seconds, no logos, no captions, no watermarks.

CAST LOCK — same two people as Cozen / first Kinora catalog. PATIENT: adult man, short brown hair, clean-shaven, fair skin, heather-grey crew-neck t-shirt, dark charcoal shorts. CLINICIAN: adult man, short dark hair, clean-shaven, fair skin, solid medium-blue V-neck medical scrubs (top and trousers), bare hands. Same light-blue studio, blue treatment table, polished medical-illustration style. FORBIDDEN: different faces, female clinician or patient, polo, khaki, tank top, shirtless, white coat, extra people.
```

---

## 7. hip-scour

**Image:** `hip-scour.png` · **Out:** `hip-scour.mp4`  
**Motion lock:** compression + adduction (hacia dentro) + internal rotation.

```
Using this illustration as reference, animate the hip scour / quadrant test (prueba de erosión de la cadera). Match Physical Therapy Nation technique.

SETUP (0–1s): patient SUPINE on the table. Clinician stands beside the tested leg. Bring that hip and knee to ~90° flexion. One hand on top of the KNEE applying clear AXIAL COMPRESSION down the femur into the hip joint; the other hand supports the lower leg / ankle to control rotation.

CRITICAL MOTION — PIERNA HACIA DENTRO + ROTACIÓN INTERNA:
- Move the flexed thigh INWARD across the midline (ADDUCTION / hacia dentro) — the knee travels toward the opposite shoulder / opposite side of the pelvis.
- Add clear INTERNAL ROTATION of the hip: rotate the femur so the lower leg / foot swings OUTWARD while the knee stays pointed inward (classic IR with hip flexed).
- Keep axial compression through the knee the whole time.

PHASES (1–7s):
1) Hold 90° flexion + compression.
2) Adduct the thigh inward (hacia dentro) while compressing.
3) Add / maintain internal rotation (rotación interna) and gently scour / arc a small controlled path under load.
4) Brief hold in the adducted + internally rotated + compressed position.

FORBIDDEN: only abduction (leg going outward as the main move); external rotation as the main move; no compression; violent / painful dramatization. Stay calm and professional.

CAST LOCK — same two people as Cozen / first Kinora catalog. PATIENT: adult man, short brown hair, clean-shaven, fair skin, heather-grey crew-neck t-shirt, dark charcoal shorts. CLINICIAN: adult man, short dark hair, clean-shaven, fair skin, solid medium-blue V-neck medical scrubs (top and trousers), bare hands. Same light-blue studio, blue treatment table, polished medical-illustration style. FORBIDDEN: different faces, female clinician or patient, polo, khaki, tank top, shirtless, white coat, extra people. Educational physiotherapy demonstration video, soft neutral lighting, anatomically accurate hand placement, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.
```

---

## 8. noble-compression

**Image:** `noble-compression.png` · **Out:** `noble-compression.mp4`  
**Motion lock:** press outer knee + flexion → extension.

```
Using this illustration as reference, animate the Noble compression test for IT band syndrome. NO anatomical drawings, NO cyan overlays, NO arrows — real skin and hands only.

SETUP: patient SUPINE. Clinician firmly PRESSES (apretar) with thumb/fingers on the OUTER / LATERAL side of the knee — lateral femoral epicondyle / ITB (por fuera de la rodilla). Other hand holds the ankle / lower leg.

CRITICAL MOTION — FLEXIÓN → EXTENSIÓN:
1) Start with the knee in clear FLEXION (bent).
2) Keep firm LATERAL compression the whole time (do not let go of the outer knee pressure).
3) Passively move the knee from FLEXION into EXTENSION (straighten the leg) while maintaining that outer pressure.
4) Brief hold near ~30° / as the ITB passes the epicondyle, then slight release.

FORBIDDEN: pressing on the medial (inner) knee; only small wiggle without clear flexion-to-extension; overlays/arrows.

CAST LOCK — same two people as Cozen / first Kinora catalog. PATIENT: adult man, short brown hair, clean-shaven, fair skin, heather-grey crew-neck t-shirt, dark charcoal shorts. CLINICIAN: adult man, short dark hair, clean-shaven, fair skin, solid medium-blue V-neck medical scrubs (top and trousers), bare hands. Same light-blue studio, blue treatment table, polished medical-illustration style. FORBIDDEN: different faces, female clinician or patient, polo, khaki, tank top, shirtless, white coat, extra people. Educational physiotherapy demonstration video, soft neutral lighting, anatomically accurate hand placement, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.
```

---

## 9. ober-test

**Image:** `ober-test.png` · **Out:** `ober-test.mp4`

```
Using this illustration as reference, animate the Ober test: patient side-lying with the bottom hip flexed for stability; clinician supports the top leg, gently abducts and extends the hip, then slowly lowers the leg into adduction; calm controlled motion. Optional soft cyan highlight on the IT band / TFL. CAST LOCK — same two people as Cozen / first Kinora catalog. PATIENT: adult man, short brown hair, clean-shaven, fair skin, heather-grey crew-neck t-shirt, dark charcoal shorts. CLINICIAN: adult man, short dark hair, clean-shaven, fair skin, solid medium-blue V-neck medical scrubs (top and trousers), bare hands. Same light-blue studio, blue treatment table, polished medical-illustration style. FORBIDDEN: different faces, female clinician or patient, polo, khaki, tank top, shirtless, white coat, extra people. Educational physiotherapy demonstration video, soft neutral lighting, anatomically accurate hand placement, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.
```

---

## 10. patellar-apprehension

**Image:** `patellar-apprehension.png` · **Out:** `patellar-apprehension.mp4`  
**Motion lock:** thumbs on the **rótula / patella bone** → push laterally (hacia fuera).  
**FORBIDDEN:** pressing the **tendón rotuliano** (patellar tendon below the kneecap).

```
Using this illustration as reference, animate the patellar apprehension test (aprehensión rotuliana). Photorealistic. NO anatomical drawings, NO skeleton overlays, NO arrows, NO captions.

SETUP: patient SUPINE. Knee ONLY slightly flexed (~20–30° — almost straight, NOT 90°). Heel on the table. Close three-quarter view of the anterior knee so the kneecap is clearly visible.

HANDS — CRITICAL (error if wrong):
- Clinician presses with BOTH THUMBS directly on the MEDIAL (inner) BORDER of the PATELLA / KNEECAP BONE (rótula).
- Contact is ON THE HARD OVAL OF THE KNEECAP itself — apretar la RÓTULA.
- Fingers may lightly stabilize the lateral side of the patella, but force is thumbs on the patella bone.

FORBIDDEN HAND CONTACT:
- Do NOT press / push / squeeze the PATELLAR TENDON (tendón rotuliano) — the soft vertical band BELOW the kneecap down to the tibial tuberosity.
- Do NOT put main force on the shin, tibial tuberosity, or soft tissue under the inferior pole of the patella.
- Do NOT grab the calf as the main action.

CRITICAL MOTION — RÓTULA HACIA FUERA:
- Clearly PUSH / glide the PATELLA BONE LATERALLY (hacia fuera — toward the outer side of the knee).
- The only main movement is the kneecap sliding outward under the thumbs. Do NOT push inward. Do NOT move the whole leg as the main action.

MOTION (1–7s): gentle steady lateral push of the patella → brief hold (apprehension moment) → release back to center. Calm, controlled. Do NOT dramatize pain or dislocation. No cyan overlays required.

CAST LOCK — same two people as Cozen / first Kinora catalog. PATIENT: adult man, short brown hair, clean-shaven, fair skin, heather-grey crew-neck t-shirt, dark charcoal shorts. CLINICIAN: adult man, short dark hair, clean-shaven, fair skin, solid medium-blue V-neck medical scrubs (top and trousers), bare hands. Same light-blue studio, blue treatment table, polished medical-illustration style. FORBIDDEN: different faces, female clinician or patient, polo, khaki, tank top, shirtless, white coat, extra people. Educational physiotherapy demonstration video, soft neutral lighting, anatomically accurate hand placement, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.
```

---

## 11. dial-test

**First frame:** `dial-test-start.png` (prone, knees STRAIGHT)  
**Last frame:** `dial-test-end.png` (prone, knees ~90°, dial ER) · **Out:** `dial-test.mp4`  
**Catalog still:** `dial-test.png` (= end pose)

```
Using this illustration as the FIRST frame (and the matching END still as the LAST frame if available), animate the dial test (Loomer) for posterolateral corner EXACTLY like Physiotutors. Photorealistic. NO anatomical drawings, NO skeleton overlays, NO arrows, NO captions.

CAMERA: keep the SAME side / three-quarter view of the legs. Do NOT switch to overhead.

SEQUENCE (8s) — CRITICAL ORDER:
1) START (0–1.5s): patient PRONE (face down). BOTH knees FULLY STRAIGHT / extended flat on the table (0°). Clinician at the foot of the table holding / ready at the feet.
2) BEND (1.5–3.5s): clinician passively flexes BOTH knees together up to nearly 90° — thighs stay on the table, lower legs rise to point almost VERTICALLY upward. Smooth, controlled.
3) DIAL (3.5–7s) — BILATERAL EXTERNAL ROTATION (CRITICAL):
   With knees locked near 90°, BOTH hands cup the heels/feet.
   Rotate BOTH tibias / feet EXTERNALLY so the feet OPEN AWAY from each other (like opening a dial / a V):
   - Patient's RIGHT foot: toes turn OUTWARD to the patient's right (away from midline).
   - Patient's LEFT foot: toes turn OUTWARD to the patient's left (away from midline) — MIRROR of the right foot, OPPOSITE direction, same external rotation.
   Heels stay relatively close; toes / forefeet spread apart. Brief hold to compare sides.
4) END (7–8s): hold the 90° pose with BOTH feet still externally rotated open (V shape). Do NOT let either foot turn inward at the end.

FORBIDDEN: left foot turning the SAME way as the right (that makes left INTERNAL); left foot collapsing toward midline; only one foot rotating; starting already at 90° with no bend; supine; knees only ~30°; dropping legs straight during dial.

CAST LOCK — same two people as Cozen / first Kinora catalog. PATIENT: adult man, short brown hair, clean-shaven, fair skin, heather-grey crew-neck t-shirt, dark charcoal shorts. CLINICIAN: adult man, short dark hair, clean-shaven, fair skin, solid medium-blue V-neck medical scrubs (top and trousers), bare hands. Same light-blue studio, blue treatment table. FORBIDDEN: different faces, female clinician or patient, polo, khaki, tank top, shirtless, white coat, extra people, logos, watermarks. Camera steady, 8 seconds.
```

---

## 12. kim-test

**First frame:** `kim-test-start.png` · **Last frame:** `kim-test-end.png` · **Out:** `kim-test.mp4`  
**Motion lock:** seated 90°/90°, axial load, arm across body (not up).  
These stills match the current `kim-test.mp4` poses (arm out → across chest) with the Cozen pair. In DaVinci use **image-to-video + first and last frame** — do not upload the old video to swap faces.  
Ref: [Physiotutors Kim](https://www.youtube.com/watch?v=-knsALCdv_A)

```
Using this illustration as reference, animate the Kim test EXACTLY like Physiotutors. Patient SEATED.

START (0–1s): right shoulder abducted 90° (upper arm horizontal out to the side), elbow flexed 90° (forearm forward). Clinician behind/beside the right shoulder: one hand flat on TOP of the shoulder (acromion); other hand cups UNDER the elbow.

MOTION (1–7s): lean body weight in. Push continuous AXIAL LOAD through the elbow into the glenoid AND at the same time move the whole bent arm ACROSS THE BODY toward the opposite shoulder / across the front of the chest (horizontal adduction). Elbow stays bent at ~90°. Arm stays roughly at shoulder height — do NOT raise it up toward the head.

END (7–8s): hold the across-body pose with axial load still on.

FORBIDDEN: raise the arm upward / elevate the elbow above the head; arm behind the back; more abduction further out to the side.

CAST LOCK — same two people as Cozen / first Kinora catalog. PATIENT: adult man, short brown hair, clean-shaven, fair skin, heather-grey crew-neck t-shirt, dark charcoal shorts. CLINICIAN: adult man, short dark hair, clean-shaven, fair skin, solid medium-blue V-neck medical scrubs (top and trousers), bare hands. Same light-blue studio, blue treatment table, polished medical-illustration style. FORBIDDEN: different faces, female clinician or patient, polo, khaki, tank top, shirtless, white coat, extra people. Educational physiotherapy demonstration video, soft neutral lighting, anatomically accurate hand placement, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.
```

---

## 13. jerk-test

**Image:** `jerk-test-start.png` · **Out:** `jerk-test.mp4`  
**Motion lock:** start out to the side → fisio moves arm across chest with axial load.  
Ref: [Physiotutors Jerk](https://www.youtube.com/watch?v=j_qG1MNOws8)

```
Using this illustration as reference, animate the Jerk test exactly like a Physiotutors demo (posterior / posteroinferior instability). Patient SEATED. Clinician stands BEHIND / slightly beside the patient.

START (0–1.5s): tested arm at 90° ABDUCTION OUT TO THE SIDE (upper arm horizontal, parallel to floor — NOT across the chest yet), INTERNAL ROTATION (palm faces down), elbow flexed. Clinician: one hand STABILIZES the SCAPULA on the back of the shoulder; the OTHER hand holds the ELBOW and applies continuous AXIAL COMPRESSION through the humerus into the glenoid.

CRITICAL MOTION (1.5–7s): the PHYSIOTHERAPIST passively moves the arm in HORIZONTAL ADDUCTION — guiding the arm ACROSS THE FRONT OF THE BODY toward the opposite shoulder / midline while KEEPING the axial compression. The arm must visibly travel from out-to-the-side all the way across the chest. Patient does NOT move the arm alone — the fisio does it. Controlled, smooth, not a violent jerk of the whole torso.

7–8s: hold the across-body end pose (arm adducted across chest) with axial load still on.

HARD FAIL / DO NOT: leave the arm stuck out to the side for the whole video; only apply pressure without crossing the body; let the patient swing the arm alone; elevate diagonally like the Kim test; release the axial load; thrash or spin the patient.

CAST LOCK — same two people as Cozen / first Kinora catalog. PATIENT: adult man, short brown hair, clean-shaven, fair skin, heather-grey crew-neck t-shirt, dark charcoal shorts. CLINICIAN: adult man, short dark hair, clean-shaven, fair skin, solid medium-blue V-neck medical scrubs (top and trousers), bare hands. Same light-blue studio, blue treatment table, polished medical-illustration style. FORBIDDEN: different faces, female clinician or patient, polo, khaki, tank top, shirtless, white coat, extra people. Educational physiotherapy demonstration video, soft neutral lighting, anatomically accurate hand placement, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.
```

---

## 14. thigh-thrust

**Image:** `thigh-thrust.png` · **Out:** `thigh-thrust.mp4`

```
Using this illustration as reference, animate the thigh thrust (posterior shear) sacroiliac provocation test: patient supine, hip flexed about 90°, clinician applies a controlled axial push along the femur toward the table; show a brief hold then release; do not dramatize pain. Optional soft cyan highlight on the SI joint. CAST LOCK — same two people as Cozen / first Kinora catalog. PATIENT: adult man, short brown hair, clean-shaven, fair skin, heather-grey crew-neck t-shirt, dark charcoal shorts. CLINICIAN: adult man, short dark hair, clean-shaven, fair skin, solid medium-blue V-neck medical scrubs (top and trousers), bare hands. Same light-blue studio, blue treatment table, polished medical-illustration style. FORBIDDEN: different faces, female clinician or patient, polo, khaki, tank top, shirtless, white coat, extra people. Educational physiotherapy demonstration video, soft neutral lighting, anatomically accurate hand placement, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.
```

---

## 15. si-distraction

**Image:** `si-distraction.png` · **Out:** `si-distraction.mp4`

```
Using this illustration as reference, animate the sacroiliac distraction (gapping) test: patient supine; clinician places hands on both ASIS and applies a controlled outward / cross-arm pressure; brief hold then release. Optional soft cyan highlight on the SI joints. CAST LOCK — same two people as Cozen / first Kinora catalog. PATIENT: adult man, short brown hair, clean-shaven, fair skin, heather-grey crew-neck t-shirt, dark charcoal shorts. CLINICIAN: adult man, short dark hair, clean-shaven, fair skin, solid medium-blue V-neck medical scrubs (top and trousers), bare hands. Same light-blue studio, blue treatment table, polished medical-illustration style. FORBIDDEN: different faces, female clinician or patient, polo, khaki, tank top, shirtless, white coat, extra people. Educational physiotherapy demonstration video, soft neutral lighting, anatomically accurate hand placement, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.
```

---

## 16. si-compression

**Image:** `si-compression.png` · **Out:** `si-compression.mp4`

```
Using this illustration as reference, animate the sacroiliac compression test: patient side-lying; clinician applies a controlled downward pressure on the iliac crest toward the table; brief hold then release. Optional soft cyan highlight on the SI joint. CAST LOCK — same two people as Cozen / first Kinora catalog. PATIENT: adult man, short brown hair, clean-shaven, fair skin, heather-grey crew-neck t-shirt, dark charcoal shorts. CLINICIAN: adult man, short dark hair, clean-shaven, fair skin, solid medium-blue V-neck medical scrubs (top and trousers), bare hands. Same light-blue studio, blue treatment table, polished medical-illustration style. FORBIDDEN: different faces, female clinician or patient, polo, khaki, tank top, shirtless, white coat, extra people. Educational physiotherapy demonstration video, soft neutral lighting, anatomically accurate hand placement, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.
```

---

## 17. active-slr

**Image:** `active-slr.png` · **Out:** `active-slr.mp4`

```
Using this illustration as reference, animate the active straight leg raise (ASLR) for pelvic girdle pain: single continuous scene — patient supine lifts one straight leg a short distance off the table, holds briefly, then lowers; calm controlled motion, no kicking, no split-screen, no second panel with pelvic compression. Optional soft cyan pelvic highlight. CAST LOCK — same two people as Cozen / first Kinora catalog. PATIENT: adult man, short brown hair, clean-shaven, fair skin, heather-grey crew-neck t-shirt, dark charcoal shorts. CLINICIAN: adult man, short dark hair, clean-shaven, fair skin, solid medium-blue V-neck medical scrubs (top and trousers), bare hands. Same light-blue studio, blue treatment table, polished medical-illustration style. FORBIDDEN: different faces, female clinician or patient, polo, khaki, tank top, shirtless, white coat, extra people. Educational physiotherapy demonstration video, soft neutral lighting, anatomically accurate hand placement, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.
```

---

## 18. syndesmosis-squeeze

**Image:** `syndesmosis-squeeze.png` · **Out:** `syndesmosis-squeeze.mp4`  
**Motion lock:** BOTH hands compress **toda la tibia y el peroné** (bones together). ≠ Thompson.

```
Using this illustration as reference, animate the syndesmosis squeeze test (squeeze de sindesmosis / high ankle). Photorealistic. NO anatomical drawings, NO skeleton overlays, NO arrows, NO captions.

SETUP: patient SUPINE. Tested lower leg accessible (knee slightly flexed or extended). Focus on the MID-CALF / mid-shaft of the lower leg — between knee and ankle.

HANDS — CRITICAL (error if wrong):
- Clinician uses BOTH hands to compress TODA LA TIBIA Y EL PERONÉ.
- Hands at the SAME HEIGHT on mid-calf, opposite sides of the leg (like a clamp / vise).
- One hand presses the MEDIAL TIBIA (shin bone); the other presses the LATERAL FIBULA (peroné).
- Squeeze the two long bones firmly TOWARD EACH OTHER across the full width of the leg — clear bilateral bone-to-bone compression with both palms wrapping the shafts.
- Hold the squeeze briefly → release.

FORBIDDEN:
- Thompson Achilles soft-calf squeeze (only soft tissue → foot plantarflexes). This is NOT Thompson.
- One hand only.
- Hands only on the knee or only on the ankle/foot.
- Squeezing soft calf belly without compressing tibia + fibula bones.

MOTION (1–7s): place both hands → firm squeeze of tibia+fibula together → brief hold → release. Calm, controlled.

CAST LOCK — same two people as Cozen / first Kinora catalog. PATIENT: adult man, short brown hair, clean-shaven, fair skin, heather-grey crew-neck t-shirt, dark charcoal shorts. CLINICIAN: adult man, short dark hair, clean-shaven, fair skin, solid medium-blue V-neck medical scrubs (top and trousers), bare hands. Same light-blue studio, blue treatment table. FORBIDDEN: different faces, female clinician or patient, polo, khaki, tank top, shirtless, white coat, extra people. Educational physiotherapy demonstration video, soft neutral lighting, anatomically accurate hand placement, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.
```

---

## 19. kleiger

**Image:** `kleiger.png` · **Out:** `kleiger.mp4`  
**Motion lock:** fisio **empuja de dentro a fuera** (rotación externa del pie).

```
Using this illustration as reference, animate the Kleiger / external rotation test (rotación externa / sindesmosis). Photorealistic. NO anatomical drawings, NO skeleton overlays, NO arrows, NO captions.

SETUP: patient seated on the table edge (or semi-reclined) with the tested lower leg free. Clinician faces the foot.

HANDS:
- One hand stabilizes the distal TIBIA / lower leg so the shin does NOT rotate.
- The other hand grips the FOOT and HEEL (midfoot + calcaneus).

CRITICAL MOTION — EMPUJAR DE DENTRO A FUERA (error if missing):
- The clinician clearly PUSHES / rotates the foot FROM INSIDE (medial) TO OUTSIDE (lateral) — “de dentro a fuera”.
- External rotation of the foot: toes and forefoot swing outward while the tibia stays fixed.
- Optional slight dorsiflexion while pushing outward.
- Visible force direction: medial → lateral on the foot. Brief hold at end-range outward rotation → gentle return.

FORBIDDEN: pushing inward (de fuera a dentro); inversion; only moving the heel without rotating the foot outward; Thompson; syndesmosis squeeze.

MOTION (1–7s): stabilize tibia → push foot de dentro a fuera (external rotation) → brief hold → release. Calm, controlled.

CAST LOCK — same two people as Cozen / first Kinora catalog. PATIENT: adult man, short brown hair, clean-shaven, fair skin, heather-grey crew-neck t-shirt, dark charcoal shorts. CLINICIAN: adult man, short dark hair, clean-shaven, fair skin, solid medium-blue V-neck medical scrubs (top and trousers), bare hands. Same light-blue studio, blue treatment table. FORBIDDEN: different faces, female clinician or patient, polo, khaki, tank top, shirtless, white coat, extra people. Educational physiotherapy demonstration video, soft neutral lighting, anatomically accurate hand placement, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.
```

---

## 20. talar-tilt (3 clips — see TALAR_TILT_3_DAVINCI.md)

| Variant | Image | Out |
|---------|-------|-----|
| ATFL / talón dentro | `talar-tilt-atfl.png` | `talar-tilt-atfl.mp4` |
| Deltoideo / talón fuera | `talar-tilt-deltoid.png` | `talar-tilt-deltoid.mp4` |
| CFL / dorsiflexión | `talar-tilt-cfl.png` | `talar-tilt-cfl.mp4` |

Full prompts: **`TALAR_TILT_3_DAVINCI.md`**.

---

## 21. flexion-rotation

**Image:** `flexion-rotation.png` · **Out:** `flexion-rotation.mp4`

```
Using this illustration as reference, animate the cervical flexion-rotation test (FRT): patient supine; clinician gently flexes the neck to end-range (chin toward chest) to relatively lock the lower cervical segments, then passively rotates the head to one side and the other while maintaining flexion; show a clear side-to-side comparison of rotation range; stop if dizziness or neurological warning signs — do not force. Optional soft cyan highlight on C1–C2. CAST LOCK — same two people as Cozen / first Kinora catalog. PATIENT: adult man, short brown hair, clean-shaven, fair skin, heather-grey crew-neck t-shirt, dark charcoal shorts. CLINICIAN: adult man, short dark hair, clean-shaven, fair skin, solid medium-blue V-neck medical scrubs (top and trousers), bare hands. Same light-blue studio, blue treatment table, polished medical-illustration style. FORBIDDEN: different faces, female clinician or patient, polo, khaki, tank top, shirtless, white coat, extra people. Educational physiotherapy demonstration video, soft neutral lighting, anatomically accurate hand placement, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.
```

---

## 22. bakody

**Image:** `bakody.png` · **Out:** `bakody.mp4`

```
Using this illustration as reference, animate the Bakody / shoulder abduction relief sign: seated patient raises the symptomatic arm and places that hand on top of the head (elbow out), holds briefly to show possible relief of arm radicular symptoms, then lowers the arm; do NOT show Spurling compression or clinician pressing on the neck. Optional soft cyan highlight at the cervical foramen. CAST LOCK — same two people as Cozen / first Kinora catalog. PATIENT: adult man, short brown hair, clean-shaven, fair skin, heather-grey crew-neck t-shirt, dark charcoal shorts. CLINICIAN: adult man, short dark hair, clean-shaven, fair skin, solid medium-blue V-neck medical scrubs (top and trousers), bare hands. Same light-blue studio, blue treatment table, polished medical-illustration style. FORBIDDEN: different faces, female clinician or patient, polo, khaki, tank top, shirtless, white coat, extra people. Educational physiotherapy demonstration video, soft neutral lighting, anatomically accurate hand placement, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.
```

---

## 23. chair-push-plri

**Image:** `chair-push-plri-start.png` · **Out:** `chair-push-plri.mp4`  
**Motion lock:** hands on armrests, push up.  
Ref: [Physiotutors Stand-Up / Chair Push-Up](https://www.youtube.com/watch?v=81yiXiPwhNs)

```
Using this illustration as reference, animate the Stand-Up / Chair Push-Up Test for PLRI EXACTLY like Physiotutors. Patient SEATED on a chair that HAS ARMRESTS (reposabrazos).

START (0–1s): both hands on the ARMRESTS (not on the seat cushion), elbows flexed ~90°, shoulders slightly abducted, BOTH forearms SUPINATED (palms up on the armrests).

MOTION (1–7s): patient pushes himself UP from the chair using the ARMRESTS — buttocks lift off the seat, elbows extend as he rises. Hands stay on the ARMRESTS the whole time. Forearms stay SUPINATED.

END (7–8s): hold the raised push-up position briefly (or nearly standing supported on the armrests).

CRITICAL: hands on the ARMRESTS / reposabrazos — NEVER on the seat. Do NOT show a full elbow dislocation.

CAST LOCK — same two people as Cozen / first Kinora catalog. PATIENT: adult man, short brown hair, clean-shaven, fair skin, heather-grey crew-neck t-shirt, dark charcoal shorts. CLINICIAN: adult man, short dark hair, clean-shaven, fair skin, solid medium-blue V-neck medical scrubs (top and trousers), bare hands. Same light-blue studio, blue treatment table, polished medical-illustration style. FORBIDDEN: different faces, female clinician or patient, polo, khaki, tank top, shirtless, white coat, extra people. Educational physiotherapy demonstration video, soft neutral lighting, anatomically accurate hand placement, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.
```

---

## 24. biceps-squeeze

**Image:** `biceps-squeeze-start.png` · **Out:** `biceps-squeeze.mp4`  
**Motion lock:** squeeze → SUPINATION only (palm up), never pronation.

```
Using this illustration as reference, animate the biceps squeeze test (Ruland / distal biceps). Patient seated, elbow flexed ~60–80°, forearm starts slightly PRONATED (palm somewhat down). Clinician firmly SQUEEZES the biceps muscle belly with both hands.

CRITICAL MOVEMENT — SUPINACIÓN ONLY:
When the biceps is squeezed, the forearm passively SUPINATES — the palm / thumb rotate UPWARD and OUTWARD (supination). You must clearly see the hand turn toward palm-up.
FORBIDDEN: pronación — do NOT turn the palm downward or inward. Do NOT flip the wrong way.

0–1s: hold start (slight pronation). 1–5s: squeeze biceps → clear SUPINATION of the forearm. 5–8s: hold or gently release while forearm stays toward palm-up.

CAST LOCK — same two people as Cozen / first Kinora catalog. PATIENT: adult man, short brown hair, clean-shaven, fair skin, heather-grey crew-neck t-shirt, dark charcoal shorts. CLINICIAN: adult man, short dark hair, clean-shaven, fair skin, solid medium-blue V-neck medical scrubs (top and trousers), bare hands. Same light-blue studio, blue treatment table, polished medical-illustration style. FORBIDDEN: different faces, female clinician or patient, polo, khaki, tank top, shirtless, white coat, extra people. Educational physiotherapy demonstration video, soft neutral lighting, anatomically accurate hand placement, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.
```

---

## 25. press-test

**Image:** `press-test.png` · **Out:** `press-test.mp4`

```
Using this illustration as reference, animate the Lester press test for TFCC / ulnar wrist pain: patient's forearm and hand rest on a treatment table; the patient presses the ulnar border / hypothenar region of the hand firmly down into the table (axial ulnar load), holds briefly, then releases; pain at the ulnar wrist is the familiar finding — do not dramatize. Optional soft cyan highlight of the TFCC at the ulnar wrist. CAST LOCK — same two people as Cozen / first Kinora catalog. PATIENT: adult man, short brown hair, clean-shaven, fair skin, heather-grey crew-neck t-shirt, dark charcoal shorts. CLINICIAN: adult man, short dark hair, clean-shaven, fair skin, solid medium-blue V-neck medical scrubs (top and trousers), bare hands. Same light-blue studio, blue treatment table, polished medical-illustration style. FORBIDDEN: different faces, female clinician or patient, polo, khaki, tank top, shirtless, white coat, extra people. Educational physiotherapy demonstration video, soft neutral lighting, anatomically accurate hand placement, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.
```

---

## After each batch

1. Drop new `.mp4` into `public/clinical-tests/videos/`
2. Run logo script
3. Upload to CDN
4. Tick the row in the checklist above
