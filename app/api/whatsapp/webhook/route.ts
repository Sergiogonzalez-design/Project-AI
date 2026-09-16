import { NextRequest, NextResponse } from "next/server";
import { handleWhatsAppInbound } from "@/lib/whatsapp/consulta-engine";
import {
  sendWhatsAppOutbound,
  verifyMetaSignature,
} from "@/lib/whatsapp/meta-client";
import { createWhatsAppAdminClient } from "@/lib/whatsapp/sessions";
import type { WhatsAppInbound } from "@/lib/whatsapp/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Meta webhook verification (subscribe challenge). */
export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;
  const mode = sp.get("hub.mode");
  const token = sp.get("hub.verify_token");
  const challenge = sp.get("hub.challenge");
  const expected = process.env.WHATSAPP_VERIFY_TOKEN?.trim();

  if (mode === "subscribe" && expected && token === expected && challenge) {
    return new NextResponse(challenge, {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  }

  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

type MetaChangeValue = {
  messages?: {
    id?: string;
    from?: string;
    type?: string;
    text?: { body?: string };
    button?: { payload?: string; text?: string };
    interactive?: {
      type?: string;
      button_reply?: { id?: string; title?: string };
      list_reply?: { id?: string; title?: string };
    };
  }[];
  contacts?: { profile?: { name?: string }; wa_id?: string }[];
};

/**
 * Meta Cloud API webhook — drives the same consulta previa engine as the website.
 */
export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-hub-signature-256");
  const okSig = await verifyMetaSignature(rawBody, signature);
  if (!okSig) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let payload: {
    entry?: {
      changes?: { value?: MetaChangeValue; field?: string }[];
    }[];
  };
  try {
    payload = JSON.parse(rawBody) as typeof payload;
  } catch {
    return NextResponse.json({ error: "Bad JSON" }, { status: 400 });
  }

  const admin = createWhatsAppAdminClient();
  if (!admin) {
    console.error("[whatsapp] missing SUPABASE_SERVICE_ROLE_KEY");
    // Still 200 so Meta does not retry forever during setup.
    return NextResponse.json({ ok: true, skipped: true });
  }

  const jobs: Promise<void>[] = [];

  for (const entry of payload.entry ?? []) {
    for (const change of entry.changes ?? []) {
      if (change.field && change.field !== "messages") continue;
      const value = change.value;
      if (!value?.messages?.length) continue;

      for (const msg of value.messages) {
        const from = msg.from;
        if (!from) continue;

        let text = "";
        let buttonId: string | null = null;

        if (msg.type === "text") {
          text = msg.text?.body ?? "";
        } else if (msg.type === "button") {
          buttonId = msg.button?.payload ?? null;
          text = msg.button?.text ?? "";
        } else if (msg.type === "interactive") {
          buttonId =
            msg.interactive?.button_reply?.id ??
            msg.interactive?.list_reply?.id ??
            null;
          text =
            msg.interactive?.button_reply?.title ??
            msg.interactive?.list_reply?.title ??
            "";
        } else {
          // Ignore media/reactions for v1
          continue;
        }

        const profileName =
          value.contacts?.find((c) => c.wa_id === from)?.profile?.name ?? null;

        const inbound: WhatsAppInbound = {
          phoneE164: from,
          text,
          buttonId,
          messageId: msg.id ?? null,
          profileName,
        };

        jobs.push(
          (async () => {
            try {
              const outbound = await handleWhatsAppInbound(admin, inbound);
              for (const out of outbound) {
                await sendWhatsAppOutbound(from, out);
              }
            } catch (err) {
              console.error("[whatsapp] handler error", err);
              await sendWhatsAppOutbound(from, {
                type: "text",
                text: "Ha habido un problema temporal. Escribe *hola* para reintentar.",
              });
            }
          })()
        );
      }
    }
  }

  await Promise.all(jobs);
  return NextResponse.json({ ok: true });
}
