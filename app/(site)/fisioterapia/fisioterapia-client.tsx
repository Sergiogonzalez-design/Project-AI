"use client";

import { ChatInterface } from "@/components/chat-interface";
import { GuestNameGate } from "@/components/guest-name-gate";
import { PhysioCodeGate } from "@/components/physio-code-gate";
import { createClient } from "@/lib/supabase/client";
import { guestNameStorageKey, isGuestUser } from "@/lib/guest-account";
import { useEffect, useState } from "react";

type LinkedPhysio = {
  physio_id?: string | null;
  physio_name: string | null;
  clinic_name?: string | null;
};

/** Avoid a loading flash every time the user switches Consulta ↔ Fisioterapia. */
let linkedPhysioCache: LinkedPhysio | null | undefined;

function hasNamedThisGuest(userId: string): boolean {
  try {
    return sessionStorage.getItem(guestNameStorageKey(userId)) === "1";
  } catch {
    return false;
  }
}

export function FisioterapiaClient() {
  const [linked, setLinked] = useState<LinkedPhysio | null>(null);
  const [guestMode, setGuestMode] = useState(false);
  const [needsName, setNeedsName] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          return;
        }
        const guest = isGuestUser(user);
        if (cancelled) return;
        setGuestMode(guest);
        if (guest) {
          setNeedsName(!hasNamedThisGuest(user.id));
        }

        let next = linkedPhysioCache ?? null;
        if (!next?.physio_id) {
          const { data } = await supabase.rpc("patient_get_linked_physio");
          const row = Array.isArray(data) ? data[0] : data;
          next =
            (row as LinkedPhysio | undefined)?.physio_id
              ? (row as LinkedPhysio)
              : null;
        }
        linkedPhysioCache = next;
        if (!cancelled) {
          setLinked(next);
          setReady(true);
        }
      } catch (err) {
        console.error("No se pudo cargar el fisioterapeuta vinculado:", err);
        linkedPhysioCache = null;
        if (!cancelled) {
          setLinked(null);
          setReady(true);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!ready) {
    return (
      <div className="flex h-[calc(100dvh-3.5rem)] items-center justify-center bg-slate-50">
        <p className="text-sm text-slate-500">Cargando…</p>
      </div>
    );
  }

  if (!linked) {
    if (guestMode) {
      return (
        <div className="flex h-[calc(100dvh-3.5rem)] flex-col items-center justify-center gap-3 bg-slate-50 px-6 text-center">
          <p className="text-sm text-slate-600">
            No se encontró el fisioterapeuta de este código. Vuelve al inicio e
            introdúcelo de nuevo.
          </p>
          <a href="/login" className="text-sm font-semibold text-blue-600 hover:underline">
            Volver al inicio
          </a>
        </div>
      );
    }

    return (
      <div className="flex h-[calc(100dvh-3.5rem)] flex-col overflow-hidden">
        <PhysioCodeGate
          onLinked={(physio) => {
            linkedPhysioCache = physio;
            setLinked(physio);
          }}
        />
      </div>
    );
  }

  if (guestMode && needsName) {
    return (
      <div className="flex h-[calc(100dvh-3.5rem)] flex-col overflow-hidden">
        <GuestNameGate onSaved={() => setNeedsName(false)} />
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100dvh-3.5rem)] flex-col overflow-hidden">
      <ChatInterface
        linkedPhysio={linked}
        guestMode={guestMode}
        onLinkedPhysioChange={(physio) => {
          linkedPhysioCache = physio;
          setLinked(physio);
        }}
      />
    </div>
  );
}
