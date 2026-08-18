import React from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

type Props = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

/**
 * Layout wrapper only. A full-screen Pressable here steals taps from
 * buttons on Android / Expo Go. Screens already dismiss the keyboard
 * with keyboardShouldPersistTaps + keyboardDismissMode on ScrollView.
 */
export function DismissKeyboard({ children, style }: Props) {
  return <View style={[styles.fill, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
});
