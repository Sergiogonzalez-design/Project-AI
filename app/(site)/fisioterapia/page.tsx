"use client";

import { ChatInterface } from "@/components/chat-interface";
import { PhysioCodeGate } from "@/components/physio-code-gate";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

type LinkedPhysio = {
  physio_id: string;
  physio_name: string | null;
  clinic_name: string | null;
};

export default function FisioterapiaPage() {
  const [loading, setLoading] = useState(true);
  const [linked, setLinked] = useState<LinkedPhysio | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const supabase = createClient();
      const { data } = await supabase.rpc("patient_get_linked_physio");
      const row = Array.isArray(data) ? data[0] : data;
      if (!cancelled) {
        setLinked((row as LinkedPhysio | undefined)?.physio_id ? (row as LinkedPhysio) : null);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex h-[calc(100dvh-3.5rem)] items-center justify-center bg-slate-50">
        <p className="text-sm text-slate-500">Cargando…</p>
      </div>
    );
  }

  if (!linked) {
    return (
      <div className="h-[calc(100dvh-3.5rem)] overflow-y-auto bg-slate-50">
        <PhysioCodeGate onLinked={(physio) => setLinked(physio)} />
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100dvh-3.5rem)] flex-col overflow-hidden">
      <ChatInterface />
    </div>
  );
}
