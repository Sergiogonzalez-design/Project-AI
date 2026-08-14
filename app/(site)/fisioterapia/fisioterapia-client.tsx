"use client";

import { ChatInterface } from "@/components/chat-interface";
import { PhysioCodeGate } from "@/components/physio-code-gate";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type LinkedPhysio = {
  physio_id?: string | null;
  physio_name: string | null;
  clinic_name?: string | null;
};

/** Avoid a loading flash every time the user switches Consulta ↔ Fisioterapia. */
let linkedPhysioCache: LinkedPhysio | null | undefined;

export function FisioterapiaClient() {
  const router = useRouter();
  const [inviteCode, setInviteCode] = useState("");
  const [linked, setLinked] = useState<LinkedPhysio | null>(
    linkedPhysioCache ?? null
  );

  useEffect(() => {
    const code = new URLSearchParams(window.location.search)
      .get("code")
      ?.trim()
      .toUpperCase()
      .replace(/\s+/g, "");
    if (code) setInviteCode(code);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase.rpc("patient_get_linked_physio");
        const row = Array.isArray(data) ? data[0] : data;
        const next =
          (row as LinkedPhysio | undefined)?.physio_id
            ? (row as LinkedPhysio)
            : null;
        linkedPhysioCache = next;
        if (!cancelled) setLinked(next);
      } catch (err) {
        console.error("No se pudo cargar el fisioterapeuta vinculado:", err);
        linkedPhysioCache = null;
        if (!cancelled) setLinked(null);
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

  if (!linked) {
    return (
      <div className="h-[calc(100dvh-3.5rem)] overflow-y-auto bg-slate-50">
        <PhysioCodeGate
          key={inviteCode || "empty"}
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
