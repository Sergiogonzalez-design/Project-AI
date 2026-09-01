import Link from "next/link";
import {
  clinicAccentSoft,
  normalizeClinicAccent,
  parseClinicSpecialties,
} from "@/lib/clinic-brand";
import type { ClinicSearchCard } from "@/lib/clinic-directory";

export function ClinicDirectoryCard({ clinic }: { clinic: ClinicSearchCard }) {
  const accent = normalizeClinicAccent(clinic.accent_color);
  const soft = clinicAccentSoft(accent);
  const specialties = parseClinicSpecialties(clinic.specialties).slice(0, 3);
  const snippet = (clinic.tagline || clinic.description || "").trim();

  return (
    <Link
      href={`/centro/${clinic.slug}`}
      className="group block overflow-hidden rounded-[22px] border border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.05)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(15,23,42,0.1)]"
    >
      <div
        className="relative h-28 overflow-hidden"
        style={{
          background: clinic.cover_url
            ? undefined
            : `linear-gradient(135deg, ${accent} 0%, #0f172a 110%)`,
        }}
      >
        {clinic.cover_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={clinic.cover_url} alt="" className="h-full w-full object-cover" />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
        <div className="absolute -bottom-6 left-4 h-14 w-14 overflow-hidden rounded-2xl border-2 border-white shadow-md">
          {clinic.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={clinic.logo_url} alt="" className="h-full w-full object-cover" />
          ) : (
            <div
              className="flex h-full w-full items-center justify-center text-lg font-bold text-white"
              style={{ background: accent }}
            >
              {clinic.name.slice(0, 1).toUpperCase()}
            </div>
          )}
        </div>
      </div>
      <div className="px-4 pb-4 pt-8">
        <p className="truncate text-[17px] font-semibold tracking-tight text-slate-950">
          {clinic.name}
        </p>
        {clinic.city ? (
          <p className="mt-0.5 text-sm text-slate-500">{clinic.city}</p>
        ) : null}
        {snippet ? (
          <p className="mt-1.5 line-clamp-2 text-sm text-slate-600">{snippet}</p>
        ) : null}
        {specialties.length > 0 ? (
          <div className="mt-2.5 flex flex-wrap gap-1">
            {specialties.map((s) => (
              <span
                key={s}
                className="rounded-full px-2 py-0.5 text-[11px] font-semibold"
                style={{ background: soft, color: accent }}
              >
                {s}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </Link>
  );
}
