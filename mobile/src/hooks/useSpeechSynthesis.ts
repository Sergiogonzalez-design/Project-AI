import { useCallback, useEffect, useState } from "react";
import { AppState } from "react-native";
import { speechLocale, stripForSpeech } from "../lib/speech-utils";

type SpeechApi = {
  speak: (
    text: string,
    options?: {
      language?: string;
      onDone?: () => void;
      onStopped?: () => void;
      onError?: () => void;
    }
  ) => void;
  stop: () => void;
  isSpeakingAsync?: () => Promise<boolean>;
};

function loadSpeech(): SpeechApi | null {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require("expo-speech") as SpeechApi;
  } catch {
    return null;
  }
}

export function isSpeechSynthesisSupported(): boolean {
  return loadSpeech() != null;
}

type Options = {
  language?: "es" | "en" | string;
};

export function useSpeechSynthesis(options: Options = {}) {
  const { language = "es" } = options;
  const [supported] = useState(() => isSpeechSynthesisSupported());
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  const cancel = useCallback(() => {
    const speech = loadSpeech();
    speech?.stop();
    setSpeakingId(null);
  }, []);

  const speak = useCallback(
    (text: string, id?: string, opts?: { onEnd?: () => void }) => {
      const speech = loadSpeech();
      if (!speech) {
        opts?.onEnd?.();
        return;
      }
      const clean = stripForSpeech(text);
      if (!clean) {
        opts?.onEnd?.();
        return;
      }
      speech.stop();
      const speakKey = id ?? "__default__";
      setSpeakingId(speakKey);
      speech.speak(clean, {
        language: speechLocale(language),
        onDone: () => {
          setSpeakingId((cur) => (cur === speakKey ? null : cur));
          opts?.onEnd?.();
        },
        onStopped: () => {
          setSpeakingId((cur) => (cur === speakKey ? null : cur));
          opts?.onEnd?.();
        },
        onError: () => {
          setSpeakingId((cur) => (cur === speakKey ? null : cur));
          opts?.onEnd?.();
        },
      });
    },
    [language]
  );

  const toggle = useCallback(
    (text: string, id?: string) => {
      const speakKey = id ?? "__default__";
      if (speakingId === speakKey) {
        cancel();
        return;
      }
      speak(text, id);
    },
    [speakingId, speak, cancel]
  );

  useEffect(() => {
    return () => {
      loadSpeech()?.stop();
    };
  }, []);

  useEffect(() => {
    const sub = AppState.addEventListener("change", (state) => {
      if (state === "inactive" || state === "background") {
        loadSpeech()?.stop();
        setSpeakingId(null);
      }
    });
    return () => sub.remove();
  }, []);

  return {
    supported,
    speakingId,
    speak,
    cancel,
    toggle,
    isSpeaking: speakingId !== null,
  };
}
