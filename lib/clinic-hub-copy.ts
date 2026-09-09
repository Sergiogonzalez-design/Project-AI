import type { UiLocale } from "./ui-locale";

const copy = {
  es: {
    title: "Cuentas",
    tabPatients: "Pacientes",
    tabPhysios: "Fisioterapeutas",
    patientsLead:
      "Vincula pacientes y consulta los informes que envían a la clínica.",
    linkingTitle: "Vinculación",
    linkingSubtitle: "Código y enlace para pacientes",
    linkingHint:
      "Comparte el código o el enlace. El paciente entra en Fisioterapia, completa la consulta y el informe llega aquí.",
    actions: "Acciones",
    copyCode: "Copiar código",
    codeCopied: "Código copiado",
    copyLink: "Copiar enlace",
    linkCopied: "Enlace copiado",
    shareLink: "Compartir enlace",
    newCode: "Generar código nuevo",
    generating: "Generando…",
    refresh: "Actualizar",
    recentReports: "Informes recientes",
    patientsCount: "{n} paciente",
    patientsCountPlural: "{n} pacientes",
    loading: "Cargando…",
    noPatients:
      "Aún no hay pacientes vinculados. Comparte el código de arriba.",
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
    linkingSubtitle: "Code and link for patients",
    linkingHint:
      "Share the code or link. The patient opens Physiotherapy, completes the consult, and the report arrives here.",
    actions: "Actions",
    copyCode: "Copy code",
    codeCopied: "Code copied",
    copyLink: "Copy link",
    linkCopied: "Link copied",
    shareLink: "Share link",
    newCode: "Generate new code",
    generating: "Generating…",
    refresh: "Refresh",
    recentReports: "Recent reports",
    patientsCount: "{n} patient",
    patientsCountPlural: "{n} patients",
    loading: "Loading…",
    noPatients: "No linked patients yet. Share the code above.",
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
