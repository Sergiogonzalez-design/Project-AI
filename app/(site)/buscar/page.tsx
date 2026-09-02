import { ClinicBuscarClient } from "@/components/clinic-buscar-client";
import type { Metadata } from "next";

/** Avoid static prerender requiring Supabase env on Vercel Preview. */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Buscar clínicas · AIKinora",
  description: "Encuentra clínicas de fisioterapia, guarda favoritos y lee sus novedades.",
};

export default function BuscarPage() {
  return <ClinicBuscarClient />;
}
