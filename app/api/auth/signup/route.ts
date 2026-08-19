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
      accountType?: "patient" | "physio";
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

    const accountType = body.accountType === "physio" ? "physio" : "patient";

    const { data, error } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400, headers: CORS });
    }

    if (data.user) {
      await adminClient.from("profiles").upsert({
        id: data.user.id,
        onboarding_completed: false,
        is_admin: false,
        account_type: accountType,
      });
    }

    return NextResponse.json({ ok: true }, { headers: CORS });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500, headers: CORS });
  }
}
