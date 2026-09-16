import React, { forwardRef, useState } from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../lib/colors";

type Props = TextInputProps & {
  label?: string;
  error?: boolean;
  /** Shows an eye button to reveal/hide the password. */
  passwordToggle?: boolean;
  showPasswordLabel?: string;
  hidePasswordLabel?: string;
};

/** Stable email/password fields — avoids iOS autofill glitches from autoComplete="email". */
export const AuthTextField = forwardRef<TextInput, Props>(function AuthTextField(
  {
    label,
    style,
    error,
    passwordToggle,
    showPasswordLabel = "Mostrar contraseña",
    hidePasswordLabel = "Ocultar contraseña",
    secureTextEntry,
    ...props
  },
  ref
) {
  const [visible, setVisible] = useState(false);
  const isPassword = Boolean(passwordToggle || secureTextEntry);
  const hideText = isPassword ? (passwordToggle ? !visible : secureTextEntry) : false;

  return (
    <View style={styles.wrap}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={styles.inputRow}>
        <TextInput
          ref={ref}
          autoCorrect={false}
          spellCheck={false}
          blurOnSubmit={false}
          {...props}
          secureTextEntry={hideText}
          style={[
            styles.input,
            passwordToggle && styles.inputWithToggle,
            error && styles.inputError,
            style,
          ]}
          placeholderTextColor={Colors.textLight}
        />
        {passwordToggle ? (
          <Pressable
            onPress={() => setVisible((v) => !v)}
            style={styles.toggle}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={visible ? hidePasswordLabel : showPasswordLabel}
            accessibilityState={{ selected: visible }}
          >
            <Ionicons
              name={visible ? "eye-off-outline" : "eye-outline"}
              size={20}
              color={Colors.textSecondary}
            />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
});

export const authEmailProps: Partial<TextInputProps> = {
  keyboardType: "email-address",
  autoCapitalize: "none",
  autoComplete: Platform.OS === "ios" ? "username" : "email",
  textContentType: "emailAddress",
  returnKeyType: "next",
  clearButtonMode: Platform.OS === "ios" ? "while-editing" : "never",
};

export const authPasswordProps: Partial<TextInputProps> & {
  passwordToggle: true;
} = {
  secureTextEntry: true,
  passwordToggle: true,
  autoCapitalize: "none",
  autoComplete: "password",
  textContentType: "password",
  returnKeyType: "done",
};

const styles = StyleSheet.create({
  wrap: { marginBottom: 4 },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.textSecondary,
    marginBottom: 8,
    letterSpacing: 0.2,
    textTransform: "uppercase",
  },
  inputRow: { position: "relative", justifyContent: "center" },
  input: {
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    lineHeight: Platform.OS === "ios" ? 20 : undefined,
    color: Colors.text,
    backgroundColor: Colors.primarySoft,
  },
  inputWithToggle: { paddingRight: 44 },
  inputError: { borderColor: Colors.danger, backgroundColor: "#FEF2F2" },
  toggle: {
    position: "absolute",
    right: 12,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
});
