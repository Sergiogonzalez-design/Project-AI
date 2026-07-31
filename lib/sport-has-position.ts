const SPORTS_WITHOUT_POSITION = [
  "tenis",
  "tennis",
  "padel",
  "pádel",
  "natacion",
  "natación",
  "swimming",
  "atletismo",
  "running",
  "carrera",
  "ciclismo",
  "cycling",
  "gimnasia",
  "gymnastics",
  "golf",
  "escalada",
  "climbing",
  "boxeo",
  "boxing",
  "crossfit",
  "gimnasio",
  "triatlon",
  "triatlón",
  "triathlon",
  "esqui",
  "esquí",
  "ski",
  "surf",
  "remo",
  "rowing",
  "patinaje",
  "skate",
  "yoga",
  "pilates",
  "halterofilia",
  "weightlifting",
  "powerlifting",
] as const;

const SPORTS_WITH_POSITION = [
  "futbol",
  "fútbol",
  "football",
  "soccer",
  "baloncesto",
  "basketball",
  "beisbol",
  "béisbol",
  "baseball",
  "voleibol",
  "volleyball",
  "rugby",
  "balonmano",
  "handball",
  "hockey",
  "futbol americano",
  "fútbol americano",
  "american football",
  "waterpolo",
  "water polo",
  "lacrosse",
  "cricket",
  "futsal",
  "futbol sala",
  "fútbol sala",
  "softball",
  "sofboll",
] as const;

function normalizeSport(sport: string): string {
  return sport
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "");
}

function matchesKeyword(normalized: string, keyword: string): boolean {
  const k = normalizeSport(keyword);
  if (!k) return false;
  if (normalized === k) return true;
  const pattern = new RegExp(`(?:^|\\s)${k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?:\\s|$)`);
  return pattern.test(` ${normalized} `);
}

/** Whether a sport typically has player positions (e.g. delantero, base).
 * Supports multiple sports in one string (comma / "y" separated). */
export function sportHasPosition(sport: string): boolean {
  const parts = sport
    .split(/[,;/|]+|\s+y\s+/i)
    .map((s) => s.trim())
    .filter(Boolean);
  if (!parts.length) {
    const normalized = normalizeSport(sport);
    if (!normalized) return false;
    if (SPORTS_WITHOUT_POSITION.some((s) => matchesKeyword(normalized, s))) {
      return false;
    }
    return SPORTS_WITH_POSITION.some((s) => matchesKeyword(normalized, s));
  }

  return parts.some((part) => {
    const normalized = normalizeSport(part);
    if (!normalized) return false;
    if (SPORTS_WITHOUT_POSITION.some((s) => matchesKeyword(normalized, s))) {
      return false;
    }
    return SPORTS_WITH_POSITION.some((s) => matchesKeyword(normalized, s));
  });
}
