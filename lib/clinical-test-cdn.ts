/** Public CDN for clinical-test images and videos (Supabase Storage). */
export const CLINICAL_TEST_CDN =
  "https://klxlzzgrymkexvuelzex.supabase.co/storage/v1/object/public/clinical-tests";

export function clinicalTestAssetUrl(relativePath: string, cache = "v=20260819cdn"): string {
  const path = relativePath.replace(/^\//, "");
  return `${CLINICAL_TEST_CDN}/${path}?${cache}`;
}
