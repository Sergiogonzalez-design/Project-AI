"use client";

import { useRouter } from "next/navigation";

type Props = {
  /** Where to go when there is no in-app history (e.g. direct link open). */
  fallbackHref: string;
  className?: string;
};

export function NavBackButton({ fallbackHref, className = "" }: Props) {
  const router = useRouter();

  function handleBack() {
    if (typeof window === "undefined") {
      router.push(fallbackHref);
      return;
    }
    const referrer = document.referrer;
    const sameOrigin = Boolean(
      referrer && referrer.startsWith(window.location.origin)
    );
    if (sameOrigin && window.history.length > 1) {
      router.back();
      return;
    }
    router.push(fallbackHref);
  }

  return (
    <button
      type="button"
      onClick={handleBack}
      aria-label="Volver"
      className={`btn-icon !h-10 !w-10 shrink-0 text-slate-800 ${className}`.trim()}
    >
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" aria-hidden>
        <path
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 6l-6 6 6 6"
        />
      </svg>
    </button>
  );
}
