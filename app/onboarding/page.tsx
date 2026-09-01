import { AuthPageShell } from "@/components/auth-page-shell";
import { ClinicOnboardingForm } from "@/components/clinic-onboarding-form";
import { OnboardingForm } from "@/components/onboarding-form";
import { PhysioOnboardingForm } from "@/components/physio-onboarding-form";
import { isClinicUser, isPhysioUser } from "@/lib/account-type";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Completa tu perfil · AIKinora",
  description: "Onboarding según el tipo de cuenta",
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

  let isPhysio = isPhysioUser(user);
  let isClinic = isClinicUser(user);
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("account_type")
      .eq("id", user.id)
      .maybeSingle();

    // Prefer explicit profile role; if still wrongly "patient", trust JWT metadata.
    if (profile?.account_type === "clinic") {
      isClinic = true;
      isPhysio = false;
    } else if (profile?.account_type === "physio") {
      isPhysio = true;
      isClinic = false;
    } else if (profile?.account_type === "patient") {
      if (isClinicUser(user)) {
        isClinic = true;
        isPhysio = false;
        await supabase
          .from("profiles")
          .update({ account_type: "clinic" })
          .eq("id", user.id);
      } else if (isPhysioUser(user)) {
        isPhysio = true;
        isClinic = false;
        await supabase
          .from("profiles")
          .update({ account_type: "physio" })
          .eq("id", user.id);
      } else {
        isPhysio = false;
        isClinic = false;
      }
    }
  }

  return (
    <AuthPageShell>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-700 to-blue-500 px-4 py-10 sm:px-6">
        {isClinic ? (
          <ClinicOnboardingForm />
        ) : isPhysio ? (
          <PhysioOnboardingForm />
        ) : (
          <OnboardingForm />
        )}
      </main>
    </AuthPageShell>
  );
}
