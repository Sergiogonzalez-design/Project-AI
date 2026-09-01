import { Asset } from "expo-asset";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import type { NotificationContentAttachmentIos } from "expo-notifications";

export const PHYSIO_SENDER_NAME = "Physio";
export const PHYSIO_THREAD_ID = "physio-chat";

let cachedAvatarAttachment: NotificationContentAttachmentIos | null | undefined;

/** Merge reminder headline + detail into one chat-style message body. */
export function formatPhysioNotificationBody(headline: string, detail: string): string {
  const h = headline.trim();
  const d = detail.trim();
  if (!h) return d;
  if (!d) return h;
  if (d.startsWith(h)) return d;
  return `${h}\n${d}`;
}

async function resolvePhysioAvatarAttachment(): Promise<NotificationContentAttachmentIos | null> {
  if (Platform.OS !== "ios") return null;
  if (cachedAvatarAttachment !== undefined) return cachedAvatarAttachment;
  try {
    const asset = Asset.fromModule(require("../../assets/physio/physio-avatar.png"));
    await asset.downloadAsync();
    const url = asset.localUri ?? asset.uri;
    if (!url) {
      cachedAvatarAttachment = null;
      return null;
    }
    cachedAvatarAttachment = {
      identifier: "physio-avatar",
      url,
      type: "image/png",
    };
    return cachedAvatarAttachment;
  } catch {
    cachedAvatarAttachment = null;
    return null;
  }
}

/** Notification payload styled as Physio speaking to the user. */
export async function buildPhysioNotificationContent(
  headline: string,
  detail: string
): Promise<Notifications.NotificationContentInput> {
  const body = formatPhysioNotificationBody(headline, detail);
  const attachment = await resolvePhysioAvatarAttachment();

  return {
    title: PHYSIO_SENDER_NAME,
    body,
    subtitle: "AIKinora",
    sound: true,
    ...(attachment ? { attachments: [attachment] } : {}),
    data: { kind: "physio-reminder" },
    ...(Platform.OS === "android"
      ? {
          priority: Notifications.AndroidNotificationPriority.HIGH,
          color: "#2563EB",
        }
      : {}),
  };
}
