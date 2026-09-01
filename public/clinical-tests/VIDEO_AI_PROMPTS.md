# AI video prompts — clinical tests
# Image folder: public/clinical-tests/
# Save videos as: public/clinical-tests/videos/<id>.mp4
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
Educational physiotherapy demonstration video, realistic clinic setting, soft neutral lighting, anatomically accurate hand placement, calm professional clinician and patient, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.
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
Using this illustration as reference, animate a clinician performing the Lachman test: patient supine, knee flexed about 20–30 degrees, one hand stabilizing the femur, the other gently translating the tibia anteriorly. Side view of the knee. Educational physiotherapy demonstration video, realistic clinic setting, soft neutral lighting, anatomically accurate hand placement, calm professional clinician and patient, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.

## 2. anterior-drawer-knee
IMAGE: public/clinical-tests/anterior-drawer-knee.webp
FILE OUT: anterior-drawer-knee.mp4
PROMPT:
Using this illustration as reference, animate the anterior drawer test of the knee: patient supine, knee flexed about 90 degrees with foot flat, clinician sits on the foot and draws the tibia forward relative to the femur. Educational physiotherapy demonstration video, realistic clinic setting, soft neutral lighting, anatomically accurate hand placement, calm professional clinician and patient, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.

## 3. pivot-shift
IMAGE: public/clinical-tests/pivot-shift.webp
FILE OUT: pivot-shift.mp4
PROMPT:
Using this illustration as reference, animate the pivot-shift test: clinician applies valgus stress and internal rotation while flexing and extending the knee to demonstrate rotational instability assessment. Educational physiotherapy demonstration video, realistic clinic setting, soft neutral lighting, anatomically accurate hand placement, calm professional clinician and patient, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.

## 4. mcmurray
IMAGE: public/clinical-tests/mcmurray.webp
FILE OUT: mcmurray.mp4
PROMPT:
Using this illustration as reference, animate the McMurray test: patient supine, clinician flexes the knee fully, rotates the tibia, applies valgus or varus stress, and slowly extends the knee while palpating the joint line. Educational physiotherapy demonstration video, realistic clinic setting, soft neutral lighting, anatomically accurate hand placement, calm professional clinician and patient, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.

## 5. thessaly
IMAGE: public/clinical-tests/thessaly.webp
FILE OUT: thessaly.mp4
PROMPT:
Using this illustration as reference, animate the Thessaly test: patient stands on one leg with slight knee flexion, holds the clinician for balance, and rotates the body inward and outward over the planted foot. Educational physiotherapy demonstration video, realistic clinic setting, soft neutral lighting, anatomically accurate movement, calm professional clinician and patient, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.

## 6. neer
IMAGE: public/clinical-tests/neer.webp
FILE OUT: neer.mp4
PROMPT:
Using this illustration as reference, animate the Neer impingement test: clinician stabilizes the scapula and passively elevates the patient's arm in forward flexion, forcing the greater tuberosity under the acromion. Educational physiotherapy demonstration video, realistic clinic setting, soft neutral lighting, anatomically accurate hand placement, calm professional clinician and patient, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.

## 7. hawkins-kennedy
IMAGE: public/clinical-tests/hawkins-kennedy.webp
FILE OUT: hawkins-kennedy.mp4
PROMPT:
Using this illustration as reference, animate the Hawkins-Kennedy test: patient's shoulder and elbow flexed to 90 degrees, clinician passively internally rotates the arm. Educational physiotherapy demonstration video, realistic clinic setting, soft neutral lighting, anatomically accurate hand placement, calm professional clinician and patient, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.

## 8. jobe-empty-can
IMAGE: public/clinical-tests/jobe-empty-can.webp
FILE OUT: jobe-empty-can.mp4
PROMPT:
Using this illustration as reference, animate the Jobe empty-can test: arms elevated in the scapular plane with thumbs down, patient resists downward pressure from the clinician. Educational physiotherapy demonstration video, realistic clinic setting, soft neutral lighting, anatomically accurate hand placement, calm professional clinician and patient, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.

## 9. apprehension
IMAGE: public/clinical-tests/apprehension.webp
FILE OUT: apprehension.mp4
PROMPT:
Using this illustration as reference, animate the shoulder apprehension test: patient supine or seated, arm abducted and externally rotated progressively while the clinician supports the elbow and watches for apprehension. Educational physiotherapy demonstration video, realistic clinic setting, soft neutral lighting, anatomically accurate hand placement, calm professional clinician and patient, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.

## 10. drop-arm
IMAGE: public/clinical-tests/drop-arm.webp
FILE OUT: drop-arm.mp4
PROMPT:
Using this illustration as reference, animate the drop-arm test: clinician passively abducts the arm fully, then asks the patient to slowly lower it; show controlled lowering of the arm. Educational physiotherapy demonstration video, realistic clinic setting, soft neutral lighting, anatomically accurate movement, calm professional clinician and patient, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.

## 11. painful-arc
IMAGE: public/clinical-tests/painful-arc.webp
FILE OUT: painful-arc.mp4
PROMPT:
Using this illustration as reference, animate the painful arc test: patient actively abducts the arm from the side through a full arc, pausing briefly around mid-range elevation. Educational physiotherapy demonstration video, realistic clinic setting, soft neutral lighting, anatomically accurate movement, calm professional clinician and patient, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.

## 12. spurling
IMAGE: public/clinical-tests/spurling.webp
FILE OUT: spurling.mp4
PROMPT:
Using this illustration as reference, animate Spurling's test: patient seated, clinician gently extends and side-bends the neck toward the symptomatic side and applies light axial compression. Educational physiotherapy demonstration video, realistic clinic setting, soft neutral lighting, anatomically accurate careful hand placement, calm professional clinician and patient, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.

## 13. ultt
IMAGE: public/clinical-tests/ultt.webp
FILE OUT: ultt.mp4
PROMPT:
Using this illustration as reference, animate the upper limb tension test (median bias): clinician depresses the shoulder, extends the elbow, wrist and fingers while abducting the arm to tension the neural pathway. Educational physiotherapy demonstration video, realistic clinic setting, soft neutral lighting, anatomically accurate hand placement, calm professional clinician and patient, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.

## 14. thompson
IMAGE: public/clinical-tests/thompson.webp
FILE OUT: thompson.mp4
PROMPT:
Using this illustration as reference, animate the Thompson / Simmonds test: patient prone with feet off the table, clinician squeezes the calf muscle belly and observes plantarflexion of the foot. Educational physiotherapy demonstration video, realistic clinic setting, soft neutral lighting, anatomically accurate hand placement, calm professional clinician and patient, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.

## 15. matles
IMAGE: public/clinical-tests/matles.webp
FILE OUT: matles.mp4
PROMPT:
Using this illustration as reference, animate the Matles test: patient prone, knees flexed to 90 degrees, compare resting foot position of both ankles for Achilles assessment. Educational physiotherapy demonstration video, realistic clinic setting, soft neutral lighting, anatomically accurate positioning, calm professional clinician and patient, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.

## 16. anterior-drawer-ankle
IMAGE: public/clinical-tests/anterior-drawer-ankle.webp
FILE OUT: anterior-drawer-ankle.mp4
PROMPT:
Using this illustration as reference, animate the anterior drawer test of the ankle: patient seated or supine, ankle slightly plantarflexed, clinician stabilizes the tibia and draws the calcaneus/talus forward. Educational physiotherapy demonstration video, realistic clinic setting, soft neutral lighting, anatomically accurate hand placement, calm professional clinician and patient, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.

## 17. windlass
IMAGE: public/clinical-tests/windlass.webp
FILE OUT: windlass.mp4
PROMPT:
Using this illustration as reference, animate the Windlass test: clinician passively extends the big toe while the foot is weight-bearing or supported, tensioning the plantar fascia. Educational physiotherapy demonstration video, realistic clinic setting, soft neutral lighting, anatomically accurate hand placement, calm professional clinician and patient, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.

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
Using this illustration as reference, animate the FABER / Patrick test: patient supine, tested leg in figure-4 position (flexion, abduction, external rotation), clinician gently presses the knee toward the table while stabilizing the opposite pelvis. Educational physiotherapy demonstration video, realistic clinic setting, soft neutral lighting, anatomically accurate hand placement, calm professional clinician and patient, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.

## 21. fadir
IMAGE: public/clinical-tests/fadir.webp
FILE OUT: fadir.mp4
PROMPT:
Using this illustration as reference, animate the FADIR test: patient supine, clinician flexes, adducts and internally rotates the hip toward the opposite shoulder. Educational physiotherapy demonstration video, realistic clinic setting, soft neutral lighting, anatomically accurate hand placement, calm professional clinician and patient, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.

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
Using this illustration as reference, animate Tinel's sign at the wrist: clinician gently taps over the carpal tunnel / median nerve at the wrist with a finger. Educational physiotherapy demonstration video, realistic clinic setting, soft neutral lighting, anatomically accurate hand placement, calm professional clinician and patient, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.

## 25. cozen
IMAGE: public/clinical-tests/cozen.webp
FILE OUT: cozen.mp4
PROMPT:
Using this illustration as reference, animate Cozen's test for lateral epicondylalgia: elbow extended, forearm pronated, patient makes a fist and resists clinician's attempt to flex the wrist while the clinician palpates the lateral epicondyle. Educational physiotherapy demonstration video, realistic clinic setting, soft neutral lighting, anatomically accurate hand placement, calm professional clinician and patient, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.

## 26. mill
IMAGE: public/clinical-tests/mill.webp
FILE OUT: mill.mp4
PROMPT:
Using this illustration as reference, animate Mill's test: clinician passively extends the elbow while flexing the wrist and pronating the forearm, stressing the common extensor origin. Educational physiotherapy demonstration video, realistic clinic setting, soft neutral lighting, anatomically accurate hand placement, calm professional clinician and patient, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.

## 27. speed
IMAGE: public/clinical-tests/speed.webp
FILE OUT: speed.mp4
PROMPT:
Using this illustration as reference, animate Speed's test: elbow extended, forearm supinated, patient elevates the arm against resistance while the clinician palpates the bicipital groove. Educational physiotherapy demonstration video, realistic clinic setting, soft neutral lighting, anatomically accurate hand placement, calm professional clinician and patient, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.

## 28. yergason
IMAGE: public/clinical-tests/yergason.webp
FILE OUT: yergason.mp4
PROMPT:
Using this illustration as reference, animate Yergason's test: elbow flexed to 90 degrees, patient attempts to supinate against resistance while the clinician palpates the bicipital groove. Educational physiotherapy demonstration video, realistic clinic setting, soft neutral lighting, anatomically accurate hand placement, calm professional clinician and patient, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.

## 29. schober
IMAGE: public/clinical-tests/schober.webp
FILE OUT: schober.mp4
PROMPT:
Using this illustration as reference, animate the Schober test: marks on the lumbar spine, patient standing then bending forward into flexion while the clinician observes the increase in distance between marks. Educational physiotherapy demonstration video, realistic clinic setting, soft neutral lighting, anatomically accurate spinal flexion, calm professional clinician and patient, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.

## 30. slr-lasegue
IMAGE: public/clinical-tests/slr-lasegue.webp
FILE OUT: slr-lasegue.mp4
PROMPT:
Using this illustration as reference, animate the straight leg raise / Lasègue test: patient supine, clinician slowly raises the straight leg by flexing the hip with the knee extended. Educational physiotherapy demonstration video, realistic clinic setting, soft neutral lighting, anatomically accurate hand placement, calm professional clinician and patient, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.

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
Using this illustration as reference, animate the cross-body adduction test (Physiotutors / Chronopoulos): elevate the arm to 90° of forward flexion, then passively guide maximum horizontal adduction across the chest toward the opposite shoulder (elbow ~90° flexed, scarf position). Positive finding is pain on top of the shoulder at the AC joint. Educational physiotherapy demonstration video, realistic clinic setting, soft neutral lighting, anatomically accurate hand placement, calm professional clinician and patient, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.

## 33. valgus-stress-mcl
IMAGE: public/clinical-tests/valgus-stress-mcl.webp
FILE OUT: valgus-stress-mcl.mp4
PROMPT:
Using this illustration as reference, animate the valgus stress test for the MCL (Physiotutors): patient supine and relaxed; one hand grips the leg just above the ankle, the other stabilizes the femur/lateral knee (thenar near fibular head); apply slight tibial external rotation and passive abduction/valgus to open the medial joint line. Show first in full extension, then repeat at 20–30° knee flexion. Look for medial gapping and pain reproduction. Educational physiotherapy demonstration video, realistic clinic setting, soft neutral lighting, anatomically accurate hand placement, calm professional clinician and patient, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.

## 34. varus-stress-lcl
IMAGE: public/clinical-tests/varus-stress-lcl.webp
FILE OUT: varus-stress-lcl.mp4
PROMPT:
Using this illustration as reference, animate the knee varus stress test for the LCL: patient supine, knee flexed about 30 degrees, clinician applies gentle varus force opening the lateral joint line. Educational physiotherapy demonstration video, realistic clinic setting, soft neutral lighting, anatomically accurate hand placement, calm professional clinician and patient, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.

## 35. posterior-drawer-pcl
IMAGE: public/clinical-tests/posterior-drawer-pcl.webp
FILE OUT: posterior-drawer-pcl.mp4
PROMPT:
Using this illustration as reference, animate the posterior drawer / sag test for the PCL: patient supine, knee flexed about 90 degrees, clinician pushes the proximal tibia posteriorly relative to the femur. Educational physiotherapy demonstration video, realistic clinic setting, soft neutral lighting, anatomically accurate hand placement, calm professional clinician and patient, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.

## 36. resisted-wrist-flexion
IMAGE: public/clinical-tests/resisted-wrist-flexion.webp
FILE OUT: resisted-wrist-flexion.mp4
PROMPT:
Using this illustration as reference, animate resisted wrist flexion for medial epicondylalgia: elbow nearly extended, palm up, patient flexes the wrist against the clinician's resistance while the medial epicondyle is assessed. Educational physiotherapy demonstration video, realistic clinic setting, soft neutral lighting, anatomically accurate hand placement, calm professional clinician and patient, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.

## 37. elbow-flexion-cubital
IMAGE: public/clinical-tests/elbow-flexion-cubital.webp
FILE OUT: elbow-flexion-cubital.mp4
PROMPT:
Using this illustration as reference, animate the elbow flexion test for cubital tunnel: patient holds the elbow in maximal flexion for several seconds; optional gentle tapping over the ulnar nerve behind the medial epicondyle. Educational physiotherapy demonstration video, realistic clinic setting, soft neutral lighting, anatomically accurate hand placement, calm professional clinician and patient, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.

## 38. cervical-distraction
IMAGE: public/clinical-tests/cervical-distraction.webp
FILE OUT: cervical-distraction.mp4
PROMPT:
Using this illustration as reference, animate cervical distraction: patient seated or supine, clinician gently applies axial traction lifting the head to unload the cervical spine and assess relief of arm symptoms. Educational physiotherapy demonstration video, realistic clinic setting, soft neutral lighting, anatomically accurate careful hand placement, calm professional clinician and patient, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.

## 39. thumb-ucl-stress
IMAGE: public/clinical-tests/thumb-ucl-stress.webp
FILE OUT: thumb-ucl-stress.mp4
PROMPT:
Using this illustration as reference, animate ulnar collateral ligament stress of the thumb MCP: clinician stabilizes the metacarpal and applies gentle valgus stress to the proximal phalanx of the thumb. Educational physiotherapy demonstration video, realistic clinic setting, soft neutral lighting, anatomically accurate hand placement, calm professional clinician and patient, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.

## 40. finkelstein
IMAGE: public/clinical-tests/finkelstein.webp
FILE OUT: finkelstein.mp4
PROMPT:
Using this illustration as reference, animate the true Finkelstein test for De Quervain: clinician stabilizes the thumb and ulnar-deviates the wrist (not merely closing the fist over the thumb). Educational physiotherapy demonstration video, realistic clinic setting, soft neutral lighting, anatomically accurate hand placement, calm professional clinician and patient, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.

## 41. snuffbox-palpation
IMAGE: public/clinical-tests/snuffbox-palpation.webp
FILE OUT: snuffbox-palpation.mp4
PROMPT:
Using this illustration as reference, animate anatomical snuffbox palpation: thumb extended, clinician presses gently into the hollow between the extensor tendons on the radial wrist over the scaphoid. Educational physiotherapy demonstration video, realistic clinic setting, soft neutral lighting, anatomically accurate hand placement, calm professional clinician and patient, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.

## 42. thumb-axial-load
IMAGE: public/clinical-tests/thumb-axial-load.webp
FILE OUT: thumb-axial-load.mp4
PROMPT:
Using this illustration as reference, animate axial load of the thumb for scaphoid screening: clinician compresses along the thumb metacarpal toward the wrist/scaphoid. Show a HAND and WRIST only — not a foot. Educational physiotherapy demonstration video, realistic clinic setting, soft neutral lighting, anatomically accurate hand placement, calm professional clinician and patient, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.

## 43. tfcc-ulnar-load
IMAGE: public/clinical-tests/tfcc-ulnar-load.webp
FILE OUT: tfcc-ulnar-load.mp4
PROMPT:
Using this illustration as reference, animate ulnar load / TFCC provocation: wrist in ulnar deviation with axial load through the hand, clinician assessing the ulnar fovea region. Educational physiotherapy demonstration video, realistic clinic setting, soft neutral lighting, anatomically accurate hand placement, calm professional clinician and patient, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.

## 44. cmc-grind
IMAGE: public/clinical-tests/cmc-grind.webp
FILE OUT: cmc-grind.mp4
PROMPT:
Using this illustration as reference, animate the CMC grind test of the thumb: clinician grips the thumb metacarpal, applies axial compression and rotates at the carpometacarpal joint. Educational physiotherapy demonstration video, realistic clinic setting, soft neutral lighting, anatomically accurate hand placement, calm professional clinician and patient, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.

## 45. crossed-slr
IMAGE: public/clinical-tests/crossed-slr.webp
FILE OUT: crossed-slr.mp4
PROMPT:
Using this illustration as reference, animate the crossed straight leg raise (well-leg raise): patient supine, clinician raises the asymptomatic straight leg while the symptomatic leg remains on the table. Educational physiotherapy demonstration video, realistic clinic setting, soft neutral lighting, anatomically accurate hand placement, calm professional clinician and patient, no blood, no gore, no logos, no captions, no watermarks, camera steady, 8 seconds.

---

# Batch 3 — Shoulder expansion (ids 46–56) — see dedicated pack

Images are ready as `.webp`. Full prompts + embeds:
→ **`SHOULDER_NEW_TESTS_VIDEO_PROMPTS.md`**
