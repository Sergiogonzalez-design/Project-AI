import React from "react";
import {
  Keyboard,
  Pressable,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from "react-native";

type Props = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

/** Tap empty space to dismiss the keyboard without blocking child presses. */
export function DismissKeyboard({ children, style }: Props) {
  return (
    <Pressable
      style={[styles.fill, style]}
      onPress={Keyboard.dismiss}
      accessible={false}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
});
