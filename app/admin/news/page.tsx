"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { deleteNewsImageByUrl, uploadNewsImage } from "@/lib/news-image";
import { createClient } from "@/lib/supabase/client";

type NewsPost = {
  id: string;
  title: string;
  body: string;
  published_at: string;
  image_url: string | null;
};

export default function AdminNewsPage() {
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const supabase = createClient();
    setLoading(true);
    setError(null);
    const { data, error: fetchError } = await supabase
      .from("news")
      .select("id, title, body, published_at, image_url")
      .order("published_at", { ascending: false });
    if (fetchError) {
      setError(fetchError.message);
      setPosts([]);
    } else {
      setPosts((data as NewsPost[]) ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  function onPickImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Selecciona un archivo de imagen.");
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const t = title.trim();
    const b = body.trim();
    if (!t || !b) {
      setError("Título y contenido son obligatorios.");
      return;
    }

    const supabase = createClient();
    setBusy(true);
    setError(null);

    let imageUrl: string | null = null;
    try {
      if (imageFile) {
        imageUrl = await uploadNewsImage(supabase, imageFile);
      }
      const { error: insertError } = await supabase.from("news").insert({
        title: t,
        body: b,
        image_url: imageUrl,
      });
      if (insertError) {
        if (imageUrl) await deleteNewsImageByUrl(supabase, imageUrl);
        throw new Error(insertError.message);
      }
      setTitle("");
      setBody("");
      setImageFile(null);
      setImagePreview(null);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(post: NewsPost) {
    const ok = window.confirm(`¿Borrar la noticia «${post.title}»?`);
    if (!ok) return;

    const supabase = createClient();
    setBusy(true);
    setError(null);
    const { error: deleteError } = await supabase
      .from("news")
      .delete()
      .eq("id", post.id);
    if (deleteError) {
      setError(deleteError.message);
    } else {
      await deleteNewsImageByUrl(supabase, post.image_url);
      setPosts((prev) => prev.filter((p) => p.id !== post.id));
    }
    setBusy(false);
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
        Noticias
      </h1>
      <p className="mt-2 text-sm text-neutral-600">
        Las noticias publicadas aparecen en Sobre Nosotros (web y app).
      </p>

      <form
        onSubmit={handleCreate}
        className="mt-8 rounded-2xl border border-neutral-200 bg-white p-6"
      >
        <h2 className="text-lg font-semibold text-neutral-900">
          Nueva noticia
        </h2>
        <label className="mt-4 block text-sm font-medium text-neutral-700">
          Título
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ej: Nueva guía de hombro disponible"
          className="mt-1 w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-200"
          disabled={busy}
        />
        <label className="mt-4 block text-sm font-medium text-neutral-700">
          Contenido
        </label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={5}
          placeholder="Escribe el anuncio o artículo breve…"
          className="mt-1 w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-200"
          disabled={busy}
        />

        <label className="mt-4 block text-sm font-medium text-neutral-700">
          Imagen (opcional)
        </label>
        <div className="mt-2 flex flex-wrap items-center gap-4">
          <label className="cursor-pointer rounded-xl border border-dashed border-neutral-300 bg-neutral-50 px-4 py-3 text-sm font-medium text-neutral-700 hover:border-neutral-400">
            Subir imagen
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="sr-only"
              onChange={onPickImage}
              disabled={busy}
            />
          </label>
          {imagePreview ? (
            <div className="relative h-16 w-16 overflow-hidden rounded-full border border-neutral-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imagePreview}
                alt="Vista previa"
                className="h-full w-full object-cover"
              />
            </div>
          ) : null}
          {imageFile ? (
            <button
              type="button"
              onClick={() => {
                setImageFile(null);
                setImagePreview(null);
              }}
              className="text-sm font-medium text-red-600 hover:text-red-700"
              disabled={busy}
            >
              Quitar
            </button>
          ) : null}
        </div>

        <button
          type="submit"
          disabled={busy || !title.trim() || !body.trim()}
          className="mt-4 w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {busy ? "Guardando…" : "Publicar noticia"}
        </button>
      </form>

      {error && (
        <div className="mt-6 rounded-xl bg-red-50 px-5 py-4 text-sm text-red-800">
          {error}
        </div>
      )}

      <section className="mt-8">
        <h2 className="mb-3 text-sm font-semibold text-neutral-700">
          {loading
            ? "Cargando…"
            : `${posts.length} noticia${posts.length === 1 ? "" : "s"}`}
        </h2>
        {posts.length === 0 && !loading ? (
          <p className="rounded-2xl border border-dashed border-neutral-300 bg-white px-5 py-8 text-center text-sm text-neutral-500">
            Todavía no hay noticias publicadas.
          </p>
        ) : (
          <ul className="space-y-3">
            {posts.map((post) => (
              <li
                key={post.id}
                className="rounded-2xl border border-neutral-200 bg-white p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex min-w-0 gap-3">
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-neutral-100">
                      {post.image_url ? (
                        <Image
                          src={post.image_url}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="48px"
                          unoptimized
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-neutral-400">
                          —
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-neutral-400">
                        {new Date(post.published_at).toLocaleDateString("es-ES", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                      <h3 className="mt-1 text-base font-semibold text-neutral-900">
                        {post.title}
                      </h3>
                      <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-neutral-600">
                        {post.body}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => void handleDelete(post)}
                    disabled={busy}
                    className="shrink-0 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-50"
                  >
                    Borrar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
