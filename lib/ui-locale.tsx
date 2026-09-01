"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type UiLocale = "es" | "en";

const STORAGE_KEY = "aikinora_ui_locale";

/**
 * Prefer an explicit language. On the server, do NOT read `navigator` —
 * Node 21+ defines `navigator.language` (often `en-US`), which causes
 * hydration mismatches vs a Spanish (or other) browser.
 */
export function detectUiLocale(language?: string): UiLocale {
  const lang =
    language ??
    (typeof window !== "undefined" ? window.navigator.language : "es");
  return lang.toLowerCase().startsWith("en") ? "en" : "es";
}

function readStoredLocale(): UiLocale | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === "es" || raw === "en") return raw;
  } catch {
    /* ignore */
  }
  return null;
}

type UiLocaleContextValue = {
  locale: UiLocale;
  setLocale: (locale: UiLocale) => void;
  ready: boolean;
};

const UiLocaleContext = createContext<UiLocaleContextValue | null>(null);

export function UiLocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<UiLocale>("es");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = readStoredLocale();
    setLocaleState(stored ?? detectUiLocale());
    setReady(true);
  }, []);

  const setLocale = useCallback((next: UiLocale) => {
    setLocaleState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
    if (typeof document !== "undefined") {
      document.documentElement.lang = next;
    }
  }, []);

  useEffect(() => {
    if (!ready) return;
    document.documentElement.lang = locale;
  }, [locale, ready]);

  const value = useMemo(
    () => ({ locale, setLocale, ready }),
    [locale, setLocale, ready]
  );

  return (
    <UiLocaleContext.Provider value={value}>{children}</UiLocaleContext.Provider>
  );
}

export function useUiLocale() {
  const ctx = useContext(UiLocaleContext);
  if (!ctx) {
    throw new Error("useUiLocale must be used within UiLocaleProvider");
  }
  return ctx;
}

/** Safe for components that may render outside the provider (stable SSR default). */
export function useUiLocaleOptional(): UiLocaleContextValue {
  const ctx = useContext(UiLocaleContext);
  if (ctx) return ctx;
  return {
    locale: "es",
    setLocale: () => {},
    ready: true,
  };
}
