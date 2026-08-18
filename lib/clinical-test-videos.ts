/**
 * Educational demo videos for clinical special tests.
 * Files live in /public/clinical-tests/videos/<id>.mp4
 * Keep ids in sync with clinical-test-images.ts
 */

const VIDEO_CACHE = "v=20260816logo";

/** Test ids that currently have a shipped demo video. */
export const CLINICAL_TEST_VIDEOS = {
  lachman: `/clinical-tests/videos/lachman.mp4?${VIDEO_CACHE}`,
  "anterior-drawer-knee": `/clinical-tests/videos/anterior-drawer-knee.mp4?${VIDEO_CACHE}`,
  "pivot-shift": `/clinical-tests/videos/pivot-shift.mp4?${VIDEO_CACHE}`,
  mcmurray: `/clinical-tests/videos/mcmurray.mp4?${VIDEO_CACHE}`,
  thessaly: `/clinical-tests/videos/thessaly.mp4?${VIDEO_CACHE}`,
  neer: `/clinical-tests/videos/neer.mp4?${VIDEO_CACHE}`,
  "hawkins-kennedy": `/clinical-tests/videos/hawkins-kennedy.mp4?${VIDEO_CACHE}`,
  "jobe-empty-can": `/clinical-tests/videos/jobe-empty-can.mp4?${VIDEO_CACHE}`,
  apprehension: `/clinical-tests/videos/apprehension.mp4?${VIDEO_CACHE}`,
  "drop-arm": `/clinical-tests/videos/drop-arm.mp4?${VIDEO_CACHE}`,
  "painful-arc": `/clinical-tests/videos/painful-arc.mp4?${VIDEO_CACHE}`,
  spurling: `/clinical-tests/videos/spurling.mp4?${VIDEO_CACHE}`,
  ultt: `/clinical-tests/videos/ultt.mp4?${VIDEO_CACHE}`,
  thompson: `/clinical-tests/videos/thompson.mp4?${VIDEO_CACHE}`,
  matles: `/clinical-tests/videos/matles.mp4?${VIDEO_CACHE}`,
  "anterior-drawer-ankle": `/clinical-tests/videos/anterior-drawer-ankle.mp4?${VIDEO_CACHE}`,
  windlass: `/clinical-tests/videos/windlass.mp4?${VIDEO_CACHE}`,
  "heel-raise": `/clinical-tests/videos/heel-raise.mp4?${VIDEO_CACHE}`,
  "hop-test": `/clinical-tests/videos/hop-test.mp4?${VIDEO_CACHE}`,
  faber: `/clinical-tests/videos/faber.mp4?${VIDEO_CACHE}`,
  fadir: `/clinical-tests/videos/fadir.mp4?${VIDEO_CACHE}`,
  trendelenburg: `/clinical-tests/videos/trendelenburg.mp4?${VIDEO_CACHE}`,
  phalen: `/clinical-tests/videos/phalen.mp4?${VIDEO_CACHE}`,
  tinel: `/clinical-tests/videos/tinel.mp4?${VIDEO_CACHE}`,
  cozen: `/clinical-tests/videos/cozen.mp4?${VIDEO_CACHE}`,
  mill: `/clinical-tests/videos/mill.mp4?${VIDEO_CACHE}`,
  speed: `/clinical-tests/videos/speed.mp4?${VIDEO_CACHE}`,
  yergason: `/clinical-tests/videos/yergason.mp4?${VIDEO_CACHE}`,
  schober: `/clinical-tests/videos/schober.mp4?${VIDEO_CACHE}`,
  "slr-lasegue": `/clinical-tests/videos/slr-lasegue.mp4?${VIDEO_CACHE}`,
  kemp: `/clinical-tests/videos/kemp.mp4?${VIDEO_CACHE}`,
  "valgus-stress-mcl": `/clinical-tests/videos/valgus-stress-mcl.mp4?${VIDEO_CACHE}`,
  "posterior-drawer-pcl": `/clinical-tests/videos/posterior-drawer-pcl.mp4?${VIDEO_CACHE}`,
  "resisted-wrist-flexion": `/clinical-tests/videos/resisted-wrist-flexion.mp4?${VIDEO_CACHE}`,
  "elbow-flexion-cubital": `/clinical-tests/videos/elbow-flexion-cubital.mp4?${VIDEO_CACHE}`,
  "cervical-distraction": `/clinical-tests/videos/cervical-distraction.mp4?${VIDEO_CACHE}`,
  "thumb-ucl-stress": `/clinical-tests/videos/thumb-ucl-stress.mp4?${VIDEO_CACHE}`,
  finkelstein: `/clinical-tests/videos/finkelstein.mp4?${VIDEO_CACHE}`,
  "snuffbox-palpation": `/clinical-tests/videos/snuffbox-palpation.mp4?${VIDEO_CACHE}`,
  "tfcc-ulnar-load": `/clinical-tests/videos/tfcc-ulnar-load.mp4?${VIDEO_CACHE}`,
  "cmc-grind": `/clinical-tests/videos/cmc-grind.mp4?${VIDEO_CACHE}`,
  "crossed-slr": `/clinical-tests/videos/crossed-slr.mp4?${VIDEO_CACHE}`,
} as const;

export type ClinicalTestVideoId = keyof typeof CLINICAL_TEST_VIDEOS;

export function getClinicalTestVideoSrc(testId: string): string | null {
  if (testId in CLINICAL_TEST_VIDEOS) {
    return CLINICAL_TEST_VIDEOS[testId as ClinicalTestVideoId];
  }
  return null;
}
