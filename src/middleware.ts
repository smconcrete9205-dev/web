import { NextResponse, type NextRequest } from "next/server";
import {
  SESSION_COOKIE_NAME,
  SUPERADMIN_COOKIE_NAME,
  superSecret,
  verifySessionToken,
} from "@/lib/session";

export async function middleware(request: NextRequest) {
  const secret = process.env.SESSION_SECRET;
  const { pathname } = request.nextUrl;
  const isSuper = pathname.startsWith("/superadmin");

  const token = request.cookies.get(isSuper ? SUPERADMIN_COOKIE_NAME : SESSION_COOKIE_NAME)?.value;
  const isValid = secret
    ? await verifySessionToken(token, isSuper ? superSecret(secret) : secret)
    : false;

  if (!isValid) {
    const loginUrl = new URL(isSuper ? "/superadmin/login" : "/admin/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin",
    "/admin/((?!login).*)",
    "/api/admin/:path*",
    "/superadmin",
    "/superadmin/((?!login).*)",
  ],
};
