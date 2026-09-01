from pathlib import Path

p = Path("components/chat-interface.tsx")
t = p.read_text(encoding="utf-8")
t = t.replace('    setConsultLanguage("es");\n', "")
t = t.replace(
    'fisioNewConsultCooldownMessage(hoursLeft, "es")',
    "fisioNewConsultCooldownMessage(hoursLeft, consultLanguage)",
)
t = t.replace(
    "groupConversationsByDate(filtered)",
    "groupConversationsByDate(filtered, consultLanguage)",
)
t = t.replace(
    "{formatDate(c.created_at)}",
    "{formatDate(c.created_at, consultLanguage)}",
)
t = t.replace(
    "formatTime(msg.created_at)",
    "formatTime(msg.created_at, consultLanguage)",
)
t = t.replace(
    'const [activeTitle, setActiveTitle] = useState("Nueva consulta");',
    'const [activeTitle, setActiveTitle] = useState(() => (uiLocale === "en" ? "New consultation" : "Nueva consulta"));',
)

old = """                <p className="text-sm font-semibold text-emerald-900">
                  Informe enviado a tu fisioterapeuta
                </p>
                <p className="mt-0.5 text-xs text-emerald-800">
                  El resumen clínico de esta consulta se ha enviado correctamente
                  {linkedPhysioLabel ? ` a ${linkedPhysioLabel}` : ""}. Ya puede
                  revisarlo en su panel antes de la cita.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPhysioReportSentBanner(false)}
                className="shrink-0 rounded-lg px-2 py-1 text-xs font-semibold text-emerald-800 hover:bg-emerald-100"
              >
                Cerrar
              </button>"""

new = """                <p className="text-sm font-semibold text-emerald-900">
                  {consultLanguage === "en"
                    ? "Report sent to your physiotherapist"
                    : "Informe enviado a tu fisioterapeuta"}
                </p>
                <p className="mt-0.5 text-xs text-emerald-800">
                  {consultLanguage === "en"
                    ? `The clinical summary from this consultation was sent successfully${
                        linkedPhysioLabel ? ` to ${linkedPhysioLabel}` : ""
                      }. They can review it on their dashboard before the appointment.`
                    : `El resumen clínico de esta consulta se ha enviado correctamente${
                        linkedPhysioLabel ? ` a ${linkedPhysioLabel}` : ""
                      }. Ya puede revisarlo en su panel antes de la cita.`}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPhysioReportSentBanner(false)}
                className="shrink-0 rounded-lg px-2 py-1 text-xs font-semibold text-emerald-800 hover:bg-emerald-100"
              >
                {consultLanguage === "en" ? "Close" : "Cerrar"}
              </button>"""

if old in t:
    t = t.replace(old, new)
    print("banner ok")
else:
    print("banner missing")

t = t.replace(
    "Orientación informativa, no diagnóstico médico.",
    '{consultLanguage === "en" ? "Informational guidance, not a medical diagnosis." : "Orientación informativa, no diagnóstico médico."}',
)

p.write_text(t, encoding="utf-8")
print("setConsultLanguage left:", t.count("setConsultLanguage"))
print("detectConsultLanguage left:", t.count("detectConsultLanguage"))
