import { useRoute } from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";
import * as Clipboard from "expo-clipboard";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { PhysioReportView } from "../components/PhysioReportView";
import { WEB_APP_URL } from "../lib/admin-api";
import { Colors } from "../lib/colors";
import { useI18n } from "../lib/i18n";
import { supabase } from "../lib/supabase";
import type { TabParamList } from "../navigation/AppTabs";
import { ClinicTeamPanel } from "./ClinicTeamScreen";

function buildClinicPatientInviteUrl(code: string): string {
  const base = WEB_APP_URL.replace(/\/$/, "");
  const normalized = code.trim().toUpperCase().replace(/\s+/g, "");
  return `${base}/unirse?code=${encodeURIComponent(normalized)}`;
}

type ClinicPatient = {
  id: string;
  email: string;
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
  const [copied, setCopied] = useState<"code" | "link" | null>(null);
  const [codeBusy, setCodeBusy] = useState(false);

  const inviteLink = inviteCode ? buildClinicPatientInviteUrl(inviteCode) : null;

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
      .select("id, created_at, body_area, patient_summary, physio_report, status")
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

  async function copy(kind: "code" | "link", value: string) {
    await Clipboard.setStringAsync(value);
    setCopied(kind);
    setTimeout(() => setCopied(null), 2000);
  }

  async function shareInvite() {
    if (!inviteLink || !inviteCode) return;
    await Share.share({
      message: hub.shareInviteMessage
        .replace("{code}", inviteCode)
        .replace("{link}", inviteLink),
    });
  }

  const patientsLabel =
    patients.length === 1
      ? hub.patientsCount.replace("{n}", String(patients.length))
      : hub.patientsCountPlural.replace("{n}", String(patients.length));

  if (selectedPatient) {
    const label = selectedPatient.display_name || selectedPatient.email;
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
        {reportsLoading ? (
          <ActivityIndicator color={Colors.primary} style={{ marginTop: 24 }} />
        ) : reports.length === 0 ? (
          <Text style={styles.empty}>{hub.noReports}</Text>
        ) : (
          reports.map((report) => {
            const open = expandedId === report.id;
            return (
              <View key={report.id} style={styles.card}>
                <Pressable
                  onPress={() => setExpandedId(open ? null : report.id)}
                  style={styles.cardHead}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={styles.cardTitle}>
                      {report.body_area || hub.consult}
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
            <Text style={styles.cardTitle}>{hub.linkingTitle}</Text>
            <Text style={styles.hint}>{hub.linkingHint}</Text>
            <Text style={styles.code}>
              {inviteCode ?? (loading ? "…" : "—")}
            </Text>
            <View style={styles.row}>
              <Pressable
                style={styles.btn}
                disabled={!inviteCode}
                onPress={() => inviteCode && void copy("code", inviteCode)}
              >
                <Text style={styles.btnText}>
                  {copied === "code" ? hub.copied : hub.copyCode}
                </Text>
              </Pressable>
              <Pressable
                style={styles.btn}
                disabled={!inviteLink}
                onPress={() => inviteLink && void copy("link", inviteLink)}
              >
                <Text style={styles.btnText}>
                  {copied === "link" ? hub.copied : hub.copyLink}
                </Text>
              </Pressable>
            </View>
            <View style={styles.row}>
              <Pressable
                style={styles.btnSecondary}
                onPress={() => void shareInvite()}
              >
                <Text style={styles.btnSecondaryText}>{hub.share}</Text>
              </Pressable>
              <Pressable
                style={styles.btnSecondary}
                disabled={codeBusy}
                onPress={() => void regenerateCode()}
              >
                <Text style={styles.btnSecondaryText}>
                  {codeBusy ? "…" : hub.newCode}
                </Text>
              </Pressable>
            </View>
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
                    {p.display_name || p.email}
                  </Text>
                  <Text style={styles.meta}>{p.email}</Text>
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
  card: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 16,
    padding: 14,
    backgroundColor: Colors.surface,
    marginBottom: 12,
  },
  hint: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 18,
    color: Colors.textSecondary,
  },
  cardHead: { flexDirection: "row", alignItems: "center", gap: 8 },
  cardTitle: { fontSize: 15, fontWeight: "700", color: Colors.text },
  code: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: 3,
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
