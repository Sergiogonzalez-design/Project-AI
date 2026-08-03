import type { Metadata } from "next";
import Link from "next/link";
import { FisioSignOutButton } from "@/components/fisio-sign-out-button";

export const metadata: Metadata = {
  title: "Panel del fisioterapeuta · Kinora",
  robots: { index: false, follow: false },
};

export default function FisioLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-screen flex-col bg-neutral-100">
      <header className="shrink-0 border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 px-6 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
              Fisioterapeuta
            </p>
            <p className="text-sm font-medium text-neutral-800">
              Panel · Kinora
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/fisio"
              className="text-sm font-medium text-neutral-500 hover:text-neutral-800"
            >
              Pacientes
            </Link>
            <Link
              href="/fisio/consulta"
              className="text-sm font-medium text-neutral-500 hover:text-neutral-800"
            >
              Consulta
            </Link>
            <FisioSignOutButton />
          </div>
        </div>
      </header>
      <div className="min-h-0 flex-1">{children}</div>
    </div>
  );
}
