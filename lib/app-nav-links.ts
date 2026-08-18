export type AppNavLink = { href: string; label: string };

/** Patient / athlete site navigation. */
export const PATIENT_NAV_LINKS: AppNavLink[] = [
  { href: "/consulta", label: "Consulta" },
  { href: "/fisioterapia", label: "Fisioterapia" },
  { href: "/sobre-nosotros", label: "Sobre nosotros" },
  { href: "/perfil", label: "Perfil" },
];

/** Physio dashboard navigation. */
export const PHYSIO_NAV_LINKS: AppNavLink[] = [
  { href: "/fisio", label: "Clínica" },
  { href: "/fisio/consulta", label: "Consulta" },
  { href: "/sobre-nosotros", label: "Sobre nosotros" },
  { href: "/perfil", label: "Perfil" },
];

export function isNavLinkActive(pathname: string, href: string): boolean {
  if (href === "/fisio") {
    return pathname === "/fisio" || pathname.startsWith("/fisio/patients");
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** First tab / home screen — back arrow has nowhere useful to go. */
export function isPacienteLandingPath(pathname: string): boolean {
  return pathname === "/fisioterapia" || pathname === "/fisio";
}
