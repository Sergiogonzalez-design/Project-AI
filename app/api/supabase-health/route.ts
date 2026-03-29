import { NextResponse } from "next/server";
import { getSupabasePublishableKey, getSupabaseUrl } from "@/lib/supabase/env";

/** GET /api/supabase-health — verifies env + API key against Supabase (no DB tables required). */
export async function GET() {
  let url: string;
  let key: string;
  try {
    url = getSupabaseUrl();
    key = getSupabasePublishableKey();
  } catch (e) {
    const message = e instanceof Error ? e.message : "Missing env";
    return NextResponse.json(
      {
        connected: false,
        reason: "env",
        message,
        hint: "Copy .env.example to .env.local and set NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.",
      },
      { status: 503 }
    );
  }

  const res = await fetch(`${url}/auth/v1/health`, {
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
    },
  });

  const text = await res.text();
  let body: unknown = text;
  try {
    body = JSON.parse(text);
  } catch {
    // keep raw text
  }

  if (!res.ok) {
    return NextResponse.json(
      {
        connected: false,
        reason: "supabase_rejected",
        status: res.status,
        supabaseUrl: url,
        keyLength: key.length,
        response: body,
      },
      { status: 502 }
    );
  }

  return NextResponse.json({
    connected: true,
    supabaseUrl: url,
    authHealthStatus: res.status,
    authHealth: body,
  });
}
