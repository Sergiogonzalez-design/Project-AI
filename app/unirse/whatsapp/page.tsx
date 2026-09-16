import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthPageShell } from "@/components/auth-page-shell";
import {
  buildWhatsAppDeepLink,
  extractInviteCodeFromSearch,
  looksLikeInviteCode,
} from "@/lib/physio-invite";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Consulta previa por WhatsApp · AIKinora",
  description: "Abre WhatsApp para completar la consulta previa con Physio",
};

type PageProps = {
  searchParams?: Promise<{ code?: string }>;
};

export default async function UnirseWhatsAppPage({ searchParams }: PageProps) {
  const sp = (await searchParams) ?? {};
  const code = extractInviteCodeFromSearch({ code: sp.code });
  const valid = looksLikeInviteCode(code);
  const deepLink = valid ? buildWhatsAppDeepLink(code) : null;

  if (valid && deepLink) {
    redirect(deepLink);
  }

  return (
    <AuthPageShell>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-700 to-blue-500 px-4 py-10 sm:px-6">
        <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-xl">
          <h1 className="text-xl font-bold text-neutral-900">
            WhatsApp · consulta previa
          </h1>
          {!valid ? (
            <p className="mt-3 text-sm text-neutral-600">
              Falta un código de vinculación válido. Pide a tu fisioterapeuta el
              enlace de WhatsApp o el código, o entra por la web.
            </p>
          ) : (
            <p className="mt-3 text-sm text-neutral-600">
              WhatsApp aún no está configurado en este entorno (falta el número
              de negocio). Mientras tanto, puedes hacer la consulta previa en
              la web con el mismo código.
            </p>
          )}
          <div className="mt-6 flex flex-col gap-3">
            {valid ? (
              <Link
                href={`/unirse?code=${encodeURIComponent(code)}`}
                className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white"
              >
                Continuar en la web (código {code})
              </Link>
            ) : (
              <Link
                href="/unirse"
                className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white"
              >
                Ir a unirse
              </Link>
            )}
          </div>
        </div>
      </main>
    </AuthPageShell>
  );
}
