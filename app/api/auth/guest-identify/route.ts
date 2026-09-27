import { randomBytes } from "crypto";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import {
  isGuestDisplayNameSet,
  isGuestUser,
  normalizeGuestPhoneInput,
} from "@/lib/guest-account";
import { checkRateLimit, rateLimitKey } from "@/lib/rate-limit";
import { getSupabasePublishableKey, getSupabaseUrl } from "@/lib/supabase/env";

function getServiceRoleKey(): string | null {
  return process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || null;
}

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS });
}

/**
 * Guest name gate: save display name + mandatory phone.
 * If the phone already belongs to another patient, switch the session to that
 * chart so the same number always identifies the same person.
 */
export async function POST(request: NextRequest) {
  try {
    const limit = checkRateLimit(
      rateLimitKey(request.headers, "guest-identify"),
      20,
      60_000
    );
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
        { error: "El servidor no puede guardar tus datos ahora mismo." },
        { status: 503, headers: CORS }
      );
    }

    const authHeader = request.headers.get("authorization") ?? "";
    const jwt = authHeader.replace(/^Bearer\s+/i, "").trim();
    if (!jwt) {
      return NextResponse.json(
        { error: "Sesión caducada. Vuelve a abrir el enlace de tu fisioterapeuta." },
        { status: 401, headers: CORS }
      );
    }

    const body = (await request.json()) as {
      displayName?: string;
      phone?: string;
    };
    const displayName = (body.displayName ?? "").trim().replace(/\s+/g, " ");
    if (!isGuestDisplayNameSet(displayName)) {
      return NextResponse.json(
        {
          error:
            "Escribe tu nombre para que tu fisioterapeuta sepa quién eres.",
        },
        { status: 400, headers: CORS }
      );
    }
    const phoneDigits = normalizeGuestPhoneInput(body.phone ?? "");
    if (!phoneDigits) {
      return NextResponse.json(
        {
          error:
            "Introduce tu teléfono con prefijo (ej. 34612345678). Es obligatorio para identificarte.",
        },
        { status: 400, headers: CORS }
      );
    }

    const url = getSupabaseUrl();
    const anon = createSupabaseClient(url, getSupabasePublishableKey(), {
      auth: { autoRefreshToken: false, persistSession: false },
    });
    const {
      data: { user },
      error: userErr,
    } = await anon.auth.getUser(jwt);
    if (userErr || !user) {
      return NextResponse.json(
        { error: "Sesión caducada. Vuelve a abrir el enlace de tu fisioterapeuta." },
        { status: 401, headers: CORS }
      );
    }
    if (!isGuestUser(user)) {
      return NextResponse.json(
        { error: "Esta acción solo está disponible en consulta previa." },
        { status: 403, headers: CORS }
      );
    }

    const admin = createSupabaseClient(url, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data: byPhone } = await admin
      .from("profiles")
      .select("id")
      .eq("whatsapp_phone", phoneDigits)
      .eq("account_type", "patient")
      .maybeSingle();

    const phoneOwnerId = (byPhone?.id as string | undefined) ?? null;
    const targetId =
      phoneOwnerId && phoneOwnerId !== user.id ? phoneOwnerId : user.id;
    const switched = targetId !== user.id;
    const password = randomBytes(24).toString("base64url");

    if (switched) {
      // Free the phone on the temporary guest so the unique index stays clean.
      await admin
        .from("profiles")
        .update({ whatsapp_phone: null })
        .eq("id", user.id);
    }

    const { error: profileErr } = await admin.from("profiles").upsert(
      {
        id: targetId,
        account_type: "patient",
        display_name: displayName,
        whatsapp_phone: phoneDigits,
        onboarding_completed: true,
      },
      { onConflict: "id" }
    );
    if (profileErr) {
      console.error("[guest-identify] profile", profileErr.message);
      return NextResponse.json(
        { error: "No se pudo guardar tus datos. Inténtalo de nuevo." },
        { status: 400, headers: CORS }
      );
    }

    const { data: targetUser, error: getErr } =
      await admin.auth.admin.getUserById(targetId);
    const email = targetUser.user?.email;
    if (getErr || !email) {
      return NextResponse.json(
        { error: "No se pudo abrir tu historial. Inténtalo de nuevo." },
        { status: 500, headers: CORS }
      );
    }

    const { error: pwErr } = await admin.auth.admin.updateUserById(targetId, {
      password,
      user_metadata: {
        ...(targetUser.user?.user_metadata ?? {}),
        display_name: displayName,
        whatsapp_phone: phoneDigits,
      },
    });
    if (pwErr) {
      console.error("[guest-identify] password", pwErr.message);
      return NextResponse.json(
        { error: "No se pudo abrir tu historial. Inténtalo de nuevo." },
        { status: 500, headers: CORS }
      );
    }

    return NextResponse.json(
      {
        email,
        password,
        switched,
        patientId: targetId,
      },
      { headers: CORS }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500, headers: CORS });
  }
}
