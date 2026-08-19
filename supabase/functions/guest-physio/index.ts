import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const GUEST_EMAIL_DOMAIN = "guests.aikinora.app";

function parsePastedInviteCode(raw: string | null | undefined): string {
  const text = (raw ?? "").trim();
  if (!text) return "";
  const fromQuery = /[?&#]code=([^&\s#]+)/i.exec(text);
  if (fromQuery) {
    try {
      return decodeURIComponent(fromQuery[1].replace(/\+/g, "%20"))
        .trim()
        .toUpperCase()
        .replace(/\s+/g, "");
    } catch {
      return fromQuery[1].trim().toUpperCase().replace(/\s+/g, "");
    }
  }
  return text.trim().toUpperCase().replace(/\s+/g, "");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS });
  }

  try {
    const body = (await req.json()) as { code?: string };
    const normalized = parsePastedInviteCode(body.code);

    if (normalized.length < 6) {
      return Response.json(
        { error: "Introduce el código que te ha dado tu fisioterapeuta." },
        { status: 400, headers: CORS }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    if (!supabaseUrl || !serviceKey) {
      return Response.json(
        { error: "El servidor no puede crear una consulta invitada ahora mismo." },
        { status: 503, headers: CORS }
      );
    }

    const admin = createClient(supabaseUrl, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data: physio, error: lookupError } = await admin
      .from("profiles")
      .select("id, display_name, clinic_name")
      .eq("account_type", "physio")
      .eq("invite_code", normalized)
      .maybeSingle();

    if (lookupError) {
      return Response.json(
        { error: "No se pudo comprobar el código. Inténtalo de nuevo." },
        { status: 500, headers: CORS }
      );
    }
    if (!physio?.id) {
      return Response.json(
        { error: "Código no encontrado. Comprueba que lo has escrito bien." },
        { status: 404, headers: CORS }
      );
    }

    const email = `guest.${crypto.randomUUID()}@${GUEST_EMAIL_DOMAIN}`;
    const password = crypto.randomUUID().replace(/-/g, "") + "A1!";

    const { data: created, error: createError } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      app_metadata: { is_guest: true, account_type: "patient" },
    });

    if (createError || !created.user) {
      return Response.json(
        { error: createError?.message ?? "No se pudo empezar la consulta." },
        { status: 400, headers: CORS }
      );
    }

    const { error: profileError } = await admin.from("profiles").upsert({
      id: created.user.id,
      account_type: "patient",
      onboarding_completed: true,
      is_admin: false,
      physio_id: physio.id,
    });

    if (profileError) {
      await admin.auth.admin.deleteUser(created.user.id);
      return Response.json(
        { error: "No se pudo vincular con tu fisioterapeuta. Inténtalo de nuevo." },
        { status: 500, headers: CORS }
      );
    }

    return Response.json(
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
    return Response.json({ error: message }, { status: 500, headers: CORS });
  }
});
