# WhatsApp consulta previa — Meta Cloud API setup

AIKinora uses **one** consulta previa product. WhatsApp is a second channel that ends in the same `clinical_reports` row the fisio sees on the website.

## 1. Meta Business

1. Create/open a [Meta Business](https://business.facebook.com/) account.
2. Add **WhatsApp** → Cloud API → get a test or production phone number.
3. Copy:
   - **Phone number ID** → `WHATSAPP_PHONE_NUMBER_ID`
   - **Temporary / permanent access token** → `WHATSAPP_TOKEN`
   - **App secret** → `WHATSAPP_APP_SECRET`
4. Choose a verify string → `WHATSAPP_VERIFY_TOKEN` (any random secret you invent).

## 2. Public number for invite links

Set the business number (digits with country code, no `+`) so `/unirse/whatsapp?code=…` can redirect to `wa.me`:

```bash
NEXT_PUBLIC_WHATSAPP_BUSINESS_E164=346XXXXXXXX
```

(Mobile Expo can use `EXPO_PUBLIC_WHATSAPP_BUSINESS_E164` with the same value.)

Until this is set, physios can still share the **WhatsApp invite URL**; the page will fall back to “continue on web” if `wa.me` cannot be built.

## 3. Webhook URL (pick one)

**Recommended — Next.js (full engine):**

```
https://<your-vercel-domain>/api/whatsapp/webhook
```

**Alternative — Supabase Edge proxy:**

```
https://<project-ref>.supabase.co/functions/v1/whatsapp-webhook
```

Set secret `WHATSAPP_WEBHOOK_FORWARD_URL` or `SITE_URL` on the edge function to your Vercel origin so it forwards to `/api/whatsapp/webhook`.

In Meta → WhatsApp → Configuration → Webhook:

- Callback URL = one of the above
- Verify token = same as `WHATSAPP_VERIFY_TOKEN`
- Subscribe to **messages**

## 4. Secrets checklist

| Where | Name |
|---|---|
| Vercel | `NEXT_PUBLIC_WHATSAPP_BUSINESS_E164` |
| Vercel | `WHATSAPP_TOKEN` |
| Vercel | `WHATSAPP_PHONE_NUMBER_ID` |
| Vercel | `WHATSAPP_VERIFY_TOKEN` |
| Vercel | `WHATSAPP_APP_SECRET` |
| Vercel | `SUPABASE_SERVICE_ROLE_KEY` (already used by guest-physio) |
| Supabase Edge (if using proxy) | same WhatsApp secrets + `SITE_URL` / `WHATSAPP_WEBHOOK_FORWARD_URL` |

Without `WHATSAPP_TOKEN` / `PHONE_NUMBER_ID`, inbound handling still runs but **outbound sends are no-ops** (logged). Safe while you finish Meta setup.

## 5. Database

Apply migration `whatsapp_consult_sessions` (service-role only table).

## 6. Fisio UX

In **Vinculación** the physio can share:

1. **Código**
2. **Enlace web** → `/unirse?code=…`
3. **Enlace WhatsApp** → `/unirse/whatsapp?code=…` → opens WhatsApp with the code prefilled

Patient finishes on WhatsApp → report appears on `/fisio` like any other consulta previa.
