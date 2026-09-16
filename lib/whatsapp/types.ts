export type WhatsAppPhase =
  | "idle"
  | "awaiting_code"
  | "name"
  | "intake"
  | "questionnaire"
  | "functional"
  | "complete";

export type WhatsAppSessionState = {
  displayName?: string;
  intakeText?: string;
  bodyArea?: string;
  questionnairePart?: string;
  answers?: Record<string, unknown>;
  currentQuestionId?: string | null;
  symptomContext?: string;
  redFlagsUrgent?: boolean;
  functionalTests?: { n: number; prompt: string }[];
  functionalAnswers?: Record<number, "si" | "no">;
  functionalIndex?: number;
  physioName?: string | null;
  clinicName?: string | null;
  patientSummary?: string;
  /** Server-only: guest credentials for ai-consult JWT (never sent to WhatsApp). */
  guestEmail?: string;
  guestPassword?: string;
};

export type WhatsAppConsultSession = {
  id: string;
  phone_e164: string;
  invite_code: string | null;
  physio_id: string | null;
  clinic_id: string | null;
  patient_id: string | null;
  conversation_id: string | null;
  phase: WhatsAppPhase;
  state: WhatsAppSessionState;
  last_wa_message_id: string | null;
  completed_at: string | null;
};

export type WhatsAppOutbound =
  | { type: "text"; text: string }
  | {
      type: "buttons";
      text: string;
      buttons: { id: string; title: string }[];
    }
  | {
      type: "list";
      text: string;
      buttonLabel: string;
      sections: {
        title: string;
        rows: { id: string; title: string; description?: string }[];
      }[];
    };

export type WhatsAppInbound = {
  phoneE164: string;
  text: string;
  buttonId?: string | null;
  messageId?: string | null;
  profileName?: string | null;
};
