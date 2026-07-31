"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type AdminUser = {
  id: string;
  email: string;
  display_name: string | null;
  created_at: string;
  last_sign_in_at: string | null;
  onboarding_completed: boolean;
  primary_sport: string | null;
  is_admin: boolean;
  is_premium: boolean;
};

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [inviteEmail, setInviteEmail] = useState("");
  const [invitePassword, setInvitePassword] = useState("");
  const [inviteMsg, setInviteMsg] = useState<string | null>(null);

  const load = useCallback(async () => {
    const supabase = createClient();
    setLoading(true);
    setError(null);
    const { data, error: rpcError } = await supabase.rpc("admin_list_users");
    if (rpcError) {
      setError(rpcError.message);
      setUsers([]);
    } else {
      setUsers((data as AdminUser[]) ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleDelete(user: AdminUser) {
    if (user.is_admin) return;
    const ok = window.confirm(
      `¿Eliminar permanentemente la cuenta de ${user.email}? Esta acción no se puede deshacer.`
    );
    if (!ok) return;

    const supabase = createClient();
    setBusyId(user.id);
    setError(null);
    const { error: rpcError } = await supabase.rpc("admin_delete_user", {
      target_user_id: user.id,
    });
    if (rpcError) {
      setError(rpcError.message);
    } else {
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
    }
    setBusyId(null);
  }

  async function handleCreateUser(e: React.FormEvent) {
    e.preventDefault();
    setInviteMsg(null);
    setError(null);

    const email = inviteEmail.trim().toLowerCase();
    const password = invitePassword;
    if (!email || password.length < 8) {
      setError("Indica un email y una contraseña de al menos 8 caracteres.");
      return;
    }

    setBusyId("create");
    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = (await res.json()) as { error?: string; ok?: boolean };

    if (!res.ok) {
      setError(data.error ?? "No se pudo crear el usuario.");
      setBusyId(null);
      return;
    }

    setInviteEmail("");
    setInvitePassword("");
    setInviteMsg(`Usuario ${email} creado correctamente.`);
    setBusyId(null);
    await load();
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
        Usuarios
      </h1>
      <p className="mt-2 text-sm text-neutral-600">
        Lista de cuentas registradas. Puedes crear usuarios nuevos o eliminar
        cuentas (excepto la de administrador).
      </p>

      <section className="mt-8 rounded-2xl border border-neutral-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-neutral-900">
          Crear usuario
        </h2>
        <p className="mt-1 text-sm text-neutral-600">
          Requiere la clave{" "}
          <code className="rounded bg-neutral-100 px-1 text-xs">
            SUPABASE_SERVICE_ROLE_KEY
          </code>{" "}
          en el servidor.
        </p>
        <form onSubmit={handleCreateUser} className="mt-4 grid gap-3 sm:grid-cols-2">
          <input
            type="email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            placeholder="email@ejemplo.com"
            className="rounded-xl border border-neutral-300 px-4 py-3 text-sm focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-200"
            disabled={busyId === "create"}
          />
          <input
            type="password"
            value={invitePassword}
            onChange={(e) => setInvitePassword(e.target.value)}
            placeholder="Contraseña temporal (mín. 8)"
            className="rounded-xl border border-neutral-300 px-4 py-3 text-sm focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-200"
            disabled={busyId === "create"}
          />
          <button
            type="submit"
            disabled={busyId === "create"}
            className="sm:col-span-2 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {busyId === "create" ? "Creando…" : "Crear cuenta"}
          </button>
        </form>
      </section>

      {error && (
        <div className="mt-6 rounded-xl bg-red-50 px-5 py-4 text-sm text-red-800">
          {error}
        </div>
      )}
      {inviteMsg && (
        <div className="mt-6 rounded-xl bg-green-50 px-5 py-4 text-sm text-green-800">
          {inviteMsg}
        </div>
      )}

      <section className="mt-8 overflow-hidden rounded-2xl border border-neutral-200 bg-white">
        <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-3">
          <h2 className="text-sm font-semibold text-neutral-800">
            {loading ? "Cargando…" : `${users.length} usuario${users.length === 1 ? "" : "s"}`}
          </h2>
          <button
            type="button"
            onClick={() => void load()}
            className="text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            Actualizar
          </button>
        </div>

        {users.length === 0 && !loading ? (
          <p className="px-5 py-8 text-sm text-neutral-500">
            No hay usuarios todavía.
          </p>
        ) : (
          <ul className="divide-y divide-neutral-100">
            {users.map((user) => (
              <li
                key={user.id}
                className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-neutral-900">
                    {user.email}
                    {user.is_admin && (
                      <span className="ml-2 rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-700">
                        Admin
                      </span>
                    )}
                  </p>
                  <p className="mt-0.5 text-xs text-neutral-500">
                    {user.display_name || "Sin nombre"} ·{" "}
                    {user.primary_sport || "Sin deporte"} · Alta{" "}
                    {formatDate(user.created_at)}
                  </p>
                  <p className="mt-0.5 text-xs text-neutral-400">
                    Último acceso: {formatDate(user.last_sign_in_at)} ·{" "}
                    {user.onboarding_completed
                      ? "Onboarding completo"
                      : "Onboarding pendiente"}
                  </p>
                </div>
                {!user.is_admin && (
                  <button
                    type="button"
                    onClick={() => void handleDelete(user)}
                    disabled={busyId === user.id}
                    className="shrink-0 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-50"
                  >
                    {busyId === user.id ? "Eliminando…" : "Eliminar"}
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
