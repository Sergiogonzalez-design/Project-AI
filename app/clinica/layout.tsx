import type { Metadata } from "next";
import { ClinicHeaderBar } from "@/components/clinic-header-bar";

export const metadata: Metadata = {
  title: "Panel de la clínica · AIKinora",
  robots: { index: false, follow: false },
};

export default function ClinicaLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-[calc(100dvh-2.75rem)] flex-col bg-neutral-100">
      <ClinicHeaderBar />
      <div className="min-h-0 flex-1">{children}</div>
    </div>
  );
}
