import { Suspense } from "react";
import { FisioterapiaClient } from "./fisioterapia-client";

export default function FisioterapiaPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-[calc(100dvh-3.5rem)] items-center justify-center bg-slate-50">
          <p className="text-sm text-slate-500">Cargando…</p>
        </div>
      }
    >
      <FisioterapiaClient />
    </Suspense>
  );
}
