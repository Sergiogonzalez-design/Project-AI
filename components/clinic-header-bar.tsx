"use client";

import { usePathname } from "next/navigation";
import { FisioNavBurger } from "@/components/fisio-nav-burger";
import {
  CLINIC_NAV_LINKS,
  isNavLinkActive,
} from "@/lib/app-nav-links";

function screenLabelForPath(pathname: string): string {
  const match = CLINIC_NAV_LINKS.find((link) =>
    isNavLinkActive(pathname, link.href)
  );
  return match?.label ?? "Clínica";
}

export function ClinicHeaderBar() {
  const pathname = usePathname();
  if (pathname.includes("access-denied")) return null;
  const screen = screenLabelForPath(pathname);

  return (
    <header className="sticky top-0 z-[110] shrink-0 border-b border-neutral-200 bg-white">
      <div className="flex h-14 w-full items-center gap-2 px-4 sm:px-6">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
            Clínica
          </p>
          <p className="truncate text-sm font-medium text-neutral-800">
            {screen} · AIKinora
          </p>
        </div>
        <div className="flex shrink-0 items-center">
          <FisioNavBurger links={CLINIC_NAV_LINKS} />
        </div>
      </div>
    </header>
  );
}
