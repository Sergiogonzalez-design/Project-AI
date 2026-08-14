import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { PATIENT_MODE_COOKIE } from "@/lib/physio-invite";
import {
  getSupabasePublishableKey,
  getSupabaseUrl,
  isSupabaseConfigured,
} from "@/lib/supabase/env";

function isAuthCookieName(name: string) {
  return (
    name.startsWith("sb-") ||
    name.includes("supabase") ||
    name === PATIENT_MODE_COOKIE
  );
}

function clearAuthCookies(response: NextResponse, request: NextRequest) {
  for (const { name } of request.cookies.getAll()) {
    if (!isAuthCookieName(name)) continue;
    response.cookies.set(name, "", { path: "/", maxAge: 0 });
  }
  response.cookies.set(PATIENT_MODE_COOKIE, "", { path: "/", maxAge: 0 });
}

/** Always lands on /login, even if the Auth API is slow or cookies are stuck. */
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const loginUrl = new URL("/login", request.url);
  loginUrl.search = "";
  let response = NextResponse.redirect(loginUrl, { status: 302 });

  if (!isSupabaseConfigured()) {
    clearAuthCookies(response, request);
    response.headers.set("Cache-Control", "no-store");
    return response;
  }

  const supabase = createServerClient(
    getSupabaseUrl(),
    getSupabasePublishableKey(),
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.redirect(loginUrl, { status: 302 });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  await Promise.race([
    supabase.auth.signOut(),
    new Promise<void>((resolve) => setTimeout(resolve, 2000)),
  ]);

  clearAuthCookies(response, request);
  response.headers.set("Cache-Control", "no-store");
  return response;
}
