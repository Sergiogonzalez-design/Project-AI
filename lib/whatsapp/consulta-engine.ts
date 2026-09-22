import type { SupabaseClient } from "@supabase/supabase-js";
import {
  buildPhysioLinkedPostQuestionnaireMessage,
  physioDisplayName,
} from "@/lib/physio-linked-welcome";
import {
  formatFunctionalTestAnswers,
  splitFunctionalTests,
  type FunctionalTestItem,
} from "@/lib/functional-test-answers";
import { filterPatientSafeFunctionalTests } from "@/lib/patient-safe-functional-tests";
import {
  FUNCTIONAL_TEST_QUESTIONS,
  resolveFunctionalRegion,
} from "@/lib/consulta-functional-tests";
import { extractInviteCodeFromWhatsAppText, normalizeInviteCode } from "@/lib/physio-invite";
import { bodyAreaLabelFromText } from "@/lib/consulta-triage";
import {
  createWhatsAppGuestPatient,
  resolveInviteCode,
} from "./invite-resolve";
import {
  applyAnswer,
  getPartDriver,
  nextUnansweredQuestion,
  parseOptionReply,
  prefillsWhatsAppSkippedAnswers,
  questionToOutbound,
  resolveQuestionnairePart,
} from "./questionnaire-driver";
import { completeWhatsAppPhysioReport } from "./report";
import {
  createSession,
  getActiveSessionByPhone,
  mergeSessionState,
} from "./sessions";
import type {
  WhatsAppConsultSession,
  WhatsAppInbound,
  WhatsAppOutbound,
} from "./types";

function replies(
  ...messages: WhatsAppOutbound[]
): WhatsAppOutbound[] {
  return messages;
}

function text(t: string): WhatsAppOutbound {
  return { type: "text", text: t };
}

function functionalPromptList(tests: FunctionalTestItem[]): string {
  return tests
    .map((t) => `${t.n}. ${t.prompt}`)
    .join("\n");
}

function buildFunctionalTests(
  bodyArea: string,
  aiOrientationText?: string
): FunctionalTestItem[] {
  let tests: FunctionalTestItem[];
  if (aiOrientationText) {
    const parsed = splitFunctionalTests(aiOrientationText);
    if (parsed && parsed.tests.length >= 2) {
      tests = filterPatientSafeFunctionalTests(parsed.tests);
    } else {
      const region = resolveFunctionalRegion(bodyArea);
      const bank = FUNCTIONAL_TEST_QUESTIONS[region] ?? FUNCTIONAL_TEST_QUESTIONS.generic;
      tests = filterPatientSafeFunctionalTests(
        bank.map((prompt, i) => ({ n: i + 1, prompt }))
      );
    }
  } else {
    const region = resolveFunctionalRegion(bodyArea);
    const bank = FUNCTIONAL_TEST_QUESTIONS[region] ?? FUNCTIONAL_TEST_QUESTIONS.generic;
    tests = filterPatientSafeFunctionalTests(
      bank.map((prompt, i) => ({ n: i + 1, prompt }))
    );
  }
  // WhatsApp: keep functional block short (max 3).
  return tests.slice(0, 3).map((t, i) => ({ ...t, n: i + 1 }));
}

async function startFunctionalPhase(
  admin: SupabaseClient,
  session: WhatsAppConsultSession,
  symptomContext: string,
  bodyArea: string
): Promise<{ session: WhatsAppConsultSession; out: WhatsAppOutbound[] }> {
  const tests = buildFunctionalTests(bodyArea);
  const msg = buildPhysioLinkedPostQuestionnaireMessage({
    physioName: session.state.physioName,
    aiText: `Pruebas funcionales\n${functionalPromptList(tests)}`,
    bodyArea,
    language: "es",
  });
  const first = tests[0];
  const updated =
    (await mergeSessionState(
      admin,
      session,
      {
        symptomContext,
        bodyArea,
        functionalTests: tests,
        functionalAnswers: {},
        functionalIndex: 0,
      },
      { phase: "functional" }
    )) ?? session;

  const out: WhatsAppOutbound[] = [
    text(msg.split(/\n\nPruebas/)[0]?.trim() || msg),
  ];
  if (first) {
    out.push({
      type: "buttons",
      text: `Prueba 1/${tests.length}:\n${first.prompt}`,
      buttons: [
        { id: "fn:si", title: "Sí" },
        { id: "fn:no", title: "No" },
      ],
    });
  }
  return { session: updated, out };
}

/**
 * Main WhatsApp consulta previa state machine — same clinical path as web.
 */
export async function handleWhatsAppInbound(
  admin: SupabaseClient,
  inbound: WhatsAppInbound
): Promise<WhatsAppOutbound[]> {
  const phone = inbound.phoneE164.replace(/\D/g, "");
  let session = await getActiveSessionByPhone(admin, phone);

  if (!session) {
    session = await createSession(admin, phone, { phase: "idle" });
    if (!session) {
      return replies(text("No pude iniciar la consulta. Inténtalo de nuevo en unos minutos."));
    }
  }

  // Dedup WhatsApp retries
  if (
    inbound.messageId &&
    session.last_wa_message_id &&
    session.last_wa_message_id === inbound.messageId
  ) {
    return [];
  }
  if (inbound.messageId) {
    session =
      (await mergeSessionState(admin, session, {}, {
        last_wa_message_id: inbound.messageId,
      })) ?? session;
  }

  const rawText = (inbound.text || "").trim();
  const buttonReply = parseOptionReply(rawText, inbound.buttonId);

  // Restart command — any non-complete phase, or complete + keyword
  const wantsRestart = /^(hola|hi|hello|reiniciar|empezar|start|reset)$/i.test(
    rawText
  );
  if (wantsRestart && session.phase !== "idle" && session.phase !== "awaiting_code") {
    if (!session.completed_at) {
      await mergeSessionState(
        admin,
        session,
        {},
        { phase: "complete", completed_at: new Date().toISOString() }
      );
    }
    session = (await createSession(admin, phone, { phase: "idle" })) ?? session;
    return replies(
      text(
        "Empezamos de nuevo. Envíame el código de tu fisioterapeuta (o abre el enlace de WhatsApp que te compartió)."
      )
    );
  }

  if (session.phase === "complete") {
    return replies(
      text(
        "Tu consulta previa ya está completa. Tu fisioterapeuta puede ver el informe en AIKinora. Si necesitas otra consulta, escribe *reiniciar* o pide un código nuevo."
      )
    );
  }

  // --- idle / awaiting_code ---
  if (session.phase === "idle" || session.phase === "awaiting_code") {
    const code =
      extractInviteCodeFromWhatsAppText(rawText) ||
      (session.invite_code ?? "");
    if (!code) {
      session =
        (await mergeSessionState(admin, session, {}, { phase: "awaiting_code" })) ??
        session;
      return replies(
        text(
          "¡Hola! Soy Physio, el asistente de fisioterapia de AIKinora.\n\nPara empezar la consulta previa, envíame el código de tu fisioterapeuta (o abre el enlace de WhatsApp que te compartió)."
        )
      );
    }

    const resolved = await resolveInviteCode(admin, code);
    if ("error" in resolved) {
      return replies(text(resolved.error));
    }

    session =
      (await mergeSessionState(
        admin,
        session,
        {
          physioName: resolved.physioName,
          clinicName: resolved.clinicName,
        },
        {
          phase: "name",
          invite_code: resolved.inviteCode,
          physio_id: resolved.physioId,
          clinic_id: resolved.clinicId,
        }
      )) ?? session;

    const who = physioDisplayName(resolved.physioName, "es");
    const clinicBit = resolved.clinicName ? ` (${resolved.clinicName})` : "";
    return replies(
      text(
        `¡Hola! Soy Physio, el asistente de fisioterapia de AIKinora.\n\n${who}${clinicBit} te ha pedido que completes esta consulta previa conmigo. En unos minutos reuniré lo esencial para que pueda preparar mejor tu cita.\n\n¿Cómo te llamas? (nombre y apellidos)`
      )
    );
  }

  // --- name ---
  if (session.phase === "name") {
    const name = rawText.replace(/\*/g, "").trim();
    // Only reject the WhatsApp invite prefill — NOT real names.
    // extractInviteCodeFromWhatsAppText matches any 6+ letter token (e.g. "Sergio").
    const looksLikeInvitePrefill =
      /^hola,?\s*quiero hacer la consulta previa/i.test(name) ||
      (/consulta previa/i.test(name) && /c[oó]digo\s*:/i.test(name)) ||
      (session.invite_code != null &&
        normalizeInviteCode(name) === normalizeInviteCode(session.invite_code));
    if (looksLikeInvitePrefill) {
      return replies(
        text(
          "Ese mensaje es el enlace de entrada, no tu nombre.\n\n¿Cómo te llamas? (nombre y apellidos)"
        )
      );
    }
    if (name.length < 2 || name.length > 80) {
      return replies(text("Escribe tu nombre (al menos 2 letras)."));
    }
    if (!session.physio_id) {
      return replies(text("Falta el vínculo con el fisioterapeuta. Envía el código otra vez."));
    }

    const guest = await createWhatsAppGuestPatient(admin, {
      physioId: session.physio_id,
      clinicId: session.clinic_id,
      displayName: name,
      phoneE164: phone,
    });
    if ("error" in guest) {
      return replies(text(guest.error));
    }

    session =
      (await mergeSessionState(
        admin,
        session,
        {
          displayName: name,
          guestEmail: guest.email,
          guestPassword: guest.password,
        },
        { phase: "intake", patient_id: guest.patientId }
      )) ?? session;

    const welcome = guest.reused
      ? `Hola de nuevo, ${name}. Continuamos en tu historial de paciente.\n\nCuéntame qué te molesta ahora: dónde duele, cuándo empezó y cómo te afecta.`
      : `Gracias, ${name}.\n\nCuéntame qué te molesta: dónde duele, cuándo empezó y cómo te afecta.`;

    return replies(text(welcome));
  }

  // --- intake ---
  if (session.phase === "intake") {
    if (rawText.length < 8) {
      return replies(
        text("Cuéntame un poco más (zona, cuándo empezó y cómo te afecta).")
      );
    }
    const part = resolveQuestionnairePart(rawText);
    const driver = getPartDriver(part);
    const answers = prefillsWhatsAppSkippedAnswers(driver.defaultAnswers());
    const bodyArea = bodyAreaLabelFromText(rawText) || part;
    session =
      (await mergeSessionState(
        admin,
        session,
        {
          intakeText: rawText,
          questionnairePart: part,
          answers,
          bodyArea,
          currentQuestionId: null,
        },
        { phase: "questionnaire" }
      )) ?? session;

    const q = nextUnansweredQuestion(part, answers);
    if (!q) {
      const symptomContext = driver.format(answers, rawText);
      const started = await startFunctionalPhase(
        admin,
        session,
        symptomContext,
        bodyArea
      );
      return started.out;
    }
    session =
      (await mergeSessionState(admin, session, {
        currentQuestionId: q.id,
      })) ?? session;
    return replies(
      text("Vamos con unas preguntas cortas para completar el informe."),
      questionToOutbound(q)
    );
  }

  // --- questionnaire ---
  if (session.phase === "questionnaire") {
    const part = session.state.questionnairePart || "generic";
    const driver = getPartDriver(part);
    let answers = { ...(session.state.answers ?? driver.defaultAnswers()) };
    const currentId = session.state.currentQuestionId;
    const current =
      (currentId &&
        driver.getVisible(answers).find((q) => q.id === currentId)) ||
      nextUnansweredQuestion(part, answers);

    if (!current) {
      const symptomContext = driver.format(
        answers,
        session.state.intakeText || ""
      );
      const started = await startFunctionalPhase(
        admin,
        session,
        symptomContext,
        session.state.bodyArea || part
      );
      return started.out;
    }

    answers = applyAnswer(answers, current, buttonReply || rawText);
    const nextQ = nextUnansweredQuestion(part, answers);
    if (!nextQ) {
      const symptomContext = driver.format(
        answers,
        session.state.intakeText || ""
      );
      session =
        (await mergeSessionState(admin, session, {
          answers,
          currentQuestionId: null,
          symptomContext,
        })) ?? session;
      const started = await startFunctionalPhase(
        admin,
        session,
        symptomContext,
        session.state.bodyArea || part
      );
      return started.out;
    }

    session =
      (await mergeSessionState(admin, session, {
        answers,
        currentQuestionId: nextQ.id,
      })) ?? session;
    return replies(questionToOutbound(nextQ));
  }

  // --- functional ---
  if (session.phase === "functional") {
    const tests = session.state.functionalTests ?? [];
    const idx = session.state.functionalIndex ?? 0;
    const answers = { ...(session.state.functionalAnswers ?? {}) };
    const current = tests[idx];
    if (!current) {
      return finishReport(admin, session);
    }

    const ynRaw = (inbound.buttonId?.startsWith("fn:")
      ? inbound.buttonId.slice(3)
      : buttonReply || rawText
    ).trim();
    const normalized = /^s[ií]|yes|true|1$/i.test(ynRaw)
      ? "si"
      : /^no|false|0$/i.test(ynRaw)
        ? "no"
        : null;
    if (!normalized) {
      return replies({
        type: "buttons",
        text: `Prueba ${idx + 1}/${tests.length}:\n${current.prompt}\n\nResponde Sí o No.`,
        buttons: [
          { id: "fn:si", title: "Sí" },
          { id: "fn:no", title: "No" },
        ],
      });
    }

    answers[current.n] = normalized;
    const nextIdx = idx + 1;
    if (nextIdx >= tests.length) {
      session =
        (await mergeSessionState(admin, session, {
          functionalAnswers: answers,
          functionalIndex: nextIdx,
        })) ?? session;
      return finishReport(admin, session);
    }

    const nextTest = tests[nextIdx];
    session =
      (await mergeSessionState(admin, session, {
        functionalAnswers: answers,
        functionalIndex: nextIdx,
      })) ?? session;
    return replies({
      type: "buttons",
      text: `Prueba ${nextIdx + 1}/${tests.length}:\n${nextTest.prompt}`,
      buttons: [
        { id: "fn:si", title: "Sí" },
        { id: "fn:no", title: "No" },
      ],
    });
  }

  return replies(
    text("Escribe *hola* para empezar o envía el código de tu fisioterapeuta.")
  );
}

async function finishReport(
  admin: SupabaseClient,
  session: WhatsAppConsultSession
): Promise<WhatsAppOutbound[]> {
  const result = await completeWhatsAppPhysioReport(admin, session);
  if (!result.ok) {
    return replies(
      text(
        result.error ||
          "No pude generar el informe ahora. Tu fisioterapeuta puede pedirte repetir la consulta."
      )
    );
  }
  const who = physioDisplayName(session.state.physioName, "es");
  return replies(
    text(
      `¡Gracias por tu tiempo!\n\n${who} ya tiene el informe de tu consulta previa en AIKinora y podrá prepararse mejor para tu tratamiento.\n\nAIKinora es orientación: no sustituye una valoración presencial.`
    )
  );
}
