"use client";

import { useCallback, useEffect, useState } from "react";
import { buildClinicStaffInviteUrl } from "@/lib/clinic-invite";
import { createClient } from "@/lib/supabase/client";

type Member = {
  user_id: string;
  email: string;
  display_name: string | null;
  role: string;
  created_at: string;
};

type Invite = {
  id: string;
  email: string;
  display_name: string | null;
  created_at: string;
  expires_at: string;
  accepted_at: string | null;
  token: string;
};

export function ClinicTeamPanel() {
  const [members, setMembers] = useState<Member[]>([]);
  const [invites, setInvites] = useState<Invite[]>([]);
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [lastLink, setLastLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const load = useCallback(async () => {
    const supabase = createClient();
    const [{ data: m, error: mErr }, { data: i, error: iErr }] = await Promise.all([
      supabase.rpc("clinic_list_members"),
      supabase.rpc("clinic_list_invites"),
    ]);
    if (mErr) setError(mErr.message);
    else setMembers((m as Member[]) ?? []);
    if (iErr) setError(iErr.message);
    else setInvites((i as Invite[]) ?? []);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function invitePhysio(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLastLink(null);
    setBusy(true);
    try {
      const supabase = createClient();
      const { data, error: err } = await supabase.rpc("clinic_create_invite", {
        p_email: email.trim().toLowerCase(),
        p_display_name: displayName.trim() || null,
      });
      if (err) throw new Error(err.message);
      const row = Array.isArray(data) ? data[0] : data;
      if (!row?.token) throw new Error("No se pudo crear la invitación.");
      const link = buildClinicStaffInviteUrl(row.token);
      setLastLink(link);
      setEmail("");
      setDisplayName("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo invitar.");
    } finally {
      setBusy(false);
    }
  }

  const pending = invites.filter((i) => !i.accepted_at);
  const physios = members.filter((m) => m.role === "physio");
  const owners = members.filter((m) => m.role !== "physio");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-neutral-900">Equipo</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Crea cuentas de fisioterapeuta. Ellos reciben un enlace, eligen
          contraseña y heredan el nombre de la clínica. Cada uno tendrá su
          código para pacientes.
        </p>
      </div>

      <form
        onSubmit={(e) => void invitePhysio(e)}
        className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm"
      >
        <h2 className="text-sm font-bold text-neutral-900">Invitar fisioterapeuta</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-neutral-500">
              Correo
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-neutral-200 px-3.5 py-2.5 text-sm"
              placeholder="fisio@clinica.com"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-neutral-500">
              Nombre (opcional)
            </label>
            <input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full rounded-xl border border-neutral-200 px-3.5 py-2.5 text-sm"
              placeholder="Nombre y apellidos"
            />
          </div>
        </div>
        {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
        <button
          type="submit"
          disabled={busy}
          className="btn-primary mt-4 px-4 py-2.5 text-sm disabled:opacity-60"
        >
          {busy ? "Creando invitación…" : "Crear enlace de alta"}
        </button>
        {lastLink ? (
          <div className="mt-4 rounded-xl bg-blue-50 px-3 py-3 text-sm">
            <p className="font-semibold text-blue-900">Envía este enlace al fisioterapeuta:</p>
            <p className="mt-1 break-all text-blue-800">{lastLink}</p>
            <button
              type="button"
              className="mt-2 text-xs font-bold text-blue-700 hover:underline"
              onClick={() => {
                void navigator.clipboard.writeText(lastLink);
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
              }}
            >
              {copied ? "Copiado" : "Copiar enlace"}
            </button>
          </div>
        ) : null}
      </form>

      <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-bold text-neutral-900">Fisioterapeutas</h2>
        {physios.length === 0 ? (
          <p className="mt-2 text-sm text-neutral-500">Aún no hay fisioterapeutas en el equipo.</p>
        ) : (
          <ul className="mt-3 divide-y divide-neutral-100">
            {physios.map((m) => (
              <li key={m.user_id} className="py-2.5">
                <p className="text-sm font-semibold text-neutral-900">
                  {m.display_name || "Sin nombre"}
                </p>
                <p className="text-xs text-neutral-500">{m.email}</p>
              </li>
            ))}
          </ul>
        )}
        {owners.length ? (
          <p className="mt-4 text-xs text-neutral-400">
            Titular: {owners.map((o) => o.display_name || o.email).join(", ")}
          </p>
        ) : null}
      </section>

      {pending.length > 0 ? (
        <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-bold text-neutral-900">Invitaciones pendientes</h2>
          <ul className="mt-3 space-y-3">
            {pending.map((inv) => {
              const link = buildClinicStaffInviteUrl(inv.token);
              return (
                <li key={inv.id} className="text-sm">
                  <p className="font-semibold text-neutral-800">{inv.email}</p>
                  <p className="break-all text-xs text-neutral-500">{link}</p>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
