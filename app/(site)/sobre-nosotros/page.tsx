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

const box =
  "rounded-2xl border border-slate-200 bg-[#F1F5F9]";

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
    <div className="flex flex-col bg-white text-slate-900">
      <section className="bg-white px-4 py-10 sm:px-6 sm:py-14">
        <div className="mx-auto max-w-6xl">
          <div className={`${box} px-6 py-10 text-center sm:px-10 sm:py-12`}>
            <div className="mx-auto inline-flex rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
              <Image
                src="/logo-icon.png"
                alt="AIKinora"
                width={72}
                height={72}
                className="h-[64px] w-[64px] object-contain sm:h-[72px] sm:w-[72px]"
                priority
              />
            </div>
            <p className="mt-5 text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">
              AIKinora
            </p>
            <p className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-blue-700">
              <Sparkles className="h-3.5 w-3.5" />
              Fisioterapia + inteligencia artificial
            </p>
            <h1 className="mt-5 text-2xl font-bold tracking-tight text-slate-950 sm:text-4xl sm:leading-tight">
              Entiende tu lesión antes de la visita.
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-500 sm:text-base">
              Orientación inteligente en fisioterapia y medicina deportiva.
              Clara, inmediata y pensada para que llegues mejor preparado a tu
              entrenador atlético.
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/consulta"
                className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700"
              >
                Iniciar consulta
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#equipo"
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
              >
                Conoce al equipo
              </a>
            </div>
          </div>

          <dl className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              { label: "Disponible 24/7", hint: "Consulta cuando te encaje" },
              { label: "Protocolos clínicos", hint: "Base Physioguide actualizada" },
              { label: "Privado y seguro", hint: "Tus datos no se comparten" },
            ].map((item) => (
              <div
                key={item.label}
                className={`${box} flex items-start gap-3 px-5 py-4 text-left`}
              >
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
                <div>
                  <dt className="text-sm font-bold text-slate-900">{item.label}</dt>
                  <dd className="mt-1 text-xs text-slate-500">{item.hint}</dd>
                </div>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="bg-white px-4 pb-14 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              El proceso
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              ¿Cómo funciona?
            </h2>
            <p className="mt-3 text-slate-500">
              Tres pasos guiados. Sin citas, sin esperas, con criterio clínico.
            </p>
          </div>

          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {STEPS.map((s, idx) => (
              <div key={s.title} className={`${box} p-6`}>
                <div className="mb-4 flex items-center justify-between">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                    <s.Icon className="h-5 w-5" strokeWidth={1.8} />
                  </div>
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-blue-100 bg-blue-50 text-xs font-extrabold text-blue-700">
                    {idx + 1}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/consulta"
              className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-8 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700"
            >
              Iniciar consulta
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 pb-14 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
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
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {BENEFITS.map((b) => (
              <article
                key={b.title}
                className={`${box} p-5 ${b.wide ? "sm:col-span-2 lg:col-span-2" : ""}`}
              >
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                  <b.Icon className="h-5 w-5" strokeWidth={1.8} />
                </div>
                <h3 className="text-base font-bold text-slate-900">{b.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{b.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-4 pb-10 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-[#FFFBEB] px-5 py-4 text-sm text-amber-900 sm:items-center">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-700 sm:mt-0" />
            <p>
              AIKinora proporciona orientación informativa, no diagnósticos
              médicos. Ante síntomas graves acude a urgencias o a tu médico.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 pb-14 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Actualidad
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
              Últimas noticias
            </h2>
          </div>

          {news.length === 0 ? (
            <div className={`${box} border-dashed px-8 py-14 text-center`}>
              <Newspaper className="mx-auto mb-3 h-10 w-10 text-slate-300" strokeWidth={1.5} />
              <p className="text-sm text-slate-500">
                Próximamente publicaremos novedades y artículos del equipo.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
              {featured ? (
                <Link
                  href={`/sobre-nosotros/noticia/${featured.id}`}
                  className={`${box} group overflow-hidden transition hover:border-blue-200`}
                >
                  <div className="relative h-52 overflow-hidden bg-white sm:h-64">
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
                        <Newspaper className="h-12 w-12 text-slate-300" />
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <time className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                      {formatNewsDate(featured.published_at)}
                    </time>
                    <h3 className="mt-2 text-2xl font-bold leading-snug text-slate-900">
                      {featured.title}
                    </h3>
                    <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate-500">
                      {featured.body}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-blue-600">
                      Leer artículo
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              ) : null}
              <div className="flex flex-col gap-3">
                {rest.map((post) => (
                  <Link
                    key={post.id}
                    href={`/sobre-nosotros/noticia/${post.id}`}
                    className={`${box} flex gap-4 p-4 transition hover:border-blue-200`}
                  >
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-white">
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

      <section className="bg-white px-4 pb-14 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <div className={`${box} relative px-6 py-10 text-center sm:px-10`}>
            <span className="pointer-events-none absolute left-5 top-1 font-serif text-7xl leading-none text-slate-200">
              “
            </span>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Propósito
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
              Nuestra misión
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-500 sm:text-base">
              AIKinora nació con la idea de que cualquier persona debería poder
              recibir una primera orientación de calidad sobre sus síntomas
              musculoesqueléticos, sin importar dónde se encuentre o qué hora sea.
              Combinamos la experiencia clínica de profesionales con el poder de
              la inteligencia artificial para ofrecerte información clara, precisa
              y segura.
            </p>
          </div>
        </div>
      </section>

      <section id="equipo" className="bg-white px-4 pb-14 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto mb-8 max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Quiénes somos
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
              El equipo
            </h2>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            {TEAM.map((member) => (
              <article key={member.name} className={`${box} p-6 sm:p-7`}>
                <div className="flex items-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-lg font-extrabold text-blue-700">
                    {member.initials}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{member.name}</h3>
                    <p className="mt-0.5 text-xs font-semibold text-slate-500">
                      {member.role}
                    </p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-slate-500">
                  {member.bio}
                </p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {member.credentials.map((c) => (
                    <li
                      key={c}
                      className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600"
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

      <section className="bg-white px-4 pb-14 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-8 text-center text-3xl font-bold tracking-tight text-slate-900">
            Nuestros valores
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v) => (
              <article key={v.title} className={`${box} p-5`}>
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                  <v.Icon className="h-5 w-5" strokeWidth={1.8} />
                </div>
                <h3 className="text-base font-bold text-slate-900">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{v.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-4 pb-16 sm:px-6">
        <div className="mx-auto grid max-w-6xl items-start gap-6 lg:grid-cols-2">
          <div className={`${box} p-6 sm:p-8`}>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Conversemos
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
              ¿Quieres contactarnos?
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-500">
              Si eres profesional y quieres colaborar, o simplemente tienes una
              pregunta, escríbenos. Leemos cada mensaje.
            </p>
            <div className="mt-6 flex items-center gap-3 text-sm text-slate-500">
              <ShieldCheck className="h-5 w-5 text-blue-600" />
              Tus datos se usan solo para responderte.
            </div>
          </div>
          <ContactInquiryForm variant="card" />
        </div>
      </section>
    </div>
  );
}
