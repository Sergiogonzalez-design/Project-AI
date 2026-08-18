import { NavigationContainer } from "@react-navigation/native";
import { Session } from "@supabase/supabase-js";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Keyboard,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import { AppErrorBoundary } from "./src/components/AppErrorBoundary";
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

function hideNativeSplash() {
  SplashScreen.hideAsync().catch(() => {});
}

// Do not call preventAutoHideAsync — if JS/Auth hangs, iOS would keep the logo forever.
setTimeout(hideNativeSplash, 400);

/** Don't leave testers on an infinite spinner if Auth/network hangs. */
const SESSION_TIMEOUT_MS = 4_000;
const BOOT_TIMEOUT_MS = 5_000;

function withTimeout<T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> {
  return new Promise((resolve) => {
    const timer = setTimeout(() => resolve(fallback), ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      () => {
        clearTimeout(timer);
        resolve(fallback);
      }
    );
  });
}

function hideSplash() {
  hideNativeSplash();
}

function BootSplash() {
  return (
    <View style={styles.splash}>
      <Image
        source={require("./assets/logo.png")}
        style={styles.logo}
        resizeMode="contain"
        accessibilityLabel="AIKinora"
      />
      <ActivityIndicator size="large" color={Colors.primary} style={styles.spinner} />
      <Text style={styles.bootText}>Cargando…</Text>
    </View>
  );
}

function AppInner() {
  const { ready } = useI18n();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [authView, setAuthView] = useState<"login" | "signup">("login");
  const [onboardingDone, setOnboardingDone] = useState<boolean | null>(null);
  const [isPhysio, setIsPhysio] = useState(false);
  const onboardingCheckSeq = useRef(0);

  const isAdmin = isAdminEmail(session?.user?.email);
  const booting = !ready || loading || (session !== null && onboardingDone === null);

  useEffect(() => {
    hideSplash();
  }, []);

  const handleOnboardingComplete = useCallback(() => {
    onboardingCheckSeq.current += 1;
    setOnboardingDone(true);
  }, []);

  const checkOnboarding = useCallback(
    async (userId: string, email: string | undefined) => {
      const seq = ++onboardingCheckSeq.current;
      try {
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
        const { data } = await withTimeout(
          supabase.auth.getSession(),
          SESSION_TIMEOUT_MS,
          { data: { session: null }, error: null }
        );
        if (cancelled) return;
        setSession(data.session);
        if (data.session?.user) {
          void checkOnboarding(data.session.user.id, data.session.user.email);
        } else {
          setOnboardingDone(null);
        }
      } catch {
        if (!cancelled) {
          setSession(null);
          setOnboardingDone(null);
        }
      } finally {
        hideSplash();
        finishLoading();
      }
    };

    void boot();

    const timeout = setTimeout(() => {
      finishLoading();
      setOnboardingDone((done) => (done === null ? false : done));
    }, BOOT_TIMEOUT_MS);

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
        if (newSession?.user) {
          const { id, email } = newSession.user;
          setTimeout(() => {
            void checkOnboarding(id, email);
          }, 0);
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

  if (booting) {
    return <BootSplash />;
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
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <StatusBar style="dark" />
        <AppTabs
          key={`${isPhysio ? "physio" : "user"}-${isAdmin ? "admin" : ""}`}
          isAdmin={isAdmin}
          isPhysio={isPhysio}
        />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

function AppDisclaimer() {
  const insets = useSafeAreaInsets();
  const [keyboardOpen, setKeyboardOpen] = useState(false);

  useEffect(() => {
    const show = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      () => setKeyboardOpen(true)
    );
    const hide = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => setKeyboardOpen(false)
    );
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  if (keyboardOpen) return null;

  return (
    <View
      style={[
        styles.disclaimer,
        { paddingBottom: Math.max(insets.bottom, 8) },
      ]}
    >
      <Text style={styles.disclaimerText}>
        AIKinora es una IA orientativa: no sustituye el criterio clínico ni un
        diagnóstico médico presencial.
      </Text>
    </View>
  );
}

export default function App() {
  useEffect(() => {
    hideSplash();
  }, []);

  return (
    <SafeAreaProvider>
      <AppErrorBoundary>
        <I18nProvider>
          <View style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
              <AppInner />
            </View>
            <AppDisclaimer />
          </View>
        </I18nProvider>
      </AppErrorBoundary>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  logo: {
    width: 160,
    height: 64,
    marginBottom: 24,
  },
  spinner: {
    marginBottom: 12,
  },
  bootText: {
    fontSize: 15,
    color: Colors.textSecondary,
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
  disclaimer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.border,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 6,
  },
  disclaimerText: {
    fontSize: 11,
    lineHeight: 15,
    color: Colors.textLight,
  },
});
