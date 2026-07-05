"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function ConsultaForm() {
  const [form, setForm] = useState({
    area: "",
    start: "Hoy",
    startCount: "",
    type: "",
    pain: 5,
    injury: "No",
    injuryDetail: "",
    description: "",
  });
  const [status, setStatus] = useState<
    "idle" | "saving" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    if (name === "start") {
      setForm({
        ...form,
        start: value,
        startCount: value === "Hoy" ? "" : form.startCount,
      });
      return;
    }
    if (name === "injury") {
      setForm({
        ...form,
        injury: value,
        injuryDetail: value === "No" ? "" : form.injuryDetail,
      });
      return;
    }
    setForm({
      ...form,
      [name]: name === "pain" ? Number(value) : value,
    });
  };

  function buildStartedWhen():
    | { ok: true; value: string }
    | { ok: false; message: string } {
    if (form.start === "Hoy") {
      return { ok: true, value: "Hoy" };
    }
    const raw = form.startCount.trim();
    const n = parseInt(raw, 10);
    if (!Number.isFinite(n) || n < 1) {
      return {
        ok: false,
        message:
          "Indica cuántos días, semanas o meses (un número mayor que cero).",
      };
    }
    if (form.start === "Hace días") {
      return {
        ok: true,
        value: n === 1 ? "Hace 1 día" : `Hace ${n} días`,
      };
    }
    if (form.start === "Hace semanas") {
      return {
        ok: true,
        value: n === 1 ? "Hace 1 semana" : `Hace ${n} semanas`,
      };
    }
    if (form.start === "Hace meses") {
      return {
        ok: true,
        value: n === 1 ? "Hace 1 mes" : `Hace ${n} meses`,
      };
    }
    return { ok: true, value: form.start };
  }

  async function handleSubmit() {
    setErrorMessage(null);

    const started = buildStartedWhen();
    if (!started.ok) {
      setStatus("error");
      setErrorMessage(started.message);
      return;
    }

    const zona = form.area.trim();
    if (!zona) {
      setStatus("error");
      setErrorMessage("Indica la zona del dolor.");
      return;
    }

    const detalle = form.type.trim();
    if (!detalle) {
      setStatus("error");
      setErrorMessage(
        "Por favor, explica en detalle cómo empezó el problema."
      );
      return;
    }

    if (form.injury === "Sí" && !form.injuryDetail.trim()) {
      setStatus("error");
      setErrorMessage(
        "Describe el golpe, la caída o el gesto brusco."
      );
      return;
    }

    setStatus("saving");

    const hadTrauma =
      form.injury === "No"
        ? "No"
        : `Sí: ${form.injuryDetail.trim()}`;

    const supabase = createClient();
    const { error } = await supabase.from("consultas").insert({
      body_area: zona,
      started_when: started.value,
      onset_type: detalle,
      pain_level: form.pain,
      had_trauma: hadTrauma,
      description: form.description.trim() || null,
    });

    if (error) {
      setStatus("error");
      setErrorMessage(error.message);
      return;
    }

    // Call the RAG AI endpoint
    try {
      const res = await fetch("/api/ai/consult", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bodyArea: zona,
          onsetType: detalle,
          painLevel: form.pain,
          hadTrauma,
          description: form.description.trim() || "",
        }),
      });
      if (res.ok) {
        const data = await res.json() as { answer: string };
        setAiAnswer(data.answer);
      }
    } catch {
      // AI response is optional — form save already succeeded
    }

    setStatus("success");
  }

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="mb-2 text-2xl font-semibold tracking-tight text-neutral-900">
        Consulta
      </h1>
      <p className="mb-8 max-w-xl text-neutral-600 leading-relaxed">
        Cuéntanos qué te pasa, nuestra IA analizará la información y te ayudará a
        hacerte una idea de lo que puedes llegar a tener.
      </p>

      <label className="mb-1 block text-sm font-medium text-neutral-800">
        Zona del dolor
      </label>
      <textarea
        name="area"
        value={form.area}
        onChange={handleChange}
        placeholder="Ej: rodilla derecha, espalda baja, hombro al levantar el brazo…"
        rows={3}
        className="mb-4 w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-neutral-900 placeholder:text-neutral-400"
      />

      <label className="mb-1 block text-sm font-medium text-neutral-800">
        ¿Cuándo empezó?
      </label>
      <select
        name="start"
        value={form.start}
        onChange={handleChange}
        className="mb-4 w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-neutral-900"
      >
        <option>Hoy</option>
        <option>Hace días</option>
        <option>Hace semanas</option>
        <option>Hace meses</option>
      </select>

      {form.start !== "Hoy" && (
        <>
          <label className="mb-1 block text-sm font-medium text-neutral-800">
            {form.start === "Hace días" && "¿Cuántos días?"}
            {form.start === "Hace semanas" && "¿Cuántas semanas?"}
            {form.start === "Hace meses" && "¿Cuántos meses?"}
          </label>
          <input
            type="number"
            name="startCount"
            min={1}
            step={1}
            inputMode="numeric"
            value={form.startCount}
            onChange={handleChange}
            placeholder="Ej: 3"
            className="mb-4 w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-neutral-900 placeholder:text-neutral-400"
          />
        </>
      )}

      <label className="mb-1 block text-sm font-medium text-neutral-800">
        ¿Cómo empezó? Explícalo en detalle.
      </label>
      <textarea
        name="type"
        value={form.type}
        onChange={handleChange}
        placeholder="Ej: de repente al levantar peso, poco a poco al trabajar sentado, después de correr…"
        rows={4}
        className="mb-4 w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-neutral-900 placeholder:text-neutral-400"
      />

      <label className="mb-1 block text-sm font-medium text-neutral-800">
        Nivel de dolor: {form.pain}
      </label>
      <input
        type="range"
        min={1}
        max={10}
        name="pain"
        value={form.pain}
        onChange={handleChange}
        className="mb-6 w-full accent-neutral-900"
      />

      <label className="mb-1 block text-sm font-medium text-neutral-800">
        ¿Hubo golpe, caída o gesto brusco?
      </label>
      <select
        name="injury"
        value={form.injury}
        onChange={handleChange}
        className="mb-4 w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-neutral-900"
      >
        <option>No</option>
        <option>Sí</option>
      </select>

      {form.injury === "Sí" && (
        <>
          <label className="mb-1 block text-sm font-medium text-neutral-800">
            Explica qué pasó (golpe, caída o gesto brusco)
          </label>
          <textarea
            name="injuryDetail"
            value={form.injuryDetail}
            onChange={handleChange}
            placeholder="Ej: caída en escaleras, golpe en el partido, giro brusco al levantar peso…"
            rows={3}
            className="mb-4 w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-neutral-900 placeholder:text-neutral-400"
          />
        </>
      )}

      <label className="mb-1 block text-sm font-medium text-neutral-800">
        Describe lo que sientes
      </label>
      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Ej: dolor al correr, al subir escaleras..."
        rows={4}
        className="mb-6 w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-neutral-900 placeholder:text-neutral-400"
      />

      {status === "error" && errorMessage && (
        <p className="mb-4 text-sm text-red-600" role="alert">
          {errorMessage}
        </p>
      )}
      {status === "success" && !aiAnswer && (
        <p className="mb-4 text-sm text-green-700" role="status">
          Consulta guardada. Analizando con IA…
        </p>
      )}
      {status === "success" && aiAnswer && (
        <div className="mb-6 rounded-xl border border-blue-100 bg-blue-50 px-5 py-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-blue-600">
            Orientación IA
          </p>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-neutral-800">
            {aiAnswer}
          </p>
          <p className="mt-3 text-xs text-neutral-500">
            ⚠️ Esta orientación no sustituye la valoración de un profesional.
          </p>
        </div>
      )}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={status === "saving"}
        className="w-full rounded-lg bg-neutral-900 py-3 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "saving" ? "Guardando…" : "Analizar"}
      </button>
    </div>
  );
}
