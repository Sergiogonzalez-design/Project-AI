import { NavigationContainer } from "@react-navigation/native";
import { Session } from "@supabase/supabase-js";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { LoginScreen } from "./src/components/LoginScreen";
import { SignupScreen } from "./src/components/SignupScreen";
import { Colors } from "./src/lib/colors";
import { isSupabaseConfigured } from "./src/lib/supabase-config";
import { supabase } from "./src/lib/supabase";
import { AppTabs } from "./src/navigation/AppTabs";
import { OnboardingScreen } from "./src/screens/OnboardingScreen";

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [authView, setAuthView] = useState<"login" | "signup">("login");
  const [onboardingDone, setOnboardingDone] = useState<boolean | null>(null);

  const checkOnboarding = useCallback(async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("onboarding_completed")
      .eq("id", userId)
      .maybeSingle();
    setOnboardingDone(data?.onboarding_completed ?? false);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      setSession(data.session);
      if (data.session?.user) {
        await checkOnboarding(data.session.user.id);
      } else {
        setOnboardingDone(null);
      }
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        setSession(newSession);
        if (newSession?.user) {
          await checkOnboarding(newSession.user.id);
        } else {
          setOnboardingDone(null);
        }
      }
    );

    return () => listener.subscription.unsubscribe();
  }, [checkOnboarding]);

  if (loading || (session && onboardingDone === null)) {
    return (
      <View style={styles.splash}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!isSupabaseConfigured()) {
    return (
      <View style={styles.configError}>
        <Text style={styles.configTitle}>Supabase no configurado</Text>
        <Text style={styles.configBody}>
          Copia mobile/.env.example a mobile/.env y usa la misma URL y clave que la web
          (proyecto klxlzzgrymkexvuelzex).
        </Text>
      </View>
    );
  }

  if (!session) {
    return (
      <>
        <StatusBar style="dark" />
        {authView === "login" ? (
          <LoginScreen onSwitch={() => setAuthView("signup")} />
        ) : (
          <SignupScreen onSwitch={() => setAuthView("login")} />
        )}
      </>
    );
  }

  if (!onboardingDone) {
    return (
      <>
        <StatusBar style="dark" />
        <OnboardingScreen onComplete={() => setOnboardingDone(true)} />
      </>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <AppTabs />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  configError: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  configTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 8,
    textAlign: "center",
  },
  configBody: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
  },
});
