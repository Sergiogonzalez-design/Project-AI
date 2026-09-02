export function buildClinicStaffInviteUrl(token: string, origin?: string): string {
  const base =
    (origin?.replace(/\/$/, "") ||
      (typeof window !== "undefined" ? window.location.origin : "")) ||
    "https://project-ai-swart.vercel.app";
  return `${base}/signup?clinic_invite=${encodeURIComponent(token.trim())}`;
}

export function buildClinicInviteShareMessage(opts: {
  clinicName?: string | null;
  inviteCode: string;
  link: string;
}): string {
  const clinic = (opts.clinicName ?? "").trim() || "nuestra clínica";
  return [
    `Te invitan a unirte a ${clinic} en AIKinora como fisioterapeuta.`,
    "",
    `Código de alta: ${opts.inviteCode}`,
    `(En Crear cuenta → Fisio, introduce este código.)`,
    "",
    `O abre este enlace:`,
    opts.link,
  ].join("\n");
}

export function clinicInviteWhatsAppUrl(message: string): string {
  return `https://wa.me/?text=${encodeURIComponent(message)}`;
}

export function clinicInviteMailtoUrl(message: string, toEmail?: string | null): string {
  const subject = encodeURIComponent("Invitación AIKinora — fisioterapeuta");
  const body = encodeURIComponent(message);
  const to = (toEmail ?? "").trim();
  return to
    ? `mailto:${encodeURIComponent(to)}?subject=${subject}&body=${body}`
    : `mailto:?subject=${subject}&body=${body}`;
}
