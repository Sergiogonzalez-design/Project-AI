import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { VOICE_AUTO_PLAY_KEY } from "../lib/speech-utils";

export function useVoiceAutoPlay() {
  const [autoPlay, setAutoPlayState] = useState(false);

  useEffect(() => {
    void AsyncStorage.getItem(VOICE_AUTO_PLAY_KEY).then((v) => {
      if (v === "1") setAutoPlayState(true);
    });
  }, []);

  function setAutoPlay(value: boolean) {
    setAutoPlayState(value);
    void AsyncStorage.setItem(VOICE_AUTO_PLAY_KEY, value ? "1" : "0");
  }

  return { autoPlay, setAutoPlay };
}
