"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { clearPatientModeCookie } from "@/components/fisio-patient-mode";
import {
  CLINIC_NAV_LINKS,
  isNavLinkActive,
  PATIENT_NAV_LINKS,
  PHYSIO_NAV_LINKS,
  type AppNavLink,
} from "@/lib/app-nav-links";
import { isClientAdminEmail } from "@/lib/is-admin-client";
import { isGuestUser } from "@/lib/guest-account";
import { signOutToLogin } from "@/lib/sign-out-client";
import { createClient } from "@/lib/supabase/client";

export function SiteNavbar() {
  const pathname = usePathname();
  const [signingOut, setSigningOut] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isPhysioAccount, setIsPhysioAccount] = useState(false);
  const [isClinicAccount, setIsClinicAccount] = useState(false);
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const supabase = createClient();
    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUserEmail(user?.email ?? null);
      setIsGuest(isGuestUser(user));
      if (!user) {
        setIsPhysioAccount(false);
        setIsClinicAccount(false);
        clearPatientModeCookie();
        return;
      }
      const { data: profile } = await supabase
        .from("profiles")
        .select("account_type")
        .eq("id", user.id)
        .maybeSingle();
      setIsPhysioAccount(profile?.account_type === "physio");
      setIsClinicAccount(profile?.account_type === "clinic");
      clearPatientModeCookie();
    }
    void loadUser().catch(() => {
      setUserEmail(null);
      setIsPhysioAccount(false);
      setIsClinicAccount(false);
      setIsGuest(false);
      clearPatientModeCookie();
    });
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUserEmail(session?.user?.email ?? null);
        setIsGuest(isGuestUser(session?.user));
        if (!session?.user) {
          setIsPhysioAccount(false);
          setIsClinicAccount(false);
          clearPatientModeCookie();
          return;
        }
        const userId = session.user.id;
        // Defer DB work — awaiting inside this callback deadlocks signOut().
        window.setTimeout(() => {
          void supabase
            .from("profiles")
            .select("account_type")
            .eq("id", userId)
            .maybeSingle()
            .then(({ data: profile }) => {
              setIsPhysioAccount(profile?.account_type === "physio");
              setIsClinicAccount(profile?.account_type === "clinic");
              clearPatientModeCookie();
            });
        }, 0);
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
    if (isGuest) return [];
    const base: AppNavLink[] = isClinicAccount
      ? [...CLINIC_NAV_LINKS]
      : isPhysioAccount
        ? [...PHYSIO_NAV_LINKS]
        : [...PATIENT_NAV_LINKS];
    if (!isAdmin) return base;
    return [
      ...base.slice(0, -1),
      { href: "/admin", label: "Admin" },
      base[base.length - 1],
    ];
  }, [isAdmin, isPhysioAccount, isClinicAccount, isGuest]);

  const homeHref = isClinicAccount
    ? "/clinica/consulta"
    : isPhysioAccount
      ? "/fisio"
      : isGuest
        ? "/fisioterapia"
        : "/consulta";

  function handleSignOut() {
    setSigningOut(true);
    setMenuOpen(false);
    signOutToLogin();
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
                {isGuest ? (
                  <Link
                    href="/signup"
                    onClick={() => setMenuOpen(false)}
                    className="rounded-[14px] px-4 py-3 text-sm font-semibold text-slate-800 hover:bg-[#F1F5F9]"
                  >
                    Crear cuenta
                  </Link>
                ) : null}
                {links.map(({ href, label }) => {
                  const active =
                    href === "/admin"
                      ? pathname.startsWith("/admin")
                      : isNavLinkActive(pathname, href);
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

              <div className="shrink-0 space-y-2 border-t border-slate-200/80 p-3">
                <p className="px-1 text-center text-xs text-slate-500">
                  <Link
                    href="/privacidad"
                    onClick={() => setMenuOpen(false)}
                    className="font-medium text-blue-600 hover:underline"
                  >
                    Privacidad y términos
                  </Link>
                </p>
                <button
                  type="button"
                  onClick={handleSignOut}
                  disabled={signingOut}
                  className="btn-secondary w-full !justify-start !text-sm"
                >
                  {signingOut
                    ? "Saliendo…"
                    : isGuest
                      ? "Volver a inicio"
                      : "Cerrar sesión"}
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
        <div className="flex h-14 w-full items-center gap-2 px-4 sm:px-6">
          <Link
            href={homeHref}
            className="flex min-w-0 flex-1 items-center gap-2.5"
            aria-label="AIKinora — Inicio"
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
            {isGuest ? (
              <Link
                href="/signup"
                className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800"
              >
                Crear cuenta
              </Link>
            ) : null}
            <button
              type="button"
              className="rounded-lg p-2 text-neutral-700 transition-colors hover:bg-neutral-100"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={menuOpen}
            >
              <svg
                width="22"
                height="22"
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
