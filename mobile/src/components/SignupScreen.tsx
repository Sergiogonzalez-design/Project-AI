import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  AuthTextField,
  authEmailProps,
  authPasswordProps,
} from "./AuthTextField";
import { DismissKeyboard } from "./DismissKeyboard";
import { AuthBackBar } from "./AuthBackBar";
import { LegalDocumentView } from "./LegalDocumentView";
import { Colors } from "../lib/colors";
import { useI18n } from "../lib/i18n";
import { WEB_APP_URL } from "../lib/admin-api";
import { isGuestUser } from "../lib/guest-account";
import { supabase } from "../lib/supabase";

type Props = {
  onSwitch: () => void;
  onSignedUp?: (accountType: "patient" | "physio" | "clinic") => void;
};

export function SignupScreen({ onSwitch, onSignedUp }: Props) {
  const { t, locale } = useI18n();
  const [accountType, setAccountType] = useState<"patient" | "physio" | "clinic">("patient");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [legalSection, setLegalSection] = useState<"privacy" | "terms" | null>(
    null
  );
  const [convertingGuest, setConvertingGuest] = useState(false);
  const passwordRef = useRef<TextInput>(null);
  const confirmRef = useRef<TextInput>(null);

  useEffect(() => {
    void supabase.auth.getUser().then(({ data }) => {
      setConvertingGuest(isGuestUser(data.user));
    });
  }, []);

  async function handleSignup() {
    setError(null);
    if (!email.trim() || !password.trim()) {
      setError("Rellena todos los campos.");
      return;
    }
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (password !== confirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    setLoading(true);
    try {
      const emailNorm = email.trim().toLowerCase();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const converting = isGuestUser(session?.user);
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (converting && session?.access_token) {
        headers.Authorization = `Bearer ${session.access_token}`;
      }
      const res = await fetch(`${WEB_APP_URL}/api/auth/signup`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          email: emailNorm,
          password,
          accountType: converting ? "patient" : accountType,
        }),
      });
      const payload = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(payload.error ?? "No se pudo crear la cuenta.");
        return;
      }

      if (converting) {
        await supabase.auth.signOut({ scope: "local" });
      }
      onSignedUp?.(converting ? "patient" : accountType);
      const { error: signError } = await supabase.auth.signInWithPassword({
        email: emailNorm,
        password,
      });
      if (signError) {
        setError(signError.message);
      }
      // Session change is handled by App.tsx auth listener → onboarding
    } finally {
      setLoading(false);
    }
  }

  if (legalSection) {
    return (
      <LegalDocumentView
        onClose={() => setLegalSection(null)}
        initialSection={legalSection}
      />
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 8 : 0}
    >
      <AuthBackBar onPress={onSwitch} />
      <DismissKeyboard>
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
          onScrollBeginDrag={Keyboard.dismiss}
        >
        <View style={styles.header}>
          <Image source={require("../../assets/logo.png")} style={styles.logo} />
          <Text style={styles.title}>{t.auth.signupTitle}</Text>
          <Text style={styles.subtitle}>
            {convertingGuest
              ? "Crea tu cuenta para seguir usando la IA"
              : "Crea tu cuenta"}
          </Text>
        </View>

        <View style={styles.card}>
          {convertingGuest ? null : (
            <>
          <Text style={styles.roleLabel}>Soy...</Text>
          <View style={styles.roleRow}>
            <Pressable
              style={[styles.roleOption, accountType === "patient" && styles.roleOptionActive]}
              onPress={() => setAccountType("patient")}
            >
              <Text
                style={[
                  styles.roleOptionText,
                  accountType === "patient" && styles.roleOptionTextActive,
                ]}
              >
                Persona
              </Text>
            </Pressable>
            <Pressable
              style={[styles.roleOption, accountType === "physio" && styles.roleOptionActive]}
              onPress={() => setAccountType("physio")}
            >
              <Text
                style={[
                  styles.roleOptionText,
                  accountType === "physio" && styles.roleOptionTextActive,
                ]}
              >
                Fisio
              </Text>
            </Pressable>
            <Pressable
              style={[styles.roleOption, accountType === "clinic" && styles.roleOptionActive]}
              onPress={() => setAccountType("clinic")}
            >
              <Text
                style={[
                  styles.roleOptionText,
                  accountType === "clinic" && styles.roleOptionTextActive,
                ]}
              >
                Clínica
              </Text>
            </Pressable>
          </View>
          {accountType === "clinic" ? (
            <Text style={styles.clinicHint}>
              El plan de clínica será de pago más adelante. Ahora puedes configurar el espacio.
            </Text>
          ) : null}
          <View style={{ height: 12 }} />
            </>
          )}

          <AuthTextField
            label="Correo electrónico"
            placeholder="tu@correo.com"
            value={email}
            onChangeText={setEmail}
            editable={!loading}
            {...authEmailProps}
            onSubmitEditing={() => passwordRef.current?.focus()}
          />

          <View style={{ height: 12 }} />

          <AuthTextField
            label="Contraseña"
            placeholder="Mínimo 6 caracteres"
            value={password}
            onChangeText={setPassword}
            editable={!loading}
            {...authPasswordProps}
            ref={passwordRef}
            onSubmitEditing={() => confirmRef.current?.focus()}
          />

          <View style={{ height: 12 }} />

          <AuthTextField
            label={t.auth.confirmPassword}
            placeholder={t.auth.confirmPassword}
            value={confirm}
            onChangeText={setConfirm}
            editable={!loading}
            {...authPasswordProps}
            ref={confirmRef}
            onSubmitEditing={handleSignup}
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Text style={styles.legalAccept}>
            {locale === "en" ? (
              <>
                By creating an account you accept the{" "}
                <Text
                  style={styles.legalLink}
                  onPress={() => setLegalSection("privacy")}
                >
                  Privacy policy
                </Text>{" "}
                and{" "}
                <Text
                  style={styles.legalLink}
                  onPress={() => setLegalSection("terms")}
                >
                  Terms of use
                </Text>
                .
              </>
            ) : (
              <>
                Al crear la cuenta aceptas la{" "}
                <Text
                  style={styles.legalLink}
                  onPress={() => setLegalSection("privacy")}
                >
                  Política de privacidad
                </Text>{" "}
                y los{" "}
                <Text
                  style={styles.legalLink}
                  onPress={() => setLegalSection("terms")}
                >
                  Términos de uso
                </Text>
                .
              </>
            )}
          </Text>

          <Pressable
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
            ]}
            onPress={handleSignup}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Crear cuenta</Text>
            )}
          </Pressable>

          <Pressable style={styles.switchRow} onPress={onSwitch}>
            <Text style={styles.switchText}>
              ¿Ya tienes cuenta?{" "}
              <Text style={styles.switchLink}>Iniciar sesión</Text>
            </Text>
          </Pressable>
        </View>
      </ScrollView>
      </DismissKeyboard>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingTop: 72,
    paddingBottom: 48,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  logo: {
    width: 72,
    height: 72,
    marginBottom: 12,
    resizeMode: "contain",
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: Colors.text,
    letterSpacing: -0.8,
  },
  subtitle: {
    marginTop: 6,
    fontSize: 15,
    color: Colors.textSecondary,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 4,
  },
  error: {
    marginTop: 12,
    fontSize: 13,
    color: Colors.danger,
    textAlign: "center",
  },
  legalAccept: {
    marginTop: 16,
    fontSize: 12,
    lineHeight: 18,
    color: Colors.textSecondary,
    textAlign: "center",
  },
  legalLink: {
    color: Colors.primary,
    fontWeight: "700",
  },
  roleLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 8,
  },
  roleRow: {
    flexDirection: "row",
    gap: 8,
  },
  roleOption: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: Colors.surface,
  },
  roleOptionActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  roleOptionText: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.text,
  },
  roleOptionTextActive: {
    color: "#fff",
  },
  clinicHint: {
    marginTop: 8,
    fontSize: 12,
    lineHeight: 16,
    color: Colors.textSecondary,
  },
  button: {
    marginTop: 24,
    backgroundColor: Colors.primary,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
  },
  buttonPressed: {
    backgroundColor: Colors.primaryDark,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  switchRow: {
    marginTop: 20,
    alignItems: "center",
  },
  switchText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  switchLink: {
    color: Colors.primary,
    fontWeight: "600",
  },
});
