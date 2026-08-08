import { ClinicalReasoningPageClient } from "@/components/clinical-reasoning-page-client";

type PageProps = {
  params: Promise<{ patientId: string; reportId: string }>;
  searchParams: Promise<{ name?: string }>;
};

export default async function ClinicalReasoningPage({
  params,
  searchParams,
}: PageProps) {
  const { patientId, reportId } = await params;
  const { name } = await searchParams;

  return (
    <ClinicalReasoningPageClient
      patientId={patientId}
      reportId={reportId}
      patientName={name ? decodeURIComponent(name) : null}
    />
  );
}
