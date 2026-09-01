export function buildClinicStaffInviteUrl(token: string, origin?: string): string {
  const base =
    (origin?.replace(/\/$/, "") ||
      (typeof window !== "undefined" ? window.location.origin : "")) ||
    "https://project-ai-swart.vercel.app";
  return `${base}/signup?clinic_invite=${encodeURIComponent(token.trim())}`;
}
