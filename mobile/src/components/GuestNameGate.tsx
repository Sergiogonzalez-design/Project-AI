import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Colors } from "../lib/colors";
import { deleteOwnAccountAndSignOut } from "../lib/delete-account";
import {
  guestNameStorageKey,
  isGuestDisplayNameSet,
  normalizeGuestPhoneInput,
} from "../lib/guest-account";
import { useI18n } from "../lib/i18n";
import { supabase } from "../lib/supabase";
import { AuthBackBar } from "./AuthBackBar";
import { AuthTextField } from "./AuthTextField";

type Props = {
  onSaved: (name: string) => void;
  onExit?: () => void;
};

export function GuestNameGate({ onSaved, onExit }: Props) {
  const { t } = useI18n();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    Keyboard.dismiss();
    const displayName = name.trim().replace(/\s+/g, " ");
    if (!isGuestDisplayNameSet(displayName)) {
      setError(t.guest.nameRequired);
      return;
    }
    const phoneDigits = normalizeGuestPhoneInput(phone);
    if (phone.trim() && !phoneDigits) {
      setError(t.guest.phoneInvalid);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setError(t.guest.sessionExpired);
        return;
      }
      const patch: { display_name: string; whatsapp_phone?: string } = {
        display_name: displayName,
      };
      if (phoneDigits) patch.whatsapp_phone = phoneDigits;

      const { error: updateError } = await supabase
        .from("profiles")
        .update(patch)
        .eq("id", user.id);
      if (updateError) {
        if (phoneDigits && /whatsapp_phone|unique/i.test(updateError.message)) {
          const { error: nameOnlyErr } = await supabase
            .from("profiles")
            .update({ display_name: displayName })
            .eq("id", user.id);
          if (nameOnlyErr) {
            setError(t.guest.saveNameError);
            return;
          }
        } else {
          setError(t.guest.saveNameError);
          return;
        }
      }
      try {
        await AsyncStorage.setItem(guestNameStorageKey(user.id), "1");
      } catch {
        // Still continue into the consult.
      }
      onSaved(displayName);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Pressable
      style={{ flex: 1, backgroundColor: Colors.background }}
      onPress={Keyboard.dismiss}
      accessible={false}
    >
      <AuthBackBar
        onPress={() => {
          if (onExit) onExit();
          else void deleteOwnAccountAndSignOut();
        }}
      />
      <View style={styles.wrap} pointerEvents="box-none">
        <Image
          source={require("../../assets/logo.png")}
          style={styles.logo}
          accessibilityLabel="AIKinora"
        />
        <Text style={styles.title}>{t.guest.nameTitle}</Text>
        <Text style={styles.hint}>{t.guest.nameHint}</Text>
        <AuthTextField
          value={name}
          onChangeText={setName}
          editable={!loading}
          autoCapitalize="words"
          autoCorrect={false}
          autoComplete="off"
          textContentType="none"
          importantForAutofill="no"
          placeholder={t.guest.namePlaceholder}
          returnKeyType="next"
          blurOnSubmit={false}
        />
        <Text style={styles.phoneLabel}>{t.guest.phoneLabel}</Text>
        <AuthTextField
          value={phone}
          onChangeText={setPhone}
          editable={!loading}
          keyboardType="phone-pad"
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="tel"
          textContentType="telephoneNumber"
          placeholder={t.guest.phonePlaceholder}
          returnKeyType="done"
          blurOnSubmit
          onSubmitEditing={() => void handleSubmit()}
        />
        <Text style={styles.phoneHint}>{t.guest.phoneHint}</Text>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Pressable
          onPress={() => void handleSubmit()}
          disabled={loading}
          style={({ pressed }) => [
            styles.button,
            pressed && { opacity: 0.9 },
            loading && { opacity: 0.7 },
          ]}
        >
          {loading ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <Text style={styles.buttonText}>{t.guest.startConsult}</Text>
          )}
        </Pressable>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingBottom: 24,
    backgroundColor: Colors.background,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 16,
    alignSelf: "center",
    resizeMode: "contain",
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: Colors.text,
    letterSpacing: -0.4,
    textAlign: "center",
  },
  hint: {
    marginTop: 8,
    marginBottom: 20,
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
    color: Colors.textSecondary,
  },
  phoneLabel: {
    marginTop: 14,
    marginBottom: 6,
    fontSize: 11,
    fontWeight: "700",
    color: Colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  phoneHint: {
    marginTop: 6,
    fontSize: 12,
    lineHeight: 17,
    color: Colors.textSecondary,
  },
  error: {
    marginTop: 12,
    fontSize: 13,
    color: Colors.danger,
    textAlign: "center",
  },
  button: {
    marginTop: 20,
    backgroundColor: Colors.primary,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
  },
  buttonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "700",
  },
});
