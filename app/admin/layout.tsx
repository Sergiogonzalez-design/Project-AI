import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Admin · PhysioGuide AI",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen bg-neutral-100">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
              Administración
            </p>
            <p className="text-sm font-medium text-neutral-800">
              Base de conocimientos IA
            </p>
          </div>
          <Link
            href="/"
            className="text-sm font-medium text-neutral-500 hover:text-neutral-800"
          >
            Volver al sitio
          </Link>
        </div>
      </header>
      {children}
    </div>
  );
}
