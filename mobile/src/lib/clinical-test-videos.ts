/**
 * Educational demo videos for clinical special tests.
 * Keep in sync with lib/clinical-test-videos.ts (web).
 */

import { WEB_APP_URL } from "./admin-api";

const VIDEO_PATHS = {
  lachman: "/clinical-tests/videos/lachman.mp4",
} as const;

export type ClinicalTestVideoId = keyof typeof VIDEO_PATHS;

export function getClinicalTestVideoSrc(testId: string): string | null {
  if (testId in VIDEO_PATHS) {
    return `${WEB_APP_URL}${VIDEO_PATHS[testId as ClinicalTestVideoId]}`;
  }
  return null;
}
