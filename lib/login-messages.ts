/** Allowlisted login info banners — never render arbitrary ?message= query text. */
export const LOGIN_INFO_MESSAGES: Record<string, string> = {
  "account-created":
    "Cuenta creada. Inicia sesión para continuar.",
};

export function resolveLoginInfoMessage(
  code: string | null | undefined
): string | undefined {
  if (!code) return undefined;
  const key = code.trim();
  if (!key || key.length > 64) return undefined;
  return LOGIN_INFO_MESSAGES[key];
}
