"use client";

import { useState } from "react";

export function ConsultaForm() {
  const [form, setForm] = useState({
    area: "",
    start: "",
    type: "",
    pain: 5,
    injury: "",
    description: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === "pain" ? Number(value) : value,
    });
  };

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="mb-2 text-2xl font-semibold tracking-tight text-neutral-900">
        Consulta
      </h1>
      <p className="mb-8 text-neutral-600">Cuéntanos qué te pasa</p>

      <label className="mb-1 block text-sm font-medium text-neutral-800">
        Zona del dolor
      </label>
      <select
        name="area"
        onChange={handleChange}
        className="mb-4 w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-neutral-900"
      >
        <option value="">Selecciona</option>
        <option>Rodilla</option>
        <option>Tobillo</option>
        <option>Espalda baja</option>
        <option>Hombro</option>
      </select>

      <label className="mb-1 block text-sm font-medium text-neutral-800">
        ¿Cuándo empezó?
      </label>
      <select
        name="start"
        onChange={handleChange}
        className="mb-4 w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-neutral-900"
      >
        <option>Hoy</option>
        <option>Hace días</option>
        <option>Hace semanas</option>
        <option>Hace meses</option>
      </select>

      <label className="mb-1 block text-sm font-medium text-neutral-800">
        ¿Cómo empezó?
      </label>
      <select
        name="type"
        onChange={handleChange}
        className="mb-4 w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-neutral-900"
      >
        <option>De repente</option>
        <option>Poco a poco</option>
        <option>Después de deporte</option>
      </select>

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
        ¿Hubo golpe o caída?
      </label>
      <select
        name="injury"
        onChange={handleChange}
        className="mb-4 w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-neutral-900"
      >
        <option>No</option>
        <option>Sí</option>
      </select>

      <label className="mb-1 block text-sm font-medium text-neutral-800">
        Describe lo que sientes
      </label>
      <textarea
        name="description"
        onChange={handleChange}
        placeholder="Ej: dolor al correr, al subir escaleras..."
        rows={4}
        className="mb-6 w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-neutral-900 placeholder:text-neutral-400"
      />

      <button
        type="button"
        onClick={() => console.log(form)}
        className="w-full rounded-lg bg-neutral-900 py-3 text-sm font-medium text-white transition hover:bg-neutral-800"
      >
        Analizar
      </button>
    </div>
  );
}
