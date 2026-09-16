/**
 * Upload public/physio/physio-avatar.png as the WhatsApp Business profile picture.
 *
 * Usage:
 *   WHATSAPP_TOKEN=... node scripts/set-whatsapp-physio-avatar.mjs
 *
 * Optional env:
 *   WHATSAPP_PHONE_NUMBER_ID (default: from env or test number)
 *   META_APP_ID (default: AIKinora app)
 */
import { readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";

const token = process.env.WHATSAPP_TOKEN?.trim();
const phoneNumberId =
  process.env.WHATSAPP_PHONE_NUMBER_ID?.trim() || "1375791535606539";
const appId = process.env.META_APP_ID?.trim() || "2156461741616743";
const imagePath = resolve(
  process.env.WHATSAPP_AVATAR_PATH || "public/physio/physio-avatar.png"
);

if (!token) {
  console.error("Missing WHATSAPP_TOKEN");
  process.exit(1);
}

const bytes = readFileSync(imagePath);
const fileLength = statSync(imagePath).size;
const fileName = imagePath.split(/[/\\]/).pop() || "physio-avatar.png";
const fileType = fileName.endsWith(".jpg") || fileName.endsWith(".jpeg")
  ? "image/jpeg"
  : "image/png";

console.log(`Uploading ${fileName} (${fileLength} bytes)…`);

const sessionRes = await fetch(
  `https://graph.facebook.com/v21.0/${appId}/uploads?file_name=${encodeURIComponent(
    fileName
  )}&file_length=${fileLength}&file_type=${encodeURIComponent(
    fileType
  )}&access_token=${encodeURIComponent(token)}`,
  { method: "POST" }
);
const sessionJson = await sessionRes.json();
if (!sessionRes.ok || !sessionJson.id) {
  console.error("Create upload session failed", sessionJson);
  process.exit(1);
}

const uploadId = String(sessionJson.id).replace(/^upload:/, "");
console.log(`Session: upload:${uploadId}`);

const uploadRes = await fetch(
  `https://graph.facebook.com/v21.0/upload:${uploadId}`,
  {
    method: "POST",
    headers: {
      Authorization: `OAuth ${token}`,
      file_offset: "0",
      "Content-Type": fileType,
    },
    body: bytes,
  }
);
const uploadJson = await uploadRes.json();
if (!uploadRes.ok || !uploadJson.h) {
  console.error("Upload bytes failed", uploadJson);
  process.exit(1);
}

const handle = uploadJson.h;
console.log("Handle OK, updating business profile…");

const profileRes = await fetch(
  `https://graph.facebook.com/v21.0/${phoneNumberId}/whatsapp_business_profile`,
  {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      about: "Physio · Consulta previa AIKinora",
      description:
        "Asistente de fisioterapia de AIKinora. Ayuda a completar la consulta previa para tu fisioterapeuta.",
      vertical: "HEALTH",
      profile_picture_handle: handle,
    }),
  }
);
const profileJson = await profileRes.json();
if (!profileRes.ok) {
  console.error("Update profile failed", profileJson);
  process.exit(1);
}

console.log("Profile updated:", JSON.stringify(profileJson));
