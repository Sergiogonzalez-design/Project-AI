import { createClient } from "@/lib/supabase/client";

export const CONSULT_PHOTOS_BUCKET = "consult-photos";
export const PHOTO_ONLY_CAPTION = "(Foto de la lesión)";
export const MAX_CONSULT_ATTACHMENT_BYTES = 10 * 1024 * 1024;

export function isConsultImageFile(file: File): boolean {
  return file.type.startsWith("image/") || /\.(jpe?g|png|webp)$/i.test(file.name);
}

export function isConsultPdfFile(file: File): boolean {
  return file.type === "application/pdf" || /\.pdf$/i.test(file.name);
}

export function isConsultPdfUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  return /\.pdf(?:\?|#|$)/i.test(url);
}

/** Extract `{userId}/file.ext` from a storage path or legacy public/signed URL. */
export function parseConsultPhotoStoragePath(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  if (!trimmed.includes("://")) return trimmed.replace(/^\/+/, "");
  try {
    const u = new URL(trimmed);
    const m = u.pathname.match(
      /\/storage\/v1\/object\/(?:public|sign|authenticated)\/consult-photos\/(.+)$/
    );
    return m ? decodeURIComponent(m[1]) : null;
  } catch {
    return null;
  }
}

/** Signed URL for display, download, or vision (private consult-photos bucket). */
export async function consultPhotoAccessUrl(
  stored: string | null | undefined
): Promise<string | null> {
  if (!stored) return null;
  if (stored.includes("/object/sign/") && stored.includes("token=")) {
    return stored;
  }
  const path = parseConsultPhotoStoragePath(stored);
  if (!path) return null;
  const supabase = createClient();
  const { data, error } = await supabase.storage
    .from(CONSULT_PHOTOS_BUCKET)
    .createSignedUrl(path, 3600);
  if (error || !data?.signedUrl) return null;
  return data.signedUrl;
}

/** Sign image_url fields when loading message history (paths → signed URLs). */
export async function signConsultMessageAttachments<
  T extends { image_url?: string | null },
>(messages: T[]): Promise<T[]> {
  return Promise.all(
    messages.map(async (m) => {
      if (!m.image_url) return m;
      const signed = await consultPhotoAccessUrl(m.image_url);
      return signed ? { ...m, image_url: signed } : m;
    })
  );
}

/** Signed URL for OpenAI vision; null for PDFs and non-images. */
export async function consultPhotoVisionUrl(
  stored: string | null | undefined
): Promise<string | null> {
  if (!stored || isConsultPdfUrl(stored)) return null;
  return consultPhotoAccessUrl(stored);
}

export function consultAttachmentCaption(file: File): string {
  if (isConsultImageFile(file)) return PHOTO_ONLY_CAPTION;
  return `(Adjunto: ${file.name})`;
}

export function consultAttachmentHistoryNote(url: string | null | undefined): string {
  if (!url) return "";
  if (isConsultPdfUrl(url)) return "[El paciente adjuntó un PDF]";
  return "[El paciente adjuntó una foto de la lesión]";
}

const MAX_EDGE = 1280;
const JPEG_QUALITY = 0.82;

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

/** Returns storage path `{userId}/…` (persist in messages.image_url). */
export async function uploadConsultPhoto(file: File): Promise<string> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Sesión expirada. Vuelve a iniciar sesión.");

  const isPdf = isConsultPdfFile(file);
  const body = isPdf ? file : await compressConsultPhoto(file);
  const ext = isPdf ? "pdf" : "jpg";
  const contentType = isPdf ? "application/pdf" : "image/jpeg";
  const path = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage
    .from(CONSULT_PHOTOS_BUCKET)
    .upload(path, body, {
      contentType,
      upsert: false,
    });
  if (error) throw new Error(error.message);

  return path;
}

export function isConsultPhotoUrl(url: string | null | undefined): boolean {
  return parseConsultPhotoStoragePath(url ?? "") != null;
}
