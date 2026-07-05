"use client";

import { useCallback, useState } from "react";

const CHUNK_SIZE = 150;
const CHUNK_OVERLAP = 20;

function chunkText(text: string): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const chunks: string[] = [];
  let i = 0;
  while (i < words.length) {
    const chunk = words.slice(i, i + CHUNK_SIZE).join(" ");
    if (chunk.trim()) chunks.push(chunk.trim());
    i += CHUNK_SIZE - CHUNK_OVERLAP;
  }
  return chunks;
}

async function extractTextFromPdf(file: File): Promise<string> {
  // Dynamic import keeps pdfjs out of SSR entirely
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

type UploadStatus = "idle" | "extracting" | "embedding" | "done" | "error";

type UploadedDoc = { name: string; chunks: number };

export default function AdminPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [uploaded, setUploaded] = useState<UploadedDoc[]>([]);
  const [current, setCurrent] = useState("");

  const onDrop = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []).filter((f) =>
      f.type === "application/pdf"
    );
    setFiles((prev) => [...prev, ...selected]);
    e.target.value = "";
  }, []);

  async function handleUpload() {
    setError(null);
    setStatus("extracting");

    for (const file of files) {
      setCurrent(file.name);
      try {
        const text = await extractTextFromPdf(file);
        const chunks = chunkText(text);
        if (!chunks.length) throw new Error("No se pudo extraer texto del PDF.");

        setStatus("embedding");
        // 10 chunks × ~200 tokens = ~2k tokens per request
        // with 3s pause → ~39k tokens/min, safely under the 40k TPM limit
        let totalInserted = 0;
        for (let i = 0; i < chunks.length; i += 10) {
          const batchChunks = chunks.slice(i, i + 10);
          const res = await fetch("/api/documents", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ chunks: batchChunks, sourceName: file.name }),
          });

          if (!res.ok) {
            let errMsg = res.statusText;
            try { errMsg = ((await res.json()) as { error: string }).error ?? errMsg; } catch { /* empty */ }
            throw new Error(errMsg);
          }

          const data = await res.json() as { inserted: number };
          totalInserted += data.inserted;

          // Pause between batches to respect TPM rate limit
          if (i + 10 < chunks.length) {
            await new Promise((r) => setTimeout(r, 3000));
          }
        }

        setUploaded((prev) => [
          ...prev,
          { name: file.name, chunks: totalInserted },
        ]);
      } catch (err) {
        setError(`Error con "${file.name}": ${err instanceof Error ? err.message : String(err)}`);
        setStatus("error");
        return;
      }
    }

    setFiles([]);
    setCurrent("");
    setStatus("done");
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
          Gestión de documentos IA
        </h1>
        <p className="mt-2 text-sm text-neutral-600">
          Sube PDFs para alimentar la base de conocimientos del asistente.
          Solo tú puedes acceder a esta página.
        </p>
      </div>

      {/* Drop zone */}
      <label className="flex cursor-pointer flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-neutral-300 bg-neutral-50 px-8 py-12 text-center hover:border-neutral-400 transition-colors">
        <span className="text-4xl">📄</span>
        <span className="text-sm font-medium text-neutral-700">
          Haz clic para seleccionar PDFs
        </span>
        <span className="text-xs text-neutral-500">
          Solo archivos PDF en español
        </span>
        <input
          type="file"
          multiple
          accept=".pdf,application/pdf"
          className="sr-only"
          onChange={onDrop}
        />
      </label>

      {/* Selected files */}
      {files.length > 0 && (
        <ul className="mt-4 space-y-2">
          {files.map((f, i) => (
            <li
              key={`${i}-${f.name}`}
              className="flex items-center justify-between rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-sm"
            >
              <span className="truncate text-neutral-800">{f.name}</span>
              <button
                type="button"
                onClick={() => setFiles((p) => p.filter((_, idx) => idx !== i))}
                className="ml-4 shrink-0 text-neutral-400 hover:text-red-500"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Upload button */}
      {files.length > 0 && status === "idle" && (
        <button
          type="button"
          onClick={handleUpload}
          className="mt-6 w-full rounded-xl bg-neutral-900 py-3 text-sm font-semibold text-white hover:bg-neutral-800"
        >
          Procesar y subir {files.length} PDF{files.length > 1 ? "s" : ""}
        </button>
      )}

      {/* Status */}
      {(status === "extracting" || status === "embedding") && (
        <div className="mt-6 rounded-xl bg-blue-50 px-5 py-4 text-sm text-blue-800">
          <p className="font-semibold">
            {status === "extracting" ? "Extrayendo texto…" : "Generando embeddings…"}
          </p>
          <p className="mt-1 text-blue-700 truncate">{current}</p>
        </div>
      )}

      {error && (
        <div className="mt-6 rounded-xl bg-red-50 px-5 py-4 text-sm text-red-800">
          {error}
        </div>
      )}

      {status === "done" && (
        <div className="mt-6 rounded-xl bg-green-50 px-5 py-4 text-sm text-green-800">
          ✅ Todos los documentos procesados correctamente.
        </div>
      )}

      {/* Already uploaded */}
      {uploaded.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-3 text-sm font-semibold text-neutral-700">
            Subidos en esta sesión
          </h2>
          <ul className="space-y-2">
            {uploaded.map((d) => (
              <li
                key={d.name}
                className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 px-4 py-2.5 text-sm"
              >
                <span className="truncate text-neutral-800">{d.name}</span>
                <span className="ml-4 shrink-0 text-green-700 font-medium">
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
