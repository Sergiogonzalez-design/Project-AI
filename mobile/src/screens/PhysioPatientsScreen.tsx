import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Keyboard,
  Platform,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { DismissKeyboard } from "../components/DismissKeyboard";
import { ScreenScrollView } from "../components/ScreenScrollView";
import { PhysioAvatar } from "../components/PhysioAvatar";
import { PhysioIntro } from "../components/PhysioIntro";
import {
  AiOrientationDisclaimer,
  PhysioReportView,
} from "../components/PhysioReportView";
import { ClinicalReasoningFlow } from "../components/ClinicalReasoningFlow";
import { PhysioAssistantBody } from "../components/PhysioAssistantBody";
import { TypingIndicator } from "../components/TypingIndicator";
import {
  composerBottomInset,
  useKeyboardHeight,
} from "../hooks/useKeyboardHeight";
import { WEB_APP_URL } from "../lib/admin-api";
import { Colors } from "../lib/colors";
import { pickIllustratedTestsForPruebasQuery } from "../lib/clinical-test-images";
import { copyToClipboard } from "../lib/copy-to-clipboard";
import { photoOnlyCaption, uploadConsultPhotoFromUri } from "../lib/consult-photo";
import { supabase } from "../lib/supabase";
import { screenHeaderBarPadding } from "../lib/screen-header-insets";
import type { TabParamList } from "../navigation/AppTabs";
import {
  PhysioClinicInfoCard,
  type PhysioClinicSummary,
} from "../components/PhysioClinicInfoCard";

type PhysioPatient = {
  id: string;
  email: string;
  display_name: string | null;
  created_at: string;
  last_sign_in_at: string | null;
  onboarding_completed: boolean;
};

type ClinicalReport = {
  id: string;
  created_at: string;
  body_area: string | null;
  patient_summary: string | null;
  physio_report: string;
  status: "new" | "viewed";
};

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  image_url?: string | null;
};

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function PhysioPatientsScreen() {
  const navigation = useNavigation<BottomTabNavigationProp<TabParamList>>();
  const insets = useSafeAreaInsets();
  const keyboardHeight = useKeyboardHeight();
  const composerInset = composerBottomInset(keyboardHeight);
  /** Subviews hide the tab header — pad under status bar / notch. */
  const subviewHeaderPad = screenHeaderBarPadding(insets);
  const [patients, setPatients] = useState<PhysioPatient[]>([]);
  const [unreadByPatient, setUnreadByPatient] = useState<Record<string, number>>({});
  const [recentReports, setRecentReports] = useState<
    {
      id: string;
      created_at: string;
      body_area: string | null;
      status: string;
      patient_id: string;
    }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [codeBusy, setCodeBusy] = useState(false);
  const [copied, setCopied] = useState<"code" | "link" | null>(null);
  const [codeMenuOpen, setCodeMenuOpen] = useState(false);
  const [vinculacionOpen, setVinculacionOpen] = useState(false);
  const [physioName, setPhysioName] = useState<string | null>(null);
  const [clinicName, setClinicName] = useState<string | null>(null);
  const [clinic, setClinic] = useState<PhysioClinicSummary | null>(null);
  const [claimCode, setClaimCode] = useState("");
  const [claimBusy, setClaimBusy] = useState(false);
  const [claimError, setClaimError] = useState<string | null>(null);
  const inviteLink = inviteCode
    ? `${WEB_APP_URL}/login?code=${encodeURIComponent(inviteCode)}`
    : null;

  const [selectedPatient, setSelectedPatient] = useState<PhysioPatient | null>(null);
  const [reports, setReports] = useState<ClinicalReport[]>([]);
  const [reportsLoading, setReportsLoading] = useState(false);
  const [expandedReportId, setExpandedReportId] = useState<string | null>(null);
  const [reasoningReport, setReasoningReport] = useState<ClinicalReport | null>(
    null
  );

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hola. Soy Physio, el asistente clínico de AIKinora para fisioterapeutas. Pregúntame por diferenciales, maniobras (Neer, Hawkins, Lachman, Spurling…), interpretación de hallazgos o criterio de imagen.",
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [physioIntro, setPhysioIntro] = useState(true);
  const [attachedUri, setAttachedUri] = useState<string | null>(null);
  const [attachedMime, setAttachedMime] = useState("image/jpeg");
  const detailScrollRef = useRef<ScrollView>(null);
  const listScrollRef = useRef<ScrollView>(null);

  function clearAttachment() {
    setAttachedUri(null);
    setAttachedMime("image/jpeg");
  }

  useFocusEffect(
    useCallback(() => {
      const inSubView =
        chatOpen || selectedPatient != null || reasoningReport != null;
      navigation.setOptions({ headerShown: !inSubView });
    }, [navigation, chatOpen, selectedPatient, reasoningReport])
  );

  useEffect(() => {
    if (selectedPatient && !chatOpen && !reasoningReport) {
      detailScrollRef.current?.scrollTo({ y: 0, animated: false });
    }
  }, [selectedPatient, chatOpen, reasoningReport]);

  useEffect(() => {
    if (!selectedPatient && !chatOpen && !reasoningReport) {
      listScrollRef.current?.scrollTo({ y: 0, animated: false });
    }
  }, [selectedPatient, chatOpen, reasoningReport]);

  function pickConsultPhoto() {
    Alert.alert("Adjuntar foto", undefined, [
      {
        text: "Hacer foto",
        onPress: () => {
          void (async () => {
            const permission = await ImagePicker.requestCameraPermissionsAsync();
            if (!permission.granted) {
              Alert.alert("Error", "Necesitamos permiso de cámara.");
              return;
            }
            const result = await ImagePicker.launchCameraAsync({
              mediaTypes: ["images"],
              quality: 0.8,
            });
            if (result.canceled || !result.assets[0]) return;
            setAttachedUri(result.assets[0].uri);
            setAttachedMime(result.assets[0].mimeType ?? "image/jpeg");
          })();
        },
      },
      {
        text: "Elegir de la galería",
        onPress: () => {
          void (async () => {
            const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (!permission.granted) {
              Alert.alert("Error", "Necesitamos permiso de galería.");
              return;
            }
            const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ["images"],
              quality: 0.8,
            });
            if (result.canceled || !result.assets[0]) return;
            setAttachedUri(result.assets[0].uri);
            setAttachedMime(result.assets[0].mimeType ?? "image/jpeg");
          })();
        },
      },
      { text: "Cancelar", style: "cancel" },
    ]);
  }

  async function uploadOutgoingPhoto(): Promise<string | null> {
    if (!attachedUri) return null;
    const url = await uploadConsultPhotoFromUri(attachedUri, attachedMime);
    clearAttachment();
    return url;
  }

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("display_name, clinic_name, clinic_id")
        .eq("id", user.id)
        .single();
      setPhysioName(profile?.display_name ?? null);
      setClinicName(profile?.clinic_name ?? null);
    }

    const { data: clinicRow } = await supabase.rpc("clinic_get_own");
    if (clinicRow && typeof clinicRow === "object" && "id" in clinicRow && clinicRow.id) {
      const row = clinicRow as PhysioClinicSummary;
      setClinic(row);
      if (row.name) setClinicName(row.name);
      // Keep profile.clinic_name aligned with the org (invite clinic).
      if (user && row.name) {
        void supabase
          .from("profiles")
          .update({ clinic_name: row.name, clinic_id: row.id })
          .eq("id", user.id);
      }
    } else {
      setClinic(null);
    }

    const { data: code, error: codeError } = await supabase.rpc(
      "physio_get_or_create_invite_code"
    );
    if (codeError) setError(codeError.message);
    else setInviteCode((code as string) ?? null);

    const { data, error: rpcError } = await supabase.rpc("physio_list_patients");
    if (rpcError) {
      setError(rpcError.message);
      setPatients([]);
      setLoading(false);
      return;
    }
    setPatients((data as PhysioPatient[]) ?? []);

    const { data: recentRows } = await supabase
      .from("clinical_reports")
      .select("id, created_at, body_area, status, patient_id")
      .order("created_at", { ascending: false })
      .limit(20);
    setRecentReports(
      (recentRows as {
        id: string;
        created_at: string;
        body_area: string | null;
        status: string;
        patient_id: string;
      }[]) ?? []
    );

    const { data: reportRows } = await supabase
      .from("clinical_reports")
      .select("patient_id, status");
    const counts: Record<string, number> = {};
    for (const r of (reportRows as { patient_id: string; status: string }[]) ?? []) {
      if (r.status === "new") counts[r.patient_id] = (counts[r.patient_id] ?? 0) + 1;
    }
    setUnreadByPatient(counts);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function claimClinic() {
    const code = claimCode.trim();
    if (!code) {
      setClaimError("Introduce el código de alta de tu clínica.");
      return;
    }
    setClaimBusy(true);
    setClaimError(null);
    try {
      const { data, error: rpcError } = await supabase.rpc("clinic_claim_invite", {
        p_token: code,
      });
      if (rpcError) throw new Error(rpcError.message);
      const row = (Array.isArray(data) ? data[0] : data) as PhysioClinicSummary | null;
      if (!row?.id) throw new Error("No se pudo vincular la clínica.");
      setClinic(row);
      setClinicName(row.name);
      setClaimCode("");
      await load();
    } catch (e) {
      setClaimError(e instanceof Error ? e.message : "No se pudo vincular.");
    } finally {
      setClaimBusy(false);
    }
  }

  async function regenerateCode() {
    setCodeBusy(true);
    setError(null);
    const { data, error: rpcError } = await supabase.rpc(
      "physio_regenerate_invite_code"
    );
    setCodeBusy(false);
    if (rpcError) {
      setError(rpcError.message);
      return;
    }
    setInviteCode((data as string) ?? null);
    setCopied(null);
  }

  async function copyText(kind: "code" | "link", value: string) {
    setError(null);
    setCodeMenuOpen(false);
    const ok = await copyToClipboard(value);
    if (!ok) {
      try {
        await Share.share({ message: value });
        return;
      } catch {
        setError(
          kind === "link"
            ? "No se pudo copiar el enlace."
            : "No se pudo copiar el código."
        );
        return;
      }
    }
    setCopied(kind);
    setTimeout(() => setCopied(null), 2000);
  }

  async function shareLink() {
    if (!inviteLink || !inviteCode) return;
    setCodeMenuOpen(false);
    try {
      await Share.share(
        Platform.OS === "ios"
          ? {
              url: inviteLink,
              message: `Usa este enlace para vincularte en AIKinora (código ${inviteCode})`,
            }
          : {
              title: "AIKinora — vinculación con tu fisioterapeuta",
              message: `Usa este enlace para vincularte en AIKinora (código ${inviteCode}):\n${inviteLink}`,
            }
      );
    } catch {
      await copyText("link", inviteLink);
    }
  }

  async function openPatient(patient: PhysioPatient) {
    setSelectedPatient(patient);
    setReports([]);
    setExpandedReportId(null);
    setReportsLoading(true);
    const { data } = await supabase
      .from("clinical_reports")
      .select("id, created_at, body_area, patient_summary, physio_report, status")
      .eq("patient_id", patient.id)
      .order("created_at", { ascending: false });
    const list = (data as ClinicalReport[]) ?? [];
    setReports(list);
    setReportsLoading(false);

    // Opening this patient's informes clears the "nuevo" badge on the list.
    const newIds = list.filter((r) => r.status === "new").map((r) => r.id);
    if (newIds.length === 0) return;

    const { error: updateError } = await supabase
      .from("clinical_reports")
      .update({ status: "viewed", viewed_at: new Date().toISOString() })
      .in("id", newIds)
      .eq("status", "new");

    if (!updateError) {
      setReports((prev) =>
        prev.map((r) => (newIds.includes(r.id) ? { ...r, status: "viewed" } : r))
      );
      setUnreadByPatient((prev) => ({ ...prev, [patient.id]: 0 }));
    }
  }

  async function toggleReport(report: ClinicalReport) {
    const next = expandedReportId === report.id ? null : report.id;
    setExpandedReportId(next);
    if (next && report.status === "new") {
      const { error: updateError } = await supabase
        .from("clinical_reports")
        .update({ status: "viewed", viewed_at: new Date().toISOString() })
        .eq("id", report.id);
      if (!updateError) {
        setReports((prev) =>
          prev.map((r) => (r.id === report.id ? { ...r, status: "viewed" } : r))
        );
        setUnreadByPatient((prev) => {
          if (!selectedPatient) return prev;
          const count = Math.max(0, (prev[selectedPatient.id] ?? 0) - 1);
          return { ...prev, [selectedPatient.id]: count };
        });
      }
    }
  }

  async function sendClinicalChat() {
    const text = chatInput.trim() || (attachedUri ? photoOnlyCaption("es") : "");
    if ((!text && !attachedUri) || chatLoading) return;
    setChatInput("");
    setChatLoading(true);
    try {
      const imageUrl = await uploadOutgoingPhoto();
      const userMsg: ChatMessage = {
        id: `${Date.now()}-u`,
        role: "user",
        content: text,
        image_url: imageUrl,
      };
      setChatMessages((prev) => [...prev, userMsg]);
      const history = [...chatMessages, userMsg]
        .filter((m) => m.id !== "welcome")
        .map((m) => ({ role: m.role, content: m.content }));
      const { data, error: fnError } = await supabase.functions.invoke("ai-consult", {
        body: {
          mode: "physio_chat",
          message: text,
          conversationHistory: history.slice(-12),
          language: "es",
          ...(imageUrl ? { imageUrl } : {}),
        },
      });
      if (fnError) throw fnError;
      const answer =
        (data as { answer?: string } | null)?.answer?.trim() ||
        "No he podido generar una respuesta.";
      setChatMessages((prev) => [
        ...prev,
        { id: `${Date.now()}-a`, role: "assistant", content: answer },
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error en la consulta clínica.");
    } finally {
      setChatLoading(false);
    }
  }

  if (chatOpen) {
    return (
      <View style={[styles.root, { paddingBottom: composerInset }]}>
        <View style={[styles.detailHeader, subviewHeaderPad]}>
          <Pressable
            style={styles.backBtn}
            onPress={() => {
              setChatOpen(false);
              setPhysioIntro(true);
              clearAttachment();
            }}
            accessibilityLabel="Volver al panel"
            hitSlop={8}
          >
            <Ionicons name="arrow-back" size={22} color={Colors.text} />
          </Pressable>
          <Text style={styles.detailTitle}>Consulta clínica</Text>
        </View>

        {physioIntro ? (
          <PhysioIntro
            greeting="¡Hola! Soy Physio. Esta consulta es técnica, pensada para fisioterapeutas. ¿En qué puedo ayudarte?"
            onSkip={() => setPhysioIntro(false)}
          />
        ) : (
          <>
            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
              keyboardShouldPersistTaps="handled"
            >
              {chatMessages.map((m, msgIndex) => {
                const prevUser =
                  m.role === "assistant"
                    ? [...chatMessages.slice(0, msgIndex)]
                        .reverse()
                        .find((x) => x.role === "user")
                    : undefined;
                const pruebasFallback = prevUser
                  ? pickIllustratedTestsForPruebasQuery(prevUser.content)
                  : [];
                return (
                <View
                  key={m.id}
                  style={[
                    styles.chatRow,
                    m.role === "user" ? styles.chatRowUser : styles.chatRowAssistant,
                  ]}
                >
                  {m.role === "assistant" ? (
                    <PhysioAvatar size={32} style={{ marginRight: 8 }} />
                  ) : null}
                  <View
                    style={[
                      styles.chatBubble,
                      m.role === "user" ? styles.chatUser : styles.chatAssistant,
                    ]}
                  >
                    {m.role === "user" ? (
                      <View>
                        {m.image_url ? (
                          <Image
                            source={{ uri: m.image_url }}
                            style={styles.chatImage}
                            resizeMode="cover"
                          />
                        ) : null}
                        {m.content ? (
                          <Text style={styles.chatUserText}>{m.content}</Text>
                        ) : null}
                      </View>
                    ) : (
                      <PhysioAssistantBody
                        text={m.content}
                        fallbackTests={pruebasFallback}
                      />
                    )}
                  </View>
                </View>
                );
              })}
              {chatLoading ? (
                <View style={[styles.chatRow, styles.chatRowAssistant]}>
                  <PhysioAvatar size={32} style={{ marginRight: 8 }} />
                  <View style={[styles.chatBubble, styles.chatAssistant, styles.loadingBubble]}>
                    <TypingIndicator />
                  </View>
                </View>
              ) : null}
            </ScrollView>
            <View style={styles.chatInputWrap}>
              {attachedUri ? (
                <View style={styles.attachPreviewRow}>
                  <Image source={{ uri: attachedUri }} style={styles.attachPreview} />
                  <Pressable onPress={clearAttachment} hitSlop={8}>
                    <Text style={styles.removePhotoText}>Quitar foto</Text>
                  </Pressable>
                </View>
              ) : null}
              <View style={styles.chatInputBar}>
                <TextInput
                  value={chatInput}
                  onChangeText={setChatInput}
                  placeholder="Pregunta clínica…"
                  placeholderTextColor={Colors.textLight}
                  style={[styles.input, { marginBottom: 0, flex: 1 }]}
                />
                <Pressable
                  onPress={pickConsultPhoto}
                  disabled={chatLoading}
                  style={({ pressed }) => [
                    styles.attachBtn,
                    pressed && { backgroundColor: Colors.primarySoft },
                    chatLoading && { opacity: 0.5 },
                  ]}
                  accessibilityLabel="Adjuntar foto"
                >
                  <Ionicons name="camera-outline" size={20} color={Colors.text} />
                </Pressable>
                <Pressable
                  onPress={() => void sendClinicalChat()}
                  disabled={chatLoading || (!chatInput.trim() && !attachedUri)}
                  style={({ pressed }) => [
                    styles.sendBtn,
                    pressed && { opacity: 0.9 },
                    (chatLoading || (!chatInput.trim() && !attachedUri)) && { opacity: 0.5 },
                  ]}
                >
                  <Ionicons name="arrow-up" size={20} color={Colors.white} />
                </Pressable>
              </View>
            </View>
          </>
        )}
      </View>
    );
  }

  if (selectedPatient && reasoningReport) {
    return (
      <ClinicalReasoningFlow
        reportId={reasoningReport.id}
        bodyArea={reasoningReport.body_area}
        physioReport={reasoningReport.physio_report}
        patientName={
          selectedPatient.display_name || selectedPatient.email || null
        }
        onClose={() => setReasoningReport(null)}
      />
    );
  }

  if (selectedPatient) {
    return (
      <View style={styles.root}>
        <View style={[styles.detailHeader, subviewHeaderPad]}>
          <Pressable
            style={styles.backBtn}
            onPress={() => setSelectedPatient(null)}
            accessibilityLabel="Volver a pacientes"
            hitSlop={8}
          >
            <Ionicons name="arrow-back" size={22} color={Colors.text} />
          </Pressable>
          <Text style={styles.detailTitle} numberOfLines={1}>
            {selectedPatient.display_name || selectedPatient.email}
          </Text>
        </View>
        <ScreenScrollView ref={detailScrollRef} contentContainerStyle={styles.container}>
          {reportsLoading ? (
            <ActivityIndicator color={Colors.primary} style={{ marginTop: 24 }} />
          ) : reports.length === 0 ? (
            <View style={styles.card}>
              <Text style={styles.userMeta}>
                Este paciente todavía no ha completado ninguna consulta.
              </Text>
            </View>
          ) : (
            reports.map((report) => {
              const isOpen = expandedReportId === report.id;
              return (
                <View key={report.id} style={styles.reportCard}>
                  <Pressable
                    style={styles.reportHeader}
                    onPress={() => void toggleReport(report)}
                  >
                    <View style={{ flex: 1, minWidth: 0 }}>
                      <View style={styles.userTitleRow}>
                        <Text style={styles.userEmail} numberOfLines={1}>
                          {report.body_area || "Consulta"}
                        </Text>
                        {report.status === "new" && (
                          <View style={styles.newBadge}>
                            <Text style={styles.newBadgeText}>Nuevo</Text>
                          </View>
                        )}
                      </View>
                      <Text style={styles.userMeta}>{formatDate(report.created_at)}</Text>
                    </View>
                    <Ionicons
                      name={isOpen ? "chevron-up" : "chevron-down"}
                      size={18}
                      color={Colors.textLight}
                    />
                  </Pressable>
                  {isOpen && (
                    <View style={styles.reportBodyWrap}>
                      <Text style={styles.reportSectionLabel}>
                        Informe clínico pre-visita
                      </Text>
                      <PhysioReportView
                        content={report.physio_report}
                        bodyArea={report.body_area}
                        onStartClinicalReasoning={() =>
                          setReasoningReport(report)
                        }
                      />
                    </View>
                  )}
                </View>
            );
          })
        )}
        </ScreenScrollView>
      </View>
    );
  }

  return (
    <DismissKeyboard>
      <ScreenScrollView
        ref={listScrollRef}
        style={styles.root}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        onScrollBeginDrag={Keyboard.dismiss}
      >
        <Text style={styles.title}>
          Bienvenido/a{physioName ? `, ${physioName}` : ""}
          {clinicName ? ` · ${clinicName}` : ""}
        </Text>
        <AiOrientationDisclaimer style={{ marginBottom: 12 }} />

        {clinic ? (
          <PhysioClinicInfoCard clinic={clinic} />
        ) : !loading ? (
          <View style={styles.claimCard}>
            <Text style={styles.claimTitle}>Vincula tu clínica</Text>
            <Text style={styles.claimLead}>
              Tu cuenta aún no está unida a una clínica. Pide el código de alta
              al titular e introdúcelo aquí para ver la ficha del centro.
            </Text>
            <TextInput
              style={styles.claimInput}
              value={claimCode}
              onChangeText={(v) => setClaimCode(v.toUpperCase())}
              placeholder="Código de alta (ej. AB12CD)"
              placeholderTextColor={Colors.textLight}
              autoCapitalize="characters"
              autoCorrect={false}
            />
            {claimError ? <Text style={styles.errorText}>{claimError}</Text> : null}
            <Pressable
              style={styles.claimBtn}
              onPress={() => void claimClinic()}
              disabled={claimBusy}
            >
              {claimBusy ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.claimBtnText}>Vincular clínica</Text>
              )}
            </Pressable>
          </View>
        ) : null}

        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {!loading && recentReports.length > 0 ? (
          <View style={{ marginBottom: 8 }}>
            <Text style={styles.listHeaderText}>Informes recientes</Text>
            <Text style={[styles.userMeta, { marginBottom: 10 }]}>
              Enviados a esta cuenta (también con solo el código).
            </Text>
            {recentReports.map((report) => {
              const patient = patients.find((p) => p.id === report.patient_id);
              const label =
                patient?.display_name || patient?.email || "Paciente";
              return (
                <Pressable
                  key={report.id}
                  style={styles.userCard}
                  onPress={() => {
                    if (patient) void openPatient(patient);
                    else {
                      void openPatient({
                        id: report.patient_id,
                        email: label,
                        display_name: label,
                        created_at: report.created_at,
                        last_sign_in_at: null,
                        onboarding_completed: false,
                      });
                    }
                  }}
                >
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <View style={styles.userTitleRow}>
                      <Text style={styles.userEmail} numberOfLines={1}>
                        {label}
                      </Text>
                      {report.status === "new" ? (
                        <View style={styles.newBadge}>
                          <Text style={styles.newBadgeText}>1</Text>
                        </View>
                      ) : null}
                    </View>
                    <Text style={styles.userMeta} numberOfLines={1}>
                      {report.body_area || "Consulta"} ·{" "}
                      {formatDate(report.created_at)}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        ) : null}

        <View style={styles.listHeader}>
          <Text style={styles.listHeaderText}>
            {patients.length} paciente{patients.length === 1 ? "" : "s"}
          </Text>
          <Pressable onPress={() => void load()}>
            <Text style={styles.refresh}>Actualizar</Text>
          </Pressable>
        </View>

        {loading ? (
          <ActivityIndicator color={Colors.primary} style={{ marginTop: 24 }} />
        ) : patients.length === 0 ? (
          <Text style={styles.userMeta}>
            Todavía no hay pacientes ni informes en esta cuenta. Abre Vinculación
            para compartir tu código y pulsa Actualizar cuando el paciente termine.
          </Text>
        ) : (
          patients.map((patient) => {
            const unread = unreadByPatient[patient.id] ?? 0;
            return (
              <Pressable
                key={patient.id}
                style={styles.userCard}
                onPress={() => void openPatient(patient)}
              >
                <View style={{ flex: 1, minWidth: 0 }}>
                  <View style={styles.userTitleRow}>
                    <Text style={styles.userEmail} numberOfLines={1}>
                      {patient.display_name || patient.email}
                    </Text>
                    {unread > 0 && (
                      <View style={styles.newBadge}>
                        <Text style={styles.newBadgeText}>{unread}</Text>
                      </View>
                    )}
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={18} color={Colors.textLight} />
              </Pressable>
            );
          })
        )}

        <Pressable
          onPress={() => {
            setVinculacionOpen((v) => !v);
            if (vinculacionOpen) setCodeMenuOpen(false);
          }}
          style={({ pressed }) => [
            styles.vinculacionBtn,
            pressed && { backgroundColor: Colors.background },
          ]}
          accessibilityRole="button"
          accessibilityState={{ expanded: vinculacionOpen }}
        >
          <Text style={styles.vinculacionBtnText}>Vinculación</Text>
          <Ionicons
            name={vinculacionOpen ? "chevron-up" : "chevron-down"}
            size={18}
            color={Colors.textSecondary}
          />
        </Pressable>

        {vinculacionOpen ? (
          <View style={styles.card}>
            <View style={styles.codeMenuWrap} pointerEvents="box-none">
              <Pressable
                onPress={() => setCodeMenuOpen((v) => !v)}
                disabled={!inviteCode && !codeBusy}
                style={({ pressed }) => [
                  styles.codeMenuBtn,
                  pressed && { backgroundColor: Colors.background },
                  !inviteCode && !codeBusy && { opacity: 0.5 },
                ]}
                accessibilityLabel={codeMenuOpen ? "Cerrar opciones" : "Más opciones"}
              >
                <Ionicons
                  name={codeMenuOpen ? "close" : "ellipsis-vertical"}
                  size={18}
                  color={Colors.text}
                />
              </Pressable>
              {codeMenuOpen ? (
                <View style={styles.codeMenu}>
                  <Pressable
                    disabled={!inviteLink}
                    onPress={() => {
                      setCodeMenuOpen(false);
                      void shareLink();
                    }}
                    style={({ pressed }) => [
                      styles.codeMenuItem,
                      pressed && { backgroundColor: Colors.background },
                      !inviteLink && { opacity: 0.5 },
                    ]}
                  >
                    <Text style={styles.codeMenuItemText}>
                      {copied === "link" ? "Enlace copiado" : "Copiar / compartir enlace"}
                    </Text>
                  </Pressable>
                  <Pressable
                    disabled={codeBusy}
                    onPress={() => {
                      setCodeMenuOpen(false);
                      void regenerateCode();
                    }}
                    style={({ pressed }) => [
                      styles.codeMenuItem,
                      pressed && { backgroundColor: Colors.background },
                      codeBusy && { opacity: 0.5 },
                    ]}
                  >
                    <Text style={styles.codeMenuItemText}>
                      {codeBusy ? "Generando…" : "Generar nuevo código"}
                    </Text>
                  </Pressable>
                </View>
              ) : null}
            </View>

            <Text style={styles.cardTitle}>Tu código de vinculación</Text>
            <Text style={styles.cardSubtitle}>
              El paciente lo introduce una vez en AIKinora, o abre el enlace directo.
            </Text>

            <View style={styles.codeBox}>
              <Text style={styles.codeDisplay}>
                {inviteCode ?? (loading ? "…" : "—")}
              </Text>
            </View>
            <Pressable
              onPress={() => inviteCode && void copyText("code", inviteCode)}
              disabled={!inviteCode}
              hitSlop={8}
              style={({ pressed }) => [
                styles.copyBtn,
                pressed && { backgroundColor: Colors.background },
                !inviteCode && { opacity: 0.5 },
              ]}
            >
              <Text style={styles.copyBtnText}>
                {copied === "code" ? "Copiado" : "Copiar código"}
              </Text>
            </Pressable>

            {inviteLink ? (
              <>
                <View style={styles.linkBox}>
                  <Text style={styles.linkText} selectable>
                    {inviteLink}
                  </Text>
                </View>
                <Pressable
                  onPress={() => void copyText("link", inviteLink)}
                  hitSlop={8}
                  style={({ pressed }) => [
                    styles.copyBtn,
                    pressed && { backgroundColor: Colors.background },
                  ]}
                >
                  <Text style={styles.copyBtnText}>
                    {copied === "link" ? "Copiado" : "Copiar enlace"}
                  </Text>
                </Pressable>
              </>
            ) : null}

            <Text style={styles.cardFoot}>
              Si regeneras el código, los pacientes ya vinculados siguen vinculados;
              solo cambia el código para nuevos pacientes.
            </Text>
          </View>
        ) : null}
      </ScreenScrollView>
    </DismissKeyboard>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  container: { padding: 20, paddingBottom: 48 },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: Colors.text,
    letterSpacing: -0.6,
  },
  subtitle: {
    marginTop: 6,
    marginBottom: 18,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.textSecondary,
  },
  errorBox: {
    backgroundColor: "#FEF2F2",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  errorText: { color: "#991B1B", fontSize: 13 },
  claimCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
  },
  claimTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: Colors.text,
  },
  claimLead: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 18,
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  claimInput: {
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 2,
    color: Colors.text,
    backgroundColor: Colors.background,
    marginBottom: 10,
  },
  claimBtn: {
    marginTop: 4,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  claimBtnText: { color: "#fff", fontWeight: "700", fontSize: 15 },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
    overflow: "visible",
  },
  vinculacionBtn: {
    marginTop: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  vinculacionBtnText: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.text,
  },
  codeMenuWrap: {
    position: "absolute",
    right: 16,
    top: 16,
    zIndex: 20,
    alignItems: "flex-end",
  },
  codeMenuBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.white,
  },
  codeMenu: {
    marginTop: 4,
    minWidth: 216,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
    paddingVertical: 4,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
  codeMenuItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  codeMenuItemText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text,
    paddingRight: 48,
  },
  cardSubtitle: {
    marginTop: 4,
    marginBottom: 16,
    fontSize: 13,
    lineHeight: 18,
    color: Colors.textSecondary,
    paddingRight: 48,
  },
  codeBox: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#BFDBFE",
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 10,
  },
  codeDisplay: {
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: 4.8,
    color: Colors.primaryDark,
    textAlign: "center",
    fontVariant: ["tabular-nums"],
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },
  linkBox: {
    marginTop: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 10,
  },
  linkText: {
    fontSize: 12,
    lineHeight: 18,
    color: Colors.textSecondary,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },
  copyBtn: {
    minHeight: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  copyBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#334155",
  },
  cardFoot: {
    marginTop: 12,
    fontSize: 12,
    lineHeight: 16,
    color: Colors.textLight,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.borderStrong,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: Colors.text,
    marginBottom: 10,
    backgroundColor: Colors.background,
  },
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  listHeaderText: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.textSecondary,
  },
  refresh: { fontSize: 13, fontWeight: "700", color: Colors.primary },
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 10,
  },
  userTitleRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  userEmail: {
    flexShrink: 1,
    fontSize: 14,
    fontWeight: "700",
    color: Colors.text,
  },
  userMeta: { marginTop: 4, fontSize: 12, color: Colors.textSecondary },
  newBadge: {
    backgroundColor: Colors.primary,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  newBadgeText: {
    fontSize: 10,
    fontWeight: "800",
    color: Colors.white,
  },
  detailHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 14,
    backgroundColor: Colors.white,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primarySoft,
  },
  detailTitle: {
    flex: 1,
    minWidth: 0,
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: -0.2,
    color: Colors.text,
    paddingRight: 8,
  },
  reportCard: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 10,
    overflow: "hidden",
  },
  reportHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 14,
  },
  reportBodyWrap: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.border,
    padding: 14,
  },
  reportSectionLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: Colors.primary,
    textTransform: "uppercase",
    letterSpacing: 0.4,
    marginBottom: 8,
  },
  reportBody: { fontSize: 14, lineHeight: 20, color: Colors.text },
  reportBodyBold: { fontWeight: "700", color: Colors.text },
  numberedTitle: { fontWeight: "700", color: Colors.primary },
  loadingBubble: { paddingVertical: 14, paddingHorizontal: 16 },
  chatBubble: {
    borderRadius: 16,
    padding: 12,
    maxWidth: "85%",
  },
  chatRow: {
    flexDirection: "row",
    marginBottom: 12,
    alignItems: "flex-start",
  },
  chatRowUser: { justifyContent: "flex-end" },
  chatRowAssistant: { justifyContent: "flex-start" },
  chatUser: {
    backgroundColor: Colors.primary,
  },
  chatAssistant: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chatUserText: { color: Colors.white, fontSize: 14, lineHeight: 20 },
  chatImage: {
    width: 200,
    height: 150,
    borderRadius: 10,
    marginBottom: 8,
  },
  chatInputWrap: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.border,
    backgroundColor: Colors.white,
  },
  attachPreviewRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 12,
    paddingTop: 10,
  },
  attachPreview: {
    width: 56,
    height: 56,
    borderRadius: 10,
  },
  removePhotoText: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.textSecondary,
  },
  chatInputBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
  },
  attachBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
  },
  sendBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.text,
    alignItems: "center",
    justifyContent: "center",
  },
});
