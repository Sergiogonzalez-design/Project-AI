import { ClinicPublicProfile } from "@/components/clinic-public-profile";
import type { ClinicPost, ClinicPublicProfile as ClinicPublic } from "@/lib/clinic-directory";
import { absoluteSiteUrl } from "@/lib/site-url";
import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 300;

type PublicTeamMember = { user_id: string; display_name: string };

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
  const title = `${clinic.name} · AIKinora`;
  const description =
    clinic.tagline ||
    clinic.description ||
    `Clínica de fisioterapia ${clinic.name}${clinic.city ? ` en ${clinic.city}` : ""}`;
  const image = clinic.cover_url || clinic.logo_url || absoluteSiteUrl("/logo-icon.png");
  const url = absoluteSiteUrl(`/centro/${slug}`);
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      title,
      description,
      siteName: "AIKinora",
      locale: "es_ES",
      images: [{ url: image, width: 1200, height: 630, alt: clinic.name }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
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
  const team = ((physios as PublicTeamMember[]) ?? []).filter((p) => p.display_name);
  const posts = ((postRows as ClinicPost[]) ?? []).filter((p) => p.body);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: clinic.name,
    description: clinic.description || clinic.tagline || undefined,
    url: absoluteSiteUrl(`/centro/${clinic.slug}`),
    image: clinic.cover_url || clinic.logo_url || undefined,
    telephone: clinic.phone || undefined,
    email: clinic.contact_email || undefined,
    address: clinic.address
      ? {
          "@type": "PostalAddress",
          streetAddress: clinic.address,
          addressLocality: clinic.city || undefined,
          postalCode: clinic.postal_code || undefined,
          addressCountry: clinic.country || "ES",
        }
      : undefined,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ClinicPublicProfile clinic={clinic} team={team} posts={posts} />
    </>
  );
}
