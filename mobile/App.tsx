import { NavigationContainer } from "@react-navigation/native";
import { Session } from "@supabase/supabase-js";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { LoginScreen } from "./src/components/LoginScreen";
import { SignupScreen } from "./src/components/SignupScreen";
import { Colors } from "./src/lib/colors";
import { I18nProvider, useI18n } from "./src/lib/i18n";
import { isAdminEmail, isSupabaseConfigured } from "./src/lib/supabase-config";
import { supabase } from "./src/lib/supabase";
import { AppTabs } from "./src/navigation/AppTabs";
import { OnboardingScreen } from "./src/screens/OnboardingScreen";
import { PhysioOnboardingScreen } from "./src/screens/PhysioOnboardingScreen";
import {
  ATHLETE_PROFILE_COLUMNS,
  isAthleteProfileComplete,
} from "./src/lib/athlete-profile-complete";
import {
  PHYSIO_PROFILE_COLUMNS,
  isPhysioProfileComplete,
} from "./src/lib/physio-profile-complete";

function AppInner() {
  const { ready } = useI18n();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [authView, setAuthView] = useState<"login" | "signup">("login");
  const [onboardingDone, setOnboardingDone] = useState<boolean | null>(null);
  const [isPhysio, setIsPhysio] = useState(false);

  const isAdmin = isAdminEmail(session?.user?.email);

  const checkOnboarding = useCallback(
    async (userId: string, email: string | undefined) => {
      // Admin uses the same login; skip athlete onboarding only for that account
      if (isAdminEmail(email)) {
        setIsPhysio(false);
        setOnboardingDone(true);
        return;
      }
      const { data: accountData } = await supabase
        .from("profiles")
        .select("account_type")
        .eq("id", userId)
        .maybeSingle();
      const physio = accountData?.account_type === "physio";
      setIsPhysio(physio);

      if (physio) {
        const { data } = await supabase
          .from("profiles")
          .select(PHYSIO_PROFILE_COLUMNS)
          .eq("id", userId)
          .maybeSingle();
        setOnboardingDone(isPhysioProfileComplete(data));
        return;
      }

      const { data } = await supabase
        .from("profiles")
        .select(ATHLETE_PROFILE_COLUMNS)
        .eq("id", userId)
        .maybeSingle();
      setOnboardingDone(isAthleteProfileComplete(data));
    },
    []
  );

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      setSession(data.session);
      if (data.session?.user) {
        await checkOnboarding(data.session.user.id, data.session.user.email);
      } else {
        setOnboardingDone(null);
      }
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        setSession(newSession);
        if (newSession?.user) {
          await checkOnboarding(newSession.user.id, newSession.user.email);
        } else {
          setOnboardingDone(null);
        }
      }
    );

    return () => listener.subscription.unsubscribe();
  }, [checkOnboarding]);

  if (!ready || loading || (session && onboardingDone === null)) {
    return (
      <View style={styles.splash}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!isSupabaseConfigured()) {
    return (
      <View style={styles.configError}>
        <Text style={styles.configTitle}>Supabase</Text>
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
        {isPhysio ? (
          <PhysioOnboardingScreen onComplete={() => setOnboardingDone(true)} />
        ) : (
          <OnboardingScreen onComplete={() => setOnboardingDone(true)} />
        )}
      </>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      {/* Remount tabs when admin/physio status changes so tabs never leak between roles */}
      <AppTabs
        key={isAdmin ? "admin" : isPhysio ? "physio" : "user"}
        isAdmin={isAdmin}
        isPhysio={isPhysio}
      />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <I18nProvider>
        <AppInner />
      </I18nProvider>
    </SafeAreaProvider>
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
