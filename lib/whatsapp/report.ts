import type { SupabaseClient } from "@supabase/supabase-js";
import { formatFunctionalTestAnswers } from "@/lib/functional-test-answers";
import { getSupabaseUrl } from "@/lib/supabase/env";
import { mergeSessionState } from "./sessions";
import type { WhatsAppConsultSession } from "./types";

function anonKey(): string | null {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() ||
    null
  );
}

async function generatePhysioReportText(opts: {
  accessToken: string;
  bodyArea: string;
  description: string;
  symptomContext: string;
  patientSummary: string;
}): Promise<string | null> {
  const key = anonKey();
  if (!key) return null;
  const res = await fetch(`${getSupabaseUrl()}/functions/v1/ai-consult`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${opts.accessToken}`,
      apikey: key,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      mode: "physio_report",
      bodyArea: opts.bodyArea,
      onsetType: "no especificado",
      painLevel: 5,
      hadTrauma: "No especificado",
      description: opts.description,
      symptomContext: opts.symptomContext,
      patientSummary: opts.patientSummary,
      language: "es",
    }),
  });
  if (!res.ok) {
    console.error("[whatsapp] physio_report HTTP", res.status);
    return null;
  }
  const json = (await res.json()) as { answer?: string };
  return json.answer?.trim() || null;
}

/**
 * Generate physio report + insert clinical_reports (same end state as web consulta previa).
 */
export async function completeWhatsAppPhysioReport(
  admin: SupabaseClient,
  session: WhatsAppConsultSession
): Promise<{ ok: boolean; error?: string }> {
  const patientId = session.patient_id;
  const physioId = session.physio_id;
  if (!patientId || !physioId) {
    return { ok: false, error: "Falta el vínculo paciente–fisioterapeuta." };
  }

  const tests = session.state.functionalTests ?? [];
  const fnAnswers = session.state.functionalAnswers ?? {};
  const functionalBlock =
    tests.length > 0
      ? `\n\nResultados de pruebas funcionales reportados por el paciente:\n${formatFunctionalTestAnswers(
          tests,
          fnAnswers
        )}`
      : "";

  const baseContext = session.state.symptomContext ?? "";
  const symptomContext = baseContext + functionalBlock;
  const description = session.state.intakeText ?? "Consulta previa por WhatsApp";
  const bodyArea = session.state.bodyArea ?? "General";
  const patientSummary = [
    session.state.displayName
      ? `Paciente: ${session.state.displayName}`
      : null,
    `Canal: WhatsApp`,
    description,
    symptomContext,
  ]
    .filter(Boolean)
    .join("\n\n");

  // Ensure a conversation exists for the report link
  let conversationId = session.conversation_id;
  if (!conversationId) {
    const { data: conv, error: convErr } = await admin
      .from("conversations")
      .insert({
        user_id: patientId,
        title: `WhatsApp · ${bodyArea}`,
      })
      .select("id")
      .single();
    if (convErr || !conv?.id) {
      console.error("[whatsapp] conversation", convErr?.message);
      return { ok: false, error: "No se pudo crear la conversación." };
    }
    conversationId = conv.id as string;
    await mergeSessionState(admin, session, {}, {
      conversation_id: conversationId,
    });
  }

  // Sign in as guest to call ai-consult (JWT required)
  const email = session.state.guestEmail;
  const password = session.state.guestPassword;
  let accessToken: string | null = null;
  if (email && password && anonKey()) {
    const { createClient } = await import("@supabase/supabase-js");
    const userClient = createClient(getSupabaseUrl(), anonKey()!, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
    const { data: signed, error: signErr } =
      await userClient.auth.signInWithPassword({ email, password });
    if (signErr) {
      console.error("[whatsapp] guest sign-in", signErr.message);
    } else {
      accessToken = signed.session?.access_token ?? null;
    }
  }

  let physioReport: string | null = null;
  if (accessToken) {
    physioReport = await generatePhysioReportText({
      accessToken,
      bodyArea,
      description,
      symptomContext,
      patientSummary,
    });
  }

  if (!physioReport || physioReport.length < 20) {
    physioReport = [
      "INFORME PARA EL FISIOTERAPEUTA (WhatsApp)",
      "",
      `Zona: ${bodyArea}`,
      "",
      "Resumen del paciente:",
      patientSummary,
      "",
      "Nota: informe generado en modo respaldo (IA no disponible). Revisar datos del cuestionario y pruebas funcionales.",
    ].join("\n");
  }

  const { data: reportId, error: insertErr } = await admin
    .from("clinical_reports")
    .insert({
      patient_id: patientId,
      physio_id: physioId,
      conversation_id: conversationId,
      body_area: bodyArea,
      patient_summary: patientSummary,
      physio_report: physioReport,
      status: "new",
    })
    .select("id")
    .single();

  if (insertErr || !reportId) {
    console.error("[whatsapp] clinical_reports insert", insertErr?.message);
    return { ok: false, error: "No se pudo guardar el informe." };
  }

  await mergeSessionState(
    admin,
    session,
    {
      patientSummary,
      symptomContext,
      guestPassword: undefined,
    },
    {
      phase: "complete",
      conversation_id: conversationId,
      completed_at: new Date().toISOString(),
    }
  );

  return { ok: true };
}
