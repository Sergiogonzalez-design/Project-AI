"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { isGuestUser } from "@/lib/guest-account";

const inputClass =
  "rounded-xl border border-blue-200 px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100";

type AccountType = "patient" | "physio" | "clinic";

type InviteInfo = {
  clinic_name: string;
  email: string | null;
  display_name: string | null;
};

type Props = {
  clinicInviteToken?: string;
};

export function SignupForm({ clinicInviteToken }: Props) {
  const router = useRouter();
  const [accountType, setAccountType] = useState<AccountType>("patient");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [inviteClinicName, setInviteClinicName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [convertingGuest, setConvertingGuest] = useState(false);
  const [invite, setInvite] = useState<InviteInfo | null>(null);
  const [acceptedLegal, setAcceptedLegal] = useState(false);
  const joiningClinic = Boolean(clinicInviteToken);

  useEffect(() => {
    const supabase = createClient();
    void supabase.auth.getUser().then(({ data }) => {
      setConvertingGuest(isGuestUser(data.user));
    });
  }, []);

  useEffect(() => {
    if (!clinicInviteToken) return;
    setAccountType("physio");
    setInviteCode(clinicInviteToken);
    const supabase = createClient();
    void supabase
      .rpc("clinic_lookup_invite", { p_token: clinicInviteToken })
      .then(({ data }) => {
        const row = Array.isArray(data) ? data[0] : data;
        if (row?.clinic_name) {
          setInvite(row as InviteInfo);
          setInviteClinicName(String(row.clinic_name));
          if (row.email) setEmail(String(row.email));
        }
      });
  }, [clinicInviteToken]);

  useEffect(() => {
    const key = inviteCode.trim();
    if (joiningClinic || accountType !== "physio" || !key) {
      if (!joiningClinic) setInviteClinicName(null);
      return;
    }
    const timer = setTimeout(() => {
      const supabase = createClient();
      void supabase.rpc("clinic_lookup_invite", { p_token: key }).then(({ data }) => {
        const row = Array.isArray(data) ? data[0] : data;
        if (row?.clinic_name) {
          setInviteClinicName(String(row.clinic_name));
          if (row.email) setEmail(String(row.email));
        } else {
          setInviteClinicName(null);
        }
      });
    }, 300);
    return () => clearTimeout(timer);
  }, [accountType, inviteCode, joiningClinic]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!email.trim() || !password.trim()) {
      setError("Rellena todos los campos.");
      return;
    }
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (password !== confirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    if (
      !convertingGuest &&
      accountType === "physio" &&
      inviteCode.trim() &&
      !inviteClinicName
    ) {
      setError("Código de clínica no válido o caducado.");
      return;
    }
    if (!acceptedLegal) {
      setError("Debes aceptar la Política de privacidad y los Términos de uso.");
      return;
    }
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
          accountType: convertingGuest ? "patient" : accountType,
          clinicInvite:
            !convertingGuest && accountType === "physio" && inviteCode.trim()
              ? inviteCode.trim()
              : undefined,
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
      if (!convertingGuest && accountType === "physio" && inviteCode.trim()) {
        await supabase.rpc("clinic_claim_invite", { p_token: inviteCode.trim() });
      }
      router.replace("/onboarding");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  const roleBtn = (type: AccountType, label: string) => (
    <button
      key={type}
      type="button"
      onClick={() => setAccountType(type)}
      className={`flex-1 rounded-xl border px-3 py-2.5 text-xs font-semibold transition ${
        accountType === type
          ? "border-blue-600 bg-blue-600 text-white"
          : "border-slate-200 bg-white text-slate-700 hover:border-blue-300"
      }`}
    >
      {label}
    </button>
  );

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
                : "Crea tu cuenta"}
          </p>
        </div>
      </div>

      {!convertingGuest && !joiningClinic ? (
        <>
          <p className="mb-2 text-sm font-semibold text-slate-700">Soy…</p>
          <div className="mb-4 flex gap-2">
            {roleBtn("patient", "Persona")}
            {roleBtn("physio", "Fisio")}
            {roleBtn("clinic", "Clínica")}
          </div>
          {accountType === "clinic" ? (
            <p className="mb-4 text-xs leading-relaxed text-slate-500">
              El plan de clínica será de pago más adelante. Ahora puedes configurar el espacio.
            </p>
          ) : null}
          {accountType === "physio" ? (
            <div className="mb-4 space-y-2">
              <p className="text-xs leading-relaxed text-slate-500">
                Opcional: introduce el código de alta ahora, o más tarde en Clínica / al iniciar
                sesión.
              </p>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700">
                  Código de clínica (opcional)
                </label>
                <input
                  type="text"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                  className={inputClass}
                  placeholder="Ej. AB12CD"
                  autoCapitalize="characters"
                  autoCorrect="off"
                />
              </div>
              {inviteClinicName ? (
                <p className="text-xs font-medium text-emerald-700">Clínica: {inviteClinicName}</p>
              ) : inviteCode.trim() ? (
                <p className="text-xs text-slate-500">Comprobando código…</p>
              ) : null}
            </div>
          ) : null}
        </>
      ) : null}

      <div className="mb-4 flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-slate-700">Correo electrónico</label>
        <input
          type="email"
          name="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          readOnly={joiningClinic && Boolean(invite?.email)}
          className={inputClass}
          placeholder="tu@correo.com"
        />
      </div>

      <div className="mb-4 flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-slate-700">Contraseña</label>
        <input
          type="password"
          name="password"
          autoComplete="new-password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={inputClass}
          placeholder="Mínimo 6 caracteres"
        />
      </div>

      <div className="mb-5 flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-slate-700">Confirmar contraseña</label>
        <input
          type="password"
          name="confirm-password"
          autoComplete="new-password"
          required
          minLength={6}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className={inputClass}
          placeholder="Repite la contraseña"
        />
      </div>

      {error && (
        <p className="mb-4 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      <label className="mb-4 flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-left">
        <input
          type="checkbox"
          checked={acceptedLegal}
          onChange={(e) => setAcceptedLegal(e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 accent-blue-600"
          required
        />
        <span className="text-xs leading-relaxed text-slate-600">
          He leído y acepto la{" "}
          <Link
            href="/privacidad?from=signup"
            className="font-semibold text-blue-600 hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            Política de privacidad
          </Link>{" "}
          y los{" "}
          <Link
            href="/privacidad?from=signup#terminos"
            className="font-semibold text-blue-600 hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            Términos de uso
          </Link>
          , incluido el tratamiento de los datos de mi consulta para orientarme con IA.
        </span>
      </label>

      <button
        type="submit"
        disabled={loading || !acceptedLegal}
        className="btn-primary w-full disabled:opacity-50"
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
