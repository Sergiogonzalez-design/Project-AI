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
    role: "Fisioterapeuta & Desarrollador de PhysioGuide AI",
    initials: "SG",
    bio: "Fisioterapeuta apasionado por la tecnología aplicada a la salud. Lidera el desarrollo de PhysioGuide AI para democratizar el acceso a la orientación en fisioterapia.",
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

export default function SobreNosotrosPage() {
  return (
    <div className="flex flex-col">
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-700 to-blue-500 px-6 py-20 text-center text-white">
        <div className="mx-auto max-w-2xl">
          <h1 className="mb-4 text-4xl font-bold">Sobre Nosotros</h1>
          <p className="text-lg text-blue-100 leading-relaxed">
            Somos un equipo de profesionales de la salud y la tecnología
            comprometidos con hacer la fisioterapia más accesible.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="bg-white px-6 py-14">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-2xl font-bold text-slate-800">Nuestra misión</h2>
          <p className="text-slate-500 leading-relaxed text-lg">
            PhysioGuide AI nació con la idea de que cualquier persona debería poder
            recibir una primera orientación de calidad sobre sus síntomas musculoesqueléticos,
            sin importar dónde se encuentre o qué hora es. Combinamos la experiencia clínica
            de profesionales con el poder de la inteligencia artificial para ofrecerte
            información clara, precisa y segura.
          </p>
        </div>
      </section>

      {/* Team */}
      <section className="bg-slate-50 px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-10 text-center text-2xl font-bold text-slate-800">
            El equipo
          </h2>
          <div className="grid gap-8 sm:grid-cols-2">
            {TEAM.map((member) => (
              <div
                key={member.name}
                className="rounded-3xl bg-white border border-blue-100 p-8 shadow-sm overflow-hidden relative"
              >
                {/* Avatar */}
                <div className={`mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br ${member.color} text-2xl font-bold text-white shadow`}>
                  {member.initials}
                </div>

                <h3 className="text-xl font-bold text-slate-800">{member.name}</h3>
                <p className="mt-1 text-sm font-medium text-blue-600">{member.role}</p>
                <p className="mt-4 text-sm leading-relaxed text-slate-500">{member.bio}</p>

                <ul className="mt-5 space-y-1.5">
                  {member.credentials.map((c) => (
                    <li key={c} className="flex items-center gap-2 text-xs text-slate-600">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0" />
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
      <section className="bg-white px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-10 text-center text-2xl font-bold text-slate-800">
            Nuestros valores
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v) => (
              <div
                key={v.title}
                className="rounded-2xl border border-blue-100 p-6 text-center"
              >
                <div className="mb-3 text-3xl">{v.icon}</div>
                <h3 className="mb-2 text-sm font-bold text-slate-800">{v.title}</h3>
                <p className="text-xs leading-relaxed text-slate-500">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="bg-gradient-to-br from-blue-700 to-blue-500 px-6 py-14 text-white text-center">
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
