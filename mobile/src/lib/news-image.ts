import { SUPABASE_PROJECT_URL } from "./supabase-config";
import { supabase } from "./supabase";

export async function uploadNewsImageFromUri(
  uri: string,
  mimeType = "image/jpeg"
): Promise<string> {
  const ext = mimeType.includes("png")
    ? "png"
    : mimeType.includes("webp")
      ? "webp"
      : "jpg";
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const response = await fetch(uri);
  const arrayBuffer = await response.arrayBuffer();

  const { error } = await supabase.storage.from("news").upload(path, arrayBuffer, {
    contentType: mimeType,
    upsert: false,
  });
  if (error) throw new Error(error.message);

  return `${SUPABASE_PROJECT_URL}/storage/v1/object/public/news/${path}`;
}

export async function deleteNewsImageByUrl(imageUrl: string | null | undefined) {
  if (!imageUrl) return;
  const marker = "/storage/v1/object/public/news/";
  const idx = imageUrl.indexOf(marker);
  if (idx === -1) return;
  const path = imageUrl.slice(idx + marker.length).split("?")[0];
  if (!path) return;
  await supabase.storage.from("news").remove([path]);
}
