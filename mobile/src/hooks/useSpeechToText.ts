import { useCallback, useEffect, useRef, useState } from "react";
import { requireOptionalNativeModule } from "expo";
import { speechLocale } from "../lib/speech-utils";

type Options = {
  language?: "es" | "en" | string;
  onHearing?: (text: string) => void;
  onFinalUtterance?: (text: string) => void;
  keepAlive?: boolean;
};

type SpeechNativeModule = {
  getPermissionsAsync: () => Promise<{ granted: boolean }>;
  requestPermissionsAsync: () => Promise<{ granted: boolean }>;
  start: (opts: {
    lang: string;
    interimResults: boolean;
    continuous: boolean;
  }) => void;
  stop: () => void;
  abort: () => void;
  addListener: (
    event: string,
    listener: (event: Record<string, unknown>) => void
  ) => { remove: () => void };
};

function loadSpeechModule(): SpeechNativeModule | null {
  try {
    // Never `require("expo-speech-recognition")` unless native exists —
    // that package calls requireNativeModule and LogBox-redboxes in Expo Go.
    return requireOptionalNativeModule<SpeechNativeModule>(
      "ExpoSpeechRecognition"
    );
  } catch {
    return null;
  }
}

export function isSpeechToTextSupported(): boolean {
  return loadSpeechModule() != null;
}

export function useSpeechToText(options: Options) {
  const {
    language = "es",
    onHearing,
    onFinalUtterance,
    keepAlive = false,
  } = options;
  const [listening, setListening] = useState(false);
  const [supported] = useState(() => isSpeechToTextSupported());
  const [error, setError] = useState<string | null>(null);
  const committedRef = useRef("");
  const wantListeningRef = useRef(false);
  const keepAliveRef = useRef(keepAlive);
  const onHearingRef = useRef(onHearing);
  const onFinalUtteranceRef = useRef(onFinalUtterance);
  onHearingRef.current = onHearing;
  onFinalUtteranceRef.current = onFinalUtterance;
  keepAliveRef.current = keepAlive;
  const moduleRef = useRef(loadSpeechModule());
  const languageRef = useRef(language);
  languageRef.current = language;

  useEffect(() => {
    const mod = moduleRef.current;
    if (!mod) return;

    const resultSub = mod.addListener("result", (event) => {
      const results = event.results as
        | Array<{ transcript?: string }>
        | undefined;
      const isFinal = Boolean(event.isFinal);
      const transcript = (results?.[0]?.transcript ?? "").trim();
      if (!transcript) return;
      if (isFinal) {
        committedRef.current = `${committedRef.current} ${transcript}`.trim();
        onFinalUtteranceRef.current?.(transcript);
        onHearingRef.current?.(committedRef.current);
      } else {
        onHearingRef.current?.(
          `${committedRef.current} ${transcript}`.trim()
        );
      }
    });

    const endSub = mod.addListener("end", () => {
      if (wantListeningRef.current && keepAliveRef.current) {
        setTimeout(() => {
          if (!wantListeningRef.current) return;
          try {
            committedRef.current = "";
            mod.start({
              lang: speechLocale(languageRef.current),
              interimResults: true,
              continuous: true,
            });
            setListening(true);
          } catch {
            setListening(false);
            wantListeningRef.current = false;
          }
        }, 250);
        return;
      }
      setListening(false);
      wantListeningRef.current = false;
    });

    const errorSub = mod.addListener("error", (event) => {
      const code = String(event.error ?? "");
      if (code === "aborted" || code === "no-speech") return;
      setError(
        code === "not-allowed"
          ? "Permiso de micrófono denegado."
          : "No se pudo usar el micrófono."
      );
      if (code === "not-allowed") {
        wantListeningRef.current = false;
        setListening(false);
      }
    });

    return () => {
      resultSub.remove();
      endSub.remove();
      errorSub.remove();
      wantListeningRef.current = false;
      try {
        mod.abort();
      } catch {
        /* ignore */
      }
    };
  }, []);

  const stop = useCallback(() => {
    wantListeningRef.current = false;
    const mod = moduleRef.current;
    if (!mod) {
      setListening(false);
      return;
    }
    try {
      mod.abort();
    } catch {
      try {
        mod.stop();
      } catch {
        /* ignore */
      }
    }
    setListening(false);
  }, []);

  const start = useCallback(async () => {
    const mod = moduleRef.current;
    if (!mod) {
      setError(
        "La voz no está disponible en esta build. Necesitas una build nativa nueva."
      );
      return;
    }
    setError(null);
    try {
      const current = await mod.getPermissionsAsync();
      const granted =
        current.granted || (await mod.requestPermissionsAsync()).granted;
      if (!granted) {
        setError("Permiso de micrófono denegado.");
        return;
      }
      wantListeningRef.current = true;
      committedRef.current = "";
      mod.start({
        lang: speechLocale(language),
        interimResults: true,
        continuous: true,
      });
      setListening(true);
    } catch {
      setError("No se pudo iniciar el micrófono.");
      setListening(false);
      wantListeningRef.current = false;
    }
  }, [language]);

  const toggle = useCallback(() => {
    if (wantListeningRef.current || listening) stop();
    else void start();
  }, [listening, start, stop]);

  return { supported, listening, error, start, stop, toggle };
}
