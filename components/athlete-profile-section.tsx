"use client";

import { createClient } from "@/lib/supabase/client";
import {
  COMPETITIVE_LEVELS,
  CURRENT_SEASONS,
  DOMINANT_FOOT_OPTIONS,
  DOMINANT_HAND_OPTIONS,
  PERFORMANCE_GOALS,
  SEX_OPTIONS,
} from "@/lib/profile-options";
import { Check, Loader2, Pencil, X } from "lucide-react";
import { useEffect, useState } from "react";

const inputClass =
  "w-full rounded-xl border border-blue-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100";

const labelClass = "mb-1.5 block text-sm font-semibold text-slate-700";

type ProfileData = {
  age: number | null;
  sex: string | null;
  height_cm: number | null;
  weight_kg: number | null;
  dominant_hand: string | null;
  dominant_foot: string | null;
  primary_sport: string | null;
  sport_position: string | null;
  competitive_level: string | null;
  sessions_per_week: number | null;
  hours_per_week: number | null;
  current_season: string | null;
  performance_goals: string[] | null;
};

function ChipGroup({
  options,
  value,
  onChange,
}: {
  options: readonly string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
            value === opt
              ? "border-blue-600 bg-blue-600 text-white"
              : "border-blue-200 bg-white text-slate-600 hover:border-blue-400"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null;
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
      <dt className="text-xs font-medium text-slate-500">{label}</dt>
      <dd className="text-sm font-medium text-slate-800 sm:text-right">{value}</dd>
    </div>
  );
}

export function AthleteProfileSection() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState("");
  const [profile, setProfile] = useState<ProfileData | null>(null);

  const [age, setAge] = useState("");
  const [sex, setSex] = useState("");
  const [heightCm, setHeightCm] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [dominantHand, setDominantHand] = useState("");
  const [dominantFoot, setDominantFoot] = useState("");
  const [primarySport, setPrimarySport] = useState("");
  const [sportPosition, setSportPosition] = useState("");
  const [competitiveLevel, setCompetitiveLevel] = useState("");
  const [sessionsPerWeek, setSessionsPerWeek] = useState("");
  const [hoursPerWeek, setHoursPerWeek] = useState("");
  const [currentSeason, setCurrentSeason] = useState("");
  const [performanceGoals, setPerformanceGoals] = useState<string[]>([]);

  function populateForm(data: ProfileData) {
    setAge(data.age?.toString() ?? "");
    setSex(data.sex ?? "");
    setHeightCm(data.height_cm?.toString() ?? "");
    setWeightKg(data.weight_kg?.toString() ?? "");
    setDominantHand(data.dominant_hand ?? "");
    setDominantFoot(data.dominant_foot ?? "");
    setPrimarySport(data.primary_sport ?? "");
    setSportPosition(data.sport_position ?? "");
    setCompetitiveLevel(data.competitive_level ?? "");
    setSessionsPerWeek(data.sessions_per_week?.toString() ?? "");
    setHoursPerWeek(data.hours_per_week?.toString() ?? "");
    setCurrentSeason(data.current_season ?? "");
    setPerformanceGoals(data.performance_goals ?? []);
  }

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);

      const { data } = await supabase
        .from("profiles")
        .select(
          "age, sex, height_cm, weight_kg, dominant_hand, dominant_foot, primary_sport, sport_position, competitive_level, sessions_per_week, hours_per_week, current_season, performance_goals"
        )
        .eq("id", user.id)
        .single();

      if (data) {
        setProfile(data as ProfileData);
        populateForm(data as ProfileData);
      }
      setLoading(false);
    }
    load();
  }, []);

  function toggleGoal(goal: string) {
    setPerformanceGoals((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]
    );
  }

  function validate() {
    if (!age || Number(age) < 1) return "Introduce una edad válida.";
    if (!sex) return "Selecciona tu sexo.";
    if (!heightCm || Number(heightCm) < 50) return "Introduce tu altura.";
    if (!weightKg || Number(weightKg) < 20) return "Introduce tu peso.";
    if (!dominantHand) return "Selecciona tu mano dominante.";
    if (!dominantFoot) return "Selecciona tu pie dominante.";
    if (!primarySport.trim()) return "Indica tu deporte principal.";
    if (!competitiveLevel) return "Selecciona tu nivel competitivo.";
    if (!sessionsPerWeek) return "Indica tus sesiones por semana.";
    if (!hoursPerWeek) return "Indica tus horas por semana.";
    if (!currentSeason) return "Selecciona la temporada actual.";
    if (performanceGoals.length === 0) return "Selecciona al menos un objetivo.";
    return null;
  }

  async function handleSave() {
    const err = validate();
    if (err) {
      setError(err);
      return;
    }

    setError(null);
    setSaving(true);
    try {
      const updated: ProfileData = {
        age: Number(age),
        sex,
        height_cm: Number(heightCm),
        weight_kg: Number(weightKg),
        dominant_hand: dominantHand,
        dominant_foot: dominantFoot,
        primary_sport: primarySport.trim(),
        sport_position: sportPosition.trim() || null,
        competitive_level: competitiveLevel,
        sessions_per_week: Number(sessionsPerWeek),
        hours_per_week: Number(hoursPerWeek),
        current_season: currentSeason,
        performance_goals: performanceGoals,
      };

      const { error: saveErr } = await supabase
        .from("profiles")
        .update({ ...updated, updated_at: new Date().toISOString() })
        .eq("id", userId);

      if (saveErr) throw new Error(saveErr.message);

      setProfile(updated);
      setEditing(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al guardar.");
    } finally {
      setSaving(false);
    }
  }

  function handleCancel() {
    if (profile) populateForm(profile);
    setEditing(false);
    setError(null);
  }

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
      </div>
    );
  }

  const hasData = profile?.primary_sport || profile?.age;

  return (
    <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Perfil deportivo</h2>
          <p className="mt-1 text-sm text-slate-500">
            Información que usa la IA para personalizar tus consultas.
          </p>
        </div>
        {!editing && (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="flex shrink-0 items-center gap-1.5 rounded-lg border border-blue-200 px-3 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50"
          >
            <Pencil className="h-4 w-4" />
            {hasData ? "Editar" : "Completar"}
          </button>
        )}
      </div>

      {!editing ? (
        hasData ? (
          <dl className="space-y-4 divide-y divide-slate-100">
            <div className="space-y-3 pb-4">
              <p className="text-xs font-bold uppercase tracking-wide text-blue-600">
                Información básica
              </p>
              <SummaryRow label="Edad" value={profile?.age ? `${profile.age} años` : null} />
              <SummaryRow label="Sexo" value={profile?.sex} />
              <SummaryRow
                label="Altura / Peso"
                value={
                  profile?.height_cm && profile?.weight_kg
                    ? `${profile.height_cm} cm · ${profile.weight_kg} kg`
                    : null
                }
              />
              <SummaryRow label="Mano dominante" value={profile?.dominant_hand} />
              <SummaryRow label="Pie dominante" value={profile?.dominant_foot} />
            </div>

            <div className="space-y-3 pt-4">
              <p className="text-xs font-bold uppercase tracking-wide text-blue-600">
                Deporte y entrenamiento
              </p>
              <SummaryRow label="Deporte" value={profile?.primary_sport} />
              <SummaryRow label="Posición" value={profile?.sport_position} />
              <SummaryRow label="Nivel" value={profile?.competitive_level} />
              <SummaryRow
                label="Entrenamiento"
                value={
                  profile?.sessions_per_week != null && profile?.hours_per_week != null
                    ? `${profile.sessions_per_week} sesiones · ${profile.hours_per_week} h/semana`
                    : null
                }
              />
              <SummaryRow label="Temporada" value={profile?.current_season} />
              {profile?.performance_goals && profile.performance_goals.length > 0 && (
                <div>
                  <p className="mb-2 text-xs font-medium text-slate-500">Objetivos</p>
                  <div className="flex flex-wrap gap-2">
                    {profile.performance_goals.map((goal) => (
                      <span
                        key={goal}
                        className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700"
                      >
                        {goal}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </dl>
        ) : (
          <p className="text-sm text-slate-500">
            Aún no has completado tu perfil deportivo. Haz clic en &quot;Completar&quot; para
            añadir tu información.
          </p>
        )
      ) : (
        <div className="space-y-6">
          <div className="space-y-4">
            <p className="text-sm font-bold text-slate-700">Información básica</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Edad</label>
                <input type="number" value={age} onChange={(e) => setAge(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Sexo</label>
                <ChipGroup options={SEX_OPTIONS} value={sex} onChange={setSex} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Altura (cm)</label>
                <input type="number" value={heightCm} onChange={(e) => setHeightCm(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Peso (kg)</label>
                <input type="number" value={weightKg} onChange={(e) => setWeightKg(e.target.value)} className={inputClass} />
              </div>
            </div>
            <div>
              <label className={labelClass}>Mano dominante</label>
              <ChipGroup options={DOMINANT_HAND_OPTIONS} value={dominantHand} onChange={setDominantHand} />
            </div>
            <div>
              <label className={labelClass}>Pie dominante</label>
              <ChipGroup options={DOMINANT_FOOT_OPTIONS} value={dominantFoot} onChange={setDominantFoot} />
            </div>
          </div>

          <div className="space-y-4 border-t border-slate-100 pt-6">
            <p className="text-sm font-bold text-slate-700">Perfil deportivo</p>
            <div>
              <label className={labelClass}>Deporte principal</label>
              <input type="text" value={primarySport} onChange={(e) => setPrimarySport(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Posición (opcional)</label>
              <input type="text" value={sportPosition} onChange={(e) => setSportPosition(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Nivel competitivo</label>
              <ChipGroup options={COMPETITIVE_LEVELS} value={competitiveLevel} onChange={setCompetitiveLevel} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Sesiones / semana</label>
                <input type="number" value={sessionsPerWeek} onChange={(e) => setSessionsPerWeek(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Horas / semana</label>
                <input type="number" value={hoursPerWeek} onChange={(e) => setHoursPerWeek(e.target.value)} className={inputClass} />
              </div>
            </div>
            <div>
              <label className={labelClass}>Temporada actual</label>
              <ChipGroup options={CURRENT_SEASONS} value={currentSeason} onChange={setCurrentSeason} />
            </div>
            <div>
              <label className={labelClass}>Objetivos de rendimiento</label>
              <div className="mt-2 flex flex-wrap gap-2">
                {PERFORMANCE_GOALS.map((goal) => (
                  <button
                    key={goal}
                    type="button"
                    onClick={() => toggleGoal(goal)}
                    className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                      performanceGoals.includes(goal)
                        ? "border-blue-600 bg-blue-600 text-white"
                        : "border-blue-200 bg-white text-slate-600 hover:border-blue-400"
                    }`}
                  >
                    {goal}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              <X className="h-4 w-4" />
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-blue-600 py-3 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : saved ? (
                <><Check className="h-4 w-4" /> Guardado</>
              ) : (
                "Guardar cambios"
              )}
            </button>
          </div>
        </div>
      )}

      {saved && !editing && (
        <p className="mt-4 flex items-center gap-1.5 text-sm text-green-600">
          <Check className="h-4 w-4" />
          Perfil deportivo actualizado.
        </p>
      )}
    </div>
  );
}
