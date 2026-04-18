import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  isAuthRoute,
  isPrivateRoute,
  DEFAULT_LOGIN_REDIRECT,
  DEFAULT_AUTH_REDIRECT,
  hasPermission,
} from "@/config/auth-routes";
import { supabaseServer } from "./supabase/middleware";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();

  // Skip static & next internals
  if (pathname.startsWith("/_next") || pathname.includes(".")) {
    return response;
  }

  // 🔥 VERIFY REAL USER (important)
  const {
    data: { user },
  } = await supabaseServer(request, response).auth.getUser();

  const { data: profile } = await supabaseServer(request, response)
    .from("profiles")
    .select("role")
    .eq("id", user?.id)
    .single();

  const isAuthenticated = !!user;

  // ✅ Logged in → block auth pages
  if (isAuthenticated) {
    if (isAuthRoute(pathname))
      return NextResponse.redirect(
        new URL(DEFAULT_LOGIN_REDIRECT, request.url),
      );

    // if (profile) {
    //   if (!hasPermission(profile.role, pathname)) {
    //     return NextResponse.redirect(
    //       new URL(DEFAULT_LOGIN_REDIRECT, request.url),
    //     );
    //   }
    // }
  }

  // ❌ Not logged in → block private pages
  if (!isAuthenticated && isPrivateRoute(pathname)) {
    const url = new URL(DEFAULT_AUTH_REDIRECT, request.url);
    url.searchParams.set("returnTo", pathname);

    return NextResponse.redirect(url);
  }

  return response;
}
