import { FisioPatientReports } from "@/components/fisio-patient-reports";

type PageProps = {
  params: Promise<{ patientId: string }>;
  searchParams: Promise<{ name?: string }>;
};

export default async function FisioPatientReportsPage({ params, searchParams }: PageProps) {
  const { patientId } = await params;
  const { name } = await searchParams;

  return (
    <FisioPatientReports
      patientId={patientId}
      patientLabel={name ? decodeURIComponent(name) : null}
    />
  );
}
