/**
 * Educational demo videos for clinical special tests.
 * Keep in sync with lib/clinical-test-videos.ts (web).
 */

import { CLINICAL_TEST_CDN } from "./clinical-test-cdn";

const VIDEO_CACHE = "v=20260818cdn";

const VIDEO_PATHS = {
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
  cozen: `${CLINICAL_TEST_CDN}/videos/cozen.mp4?${VIDEO_CACHE}`,
  mill: `${CLINICAL_TEST_CDN}/videos/mill.mp4?${VIDEO_CACHE}`,
  speed: `${CLINICAL_TEST_CDN}/videos/speed.mp4?${VIDEO_CACHE}`,
  yergason: `${CLINICAL_TEST_CDN}/videos/yergason.mp4?${VIDEO_CACHE}`,
  schober: `${CLINICAL_TEST_CDN}/videos/schober.mp4?${VIDEO_CACHE}`,
  "slr-lasegue": `${CLINICAL_TEST_CDN}/videos/slr-lasegue.mp4?${VIDEO_CACHE}`,
  kemp: `${CLINICAL_TEST_CDN}/videos/kemp.mp4?${VIDEO_CACHE}`,
  "valgus-stress-mcl": `${CLINICAL_TEST_CDN}/videos/valgus-stress-mcl.mp4?${VIDEO_CACHE}`,
  "posterior-drawer-pcl": `${CLINICAL_TEST_CDN}/videos/posterior-drawer-pcl.mp4?${VIDEO_CACHE}`,
  "resisted-wrist-flexion": `${CLINICAL_TEST_CDN}/videos/resisted-wrist-flexion.mp4?${VIDEO_CACHE}`,
  "elbow-flexion-cubital": `${CLINICAL_TEST_CDN}/videos/elbow-flexion-cubital.mp4?${VIDEO_CACHE}`,
  "cervical-distraction": `${CLINICAL_TEST_CDN}/videos/cervical-distraction.mp4?${VIDEO_CACHE}`,
  "thumb-ucl-stress": `${CLINICAL_TEST_CDN}/videos/thumb-ucl-stress.mp4?${VIDEO_CACHE}`,
  finkelstein: `${CLINICAL_TEST_CDN}/videos/finkelstein.mp4?${VIDEO_CACHE}`,
  "snuffbox-palpation": `${CLINICAL_TEST_CDN}/videos/snuffbox-palpation.mp4?${VIDEO_CACHE}`,
  "tfcc-ulnar-load": `${CLINICAL_TEST_CDN}/videos/tfcc-ulnar-load.mp4?${VIDEO_CACHE}`,
  "cmc-grind": `${CLINICAL_TEST_CDN}/videos/cmc-grind.mp4?${VIDEO_CACHE}`,
  "crossed-slr": `${CLINICAL_TEST_CDN}/videos/crossed-slr.mp4?${VIDEO_CACHE}`,
} as const;

export type ClinicalTestVideoId = keyof typeof VIDEO_PATHS;

export function getClinicalTestVideoSrc(testId: string): string | null {
  if (testId in VIDEO_PATHS) {
    return VIDEO_PATHS[testId as ClinicalTestVideoId];
  }
  return null;
}
