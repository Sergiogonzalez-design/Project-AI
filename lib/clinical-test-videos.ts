/**
 * Educational demo videos for clinical special tests.
 * Files live in /public/clinical-tests/videos/<id>.mp4
 * Keep ids in sync with clinical-test-images.ts
 */

/** Test ids that currently have a shipped demo video. */
export const CLINICAL_TEST_VIDEOS = {
  lachman: "/clinical-tests/videos/lachman.mp4",
} as const;

export type ClinicalTestVideoId = keyof typeof CLINICAL_TEST_VIDEOS;

export function getClinicalTestVideoSrc(testId: string): string | null {
  if (testId in CLINICAL_TEST_VIDEOS) {
    return CLINICAL_TEST_VIDEOS[testId as ClinicalTestVideoId];
  }
  return null;
}
