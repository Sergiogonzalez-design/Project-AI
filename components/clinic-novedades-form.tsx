"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { formatClinicPostDate, type ClinicPost } from "@/lib/clinic-directory";
import { createClient } from "@/lib/supabase/client";

type Props = {
  clinicId: string;
};

export function ClinicNovedadesForm({ clinicId }: Props) {
  const supabase = createClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const [body, setBody] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [posts, setPosts] = useState<ClinicPost[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [posting, setPosting] = useState(false);

  const load = useCallback(async () => {
    const { data, error: err } = await supabase.rpc("clinic_list_own_posts");
    if (err) setError(err.message);
    else setPosts((data as ClinicPost[]) ?? []);
  }, [supabase]);

  useEffect(() => {
    void load();
  }, [load]);

  async function publish() {
    const text = body.trim();
    if (!text) {
      setError("Escribe una novedad (máx. 500 caracteres).");
      return;
    }
    setPosting(true);
    setError(null);
    try {
      let imageUrl: string | null = null;
      if (imageFile) {
        const ext =
          imageFile.type === "image/png"
            ? "png"
            : imageFile.type === "image/webp"
              ? "webp"
              : "jpg";
        const path = `${clinicId}/${Date.now()}.${ext}`;
        const { error: upErr } = await supabase.storage
          .from("clinic-posts")
          .upload(path, imageFile, { upsert: false, contentType: imageFile.type });
        if (upErr) throw new Error(upErr.message);
        const { data } = supabase.storage.from("clinic-posts").getPublicUrl(path);
        imageUrl = data.publicUrl;
      }
      const { error: postErr } = await supabase.rpc("clinic_create_post", {
        p_body: text,
        p_image_url: imageUrl,
      });
      if (postErr) throw new Error(postErr.message);
      setBody("");
      setImageFile(null);
      if (fileRef.current) fileRef.current.value = "";
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo publicar.");
    } finally {
      setPosting(false);
    }
  }

  async function remove(id: string) {
    const { error: err } = await supabase.rpc("clinic_delete_post", { p_id: id });
    if (err) setError(err.message);
    else setPosts((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
      <h2 className="text-sm font-bold text-neutral-900">Novedades</h2>
      <p className="mt-1 text-xs text-neutral-500">
        Publica avisos cortos (máx. 500) visibles en Buscar y en tu ficha pública.
      </p>
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value.slice(0, 500))}
        rows={3}
        placeholder="Horarios, vacantes, nuevas especialidades…"
        className="mt-3 w-full rounded-xl border border-neutral-200 px-3.5 py-2.5 text-sm"
      />
      <p className="mt-1 text-right text-xs text-neutral-400">{body.length}/500</p>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="text-xs"
          onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
        />
        <button
          type="button"
          onClick={() => void publish()}
          disabled={posting}
          className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {posting ? "Publicando…" : "Publicar"}
        </button>
      </div>
      {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
      <ul className="mt-4 space-y-3">
        {posts.map((post) => (
          <li key={post.id} className="rounded-xl border border-neutral-100 bg-neutral-50 p-3">
            <div className="flex items-start justify-between gap-2">
              <p className="text-xs text-neutral-400">
                {formatClinicPostDate(post.created_at)}
              </p>
              <button
                type="button"
                onClick={() => void remove(post.id)}
                className="text-xs font-semibold text-red-600 hover:underline"
              >
                Eliminar
              </button>
            </div>
            <p className="mt-1 whitespace-pre-wrap text-sm text-neutral-800">{post.body}</p>
            {post.image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={post.image_url} alt="" className="mt-2 max-h-40 rounded-lg object-cover" />
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
