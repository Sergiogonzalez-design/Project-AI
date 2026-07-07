"use client";

import { useCallback, useState } from "react";
import { uploadChunksToKnowledgeBase } from "@/lib/admin-upload-client";
import { chunkText } from "@/lib/document-chunking";

async function extractTextFromPdf(file: File): Promise<string> {
  const pdfjsLib = await import("pdfjs-dist");
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

  const buffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
  const pages: string[] = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((item) => ("str" in item ? item.str : ""))
      .join(" ");
    pages.push(pageText);
  }
  return pages.join("\n\n");
}

type UploadStatus = "idle" | "working" | "done" | "error";

type UploadedDoc = { id: string; name: string; chunks: number };

export default function AdminPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [urlInput, setUrlInput] = useState("");
  const [textTitle, setTextTitle] = useState("");
  const [textBody, setTextBody] = useState("");

  const [status, setStatus] = useState<UploadStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [uploaded, setUploaded] = useState<UploadedDoc[]>([]);
  const [progress, setProgress] = useState("");

  const onPdfSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []).filter(
      (f) => f.type === "application/pdf"
    );
    setFiles((prev) => [...prev, ...selected]);
    e.target.value = "";
  }, []);

  async function ingestText(sourceName: string, text: string) {
    const chunks = chunkText(text);
    if (!chunks.length) {
      throw new Error("No hay suficiente texto para procesar.");
    }
    setProgress(`Subiendo "${sourceName}"…`);
    const inserted = await uploadChunksToKnowledgeBase(chunks, sourceName, setProgress);
    setUploaded((prev) => [
      ...prev,
      { id: crypto.randomUUID(), name: sourceName, chunks: inserted },
    ]);
  }

  async function handlePdfUpload() {
    setError(null);
    setStatus("working");

    for (const file of files) {
      try {
        setProgress(`Extrayendo texto de ${file.name}…`);
        const text = await extractTextFromPdf(file);
        await ingestText(file.name, text);
      } catch (err) {
        setError(
          `Error con "${file.name}": ${err instanceof Error ? err.message : String(err)}`
        );
        setStatus("error");
        return;
      }
    }

    setFiles([]);
    setProgress("");
    setStatus("done");
  }

  async function handleUrlUpload() {
    setError(null);
    setStatus("working");
    const url = urlInput.trim();
    if (!url) {
      setError("Introduce una URL.");
      setStatus("error");
      return;
    }

    try {
      setProgress("Descargando página…");
      const res = await fetch("/api/documents/fetch-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = (await res.json()) as {
        text?: string;
        sourceName?: string;
        charCount?: number;
        error?: string;
      };

      if (!res.ok) {
        throw new Error(data.error ?? "No se pudo importar la URL.");
      }

      if (!data.text || !data.sourceName) {
        throw new Error("Respuesta inválida del servidor.");
      }

      setProgress(`Texto extraído (${data.charCount ?? data.text.length} caracteres)…`);
      await ingestText(data.sourceName, data.text);
      setUrlInput("");
      setProgress("");
      setStatus("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setStatus("error");
    }
  }

  async function handleTextUpload() {
    setError(null);
    setStatus("working");

    const title = textTitle.trim();
    const body = textBody.trim();

    if (!title) {
      setError("Indica un título para la fuente.");
      setStatus("error");
      return;
    }
    if (body.length < 80) {
      setError("El texto es demasiado corto (mínimo ~80 caracteres).");
      setStatus("error");
      return;
    }

    try {
      await ingestText(title, body);
      setTextTitle("");
      setTextBody("");
      setProgress("");
      setStatus("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setStatus("error");
    }
  }

  const busy = status === "working";

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
          Gestión de conocimientos IA
        </h1>
        <p className="mt-2 text-sm text-neutral-600">
          Alimenta la base de conocimientos con PDFs, enlaces web o texto.
          Solo tú puedes acceder a esta página.
        </p>
      </div>

      {/* PDF */}
      <section className="mb-10 rounded-2xl border border-neutral-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-neutral-900">PDF</h2>
        <p className="mt-1 text-sm text-neutral-600">
          Protocolos, capítulos exportados o libros en PDF.
        </p>

        <label className="mt-4 flex cursor-pointer flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-neutral-300 bg-neutral-50 px-8 py-10 text-center hover:border-neutral-400 transition-colors">
          <span className="text-3xl">📄</span>
          <span className="text-sm font-medium text-neutral-700">
            Haz clic para seleccionar PDFs
          </span>
          <input
            type="file"
            multiple
            accept=".pdf,application/pdf"
            className="sr-only"
            onChange={onPdfSelect}
            disabled={busy}
          />
        </label>

        {files.length > 0 && (
          <ul className="mt-4 space-y-2">
            {files.map((f, i) => (
              <li
                key={`${i}-${f.name}`}
                className="flex items-center justify-between rounded-lg border border-neutral-200 px-4 py-2.5 text-sm"
              >
                <span className="truncate text-neutral-800">{f.name}</span>
                <button
                  type="button"
                  onClick={() => setFiles((p) => p.filter((_, idx) => idx !== i))}
                  className="ml-4 shrink-0 text-neutral-400 hover:text-red-500"
                  disabled={busy}
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}

        {files.length > 0 && !busy && (
          <button
            type="button"
            onClick={handlePdfUpload}
            className="mt-4 w-full rounded-xl bg-neutral-900 py-3 text-sm font-semibold text-white hover:bg-neutral-800"
          >
            Procesar {files.length} PDF{files.length > 1 ? "s" : ""}
          </button>
        )}
      </section>

      {/* URL */}
      <section className="mb-10 rounded-2xl border border-neutral-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-neutral-900">Enlace web</h2>
        <p className="mt-1 text-sm text-neutral-600">
          Artículos, guías o páginas públicas. Google Books suele dar solo vista
          previa — si falla, exporta a PDF o pega el texto abajo.
        </p>

        <input
          type="url"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          placeholder="https://ejemplo.com/articulo-lesion-hombro"
          className="mt-4 w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-200"
          disabled={busy}
        />

        <button
          type="button"
          onClick={handleUrlUpload}
          disabled={busy || !urlInput.trim()}
          className="mt-4 w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
        >
          Importar enlace
        </button>
      </section>

      {/* Free text */}
      <section className="mb-10 rounded-2xl border border-neutral-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-neutral-900">Texto libre</h2>
        <p className="mt-1 text-sm text-neutral-600">
          Notas, protocolos del hombro, respuestas modelo o contenido copiado de
          un libro.
        </p>

        <label className="mt-4 block text-sm font-medium text-neutral-700">
          Título de la fuente
        </label>
        <input
          type="text"
          value={textTitle}
          onChange={(e) => setTextTitle(e.target.value)}
          placeholder="Ej: Hombro — protocolo impingement"
          className="mt-1 w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-200"
          disabled={busy}
        />

        <label className="mt-4 block text-sm font-medium text-neutral-700">
          Contenido
        </label>
        <textarea
          value={textBody}
          onChange={(e) => setTextBody(e.target.value)}
          placeholder="Pega aquí el texto que quieres que use la IA…"
          rows={8}
          className="mt-1 w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-200"
          disabled={busy}
        />

        <button
          type="button"
          onClick={handleTextUpload}
          disabled={busy || !textTitle.trim() || textBody.trim().length < 80}
          className="mt-4 w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
        >
          Guardar texto
        </button>
      </section>

      {busy && (
        <div className="mb-6 rounded-xl bg-blue-50 px-5 py-4 text-sm text-blue-800">
          <p className="font-semibold">Procesando…</p>
          <p className="mt-1 text-blue-700">{progress}</p>
        </div>
      )}

      {error && (
        <div className="mb-6 rounded-xl bg-red-50 px-5 py-4 text-sm text-red-800">
          {error}
        </div>
      )}

      {status === "done" && !busy && (
        <div className="mb-6 rounded-xl bg-green-50 px-5 py-4 text-sm text-green-800">
          Fuente añadida correctamente a la base de conocimientos.
        </div>
      )}

      {uploaded.length > 0 && (
        <div>
          <h2 className="mb-3 text-sm font-semibold text-neutral-700">
            Subidos en esta sesión
          </h2>
          <ul className="space-y-2">
            {uploaded.map((d) => (
              <li
                key={d.id}
                className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 px-4 py-2.5 text-sm"
              >
                <span className="truncate text-neutral-800">{d.name}</span>
                <span className="ml-4 shrink-0 font-medium text-green-700">
                  {d.chunks} fragmentos
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}
