import Link from "next/link";

export default function AdminAccessDeniedPage() {
  return (
    <main className="mx-auto max-w-lg px-6 py-16 text-center">
      <h1 className="text-xl font-semibold text-neutral-900">
        Sin acceso de administrador
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-neutral-600">
        Esta sección es solo para la cuenta configurada en{" "}
        <code className="rounded bg-neutral-200 px-1.5 py-0.5 text-xs">
          ADMIN_EMAIL
        </code>{" "}
        del servidor. Inicia sesión con ese correo o pídele al responsable del
        proyecto que lo configure en <code className="rounded bg-neutral-200 px-1.5 py-0.5 text-xs">.env.local</code>.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/login?next=%2Fadmin"
          className="rounded-xl bg-neutral-900 px-5 py-3 text-sm font-semibold text-white hover:bg-neutral-800"
        >
          Cambiar de cuenta
        </Link>
        <Link
          href="/"
          className="rounded-xl border border-neutral-300 px-5 py-3 text-sm font-semibold text-neutral-700 hover:bg-neutral-50"
        >
          Ir al inicio
        </Link>
      </div>
    </main>
  );
}
