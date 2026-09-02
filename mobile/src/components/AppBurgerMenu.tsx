import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import React, { useMemo, useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "../lib/colors";
import { screenHeaderTopInset } from "../lib/screen-header-insets";
import { useI18n } from "../lib/i18n";
import { supabase } from "../lib/supabase";
import { cancelAllReminders } from "../lib/notifications";
import type { TabParamList } from "../navigation/AppTabs";

type MenuItem = {
  route: keyof TabParamList;
  label: string;
};

type Props = {
  isPhysio?: boolean;
  isClinic?: boolean;
  isAdmin?: boolean;
};

export function AppBurgerMenu({
  isPhysio: isPhysioProp,
  isClinic: isClinicProp,
  isAdmin: isAdminProp,
}: Props) {
  const { t } = useI18n();
  const navigation = useNavigation<BottomTabNavigationProp<TabParamList>>();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const routeNames = navigation.getState()?.routeNames ?? [];
  const isPhysio = isPhysioProp ?? routeNames.includes("Patients");
  const isClinic = isClinicProp ?? routeNames.includes("ClinicHome");
  const isAdmin = isAdminProp ?? routeNames.includes("Admin");
  const { width: windowWidth } = useWindowDimensions();
  const [open, setOpen] = useState(false);
  const drawerWidth = Math.min(280, windowWidth * 0.88);

  const items = useMemo<MenuItem[]>(() => {
    const primary: MenuItem[] = isClinic
      ? [
          { route: "ClinicConsult", label: t.headers.consulta },
          { route: "ClinicHome", label: t.headers.clinica },
          { route: "ClinicSearch", label: t.headers.buscar },
        ]
      : isPhysio
      ? [
          { route: "Patients", label: t.headers.clinica },
          { route: "PhysioConsult", label: t.headers.consulta },
          { route: "ClinicSearch", label: t.headers.buscar },
        ]
      : [
          { route: "AIInquiries", label: t.headers.consulta },
          { route: "PhysioLink", label: t.headers.fisioterapia },
          { route: "ClinicSearch", label: t.headers.buscar },
        ];
    return [
      ...primary,
      { route: "AboutUs", label: t.headers.sobreNosotros },
      { route: "Profile", label: t.headers.perfil },
      ...(isAdmin ? [{ route: "Admin" as const, label: t.headers.admin }] : []),
    ];
  }, [isPhysio, isClinic, isAdmin, t]);

  function navigateTo(target: keyof TabParamList) {
    setOpen(false);
    const names = navigation.getState()?.routeNames ?? [];
    if (!names.includes(target)) return;
    navigation.navigate(target);
  }

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        style={({ pressed }) => [styles.iconBtn, pressed && styles.iconBtnPressed]}
        accessibilityLabel={t.menu.open}
        accessibilityRole="button"
      >
        <Ionicons name="menu" size={22} color={Colors.text} />
      </Pressable>

      <Modal
        visible={open}
        animationType="fade"
        transparent
        onRequestClose={() => setOpen(false)}
      >
        <View style={styles.overlay}>
          <Pressable
            style={styles.backdrop}
            onPress={() => setOpen(false)}
            accessibilityLabel={t.menu.close}
          />
          <View
            style={[
              styles.drawer,
              {
                width: drawerWidth,
                paddingTop: screenHeaderTopInset(insets),
                paddingBottom: insets.bottom + 12,
              },
            ]}
          >
            <View style={styles.drawerHeader}>
              <Text style={styles.drawerTitle}>{t.menu.title}</Text>
              <Pressable
                onPress={() => setOpen(false)}
                style={({ pressed }) => [styles.closeBtn, pressed && styles.iconBtnPressed]}
                accessibilityLabel={t.menu.close}
              >
                <Ionicons name="close" size={22} color={Colors.text} />
              </Pressable>
            </View>

            <View style={styles.menuList}>
              {items.map((item) => {
                const active = route.name === item.route;
                return (
                  <Pressable
                    key={item.route}
                    onPress={() => navigateTo(item.route)}
                    style={({ pressed }) => [
                      styles.menuItem,
                      active && styles.menuItemActive,
                      pressed && styles.menuItemPressed,
                    ]}
                  >
                    <Text style={[styles.menuItemText, active && styles.menuItemTextActive]}>
                      {item.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <View style={{ flex: 1 }} />

            <Pressable
              onPress={() => {
                setOpen(false);
                Alert.alert(t.profile.signOutTitle, t.profile.signOutConfirm, [
                  { text: t.profile.cancel, style: "cancel" },
                  {
                    text: t.profile.signOut,
                    style: "destructive",
                    onPress: async () => {
                      await cancelAllReminders();
                      await Promise.race([
                        supabase.auth.signOut({ scope: "local" }),
                        new Promise((r) => setTimeout(r, 1500)),
                      ]);
                    },
                  },
                ]);
              }}
              style={({ pressed }) => [styles.signOutItem, pressed && { opacity: 0.8 }]}
            >
              <Ionicons name="log-out-outline" size={18} color={Colors.danger} />
              <Text style={styles.signOutText}>{t.profile.signOut}</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 4,
  },
  iconBtnPressed: { opacity: 0.75 },
  overlay: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    backgroundColor: "rgba(15, 23, 42, 0.4)",
  },
  backdrop: { ...StyleSheet.absoluteFillObject },
  drawer: {
    height: "100%",
    backgroundColor: "#FAFAFA",
    borderLeftWidth: 1,
    borderLeftColor: Colors.border,
    paddingHorizontal: 12,
    shadowColor: "#0F172A",
    shadowOffset: { width: -4, height: 0 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 12,
  },
  drawerHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
    marginBottom: 8,
  },
  drawerTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.text,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  signOutItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.border,
    marginTop: 8,
  },
  signOutText: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.danger,
  },
  menuList: { gap: 4, paddingTop: 4 },
  menuItem: {
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  menuItemActive: {
    backgroundColor: Colors.primarySoft,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
  },
  menuItemPressed: { opacity: 0.9 },
  menuItemText: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.text,
  },
  menuItemTextActive: {
    color: Colors.primary,
    fontWeight: "700",
  },
});
