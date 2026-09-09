export type ClinicSearchCard = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logo_url: string | null;
  city: string | null;
  phone: string | null;
  contact_email: string | null;
  cover_url?: string | null;
  tagline?: string | null;
  accent_color?: string | null;
  specialties?: string[] | null;
};

export type ClinicPublicProfile = ClinicSearchCard & {
  website: string | null;
  address: string | null;
  postal_code: string | null;
  country: string | null;
  lat: number | null;
  lng: number | null;
  google_maps_url: string | null;
  is_listed: boolean;
  hours?: string | null;
  whatsapp?: string | null;
  instagram?: string | null;
  tiktok?: string | null;
  booking_url?: string | null;
};

export type ClinicPost = {
  id: string;
  body: string;
  image_url: string | null;
  created_at: string;
};

export type ClinicFeedPost = {
  post_id: string;
  clinic_id: string;
  clinic_name: string;
  clinic_slug: string;
  clinic_logo_url: string | null;
  clinic_city: string | null;
  body: string;
  image_url: string | null;
  created_at: string;
  from_saved: boolean;
};

export function clinicWebsiteHref(website: string): string {
  return website.startsWith("http") ? website : `https://${website}`;
}

export function clinicMailtoHref(email: string): string {
  return `mailto:${email.trim()}`;
}

export function clinicTelHref(phone: string): string {
  return `tel:${phone.replace(/\s+/g, "")}`;
}

/** WhatsApp chat URL from a dedicated field or a mobile phone number. */
export function clinicWhatsAppHref(
  whatsapp: string | null | undefined,
  phone?: string | null
): string | null {
  const raw = (whatsapp || phone || "").trim();
  if (!raw) return null;
  if (/^https?:\/\//i.test(raw) || raw.toLowerCase().startsWith("wa.me/")) {
    return raw.startsWith("http") ? raw : `https://${raw.replace(/^\/+/, "")}`;
  }
  let digits = raw.replace(/\D/g, "");
  if (digits.length < 8) return null;
  if (digits.length === 9 && /^[67]/.test(digits)) digits = `34${digits}`;
  return `https://wa.me/${digits}`;
}

export function clinicInstagramHref(handle: string): string {
  const t = handle.trim().replace(/^@/, "");
  if (/^https?:\/\//i.test(t)) return t;
  return `https://instagram.com/${t}`;
}

export function clinicTikTokHref(handle: string): string {
  const t = handle.trim().replace(/^@/, "");
  if (/^https?:\/\//i.test(t)) return t;
  return `https://www.tiktok.com/@${t}`;
}

export function formatClinicPostDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
