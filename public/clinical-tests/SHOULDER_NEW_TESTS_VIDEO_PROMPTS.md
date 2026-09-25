# Shoulder — new tests: initial images + DaVinci / AI video prompts

**Date:** 31 Aug 2026  
**Changelog:** [`knowledge/PHYSIOGUIDE_SHOULDER_EXPANSION_2026-08-31.md`](../../knowledge/PHYSIOGUIDE_SHOULDER_EXPANSION_2026-08-31.md)

Generate **11** videos for the new shoulder catalog entries. For each:

1. Open the **initial image** (path below).
2. Paste the **prompt** into DaVinci AI / Kling / Runway / Luma / Sora (image → video).
3. Export as **File out** (`.mp4`).
4. Optionally fit to 8s demo + 2s logo: `powershell -File scripts/append-kinora-logo-outro.ps1`
5. Upload to the clinical-tests CDN `videos/` bucket (same pattern as existing tests) and add the id to `lib/clinical-test-videos.ts` (+ mobile).

**COMMON_SUFFIX** (already included in each prompt):

> CAST LOCK � same two people as Cozen / first Kinora catalog. PATIENT: adult man, short brown hair, clean-shaven, fair skin, heather-grey crew-neck t-shirt, dark charcoal shorts. CLINICIAN: adult man, short dark hair, clean-shaven, fair skin, solid medium-blue V-neck medical scrubs (top and trousers), bare hands. Same light-blue studio, blue treatment table, polished medical-illustration style. FORBIDDEN: different faces, female clinician or patient, polo, khaki, tank top, shirtless, white coat, extra people. Educational physiotherapy demonstration video, soft neutral lighting, anatomically accurate hand placement, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.

---

For every new clinical-test video: drop the raw DaVinci `.mp4` into `public/clinical-tests/videos/<id>.mp4`, then run:

```powershell
powershell -File scripts/append-kinora-logo-outro.ps1 -Only <id>.mp4
```

That fits the demo to **8.00s** and appends **2.00s** Kinora logo (`public/logo-icon.png`) → **10.00s** total. Re-runs are safe (uses `.pre-logo-backup`).

Then register the id in `lib/clinical-test-videos.ts` (+ mobile) and upload with `node scripts/upload-clinical-tests-storage.mjs --only videos/<id>.mp4`.

---

## Checklist

| # | id | Initial image | Video out | Status |
|---|-----|---------------|-----------|--------|
| 1 | `full-can` | `full-can.webp` | `full-can.mp4` | image ✅ · video ✅ (+ Kinora logo) |
| 2 | `surprise` | `surprise.webp` | `surprise.mp4` | image ✅ · video ✅ (+ Kinora logo) |
| 3 | `paxinos` | `paxinos.webp` | `paxinos.mp4` | image ✅ · video ✅ (+ Kinora logo) |
| 4 | `obrien` | `obrien.webp` | `obrien.mp4` | image ✅ (regenerated) · video ✅ (+ Kinora logo) |
| 5 | `uppercut` | `uppercut.webp` | `uppercut.mp4` | image ✅ · video ✅ (+ Kinora logo) |
| 6 | `crank` | `crank.webp` / `crank-start.png` | `crank.mp4` | image ✅ · video ✅ (55 + Kinora logo) |
| 7 | `er-lag` | `er-lag.webp` | `er-lag.mp4` | image ✅ (regenerated) · video ✅ (+ Kinora logo) |
| 8 | `belly-press` | `belly-press.webp` | `belly-press.mp4` | image ✅ · video ✅ (+ Kinora logo) |
| 9 | `lift-off` | `lift-off.webp` | `lift-off.mp4` | image ✅ · video ✅ (58 reversed → on-back then lift + logo) |
| 10 | `kim-test` | `kim-test-start.png` + `kim-test-end.png` (Physiotutors match) | `kim-test.mp4` | image ✅ · video ✅ (61 across body + Kinora logo) |
| 11 | `jerk-test` | `jerk-test-start.png` | `jerk-test.mp4` | image ✅ (new start) · video ✅ (56 + Kinora logo) |

PNG masters also live next to the webps (and under Cursor assets). Prefer **`.webp`** as the animation reference (matches the rest of the catalog).

---

## 1. full-can

**Initial image**

![full-can](./full-can.webp)

**Path:** `public/clinical-tests/full-can.webp`  
**File out:** `full-can.mp4`

**Prompt (copy/paste):**

```
Using this illustration as reference, animate the Full Can / Jobe thumb-up test: patient elevates both arms to about 90° in the scapular plane with thumbs pointing UP (not down), clinician applies gentle downward resistance on one forearm while the patient resists. CAST LOCK � same two people as Cozen / first Kinora catalog. PATIENT: adult man, short brown hair, clean-shaven, fair skin, heather-grey crew-neck t-shirt, dark charcoal shorts. CLINICIAN: adult man, short dark hair, clean-shaven, fair skin, solid medium-blue V-neck medical scrubs (top and trousers), bare hands. Same light-blue studio, blue treatment table, polished medical-illustration style. FORBIDDEN: different faces, female clinician or patient, polo, khaki, tank top, shirtless, white coat, extra people. Educational physiotherapy demonstration video, soft neutral lighting, anatomically accurate hand placement, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.
```

---

## 2. surprise

**Initial image**

![surprise](./surprise.webp)

**Path:** `public/clinical-tests/surprise.webp`  
**File out:** `surprise.mp4`

**Prompt (copy/paste):**

```
Using this illustration as reference, animate the Surprise / Anterior Release test after relocation: patient supine, arm abducted ~90° and externally rotated; clinician first applies posterior pressure on the humeral head (relocation), then gently RELEASES that pressure while supporting the elbow — show the release moment and patient apprehension without forcing dislocation. CAST LOCK � same two people as Cozen / first Kinora catalog. PATIENT: adult man, short brown hair, clean-shaven, fair skin, heather-grey crew-neck t-shirt, dark charcoal shorts. CLINICIAN: adult man, short dark hair, clean-shaven, fair skin, solid medium-blue V-neck medical scrubs (top and trousers), bare hands. Same light-blue studio, blue treatment table, polished medical-illustration style. FORBIDDEN: different faces, female clinician or patient, polo, khaki, tank top, shirtless, white coat, extra people. Educational physiotherapy demonstration video, soft neutral lighting, anatomically accurate hand placement, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.
```

---

## 3. paxinos

**Initial image**

![paxinos](./paxinos.webp)

**Path:** `public/clinical-tests/paxinos.webp`  
**File out:** `paxinos.mp4`

**Prompt (copy/paste):**

```
Using this illustration as reference, animate the Paxinos test for the AC joint: clinician places the thumb on the spine of the scapula and the index finger on the distal clavicle, then gently compresses the acromioclavicular joint with a slow squeeze. CAST LOCK � same two people as Cozen / first Kinora catalog. PATIENT: adult man, short brown hair, clean-shaven, fair skin, heather-grey crew-neck t-shirt, dark charcoal shorts. CLINICIAN: adult man, short dark hair, clean-shaven, fair skin, solid medium-blue V-neck medical scrubs (top and trousers), bare hands. Same light-blue studio, blue treatment table, polished medical-illustration style. FORBIDDEN: different faces, female clinician or patient, polo, khaki, tank top, shirtless, white coat, extra people. Educational physiotherapy demonstration video, soft neutral lighting, anatomically accurate hand placement, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.
```

---

## 4. obrien

**Initial image**

![obrien](./obrien.webp)

**Path:** `public/clinical-tests/obrien.webp`  
**File out:** `obrien.mp4`

**Prompt (copy/paste):**

```
Using this illustration as reference, animate the O'Brien / Active Compression test: arm flexed to 90° with slight horizontal adduction (~10–15°), thumb pointing DOWN, patient resists a gentle downward force from the clinician on the forearm; optionally show a brief repeat with thumb UP for comparison. CAST LOCK � same two people as Cozen / first Kinora catalog. PATIENT: adult man, short brown hair, clean-shaven, fair skin, heather-grey crew-neck t-shirt, dark charcoal shorts. CLINICIAN: adult man, short dark hair, clean-shaven, fair skin, solid medium-blue V-neck medical scrubs (top and trousers), bare hands. Same light-blue studio, blue treatment table, polished medical-illustration style. FORBIDDEN: different faces, female clinician or patient, polo, khaki, tank top, shirtless, white coat, extra people. Educational physiotherapy demonstration video, soft neutral lighting, anatomically accurate hand placement, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.
```

---

## 5. uppercut

**Initial image**

![uppercut](./uppercut.webp)

**Path:** `public/clinical-tests/uppercut.webp`  
**File out:** `uppercut.mp4`

**Prompt (copy/paste):**

```
Using this illustration as reference, animate the Uppercut test for the long head of biceps: elbow flexed, forearm supinated, patient performs a short upward punch / uppercut motion while the clinician resists at the fist or distal forearm. CAST LOCK � same two people as Cozen / first Kinora catalog. PATIENT: adult man, short brown hair, clean-shaven, fair skin, heather-grey crew-neck t-shirt, dark charcoal shorts. CLINICIAN: adult man, short dark hair, clean-shaven, fair skin, solid medium-blue V-neck medical scrubs (top and trousers), bare hands. Same light-blue studio, blue treatment table, polished medical-illustration style. FORBIDDEN: different faces, female clinician or patient, polo, khaki, tank top, shirtless, white coat, extra people. Educational physiotherapy demonstration video, soft neutral lighting, anatomically accurate hand placement, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.
```

---

## 6. crank

**Initial image** (regenerated — correct hand placement)

![crank](./crank.webp)

**Path:** `public/clinical-tests/crank.webp` (also `crank-start.png`)  
**DaVinci upload:** `c:\Users\sergi\project-ai\public\clinical-tests\crank-start.png`  
**File out:** `crank.mp4`

**What went wrong in DaVinci (53):** hand placement / axial load look OK, but the forearm only rotates **halfway** (stays near vertical). Need a **full** internal AND external rotation — both directions, not a half crank.

**Prompt (copy/paste) — full IR + ER both sides:**

```
Using this illustration as reference, animate the Crank test (labral screening). Patient remains SUPINE on the blue table. Arm stays elevated ~120–160° in the scapular plane with the elbow flexed EXACTLY 90° (forearm starts pointing toward the ceiling like a crank handle). CRITICAL hand roles match the still: one hand FIXES / STABILIZES the proximal humerus / glenohumeral region so the shoulder does not swing; the OTHER hand holds at the ELBOW / distal humerus, applies continuous axial compression toward the glenoid, and rotates USING THE ELBOW as the lever.

FULL ROTATION — BOTH DIRECTIONS (do not stop halfway):
- 0–1s: hold start pose, forearm vertical.
- 1–3s: INTERNAL ROTATION — rotate the forearm / elbow lever fully ONE WAY until the forearm is nearly parallel to the table / toward the patient's feet (almost flat). Visible large arc, not a tiny wiggle.
- 3–5.5s: EXTERNAL ROTATION — rotate the SAME forearm the OTHER WAY, past vertical, until it is nearly parallel to the table / toward the patient's head (almost flat on the opposite side). Complete the full arc to the other side.
- 5.5–8s: return toward mid / start vertical and hold.

CRITICAL SUCCESS: the forearm must travel a LARGE arc from nearly table-level on one side, through vertical, to nearly table-level on the OTHER side — full IR then full ER (and/or a clear back-and-forth). Do NOT only rotate halfway and stop near vertical. Do NOT swing the whole shoulder freely; do NOT show big shoulder circumduction; do NOT grip primarily at the wrist.

CAST LOCK � same two people as Cozen / first Kinora catalog. PATIENT: adult man, short brown hair, clean-shaven, fair skin, heather-grey crew-neck t-shirt, dark charcoal shorts. CLINICIAN: adult man, short dark hair, clean-shaven, fair skin, solid medium-blue V-neck medical scrubs (top and trousers), bare hands. Same light-blue studio, blue treatment table, polished medical-illustration style. FORBIDDEN: different faces, female clinician or patient, polo, khaki, tank top, shirtless, white coat, extra people. Educational physiotherapy demonstration video, soft neutral lighting, anatomically accurate hand placement, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.
```

**Shorter alt:**

```
Crank test: supine, arm elevated, elbow 90°, one hand stabilizes shoulder, other at elbow with axial load. Rotate the forearm FULLY both ways like a crank handle: first nearly flat toward the feet (IR), then past vertical nearly flat toward the head (ER). Do NOT stop halfway near vertical — full arc both sides. Camera steady, 8s, no text/logos.
```

---

## 7. er-lag

**Initial image**

![er-lag](./er-lag.webp)

**Path:** `public/clinical-tests/er-lag.webp`  
**File out:** `er-lag.mp4`

**Prompt (copy/paste):**

```
Using this illustration as reference, animate the External Rotation Lag Sign exactly like a Physiotutors demo (ER lag / full-thickness rotator cuff): patient seated upright. Tested arm: elbow flexed EXACTLY 90°, shoulder slightly abducted ~20°, forearm starts near the torso. Clinician cups UNDER the elbow with one hand to support the arm weight, and with the other hand holds the distal forearm/wrist ONLY as a lever — then passively moves the arm into MAXIMUM EXTERNAL ROTATION OF THE SHOULDER (humerus rotates outward; forearm swings out away from the belly). CRITICAL: this is SHOULDER external rotation, NOT wrist extension/flexion/supination and NOT bending the wrist. After reaching max ER, clinician gently releases support so the patient must HOLD the ER position; if unable, show a small lag/drop back toward internal rotation. CAST LOCK � same two people as Cozen / first Kinora catalog. PATIENT: adult man, short brown hair, clean-shaven, fair skin, heather-grey crew-neck t-shirt, dark charcoal shorts. CLINICIAN: adult man, short dark hair, clean-shaven, fair skin, solid medium-blue V-neck medical scrubs (top and trousers), bare hands. Same light-blue studio, blue treatment table, polished medical-illustration style. FORBIDDEN: different faces, female clinician or patient, polo, khaki, tank top, shirtless, white coat, extra people. Educational physiotherapy demonstration video, soft neutral lighting, anatomically accurate hand placement, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.
```

---

## 8. belly-press

**Initial image**

![belly-press](./belly-press.webp)

**Path:** `public/clinical-tests/belly-press.webp`  
**File out:** `belly-press.mp4`

**Prompt (copy/paste):**

```
Using this illustration as reference, animate the Belly Press / Napoleon test for subscapularis: patient STANDING, palm of the tested hand flat on the abdomen, elbow pointed FORWARD in front of the trunk (not behind the body). The ONLY action is pressing the hand firmly INTO the belly and holding that press — keep the elbow forward. CRITICAL: do NOT raise, lift, or move the other arm; the non-tested arm stays relaxed at the side. Do NOT show compensatory shoulder shrug or the opposite arm helping. CAST LOCK � same two people as Cozen / first Kinora catalog. PATIENT: adult man, short brown hair, clean-shaven, fair skin, heather-grey crew-neck t-shirt, dark charcoal shorts. CLINICIAN: adult man, short dark hair, clean-shaven, fair skin, solid medium-blue V-neck medical scrubs (top and trousers), bare hands. Same light-blue studio, blue treatment table, polished medical-illustration style. FORBIDDEN: different faces, female clinician or patient, polo, khaki, tank top, shirtless, white coat, extra people. Educational physiotherapy demonstration video, soft neutral lighting, anatomically accurate hand placement, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.
```

---

## 9. lift-off

**Initial image** (same start — hand on low back)

![lift-off](./lift-off.webp)

**Path:** `public/clinical-tests/lift-off.webp`  
**DaVinci upload:** `c:\Users\sergi\project-ai\public\clinical-tests\lift-off.png`  
**File out:** `lift-off.mp4`

**Version:** active lift-off ONLY — **chronology locked:** START hand ON low back → THEN separate (create air gap). Physio does NOT apply pressure. Installed from DaVinci (58) **time-reversed** so the motion plays on-back → lift (original clip ran the opposite way).

**Prompt (copy/paste) — for future regenerations:**

```
Using this illustration as reference, animate the Lift-off / Gerber test — ACTIVE lift only, NO resistance. Camera locked rear three-quarter on the patient's back. Patient STANDING.

CHRONOLOGY (do not reverse):
0–1s START: dorsum of the RIGHT hand FLAT ON the mid-lumbar spine (touching the grey tank top). Clinician only OBSERVES — never touches the patient.
1–6s THEN: patient ALONE lifts the hand a SHORT distance OFF the back, POSTERIORLY. A CLEAR VISIBLE AIR GAP of a few cm must APPEAR between hand and back (hand leaves the fabric). Elbow stays bent. Small controlled lift.
6–8s HOLD the hand off the back with that gap visible.

FORBIDDEN: start with the hand already off and then place it onto the back (that is the reverse / wrong direction). Physio must not press or grab the hand. No thrashing.

Educational physiotherapy demonstration, soft neutral lighting, calm clinician and patient, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.
```

**Shorter alt:**

```
Lift-off: rear view. START hand ON low back, THEN lift a few cm OFF until an air gap appears. Never reverse (do not start off and put hand on). Physio watches only — no pressure. Hold gap. 8s, no text.
```

---

## 10. kim-test

**Refs:** Physiotutors Kim — [youtube.com/watch?v=-knsALCdv_A](https://www.youtube.com/watch?v=-knsALCdv_A)

**DaVinci upload (START):** `c:\Users\sergi\project-ai\public\clinical-tests\kim-test-start.png`  
**Optional END:** `c:\Users\sergi\project-ai\public\clinical-tests\kim-test-end.png`  
**File out:** `kim-test.mp4`

**Movement (from your Physiotutors frames):** seated 90° abd + elbow 90°. Hand on **TOP of shoulder** + hand **UNDER elbow** (axial load, body lean). Then move the L-arm **ACROSS the body** toward the opposite shoulder / across the chest while keeping the axial load. **Not up.** Not behind the back.

**Prompt (copy/paste):**

```
Using this illustration as reference, animate the Kim test EXACTLY like Physiotutors. Patient SEATED.

START (0–1s): right shoulder abducted 90° (upper arm horizontal out to the side), elbow flexed 90° (forearm forward). Clinician behind/beside the right shoulder: one hand flat on TOP of the shoulder (acromion); other hand cups UNDER the elbow.

MOTION (1–7s): lean body weight in. Push continuous AXIAL LOAD through the elbow into the glenoid AND at the same time move the whole bent arm ACROSS THE BODY toward the opposite shoulder / across the front of the chest (horizontal adduction). Elbow stays bent at ~90°. Arm stays roughly at shoulder height — do NOT raise it up toward the head.

END (7–8s): hold the across-body pose with axial load still on.

FORBIDDEN: raise the arm upward / elevate the elbow above the head; arm behind the back; more abduction further out to the side. Camera steady, 8 seconds, no logos, no captions, no watermarks.
```

**Ultra-short:**

```
Kim: seated 90° abd, elbow 90°. Hand on shoulder top + axial load under elbow. Move arm ACROSS the body toward the opposite shoulder while keeping the load. Not upward. 8s, no text.
```

---

## 11. jerk-test

**Refs:** Physiotutors Jerk test — [youtube.com/watch?v=j_qG1MNOws8](https://www.youtube.com/watch?v=j_qG1MNOws8)

**Initial image** (START: 90° abduction + IR, arm OUT TO THE SIDE — not yet across body)

![jerk-test](./jerk-test.webp)

**Path:** `public/clinical-tests/jerk-test.webp`  
**DaVinci upload:** `c:\Users\sergi\project-ai\public\clinical-tests\jerk-test-start.png`  
**File out:** `jerk-test.mp4`

**Prompt (copy/paste) — Physiotutors Jerk / arm across body:**

```
Using this illustration as reference, animate the Jerk test exactly like a Physiotutors demo (posterior / posteroinferior instability). Patient SEATED. Clinician stands BEHIND / slightly beside the patient.

START (0–1.5s): tested arm at 90° ABDUCTION OUT TO THE SIDE (upper arm horizontal, parallel to floor — NOT across the chest yet), INTERNAL ROTATION (palm faces down), elbow flexed. Clinician: one hand STABILIZES the SCAPULA on the back of the shoulder; the OTHER hand holds the ELBOW and applies continuous AXIAL COMPRESSION through the humerus into the glenoid.

CRITICAL MOTION (1.5–7s): the PHYSIOTHERAPIST passively moves the arm in HORIZONTAL ADDUCTION — guiding the arm ACROSS THE FRONT OF THE BODY toward the opposite shoulder / midline while KEEPING the axial compression. The arm must visibly travel from out-to-the-side all the way across the chest. Patient does NOT move the arm alone — the fisio does it. Controlled, smooth, not a violent jerk of the whole torso.

7–8s: hold the across-body end pose (arm adducted across chest) with axial load still on.

HARD FAIL / DO NOT: leave the arm stuck out to the side for the whole video; only apply pressure without crossing the body; let the patient swing the arm alone; elevate diagonally like the Kim test; release the axial load; thrash or spin the patient.

CAST LOCK � same two people as Cozen / first Kinora catalog. PATIENT: adult man, short brown hair, clean-shaven, fair skin, heather-grey crew-neck t-shirt, dark charcoal shorts. CLINICIAN: adult man, short dark hair, clean-shaven, fair skin, solid medium-blue V-neck medical scrubs (top and trousers), bare hands. Same light-blue studio, blue treatment table, polished medical-illustration style. FORBIDDEN: different faces, female clinician or patient, polo, khaki, tank top, shirtless, white coat, extra people. Educational physiotherapy demonstration video, soft neutral lighting, anatomically accurate hand placement, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.
```

**Shorter alt:**

```
Jerk test (Physiotutors): seated, arm starts 90° abducted out to the side + IR. Fisio stabilizes scapula, axial load at elbow, then MOVES the arm horizontally ACROSS THE BODY to the opposite side while keeping compression. Arm must cross the chest — do not leave it out to the side. Camera steady, 8s, no text/logos.
```

---

## Absolute paths (Windows)

| Test | Image |
|------|--------|
| full-can | `c:\Users\sergi\project-ai\public\clinical-tests\full-can.webp` |
| surprise | `c:\Users\sergi\project-ai\public\clinical-tests\surprise.webp` |
| paxinos | `c:\Users\sergi\project-ai\public\clinical-tests\paxinos.webp` |
| obrien | `c:\Users\sergi\project-ai\public\clinical-tests\obrien.webp` |
| uppercut | `c:\Users\sergi\project-ai\public\clinical-tests\uppercut.webp` |
| crank | `c:\Users\sergi\project-ai\public\clinical-tests\crank-start.png` (also `crank.webp`) |
| er-lag | `c:\Users\sergi\project-ai\public\clinical-tests\er-lag.webp` |
| belly-press | `c:\Users\sergi\project-ai\public\clinical-tests\belly-press.webp` |
| lift-off | `c:\Users\sergi\project-ai\public\clinical-tests\lift-off.webp` |
| kim-test | `c:\Users\sergi\project-ai\public\clinical-tests\kim-test-start.png` |
| jerk-test | `c:\Users\sergi\project-ai\public\clinical-tests\jerk-test-start.png` |

When the eleven `.mp4` files are ready, hook them in `lib/clinical-test-videos.ts` (+ mobile) and upload to the CDN `videos/` folder with the same cache-bust pattern as existing entries.
