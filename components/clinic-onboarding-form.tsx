"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  clinicMapsQuery,
  googleMapsSearchUrl,
} from "@/lib/clinic-maps";

const inputClass =
  "w-full rounded-xl border border-blue-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100";

const labelClass = "mb-1.5 block text-sm font-semibold text-slate-700";

const TEAM_SIZE_OPTIONS = ["1", "2–5", "6–10", "Más de 10"] as const;

export function ClinicOnboardingForm() {
  const router = useRouter();
  const supabase = createClient();
  const [step, setStep] = useState<1 | 2>(1);
  const [ownerName, setOwnerName] = useState("");
  const [clinicName, setClinicName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [website, setWebsite] = useState("");
  const [description, setDescription] = useState("");
  const [teamSize, setTeamSize] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function validateStep1(): boolean {
    if (!ownerName.trim()) {
      setError("Introduce el nombre del responsable de la clínica.");
      return false;
    }
    if (clinicName.trim().length < 2) {
      setError("Introduce el nombre comercial de la clínica.");
      return false;
    }
    if (phone.trim().length < 7) {
      setError("Introduce un teléfono de contacto de la clínica.");
      return false;
    }
    setError(null);
    return true;
  }

  function validateStep2(): boolean {
    if (!address.trim()) {
      setError("Introduce la dirección de la clínica.");
      return false;
    }
    if (!city.trim()) {
      setError("Introduce la ciudad.");
      return false;
    }
    setError(null);
    return true;
  }

  async function handleSubmit() {
    if (!validateStep2()) return;
    setLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Sesión expirada. Vuelve a iniciar sesión.");

      // clinic_create_own promotes patient→clinic when onboarding is incomplete
      // (or JWT app_metadata says clinic).

      const descParts = [
        description.trim(),
        teamSize ? `Equipo: ${teamSize} fisioterapeutas.` : "",
      ].filter(Boolean);
      const fullDescription = descParts.join("\n") || null;

      const { error: clinicErr } = await supabase.rpc("clinic_create_own", {
        p_name: clinicName.trim(),
        p_description: fullDescription,
      });
      if (clinicErr) throw new Error(clinicErr.message);

      const mapQuery = clinicMapsQuery({
        address: address.trim(),
        city: city.trim(),
      });
      const mapsUrl = mapQuery ? googleMapsSearchUrl(mapQuery) : null;

      const { error: updateErr } = await supabase.rpc("clinic_update_own", {
        p_phone: phone.trim(),
        p_website: website.trim() || "",
        p_address: address.trim(),
        p_city: city.trim(),
        p_postal_code: postalCode.trim() || "",
        p_description: fullDescription ?? "",
        p_google_maps_url: mapsUrl,
      });
      if (updateErr) throw new Error(updateErr.message);

      const { error: saveErr } = await supabase
        .from("profiles")
        .update({
          display_name: ownerName.trim(),
          clinic_name: clinicName.trim(),
          onboarding_completed: true,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);
      if (saveErr) throw new Error(saveErr.message);

      router.replace("/clinica/consulta");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al crear la clínica.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-lg rounded-2xl border border-blue-100 bg-white px-6 py-8 shadow-sm sm:px-8">
      <div className="mb-6 flex flex-col items-center gap-3 text-center">
        <Image src="/logo-icon.png" alt="AIKinora" width={56} height={56} className="object-contain" />
        <div>
          <h1 className="text-xl font-bold text-slate-800">Alta de clínica</h1>
          <p className="mt-1 text-sm text-slate-500">
            Datos del centro (no del paciente). Luego podrás invitar a tus
            fisioterapeutas.
          </p>
          <p className="mt-2 text-xs font-semibold text-blue-600">
            Paso {step} de 2
          </p>
        </div>
      </div>

      {step === 1 ? (
        <div className="space-y-5">
          <div>
            <label className={labelClass}>Responsable / administrador</label>
            <input
              type="text"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              placeholder="Nombre y apellidos"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Nombre de la clínica</label>
            <input
              type="text"
              value={clinicName}
              onChange={(e) => setClinicName(e.target.value)}
              placeholder="Ej: Clínica AIKinora"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Teléfono de la clínica</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+34 600 000 000"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Tamaño del equipo</label>
            <div className="flex flex-wrap gap-2">
              {TEAM_SIZE_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setTeamSize(opt)}
                  className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                    teamSize === opt
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "border-blue-200 bg-white text-slate-600 hover:border-blue-400"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
            <p className="mt-1.5 text-xs text-slate-500">
              Número aproximado de fisioterapeutas (opcional).
            </p>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="button"
            onClick={() => {
              if (validateStep1()) setStep(2);
            }}
            className="w-full rounded-xl bg-blue-600 py-3.5 text-sm font-bold text-white shadow transition hover:bg-blue-700"
          >
            Continuar
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          <div>
            <label className={labelClass}>Dirección</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Calle y número"
              className={inputClass}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Ciudad</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Madrid"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Código postal</label>
              <input
                type="text"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                placeholder="28001"
                className={inputClass}
              />
            </div>
          </div>
          <div>
            <label className={labelClass}>Web (opcional)</label>
            <input
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Descripción / especialidades</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Deportiva, pediátrica, suelo pélvico, barrio…"
              rows={3}
              className={inputClass}
            />
            <p className="mt-1.5 text-xs text-slate-500">
              Visible en la ficha pública de la clínica.
            </p>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setError(null);
                setStep(1);
              }}
              disabled={loading}
              className="flex-1 rounded-xl border border-slate-200 py-3.5 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
            >
              Atrás
            </button>
            <button
              type="button"
              onClick={() => void handleSubmit()}
              disabled={loading}
              className="flex-[2] rounded-xl bg-blue-600 py-3.5 text-sm font-bold text-white shadow transition hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? "Creando…" : "Crear clínica"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
