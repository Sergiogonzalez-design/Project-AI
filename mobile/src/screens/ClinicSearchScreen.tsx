import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Linking,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { WEB_APP_URL } from "../lib/admin-api";
import {
  clinicMailtoHref,
  clinicTelHref,
  clinicWebsiteHref,
  formatClinicPostDate,
  type ClinicFeedPost,
  type ClinicPost,
  type ClinicPublicProfile,
  type ClinicSearchCard,
} from "../lib/clinic-directory";
import {
  normalizeClinicAccent,
  parseClinicSpecialties,
} from "../lib/clinic-brand";
import { clinicMapsQuery, googleMapsSearchUrl } from "../lib/clinic-maps";
import { Colors } from "../lib/colors";
import { supabase } from "../lib/supabase";

type Tab = "explorar" | "guardadas" | "novedades";

export function ClinicSearchScreen() {
  const [tab, setTab] = useState<Tab>("explorar");
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("");
  const [results, setResults] = useState<ClinicSearchCard[]>([]);
  const [favorites, setFavorites] = useState<ClinicSearchCard[]>([]);
  const [feed, setFeed] = useState<ClinicFeedPost[]>([]);
  const [slug, setSlug] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadExplore = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: err } = await supabase.rpc("clinic_search", {
      p_query: query.trim(),
      p_city: city.trim(),
    });
    if (err) setError(err.message);
    else setResults((data as ClinicSearchCard[]) ?? []);
    setLoading(false);
  }, [city, query]);

  const loadFavorites = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: err } = await supabase.rpc("clinic_list_favorites");
    if (err) setError(err.message);
    else setFavorites((data as ClinicSearchCard[]) ?? []);
    setLoading(false);
  }, []);

  const loadFeed = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: err } = await supabase.rpc("clinic_feed_posts");
    if (err) setError(err.message);
    else setFeed((data as ClinicFeedPost[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (slug) return;
    if (tab === "explorar") void loadExplore();
    else if (tab === "guardadas") void loadFavorites();
    else void loadFeed();
  }, [tab, slug, loadExplore, loadFavorites, loadFeed]);

  if (slug) {
    return <ClinicProfileView slug={slug} onBack={() => setSlug(null)} />;
  }

  const list = tab === "guardadas" ? favorites : results;

  return (
    <ScrollView
      contentContainerStyle={styles.wrap}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.eyebrow}>Directorio</Text>
      <Text style={styles.title}>Buscar clínicas</Text>
      <View style={styles.tabs}>
        {(["explorar", "guardadas", "novedades"] as const).map((id) => (
          <Pressable
            key={id}
            onPress={() => setTab(id)}
            style={[styles.tab, tab === id && styles.tabOn]}
          >
            <Text style={[styles.tabText, tab === id && styles.tabTextOn]}>
              {id === "explorar"
                ? "Explorar"
                : id === "guardadas"
                  ? "Guardadas"
                  : "Novedades"}
            </Text>
          </Pressable>
        ))}
      </View>

      {tab === "explorar" ? (
        <View style={styles.searchRow}>
          <TextInput
            style={styles.input}
            value={query}
            onChangeText={setQuery}
            placeholder="Nombre o especialidad"
            placeholderTextColor={Colors.textLight}
          />
          <TextInput
            style={styles.input}
            value={city}
            onChangeText={setCity}
            placeholder="Ciudad"
            placeholderTextColor={Colors.textLight}
          />
          <Pressable style={styles.searchBtn} onPress={() => void loadExplore()}>
            <Text style={styles.searchBtnText}>Buscar</Text>
          </Pressable>
        </View>
      ) : null}

      {error ? <Text style={styles.error}>{error}</Text> : null}
      {loading ? (
        <ActivityIndicator color={Colors.primary} style={{ marginTop: 24 }} />
      ) : tab === "novedades" ? (
        feed.length === 0 ? (
          <Text style={styles.empty}>
            Aún no hay novedades. Guarda clínicas para ver primero las suyas.
          </Text>
        ) : (
          feed.map((post) => (
            <Pressable
              key={post.post_id}
              style={styles.card}
              onPress={() => setSlug(post.clinic_slug)}
            >
              <Text style={styles.cardTitle}>{post.clinic_name}</Text>
              <Text style={styles.meta}>
                {[post.clinic_city, post.from_saved ? "Guardada" : null, formatClinicPostDate(post.created_at)]
                  .filter(Boolean)
                  .join(" · ")}
              </Text>
              <Text style={styles.body}>{post.body}</Text>
              {post.image_url ? (
                <Image source={{ uri: post.image_url }} style={styles.postImg} />
              ) : null}
            </Pressable>
          ))
        )
      ) : list.length === 0 ? (
        <Text style={styles.empty}>
          {tab === "guardadas"
            ? "Todavía no has guardado ninguna clínica."
            : "No hay clínicas que coincidan."}
        </Text>
      ) : (
        list.map((clinic) => {
          const accent = normalizeClinicAccent(clinic.accent_color);
          const chips = parseClinicSpecialties(clinic.specialties).slice(0, 3);
          return (
            <Pressable
              key={clinic.id}
              style={styles.channelCard}
              onPress={() => setSlug(clinic.slug)}
            >
              <View style={[styles.cover, { backgroundColor: accent }]}>
                {clinic.cover_url ? (
                  <Image source={{ uri: clinic.cover_url }} style={styles.coverImg} />
                ) : null}
              </View>
              <View style={styles.channelBody}>
                {clinic.logo_url ? (
                  <Image source={{ uri: clinic.logo_url }} style={styles.logoOverlap} />
                ) : (
                  <View style={[styles.logoOverlap, styles.logoFallback, { backgroundColor: accent }]}>
                    <Text style={styles.logoLetter}>
                      {clinic.name.slice(0, 1).toUpperCase()}
                    </Text>
                  </View>
                )}
                <Text style={styles.cardTitle}>{clinic.name}</Text>
                {clinic.city ? <Text style={styles.meta}>{clinic.city}</Text> : null}
                {clinic.tagline || clinic.description ? (
                  <Text style={styles.snippet} numberOfLines={2}>
                    {clinic.tagline || clinic.description}
                  </Text>
                ) : null}
                {chips.length > 0 ? (
                  <View style={styles.chipRow}>
                    {chips.map((s) => (
                      <Text key={s} style={[styles.chip, { color: accent }]}>
                        {s}
                      </Text>
                    ))}
                  </View>
                ) : null}
              </View>
            </Pressable>
          );
        })
      )}
    </ScrollView>
  );
}

function ClinicProfileView({
  slug,
  onBack,
}: {
  slug: string;
  onBack: () => void;
}) {
  const [clinic, setClinic] = useState<ClinicPublicProfile | null>(null);
  const [posts, setPosts] = useState<ClinicPost[]>([]);
  const [pageTab, setPageTab] = useState<"novedades" | "sobre">("novedades");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      const [{ data }, { data: postRows }] = await Promise.all([
        supabase.rpc("clinic_get_public", { p_slug: slug }),
        supabase.rpc("clinic_list_posts", { p_slug: slug }),
      ]);
      const row = (Array.isArray(data) ? data[0] : data) as ClinicPublicProfile | null;
      if (!row) {
        setError("Clínica no encontrada.");
        setLoading(false);
        return;
      }
      setClinic(row);
      setPosts((postRows as ClinicPost[]) ?? []);
      const { data: fav } = await supabase.rpc("clinic_is_favorited", {
        p_clinic_id: row.id,
      });
      setSaved(Boolean(fav));
      setLoading(false);
    })();
  }, [slug]);

  async function toggleSave() {
    if (!clinic) return;
    const { data } = await supabase.rpc("clinic_favorite_toggle", {
      p_clinic_id: clinic.id,
    });
    setSaved(Boolean(data));
  }

  async function share() {
    await Share.share({
      message: `${clinic?.name ?? "Clínica"} · ${WEB_APP_URL}/centro/${slug}`,
    });
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={Colors.primary} />
      </View>
    );
  }
  if (!clinic) {
    return (
      <View style={styles.wrap}>
        <Pressable onPress={onBack}>
          <Text style={styles.back}>← Volver</Text>
        </Pressable>
        <Text style={styles.error}>{error ?? "No encontrada."}</Text>
      </View>
    );
  }

  const mapsQuery = clinicMapsQuery({
    address: clinic.address,
    city: clinic.city,
    lat: clinic.lat,
    lng: clinic.lng,
  });
  const mapsHref =
    clinic.google_maps_url || (mapsQuery ? googleMapsSearchUrl(mapsQuery) : null);

  const accent = normalizeClinicAccent(clinic.accent_color);
  const chips = parseClinicSpecialties(clinic.specialties);

  return (
    <ScrollView contentContainerStyle={styles.profileWrap}>
      <View style={[styles.coverTall, { backgroundColor: accent }]}>
        {clinic.cover_url ? (
          <Image source={{ uri: clinic.cover_url }} style={styles.coverImg} />
        ) : null}
        <Pressable onPress={onBack} style={styles.backPill}>
          <Text style={styles.backPillText}>← Buscar</Text>
        </Pressable>
      </View>
      <View style={styles.profileCard}>
        {clinic.logo_url ? (
          <Image source={{ uri: clinic.logo_url }} style={styles.profileLogo} />
        ) : (
          <View style={[styles.profileLogo, { backgroundColor: accent, alignItems: "center", justifyContent: "center" }]}>
            <Text style={styles.logoLetter}>{clinic.name.slice(0, 1).toUpperCase()}</Text>
          </View>
        )}
        <Text style={styles.title}>{clinic.name}</Text>
        {clinic.tagline ? <Text style={styles.snippet}>{clinic.tagline}</Text> : null}
        {clinic.city ? <Text style={styles.meta}>{clinic.city}</Text> : null}
        {chips.length > 0 ? (
          <View style={styles.chipRow}>
            {chips.map((s) => (
              <Text key={s} style={[styles.chip, { color: accent }]}>
                {s}
              </Text>
            ))}
          </View>
        ) : null}
        <View style={styles.actions}>
          <Action
            label={saved ? "Guardada" : "Guardar"}
            filled
            color={accent}
            onPress={() => void toggleSave()}
          />
          {clinic.phone ? (
            <Action label="Llamar" onPress={() => void Linking.openURL(clinicTelHref(clinic.phone!))} />
          ) : null}
          {clinic.contact_email ? (
            <Action
              label="Email"
              onPress={() => void Linking.openURL(clinicMailtoHref(clinic.contact_email!))}
            />
          ) : null}
          {mapsHref ? (
            <Action label="Maps" onPress={() => void Linking.openURL(mapsHref)} />
          ) : null}
          {clinic.website ? (
            <Action
              label="Web"
              onPress={() => void Linking.openURL(clinicWebsiteHref(clinic.website!))}
            />
          ) : null}
          <Action label="Compartir" onPress={() => void share()} />
        </View>
        <View style={styles.pageTabs}>
          <Pressable onPress={() => setPageTab("novedades")} style={styles.pageTab}>
            <Text style={[styles.pageTabText, pageTab === "novedades" && { color: accent }]}>
              Novedades
            </Text>
          </Pressable>
          <Pressable onPress={() => setPageTab("sobre")} style={styles.pageTab}>
            <Text style={[styles.pageTabText, pageTab === "sobre" && { color: accent }]}>
              Sobre
            </Text>
          </Pressable>
        </View>
        {pageTab === "novedades" ? (
          posts.length === 0 ? (
            <Text style={styles.empty}>Esta clínica aún no ha publicado novedades.</Text>
          ) : (
            posts.map((post) => (
              <View key={post.id} style={styles.card}>
                <Text style={styles.meta}>{formatClinicPostDate(post.created_at)}</Text>
                <Text style={styles.body}>{post.body}</Text>
                {post.image_url ? (
                  <Image source={{ uri: post.image_url }} style={styles.postImg} />
                ) : null}
              </View>
            ))
          )
        ) : (
          <>
            {clinic.description ? <Text style={styles.body}>{clinic.description}</Text> : null}
            {clinic.hours ? (
              <>
                <Text style={styles.section}>Horario</Text>
                <Text style={styles.body}>{clinic.hours}</Text>
              </>
            ) : null}
            {clinic.address ? (
              <Text style={styles.meta}>
                {clinic.address}
                {clinic.postal_code ? `, ${clinic.postal_code}` : ""}
              </Text>
            ) : null}
          </>
        )}
      </View>
    </ScrollView>
  );
}

function Action({
  label,
  onPress,
  filled,
  color,
}: {
  label: string;
  onPress: () => void;
  filled?: boolean;
  color?: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.action,
        filled && { backgroundColor: color ?? Colors.primary, borderColor: color },
      ]}
    >
      <Text style={[styles.actionText, filled && { color: "#fff" }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: 16, paddingBottom: 40 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  eyebrow: {
    fontSize: 11,
    fontWeight: "700",
    color: Colors.primary,
    textTransform: "uppercase",
  },
  title: { fontSize: 22, fontWeight: "700", color: Colors.text, marginTop: 4 },
  tabs: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 14, marginBottom: 12 },
  tab: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tabOn: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  tabText: { fontSize: 13, fontWeight: "600", color: Colors.textSecondary },
  tabTextOn: { color: "#fff" },
  searchRow: { gap: 8, marginBottom: 12 },
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
  searchBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  searchBtnText: { color: "#fff", fontWeight: "700" },
  card: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 16,
    padding: 14,
    backgroundColor: Colors.surface,
    marginBottom: 10,
  },
  row: { flexDirection: "row", gap: 10 },
  logo: { width: 48, height: 48, borderRadius: 10 },
  logoFallback: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
  },
  logoLetter: { fontWeight: "800", color: Colors.primary, fontSize: 18 },
  cardTitle: { fontSize: 16, fontWeight: "700", color: Colors.text },
  meta: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
  snippet: { fontSize: 13, color: Colors.textSecondary, marginTop: 4 },
  body: { fontSize: 14, color: Colors.text, marginTop: 8, lineHeight: 20 },
  postImg: { width: "100%", height: 180, borderRadius: 12, marginTop: 10 },
  empty: { fontSize: 14, color: Colors.textSecondary, marginTop: 16 },
  error: { color: Colors.danger, marginTop: 8 },
  back: { fontSize: 14, fontWeight: "700", color: Colors.primary, marginBottom: 10 },
  actions: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 12 },
  action: {
    borderWidth: 1,
    borderColor: "#BFDBFE",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
    backgroundColor: "#fff",
  },
  actionText: { fontSize: 12, fontWeight: "700", color: Colors.primary },
  section: {
    marginTop: 22,
    fontSize: 12,
    fontWeight: "800",
    color: Colors.textSecondary,
    textTransform: "uppercase",
  },
  channelCard: {
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 12,
  },
  cover: { height: 92 },
  coverTall: { height: 150 },
  coverImg: { width: "100%", height: "100%" },
  channelBody: { paddingHorizontal: 14, paddingBottom: 14, paddingTop: 22 },
  logoOverlap: {
    width: 48,
    height: 48,
    borderRadius: 12,
    marginTop: -36,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: "#fff",
  },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 8 },
  chip: { fontSize: 11, fontWeight: "700" },
  profileWrap: { paddingBottom: 40 },
  profileCard: {
    marginTop: -28,
    marginHorizontal: 12,
    backgroundColor: Colors.surface,
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  profileLogo: {
    width: 72,
    height: 72,
    borderRadius: 18,
    marginTop: -40,
    borderWidth: 3,
    borderColor: "#fff",
  },
  backPill: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: "rgba(0,0,0,0.45)",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  backPillText: { color: "#fff", fontWeight: "700", fontSize: 12 },
  pageTabs: { flexDirection: "row", gap: 16, marginTop: 16, marginBottom: 8 },
  pageTab: { paddingVertical: 6 },
  pageTabText: { fontSize: 14, fontWeight: "700", color: Colors.textSecondary },
});
