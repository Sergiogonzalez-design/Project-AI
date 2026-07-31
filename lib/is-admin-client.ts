/** Client-safe admin email check (must be NEXT_PUBLIC_ so the browser can see it). */
export function getPublicAdminEmail(): string {
  return (
    process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? "sergiogonzalez.usa@icloud.com"
  )
    .trim()
    .toLowerCase();
}

export function isClientAdminEmail(email: string | null | undefined): boolean {
  const adminEmail = getPublicAdminEmail();
  if (!adminEmail || !email) return false;
  return email.trim().toLowerCase() === adminEmail;
}
