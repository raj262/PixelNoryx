import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const COOKIE = "pn_admin_session";

function secretKey() {
  const secret = process.env.ADMIN_SESSION_SECRET?.trim();
  if (!secret) return null;
  return new TextEncoder().encode(secret);
}

function withAdminHeader(res: NextResponse) {
  res.headers.set("x-pixelnoryx-admin", "1");
  return res;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  // Allow login page without session
  if (pathname === "/admin/login") {
    return withAdminHeader(NextResponse.next());
  }

  const token = req.cookies.get(COOKIE)?.value;
  const key = secretKey();

  if (!token || !key) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }

  try {
    const { payload } = await jwtVerify(token, key);
    const role = String(payload.role ?? "");
    if (role !== "ADMIN" && role !== "EDITOR") {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }

    if (pathname.startsWith("/admin/users") && role !== "ADMIN") {
      const url = req.nextUrl.clone();
      url.pathname = "/admin";
      return withAdminHeader(NextResponse.redirect(url));
    }

    return withAdminHeader(NextResponse.next());
  } catch {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};
