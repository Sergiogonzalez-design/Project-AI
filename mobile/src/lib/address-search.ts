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
