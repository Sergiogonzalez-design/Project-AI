"use client";

import { ChatInterface } from "@/components/chat-interface";
import { GuestNameGate } from "@/components/guest-name-gate";
import { NavBackButton } from "@/components/nav-back-button";
import { PhysioCodeGate } from "@/components/physio-code-gate";
import { createClient } from "@/lib/supabase/client";
import {
  guestNameStorageKey,
  isGuestUser,
  isGuestIdentityComplete,
  readInviteNameGateHint,
  writeInviteNameGateHint,
} from "@/lib/guest-account";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type LinkedPhysio = {
  physio_id?: string | null;
  physio_name: string | null;
  clinic_name?: string | null;
};

/** Avoid a loading flash every time the user switches Consulta ↔ Fisioterapia. */
let linkedPhysioCache: LinkedPhysio | null | undefined;

function inviteWantsNameGate(): boolean {
  if (typeof window === "undefined") return false;
  try {
    if (new URLSearchParams(window.location.search).get("gate") === "name") {
      return true;
    }
  } catch {
    /* ignore */
  }
  return readInviteNameGateHint();
}

export function FisioterapiaClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const gateParam = searchParams.get("gate") === "name";

  const [linked, setLinked] = useState<LinkedPhysio | null>(() =>
    linkedPhysioCache?.physio_id ? linkedPhysioCache : null
  );
  const [guestMode, setGuestMode] = useState(
    () => gateParam || readInviteNameGateHint()
  );
  const [needsName, setNeedsName] = useState(
    () => gateParam || readInviteNameGateHint()
  );
  // Invite deep-link can paint the name gate immediately; otherwise wait for auth.
  const [ready, setReady] = useState(
    () => gateParam || readInviteNameGateHint()
  );

  useEffect(() => {
    if (gateParam) {
      writeInviteNameGateHint(true);
      setGuestMode(true);
      setNeedsName(true);
      setReady(true);
    }
  }, [gateParam]);

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
        setGuestMode(guest || inviteWantsNameGate());

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

        if (guest || inviteWantsNameGate()) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("display_name, whatsapp_phone")
            .eq("id", user.id)
            .maybeSingle();
          const identified = isGuestIdentityComplete({
            displayName: (profile?.display_name as string | null) ?? null,
            phone: (profile?.whatsapp_phone as string | null) ?? null,
          });
          try {
            if (identified) {
              sessionStorage.setItem(guestNameStorageKey(user.id), "1");
            } else {
              sessionStorage.removeItem(guestNameStorageKey(user.id));
            }
          } catch {
            // ignore private-mode storage errors
          }
          if (!cancelled) {
            // Invite deep-link always shows the name gate (even if a prior
            // identity exists) so a second visit can confirm name + phone.
            const mustAsk =
              gateParam || readInviteNameGateHint() || !identified;
            setNeedsName(mustAsk);
            writeInviteNameGateHint(mustAsk);
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
  }, [gateParam, router]);

  // Name screen first for invite guests — never paint chat until we know.
  if ((guestMode || gateParam || readInviteNameGateHint()) && needsName) {
    return (
      <div className="flex h-[calc(100dvh-3.5rem)] flex-col overflow-hidden">
        <GuestNameGate
          onSaved={() => {
            writeInviteNameGateHint(false);
            setNeedsName(false);
            if (gateParam) {
              router.replace("/fisioterapia");
            }
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
