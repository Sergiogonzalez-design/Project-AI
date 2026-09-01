"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ClinicDirectoryCard } from "@/components/clinic-directory-card";
import { formatClinicPostDate, type ClinicFeedPost, type ClinicSearchCard } from "@/lib/clinic-directory";
import { createClient } from "@/lib/supabase/client";

type Tab = "explorar" | "guardadas" | "novedades";

export function ClinicBuscarClient() {
  const supabase = createClient();
  const [tab, setTab] = useState<Tab>("explorar");
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("");
  const [results, setResults] = useState<ClinicSearchCard[]>([]);
  const [favorites, setFavorites] = useState<ClinicSearchCard[]>([]);
  const [feed, setFeed] = useState<ClinicFeedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadExplore = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: err } = await supabase.rpc("clinic_search", {
      p_query: query.trim(),
      p_city: city.trim(),
    });
    if (err) setError(err.message);
    else setResults((data as ClinicSearchCard[]) ?? []);
    setLoading(false);
  }, [city, query, supabase]);

  const loadFavorites = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: err } = await supabase.rpc("clinic_list_favorites");
    if (err) setError(err.message);
    else setFavorites((data as ClinicSearchCard[]) ?? []);
    setLoading(false);
  }, [supabase]);

  const loadFeed = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: err } = await supabase.rpc("clinic_feed_posts");
    if (err) setError(err.message);
    else setFeed((data as ClinicFeedPost[]) ?? []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    if (tab === "explorar") void loadExplore();
    else if (tab === "guardadas") void loadFavorites();
    else void loadFeed();
  }, [tab, loadExplore, loadFavorites, loadFeed]);

  return (
    <div className="min-h-full bg-[#f3f4f6]">
      <div className="border-b border-white/60 bg-gradient-to-br from-slate-950 via-blue-950 to-blue-700 text-white">
        <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-200">
            Directorio
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Encuentra tu clínica
          </h1>
          <p className="mt-2 max-w-xl text-sm text-blue-100/90">
            Perfiles, novedades y contacto directo. Como un canal, pensado para
            fisioterapia.
          </p>
          {tab === "explorar" ? (
            <form
              className="mt-6 flex flex-col gap-2 sm:flex-row"
              onSubmit={(e) => {
                e.preventDefault();
                void loadExplore();
              }}
            >
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Nombre, especialidad…"
                className="h-12 flex-1 rounded-2xl border-0 bg-white/95 px-4 text-sm text-slate-900 shadow-lg outline-none ring-2 ring-white/20 placeholder:text-slate-400"
              />
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Ciudad"
                className="h-12 w-full rounded-2xl border-0 bg-white/95 px-4 text-sm text-slate-900 shadow-lg outline-none sm:w-40"
              />
              <button
                type="submit"
                className="h-12 rounded-2xl bg-white px-6 text-sm font-bold text-slate-950 shadow-lg hover:bg-blue-50"
              >
                Buscar
              </button>
            </form>
          ) : null}
        </div>
      </div>

      <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6">
        <div className="mb-6 flex gap-1 rounded-2xl bg-white p-1 shadow-sm">
          {(
            [
              ["explorar", "Explorar"],
              ["guardadas", "Guardadas"],
              ["novedades", "Novedades"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`flex-1 rounded-xl py-2 text-sm font-semibold transition ${
                tab === id
                  ? "bg-slate-950 text-white"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        {loading ? (
          <p className="text-sm text-slate-500">Cargando…</p>
        ) : tab === "novedades" ? (
          feed.length === 0 ? (
            <p className="text-sm text-slate-500">
              Aún no hay novedades. Guarda clínicas para ver primero las suyas.
            </p>
          ) : (
            <ul className="mx-auto max-w-2xl space-y-3">
              {feed.map((post) => (
                <li key={post.post_id}>
                  <Link
                    href={`/centro/${post.clinic_slug}`}
                    className="block overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-sm hover:shadow-md"
                  >
                    <div className="flex items-center gap-2.5 px-4 pt-4">
                      {post.clinic_logo_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={post.clinic_logo_url}
                          alt=""
                          className="h-9 w-9 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                          {post.clinic_name.slice(0, 1)}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-900">
                          {post.clinic_name}
                        </p>
                        <p className="text-xs text-slate-400">
                          {[
                            post.clinic_city,
                            post.from_saved ? "Guardada" : null,
                            formatClinicPostDate(post.created_at),
                          ]
                            .filter(Boolean)
                            .join(" · ")}
                        </p>
                      </div>
                    </div>
                    <p className="px-4 py-3 text-[15px] leading-relaxed text-slate-700">
                      {post.body}
                    </p>
                    {post.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={post.image_url}
                        alt=""
                        className="max-h-72 w-full object-cover"
                      />
                    ) : null}
                  </Link>
                </li>
              ))}
            </ul>
          )
        ) : (
          (() => {
            const list = tab === "guardadas" ? favorites : results;
            if (list.length === 0) {
              return (
                <p className="text-sm text-slate-500">
                  {tab === "guardadas"
                    ? "Todavía no has guardado ninguna clínica."
                    : "No hay clínicas que coincidan. Prueba otra ciudad o nombre."}
                </p>
              );
            }
            return (
              <ul className="grid gap-4 sm:grid-cols-2">
                {list.map((clinic) => (
                  <li key={clinic.id}>
                    <ClinicDirectoryCard clinic={clinic} />
                  </li>
                ))}
              </ul>
            );
          })()
        )}
      </div>
    </div>
  );
}
