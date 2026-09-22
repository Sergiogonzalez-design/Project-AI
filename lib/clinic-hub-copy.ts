import type { UiLocale } from "./ui-locale";

const copy = {
  es: {
    title: "Cuentas",
    tabPatients: "Pacientes",
    tabPhysios: "Fisioterapeutas",
    patientsLead:
      "Vincula pacientes y consulta los informes que envían a la clínica.",
    linkingTitle: "Vinculación",
    linkingSubtitle: "Enlace de consulta previa para pacientes",
    linkingHint:
      "Comparte el enlace: el paciente lo abre y va directo a poner su nombre. No necesita escribir ningún código. El informe llega aquí.",
    actions: "Más opciones",
    shareInvite: "Compartir enlace de consulta previa",
    inviteShared: "Enlace listo para compartir",
    copyInvite: "Copiar enlace",
    inviteCopied: "Enlace copiado",
    copyCode: "Copiar código (solo si hace falta)",
    codeCopied: "Código copiado",
    copyLink: "Copiar enlace web",
    linkCopied: "Enlace web copiado",
    shareLink: "Compartir enlace web",
    copyWhatsApp: "Copiar enlace WhatsApp",
    whatsappCopied: "Enlace WhatsApp copiado",
    shareWhatsApp: "Compartir WhatsApp",
    newCode: "Generar código nuevo",
    generating: "Generando…",
    refresh: "Actualizar",
    recentReports: "Informes recientes",
    patientsCount: "{n} paciente",
    patientsCountPlural: "{n} pacientes",
    loading: "Cargando…",
    noPatients:
      "Aún no hay pacientes vinculados. Comparte el enlace de arriba.",
    viewReport: "Ver informe →",
    newBadge: "Nuevo",
    consult: "Consulta",
    physioLabel: "Fisio: {name}",
    unassignedPhysio: "Sin fisioterapeuta",
    physiosLead:
      "Genera un código o enlace para que un fisioterapeuta cree su cuenta (Crear cuenta → Fisio) y se una a la clínica.",
  },
  en: {
    title: "Accounts",
    tabPatients: "Patients",
    tabPhysios: "Physiotherapists",
    patientsLead:
      "Link patients and review the reports they send to the clinic.",
    linkingTitle: "Linking",
    linkingSubtitle: "Pre-visit consult link for patients",
    linkingHint:
      "Share the link: the patient opens it and goes straight to entering their name. No code to type. The report arrives here.",
    actions: "More options",
    shareInvite: "Share pre-visit consult link",
    inviteShared: "Link ready to share",
    copyInvite: "Copy link",
    inviteCopied: "Link copied",
    copyCode: "Copy code (only if needed)",
    codeCopied: "Code copied",
    copyLink: "Copy web link",
    linkCopied: "Web link copied",
    shareLink: "Share web link",
    copyWhatsApp: "Copy WhatsApp link",
    whatsappCopied: "WhatsApp link copied",
    shareWhatsApp: "Share WhatsApp",
    newCode: "Generate new code",
    generating: "Generating…",
    refresh: "Refresh",
    recentReports: "Recent reports",
    patientsCount: "{n} patient",
    patientsCountPlural: "{n} patients",
    loading: "Loading…",
    noPatients: "No linked patients yet. Share the link above.",
    viewReport: "View report →",
    newBadge: "New",
    consult: "Consult",
    physioLabel: "Physio: {name}",
    unassignedPhysio: "No physiotherapist",
    physiosLead:
      "Generate a code or link so a physiotherapist can create their account (Create account → Physio) and join the clinic.",
  },
} as const;

export function clinicHubCopy(locale: UiLocale) {
  return copy[locale] ?? copy.es;
}
