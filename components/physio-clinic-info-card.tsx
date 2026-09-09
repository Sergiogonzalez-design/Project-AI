"use client";

import Link from "next/link";
import { ClinicCoverBanner } from "@/components/clinic-cover-banner";
import {
  normalizeClinicAccent,
  parseClinicSpecialties,
} from "@/lib/clinic-brand";
import { displayClinicHoursText } from "@/lib/clinic-hours";

export type PhysioClinicSummary = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  logo_url?: string | null;
  cover_url?: string | null;
  tagline?: string | null;
  accent_color?: string | null;
  address?: string | null;
  city?: string | null;
  postal_code?: string | null;
  phone?: string | null;
  contact_email?: string | null;
  website?: string | null;
  hours?: string | null;
  specialties?: string[] | null;
};

export function PhysioClinicInfoCard({ clinic }: { clinic: PhysioClinicSummary }) {
  const accent = normalizeClinicAccent(clinic.accent_color);
  const hours = displayClinicHoursText(clinic.hours);
  const chips = parseClinicSpecialties(clinic.specialties);
  const location = [clinic.address, clinic.postal_code, clinic.city]
    .filter(Boolean)
    .join(", ");

  return (
    <section className="mt-6 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
      <ClinicCoverBanner
        coverUrl={clinic.cover_url}
        accentColor={clinic.accent_color}
        size="md"
      />
      <div className="relative px-5 pb-5">
        <div className="-mt-8 flex items-end gap-3 sm:-mt-10">
          {clinic.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={clinic.logo_url}
              alt=""
              className="h-16 w-16 rounded-2xl border-4 border-white object-cover shadow-md sm:h-[4.5rem] sm:w-[4.5rem]"
            />
          ) : (
            <div
              className="flex h-16 w-16 items-center justify-center rounded-2xl border-4 border-white text-lg font-extrabold text-white shadow-md sm:h-[4.5rem] sm:w-[4.5rem]"
              style={{ background: accent }}
            >
              {clinic.name.slice(0, 1).toUpperCase()}
            </div>
          )}
          <div className="min-w-0 pb-1">
            <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
              Tu clínica
            </p>
            <h2 className="truncate text-lg font-bold text-neutral-900 sm:text-xl">
              {clinic.name}
            </h2>
            {clinic.tagline ? (
              <p className="text-sm text-slate-500">{clinic.tagline}</p>
            ) : null}
          </div>
        </div>

        {clinic.description ? (
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            {clinic.description}
          </p>
        ) : null}

        {chips.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {chips.map((s) => (
              <span
                key={s}
                className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold"
                style={{ color: accent }}
              >
                {s}
              </span>
            ))}
          </div>
        ) : null}

        {hours ? (
          <div className="mt-4">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
              Horario
            </p>
            <p className="mt-1 whitespace-pre-wrap text-sm text-slate-800">
              {hours}
            </p>
          </div>
        ) : null}

        {location ? (
          <div className="mt-3">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
              Dirección
            </p>
            <p className="mt-1 text-sm text-slate-800">{location}</p>
          </div>
        ) : null}

        <dl className="mt-3 space-y-1 text-sm text-slate-600">
          {clinic.phone ? (
            <div>
              <span className="font-semibold text-slate-400">Tel: </span>
              {clinic.phone}
            </div>
          ) : null}
          {clinic.contact_email ? (
            <div>
              <span className="font-semibold text-slate-400">Email: </span>
              {clinic.contact_email}
            </div>
          ) : null}
          {clinic.website ? (
            <div>
              <span className="font-semibold text-slate-400">Web: </span>
              {clinic.website}
            </div>
          ) : null}
        </dl>

        {clinic.slug ? (
          <Link
            href={`/centro/${clinic.slug}`}
            className="mt-4 inline-block text-sm font-bold hover:underline"
            style={{ color: accent }}
          >
            Ver ficha pública →
          </Link>
        ) : null}
      </div>
    </section>
  );
}
