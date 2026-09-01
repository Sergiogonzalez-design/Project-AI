"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { isGuestUser } from "@/lib/guest-account";

const inputClass =
  "rounded-xl border border-blue-200 px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100";

type InviteInfo = {
  clinic_name: string;
  email: string;
  display_name: string | null;
};

type Props = {
  clinicInviteToken?: string;
};

export function SignupForm({ clinicInviteToken }: Props) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [convertingGuest, setConvertingGuest] = useState(false);
  const [invite, setInvite] = useState<InviteInfo | null>(null);
  const joiningClinic = Boolean(clinicInviteToken);

  useEffect(() => {
    const supabase = createClient();
    void supabase.auth.getUser().then(({ data }) => {
      setConvertingGuest(isGuestUser(data.user));
    });
  }, []);

  useEffect(() => {
    if (!clinicInviteToken) return;
    const supabase = createClient();
    void supabase
      .rpc("clinic_lookup_invite", { p_token: clinicInviteToken })
      .then(({ data }) => {
        const row = Array.isArray(data) ? data[0] : data;
        if (row?.email) {
          setInvite(row as InviteInfo);
          setEmail(String(row.email));
        }
      });
  }, [clinicInviteToken]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const emailNorm = email.trim().toLowerCase();
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (session?.access_token && isGuestUser(session.user)) {
        headers.Authorization = `Bearer ${session.access_token}`;
      }
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers,
        body: JSON.stringify({
          email: emailNorm,
          password,
          clinicInvite: clinicInviteToken || undefined,
        }),
      });
      const payload = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(payload.error ?? "No se pudo crear la cuenta.");
        return;
      }

      if (isGuestUser(session?.user)) {
        await supabase.auth.signOut({ scope: "local" });
      }
      const { error: signError } = await supabase.auth.signInWithPassword({
        email: emailNorm,
        password,
      });
      if (signError) {
        setError(signError.message);
        return;
      }
      router.replace("/onboarding");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-sm rounded-3xl border border-slate-200/80 bg-white px-6 py-9 shadow-xl shadow-blue-500/10 sm:px-8"
    >
      <div className="mb-6 flex flex-col items-center gap-3 text-center">
        <Image src="/logo-icon.png" alt="AIKinora" width={56} height={56} className="object-contain" />
        <div>
          <h1 className="text-xl font-bold text-slate-800">Crear cuenta</h1>
          <p className="mt-1 text-sm text-slate-500">
            {convertingGuest
              ? "Crea tu cuenta para seguir usando la IA"
              : joiningClinic && invite
                ? `Te unes a ${invite.clinic_name} como fisioterapeuta`
                : "Regístrate para usar AIKinora"}
          </p>
        </div>
      </div>

      {!joiningClinic && !convertingGuest ? (
        <p className="mb-5 text-xs leading-relaxed text-slate-500">
          Las cuentas de fisioterapeuta o clínica se crean con invitación. Si eres
          profesional, pide acceso a tu clínica o contacta con el equipo.
        </p>
      ) : null}

      <div className="mb-4 flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-slate-700">Correo electrónico</label>
        <input
          type="email" name="email" autoComplete="email" required
          value={email} onChange={(e) => setEmail(e.target.value)}
          readOnly={joiningClinic && Boolean(invite?.email)}
          className={inputClass}
          placeholder="tu@correo.com"
        />
      </div>

      <div className="mb-5 flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-slate-700">Contraseña</label>
        <input
          type="password" name="password" autoComplete="new-password" required minLength={6}
          value={password} onChange={(e) => setPassword(e.target.value)}
          className={inputClass}
          placeholder="Mínimo 6 caracteres"
        />
      </div>

      {error && <p className="mb-4 text-sm text-red-600" role="alert">{error}</p>}

      <p className="mb-4 text-xs leading-relaxed text-slate-500">
        Al crear la cuenta aceptas la{" "}
        <Link href="/privacidad?from=signup" className="font-semibold text-blue-600 hover:underline">
          Política de privacidad
        </Link>{" "}
        y los{" "}
        <Link href="/privacidad?from=signup#terminos" className="font-semibold text-blue-600 hover:underline">
          Términos de uso
        </Link>{" "}
        de AIKinora.
      </p>

      <button
        type="submit" disabled={loading}
        className="btn-primary w-full"
      >
        {loading ? "Creando cuenta…" : joiningClinic ? "Unirme a la clínica" : "Crear cuenta"}
      </button>

      <p className="mt-5 text-center text-sm text-slate-500">
        ¿Ya tienes cuenta?{" "}
        <Link href="/login" className="font-semibold text-blue-600 hover:underline">
          Iniciar sesión
        </Link>
      </p>
    </form>
  );
}
