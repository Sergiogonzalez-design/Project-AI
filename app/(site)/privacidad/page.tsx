import type { Metadata } from "next";
import { LegalDocumentsView } from "@/components/legal-document-page";

export const metadata: Metadata = {
  title: "Privacidad y términos · AIKinora",
  description:
    "Política de privacidad y términos de uso de AIKinora (Privacy policy and Terms of use).",
  robots: { index: true, follow: true },
};

export default async function PrivacidadPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  const { from } = await searchParams;
  const backTo = from === "signup" || from === "login" ? from : undefined;
  return <LegalDocumentsView initialLocale="es" backTo={backTo} />;
}
