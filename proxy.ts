import { auth } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

const USER_HOME = "/dashboard";
const ADMIN_HOME = "/admin";
const LOGIN_ROUTE = "/auth/login";

function getHomeForRole(role?: string) {
  return role === "admin" ? ADMIN_HOME : USER_HOME;
}

export const proxy = auth((req) => {
  const { nextUrl } = req;
  const { pathname } = nextUrl;
  const session = req.auth;
  const role = session?.user?.role;

  if (pathname === LOGIN_ROUTE) {
    if (!session?.user) {
      return NextResponse.next();
    }

    return NextResponse.redirect(new URL(getHomeForRole(role), nextUrl));
  }

  if (!session?.user) {
    const loginUrl = new URL(LOGIN_ROUTE, nextUrl);
    loginUrl.searchParams.set("callbackUrl", nextUrl.href);
    return NextResponse.redirect(loginUrl);
  }

  const isAdminRoute = pathname.startsWith(ADMIN_HOME);
  const isDashboardRoute = pathname.startsWith(USER_HOME);

  if (role === "admin" && isDashboardRoute) {
    return NextResponse.redirect(new URL(ADMIN_HOME, nextUrl));
  }

  if (role !== "admin" && isAdminRoute) {
    return NextResponse.redirect(new URL(USER_HOME, nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/auth/login", "/dashboard/:path*", "/admin/:path*"],
};
