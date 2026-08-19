import * as SplashScreen from "expo-splash-screen";

/** Hide the native launch screen. Safe to call many times. */
export function hideNativeSplash() {
  try {
    SplashScreen.hide();
  } catch {
    SplashScreen.hideAsync().catch(() => {});
  }
}

/**
 * Keep trying to dismiss the splash. hide() is a no-op if called before the
 * native overlay exists, which is why a single early call is not enough.
 */
export function startSplashHideWatchdog(ms = 12_000): () => void {
  hideNativeSplash();
  const id = setInterval(hideNativeSplash, 200);
  const stop = setTimeout(() => clearInterval(id), ms);
  return () => {
    clearInterval(id);
    clearTimeout(stop);
  };
}
