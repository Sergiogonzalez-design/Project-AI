import Constants from "expo-constants";
import { WEB_APP_URL } from "./admin-api";

function lanHostFrom(value: string | undefined | null): string | null {
  if (!value) return null;
  const cleaned = value.replace(/^[a-z]+:\/\//i, "").split("/")[0] ?? "";
  const host = cleaned.split(":")[0];
  if (host && /^\d{1,3}(?:\.\d{1,3}){3}$/.test(host)) return host;
  return null;
}

/**
 * Base URL for clinical images/videos.
 * In Expo Go, load from the local Next server on the same LAN as Metro.
 */
export function getWebMediaBaseUrl(): string {
  if (__DEV__) {
    const host =
      lanHostFrom(Constants.expoConfig?.hostUri) ??
      lanHostFrom(
        (Constants as { expoGoConfig?: { debuggerHost?: string } }).expoGoConfig
          ?.debuggerHost
      ) ??
      lanHostFrom(Constants.linkingUri);
    if (host) return `http://${host}:3000`;
  }
  return WEB_APP_URL;
}
