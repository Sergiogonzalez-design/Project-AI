"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/consulta", label: "Consulta" },
  { href: "/conocimientos", label: "Conocimientos" },
  { href: "/sobre-nosotros", label: "Sobre Nosotros" },
] as const;

export function SiteSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-neutral-200 bg-white px-4 py-8">
      <Link
        href="/"
        className="mb-10 text-lg font-semibold tracking-tight text-neutral-900"
      >
        PhysioGuide AI
      </Link>
      <nav className="flex flex-col gap-1">
        {links.map(({ href, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-neutral-900 text-white"
                  : "text-neutral-700 hover:bg-neutral-100"
              }`}
            >
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
