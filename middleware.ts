import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, getExpectedSessionToken } from "@/lib/adminAuth";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isPublicAdminRoute =
    pathname === "/admin/login" || pathname === "/api/admin/login";
  if (isPublicAdminRoute) return NextResponse.next();

  const expectedToken = await getExpectedSessionToken();
  const cookieToken = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const authorized = !!expectedToken && cookieToken === expectedToken;

  if (authorized) return NextResponse.next();

  if (pathname.startsWith("/api/admin")) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const loginUrl = new URL("/admin/login", req.url);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
