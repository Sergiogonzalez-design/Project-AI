import * as ImagePicker from "expo-image-picker";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Linking,
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
  normalizeClinicAccent,
  parseClinicSpecialties,
} from "../lib/clinic-brand";
import { PHYSIO_EQUIPMENT_CATEGORIES } from "../lib/physio-equipment-options";
import { CLINIC_BILLING_REQUIRED } from "../lib/clinic-billing";
import { formatClinicPostDate, type ClinicPost } from "../lib/clinic-directory";
import { Colors } from "../lib/colors";
import { supabase } from "../lib/supabase";

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
  cover_url?: string | null;
  tagline?: string | null;
  accent_color?: string | null;
  specialties?: string[] | null;
  hours?: string | null;
  equipment?: string[] | null;
  billing_status: string;
};

export function ClinicHomeScreen() {
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
  const [hours, setHours] = useState("");
  const [accent, setAccent] = useState("#2563EB");
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [equipment, setEquipment] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [postBody, setPostBody] = useState("");
  const [postImageUri, setPostImageUri] = useState<string | null>(null);
  const [posts, setPosts] = useState<ClinicPost[]>([]);
  const [posting, setPosting] = useState(false);

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
    setHours(row.hours ?? "");
    setAccent(normalizeClinicAccent(row.accent_color));
    setSpecialties(parseClinicSpecialties(row.specialties));
    setEquipment(Array.isArray(row.equipment) ? row.equipment.filter(Boolean) : []);
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

  async function save() {
    setError(null);
    setSaved(false);
    setSaving(true);
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
        p_hours: hours.trim() || "",
        p_equipment: equipment,
      });
      if (err) throw new Error(err.message);
      if (data?.id) fill(data as ClinicRecord);
      setSaved(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo guardar.");
    } finally {
      setSaving(false);
    }
  }

  async function pickCover() {
    if (!clinic) return;
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.85,
    });
    if (result.canceled || !result.assets[0]) return;
    try {
      const res = await fetch(result.assets[0].uri);
      const blob = await res.blob();
      const path = `${clinic.id}/cover.jpg`;
      const { error: upErr } = await supabase.storage
        .from("clinic-logos")
        .upload(path, blob, { contentType: blob.type || "image/jpeg", upsert: true });
      if (upErr) throw new Error(upErr.message);
      const { data } = supabase.storage.from("clinic-logos").getPublicUrl(path);
      const { data: row, error: saveErr } = await supabase.rpc("clinic_update_own", {
        p_cover_url: `${data.publicUrl}?v=${Date.now()}`,
      });
      if (saveErr) throw new Error(saveErr.message);
      if (row?.id) fill(row as ClinicRecord);
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo subir la portada.");
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
    <ScrollView contentContainerStyle={styles.wrap} keyboardShouldPersistTaps="handled">
      {!CLINIC_BILLING_REQUIRED ? (
        <Text style={styles.banner}>
          El plan de clínica será de pago. Por ahora puedes configurar el espacio.
        </Text>
      ) : null}
      <Text style={styles.hint}>
        Visible en Buscar si hay ciudad y teléfono o email. La portada y el color
        se ven en tu perfil público.
      </Text>
      {clinic?.cover_url ? (
        <Image source={{ uri: clinic.cover_url }} style={styles.coverPreview} />
      ) : null}
      <Pressable onPress={() => void pickCover()}>
        <Text style={styles.link}>Cambiar portada</Text>
      </Pressable>
      <Text style={styles.label}>Nombre</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />
      <Text style={styles.label}>Eslogan</Text>
      <TextInput
        style={styles.input}
        value={tagline}
        onChangeText={setTagline}
        placeholder="Fisioterapia deportiva en el centro"
        placeholderTextColor={Colors.textLight}
        maxLength={120}
      />
      <Text style={styles.label}>Color de marca</Text>
      <View style={styles.swatches}>
        {CLINIC_ACCENT_SWATCHES.map((s) => (
          <Pressable
            key={s.hex}
            onPress={() => setAccent(s.hex)}
            style={[
              styles.swatch,
              { backgroundColor: s.hex },
              accent === s.hex && styles.swatchOn,
            ]}
          />
        ))}
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
      </View>
      <Text style={styles.label}>Equipo y servicios</Text>
      <Text style={styles.hint}>
        Marca lo que ofreces (p. ej. ecógrafo) para que Physio te recomiende a
        pacientes de tu ciudad.
      </Text>
      {PHYSIO_EQUIPMENT_CATEGORIES.map((cat) => (
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
                      on ? prev.filter((x) => x !== opt.id) : [...prev, opt.id]
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
          </View>
        </View>
      ))}
      <Text style={styles.label}>Descripción</Text>
      <TextInput
        style={[styles.input, styles.area]}
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <Text style={styles.label}>Dirección</Text>
      <TextInput style={styles.input} value={address} onChangeText={setAddress} />
      <Text style={styles.label}>Ciudad</Text>
      <TextInput style={styles.input} value={city} onChangeText={setCity} />
      <Text style={styles.label}>Teléfono</Text>
      <TextInput style={styles.input} value={phone} onChangeText={setPhone} />
      <Text style={styles.label}>Email de contacto</Text>
      <TextInput
        style={styles.input}
        value={contactEmail}
        onChangeText={setContactEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <Text style={styles.label}>Web</Text>
      <TextInput style={styles.input} value={website} onChangeText={setWebsite} />
      <Text style={styles.label}>Horario</Text>
      <TextInput
        style={[styles.input, styles.area]}
        value={hours}
        onChangeText={setHours}
        placeholder={"L–V 8:00–20:00"}
        placeholderTextColor={Colors.textLight}
        multiline
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
      {saved ? <Text style={styles.ok}>Cambios guardados.</Text> : null}
      <Pressable style={styles.btn} onPress={() => void save()} disabled={saving}>
        <Text style={styles.btnText}>{saving ? "Guardando…" : "Guardar ficha"}</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  wrap: { padding: 16, paddingBottom: 40, gap: 4 },
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
  swatchOn: { borderWidth: 3, borderColor: "#0f172a" },
  specChip: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "#f1f5f9",
  },
  specChipText: { fontSize: 12, fontWeight: "700", color: Colors.textSecondary },
  coverPreview: { width: "100%", height: 110, borderRadius: 14, marginBottom: 4 },
});
