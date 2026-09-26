"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { AiOrientationDisclaimer } from "@/components/physio-report-view";

const FULL_BLEED = [
  "/consulta",
  "/fisioterapia",
  "/fisio/consulta",
  "/clinica/consulta",
  "/mensajes",
];

function isFullBleed(pathname: string): boolean {
  return FULL_BLEED.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export function SiteFooter() {
  const pathname = usePathname() ?? "";
  const hide = isFullBleed(pathname);

  useEffect(() => {
    document.documentElement.classList.toggle("app-fullbleed", hide);
    return () => document.documentElement.classList.remove("app-fullbleed");
  }, [hide]);

  if (hide) return null;

  return (
    <footer className="shrink-0 border-t border-slate-200/80 bg-white/90 px-4 py-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))]">
      <div className="mx-auto flex max-w-5xl flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between">
        <AiOrientationDisclaimer />
        <p className="text-xs text-neutral-500">
          <Link href="/privacidad" className="font-medium text-blue-600 hover:underline">
            Privacidad y términos
          </Link>
        </p>
      </div>
    </footer>
  );
}
