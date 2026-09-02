import { useNavigation } from "@react-navigation/native";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import * as ImagePicker from "expo-image-picker";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { WEB_APP_URL } from "../lib/admin-api";
import {
  CLINIC_ACCENT_SWATCHES,
  CLINIC_SPECIALTY_PRESETS,
  customClinicSpecialties,
  customEquipmentKey,
  listCustomEquipmentForCategory,
  normalizeClinicAccent,
  parseClinicAccentHex,
  parseClinicSpecialties,
} from "../lib/clinic-brand";
import { PHYSIO_EQUIPMENT_CATEGORIES } from "../lib/physio-equipment-options";
import { CLINIC_BILLING_REQUIRED } from "../lib/clinic-billing";
import { formatClinicPostDate, type ClinicPost } from "../lib/clinic-directory";
import {
  parseClinicHours,
  serializeClinicHours,
  type ClinicHoursSchedule,
} from "../lib/clinic-hours";
import { Colors } from "../lib/colors";
import { scrollFocusedInputAboveKeyboard } from "../lib/scroll-focused-input-above-keyboard";
import { supabase } from "../lib/supabase";
import { uploadClinicBrandImage } from "../lib/upload-clinic-brand";
import { ClinicHoursEditor } from "../components/ClinicHoursEditor";
import type { TabParamList } from "../navigation/AppTabs";

type ClinicRecord = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  phone: string | null;
  website: string | null;
  address: string | null;
  city: string | null;
  contact_email: string | null;
  is_listed: boolean;
  logo_url?: string | null;
  cover_url?: string | null;
  tagline?: string | null;
  accent_color?: string | null;
  specialties?: string[] | null;
  hours?: string | null;
  equipment?: string[] | null;
  billing_status: string;
};

export function ClinicHomeScreen() {
  const navigation = useNavigation<BottomTabNavigationProp<TabParamList>>();
  const [clinic, setClinic] = useState<ClinicRecord | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [isListed, setIsListed] = useState(true);
  const [tagline, setTagline] = useState("");
  const [hoursSchedule, setHoursSchedule] = useState<ClinicHoursSchedule>(() =>
    parseClinicHours(null).schedule,
  );
  const [hoursLegacy, setHoursLegacy] = useState<string | null>(null);
  const [accent, setAccent] = useState("#2563EB");
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [equipment, setEquipment] = useState<string[]>([]);
  const [accentHexDraft, setAccentHexDraft] = useState("#2563EB");
  const [specialtyOtherOpen, setSpecialtyOtherOpen] = useState(false);
  const [customSpecialty, setCustomSpecialty] = useState("");
  const [equipmentOtherOpen, setEquipmentOtherOpen] = useState<
    Record<string, boolean>
  >({});
  const [customEquipmentDraft, setCustomEquipmentDraft] = useState<
    Record<string, string>
  >({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [postBody, setPostBody] = useState("");
  const [postImageUri, setPostImageUri] = useState<string | null>(null);
  const [posts, setPosts] = useState<ClinicPost[]>([]);
  const [posting, setPosting] = useState(false);
  const [uploadingBrand, setUploadingBrand] = useState<"logo" | "cover" | null>(
    null,
  );
  /** Local ImagePicker URI shown instantly while upload finishes in background. */
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">(
    "idle",
  );

  const scrollRef = useRef<ScrollView>(null);
  const scrollOffsetY = useRef(0);
  const hydratedRef = useRef(false);
  const saveGenRef = useRef(0);

  const ensureFocusedFieldVisible = useCallback(() => {
    scrollFocusedInputAboveKeyboard(
      scrollRef.current,
      scrollOffsetY.current,
      keyboardHeight,
      32,
    );
  }, [keyboardHeight]);

  useEffect(() => {
    const showEvent =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";
    const showSub = Keyboard.addListener(showEvent, (e) => {
      setKeyboardHeight(e.endCoordinates.height);
    });
    const hideSub = Keyboard.addListener(hideEvent, () => {
      setKeyboardHeight(0);
    });
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  useEffect(() => {
    if (keyboardHeight <= 0) return;
    const t1 = setTimeout(ensureFocusedFieldVisible, 50);
    const t2 = setTimeout(ensureFocusedFieldVisible, 280);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [keyboardHeight, ensureFocusedFieldVisible]);

  function onFieldFocus() {
    setTimeout(ensureFocusedFieldVisible, 100);
    setTimeout(ensureFocusedFieldVisible, 350);
  }

  const fill = useCallback((row: ClinicRecord) => {
    setClinic(row);
    setName(row.name ?? "");
    setDescription(row.description ?? "");
    setAddress(row.address ?? "");
    setCity(row.city ?? "");
    setPhone(row.phone ?? "");
    setWebsite(row.website ?? "");
    setContactEmail(row.contact_email ?? "");
    setIsListed(row.is_listed !== false);
    setTagline(row.tagline ?? "");
    const parsedHours = parseClinicHours(row.hours);
    setHoursSchedule(parsedHours.schedule);
    setHoursLegacy(parsedHours.legacyText);
    setAccent(normalizeClinicAccent(row.accent_color));
    setAccentHexDraft(normalizeClinicAccent(row.accent_color));
    const specs = parseClinicSpecialties(row.specialties);
    setSpecialties(specs);
    setSpecialtyOtherOpen(customClinicSpecialties(specs).length > 0);
    const eq = Array.isArray(row.equipment) ? row.equipment.filter(Boolean) : [];
    setEquipment(eq);
    const open: Record<string, boolean> = {};
    for (const cat of PHYSIO_EQUIPMENT_CATEGORIES) {
      if (listCustomEquipmentForCategory(eq, cat.id).length > 0) open[cat.id] = true;
    }
    setEquipmentOtherOpen(open);
  }, []);

  const loadPosts = useCallback(async () => {
    const { data } = await supabase.rpc("clinic_list_own_posts");
    setPosts((data as ClinicPost[]) ?? []);
  }, []);

  useEffect(() => {
    void supabase.rpc("clinic_get_own").then(({ data, error: err }) => {
      if (err) setError(err.message);
      else if (data?.id) fill(data as ClinicRecord);
      setLoading(false);
    });
    void loadPosts();
  }, [fill, loadPosts]);

  async function save(opts?: { fromAutosave?: boolean }) {
    if (!name.trim()) {
      if (!opts?.fromAutosave) setError("El nombre de la clínica es obligatorio.");
      return;
    }
    const gen = ++saveGenRef.current;
    setError(null);
    setSaved(false);
    setSaving(true);
    setSaveStatus("saving");
    try {
      const { data, error: err } = await supabase.rpc("clinic_update_own", {
        p_name: name.trim(),
        p_description: description.trim() || "",
        p_address: address.trim() || "",
        p_city: city.trim() || "",
        p_phone: phone.trim() || "",
        p_website: website.trim() || "",
        p_contact_email: contactEmail.trim() || "",
        p_is_listed: isListed,
        p_tagline: tagline.trim().slice(0, 120) || "",
        p_accent_color: accent,
        p_specialties: specialties,
        p_hours: serializeClinicHours(hoursSchedule),
        p_equipment: equipment,
      });
      if (err) throw new Error(err.message);
      if (gen !== saveGenRef.current) return;
      if (data?.id) {
        // Keep local form state; only refresh server metadata (slug, billing, urls).
        setClinic((prev) => {
          const row = data as ClinicRecord;
          if (!prev) return row;
          return {
            ...prev,
            ...row,
            // Prefer optimistic local previews until remote urls arrive.
            cover_url: row.cover_url ?? prev.cover_url,
            logo_url: row.logo_url ?? prev.logo_url,
          };
        });
        setHoursLegacy(null);
      }
      setSaved(true);
      setSaveStatus("saved");
    } catch (e) {
      if (gen !== saveGenRef.current) return;
      const msg = e instanceof Error ? e.message : "No se pudo guardar.";
      setError(msg);
      setSaveStatus("error");
    } finally {
      if (gen === saveGenRef.current) setSaving(false);
    }
  }

  const hoursSerialized = serializeClinicHours(hoursSchedule);
  const specialtiesKey = JSON.stringify(specialties);
  const equipmentKey = JSON.stringify(equipment);

  useEffect(() => {
    if (loading || !clinic) return;
    if (!hydratedRef.current) {
      hydratedRef.current = true;
      return;
    }
    setSaveStatus("idle");
    const t = setTimeout(() => {
      void save({ fromAutosave: true });
    }, 750);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- autosave on field changes
  }, [
    loading,
    clinic?.id,
    name,
    tagline,
    description,
    address,
    city,
    phone,
    website,
    contactEmail,
    isListed,
    accent,
    hoursSerialized,
    specialtiesKey,
    equipmentKey,
  ]);

  async function uploadClinicImage(kind: "logo" | "cover") {
    if (!clinic) return;
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      setError("Necesitamos acceso a tus fotos para subir la imagen.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.55,
      allowsEditing: true,
      aspect: kind === "logo" ? [1, 1] : [16, 5],
    });
    if (result.canceled || !result.assets[0]) return;

    const localUri = result.assets[0].uri;
    const previous =
      kind === "cover" ? clinic.cover_url ?? null : clinic.logo_url ?? null;

    // Instant UI: show local photo right away, upload in background.
    setError(null);
    if (kind === "cover") setCoverPreview(localUri);
    else setLogoPreview(localUri);
    setUploadingBrand(kind);

    try {
      const remoteUrl = await uploadClinicBrandImage(clinic.id, localUri, kind);
      setClinic((prev) =>
        prev
          ? {
              ...prev,
              ...(kind === "cover"
                ? { cover_url: remoteUrl }
                : { logo_url: remoteUrl }),
            }
          : prev,
      );
      if (kind === "cover") setCoverPreview(null);
      else setLogoPreview(null);
    } catch (e) {
      if (kind === "cover") setCoverPreview(null);
      else setLogoPreview(null);
      setClinic((prev) =>
        prev
          ? {
              ...prev,
              ...(kind === "cover"
                ? { cover_url: previous }
                : { logo_url: previous }),
            }
          : prev,
      );
      setError(
        e instanceof Error
          ? e.message
          : kind === "logo"
            ? "No se pudo subir el logo."
            : "No se pudo subir la portada.",
      );
    } finally {
      setUploadingBrand(null);
    }
  }

  async function pickPostImage() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setPostImageUri(result.assets[0].uri);
    }
  }

  async function publish() {
    if (!clinic) return;
    const text = postBody.trim();
    if (!text) {
      setError("Escribe una novedad (máx. 500 caracteres).");
      return;
    }
    setPosting(true);
    setError(null);
    try {
      let imageUrl: string | null = null;
      if (postImageUri) {
        const res = await fetch(postImageUri);
        const blob = await res.blob();
        const path = `${clinic.id}/${Date.now()}.jpg`;
        const { error: upErr } = await supabase.storage
          .from("clinic-posts")
          .upload(path, blob, { contentType: blob.type || "image/jpeg", upsert: false });
        if (upErr) throw new Error(upErr.message);
        const { data } = supabase.storage.from("clinic-posts").getPublicUrl(path);
        imageUrl = data.publicUrl;
      }
      const { error: postErr } = await supabase.rpc("clinic_create_post", {
        p_body: text,
        p_image_url: imageUrl,
      });
      if (postErr) throw new Error(postErr.message);
      setPostBody("");
      setPostImageUri(null);
      await loadPosts();
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo publicar.");
    } finally {
      setPosting(false);
    }
  }

  async function removePost(id: string) {
    const { error: err } = await supabase.rpc("clinic_delete_post", { p_id: id });
    if (err) setError(err.message);
    else setPosts((prev) => prev.filter((p) => p.id !== id));
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={Colors.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 88 : 0}
    >
    <ScrollView
      ref={scrollRef}
      style={styles.flex}
      contentContainerStyle={[
        styles.wrap,
        keyboardHeight > 0
          ? { paddingBottom: Math.max(48, keyboardHeight + 40) }
          : null,
      ]}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      automaticallyAdjustKeyboardInsets={Platform.OS === "ios"}
      onScroll={(e) => {
        scrollOffsetY.current = e.nativeEvent.contentOffset.y;
      }}
      scrollEventThrottle={16}
    >
      {!CLINIC_BILLING_REQUIRED ? (
        <Text style={styles.banner}>
          El plan de clínica será de pago. Por ahora puedes configurar el espacio.
        </Text>
      ) : null}

      <View style={styles.brandCard}>
        <Pressable
          onPress={() => void uploadClinicImage("cover")}
          disabled={uploadingBrand !== null}
          style={[
            styles.coverTap,
            !(coverPreview || clinic?.cover_url) && { backgroundColor: accent },
          ]}
          accessibilityRole="button"
          accessibilityLabel="Cambiar imagen de portada"
        >
          {coverPreview || clinic?.cover_url ? (
            <Image
              source={{ uri: coverPreview || clinic?.cover_url || undefined }}
              style={styles.coverImage}
            />
          ) : (
            <View style={styles.coverPlaceholder}>
              <Text style={styles.coverPlaceholderTitle}>Portada / fondo</Text>
              <Text style={styles.coverPlaceholderHint}>Toca para añadir imagen</Text>
            </View>
          )}
          <View style={styles.coverBadge}>
            {uploadingBrand === "cover" ? (
              <Text style={styles.coverBadgeText}>Guardando…</Text>
            ) : (
              <Text style={styles.coverBadgeText}>
                {coverPreview || clinic?.cover_url
                  ? "Cambiar portada"
                  : "Añadir portada"}
              </Text>
            )}
          </View>
        </Pressable>

        <View style={styles.logoRow}>
          <Pressable
            onPress={() => void uploadClinicImage("logo")}
            disabled={uploadingBrand !== null}
            style={styles.logoTap}
            accessibilityRole="button"
            accessibilityLabel="Cambiar logo de la clínica"
          >
            {logoPreview || clinic?.logo_url ? (
              <Image
                source={{ uri: logoPreview || clinic?.logo_url || undefined }}
                style={styles.logoImage}
              />
            ) : (
              <View style={styles.logoPlaceholder}>
                <Text style={styles.logoPlaceholderText}>Logo</Text>
              </View>
            )}
            {uploadingBrand === "logo" ? (
              <View style={styles.logoSyncBadge}>
                <Text style={styles.logoSyncText}>…</Text>
              </View>
            ) : null}
          </Pressable>
          <View style={styles.logoMeta}>
            <Pressable
              onPress={() => void uploadClinicImage("logo")}
              disabled={uploadingBrand !== null}
            >
              <Text style={styles.linkInline}>
                {uploadingBrand === "logo"
                  ? "Guardando…"
                  : logoPreview || clinic?.logo_url
                    ? "Cambiar logo"
                    : "Añadir logo"}
              </Text>
            </Pressable>
            <Text style={styles.hintTight}>
              Portada ancha arriba y logo cuadrado. Se ven en tu ficha pública.
            </Text>
          </View>
        </View>
      </View>

      <Pressable
        style={styles.equipoBtn}
        onPress={() => navigation.navigate("ClinicTeam")}
        accessibilityRole="button"
        accessibilityLabel="Equipo"
      >
        <Text style={styles.equipoBtnText}>Equipo</Text>
        <Text style={styles.equipoBtnHint}>
          Invitar fisioterapeutas y gestionar el alta
        </Text>
      </Pressable>

      <Text style={styles.label}>Nombre</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        onFocus={onFieldFocus}
      />
      <Text style={styles.label}>Eslogan</Text>
      <TextInput
        style={styles.input}
        value={tagline}
        onChangeText={setTagline}
        onFocus={onFieldFocus}
        placeholder="Fisioterapia deportiva en el centro"
        placeholderTextColor={Colors.textLight}
        maxLength={120}
      />
      <Text style={styles.label}>Color de marca</Text>
      <View style={styles.swatches}>
        {CLINIC_ACCENT_SWATCHES.map((s) => (
          <Pressable
            key={s.hex}
            onPress={() => {
              setAccent(s.hex);
              setAccentHexDraft(s.hex);
            }}
            style={[
              styles.swatch,
              { backgroundColor: s.hex },
              accent === s.hex && styles.swatchOn,
            ]}
          />
        ))}
        <View
          style={[
            styles.swatch,
            styles.customSwatch,
            { backgroundColor: accent },
            !CLINIC_ACCENT_SWATCHES.some((s) => s.hex === accent) && styles.swatchOn,
          ]}
        />
      </View>
      <Text style={styles.hint}>
        Elige un color rápido o escribe cualquier código hex (#RRGGBB).
      </Text>
      <View style={styles.hexRow}>
        <TextInput
          style={[styles.input, styles.hexInput]}
          value={accentHexDraft}
          onChangeText={(raw) => {
            setAccentHexDraft(raw);
            const parsed = parseClinicAccentHex(raw);
            if (parsed) setAccent(parsed);
          }}
          onFocus={onFieldFocus}
          onBlur={() => {
            const parsed = parseClinicAccentHex(accentHexDraft);
            const hex = parsed ?? accent;
            setAccent(hex);
            setAccentHexDraft(hex);
          }}
          placeholder="#2563EB"
          placeholderTextColor={Colors.textLight}
          autoCapitalize="characters"
          autoCorrect={false}
          maxLength={7}
        />
        <View style={[styles.hexPreview, { backgroundColor: accent }]} />
      </View>
      <Text style={styles.label}>Especialidades</Text>
      <View style={styles.swatches}>
        {CLINIC_SPECIALTY_PRESETS.map((s) => {
          const on = specialties.includes(s);
          return (
            <Pressable
              key={s}
              onPress={() =>
                setSpecialties((prev) =>
                  on ? prev.filter((x) => x !== s) : [...prev, s]
                )
              }
              style={[styles.specChip, on && { backgroundColor: accent }]}
            >
              <Text style={[styles.specChipText, on && { color: "#fff" }]}>{s}</Text>
            </Pressable>
          );
        })}
        {customClinicSpecialties(specialties).map((s) => (
          <Pressable
            key={s}
            onPress={() =>
              setSpecialties((prev) => prev.filter((x) => x !== s))
            }
            style={[styles.specChip, { backgroundColor: accent }]}
          >
            <Text style={[styles.specChipText, { color: "#fff" }]}>{s} ×</Text>
          </Pressable>
        ))}
        <Pressable
          onPress={() => setSpecialtyOtherOpen((v) => !v)}
          style={[
            styles.specChip,
            specialtyOtherOpen && { backgroundColor: accent },
          ]}
        >
          <Text
            style={[
              styles.specChipText,
              specialtyOtherOpen && { color: "#fff" },
            ]}
          >
            Otro
          </Text>
        </Pressable>
      </View>
      {specialtyOtherOpen ? (
        <View style={styles.otherRow}>
          <TextInput
            style={[styles.input, styles.otherInput]}
            value={customSpecialty}
            onChangeText={setCustomSpecialty}
            onFocus={onFieldFocus}
            placeholder="Escribe otra especialidad…"
            placeholderTextColor={Colors.textLight}
            onSubmitEditing={() => {
              const s = customSpecialty.trim();
              if (s && !specialties.includes(s)) {
                setSpecialties((prev) => [...prev, s]);
              }
              setCustomSpecialty("");
            }}
          />
          <Pressable
            style={styles.addBtn}
            onPress={() => {
              const s = customSpecialty.trim();
              if (s && !specialties.includes(s)) {
                setSpecialties((prev) => [...prev, s]);
              }
              setCustomSpecialty("");
            }}
          >
            <Text style={styles.addBtnText}>Añadir</Text>
          </Pressable>
        </View>
      ) : null}
      <Text style={styles.label}>Equipo y servicios</Text>
      <Text style={styles.hint}>
        Marca lo que ofreces (p. ej. ecógrafo) para que Physio te recomiende a
        pacientes de tu ciudad. Usa «Otro» si falta algo.
      </Text>
      {PHYSIO_EQUIPMENT_CATEGORIES.map((cat) => {
        const customLabels = listCustomEquipmentForCategory(equipment, cat.id);
        const otherOpen = Boolean(equipmentOtherOpen[cat.id]);
        return (
          <View key={cat.id} style={{ marginBottom: 10 }}>
            <Text style={styles.eqCat}>{cat.title}</Text>
            <View style={styles.swatches}>
              {cat.options.map((opt) => {
                const on = equipment.includes(opt.id);
                return (
                  <Pressable
                    key={opt.id}
                    onPress={() =>
                      setEquipment((prev) =>
                        on
                          ? prev.filter((x) => x !== opt.id)
                          : [...prev, opt.id]
                      )
                    }
                    style={[styles.specChip, on && { backgroundColor: accent }]}
                  >
                    <Text style={[styles.specChipText, on && { color: "#fff" }]}>
                      {opt.label}
                    </Text>
                  </Pressable>
                );
              })}
              {customLabels.map((label) => {
                const key = customEquipmentKey(cat.id, label);
                return (
                  <Pressable
                    key={key}
                    onPress={() =>
                      setEquipment((prev) => prev.filter((x) => x !== key))
                    }
                    style={[styles.specChip, { backgroundColor: accent }]}
                  >
                    <Text style={[styles.specChipText, { color: "#fff" }]}>
                      {label} ×
                    </Text>
                  </Pressable>
                );
              })}
              <Pressable
                onPress={() =>
                  setEquipmentOtherOpen((prev) => ({
                    ...prev,
                    [cat.id]: !prev[cat.id],
                  }))
                }
                style={[
                  styles.specChip,
                  otherOpen && { backgroundColor: accent },
                ]}
              >
                <Text
                  style={[
                    styles.specChipText,
                    otherOpen && { color: "#fff" },
                  ]}
                >
                  Otro
                </Text>
              </Pressable>
            </View>
            {otherOpen ? (
              <View style={styles.otherRow}>
                <TextInput
                  style={[styles.input, styles.otherInput]}
                  value={customEquipmentDraft[cat.id] ?? ""}
                  onChangeText={(v) =>
                    setCustomEquipmentDraft((prev) => ({
                      ...prev,
                      [cat.id]: v,
                    }))
                  }
                  onFocus={onFieldFocus}
                  placeholder={`Otro en ${cat.title.toLowerCase()}…`}
                  placeholderTextColor={Colors.textLight}
                  onSubmitEditing={() => {
                    const label = (customEquipmentDraft[cat.id] ?? "").trim();
                    if (!label) return;
                    const key = customEquipmentKey(cat.id, label);
                    setEquipment((prev) =>
                      prev.includes(key) ? prev : [...prev, key]
                    );
                    setCustomEquipmentDraft((prev) => ({
                      ...prev,
                      [cat.id]: "",
                    }));
                  }}
                />
                <Pressable
                  style={styles.addBtn}
                  onPress={() => {
                    const label = (customEquipmentDraft[cat.id] ?? "").trim();
                    if (!label) return;
                    const key = customEquipmentKey(cat.id, label);
                    setEquipment((prev) =>
                      prev.includes(key) ? prev : [...prev, key]
                    );
                    setCustomEquipmentDraft((prev) => ({
                      ...prev,
                      [cat.id]: "",
                    }));
                  }}
                >
                  <Text style={styles.addBtnText}>Añadir</Text>
                </Pressable>
              </View>
            ) : null}
          </View>
        );
      })}
      <Text style={styles.label}>Descripción</Text>
      <TextInput
        style={[styles.input, styles.area]}
        value={description}
        onChangeText={setDescription}
        onFocus={onFieldFocus}
        multiline
      />
      <Text style={styles.label}>Dirección</Text>
      <TextInput
        style={styles.input}
        value={address}
        onChangeText={setAddress}
        onFocus={onFieldFocus}
      />
      <Text style={styles.label}>Ciudad</Text>
      <TextInput
        style={styles.input}
        value={city}
        onChangeText={setCity}
        onFocus={onFieldFocus}
      />
      <Text style={styles.label}>Teléfono</Text>
      <TextInput
        style={styles.input}
        value={phone}
        onChangeText={setPhone}
        onFocus={onFieldFocus}
        keyboardType="phone-pad"
      />
      <Text style={styles.label}>Email de contacto</Text>
      <TextInput
        style={styles.input}
        value={contactEmail}
        onChangeText={setContactEmail}
        onFocus={onFieldFocus}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <Text style={styles.label}>Web</Text>
      <TextInput
        style={styles.input}
        value={website}
        onChangeText={setWebsite}
        onFocus={onFieldFocus}
        autoCapitalize="none"
        keyboardType="url"
      />
      <ClinicHoursEditor
        value={hoursSchedule}
        onChange={(next) => {
          setHoursSchedule(next);
          setHoursLegacy(null);
        }}
        accent={accent}
        legacyText={hoursLegacy}
      />
      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>Visible en Buscar</Text>
        <Switch value={isListed} onValueChange={setIsListed} />
      </View>
      {clinic?.slug ? (
        <Pressable
          onPress={() => void Linking.openURL(`${WEB_APP_URL}/centro/${clinic.slug}`)}
        >
          <Text style={styles.link}>Ver ficha pública</Text>
        </Pressable>
      ) : null}
      {clinic?.slug ? (
        <Pressable
          onPress={() =>
            void Linking.openURL(
              `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                [address, city].filter(Boolean).join(", ")
              )}`
            )
          }
        >
          <Text style={styles.link}>Abrir ubicación en Google Maps</Text>
        </Pressable>
      ) : null}

      <Text style={styles.section}>Novedades</Text>
      <TextInput
        style={[styles.input, styles.area]}
        value={postBody}
        onChangeText={(v) => setPostBody(v.slice(0, 500))}
        onFocus={onFieldFocus}
        placeholder="Aviso corto para pacientes…"
        placeholderTextColor={Colors.textLight}
        multiline
      />
      <Text style={styles.hint}>{postBody.length}/500</Text>
      <Pressable onPress={() => void pickPostImage()}>
        <Text style={styles.link}>
          {postImageUri ? "Foto seleccionada · cambiar" : "Añadir foto (opcional)"}
        </Text>
      </Pressable>
      {postImageUri ? (
        <Image source={{ uri: postImageUri }} style={styles.preview} />
      ) : null}
      <Pressable
        style={[styles.btn, styles.secondaryBtn]}
        onPress={() => void publish()}
        disabled={posting}
      >
        <Text style={styles.secondaryBtnText}>
          {posting ? "Publicando…" : "Publicar novedad"}
        </Text>
      </Pressable>
      {posts.map((post) => (
        <View key={post.id} style={styles.postCard}>
          <View style={styles.postHead}>
            <Text style={styles.meta}>{formatClinicPostDate(post.created_at)}</Text>
            <Pressable onPress={() => void removePost(post.id)}>
              <Text style={styles.delete}>Eliminar</Text>
            </Pressable>
          </View>
          <Text style={styles.postBody}>{post.body}</Text>
          {post.image_url ? (
            <Image source={{ uri: post.image_url }} style={styles.preview} />
          ) : null}
        </View>
      ))}

      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Text
        style={
          saveStatus === "error"
            ? styles.error
            : saveStatus === "saved" || saved
              ? styles.ok
              : styles.hint
        }
      >
        {saveStatus === "saving" || saving
          ? "Guardando…"
          : saveStatus === "error"
            ? "No se pudo guardar. Revisa e inténtalo de nuevo."
            : saveStatus === "saved" || saved
              ? "Cambios guardados automáticamente."
              : "Los cambios se guardan solos."}
      </Text>
    </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  wrap: { padding: 16, paddingBottom: 40, gap: 4 },
  equipoBtn: {
    marginBottom: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  equipoBtnText: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.text,
  },
  equipoBtnHint: {
    marginTop: 2,
    fontSize: 13,
    color: Colors.textSecondary,
  },
  brandCard: {
    marginBottom: 8,
    overflow: "hidden",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  coverTap: {
    height: 140,
    width: "100%",
    backgroundColor: Colors.primary,
    justifyContent: "flex-end",
  },
  coverImage: { ...StyleSheet.absoluteFillObject, width: "100%", height: "100%" },
  coverPlaceholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  coverPlaceholderTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
  },
  coverPlaceholderHint: {
    marginTop: 4,
    color: "rgba(255,255,255,0.85)",
    fontSize: 12,
    fontWeight: "600",
  },
  coverBadge: {
    alignSelf: "flex-end",
    margin: 10,
    borderRadius: 999,
    backgroundColor: "rgba(0,0,0,0.55)",
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  coverBadgeText: { color: "#fff", fontSize: 12, fontWeight: "700" },
  logoRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 12,
    paddingHorizontal: 14,
    paddingBottom: 14,
    marginTop: -28,
  },
  logoTap: {
    width: 84,
    height: 84,
    borderRadius: 18,
    borderWidth: 4,
    borderColor: "#fff",
    overflow: "hidden",
    backgroundColor: "#f1f5f9",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  logoSyncBadge: {
    position: "absolute",
    right: 4,
    bottom: 4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "rgba(0,0,0,0.55)",
    alignItems: "center",
    justifyContent: "center",
  },
  logoSyncText: { color: "#fff", fontSize: 11, fontWeight: "800" },
  logoImage: { width: "100%", height: "100%" },
  logoPlaceholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  logoPlaceholderText: {
    fontSize: 12,
    fontWeight: "800",
    color: Colors.textSecondary,
  },
  logoMeta: { flex: 1, paddingBottom: 6 },
  linkInline: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.primary,
    marginBottom: 4,
  },
  hintTight: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
  banner: {
    backgroundColor: "#FFFBEB",
    color: "#78350F",
    fontSize: 13,
    lineHeight: 18,
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  hint: { fontSize: 12, color: Colors.textSecondary, marginBottom: 12, lineHeight: 17 },
  eqCat: {
    fontSize: 11,
    fontWeight: "700",
    color: Colors.textLight,
    textTransform: "uppercase",
    marginTop: 6,
    marginBottom: 4,
  },
  label: { fontSize: 12, fontWeight: "700", color: Colors.textSecondary, marginTop: 10 },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: Colors.text,
    backgroundColor: Colors.surface,
  },
  area: { minHeight: 72, textAlignVertical: "top" },
  switchRow: {
    marginTop: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  switchLabel: { fontSize: 15, fontWeight: "600", color: Colors.text },
  link: { marginTop: 12, fontSize: 13, fontWeight: "700", color: Colors.primary },
  section: {
    marginTop: 22,
    fontSize: 13,
    fontWeight: "800",
    color: Colors.text,
  },
  preview: { width: "100%", height: 140, borderRadius: 12, marginTop: 8 },
  postCard: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 12,
    backgroundColor: Colors.surface,
  },
  postHead: { flexDirection: "row", justifyContent: "space-between" },
  meta: { fontSize: 12, color: Colors.textSecondary },
  delete: { fontSize: 12, fontWeight: "700", color: Colors.danger },
  postBody: { marginTop: 6, fontSize: 14, color: Colors.text },
  error: { marginTop: 8, color: Colors.danger, fontSize: 13 },
  ok: { marginTop: 8, color: "#047857", fontSize: 13, fontWeight: "700" },
  btn: {
    marginTop: 16,
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontWeight: "700", fontSize: 15 },
  secondaryBtn: {
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  secondaryBtnText: { color: Colors.primary, fontWeight: "700", fontSize: 15 },
  swatches: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 8 },
  swatch: { width: 28, height: 28, borderRadius: 14 },
  customSwatch: { borderWidth: 1, borderColor: Colors.border },
  swatchOn: { borderWidth: 3, borderColor: "#0f172a" },
  hexRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 4 },
  hexInput: { flex: 1, marginBottom: 0 },
  hexPreview: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  otherRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 8 },
  otherInput: { flex: 1, marginBottom: 0 },
  addBtn: {
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: Colors.surface,
  },
  addBtnText: { fontSize: 13, fontWeight: "700", color: Colors.text },
  specChip: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "#f1f5f9",
  },
  specChipText: { fontSize: 12, fontWeight: "700", color: Colors.textSecondary },
});
