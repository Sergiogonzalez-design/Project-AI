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
  customClinicSpecialties,
  customEquipmentKey,
  listCustomEquipmentForCategory,
  normalizeClinicAccent,
  parseClinicAccentHex,
  parseClinicSpecialties,
} from "@/lib/clinic-brand";
import { PHYSIO_EQUIPMENT_CATEGORIES } from "@/lib/physio-equipment-options";
import {
  parseClinicHours,
  serializeClinicHours,
  type ClinicHoursSchedule,
} from "@/lib/clinic-hours";
import { ClinicHoursEditor } from "@/components/clinic-hours-editor";
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
  equipment: string[] | null;
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
  const [hoursSchedule, setHoursSchedule] = useState<ClinicHoursSchedule>(() =>
    parseClinicHours(null).schedule,
  );
  const [hoursLegacy, setHoursLegacy] = useState<string | null>(null);
  const [equipment, setEquipment] = useState<string[]>([]);
  const [customSpecialty, setCustomSpecialty] = useState("");
  const [specialtyOtherOpen, setSpecialtyOtherOpen] = useState(false);
  const [customEquipmentDraft, setCustomEquipmentDraft] = useState<
    Record<string, string>
  >({});
  const [equipmentOtherOpen, setEquipmentOtherOpen] = useState<
    Record<string, boolean>
  >({});
  const [accentHexDraft, setAccentHexDraft] = useState("#2563EB");
  const hydratedRef = useRef(false);
  const saveGenRef = useRef(0);

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
    setAccentHexDraft(normalizeClinicAccent(row.accent_color));
    setSpecialties(parseClinicSpecialties(row.specialties));
    setSpecialtyOtherOpen(
      customClinicSpecialties(parseClinicSpecialties(row.specialties)).length > 0,
    );
    const parsedHours = parseClinicHours(row.hours);
    setHoursSchedule(parsedHours.schedule);
    setHoursLegacy(parsedHours.legacyText);
    const eq = Array.isArray(row.equipment) ? row.equipment.filter(Boolean) : [];
    setEquipment(eq);
    const open: Record<string, boolean> = {};
    for (const cat of PHYSIO_EQUIPMENT_CATEGORIES) {
      if (listCustomEquipmentForCategory(eq, cat.id).length > 0) open[cat.id] = true;
    }
    setEquipmentOtherOpen(open);
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

  async function handleSave(opts?: { fromAutosave?: boolean }) {
    if (!name.trim()) {
      if (!opts?.fromAutosave) setError("El nombre de la clínica es obligatorio.");
      return;
    }
    const gen = ++saveGenRef.current;
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
        p_hours: serializeClinicHours(hoursSchedule),
        p_equipment: equipment,
      });
      if (err) throw new Error(err.message);
      if (gen !== saveGenRef.current) return;
      if (data) {
        const row = data as ClinicRecord;
        setClinic((prev) => (prev ? { ...prev, ...row } : row));
        setHoursLegacy(null);
        if (row.logo_url != null) setLogoUrl(row.logo_url);
        if (row.cover_url != null) setCoverUrl(row.cover_url);
      }
      setSaved(true);
    } catch (e) {
      if (gen !== saveGenRef.current) return;
      setError(e instanceof Error ? e.message : "No se pudo guardar.");
    } finally {
      if (gen === saveGenRef.current) setSaving(false);
    }
  }

  const hoursSerialized = serializeClinicHours(hoursSchedule);
  const specialtiesKey = JSON.stringify(specialties);
  const equipmentKey = JSON.stringify(equipment);

  useEffect(() => {
    if (loading || !clinic) return;
    if (!hydratedRef.current) {
      hydratedRef.current = true;
      return;
    }
    const t = window.setTimeout(() => {
      void handleSave({ fromAutosave: true });
    }, 750);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- debounced autosave
  }, [
    loading,
    clinic?.id,
    name,
    tagline,
    description,
    phone,
    website,
    address,
    city,
    postalCode,
    contactEmail,
    isListed,
    accent,
    hoursSerialized,
    specialtiesKey,
    equipmentKey,
  ]);

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
            <div className="pb-1">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="text-xs font-semibold text-blue-600 hover:underline"
              >
                {logoUrl ? "Cambiar logo" : "Añadir logo"}
              </button>
              <p className="mt-0.5 text-xs text-slate-500">
                Portada arriba y logo cuadrado — van encima del nombre en tu ficha pública.
              </p>
            </div>
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
          <div className="mt-4 space-y-3 border-t border-neutral-100 pt-4">
            <Link
              href="/clinica/equipo"
              className="flex items-center justify-between rounded-2xl border border-neutral-200 bg-slate-50 px-4 py-3 transition hover:border-blue-300 hover:bg-blue-50"
            >
              <span>
                <span className="block text-sm font-bold text-neutral-900">
                  Equipo
                </span>
                <span className="mt-0.5 block text-xs text-neutral-500">
                  Invitar fisioterapeutas y gestionar el alta
                </span>
              </span>
              <span className="text-sm font-semibold text-blue-600">Abrir →</span>
            </Link>
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
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-bold text-neutral-900">Identidad</h2>
        <div className="mt-4 space-y-3">
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
            <div className="flex flex-wrap items-center gap-2">
              {CLINIC_ACCENT_SWATCHES.map((swatch) => (
                <button
                  key={swatch.hex}
                  type="button"
                  title={swatch.label}
                  onClick={() => {
                    setAccent(swatch.hex);
                    setAccentHexDraft(swatch.hex);
                  }}
                  className={`h-8 w-8 rounded-full border-2 ${
                    accent === swatch.hex ? "border-slate-900" : "border-white"
                  } shadow`}
                  style={{ background: swatch.hex }}
                />
              ))}
              <label
                className="relative flex h-8 w-8 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-slate-300 shadow"
                title="Elegir cualquier color"
              >
                <span
                  className="absolute inset-0"
                  style={{ background: accent }}
                />
                <input
                  type="color"
                  value={accent}
                  onChange={(e) => {
                    const hex = normalizeClinicAccent(e.target.value);
                    setAccent(hex);
                    setAccentHexDraft(hex);
                  }}
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                  aria-label="Elegir color personalizado"
                />
              </label>
            </div>
            <div className="mt-2 flex max-w-xs items-center gap-2">
              <input
                className={inputClass}
                value={accentHexDraft}
                onChange={(e) => {
                  const raw = e.target.value;
                  setAccentHexDraft(raw);
                  const parsed = parseClinicAccentHex(raw);
                  if (parsed) setAccent(parsed);
                }}
                onBlur={() => {
                  const parsed = parseClinicAccentHex(accentHexDraft);
                  const hex = parsed ?? accent;
                  setAccent(hex);
                  setAccentHexDraft(hex);
                }}
                placeholder="#2563EB"
                maxLength={7}
                aria-label="Código hex del color"
              />
              <span
                className="h-9 w-9 shrink-0 rounded-lg border border-slate-200"
                style={{ background: accent }}
                title={accent}
              />
            </div>
            <p className="mt-1 text-xs text-neutral-500">
              Elige un color rápido o usa el selector / código hex para cualquier tono.
            </p>
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
              {customClinicSpecialties(specialties).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggleSpecialty(s)}
                  className="rounded-full px-3 py-1 text-xs font-semibold text-white"
                  style={{ background: accent }}
                  title="Toca para quitar"
                >
                  {s} ×
                </button>
              ))}
              <button
                type="button"
                onClick={() => setSpecialtyOtherOpen((v) => !v)}
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  specialtyOtherOpen
                    ? "text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
                style={specialtyOtherOpen ? { background: accent } : undefined}
              >
                Otro
              </button>
            </div>
            {specialtyOtherOpen ? (
              <div className="mt-2 flex gap-2">
                <input
                  className={inputClass}
                  value={customSpecialty}
                  onChange={(e) => setCustomSpecialty(e.target.value)}
                  placeholder="Escribe otra especialidad…"
                  onKeyDown={(e) => {
                    if (e.key !== "Enter") return;
                    e.preventDefault();
                    const s = customSpecialty.trim();
                    if (s && !specialties.includes(s)) {
                      setSpecialties((p) => [...p, s]);
                    }
                    setCustomSpecialty("");
                  }}
                />
                <button
                  type="button"
                  className="shrink-0 rounded-xl border border-slate-200 px-3 text-sm font-semibold"
                  onClick={() => {
                    const s = customSpecialty.trim();
                    if (s && !specialties.includes(s)) {
                      setSpecialties((p) => [...p, s]);
                    }
                    setCustomSpecialty("");
                  }}
                >
                  Añadir
                </button>
              </div>
            ) : null}
          </div>
          <div>
            <label className={labelClass}>Equipo y servicios</label>
            <p className="mb-2 text-xs text-neutral-500">
              Lo que ofreces en el centro (p. ej. ecógrafo). Physio lo usa para
              recomendar tu clínica a pacientes de tu ciudad. Usa «Otro» si falta
              algo en la lista.
            </p>
            {PHYSIO_EQUIPMENT_CATEGORIES.map((cat) => {
              const customLabels = listCustomEquipmentForCategory(equipment, cat.id);
              const otherOpen = Boolean(equipmentOtherOpen[cat.id]);
              return (
                <div key={cat.id} className="mb-3">
                  <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-neutral-400">
                    {cat.title}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {cat.options.map((opt) => {
                      const on = equipment.includes(opt.id);
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() =>
                            setEquipment((prev) =>
                              on
                                ? prev.filter((x) => x !== opt.id)
                                : [...prev, opt.id],
                            )
                          }
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            on
                              ? "text-white"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }`}
                          style={on ? { background: accent } : undefined}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                    {customLabels.map((label) => {
                      const key = customEquipmentKey(cat.id, label);
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() =>
                            setEquipment((prev) => prev.filter((x) => x !== key))
                          }
                          className="rounded-full px-3 py-1 text-xs font-semibold text-white"
                          style={{ background: accent }}
                          title="Toca para quitar"
                        >
                          {label} ×
                        </button>
                      );
                    })}
                    <button
                      type="button"
                      onClick={() =>
                        setEquipmentOtherOpen((prev) => ({
                          ...prev,
                          [cat.id]: !prev[cat.id],
                        }))
                      }
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        otherOpen
                          ? "text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                      style={otherOpen ? { background: accent } : undefined}
                    >
                      Otro
                    </button>
                  </div>
                  {otherOpen ? (
                    <div className="mt-2 flex gap-2">
                      <input
                        className={inputClass}
                        value={customEquipmentDraft[cat.id] ?? ""}
                        onChange={(e) =>
                          setCustomEquipmentDraft((prev) => ({
                            ...prev,
                            [cat.id]: e.target.value,
                          }))
                        }
                        placeholder={`Otro en ${cat.title.toLowerCase()}…`}
                        onKeyDown={(e) => {
                          if (e.key !== "Enter") return;
                          e.preventDefault();
                          const label = (customEquipmentDraft[cat.id] ?? "").trim();
                          if (!label) return;
                          const key = customEquipmentKey(cat.id, label);
                          setEquipment((prev) =>
                            prev.includes(key) ? prev : [...prev, key],
                          );
                          setCustomEquipmentDraft((prev) => ({
                            ...prev,
                            [cat.id]: "",
                          }));
                        }}
                      />
                      <button
                        type="button"
                        className="shrink-0 rounded-xl border border-slate-200 px-3 text-sm font-semibold"
                        onClick={() => {
                          const label = (customEquipmentDraft[cat.id] ?? "").trim();
                          if (!label) return;
                          const key = customEquipmentKey(cat.id, label);
                          setEquipment((prev) =>
                            prev.includes(key) ? prev : [...prev, key],
                          );
                          setCustomEquipmentDraft((prev) => ({
                            ...prev,
                            [cat.id]: "",
                          }));
                        }}
                      >
                        Añadir
                      </button>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
          <ClinicHoursEditor
            value={hoursSchedule}
            onChange={(next) => {
              setHoursSchedule(next);
              setHoursLegacy(null);
            }}
            legacyText={hoursLegacy}
          />
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
      <p
        className={`text-sm font-semibold ${
          saved ? "text-emerald-700" : saving ? "text-slate-500" : "text-slate-400"
        }`}
      >
        {saving
          ? "Guardando…"
          : saved
            ? "Cambios guardados automáticamente."
            : "Los cambios se guardan solos."}
      </p>
    </div>
  );
}
