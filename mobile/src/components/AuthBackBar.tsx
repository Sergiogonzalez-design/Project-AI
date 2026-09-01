import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "../lib/colors";
import { screenHeaderTopInset } from "../lib/screen-header-insets";

type Props = {
  onPress: () => void;
};

/** Top back control for auth and onboarding flows (no tab navigator). */
export function AuthBackBar({ onPress }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrap, { paddingTop: screenHeaderTopInset(insets) }]}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.btn, pressed && styles.pressed]}
        accessibilityLabel="Volver"
        accessibilityRole="button"
        hitSlop={8}
      >
        <Ionicons name="arrow-back" size={22} color={Colors.text} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    zIndex: 10,
    paddingHorizontal: 8,
  },
  btn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: { opacity: 0.75 },
});
