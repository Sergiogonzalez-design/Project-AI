/**
 * Legal copy for AIKinora (web + mobile).
 * Same structure in ES and EN — switch with the app/site locale.
 * Not legal advice; have counsel review before App Store / production launch.
 */

export type LegalLocale = "es" | "en";

export type LegalSection = { heading: string; paragraphs: string[] };

export type LegalDocument = {
  title: string;
  intro: string;
  sections: LegalSection[];
};

export const LEGAL_META = {
  product: "AIKinora",
  lastUpdatedEs: "19 de agosto de 2026",
  lastUpdatedEn: "19 August 2026",
} as const;

const PRIVACY_ES: LegalDocument = {
  title: "Política de privacidad",
  intro: `Última actualización: ${LEGAL_META.lastUpdatedEs}. Esta política describe cómo ${LEGAL_META.product} (“nosotros”) trata los datos personales cuando usas la aplicación móvil y el sitio web.`,
  sections: [
    {
      heading: "1. Responsable del tratamiento",
      paragraphs: [
        `Responsable: ${LEGAL_META.product}. Para privacidad o soporte, usa el formulario de contacto en Sobre nosotros (app o web).`,
        "Si operas desde el Espacio Económico Europeo o Reino Unido, tratamos los datos conforme al RGPD (y, en su caso, LOPDGDD en España) en la medida aplicable.",
      ],
    },
    {
      heading: "2. Qué es AIKinora",
      paragraphs: [
        `${LEGAL_META.product} ofrece orientación informativa sobre molestias musculoesqueléticas mediante inteligencia artificial, cuestionarios, chat, informes orientativos para fisioterapeutas vinculados y material educativo (p. ej. vídeos de pruebas clínicas).`,
        "No es un servicio médico de urgencias ni sustituye el diagnóstico, tratamiento o criterio de un profesional sanitario presencial. Ante síntomas graves, acude a urgencias o a tu médico.",
      ],
    },
    {
      heading: "3. Datos que recogemos",
      paragraphs: [
        "Cuenta: correo electrónico, contraseña (almacenada de forma cifrada por el proveedor de autenticación), tipo de cuenta (paciente/atleta o fisioterapeuta) y datos de perfil que indiques (p. ej. nombre visible, deporte, clínica).",
        "Consulta previa con código (sin cuenta completa): si introduces el código de un fisioterapeuta sin registrarte, creamos una sesión temporal de invitado para esa consulta. Recogemos el mismo tipo de datos de consulta/salud y los enviamos al fisioterapeuta vinculado. Esa sesión se puede convertir en cuenta o eliminarse (al cerrar o al usar Eliminar cuenta).",
        "Consulta y salud orientativa: textos que escribes o dictas en el chat, respuestas a cuestionarios, fotos de la zona que adjuntes voluntariamente, e informes clínicos generados para un fisioterapeuta si te vinculas con un código/enlace de invitación.",
        "Permisos del dispositivo (solo si los activas): micrófono y reconocimiento de voz (dictado), cámara/galería (fotos de lesión), notificaciones push (recordatorios de retest u otras alertas que configures).",
        "Datos técnicos: identificadores de sesión, logs de seguridad/errores, tipo de dispositivo/app, y datos de uso agregados necesarios para mantener el servicio.",
        "No te pedimos datos de pago dentro de la app salvo que indiquemos lo contrario en una versión futura; cualquier compra pasaría por Apple/Google u otro procesador según la plataforma.",
      ],
    },
    {
      heading: "4. Finalidades y bases legales",
      paragraphs: [
        "Prestar el servicio (crear cuenta, chat IA, cuestionarios, informes, vinculación fisio-paciente): ejecución del contrato / medidas precontractuales.",
        "Mejorar seguridad, prevenir abuso y depurar errores: interés legítimo y, cuando aplique, obligación legal.",
        "Enviar notificaciones que hayas autorizado: consentimiento (puedes revocarlo en ajustes del sistema).",
        "Responder a soporte o ejercicio de derechos: interés legítimo / obligación legal.",
        "Cumplir requerimientos de autoridades o App Store / Play Store: obligación legal o interés legítimo.",
      ],
    },
    {
      heading: "5. Inteligencia artificial y datos de salud",
      paragraphs: [
        "Las consultas y fotos pueden enviarse a proveedores de IA (p. ej. modelos de lenguaje y visión) para generar respuestas e informes orientativos. Esos proveedores actúan como encargados / subencargados del tratamiento según sus propios términos y medidas de seguridad.",
        "Tratamos esta información como datos sensibles de salud cuando la normativa lo clasifique así. Solo la usamos para prestarte el servicio que solicitas; no la vendemos.",
        "Las respuestas de la IA pueden ser incompletas o incorrectas. Tú y, en su caso, tu fisioterapeuta sois responsables de las decisiones clínicas.",
      ],
    },
    {
      heading: "6. Con quién compartimos datos",
      paragraphs: [
        "Proveedores de infraestructura y autenticación (p. ej. Supabase), alojamiento web (p. ej. Vercel), y proveedores de IA necesarios para el chat/informes.",
        "Si un paciente se vincula con un fisioterapeuta, el fisio puede ver el informe y datos clínicos asociados a esa vinculación en su panel.",
        "Apple, Google u otros si usas sus servicios (inicio de sesión, notificaciones, distribución de la app).",
        "Autoridades competentes cuando la ley lo exija.",
        "No vendemos tus datos personales a terceros con fines publicitarios.",
      ],
    },
    {
      heading: "7. Transferencias internacionales",
      paragraphs: [
        "Algunos proveedores pueden tratar datos fuera del EEE. Cuando aplique, usamos garantías adecuadas (p. ej. cláusulas contractuales tipo u otras medidas reconocidas).",
      ],
    },
    {
      heading: "8. Conservación",
      paragraphs: [
        "Conservamos la cuenta y el historial de consultas mientras mantengas la cuenta activa y sea necesario para el servicio, soporte o obligaciones legales.",
        "Puedes solicitar la eliminación de la cuenta y de datos asociados; atenderemos la solicitud salvo retenciones legales (seguridad, reclamaciones, facturación si existiera).",
      ],
    },
    {
      heading: "9. Seguridad",
      paragraphs: [
        "Aplicamos medidas técnicas y organizativas razonables (cifrado en tránsito, control de acceso, políticas en base de datos). Ningún sistema es 100 % seguro; notifícanos cualquier incidente a través del formulario de contacto.",
      ],
    },
    {
      heading: "10. Tus derechos",
      paragraphs: [
        "Según tu jurisdicción, puedes solicitar acceso, rectificación, supresión, limitación, portabilidad u oposición, y retirar consentimientos (p. ej. micrófono o notificaciones) sin afectar el tratamiento previo.",
        "Ejercicio de derechos: formulario de contacto en Sobre nosotros. También puedes reclamar ante la autoridad de protección de datos de tu país (en España, la AEPD).",
      ],
    },
    {
      heading: "11. Menores",
      paragraphs: [
        `${LEGAL_META.product} no está dirigido a menores de 16 años (o la edad mínima digital de tu país). Si eres padre/madre/tutor y crees que un menor nos ha facilitado datos, contacta con nosotros mediante el formulario para eliminarlos.`,
      ],
    },
    {
      heading: "12. Cookies y tecnologías similares",
      paragraphs: [
        "En la web usamos cookies o almacenamiento local necesarios para sesión autenticada y seguridad. No usamos redes publicitarias de terceros en la app para perfilado comercial.",
      ],
    },
    {
      heading: "13. Cambios",
      paragraphs: [
        "Podemos actualizar esta política. Publicaremos la fecha de actualización en esta página. El uso continuado tras cambios relevantes implica que has sido informado; cuando la ley lo exija, pediremos un nuevo consentimiento.",
      ],
    },
    {
      heading: "14. Eliminación de la cuenta",
      paragraphs: [
        "Si has creado una cuenta, puedes eliminarla desde Perfil → Eliminar cuenta (app o web). Eso borra el registro de cuenta y los datos personales asociados (consultas, fotos, perfil), salvo retenciones legales (por ejemplo, un informe ya enviado a tu fisioterapeuta que deba conservarlo para tu tratamiento, o obligaciones de seguridad).",
        "Las sesiones de invitado (código del fisioterapeuta) también se pueden eliminar: al cerrar esa consulta temporal o, si conviertes la sesión en cuenta, con Eliminar cuenta.",
        "La eliminación suele completarse de inmediato. Si algún dato debe retenerse por ley, te lo indicaremos.",
      ],
    },
    {
      heading: "15. Contacto",
      paragraphs: [
        "Privacidad y soporte: formulario de contacto en Sobre nosotros (app o sitio web).",
      ],
    },
  ],
};

const TERMS_ES: LegalDocument = {
  title: "Términos de uso",
  intro: `Última actualización: ${LEGAL_META.lastUpdatedEs}. Estos términos regulan el uso de ${LEGAL_META.product}. Al crear una cuenta o usar la app/web, aceptas estos términos y la Política de privacidad.`,
  sections: [
    {
      heading: "1. El servicio",
      paragraphs: [
        `${LEGAL_META.product} proporciona orientación informativa en fisioterapia/musculoesquelético con ayuda de IA, cuestionarios, chat, material educativo e informes orientativos para fisioterapeutas cuando existe vinculación.`,
        "El servicio puede evolucionar; podemos modificar funciones razonablemente o suspender el acceso por mantenimiento, seguridad o incumplimiento.",
      ],
    },
    {
      heading: "2. No es consejo médico",
      paragraphs: [
        "La información de AIKinora es orientativa y educativa. No constituye diagnóstico, prescripción ni relación clínica presencial. No ignores ni retrases atención médica profesional por algo leído o generado en la app.",
        "En caso de dolor intenso, trauma grave, síntomas neurológicos urgentes, dificultad respiratoria u otras alarmas, contacta con emergencias o un profesional sanitario de inmediato.",
      ],
    },
    {
      heading: "3. Cuentas",
      paragraphs: [
        "Hay cuentas de paciente/atleta y de fisioterapeuta. Debes facilitar datos veraces, mantener la confidencialidad de tus credenciales y ser responsable de la actividad en tu cuenta.",
        "Los fisioterapeutas son responsables de usar los informes conforme a su deontología y normativa profesional; AIKinora no sustituye su juicio clínico.",
        "Podemos suspender o cancelar cuentas por fraude, abuso, uso ilegal o riesgo para otros usuarios.",
      ],
    },
    {
      heading: "4. Uso aceptable",
      paragraphs: [
        "No debes: usar el servicio para daño, acoso o ilegalidad; intentar acceder a datos de terceros sin autorización; sobrecargar o atacar la infraestructura; ingeniería inversa indebida; subir contenido ilícito, ilegal o que vulnere derechos de terceros; hacerse pasar por otra persona o profesional sin serlo.",
        "Las fotos y textos que subas deben referirse a ti (o a quien tengas derecho legítimo a representar) y no deben incluir datos de terceros sin base legal.",
      ],
    },
    {
      heading: "5. Contenido e IA",
      paragraphs: [
        "Conservas tus derechos sobre el contenido que introduces. Nos concedes una licencia limitada para alojarlo, procesarlo y mostrarlo solo para operar el servicio (p. ej. generar respuestas e informes).",
        "Las salidas de IA pueden contener errores. No garantizamos exactitud, exhaustividad ni idoneidad para un fin clínico concreto.",
      ],
    },
    {
      heading: "6. Propiedad intelectual",
      paragraphs: [
        `La marca ${LEGAL_META.product}, el software, el diseño y los materiales educativos propios pertenecen a ${LEGAL_META.product} o a sus licenciantes.`,
        "No puedes copiar, revender ni explotar el servicio fuera de lo permitido por estos términos o por la ley.",
      ],
    },
    {
      heading: "7. Disponibilidad y exención",
      paragraphs: [
        "El servicio se ofrece “tal cual” y “según disponibilidad”. En la máxima medida permitida por la ley, excluimos garantías implícitas de comerciabilidad o adecuación a un propósito particular.",
        `En la medida permitida, ${LEGAL_META.product} no será responsable de daños indirectos, lucro cesante o decisiones tomadas basándose únicamente en la IA. Nada en estos términos excluye responsabilidad que no pueda limitarse por ley (p. ej. dolo o negligencia grave).`,
      ],
    },
    {
      heading: "8. App Store / plataformas",
      paragraphs: [
        "Si descargas la app desde Apple App Store o Google Play, también aplican las condiciones de esa plataforma. Apple/Google no son partes de estos términos entre tú y AIKinora, salvo lo que exijan sus reglas de distribución.",
      ],
    },
    {
      heading: "9. Ley aplicable",
      paragraphs: [
        "Salvo norma imperativa en contrario, estos términos se interpretan conforme a la legislación española y los tribunales del domicilio del consumidor tendrán competencia cuando la ley de consumidores lo exija.",
      ],
    },
    {
      heading: "10. Contacto",
      paragraphs: [
        "Soporte y privacidad: formulario de contacto en Sobre nosotros (app o sitio web).",
      ],
    },
  ],
};

const PRIVACY_EN: LegalDocument = {
  title: "Privacy policy",
  intro: `Last updated: ${LEGAL_META.lastUpdatedEn}. This policy explains how ${LEGAL_META.product} (“we”) processes personal data when you use the mobile app and website.`,
  sections: [
    {
      heading: "1. Data controller",
      paragraphs: [
        `Controller: ${LEGAL_META.product}. For privacy or support, use the contact form in About us (app or website).`,
        "If you are in the European Economic Area or the United Kingdom, we process data under the GDPR (and, where applicable, Spanish LOPDGDD) to the extent it applies.",
      ],
    },
    {
      heading: "2. What AIKinora is",
      paragraphs: [
        `${LEGAL_META.product} provides informational guidance on musculoskeletal issues using artificial intelligence, questionnaires, chat, orientative reports for linked physiotherapists, and educational material (e.g. clinical test videos).`,
        "It is not an emergency medical service and does not replace diagnosis, treatment, or the judgment of an in-person healthcare professional. For serious symptoms, seek emergency care or your doctor.",
      ],
    },
    {
      heading: "3. Data we collect",
      paragraphs: [
        "Account: email, password (stored encrypted by the authentication provider), account type (patient/athlete or physiotherapist), and profile details you provide (e.g. display name, sport, clinic).",
        "Pre-appointment code (no full account): if you enter a physiotherapist’s code without signing up, we create a temporary guest session for that consult. We collect the same kind of consult/health data and send it to the linked physiotherapist. You can convert that session into an account or delete it (when you close or use Delete account).",
        "Consult and orientative health data: text you type or dictate in chat, questionnaire answers, injury photos you optionally attach, and clinical reports generated for a physiotherapist if you link with an invite code/link.",
        "Device permissions (only if you enable them): microphone and speech recognition (dictation), camera/gallery (injury photos), push notifications (retest reminders or other alerts you configure).",
        "Technical data: session identifiers, security/error logs, device/app type, and aggregated usage data needed to run the service.",
        "We do not ask for payment details inside the app unless a future version says otherwise; any purchase would go through Apple/Google or another processor depending on the platform.",
      ],
    },
    {
      heading: "4. Purposes and legal bases",
      paragraphs: [
        "Providing the service (account, AI chat, questionnaires, reports, physio–patient linking): performance of a contract / pre-contractual steps.",
        "Improving security, preventing abuse, and debugging: legitimate interest and, where applicable, legal obligation.",
        "Sending notifications you have authorised: consent (you can revoke it in system settings).",
        "Responding to support or rights requests: legitimate interest / legal obligation.",
        "Meeting authority or App Store / Play Store requirements: legal obligation or legitimate interest.",
      ],
    },
    {
      heading: "5. Artificial intelligence and health data",
      paragraphs: [
        "Consults and photos may be sent to AI providers (e.g. language and vision models) to generate orientative answers and reports. Those providers act as processors / sub-processors under their own terms and security measures.",
        "We treat this information as sensitive health data when the law classifies it as such. We only use it to provide the service you request; we do not sell it.",
        "AI answers may be incomplete or incorrect. You and, where applicable, your physiotherapist are responsible for clinical decisions.",
      ],
    },
    {
      heading: "6. Who we share data with",
      paragraphs: [
        "Infrastructure and authentication providers (e.g. Supabase), web hosting (e.g. Vercel), and AI providers needed for chat/reports.",
        "If a patient links with a physiotherapist, the physio may see the report and related clinical data for that link in their panel.",
        "Apple, Google, or others if you use their services (sign-in, notifications, app distribution).",
        "Competent authorities when required by law.",
        "We do not sell your personal data to third parties for advertising.",
      ],
    },
    {
      heading: "7. International transfers",
      paragraphs: [
        "Some providers may process data outside the EEA. Where required, we use appropriate safeguards (e.g. standard contractual clauses or other recognised measures).",
      ],
    },
    {
      heading: "8. Retention",
      paragraphs: [
        "We keep the account and consult history while your account is active and as needed for the service, support, or legal obligations.",
        "You may request deletion of the account and related data; we will handle the request except for legal retentions (security, claims, billing if any).",
      ],
    },
    {
      heading: "9. Security",
      paragraphs: [
        "We apply reasonable technical and organisational measures (encryption in transit, access control, database policies). No system is 100% secure; report incidents via the contact form.",
      ],
    },
    {
      heading: "10. Your rights",
      paragraphs: [
        "Depending on your jurisdiction, you may request access, rectification, erasure, restriction, portability, or objection, and withdraw consents (e.g. microphone or notifications) without affecting prior processing.",
        "To exercise rights: contact form in About us. You may also lodge a complaint with your national data protection authority (in Spain, the AEPD).",
      ],
    },
    {
      heading: "11. Minors",
      paragraphs: [
        `${LEGAL_META.product} is not directed at children under 16 (or the digital minimum age in your country). If you are a parent/guardian and believe a minor has provided us data, contact us via the form to delete it.`,
      ],
    },
    {
      heading: "12. Cookies and similar technologies",
      paragraphs: [
        "On the website we use cookies or local storage needed for authenticated sessions and security. We do not use third-party ad networks in the app for commercial profiling.",
      ],
    },
    {
      heading: "13. Changes",
      paragraphs: [
        "We may update this policy. We will publish the update date on this page. Continued use after material changes means you have been informed; where the law requires it, we will ask for new consent.",
      ],
    },
    {
      heading: "14. Account deletion",
      paragraphs: [
        "If you created an account, you can delete it from Profile → Delete account (app or website). That removes the account record and associated personal data (consults, photos, profile), except legal retentions (for example, a report already sent to your physiotherapist that they must keep for your treatment, or security obligations).",
        "Guest sessions (physiotherapist code) can also be deleted: when you close that temporary consult, or, if you convert the session into an account, with Delete account.",
        "Deletion is usually completed immediately. If any data must be retained by law, we will tell you.",
      ],
    },
    {
      heading: "15. Contact",
      paragraphs: [
        "Privacy and support: contact form in About us (app or website).",
      ],
    },
  ],
};

const TERMS_EN: LegalDocument = {
  title: "Terms of use",
  intro: `Last updated: ${LEGAL_META.lastUpdatedEn}. These terms govern use of ${LEGAL_META.product}. By creating an account or using the app/website, you accept these terms and the Privacy policy.`,
  sections: [
    {
      heading: "1. The service",
      paragraphs: [
        `${LEGAL_META.product} provides informational physiotherapy/musculoskeletal guidance with AI, questionnaires, chat, educational material, and orientative reports for physiotherapists when a link exists.`,
        "The service may evolve; we may reasonably change features or suspend access for maintenance, security, or breach.",
      ],
    },
    {
      heading: "2. Not medical advice",
      paragraphs: [
        "AIKinora information is orientative and educational. It is not a diagnosis, prescription, or in-person clinical relationship. Do not ignore or delay professional medical care because of something read or generated in the app.",
        "For severe pain, major trauma, urgent neurological symptoms, breathing difficulty, or other red flags, contact emergency services or a healthcare professional immediately.",
      ],
    },
    {
      heading: "3. Accounts",
      paragraphs: [
        "There are patient/athlete and physiotherapist accounts. You must provide accurate details, keep credentials confidential, and are responsible for activity on your account.",
        "Physiotherapists are responsible for using reports in line with their professional ethics and rules; AIKinora does not replace their clinical judgment.",
        "We may suspend or cancel accounts for fraud, abuse, illegal use, or risk to other users.",
      ],
    },
    {
      heading: "4. Acceptable use",
      paragraphs: [
        "You must not: use the service for harm, harassment, or illegality; access others’ data without authorisation; overload or attack the infrastructure; improperly reverse engineer; upload unlawful content or content that infringes third-party rights; impersonate another person or professional.",
        "Photos and text you upload must relate to you (or someone you are lawfully entitled to represent) and must not include third-party data without a legal basis.",
      ],
    },
    {
      heading: "5. Content and AI",
      paragraphs: [
        "You retain rights in content you submit. You grant us a limited licence to host, process, and display it solely to operate the service (e.g. generate answers and reports).",
        "AI outputs may contain errors. We do not guarantee accuracy, completeness, or fitness for a specific clinical purpose.",
      ],
    },
    {
      heading: "6. Intellectual property",
      paragraphs: [
        `The ${LEGAL_META.product} brand, software, design, and our educational materials belong to ${LEGAL_META.product} or its licensors.`,
        "You may not copy, resell, or exploit the service beyond what these terms or the law allow.",
      ],
    },
    {
      heading: "7. Availability and disclaimer",
      paragraphs: [
        "The service is provided “as is” and “as available”. To the fullest extent permitted by law, we disclaim implied warranties of merchantability or fitness for a particular purpose.",
        `To the extent permitted, ${LEGAL_META.product} is not liable for indirect damages, lost profits, or decisions based solely on the AI. Nothing in these terms excludes liability that cannot be limited by law (e.g. wilful misconduct or gross negligence).`,
      ],
    },
    {
      heading: "8. App Store / platforms",
      paragraphs: [
        "If you download the app from the Apple App Store or Google Play, that platform’s terms also apply. Apple/Google are not parties to these terms between you and AIKinora, except as their distribution rules require.",
      ],
    },
    {
      heading: "9. Governing law",
      paragraphs: [
        "Unless mandatory rules say otherwise, these terms are interpreted under Spanish law, and courts at the consumer’s domicile have jurisdiction when consumer law so requires.",
      ],
    },
    {
      heading: "10. Contact",
      paragraphs: [
        "Support and privacy: contact form in About us (app or website).",
      ],
    },
  ],
};

export function getPrivacyPolicy(locale: LegalLocale): LegalDocument {
  return locale === "en" ? PRIVACY_EN : PRIVACY_ES;
}

export function getTermsOfUse(locale: LegalLocale): LegalDocument {
  return locale === "en" ? TERMS_EN : TERMS_ES;
}

/** @deprecated use getPrivacyPolicy("es") */
export const PRIVACY_POLICY_ES = PRIVACY_ES;
/** @deprecated use getTermsOfUse("es") */
export const TERMS_OF_USE_ES = TERMS_ES;

export function legalUiCopy(locale: LegalLocale) {
  if (locale === "en") {
    return {
      kicker: "Legal · AIKinora",
      footnote:
        "This text is informational and is not legal advice. Have a lawyer review it before commercial or App Store launch.",
      privacyAndTerms: "Privacy & terms",
      privacy: "Privacy",
      terms: "Terms of use",
      back: "← Back",
      languageLabel: "Language",
    };
  }
  return {
    kicker: "Legal · AIKinora",
    footnote:
      "Este texto es informativo y no constituye asesoramiento jurídico. Revisa con un abogado antes del lanzamiento comercial o en App Store.",
    privacyAndTerms: "Privacidad y términos",
    privacy: "Privacidad",
    terms: "Términos de uso",
    back: "← Volver",
    languageLabel: "Idioma",
  };
}
