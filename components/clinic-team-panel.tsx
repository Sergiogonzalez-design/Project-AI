"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  buildClinicInviteShareMessage,
  buildClinicStaffInviteUrl,
  clinicInviteMailtoUrl,
  clinicInviteWhatsAppUrl,
} from "@/lib/clinic-invite";
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
  email: string | null;
  display_name: string | null;
  created_at: string;
  expires_at: string;
  accepted_at: string | null;
  token: string;
  invite_code?: string | null;
};

type CreatedInvite = {
  link: string;
  code: string;
  email: string | null;
};

export function ClinicTeamPanel() {
  const [members, setMembers] = useState<Member[]>([]);
  const [invites, setInvites] = useState<Invite[]>([]);
  const [clinicName, setClinicName] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [created, setCreated] = useState<CreatedInvite | null>(null);
  const [copied, setCopied] = useState<"code" | "link" | null>(null);

  const load = useCallback(async () => {
    const supabase = createClient();
    const [{ data: m, error: mErr }, { data: i, error: iErr }, { data: clinic }] =
      await Promise.all([
        supabase.rpc("clinic_list_members"),
        supabase.rpc("clinic_list_invites"),
        supabase.rpc("clinic_get_own"),
      ]);
    if (mErr) setError(mErr.message);
    else setMembers((m as Member[]) ?? []);
    if (iErr) setError(iErr.message);
    else setInvites((i as Invite[]) ?? []);
    if (clinic && typeof clinic === "object" && "name" in clinic) {
      setClinicName(String((clinic as { name?: string }).name ?? "") || null);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const shareMessage = useMemo(() => {
    if (!created) return "";
    return buildClinicInviteShareMessage({
      clinicName,
      inviteCode: created.code,
      link: created.link,
    });
  }, [clinicName, created]);

  async function invitePhysio(e: React.FormEvent, opts?: { openCode?: boolean }) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const supabase = createClient();
      const openCode = opts?.openCode || !email.trim();
      const { data, error: err } = await supabase.rpc("clinic_create_invite", {
        p_email: openCode ? null : email.trim().toLowerCase(),
        p_display_name: displayName.trim() || null,
      });
      if (err) throw new Error(err.message);
      const row = Array.isArray(data) ? data[0] : data;
      if (!row?.token || !row?.invite_code) {
        throw new Error("No se pudo crear la invitación.");
      }
      setCreated({
        link: buildClinicStaffInviteUrl(row.token),
        code: String(row.invite_code),
        email: row.email ?? null,
      });
      if (!openCode) {
        setEmail("");
        setDisplayName("");
      }
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo invitar.");
    } finally {
      setBusy(false);
    }
  }

  function markCopied(kind: "code" | "link") {
    setCopied(kind);
    window.setTimeout(() => setCopied(null), 1500);
  }

  const pending = invites.filter((i) => !i.accepted_at);
  const physios = members.filter((m) => m.role === "physio");
  const owners = members.filter((m) => m.role !== "physio");

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/clinica"
          className="text-sm font-semibold text-blue-600 hover:underline"
        >
          ← Clínica
        </Link>
        <h1 className="mt-2 text-xl font-bold text-neutral-900">Equipo</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Genera un código o enlace. El fisioterapeuta lo introduce en Crear
          cuenta → Fisio, o abre el enlace en la web.
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
              Correo (opcional)
            </label>
            <input
              type="email"
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
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="submit"
            disabled={busy}
            className="btn-primary px-4 py-2.5 text-sm disabled:opacity-60"
          >
            {busy
              ? "Creando…"
              : email.trim()
                ? "Crear invitación"
                : "Generar código de alta"}
          </button>
          {email.trim() ? (
            <button
              type="button"
              disabled={busy}
              className="rounded-xl border border-neutral-200 px-4 py-2.5 text-sm font-semibold disabled:opacity-60"
              onClick={(e) => void invitePhysio(e, { openCode: true })}
            >
              Solo código (sin correo)
            </button>
          ) : null}
        </div>

        {created ? (
          <div className="mt-4 rounded-xl bg-blue-50 px-3 py-3 text-sm">
            <p className="text-xs font-bold uppercase tracking-wide text-blue-900">
              Código de alta
            </p>
            <p className="mt-1 font-mono text-2xl font-extrabold tracking-[0.2em] text-slate-900">
              {created.code}
            </p>
            <button
              type="button"
              className="mt-2 text-xs font-bold text-blue-700 hover:underline"
              onClick={() => {
                void navigator.clipboard.writeText(created.code);
                markCopied("code");
              }}
            >
              {copied === "code" ? "Código copiado" : "Copiar código"}
            </button>

            <p className="mt-4 text-xs font-bold uppercase tracking-wide text-blue-900">
              Enlace web
            </p>
            <p className="mt-1 break-all text-blue-800">{created.link}</p>
            <button
              type="button"
              className="mt-2 text-xs font-bold text-blue-700 hover:underline"
              onClick={() => {
                void navigator.clipboard.writeText(created.link);
                markCopied("link");
              }}
            >
              {copied === "link" ? "Enlace copiado" : "Copiar enlace"}
            </button>

            <div className="mt-4 flex flex-wrap gap-2">
              <a
                href={clinicInviteWhatsAppUrl(shareMessage)}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg bg-green-600 px-3 py-2 text-xs font-bold text-white"
              >
                WhatsApp
              </a>
              <a
                href={clinicInviteMailtoUrl(shareMessage, created.email)}
                className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-bold text-white"
              >
                Email
              </a>
              <button
                type="button"
                className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-bold text-white"
                onClick={() => {
                  if (navigator.share) {
                    void navigator.share({
                      title: "Invitación AIKinora",
                      text: shareMessage,
                    });
                  } else {
                    void navigator.clipboard.writeText(shareMessage);
                    markCopied("link");
                  }
                }}
              >
                Compartir
              </button>
            </div>
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
                  <p className="font-semibold text-neutral-800">
                    {inv.email || "Código libre"}
                    {inv.invite_code ? ` · ${inv.invite_code}` : ""}
                  </p>
                  <p className="break-all text-xs text-neutral-500">{link}</p>
                  <button
                    type="button"
                    className="mt-1 text-xs font-bold text-blue-700 hover:underline"
                    onClick={() =>
                      setCreated({
                        link,
                        code: inv.invite_code || inv.token.slice(0, 8).toUpperCase(),
                        email: inv.email,
                      })
                    }
                  >
                    Ver / compartir
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
