import type { Metadata } from "next";
import { ClinicPatientsPanel } from "@/components/clinic-patients-panel";

export const metadata: Metadata = {
  title: "Cuentas · AIKinora",
};

export default function ClinicaPacientesPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
      <ClinicPatientsPanel />
    </main>
  );
}
