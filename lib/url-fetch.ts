const MAX_BYTES = 2 * 1024 * 1024;
const FETCH_TIMEOUT_MS = 20_000;

function isBlockedHost(hostname: string): boolean {
  const h = hostname.toLowerCase();
  if (h === "localhost" || h.endsWith(".localhost")) return true;
  if (h === "127.0.0.1" || h === "::1") return true;
  if (h.startsWith("10.")) return true;
  if (h.startsWith("192.168.")) return true;
  if (/^172\.(1[6-9]|2\d|3[01])\./.test(h)) return true;
  return false;
}

export function parsePublicHttpUrl(raw: string): URL {
  let url: URL;
  try {
    url = new URL(raw.trim());
  } catch {
    throw new Error("URL no válida.");
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("Solo se permiten enlaces http o https.");
  }

  if (isBlockedHost(url.hostname)) {
    throw new Error("No se pueden importar URLs locales o privadas.");
  }

  return url;
}

export async function fetchUrlHtml(url: URL): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const res = await fetch(url.toString(), {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "PhysioGuideBot/1.0 (+https://project-ai-swart.vercel.app; knowledge ingestion)",
        Accept: "text/html,application/xhtml+xml;q=0.9,*/*;q=0.8",
      },
      redirect: "follow",
    });

    if (!res.ok) {
      throw new Error(`No se pudo descargar la página (${res.status}).`);
    }

    const contentType = res.headers.get("content-type") ?? "";
    if (
      !contentType.includes("text/html") &&
      !contentType.includes("application/xhtml")
    ) {
      throw new Error(
        "La URL no devolvió HTML. Prueba con una página web o pega el texto manualmente."
      );
    }

    const reader = res.body?.getReader();
    if (!reader) throw new Error("No se pudo leer la respuesta.");

    const chunks: Uint8Array[] = [];
    let total = 0;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (!value) continue;
      total += value.length;
      if (total > MAX_BYTES) {
        throw new Error("La página es demasiado grande (máx. 2 MB).");
      }
      chunks.push(value);
    }

    const buffer = new Uint8Array(total);
    let offset = 0;
    for (const chunk of chunks) {
      buffer.set(chunk, offset);
      offset += chunk.length;
    }

    return new TextDecoder("utf-8", { fatal: false }).decode(buffer);
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      throw new Error("La descarga tardó demasiado.");
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}
