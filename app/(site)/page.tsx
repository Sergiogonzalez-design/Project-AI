import { createClient } from "@/lib/supabase/server";
import { Bot, ClipboardList, MessagesSquare, Newspaper } from "lucide-react";
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
      <section className="bg-gradient-to-br from-blue-700 to-blue-500 px-4 py-14 text-center text-white sm:px-6 sm:py-24">
        <div className="mx-auto max-w-3xl">
          <div className="mb-5 inline-flex items-center justify-center rounded-2xl bg-white p-3 shadow-lg">
            <Image
              src="/logo-icon.png"
              alt="PhysioGuide AI"
              width={90}
              height={90}
              className="object-contain sm:w-[120px] sm:h-[120px]"
              priority
            />
          </div>
          <h1 className="mb-3 text-3xl font-bold tracking-tight sm:mb-4 sm:text-5xl">
            PhysioGuide AI
          </h1>
          <p className="mb-7 text-base text-blue-100 leading-relaxed sm:mb-8 sm:text-xl">
            Orientación inteligente en fisioterapia y medicina deportiva.
            Entiende tu lesión antes de visitar a tu entrenador atlético.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-4">
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
      <section className="px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-8 text-center text-xl font-bold text-slate-800 sm:mb-10 sm:text-2xl">
            ¿Cómo funciona?
          </h2>
          <div className="grid gap-4 sm:gap-6 sm:grid-cols-3">
            {[
              {
                Icon: ClipboardList,
                title: "Describe tus síntomas",
                desc: "Rellena el formulario de consulta con la zona afectada, el dolor y cómo empezó.",
              },
              {
                Icon: Bot,
                title: "La IA analiza tu caso",
                desc: "Nuestro modelo, entrenado con protocolos de fisioterapia, te orienta de inmediato.",
              },
              {
                Icon: MessagesSquare,
                title: "Continúa la conversación",
                desc: "Haz preguntas adicionales y revisa tus consultas anteriores cuando quieras.",
              },
            ].map((s) => (
              <div
                key={s.title}
                className="rounded-2xl border border-blue-100 bg-white p-6 text-center shadow-sm"
              >
                <div className="mb-4 flex justify-center">
                  <s.Icon className="h-10 w-10 text-blue-600" strokeWidth={1.5} />
                </div>
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
        <div className="mx-auto max-w-3xl rounded-xl border border-amber-200 px-5 py-4 text-center text-sm text-amber-800 flex items-center justify-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          PhysioGuide AI proporciona orientación informativa, no diagnósticos médicos. Ante síntomas graves acude a urgencias o a tu médico.
        </div>
      </section>

      {/* News */}
      <section className="px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-6 text-xl font-bold text-slate-800 sm:mb-8 sm:text-2xl">
            Últimas noticias
          </h2>
          {news.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-blue-200 bg-white px-8 py-14 text-center text-slate-400">
              <Newspaper className="mx-auto mb-3 h-10 w-10 text-blue-200" strokeWidth={1.5} />
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
