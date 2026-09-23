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
| 6 | stinchfield | `stinchfield.png` | `stinchfield.mp4` |
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
| 20 | talar-tilt | `talar-tilt.png` | `talar-tilt.mp4` |
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

**Image:** `stinchfield.png` · **Out:** `stinchfield.mp4`

```
Using this illustration as reference, animate the Stinchfield test: patient supine lifts a straight leg about 20–30°; clinician applies controlled downward resistance on the distal thigh; brief hold then lower. Optional soft cyan highlight on the deep anterior hip. CAST LOCK — same two people as Cozen / first Kinora catalog. PATIENT: adult man, short brown hair, clean-shaven, fair skin, heather-grey crew-neck t-shirt, dark charcoal shorts. CLINICIAN: adult man, short dark hair, clean-shaven, fair skin, solid medium-blue V-neck medical scrubs (top and trousers), bare hands. Same light-blue studio, blue treatment table, polished medical-illustration style. FORBIDDEN: different faces, female clinician or patient, polo, khaki, tank top, shirtless, white coat, extra people. Educational physiotherapy demonstration video, soft neutral lighting, anatomically accurate hand placement, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.
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
**Motion lock:** push patella laterally (hacia fuera).

```
Using this illustration as reference, animate the patellar apprehension test (aprehensión rotuliana).

SETUP: patient SUPINE, knee slightly flexed (~20–30°). Clinician places thumbs (or fingers) on the MEDIAL edge of the patella (rótula).

CRITICAL MOTION — RÓTULA HACIA FUERA:
- Clearly PUSH / glide the PATELLA LATERALLY (hacia fuera — toward the outer side of the knee).
- The only main movement is the kneecap sliding outward. Do NOT push the patella inward (medially). Do NOT move the whole leg as the main action.

MOTION (1–7s): gentle steady lateral push of the patella → brief hold (apprehension moment) → release back to center. Calm, controlled. Do NOT dramatize pain or dislocation. No cyan overlays required.

CAST LOCK — same two people as Cozen / first Kinora catalog. PATIENT: adult man, short brown hair, clean-shaven, fair skin, heather-grey crew-neck t-shirt, dark charcoal shorts. CLINICIAN: adult man, short dark hair, clean-shaven, fair skin, solid medium-blue V-neck medical scrubs (top and trousers), bare hands. Same light-blue studio, blue treatment table, polished medical-illustration style. FORBIDDEN: different faces, female clinician or patient, polo, khaki, tank top, shirtless, white coat, extra people. Educational physiotherapy demonstration video, soft neutral lighting, anatomically accurate hand placement, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.
```

---

## 11. dial-test

**Image:** `dial-test.png` · **Out:** `dial-test.mp4`  
**Motion lock:** prone, both knees ~90°, external rotation of both feet.

```
Using this illustration as reference, animate the dial test (Loomer) for posterolateral corner / rotational instability.

CRITICAL SETUP — KNEES ALMOST 90°:
- Patient PRONE (face down) on the table.
- BOTH knees flexed to nearly 90° — thighs on the table, lower legs pointing almost VERTICALLY upward (like Physiotutors). Do NOT use 30° as the main position.
- Clinician stands at the foot of the table, both hands cupping the patient's feet / heels.

MOTION (1–7s): gently EXTERNALLY ROTATE both feet / tibias outward together (dial motion — feet turn out like opening a dial), hold briefly to compare sides, slight return. Keep the knees locked near 90° the whole time — do not straighten or drop the lower legs.

FORBIDDEN: knees at only ~30° as the main pose; supine patient; internal rotation as the main move. No cyan overlays required.

CAST LOCK — same two people as Cozen / first Kinora catalog. PATIENT: adult man, short brown hair, clean-shaven, fair skin, heather-grey crew-neck t-shirt, dark charcoal shorts. CLINICIAN: adult man, short dark hair, clean-shaven, fair skin, solid medium-blue V-neck medical scrubs (top and trousers), bare hands. Same light-blue studio, blue treatment table, polished medical-illustration style. FORBIDDEN: different faces, female clinician or patient, polo, khaki, tank top, shirtless, white coat, extra people. Educational physiotherapy demonstration video, soft neutral lighting, anatomically accurate hand placement, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.
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

```
Using this illustration as reference, animate the syndesmosis (tibiofibular) squeeze test: patient supine; clinician compresses the mid-calf tibia and fibula together with both hands, holds briefly, then releases; do not squeeze the Achilles tendon or calf belly like a Thompson test. Optional soft cyan highlight on the distal tibiofibular syndesmosis. CAST LOCK — same two people as Cozen / first Kinora catalog. PATIENT: adult man, short brown hair, clean-shaven, fair skin, heather-grey crew-neck t-shirt, dark charcoal shorts. CLINICIAN: adult man, short dark hair, clean-shaven, fair skin, solid medium-blue V-neck medical scrubs (top and trousers), bare hands. Same light-blue studio, blue treatment table, polished medical-illustration style. FORBIDDEN: different faces, female clinician or patient, polo, khaki, tank top, shirtless, white coat, extra people. Educational physiotherapy demonstration video, soft neutral lighting, anatomically accurate hand placement, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.
```

---

## 19. kleiger

**Image:** `kleiger.png` · **Out:** `kleiger.mp4`

```
Using this illustration as reference, animate the Kleiger / external rotation test: patient seated with the lower leg hanging; clinician stabilizes the tibia and gently externally rotates the foot (optionally with slight dorsiflexion); brief hold then release. Optional soft cyan highlight on the anterior tibiofibular syndesmosis. CAST LOCK — same two people as Cozen / first Kinora catalog. PATIENT: adult man, short brown hair, clean-shaven, fair skin, heather-grey crew-neck t-shirt, dark charcoal shorts. CLINICIAN: adult man, short dark hair, clean-shaven, fair skin, solid medium-blue V-neck medical scrubs (top and trousers), bare hands. Same light-blue studio, blue treatment table, polished medical-illustration style. FORBIDDEN: different faces, female clinician or patient, polo, khaki, tank top, shirtless, white coat, extra people. Educational physiotherapy demonstration video, soft neutral lighting, anatomically accurate hand placement, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.
```

---

## 20. talar-tilt

**Image:** `talar-tilt.png` · **Out:** `talar-tilt.mp4`

```
Using this illustration as reference, animate the talar tilt test: clinician stabilizes the lower leg and gently inverts the calcaneus/talus to stress the lateral ankle ligaments; brief hold then release; calm controlled motion. Optional soft cyan highlight on the lateral ankle / CFL. CAST LOCK — same two people as Cozen / first Kinora catalog. PATIENT: adult man, short brown hair, clean-shaven, fair skin, heather-grey crew-neck t-shirt, dark charcoal shorts. CLINICIAN: adult man, short dark hair, clean-shaven, fair skin, solid medium-blue V-neck medical scrubs (top and trousers), bare hands. Same light-blue studio, blue treatment table, polished medical-illustration style. FORBIDDEN: different faces, female clinician or patient, polo, khaki, tank top, shirtless, white coat, extra people. Educational physiotherapy demonstration video, soft neutral lighting, anatomically accurate hand placement, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.
```

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
