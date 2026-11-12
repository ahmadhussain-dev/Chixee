import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// Runs before every API call and admin page:
// - gives each request an id (x-request-id) that the API logs and returns, so a customer's error can be traced;
// - keeps signed-out visitors and non-admin accounts out of /admin and /api/admin before any page or database work.
//   Each admin route still checks the role itself (lib/api.js route({ auth: "admin" })), so this is a second lock.
export async function proxy(req) {
  const headers = new Headers(req.headers);
  const requestId = headers.get("x-request-id") || crypto.randomUUID();
  headers.set("x-request-id", requestId);
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const isApi = pathname.startsWith("/api/");
    if (!token) {
      if (isApi) return NextResponse.json({ error: "Please sign in." }, { status: 401, headers: { "x-request-id": requestId } });
      const login = new URL("/login", req.url);
      login.searchParams.set("next", pathname);
      return NextResponse.redirect(login);
    }
    if (token.role !== "admin" && isApi) {
      return NextResponse.json({ error: "Admins only." }, { status: 403, headers: { "x-request-id": requestId } });
    }
    // A signed-in customer opening /admin sees the friendly "Admins only" page from app/admin/layout.js.
  }

  const res = NextResponse.next({ request: { headers } });
  res.headers.set("x-request-id", requestId);
  return res;
}

export const config = {
  matcher: ["/api/:path*", "/admin/:path*", "/admin"],
};
