/** Product display names (user-facing). */
export type BrandLocale = "es" | "en";

export const BRAND_ES = "AIKinora";
export const BRAND_EN = "AIKinora";

/** Default for Spanish-first surfaces. */
export const BRAND = BRAND_ES;

export function brandName(locale: BrandLocale = "es"): string {
  return locale === "en" ? BRAND_EN : BRAND_ES;
}
