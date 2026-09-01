"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getPrivacyPolicy,
  getTermsOfUse,
  legalUiCopy,
  type LegalLocale,
  type LegalSection,
} from "@/lib/legal-docs";

function detectBrowserLocale(): LegalLocale {
  if (typeof navigator === "undefined") return "es";
  const code = (navigator.language || "es").toLowerCase();
  return code.startsWith("en") ? "en" : "es";
}

type DocBlock = {
  id?: string;
  title: string;
  intro: string;
  sections: LegalSection[];
};

function DocBody({ doc }: { doc: DocBlock }) {
  return (
    <div id={doc.id}>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
        {doc.title}
      </h1>
      <p className="mt-4 text-sm leading-relaxed text-slate-600">{doc.intro}</p>

      <div className="mt-8 space-y-8">
        {doc.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="text-base font-semibold text-slate-900">
              {section.heading}
            </h2>
            <div className="mt-2 space-y-3">
              {section.paragraphs.map((p) => (
                <p
                  key={p.slice(0, 48)}
                  className="text-sm leading-relaxed text-slate-700"
                >
                  {p}
                </p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

/** Privacy + terms on one page; language matches browser (or user toggle). */
export function LegalDocumentsView({
  initialLocale = "es",
  backTo,
}: {
  initialLocale?: LegalLocale;
  backTo?: "login" | "signup";
}) {
  const router = useRouter();
  const [locale, setLocale] = useState<LegalLocale>(initialLocale);

  useEffect(() => {
    const stored = window.localStorage.getItem("aikinora_legal_locale");
    if (stored === "es" || stored === "en") {
      setLocale(stored);
      return;
    }
    setLocale(detectBrowserLocale());
  }, []);

  function chooseLocale(next: LegalLocale) {
    setLocale(next);
    window.localStorage.setItem("aikinora_legal_locale", next);
  }

  const ui = legalUiCopy(locale);
  const privacy = useMemo(() => getPrivacyPolicy(locale), [locale]);
  const terms = useMemo(() => getTermsOfUse(locale), [locale]);
  const backHref =
    backTo === "signup" ? "/signup" : backTo === "login" ? "/login" : null;
  const backLabel =
    backTo === "signup"
      ? "Volver a crear cuenta"
      : backTo === "login"
        ? "Volver al inicio de sesión"
        : locale === "en"
          ? "Back"
          : "Volver";

  function handleBack() {
    if (backHref) {
      router.push(backHref);
      return;
    }
    if (typeof window !== "undefined") {
      const idx = (window.history.state as { idx?: number } | null)?.idx;
      if (typeof idx === "number" && idx > 0) {
        router.back();
        return;
      }
      const referrer = document.referrer;
      if (referrer && referrer.startsWith(window.location.origin)) {
        router.back();
        return;
      }
    }
    router.push("/");
  }

  return (
    <div className="flex-1 px-4 py-8 sm:px-6 sm:py-10">
      <article className="mx-auto w-full max-w-3xl rounded-2xl bg-slate-100 px-5 py-8 sm:px-8 sm:py-10">
      <button
        type="button"
        onClick={handleBack}
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800"
      >
        <span aria-hidden className="text-lg leading-none">
          ←
        </span>
        {backLabel}
      </button>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
          {ui.kicker}
        </p>
        <div
          className="flex items-center gap-1 rounded-lg border border-slate-200/80 bg-white p-0.5 text-xs font-semibold"
          role="group"
          aria-label={ui.languageLabel}
        >
          <button
            type="button"
            onClick={() => chooseLocale("es")}
            className={`rounded-md px-2.5 py-1 ${
              locale === "es"
                ? "bg-blue-600 text-white"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            ES
          </button>
          <button
            type="button"
            onClick={() => chooseLocale("en")}
            className={`rounded-md px-2.5 py-1 ${
              locale === "en"
                ? "bg-blue-600 text-white"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            EN
          </button>
        </div>
      </div>

      <DocBody
        doc={{
          id: "privacidad",
          title: privacy.title,
          intro: privacy.intro,
          sections: privacy.sections,
        }}
      />

      <hr className="my-12 border-slate-200" />

      <DocBody
        doc={{
          id: "terminos",
          title: terms.title,
          intro: terms.intro,
          sections: terms.sections,
        }}
      />

      <p className="mt-10 text-xs leading-relaxed text-slate-400">{ui.footnote}</p>
      </article>
    </div>
  );
}
