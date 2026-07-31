import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { Colors } from "../lib/colors";
import { supabase } from "../lib/supabase";

const SIZE = 26;

type Props = {
  focused: boolean;
};

export function ProfileTabIcon({ focused }: Props) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [initials, setInitials] = useState("U");

  useEffect(() => {
    let mounted = true;

    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user || !mounted) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("avatar_url, display_name")
        .eq("id", user.id)
        .single();

      if (!mounted) return;

      setAvatarUrl(profile?.avatar_url ?? null);

      const label = profile?.display_name ?? user.email ?? "";
      const nextInitials = label
        .split(" ")
        .filter(Boolean)
        .map((part: string) => part[0]?.toUpperCase())
        .join("")
        .slice(0, 2);

      setInitials(nextInitials || "U");
    }

    void load();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <View style={[styles.wrap, focused && styles.wrapFocused]}>
      {avatarUrl ? (
        <Image source={{ uri: avatarUrl }} style={styles.image} />
      ) : (
        <View style={styles.fallback}>
          <Text style={styles.initials}>{initials}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    overflow: "hidden",
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  wrapFocused: {
    borderColor: Colors.tabIconActive,
  },
  image: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    backgroundColor: Colors.primaryLight,
  },
  fallback: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  initials: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: "700",
  },
});
