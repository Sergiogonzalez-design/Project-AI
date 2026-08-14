import { NavigationContainer } from "@react-navigation/native";
import { Session } from "@supabase/supabase-js";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useEffect, useRef, useState } from "react";
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

/** Don't leave testers on an infinite splash if Auth/network hangs. */
const BOOT_TIMEOUT_MS = 12_000;

function AppInner() {
  const { ready } = useI18n();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [authView, setAuthView] = useState<"login" | "signup">("login");
  const [onboardingDone, setOnboardingDone] = useState<boolean | null>(null);
  const [isPhysio, setIsPhysio] = useState(false);
  /** Ignore stale profile checks that finish after the user already completed onboarding. */
  const onboardingCheckSeq = useRef(0);

  const isAdmin = isAdminEmail(session?.user?.email);

  const handleOnboardingComplete = useCallback(() => {
    onboardingCheckSeq.current += 1;
    setOnboardingDone(true);
  }, []);

  const checkOnboarding = useCallback(
    async (userId: string, email: string | undefined) => {
      const seq = ++onboardingCheckSeq.current;
      try {
        // Admin uses the same login; skip athlete onboarding only for that account
        if (isAdminEmail(email)) {
          if (seq !== onboardingCheckSeq.current) return;
          setIsPhysio(false);
          setOnboardingDone(true);
          return;
        }
        const { data: profile } = await supabase
          .from("profiles")
          .select(`account_type, ${PHYSIO_PROFILE_COLUMNS}, ${ATHLETE_PROFILE_COLUMNS}`)
          .eq("id", userId)
          .maybeSingle();
        if (seq !== onboardingCheckSeq.current) return;

        const physio = profile?.account_type === "physio";
        setIsPhysio(physio);
        setOnboardingDone(
          physio ? isPhysioProfileComplete(profile) : isAthleteProfileComplete(profile)
        );
      } catch {
        if (seq !== onboardingCheckSeq.current) return;
        // Fail open to login/main flow rather than an endless spinner.
        setIsPhysio(false);
        setOnboardingDone(false);
      }
    },
    []
  );

  useEffect(() => {
    let cancelled = false;

    const finishLoading = () => {
      if (!cancelled) setLoading(false);
    };

    const boot = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (cancelled) return;
        setSession(data.session);
        if (data.session?.user) {
          await checkOnboarding(data.session.user.id, data.session.user.email);
        } else {
          setOnboardingDone(null);
        }
      } catch {
        if (!cancelled) {
          setSession(null);
          setOnboardingDone(null);
        }
      } finally {
        finishLoading();
      }
    };

    void boot();

    const timeout = setTimeout(() => {
      // Network/Auth/profile stall — leave splash instead of spinning forever.
      finishLoading();
      setOnboardingDone((done) => (done === null ? false : done));
    }, BOOT_TIMEOUT_MS);

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

    return () => {
      cancelled = true;
      clearTimeout(timeout);
      listener.subscription.unsubscribe();
    };
  }, [checkOnboarding]);

  if (!isSupabaseConfigured()) {
    return (
      <View style={styles.configError}>
        <Text style={styles.configTitle}>Supabase</Text>
        <Text style={styles.configBody}>
          Falta la configuración de Supabase en esta build. Vuelve a generar la
          app con EXPO_PUBLIC_SUPABASE_URL y la clave del proyecto.
        </Text>
      </View>
    );
  }

  if (!ready || loading || (session && onboardingDone === null)) {
    return (
      <View style={styles.splash}>
        <ActivityIndicator size="large" color={Colors.primary} />
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
          <PhysioOnboardingScreen onComplete={handleOnboardingComplete} />
        ) : (
          <OnboardingScreen onComplete={handleOnboardingComplete} />
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
        <View style={{ flex: 1 }}>
          <View style={{ flex: 1 }}>
            <AppInner />
          </View>
          <View
            style={{
              borderTopWidth: StyleSheet.hairlineWidth,
              borderTopColor: Colors.border,
              backgroundColor: "#fff",
              paddingHorizontal: 16,
              paddingVertical: 8,
            }}
          >
            <Text style={{ fontSize: 11, lineHeight: 15, color: Colors.textLight }}>
              AIKinora es una IA orientativa: no sustituye el criterio clínico ni un
              diagnóstico médico presencial.
            </Text>
          </View>
        </View>
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
