import type { SupabaseClient } from "@supabase/supabase-js";
import {
  splitFunctionalTests,
  type FunctionalTestItem,
} from "@/lib/functional-test-answers";
import { filterPatientSafeFunctionalTests } from "@/lib/patient-safe-functional-tests";
import {
  FUNCTIONAL_TEST_QUESTIONS,
  resolveFunctionalRegion,
} from "@/lib/consulta-functional-tests";
import {
  extractInviteCodeFromWhatsAppText,
  isWhatsAppInvitePrefill,
} from "@/lib/physio-invite";
import { bodyAreaLabelFromText } from "@/lib/consulta-triage";
import {
  buildWhatsAppAlreadyComplete,
  buildWhatsAppAskNameAgain,
  buildWhatsAppComplete,
  buildWhatsAppIntakeMore,
  buildWhatsAppIntakePrompt,
  buildWhatsAppNameWelcome,
  buildWhatsAppNeedCode,
  buildWhatsAppQuestionnaireIntro,
  buildWhatsAppRestartWithoutCode,
} from "./copy";
import {
  createWhatsAppGuestPatient,
  resolveBindingForPhone,
  resolveInviteCode,
  type ResolvedInvite,
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

  if (!first) {
    return { session: updated, out: [] };
  }
  return {
    session: updated,
    out: [
      {
        type: "buttons",
        text: `Prueba 1/${tests.length}:\n${first.prompt}`,
        buttons: [
          { id: "fn:si", title: "Sí" },
          { id: "fn:no", title: "No" },
        ],
      },
    ],
  };
}

async function attachBindingAndWelcome(
  admin: SupabaseClient,
  session: WhatsAppConsultSession,
  resolved: ResolvedInvite
): Promise<{ session: WhatsAppConsultSession; out: WhatsAppOutbound[] }> {
  const updated =
    (await mergeSessionState(
      admin,
      session,
      {
        physioName: resolved.physioName,
        clinicName: resolved.clinicName,
      },
      {
        phase: "name",
        invite_code: resolved.inviteCode || session.invite_code,
        physio_id: resolved.physioId,
        clinic_id: resolved.clinicId,
      }
    )) ?? session;

  return {
    session: updated,
    out: replies(
      text(
        buildWhatsAppNameWelcome({
          physioName: resolved.physioName,
          clinicName: resolved.clinicName,
        })
      )
    ),
  };
}

async function attachInviteAndWelcome(
  admin: SupabaseClient,
  session: WhatsAppConsultSession,
  code: string
): Promise<{ session: WhatsAppConsultSession; out: WhatsAppOutbound[] } | { error: string }> {
  const resolved = await resolveInviteCode(admin, code);
  if ("error" in resolved) return { error: resolved.error };
  return attachBindingAndWelcome(admin, session, resolved);
}

async function attachRememberedOrAskCode(
  admin: SupabaseClient,
  session: WhatsAppConsultSession,
  phone: string,
  fallback: string
): Promise<WhatsAppOutbound[]> {
  const remembered = await resolveBindingForPhone(admin, phone);
  if (remembered) {
    const started = await attachBindingAndWelcome(admin, session, remembered);
    return started.out;
  }
  return replies(text(fallback));
}

function resumeCurrentPrompt(
  session: WhatsAppConsultSession
): WhatsAppOutbound[] {
  if (session.phase === "name") {
    return replies(
      text(
        buildWhatsAppNameWelcome({
          physioName: session.state.physioName,
          clinicName: session.state.clinicName,
        })
      )
    );
  }
  if (session.phase === "intake") {
    return replies(
      text(buildWhatsAppIntakePrompt(session.state.displayName || "de nuevo"))
    );
  }
  if (session.phase === "questionnaire") {
    const part = session.state.questionnairePart || "generic";
    const answers = session.state.answers ?? {};
    const q =
      (session.state.currentQuestionId &&
        getPartDriver(part)
          .getVisible(answers)
          .find((item) => item.id === session.state.currentQuestionId)) ||
      nextUnansweredQuestion(part, answers);
    return q
      ? replies(questionToOutbound(q))
      : replies(text(buildWhatsAppIntakeMore()));
  }
  if (session.phase === "functional") {
    const tests = session.state.functionalTests ?? [];
    const idx = session.state.functionalIndex ?? 0;
    const current = tests[idx];
    if (!current) {
      return replies(text(buildWhatsAppAlreadyComplete()));
    }
    return replies({
      type: "buttons",
      text: `Prueba ${idx + 1}/${tests.length}:\n${current.prompt}`,
      buttons: [
        { id: "fn:si", title: "Sí" },
        { id: "fn:no", title: "No" },
      ],
    });
  }
  return replies(text(buildWhatsAppNeedCode()));
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

  const invitePrefill = isWhatsAppInvitePrefill(rawText, session.invite_code);
  const incomingCode = extractInviteCodeFromWhatsAppText(rawText);

  // Restart: keep the same fisio/clinic from the invite link when possible.
  // Do not treat a body-area word ("hombro") as a new invite code.
  const wantsRestart = /^(hola|hi|hello|reiniciar|empezar|start|reset)$/i.test(
    rawText
  );
  if (
    (wantsRestart || invitePrefill) &&
    session.phase !== "idle" &&
    session.phase !== "awaiting_code" &&
    session.phase !== "name"
  ) {
    const prevCode = incomingCode || session.invite_code;
    if (!session.completed_at) {
      await mergeSessionState(
        admin,
        session,
        {},
        { phase: "complete", completed_at: new Date().toISOString() }
      );
    }
    session = (await createSession(admin, phone, { phase: "idle" })) ?? session;
    if (prevCode) {
      const started = await attachInviteAndWelcome(admin, session, prevCode);
      if ("error" in started) return replies(text(started.error));
      return started.out;
    }
    return attachRememberedOrAskCode(
      admin,
      session,
      phone,
      buildWhatsAppRestartWithoutCode()
    );
  }

  if (session.phase === "complete") {
    return replies(text(buildWhatsAppAlreadyComplete()));
  }

  // --- idle / awaiting_code ---
  if (session.phase === "idle" || session.phase === "awaiting_code") {
    const code = incomingCode || session.invite_code || "";
    if (code) {
      const started = await attachInviteAndWelcome(admin, session, code);
      if ("error" in started) return replies(text(started.error));
      return started.out;
    }

    session =
      (await mergeSessionState(admin, session, {}, { phase: "awaiting_code" })) ??
      session;
    return attachRememberedOrAskCode(
      admin,
      session,
      phone,
      buildWhatsAppNeedCode()
    );
  }

  // --- name ---
  if (session.phase === "name") {
    if (invitePrefill || wantsRestart) {
      return replies(
        text(
          buildWhatsAppNameWelcome({
            physioName: session.state.physioName,
            clinicName: session.state.clinicName,
          })
        )
      );
    }
    const name = rawText.replace(/\*/g, "").trim();
    if (name.length < 2 || name.length > 80) {
      return replies(text(buildWhatsAppAskNameAgain()));
    }
    if (!session.physio_id) {
      return replies(text(buildWhatsAppNeedCode()));
    }

    const guest = await createWhatsAppGuestPatient(admin, {
      physioId: session.physio_id,
      clinicId: session.clinic_id,
      clinicName: session.state.clinicName,
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

    return replies(text(buildWhatsAppIntakePrompt(name, guest.reused)));
  }

  // --- intake ---
  if (session.phase === "intake") {
    if (invitePrefill) {
      return resumeCurrentPrompt(session);
    }
    const part = resolveQuestionnairePart(rawText);
    if (rawText.length < 3 || (rawText.length < 6 && part === "generic")) {
      return replies(text(buildWhatsAppIntakeMore()));
    }
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
      text(buildWhatsAppQuestionnaireIntro()),
      questionToOutbound(q)
    );
  }

  // --- questionnaire ---
  if (session.phase === "questionnaire") {
    if (invitePrefill) {
      return resumeCurrentPrompt(session);
    }
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

  return replies(text(buildWhatsAppNeedCode()));
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
  return replies(text(buildWhatsAppComplete(session.state.physioName)));
}
