import OpenAI from "openai";

/** Create the client inside request handlers — constructing at import time
 *  fails `next build` on Vercel projects without OPENAI_API_KEY. */
export function getOpenAI(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured");
  }
  return new OpenAI({ apiKey });
}
