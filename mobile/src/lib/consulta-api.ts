import { supabase } from "./supabase";

/**
 * Call ai-consult via the Supabase client so Auth JWT refresh is handled.
 * Raw fetch + getSession() often sent expired/empty tokens on TestFlight.
 */
async function invokeAiConsult(
  body: Record<string, unknown>,
  extras?: Record<string, unknown>
): Promise<Record<string, unknown>> {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session?.access_token) {
    const { data: refreshed, error: refreshError } =
      await supabase.auth.refreshSession();
    if (refreshError || !refreshed.session?.access_token) {
      throw new Error("Sesión expirada. Vuelve a iniciar sesión.");
    }
  }

  const { data, error } = await supabase.functions.invoke("ai-consult", {
    body: { ...(extras ?? {}), ...body },
  });

  if (error) {
    // Prefer server JSON error body when present (e.g. 403 clinic message).
    const ctx = (error as { context?: Response }).context;
    if (ctx && typeof ctx.json === "function") {
      try {
        const payload = (await ctx.json()) as { error?: string };
        if (typeof payload?.error === "string" && payload.error.trim()) {
          throw new Error(payload.error);
        }
      } catch (inner) {
        if (inner instanceof Error && inner.message !== error.message) {
          throw inner;
        }
      }
    }
    throw new Error(error.message || "Error de red");
  }

  if (!data || typeof data !== "object") {
    throw new Error("Respuesta inválida del servidor");
  }
  const payload = data as Record<string, unknown>;
  if (typeof payload.error === "string") {
    throw new Error(payload.error);
  }
  return payload;
}

export async function callEdgeText(
  body: Record<string, unknown>,
  extras?: Record<string, unknown>
): Promise<string> {
  const data = await invokeAiConsult(body, extras);
  if (typeof data.answer !== "string") {
    throw new Error("Respuesta inválida del servidor");
  }
  return data.answer;
}

export async function callEdgeJson(
  body: Record<string, unknown>,
  extras?: Record<string, unknown>
): Promise<unknown> {
  return invokeAiConsult(body, extras);
}
