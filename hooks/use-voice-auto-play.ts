"use client";

import { useEffect, useState } from "react";
import { VOICE_AUTO_PLAY_KEY } from "@/lib/speech-utils";

export function useVoiceAutoPlay() {
  const [autoPlay, setAutoPlayState] = useState(false);

  useEffect(() => {
    try {
      setAutoPlayState(localStorage.getItem(VOICE_AUTO_PLAY_KEY) === "1");
    } catch {
      /* ignore */
    }
  }, []);

  function setAutoPlay(value: boolean) {
    setAutoPlayState(value);
    try {
      localStorage.setItem(VOICE_AUTO_PLAY_KEY, value ? "1" : "0");
    } catch {
      /* ignore */
    }
  }

  return { autoPlay, setAutoPlay };
}
