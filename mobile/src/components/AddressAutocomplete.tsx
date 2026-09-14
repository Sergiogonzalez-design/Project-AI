import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { WEB_APP_URL } from "../lib/admin-api";
import {
  addressValueFromSuggestion,
  emptyAddressValue,
  type AddressSuggestion,
  type AddressValue,
} from "../lib/address-search";
import { Colors } from "../lib/colors";

type Props = {
  value: AddressValue;
  onChange: (next: AddressValue) => void;
  disabled?: boolean;
  hint?: string;
  onFieldFocus?: () => void;
};

export function AddressAutocomplete({
  value,
  onChange,
  disabled,
  hint,
  onFieldFocus,
}: Props) {
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const reqSeq = useRef(0);

  useEffect(() => {
    const q = value.query.trim();
    if (q.length < 2) {
      setSuggestions([]);
      setLoading(false);
      return;
    }

    const seq = ++reqSeq.current;
    setLoading(true);
    const timer = setTimeout(() => {
      void (async () => {
        try {
          const res = await fetch(
            `${WEB_APP_URL}/api/address/search?q=${encodeURIComponent(q)}`
          );
          if (!res.ok) throw new Error("search failed");
          const data = (await res.json()) as {
            suggestions?: AddressSuggestion[];
          };
          if (seq !== reqSeq.current) return;
          setSuggestions(data.suggestions ?? []);
          setOpen(true);
        } catch {
          if (seq !== reqSeq.current) return;
          setSuggestions([]);
        } finally {
          if (seq === reqSeq.current) setLoading(false);
        }
      })();
    }, 320);

    return () => clearTimeout(timer);
  }, [value.query]);

  function pick(suggestion: AddressSuggestion) {
    onChange(addressValueFromSuggestion(suggestion));
    setSuggestions([]);
    setOpen(false);
  }

  function clearAll() {
    onChange(emptyAddressValue());
    setSuggestions([]);
    setOpen(false);
  }

  const hasDetails =
    Boolean(value.address) ||
    Boolean(value.city) ||
    Boolean(value.postalCode) ||
    Boolean(value.country);

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>Dirección (opcional)</Text>
      <TextInput
        style={styles.input}
        value={value.query}
        editable={!disabled}
        onChangeText={(query) => onChange({ ...value, query })}
        onFocus={onFieldFocus}
        placeholder="Busca como en Maps: calle, ciudad, CP, país…"
        placeholderTextColor={Colors.textLight}
        autoCorrect={false}
        autoCapitalize="words"
        textContentType="fullStreetAddress"
      />
      {loading ? (
        <View style={styles.loadingRow}>
          <ActivityIndicator size="small" color={Colors.primary} />
          <Text style={styles.loadingText}>Buscando direcciones…</Text>
        </View>
      ) : null}

      {open && suggestions.length > 0 ? (
        <View style={styles.dropdown}>
          {suggestions.map((s) => (
            <Pressable
              key={s.id}
              style={({ pressed }) => [
                styles.suggestion,
                pressed && styles.suggestionPressed,
              ]}
              onPress={() => pick(s)}
            >
              <Text style={styles.suggestionTitle} numberOfLines={1}>
                {s.address || s.city || s.label}
              </Text>
              <Text style={styles.suggestionSub} numberOfLines={2}>
                {[s.postalCode, s.city, s.country].filter(Boolean).join(" · ")}
              </Text>
            </Pressable>
          ))}
        </View>
      ) : null}

      {hasDetails ? (
        <View style={styles.details}>
          <Text style={styles.label}>Calle y número</Text>
          <TextInput
            style={styles.input}
            value={value.address}
            editable={!disabled}
            onChangeText={(address) => onChange({ ...value, address })}
            onFocus={onFieldFocus}
            autoCorrect={false}
            textContentType="streetAddressLine1"
          />
          <Text style={styles.label}>Ciudad</Text>
          <TextInput
            style={styles.input}
            value={value.city}
            editable={!disabled}
            onChangeText={(city) => onChange({ ...value, city })}
            onFocus={onFieldFocus}
            autoCorrect={false}
            textContentType="addressCity"
          />
          <Text style={styles.label}>Código postal</Text>
          <TextInput
            style={styles.input}
            value={value.postalCode}
            editable={!disabled}
            onChangeText={(postalCode) => onChange({ ...value, postalCode })}
            onFocus={onFieldFocus}
            autoCorrect={false}
            keyboardType="numbers-and-punctuation"
            textContentType="postalCode"
          />
          <Text style={styles.label}>País</Text>
          <TextInput
            style={styles.input}
            value={value.country}
            editable={!disabled}
            onChangeText={(country) => onChange({ ...value, country })}
            onFocus={onFieldFocus}
            autoCorrect={false}
            textContentType="countryName"
          />
          <Pressable onPress={clearAll} disabled={disabled} hitSlop={8}>
            <Text style={styles.clear}>Borrar dirección</Text>
          </Pressable>
        </View>
      ) : null}

      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 8 },
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 2,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: Colors.text,
  },
  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  loadingText: { fontSize: 12, color: Colors.textLight },
  dropdown: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
    backgroundColor: Colors.white,
    overflow: "hidden",
  },
  suggestion: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  suggestionPressed: { backgroundColor: Colors.primarySoft },
  suggestionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
  },
  suggestionSub: {
    marginTop: 2,
    fontSize: 12,
    color: Colors.textSecondary,
  },
  details: { gap: 8, marginTop: 4 },
  clear: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: "700",
    color: Colors.textSecondary,
  },
  hint: {
    fontSize: 12,
    lineHeight: 17,
    color: Colors.textSecondary,
  },
});
