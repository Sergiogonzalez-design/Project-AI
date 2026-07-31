import { supabase } from "./supabase";
import { SUPABASE_PROJECT_URL } from "./supabase-config";

export const CONSULT_PHOTOS_BUCKET = "consult-photos";
export const PHOTO_ONLY_CAPTION_ES = "(Foto de la lesión)";
export const PHOTO_ONLY_CAPTION_EN = "(Injury photo)";

export function photoOnlyCaption(locale: "es" | "en"): string {
  return locale === "en" ? PHOTO_ONLY_CAPTION_EN : PHOTO_ONLY_CAPTION_ES;
}

/** Upload a local image URI (camera or gallery) for consult vision. */
export async function uploadConsultPhotoFromUri(
  uri: string,
  mimeType = "image/jpeg"
): Promise<string> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Sesión expirada. Vuelve a iniciar sesión.");

  const ext = mimeType.includes("png")
    ? "png"
    : mimeType.includes("webp")
      ? "webp"
      : "jpg";
  const contentType =
    ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : "image/jpeg";
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
