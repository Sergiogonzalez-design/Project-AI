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
import { accountTypeFromMetadata, type AccountType } from "./src/lib/account-type";
import { isGuestEmail, isGuestUser } from "./src/lib/guest-account";
import { deleteOwnAccountAndSignOut } from "./src/lib/delete-account";
import { setAppDisclaimerHeight } from "./src/lib/app-disclaimer-height";
import { hideNativeSplash, startSplashHideWatchdog } from "./src/lib/hide-splash";
import { ensureNotificationHandler } from "./src/lib/notifications";
import { useOnAppForeground } from "./src/hooks/useAppLifecycle";
import { I18nProvider, useI18n } from "./src/lib/i18n";
import { isAdminEmail, isSupabaseConfigured } from "./src/lib/supabase-config";
import { supabase } from "./src/lib/supabase";
import {
  ATHLETE_PROFILE_COLUMNS,
  isAthleteProfileComplete,
} from "./src/lib/athlete-profile-complete";
import {
  isClinicProfileComplete,
} from "./src/lib/clinic-profile-complete";
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

const ForgotPasswordScreen = React.lazy(() =>
  import("./src/components/ForgotPasswordScreen").then((mod) => ({
    default: mod.ForgotPasswordScreen,
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

const ClinicOnboardingScreen = React.lazy(() =>
  import("./src/screens/ClinicOnboardingScreen").then((mod) => ({
    default: mod.ClinicOnboardingScreen,
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
  const [authReady, setAuthReady] = useState(false);
  const [profileGateReady, setProfileGateReady] = useState(false);
  const [authView, setAuthView] = useState<"login" | "signup" | "forgot">("login");
  const [onboardingDone, setOnboardingDone] = useState(false);
  const [isPhysio, setIsPhysio] = useState(false);
  const [isClinic, setIsClinic] = useState(false);
  const [roleReady, setRoleReady] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [guestSignup, setGuestSignup] = useState(false);
  const onboardingCheckSeq = useRef(0);
  const pendingAccountType = useRef<AccountType | null>(null);

  const isAdmin = isAdminEmail(session?.user?.email);

  useEffect(() => {
    return startSplashHideWatchdog();
  }, []);

  const handleOnboardingComplete = useCallback(() => {
    onboardingCheckSeq.current += 1;
    setOnboardingDone(true);
  }, []);

  const applyKnownAccountType = useCallback((type: AccountType | null) => {
    if (!type) return;
    setIsPhysio(type === "physio");
    setIsClinic(type === "clinic");
    setRoleReady(true);
  }, []);

  /** Guest X / back: show login immediately; cleanup runs in the background. */
  const exitGuestToLogin = useCallback(() => {
    setSession(null);
    setAuthView("login");
    setGuestSignup(false);
    setIsGuest(false);
    void deleteOwnAccountAndSignOut();
  }, []);

  const checkOnboarding = useCallback(
    async (
      userId: string,
      email: string | undefined,
      appMetadata?: unknown
    ) => {
      const seq = ++onboardingCheckSeq.current;
      const hinted =
        pendingAccountType.current ?? accountTypeFromMetadata(appMetadata);
      applyKnownAccountType(hinted);
      try {
        if (isAdminEmail(email) || isGuestEmail(email)) {
          if (seq !== onboardingCheckSeq.current) return;
          pendingAccountType.current = null;
          setIsPhysio(false);
          setIsClinic(false);
          setRoleReady(true);
          setOnboardingDone(true);
          return;
        }
        const { data: profile } = await withTimeout(
          supabase
            .from("profiles")
            .select(`account_type, ${PHYSIO_PROFILE_COLUMNS}, ${ATHLETE_PROFILE_COLUMNS}, clinic_id`)
            .eq("id", userId)
            .maybeSingle(),
          PROFILE_TIMEOUT_MS,
          { data: null, error: null }
        );
        if (seq !== onboardingCheckSeq.current) return;

        if (!profile) {
          // Do not assume patient — that flashes athlete questions after physio signup.
          if (hinted) {
            setIsPhysio(hinted === "physio");
            setIsClinic(hinted === "clinic");
            setRoleReady(true);
            setOnboardingDone(false);
            return;
          }
          setRoleReady(true);
          setOnboardingDone(true);
          return;
        }

        pendingAccountType.current = null;
        // Prefer JWT/hint when profile is still wrongly "patient".
        let physio = profile.account_type === "physio";
        let clinic = profile.account_type === "clinic";
        if (profile.account_type === "patient" && hinted === "clinic") {
          clinic = true;
          physio = false;
          void supabase
            .from("profiles")
            .update({ account_type: "clinic" })
            .eq("id", userId);
        } else if (profile.account_type === "patient" && hinted === "physio") {
          physio = true;
          clinic = false;
          void supabase
            .from("profiles")
            .update({ account_type: "physio" })
            .eq("id", userId);
        }
        setIsPhysio(physio);
        setIsClinic(clinic);
        setRoleReady(true);
        setOnboardingDone(
          clinic
            ? isClinicProfileComplete(profile)
            : physio
              ? isPhysioProfileComplete(profile)
              : isAthleteProfileComplete(profile)
        );
      } catch {
        if (seq !== onboardingCheckSeq.current) return;
        if (hinted) {
          setIsPhysio(hinted === "physio");
          setIsClinic(hinted === "clinic");
          setRoleReady(true);
          setOnboardingDone(false);
          return;
        }
        setRoleReady(true);
        setOnboardingDone(true);
      } finally {
        if (seq === onboardingCheckSeq.current) {
          setProfileGateReady(true);
        }
      }
    },
    [applyKnownAccountType]
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
          setProfileGateReady(false);
          applyKnownAccountType(
            accountTypeFromMetadata(data.session.user.app_metadata)
          );
          void checkOnboarding(
            data.session.user.id,
            data.session.user.email,
            data.session.user.app_metadata
          );
        } else {
          setProfileGateReady(true);
        }
      } catch {
        if (!cancelled) {
          setSession(null);
          setProfileGateReady(true);
        }
      } finally {
        if (!cancelled) setAuthReady(true);
        hideNativeSplash();
      }
    };

    void boot();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        setSession(newSession);
        if (!newSession) {
          setAuthView("login");
          setOnboardingDone(false);
          setIsPhysio(false);
          setIsClinic(false);
          setRoleReady(false);
          setIsGuest(false);
          setGuestSignup(false);
          setProfileGateReady(true);
          pendingAccountType.current = null;
          return;
        }
        setIsGuest(isGuestUser(newSession.user));
        if (!isGuestUser(newSession.user)) setGuestSignup(false);
        if (event === "INITIAL_SESSION" || event === "TOKEN_REFRESHED") return;
        setProfileGateReady(false);
        applyKnownAccountType(
          pendingAccountType.current ??
            accountTypeFromMetadata(newSession.user.app_metadata)
        );
        const { id, email, app_metadata } = newSession.user;
        setTimeout(() => {
          void checkOnboarding(id, email, app_metadata);
        }, 0);
      }
    );

    return () => {
      cancelled = true;
      listener.subscription.unsubscribe();
    };
  }, [applyKnownAccountType, checkOnboarding]);

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

  if (!authReady || (session && !profileGateReady)) {
    return (
      <>
        <StatusBar style="dark" />
        <TabsFallback />
      </>
    );
  }

  if (!session) {
    return (
      <>
        <StatusBar style="dark" />
        {authView === "login" ? (
          <LoginScreen
            onSwitch={() => setAuthView("signup")}
            onForgot={() => setAuthView("forgot")}
          />
        ) : authView === "forgot" ? (
          <Suspense fallback={<TabsFallback />}>
            <ForgotPasswordScreen onBack={() => setAuthView("login")} />
          </Suspense>
        ) : (
          <Suspense fallback={<TabsFallback />}>
            <SignupScreen
            onSwitch={() => setAuthView("login")}
            onSignedUp={(type) => {
              pendingAccountType.current = type;
              applyKnownAccountType(type);
              setOnboardingDone(false);
            }}
          />
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
          <SignupScreen
            onSwitch={() => setGuestSignup(false)}
            onSignedUp={(type) => {
              pendingAccountType.current = type;
              applyKnownAccountType(type);
              setOnboardingDone(false);
            }}
          />
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
            <GuestPhysioNavigator
              onCreateAccount={() => setGuestSignup(true)}
              onExitToLogin={exitGuestToLogin}
            />
          </Suspense>
        </NavigationContainer>
      </GestureHandlerRootView>
    );
  }

  if (!roleReady) {
    return (
      <>
        <StatusBar style="dark" />
        <TabsFallback />
      </>
    );
  }

  if (!onboardingDone) {
    return (
      <>
        <StatusBar style="dark" />
        <Suspense fallback={<TabsFallback />}>
          {isClinic ? (
            <ClinicOnboardingScreen onComplete={handleOnboardingComplete} />
          ) : isPhysio ? (
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
            key={`${isClinic ? "clinic" : isPhysio ? "physio" : "user"}-${isAdmin ? "admin" : ""}`}
            isAdmin={isAdmin}
            isPhysio={isPhysio}
            isClinic={isClinic}
          />
        </Suspense>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

function AppDisclaimer() {
  const { t } = useI18n();
  const insets = useSafeAreaInsets();
  const [keyboardOpen, setKeyboardOpen] = useState(false);

  useOnAppForeground(() => {
    setKeyboardOpen(false);
    Keyboard.dismiss();
  });

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

  return (
    <View
      style={[
        styles.disclaimer,
        { paddingBottom: Math.max(insets.bottom, 8) },
        keyboardOpen && styles.disclaimerHidden,
      ]}
      pointerEvents={keyboardOpen ? "none" : "auto"}
      accessibilityElementsHidden={keyboardOpen}
      onLayout={(event) => {
        if (!keyboardOpen) {
          setAppDisclaimerHeight(event.nativeEvent.layout.height);
        }
      }}
    >
      <Text style={styles.disclaimerText}>{t.common.appDisclaimer}</Text>
    </View>
  );
}

export default function App() {
  useEffect(() => {
    ensureNotificationHandler();
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
  disclaimerHidden: {
    height: 0,
    overflow: "hidden",
    opacity: 0,
    borderTopWidth: 0,
    paddingTop: 0,
    paddingBottom: 0,
  },
  disclaimerText: {
    fontSize: 11,
    lineHeight: 15,
    color: Colors.textLight,
  },
});
