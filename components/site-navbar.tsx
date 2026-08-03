"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { isClientAdminEmail } from "@/lib/is-admin-client";
import { createClient } from "@/lib/supabase/client";

const baseLinks = [
  { href: "/consulta", label: "Consulta" },
  { href: "/fisioterapia", label: "Fisioterapia" },
  { href: "/sobre-nosotros", label: "Sobre Nosotros" },
  { href: "/perfil", label: "Perfil" },
] as const;

export function SiteNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUserEmail(data.user?.email ?? null);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user?.email ?? null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const isAdmin = isClientAdminEmail(userEmail);

  const links = useMemo(() => {
    if (!isAdmin) return [...baseLinks];
    // Insert Admin before Perfil — same idea as the mobile Admin tab
    return [
      ...baseLinks.slice(0, -1),
      { href: "/admin", label: "Admin" },
      baseLinks[baseLinks.length - 1],
    ];
  }, [isAdmin]);

  async function handleSignOut() {
    setSigningOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/consulta" className="flex items-center gap-2" aria-label="Kinora — Consulta">
          <Image
            src="/logo-icon.png"
            alt="Kinora"
            width={30}
            height={30}
            className="object-contain"
            priority
          />
          <span className="hidden text-[15px] font-bold tracking-tight text-slate-900 sm:inline">
            Kinora
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-0.5 md:flex">
          {links.map(({ href, label }) => {
            const active =
              href === "/admin"
                ? pathname.startsWith("/admin")
                : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`rounded-lg px-3.5 py-1.5 text-[13px] font-semibold tracking-tight transition-colors duration-150 ${
                  active
                    ? "bg-blue-600 text-white shadow-sm shadow-blue-600/20"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
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
          className="hidden rounded-lg border border-slate-200 px-3.5 py-1.5 text-[13px] font-semibold text-slate-600 transition-colors duration-150 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-50 md:block"
        >
          {signingOut ? "Saliendo…" : "Cerrar sesión"}
        </button>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 md:hidden"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Menú"
        >
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
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
        <div className="animate-fade-in-up border-t border-slate-200 bg-white px-4 pb-3 md:hidden">
          <nav className="flex flex-col gap-1 pt-2">
            {links.map(({ href, label }) => {
              const active =
                href === "/admin"
                  ? pathname.startsWith("/admin")
                  : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-colors duration-150 ${
                    active
                      ? "bg-blue-600 text-white"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
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
              className="mt-2 rounded-lg border border-slate-200 px-4 py-2.5 text-left text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50"
            >
              {signingOut ? "Saliendo…" : "Cerrar sesión"}
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
