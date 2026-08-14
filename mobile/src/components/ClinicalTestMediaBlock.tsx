import { useEventListener } from "expo";
import { useVideoPlayer, VideoView } from "expo-video";
import React from "react";
import { StyleSheet, View } from "react-native";
import type { ClinicalTestImage } from "../lib/clinical-test-images";
import { getClinicalTestVideoSrc } from "../lib/clinical-test-videos";
import { Colors } from "../lib/colors";

function ClinicalTestVideoPlayer({ src, title }: { src: string; title: string }) {
  const player = useVideoPlayer({ uri: src }, (p) => {
    p.loop = false;
  });

  useEventListener(player, "statusChange", () => {});

  return (
    <VideoView
      player={player}
      style={styles.videoPlayer}
      nativeControls
      contentFit="contain"
      allowsFullscreen
      accessibilityLabel={`Vídeo demostrativo: ${title}`}
    />
  );
}

/** Demo video for a named clinical test (never a still image when a video exists). */
export function ClinicalTestMediaBlock({ test }: { test: ClinicalTestImage }) {
  const videoSrc = getClinicalTestVideoSrc(test.id);
  if (!videoSrc) return null;

  return (
    <View style={styles.videoWrap}>
      <ClinicalTestVideoPlayer src={videoSrc} title={test.title} />
    </View>
  );
}

const styles = StyleSheet.create({
  videoWrap: {
    marginTop: 8,
    width: "100%",
    maxWidth: 360,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: "#000",
  },
  videoPlayer: {
    width: "100%",
    aspectRatio: 16 / 9,
    backgroundColor: "#000",
  },
});
