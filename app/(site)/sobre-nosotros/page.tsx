import { createClient } from "@/lib/supabase/server";
import { ContactInquiryForm } from "@/components/contact-inquiry-form";
import {
  ArrowRight,
  Bot,
  ClipboardList,
  Clock,
  HeartPulse,
  Lock,
  MessagesSquare,
  Newspaper,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
  Zap,
} from "lucide-react";
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
    role: "Fisioterapeuta",
    initials: "DR",
    bio: "Fisioterapeuta especializado en medicina deportiva y prevención de lesiones. Acompaña a pacientes y atletas en su recuperación con un enfoque clínico integral y personalizado.",
    credentials: [
      "Grado en Fisioterapia",
      "Especialista en rehabilitación deportiva",
      "Prevención y readaptación de lesiones",
    ],
    accent: "from-blue-600 to-indigo-500",
  },
  {
    name: "Sergio Gonzalez Fernandez",
    role: "Desarrollador",
    initials: "SG",
    bio: "Desarrollador de AIKinora. Diseña y construye la plataforma para que la orientación en fisioterapia sea clara, accesible y segura gracias a la tecnología y la inteligencia artificial.",
    credentials: [
      "Desarrollo de producto y software",
      "Especialista en tecnología aplicada a la salud",
      "Herramientas de IA para orientación clínica",
    ],
    accent: "from-cyan-500 to-blue-500",
  },
];

const STEPS = [
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
];

const BENEFITS = [
  {
    Icon: Zap,
    title: "Entiende tu molestia al instante",
    desc: "Comprende qué puede estar pasando de forma rápida y clara, sin tecnicismos innecesarios.",
    wide: true,
  },
  {
    Icon: Clock,
    title: "Ahorra tiempo y dinero",
    desc: "Sabe cuándo conviene acudir al entrenador o médico y evita visitas innecesarias.",
  },
  {
    Icon: HeartPulse,
    title: "Menos estrés, más tranquilidad",
    desc: "Orientación inmediata para gestionar la incertidumbre con más seguridad.",
  },
  {
    Icon: Sparkles,
    title: "Orientación personalizada",
    desc: "La consulta se adapta a tu perfil deportivo y al tipo de molestia.",
  },
  {
    Icon: ClipboardList,
    title: "Prepara mejor tu visita",
    desc: "Llega con la información organizada para una valoración más eficiente.",
  },
];

const VALUES = [
  {
    Icon: Target,
    title: "Precisión",
    desc: "Información basada en protocolos clínicos actualizados.",
  },
  {
    Icon: Users,
    title: "Accesibilidad",
    desc: "Orientación de calidad al alcance de cualquier persona.",
  },
  {
    Icon: Lock,
    title: "Privacidad",
    desc: "Tus datos y consultas son completamente privados y seguros.",
  },
  {
    Icon: RefreshCw,
    title: "Mejora continua",
    desc: "Actualizamos constantemente nuestra base de conocimientos.",
  },
];

function formatNewsDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

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
  const featured = news[0] ?? null;
  const rest = news.slice(1);

  return (
    <div className="flex flex-col">
      <section className="relative isolate overflow-hidden bg-slate-950 text-white">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-40 -top-24 h-[34rem] w-[34rem] rounded-full bg-blue-600/35 blur-3xl" />
          <div className="absolute -right-24 top-20 h-[28rem] w-[28rem] rounded-full bg-cyan-400/20 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
              backgroundSize: "28px 28px",
            }}
          />
        </div>
        <svg
          className="pointer-events-none absolute -right-8 top-10 hidden h-[420px] w-[180px] text-white/10 lg:block"
          viewBox="0 0 80 240"
          fill="none"
          aria-hidden
        >
          <path
            d="M40 8v224M28 48c8 6 16 6 24 0M24 96c10 8 22 8 32 0M26 144c9 7 19 7 28 0M30 192c7 5 13 5 20 0"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>

        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-100">
                <Sparkles className="h-3.5 w-3.5" />
                Fisioterapia + inteligencia artificial
              </p>
              <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-6xl sm:leading-[1.05]">
                Entiende tu lesión
                <span className="mt-1 block bg-gradient-to-r from-blue-200 via-white to-cyan-200 bg-clip-text text-transparent">
                  antes de la visita.
                </span>
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
                Orientación inteligente en fisioterapia y medicina deportiva.
                Clara, inmediata y pensada para que llegues mejor preparado a tu
                entrenador atlético.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href="/consulta"
                  className="inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3.5 text-sm font-bold text-slate-950 shadow-lg transition hover:bg-blue-50"
                >
                  Iniciar consulta
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href="#equipo"
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Conoce al equipo
                </a>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-sm">
              <div className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-br from-blue-400/30 to-cyan-300/10 blur-2xl" />
              <div className="relative overflow-hidden rounded-[2rem] border border-white/15 bg-white/10 p-8 text-center shadow-2xl backdrop-blur-md">
                <div className="mx-auto inline-flex rounded-3xl bg-white p-4 shadow-xl">
                  <Image
                    src="/logo-icon.png"
                    alt="AIKinora"
                    width={120}
                    height={120}
                    className="h-[96px] w-[96px] object-contain sm:h-[120px] sm:w-[120px]"
                    priority
                  />
                </div>
                <p className="mt-6 text-2xl font-bold tracking-tight">AIKinora</p>
                <p className="mt-2 text-sm leading-relaxed text-blue-100">
                  Primera orientación musculoesquelética, disponible cuando la
                  necesitas.
                </p>
              </div>
            </div>
          </div>

          <dl className="mt-16 grid grid-cols-1 gap-4 border-t border-white/10 pt-8 sm:grid-cols-3">
            {[
              { label: "Disponible 24/7", hint: "Consulta cuando te encaje" },
              { label: "Protocolos clínicos", hint: "Base Physioguide actualizada" },
              { label: "Privado y seguro", hint: "Tus datos no se comparten" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4"
              >
                <dt className="text-sm font-bold text-white">{item.label}</dt>
                <dd className="mt-1 text-xs text-slate-300">{item.hint}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="relative bg-white px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
              El proceso
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              ¿Cómo funciona?
            </h2>
            <p className="mt-3 text-slate-500">
              Tres pasos guiados. Sin citas, sin esperas, con criterio clínico.
            </p>
          </div>

          <div className="relative mt-12 grid gap-6 lg:grid-cols-3">
            <div className="pointer-events-none absolute left-[16%] right-[16%] top-10 hidden h-px bg-gradient-to-r from-blue-200 via-blue-400 to-blue-200 lg:block" />
            {STEPS.map((s, idx) => (
              <div
                key={s.title}
                className="relative rounded-3xl border border-slate-200 bg-slate-50/80 p-7 transition hover:-translate-y-1 hover:border-blue-200 hover:bg-white hover:shadow-[var(--shadow-elevated)]"
              >
                <div className="mb-5 flex items-center justify-between">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-[var(--shadow-primary)]">
                    <s.Icon className="h-6 w-6" strokeWidth={1.8} />
                  </div>
                  <span className="font-mono text-3xl font-bold text-slate-200">
                    0{idx + 1}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/consulta"
              className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-8 py-3.5 text-sm font-bold text-white shadow-[var(--shadow-primary)] transition hover:bg-blue-700"
            >
              Iniciar consulta
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
                Por qué AIKinora
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                Beneficios
              </h2>
            </div>
            <p className="max-w-md text-sm text-slate-500">
              Orientación clara para decidir mejor: qué hacer ahora, cuándo
              esperar y cuándo acudir a un profesional.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {BENEFITS.map((b) => (
              <article
                key={b.title}
                className={`group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-[var(--shadow-elevated)] ${
                  b.wide ? "sm:col-span-2 lg:col-span-2 lg:bg-slate-950 lg:text-white" : ""
                }`}
              >
                <div
                  className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl ${
                    b.wide
                      ? "bg-blue-500 text-white"
                      : "bg-blue-50 text-blue-700"
                  }`}
                >
                  <b.Icon className="h-5 w-5" strokeWidth={1.8} />
                </div>
                <h3
                  className={`text-base font-bold ${
                    b.wide ? "text-white" : "text-slate-900"
                  }`}
                >
                  {b.title}
                </h3>
                <p
                  className={`mt-2 text-sm leading-relaxed ${
                    b.wide ? "text-slate-300" : "text-slate-500"
                  }`}
                >
                  {b.desc}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-amber-50 px-4 py-6 sm:px-6">
        <div className="mx-auto flex max-w-4xl items-start gap-3 rounded-2xl border border-amber-200 bg-white/70 px-5 py-4 text-sm text-amber-900 sm:items-center">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-700 sm:mt-0" />
          <p>
            AIKinora proporciona orientación informativa, no diagnósticos
            médicos. Ante síntomas graves acude a urgencias o a tu médico.
          </p>
        </div>
      </section>

      <section className="bg-white px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
                Actualidad
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                Últimas noticias
              </h2>
            </div>
          </div>

          {news.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-8 py-16 text-center">
              <Newspaper className="mx-auto mb-3 h-10 w-10 text-slate-300" strokeWidth={1.5} />
              <p className="text-sm text-slate-500">
                Próximamente publicaremos novedades y artículos del equipo.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              {featured ? (
                <Link
                  href={`/sobre-nosotros/noticia/${featured.id}`}
                  className="group overflow-hidden rounded-3xl border border-slate-200 bg-slate-950 text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-elevated)]"
                >
                  <div className="relative h-56 overflow-hidden bg-slate-800 sm:h-72">
                    {featured.image_url ? (
                      <Image
                        src={featured.image_url}
                        alt=""
                        fill
                        className="object-cover transition duration-500 group-hover:scale-105"
                        sizes="(min-width: 1024px) 640px, 100vw"
                        unoptimized
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Newspaper className="h-12 w-12 text-slate-500" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                  </div>
                  <div className="p-7">
                    <time className="text-xs font-semibold uppercase tracking-wider text-blue-300">
                      {formatNewsDate(featured.published_at)}
                    </time>
                    <h3 className="mt-2 text-2xl font-bold leading-snug">
                      {featured.title}
                    </h3>
                    <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate-300">
                      {featured.body}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-blue-200">
                      Leer artículo
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              ) : null}
              <div className="flex flex-col gap-4">
                {rest.map((post) => (
                  <Link
                    key={post.id}
                    href={`/sobre-nosotros/noticia/${post.id}`}
                    className="flex gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-blue-200 hover:bg-white hover:shadow-sm"
                  >
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-slate-200">
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
                          <Newspaper className="h-5 w-5 text-slate-400" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <time className="text-[11px] font-semibold text-blue-600">
                        {formatNewsDate(post.published_at)}
                      </time>
                      <h3 className="mt-1 line-clamp-2 text-sm font-bold text-slate-900">
                        {post.title}
                      </h3>
                      <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-500">
                        {post.body}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="relative overflow-hidden bg-slate-950 px-4 py-16 text-white sm:px-6 sm:py-20">
        <div className="pointer-events-none absolute -left-20 top-0 h-72 w-72 rounded-full bg-blue-600/25 blur-3xl" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">
              Propósito
            </p>
            <h2 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
              Nuestra misión
            </h2>
          </div>
          <blockquote className="relative text-lg leading-relaxed text-slate-300 sm:text-xl">
            <span className="absolute -left-3 -top-8 font-serif text-8xl text-white/10">
              “
            </span>
            AIKinora nació con la idea de que cualquier persona debería poder
            recibir una primera orientación de calidad sobre sus síntomas
            musculoesqueléticos, sin importar dónde se encuentre o qué hora sea.
            Combinamos la experiencia clínica de profesionales con el poder de
            la inteligencia artificial para ofrecerte información clara, precisa
            y segura.
          </blockquote>
        </div>
      </section>

      <section id="equipo" className="bg-slate-50 px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
              Quiénes somos
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
              El equipo
            </h2>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            {TEAM.map((member) => (
              <article
                key={member.name}
                className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm"
              >
                <div
                  className={`absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-to-br ${member.accent} opacity-20 blur-2xl`}
                />
                <div
                  className={`relative mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br ${member.accent} text-2xl font-bold text-white shadow-lg`}
                >
                  {member.initials}
                </div>
                <h3 className="text-2xl font-bold text-slate-900">{member.name}</h3>
                <p className="mt-2 inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-blue-700">
                  {member.role}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-slate-500">
                  {member.bio}
                </p>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {member.credentials.map((c) => (
                    <li
                      key={c}
                      className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600"
                    >
                      {c}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-10 text-center text-3xl font-bold tracking-tight text-slate-900">
            Nuestros valores
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v) => (
              <article
                key={v.title}
                className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-left transition hover:border-blue-200 hover:bg-white hover:shadow-[var(--shadow-elevated)]"
              >
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white">
                  <v.Icon className="h-5 w-5" strokeWidth={1.8} />
                </div>
                <h3 className="text-base font-bold text-slate-900">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{v.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-slate-950 px-4 py-16 sm:px-6 sm:py-20">
        <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-blue-600/30 blur-3xl" />
        <div className="relative mx-auto grid max-w-6xl items-start gap-10 lg:grid-cols-2">
          <div className="pt-2 text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">
              Conversemos
            </p>
            <h2 className="mt-3 text-4xl font-bold tracking-tight">
              ¿Quieres contactarnos?
            </h2>
            <p className="mt-4 max-w-md text-slate-300">
              Si eres profesional y quieres colaborar, o simplemente tienes una
              pregunta, escríbenos. Leemos cada mensaje.
            </p>
            <div className="mt-8 flex items-center gap-3 text-sm text-slate-400">
              <ShieldCheck className="h-5 w-5 text-blue-300" />
              Tus datos se usan solo para responderte.
            </div>
          </div>
          <ContactInquiryForm variant="card" />
        </div>
      </section>
    </div>
  );
}
