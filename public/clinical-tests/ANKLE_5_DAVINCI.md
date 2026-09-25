# Ankle / foot gaps � 5 core tests: starter frames + DaVinci AI prompts

**Date:** 4 Sep 2026  
**Evidence:** JOSPT ankle CPG (syndesmosis/lateral); Kleiger/talar tilt qualitative; Morton Mulder; tarsal tunnel Tinel � **never invent Sn/Sp**

**Already shipped (do not regenerate):** `thompson`, `matles`, `anterior-drawer-ankle`, `windlass`, `heel-raise`, `hop-test`

**Naming caution:** `syndesmosis-squeeze` ? Thompson calf squeeze (Achilles)

**No patient video (intentional):** Ottawa decision rule (questionnaire + palpation landmarks); calcaneal squeeze for stress fx (text/red-flag); wrist `tinel` must not be used for foot

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

> CAST LOCK � same two people as Cozen / first Kinora catalog. PATIENT: adult man, short brown hair, clean-shaven, fair skin, heather-grey crew-neck t-shirt, dark charcoal shorts. CLINICIAN: adult man, short dark hair, clean-shaven, fair skin, solid medium-blue V-neck medical scrubs (top and trousers), bare hands. Same light-blue studio, blue treatment table, polished medical-illustration style. FORBIDDEN: different faces, female clinician or patient, polo, khaki, tank top, shirtless, white coat, extra people. Educational physiotherapy demonstration video, soft neutral lighting, anatomically accurate hand placement, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.

---

## Checklist

| # | id | Initial image | Video out | Status |
|---|-----|---------------|-----------|--------|
| 1 | `syndesmosis-squeeze` | `syndesmosis-squeeze.png` | `syndesmosis-squeeze.mp4` | image ? � video ? (+ Kinora logo) |
| 2 | `kleiger` | `kleiger.png` | `kleiger.mp4` | image ? � video ? (+ Kinora logo) |
| 3 | `talar-tilt` | `talar-tilt.png` | `talar-tilt.mp4` | image ? � video ? (+ Kinora logo) |
| 4 | `mulder` | `mulder.png` | `mulder.mp4` | image ? � video ? (+ Kinora logo) |
| 5 | `tinel-tarsal` | `tinel-tarsal.png` | `tinel-tarsal.mp4` | image ? � video ? (+ Kinora logo) |

---

## 1. syndesmosis-squeeze

![syndesmosis-squeeze](./syndesmosis-squeeze.png)

**Path:** `public/clinical-tests/syndesmosis-squeeze.png` � **Out:** `syndesmosis-squeeze.mp4`

```
Using this illustration as reference, animate the syndesmosis squeeze test (squeeze de sindesmosis / high ankle). Photorealistic. NO anatomical drawings, NO skeleton overlays, NO arrows, NO captions.

SETUP: patient SUPINE. Tested lower leg accessible (knee slightly flexed or extended). Focus on the MID-CALF / mid-shaft of the lower leg � between knee and ankle.

HANDS � CRITICAL (error if wrong):
- Clinician uses BOTH hands to compress TODA LA TIBIA Y EL PERON�.
- Hands at the SAME HEIGHT on mid-calf, opposite sides of the leg (like a clamp / vise).
- One hand presses the MEDIAL TIBIA (shin bone); the other presses the LATERAL FIBULA (peron�).
- Squeeze the two long bones firmly TOWARD EACH OTHER across the full width of the leg � clear bilateral bone-to-bone compression with both palms wrapping the shafts.
- Hold the squeeze briefly ? release.

FORBIDDEN:
- Thompson Achilles soft-calf squeeze (only soft tissue ? foot plantarflexes). This is NOT Thompson.
- One hand only.
- Hands only on the knee or only on the ankle/foot.
- Squeezing soft calf belly without compressing tibia + fibula bones.

MOTION (1�7s): place both hands ? firm squeeze of tibia+fibula together ? brief hold ? release. Calm, controlled.

CAST LOCK � same two people as Cozen / first Kinora catalog. PATIENT: adult man, short brown hair, clean-shaven, fair skin, heather-grey crew-neck t-shirt, dark charcoal shorts. CLINICIAN: adult man, short dark hair, clean-shaven, fair skin, solid medium-blue V-neck medical scrubs (top and trousers), bare hands. Same light-blue studio, blue treatment table. FORBIDDEN: different faces, female clinician or patient, polo, khaki, tank top, shirtless, white coat, extra people. Educational physiotherapy demonstration video, soft neutral lighting, anatomically accurate hand placement, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.
```

---

## 2. kleiger

![kleiger](./kleiger.png)

**Path:** `public/clinical-tests/kleiger.png` � **Out:** `kleiger.mp4`  
**Motion:** empujar el pie **de dentro a fuera**.

```
Using this illustration as reference, animate the Kleiger / external rotation test (rotaci�n externa / sindesmosis). Photorealistic. NO anatomical drawings, NO skeleton overlays, NO arrows, NO captions.

SETUP: patient seated on the table edge (or semi-reclined) with the tested lower leg free. Clinician faces the foot.

HANDS:
- One hand stabilizes the distal TIBIA / lower leg so the shin does NOT rotate.
- The other hand grips the FOOT and HEEL (midfoot + calcaneus).

CRITICAL MOTION � EMPUJAR DE DENTRO A FUERA (error if missing):
- The clinician clearly PUSHES / rotates the foot FROM INSIDE (medial) TO OUTSIDE (lateral) � �de dentro a fuera�.
- External rotation of the foot: toes and forefoot swing outward while the tibia stays fixed.
- Optional slight dorsiflexion while pushing outward.
- Visible force direction: medial ? lateral on the foot. Brief hold at end-range outward rotation ? gentle return.

FORBIDDEN: pushing inward (de fuera a dentro); inversion; only moving the heel without rotating the foot outward; Thompson; syndesmosis squeeze.

MOTION (1�7s): stabilize tibia ? push foot de dentro a fuera (external rotation) ? brief hold ? release. Calm, controlled.

CAST LOCK � same two people as Cozen / first Kinora catalog. PATIENT: adult man, short brown hair, clean-shaven, fair skin, heather-grey crew-neck t-shirt, dark charcoal shorts. CLINICIAN: adult man, short dark hair, clean-shaven, fair skin, solid medium-blue V-neck medical scrubs (top and trousers), bare hands. Same light-blue studio, blue treatment table. FORBIDDEN: different faces, female clinician or patient, polo, khaki, tank top, shirtless, white coat, extra people. Educational physiotherapy demonstration video, soft neutral lighting, anatomically accurate hand placement, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.
```

---

## 3. talar-tilt

![talar-tilt](./talar-tilt.png)

**Path:** `public/clinical-tests/talar-tilt.png` � **Out:** `talar-tilt.mp4`

```
Using this illustration as reference, animate the talar tilt test: clinician stabilizes the lower leg and gently inverts the calcaneus/talus to stress the lateral ankle ligaments; brief hold then release; calm controlled motion. Optional soft cyan highlight on the lateral ankle / CFL. CAST LOCK � same two people as Cozen / first Kinora catalog. PATIENT: adult man, short brown hair, clean-shaven, fair skin, heather-grey crew-neck t-shirt, dark charcoal shorts. CLINICIAN: adult man, short dark hair, clean-shaven, fair skin, solid medium-blue V-neck medical scrubs (top and trousers), bare hands. Same light-blue studio, blue treatment table, polished medical-illustration style. FORBIDDEN: different faces, female clinician or patient, polo, khaki, tank top, shirtless, white coat, extra people. Educational physiotherapy demonstration video, soft neutral lighting, anatomically accurate hand placement, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.
```

---

## 4. mulder

![mulder](./mulder.png)

**Path:** `public/clinical-tests/mulder.png` · **Out:** `mulder.mp4`  
**Motion lock:** **aprieta TODO EL PIE** (lado a lado).

```
Using this illustration as reference, animate the Mulder test for Morton neuroma. Photorealistic. NO anatomical drawings, NO skeleton overlays, NO arrows, NO captions.

SETUP: patient seated or supine; bare FOOT clearly visible. Clinician faces the forefoot.

CRITICAL — APRIETE TODO EL PIE (error if missing):
- Clinician uses BOTH hands to SQUEEZE THE WHOLE FOOT / entire forefoot side-to-side.
- Hands wrap from the MEDIAL border (1st metatarsal) to the LATERAL border (5th metatarsal) — compressing ALL metatarsal heads together across the full width of the foot (aprieta todo el pie, not a tiny two-finger pinch).
- Palms act like a clamp around the whole ball of the foot.
- Optional: add thumb pressure in an interdigital space WHILE keeping the full-foot squeeze.
- Brief firm hold → release. Calm, controlled. Do not dramatize pain.

FORBIDDEN: only poking one spot on the sole with a single thumb; squeezing only two toes; hands only on the heel/ankle.

CAST LOCK — same two people as Cozen / first Kinora catalog. PATIENT: adult man, short brown hair, clean-shaven, fair skin, heather-grey crew-neck t-shirt, dark charcoal shorts. CLINICIAN: adult man, short dark hair, clean-shaven, fair skin, solid medium-blue V-neck medical scrubs (top and trousers), bare hands. Same light-blue studio, blue treatment table. FORBIDDEN: different faces, female clinician or patient, polo, khaki, tank top, shirtless, white coat, extra people. Educational physiotherapy demonstration video, soft neutral lighting, anatomically accurate hand placement, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.
```
---

## 5. tinel-tarsal

![tinel-tarsal](./tinel-tarsal.png)

**Path:** `public/clinical-tests/tinel-tarsal.png` · **Out:** `tinel-tarsal.mp4`  
**Motion lock:** golpecitos **un poco más arriba** on the **FOOT/ANKLE** (never an arm).

```
Using this illustration as reference, animate the tarsal tunnel Tinel test (Tinel tarsal). Photorealistic. NO anatomical drawings, NO skeleton overlays, NO arrows, NO captions.

ANATOMY — CRITICAL (error if wrong limb):
- The tested limb MUST be a HUMAN LEG AND FOOT: visible knee or thigh → calf → ankle → toes.
- NEVER an arm, forearm, wrist, or hand. Do not attach a foot to an arm.

SETUP: patient seated. MEDIAL ankle (inside of the ankle / maléolo medial) clearly visible. Clinician supports the heel with one hand.

CRITICAL — GOLPECITOS UN POCO MÁS ARRIBA:
- Tap / percuss with a fingertip over the POSTERIOR TIBIAL NERVE on the medial ankle.
- Place the taps a BIT HIGHER / more proximal than just behind-below the tip of the medial malleolus — un poco más arriba along the nerve (upper tarsal tunnel), NOT on the sole of the foot.
- Show 2–4 light golpecitos then pause.
- Do NOT perform a wrist Tinel.

MOTION (1–7s): position finger slightly above the usual malleolar spot on the medial ANKLE → light taps → pause. Calm, controlled.

CAST LOCK — same two people as Cozen / first Kinora catalog. PATIENT: adult man, short brown hair, clean-shaven, fair skin, heather-grey crew-neck t-shirt, dark charcoal shorts. CLINICIAN: adult man, short dark hair, clean-shaven, fair skin, solid medium-blue V-neck medical scrubs (top and trousers), bare hands. Same light-blue studio, blue treatment table. FORBIDDEN: different faces, female clinician or patient, polo, khaki, tank top, shirtless, white coat, extra people, arm/wrist as tested limb. Educational physiotherapy demonstration video, soft neutral lighting, anatomically accurate hand placement, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.
```