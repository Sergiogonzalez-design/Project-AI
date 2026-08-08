"use client";

import { ChatInterface } from "@/components/chat-interface";
import { PhysioCodeGate } from "@/components/physio-code-gate";
import { createClient } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type LinkedPhysio = {
  physio_id?: string | null;
  physio_name: string | null;
  clinic_name?: string | null;
};

/** Avoid a loading flash every time the user switches Consulta ↔ Fisioterapia. */
let linkedPhysioCache: LinkedPhysio | null | undefined;

export function FisioterapiaClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const inviteCode = (searchParams.get("code") ?? "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "");
  const [loading, setLoading] = useState(linkedPhysioCache === undefined);
  const [linked, setLinked] = useState<LinkedPhysio | null>(
    linkedPhysioCache ?? null
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const supabase = createClient();
      const { data } = await supabase.rpc("patient_get_linked_physio");
      const row = Array.isArray(data) ? data[0] : data;
      const next =
        (row as LinkedPhysio | undefined)?.physio_id
          ? (row as LinkedPhysio)
          : null;
      linkedPhysioCache = next;
      if (!cancelled) {
        setLinked(next);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  function clearInviteQuery() {
    if (!inviteCode) return;
    router.replace("/fisioterapia");
  }

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
        <PhysioCodeGate
          initialCode={inviteCode || null}
          autoSubmit={inviteCode.length >= 6}
          onLinked={(physio) => {
            linkedPhysioCache = physio;
            setLinked(physio);
            clearInviteQuery();
          }}
        />
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100dvh-3.5rem)] flex-col overflow-hidden">
      <ChatInterface
        linkedPhysio={linked}
        onLinkedPhysioChange={(physio) => {
          linkedPhysioCache = physio;
          setLinked(physio);
        }}
      />
    </div>
  );
}
