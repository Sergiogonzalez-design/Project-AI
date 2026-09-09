"use client";

import { normalizeClinicAccent } from "@/lib/clinic-brand";

type Props = {
  coverUrl?: string | null;
  accentColor?: string | null;
  /** denser cards (directory) vs hero (profile / fisio card) */
  size?: "sm" | "md" | "lg";
  className?: string;
  children?: React.ReactNode;
};

const SIZE_CLASS: Record<NonNullable<Props["size"]>, string> = {
  sm: "aspect-[2.2/1] min-h-[7.5rem] sm:aspect-[2.5/1] sm:min-h-[8.5rem]",
  md: "aspect-[2.2/1] min-h-[10rem] sm:aspect-[2.6/1] sm:min-h-[12rem] md:aspect-[3/1] md:min-h-[14rem]",
  lg: "aspect-[2/1] min-h-[11rem] sm:aspect-[2.4/1] sm:min-h-[14rem] lg:aspect-[2.8/1] lg:min-h-[16rem]",
};

/**
 * Responsive clinic cover: accent fill + object-cover so wide desktop
 * cards and narrow mobile screens both crop cleanly instead of stretching.
 */
export function ClinicCoverBanner({
  coverUrl,
  accentColor,
  size = "md",
  className = "",
  children,
}: Props) {
  const accent = normalizeClinicAccent(accentColor);

  return (
    <div
      className={`relative w-full overflow-hidden ${SIZE_CLASS[size]} ${className}`}
      style={{
        background: coverUrl
          ? accent
          : `linear-gradient(135deg, ${accent} 0%, #0f172a 100%)`,
      }}
    >
      {coverUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={coverUrl}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
      ) : null}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-black/5 to-transparent" />
      {children}
    </div>
  );
}
