import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { buildPhysioNotificationContent } from "./physio-notification-content";

const NOTIFICATIONS_ENABLED_KEY = "AIKinora_notifications_enabled";
export const REMINDERS_CHANNEL_ID = "AIKinora-reminders";

let handlerConfigured = false;

/** Defer until first use so a bad native module init cannot white-screen the app. */
export function ensureNotificationHandler(): void {
  if (handlerConfigured) return;
  handlerConfigured = true;
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

export async function getNotificationsEnabled(): Promise<boolean> {
  ensureNotificationHandler();
  const value = await AsyncStorage.getItem(NOTIFICATIONS_ENABLED_KEY);
  return value === "1";
}

export async function setNotificationsEnabled(enabled: boolean): Promise<void> {
  await AsyncStorage.setItem(NOTIFICATIONS_ENABLED_KEY, enabled ? "1" : "0");
}

export async function ensureAndroidChannel(): Promise<void> {
  if (Platform.OS !== "android") return;
  await Notifications.setNotificationChannelAsync(REMINDERS_CHANNEL_ID, {
    name: "Physio · AIKinora",
    description: "Recovery reminders from Physio",
    importance: Notifications.AndroidImportance.HIGH,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: "#2563EB",
    sound: "default",
  });
}

export async function requestNotificationPermissions(): Promise<boolean> {
  ensureNotificationHandler();
  await ensureAndroidChannel();
  const current = await Notifications.getPermissionsAsync();
  if (current.granted || current.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL) {
    return true;
  }
  const asked = await Notifications.requestPermissionsAsync({
    ios: {
      allowAlert: true,
      allowBadge: false,
      allowSound: true,
    },
  });
  return (
    asked.granted ||
    asked.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL
  );
}

export type ScheduledReminder = {
  title: string;
  body: string;
  /** Days from now (0 = today if hour still ahead, else tomorrow) */
  dayOffset: number;
  hour: number;
  minute?: number;
  /** If set, overrides dayOffset/hour and schedules exactly this many hours from now */
  hoursFromNow?: number;
};

export async function cancelAllReminders(): Promise<void> {
  ensureNotificationHandler();
  await Notifications.cancelAllScheduledNotificationsAsync();
}

export async function scheduleReminders(
  reminders: ScheduledReminder[]
): Promise<number> {
  ensureNotificationHandler();
  await ensureAndroidChannel();
  await cancelAllReminders();

  let scheduled = 0;
  const now = new Date();

  for (let index = 0; index < reminders.length; index += 1) {
    const reminder = reminders[index];
    let triggerDate: Date;
    if (reminder.hoursFromNow != null && reminder.hoursFromNow > 0) {
      triggerDate = new Date(now.getTime() + reminder.hoursFromNow * 60 * 60 * 1000);
    } else {
      triggerDate = new Date(now);
      triggerDate.setDate(triggerDate.getDate() + reminder.dayOffset);
      triggerDate.setHours(reminder.hour, reminder.minute ?? 0, 0, 0);
      if (triggerDate.getTime() <= now.getTime()) {
        triggerDate.setDate(triggerDate.getDate() + 1);
      }
    }

    const content = await buildPhysioNotificationContent(reminder.title, reminder.body);

    await Notifications.scheduleNotificationAsync({
      identifier: `physio-reminder-${index}`,
      content,
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: triggerDate,
        channelId: REMINDERS_CHANNEL_ID,
      },
    });
    scheduled += 1;
  }

  return scheduled;
}

/** Fire one Physio-branded notification immediately (e.g. sanity check in dev). */
export async function presentPhysioNotification(
  headline: string,
  detail: string
): Promise<void> {
  ensureNotificationHandler();
  await ensureAndroidChannel();
  const content = await buildPhysioNotificationContent(headline, detail);
  await Notifications.scheduleNotificationAsync({
    content,
    trigger: null,
  });
}
