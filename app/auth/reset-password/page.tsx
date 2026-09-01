import { AuthPageShell } from "@/components/auth-page-shell";
import { ResetPasswordForm } from "@/components/reset-password-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nueva contraseña · AIKinora",
  description: "Crea una nueva contraseña para tu cuenta",
};

export default function ResetPasswordPage() {
  return (
    <AuthPageShell>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-700 to-blue-500 px-4 py-10 sm:px-6">
        <ResetPasswordForm />
      </main>
    </AuthPageShell>
  );
}
