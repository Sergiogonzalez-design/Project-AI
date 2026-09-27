import { Suspense } from "react";
import { FisioterapiaClient } from "./fisioterapia-client";

export default function FisioterapiaPage() {
  return (
    <Suspense
      fallback={
        <div className="h-[calc(100dvh-3.5rem)] bg-[var(--background)]" />
      }
    >
      <FisioterapiaClient />
    </Suspense>
  );
}
