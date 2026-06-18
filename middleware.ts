import { NextRequest, NextResponse } from "next/server";

const authSessionCookie = "fvn_auth_session";
const publicRoutes = new Set(["/login", "/register", "/forgot-password", "/privacy", "/terms"]);

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = Boolean(request.cookies.get(authSessionCookie)?.value);
  const isPublicRoute = publicRoutes.has(pathname);

  if (isPublicRoute && hasSession && pathname !== "/privacy" && pathname !== "/terms") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (!isPublicRoute && !hasSession) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"]
};
