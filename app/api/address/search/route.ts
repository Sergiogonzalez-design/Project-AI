import { NextResponse } from "next/server";
import {
  formatAddressLabel,
  type AddressSuggestion,
} from "@/lib/address-search";
import { checkRateLimit, rateLimitKey } from "@/lib/rate-limit";

export const runtime = "nodejs";

const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";

type NominatimAddress = {
  road?: string;
  pedestrian?: string;
  house_number?: string;
  neighbourhood?: string;
  suburb?: string;
  city?: string;
  town?: string;
  village?: string;
  municipality?: string;
  county?: string;
  state?: string;
  postcode?: string;
  country?: string;
};

type NominatimResult = {
  place_id?: number | string;
  lat?: string;
  lon?: string;
  display_name?: string;
  address?: NominatimAddress;
};

function suggestionFromNominatim(row: NominatimResult): AddressSuggestion | null {
  const a = row.address ?? {};
  const street = [a.road || a.pedestrian, a.house_number]
    .filter(Boolean)
    .join(" ")
    .trim();
  const city = (
    a.city ||
    a.town ||
    a.village ||
    a.municipality ||
    a.suburb ||
    a.county ||
    ""
  ).trim();
  const postalCode = (a.postcode ?? "").trim();
  const country = (a.country ?? "").trim();
  const address =
    street ||
    (a.neighbourhood ?? "").trim() ||
    (row.display_name?.split(",")[0] ?? "").trim();

  if (!address && !city && !postalCode && !country) return null;

  const label =
    formatAddressLabel({ address, city, postalCode, country }) ||
    (row.display_name ?? "").trim();

  const lat = row.lat != null ? Number(row.lat) : null;
  const lng = row.lon != null ? Number(row.lon) : null;

  return {
    id: String(row.place_id ?? label),
    label,
    address,
    city,
    postalCode,
    country,
    lat: Number.isFinite(lat) ? lat : null,
    lng: Number.isFinite(lng) ? lng : null,
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") ?? "").trim();
  if (q.length < 2) {
    return NextResponse.json({ suggestions: [] as AddressSuggestion[] });
  }
  if (q.length > 120) {
    return NextResponse.json({ error: "Query too long" }, { status: 400 });
  }

  const key = rateLimitKey(request.headers, "address-search");
  const limit = checkRateLimit(key, 30, 60_000);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many requests" },
      {
        status: 429,
        headers: { "Retry-After": String(limit.retryAfterSec) },
      }
    );
  }

  const url = new URL(NOMINATIM_URL);
  url.searchParams.set("q", q);
  url.searchParams.set("format", "json");
  url.searchParams.set("addressdetails", "1");
  url.searchParams.set("limit", "7");
  url.searchParams.set("accept-language", "es");

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8_000);
    const res = await fetch(url.toString(), {
      headers: {
        Accept: "application/json",
        "User-Agent": "AIKinora/1.0 (address autocomplete; https://aikinora.app)",
      },
      signal: controller.signal,
      cache: "no-store",
    });
    clearTimeout(timer);

    if (!res.ok) {
      return NextResponse.json(
        { error: "Address search failed" },
        { status: 502 }
      );
    }
    const json = (await res.json()) as NominatimResult[];
    const seen = new Set<string>();
    const suggestions: AddressSuggestion[] = [];
    for (const row of Array.isArray(json) ? json : []) {
      const parsed = suggestionFromNominatim(row);
      if (!parsed || seen.has(parsed.label)) continue;
      seen.add(parsed.label);
      suggestions.push(parsed);
    }
    return NextResponse.json({ suggestions });
  } catch {
    return NextResponse.json(
      { error: "Address search unavailable" },
      { status: 502 }
    );
  }
}
