import { useRoute } from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";
import * as Clipboard from "expo-clipboard";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { PhysioReportView } from "../components/PhysioReportView";
import { StaffPatientProfileEditor } from "../components/StaffPatientProfileEditor";
import {
  StaffPatientNotesCard,
  StaffReportNotesField,
} from "../components/StaffPatientNotes";
import { Colors } from "../lib/colors";
import {
  buildConsultaNumberMap,
  formatConsultaLabel,
  summarizeConsultaHistory,
} from "../lib/consulta-history";
import { staffPatientLabel, staffVisibleEmail } from "../lib/guest-account";
import { useI18n } from "../lib/i18n";
import {
  buildPhysioInviteUrl,
  buildPhysioWhatsAppInviteUrl,
} from "../lib/physio-invite";
import { supabase } from "../lib/supabase";
import type { TabParamList } from "../navigation/AppTabs";
import { ClinicTeamPanel } from "./ClinicTeamScreen";

type ClinicPatient = {
  id: string;
  email: string | null;
  display_name: string | null;
  created_at: string;
  physio_id?: string | null;
  physio_name?: string | null;
};

type ClinicalReport = {
  id: string;
  created_at: string;
  body_area: string | null;
  patient_summary: string | null;
  physio_report: string;
  status: "new" | "viewed";
  staff_notes: string | null;
};

export function ClinicPatientsScreen() {
  const { t, locale } = useI18n();
  const hub = t.clinicHub;
  const route = useRoute<RouteProp<TabParamList, "ClinicPatients">>();
  const initialTab =
    route.params?.tab === "fisios" ? "fisios" : "pacientes";
  const [tab, setTab] = useState<"pacientes" | "fisios">(initialTab);
  const [patients, setPatients] = useState<ClinicPatient[]>([]);
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<ClinicPatient | null>(null);
  const [reports, setReports] = useState<ClinicalReport[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [reportsLoading, setReportsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<"code" | "link" | "wa" | null>(null);
  const [codeBusy, setCodeBusy] = useState(false);
  const [codeMenuOpen, setCodeMenuOpen] = useState(false);
  const [vinculacionOpen, setVinculacionOpen] = useState(true);

  const inviteLink = inviteCode ? buildPhysioInviteUrl(inviteCode) : null;
  const whatsappInviteLink = inviteCode
    ? buildPhysioWhatsAppInviteUrl(inviteCode)
    : null;

  useEffect(() => {
    if (route.params?.tab === "fisios" || route.params?.tab === "pacientes") {
      setTab(route.params.tab);
    }
  }, [route.params?.tab]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const [{ data: code, error: codeErr }, { data: list, error: listErr }] =
      await Promise.all([
        supabase.rpc("clinic_get_or_create_patient_invite_code"),
        supabase.rpc("clinic_list_patients"),
      ]);
    if (codeErr) setError(codeErr.message);
    else setInviteCode((code as string) ?? null);
    if (listErr) setError(listErr.message);
    setPatients((list as ClinicPatient[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function openPatient(patient: ClinicPatient) {
    setSelectedPatient(patient);
    setReportsLoading(true);
    setExpandedId(null);
    const { data, error: err } = await supabase
      .from("clinical_reports")
      .select(
        "id, created_at, body_area, patient_summary, physio_report, status, staff_notes"
      )
      .eq("patient_id", patient.id)
      .order("created_at", { ascending: false });
    if (err) setError(err.message);
    setReports((data as ClinicalReport[]) ?? []);
    setReportsLoading(false);

    const newIds = ((data as ClinicalReport[]) ?? [])
      .filter((r) => r.status === "new")
      .map((r) => r.id);
    if (newIds.length > 0) {
      await supabase
        .from("clinical_reports")
        .update({ status: "viewed", viewed_at: new Date().toISOString() })
        .in("id", newIds)
        .eq("status", "new");
    }
  }

  async function regenerateCode() {
    setCodeBusy(true);
    const { data, error: err } = await supabase.rpc(
      "clinic_regenerate_patient_invite_code"
    );
    setCodeBusy(false);
    if (err) {
      setError(err.message);
      return;
    }
    setInviteCode((data as string) ?? null);
  }

  async function copy(kind: "code" | "link" | "wa", value: string) {
    await Clipboard.setStringAsync(value);
    setCopied(kind);
    setTimeout(() => setCopied(null), 2000);
  }

  async function shareInvite(kind: "web" | "wa" = "web") {
    const url = kind === "wa" ? whatsappInviteLink : inviteLink;
    if (!url || !inviteCode) return;
    const template =
      kind === "wa" ? hub.shareWhatsAppMessage : hub.shareInviteMessage;
    await Share.share({
      message: template
        .replace("{code}", inviteCode)
        .replace("{link}", url),
    });
  }

  const patientsLabel =
    patients.length === 1
      ? hub.patientsCount.replace("{n}", String(patients.length))
      : hub.patientsCountPlural.replace("{n}", String(patients.length));

  if (selectedPatient) {
    const label = staffPatientLabel({
      displayName: selectedPatient.display_name,
      email: selectedPatient.email,
    });
    const consultaNumbers = buildConsultaNumberMap(reports);
    const history = summarizeConsultaHistory(reports);
    return (
      <ScrollView contentContainerStyle={styles.wrap}>
        <Pressable
          onPress={() => setSelectedPatient(null)}
          style={styles.closeBtn}
        >
          <Text style={styles.closeText}>{hub.closePatient}</Text>
        </Pressable>
        <Text style={styles.title}>{label}</Text>
        <Text style={styles.sub}>{hub.patientReports}</Text>
        {!reportsLoading && history.total > 0 ? (
          <View style={styles.historyStats}>
            <View style={styles.historyStat}>
              <Text style={styles.historyStatLabel}>Consultas</Text>
              <Text style={styles.historyStatValue}>{history.total}</Text>
            </View>
            <View style={styles.historyStat}>
              <Text style={styles.historyStatLabel}>Primera</Text>
              <Text style={styles.historyStatValueSm}>
                {history.firstAt
                  ? new Date(history.firstAt).toLocaleDateString(
                      locale === "en" ? "en-GB" : "es-ES"
                    )
                  : "—"}
              </Text>
            </View>
            <View style={styles.historyStat}>
              <Text style={styles.historyStatLabel}>Última</Text>
              <Text style={styles.historyStatValueSm}>
                {history.lastAt
                  ? new Date(history.lastAt).toLocaleDateString(
                      locale === "en" ? "en-GB" : "es-ES"
                    )
                  : "—"}
              </Text>
            </View>
          </View>
        ) : null}
        <StaffPatientProfileEditor
          patientId={selectedPatient.id}
          onDisplayNameChange={(name) => {
            setSelectedPatient((prev) =>
              prev
                ? { ...prev, display_name: name || prev.display_name }
                : prev
            );
          }}
        />
        <StaffPatientNotesCard patientId={selectedPatient.id} />
        <Text style={styles.historyTitle}>
          {locale === "en" ? "Visit history" : "Historial de consultas"}
        </Text>
        {reportsLoading ? (
          <ActivityIndicator color={Colors.primary} style={{ marginTop: 24 }} />
        ) : reports.length === 0 ? (
          <Text style={styles.empty}>{hub.noReports}</Text>
        ) : (
          reports.map((report) => {
            const open = expandedId === report.id;
            const n = consultaNumbers.get(report.id) ?? 0;
            return (
              <View key={report.id} style={styles.card}>
                <Pressable
                  onPress={() => setExpandedId(open ? null : report.id)}
                  style={styles.cardHead}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={styles.cardTitle}>
                      {formatConsultaLabel(
                        n,
                        report.body_area,
                        locale === "en" ? "en" : "es"
                      )}
                      {report.status === "new" ? ` · ${hub.newBadge}` : ""}
                    </Text>
                    <Text style={styles.meta}>
                      {new Date(report.created_at).toLocaleString(
                        locale === "en" ? "en-GB" : "es-ES"
                      )}
                    </Text>
                  </View>
                  <Text style={styles.meta}>{open ? "▲" : "▼"}</Text>
                </Pressable>
                {open ? (
                  <View style={styles.reportBody}>
                    <PhysioReportView content={report.physio_report} />
                    <StaffReportNotesField
                      reportId={report.id}
                      initialNotes={report.staff_notes}
                      onSaved={(notes) =>
                        setReports((prev) =>
                          prev.map((r) =>
                            r.id === report.id
                              ? { ...r, staff_notes: notes }
                              : r
                          )
                        )
                      }
                    />
                  </View>
                ) : null}
              </View>
            );
          })
        )}
      </ScrollView>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.wrap}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>{hub.title}</Text>
      <View style={styles.tabs}>
        <Pressable
          style={[styles.tab, tab === "pacientes" && styles.tabActive]}
          onPress={() => setTab("pacientes")}
        >
          <Text
            style={[styles.tabText, tab === "pacientes" && styles.tabTextActive]}
          >
            {hub.tabPatients}
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tab, tab === "fisios" && styles.tabActive]}
          onPress={() => setTab("fisios")}
        >
          <Text style={[styles.tabText, tab === "fisios" && styles.tabTextActive]}>
            {hub.tabPhysios}
          </Text>
        </Pressable>
      </View>

      {tab === "fisios" ? (
        <ClinicTeamPanel embedded />
      ) : (
        <>
          <Text style={styles.sub}>{hub.patientsLead}</Text>

          <View style={styles.card}>
            <Pressable
              onPress={() => {
                setVinculacionOpen((v) => !v);
                if (vinculacionOpen) setCodeMenuOpen(false);
              }}
              style={styles.vinculacionHead}
              accessibilityRole="button"
              accessibilityState={{ expanded: vinculacionOpen }}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{hub.linkingTitle}</Text>
                <Text style={styles.linkingSubtitle}>
                  {hub.linkingSubtitle}
                </Text>
              </View>
              <Text style={styles.chevron}>{vinculacionOpen ? "▴" : "▾"}</Text>
            </Pressable>

            {vinculacionOpen ? (
              <View style={styles.vinculacionBody}>
                <Text style={styles.hint}>{hub.linkingHint}</Text>
                {inviteLink ? (
                  <Text style={styles.inviteLinkDisplay} selectable>
                    {inviteLink}
                  </Text>
                ) : null}
                <Pressable
                  style={[
                    styles.primaryShareBtn,
                    (!inviteLink || codeBusy) && { opacity: 0.5 },
                  ]}
                  disabled={!inviteLink || codeBusy}
                  onPress={() => void shareInvite("web")}
                >
                  <Text style={styles.primaryShareBtnText}>
                    {copied === "link"
                      ? hub.copied
                      : hub.shareInvite}
                  </Text>
                </Pressable>
                <View style={styles.codeRow}>
                  <View style={styles.actionsWrap}>
                    <Pressable
                      style={[
                        styles.actionsBtn,
                        (!inviteCode || codeBusy) && { opacity: 0.5 },
                      ]}
                      disabled={!inviteCode || codeBusy}
                      onPress={() => setCodeMenuOpen((o) => !o)}
                    >
                      <Text style={styles.actionsBtnText}>{hub.actions}</Text>
                    </Pressable>
                    {codeMenuOpen && inviteCode ? (
                      <View style={styles.codeMenu}>
                        {inviteLink ? (
                          <Pressable
                            style={styles.codeMenuItem}
                            onPress={() => {
                              setCodeMenuOpen(false);
                              void copy("link", inviteLink);
                            }}
                          >
                            <Text style={styles.codeMenuItemText}>
                              {copied === "link" ? hub.copied : hub.copyLink}
                            </Text>
                          </Pressable>
                        ) : null}
                        {whatsappInviteLink ? (
                          <>
                            <Pressable
                              style={styles.codeMenuItem}
                              onPress={() => {
                                setCodeMenuOpen(false);
                                void copy("wa", whatsappInviteLink);
                              }}
                            >
                              <Text style={styles.codeMenuItemText}>
                                {copied === "wa"
                                  ? hub.copied
                                  : hub.copyWhatsApp}
                              </Text>
                            </Pressable>
                            <Pressable
                              style={styles.codeMenuItem}
                              onPress={() => {
                                setCodeMenuOpen(false);
                                void shareInvite("wa");
                              }}
                            >
                              <Text style={styles.codeMenuItemText}>
                                {hub.shareWhatsApp}
                              </Text>
                            </Pressable>
                          </>
                        ) : null}
                        <Pressable
                          style={styles.codeMenuItem}
                          onPress={() => {
                            setCodeMenuOpen(false);
                            void copy("code", inviteCode);
                          }}
                        >
                          <Text style={styles.codeMenuItemText}>
                            {copied === "code" ? hub.copied : hub.copyCode}
                          </Text>
                        </Pressable>
                        <Pressable
                          style={styles.codeMenuItem}
                          disabled={codeBusy}
                          onPress={() => {
                            setCodeMenuOpen(false);
                            void regenerateCode();
                          }}
                        >
                          <Text
                            style={[
                              styles.codeMenuItemText,
                              { color: "#92400E" },
                            ]}
                          >
                            {codeBusy ? hub.creating : hub.newCode}
                          </Text>
                        </Pressable>
                      </View>
                    ) : null}
                  </View>
                </View>
              </View>
            ) : null}
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <View style={styles.listHead}>
            <Text style={styles.cardTitle}>{patientsLabel}</Text>
            <Pressable onPress={() => void load()}>
              <Text style={styles.link}>{hub.refresh}</Text>
            </Pressable>
          </View>

          {loading ? (
            <ActivityIndicator color={Colors.primary} style={{ marginTop: 16 }} />
          ) : patients.length === 0 ? (
            <Text style={styles.empty}>{hub.noPatients}</Text>
          ) : (
            patients.map((p) => (
              <Pressable
                key={p.id}
                style={styles.patientRow}
                onPress={() => void openPatient(p)}
              >
                <View style={{ flex: 1 }}>
                  <Text style={styles.patientName}>
                    {staffPatientLabel({
                      displayName: p.display_name,
                      email: p.email,
                    })}
                  </Text>
                  {staffVisibleEmail(p.email) ? (
                    <Text style={styles.meta}>{staffVisibleEmail(p.email)}</Text>
                  ) : null}
                  <Text style={styles.physioMeta}>
                    {p.physio_name
                      ? hub.physioLabel.replace("{name}", p.physio_name)
                      : hub.unassignedPhysio}
                  </Text>
                </View>
                <Text style={styles.link}>{hub.viewReport}</Text>
              </Pressable>
            ))
          )}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: 16, paddingBottom: 40 },
  closeBtn: {
    alignSelf: "flex-start",
    marginBottom: 10,
    paddingVertical: 6,
    paddingHorizontal: 2,
  },
  closeText: { color: Colors.primary, fontWeight: "700", fontSize: 14 },
  title: { fontSize: 22, fontWeight: "800", color: Colors.text },
  tabs: {
    marginTop: 12,
    marginBottom: 4,
    flexDirection: "row",
    gap: 4,
    padding: 4,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: "#F3F4F6",
  },
  tab: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: "center",
  },
  tabActive: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  tabText: { fontSize: 14, fontWeight: "600", color: Colors.textSecondary },
  tabTextActive: { color: Colors.text, fontWeight: "700" },
  sub: {
    marginTop: 10,
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 14,
  },
  historyStats: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  historyStat: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  historyStatLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: Colors.textLight,
    textTransform: "uppercase",
  },
  historyStatValue: {
    marginTop: 4,
    fontSize: 22,
    fontWeight: "800",
    color: Colors.text,
  },
  historyStatValueSm: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: "700",
    color: Colors.text,
  },
  historyTitle: {
    marginTop: 16,
    marginBottom: 8,
    fontSize: 15,
    fontWeight: "800",
    color: Colors.text,
  },
  card: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 16,
    padding: 14,
    backgroundColor: Colors.surface,
    marginBottom: 12,
    overflow: "visible",
    zIndex: 2,
  },
  vinculacionHead: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  vinculacionBody: {
    marginTop: 12,
  },
  linkingSubtitle: {
    marginTop: 2,
    fontSize: 13,
    color: Colors.textSecondary,
  },
  chevron: { fontSize: 14, color: Colors.textSecondary, paddingHorizontal: 4 },
  hint: {
    fontSize: 13,
    lineHeight: 18,
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  inviteLinkDisplay: {
    marginBottom: 10,
    fontSize: 11,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    color: Colors.textSecondary,
    lineHeight: 16,
  },
  primaryShareBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 10,
  },
  primaryShareBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.white,
    textAlign: "center",
  },
  cardTitle: { fontSize: 16, fontWeight: "700", color: Colors.text },
  codeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 8,
  },
  codePill: {
    backgroundColor: "#F1F5F9",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  code: {
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 3,
    color: Colors.text,
    fontVariant: ["tabular-nums"],
  },
  actionsWrap: { position: "relative", zIndex: 10 },
  actionsBtn: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#fff",
  },
  actionsBtnText: { fontSize: 13, fontWeight: "700", color: Colors.text },
  codeMenu: {
    position: "absolute",
    top: "100%",
    right: 0,
    marginTop: 4,
    minWidth: 220,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
    overflow: "hidden",
  },
  codeMenuItem: {
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  codeMenuItemText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
  },
  row: { flexDirection: "row", gap: 8, marginTop: 10 },
  btn: {
    flex: 1,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontWeight: "700", fontSize: 13 },
  btnSecondary: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: "center",
  },
  btnSecondaryText: { color: Colors.text, fontWeight: "700", fontSize: 13 },
  listHead: {
    marginTop: 8,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  link: { color: Colors.primary, fontWeight: "700", fontSize: 13 },
  patientRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
    padding: 12,
    backgroundColor: Colors.surface,
    marginBottom: 8,
  },
  patientName: { fontSize: 15, fontWeight: "700", color: Colors.text },
  meta: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  physioMeta: { fontSize: 12, color: Colors.primary, marginTop: 2, fontWeight: "600" },
  empty: { fontSize: 14, color: Colors.textSecondary, marginTop: 12 },
  error: { color: Colors.danger, marginTop: 8, marginBottom: 8 },
  reportBody: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 10,
  },
});
