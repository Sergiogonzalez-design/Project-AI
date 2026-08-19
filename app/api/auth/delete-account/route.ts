import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { getSupabasePublishableKey, getSupabaseUrl } from "@/lib/supabase/env";

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

async function resolveUser(request: NextRequest) {
  const url = getSupabaseUrl();
  const anon = getSupabasePublishableKey();
  const authHeader = request.headers.get("authorization");
  const bearer = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7).trim()
    : "";

  if (bearer) {
    const supabase = createSupabaseClient(url, anon, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
    const {
      data: { user },
    } = await supabase.auth.getUser(bearer);
    return user;
  }

  const cookieStore = await cookies();
  const supabase = createServerClient(url, anon, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (toSet) =>
        toSet.forEach(({ name, value, options }) =>
          cookieStore.set(name, value, options)
        ),
    },
  });
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/** Authenticated user deletes their own account and associated personal data. */
export async function POST(request: NextRequest) {
  try {
    const user = await resolveUser(request);
    if (!user) {
      return NextResponse.json(
        { error: "No autenticado." },
        { status: 401, headers: CORS }
      );
    }

    const serviceKey = getServiceRoleKey();
    if (!serviceKey) {
      return NextResponse.json(
        { error: "El servidor no puede eliminar la cuenta ahora mismo." },
        { status: 503, headers: CORS }
      );
    }

    const adminClient = createSupabaseClient(getSupabaseUrl(), serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    await adminClient
      .from("profiles")
      .update({ physio_id: null })
      .eq("physio_id", user.id);
    await adminClient.from("profiles").delete().eq("id", user.id);

    const { error } = await adminClient.auth.admin.deleteUser(user.id);
    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400, headers: CORS }
      );
    }

    return NextResponse.json({ ok: true }, { headers: CORS });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500, headers: CORS });
  }
}
