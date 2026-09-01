import { supabase } from "./supabase";
import { SUPABASE_PROJECT_URL } from "./supabase-config";

export const AVATARS_BUCKET = "avatars";

/** Upload a local image as the user's public avatar and persist `profiles.avatar_url`. */
export async function uploadAvatarFromUri(uri: string): Promise<string> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Sesión expirada. Vuelve a iniciar sesión.");

  const path = `${user.id}/avatar.jpg`;
  const response = await fetch(uri);
  const arrayBuffer = await response.arrayBuffer();

  const { error: uploadErr } = await supabase.storage
    .from(AVATARS_BUCKET)
    .upload(path, arrayBuffer, {
      contentType: "image/jpeg",
      upsert: true,
    });
  if (uploadErr) throw new Error(uploadErr.message);

  const publicUrl = `${SUPABASE_PROJECT_URL}/storage/v1/object/public/${AVATARS_BUCKET}/${path}?t=${Date.now()}`;

  const { error: profileErr } = await supabase
    .from("profiles")
    .upsert({
      id: user.id,
      avatar_url: publicUrl,
      updated_at: new Date().toISOString(),
    });
  if (profileErr) throw new Error(profileErr.message);

  return publicUrl;
}
