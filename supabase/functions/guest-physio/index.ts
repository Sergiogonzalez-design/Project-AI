import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const GUEST_EMAIL_DOMAIN = "guests.aikinora.app";

const rateLimitBuckets = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(
  key: string,
  max: number,
  windowMs: number
): { allowed: boolean; retryAfterSec: number } {
  const now = Date.now();
  const entry = rateLimitBuckets.get(key);
  if (!entry || now >= entry.resetAt) {
    rateLimitBuckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSec: 0 };
  }
  if (entry.count >= max) {
    return {
      allowed: false,
      retryAfterSec: Math.max(1, Math.ceil((entry.resetAt - now) / 1000)),
    };
  }
  entry.count += 1;
  return { allowed: true, retryAfterSec: 0 };
}

function clientIp(req: Request): string {
  const realIp = req.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;
  const forwarded = req.headers.get("x-forwarded-for");
  const lastHop = forwarded?.split(",").pop()?.trim();
  return lastHop || "unknown";
}

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
    const ip = clientIp(req);
    const limit = checkRateLimit(`guest-physio:${ip}`, 8, 60_000);
    if (!limit.allowed) {
      return Response.json(
        { error: "Demasiados intentos. Espera un minuto e inténtalo de nuevo." },
        {
          status: 429,
          headers: { ...CORS, "Retry-After": String(limit.retryAfterSec) },
        }
      );
    }

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

    let recipientId = physio?.id ?? null;
    let recipientName = physio?.display_name ?? null;
    let recipientClinic = physio?.clinic_name ?? null;

    if (!recipientId) {
      const { data: clinic, error: clinicErr } = await admin
        .from("clinics")
        .select("id, name")
        .eq("patient_invite_code", normalized)
        .maybeSingle();

      if (clinicErr) {
        return Response.json(
          { error: "No se pudo comprobar el código. Inténtalo de nuevo." },
          { status: 500, headers: CORS }
        );
      }
      if (!clinic?.id) {
        return Response.json(
          { error: "Código no encontrado. Comprueba que lo has escrito bien." },
          { status: 404, headers: CORS }
        );
      }

      const { data: members } = await admin
        .from("clinic_members")
        .select("user_id, role")
        .eq("clinic_id", clinic.id);

      const memberRows = (members as { user_id: string; role: string }[] | null) ?? [];
      const memberIds = memberRows.map((m) => m.user_id);
      let picked: string | null = null;
      let pickedName: string | null = null;

      if (memberIds.length > 0) {
        const { data: physioProfiles } = await admin
          .from("profiles")
          .select("id, display_name")
          .eq("account_type", "physio")
          .in("id", memberIds)
          .limit(1);
        const firstPhysio = (
          physioProfiles as { id: string; display_name: string | null }[] | null
        )?.[0];
        if (firstPhysio) {
          picked = firstPhysio.id;
          pickedName = firstPhysio.display_name;
        }
      }

      if (!picked) {
        const ownerId = memberRows.find((m) => m.role === "owner")?.user_id;
        if (!ownerId) {
          return Response.json(
            { error: "Esta clínica aún no puede recibir pacientes." },
            { status: 400, headers: CORS }
          );
        }
        const { data: ownerProfile } = await admin
          .from("profiles")
          .select("display_name")
          .eq("id", ownerId)
          .maybeSingle();
        picked = ownerId;
        pickedName =
          (ownerProfile as { display_name?: string | null } | null)?.display_name ??
          null;
      }

      recipientId = picked;
      recipientName = pickedName;
      recipientClinic = clinic.name;
    }

    if (!recipientId) {
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
      physio_id: recipientId,
      clinic_name: recipientClinic,
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
          physio_id: recipientId,
          physio_name: recipientName,
          clinic_name: recipientClinic,
        },
      },
      { headers: CORS }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return Response.json({ error: message }, { status: 500, headers: CORS });
  }
});
