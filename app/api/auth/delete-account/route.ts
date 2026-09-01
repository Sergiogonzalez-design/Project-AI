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
      error,
    } = await supabase.auth.getUser(bearer);
    if (error || !user) return null;
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

/**
 * Remove clinic ownership first — clinics.owner_id is ON DELETE RESTRICT,
 * so profile / auth deletes fail (or leave orphans) while a clinic exists.
 */
async function deleteOwnedClinics(
  adminClient: ReturnType<typeof createSupabaseClient>,
  userId: string
) {
  const { data: owned, error: listError } = await adminClient
    .from("clinics")
    .select("id")
    .eq("owner_id", userId);
  if (listError) {
    throw new Error(`No se pudo revisar clínicas: ${listError.message}`);
  }
  if (!owned?.length) return;

  const ids = owned.map((c) => c.id as string);
  // Break profile → clinic links before removing the clinic row.
  await adminClient.from("profiles").update({ clinic_id: null }).in("clinic_id", ids);

  const { error: deleteError } = await adminClient.from("clinics").delete().in("id", ids);
  if (deleteError) {
    throw new Error(`No se pudo eliminar la clínica: ${deleteError.message}`);
  }
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

    await deleteOwnedClinics(adminClient, user.id);

    // Patients linked to this physio/clinic owner.
    const { error: unlinkError } = await adminClient
      .from("profiles")
      .update({ physio_id: null })
      .eq("physio_id", user.id);
    if (unlinkError) {
      return NextResponse.json(
        { error: `No se pudo desvincular pacientes: ${unlinkError.message}` },
        { status: 400, headers: CORS }
      );
    }

    const { error: profileError } = await adminClient
      .from("profiles")
      .delete()
      .eq("id", user.id);
    if (profileError) {
      return NextResponse.json(
        { error: `No se pudo eliminar el perfil: ${profileError.message}` },
        { status: 400, headers: CORS }
      );
    }

    // Hard-delete Auth user (second arg false = not soft-delete).
    const { error } = await adminClient.auth.admin.deleteUser(user.id, false);
    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400, headers: CORS }
      );
    }

    const { data: stillThere, error: verifyError } =
      await adminClient.auth.admin.getUserById(user.id);
    if (!verifyError && stillThere?.user) {
      return NextResponse.json(
        { error: "La cuenta Auth sigue existiendo tras el borrado. Revisa la service role key." },
        { status: 500, headers: CORS }
      );
    }

    return NextResponse.json({ ok: true }, { headers: CORS });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500, headers: CORS });
  }
}
