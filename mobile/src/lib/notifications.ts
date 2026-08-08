import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const NOTIFICATIONS_ENABLED_KEY = "AIKinora_notifications_enabled";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function getNotificationsEnabled(): Promise<boolean> {
  const value = await AsyncStorage.getItem(NOTIFICATIONS_ENABLED_KEY);
  return value === "1";
}

export async function setNotificationsEnabled(enabled: boolean): Promise<void> {
  await AsyncStorage.setItem(NOTIFICATIONS_ENABLED_KEY, enabled ? "1" : "0");
}

export async function ensureAndroidChannel(): Promise<void> {
  if (Platform.OS !== "android") return;
  await Notifications.setNotificationChannelAsync("AIKinora-reminders", {
    name: "AIKinora reminders",
    importance: Notifications.AndroidImportance.DEFAULT,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: "#2563EB",
  });
}

export async function requestNotificationPermissions(): Promise<boolean> {
  await ensureAndroidChannel();
  const current = await Notifications.getPermissionsAsync();
  if (current.granted || current.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL) {
    return true;
  }
  const asked = await Notifications.requestPermissionsAsync();
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
  await Notifications.cancelAllScheduledNotificationsAsync();
}

export async function scheduleReminders(
  reminders: ScheduledReminder[]
): Promise<number> {
  await ensureAndroidChannel();
  await cancelAllReminders();

  let scheduled = 0;
  const now = new Date();

  for (const reminder of reminders) {
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

    await Notifications.scheduleNotificationAsync({
      content: {
        title: reminder.title,
        body: reminder.body,
        sound: true,
        ...(Platform.OS === "android" ? { channelId: "AIKinora-reminders" } : null),
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: triggerDate,
      },
    });
    scheduled += 1;
  }

  return scheduled;
}
