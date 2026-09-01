/**
 * Educational demo videos for clinical special tests.
 * Served from the public clinical-tests Storage bucket so web and mobile share one CDN.
 * Keep ids in sync with clinical-test-images.ts
 */

import { CLINICAL_TEST_CDN } from "./clinical-test-cdn";

const VIDEO_CACHE = "v=20260818cdn";

/** Test ids that currently have a shipped demo video. */
export const CLINICAL_TEST_VIDEOS = {
  lachman: `${CLINICAL_TEST_CDN}/videos/lachman.mp4?${VIDEO_CACHE}`,
  "anterior-drawer-knee": `${CLINICAL_TEST_CDN}/videos/anterior-drawer-knee.mp4?${VIDEO_CACHE}`,
  "pivot-shift": `${CLINICAL_TEST_CDN}/videos/pivot-shift.mp4?${VIDEO_CACHE}`,
  mcmurray: `${CLINICAL_TEST_CDN}/videos/mcmurray.mp4?${VIDEO_CACHE}`,
  thessaly: `${CLINICAL_TEST_CDN}/videos/thessaly.mp4?${VIDEO_CACHE}`,
  neer: `${CLINICAL_TEST_CDN}/videos/neer.mp4?${VIDEO_CACHE}`,
  "hawkins-kennedy": `${CLINICAL_TEST_CDN}/videos/hawkins-kennedy.mp4?${VIDEO_CACHE}`,
  "jobe-empty-can": `${CLINICAL_TEST_CDN}/videos/jobe-empty-can.mp4?${VIDEO_CACHE}`,
  apprehension: `${CLINICAL_TEST_CDN}/videos/apprehension.mp4?${VIDEO_CACHE}`,
  "drop-arm": `${CLINICAL_TEST_CDN}/videos/drop-arm.mp4?${VIDEO_CACHE}`,
  "painful-arc": `${CLINICAL_TEST_CDN}/videos/painful-arc.mp4?${VIDEO_CACHE}`,
  spurling: `${CLINICAL_TEST_CDN}/videos/spurling.mp4?${VIDEO_CACHE}`,
  ultt: `${CLINICAL_TEST_CDN}/videos/ultt.mp4?${VIDEO_CACHE}`,
  thompson: `${CLINICAL_TEST_CDN}/videos/thompson.mp4?${VIDEO_CACHE}`,
  matles: `${CLINICAL_TEST_CDN}/videos/matles.mp4?${VIDEO_CACHE}`,
  "anterior-drawer-ankle": `${CLINICAL_TEST_CDN}/videos/anterior-drawer-ankle.mp4?${VIDEO_CACHE}`,
  windlass: `${CLINICAL_TEST_CDN}/videos/windlass.mp4?${VIDEO_CACHE}`,
  "heel-raise": `${CLINICAL_TEST_CDN}/videos/heel-raise.mp4?${VIDEO_CACHE}`,
  "hop-test": `${CLINICAL_TEST_CDN}/videos/hop-test.mp4?${VIDEO_CACHE}`,
  faber: `${CLINICAL_TEST_CDN}/videos/faber.mp4?${VIDEO_CACHE}`,
  fadir: `${CLINICAL_TEST_CDN}/videos/fadir.mp4?${VIDEO_CACHE}`,
  trendelenburg: `${CLINICAL_TEST_CDN}/videos/trendelenburg.mp4?${VIDEO_CACHE}`,
  phalen: `${CLINICAL_TEST_CDN}/videos/phalen.mp4?${VIDEO_CACHE}`,
  tinel: `${CLINICAL_TEST_CDN}/videos/tinel.mp4?${VIDEO_CACHE}`,
  durkan: `${CLINICAL_TEST_CDN}/videos/durkan.mp4?${VIDEO_CACHE}`,
  cozen: `${CLINICAL_TEST_CDN}/videos/cozen.mp4?${VIDEO_CACHE}`,
  mill: `${CLINICAL_TEST_CDN}/videos/mill.mp4?${VIDEO_CACHE}`,
  maudsley: `${CLINICAL_TEST_CDN}/videos/maudsley.mp4?${VIDEO_CACHE}`,
  "hook-test": `${CLINICAL_TEST_CDN}/videos/hook-test.mp4?${VIDEO_CACHE}`,
  "milking-maneuver": `${CLINICAL_TEST_CDN}/videos/milking-maneuver.mp4?${VIDEO_CACHE}`,
  "moving-valgus": `${CLINICAL_TEST_CDN}/videos/moving-valgus.mp4?${VIDEO_CACHE}`,
  speed: `${CLINICAL_TEST_CDN}/videos/speed.mp4?${VIDEO_CACHE}`,
  yergason: `${CLINICAL_TEST_CDN}/videos/yergason.mp4?${VIDEO_CACHE}`,
  schober: `${CLINICAL_TEST_CDN}/videos/schober.mp4?${VIDEO_CACHE}`,
  "slr-lasegue": `${CLINICAL_TEST_CDN}/videos/slr-lasegue.mp4?${VIDEO_CACHE}`,
  kemp: `${CLINICAL_TEST_CDN}/videos/kemp.mp4?${VIDEO_CACHE}`,
  "cross-body": `${CLINICAL_TEST_CDN}/videos/cross-body.mp4?${VIDEO_CACHE}`,
  "full-can": `${CLINICAL_TEST_CDN}/videos/full-can.mp4?${VIDEO_CACHE}`,
  surprise: `${CLINICAL_TEST_CDN}/videos/surprise.mp4?${VIDEO_CACHE}`,
  paxinos: `${CLINICAL_TEST_CDN}/videos/paxinos.mp4?${VIDEO_CACHE}`,
  uppercut: `${CLINICAL_TEST_CDN}/videos/uppercut.mp4?${VIDEO_CACHE}`,
  crank: `${CLINICAL_TEST_CDN}/videos/crank.mp4?${VIDEO_CACHE}`,
  "belly-press": `${CLINICAL_TEST_CDN}/videos/belly-press.mp4?${VIDEO_CACHE}`,
  "lift-off": `${CLINICAL_TEST_CDN}/videos/lift-off.mp4?${VIDEO_CACHE}`,
  "er-lag": `${CLINICAL_TEST_CDN}/videos/er-lag.mp4?${VIDEO_CACHE}`,
  obrien: `${CLINICAL_TEST_CDN}/videos/obrien.mp4?${VIDEO_CACHE}`,
  "kim-test": `${CLINICAL_TEST_CDN}/videos/kim-test.mp4?${VIDEO_CACHE}`,
  "jerk-test": `${CLINICAL_TEST_CDN}/videos/jerk-test.mp4?${VIDEO_CACHE}`,
  "varus-stress-lcl": `${CLINICAL_TEST_CDN}/videos/varus-stress-lcl.mp4?${VIDEO_CACHE}`,
  "thumb-axial-load": `${CLINICAL_TEST_CDN}/videos/thumb-axial-load.mp4?${VIDEO_CACHE}`,
  "valgus-stress-mcl": `${CLINICAL_TEST_CDN}/videos/valgus-stress-mcl.mp4?${VIDEO_CACHE}`,
  "posterior-drawer-pcl": `${CLINICAL_TEST_CDN}/videos/posterior-drawer-pcl.mp4?${VIDEO_CACHE}`,
  "resisted-wrist-flexion": `${CLINICAL_TEST_CDN}/videos/resisted-wrist-flexion.mp4?${VIDEO_CACHE}`,
  "elbow-flexion-cubital": `${CLINICAL_TEST_CDN}/videos/elbow-flexion-cubital.mp4?${VIDEO_CACHE}`,
  "cervical-distraction": `${CLINICAL_TEST_CDN}/videos/cervical-distraction.mp4?${VIDEO_CACHE}`,
  "thumb-ucl-stress": `${CLINICAL_TEST_CDN}/videos/thumb-ucl-stress.mp4?${VIDEO_CACHE}`,
  finkelstein: `${CLINICAL_TEST_CDN}/videos/finkelstein.mp4?${VIDEO_CACHE}`,
  "what-test": `${CLINICAL_TEST_CDN}/videos/what-test.mp4?${VIDEO_CACHE}`,
  "watson-scaphoid-shift": `${CLINICAL_TEST_CDN}/videos/watson-scaphoid-shift.mp4?${VIDEO_CACHE}`,
  "snuffbox-palpation": `${CLINICAL_TEST_CDN}/videos/snuffbox-palpation.mp4?${VIDEO_CACHE}`,
  "tfcc-ulnar-load": `${CLINICAL_TEST_CDN}/videos/tfcc-ulnar-load.mp4?${VIDEO_CACHE}`,
  "fovea-sign": `${CLINICAL_TEST_CDN}/videos/fovea-sign.mp4?${VIDEO_CACHE}`,
  "piano-key": `${CLINICAL_TEST_CDN}/videos/piano-key.mp4?${VIDEO_CACHE}`,
  "cmc-grind": `${CLINICAL_TEST_CDN}/videos/cmc-grind.mp4?${VIDEO_CACHE}`,
  froment: `${CLINICAL_TEST_CDN}/videos/froment.mp4?${VIDEO_CACHE}`,
  "jersey-finger": `${CLINICAL_TEST_CDN}/videos/jersey-finger.mp4?${VIDEO_CACHE}`,
  "mallet-finger": `${CLINICAL_TEST_CDN}/videos/mallet-finger.mp4?${VIDEO_CACHE}`,
  "trigger-a1": `${CLINICAL_TEST_CDN}/videos/trigger-a1.mp4?${VIDEO_CACHE}`,
  "crossed-slr": `${CLINICAL_TEST_CDN}/videos/crossed-slr.mp4?${VIDEO_CACHE}`,
} as const;

export type ClinicalTestVideoId = keyof typeof CLINICAL_TEST_VIDEOS;

export function getClinicalTestVideoSrc(testId: string): string | null {
  if (testId in CLINICAL_TEST_VIDEOS) {
    return CLINICAL_TEST_VIDEOS[testId as ClinicalTestVideoId];
  }
  return null;
}
