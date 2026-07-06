"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  COMPETITIVE_LEVELS,
  CURRENT_SEASONS,
  DOMINANT_FOOT_OPTIONS,
  DOMINANT_HAND_OPTIONS,
  PERFORMANCE_GOALS,
  SEX_OPTIONS,
} from "@/lib/profile-options";
import { createClient } from "@/lib/supabase/client";

const inputClass =
  "w-full rounded-xl border border-blue-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100";

const labelClass = "mb-1.5 block text-sm font-semibold text-slate-700";

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

export function OnboardingForm() {
  const router = useRouter();
  const supabase = createClient();
  const [step, setStep] = useState<1 | 2>(1);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [fullName, setFullName] = useState("");
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

  function toggleGoal(goal: string) {
    setPerformanceGoals((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]
    );
  }

  function validateStep1() {
    if (!fullName.trim()) return "Introduce tu nombre completo.";
    if (!age || Number(age) < 1 || Number(age) > 120) return "Introduce una edad válida.";
    if (!sex) return "Selecciona tu sexo.";
    if (!heightCm || Number(heightCm) < 50) return "Introduce tu altura en cm.";
    if (!weightKg || Number(weightKg) < 20) return "Introduce tu peso en kg.";
    if (!dominantHand) return "Selecciona tu mano dominante.";
    if (!dominantFoot) return "Selecciona tu pie dominante.";
    return null;
  }

  function validateStep2() {
    if (!primarySport.trim()) return "Indica tu deporte principal.";
    if (!competitiveLevel) return "Selecciona tu nivel competitivo.";
    if (!sessionsPerWeek || Number(sessionsPerWeek) < 0)
      return "Indica cuántas sesiones entrenas por semana.";
    if (!hoursPerWeek || Number(hoursPerWeek) < 0)
      return "Indica cuántas horas entrenas por semana.";
    if (!currentSeason) return "Selecciona en qué fase de temporada estás.";
    if (performanceGoals.length === 0)
      return "Selecciona al menos un objetivo de rendimiento.";
    return null;
  }

  async function handleSubmit() {
    const err = validateStep2();
    if (err) {
      setError(err);
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Sesión expirada. Vuelve a iniciar sesión.");

      const { error: saveErr } = await supabase.from("profiles").upsert({
        id: user.id,
        display_name: fullName.trim(),
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
        onboarding_completed: true,
        updated_at: new Date().toISOString(),
      });

      if (saveErr) throw new Error(saveErr.message);

      router.replace("/");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al guardar el perfil.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-lg rounded-2xl border border-blue-100 bg-white px-6 py-8 shadow-sm sm:px-8">
      <div className="mb-6 flex flex-col items-center gap-3 text-center">
        <Image src="/logo.png" alt="PhysioGuide AI" width={56} height={56} className="object-contain" />
        <div>
          <h1 className="text-xl font-bold text-slate-800">
            {step === 1 ? "Información básica" : "Perfil deportivo"}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Paso {step} de 2 — Esto nos ayuda a personalizar tu orientación
          </p>
        </div>
        <div className="flex w-full gap-2">
          <div className={`h-1.5 flex-1 rounded-full ${step >= 1 ? "bg-blue-600" : "bg-blue-100"}`} />
          <div className={`h-1.5 flex-1 rounded-full ${step >= 2 ? "bg-blue-600" : "bg-blue-100"}`} />
        </div>
      </div>

      {step === 1 ? (
        <div className="space-y-5">
          <div>
            <label className={labelClass}>Nombre completo</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Tu nombre y apellidos"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Edad</label>
            <input
              type="number"
              min={1}
              max={120}
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Ej: 22"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Sexo</label>
            <ChipGroup options={SEX_OPTIONS} value={sex} onChange={setSex} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Altura (cm)</label>
              <input
                type="number"
                min={50}
                max={250}
                value={heightCm}
                onChange={(e) => setHeightCm(e.target.value)}
                placeholder="Ej: 175"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Peso (kg)</label>
              <input
                type="number"
                min={20}
                max={300}
                step={0.1}
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
                placeholder="Ej: 70"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Mano dominante</label>
            <ChipGroup
              options={DOMINANT_HAND_OPTIONS}
              value={dominantHand}
              onChange={setDominantHand}
            />
          </div>

          <div>
            <label className={labelClass}>Pie dominante</label>
            <ChipGroup
              options={DOMINANT_FOOT_OPTIONS}
              value={dominantFoot}
              onChange={setDominantFoot}
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="button"
            onClick={() => {
              const err = validateStep1();
              if (err) {
                setError(err);
                return;
              }
              setError(null);
              setStep(2);
            }}
            className="w-full rounded-xl bg-blue-600 py-3.5 text-sm font-bold text-white shadow transition hover:bg-blue-700"
          >
            Continuar
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          <div>
            <label className={labelClass}>Deporte principal</label>
            <input
              type="text"
              value={primarySport}
              onChange={(e) => setPrimarySport(e.target.value)}
              placeholder="Ej: Fútbol, natación, baloncesto…"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Posición (opcional)</label>
            <input
              type="text"
              value={sportPosition}
              onChange={(e) => setSportPosition(e.target.value)}
              placeholder="Ej: Delantero, portero, base…"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Nivel competitivo</label>
            <ChipGroup
              options={COMPETITIVE_LEVELS}
              value={competitiveLevel}
              onChange={setCompetitiveLevel}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Sesiones / semana</label>
              <input
                type="number"
                min={0}
                max={14}
                value={sessionsPerWeek}
                onChange={(e) => setSessionsPerWeek(e.target.value)}
                placeholder="Ej: 4"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Horas / semana</label>
              <input
                type="number"
                min={0}
                max={40}
                step={0.5}
                value={hoursPerWeek}
                onChange={(e) => setHoursPerWeek(e.target.value)}
                placeholder="Ej: 8"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Temporada actual</label>
            <ChipGroup
              options={CURRENT_SEASONS}
              value={currentSeason}
              onChange={setCurrentSeason}
            />
          </div>

          <div>
            <label className={labelClass}>Objetivos de rendimiento</label>
            <p className="mb-2 text-xs text-slate-500">Puedes seleccionar varios</p>
            <div className="flex flex-wrap gap-2">
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

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => { setStep(1); setError(null); }}
              className="flex-1 rounded-xl border border-blue-200 py-3.5 text-sm font-semibold text-blue-600 hover:bg-blue-50"
            >
              Atrás
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 rounded-xl bg-blue-600 py-3.5 text-sm font-bold text-white shadow transition hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? "Guardando…" : "Finalizar"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
