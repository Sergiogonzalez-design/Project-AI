import { ClinicPublicProfile } from "@/components/clinic-public-profile";
import type { ClinicPost, ClinicPublicProfile as ClinicPublic } from "@/lib/clinic-directory";
import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ slug: string }>;
};

async function loadClinic(slug: string) {
  const supabase = await createClient();
  const { data } = await supabase.rpc("clinic_get_public", { p_slug: slug });
  const row = Array.isArray(data) ? data[0] : data;
  return (row ?? null) as ClinicPublic | null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const clinic = await loadClinic(slug);
  if (!clinic) return { title: "Clínica · AIKinora" };
  return {
    title: `${clinic.name} · AIKinora`,
    description: clinic.description ?? `Clínica de fisioterapia ${clinic.name}`,
  };
}

export default async function CentroPublicPage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createClient();
  const clinic = await loadClinic(slug);
  if (!clinic) notFound();

  const [{ data: physios }, { data: postRows }] = await Promise.all([
    supabase.rpc("clinic_list_physios_public", { p_slug: slug }),
    supabase.rpc("clinic_list_posts", { p_slug: slug }),
  ]);
  const team = ((physios as { display_name: string }[]) ?? []).filter(
    (p) => p.display_name
  );
  const posts = ((postRows as ClinicPost[]) ?? []).filter((p) => p.body);

  return <ClinicPublicProfile clinic={clinic} team={team} posts={posts} />;
}
