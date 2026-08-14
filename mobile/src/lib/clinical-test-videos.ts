/**
 * Educational demo videos for clinical special tests.
 * Keep in sync with lib/clinical-test-videos.ts (web).
 */

import { getWebMediaBaseUrl } from "./web-media-url";

const VIDEO_PATHS = {
  lachman: "/clinical-tests/videos/lachman.mp4",
  "anterior-drawer-knee": "/clinical-tests/videos/anterior-drawer-knee.mp4",
  "pivot-shift": "/clinical-tests/videos/pivot-shift.mp4",
  mcmurray: "/clinical-tests/videos/mcmurray.mp4",
  thessaly: "/clinical-tests/videos/thessaly.mp4",
  neer: "/clinical-tests/videos/neer.mp4",
  "hawkins-kennedy": "/clinical-tests/videos/hawkins-kennedy.mp4",
  "jobe-empty-can": "/clinical-tests/videos/jobe-empty-can.mp4",
  apprehension: "/clinical-tests/videos/apprehension.mp4",
  "drop-arm": "/clinical-tests/videos/drop-arm.mp4",
  "painful-arc": "/clinical-tests/videos/painful-arc.mp4",
  spurling: "/clinical-tests/videos/spurling.mp4",
  ultt: "/clinical-tests/videos/ultt.mp4",
  thompson: "/clinical-tests/videos/thompson.mp4",
  matles: "/clinical-tests/videos/matles.mp4",
  "anterior-drawer-ankle": "/clinical-tests/videos/anterior-drawer-ankle.mp4",
  windlass: "/clinical-tests/videos/windlass.mp4",
  "heel-raise": "/clinical-tests/videos/heel-raise.mp4",
  "hop-test": "/clinical-tests/videos/hop-test.mp4",
  faber: "/clinical-tests/videos/faber.mp4",
  fadir: "/clinical-tests/videos/fadir.mp4",
  trendelenburg: "/clinical-tests/videos/trendelenburg.mp4",
  phalen: "/clinical-tests/videos/phalen.mp4",
  tinel: "/clinical-tests/videos/tinel.mp4",
  cozen: "/clinical-tests/videos/cozen.mp4",
  mill: "/clinical-tests/videos/mill.mp4",
  speed: "/clinical-tests/videos/speed.mp4",
  yergason: "/clinical-tests/videos/yergason.mp4",
  schober: "/clinical-tests/videos/schober.mp4",
  "slr-lasegue": "/clinical-tests/videos/slr-lasegue.mp4",
  kemp: "/clinical-tests/videos/kemp.mp4",
} as const;

export type ClinicalTestVideoId = keyof typeof VIDEO_PATHS;

export function getClinicalTestVideoSrc(testId: string): string | null {
  if (testId in VIDEO_PATHS) {
    return `${getWebMediaBaseUrl()}${VIDEO_PATHS[testId as ClinicalTestVideoId]}`;
  }
  return null;
}
