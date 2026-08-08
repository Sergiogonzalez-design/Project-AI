import type { Metadata } from "next";
import { FisioNavBurger } from "@/components/fisio-nav-burger";
import { FisioPatientModeButton } from "@/components/fisio-patient-mode";
import { FisioSignOutButton } from "@/components/fisio-sign-out-button";

export const metadata: Metadata = {
  title: "Panel del fisioterapeuta · AIKinora",
  robots: { index: false, follow: false },
};

export default function FisioLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-screen flex-col bg-neutral-100">
      <header className="shrink-0 border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
              Fisioterapeuta
            </p>
            <p className="text-sm font-medium text-neutral-800">
              Panel · AIKinora
            </p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <FisioNavBurger />
            <FisioPatientModeButton />
            <FisioSignOutButton />
          </div>
        </div>
      </header>
      <div className="min-h-0 flex-1">{children}</div>
    </div>
  );
}
