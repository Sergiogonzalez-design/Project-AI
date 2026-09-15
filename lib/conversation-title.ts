/** Capitalize the first letter of a conversation title / injury label. */
export function capitalizeFirstLetter(text: string): string {
  const raw = text.trim();
  if (!raw) return raw;
  return raw.charAt(0).toLocaleUpperCase("es-ES") + raw.slice(1);
}

/** Ensure a stored conversation title starts with a capital letter. */
export function capitalizeConversationTitle(title: string): string {
  return capitalizeFirstLetter(title);
}

/** Regular Consulta titles: "Glúteo — 15/9/2026". */
export function formatConsultaConversationTitle(
  areaLabel: string,
  date: Date = new Date(),
  locale: string = "es-ES"
): string {
  return `${capitalizeFirstLetter(areaLabel)} — ${date.toLocaleDateString(locale)}`;
}
