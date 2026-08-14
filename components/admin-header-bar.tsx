"use client";

import Link from "next/link";
import { NavBackButton } from "@/components/nav-back-button";

const NAV = [
  { href: "/admin", label: "Resumen", exact: true },
  { href: "/admin/users", label: "Usuarios" },
  { href: "/admin/news", label: "Noticias" },
  { href: "/admin/conocimientos", label: "Conocimientos" },
] as const;

export function AdminHeaderBar() {
  return (
    <header className="border-b border-neutral-200 bg-white">
      <div className="mx-auto flex max-w-4xl items-center gap-3 px-4 py-4 sm:px-6">
        <NavBackButton fallbackHref="/consulta" />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
            Administración
          </p>
          <p className="truncate text-sm font-medium text-neutral-800">
            Panel de gestión · AIKinora
          </p>
        </div>
        <Link
          href="/consulta"
          className="hidden shrink-0 text-sm font-medium text-neutral-500 hover:text-neutral-800 sm:inline"
        >
          Volver al sitio
        </Link>
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
  );
}
