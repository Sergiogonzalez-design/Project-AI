import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseUrl } from "@/lib/supabase/env";
import type {
  WhatsAppConsultSession,
  WhatsAppPhase,
  WhatsAppSessionState,
} from "./types";

function getServiceRoleKey(): string | null {
  return process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || null;
}

export function createWhatsAppAdminClient(): SupabaseClient | null {
  const key = getServiceRoleKey();
  if (!key) return null;
  return createClient(getSupabaseUrl(), key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, "");
}

export async function getActiveSessionByPhone(
  admin: SupabaseClient,
  phone: string
): Promise<WhatsAppConsultSession | null> {
  const phone_e164 = normalizePhone(phone);
  const { data, error } = await admin
    .from("whatsapp_consult_sessions")
    .select(
      "id, phone_e164, invite_code, physio_id, clinic_id, patient_id, conversation_id, phase, state, last_wa_message_id, completed_at"
    )
    .eq("phone_e164", phone_e164)
    .is("completed_at", null)
    .maybeSingle();
  if (error) {
    console.error("[whatsapp] getActiveSession", error.message);
    return null;
  }
  if (!data) return null;
  return {
    ...(data as WhatsAppConsultSession),
    state: (data.state as WhatsAppSessionState) ?? {},
  };
}

export async function createSession(
  admin: SupabaseClient,
  phone: string,
  patch: Partial<{
    invite_code: string;
    physio_id: string;
    clinic_id: string;
    phase: WhatsAppPhase;
    state: WhatsAppSessionState;
  }> = {}
): Promise<WhatsAppConsultSession | null> {
  const phone_e164 = normalizePhone(phone);
  const { data, error } = await admin
    .from("whatsapp_consult_sessions")
    .insert({
      phone_e164,
      invite_code: patch.invite_code ?? null,
      physio_id: patch.physio_id ?? null,
      clinic_id: patch.clinic_id ?? null,
      phase: patch.phase ?? "idle",
      state: patch.state ?? {},
    })
    .select(
      "id, phone_e164, invite_code, physio_id, clinic_id, patient_id, conversation_id, phase, state, last_wa_message_id, completed_at"
    )
    .single();
  if (error) {
    console.error("[whatsapp] createSession", error.message);
    return null;
  }
  return {
    ...(data as WhatsAppConsultSession),
    state: (data.state as WhatsAppSessionState) ?? {},
  };
}

export async function updateSession(
  admin: SupabaseClient,
  id: string,
  patch: Partial<{
    invite_code: string | null;
    physio_id: string | null;
    clinic_id: string | null;
    patient_id: string | null;
    conversation_id: string | null;
    phase: WhatsAppPhase;
    state: WhatsAppSessionState;
    last_wa_message_id: string | null;
    completed_at: string | null;
  }>
): Promise<WhatsAppConsultSession | null> {
  const { data, error } = await admin
    .from("whatsapp_consult_sessions")
    .update(patch)
    .eq("id", id)
    .select(
      "id, phone_e164, invite_code, physio_id, clinic_id, patient_id, conversation_id, phase, state, last_wa_message_id, completed_at"
    )
    .single();
  if (error) {
    console.error("[whatsapp] updateSession", error.message);
    return null;
  }
  return {
    ...(data as WhatsAppConsultSession),
    state: (data.state as WhatsAppSessionState) ?? {},
  };
}

export async function mergeSessionState(
  admin: SupabaseClient,
  session: WhatsAppConsultSession,
  statePatch: Partial<WhatsAppSessionState>,
  extra?: Partial<{
    phase: WhatsAppPhase;
    patient_id: string | null;
    conversation_id: string | null;
    invite_code: string | null;
    physio_id: string | null;
    clinic_id: string | null;
    last_wa_message_id: string | null;
    completed_at: string | null;
  }>
): Promise<WhatsAppConsultSession | null> {
  return updateSession(admin, session.id, {
    ...extra,
    state: { ...session.state, ...statePatch },
  });
}
