import { createClient } from "@/lib/supabase/client";
import { getSupabaseUrl } from "@/lib/supabase/env";

export const CONSULT_PHOTOS_BUCKET = "consult-photos";
export const PHOTO_ONLY_CAPTION = "(Foto de la lesión)";

const MAX_EDGE = 1280;
const JPEG_QUALITY = 0.82;

/** Compress injury photos for upload + vision (keeps more detail than avatars). */
export function compressConsultPhoto(file: File): Promise<File> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      let { width, height } = img;
      if (width > MAX_EDGE || height > MAX_EDGE) {
        if (width > height) {
          height = Math.round((height * MAX_EDGE) / width);
          width = MAX_EDGE;
        } else {
          width = Math.round((width * MAX_EDGE) / height);
          height = MAX_EDGE;
        }
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      canvas.getContext("2d")!.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) =>
          resolve(
            blob
              ? new File([blob], "injury.jpg", { type: "image/jpeg" })
              : file
          ),
        "image/jpeg",
        JPEG_QUALITY
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(file);
    };
    img.src = url;
  });
}

export async function uploadConsultPhoto(file: File): Promise<string> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Sesión expirada. Vuelve a iniciar sesión.");

  const compressed = await compressConsultPhoto(file);
  const path = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`;

  const { error } = await supabase.storage
    .from(CONSULT_PHOTOS_BUCKET)
    .upload(path, compressed, {
      contentType: "image/jpeg",
      upsert: false,
    });
  if (error) throw new Error(error.message);

  return `${getSupabaseUrl()}/storage/v1/object/public/${CONSULT_PHOTOS_BUCKET}/${path}`;
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
