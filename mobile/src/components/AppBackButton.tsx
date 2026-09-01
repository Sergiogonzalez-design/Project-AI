import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import React from "react";
import { Pressable, StyleSheet } from "react-native";
import { Colors } from "../lib/colors";
import type { TabParamList } from "../navigation/AppTabs";

function getLandingRoute(
  navigation: BottomTabNavigationProp<TabParamList>
): keyof TabParamList {
  const names = navigation.getState()?.routeNames ?? [];
  if (names.includes("ClinicConsult")) return "ClinicConsult";
  if (names.includes("Patients")) return "Patients";
  if (names.includes("AIInquiries")) return "AIInquiries";
  if (names.includes("PhysioLink")) return "PhysioLink";
  if (names.includes("PhysioConsult")) return "PhysioConsult";
  if (names.includes("ClinicHome")) return "ClinicHome";
  return (names[0] as keyof TabParamList | undefined) ?? "Profile";
}

type Props = {
  onPress?: () => void;
};

/**
 * Header back for secondary tabs (About, Profile, Admin…).
 * Goes to the role landing tab. Hidden on the landing tab itself.
 * Prefer an explicit onPress when the screen owns nested navigation.
 */
export function AppBackButton({ onPress }: Props) {
  const navigation = useNavigation<BottomTabNavigationProp<TabParamList>>();
  const route = useRoute();
  const landingRoute = getLandingRoute(navigation);

  if (!onPress && route.name === landingRoute) {
    return null;
  }

  function handlePress() {
    if (onPress) {
      onPress();
      return;
    }
    if (route.name !== landingRoute) {
      navigation.navigate(landingRoute);
      return;
    }
    const parent = navigation.getParent();
    if (parent?.canGoBack()) {
      parent.goBack();
      return;
    }
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  }

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [styles.btn, pressed && styles.pressed]}
      accessibilityLabel="Volver"
      accessibilityRole="button"
      hitSlop={8}
    >
      <Ionicons name="arrow-back" size={22} color={Colors.text} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 4,
  },
  pressed: { opacity: 0.75 },
});
