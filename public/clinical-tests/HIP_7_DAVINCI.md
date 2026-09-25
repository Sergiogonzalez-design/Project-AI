# Hip gaps — 7 core tests: starter frames + DaVinci AI prompts

**Date:** 4 Sep 2026  
**Evidence:** Doha (Weir BJSM 2015); Warwick FAIS (Griffin BJSM 2016); GTPS (Grimaldi & Fearon JOSPT 2015); Reiman hip exam reviews — **qualitative clusters only; never invent Sn/Sp**

**Already shipped (do not regenerate):** `faber`, `fadir`, `trendelenburg`, `hop-test`

**No patient video (intentional):** greater-trochanter palpation; inguinal hernia / Valsalva (referral); femoral neck stress = red-flag pattern text

For each:

1. Open the **initial image**.
2. Paste the **prompt** into DaVinci AI (image → video).
3. Export as **File out** into `public/clinical-tests/videos/`.
4. Fit Kinora logo:

```powershell
powershell -File scripts/append-kinora-logo-outro.ps1 -Only <id>.mp4
```

5. Register in `lib/clinical-test-videos.ts` (+ mobile) and upload:

```powershell
node scripts/upload-clinical-tests-storage.mjs --only=<id>.webp,videos/<id>.mp4
```

**COMMON_SUFFIX:**

> CAST LOCK � same two people as Cozen / first Kinora catalog. PATIENT: adult man, short brown hair, clean-shaven, fair skin, heather-grey crew-neck t-shirt, dark charcoal shorts. CLINICIAN: adult man, short dark hair, clean-shaven, fair skin, solid medium-blue V-neck medical scrubs (top and trousers), bare hands. Same light-blue studio, blue treatment table, polished medical-illustration style. FORBIDDEN: different faces, female clinician or patient, polo, khaki, tank top, shirtless, white coat, extra people. Educational physiotherapy demonstration video, soft neutral lighting, anatomically accurate hand placement, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.

---

## Checklist

| # | id | Initial image | Video out | Status |
|---|-----|---------------|-----------|--------|
| 1 | `thomas-test` | `thomas-test.png` | `thomas-test.mp4` | image ✅ · video ✅ (+ Kinora logo) |
| 2 | `resisted-adduction` | `resisted-adduction.png` | `resisted-adduction.mp4` | image ✅ · video ✅ (+ Kinora logo) |
| 3 | `resisted-hip-flexion` | `resisted-hip-flexion.png` | `resisted-hip-flexion.mp4` | image ✅ · video ✅ (+ Kinora logo) |
| 4 | `resisted-abduction` | `resisted-abduction.png` | `resisted-abduction.mp4` | image ✅ · video ✅ (+ Kinora logo) |
| 5 | `log-roll` | `log-roll.png` | `log-roll.mp4` | image ✅ · video ✅ (+ Kinora logo) |
| 6 | `stinchfield` | `stinchfield.png` | `stinchfield.mp4` | image ✅ · video ✅ (+ Kinora logo) |
| 7 | `hip-scour` | `hip-scour.png` | `hip-scour.mp4` | image ✅ · video ✅ (27 + Kinora) |

---

## 1. thomas-test

![thomas-test](./thomas-test.png)

**Path:** `public/clinical-tests/thomas-test.png` · **Out:** `thomas-test.mp4`

```
Using this illustration as reference, animate the Thomas test for hip flexors: patient supine at the table edge hugs one knee to the chest; the opposite thigh extends/lowers controlled; brief hold then slight return; do not dramatize pain. Optional soft cyan highlight on the iliopsoas/anterior hip. CAST LOCK � same two people as Cozen / first Kinora catalog. PATIENT: adult man, short brown hair, clean-shaven, fair skin, heather-grey crew-neck t-shirt, dark charcoal shorts. CLINICIAN: adult man, short dark hair, clean-shaven, fair skin, solid medium-blue V-neck medical scrubs (top and trousers), bare hands. Same light-blue studio, blue treatment table, polished medical-illustration style. FORBIDDEN: different faces, female clinician or patient, polo, khaki, tank top, shirtless, white coat, extra people. Educational physiotherapy demonstration video, soft neutral lighting, anatomically accurate hand placement, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.
```

---

## 2. resisted-adduction

![resisted-adduction](./resisted-adduction.png)

**Path:** `public/clinical-tests/resisted-adduction.png` · **Out:** `resisted-adduction.mp4`

```
Using this illustration as reference, animate the resisted adduction / squeeze test: patient supine with hips slightly flexed; clinician resists between the knees as the patient gently squeezes the knees together; brief hold then release. Optional soft cyan highlight on the medial groin/adductors. CAST LOCK � same two people as Cozen / first Kinora catalog. PATIENT: adult man, short brown hair, clean-shaven, fair skin, heather-grey crew-neck t-shirt, dark charcoal shorts. CLINICIAN: adult man, short dark hair, clean-shaven, fair skin, solid medium-blue V-neck medical scrubs (top and trousers), bare hands. Same light-blue studio, blue treatment table, polished medical-illustration style. FORBIDDEN: different faces, female clinician or patient, polo, khaki, tank top, shirtless, white coat, extra people. Educational physiotherapy demonstration video, soft neutral lighting, anatomically accurate hand placement, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.
```

---

## 3. resisted-hip-flexion

![resisted-hip-flexion](./resisted-hip-flexion.png)

**Path:** `public/clinical-tests/resisted-hip-flexion.png` · **Out:** `resisted-hip-flexion.mp4`

```
Using this illustration as reference, animate resisted hip flexion: patient supine attempts to lift the leg into hip flexion while the clinician applies controlled downward resistance on the distal thigh; brief hold then release. Optional soft cyan highlight on the iliopsoas/anterior hip. CAST LOCK � same two people as Cozen / first Kinora catalog. PATIENT: adult man, short brown hair, clean-shaven, fair skin, heather-grey crew-neck t-shirt, dark charcoal shorts. CLINICIAN: adult man, short dark hair, clean-shaven, fair skin, solid medium-blue V-neck medical scrubs (top and trousers), bare hands. Same light-blue studio, blue treatment table, polished medical-illustration style. FORBIDDEN: different faces, female clinician or patient, polo, khaki, tank top, shirtless, white coat, extra people. Educational physiotherapy demonstration video, soft neutral lighting, anatomically accurate hand placement, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.
```

---

## 4. resisted-abduction

![resisted-abduction](./resisted-abduction.png)

**Path:** `public/clinical-tests/resisted-abduction.png` · **Out:** `resisted-abduction.mp4`

```
Using this illustration as reference, animate resisted hip abduction for GTPS: patient side-lying; top leg gently abducts against clinician resistance at the lateral distal thigh; brief hold then release. Optional soft cyan highlight on the greater trochanter / gluteus medius. CAST LOCK � same two people as Cozen / first Kinora catalog. PATIENT: adult man, short brown hair, clean-shaven, fair skin, heather-grey crew-neck t-shirt, dark charcoal shorts. CLINICIAN: adult man, short dark hair, clean-shaven, fair skin, solid medium-blue V-neck medical scrubs (top and trousers), bare hands. Same light-blue studio, blue treatment table, polished medical-illustration style. FORBIDDEN: different faces, female clinician or patient, polo, khaki, tank top, shirtless, white coat, extra people. Educational physiotherapy demonstration video, soft neutral lighting, anatomically accurate hand placement, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.
```

---

## 5. log-roll

![log-roll](./log-roll.png)

**Path:** `public/clinical-tests/log-roll.png` · **Out:** `log-roll.mp4`

```
Using this illustration as reference, animate the passive log roll test: patient supine with hip and knee extended; clinician gently rolls the whole leg into internal then external rotation by guiding the ankle/foot; slow calm motion, brief hold each way. Optional soft cyan highlight on the hip joint. CAST LOCK � same two people as Cozen / first Kinora catalog. PATIENT: adult man, short brown hair, clean-shaven, fair skin, heather-grey crew-neck t-shirt, dark charcoal shorts. CLINICIAN: adult man, short dark hair, clean-shaven, fair skin, solid medium-blue V-neck medical scrubs (top and trousers), bare hands. Same light-blue studio, blue treatment table, polished medical-illustration style. FORBIDDEN: different faces, female clinician or patient, polo, khaki, tank top, shirtless, white coat, extra people. Educational physiotherapy demonstration video, soft neutral lighting, anatomically accurate hand placement, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.
```

---

## 6. stinchfield

![stinchfield](./stinchfield.png)

**Path:** `public/clinical-tests/stinchfield.png` · **Out:** `stinchfield.mp4`

```
Using this illustration as reference, animate the Stinchfield test: patient supine lifts a straight leg about 20–30°; clinician applies controlled downward resistance on the distal thigh; brief hold then lower. Optional soft cyan highlight on the deep anterior hip. CAST LOCK � same two people as Cozen / first Kinora catalog. PATIENT: adult man, short brown hair, clean-shaven, fair skin, heather-grey crew-neck t-shirt, dark charcoal shorts. CLINICIAN: adult man, short dark hair, clean-shaven, fair skin, solid medium-blue V-neck medical scrubs (top and trousers), bare hands. Same light-blue studio, blue treatment table, polished medical-illustration style. FORBIDDEN: different faces, female clinician or patient, polo, khaki, tank top, shirtless, white coat, extra people. Educational physiotherapy demonstration video, soft neutral lighting, anatomically accurate hand placement, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.
```

---

## 7. hip-scour

**Ref:** Physical Therapy Nation — [youtube.com/watch?v=tkxfw3Xz_sQ](https://www.youtube.com/watch?v=tkxfw3Xz_sQ) (prueba de erosión / hip scour)

![hip-scour](./hip-scour.png)

**Path:** `public/clinical-tests/hip-scour.png`  
**DaVinci upload:** `c:\Users\sergi\project-ai\public\clinical-tests\hip-scour-start.png`  
**Out:** `hip-scour.mp4`

**Movement:** axial compression + **pierna hacia dentro (aducción)** + **rotación interna** clara.

**Prompt (copy/paste):**

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

CAST LOCK � same two people as Cozen / first Kinora catalog. PATIENT: adult man, short brown hair, clean-shaven, fair skin, heather-grey crew-neck t-shirt, dark charcoal shorts. CLINICIAN: adult man, short dark hair, clean-shaven, fair skin, solid medium-blue V-neck medical scrubs (top and trousers), bare hands. Same light-blue studio, blue treatment table, polished medical-illustration style. FORBIDDEN: different faces, female clinician or patient, polo, khaki, tank top, shirtless, white coat, extra people. Educational physiotherapy demonstration video, soft neutral lighting, anatomically accurate hand placement, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.
```
