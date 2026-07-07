import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { extractPageTitle, htmlToText } from "@/lib/html-to-text";
import { getSupabasePublishableKey, getSupabaseUrl } from "@/lib/supabase/env";
import { fetchUrlHtml, parsePublicHttpUrl } from "@/lib/url-fetch";

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      getSupabaseUrl(),
      getSupabasePublishableKey(),
      {
        cookies: {
          getAll: () => cookieStore.getAll(),
          setAll: (toSet) =>
            toSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            ),
        },
      }
    );

    const admin = await requireAdmin(supabase);
    if (!admin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json() as { url?: string };
    if (!body.url?.trim()) {
      return NextResponse.json({ error: "Falta la URL." }, { status: 400 });
    }

    const parsed = parsePublicHttpUrl(body.url);
    const html = await fetchUrlHtml(parsed);
    const text = htmlToText(html);

    if (text.length < 80) {
      return NextResponse.json(
        {
          error:
            "Se extrajo muy poco texto. La página puede estar protegida, requerir login o cargar el contenido con JavaScript. Prueba pegar el texto manualmente.",
        },
        { status: 422 }
      );
    }

    const title = extractPageTitle(html);
    const sourceName = title ? `${title} — ${parsed.hostname}` : parsed.toString();

    return NextResponse.json({
      text,
      sourceName,
      url: parsed.toString(),
      charCount: text.length,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
