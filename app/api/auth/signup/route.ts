import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { isGuestUser } from "@/lib/guest-account";
import { checkRateLimit, rateLimitKey } from "@/lib/rate-limit";
import { getSupabaseUrl } from "@/lib/supabase/env";

function getServiceRoleKey(): string | null {
  return process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || null;
}

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "content-type, authorization",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS });
}

/**
 * Public signup:
 * - patient (default)
 * - clinic (self-serve owner; JWT app_metadata.account_type=clinic)
 * - physio with or without invite (unlinked until they claim a clinic code)
 */
export async function POST(request: NextRequest) {
  try {
    const limit = checkRateLimit(rateLimitKey(request.headers, "signup"), 10, 60_000);
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
        {
          error:
            "Falta SUPABASE_SERVICE_ROLE_KEY en el servidor. No se puede crear la cuenta sin confirmación por correo.",
        },
        { status: 503, headers: CORS }
      );
    }

    const body = (await request.json()) as {
      email?: string;
      password?: string;
      accountType?: "patient" | "physio" | "clinic";
      clinicInvite?: string;
    };
    const email = body.email?.trim().toLowerCase() ?? "";
    const password = body.password ?? "";
    const requestedType = body.accountType ?? "patient";

    if (!email || password.length < 6) {
      return NextResponse.json(
        { error: "Email y contraseña (mín. 6) son obligatorios." },
        { status: 400, headers: CORS }
      );
    }

    const adminClient = createSupabaseClient(getSupabaseUrl(), serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const authHeader = request.headers.get("authorization");
    const bearer =
      authHeader?.startsWith("Bearer ") ? authHeader.slice(7).trim() : "";

    if (bearer) {
      const { data: guestData } = await adminClient.auth.getUser(bearer);
      if (guestData.user && isGuestUser(guestData.user)) {
        const { error: updateError } = await adminClient.auth.admin.updateUserById(
          guestData.user.id,
          {
            email,
            password,
            email_confirm: true,
            app_metadata: { is_guest: false, account_type: "patient" },
          }
        );
        if (updateError) {
          return NextResponse.json(
            { error: updateError.message },
            { status: 400, headers: CORS }
          );
        }
        await adminClient
          .from("profiles")
          .update({
            onboarding_completed: false,
            account_type: "patient",
          })
          .eq("id", guestData.user.id);
        return NextResponse.json({ ok: true, converted: true }, { headers: CORS });
      }
    }

    const clinicInvite = body.clinicInvite?.trim() ?? "";

    if (clinicInvite) {
      const { data: inviteRows, error: inviteErr } = await adminClient.rpc(
        "clinic_lookup_invite",
        { p_token: clinicInvite }
      );
      if (inviteErr) {
        return NextResponse.json(
          { error: inviteErr.message },
          { status: 400, headers: CORS }
        );
      }
      const invite = Array.isArray(inviteRows) ? inviteRows[0] : inviteRows;
      if (!invite || !(invite as { clinic_name?: string }).clinic_name) {
        return NextResponse.json(
          { error: "La invitación no es válida o ha caducado." },
          { status: 400, headers: CORS }
        );
      }
      const inviteEmail =
        typeof (invite as { email?: string | null }).email === "string"
          ? String((invite as { email: string }).email).trim().toLowerCase()
          : "";
      if (inviteEmail && inviteEmail !== email) {
        return NextResponse.json(
          {
            error: `Usa el correo de la invitación (${inviteEmail}).`,
          },
          { status: 400, headers: CORS }
        );
      }

      const { data, error } = await adminClient.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        app_metadata: { account_type: "physio" },
      });
      if (error) {
        return NextResponse.json(
          { error: error.message },
          { status: 400, headers: CORS }
        );
      }
      if (!data.user) {
        return NextResponse.json(
          { error: "No se pudo crear la cuenta." },
          { status: 500, headers: CORS }
        );
      }

      const displayName =
        typeof (invite as { display_name?: string | null }).display_name === "string"
          ? String((invite as { display_name: string }).display_name).trim()
          : "";
      await adminClient.from("profiles").upsert({
        id: data.user.id,
        // Always ask for nombre completo in physio onboarding.
        onboarding_completed: false,
        is_admin: false,
        account_type: "physio",
        display_name: displayName || null,
      });

      const { error: acceptErr } = await adminClient.rpc("clinic_accept_invite", {
        p_token: clinicInvite,
        p_user_id: data.user.id,
      });
      if (acceptErr) {
        // Roll back orphan physio accounts (created but not linked to clinic).
        try {
          await adminClient.auth.admin.deleteUser(data.user.id);
        } catch {
          // ignore cleanup errors
        }
        return NextResponse.json(
          {
            error:
              acceptErr.message ||
              "No se pudo vincular con la clínica. Pide un código nuevo al titular.",
          },
          { status: 400, headers: CORS }
        );
      }

      return NextResponse.json({ ok: true, accountType: "physio" }, { headers: CORS });
    }

    // Physio without invite code: account is created unlinked; they claim the
    // clinic code later at login or on the Clínica screen.
    if (requestedType === "physio") {
      const { data, error } = await adminClient.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        app_metadata: { account_type: "physio" },
      });
      if (error) {
        return NextResponse.json(
          { error: error.message },
          { status: 400, headers: CORS }
        );
      }
      if (!data.user) {
        return NextResponse.json(
          { error: "No se pudo crear la cuenta." },
          { status: 500, headers: CORS }
        );
      }
      await adminClient.from("profiles").upsert({
        id: data.user.id,
        onboarding_completed: false,
        is_admin: false,
        account_type: "physio",
      });
      return NextResponse.json({ ok: true, accountType: "physio" }, { headers: CORS });
    }

    const accountType: "patient" | "clinic" =
      requestedType === "clinic" ? "clinic" : "patient";

    const { data, error } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      app_metadata: { account_type: accountType },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400, headers: CORS });
    }

    if (data.user) {
      const { error: metaErr } = await adminClient.auth.admin.updateUserById(
        data.user.id,
        { app_metadata: { account_type: accountType } }
      );
      if (metaErr) {
        return NextResponse.json({ error: metaErr.message }, { status: 400, headers: CORS });
      }

      const { error: profileErr } = await adminClient.from("profiles").upsert({
        id: data.user.id,
        onboarding_completed: false,
        is_admin: false,
        account_type: accountType,
      });
      if (profileErr) {
        return NextResponse.json(
          { error: profileErr.message },
          { status: 400, headers: CORS }
        );
      }
    }

    return NextResponse.json({ ok: true, accountType }, { headers: CORS });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500, headers: CORS });
  }
}
