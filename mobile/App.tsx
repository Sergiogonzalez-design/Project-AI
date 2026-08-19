import { NavigationContainer } from "@react-navigation/native";
import { Session } from "@supabase/supabase-js";
import { StatusBar } from "expo-status-bar";
import React, { Suspense, useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
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
import { Colors } from "./src/lib/colors";
import { isGuestEmail, isGuestUser } from "./src/lib/guest-account";
import { hideNativeSplash, startSplashHideWatchdog } from "./src/lib/hide-splash";
import { I18nProvider } from "./src/lib/i18n";
import { isAdminEmail, isSupabaseConfigured } from "./src/lib/supabase-config";
import { supabase } from "./src/lib/supabase";
import {
  ATHLETE_PROFILE_COLUMNS,
  isAthleteProfileComplete,
} from "./src/lib/athlete-profile-complete";
import {
  PHYSIO_PROFILE_COLUMNS,
  isPhysioProfileComplete,
} from "./src/lib/physio-profile-complete";

const SESSION_TIMEOUT_MS = 2_500;
const PROFILE_TIMEOUT_MS = 2_500;

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

const AppTabs = React.lazy(() =>
  import("./src/navigation/AppTabs").then((mod) => ({ default: mod.AppTabs }))
);

const GuestPhysioNavigator = React.lazy(() =>
  import("./src/navigation/GuestPhysioNavigator").then((mod) => ({
    default: mod.GuestPhysioNavigator,
  }))
);

// Signup/onboarding pull @expo/vector-icons → expo-font → native ExpoFontLoader.
// Keep them off the first require("./App") path so login can paint even if fonts fail.
const SignupScreen = React.lazy(() =>
  import("./src/components/SignupScreen").then((mod) => ({
    default: mod.SignupScreen,
  }))
);

const OnboardingScreen = React.lazy(() =>
  import("./src/screens/OnboardingScreen").then((mod) => ({
    default: mod.OnboardingScreen,
  }))
);

const PhysioOnboardingScreen = React.lazy(() =>
  import("./src/screens/PhysioOnboardingScreen").then((mod) => ({
    default: mod.PhysioOnboardingScreen,
  }))
);

function TabsFallback() {
  return (
    <View style={styles.loading}>
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  );
}

function AppInner() {
  const [session, setSession] = useState<Session | null>(null);
  const [authView, setAuthView] = useState<"login" | "signup">("login");
  const [onboardingDone, setOnboardingDone] = useState(false);
  const [isPhysio, setIsPhysio] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [guestSignup, setGuestSignup] = useState(false);
  const onboardingCheckSeq = useRef(0);

  const isAdmin = isAdminEmail(session?.user?.email);

  useEffect(() => {
    return startSplashHideWatchdog();
  }, []);

  const handleOnboardingComplete = useCallback(() => {
    onboardingCheckSeq.current += 1;
    setOnboardingDone(true);
  }, []);

  const checkOnboarding = useCallback(
    async (userId: string, email: string | undefined) => {
      const seq = ++onboardingCheckSeq.current;
      try {
        if (isAdminEmail(email) || isGuestEmail(email)) {
          if (seq !== onboardingCheckSeq.current) return;
          setIsPhysio(false);
          setOnboardingDone(true);
          return;
        }
        const { data: profile } = await withTimeout(
          supabase
            .from("profiles")
            .select(`account_type, ${PHYSIO_PROFILE_COLUMNS}, ${ATHLETE_PROFILE_COLUMNS}`)
            .eq("id", userId)
            .maybeSingle(),
          PROFILE_TIMEOUT_MS,
          { data: null, error: null }
        );
        if (seq !== onboardingCheckSeq.current) return;

        if (!profile) {
          // Fail open so a hung profiles query cannot pin the launch screen.
          setIsPhysio(false);
          setOnboardingDone(true);
          return;
        }

        const physio = profile.account_type === "physio";
        setIsPhysio(physio);
        setOnboardingDone(
          physio ? isPhysioProfileComplete(profile) : isAthleteProfileComplete(profile)
        );
      } catch {
        if (seq !== onboardingCheckSeq.current) return;
        setIsPhysio(false);
        setOnboardingDone(true);
      }
    },
    []
  );

  useEffect(() => {
    let cancelled = false;

    const boot = async () => {
      try {
        const { data } = await withTimeout(
          supabase.auth.getSession(),
          SESSION_TIMEOUT_MS,
          { data: { session: null }, error: null }
        );
        if (cancelled) return;
        setSession(data.session);
        setIsGuest(isGuestUser(data.session?.user));
        if (data.session?.user) {
          void checkOnboarding(data.session.user.id, data.session.user.email);
        }
      } catch {
        if (!cancelled) setSession(null);
      } finally {
        hideNativeSplash();
      }
    };

    void boot();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
        if (!newSession) setAuthView("login");
        setIsGuest(isGuestUser(newSession?.user));
        if (newSession?.user) {
          if (!isGuestUser(newSession.user)) setGuestSignup(false);
          const { id, email } = newSession.user;
          setTimeout(() => {
            void checkOnboarding(id, email);
          }, 0);
        } else {
          setOnboardingDone(false);
          setIsPhysio(false);
          setIsGuest(false);
          setGuestSignup(false);
        }
      }
    );

    return () => {
      cancelled = true;
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

  if (!session) {
    return (
      <>
        <StatusBar style="dark" />
        {authView === "login" ? (
          <LoginScreen onSwitch={() => setAuthView("signup")} />
        ) : (
          <Suspense fallback={<TabsFallback />}>
            <SignupScreen onSwitch={() => setAuthView("login")} />
          </Suspense>
        )}
      </>
    );
  }

  if (isGuest && guestSignup) {
    return (
      <>
        <StatusBar style="dark" />
        <Suspense fallback={<TabsFallback />}>
          <SignupScreen onSwitch={() => setGuestSignup(false)} />
        </Suspense>
      </>
    );
  }

  if (isGuest) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NavigationContainer>
          <StatusBar style="dark" />
          <Suspense fallback={<TabsFallback />}>
            <GuestPhysioNavigator onCreateAccount={() => setGuestSignup(true)} />
          </Suspense>
        </NavigationContainer>
      </GestureHandlerRootView>
    );
  }

  if (!onboardingDone) {
    return (
      <>
        <StatusBar style="dark" />
        <Suspense fallback={<TabsFallback />}>
          {isPhysio ? (
            <PhysioOnboardingScreen onComplete={handleOnboardingComplete} />
          ) : (
            <OnboardingScreen onComplete={handleOnboardingComplete} />
          )}
        </Suspense>
      </>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <StatusBar style="dark" />
        <Suspense fallback={<TabsFallback />}>
          <AppTabs
            key={`${isPhysio ? "physio" : "user"}-${isAdmin ? "admin" : ""}`}
            isAdmin={isAdmin}
            isPhysio={isPhysio}
          />
        </Suspense>
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

  if (keyboardOpen) {
    return (
      <View
        style={[
          styles.disclaimer,
          { paddingBottom: Math.max(insets.bottom, 8), opacity: 0 },
        ]}
        pointerEvents="none"
        accessibilityElementsHidden
      >
        <Text style={styles.disclaimerText}>
          AIKinora es una IA orientativa: no sustituye el criterio clínico ni un
          diagnóstico médico presencial.
        </Text>
      </View>
    );
  }

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
    return startSplashHideWatchdog();
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
  loading: {
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
