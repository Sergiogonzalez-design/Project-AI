import Link from "next/link";

const CARDS = [
  {
    href: "/admin/users",
    title: "Usuarios",
    body: "Ver cuentas registradas y eliminar usuarios si hace falta.",
  },
  {
    href: "/admin/news",
    title: "Noticias",
    body: "Publicar o borrar novedades que aparecen en Sobre Nosotros.",
  },
  {
    href: "/admin/conocimientos",
    title: "Conocimientos IA",
    body: "Subir PDFs, enlaces o texto a la base de conocimientos.",
  },
] as const;

export default function AdminHomePage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
        Panel de administración
      </h1>
      <p className="mt-2 max-w-2xl text-sm text-neutral-600">
        Gestiona usuarios, noticias y la base de conocimientos de AIKinora. Solo
        tu cuenta de administrador puede acceder aquí.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {CARDS.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition hover:border-blue-300 hover:shadow-md"
          >
            <h2 className="text-base font-semibold text-neutral-900">
              {card.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-neutral-600">
              {card.body}
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}
