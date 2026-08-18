import { AuthPageShell } from "@/components/auth-page-shell";
import { OnboardingForm } from "@/components/onboarding-form";
import { PhysioOnboardingForm } from "@/components/physio-onboarding-form";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Completa tu perfil · AIKinora",
  description: "Información básica y perfil deportivo",
};

export default async function OnboardingPage() {
  if (!isSupabaseConfigured()) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-neutral-50 px-6">
        <p className="text-sm text-slate-600">Supabase no está configurado.</p>
      </main>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let isPhysio = false;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("account_type")
      .eq("id", user.id)
      .maybeSingle();
    isPhysio = profile?.account_type === "physio";
  }

  return (
    <AuthPageShell>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-700 to-blue-500 px-4 py-10 sm:px-6">
        {isPhysio ? <PhysioOnboardingForm /> : <OnboardingForm />}
      </main>
    </AuthPageShell>
  );
}
