"use client";

import { ChatInterface } from "@/components/chat-interface";
import { GuestNameGate } from "@/components/guest-name-gate";
import { NavBackButton } from "@/components/nav-back-button";
import { PhysioCodeGate } from "@/components/physio-code-gate";
import { createClient } from "@/lib/supabase/client";
import {
  guestNameStorageKey,
  isGuestUser,
  isGuestDisplayNameSet,
  readInviteNameGateHint,
  writeInviteNameGateHint,
} from "@/lib/guest-account";
import { useEffect, useState } from "react";

type LinkedPhysio = {
  physio_id?: string | null;
  physio_name: string | null;
  clinic_name?: string | null;
};

/** Avoid a loading flash every time the user switches Consulta ↔ Fisioterapia. */
let linkedPhysioCache: LinkedPhysio | null | undefined;

export function FisioterapiaClient() {
  const [linked, setLinked] = useState<LinkedPhysio | null>(() =>
    linkedPhysioCache?.physio_id ? linkedPhysioCache : null
  );
  const [guestMode, setGuestMode] = useState(() => readInviteNameGateHint());
  const [needsName, setNeedsName] = useState(() => readInviteNameGateHint());
  // Invite deep-link can paint the name gate immediately; otherwise wait for auth.
  const [ready, setReady] = useState(() => readInviteNameGateHint());

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          if (!cancelled) {
            setLinked(null);
            setReady(true);
          }
          return;
        }
        const guest = isGuestUser(user);
        if (cancelled) return;
        setGuestMode(guest);

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

        if (guest) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("display_name")
            .eq("id", user.id)
            .maybeSingle();
          const named = isGuestDisplayNameSet(
            (profile?.display_name as string | null) ?? null
          );
          try {
            if (named) {
              sessionStorage.setItem(guestNameStorageKey(user.id), "1");
            } else {
              sessionStorage.removeItem(guestNameStorageKey(user.id));
            }
          } catch {
            // ignore private-mode storage errors
          }
          if (!cancelled) {
            setNeedsName(!named);
            writeInviteNameGateHint(!named);
          }
        }

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

  if (guestMode && needsName) {
    return (
      <div className="flex h-[calc(100dvh-3.5rem)] flex-col overflow-hidden">
        <GuestNameGate
          onSaved={() => {
            writeInviteNameGateHint(false);
            setNeedsName(false);
          }}
        />
      </div>
    );
  }

  if (!ready) {
    return <div className="h-[calc(100dvh-3.5rem)] bg-[var(--background)]" />;
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
      <div className="relative flex h-[calc(100dvh-3.5rem)] flex-col overflow-hidden">
        <div className="absolute left-4 top-3 z-10 sm:left-6">
          <NavBackButton fallbackHref="/consulta" />
        </div>
        <PhysioCodeGate
          onLinked={(physio) => {
            linkedPhysioCache = physio;
            setLinked(physio);
          }}
        />
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
