import React from "react";
import { View, type LayoutChangeEvent, type StyleProp, type ViewStyle } from "react-native";

/**
 * Stable wrapper for chat bubbles / list rows.
 * Intentionally no opacity/translate mount animation — those made text and
 * buttons slide on every remount when switching screens or phases.
 */
export function FadeInView({
  children,
  style,
  duration: _duration = 0,
  onLayout,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  duration?: number;
  onLayout?: (e: LayoutChangeEvent) => void;
}) {
  return (
    <View onLayout={onLayout} style={style}>
      {children}
    </View>
  );
}
