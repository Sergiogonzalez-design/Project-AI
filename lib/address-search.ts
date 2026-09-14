/** Shared place-search types + formatting for Maps-style address autocomplete. */

export type AddressSuggestion = {
  id: string;
  label: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  lat: number | null;
  lng: number | null;
};

export type AddressValue = {
  query: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
};

export function emptyAddressValue(): AddressValue {
  return {
    query: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
  };
}

export function formatAddressLabel(parts: {
  address?: string | null;
  city?: string | null;
  postalCode?: string | null;
  country?: string | null;
}): string {
  const line1 = [parts.address?.trim()].filter(Boolean).join(" ");
  const line2 = [parts.postalCode?.trim(), parts.city?.trim()]
    .filter(Boolean)
    .join(" ");
  const line3 = parts.country?.trim() || "";
  return [line1, line2, line3].filter(Boolean).join(", ");
}

export function addressValueFromSuggestion(
  suggestion: AddressSuggestion
): AddressValue {
  return {
    query: suggestion.label,
    address: suggestion.address,
    city: suggestion.city,
    postalCode: suggestion.postalCode,
    country: suggestion.country,
  };
}

type PhotonProps = {
  osm_id?: number | string;
  osm_type?: string;
  name?: string;
  street?: string;
  housenumber?: string;
  postcode?: string;
  city?: string;
  town?: string;
  village?: string;
  municipality?: string;
  county?: string;
  district?: string;
  locality?: string;
  state?: string;
  country?: string;
  countrycode?: string;
};

function streetLine(p: PhotonProps): string {
  const street = [p.street, p.housenumber].filter(Boolean).join(" ").trim();
  if (street) return street;
  return (p.name ?? "").trim();
}

function cityFromProps(p: PhotonProps): string {
  return (
    p.city ||
    p.town ||
    p.village ||
    p.municipality ||
    p.locality ||
    p.district ||
    p.county ||
    ""
  ).trim();
}

export function parsePhotonFeature(raw: unknown): AddressSuggestion | null {
  if (!raw || typeof raw !== "object") return null;
  const feature = raw as {
    geometry?: { coordinates?: unknown };
    properties?: PhotonProps;
  };
  const p = feature.properties;
  if (!p) return null;

  const address = streetLine(p);
  const city = cityFromProps(p);
  const postalCode = (p.postcode ?? "").trim();
  const country = (p.country ?? "").trim();
  if (!address && !city && !postalCode && !country) return null;

  const coords = feature.geometry?.coordinates;
  const lng =
    Array.isArray(coords) && typeof coords[0] === "number" ? coords[0] : null;
  const lat =
    Array.isArray(coords) && typeof coords[1] === "number" ? coords[1] : null;

  const label = formatAddressLabel({ address, city, postalCode, country });
  const id = `${p.osm_type ?? "p"}-${p.osm_id ?? label}`;

  return {
    id,
    label: label || address || city,
    address,
    city,
    postalCode,
    country,
    lat,
    lng,
  };
}

export function parsePhotonResponse(json: unknown): AddressSuggestion[] {
  const features =
    json &&
    typeof json === "object" &&
    Array.isArray((json as { features?: unknown }).features)
      ? ((json as { features: unknown[] }).features ?? [])
      : [];
  const out: AddressSuggestion[] = [];
  const seen = new Set<string>();
  for (const f of features) {
    const parsed = parsePhotonFeature(f);
    if (!parsed) continue;
    if (seen.has(parsed.label)) continue;
    seen.add(parsed.label);
    out.push(parsed);
  }
  return out;
}
