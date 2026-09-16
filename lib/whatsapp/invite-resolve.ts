import { randomBytes, randomUUID } from "crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import { GUEST_EMAIL_DOMAIN } from "@/lib/guest-account";
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

/** Create guest auth user + profile linked to physio (same pattern as guest-physio). */
export async function createWhatsAppGuestPatient(
  admin: SupabaseClient,
  opts: {
    physioId: string;
    clinicId?: string | null;
    displayName: string;
    phoneE164: string;
  }
): Promise<
  | { patientId: string; email: string; password: string }
  | { error: string }
> {
  const email = `guest.${randomUUID()}@${GUEST_EMAIL_DOMAIN}`;
  const password = randomBytes(24).toString("base64url");
  const name = opts.displayName.trim().slice(0, 80) || "Paciente";

  const { data: created, error: createErr } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    app_metadata: { is_guest: true, channel: "whatsapp" },
    user_metadata: {
      display_name: name,
      whatsapp_phone: opts.phoneE164.replace(/\D/g, ""),
    },
  });

  if (createErr || !created.user?.id) {
    console.error("[whatsapp] createUser", createErr?.message);
    return { error: "No se pudo crear la sesión de consulta." };
  }

  const patientId = created.user.id;
  const { error: upsertErr } = await admin.from("profiles").upsert(
    {
      id: patientId,
      account_type: "patient",
      display_name: name,
      physio_id: opts.physioId,
      clinic_id: opts.clinicId ?? null,
      onboarding_completed: true,
    },
    { onConflict: "id" }
  );

  if (upsertErr) {
    console.error("[whatsapp] profile upsert", upsertErr.message);
    return { error: "No se pudo vincular al fisioterapeuta." };
  }

  return { patientId, email, password };
}
