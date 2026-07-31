import { supabase } from "./supabase";
import {
  SUPABASE_PROJECT_URL,
  SUPABASE_PUBLISHABLE_KEY,
} from "./supabase-config";

const EDGE_URL = `${SUPABASE_PROJECT_URL}/functions/v1/ai-consult`;

async function edgeHeaders(): Promise<Record<string, string>> {
  const { data } = await supabase.auth.getSession();
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${data.session?.access_token ?? ""}`,
    apikey: SUPABASE_PUBLISHABLE_KEY,
  };
}

export async function callEdgeText(
  body: Record<string, unknown>
): Promise<string> {
  const res = await fetch(EDGE_URL, {
    method: "POST",
    headers: await edgeHeaders(),
    body: JSON.stringify(body),
  });
  const data = (await res.json()) as { answer?: string; error?: string };
  if (!res.ok || data.error) {
    throw new Error(data.error ?? "Error de red");
  }
  if (typeof data.answer !== "string") {
    throw new Error("Respuesta inválida del servidor");
  }
  return data.answer;
}

export async function callEdgeJson(
  body: Record<string, unknown>
): Promise<unknown> {
  const res = await fetch(EDGE_URL, {
    method: "POST",
    headers: await edgeHeaders(),
    body: JSON.stringify(body),
  });
  const data = (await res.json()) as Record<string, unknown>;
  if (!res.ok) {
    throw new Error(
      typeof data.error === "string" ? data.error : "Error de red"
    );
  }
  if (typeof data.error === "string") {
    throw new Error(data.error);
  }
  return data;
}
