"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const links = [
  { href: "/", label: "Inicio" },
  { href: "/consulta", label: "Consulta" },
  { href: "/conocimientos", label: "Conocimientos" },
  { href: "/sobre-nosotros", label: "Sobre Nosotros" },
  { href: "/perfil", label: "Perfil" },
] as const;

export function SiteNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleSignOut() {
    setSigningOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-blue-100 bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-0 h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="PhysioGuide AI"
            width={44}
            height={44}
            className="object-contain"
            priority
          />
          <span className="text-base font-bold tracking-tight text-blue-700">
            PhysioGuide AI
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {links.map(({ href, label }) => {
            const active =
              href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-blue-600 text-white"
                    : "text-slate-600 hover:bg-blue-50 hover:text-blue-700"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Sign out */}
        <button
          type="button"
          onClick={handleSignOut}
          disabled={signingOut}
          className="hidden rounded-lg border border-blue-200 px-4 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-50 disabled:opacity-50 md:block"
        >
          {signingOut ? "Saliendo…" : "Cerrar sesión"}
        </button>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="rounded-lg p-2 text-slate-600 hover:bg-blue-50 md:hidden"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Menú"
        >
          <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
            {menuOpen ? (
              <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M6 6l12 12M6 18L18 6" />
            ) : (
              <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-blue-100 bg-white px-6 pb-4 md:hidden">
          <nav className="flex flex-col gap-1 pt-2">
            {links.map(({ href, label }) => {
              const active =
                href === "/" ? pathname === "/" : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                    active
                      ? "bg-blue-600 text-white"
                      : "text-slate-600 hover:bg-blue-50 hover:text-blue-700"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
            <button
              type="button"
              onClick={handleSignOut}
              disabled={signingOut}
              className="mt-2 rounded-lg border border-blue-200 px-4 py-2.5 text-left text-sm font-medium text-blue-600 hover:bg-blue-50 disabled:opacity-50"
            >
              {signingOut ? "Saliendo…" : "Cerrar sesión"}
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
