import { WEB_APP_URL } from "./admin-api";

export function buildClinicStaffInviteUrl(token: string): string {
  return `${WEB_APP_URL.replace(/\/$/, "")}/signup?clinic_invite=${encodeURIComponent(token.trim())}`;
}
