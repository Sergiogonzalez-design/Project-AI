import React from "react";
import { Image, StyleSheet, View, type ViewStyle } from "react-native";

type Props = {
  size?: number;
  style?: ViewStyle;
};

export function PhysioAvatar({ size = 36, style }: Props) {
  return (
    <View style={[styles.wrap, { width: size, height: size, borderRadius: size / 2 }, style]}>
      <Image
        source={require("../../assets/physio/physio-avatar.png")}
        style={{ width: size, height: size, borderRadius: size / 2 }}
        resizeMode="cover"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    overflow: "hidden",
    marginRight: 8,
    backgroundColor: "#EFF6FF",
    flexShrink: 0,
  },
});
