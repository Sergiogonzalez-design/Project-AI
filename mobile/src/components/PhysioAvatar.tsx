import React from "react";
import {
  Image,
  StyleSheet,
  View,
  type ImageSourcePropType,
  type ViewStyle,
} from "react-native";

type Props = {
  size?: number;
  style?: ViewStyle;
};

const PHYSIO_AVATAR: ImageSourcePropType = require("../../assets/physio/physio-avatar.png");

/** Warm the decode cache as soon as this module loads (before any modal opens). */
const resolved = Image.resolveAssetSource(PHYSIO_AVATAR);
if (resolved?.uri) {
  void Image.prefetch(resolved.uri).catch(() => {
    /* ignore — local asset still renders */
  });
}

/**
 * Source art is slightly left-weighted; scale up and nudge right so the face
 * sits in the middle of the circular crop.
 */
const CROP_SCALE = 1.22;
const CROP_SHIFT_X = 0.1;

export function PhysioAvatar({ size = 36, style }: Props) {
  const imgSize = size * CROP_SCALE;
  return (
    <View style={[styles.wrap, { width: size, height: size, borderRadius: size / 2 }, style]}>
      <Image
        source={PHYSIO_AVATAR}
        style={{
          width: imgSize,
          height: imgSize,
          position: "absolute",
          left: (size - imgSize) / 2 + size * CROP_SHIFT_X,
          top: (size - imgSize) / 2,
        }}
        resizeMode="cover"
        fadeDuration={0}
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
