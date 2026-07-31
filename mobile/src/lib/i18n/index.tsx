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
  const [ready, setReady] = useState(false);

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

  return React.createElement(I18nContext.Provider, { value }, children);
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used within I18nProvider");
  }
  return ctx;
}
