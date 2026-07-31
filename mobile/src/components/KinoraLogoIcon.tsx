import React from "react";
import { Image, StyleSheet, View } from "react-native";
import { brandName } from "../lib/brand";
import { Colors } from "../lib/colors";

const LOGO = require("../../assets/logo.png");

type Props = {
  size?: number;
  focused?: boolean;
};

export function KinoraLogoIcon({ size = 24, focused = false }: Props) {
  return (
    <View
      style={[
        styles.wrap,
        {
          width: size,
          height: size,
          borderRadius: Math.max(6, size * 0.22),
        },
        focused && styles.wrapFocused,
      ]}
    >
      <Image
        source={LOGO}
        style={{ width: size - 6, height: size - 6 }}
        resizeMode="contain"
        accessibilityLabel={brandName("es")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  wrapFocused: {
    borderColor: Colors.tabIconActive,
  },
});
