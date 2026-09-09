import { AuthPageShell } from "@/components/auth-page-shell";
import { PhysioJoinClient } from "@/components/physio-join-client";
import { extractInviteCodeFromSearch } from "@/lib/physio-invite";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Consulta previa · AIKinora",
  description: "Vincula tu código y empieza la consulta previa",
};

type PageProps = {
  searchParams?: Promise<{ code?: string }>;
};

export default async function UnirsePage({ searchParams }: PageProps) {
  const sp = (await searchParams) ?? {};
  const initialCode = extractInviteCodeFromSearch({ code: sp.code });

  if (!isSupabaseConfigured()) {
    return (
      <main className="flex min-h-full flex-1 flex-col items-center justify-center bg-neutral-50 px-6 py-16">
        <p className="text-sm text-amber-900">Supabase no está configurado.</p>
      </main>
    );
  }

  return (
    <AuthPageShell>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-700 to-blue-500 px-4 py-10 sm:px-6">
        <PhysioJoinClient initialCode={initialCode} />
      </main>
    </AuthPageShell>
  );
}
