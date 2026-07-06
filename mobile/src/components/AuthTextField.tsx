import React, { forwardRef } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";
import { Colors } from "../lib/colors";

type Props = TextInputProps & {
  label: string;
  error?: boolean;
};

/** Stable email/password fields — avoids iOS autofill glitches from autoComplete="email". */
export const AuthTextField = forwardRef<TextInput, Props>(function AuthTextField(
  { label, style, error, ...props },
  ref
) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        ref={ref}
        {...props}
        style={[styles.input, error && styles.inputError, style]}
        placeholderTextColor={Colors.textLight}
        autoCorrect={false}
        spellCheck={false}
        blurOnSubmit={false}
      />
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

export const authPasswordProps: Partial<TextInputProps> = {
  secureTextEntry: true,
  autoCapitalize: "none",
  autoComplete: "password",
  textContentType: "password",
  returnKeyType: "done",
};

const styles = StyleSheet.create({
  wrap: { marginBottom: 4 },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    lineHeight: Platform.OS === "ios" ? 20 : undefined,
    color: Colors.text,
    backgroundColor: Colors.surface,
  },
  inputError: { borderColor: Colors.danger },
});
