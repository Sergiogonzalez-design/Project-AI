import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { findOrCreateGuestPatient } from "@/lib/find-or-create-guest-patient";
import { parsePastedInviteCode } from "@/lib/physio-invite";
import { checkRateLimit, rateLimitKey } from "@/lib/rate-limit";
import { getSupabaseUrl } from "@/lib/supabase/env";

function getServiceRoleKey(): string | null {
  return process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || null;
}

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS });
}

/**
 * Public: redeem a physio invite code without a full account.
 * Reuses the same patient when guestClientId or phone matches a prior visit.
 */
export async function POST(request: NextRequest) {
  try {
    const limit = checkRateLimit(rateLimitKey(request.headers, "guest-physio"), 8, 60_000);
    if (!limit.allowed) {
      return NextResponse.json(
        { error: "Demasiados intentos. Espera un minuto e inténtalo de nuevo." },
        {
          status: 429,
          headers: { ...CORS, "Retry-After": String(limit.retryAfterSec) },
        }
      );
    }

    const serviceKey = getServiceRoleKey();
    if (!serviceKey) {
      return NextResponse.json(
        { error: "El servidor no puede crear una consulta invitada ahora mismo." },
        { status: 503, headers: CORS }
      );
    }

    const body = (await request.json()) as {
      code?: string;
      guestClientId?: string;
      phone?: string;
      channel?: "web" | "mobile";
    };
    const normalized = parsePastedInviteCode(body.code);
    if (normalized.length < 6) {
      return NextResponse.json(
        { error: "Introduce el código que te ha dado tu fisioterapeuta." },
        { status: 400, headers: CORS }
      );
    }

    const adminClient = createSupabaseClient(getSupabaseUrl(), serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data: physio, error: lookupError } = await adminClient
      .from("profiles")
      .select("id, display_name, clinic_name, clinic_id")
      .eq("account_type", "physio")
      .eq("invite_code", normalized)
      .maybeSingle();

    if (lookupError) {
      return NextResponse.json(
        { error: "No se pudo comprobar el código. Inténtalo de nuevo." },
        { status: 500, headers: CORS }
      );
    }

    let recipientId = physio?.id ?? null;
    let recipientName = physio?.display_name ?? null;
    let recipientClinic = physio?.clinic_name ?? null;
    let clinicId: string | null = (physio?.clinic_id as string | null) ?? null;

    if (!recipientId) {
      const { data: clinic, error: clinicErr } = await adminClient
        .from("clinics")
        .select("id, name")
        .eq("patient_invite_code", normalized)
        .maybeSingle();

      if (clinicErr) {
        return NextResponse.json(
          { error: "No se pudo comprobar el código. Inténtalo de nuevo." },
          { status: 500, headers: CORS }
        );
      }
      if (!clinic?.id) {
        return NextResponse.json(
          { error: "Código no encontrado. Comprueba que lo has escrito bien." },
          { status: 404, headers: CORS }
        );
      }

      const { data: members } = await adminClient
        .from("clinic_members")
        .select("user_id, role")
        .eq("clinic_id", clinic.id);

      const memberIds = ((members as { user_id: string; role: string }[]) ?? []).map(
        (m) => m.user_id
      );
      let picked: string | null = null;
      let pickedName: string | null = null;

      if (memberIds.length > 0) {
        const { data: physioProfiles } = await adminClient
          .from("profiles")
          .select("id, display_name")
          .eq("account_type", "physio")
          .in("id", memberIds)
          .limit(1);
        const firstPhysio = (physioProfiles as { id: string; display_name: string | null }[] | null)?.[0];
        if (firstPhysio) {
          picked = firstPhysio.id;
          pickedName = firstPhysio.display_name;
        }
      }

      if (!picked) {
        const ownerId = ((members as { user_id: string; role: string }[]) ?? []).find(
          (m) => m.role === "owner"
        )?.user_id;
        if (!ownerId) {
          return NextResponse.json(
            { error: "Esta clínica aún no puede recibir pacientes." },
            { status: 400, headers: CORS }
          );
        }
        const { data: ownerProfile } = await adminClient
          .from("profiles")
          .select("display_name")
          .eq("id", ownerId)
          .maybeSingle();
        picked = ownerId;
        pickedName = (ownerProfile as { display_name?: string | null } | null)?.display_name ?? null;
      }

      recipientId = picked;
      recipientName = pickedName;
      recipientClinic = clinic.name;
      clinicId = clinic.id;
    }

    if (!recipientId) {
      return NextResponse.json(
        { error: "Código no encontrado. Comprueba que lo has escrito bien." },
        { status: 404, headers: CORS }
      );
    }

    if (clinicId) {
      const { data: clinicRow } = await adminClient
        .from("clinics")
        .select("name")
        .eq("id", clinicId)
        .maybeSingle();
      const fromClinic = typeof clinicRow?.name === "string" ? clinicRow.name.trim() : "";
      if (fromClinic) recipientClinic = fromClinic;
    }

    const guest = await findOrCreateGuestPatient(adminClient, {
      physioId: recipientId,
      clinicId,
      clinicName: recipientClinic,
      guestClientId: body.guestClientId,
      phoneDigits: body.phone,
      channel: body.channel === "mobile" ? "mobile" : "web",
      clearDisplayName: true,
    });

    if ("error" in guest) {
      return NextResponse.json({ error: guest.error }, { status: 400, headers: CORS });
    }

    return NextResponse.json(
      {
        email: guest.email,
        password: guest.password,
        reused: guest.reused,
        guestClientId: guest.guestClientId,
        physio: {
          physio_id: recipientId,
          physio_name: recipientName,
          clinic_name: recipientClinic,
        },
      },
      { headers: CORS }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500, headers: CORS });
  }
}
