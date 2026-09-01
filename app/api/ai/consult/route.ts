import { NextResponse } from "next/server";

/** Deprecated — all clients must use Supabase Edge `ai-consult`. */
export async function POST() {
  return NextResponse.json(
    {
      error:
        "Este endpoint está retirado. Usa la función edge ai-consult con JWT de Supabase.",
    },
    { status: 410 }
  );
}
