import { useEffect, useState } from "react";
import { AppState, Keyboard, Platform, type KeyboardEvent } from "react-native";

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

  useEffect(() => {
    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active") setHeight(0);
    });
    return () => sub.remove();
  }, []);

  return height;
}

/**
 * Lift the composer by the keyboard height.
 * On Android with softwareKeyboardLayoutMode "resize", the window already shrinks —
 * extra padding would double-count.
 */
export function composerBottomInset(keyboardHeight: number, _unused = 0) {
  if (keyboardHeight <= 0) return 0;
  if (Platform.OS === "android") return 0;
  return keyboardHeight;
}
