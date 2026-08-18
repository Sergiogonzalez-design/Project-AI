import { requireOptionalNativeModule } from "expo";
import { Platform } from "react-native";

type ClipboardNative = {
  setStringAsync?: (
    text: string,
    options?: { inputFormat?: string }
  ) => Promise<boolean>;
  setString?: (text: string) => boolean | void;
};

/**
 * Copy without importing `expo-clipboard` (that package pulls a missing
 * ExpoClipboardPasteButton and breaks the Metro bundle in Expo Go).
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  const value = String(text ?? "");
  if (!value) return false;

  if (Platform.OS === "web") {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
        return true;
      }
    } catch {
      /* fall through to execCommand */
    }
    try {
      const el = document.createElement("textarea");
      el.value = value;
      el.setAttribute("readonly", "");
      el.style.position = "fixed";
      el.style.left = "-9999px";
      document.body.appendChild(el);
      el.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(el);
      if (ok) return true;
    } catch {
      return false;
    }
    return false;
  }

  try {
    const mod = requireOptionalNativeModule<ClipboardNative>("ExpoClipboard");
    if (typeof mod?.setStringAsync === "function") {
      const ok = await mod.setStringAsync(value, { inputFormat: "plainText" });
      if (ok !== false) return true;
    }
    if (typeof mod?.setString === "function") {
      mod.setString(value);
      return true;
    }
  } catch {
    return false;
  }

  return false;
}
