import React, { useEffect, useRef } from "react";
import { Animated, type LayoutChangeEvent } from "react-native";

/**
 * Lightweight mount animation (opacity + slight rise) used for chat bubbles
 * and other elements that should feel alive without pulling in a full
 * animation library. Uses only React Native's core Animated API.
 */
export function FadeInView({
  children,
  style,
  duration = 220,
  onLayout,
}: {
  children: React.ReactNode;
  style?: object;
  duration?: number;
  onLayout?: (e: LayoutChangeEvent) => void;
}) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(6)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration,
        useNativeDriver: true,
      }),
    ]).start();
  }, [duration, opacity, translateY]);

  return (
    <Animated.View
      onLayout={onLayout}
      style={[style, { opacity, transform: [{ translateY }] }]}
    >
      {children}
    </Animated.View>
  );
}
