import { createClient as createSupabaseClient, type User } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { requirePhysio } from "@/lib/physio-auth";
import { getSupabasePublishableKey, getSupabaseUrl } from "@/lib/supabase/env";

function getServiceRoleKey(): string | null {
  return process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || null;
}

async function resolvePhysio(request: NextRequest): Promise<User | null> {
  const authHeader = request.headers.get("Authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice(7);
    const supabase = createSupabaseClient(
      getSupabaseUrl(),
      getSupabasePublishableKey(),
      {
        auth: { autoRefreshToken: false, persistSession: false },
      }
    );
    const {
      data: { user },
    } = await supabase.auth.getUser(token);
    if (!user) return null;

    const { data: profile } = await supabase
      .from("profiles")
      .select("account_type")
      .eq("id", user.id)
      .maybeSingle();
    if (profile?.account_type !== "physio") return null;
    return user;
  }

  const cookieStore = await cookies();
  const supabase = createServerClient(
    getSupabaseUrl(),
    getSupabasePublishableKey(),
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (toSet) =>
          toSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          ),
      },
    }
  );
  return requirePhysio(supabase);
}

export async function POST(request: NextRequest) {
  try {
    const physio = await resolvePhysio(request);
    if (!physio) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const serviceKey = getServiceRoleKey();
    if (!serviceKey) {
      return NextResponse.json(
        {
          error:
            "Falta SUPABASE_SERVICE_ROLE_KEY en el servidor. Añádela en .env.local (Settings → API → service_role).",
        },
        { status: 503 }
      );
    }

    const body = (await request.json()) as {
      email?: string;
      password?: string;
      displayName?: string;
    };
    const email = body.email?.trim().toLowerCase();
    const password = body.password ?? "";
    const displayName = body.displayName?.trim() || null;

    if (!email || password.length < 8) {
      return NextResponse.json(
        { error: "Email y contraseña (mín. 8) son obligatorios." },
        { status: 400 }
      );
    }

    const adminClient = createSupabaseClient(getSupabaseUrl(), serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data, error } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (data.user) {
      const { error: upsertError } = await adminClient.from("profiles").upsert({
        id: data.user.id,
        account_type: "patient",
        physio_id: physio.id,
        display_name: displayName,
        onboarding_completed: false,
      });
      if (upsertError) {
        return NextResponse.json({ error: upsertError.message }, { status: 500 });
      }
    }

    return NextResponse.json({ ok: true, id: data.user?.id });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
