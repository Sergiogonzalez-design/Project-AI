import { useEventListener } from "expo";
import { useVideoPlayer, VideoView } from "expo-video";
import React from "react";
import { Image, StyleSheet, View } from "react-native";
import type { ClinicalTestImage } from "../lib/clinical-test-images";
import { getClinicalTestVideoSrc } from "../lib/clinical-test-videos";
import { clinicalTestMediaUri } from "../lib/clinical-test-cdn";
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

/** Demo video when shipped; illustration otherwise. */
export function ClinicalTestMediaBlock({ test }: { test: ClinicalTestImage }) {
  const videoSrc = getClinicalTestVideoSrc(test.id);
  if (videoSrc) {
    return (
      <View style={styles.videoWrap}>
        <ClinicalTestVideoPlayer src={videoSrc} title={test.title} />
      </View>
    );
  }

  return (
    <View style={styles.imageWrap}>
      <Image
        source={{ uri: clinicalTestMediaUri(test.src) }}
        style={styles.image}
        accessibilityLabel={test.title}
      />
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
  imageWrap: {
    marginTop: 8,
    width: "100%",
    maxWidth: 360,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.background,
  },
  image: {
    width: "100%",
    aspectRatio: 4 / 3,
    backgroundColor: "#f5f5f5",
  },
});
