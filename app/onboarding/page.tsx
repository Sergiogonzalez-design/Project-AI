import { OnboardingForm } from "@/components/onboarding-form";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Completa tu perfil · PhysioGuide AI",
  description: "Información básica y perfil deportivo",
};

export default function OnboardingPage() {
  if (!isSupabaseConfigured()) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-neutral-50 px-6">
        <p className="text-sm text-slate-600">Supabase no está configurado.</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-700 to-blue-500 px-4 py-10 sm:px-6">
      <OnboardingForm />
    </main>
  );
}
