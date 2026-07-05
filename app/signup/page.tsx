import { SignupForm } from "@/components/signup-form";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Crear cuenta · PhysioGuide AI",
  description: "Registro de usuario",
};

export default function SignupPage() {
  if (!isSupabaseConfigured()) {
    return (
      <main className="flex min-h-full flex-1 flex-col items-center justify-center bg-neutral-50 px-6 py-16">
        <div className="max-w-md rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-950">
          <p className="font-medium">Supabase no está configurado</p>
          <p className="mt-2 text-amber-900/90">
            Copia <code className="rounded bg-amber-100 px-1">.env.example</code> a{" "}
            <code className="rounded bg-amber-100 px-1">.env.local</code> y define la URL y la
            clave publicable de Supabase para habilitar el registro.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-full flex-1 flex-col items-center justify-center bg-neutral-50 px-6 py-16">
      <SignupForm />
    </main>
  );
}
