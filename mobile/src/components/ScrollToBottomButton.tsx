import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet } from "react-native";
import { Colors } from "../lib/colors";

type Props = {
  visible: boolean;
  onPress: () => void;
};

export function ScrollToBottomButton({ visible, onPress }: Props) {
  if (!visible) return null;

  return (
    <Pressable
      style={({ pressed }) => [styles.btn, pressed && styles.btnPressed]}
      onPress={onPress}
      accessibilityLabel="Ir al final de la respuesta"
    >
      <Ionicons name="chevron-down" size={20} color={Colors.textSecondary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    position: "absolute",
    bottom: 12,
    alignSelf: "center",
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 10,
  },
  btnPressed: {
    backgroundColor: Colors.primaryLight,
  },
});
