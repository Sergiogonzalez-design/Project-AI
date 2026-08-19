export function normalizeInviteCode(raw: string | null | undefined): string {
  return (raw ?? "").trim().toUpperCase().replace(/\s+/g, "");
}

/** Accept a raw code or a pasted invite URL (`/login?code=…`). */
export function parsePastedInviteCode(raw: string | null | undefined): string {
  const text = (raw ?? "").trim();
  if (!text) return "";
  const fromQuery = /[?&#]code=([^&\s#]+)/i.exec(text);
  if (fromQuery) {
    try {
      return normalizeInviteCode(decodeURIComponent(fromQuery[1].replace(/\+/g, "%20")));
    } catch {
      return normalizeInviteCode(fromQuery[1]);
    }
  }
  return normalizeInviteCode(text);
}
