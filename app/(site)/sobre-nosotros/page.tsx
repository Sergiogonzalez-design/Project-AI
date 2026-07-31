import { createClient } from "@/lib/supabase/server";
import { Bot, ClipboardList, MessagesSquare, Newspaper } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type NewsPost = {
  id: string;
  title: string;
  body: string;
  published_at: string;
  image_url: string | null;
};

const TEAM = [
  {
    name: "David Ramirez Moreno",
    role: "Entrenador Atlético",
    initials: "DR",
    bio: "Especialista en medicina deportiva y prevención de lesiones. Acompaña a atletas en su proceso de recuperación con un enfoque integral y personalizado.",
    credentials: ["Certificado NATA", "Especialista en rehabilitación deportiva", "Medicina preventiva"],
    color: "from-blue-600 to-blue-400",
  },
  {
    name: "Sergio Gonzalez Fernandez",
    role: "Fisioterapeuta & Desarrollador de Kinora",
    initials: "SG",
    bio: "Fisioterapeuta apasionado por la tecnología aplicada a la salud. Lidera el desarrollo de Kinora para democratizar el acceso a la orientación en fisioterapia.",
    credentials: ["Grado en Fisioterapia", "Especialista en tecnología médica", "Desarrollo de herramientas IA en salud"],
    color: "from-blue-500 to-cyan-400",
  },
];

const VALUES = [
  { icon: "🎯", title: "Precisión", desc: "Información basada en protocolos clínicos actualizados." },
  { icon: "🤝", title: "Accesibilidad", desc: "Orientación de calidad al alcance de cualquier persona." },
  { icon: "🔒", title: "Privacidad", desc: "Tus datos y consultas son completamente privados y seguros." },
  { icon: "🌱", title: "Mejora continua", desc: "Actualizamos constantemente nuestra base de conocimientos." },
];

async function getNews(): Promise<NewsPost[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("news")
      .select("id, title, body, published_at, image_url")
      .order("published_at", { ascending: false })
      .limit(6);
    return (data as NewsPost[]) ?? [];
  } catch {
    return [];
  }
}

export default async function SobreNosotrosPage() {
  const news = await getNews();

  return (
    <div className="flex flex-col">
      {/* Hero (from Inicio) */}
      <section className="bg-gradient-to-br from-blue-700 to-blue-500 px-4 py-14 text-center text-white sm:px-6 sm:py-24">
        <div className="mx-auto max-w-3xl">
          <div className="mb-5 inline-flex items-center justify-center rounded-2xl bg-white p-3 shadow-lg">
            <Image
              src="/logo-icon.png"
              alt="Kinora"
              width={90}
              height={90}
              className="object-contain sm:h-[120px] sm:w-[120px]"
              priority
            />
          </div>
          <h1 className="mb-3 text-3xl font-bold tracking-tight sm:mb-4 sm:text-5xl">
            Kinora
          </h1>
          <p className="text-base leading-relaxed text-blue-100 sm:text-xl">
            Orientación inteligente en fisioterapia y medicina deportiva.
            Entiende tu lesión antes de visitar a tu entrenador atlético.
          </p>
        </div>
      </section>

      {/* How it works (from Inicio) */}
      <section className="px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-8 text-center text-xl font-bold text-slate-800 sm:mb-10 sm:text-2xl">
            ¿Cómo funciona?
          </h2>
          <div className="grid gap-4 sm:grid-cols-3 sm:gap-6">
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
            ].map((s, idx) => (
              <div
                key={s.title}
                className="group relative overflow-visible rounded-3xl border border-emerald-200/60 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100">
                  <div className="absolute -top-24 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-gradient-to-br from-emerald-200/60 via-teal-200/30 to-transparent blur-2xl" />
                  <div className="absolute -bottom-24 right-10 h-52 w-52 rounded-full bg-gradient-to-tr from-blue-100/55 via-emerald-100/35 to-transparent blur-2xl" />
                </div>

                <div className="relative flex aspect-square flex-col items-center justify-between text-center">
                  <div className="flex flex-col items-center">
                    <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-50 text-emerald-800 shadow-sm">
                      <s.Icon className="h-6 w-6" strokeWidth={1.8} />
                    </div>
                    <h3 className="text-base font-semibold text-slate-900 sm:text-[15px]">
                      {s.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">{s.desc}</p>
                  </div>

                  <div className="mt-6 flex items-center gap-1 text-xs font-semibold text-blue-700/80">
                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-800 ring-1 ring-emerald-100">
                      Paso {idx + 1}
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-500">Rápido y guiado</span>
                  </div>
                </div>

                {idx < 2 && (
                  <div className="pointer-events-none absolute right-0 top-1/2 hidden -translate-y-1/2 translate-x-1/2 sm:block">
                    <div className="rounded-full bg-white p-1 shadow-sm ring-1 ring-emerald-200/70">
                      <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
                        <path d="M4 12h12" stroke="rgb(16 185 129)" strokeWidth="2" strokeLinecap="round" />
                        <path
                          d="M13 7l5 5-5 5"
                          stroke="rgb(16 185 129)"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="mt-10 text-center sm:mt-12">
            <Link
              href="/consulta"
              className="inline-block rounded-xl bg-blue-600 px-8 py-3.5 text-base font-semibold text-white shadow-md transition hover:bg-blue-700"
            >
              Iniciar consulta
            </Link>
          </div>
        </div>
      </section>

      {/* Disclaimer (from Inicio) */}
      <section className="bg-amber-50 px-6 py-6">
        <div className="mx-auto flex max-w-3xl items-center justify-center gap-2 rounded-xl border border-amber-200 px-5 py-4 text-center text-sm text-amber-800">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          Kinora proporciona orientación informativa, no diagnósticos médicos. Ante síntomas graves acude a urgencias o a tu médico.
        </div>
      </section>

      {/* News (from Inicio) */}
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
            <div className="flex flex-col gap-4">
              {news.map((post) => (
                <Link
                  key={post.id}
                  href={`/sobre-nosotros/noticia/${post.id}`}
                  className="flex w-full gap-5 rounded-2xl border border-blue-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md sm:p-6"
                >
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-blue-50 ring-1 ring-blue-100 sm:h-20 sm:w-20">
                    {post.image_url ? (
                      <Image
                        src={post.image_url}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="80px"
                        unoptimized
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <Newspaper className="h-6 w-6 text-blue-300" strokeWidth={1.5} />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <time className="text-xs font-medium text-blue-500">
                      {new Date(post.published_at).toLocaleDateString("es-ES", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </time>
                    <h3 className="mt-1 text-lg font-semibold leading-snug text-slate-800">
                      {post.title}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-slate-500 sm:text-base">
                      {post.body}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Mission */}
      <section className="bg-white px-4 py-10 sm:px-6 sm:py-14">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-xl font-bold text-slate-800 sm:text-2xl">Nuestra misión</h2>
          <p className="text-base leading-relaxed text-slate-500 sm:text-lg">
            Kinora nació con la idea de que cualquier persona debería poder
            recibir una primera orientación de calidad sobre sus síntomas musculoesqueléticos,
            sin importar dónde se encuentre o qué hora es. Combinamos la experiencia clínica
            de profesionales con el poder de la inteligencia artificial para ofrecerte
            información clara, precisa y segura.
          </p>
        </div>
      </section>

      {/* Team */}
      <section className="bg-slate-50 px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-8 text-center text-xl font-bold text-slate-800 sm:mb-10 sm:text-2xl">
            El equipo
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 sm:gap-8">
            {TEAM.map((member) => (
              <div
                key={member.name}
                className="relative overflow-hidden rounded-3xl border border-blue-100 bg-white p-8 shadow-sm"
              >
                <div className={`mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br ${member.color} text-2xl font-bold text-white shadow`}>
                  {member.initials}
                </div>

                <h3 className="text-xl font-bold text-slate-800">{member.name}</h3>
                <p className="mt-1 text-sm font-medium text-blue-600">{member.role}</p>
                <p className="mt-4 text-sm leading-relaxed text-slate-500">{member.bio}</p>

                <ul className="mt-5 space-y-1.5">
                  {member.credentials.map((c) => (
                    <li key={c} className="flex items-center gap-2 text-xs text-slate-600">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-white px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-8 text-center text-xl font-bold text-slate-800 sm:mb-10 sm:text-2xl">
            Nuestros valores
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {VALUES.map((v) => (
              <div key={v.title} className="rounded-2xl border border-blue-100 p-6 text-center">
                <div className="mb-3 text-3xl">{v.icon}</div>
                <h3 className="mb-2 text-sm font-bold text-slate-800">{v.title}</h3>
                <p className="text-xs leading-relaxed text-slate-500">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="bg-gradient-to-br from-blue-700 to-blue-500 px-4 py-12 text-center text-white sm:px-6 sm:py-14">
        <div className="mx-auto max-w-xl">
          <h2 className="mb-3 text-2xl font-bold">¿Quieres contactarnos?</h2>
          <p className="mb-6 text-blue-100">
            Si eres profesional y quieres colaborar, o simplemente tienes una pregunta, escríbenos.
          </p>
          <a
            href="mailto:sergiogonzalez.usa@icloud.com"
            className="inline-block rounded-xl bg-white px-6 py-3 text-sm font-bold text-blue-700 shadow transition hover:bg-blue-50"
          >
            Contactar al equipo
          </a>
        </div>
      </section>
    </div>
  );
}
