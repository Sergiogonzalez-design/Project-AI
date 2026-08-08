"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { speechLocale } from "@/lib/speech-utils";

type SpeechRecognitionLike = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: { error?: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
};

type SpeechRecognitionEventLike = {
  resultIndex: number;
  results: ArrayLike<{
    isFinal: boolean;
    0: { transcript: string };
  }>;
};

type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

function getSpeechRecognitionCtor(): SpeechRecognitionCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as Window & {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export function isSpeechToTextSupported(): boolean {
  return Boolean(getSpeechRecognitionCtor());
}

type Options = {
  language?: "es" | "en" | string;
  /**
   * Live transcript while listening (finals + current interim).
   * Use this for conversation silence detection.
   */
  onHearing?: (text: string) => void;
  /** Fired when an utterance segment is finalized by the browser. */
  onFinalUtterance?: (text: string) => void;
  keepAlive?: boolean;
};

export function useSpeechToText(options: Options) {
  const {
    language = "es",
    onHearing,
    onFinalUtterance,
    keepAlive = false,
  } = options;
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const committedRef = useRef("");
  const wantListeningRef = useRef(false);
  const keepAliveRef = useRef(keepAlive);
  const onHearingRef = useRef(onHearing);
  const onFinalUtteranceRef = useRef(onFinalUtterance);
  onHearingRef.current = onHearing;
  onFinalUtteranceRef.current = onFinalUtterance;
  keepAliveRef.current = keepAlive;

  useEffect(() => {
    setSupported(isSpeechToTextSupported());
  }, []);

  const stop = useCallback(() => {
    wantListeningRef.current = false;
    const rec = recognitionRef.current;
    if (!rec) {
      setListening(false);
      return;
    }
    try {
      rec.abort();
    } catch {
      try {
        rec.stop();
      } catch {
        /* already stopped */
      }
    }
    setListening(false);
  }, []);

  const startRecognition = useCallback(() => {
    const Ctor = getSpeechRecognitionCtor();
    if (!Ctor) {
      setError("Tu navegador no admite dictado por voz.");
      wantListeningRef.current = false;
      setListening(false);
      return;
    }
    setError(null);
    try {
      recognitionRef.current?.abort();
    } catch {
      /* ignore */
    }

    const recognition = new Ctor();
    recognition.lang = speechLocale(language);
    recognition.continuous = true;
    recognition.interimResults = true;
    committedRef.current = "";

    recognition.onresult = (event) => {
      let interim = "";
      let newlyFinal = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const piece = result[0]?.transcript ?? "";
        if (result.isFinal) newlyFinal += piece;
        else interim += piece;
      }
      if (newlyFinal.trim()) {
        const trimmed = newlyFinal.trim();
        committedRef.current = `${committedRef.current} ${trimmed}`.trim();
        onFinalUtteranceRef.current?.(trimmed);
      }
      const heard = `${committedRef.current} ${interim}`.trim();
      if (heard) onHearingRef.current?.(heard);
    };

    recognition.onerror = (event) => {
      const code = event.error ?? "";
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
    };

    recognition.onend = () => {
      if (wantListeningRef.current && keepAliveRef.current) {
        window.setTimeout(() => {
          if (!wantListeningRef.current) return;
          try {
            startRecognition();
          } catch {
            setListening(false);
            wantListeningRef.current = false;
          }
        }, 200);
        return;
      }
      setListening(false);
      wantListeningRef.current = false;
    };

    recognitionRef.current = recognition;
    try {
      recognition.start();
      setListening(true);
    } catch {
      setError("No se pudo iniciar el micrófono.");
      setListening(false);
      wantListeningRef.current = false;
    }
  }, [language]);

  const start = useCallback(() => {
    wantListeningRef.current = true;
    committedRef.current = "";
    startRecognition();
  }, [startRecognition]);

  const toggle = useCallback(() => {
    if (wantListeningRef.current || listening) stop();
    else start();
  }, [listening, start, stop]);

  useEffect(() => {
    return () => {
      wantListeningRef.current = false;
      try {
        recognitionRef.current?.abort();
      } catch {
        /* ignore */
      }
    };
  }, []);

  return { supported, listening, error, start, stop, toggle };
}
