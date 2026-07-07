"use client";

const BATCH_SIZE = 10;
const BATCH_PAUSE_MS = 3000;

export async function uploadChunksToKnowledgeBase(
  chunks: string[],
  sourceName: string,
  onProgress?: (label: string) => void
): Promise<number> {
  let totalInserted = 0;

  for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
    const batchChunks = chunks.slice(i, i + BATCH_SIZE);
    onProgress?.(
      `Generando embeddings (${Math.min(i + BATCH_SIZE, chunks.length)}/${chunks.length})…`
    );

    const res = await fetch("/api/documents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chunks: batchChunks, sourceName }),
    });

    if (!res.ok) {
      let errMsg = res.statusText;
      try {
        errMsg = ((await res.json()) as { error: string }).error ?? errMsg;
      } catch {
        /* empty */
      }
      throw new Error(errMsg);
    }

    const data = (await res.json()) as { inserted: number };
    totalInserted += data.inserted;

    if (i + BATCH_SIZE < chunks.length) {
      await new Promise((r) => setTimeout(r, BATCH_PAUSE_MS));
    }
  }

  return totalInserted;
}
