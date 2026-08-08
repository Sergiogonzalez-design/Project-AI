"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { speechLocale, stripForSpeech } from "@/lib/speech-utils";

export function isSpeechSynthesisSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

type SpeakOptions = {
  onEnd?: () => void;
};

type Options = {
  language?: "es" | "en" | string;
};

/** Chrome often needs a kick after cancel() or the utterance never plays. */
function unlockSpeechSynthesis() {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  try {
    window.speechSynthesis.resume();
  } catch {
    /* ignore */
  }
}

export function useSpeechSynthesis(options: Options = {}) {
  const { language = "es" } = options;
  const [supported, setSupported] = useState(false);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const onEndRef = useRef<(() => void) | null>(null);
  const speakTokenRef = useRef(0);

  useEffect(() => {
    setSupported(isSpeechSynthesisSupported());
  }, []);

  const cancel = useCallback(() => {
    onEndRef.current = null;
    speakTokenRef.current += 1;
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    utteranceRef.current = null;
    setSpeakingId(null);
  }, []);

  const speak = useCallback(
    (text: string, id?: string, opts?: SpeakOptions) => {
      if (!isSpeechSynthesisSupported()) {
        opts?.onEnd?.();
        return;
      }
      const clean = stripForSpeech(text);
      if (!clean) {
        opts?.onEnd?.();
        return;
      }

      const speakKey = id ?? "__default__";
      const token = ++speakTokenRef.current;
      onEndRef.current = opts?.onEnd ?? null;

      window.speechSynthesis.cancel();
      unlockSpeechSynthesis();

      const start = () => {
        if (speakTokenRef.current !== token) return;

        const utterance = new SpeechSynthesisUtterance(clean);
        utterance.lang = speechLocale(language);
        utterance.rate = 1.02;
        const voices = window.speechSynthesis.getVoices();
        const langPrefix = speechLocale(language).slice(0, 2);
        const match =
          voices.find(
            (v) =>
              v.lang.toLowerCase().startsWith(langPrefix) &&
              /google|microsoft|sabina|jorge|monica|paulina|helena/i.test(
                v.name
              )
          ) ??
          voices.find((v) => v.lang.toLowerCase().startsWith(langPrefix)) ??
          voices.find((v) => v.lang.toLowerCase().includes(langPrefix));
        if (match) utterance.voice = match;

        const finish = () => {
          if (speakTokenRef.current !== token) return;
          utteranceRef.current = null;
          setSpeakingId((cur) => (cur === speakKey ? null : cur));
          const cb = onEndRef.current;
          onEndRef.current = null;
          cb?.();
        };
        utterance.onend = finish;
        utterance.onerror = finish;

        utteranceRef.current = utterance;
        setSpeakingId(speakKey);
        unlockSpeechSynthesis();
        window.speechSynthesis.speak(utterance);

        // Chrome sometimes leaves synthesis paused; nudge it.
        window.setTimeout(() => {
          if (speakTokenRef.current !== token) return;
          unlockSpeechSynthesis();
        }, 80);
      };

      // Let cancel() settle before speaking (Chrome quirk).
      window.setTimeout(start, 60);
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
    if (!supported) return;
    const warm = () => {
      window.speechSynthesis.getVoices();
      unlockSpeechSynthesis();
    };
    warm();
    window.speechSynthesis.addEventListener("voiceschanged", warm);
    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", warm);
      window.speechSynthesis.cancel();
    };
  }, [supported]);

  return {
    supported,
    speakingId,
    speak,
    cancel,
    toggle,
    isSpeaking: speakingId !== null,
  };
}
