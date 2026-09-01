import { useEffect, useRef } from "react";
import { AppState, type AppStateStatus } from "react-native";

/** Runs when the app returns to the foreground (active). */
export function useOnAppForeground(callback: () => void) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    const sub = AppState.addEventListener("change", (next: AppStateStatus) => {
      if (next === "active") callbackRef.current();
    });
    return () => sub.remove();
  }, []);
}

/** Runs when the app leaves the foreground (inactive / background). */
export function useOnAppBackground(callback: () => void) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    const sub = AppState.addEventListener("change", (next: AppStateStatus) => {
      if (next === "inactive" || next === "background") callbackRef.current();
    });
    return () => sub.remove();
  }, []);
}
