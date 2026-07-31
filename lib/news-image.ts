import { getSupabaseUrl } from "@/lib/supabase/env";
import type { SupabaseClient } from "@supabase/supabase-js";

export async function uploadNewsImage(
  supabase: SupabaseClient,
  file: File
): Promise<string> {
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const path = `${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("news").upload(path, file, {
    upsert: false,
    contentType: file.type || "image/jpeg",
  });
  if (error) throw new Error(error.message);
  return `${getSupabaseUrl()}/storage/v1/object/public/news/${path}`;
}

export async function deleteNewsImageByUrl(
  supabase: SupabaseClient,
  imageUrl: string | null | undefined
) {
  if (!imageUrl) return;
  const marker = "/storage/v1/object/public/news/";
  const idx = imageUrl.indexOf(marker);
  if (idx === -1) return;
  const path = imageUrl.slice(idx + marker.length).split("?")[0];
  if (!path) return;
  await supabase.storage.from("news").remove([path]);
}
