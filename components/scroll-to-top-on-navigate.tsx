"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/** Reset window scroll whenever the route changes so new screens start at the top. */
export function ScrollToTopOnNavigate() {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [pathname]);

  return null;
}
