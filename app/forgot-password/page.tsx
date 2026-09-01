import { AuthPageShell } from "@/components/auth-page-shell";
import { ForgotPasswordForm } from "@/components/forgot-password-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Restablecer contraseña · AIKinora",
  description: "Recupera el acceso a tu cuenta",
};

export default function ForgotPasswordPage() {
  return (
    <AuthPageShell>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-700 to-blue-500 px-4 py-10 sm:px-6">
        <ForgotPasswordForm />
      </main>
    </AuthPageShell>
  );
}
