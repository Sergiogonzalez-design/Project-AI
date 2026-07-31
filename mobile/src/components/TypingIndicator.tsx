import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";

const DOT_COLOR = "#60A5FA";
const BOUNCE_UP = -5;
const BOUNCE_DURATION = 180;
const CYCLE_MS = 600;

function TypingDot({ delay }: { delay: number }) {
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(translateY, {
          toValue: BOUNCE_UP,
          duration: BOUNCE_DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: BOUNCE_DURATION,
          useNativeDriver: true,
        }),
        Animated.delay(Math.max(0, CYCLE_MS - delay)),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [delay, translateY]);

  return (
    <Animated.View
      style={[styles.dot, { transform: [{ translateY }] }]}
    />
  );
}

export function TypingIndicator() {
  return (
    <View style={styles.row}>
      <TypingDot delay={0} />
      <TypingDot delay={150} />
      <TypingDot delay={300} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 2,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: DOT_COLOR,
  },
});
