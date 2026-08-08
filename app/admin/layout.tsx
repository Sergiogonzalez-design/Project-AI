import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Admin · AIKinora",
  robots: { index: false, follow: false },
};

const NAV = [
  { href: "/admin", label: "Resumen", exact: true },
  { href: "/admin/users", label: "Usuarios" },
  { href: "/admin/news", label: "Noticias" },
  { href: "/admin/conocimientos", label: "Conocimientos" },
] as const;

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen bg-neutral-100">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-4xl flex-col gap-4 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
              Administración
            </p>
            <p className="text-sm font-medium text-neutral-800">
              Panel de gestión · AIKinora
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/consulta"
              className="text-sm font-medium text-neutral-500 hover:text-neutral-800"
            >
              Volver al sitio
            </Link>
          </div>
        </div>
        <nav className="mx-auto flex max-w-4xl gap-1 overflow-x-auto px-4 pb-3 sm:px-6">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="shrink-0 rounded-lg px-3 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>
      {children}
    </div>
  );
}
