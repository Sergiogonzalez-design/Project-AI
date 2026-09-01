"use client";

import { AthleteProfileSection } from "@/components/athlete-profile-section";
import { PhysioProfileSection } from "@/components/physio-profile-section";
import { createClient } from "@/lib/supabase/client";
import { signOutToLogin } from "@/lib/sign-out-client";
import { useUiLocale, type UiLocale } from "@/lib/ui-locale";
import { Camera, Check, Loader2, Mail, Shield, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const SUPABASE_URL = "https://klxlzzgrymkexvuelzex.supabase.co";

export function ProfileForm() {
  const supabase = createClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const { locale, setLocale } = useUiLocale();
  const en = locale === "en";


  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [accountType, setAccountType] = useState<"patient" | "physio" | "clinic">("patient");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setEmail(user.email ?? "");
      setNewEmail(user.email ?? "");
      setUserId(user.id);

      const { data: profile } = await supabase
        .from("profiles")
        .select("display_name, avatar_url, account_type")
        .eq("id", user.id)
        .single();

      if (profile) {
        setDisplayName(profile.display_name ?? "");
        setAvatarUrl(profile.avatar_url ?? null);
        setAccountType(
          profile.account_type === "physio"
            ? "physio"
            : profile.account_type === "clinic"
              ? "clinic"
              : "patient"
        );
      }
      setLoading(false);
    }
    load();
  }, []);

  function initials() {
    const parts = displayName.trim().split(" ");
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return displayName.trim().slice(0, 2).toUpperCase() || email.slice(0, 2).toUpperCase();
  }

  /** Resize + compress an image file to max 512×512 px, JPEG ~85% quality */
  function compressImage(file: File): Promise<File> {
    return new Promise((resolve) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(url);
        const MAX = 512;
        let { width, height } = img;
        if (width > MAX || height > MAX) {
          if (width > height) { height = Math.round((height * MAX) / width); width = MAX; }
          else { width = Math.round((width * MAX) / height); height = MAX; }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d")!.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => resolve(blob ? new File([blob], "avatar.jpg", { type: "image/jpeg" }) : file),
          "image/jpeg",
          0.85
        );
      };
      img.onerror = () => { URL.revokeObjectURL(url); resolve(file); };
      img.src = url;
    });
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    const compressed = await compressImage(file);
    setAvatarFile(compressed);
    setAvatarPreview(URL.createObjectURL(compressed));
  }

  async function handleSave() {
    setError(null);
    if (newPassword && newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    if (newPassword && newPassword.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    setSaving(true);
    const errors: string[] = [];

    try {
      // 1. Avatar upload
      let uploadedUrl = avatarUrl;
      if (avatarFile) {
        const ext = avatarFile.name.split(".").pop() ?? "jpg";
        const path = `${userId}/avatar.${ext}`;
        const { error: uploadErr } = await supabase.storage
          .from("avatars")
          .upload(path, avatarFile, { upsert: true });
        if (uploadErr) {
          errors.push(`Foto: ${uploadErr.message}`);
        } else {
          uploadedUrl = `${SUPABASE_URL}/storage/v1/object/public/avatars/${path}?t=${Date.now()}`;
          setAvatarUrl(uploadedUrl);
          setAvatarFile(null);
        }
      }

      // 2. Profile row
      const { error: profileErr } = await supabase
        .from("profiles")
        .upsert({ id: userId, display_name: displayName.trim(), avatar_url: uploadedUrl, updated_at: new Date().toISOString() });
      if (profileErr) errors.push(`Perfil: ${profileErr.message}`);

      // 3. Auth (email / password) — independent of avatar
      const authUpdates: { email?: string; password?: string } = {};
      if (newEmail && newEmail !== email) authUpdates.email = newEmail;
      if (newPassword) authUpdates.password = newPassword;
      if (Object.keys(authUpdates).length > 0) {
        const { error: authErr } = await supabase.auth.updateUser(authUpdates);
        if (authErr) {
          errors.push(`Cuenta: ${authErr.message}`);
        } else {
          if (authUpdates.email) setEmail(newEmail);
          setNewPassword("");
          setConfirmPassword("");
        }
      }

      if (errors.length > 0) {
        setError(errors.join(" · "));
      } else {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteAccount() {
    const ok = window.confirm(
      "Se borrará tu cuenta, consultas, fotos e informes asociados. Esta acción no se puede deshacer. ¿Continuar?"
    );
    if (!ok) return;
    setDeleting(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/delete-account", { method: "POST" });
      const payload = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setError(payload.error ?? "No se pudo eliminar la cuenta.");
        setDeleting(false);
        return;
      }
      signOutToLogin();
    } catch {
      setError("No se pudo eliminar la cuenta. Inténtalo de nuevo.");
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  const avatarSrc = avatarPreview ?? avatarUrl;

  const roleLabel =
    accountType === "clinic"
      ? "Clínica"
      : accountType === "physio"
        ? "Fisioterapeuta"
        : "Paciente";

  return (
    <div className="flex flex-1 flex-col bg-slate-50">
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-800 to-blue-500 px-4 pb-20 pt-12 text-white sm:px-6 sm:pb-24 sm:pt-16">
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-20 left-10 h-48 w-48 rounded-full bg-sky-300/20 blur-2xl" />
        <div className="relative mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-100/80">
            AIKinora
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Mi perfil</h1>
          <p className="mt-2 text-sm text-blue-100 sm:text-base">
            Tu espacio personal. Foto, datos y preferencias en un solo sitio.
          </p>
        </div>
      </section>

      <div className="relative mx-auto w-full max-w-2xl px-4 pb-8 sm:px-6 sm:pb-10">
        <div className="-mt-14 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-[0_24px_60px_-28px_rgba(15,23,42,0.35)] sm:p-8">
          <div className="mb-8 flex flex-col items-center gap-3">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="group relative"
              title="Cambiar foto"
            >
              <div className="relative h-28 w-28 overflow-hidden rounded-full ring-4 ring-white shadow-lg">
                {avatarSrc ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={avatarSrc} alt="Avatar" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-600 to-blue-800 text-3xl font-bold text-white">
                    {initials()}
                  </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-slate-950/45 opacity-0 transition group-hover:opacity-100">
                  <Camera className="h-6 w-6 text-white" />
                </div>
              </div>
              <span className="absolute bottom-1 right-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-blue-700 text-white shadow-md">
                <Camera className="h-3.5 w-3.5" />
              </span>
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={handleFileChange}
            />
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700">
                {roleLabel}
              </span>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
                Plan gratuito
              </span>
            </div>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              Cambiar foto de perfil
            </button>
          </div>

          {/* Fields */}
          <div className="space-y-5">
            <div>
              <p className="mb-1.5 text-sm font-semibold text-slate-700">
                {en ? "Language" : "Idioma"}
              </p>
              <div className="flex flex-wrap gap-2">
                {(
                  [
                    { value: "es" as UiLocale, label: "Español" },
                    { value: "en" as UiLocale, label: "English" },
                  ] as const
                ).map((opt) => {
                  const active = locale === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setLocale(opt.value)}
                      className={
                        active
                          ? "rounded-full bg-blue-600 px-3.5 py-1.5 text-sm font-semibold text-white"
                          : "rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                      }
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
              <p className="mt-1.5 text-xs text-slate-500">
                {en
                  ? "Consulta, Fisioterapia and AI replies follow this language."
                  : "Consulta, Fisioterapia y las respuestas de la IA usan este idioma."}
              </p>
            </div>

            {/* Display name */}
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                Nombre completo
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Tu nombre"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                Correo electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>
              {newEmail !== email && (
                <p className="mt-1 text-xs text-amber-600">
                  Se enviará un correo de confirmación a la nueva dirección.
                </p>
              )}
            </div>

            {/* Password change — collapsible */}
            <div className="border-t border-slate-100 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowPasswordFields((v) => !v);
                  if (showPasswordFields) { setNewPassword(""); setConfirmPassword(""); }
                }}
                className="flex w-full items-center justify-between rounded-xl px-1 py-1 text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                <span>Cambiar contraseña</span>
                <svg
                  className={`h-4 w-4 transition-transform ${showPasswordFields ? "rotate-180" : ""}`}
                  viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                >
                  <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {showPasswordFields && (
                <div className="mt-4 space-y-4">
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Nueva contraseña (mín. 6 caracteres)"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirmar contraseña"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
              {error
                .replace("The object exceeded the maximum allowed size", "La imagen es demasiado grande (máx. 5 MB)")
                .replace("New password should be different from the old password.", "La nueva contraseña debe ser diferente a la actual.")
                .replace("Password should be at least 6 characters.", "La contraseña debe tener al menos 6 caracteres.")}
            </p>
          )}

          {/* Save button */}
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="btn-primary mt-6 w-full !rounded-2xl"
          >
            {saving ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Guardando…</>
            ) : saved ? (
              <><Check className="h-4 w-4" /> ¡Guardado!</>
            ) : (
              "Guardar cambios"
            )}
          </button>
        </div>

        <div className="mt-6">
          {accountType === "clinic" ? (
            <a
              href="/clinica"
              className="block rounded-3xl border border-blue-100 bg-white p-6 text-sm font-semibold text-blue-700 shadow-sm hover:bg-blue-50"
            >
              Editar ficha de la clínica, logo y equipo →
            </a>
          ) : accountType === "physio" ? (
            <PhysioProfileSection />
          ) : (
            <AthleteProfileSection />
          )}
        </div>

        <div className="mt-8 rounded-3xl border border-red-100 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 text-slate-800">
            <Shield className="h-4 w-4 text-red-500" />
            <h2 className="text-sm font-semibold">Zona de peligro</h2>
          </div>
          <p className="mt-1 text-sm leading-relaxed text-slate-500">
            Eliminar la cuenta borra tu perfil, consultas, fotos e informes. No se
            puede deshacer.
          </p>
          <button
            type="button"
            onClick={() => void handleDeleteAccount()}
            disabled={deleting || saving}
            className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 hover:bg-red-100 disabled:opacity-60"
          >
            {deleting ? "Eliminando…" : "Eliminar cuenta"}
          </button>
        </div>
      </div>
    </div>
  );
}
