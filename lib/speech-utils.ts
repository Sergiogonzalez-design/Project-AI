/** Strip markdown / formatting so TTS reads cleanly. */
export function stripForSpeech(text: string): string {
  return text
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^[-*•]\s+/gm, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/_([^_]+)_/g, "$1")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function speechLocale(language: "es" | "en" | string | undefined): string {
  return language === "en" ? "en-US" : "es-ES";
}

export const VOICE_AUTO_PLAY_KEY = "aikinora_voice_autoplay";
