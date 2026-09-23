# Kinora clinical-test cast (locked)

Every clinical-test still and video must use **the same two people and clothes** as the first catalog (reference: `cozen.webp` / Cozen video).

Do **not** invent a new patient or clinician for a new test. Change only pose, camera, and tested body region.

## Patient (always)

- Adult man, ~30s
- Short brown hair, clean-shaven, fair skin
- Heather-grey crew-neck t-shirt
- Dark charcoal / navy shorts
- Same face as Cozen / first Kinora tests

## Clinician (always)

- Adult man, ~35
- Short dark hair, clean-shaven, fair skin
- Solid medium-blue V-neck medical scrubs (top **and** trousers)
- Bare hands, no gloves, no watch, no white coat, no polo
- Same face as Cozen / first Kinora tests

## Setting / style

- Light-blue studio background (no plants, no window blinds, no white void)
- Blue treatment table when a table is needed
- Polished medical-illustration look (same as the first catalog), not a new photoreal photoshoot

## Forbidden

- Different faces or a second pair of actors
- Female patient or female clinician
- Shirtless patient, tank top, hoodie, polo, khaki trousers
- Navy polo, white coat, green/teal scrubs
- Extra people in frame

## Copy-paste lock (prepend or append to every I2V prompt)

```
CAST LOCK — same two people as Cozen / first Kinora catalog. PATIENT: adult man, short brown hair, clean-shaven, fair skin, heather-grey crew-neck t-shirt, dark charcoal shorts. CLINICIAN: adult man, short dark hair, clean-shaven, fair skin, solid medium-blue V-neck medical scrubs (top and trousers), bare hands. Same light-blue studio, blue treatment table, polished medical-illustration style. FORBIDDEN: different faces, female clinician or patient, polo, khaki, tank top, shirtless, white coat, extra people.
```

## If the start still shows the wrong people

Do not animate that still as-is. Replace the still with a new frame that uses this cast, then run image-to-video.

Sibling leftovers for the 25-video batch (`kim-test.png`, `jerk-test.png`, `hip-scour-start.png`, `patellar-apprehension-start.png`, `dial-test-start.png`, `chair-push-plri.png`, `biceps-squeeze.png`, `kim-test-end.png`, `chair-push-plri-end.png`) were recast to this pair so they no longer show polo / shirtless / female / navy-polo actors.

## Stills recast (ready for DaVinci re-export)

**Hip:** `thomas-test`, `resisted-adduction`, `resisted-hip-flexion`, `resisted-abduction`, `log-roll`, `stinchfield`, `hip-scour`

**Knee:** `noble-compression`, `ober-test`, `patellar-apprehension`, `dial-test`

**Shoulder:** `kim-test-start`, `jerk-test-start`

**Lumbar / SI:** `thigh-thrust`, `si-distraction`, `si-compression`, `active-slr`

**Ankle:** `syndesmosis-squeeze`, `kleiger`, `talar-tilt`

**Cervical:** `flexion-rotation`, `bakody`

**Elbow / wrist:** `chair-push-plri-start`, `biceps-squeeze-start`, `press-test`

Existing CDN `.mp4` files still show the old actors until those clips are regenerated from these stills (`append-kinora-logo-outro.ps1` + upload).

First-catalog videos (Cozen, Mill, Lachman, etc.) already use this cast — do not regenerate those.
