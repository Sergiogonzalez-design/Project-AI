import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import {
  getSupabasePublishableKey,
  getSupabaseUrl,
  isSupabaseConfigured,
} from "@/lib/supabase/env";
import { isAdminEmail } from "@/lib/admin-auth";
import {
  ATHLETE_PROFILE_COLUMNS,
  isAthleteProfileComplete,
} from "@/lib/athlete-profile-complete";

export async function middleware(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.next();
  }

  let supabaseResponse = NextResponse.next({
    request,
  });

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
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const search = request.nextUrl.search;

  const isPublic =
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname.startsWith("/auth/") ||
    pathname === "/api/supabase-health" ||
    pathname.startsWith("/api/admin/");

  if (!user && !isPublic) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  const isAdminUser = isAdminEmail(user?.email);

  if (user && (pathname === "/login" || pathname === "/signup")) {
    // Same login for everyone — land on the app; admin sees Admin in the nav
    const next = request.nextUrl.searchParams.get("next");
    const safeNext =
      next && next.startsWith("/") && !next.startsWith("//") ? next : null;

    if (isAdminUser) {
      return NextResponse.redirect(
        new URL(safeNext ?? "/consulta", request.url)
      );
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select(ATHLETE_PROFILE_COLUMNS)
      .eq("id", user.id)
      .maybeSingle();

    const destination = safeNext
      ? safeNext
      : isAthleteProfileComplete(profile)
        ? "/consulta"
        : "/onboarding";
    return NextResponse.redirect(new URL(destination, request.url));
  }

  const isAdminPath =
    pathname.startsWith("/admin") && pathname !== "/admin/access-denied";

  // Admin console: only the configured owner email
  if (isAdminPath) {
    if (!user || !isAdminUser) {
      return NextResponse.redirect(new URL("/admin/access-denied", request.url));
    }
    return supabaseResponse;
  }

  if (
    user &&
    pathname !== "/onboarding" &&
    !pathname.startsWith("/auth/") &&
    !isAdminUser
  ) {
    const { data: profile } = await supabase
      .from("profiles")
      .select(ATHLETE_PROFILE_COLUMNS)
      .eq("id", user.id)
      .maybeSingle();

    if (!isAthleteProfileComplete(profile)) {
      return NextResponse.redirect(new URL("/onboarding", request.url));
    }
  }

  if (user && pathname === "/onboarding") {
    if (isAdminUser) {
      return NextResponse.redirect(new URL("/consulta", request.url));
    }
    const { data: profile } = await supabase
      .from("profiles")
      .select(ATHLETE_PROFILE_COLUMNS)
      .eq("id", user.id)
      .maybeSingle();

    if (isAthleteProfileComplete(profile)) {
      return NextResponse.redirect(new URL("/consulta", request.url));
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
