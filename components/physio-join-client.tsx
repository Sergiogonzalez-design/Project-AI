"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { parsePastedInviteCode } from "@/lib/physio-invite";
import { createClient } from "@/lib/supabase/client";

/**
 * Redeem a physio/clinic patient invite code and open the pre-visit consult.
 * Always creates/switches to a guest patient session so a logged-in fisio
 * sharing their own link is not stuck on /fisio.
 */
export function PhysioJoinClient({ initialCode }: { initialCode: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [manualCode, setManualCode] = useState(initialCode);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    const code = parsePastedInviteCode(initialCode);
    if (code.length < 6) return;
    started.current = true;
    void redeem(code);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- one-shot deep link
  }, [initialCode]);

  async function redeem(rawCode: string) {
    setError(null);
    const code = parsePastedInviteCode(rawCode);
    if (code.length < 6) {
      setError("Introduce el código que te ha dado tu fisioterapeuta.");
      return;
    }
    try {
      const supabase = createClient();
      // Drop any existing session (fisio/clinic/patient) so the link always
      // opens the patient pre-visit flow.
      await supabase.auth.signOut({ scope: "local" });

      const res = await fetch("/api/auth/guest-physio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const payload = (await res.json()) as {
        error?: string;
        email?: string;
        password?: string;
      };
      if (!res.ok || !payload.email || !payload.password) {
        setError(payload.error ?? "No se pudo abrir la consulta con ese código.");
        started.current = false;
        return;
      }
      const { error: signError } = await supabase.auth.signInWithPassword({
        email: payload.email,
        password: payload.password,
      });
      if (signError) {
        setError(signError.message);
        started.current = false;
        return;
      }
      router.replace("/fisioterapia");
      router.refresh();
    } catch {
      setError("No se pudo abrir la consulta. Inténtalo de nuevo.");
      started.current = false;
    }
  }

  async function onManualSubmit(e: React.FormEvent) {
    e.preventDefault();
    started.current = true;
    await redeem(manualCode);
  }

  const hasCode = parsePastedInviteCode(initialCode).length >= 6;

  return (
    <div className="w-full max-w-sm rounded-3xl border border-slate-200/80 bg-white px-6 py-9 shadow-xl shadow-blue-500/10 sm:px-8">
      <div className="mb-6 flex flex-col items-center gap-3 text-center">
        <Image
          src="/logo-icon.png"
          alt="AIKinora"
          width={56}
          height={56}
          className="object-contain"
        />
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
            Consulta previa
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {hasCode && !error
              ? "Abriendo tu consulta con el fisioterapeuta…"
              : "Introduce el código de vinculación para empezar."}
          </p>
        </div>
      </div>

      {hasCode && !error ? (
        <p className="text-center text-sm font-medium text-blue-700">
          Un momento…
        </p>
      ) : (
        <form onSubmit={(e) => void onManualSubmit(e)}>
          <label
            htmlFor="join-code"
            className="block text-sm font-semibold text-slate-800"
          >
            Código de tu fisioterapeuta
          </label>
          <input
            id="join-code"
            value={manualCode}
            onChange={(e) => setManualCode(parsePastedInviteCode(e.target.value))}
            placeholder="ABC12345"
            autoCapitalize="characters"
            autoCorrect="off"
            spellCheck={false}
            autoComplete="off"
            className="mt-3 w-full rounded-xl border border-slate-200 px-4 py-3 font-mono text-sm tracking-widest text-slate-900 uppercase placeholder:tracking-normal placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
          {error ? (
            <p className="mt-3 text-sm text-red-600" role="alert">
              {error}
            </p>
          ) : null}
          <button
            type="submit"
            className="btn-primary mt-4 w-full"
          >
            Empezar consulta previa
          </button>
        </form>
      )}

      {error && hasCode ? (
        <button
          type="button"
          className="btn-primary mt-4 w-full"
          onClick={() => {
            started.current = true;
            void redeem(initialCode);
          }}
        >
          Reintentar
        </button>
      ) : null}

      <p className="mt-6 text-center text-sm text-slate-500">
        ¿Ya tienes cuenta?{" "}
        <Link href="/login" className="font-semibold text-blue-600 hover:underline">
          Iniciar sesión
        </Link>
      </p>
    </div>
  );
}
