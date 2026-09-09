import { supabase } from "./supabase";
import { SUPABASE_PROJECT_URL } from "./supabase-config";

const BUCKET = "clinic-logos";

function mimeFromUri(uri: string, kind: "logo" | "cover"): string {
  const lower = uri.toLowerCase();
  if (lower.includes(".png")) return "image/png";
  if (lower.includes(".webp")) return "image/webp";
  return "image/jpeg";
}

function extFromMime(mime: string): string {
  if (mime.includes("png")) return "png";
  if (mime.includes("webp")) return "webp";
  return "jpg";
}

/**
 * Upload clinic logo or cover from a local ImagePicker URI.
 * Uses ArrayBuffer (React Native-safe) — Blob uploads often fail silently on Expo.
 */
export async function uploadClinicBrandImage(
  clinicId: string,
  uri: string,
  kind: "logo" | "cover",
): Promise<string> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Sesión expirada. Vuelve a iniciar sesión.");

  const response = await fetch(uri);
  if (!response.ok) {
    throw new Error("No se pudo leer la imagen seleccionada.");
  }
  const arrayBuffer = await response.arrayBuffer();
  if (!arrayBuffer.byteLength) {
    throw new Error("La imagen está vacía. Prueba con otra foto.");
  }

  const contentType = mimeFromUri(uri, kind);
  const ext = extFromMime(contentType);
  const path = `${clinicId}/${kind}.${ext}`;
  // Public URL known as soon as the object path is chosen — show it without a second fetch.
  const publicUrl = `${SUPABASE_PROJECT_URL}/storage/v1/object/public/${BUCKET}/${path}?t=${Date.now()}`;

  const { error: uploadErr } = await supabase.storage
    .from(BUCKET)
    .upload(path, arrayBuffer, {
      contentType,
      upsert: true,
    });
  if (uploadErr) throw new Error(uploadErr.message);

  const payload =
    kind === "logo" ? { p_logo_url: publicUrl } : { p_cover_url: publicUrl };
  // Persist URL; don't block the caller on a full clinic reload.
  const { error: saveErr } = await supabase.rpc("clinic_update_own", payload);
  if (saveErr) throw new Error(saveErr.message);

  return publicUrl;
}
