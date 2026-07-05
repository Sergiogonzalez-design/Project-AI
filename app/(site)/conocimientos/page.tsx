import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

type Article = {
  id: string;
  title: string;
  body: string;
  published_at: string;
};

const CATEGORIES = [
  { label: "Lesiones musculares", emoji: "💪" },
  { label: "Lesiones articulares", emoji: "🦴" },
  { label: "Prevención", emoji: "🛡️" },
  { label: "Recuperación", emoji: "♻️" },
];

async function getArticles(): Promise<Article[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("document_chunks")
      .select("id, source_name, content")
      .order("created_at", { ascending: false })
      .limit(12);
    // Group by source name and show unique sources
    const seen = new Set<string>();
    const sources: Article[] = [];
    for (const row of (data ?? []) as { id: string; source_name: string; content: string }[]) {
      if (!seen.has(row.source_name)) {
        seen.add(row.source_name);
        sources.push({
          id: row.id,
          title: row.source_name,
          body: row.content.slice(0, 200) + "…",
          published_at: new Date().toISOString(),
        });
      }
    }
    return sources;
  } catch {
    return [];
  }
}

export default async function ConocimientosPage() {
  const articles = await getArticles();

  return (
    <div className="flex flex-col">
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-700 to-blue-500 px-6 py-16 text-white">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="mb-3 text-3xl font-bold">Conocimientos</h1>
          <p className="text-blue-100">
            Artículos y protocolos de fisioterapia y medicina deportiva
            para que entiendas mejor tu salud.
          </p>
        </div>
      </section>

      <div className="mx-auto w-full max-w-5xl px-6 py-12">
        {/* Categories */}
        <div className="mb-12 grid gap-4 sm:grid-cols-4">
          {CATEGORIES.map((c) => (
            <div
              key={c.label}
              className="rounded-2xl border border-blue-100 bg-white p-5 text-center shadow-sm"
            >
              <div className="mb-2 text-3xl">{c.emoji}</div>
              <p className="text-sm font-semibold text-slate-700">{c.label}</p>
            </div>
          ))}
        </div>

        {/* Uploaded documents */}
        <h2 className="mb-6 text-xl font-bold text-slate-800">
          Material disponible
        </h2>
        {articles.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-blue-200 bg-white px-8 py-14 text-center text-slate-400">
            <p className="mb-3 text-4xl">📚</p>
            <p className="text-sm">
              Próximamente el equipo publicará documentos y protocolos de
              fisioterapia para que puedas consultar cuando lo necesites.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((a) => (
              <div
                key={a.id}
                className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-xl">
                  📄
                </div>
                <h3 className="mb-2 text-sm font-bold text-slate-800 leading-snug">
                  {a.title}
                </h3>
                <p className="text-xs leading-relaxed text-slate-500 line-clamp-4">
                  {a.body}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 rounded-2xl bg-blue-50 border border-blue-100 px-8 py-8 text-center">
          <p className="mb-2 text-lg font-bold text-slate-800">
            ¿Tienes alguna duda sobre lo que has leído?
          </p>
          <p className="mb-5 text-sm text-slate-500">
            Usa la consulta IA para orientarte de forma personalizada.
          </p>
          <Link
            href="/consulta"
            className="inline-block rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow transition hover:bg-blue-700"
          >
            Ir a Consulta
          </Link>
        </div>
      </div>
    </div>
  );
}
