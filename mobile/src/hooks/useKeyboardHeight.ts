import { useEffect, useState } from "react";
import { Keyboard, Platform, type KeyboardEvent } from "react-native";

function overlapFromEvent(e: KeyboardEvent) {
  return Math.max(0, Math.round(e.endCoordinates?.height ?? 0));
}

/**
 * How many pixels the software keyboard covers at the bottom of the window.
 * Apply as paddingBottom on the screen root so the composer sits above the keys.
 */
export function useKeyboardHeight() {
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const onShow = (e: KeyboardEvent) => {
      setHeight(overlapFromEvent(e));
    };
    const onHide = () => setHeight(0);
    const onChange = (e: KeyboardEvent) => {
      setHeight(overlapFromEvent(e));
    };

    const showEvent =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";
    const subs = [
      Keyboard.addListener(showEvent, onShow),
      Keyboard.addListener(hideEvent, onHide),
      Keyboard.addListener("keyboardDidShow", onShow),
      Keyboard.addListener("keyboardDidHide", onHide),
    ];
    try {
      if (Platform.OS === "ios") {
        subs.push(Keyboard.addListener("keyboardDidChangeFrame", onChange));
      }
    } catch {
      // Event name not available on this runtime.
    }

    return () => {
      for (const sub of subs) sub.remove();
    };
  }, []);

  return height;
}

/** Bottom inset for a chat composer: keyboard overlap on iOS; 0 when closed (app disclaimer sits below). */
export function composerBottomInset(keyboardHeight: number, _safeBottom: number) {
  if (Platform.OS === "ios" && keyboardHeight > 0) return keyboardHeight;
  if (Platform.OS === "android" && keyboardHeight > 0) return keyboardHeight;
  return 0;
}
