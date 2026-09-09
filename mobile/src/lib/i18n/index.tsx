import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Localization from "expo-localization";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  translations,
  type AppLocale,
  type LanguagePreference,
  type Translations,
} from "./translations";

const LANGUAGE_KEY = "kinora_language_preference";

type I18nContextValue = {
  locale: AppLocale;
  preference: LanguagePreference;
  t: Translations;
  setPreference: (preference: LanguagePreference) => Promise<void>;
  ready: boolean;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function detectDeviceLocale(): AppLocale {
  const code = Localization.getLocales()[0]?.languageCode?.toLowerCase() ?? "es";
  return code.startsWith("en") ? "en" : "es";
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [preference, setPreferenceState] = useState<LanguagePreference>(
    detectDeviceLocale()
  );
  // Start ready so a hung AsyncStorage read cannot pin the native splash.
  const [ready, setReady] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(LANGUAGE_KEY)
      .then(async (stored) => {
        if (stored === "es" || stored === "en") {
          setPreferenceState(stored);
          return;
        }
        // Migrate old "system" (or missing) to the phone language once.
        const device = detectDeviceLocale();
        setPreferenceState(device);
        await AsyncStorage.setItem(LANGUAGE_KEY, device);
      })
      .finally(() => setReady(true));
  }, []);

  const setPreference = useCallback(async (next: LanguagePreference) => {
    setPreferenceState(next);
    await AsyncStorage.setItem(LANGUAGE_KEY, next);
  }, []);

  const value = useMemo<I18nContextValue>(
    () => ({
      locale: preference,
      preference,
      t: translations[preference],
      setPreference,
      ready,
    }),
    [preference, setPreference, ready]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used within I18nProvider");
  }
  return ctx;
}

/** Safe when context is missing (e.g. boot shell, error fallbacks). */
export function useI18nOptional(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (ctx) return ctx;
  const locale = detectDeviceLocale();
  return {
    locale,
    preference: locale,
    t: translations[locale],
    setPreference: async () => {},
    ready: true,
  };
}
