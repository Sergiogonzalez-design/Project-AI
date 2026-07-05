import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Error de acceso · PhysioGuide AI",
};

export default function AuthCodeErrorPage() {
  return (
    <main className="flex min-h-full flex-1 flex-col items-center justify-center bg-neutral-50 px-6 py-16">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold text-neutral-900">No se pudo completar el acceso</h1>
        <p className="mt-2 text-sm text-neutral-600">
          El enlace puede haber caducado o ser inválido. Prueba a iniciar sesión de nuevo.
        </p>
        <Link
          href="/login"
          className="mt-6 inline-block rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-neutral-800"
        >
          Ir a iniciar sesión
        </Link>
      </div>
    </main>
  );
}
