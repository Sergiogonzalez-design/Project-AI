import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  Share,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Colors } from "../lib/colors";
import { copyToClipboard } from "../lib/copy-to-clipboard";
import {
  buildPhysioInviteShareText,
  buildPhysioWhatsAppInviteShareText,
} from "../lib/physio-invite";

type Props = {
  inviteLink: string | null;
  whatsappInviteLink: string | null;
  inviteCode: string | null;
  codeBusy?: boolean;
  defaultOpen?: boolean;
  onRegenerate?: () => void | Promise<void>;
  /** Clinic hub uses slightly different labels via props overrides. */
  title?: string;
  subtitle?: string;
};

const STEPS = [
  {
    icon: "link-outline" as const,
    title: "Comparte el enlace",
    body: "Envíaselo al paciente por WhatsApp, SMS o email.",
  },
  {
    icon: "person-outline" as const,
    title: "Abre y pone su nombre",
    body: "Entra directo a la consulta previa. Sin escribir ningún código.",
  },
  {
    icon: "document-text-outline" as const,
    title: "Recibes el informe",
    body: "Cuando termine, el informe aparece en tu panel.",
  },
];

export function VinculacionInviteCard({
  inviteLink,
  whatsappInviteLink,
  inviteCode,
  codeBusy = false,
  defaultOpen = false,
  onRegenerate,
  title = "Vinculación",
  subtitle = "Enlace de consulta previa para pacientes",
}: Props) {
  const [open, setOpen] = useState(defaultOpen);
  const [moreOpen, setMoreOpen] = useState(false);
  const [copied, setCopied] = useState<"link" | "wa" | "code" | null>(null);

  async function markCopied(kind: "link" | "wa" | "code") {
    setCopied(kind);
    setTimeout(() => setCopied(null), 2000);
  }

  async function copy(kind: "link" | "wa" | "code", value: string) {
    await copyToClipboard(value);
    await markCopied(kind);
  }

  async function share(kind: "web" | "wa") {
    const url = kind === "wa" ? whatsappInviteLink : inviteLink;
    if (!url) return;
    setMoreOpen(false);
    const shareText =
      kind === "wa"
        ? buildPhysioWhatsAppInviteShareText()
        : buildPhysioInviteShareText();
    // Always put the full URL in the message so the patient gets /unirse?code=…
    // (iOS Share `url` alone is dropped by some apps).
    const message = `${shareText}\n${url}`;
    try {
      await Share.share(
        Platform.OS === "ios"
          ? { url, message }
          : {
              title:
                kind === "wa"
                  ? "AIKinora — consulta previa por WhatsApp"
                  : "AIKinora — consulta previa",
              message,
            }
      );
    } catch {
      await copy(kind === "wa" ? "wa" : "link", url);
    }
  }

  return (
    <View style={styles.wrap}>
      <Pressable
        onPress={() => {
          setOpen((v) => !v);
          if (open) setMoreOpen(false);
        }}
        style={({ pressed }) => [
          styles.headerBtn,
          pressed && { backgroundColor: Colors.primaryDark },
        ]}
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
      >
        <View style={styles.headerLeft}>
          <View style={styles.headerIcon}>
            <Ionicons name="qr-code-outline" size={22} color={Colors.white} />
          </View>
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text style={styles.headerTitle}>{title}</Text>
            <Text style={styles.headerSub} numberOfLines={1}>
              {subtitle}
            </Text>
          </View>
        </View>
        <Ionicons
          name={open ? "chevron-up" : "chevron-down"}
          size={20}
          color={Colors.white}
        />
      </Pressable>

      {open ? (
        <View style={styles.body}>
          <View style={styles.steps}>
            {STEPS.map((step, i) => (
              <View key={step.title} style={styles.stepRow}>
                <View style={styles.stepBadge}>
                  <Ionicons name={step.icon} size={18} color={Colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.stepTitle}>
                    {i + 1}. {step.title}
                  </Text>
                  <Text style={styles.stepBody}>{step.body}</Text>
                </View>
              </View>
            ))}
          </View>

          {inviteLink ? (
            <View style={styles.linkBox}>
              <Text style={styles.linkLabel}>Tu enlace (con código incluido)</Text>
              <Text style={styles.linkValue} selectable numberOfLines={3}>
                {inviteLink}
              </Text>
            </View>
          ) : (
            <View style={styles.linkBox}>
              <ActivityIndicator color={Colors.primary} />
            </View>
          )}

          <Pressable
            onPress={() => void share("web")}
            disabled={!inviteLink || codeBusy}
            style={({ pressed }) => [
              styles.primaryBtn,
              pressed && { backgroundColor: Colors.primaryDark },
              (!inviteLink || codeBusy) && { opacity: 0.5 },
            ]}
          >
            <Ionicons name="share-outline" size={20} color={Colors.white} />
            <Text style={styles.primaryBtnText}>
              {copied === "link"
                ? "Enlace copiado"
                : "Compartir enlace de consulta previa"}
            </Text>
          </Pressable>

          {whatsappInviteLink ? (
            <Pressable
              onPress={() => void share("wa")}
              disabled={codeBusy}
              style={({ pressed }) => [
                styles.waBtn,
                pressed && { backgroundColor: "#DCFCE7" },
              ]}
            >
              <Ionicons name="logo-whatsapp" size={20} color="#15803D" />
              <Text style={styles.waBtnText}>
                {copied === "wa" ? "Enlace WhatsApp listo" : "Compartir por WhatsApp"}
              </Text>
            </Pressable>
          ) : null}

          <Pressable
            onPress={() => setMoreOpen((v) => !v)}
            disabled={!inviteCode && !codeBusy}
            style={({ pressed }) => [
              styles.moreBtn,
              pressed && { backgroundColor: Colors.background },
              !inviteCode && !codeBusy && { opacity: 0.5 },
            ]}
          >
            <Text style={styles.moreBtnText}>Más opciones</Text>
            <Ionicons
              name={moreOpen ? "chevron-up" : "chevron-down"}
              size={16}
              color={Colors.textSecondary}
            />
          </Pressable>

          {moreOpen && inviteCode ? (
            <View style={styles.moreMenu}>
              {inviteLink ? (
                <Pressable
                  style={styles.moreItem}
                  onPress={() => {
                    setMoreOpen(false);
                    void copy("link", inviteLink);
                  }}
                >
                  <Text style={styles.moreItemText}>
                    {copied === "link" ? "Enlace copiado" : "Copiar enlace web"}
                  </Text>
                </Pressable>
              ) : null}
              {whatsappInviteLink ? (
                <Pressable
                  style={styles.moreItem}
                  onPress={() => {
                    setMoreOpen(false);
                    void copy("wa", whatsappInviteLink);
                  }}
                >
                  <Text style={styles.moreItemText}>
                    {copied === "wa"
                      ? "Enlace WhatsApp copiado"
                      : "Copiar enlace WhatsApp"}
                  </Text>
                </Pressable>
              ) : null}
              <Pressable
                style={styles.moreItem}
                onPress={() => {
                  setMoreOpen(false);
                  void copy("code", inviteCode);
                }}
              >
                <Text style={styles.moreItemText}>
                  {copied === "code"
                    ? "Código copiado"
                    : "Copiar código (solo si hace falta)"}
                </Text>
              </Pressable>
              {onRegenerate ? (
                <Pressable
                  style={styles.moreItem}
                  disabled={codeBusy}
                  onPress={() => {
                    setMoreOpen(false);
                    void onRegenerate();
                  }}
                >
                  <Text style={[styles.moreItemText, { color: "#92400E" }]}>
                    {codeBusy ? "Generando…" : "Generar código nuevo"}
                  </Text>
                </Pressable>
              ) : null}
            </View>
          ) : null}

          <Text style={styles.foot}>
            El paciente no escribe el código: va dentro del enlace. Si regeneras
            el código, solo cambia el enlace para pacientes nuevos.
          </Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: 16,
    marginBottom: 12,
  },
  headerBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    backgroundColor: Colors.primary,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  headerLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    minWidth: 0,
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: Colors.white,
    letterSpacing: -0.2,
  },
  headerSub: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: "500",
    color: "rgba(255,255,255,0.85)",
  },
  body: {
    marginTop: 10,
    backgroundColor: Colors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
  },
  steps: {
    gap: 12,
    marginBottom: 14,
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  stepBadge: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: Colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.text,
  },
  stepBody: {
    marginTop: 2,
    fontSize: 13,
    lineHeight: 18,
    color: Colors.textSecondary,
  },
  linkBox: {
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 12,
    marginBottom: 12,
    minHeight: 56,
    justifyContent: "center",
  },
  linkLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: Colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.3,
    marginBottom: 6,
  },
  linkValue: {
    fontSize: 12,
    lineHeight: 17,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    color: Colors.text,
  },
  primaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: Colors.primary,
    borderRadius: 14,
    minHeight: 48,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  primaryBtnText: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.white,
    textAlign: "center",
    flexShrink: 1,
  },
  waBtn: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#F0FDF4",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#BBF7D0",
    minHeight: 48,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  waBtnText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#15803D",
  },
  moreBtn: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    minHeight: 44,
    paddingHorizontal: 12,
  },
  moreBtnText: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.text,
  },
  moreMenu: {
    marginTop: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: "hidden",
  },
  moreItem: {
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  moreItemText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
    textAlign: "left",
  },
  foot: {
    marginTop: 12,
    fontSize: 12,
    lineHeight: 17,
    color: Colors.textSecondary,
  },
});
