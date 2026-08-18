import { supabase } from "./supabase";
import { SUPABASE_PROJECT_URL } from "./supabase-config";

export const CONSULT_PHOTOS_BUCKET = "consult-photos";
export const MAX_CONSULT_ATTACHMENT_BYTES = 10 * 1024 * 1024;
export const PHOTO_ONLY_CAPTION_ES = "(Foto de la lesión)";
export const PHOTO_ONLY_CAPTION_EN = "(Injury photo)";

export function photoOnlyCaption(locale: "es" | "en"): string {
  return locale === "en" ? PHOTO_ONLY_CAPTION_EN : PHOTO_ONLY_CAPTION_ES;
}

export function isConsultImageMime(mimeType: string | null | undefined): boolean {
  return (mimeType ?? "").toLowerCase().startsWith("image/");
}

export function isConsultPdfUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  return /\.pdf(?:\?|#|$)/i.test(url);
}

/** Vision models only accept images — skip PDFs/files. */
export function consultVisionUrl(url: string | null | undefined): string | null {
  if (!url || isConsultPdfUrl(url)) return null;
  return url;
}

export function consultAttachmentCaption(
  locale: "es" | "en",
  mimeType: string | null | undefined,
  fileName?: string | null
): string {
  if (isConsultImageMime(mimeType)) return photoOnlyCaption(locale);
  const name = fileName?.trim() || "PDF";
  return locale === "en" ? `(Attachment: ${name})` : `(Adjunto: ${name})`;
}

export function consultAttachmentHistoryNote(
  url: string | null | undefined,
  locale: "es" | "en" = "es"
): string {
  if (!url) return "";
  if (isConsultPdfUrl(url)) {
    return locale === "en"
      ? "[The patient attached a PDF]"
      : "[El paciente adjuntó un PDF]";
  }
  return locale === "en"
    ? "[The patient attached an injury photo]"
    : "[El paciente adjuntó una foto de la lesión]";
}

function consultAttachmentMeta(mimeType: string): {
  ext: string;
  contentType: string;
} {
  const mime = mimeType.toLowerCase();
  if (mime.includes("pdf")) return { ext: "pdf", contentType: "application/pdf" };
  if (mime.includes("png")) return { ext: "png", contentType: "image/png" };
  if (mime.includes("webp")) return { ext: "webp", contentType: "image/webp" };
  return { ext: "jpg", contentType: "image/jpeg" };
}

/** Upload a local image or PDF URI for consult chat. */
export async function uploadConsultPhotoFromUri(
  uri: string,
  mimeType = "image/jpeg"
): Promise<string> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Sesión expirada. Vuelve a iniciar sesión.");

  const { ext, contentType } = consultAttachmentMeta(mimeType);
  const path = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const response = await fetch(uri);
  const arrayBuffer = await response.arrayBuffer();

  const { error } = await supabase.storage
    .from(CONSULT_PHOTOS_BUCKET)
    .upload(path, arrayBuffer, {
      contentType,
      upsert: false,
    });
  if (error) throw new Error(error.message);

  return `${SUPABASE_PROJECT_URL}/storage/v1/object/public/${CONSULT_PHOTOS_BUCKET}/${path}`;
}

export function isConsultPhotoUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  try {
    const u = new URL(url);
    return u.pathname.includes(`/storage/v1/object/public/${CONSULT_PHOTOS_BUCKET}/`);
  } catch {
    return false;
  }
}
