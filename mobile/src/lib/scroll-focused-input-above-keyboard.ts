import { Dimensions, Platform, TextInput, type ScrollView } from "react-native";

type Measureable = {
  measureInWindow?: (
    callback: (x: number, y: number, width: number, height: number) => void
  ) => void;
};

/**
 * Scroll a ScrollView so the currently focused TextInput sits above the keyboard.
 */
export function scrollFocusedInputAboveKeyboard(
  scrollRef: ScrollView | null,
  scrollOffsetY: number,
  keyboardHeight: number,
  gapPx = 24
): void {
  if (!scrollRef || keyboardHeight <= 0) return;

  const focused = TextInput.State.currentlyFocusedInput?.() as Measureable | null;
  if (!focused?.measureInWindow) return;

  const winH = Dimensions.get("window").height;
  // Android "resize" already shrinks the window to sit above the keyboard.
  const visibleBottom =
    Platform.OS === "android"
      ? winH - gapPx
      : winH - keyboardHeight - gapPx;

  focused.measureInWindow((_x, y, _w, height) => {
    const inputBottom = y + height;
    if (inputBottom <= visibleBottom) return;
    const delta = inputBottom - visibleBottom;
    scrollRef.scrollTo({
      y: Math.max(0, scrollOffsetY + delta),
      animated: true,
    });
  });
}
