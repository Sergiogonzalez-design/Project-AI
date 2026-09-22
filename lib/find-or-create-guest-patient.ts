import { randomBytes, randomUUID } from "crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import { GUEST_EMAIL_DOMAIN } from "@/lib/guest-account";

export type FindOrCreateGuestResult =
  | {
      patientId: string;
      email: string;
      password: string;
      reused: boolean;
      guestClientId: string | null;
    }
  | { error: string };

export type FindOrCreateGuestOpts = {
  physioId: string;
  clinicId?: string | null;
  clinicName?: string | null;
  /** When set, updates display_name on reuse/create. */
  displayName?: string | null;
  /** Digits-only phone; links WhatsApp ↔ web/mobile. */
  phoneDigits?: string | null;
  /** Stable UUID from browser/app storage. */
  guestClientId?: string | null;
  channel?: "whatsapp" | "web" | "mobile";
  /**
   * Web/mobile first visit: force display_name null so the name gate runs.
   * Ignored when displayName is provided.
   */
  clearDisplayName?: boolean;
};

function normalizePhone(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const digits = raw.replace(/\D/g, "");
  return digits.length >= 8 ? digits : null;
}

function normalizeGuestClientId(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const id = raw.trim().toLowerCase();
  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(
      id
    )
  ) {
    return null;
  }
  return id;
}

async function lookupExistingPatientId(
  admin: SupabaseClient,
  phoneDigits: string | null,
  guestClientId: string | null
): Promise<string | null> {
  if (phoneDigits) {
    const { data: byPhone } = await admin
      .from("profiles")
      .select("id")
      .eq("whatsapp_phone", phoneDigits)
      .eq("account_type", "patient")
      .maybeSingle();
    if (byPhone?.id) return byPhone.id as string;

    const { data: priorSession } = await admin
      .from("whatsapp_consult_sessions")
      .select("patient_id")
      .eq("phone_e164", phoneDigits)
      .not("patient_id", "is", null)
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (priorSession?.patient_id) return priorSession.patient_id as string;
  }

  if (guestClientId) {
    const { data: byClient } = await admin
      .from("profiles")
      .select("id")
      .eq("guest_client_id", guestClientId)
      .eq("account_type", "patient")
      .maybeSingle();
    if (byClient?.id) return byClient.id as string;
  }

  return null;
}

/**
 * Find an existing patient by phone and/or guest_client_id, or create a new
 * guest. Used by WhatsApp, web `/api/auth/guest-physio`, and the Edge twin so
 * returning consultas accumulate on the same chart.
 */
export async function findOrCreateGuestPatient(
  admin: SupabaseClient,
  opts: FindOrCreateGuestOpts
): Promise<FindOrCreateGuestResult> {
  const phoneDigits = normalizePhone(opts.phoneDigits);
  const guestClientId =
    normalizeGuestClientId(opts.guestClientId) ?? randomUUID();
  const password = randomBytes(24).toString("base64url");
  const channel = opts.channel ?? "web";
  const nameProvided =
    opts.displayName != null && opts.displayName.trim().length > 0;
  const name = nameProvided
    ? opts.displayName!.trim().slice(0, 80)
    : null;

  let existingId = await lookupExistingPatientId(
    admin,
    phoneDigits,
    guestClientId
  );

  if (existingId) {
    const { data: userData, error: getErr } =
      await admin.auth.admin.getUserById(existingId);
    const email = userData.user?.email;
    if (getErr || !email) {
      console.error("[guest] reuse getUser", getErr?.message);
      existingId = null;
    } else {
      const { error: pwErr } = await admin.auth.admin.updateUserById(
        existingId,
        {
          password,
          user_metadata: {
            ...(userData.user.user_metadata ?? {}),
            ...(name ? { display_name: name } : {}),
            ...(phoneDigits ? { whatsapp_phone: phoneDigits } : {}),
            guest_client_id: guestClientId,
          },
        }
      );
      if (pwErr) {
        console.error("[guest] reuse password", pwErr.message);
        return { error: "No se pudo reabrir la sesión de consulta." };
      }

      const profilePatch: Record<string, unknown> = {
        id: existingId,
        account_type: "patient",
        physio_id: opts.physioId,
        onboarding_completed: true,
        guest_client_id: guestClientId,
      };
      if (opts.clinicId !== undefined) {
        profilePatch.clinic_id = opts.clinicId;
      }
      if (opts.clinicName) {
        profilePatch.clinic_name = opts.clinicName;
      }
      if (phoneDigits) {
        profilePatch.whatsapp_phone = phoneDigits;
      }
      if (name) {
        profilePatch.display_name = name;
      }

      const { error: upsertErr } = await admin
        .from("profiles")
        .upsert(profilePatch, { onConflict: "id" });
      if (upsertErr) {
        console.error("[guest] reuse profile", upsertErr.message);
        return { error: "No se pudo vincular al fisioterapeuta." };
      }

      return {
        patientId: existingId,
        email,
        password,
        reused: true,
        guestClientId,
      };
    }
  }

  const email = `guest.${randomUUID()}@${GUEST_EMAIL_DOMAIN}`;
  const { data: created, error: createErr } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    app_metadata: { is_guest: true, account_type: "patient", channel },
    user_metadata: {
      ...(name ? { display_name: name } : {}),
      ...(phoneDigits ? { whatsapp_phone: phoneDigits } : {}),
      guest_client_id: guestClientId,
    },
  });

  if (createErr || !created.user?.id) {
    console.error("[guest] createUser", createErr?.message);
    return { error: "No se pudo crear la sesión de consulta." };
  }

  const patientId = created.user.id;
  const displayName =
    name ?? (opts.clearDisplayName ? null : name);

  const { error: upsertErr } = await admin.from("profiles").upsert(
    {
      id: patientId,
      account_type: "patient",
      display_name: displayName,
      physio_id: opts.physioId,
      clinic_id: opts.clinicId ?? null,
      clinic_name: opts.clinicName ?? null,
      whatsapp_phone: phoneDigits,
      guest_client_id: guestClientId,
      onboarding_completed: true,
      is_admin: false,
    },
    { onConflict: "id" }
  );

  if (upsertErr) {
    console.error("[guest] profile upsert", upsertErr.message);
    await admin.auth.admin.deleteUser(patientId);
    return { error: "No se pudo vincular al fisioterapeuta." };
  }

  if (opts.clearDisplayName && !name) {
    await admin
      .from("profiles")
      .update({ display_name: null })
      .eq("id", patientId);
  }

  return {
    patientId,
    email,
    password,
    reused: false,
    guestClientId,
  };
}
