/** Product display names (user-facing). */
export type BrandLocale = "es" | "en";

export const BRAND_ES = "Kinora";
export const BRAND_EN = "Kinora";

/** Default for Spanish-first surfaces. */
export const BRAND = BRAND_ES;

export function brandName(locale: BrandLocale = "es"): string {
  return locale === "en" ? BRAND_EN : BRAND_ES;
}
