import type { SupabaseClient } from "@supabase/supabase-js";
import { findOrCreateGuestPatient } from "@/lib/find-or-create-guest-patient";
import { looksLikeInviteCode, normalizeInviteCode } from "@/lib/physio-invite";

export type ResolvedInvite = {
  physioId: string;
  clinicId: string | null;
  physioName: string | null;
  clinicName: string | null;
  inviteCode: string;
};

/** Same invite lookup as guest-physio (physio code or clinic patient code). */
export async function resolveInviteCode(
  admin: SupabaseClient,
  rawCode: string
): Promise<ResolvedInvite | { error: string }> {
  const normalized = normalizeInviteCode(rawCode);
  if (!looksLikeInviteCode(normalized)) {
    return { error: "Código no válido. Comprueba que lo has escrito bien." };
  }

  const { data: physio, error: lookupError } = await admin
    .from("profiles")
    .select("id, display_name, clinic_name, clinic_id")
    .eq("account_type", "physio")
    .eq("invite_code", normalized)
    .maybeSingle();

  if (lookupError) {
    return { error: "No se pudo comprobar el código. Inténtalo de nuevo." };
  }

  if (physio?.id) {
    return {
      physioId: physio.id,
      clinicId: (physio.clinic_id as string | null) ?? null,
      physioName: physio.display_name ?? null,
      clinicName: physio.clinic_name ?? null,
      inviteCode: normalized,
    };
  }

  const { data: clinic, error: clinicErr } = await admin
    .from("clinics")
    .select("id, name")
    .eq("patient_invite_code", normalized)
    .maybeSingle();

  if (clinicErr) {
    return { error: "No se pudo comprobar el código. Inténtalo de nuevo." };
  }
  if (!clinic?.id) {
    return { error: "Código no encontrado. Comprueba que lo has escrito bien." };
  }

  const { data: members } = await admin
    .from("clinic_members")
    .select("user_id, role")
    .eq("clinic_id", clinic.id);

  const memberIds = ((members as { user_id: string; role: string }[]) ?? []).map(
    (m) => m.user_id
  );
  let picked: string | null = null;
  let pickedName: string | null = null;

  if (memberIds.length > 0) {
    const { data: physioProfiles } = await admin
      .from("profiles")
      .select("id, display_name")
      .eq("account_type", "physio")
      .in("id", memberIds)
      .limit(1);
    const firstPhysio = (
      physioProfiles as { id: string; display_name: string | null }[] | null
    )?.[0];
    if (firstPhysio) {
      picked = firstPhysio.id;
      pickedName = firstPhysio.display_name;
    }
  }

  if (!picked) {
    return {
      error:
        "Esta clínica aún no tiene un fisioterapeuta asignado. Prueba más tarde.",
    };
  }

  return {
    physioId: picked,
    clinicId: clinic.id,
    physioName: pickedName,
    clinicName: clinic.name ?? null,
    inviteCode: normalized,
  };
}

/** Create or reuse guest patient linked to physio (shared with web/mobile). */
export async function createWhatsAppGuestPatient(
  admin: SupabaseClient,
  opts: {
    physioId: string;
    clinicId?: string | null;
    displayName: string;
    phoneE164: string;
  }
): Promise<
  | { patientId: string; email: string; password: string; reused: boolean }
  | { error: string }
> {
  const result = await findOrCreateGuestPatient(admin, {
    physioId: opts.physioId,
    clinicId: opts.clinicId,
    displayName: opts.displayName,
    phoneDigits: opts.phoneE164,
    channel: "whatsapp",
  });
  if ("error" in result) return result;
  return {
    patientId: result.patientId,
    email: result.email,
    password: result.password,
    reused: result.reused,
  };
}
