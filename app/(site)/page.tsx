import { createClient } from "@/lib/supabase/server";
import Image from "next/image";
import Link from "next/link";

type NewsPost = {
  id: string;
  title: string;
  body: string;
  published_at: string;
};

async function getNews(): Promise<NewsPost[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("news")
      .select("id, title, body, published_at")
      .order("published_at", { ascending: false })
      .limit(6);
    return (data as NewsPost[]) ?? [];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const news = await getNews();

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-700 to-blue-500 px-6 py-24 text-center text-white">
        <div className="mx-auto max-w-3xl">
          <div className="mb-6 inline-flex items-center justify-center">
            <Image
              src="/logo.png"
              alt="PhysioGuide AI"
              width={120}
              height={120}
              className="object-contain drop-shadow-lg mix-blend-multiply"
              priority
            />
          </div>
          <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
            PhysioGuide AI
          </h1>
          <p className="mb-8 text-lg text-blue-100 leading-relaxed sm:text-xl">
            Orientación inteligente en fisioterapia y medicina deportiva.
            Entiende tu lesión antes de visitar a tu entrenador atlético.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/consulta"
              className="rounded-xl bg-white px-6 py-3 text-base font-semibold text-blue-700 shadow transition hover:bg-blue-50"
            >
              Iniciar consulta
            </Link>
            <Link
              href="/sobre-nosotros"
              className="rounded-xl border border-white/40 px-6 py-3 text-base font-semibold text-white transition hover:bg-white/10"
            >
              Conocer el equipo
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-10 text-center text-2xl font-bold text-slate-800">
            ¿Cómo funciona?
          </h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              {
                icon: "📝",
                title: "Describe tus síntomas",
                desc: "Rellena el formulario de consulta con la zona afectada, el dolor y cómo empezó.",
              },
              {
                icon: "🤖",
                title: "La IA analiza tu caso",
                desc: "Nuestro modelo, entrenado con protocolos de fisioterapia, te orienta de inmediato.",
              },
              {
                icon: "💬",
                title: "Continúa la conversación",
                desc: "Haz preguntas adicionales y revisa tus consultas anteriores cuando quieras.",
              },
            ].map((s) => (
              <div
                key={s.title}
                className="rounded-2xl border border-blue-100 bg-white p-6 text-center shadow-sm"
              >
                <div className="mb-4 text-4xl">{s.icon}</div>
                <h3 className="mb-2 text-base font-semibold text-slate-800">
                  {s.title}
                </h3>
                <p className="text-sm leading-relaxed text-slate-500">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="bg-amber-50 px-6 py-6">
        <div className="mx-auto max-w-3xl rounded-xl border border-amber-200 px-5 py-4 text-center text-sm text-amber-800">
          ⚠️ PhysioGuide AI proporciona orientación informativa, no diagnósticos médicos. Ante síntomas graves acude a urgencias o a tu médico.
        </div>
      </section>

      {/* News */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-8 text-2xl font-bold text-slate-800">
            Últimas noticias
          </h2>
          {news.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-blue-200 bg-white px-8 py-14 text-center text-slate-400">
              <p className="text-4xl mb-3">📰</p>
              <p className="text-sm">Próximamente publicaremos novedades y artículos del equipo.</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {news.map((post) => (
                <article
                  key={post.id}
                  className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm"
                >
                  <time className="text-xs font-medium text-blue-500">
                    {new Date(post.published_at).toLocaleDateString("es-ES", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </time>
                  <h3 className="mt-2 text-base font-semibold text-slate-800 leading-snug">
                    {post.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500 line-clamp-3">
                    {post.body}
                  </p>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
