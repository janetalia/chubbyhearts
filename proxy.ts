import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = [
  "/home",
  "/create-card",
  "/edit-card",
  "/my-foster-family",
  "/account",
  "/add",
  "/share",
];

const sessionCookieNames = [
  "authjs.session-token",
  "__Secure-authjs.session-token",
  "next-auth.session-token",
  "__Secure-next-auth.session-token",
];

function hasSessionCookie(request: NextRequest) {
  return request.cookies.getAll().some(({ name }) =>
    sessionCookieNames.some((cookieName) => {
      if (name === cookieName) return true;
      if (!name.startsWith(`${cookieName}.`)) return false;

      return /^\d+$/.test(name.slice(cookieName.length + 1));
    }),
  );
}

export function proxy(request: NextRequest) {
  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route),
  );

  if (!isProtectedRoute || hasSessionCookie(request)) {
    return NextResponse.next();
  }

  const signInUrl = new URL("/signin", request.url);
  signInUrl.searchParams.set(
    "callbackUrl",
    `${request.nextUrl.pathname}${request.nextUrl.search}`,
  );

  return NextResponse.redirect(signInUrl);
}

export const config = {
  matcher: [
    "/home/:path*",
    "/create-card/:path*",
    "/edit-card/:path*",
    "/my-foster-family/:path*",
    "/account/:path*",
    "/add/:path*",
    "/share/:path*",
  ],
};
