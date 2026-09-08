import { ClinicBuscarClient } from "@/components/clinic-buscar-client";
import { absoluteSiteUrl } from "@/lib/site-url";
import type { Metadata } from "next";

export const revalidate = 300;

const title = "Buscar clínicas · AIKinora";
const description =
  "Encuentra clínicas de fisioterapia, guarda favoritos y lee sus novedades.";
const ogImage = absoluteSiteUrl("/logo-icon.png");

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    type: "website",
    url: absoluteSiteUrl("/buscar"),
    title,
    description,
    siteName: "AIKinora",
    locale: "es_ES",
    images: [{ url: ogImage, alt: "AIKinora" }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [ogImage],
  },
};

export default function BuscarPage() {
  return <ClinicBuscarClient />;
}
