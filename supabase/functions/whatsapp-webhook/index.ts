import "jsr:@supabase/functions-js/edge-runtime.d.ts";

/**
 * Thin Meta webhook entry that forwards to the Next.js handler
 * (same consulta previa engine as the website).
 *
 * Prefer pointing Meta directly at:
 *   https://<your-domain>/api/whatsapp/webhook
 *
 * This edge function is useful when you want the webhook URL under
 * …/functions/v1/whatsapp-webhook — set WHATSAPP_WEBHOOK_FORWARD_URL
 * to your Next.js /api/whatsapp/webhook.
 */

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-hub-signature-256",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

function forwardUrl(): string | null {
  const raw =
    Deno.env.get("WHATSAPP_WEBHOOK_FORWARD_URL")?.trim() ||
    Deno.env.get("SITE_URL")?.trim() ||
    "";
  if (!raw) return null;
  const base = raw.replace(/\/$/, "");
  if (base.includes("/api/whatsapp/webhook")) return base;
  return `${base}/api/whatsapp/webhook`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS });
  }

  const target = forwardUrl();
  if (!target) {
    // Local verify still works when Meta points here before SITE_URL is set.
    if (req.method === "GET") {
      const url = new URL(req.url);
      const mode = url.searchParams.get("hub.mode");
      const token = url.searchParams.get("hub.verify_token");
      const challenge = url.searchParams.get("hub.challenge");
      const expected = Deno.env.get("WHATSAPP_VERIFY_TOKEN")?.trim();
      if (mode === "subscribe" && expected && token === expected && challenge) {
        return new Response(challenge, {
          status: 200,
          headers: { "Content-Type": "text/plain", ...CORS },
        });
      }
      return new Response("Forbidden", { status: 403, headers: CORS });
    }
    return new Response(
      JSON.stringify({
        ok: true,
        skipped: true,
        hint: "Set WHATSAPP_WEBHOOK_FORWARD_URL or SITE_URL to your Next.js app",
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...CORS } }
    );
  }

  const url = new URL(req.url);
  const dest = new URL(target);
  for (const [k, v] of url.searchParams) {
    dest.searchParams.set(k, v);
  }

  const headers = new Headers();
  const ct = req.headers.get("content-type");
  if (ct) headers.set("content-type", ct);
  const sig = req.headers.get("x-hub-signature-256");
  if (sig) headers.set("x-hub-signature-256", sig);

  const body = req.method === "GET" ? undefined : await req.arrayBuffer();
  const res = await fetch(dest.toString(), {
    method: req.method,
    headers,
    body,
  });

  const outHeaders = new Headers(CORS);
  const resCt = res.headers.get("content-type");
  if (resCt) outHeaders.set("content-type", resCt);

  return new Response(await res.arrayBuffer(), {
    status: res.status,
    headers: outHeaders,
  });
});
