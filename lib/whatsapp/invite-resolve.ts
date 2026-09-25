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

async function clinicDisplayName(
  admin: SupabaseClient,
  clinicId: string | null,
  fallback: string | null
): Promise<string | null> {
  if (clinicId) {
    const { data } = await admin
      .from("clinics")
      .select("name")
      .eq("id", clinicId)
      .maybeSingle();
    const name = typeof data?.name === "string" ? data.name.trim() : "";
    if (name) return name;
  }
  const fb = fallback?.trim();
  return fb || null;
}

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
    const clinicId = (physio.clinic_id as string | null) ?? null;
    return {
      physioId: physio.id,
      clinicId,
      physioName: physio.display_name ?? null,
      clinicName: await clinicDisplayName(
        admin,
        clinicId,
        physio.clinic_name as string | null
      ),
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

export async function resolvePhysioBinding(
  admin: SupabaseClient,
  physioId: string,
  fallbackInvite?: string | null
): Promise<ResolvedInvite | { error: string }> {
  const { data: physio } = await admin
    .from("profiles")
    .select("id, display_name, clinic_name, clinic_id, invite_code")
    .eq("id", physioId)
    .eq("account_type", "physio")
    .maybeSingle();

  if (!physio?.id) {
    if (fallbackInvite) return resolveInviteCode(admin, fallbackInvite);
    return { error: "No se encontró al fisioterapeuta." };
  }

  const clinicId = (physio.clinic_id as string | null) ?? null;
  const inviteCode =
    (typeof physio.invite_code === "string" && physio.invite_code.trim()) ||
    (fallbackInvite ? normalizeInviteCode(fallbackInvite) : "");

  return {
    physioId: physio.id,
    clinicId,
    physioName: physio.display_name ?? null,
    clinicName: await clinicDisplayName(
      admin,
      clinicId,
      physio.clinic_name as string | null
    ),
    inviteCode,
  };
}

/**
 * Returning WhatsApp patient: reuse the last fisio/clinic for this phone
 * so they never have to type the invite code again after saving the number.
 */
export async function resolveBindingForPhone(
  admin: SupabaseClient,
  phone: string
): Promise<ResolvedInvite | null> {
  const phone_e164 = phone.replace(/\D/g, "");
  if (phone_e164.length < 8) return null;

  const { data: last } = await admin
    .from("whatsapp_consult_sessions")
    .select("invite_code, physio_id")
    .eq("phone_e164", phone_e164)
    .or("physio_id.not.is.null,invite_code.not.is.null")
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (last?.invite_code) {
    const byCode = await resolveInviteCode(admin, last.invite_code as string);
    if (!("error" in byCode)) return byCode;
  }
  if (last?.physio_id) {
    const byPhysio = await resolvePhysioBinding(
      admin,
      last.physio_id as string,
      last.invite_code as string | null
    );
    if (!("error" in byPhysio)) return byPhysio;
  }

  const phoneCandidates = [phone_e164];
  if (phone_e164.startsWith("34") && phone_e164.length >= 11) {
    phoneCandidates.push(phone_e164.slice(2));
  } else if (phone_e164.length === 9) {
    phoneCandidates.push(`34${phone_e164}`);
  }

  const { data: patient } = await admin
    .from("profiles")
    .select("physio_id")
    .in("whatsapp_phone", phoneCandidates)
    .eq("account_type", "patient")
    .not("physio_id", "is", null)
    .limit(1)
    .maybeSingle();

  if (patient?.physio_id) {
    const byPhysio = await resolvePhysioBinding(
      admin,
      patient.physio_id as string
    );
    if (!("error" in byPhysio)) return byPhysio;
  }

  return null;
}

/** Create or reuse guest patient linked to physio (shared with web/mobile). */
export async function createWhatsAppGuestPatient(
  admin: SupabaseClient,
  opts: {
    physioId: string;
    clinicId?: string | null;
    clinicName?: string | null;
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
    clinicName: opts.clinicName,
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
