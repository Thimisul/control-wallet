import { NextRequest, NextResponse } from "next/server";

export function middleware(request : NextRequest) {
  const isProduction = process.env.NODE_ENV === "production";

  const cookieName = isProduction
    ? "__Secure-authjs.session-token"
    : "authjs.session-token";

  const token = request.cookies.get(cookieName);

  if (request.nextUrl.pathname.startsWith("/user/login") && token) {
    return NextResponse.redirect(new URL("/app/user", request.url));
  }

  if (request.nextUrl.pathname.startsWith("/app") && !token) {
    return NextResponse.redirect(new URL("/user/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/app/:path*", "/user/login"],
};