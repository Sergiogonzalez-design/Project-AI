import * as SplashScreen from "expo-splash-screen";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Colors } from "../lib/colors";

type Props = { children: React.ReactNode };

type State = { error: Error | null };

/** Surfaces JS crashes instead of a blank white screen on device. */
export class AppErrorBoundary extends React.Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("[AIKinora boot error]", error, info.componentStack);
    SplashScreen.hideAsync().catch(() => {});
  }

  private retry = () => {
    this.setState({ error: null });
  };

  render() {
    if (this.state.error) {
      return (
        <View style={styles.root}>
          <ScrollView contentContainerStyle={styles.content}>
            <Text style={styles.title}>AIKinora no pudo iniciarse</Text>
            <Text style={styles.body}>
              Ha ocurrido un error al cargar la app. Cierra y vuelve a abrirla, o
              pulsa reintentar.
            </Text>
            <Text style={styles.detail} selectable>
              {this.state.error.message}
            </Text>
            <Pressable
              onPress={this.retry}
              style={({ pressed }) => [styles.btn, pressed && styles.btnPressed]}
            >
              <Text style={styles.btnLabel}>Reintentar</Text>
            </Pressable>
          </ScrollView>
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
    gap: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.text,
    textAlign: "center",
  },
  body: {
    fontSize: 15,
    lineHeight: 22,
    color: Colors.textSecondary,
    textAlign: "center",
  },
  detail: {
    fontSize: 12,
    lineHeight: 18,
    color: Colors.textLight,
    fontFamily: "monospace",
    marginTop: 8,
  },
  btn: {
    marginTop: 16,
    alignSelf: "center",
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  btnPressed: { opacity: 0.85 },
  btnLabel: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
