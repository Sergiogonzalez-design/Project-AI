import { Ionicons } from "@expo/vector-icons";
import { useEventListener } from "expo";
import { useVideoPlayer, VideoView } from "expo-video";
import React, { useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { clinicalTestMediaUri } from "../lib/clinical-test-cdn";
import type { ClinicalTestImage } from "../lib/clinical-test-images";
import { getClinicalTestVideoSrc } from "../lib/clinical-test-videos";
import { Colors } from "../lib/colors";
import { useI18n } from "../lib/i18n";

function ClinicalTestVideoPlayer({ src, title }: { src: string; title: string }) {
  const { t } = useI18n();
  const insets = useSafeAreaInsets();
  const [fullscreen, setFullscreen] = useState(false);
  const player = useVideoPlayer({ uri: src }, (p) => {
    p.loop = false;
  });

  useEventListener(player, "statusChange", () => {});

  const video = (
    <VideoView
      player={player}
      style={fullscreen ? styles.videoFullscreen : styles.videoPlayer}
      nativeControls
      contentFit="contain"
      allowsFullscreen
      accessibilityLabel={`Vídeo demostrativo: ${title}`}
    />
  );

  return (
    <>
      <View style={styles.videoInner}>
        {fullscreen ? <View style={styles.videoPlayer} /> : video}
        <Pressable
          onPress={() => setFullscreen(true)}
          style={styles.expandBtn}
          accessibilityLabel={t.consulta.fullscreen}
        >
          <Ionicons name="expand-outline" size={16} color="#fff" />
          <Text style={styles.expandBtnText}>{t.consulta.fullscreen}</Text>
        </Pressable>
      </View>
      {fullscreen ? (
        <Modal
          visible
          animationType="fade"
          supportedOrientations={["portrait", "landscape"]}
          onRequestClose={() => setFullscreen(false)}
        >
          <View style={styles.fullscreenRoot}>
            {video}
            <Pressable
              onPress={() => setFullscreen(false)}
              style={[styles.closeFsBtn, { top: Math.max(insets.top, 12) }]}
              accessibilityLabel={t.consulta.exitFullscreen}
            >
              <Ionicons name="close" size={22} color="#fff" />
            </Pressable>
          </View>
        </Modal>
      ) : null}
    </>
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
    maxWidth: "100%",
    alignSelf: "stretch",
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: "#000",
  },
  videoInner: { position: "relative" },
  videoPlayer: {
    width: "100%",
    aspectRatio: 16 / 9,
    backgroundColor: "#000",
  },
  videoFullscreen: {
    flex: 1,
    width: "100%",
    backgroundColor: "#000",
  },
  expandBtn: {
    position: "absolute",
    right: 8,
    bottom: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(15,23,42,0.78)",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  expandBtnText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
  fullscreenRoot: {
    flex: 1,
    backgroundColor: "#000",
  },
  closeFsBtn: {
    position: "absolute",
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(15,23,42,0.65)",
    alignItems: "center",
    justifyContent: "center",
  },
  imageWrap: {
    marginTop: 8,
    width: "100%",
    maxWidth: "100%",
    alignSelf: "stretch",
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
