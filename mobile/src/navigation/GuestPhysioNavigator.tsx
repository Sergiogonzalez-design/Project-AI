import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { GuestNameGate } from "../components/GuestNameGate";
import { Colors } from "../lib/colors";
import { guestNameStorageKey } from "../lib/guest-account";
import { useI18n } from "../lib/i18n";
import {
  getLinkedPhysioCache,
  setLinkedPhysioCache,
  type LinkedPhysioCache,
} from "../lib/linked-physio-cache";
import { screenHeaderTopInset } from "../lib/screen-header-insets";
import { supabase } from "../lib/supabase";
import { AIInquiriesScreen } from "../screens/AIInquiriesScreen";

type Props = {
  onCreateAccount: () => void;
  /** Instant exit to login (do not wait on network). */
  onExitToLogin: () => void;
};

const Tab = createBottomTabNavigator();

async function guestAlreadyNamed(userId: string): Promise<boolean> {
  try {
    const flag = await AsyncStorage.getItem(guestNameStorageKey(userId));
    if (flag === "1") return true;
  } catch {
    // fall through
  }
  const { data } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", userId)
    .maybeSingle();
  const name = (data?.display_name ?? "").trim();
  if (name.length >= 2) {
    try {
      await AsyncStorage.setItem(guestNameStorageKey(userId), "1");
    } catch {
      // ignore
    }
    return true;
  }
  return false;
}

/** Isolated navigator so the login screen never imports the heavy consult chat. */
export function GuestPhysioNavigator({ onCreateAccount, onExitToLogin }: Props) {
  const { t } = useI18n();
  const cached = getLinkedPhysioCache();
  const [linked, setLinked] = useState<LinkedPhysioCache | null>(
    cached?.physio_id ? cached : null
  );
  const [needsName, setNeedsName] = useState(true);
  const [loading, setLoading] = useState(!cached?.physio_id);
  const [menuOpen, setMenuOpen] = useState(false);
  const insets = useSafeAreaInsets();
  const { width: windowWidth } = useWindowDimensions();
  const drawerWidth = Math.min(280, windowWidth * 0.88);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user && !cancelled) {
          const named = await guestAlreadyNamed(user.id);
          if (!cancelled) setNeedsName(!named);
        }

        let next = getLinkedPhysioCache() ?? null;
        if (!next?.physio_id) {
          const { data } = await supabase.rpc("patient_get_linked_physio");
          const row = Array.isArray(data) ? data[0] : data;
          next = row?.physio_id ? (row as LinkedPhysioCache) : null;
          setLinkedPhysioCache(next);
        }
        if (!cancelled) {
          setLinked(next);
          setLoading(false);
        }
      } catch {
        if (!cancelled) {
          setLinked(null);
          setLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: Colors.background,
        }}
      >
        <ActivityIndicator color={Colors.primary} />
      </View>
    );
  }

  if (!linked) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
          backgroundColor: Colors.background,
        }}
      >
        <Text
          style={{
            textAlign: "center",
            color: Colors.textSecondary,
            marginBottom: 16,
            fontSize: 14,
            lineHeight: 20,
          }}
        >
          {t.guest.physioNotFound}
        </Text>
        <Pressable onPress={onExitToLogin}>
          <Text style={{ color: Colors.primary, fontWeight: "700" }}>
            {t.menu.backHome}
          </Text>
        </Pressable>
      </View>
    );
  }

  if (needsName) {
    return <GuestNameGate onSaved={() => setNeedsName(false)} onExit={onExitToLogin} />;
  }

  return (
    <>
      <Tab.Navigator
        screenOptions={{
          headerStatusBarHeight: insets.top,
          headerStyle: {
            backgroundColor: Colors.white,
            shadowColor: "transparent",
            elevation: 0,
            borderBottomWidth: 1,
            borderBottomColor: Colors.border,
          },
          headerTintColor: Colors.text,
          headerTitleStyle: {
            fontWeight: "700",
            fontSize: 17,
            letterSpacing: -0.3,
            color: Colors.text,
          },
          headerShadowVisible: false,
          headerLeft: () => (
            <Pressable
              onPress={onExitToLogin}
              style={{ marginLeft: 8, padding: 8 }}
              accessibilityLabel={t.menu.close}
            >
              <Ionicons name="close" size={22} color={Colors.text} />
            </Pressable>
          ),
          headerRight: () => (
            <Pressable
              onPress={() => setMenuOpen(true)}
              style={{ marginRight: 8, padding: 8 }}
              accessibilityLabel={t.menu.open}
            >
              <Ionicons name="menu" size={22} color={Colors.text} />
            </Pressable>
          ),
          tabBarStyle: { display: "none" },
        }}
      >
        <Tab.Screen name="GuestPhysio" options={{ title: t.headers.consultaPrevia }}>
          {() => (
            <AIInquiriesScreen
              linkedPhysio={linked}
              guestMode
              onCreateAccount={onCreateAccount}
            />
          )}
        </Tab.Screen>
      </Tab.Navigator>
      <Modal
        visible={menuOpen}
        animationType="fade"
        transparent
        onRequestClose={() => setMenuOpen(false)}
      >
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "flex-end",
            backgroundColor: "rgba(15, 23, 42, 0.4)",
          }}
        >
          <Pressable
            style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }}
            onPress={() => setMenuOpen(false)}
            accessibilityLabel={t.menu.close}
          />
          <View
            style={{
              height: "100%",
              width: drawerWidth,
              backgroundColor: "#FAFAFA",
              borderLeftWidth: 1,
              borderLeftColor: Colors.border,
              paddingHorizontal: 12,
              paddingTop: screenHeaderTopInset(insets),
              paddingBottom: insets.bottom + 12,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingHorizontal: 8,
                paddingBottom: 12,
                borderBottomWidth: 1,
                borderBottomColor: Colors.border,
                marginBottom: 8,
              }}
            >
              <Text style={{ fontSize: 15, fontWeight: "700", color: Colors.text }}>
                {t.menu.title}
              </Text>
              <Pressable onPress={() => setMenuOpen(false)} style={{ padding: 8 }}>
                <Ionicons name="close" size={22} color={Colors.text} />
              </Pressable>
            </View>
            <Pressable
              onPress={() => {
                setMenuOpen(false);
                onCreateAccount();
              }}
              style={{ borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14 }}
            >
              <Text style={{ fontSize: 15, fontWeight: "600", color: Colors.text }}>
                {t.menu.createAccount}
              </Text>
            </Pressable>
            <View style={{ flex: 1 }} />
            <Pressable
              onPress={() => {
                setMenuOpen(false);
                onExitToLogin();
              }}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                borderRadius: 14,
                paddingHorizontal: 16,
                paddingVertical: 14,
                borderTopWidth: 1,
                borderTopColor: Colors.border,
              }}
            >
              <Ionicons name="arrow-back" size={18} color={Colors.primary} />
              <Text style={{ fontSize: 15, fontWeight: "600", color: Colors.primary }}>
                {t.menu.backHome}
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
}
