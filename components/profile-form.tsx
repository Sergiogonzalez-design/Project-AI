"use client";

import { createClient } from "@/lib/supabase/client";
import { Camera, Check, Loader2, Mail, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const SUPABASE_URL = "https://klxlzzgrymkexvuelzex.supabase.co";

export function ProfileForm() {
  const supabase = createClient();
  const fileRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setEmail(user.email ?? "");
      setNewEmail(user.email ?? "");
      setUserId(user.id);

      const { data: profile } = await supabase
        .from("profiles")
        .select("display_name, avatar_url")
        .eq("id", user.id)
        .single();

      if (profile) {
        setDisplayName(profile.display_name ?? "");
        setAvatarUrl(profile.avatar_url ?? null);
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

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  const avatarSrc = avatarPreview ?? avatarUrl;

  return (
    <div className="flex flex-1 flex-col bg-slate-50">
      {/* Header banner */}
      <section className="bg-gradient-to-r from-blue-700 to-blue-500 px-4 py-10 text-white sm:px-6 sm:py-14">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-2xl font-bold sm:text-3xl">Mi perfil</h1>
          <p className="mt-2 text-sm text-blue-100 sm:text-base">
            Personaliza tu cuenta y mantén tus datos actualizados.
          </p>
        </div>
      </section>

      {/* Form card */}
      <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm sm:p-8">

          {/* Avatar */}
          <div className="mb-8 flex flex-col items-center gap-4">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="group relative"
              title="Cambiar foto"
            >
              <div className="relative h-24 w-24 overflow-hidden rounded-full ring-4 ring-blue-100">
                {avatarSrc ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={avatarSrc} alt="Avatar" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-blue-600 text-2xl font-bold text-white">
                    {initials()}
                  </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition group-hover:opacity-100">
                  <Camera className="h-6 w-6 text-white" />
                </div>
              </div>
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={handleFileChange}
            />
            <p className="text-xs text-slate-400">Haz clic en la foto para cambiarla</p>
          </div>

          {/* Fields */}
          <div className="space-y-5">
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
                  className="w-full rounded-xl border border-blue-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
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
                  className="w-full rounded-xl border border-blue-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>
              {newEmail !== email && (
                <p className="mt-1 text-xs text-amber-600">
                  Se enviará un correo de confirmación a la nueva dirección.
                </p>
              )}
            </div>

            {/* Divider */}
            <div className="border-t border-slate-100 pt-2">
              <p className="mb-4 text-sm font-semibold text-slate-500">
                Cambiar contraseña (opcional)
              </p>
              <div className="space-y-4">
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Nueva contraseña"
                  className="w-full rounded-xl border border-blue-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirmar contraseña"
                  className="w-full rounded-xl border border-blue-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>
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
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 text-sm font-bold text-white shadow transition hover:bg-blue-700 disabled:opacity-60"
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
      </div>
    </div>
  );
}
