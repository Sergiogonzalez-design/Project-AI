/**
 * Meta WhatsApp Cloud API client.
 * Safe no-op when credentials are missing (API not configured yet).
 */

export type MetaSendResult = {
  ok: boolean;
  skipped?: boolean;
  messageId?: string;
  error?: string;
};

/** WhatsApp shows raw * if we send markdown bold — strip all asterisks. */
export function stripWhatsAppMarkdown(text: string): string {
  return text.replace(/\*+/g, "");
}

function metaConfigured(): {
  token: string;
  phoneNumberId: string;
} | null {
  const token = process.env.WHATSAPP_TOKEN?.trim() ?? "";
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID?.trim() ?? "";
  if (!token || !phoneNumberId) return null;
  return { token, phoneNumberId };
}

export function isWhatsAppSendConfigured(): boolean {
  return metaConfigured() != null;
}

async function postWhatsApp(
  body: Record<string, unknown>
): Promise<MetaSendResult> {
  const cfg = metaConfigured();
  if (!cfg) {
    console.info("[whatsapp] send skipped — WHATSAPP_TOKEN / PHONE_NUMBER_ID missing", body);
    return { ok: true, skipped: true };
  }

  const res = await fetch(
    `https://graph.facebook.com/v21.0/${cfg.phoneNumberId}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${cfg.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messaging_product: "whatsapp", ...body }),
    }
  );

  const json = (await res.json().catch(() => ({}))) as {
    messages?: { id?: string }[];
    error?: { message?: string };
  };

  if (!res.ok) {
    const error = json.error?.message ?? `HTTP ${res.status}`;
    console.error("[whatsapp] send failed", error);
    return { ok: false, error };
  }

  return { ok: true, messageId: json.messages?.[0]?.id };
}

export async function sendWhatsAppText(
  toE164: string,
  text: string
): Promise<MetaSendResult> {
  const to = toE164.replace(/\D/g, "");
  const body = stripWhatsAppMarkdown(text).slice(0, 4096);
  return postWhatsApp({
    to,
    type: "text",
    text: { preview_url: false, body },
  });
}

/** Interactive reply buttons (max 3, titles ≤20 chars). */
export async function sendWhatsAppButtons(
  toE164: string,
  bodyText: string,
  buttons: { id: string; title: string }[]
): Promise<MetaSendResult> {
  const to = toE164.replace(/\D/g, "");
  const trimmed = buttons.slice(0, 3).map((b, i) => ({
    type: "reply" as const,
    reply: {
      id: b.id.slice(0, 256),
      title: b.title.slice(0, 20),
    },
  }));
  if (trimmed.length === 0) {
    return sendWhatsAppText(toE164, bodyText);
  }
  return postWhatsApp({
    to,
    type: "interactive",
    interactive: {
      type: "button",
      body: { text: stripWhatsAppMarkdown(bodyText).slice(0, 1024) },
      action: { buttons: trimmed },
    },
  });
}

/** Interactive list (for multi-option questions). */
export async function sendWhatsAppList(
  toE164: string,
  bodyText: string,
  buttonLabel: string,
  sections: {
    title: string;
    rows: { id: string; title: string; description?: string }[];
  }[]
): Promise<MetaSendResult> {
  const to = toE164.replace(/\D/g, "");
  const safeSections = sections.slice(0, 10).map((s) => ({
    title: s.title.slice(0, 24),
    rows: s.rows.slice(0, 10).map((r) => ({
      id: r.id.slice(0, 200),
      title: r.title.slice(0, 24),
      ...(r.description
        ? { description: r.description.slice(0, 72) }
        : {}),
    })),
  }));
  if (!safeSections.some((s) => s.rows.length > 0)) {
    return sendWhatsAppText(toE164, bodyText);
  }
  return postWhatsApp({
    to,
    type: "interactive",
    interactive: {
      type: "list",
      body: { text: stripWhatsAppMarkdown(bodyText).slice(0, 1024) },
      action: {
        button: buttonLabel.slice(0, 20),
        sections: safeSections,
      },
    },
  });
}

export async function sendWhatsAppOutbound(
  toE164: string,
  message: import("./types").WhatsAppOutbound
): Promise<MetaSendResult> {
  if (message.type === "text") {
    return sendWhatsAppText(toE164, message.text);
  }
  if (message.type === "buttons") {
    return sendWhatsAppButtons(toE164, message.text, message.buttons);
  }
  return sendWhatsAppList(
    toE164,
    message.text,
    message.buttonLabel,
    message.sections
  );
}

/** Verify Meta webhook signature (X-Hub-Signature-256). */
export async function verifyMetaSignature(
  rawBody: string,
  signatureHeader: string | null
): Promise<boolean> {
  const secret = process.env.WHATSAPP_APP_SECRET?.trim();
  if (!secret) {
    // Allow unverified traffic only when secret is not configured (dev).
    return process.env.NODE_ENV !== "production";
  }
  if (!signatureHeader?.startsWith("sha256=")) return false;
  const expected = signatureHeader.slice("sha256=".length);
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(rawBody)
  );
  const hex = [...new Uint8Array(sig)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return timingSafeEqual(hex, expected);
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) {
    out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return out === 0;
}
