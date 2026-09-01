import { randomBytes, randomUUID } from "crypto";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { GUEST_EMAIL_DOMAIN } from "@/lib/guest-account";
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
 * Creates a guest patient, links them to the physio, returns credentials
 * so the client can sign in for that one consult.
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

    const body = (await request.json()) as { code?: string };
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
      .select("id, display_name, clinic_name")
      .eq("account_type", "physio")
      .eq("invite_code", normalized)
      .maybeSingle();

    if (lookupError) {
      return NextResponse.json(
        { error: "No se pudo comprobar el código. Inténtalo de nuevo." },
        { status: 500, headers: CORS }
      );
    }
    if (!physio?.id) {
      return NextResponse.json(
        { error: "Código no encontrado. Comprueba que lo has escrito bien." },
        { status: 404, headers: CORS }
      );
    }

    const email = `guest.${randomUUID()}@${GUEST_EMAIL_DOMAIN}`;
    const password = randomBytes(18).toString("base64url");

    const { data: created, error: createError } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      app_metadata: { is_guest: true, account_type: "patient" },
    });

    if (createError || !created.user) {
      return NextResponse.json(
        { error: createError?.message ?? "No se pudo empezar la consulta." },
        { status: 400, headers: CORS }
      );
    }

    await adminClient.auth.admin.updateUserById(created.user.id, {
      app_metadata: { is_guest: true, account_type: "patient" },
    });

    const { error: profileError } = await adminClient.from("profiles").upsert({
      id: created.user.id,
      account_type: "patient",
      onboarding_completed: true,
      is_admin: false,
      physio_id: physio.id,
    });

    if (profileError) {
      await adminClient.auth.admin.deleteUser(created.user.id);
      return NextResponse.json(
        { error: "No se pudo vincular con tu fisioterapeuta. Inténtalo de nuevo." },
        { status: 500, headers: CORS }
      );
    }

    return NextResponse.json(
      {
        email,
        password,
        physio: {
          physio_id: physio.id,
          physio_name: physio.display_name ?? null,
          clinic_name: physio.clinic_name ?? null,
        },
      },
      { headers: CORS }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500, headers: CORS });
  }
}
