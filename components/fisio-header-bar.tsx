"use client";

import { usePathname } from "next/navigation";
import { FisioNavBurger } from "@/components/fisio-nav-burger";
import { NavBackButton } from "@/components/nav-back-button";
import { FisioSignOutButton } from "@/components/fisio-sign-out-button";
import { isPacienteLandingPath } from "@/lib/app-nav-links";

/** Fisio dashboard top bar with back, burger, and actions. */
export function FisioHeaderBar() {
  const pathname = usePathname();
  const showBack = !isPacienteLandingPath(pathname);

  return (
    <header className="shrink-0 border-b border-neutral-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-3 sm:px-6">
        {showBack ? <NavBackButton fallbackHref="/fisio" /> : null}
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
            Fisioterapeuta
          </p>
          <p className="truncate text-sm font-medium text-neutral-800">
            Panel · AIKinora
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <FisioNavBurger />
          <FisioSignOutButton />
        </div>
      </div>
    </header>
  );
}
