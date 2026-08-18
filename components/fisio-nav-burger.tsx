"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import {
  isNavLinkActive,
  PHYSIO_NAV_LINKS,
  type AppNavLink,
} from "@/lib/app-nav-links";
import { signOutToLogin } from "@/lib/sign-out-client";

/** Slide-out ☰ menu: Clínica, Consulta, About, Profile (physio). */
export function FisioNavBurger() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const menuId = useId();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function handleSignOut() {
    setSigningOut(true);
    setOpen(false);
    signOutToLogin();
  }

  const menu =
    mounted && open
      ? createPortal(
          <div
            className="pointer-events-none fixed inset-0 z-[100]"
            role="presentation"
          >
            <button
              type="button"
              className="pointer-events-auto absolute inset-0 top-14 bg-black/40"
              aria-label="Cerrar menú"
              onClick={() => setOpen(false)}
            />
            <aside
              id={menuId}
              className="pointer-events-auto absolute bottom-0 right-0 top-14 z-[1] flex w-[min(17.5rem,88vw)] flex-col border-l border-slate-200/80 bg-[#FAFAFA] shadow-[0_8px_30px_rgba(15,23,42,0.08)]"
              style={{ animation: "slideInRight 180ms ease-out" }}
              role="dialog"
              aria-modal="true"
              aria-label="Menú de navegación"
            >
              <NavLinks links={PHYSIO_NAV_LINKS} pathname={pathname} onNavigate={() => setOpen(false)} />
              <div className="shrink-0 border-t border-slate-200/80 p-3">
                <button
                  type="button"
                  onClick={handleSignOut}
                  disabled={signingOut}
                  className="w-full rounded-[14px] px-4 py-3 text-left text-sm font-semibold text-slate-700 transition-colors hover:bg-[#F1F5F9] disabled:opacity-60"
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
      <button
        type="button"
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((v) => !v)}
        className="rounded-lg p-2 text-neutral-700 transition-colors hover:bg-neutral-100"
      >
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24" aria-hidden>
          {open ? (
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
      {menu}
    </>
  );
}

function NavLinks({
  links,
  pathname,
  onNavigate,
}: {
  links: AppNavLink[];
  pathname: string;
  onNavigate: () => void;
}) {
  return (
    <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3 pt-4">
      {links.map(({ href, label }) => {
        const active = isNavLinkActive(pathname, href);
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
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
  );
}
