export function clinicMapsQuery(opts: {
  address?: string | null;
  city?: string | null;
  lat?: number | null;
  lng?: number | null;
}): string | null {
  if (
    typeof opts.lat === "number" &&
    typeof opts.lng === "number" &&
    Number.isFinite(opts.lat) &&
    Number.isFinite(opts.lng)
  ) {
    return `${opts.lat},${opts.lng}`;
  }
  const parts = [opts.address, opts.city].map((p) => p?.trim()).filter(Boolean);
  if (!parts.length) return null;
  return parts.join(", ");
}

export function googleMapsSearchUrl(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export function googleMapsEmbedUrl(query: string): string {
  return `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
}
