"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ClinicDirectoryCard } from "@/components/clinic-directory-card";
import { formatClinicPostDate, type ClinicFeedPost, type ClinicSearchCard } from "@/lib/clinic-directory";
import { createClient } from "@/lib/supabase/client";

type Tab = "explorar" | "guardadas" | "novedades";

function ExploreSearchField({
  value,
  onChange,
  placeholder,
  onSearch,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  onSearch: () => void;
}) {
  return (
    <div className="flex h-12 items-center gap-2">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            onSearch();
          }
        }}
        placeholder={placeholder}
        className="box-border h-12 min-w-0 flex-1 rounded-2xl border border-slate-200 bg-white px-4 text-sm leading-none text-slate-900 shadow-sm outline-none ring-0 placeholder:text-slate-400 focus:border-slate-300"
      />
      <button
        type="button"
        onClick={onSearch}
        aria-label="Buscar"
        className="box-border inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white p-0 text-slate-950 shadow-sm hover:bg-slate-50"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3.5-3.5" />
        </svg>
      </button>
    </div>
  );
}

export function ClinicBuscarClient() {
  const supabase = createClient();
  const [tab, setTab] = useState<Tab>("explorar");
  const [signedIn, setSignedIn] = useState(false);
  const [name, setName] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [city, setCity] = useState("");
  const [results, setResults] = useState<ClinicSearchCard[]>([]);
  const [favorites, setFavorites] = useState<ClinicSearchCard[]>([]);
  const [feed, setFeed] = useState<ClinicFeedPost[]>([]);
  const [error, setError] = useState<string | null>(null);
  /** First paint per panel — after that, keep content on screen while refreshing. */
  const [ready, setReady] = useState<Record<Tab, boolean>>({
    explorar: false,
    guardadas: false,
    novedades: false,
  });
  const exploreReq = useRef(0);
  const favoritesReq = useRef(0);
  const feedReq = useRef(0);
  const filtersRef = useRef({ name: "", specialty: "", city: "" });
  filtersRef.current = { name, specialty, city };
  const skipTabReload = useRef(true);

  const markReady = useCallback((id: Tab) => {
    setReady((prev) => (prev[id] ? prev : { ...prev, [id]: true }));
  }, []);

  const loadExplore = useCallback(async () => {
    const id = ++exploreReq.current;
    const { name: n, specialty: s, city: c } = filtersRef.current;
    setError(null);
    const { data, error: err } = await supabase.rpc("clinic_search", {
      p_name: n.trim(),
      p_specialty: s.trim(),
      p_city: c.trim(),
    });
    if (id !== exploreReq.current) return;
    if (err) setError(err.message);
    else setResults((data as ClinicSearchCard[]) ?? []);
    markReady("explorar");
  }, [markReady, supabase]);

  const loadFavorites = useCallback(async () => {
    const id = ++favoritesReq.current;
    setError(null);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (id !== favoritesReq.current) return;
    if (!user) {
      setFavorites([]);
      markReady("guardadas");
      return;
    }
    const { data, error: err } = await supabase.rpc("clinic_list_favorites");
    if (id !== favoritesReq.current) return;
    if (err) setError(err.message);
    else setFavorites((data as ClinicSearchCard[]) ?? []);
    markReady("guardadas");
  }, [markReady, supabase]);

  const loadFeed = useCallback(async () => {
    const id = ++feedReq.current;
    setError(null);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (id !== feedReq.current) return;
    if (!user) {
      setFeed([]);
      markReady("novedades");
      return;
    }
    const { data, error: err } = await supabase.rpc("clinic_feed_posts");
    if (id !== feedReq.current) return;
    if (err) setError(err.message);
    else setFeed((data as ClinicFeedPost[]) ?? []);
    markReady("novedades");
  }, [markReady, supabase]);

  useEffect(() => {
    void supabase.auth.getUser().then(({ data }) => setSignedIn(Boolean(data.user)));
  }, [supabase]);

  // Prefetch every panel once so tab switches never flash an empty state.
  useEffect(() => {
    void loadExplore();
    void loadFavorites();
    void loadFeed();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (skipTabReload.current) {
      skipTabReload.current = false;
      return;
    }
    if (tab === "explorar") void loadExplore();
    else if (tab === "guardadas") void loadFavorites();
    else void loadFeed();
  }, [tab, loadExplore, loadFavorites, loadFeed]);

  function runSearch() {
    setTab("explorar");
    void loadExplore();
  }

  const tabs = [
    ["explorar", "Explorar"],
    ["guardadas", "Guardadas"],
    ["novedades", "Novedades"],
  ] as const;

  function renderPanel() {
    if (!ready[tab]) {
      return <p className="text-sm text-slate-500">Cargando…</p>;
    }
    if (tab === "novedades") {
      if (feed.length === 0) {
        return (
          <p className="text-sm text-slate-500">
            Aún no hay novedades. Guarda clínicas para ver primero las suyas.
          </p>
        );
      }
      return (
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
      );
    }

    const list = tab === "guardadas" ? favorites : results;
    if (list.length === 0) {
      return (
        <p className="text-sm text-slate-500">
          {tab === "guardadas"
            ? signedIn
              ? "Todavía no has guardado ninguna clínica."
              : "Inicia sesión para guardar clínicas."
            : "No hay clínicas que coincidan. Prueba otro nombre, especialidad o ciudad."}
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
  }

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
        </div>
      </div>

      <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6">
        <div
          className="mb-6 grid h-11 shrink-0 grid-cols-3 gap-1 rounded-2xl bg-white p-1 shadow-sm"
          role="tablist"
          aria-label="Secciones del directorio"
        >
          {tabs.map(([id, label]) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={tab === id}
              onClick={() => setTab(id)}
              className={`inline-flex h-9 items-center justify-center rounded-xl border-0 px-2 text-sm font-semibold leading-none ${
                tab === id
                  ? "bg-slate-950 text-white"
                  : "bg-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Always mounted — same height on every tab so the page does not jump. */}
        <div className="mb-6 flex max-w-xl flex-col gap-2">
          <ExploreSearchField
            value={name}
            onChange={setName}
            placeholder="Nombre"
            onSearch={runSearch}
          />
          <ExploreSearchField
            value={specialty}
            onChange={setSpecialty}
            placeholder="Especialidad"
            onSearch={runSearch}
          />
          <ExploreSearchField
            value={city}
            onChange={setCity}
            placeholder="Ciudad"
            onSearch={runSearch}
          />
        </div>

        {error ? <p className="mb-3 text-sm text-red-600">{error}</p> : null}
        <div className="min-h-[8rem]">{renderPanel()}</div>
      </div>
    </div>
  );
}
