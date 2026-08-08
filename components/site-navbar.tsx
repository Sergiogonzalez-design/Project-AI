"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import {
  ExitPatientModeButton,
  readPatientModeFromDocument,
} from "@/components/fisio-patient-mode";
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
  const [patientMode, setPatientMode] = useState(false);

  useEffect(() => {
    setMounted(true);
    setPatientMode(readPatientModeFromDocument());
  }, []);

  useEffect(() => {
    const supabase = createClient();
    void supabase.auth
      .getUser()
      .then(({ data }) => {
        setUserEmail(data.user?.email ?? null);
      })
      .catch(() => {
        setUserEmail(null);
      });
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUserEmail(session?.user?.email ?? null);
      }
    );
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
    document.cookie =
      "aikinora_patient_mode=; path=/; max-age=0; SameSite=Lax";
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
              className="absolute inset-0 top-14 bg-black/40"
              aria-label="Cerrar menú"
              onClick={() => setMenuOpen(false)}
            />
            <aside
              className="absolute bottom-0 right-0 top-14 z-[1] flex w-[min(17.5rem,88vw)] flex-col border-l border-slate-200/80 bg-[#FAFAFA] shadow-[0_8px_30px_rgba(15,23,42,0.08)]"
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
                      className={`rounded-[14px] px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                        active
                          ? "bg-[#EFF6FF] text-slate-900 shadow-[inset_3px_0_0_#2563EB]"
                          : "text-slate-800 hover:bg-[#F1F5F9]"
                      }`}
                    >
                      {label}
                    </Link>
                  );
                })}
              </nav>

              <div className="shrink-0 border-t border-slate-200/80 p-3">
                <button
                  type="button"
                  onClick={() => void handleSignOut()}
                  disabled={signingOut}
                  className="btn-secondary w-full !justify-start !text-sm"
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
      <header className="sticky top-0 z-[110] w-full border-b border-slate-200/70 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link
            href="/consulta"
            className="flex items-center gap-2.5"
            aria-label="AIKinora — Consulta"
          >
            <Image
              src="/logo-icon.png"
              alt="AIKinora"
              width={28}
              height={28}
              className="object-contain"
              priority
            />
            <span className="text-[15px] font-semibold tracking-tight text-slate-900">
              AIKinora
            </span>
          </Link>

          <div className="flex items-center gap-2">
            {patientMode ? <ExitPatientModeButton /> : null}
            <button
              type="button"
              className="btn-icon !h-10 !w-10 text-slate-800"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={menuOpen}
            >
              <svg
                width="20"
                height="20"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden
              >
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
        </div>
      </header>
      {menu}
    </>
  );
}
