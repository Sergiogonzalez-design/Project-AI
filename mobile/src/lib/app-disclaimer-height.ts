import { useEffect, useState } from "react";

let height = 0;
const listeners = new Set<(value: number) => void>();

export function setAppDisclaimerHeight(next: number) {
  const value = Math.max(0, Math.round(next));
  if (value === height) return;
  height = value;
  for (const listener of listeners) listener(height);
}

export function useAppDisclaimerHeight() {
  const [value, setValue] = useState(height);
  useEffect(() => {
    listeners.add(setValue);
    setValue(height);
    return () => {
      listeners.delete(setValue);
    };
  }, []);
  return value;
}
