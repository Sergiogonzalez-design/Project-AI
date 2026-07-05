"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const links = [
  { href: "/consulta", label: "Consulta" },
  { href: "/conocimientos", label: "Conocimientos" },
  { href: "/sobre-nosotros", label: "Sobre Nosotros" },
] as const;

export function SiteSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  async function handleSignOut() {
    setSigningOut(true);
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.replace("/login");
      router.refresh();
    } finally {
      setSigningOut(false);
    }
  }

  return (
    <aside className="flex min-h-screen w-56 shrink-0 flex-col border-r border-neutral-200 bg-white px-4 py-8">
      <Link
        href="/"
        className="mb-10 text-lg font-semibold tracking-tight text-neutral-900"
      >
        PhysioGuide AI
      </Link>
      <nav className="flex flex-1 flex-col gap-1">
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
      <div className="mt-auto pt-8">
        <button
          type="button"
          onClick={handleSignOut}
          disabled={signingOut}
          className="w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-100 disabled:opacity-60"
        >
          {signingOut ? "Cerrando sesión…" : "Cerrar sesión"}
        </button>
      </div>
    </aside>
  );
}
