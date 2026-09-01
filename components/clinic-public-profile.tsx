"use client";

import { useEffect, useState } from "react";
import {
  clinicAccentSoft,
  normalizeClinicAccent,
  parseClinicSpecialties,
} from "@/lib/clinic-brand";
import {
  clinicMailtoHref,
  clinicTelHref,
  clinicWebsiteHref,
  formatClinicPostDate,
  type ClinicPost,
  type ClinicPublicProfile as ClinicPublic,
} from "@/lib/clinic-directory";
import {
  clinicMapsQuery,
  googleMapsEmbedUrl,
  googleMapsSearchUrl,
} from "@/lib/clinic-maps";
import { createClient } from "@/lib/supabase/client";

type TeamMember = { display_name: string };
type PageTab = "novedades" | "sobre" | "equipo";

type Props = {
  clinic: ClinicPublic;
  team: TeamMember[];
  posts: ClinicPost[];
};

export function ClinicPublicProfile({ clinic, team, posts }: Props) {
  const supabase = createClient();
  const [tab, setTab] = useState<PageTab>("novedades");
  const [saved, setSaved] = useState(false);
  const [canSave, setCanSave] = useState(false);
  const [saving, setSaving] = useState(false);
  const [shareHint, setShareHint] = useState<string | null>(null);

  const accent = normalizeClinicAccent(clinic.accent_color);
  const soft = clinicAccentSoft(accent);
  const specialties = parseClinicSpecialties(clinic.specialties);

  useEffect(() => {
    void supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return;
      setCanSave(true);
      const { data: fav } = await supabase.rpc("clinic_is_favorited", {
        p_clinic_id: clinic.id,
      });
      setSaved(Boolean(fav));
    });
  }, [clinic.id, supabase]);

  const query = clinicMapsQuery({
    address: clinic.address,
    city: clinic.city,
    lat: clinic.lat,
    lng: clinic.lng,
  });
  const mapsHref =
    clinic.google_maps_url || (query ? googleMapsSearchUrl(query) : null);

  async function toggleSave() {
    if (!canSave) return;
    setSaving(true);
    const { data, error } = await supabase.rpc("clinic_favorite_toggle", {
      p_clinic_id: clinic.id,
    });
    if (!error) setSaved(Boolean(data));
    setSaving(false);
  }

  async function shareProfile() {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      if (navigator.share) {
        await navigator.share({ title: clinic.name, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setShareHint("Enlace copiado");
      setTimeout(() => setShareHint(null), 2000);
    } catch {
      setShareHint(null);
    }
  }

  const ghost =
    "inline-flex h-10 items-center justify-center rounded-full border border-white/70 bg-white/90 px-4 text-sm font-semibold text-slate-800 shadow-sm backdrop-blur hover:bg-white";

  return (
    <div className="min-h-full bg-[#f3f4f6] pb-16">
      <div className="relative">
        <div
          className="h-44 w-full sm:h-56 lg:h-64"
          style={{
            background: clinic.cover_url
              ? undefined
              : `linear-gradient(135deg, ${accent} 0%, #0f172a 100%)`,
          }}
        >
          {clinic.cover_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={clinic.cover_url}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />
        </div>
      </div>

      <div className="mx-auto w-full max-w-4xl px-4 sm:px-6">
        <div className="-mt-12 rounded-[28px] border border-white/70 bg-white/90 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:-mt-16 sm:p-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div
              className="-mt-16 h-24 w-24 shrink-0 overflow-hidden rounded-[22px] border-4 border-white shadow-lg sm:-mt-20 sm:h-28 sm:w-28"
              style={{ background: soft }}
            >
              {clinic.logo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={clinic.logo_url} alt="" className="h-full w-full object-cover" />
              ) : (
                <div
                  className="flex h-full w-full items-center justify-center text-3xl font-bold text-white"
                  style={{ background: accent }}
                >
                  {clinic.name.slice(0, 1).toUpperCase()}
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-[1.65rem] font-semibold tracking-tight text-slate-950 sm:text-3xl">
                  {clinic.name}
                </h1>
                <span
                  className="rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-white"
                  style={{ background: accent }}
                >
                  Clínica
                </span>
              </div>
              {clinic.tagline ? (
                <p className="mt-1 text-sm text-slate-600 sm:text-[15px]">{clinic.tagline}</p>
              ) : null}
              <p className="mt-1 text-sm text-slate-500">
                {[clinic.city, clinic.address].filter(Boolean).join(" · ")}
              </p>
            </div>
          </div>

          {specialties.length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {specialties.map((s) => (
                <span
                  key={s}
                  className="rounded-full px-2.5 py-1 text-xs font-semibold"
                  style={{ background: soft, color: accent }}
                >
                  {s}
                </span>
              ))}
            </div>
          ) : null}

          <div className="mt-5 flex flex-wrap items-center gap-2">
            {canSave ? (
              <button
                type="button"
                onClick={() => void toggleSave()}
                disabled={saving}
                className="inline-flex h-10 items-center rounded-full px-5 text-sm font-bold text-white shadow-sm disabled:opacity-60"
                style={{ background: accent }}
              >
                {saved ? "Guardada" : "Guardar"}
              </button>
            ) : null}
            {clinic.phone ? (
              <a href={clinicTelHref(clinic.phone)} className={ghost}>
                Llamar
              </a>
            ) : null}
            {clinic.contact_email ? (
              <a href={clinicMailtoHref(clinic.contact_email)} className={ghost}>
                Email
              </a>
            ) : null}
            {mapsHref ? (
              <a href={mapsHref} target="_blank" rel="noopener noreferrer" className={ghost}>
                Cómo llegar
              </a>
            ) : null}
            {clinic.website ? (
              <a
                href={clinicWebsiteHref(clinic.website)}
                target="_blank"
                rel="noopener noreferrer"
                className={ghost}
              >
                Web
              </a>
            ) : null}
            <button type="button" onClick={() => void shareProfile()} className={ghost}>
              Compartir
            </button>
          </div>
          {shareHint ? (
            <p className="mt-2 text-xs font-semibold text-emerald-700">{shareHint}</p>
          ) : null}

          <div className="mt-6 flex gap-1 border-b border-slate-200">
            {(
              [
                ["novedades", "Novedades"],
                ["sobre", "Sobre"],
                ["equipo", "Equipo"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                className={`relative px-4 py-2.5 text-sm font-semibold transition ${
                  tab === id ? "text-slate-950" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {label}
                {tab === id ? (
                  <span
                    className="absolute inset-x-3 -bottom-px h-0.5 rounded-full"
                    style={{ background: accent }}
                  />
                ) : null}
              </button>
            ))}
          </div>

          <div className="pt-5">
            {tab === "novedades" ? (
              posts.length === 0 ? (
                <p className="text-sm text-slate-500">
                  Esta clínica aún no ha publicado novedades.
                </p>
              ) : (
                <ul className="space-y-4">
                  {posts.map((post) => (
                    <li key={post.id} className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
                      <div className="flex items-center gap-2">
                        {clinic.logo_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={clinic.logo_url} alt="" className="h-8 w-8 rounded-full object-cover" />
                        ) : (
                          <div
                            className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white"
                            style={{ background: accent }}
                          >
                            {clinic.name.slice(0, 1)}
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{clinic.name}</p>
                          <p className="text-xs text-slate-400">
                            {formatClinicPostDate(post.created_at)}
                          </p>
                        </div>
                      </div>
                      <p className="mt-3 whitespace-pre-wrap text-[15px] leading-relaxed text-slate-800">
                        {post.body}
                      </p>
                      {post.image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={post.image_url}
                          alt=""
                          className="mt-3 max-h-80 w-full rounded-2xl object-cover"
                        />
                      ) : null}
                    </li>
                  ))}
                </ul>
              )
            ) : null}

            {tab === "sobre" ? (
              <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="space-y-4">
                  {clinic.description ? (
                    <p className="text-[15px] leading-relaxed text-slate-700">
                      {clinic.description}
                    </p>
                  ) : (
                    <p className="text-sm text-slate-500">Sin descripción todavía.</p>
                  )}
                  {clinic.hours ? (
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                        Horario
                      </p>
                      <p className="mt-1 whitespace-pre-wrap text-sm text-slate-800">
                        {clinic.hours}
                      </p>
                    </div>
                  ) : null}
                  <dl className="space-y-2 text-sm">
                    {clinic.address ? (
                      <div>
                        <dt className="font-semibold text-slate-400">Dirección</dt>
                        <dd className="text-slate-800">
                          {clinic.address}
                          {clinic.postal_code ? `, ${clinic.postal_code}` : ""}
                          {clinic.city ? ` · ${clinic.city}` : ""}
                        </dd>
                      </div>
                    ) : null}
                    {clinic.phone ? (
                      <div>
                        <dt className="font-semibold text-slate-400">Teléfono</dt>
                        <dd>
                          <a href={clinicTelHref(clinic.phone)} className="font-medium hover:underline" style={{ color: accent }}>
                            {clinic.phone}
                          </a>
                        </dd>
                      </div>
                    ) : null}
                    {clinic.contact_email ? (
                      <div>
                        <dt className="font-semibold text-slate-400">Email</dt>
                        <dd>
                          <a href={clinicMailtoHref(clinic.contact_email)} className="font-medium hover:underline" style={{ color: accent }}>
                            {clinic.contact_email}
                          </a>
                        </dd>
                      </div>
                    ) : null}
                  </dl>
                </div>
                {query ? (
                  <div className="overflow-hidden rounded-2xl border border-slate-200">
                    <iframe
                      title={`Mapa de ${clinic.name}`}
                      src={googleMapsEmbedUrl(query)}
                      className="h-56 w-full"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                    {mapsHref ? (
                      <a
                        href={mapsHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block bg-white px-4 py-2.5 text-center text-sm font-semibold hover:underline"
                        style={{ color: accent }}
                      >
                        Abrir en Google Maps
                      </a>
                    ) : null}
                  </div>
                ) : null}
              </div>
            ) : null}

            {tab === "equipo" ? (
              team.length === 0 ? (
                <p className="text-sm text-slate-500">El equipo aún no está listado.</p>
              ) : (
                <ul className="grid gap-3 sm:grid-cols-2">
                  {team.map((p) => (
                    <li
                      key={p.display_name}
                      className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-3"
                    >
                      <div
                        className="flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold text-white"
                        style={{ background: accent }}
                      >
                        {p.display_name.slice(0, 1).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{p.display_name}</p>
                        <p className="text-xs text-slate-500">Fisioterapeuta</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
