from pathlib import Path
import re

p = Path("mobile/src/screens/AIInquiriesScreen.tsx")
t = p.read_text(encoding="utf-8")

# Remove detectConsultLanguage import
t = t.replace("  detectConsultLanguage,\n", "")

# Welcome messages
t = t.replace(
    '''const WELCOME_MESSAGE =
  "¿En qué puedo ayudarte? Cuéntame si tienes alguna molestia, duda sobre ejercicios o lo que necesites.";''',
    '''const WELCOME_MESSAGE_ES =
  "¿En qué puedo ayudarte? Cuéntame si tienes alguna molestia, duda sobre ejercicios o lo que necesites.";
const WELCOME_MESSAGE_EN =
  "How can I help you? Tell me about any discomfort, exercise questions, or whatever you need.";''',
)

t = t.replace(
    "function welcomeMessage(content: string = WELCOME_MESSAGE): Message {",
    "function welcomeMessage(content: string = WELCOME_MESSAGE_ES): Message {",
)

t = t.replace(
    """  const welcomeText = linkedPhysio
    ? buildPhysioLinkedWelcome(linkedPhysio.physio_name, {
        guest: guestMode,
        clinicName: linkedPhysio.clinic_name,
        language: locale,
      })
    : WELCOME_MESSAGE;""",
    """  const welcomeText = linkedPhysio
    ? buildPhysioLinkedWelcome(linkedPhysio.physio_name, {
        guest: guestMode,
        clinicName: linkedPhysio.clinic_name,
        language: locale,
      })
    : locale === "en"
      ? WELCOME_MESSAGE_EN
      : WELCOME_MESSAGE_ES;""",
)

# Replace consultLanguage state with locale alias
t = t.replace(
    '  const [consultLanguage, setConsultLanguage] = useState<"es" | "en">(locale);\n',
    "",
)
# Remove sync effects that only setConsultLanguage(locale)
t = re.sub(
    r"\n\s*useEffect\(\(\) => \{\s*setConsultLanguage\(locale\);\s*\}, \[locale\]\);",
    "",
    t,
)
t = t.replace("setConsultLanguage(locale);\n", "")
t = t.replace("setConsultLanguage(lang);\n", "")

# Use locale as language for consult
# After removing state, add: const consultLanguage = locale;
# Find a good insertion point after useI18n
if "const consultLanguage = locale;" not in t:
    t = t.replace(
        "  const { t, locale } = useI18n();\n",
        "  const { t, locale } = useI18n();\n  const consultLanguage = locale;\n",
    )

t = t.replace(
    """      const lang = detectConsultLanguage(text, locale);
      setConsultLanguage(lang);

      setMessages((prev) => [""",
    """      const lang = consultLanguage;

      setMessages((prev) => [""",
)

# Banner
old = """          <Text style={{ fontSize: 14, fontWeight: "700", color: "#065F46" }}>
            Informe enviado a tu fisioterapeuta
          </Text>
          <Text style={{ marginTop: 2, fontSize: 12, color: "#047857" }}>
            El resumen clínico se ha enviado correctamente. Ya puede revisarlo antes de la cita.
          </Text>
          <Pressable onPress={() => setPhysioReportSentBanner(false)} style={{ marginTop: 6 }}>
            <Text style={{ fontSize: 12, fontWeight: "700", color: "#065F46" }}>Cerrar</Text>
          </Pressable>"""
new = """          <Text style={{ fontSize: 14, fontWeight: "700", color: "#065F46" }}>
            {locale === "en"
              ? "Report sent to your physiotherapist"
              : "Informe enviado a tu fisioterapeuta"}
          </Text>
          <Text style={{ marginTop: 2, fontSize: 12, color: "#047857" }}>
            {locale === "en"
              ? "The clinical summary was sent successfully. They can review it before the appointment."
              : "El resumen clínico se ha enviado correctamente. Ya puede revisarlo antes de la cita."}
          </Text>
          <Pressable onPress={() => setPhysioReportSentBanner(false)} style={{ marginTop: 6 }}>
            <Text style={{ fontSize: 12, fontWeight: "700", color: "#065F46" }}>
              {locale === "en" ? "Close" : "Cerrar"}
            </Text>
          </Pressable>"""
if old in t:
    t = t.replace(old, new)
    print("banner ok")
else:
    print("banner missing")

p.write_text(t, encoding="utf-8")
print("detect left", t.count("detectConsultLanguage"))
print("setConsult left", t.count("setConsultLanguage"))
print("consultLanguage = locale", "const consultLanguage = locale;" in t)
