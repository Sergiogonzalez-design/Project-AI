import type { Metadata } from "next";
import { LegalDocumentsView } from "@/components/legal-document-page";

export const metadata: Metadata = {
  title: "Privacidad y términos · AIKinora",
  description:
    "Política de privacidad y términos de uso de AIKinora (Privacy policy and Terms of use).",
  robots: { index: true, follow: true },
};

export default function PrivacidadPage() {
  return <LegalDocumentsView initialLocale="es" />;
}
