"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { SEX_OPTIONS } from "@/lib/profile-options";
import { staffVisibleEmail } from "@/lib/guest-account";
import { createClient } from "@/lib/supabase/client";

export type StaffPatientProfile = {
  id: string;
  email: string | null;
  display_name: string | null;
  age: number | null;
  sex: string | null;
  height_cm: number | null;
  weight_kg: number | null;
  city: string | null;
  is_guest: boolean;
  staff_notes: string | null;
  whatsapp_phone: string | null;
};

type Props = {
  patientId: string;
  onDisplayNameChange?: (name: string | null) => void;
};

const inputClass =
  "mt-1 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100";
const labelClass = "block text-xs font-medium text-neutral-600";

function parseOptionalInt(raw: string): number | null {
  const t = raw.trim();
  if (!t) return null;
  const n = Number(t);
  if (!Number.isFinite(n) || !Number.isInteger(n)) return null;
  return n;
}

function parseOptionalNum(raw: string): number | null {
  const t = raw.trim().replace(",", ".");
  if (!t) return null;
  const n = Number(t);
  if (!Number.isFinite(n)) return null;
  return n;
}

function rowFromRpc(raw: unknown): StaffPatientProfile | null {
  const row = Array.isArray(raw) ? raw[0] : raw;
  if (!row || typeof row !== "object") return null;
  const r = row as Record<string, unknown>;
  return {
    id: String(r.id),
    email: staffVisibleEmail((r.email as string | null) ?? null),
    display_name: (r.display_name as string | null) ?? null,
    age: r.age == null ? null : Number(r.age),
    sex: (r.sex as string | null) ?? null,
    height_cm: r.height_cm == null ? null : Number(r.height_cm),
    weight_kg: r.weight_kg == null ? null : Number(r.weight_kg),
    city: (r.city as string | null) ?? null,
    is_guest: Boolean(r.is_guest),
    staff_notes: (r.staff_notes as string | null) ?? null,
    whatsapp_phone: (r.whatsapp_phone as string | null) ?? null,
  };
}

export function StaffPatientProfileEditor({
  patientId,
  onDisplayNameChange,
}: Props) {
  const [profile, setProfile] = useState<StaffPatientProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedFlash, setSavedFlash] = useState(false);

  const [displayName, setDisplayName] = useState("");
  const [age, setAge] = useState("");
  const [sex, setSex] = useState("");
  const [heightCm, setHeightCm] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [city, setCity] = useState("");

  const fillForm = useCallback((p: StaffPatientProfile) => {
    setDisplayName(p.display_name ?? "");
    setAge(p.age?.toString() ?? "");
    setSex(p.sex ?? "");
    setHeightCm(p.height_cm?.toString() ?? "");
    setWeightKg(p.weight_kg?.toString() ?? "");
    setCity(p.city ?? "");
  }, []);

  const nameChangeRef = useRef(onDisplayNameChange);
  nameChangeRef.current = onDisplayNameChange;

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const { data, error: rpcError } = await supabase.rpc(
        "staff_get_patient_profile",
        { p_patient_id: patientId }
      );
      if (rpcError) {
        setError(rpcError.message);
        setProfile(null);
        return;
      }
      const next = rowFromRpc(data);
      setProfile(next);
      if (next) {
        fillForm(next);
        nameChangeRef.current?.(next.display_name);
        const empty =
          !next.display_name &&
          next.age == null &&
          !next.sex &&
          next.height_cm == null &&
          next.weight_kg == null &&
          !next.city;
        if (empty) setEditing(true);
      }
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "No se pudo cargar el perfil."
      );
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, [fillForm, patientId]);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSavedFlash(false);

    const ageVal = parseOptionalInt(age);
    if (age.trim() && ageVal == null) {
      setError("La edad debe ser un número entero.");
      setSaving(false);
      return;
    }
    if (ageVal != null && (ageVal < 1 || ageVal > 120)) {
      setError("La edad debe estar entre 1 y 120.");
      setSaving(false);
      return;
    }
    const heightVal = parseOptionalNum(heightCm);
    if (heightCm.trim() && heightVal == null) {
      setError("La altura debe ser un número.");
      setSaving(false);
      return;
    }
    const weightVal = parseOptionalNum(weightKg);
    if (weightKg.trim() && weightVal == null) {
      setError("El peso debe ser un número.");
      setSaving(false);
      return;
    }

    try {
      const supabase = createClient();
      const { data, error: rpcError } = await supabase.rpc(
        "staff_update_patient_profile",
        {
          p_patient_id: patientId,
          p_display_name: displayName.trim() || null,
          p_age: ageVal,
          p_sex: sex.trim() || null,
          p_height_cm: heightVal,
          p_weight_kg: weightVal,
          p_city: city.trim() || null,
        }
      );
      if (rpcError) {
        setError(rpcError.message);
        return;
      }
      const next = rowFromRpc(data);
      if (next) {
        setProfile(next);
        fillForm(next);
        nameChangeRef.current?.(next.display_name);
      }
      setEditing(false);
      setSavedFlash(true);
      window.setTimeout(() => setSavedFlash(false), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar.");
    } finally {
      setSaving(false);
    }
  }

  const hasAny =
    !!profile?.display_name ||
    profile?.age != null ||
    !!profile?.sex ||
    profile?.height_cm != null ||
    profile?.weight_kg != null ||
    !!profile?.city;

  return (
    <section className="mt-6 rounded-2xl border border-neutral-200 bg-white px-5 py-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-neutral-900">
            Perfil del paciente
          </h2>
          <p className="mt-1 text-xs leading-relaxed text-neutral-500">
            Todos los campos son opcionales. Útil para pacientes que entraron
            solo con código de invitación.
            {profile?.is_guest ? (
              <span className="mt-1 block text-amber-700">
                Cuenta invitada (sin registro completo).
              </span>
            ) : null}
          </p>
        </div>
        {!editing && !loading ? (
          <button
            type="button"
            onClick={() => {
              if (profile) fillForm(profile);
              setEditing(true);
              setError(null);
            }}
            className="rounded-xl border border-neutral-200 px-3 py-1.5 text-xs font-semibold text-neutral-800 transition-colors hover:bg-neutral-50"
          >
            {hasAny ? "Editar" : "Completar perfil"}
          </button>
        ) : null}
      </div>

      {loading ? (
        <p className="mt-4 text-sm text-neutral-500">Cargando perfil…</p>
      ) : null}

      {error ? (
        <p className="mt-3 text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}

      {savedFlash ? (
        <p className="mt-3 text-sm text-emerald-700">Perfil guardado.</p>
      ) : null}

      {!loading && !editing && profile ? (
        hasAny ? (
          <dl className="mt-4 grid gap-3 sm:grid-cols-2">
            <SummaryRow label="Nombre" value={profile.display_name} />
            <SummaryRow
              label="Edad"
              value={profile.age != null ? `${profile.age} años` : null}
            />
            <SummaryRow label="Sexo" value={profile.sex} />
            <SummaryRow
              label="Altura"
              value={
                profile.height_cm != null ? `${profile.height_cm} cm` : null
              }
            />
            <SummaryRow
              label="Peso"
              value={
                profile.weight_kg != null ? `${profile.weight_kg} kg` : null
              }
            />
            <SummaryRow label="Ciudad" value={profile.city} />
            {profile.email ? (
              <SummaryRow label="Email" value={profile.email} />
            ) : null}
            {profile.whatsapp_phone ? (
              <SummaryRow
                label="WhatsApp"
                value={`+${profile.whatsapp_phone}`}
              />
            ) : null}
          </dl>
        ) : (
          <p className="mt-4 text-sm text-neutral-500">
            Aún no hay datos de perfil. Puedes añadir nombre, edad u otros
            datos si los conoces.
          </p>
        )
      ) : null}

      {!loading && editing ? (
        <form onSubmit={(e) => void handleSave(e)} className="mt-4 space-y-4">
          <div>
            <label htmlFor="staff-patient-name" className={labelClass}>
              Nombre
            </label>
            <input
              id="staff-patient-name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Nombre y apellidos"
              autoComplete="name"
              className={inputClass}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="staff-patient-age" className={labelClass}>
                Edad
              </label>
              <input
                id="staff-patient-age"
                type="number"
                inputMode="numeric"
                min={1}
                max={120}
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="Ej. 32"
                className={inputClass}
              />
            </div>
            <div>
              <span className={labelClass}>Sexo</span>
              <div className="mt-1.5 flex flex-wrap gap-2">
                {SEX_OPTIONS.map((opt) => {
                  const active = sex === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setSex(active ? "" : opt)}
                      className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                        active
                          ? "bg-blue-600 text-white"
                          : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="staff-patient-height" className={labelClass}>
                Altura (cm)
              </label>
              <input
                id="staff-patient-height"
                type="number"
                inputMode="decimal"
                value={heightCm}
                onChange={(e) => setHeightCm(e.target.value)}
                placeholder="Opcional"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="staff-patient-weight" className={labelClass}>
                Peso (kg)
              </label>
              <input
                id="staff-patient-weight"
                type="number"
                inputMode="decimal"
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
                placeholder="Opcional"
                className={inputClass}
              />
            </div>
          </div>
          <div>
            <label htmlFor="staff-patient-city" className={labelClass}>
              Ciudad
            </label>
            <input
              id="staff-patient-city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Opcional"
              className={inputClass}
            />
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            <button
              type="submit"
              disabled={saving}
              className="btn-primary px-4 py-2 text-sm disabled:opacity-60"
            >
              {saving ? "Guardando…" : "Guardar"}
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={() => {
                if (profile) fillForm(profile);
                setEditing(false);
                setError(null);
              }}
              className="rounded-xl border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 disabled:opacity-60"
            >
              Cancelar
            </button>
          </div>
        </form>
      ) : null}
    </section>
  );
}

function SummaryRow({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) {
  if (!value) return null;
  return (
    <div>
      <dt className="text-[11px] font-semibold uppercase tracking-wide text-neutral-400">
        {label}
      </dt>
      <dd className="mt-0.5 text-sm text-neutral-900">{value}</dd>
    </div>
  );
}
