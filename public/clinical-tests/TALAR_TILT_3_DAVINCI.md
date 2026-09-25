# Talar tilt — 3 videos (LPAA / deltoideo / CFL)

**Cast:** Cozen pair (grey t-shirt + blue V-neck scrubs).  
**App:** one catalog entry `talar-tilt` shows all 3 clips (like McMurray).

| # | id | Image (upload) | Out | Ligamento |
|---|-----|----------------|-----|-----------|
| 1 | `talar-tilt-atfl` | `talar-tilt-atfl.png` | `talar-tilt-atfl.mp4` | LPAA / ATFL — **talón hacia dentro** |
| 2 | `talar-tilt-deltoid` | `talar-tilt-deltoid.png` | `talar-tilt-deltoid.mp4` | Deltoideo — **talón hacia fuera** |
| 3 | `talar-tilt-cfl` | `talar-tilt-cfl.png` | `talar-tilt-cfl.mp4` | Peroneocalcáneo / CFL — **pie en dorsiflexión**, mover dentro↔fuera |

After export:

```powershell
powershell -File scripts/append-kinora-logo-outro.ps1 -Only talar-tilt-atfl.mp4
powershell -File scripts/append-kinora-logo-outro.ps1 -Only talar-tilt-deltoid.mp4
powershell -File scripts/append-kinora-logo-outro.ps1 -Only talar-tilt-cfl.mp4
```

```powershell
node scripts/upload-clinical-tests-storage.mjs --only=videos/talar-tilt-atfl.mp4,videos/talar-tilt-deltoid.mp4,videos/talar-tilt-cfl.mp4,talar-tilt.webp,talar-tilt-deltoid.webp,talar-tilt-cfl.webp
```

---

## 1. Talón hacia dentro — LPAA / ATFL

**Image:** `public/clinical-tests/talar-tilt-atfl.png`  
**Out:** `talar-tilt-atfl.mp4`

```
Using this illustration as reference, animate the talar tilt test for the ANTERIOR TALOFIBULAR LIGAMENT (LPAA / ATFL). Photorealistic. NO anatomical drawings, NO skeleton overlays, NO arrows, NO captions.

SETUP: patient sitting or supine with the tested ankle free. Clinician stabilizes the distal tibia/fibula with one hand. Other hand firmly cups the HEEL (calcaneus / talón).

CRITICAL MOTION — TALÓN HACIA DENTRO (INVERSION):
- Clearly tilt the HEEL INWARD (medially) — talón hacia dentro.
- Keep slight plantarflexion (NOT dorsiflexion) so the stress targets the anterolateral ankle / ATFL (ligamento peroneo-astragalino anterior).
- The main visible movement is the calcaneus rolling inward under the stabilizing shin.
- Brief hold at end-range inversion → gentle return to neutral.

FORBIDDEN: heel eversion (hacia fuera); dorsiflexion as the main position; moving the whole leg instead of the heel.

CAST LOCK — same two people as Cozen / first Kinora catalog. PATIENT: adult man, short brown hair, clean-shaven, fair skin, heather-grey crew-neck t-shirt, dark charcoal shorts. CLINICIAN: adult man, short dark hair, clean-shaven, fair skin, solid medium-blue V-neck medical scrubs (top and trousers), bare hands. Same light-blue studio, blue treatment table. FORBIDDEN: different faces, female clinician or patient, polo, khaki, tank top, shirtless, white coat, extra people. Educational physiotherapy demonstration video, soft neutral lighting, anatomically accurate hand placement, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.
```

---

## 2. Talón hacia fuera — ligamento deltoideo

**Image:** `public/clinical-tests/talar-tilt-deltoid.png`  
**Out:** `talar-tilt-deltoid.mp4`

```
Using this illustration as reference, animate the talar tilt / eversion stress test for the DELTOID LIGAMENT (ligamento deltoideo). Photorealistic. NO anatomical drawings, NO skeleton overlays, NO arrows, NO captions.

SETUP: patient sitting or supine with the tested ankle free. Clinician stabilizes the distal tibia/fibula with one hand. Other hand firmly cups the HEEL (calcaneus / talón).

CRITICAL MOTION — TALÓN HACIA AFUERA (EVERSION):
- Clearly tilt the HEEL OUTWARD (laterally) — talón hacia fuera.
- Stress the MEDIAL ankle / deltoid ligament.
- The main visible movement is the calcaneus rolling outward under the stabilizing shin.
- Brief hold at end-range eversion → gentle return to neutral.

FORBIDDEN: heel inversion (hacia dentro); confusing this with ATFL inversion; moving the whole leg instead of the heel.

CAST LOCK — same two people as Cozen / first Kinora catalog. PATIENT: adult man, short brown hair, clean-shaven, fair skin, heather-grey crew-neck t-shirt, dark charcoal shorts. CLINICIAN: adult man, short dark hair, clean-shaven, fair skin, solid medium-blue V-neck medical scrubs (top and trousers), bare hands. Same light-blue studio, blue treatment table. FORBIDDEN: different faces, female clinician or patient, polo, khaki, tank top, shirtless, white coat, extra people. Educational physiotherapy demonstration video, soft neutral lighting, anatomically accurate hand placement, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.
```

---

## 3. Flexión dorsal + dentro/fuera — peroneocalcáneo / CFL

**Image:** `public/clinical-tests/talar-tilt-cfl.png`  
**Out:** `talar-tilt-cfl.mp4`

```
Using this illustration as reference, animate the calcaneofibular (CFL / ligamento peroneocalcáneo) stress test. Photorealistic. NO anatomical drawings, NO skeleton overlays, NO arrows, NO captions.

SETUP: patient sitting or supine with the tested ankle free. Clinician stabilizes the distal tibia/fibula with one hand. Other hand cups the heel and controls the foot.

CRITICAL — PIE EN FLEXIÓN DORSAL FIRST:
- Bring the ankle into clear DORSIFLEXION (toes toward the shin / pie en dorsiflexión). Keep dorsiflexion throughout.
- This position targets the calcaneofibular ligament (peroneocalcáneo / CFL), NOT the ATFL.

MOTION (1–7s) — MOVER EL PIE HACIA DENTRO Y HACIA FUERA:
- While holding dorsiflexion, tilt the heel/foot INWARD (inversion / hacia dentro) → brief hold.
- Then tilt the heel/foot OUTWARD (eversion / hacia fuera) → brief hold.
- Smooth controlled side-to-side under dorsiflexion. Do NOT drop into plantarflexion.

FORBIDDEN: plantarflexed ATFL-style inversion only; starting without dorsiflexion; overlays.

CAST LOCK — same two people as Cozen / first Kinora catalog. PATIENT: adult man, short brown hair, clean-shaven, fair skin, heather-grey crew-neck t-shirt, dark charcoal shorts. CLINICIAN: adult man, short dark hair, clean-shaven, fair skin, solid medium-blue V-neck medical scrubs (top and trousers), bare hands. Same light-blue studio, blue treatment table. FORBIDDEN: different faces, female clinician or patient, polo, khaki, tank top, shirtless, white coat, extra people. Educational physiotherapy demonstration video, soft neutral lighting, anatomically accurate hand placement, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.
```
