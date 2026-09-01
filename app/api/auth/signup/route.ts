import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { isGuestUser } from "@/lib/guest-account";
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

/** Public signup: creates the user already confirmed (no email confirmation). */
export async function POST(request: NextRequest) {
  try {
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
      if (!invite?.email) {
        return NextResponse.json(
          { error: "La invitación no es válida o ha caducado." },
          { status: 400, headers: CORS }
        );
      }
      if (String(invite.email).toLowerCase() !== email) {
        return NextResponse.json(
          {
            error: `Usa el correo de la invitación (${invite.email}).`,
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
        typeof invite.display_name === "string" ? invite.display_name.trim() : "";
      await adminClient.from("profiles").upsert({
        id: data.user.id,
        onboarding_completed: Boolean(displayName),
        is_admin: false,
        account_type: "physio",
        display_name: displayName || null,
      });

      const { error: acceptErr } = await adminClient.rpc("clinic_accept_invite", {
        p_token: clinicInvite,
        p_user_id: data.user.id,
      });
      if (acceptErr) {
        return NextResponse.json(
          { error: acceptErr.message },
          { status: 400, headers: CORS }
        );
      }

      return NextResponse.json({ ok: true, accountType: "physio" }, { headers: CORS });
    }

    const accountType =
      body.accountType === "physio"
        ? "physio"
        : body.accountType === "clinic"
          ? "clinic"
          : "patient";

    const requiresEmailConfirmation =
      accountType === "physio" || accountType === "clinic";

    const { data, error } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: !requiresEmailConfirmation,
      app_metadata: { account_type: accountType },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400, headers: CORS });
    }

    if (data.user) {
      // createUser sometimes drops custom app_metadata; force it.
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

    return NextResponse.json(
      {
        ok: true,
        accountType,
        emailConfirmationRequired: requiresEmailConfirmation,
      },
      { headers: CORS }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500, headers: CORS });
  }
}
