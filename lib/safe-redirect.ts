/** Allow only same-origin relative paths (blocks open redirects). */
export function safeRedirectPath(
  next: string | null | undefined,
  fallback = "/consulta"
): string {
  if (!next || typeof next !== "string") return fallback;
  const trimmed = next.trim();
  if (
    !trimmed.startsWith("/") ||
    trimmed.startsWith("//") ||
    trimmed.includes("\\") ||
    trimmed.includes("@")
  ) {
    return fallback;
  }
  try {
    const url = new URL(trimmed, "http://local");
    if (url.origin !== "http://local") return fallback;
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return fallback;
  }
}
