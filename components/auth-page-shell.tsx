"use client";

import { NavBackButton } from "@/components/nav-back-button";

type Props = {
  children: React.ReactNode;
  fallbackHref: string;
};

/** Full-screen auth/onboarding pages with a top-left back control. */
export function AuthPageShell({ children, fallbackHref }: Props) {
  return (
    <div className="relative min-h-screen">
      <div className="absolute left-4 top-4 z-20 sm:left-6 sm:top-6">
        <NavBackButton
          fallbackHref={fallbackHref}
          className="!bg-white/90 shadow-sm backdrop-blur"
        />
      </div>
      {children}
    </div>
  );
}
