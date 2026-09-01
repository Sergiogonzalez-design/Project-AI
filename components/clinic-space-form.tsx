"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  CLINIC_BILLING_REQUIRED,
  clinicHasPaidAccess,
} from "@/lib/clinic-billing";
import {
  CLINIC_ACCENT_SWATCHES,
  CLINIC_SPECIALTY_PRESETS,
  normalizeClinicAccent,
  parseClinicSpecialties,
} from "@/lib/clinic-brand";
import {
  clinicMapsQuery,
  googleMapsEmbedUrl,
  googleMapsSearchUrl,
} from "@/lib/clinic-maps";
import { ClinicNovedadesForm } from "@/components/clinic-novedades-form";
import { createClient } from "@/lib/supabase/client";

const inputClass =
  "w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100";
const labelClass = "mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500";

export type ClinicRecord = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logo_url: string | null;
  phone: string | null;
  website: string | null;
  address: string | null;
  city: string | null;
  postal_code: string | null;
  country: string | null;
  lat: number | null;
  lng: number | null;
  google_maps_url: string | null;
  contact_email: string | null;
  is_listed: boolean;
  cover_url: string | null;
  tagline: string | null;
  accent_color: string | null;
  specialties: string[] | null;
  hours: string | null;
  billing_status: string;
};

export function ClinicSpaceForm() {
  const supabase = createClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const coverRef = useRef<HTMLInputElement>(null);
  const [clinic, setClinic] = useState<ClinicRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [contactEmail, setContactEmail] = useState("");
  const [isListed, setIsListed] = useState(true);
  const [accent, setAccent] = useState("#2563EB");
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [hours, setHours] = useState("");
  const [customSpecialty, setCustomSpecialty] = useState("");

  const fill = useCallback((row: ClinicRecord) => {
    setClinic(row);
    setName(row.name ?? "");
    setTagline(row.tagline ?? "");
    setDescription(row.description ?? "");
    setPhone(row.phone ?? "");
    setWebsite(row.website ?? "");
    setAddress(row.address ?? "");
    setCity(row.city ?? "");
    setPostalCode(row.postal_code ?? "");
    setLogoUrl(row.logo_url);
    setCoverUrl(row.cover_url);
    setContactEmail(row.contact_email ?? "");
    setIsListed(row.is_listed !== false);
    setAccent(normalizeClinicAccent(row.accent_color));
    setSpecialties(parseClinicSpecialties(row.specialties));
    setHours(row.hours ?? "");
  }, []);

  useEffect(() => {
    const client = createClient();
    void client.rpc("clinic_get_own").then(({ data, error: err }) => {
      if (err) setError(err.message);
      else if (data && typeof data === "object" && "id" in data && data.id) {
        fill(data as ClinicRecord);
      }
      setLoading(false);
    });
  }, [fill]);

  const mapQuery = clinicMapsQuery({ address, city });

  function toggleSpecialty(s: string) {
    setSpecialties((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  }

  async function handleSave() {
    setError(null);
    setSaved(false);
    setSaving(true);
    try {
      const mapsUrl = mapQuery ? googleMapsSearchUrl(mapQuery) : null;
      const { data, error: err } = await supabase.rpc("clinic_update_own", {
        p_name: name.trim(),
        p_description: description.trim() || "",
        p_phone: phone.trim() || "",
        p_website: website.trim() || "",
        p_address: address.trim() || "",
        p_city: city.trim() || "",
        p_postal_code: postalCode.trim() || "",
        p_google_maps_url: mapsUrl,
        p_contact_email: contactEmail.trim() || "",
        p_is_listed: isListed,
        p_tagline: tagline.trim().slice(0, 120) || "",
        p_accent_color: accent,
        p_specialties: specialties,
        p_hours: hours.trim() || "",
      });
      if (err) throw new Error(err.message);
      if (data) fill(data as ClinicRecord);
      setSaved(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo guardar.");
    } finally {
      setSaving(false);
    }
  }

  async function uploadImage(
    file: File,
    kind: "logo" | "cover"
  ) {
    if (!clinic) return;
    setError(null);
    const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
    const path = `${clinic.id}/${kind}.${ext}`;
    const { error: upErr } = await supabase.storage
      .from("clinic-logos")
      .upload(path, file, { upsert: true, contentType: file.type });
    if (upErr) {
      setError(upErr.message);
      return;
    }
    const { data } = supabase.storage.from("clinic-logos").getPublicUrl(path);
    const publicUrl = `${data.publicUrl}?v=${Date.now()}`;
    const payload =
      kind === "logo" ? { p_logo_url: publicUrl } : { p_cover_url: publicUrl };
    const { data: row, error: saveErr } = await supabase.rpc("clinic_update_own", payload);
    if (saveErr) {
      setError(saveErr.message);
      return;
    }
    if (row) fill(row as ClinicRecord);
    else if (kind === "logo") setLogoUrl(publicUrl);
    else setCoverUrl(publicUrl);
  }

  if (loading) {
    return <p className="text-sm text-neutral-500">Cargando clínica…</p>;
  }
  if (!clinic) {
    return (
      <p className="text-sm text-red-600">
        {error ?? "No se encontró la clínica. Completa el alta otra vez."}
      </p>
    );
  }

  const paid = clinicHasPaidAccess(clinic.billing_status);
  const publicHref = `/centro/${clinic.slug}`;

  return (
    <div className="space-y-6">
      {!CLINIC_BILLING_REQUIRED ? (
        <p className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
          El plan de clínica será de pago. Por ahora puedes configurar el espacio
          y el equipo; el cobro se activará más adelante.
        </p>
      ) : !paid ? (
        <p className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
          Activa el plan de clínica para que tus fisioterapeutas y pacientes
          usen AIKinora desde este centro.
        </p>
      ) : null}

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-neutral-900">Personaliza tu página</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Así te ven los pacientes en Buscar.{" "}
            <Link href={publicHref} className="font-semibold text-blue-600 hover:underline">
              Ver perfil público
            </Link>
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-[24px] border border-neutral-200 bg-white shadow-sm">
        <button
          type="button"
          onClick={() => coverRef.current?.click()}
          className="relative block h-36 w-full overflow-hidden sm:h-44"
          style={{
            background: coverUrl
              ? undefined
              : `linear-gradient(135deg, ${accent} 0%, #0f172a 100%)`,
          }}
        >
          {coverUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={coverUrl} alt="" className="h-full w-full object-cover" />
          ) : null}
          <span className="absolute bottom-3 right-3 rounded-full bg-black/55 px-3 py-1 text-xs font-semibold text-white">
            Cambiar portada
          </span>
        </button>
        <input
          ref={coverRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void uploadImage(file, "cover");
            e.target.value = "";
          }}
        />
        <div className="px-5 pb-5">
          <div className="-mt-8 flex items-end gap-4">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-slate-100 shadow"
            >
              {logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={logoUrl} alt="Logo" className="h-full w-full object-cover" />
              ) : (
                <span className="px-1 text-center text-[10px] font-semibold text-slate-500">
                  Logo
                </span>
              )}
            </button>
            <p className="pb-1 text-xs text-slate-500">Portada 16:5 y logo cuadrado.</p>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void uploadImage(file, "logo");
              e.target.value = "";
            }}
          />
        </div>
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-bold text-neutral-900">Identidad</h2>
        <div className="mt-4 space-y-3">
          <div>
            <label className={labelClass}>Nombre</label>
            <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Eslogan (como LinkedIn)</label>
            <input
              className={inputClass}
              value={tagline}
              maxLength={120}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="Fisioterapia deportiva en el centro de Madrid"
            />
          </div>
          <div>
            <label className={labelClass}>Descripción</label>
            <textarea
              className={inputClass}
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Quiénes sois, cómo trabajáis, qué os diferencia…"
            />
          </div>
          <div>
            <label className={labelClass}>Color de marca</label>
            <div className="flex flex-wrap gap-2">
              {CLINIC_ACCENT_SWATCHES.map((swatch) => (
                <button
                  key={swatch.hex}
                  type="button"
                  title={swatch.label}
                  onClick={() => setAccent(swatch.hex)}
                  className={`h-8 w-8 rounded-full border-2 ${
                    accent === swatch.hex ? "border-slate-900" : "border-white"
                  } shadow`}
                  style={{ background: swatch.hex }}
                />
              ))}
            </div>
          </div>
          <div>
            <label className={labelClass}>Especialidades</label>
            <div className="flex flex-wrap gap-2">
              {CLINIC_SPECIALTY_PRESETS.map((s) => {
                const on = specialties.includes(s);
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => toggleSpecialty(s)}
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      on
                        ? "text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                    style={on ? { background: accent } : undefined}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
            <div className="mt-2 flex gap-2">
              <input
                className={inputClass}
                value={customSpecialty}
                onChange={(e) => setCustomSpecialty(e.target.value)}
                placeholder="Otra especialidad"
              />
              <button
                type="button"
                className="shrink-0 rounded-xl border border-slate-200 px-3 text-sm font-semibold"
                onClick={() => {
                  const s = customSpecialty.trim();
                  if (s && !specialties.includes(s)) setSpecialties((p) => [...p, s]);
                  setCustomSpecialty("");
                }}
              >
                Añadir
              </button>
            </div>
          </div>
          <div>
            <label className={labelClass}>Horario</label>
            <textarea
              className={inputClass}
              rows={3}
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              placeholder={"L–V 8:00–20:00\nSábados 9:00–14:00"}
            />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-bold text-neutral-900">Contacto y ubicación</h2>
        <p className="mt-1 text-xs text-neutral-500">
          La dirección se abre en Google Maps (mapa embebido + enlace).
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className={labelClass}>Dirección</label>
            <input
              className={inputClass}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Calle, número"
            />
          </div>
          <div>
            <label className={labelClass}>Ciudad</label>
            <input className={inputClass} value={city} onChange={(e) => setCity(e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Código postal</label>
            <input
              className={inputClass}
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>Teléfono</label>
            <input className={inputClass} value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Email de contacto</label>
            <input
              className={inputClass}
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              placeholder="info@clinica.com"
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>Web</label>
            <input
              className={inputClass}
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://"
            />
          </div>
        </div>
        <label className="mt-4 flex items-start gap-2 text-sm text-neutral-700">
          <input
            type="checkbox"
            checked={isListed}
            onChange={(e) => setIsListed(e.target.checked)}
            className="mt-0.5"
          />
          <span>
            Visible en Buscar. Hace falta ciudad y teléfono o email para aparecer
            en el directorio de pacientes.
          </span>
        </label>

        {mapQuery ? (
          <div className="mt-4 overflow-hidden rounded-xl border border-neutral-200">
            <iframe
              title="Mapa de la clínica"
              src={googleMapsEmbedUrl(mapQuery)}
              className="h-56 w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <a
              href={googleMapsSearchUrl(mapQuery)}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-neutral-50 px-3 py-2 text-center text-xs font-semibold text-blue-600 hover:underline"
            >
              Abrir en Google Maps
            </a>
          </div>
        ) : null}
      </div>

      <ClinicNovedadesForm clinicId={clinic.id} />

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {saved ? <p className="text-sm font-semibold text-emerald-700">Cambios guardados.</p> : null}

      <button
        type="button"
        onClick={() => void handleSave()}
        disabled={saving}
        className="btn-primary px-5 py-2.5 text-sm disabled:opacity-60"
      >
        {saving ? "Guardando…" : "Guardar página"}
      </button>
    </div>
  );
}
