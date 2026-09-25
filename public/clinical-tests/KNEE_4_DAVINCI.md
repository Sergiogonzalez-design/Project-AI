# Knee gaps ó Noble / Ober / apprehension / dial: starter frames + DaVinci AI prompts

**Date:** 4 Sep 2026  
**Evidence:** ITBS running reviews (Noble/Ober = qualitative support); patellar instability clinical exam; LaPrade/Cooper PLC dial ó **never invent Sn/Sp**

**Already shipped (do not regenerate):** `lachman`, `anterior-drawer-knee`, `pivot-shift`, `mcmurray`, `thessaly`, `valgus-stress-mcl`, `varus-stress-lcl`, `posterior-drawer-pcl`

**No patient video (intentional):** acute aggressive pivot if severe pain/swelling (edu video exists ó donít push as self-test); pes/Baker palpation; Clarke/grind (weak isolated utility)

For each:

1. Open the **initial image**.
2. Paste the **prompt** into DaVinci AI (image ? video).
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

> CAST LOCK ù same two people as Cozen / first Kinora catalog. PATIENT: adult man, short brown hair, clean-shaven, fair skin, heather-grey crew-neck t-shirt, dark charcoal shorts. CLINICIAN: adult man, short dark hair, clean-shaven, fair skin, solid medium-blue V-neck medical scrubs (top and trousers), bare hands. Same light-blue studio, blue treatment table, polished medical-illustration style. FORBIDDEN: different faces, female clinician or patient, polo, khaki, tank top, shirtless, white coat, extra people. Educational physiotherapy demonstration video, soft neutral lighting, anatomically accurate hand placement, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.

---

## Checklist

| # | id | Initial image | Video out | Status |
|---|-----|---------------|-----------|--------|
| 1 | `noble-compression` | `noble-compression.png` | `noble-compression.mp4` | image ? ∑ video ? (+ Kinora logo) |
| 2 | `ober-test` | `ober-test.png` | `ober-test.mp4` | image ? ∑ video ? (+ Kinora logo) |
| 3 | `patellar-apprehension` | `patellar-apprehension.png` | `patellar-apprehension.mp4` | image ? ∑ video ? (31 + Kinora) |
| 4 | `dial-test` | `dial-test.png` | `dial-test.mp4` | image ? ∑ video ? (30 + Kinora, 90∞) |

---

## 1. noble-compression

![noble-compression](./noble-compression.png)

**Path:** `public/clinical-tests/noble-compression.png`  
**DaVinci upload:** `c:\Users\sergi\project-ai\public\clinical-tests\noble-compression-start.png`  
**Out:** `noble-compression.mp4`

**Movement:** **apretar por fuera** (lateral femoral epicondyle / ITB) + pasar de **flexiÛn ? extensiÛn**.

**Prompt (copy/paste):**

```
Using this illustration as reference, animate the Noble compression test for IT band syndrome. NO anatomical drawings, NO cyan overlays, NO arrows ó real skin and hands only.

SETUP: patient SUPINE. Clinician firmly PRESSES (apretar) with thumb/fingers on the OUTER / LATERAL side of the knee ó lateral femoral epicondyle / ITB (por fuera de la rodilla). Other hand holds the ankle / lower leg.

CRITICAL MOTION ó FLEXI”N ? EXTENSI”N:
1) Start with the knee in clear FLEXION (bent).
2) Keep firm LATERAL compression the whole time (do not let go of the outer knee pressure).
3) Passively move the knee from FLEXION into EXTENSION (straighten the leg) while maintaining that outer pressure.
4) Brief hold near ~30∞ / as the ITB passes the epicondyle, then slight release.

FORBIDDEN: pressing on the medial (inner) knee; only small wiggle without clear flexion-to-extension; overlays/arrows. Camera steady, 8 seconds, no logos, no captions, no watermarks. Educational physiotherapy demonstration video, realistic clinic setting, soft neutral lighting, anatomically accurate hand placement, calm professional clinician and patient, no blood, no gore.
```

---

## 2. ober-test

![ober-test](./ober-test.png)

**Path:** `public/clinical-tests/ober-test.png` ∑ **Out:** `ober-test.mp4`

```
Using this illustration as reference, animate the Ober test: patient side-lying with the bottom hip flexed for stability; clinician supports the top leg, gently abducts and extends the hip, then slowly lowers the leg into adduction; calm controlled motion. Optional soft cyan highlight on the IT band / TFL. CAST LOCK ù same two people as Cozen / first Kinora catalog. PATIENT: adult man, short brown hair, clean-shaven, fair skin, heather-grey crew-neck t-shirt, dark charcoal shorts. CLINICIAN: adult man, short dark hair, clean-shaven, fair skin, solid medium-blue V-neck medical scrubs (top and trousers), bare hands. Same light-blue studio, blue treatment table, polished medical-illustration style. FORBIDDEN: different faces, female clinician or patient, polo, khaki, tank top, shirtless, white coat, extra people. Educational physiotherapy demonstration video, soft neutral lighting, anatomically accurate hand placement, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.
```

---

## 3. patellar-apprehension

![patellar-apprehension](./patellar-apprehension.png)

**Path:** `public/clinical-tests/patellar-apprehension.png`  
**DaVinci upload:** `c:\Users\sergi\project-ai\public\clinical-tests\patellar-apprehension-start.png`  
**Out:** `patellar-apprehension.mp4`

**Movement:** apretar la **rÛtula** (borde medial) y empujar **hacia fuera**.  
**FORBIDDEN:** apretar el **tendÛn rotuliano** (debajo de la rÛtula).

**Prompt (copy/paste):** see `CAST_REWRITE_BATCH.md` ß10 (thumbs on patella bone, not tendon).

```
Using this illustration as reference, animate the patellar apprehension test (aprehensiÛn rotuliana). Photorealistic. NO anatomical drawings, NO skeleton overlays, NO arrows, NO captions.

SETUP: patient SUPINE. Knee ONLY slightly flexed (~20ñ30∞ ó almost straight, NOT 90∞). Heel on the table. Close three-quarter view of the anterior knee so the kneecap is clearly visible.

HANDS ó CRITICAL (error if wrong):
- Clinician presses with BOTH THUMBS directly on the MEDIAL (inner) BORDER of the PATELLA / KNEECAP BONE (rÛtula).
- Contact is ON THE HARD OVAL OF THE KNEECAP itself ó apretar la R”TULA.
- Fingers may lightly stabilize the lateral side of the patella, but force is thumbs on the patella bone.

FORBIDDEN HAND CONTACT:
- Do NOT press / push / squeeze the PATELLAR TENDON (tendÛn rotuliano) ó the soft vertical band BELOW the kneecap down to the tibial tuberosity.
- Do NOT put main force on the shin, tibial tuberosity, or soft tissue under the inferior pole of the patella.
- Do NOT grab the calf as the main action.

CRITICAL MOTION ó R”TULA HACIA FUERA:
- Clearly PUSH / glide the PATELLA BONE LATERALLY (hacia fuera ó toward the outer side of the knee).
- The only main movement is the kneecap sliding outward under the thumbs. Do NOT push inward. Do NOT move the whole leg as the main action.

MOTION (1ñ7s): gentle steady lateral push of the patella ? brief hold (apprehension moment) ? release back to center. Calm, controlled. Do NOT dramatize pain or dislocation. No cyan overlays required.

CAST LOCK ó same two people as Cozen / first Kinora catalog. PATIENT: adult man, short brown hair, clean-shaven, fair skin, heather-grey crew-neck t-shirt, dark charcoal shorts. CLINICIAN: adult man, short dark hair, clean-shaven, fair skin, solid medium-blue V-neck medical scrubs (top and trousers), bare hands. Same light-blue studio, blue treatment table, polished medical-illustration style. FORBIDDEN: different faces, female clinician or patient, polo, khaki, tank top, shirtless, white coat, extra people. Educational physiotherapy demonstration video, soft neutral lighting, anatomically accurate hand placement, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.
```

---

## 4. dial-test

**Ref:** Physiotutors dial / Loomer ù start extended ? bend to ~90ù ? ER

**DaVinci FIRST:** `c:\Users\sergi\project-ai\public\clinical-tests\dial-test-start.png`  
**DaVinci LAST:** `c:\Users\sergi\project-ai\public\clinical-tests\dial-test-end.png`  
**Out:** `dial-test.mp4`

**Prompt (copy/paste):** see `CAST_REWRITE_BATCH.md` ù11 (extend ? flex 90ù ? dial ER).
