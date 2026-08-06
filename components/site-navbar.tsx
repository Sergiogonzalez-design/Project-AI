"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
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
  const [mounted, setMounted] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const isAdmin = isClientAdminEmail(userEmail);

  const links = useMemo(() => {
    if (!isAdmin) return [...baseLinks];
    return [
      ...baseLinks.slice(0, -1),
      { href: "/admin", label: "Admin" },
      baseLinks[baseLinks.length - 1],
    ];
  }, [isAdmin]);

  async function handleSignOut() {
    setSigningOut(true);
    setMenuOpen(false);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/login");
    router.refresh();
  }

  const menu =
    mounted && menuOpen
      ? createPortal(
          <div className="fixed inset-0 z-[100]" role="presentation">
            <button
              type="button"
              className="absolute inset-0 bg-black/40"
              aria-label="Cerrar menú"
              onClick={() => setMenuOpen(false)}
            />
            <aside
              className="absolute bottom-0 right-0 top-14 flex w-[min(17.5rem,88vw)] flex-col border-l border-slate-200 bg-white shadow-2xl"
              style={{ animation: "slideInRight 180ms ease-out" }}
              role="dialog"
              aria-modal="true"
              aria-label="Menú de navegación"
            >
              <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3 pt-4">
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
                      className={`rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                        active
                          ? "bg-slate-900 text-white"
                          : "text-slate-800 hover:bg-slate-100"
                      }`}
                    >
                      {label}
                    </Link>
                  );
                })}
              </nav>

              <div className="shrink-0 border-t border-slate-200 p-3">
                <button
                  type="button"
                  onClick={() => void handleSignOut()}
                  disabled={signingOut}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-left text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50"
                >
                  {signingOut ? "Saliendo…" : "Cerrar sesión"}
                </button>
              </div>
            </aside>
          </div>,
          document.body
        )
      : null;

  return (
    <>
      <header className="sticky top-0 z-[110] w-full border-b border-slate-200 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link
            href="/consulta"
            className="flex items-center gap-2"
            aria-label="Kinora — Consulta"
          >
            <Image
              src="/logo-icon.png"
              alt="Kinora"
              width={30}
              height={30}
              className="object-contain"
              priority
            />
            <span className="text-[15px] font-bold tracking-tight text-slate-900">
              Kinora
            </span>
          </Link>

          <button
            type="button"
            className="rounded-lg p-2 text-slate-800 transition-colors hover:bg-slate-100"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={menuOpen}
          >
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" aria-hidden>
              {menuOpen ? (
                <path
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  d="M6 6l12 12M6 18L18 6"
                />
              ) : (
                <path
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </header>
      {menu}
    </>
  );
}
